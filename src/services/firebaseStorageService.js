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

export async function obterDownloadURLPorStoragePath(storagePath) {
  if (!storagePath) return "";
  try {
    const storageRef = ref(storage, storagePath);
    return await getDownloadURL(storageRef);
  } catch (erro) {
    console.warn("Não foi possível recuperar downloadURL pelo storagePath:", erro);
    return "";
  }
}


function base64ParaBlobVelox(dataUrl) {
  try {
    if (!String(dataUrl || "").startsWith("data:")) return null;
    const [cabecalho, conteudo] = String(dataUrl).split(",");
    const mime = cabecalho.match(/data:(.*?);base64/)?.[1] || "image/jpeg";
    const binario = atob(conteudo || "");
    const bytes = new Uint8Array(binario.length);
    for (let i = 0; i < binario.length; i += 1) bytes[i] = binario.charCodeAt(i);
    return new Blob([bytes], { type: mime });
  } catch (erro) {
    console.warn("Não foi possível converter miniatura base64 em Blob:", erro);
    return null;
  }
}

async function enviarMiniaturaParaStorage({ miniaturaBase64, storagePath, contentType = "image/jpeg" }) {
  if (!miniaturaBase64 || !String(miniaturaBase64).startsWith("data:image") || !storagePath) {
    return { miniaturaStoragePath: "", miniaturaDownloadURL: "" };
  }

  const blob = base64ParaBlobVelox(miniaturaBase64);
  if (!blob) return { miniaturaStoragePath: "", miniaturaDownloadURL: "" };

  const ponto = storagePath.lastIndexOf(".");
  const miniaturaStoragePath = ponto >= 0
    ? `${storagePath.slice(0, ponto)}-thumb.jpg`
    : `${storagePath}-thumb.jpg`;

  const miniRef = ref(storage, miniaturaStoragePath);
  await uploadBytes(miniRef, blob, {
    contentType: contentType || "image/jpeg",
    customMetadata: {
      tipo: "miniatura_relatorio_velox",
      criadoEm: dataAgoraISO(),
    },
  });

  const miniaturaDownloadURL = await getDownloadURL(miniRef);
  return { miniaturaStoragePath, miniaturaDownloadURL };
}

export async function enviarEvidenciaParaStorage({
  arquivo,
  usuario,
  inspecaoId,
  icao,
  normaId,
  itemId,
  previewLocal = "",
  miniaturaBase64 = "",
  thumbnailBase64 = "",
  geolocalizacao = null,
  latitude = null,
  longitude = null,
  precisaoGPS = null,
  linkMaps = "",
  responsavel = "",
  origemCaptura = "",
  origemGeolocalizacao = "",
  exif = null,
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
      origemCaptura: origemCaptura || "",
      origemGeolocalizacao: origemGeolocalizacao || "",
      dataOriginalExifISO: exif?.dataOriginalISO || "",
      dispositivoCaptura: exif?.dispositivo || "",
    },
  });

  const downloadURL = await getDownloadURL(storageRef);
  const miniatura = miniaturaBase64 || thumbnailBase64 || "";
  let miniaturaStoragePath = "";
  let miniaturaDownloadURL = "";

  try {
    const mini = await enviarMiniaturaParaStorage({
      miniaturaBase64: miniatura,
      storagePath,
      contentType: "image/jpeg",
    });
    miniaturaStoragePath = mini.miniaturaStoragePath || "";
    miniaturaDownloadURL = mini.miniaturaDownloadURL || "";
  } catch (erroMiniatura) {
    console.warn("Original enviado, mas miniatura no Storage falhou:", erroMiniatura);
  }

  return {
    storagePath,
    downloadURL,
    url: downloadURL,
    data: "",
    previewLocal: "",
    base64: "",
    miniaturaBase64: "",
    thumbnailBase64: "",
    miniaturaStoragePath,
    thumbnailStoragePath: miniaturaStoragePath,
    miniaturaDownloadURL,
    thumbnailURL: miniaturaDownloadURL,
    thumbnailDownloadURL: miniaturaDownloadURL,
    imagemSalvaOnline: true,
    enviadoEm: dataAgoraISO(),
    geolocalizacao: geolocalizacao || null,
    latitude: latitude ?? geolocalizacao?.latitude ?? null,
    longitude: longitude ?? geolocalizacao?.longitude ?? null,
    precisaoGPS: precisaoGPS ?? geolocalizacao?.precisao ?? null,
    precisao: precisaoGPS ?? geolocalizacao?.precisao ?? null,
    linkMaps: linkMaps || geolocalizacao?.linkMaps || "",
    responsavel: responsavel || usuario?.nomeCompleto || usuario?.email || "",
    origemCaptura: origemCaptura || "",
    origemGeolocalizacao: origemGeolocalizacao || "",
    exif: exif || null,
    dataOriginalExif: exif?.dataOriginal || "",
    dataOriginalExifISO: exif?.dataOriginalISO || "",
    dispositivoCaptura: exif?.dispositivo || "",
    modeloCaptura: exif?.modelo || "",
    fabricanteCaptura: exif?.fabricante || "",
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
    evidencia?.miniaturaBase64 ||
    evidencia?.thumbnailBase64 ||
    evidencia?.thumbBase64 ||
    evidencia?.miniaturaDownloadURL ||
    evidencia?.thumbnailURL ||
    evidencia?.thumbnailDownloadURL ||
    evidencia?.data ||
    evidencia?.previewLocal ||
    evidencia?.base64 ||
    evidencia?.downloadURL ||
    evidencia?.url ||
    ""
  );
}
