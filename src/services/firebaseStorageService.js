import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "./firebase";

function limparParteCaminho(valor) {
  return String(valor || "sem-info")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9-_]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function dataAgoraISO() {
  return new Date().toISOString();
}

function extensaoArquivo(nome = "", tipo = "") {
  const extNome = String(nome).split(".").pop();
  if (extNome && extNome !== nome) return extNome.toLowerCase();

  if (tipo.includes("png")) return "png";
  if (tipo.includes("webp")) return "webp";
  if (tipo.includes("jpeg") || tipo.includes("jpg")) return "jpg";

  return "jpg";
}

export function montarCaminhoEvidenciaStorage({
  usuario,
  inspecaoId,
  icao,
  normaId,
  itemId,
  arquivo,
}) {
  const usuarioSeguro = limparParteCaminho(
    usuario?.email || usuario?.id || usuario?.uid || "usuario"
  );

  const inspecaoSegura = limparParteCaminho(inspecaoId || "temporaria");
  const icaoSeguro = limparParteCaminho(icao || "sem-icao");
  const normaSegura = limparParteCaminho(normaId || "norma");
  const itemSeguro = limparParteCaminho(itemId || "item");

  const extensao = extensaoArquivo(arquivo?.name, arquivo?.type);
  const nomeArquivo = `${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 9)}.${extensao}`;

  return `inspecoes/${usuarioSeguro}/${inspecaoSegura}/${icaoSeguro}/${normaSegura}/${itemSeguro}/${nomeArquivo}`;
}

export async function arquivoParaBase64(arquivo) {
  return await new Promise((resolve, reject) => {
    const leitor = new FileReader();
    leitor.onload = () => resolve(leitor.result);
    leitor.onerror = reject;
    leitor.readAsDataURL(arquivo);
  });
}

export async function enviarEvidenciaParaStorage({
  arquivo,
  usuario,
  inspecaoId,
  icao,
  normaId,
  itemId,
}) {
  if (!arquivo) {
    throw new Error("Arquivo de imagem não informado.");
  }

  const storagePath = montarCaminhoEvidenciaStorage({
    usuario,
    inspecaoId,
    icao,
    normaId,
    itemId,
    arquivo,
  });

  const storageRef = ref(storage, storagePath);

  await uploadBytes(storageRef, arquivo, {
    contentType: arquivo.type || "image/jpeg",
    customMetadata: {
      usuario: usuario?.email || usuario?.id || "",
      inspecaoId: inspecaoId || "",
      icao: icao || "",
      normaId: normaId || "",
      itemId: itemId || "",
      enviadoEm: dataAgoraISO(),
    },
  });

  const downloadURL = await getDownloadURL(storageRef);

  return {
    storagePath,
    downloadURL,
    imagemSalvaOnline: true,
    enviadoEm: dataAgoraISO(),
  };
}

export async function excluirEvidenciaDoStorage(storagePath) {
  if (!storagePath) return false;

  try {
    const storageRef = ref(storage, storagePath);
    await deleteObject(storageRef);
    return true;
  } catch (erro) {
    console.warn("Não foi possível excluir imagem do Storage:", erro);
    return false;
  }
}

export function obterUrlImagemEvidencia(evidencia) {
  return (
    evidencia?.data ||
    evidencia?.previewLocal ||
    evidencia?.downloadURL ||
    evidencia?.url ||
    ""
  );
}
