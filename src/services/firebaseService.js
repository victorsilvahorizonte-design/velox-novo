import { auth, db } from "./firebase";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
} from "firebase/auth";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";

const COLECAO_USUARIOS = "usuarios";
const COLECAO_INSPECOES = "inspecoes";

function normalizarEmailFirebase(email) {
  return String(email || "").trim().toLowerCase();
}

function dataAgoraISO() {
  return new Date().toISOString();
}

function tratarErroFirebase(erro) {
  const codigo = erro?.code || "";

  if (codigo === "auth/email-already-in-use") {
    return "Este e-mail já está cadastrado. Faça login ou use outro e-mail.";
  }

  if (codigo === "auth/invalid-email") {
    return "E-mail inválido. Verifique o endereço digitado.";
  }

  if (codigo === "auth/weak-password") {
    return "Senha fraca. Use uma senha com pelo menos 6 caracteres.";
  }

  if (
    codigo === "auth/user-not-found" ||
    codigo === "auth/wrong-password" ||
    codigo === "auth/invalid-credential"
  ) {
    return "E-mail ou senha inválidos.";
  }

  if (codigo === "auth/too-many-requests") {
    return "Muitas tentativas de login. Aguarde alguns minutos e tente novamente.";
  }

  return erro?.message || "Erro ao comunicar com o Firebase.";
}

export function mensagemErroFirebase(erro) {
  return tratarErroFirebase(erro);
}

export async function criarPerfilAdminMasterSeNecessario(usuarioAuth, dadosAdmin) {
  if (!usuarioAuth?.uid) return null;

  const ref = doc(db, COLECAO_USUARIOS, usuarioAuth.uid);
  const snap = await getDoc(ref);
  const agora = dataAgoraISO();

  const perfilAdmin = {
    id: usuarioAuth.uid,
    uid: usuarioAuth.uid,
    nomeCompleto: dadosAdmin.nomeCompleto,
    email: normalizarEmailFirebase(dadosAdmin.email),
    telefone: dadosAdmin.telefone || "",
    cpf: dadosAdmin.cpf || "",
    ativo: true,
    tipo: "adminMaster",
    adminMaster: true,
    statusCadastro: "aprovado",
    aprovadoEm: snap.exists() ? snap.data()?.aprovadoEm || agora : agora,
    atualizadoEm: agora,
    criadoEm: snap.exists() ? snap.data()?.criadoEm || agora : agora,
  };

  await setDoc(ref, { ...(snap.exists() ? snap.data() : {}), ...perfilAdmin }, { merge: true });
  return perfilAdmin;
}

export async function entrarUsuarioFirebase(email, senha, dadosAdminMaster) {
  const emailNormalizado = normalizarEmailFirebase(email);
  const senhaLimpa = String(senha || "").trim();

  try {
    const credencial = await signInWithEmailAndPassword(auth, emailNormalizado, senhaLimpa);

    if (emailNormalizado === normalizarEmailFirebase(dadosAdminMaster?.email)) {
      return await criarPerfilAdminMasterSeNecessario(credencial.user, dadosAdminMaster);
    }

    const perfil = await buscarUsuarioFirebase(credencial.user.uid);
    if (!perfil) {
      throw new Error("Usuário autenticado, mas sem perfil no Firestore. Contate o administrador.");
    }
    return perfil;
  } catch (erroLogin) {
    const podeCriarAdminInicial =
      emailNormalizado === normalizarEmailFirebase(dadosAdminMaster?.email) &&
      senhaLimpa === String(dadosAdminMaster?.senhaInicial || "").trim();

    if (!podeCriarAdminInicial) {
      throw erroLogin;
    }

    try {
      const credencial = await createUserWithEmailAndPassword(auth, emailNormalizado, senhaLimpa);
      return await criarPerfilAdminMasterSeNecessario(credencial.user, dadosAdminMaster);
    } catch (erroCriacaoAdmin) {
      throw erroLogin?.code === "auth/invalid-credential" ? erroCriacaoAdmin : erroLogin;
    }
  }
}

export async function cadastrarUsuarioFirebase({ nomeCompleto, email, telefone, cpf, senha }) {
  const emailNormalizado = normalizarEmailFirebase(email);
  const credencial = await createUserWithEmailAndPassword(auth, emailNormalizado, String(senha || "").trim());
  const agora = dataAgoraISO();

  const perfil = {
    id: credencial.user.uid,
    uid: credencial.user.uid,
    nomeCompleto: String(nomeCompleto || "").trim(),
    email: emailNormalizado,
    telefone: String(telefone || "").trim(),
    cpf: String(cpf || "").trim(),
    ativo: false,
    tipo: "inspetor",
    adminMaster: false,
    statusCadastro: "pendente",
    criadoEm: agora,
    aprovadoEm: "",
    atualizadoEm: agora,
  };

  await setDoc(doc(db, COLECAO_USUARIOS, credencial.user.uid), perfil);
  await signOut(auth);
  return perfil;
}

export async function buscarUsuarioFirebase(uid) {
  if (!uid) return null;
  const snap = await getDoc(doc(db, COLECAO_USUARIOS, uid));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}

export function observarSessaoFirebase(callback) {
  return onAuthStateChanged(auth, async (usuarioAuth) => {
    if (!usuarioAuth) {
      callback(null);
      return;
    }

    const perfil = await buscarUsuarioFirebase(usuarioAuth.uid);
    callback(perfil ? { id: usuarioAuth.uid, ...perfil } : null);
  });
}

export function observarUsuariosFirebase(callback) {
  return onSnapshot(collection(db, COLECAO_USUARIOS), (snapshot) => {
    const usuarios = snapshot.docs
      .map((documento) => ({ id: documento.id, ...documento.data() }))
      .filter((usuario) => usuario.excluido !== true)
      .sort((a, b) => String(a.nomeCompleto || "").localeCompare(String(b.nomeCompleto || "")));

    callback(usuarios);
  });
}

export function observarInspecoesFirebase(callback) {
  return onSnapshot(collection(db, COLECAO_INSPECOES), (snapshot) => {
    const inspecoes = snapshot.docs
      .map((documento) => ({ id: documento.id, ...documento.data() }))
      .sort((a, b) => String(b.atualizadoEm || "").localeCompare(String(a.atualizadoEm || "")));

    callback(inspecoes);
  });
}

export async function sairFirebase() {
  await signOut(auth);
}

export async function atualizarUsuarioFirebase(usuarioId, dados) {
  await updateDoc(doc(db, COLECAO_USUARIOS, usuarioId), {
    ...dados,
    atualizadoEm: dataAgoraISO(),
  });
}

export async function excluirUsuarioFirebase(usuarioId) {
  // Pelo app web não é possível excluir a conta do Firebase Auth de outro usuário sem backend.
  // Por isso fazemos exclusão lógica no Firestore e bloqueamos o acesso.
  await updateDoc(doc(db, COLECAO_USUARIOS, usuarioId), {
    ativo: false,
    excluido: true,
    statusCadastro: "excluido",
    excluidoEm: dataAgoraISO(),
    atualizadoEm: dataAgoraISO(),
  });
}

export async function enviarResetSenhaFirebase(email) {
  await sendPasswordResetEmail(auth, normalizarEmailFirebase(email));
}

export async function salvarInspecaoFirebase(inspecao) {
  if (!inspecao?.id) throw new Error("Inspeção sem ID.");
  await setDoc(doc(db, COLECAO_INSPECOES, inspecao.id), {
    ...inspecao,
    atualizadoEm: inspecao.atualizadoEm || dataAgoraISO(),
  }, { merge: true });
  return inspecao;
}

export async function excluirInspecaoFirebase(inspecaoId) {
  await deleteDoc(doc(db, COLECAO_INSPECOES, inspecaoId));
}

export async function excluirInspecoesDoUsuarioFirebase(usuarioId) {
  const q = query(collection(db, COLECAO_INSPECOES), where("usuarioId", "==", usuarioId));
  const snapshot = await getDocs(q);
  await Promise.all(snapshot.docs.map((documento) => deleteDoc(documento.ref)));
}
