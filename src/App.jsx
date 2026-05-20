import React, { useEffect, useMemo, useState } from "react";
import "./App.css";

import logoVelox from "./assets/logo-velox.png";
import logoVeloxRelatorio from "./assets/logo-velox-relatorio-branca.png";

import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";

import { NORMAS } from "./data/normas";
import { CONFIG_INICIAL_RBAC154 } from "./data/configuracaoAerodromo";
import { verificarAplicabilidade } from "./utils/aplicabilidade";
import {
  verificarAplicabilidadeInfra,
  gerarResumoTecnicoInfra,
  gerarChecklistInfra,
} from "./engines/infraEngine";
import { avaliarConformidadeInfra } from "./engines/infraComplianceEngine";

import {
  atualizarBaseANAC,
  buscarAerodromoPorICAO,
} from "./services/anacService";

import { buscarAerodromoConsolidado } from "./data/aerodromosConsolidados";
import { buscarPANPorICAO } from "./data/pan/panData";

import {
  enviarEvidenciaParaStorage,
  arquivoParaBase64,
  obterUrlImagemEvidencia,
  excluirEvidenciaDoStorage,
} from "./services/firebaseStorageService";

import {
  atualizarUsuarioFirebase,
  cadastrarUsuarioFirebase,
  entrarUsuarioFirebase,
  enviarResetSenhaFirebase,
  excluirInspecaoFirebase,
  excluirInspecoesDoUsuarioFirebase,
  excluirUsuarioFirebase,
  mensagemErroFirebase,
  observarInspecoesFirebase,
  observarSessaoFirebase,
  observarUsuariosFirebase,
  sairFirebase,
  salvarInspecaoFirebase,
} from "./services/firebaseService";

const STATUS = [
  "NÃO VERIFICADO",
  "CONFORME",
  "NÃO CONFORME",
  "NÃO APLICÁVEL",
];

const NORMAS_IDS = ["RBAC153", "RBAC154", "RBAC107", "INFRA", "VCP"];
const NORMAS_GERAIS_RELATORIO_IDS = ["RBAC153", "RBAC154", "RBAC107", "INFRA"];

const STORAGE_KEYS = {
  usuarios: "velox_usuarios",
  usuarioLogado: "velox_usuario_logado",
  inspecoes: "velox_inspecoes",
  baseANAC: "baseANAC",
};

// ADMIN MASTER FIXO PARA AMBIENTE PUBLICADO
// IMPORTANTE:
// 1) O Admin Master oficial agora é comercial@veloxservice.com.br.
// 2) O antigo admin@veloxservice.com.br será removido/migrado automaticamente.
// 3) Cadastros feitos pelo link público NUNCA viram Admin Master.
const ADMIN_MASTER_EMAIL = "comercial@veloxservice.com.br";
const ADMIN_MASTER_NOME = "Velox Service";
const ADMIN_MASTER_SENHA_INICIAL = "123456";
const ADMIN_MASTER_TELEFONE = "62999136262";
const ADMIN_MASTER_CPF = "94601887100";
const ADMIN_MASTER_EMAILS_ANTIGOS = ["admin@veloxservice.com.br"];

function normalizarEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function senhaLimpa(senha) {
  return String(senha || "").trim();
}

function ehEmailAdminMasterOficial(email) {
  return normalizarEmail(email) === ADMIN_MASTER_EMAIL;
}

function ehEmailAdminMasterAntigo(email) {
  return ADMIN_MASTER_EMAILS_ANTIGOS.includes(normalizarEmail(email));
}

function ehAdmin(usuario) {
  return usuario?.tipo === "admin" || usuario?.tipo === "adminMaster" || usuario?.adminMaster === true;
}

function ehAdminMaster(usuario) {
  return usuario?.tipo === "adminMaster" || usuario?.adminMaster === true;
}

const CONFIG_INICIAL = {
  nomeAerodromo: "",
  municipio: "",
  uf: "",
  icao: "",
  usoPublico: true,
  passageirosAno: 0,
  classeRBAC153: "Classe I",
  perfilClasseI: "",
  classificacaoRBAC153: "Classe I",
  categoriaRBAC107: "AP-0",
  comprimentoPista: 0,
  larguraPista: 0,
  codigoNumero: 1,
  codigoLetra: "B",
  codigoReferenciaRBAC154: "1B",
  tipoOperacao: "VFR",
  operacaoNoturna: false,
  aeronaveCritica: "",
  horarioFuncionamento: "",
  aeroportoCertificado: "",
  representantesAeroporto: "",
  itensEspecificosVCP: "",
  internacional: false,
  possuiPista: true,
  possuiTaxiway: true,
  possuiPatio: true,
  pavimentado: false,
  sistemaEletrico: false,
  possuiSinalizacaoLuminosa: false,
  possuiBalizas: false,
  possuiObstaculos: false,
  possuiAreaInterditada: false,
  possuiAreaForaServico: false,
  baixaVisibilidade: false,
  possuiOperacaoPassageiros: true,
  possuiOperacaoCarga: false,
  possuiAVSEC: true,
  fonteClassificacao: "",
  revisaoManual: false,
  ...CONFIG_INICIAL_RBAC154,
};

function criarRespostasNormas() {
  return NORMAS_IDS.reduce((acc, normaId) => {
    acc[normaId] = {};
    return acc;
  }, {});
}

function safeParse(valor, fallback) {
  try {
    return valor ? JSON.parse(valor) : fallback;
  } catch {
    return fallback;
  }
}

function gerarId(prefixo = "VEL") {
  const random = Math.random().toString(36).slice(2, 9).toUpperCase();
  return `${prefixo}-${Date.now()}-${random}`;
}

function criarAdminMasterInicial() {
  return {
    id: "USR-ADMIN-MASTER-VELOX",
    nomeCompleto: ADMIN_MASTER_NOME,
    email: ADMIN_MASTER_EMAIL,
    telefone: ADMIN_MASTER_TELEFONE,
    cpf: ADMIN_MASTER_CPF,
    senha: ADMIN_MASTER_SENHA_INICIAL,
    ativo: true,
    tipo: "adminMaster",
    adminMaster: true,
    statusCadastro: "aprovado",
    criadoEm: new Date().toISOString(),
    aprovadoEm: new Date().toISOString(),
  };
}

function dataBR(valor) {
  if (!valor) return "—";
  try {
    return new Date(valor).toLocaleString("pt-BR");
  } catch {
    return "—";
  }
}

function limparTexto(valor) {
  return String(valor || "")
    .trim()
    .toUpperCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function extrairNumero(valor) {
  if (valor === null || valor === undefined) return 0;
  const texto = String(valor).replace(",", ".").replace(/[^\d.]/g, "");
  return Number(texto || 0);
}

function classificarRBAC153(passageirosAno, usoPublico) {
  const pax = Number(passageirosAno || 0);
  if (!usoPublico) return "Não classificado";
  if (pax < 200000) return "Classe I";
  if (pax < 1000000) return "Classe II";
  if (pax < 5000000) return "Classe III";
  return "Classe IV";
}

function classificarCodigoNumero(comprimentoPista) {
  const comprimento = Number(comprimentoPista || 0);
  if (comprimento >= 1800) return 4;
  if (comprimento >= 1200) return 3;
  if (comprimento >= 800) return 2;
  return 1;
}

function montarConfigDoConsolidado(aero) {
  if (!aero) return null;

  const codigoNumero = Number(aero.codigoNumero || aero.codigoNumeroRBAC154 || 1);
  const codigoLetra = aero.codigoLetra || aero.codigoLetraRBAC154 || "B";

  return {
    nomeAerodromo: aero.nomeAerodromo || aero.nome || "Não informado",
    municipio: aero.municipio || "",
    uf: aero.uf || "",
    icao: limparTexto(aero.icao),
    usoPublico: aero.usoPublico !== false,
    passageirosAno: Number(aero.passageirosAno || 0),
    classeRBAC153:
      aero.classeRBAC153 ||
      classificarRBAC153(Number(aero.passageirosAno || 0), aero.usoPublico !== false),
    perfilClasseI: aero.perfilClasseI || "",
    classificacaoRBAC153:
      aero.classificacaoRBAC153 ||
      [aero.classeRBAC153, aero.perfilClasseI ? `-${aero.perfilClasseI}` : ""]
        .join("")
        .trim(),
    categoriaRBAC107: aero.categoriaRBAC107 || aero.classeRBAC107 || "AP-0",
    comprimentoPista: Number(aero.comprimentoPista || 0),
    larguraPista: Number(aero.larguraPista || 0),
    aeronaveCritica: aero.aeronaveCritica || aero.aeronaveCriticaOperacional || "",
    horarioFuncionamento: aero.horarioFuncionamento || "",
    aeroportoCertificado: aero.aeroportoCertificado || "",
    representantesAeroporto: aero.representantesAeroporto || "",
    itensEspecificosVCP: aero.itensEspecificosVCP || "",
    codigoNumero,
    codigoLetra,
    codigoReferenciaRBAC154:
      aero.codigoReferenciaRBAC154 || `${codigoNumero}${codigoLetra}`,
    tipoOperacao: aero.tipoOperacao || "VFR",
    operacaoNoturna: Boolean(aero.operacaoNoturna),
    internacional: Boolean(aero.internacional),
    possuiPista: true,
    possuiTaxiway: aero.possuiTaxiway !== false,
    possuiPatio: aero.possuiPatio !== false,
    pavimentado: Boolean(aero.pavimentado),
    sistemaEletrico: Boolean(aero.sistemaEletrico || aero.operacaoNoturna),
    possuiSinalizacaoLuminosa: Boolean(
      aero.possuiSinalizacaoLuminosa || aero.sistemaEletrico || aero.operacaoNoturna
    ),
    possuiBalizas: Boolean(aero.possuiBalizas || aero.operacaoNoturna),
    possuiOperacaoPassageiros: aero.possuiOperacaoPassageiros !== false,
    possuiOperacaoCarga: Boolean(aero.possuiOperacaoCarga),
    possuiAVSEC: aero.possuiAVSEC !== false,
    fonteClassificacao:
      aero.fonteClassificacao || "Banco consolidado interno ANAC/VELOX.",
    revisaoManual: Boolean(aero.revisaoManual),
  };
}

function normalizarAerodromoBruto(aero, codigoDigitado) {
  const chaves = Object.keys(aero || {});

  function valorPorNome(...nomes) {
    for (const nome of nomes) {
      const encontrado = chaves.find(
        (chave) => limparTexto(chave) === limparTexto(nome)
      );
      if (
        encontrado &&
        aero[encontrado] !== undefined &&
        aero[encontrado] !== null &&
        aero[encontrado] !== ""
      ) {
        return aero[encontrado];
      }
    }
    return "";
  }

  function valorPorContem(...partes) {
    for (const chave of chaves) {
      const chaveLimpa = limparTexto(chave);
      const bate = partes.every((parte) => chaveLimpa.includes(limparTexto(parte)));
      if (
        bate &&
        aero[chave] !== undefined &&
        aero[chave] !== null &&
        aero[chave] !== ""
      ) {
        return aero[chave];
      }
    }
    return "";
  }

  const icao =
    valorPorNome("icao", "ICAO", "CódigoOACI", "Código OACI", "CODIGO OACI", "Código ICAO", "CODIGO ICAO") ||
    codigoDigitado;

  const nomeAerodromo =
    valorPorNome("nomeAerodromo", "Nome", "nome", "Aeródromo", "AERODROMO", "Nome do Aeródromo", "NOME DO AERODROMO") ||
    valorPorContem("aerodromo") ||
    valorPorContem("nome") ||
    "Não informado";

  const municipio =
    valorPorNome("Município", "municipio", "MUNICIPIO", "cidade", "Cidade") ||
    valorPorContem("municipio") ||
    valorPorContem("cidade") ||
    "";

  const uf =
    valorPorNome("UF", "uf", "estado", "Estado") ||
    valorPorContem("uf") ||
    valorPorContem("estado") ||
    "";

  const classeRBAC153 =
    valorPorNome("Classe RBAC 153", "classeRBAC153", "CLASSIFICAÇÃO RBAC 153") || "";

  const classeRBAC107 =
    valorPorNome("Classe RBAC 107", "classeRBAC107", "Classificação AVSEC 2026") || "";

  const comprimentoPista = extrairNumero(
    valorPorNome("Comprimento1", "comprimentoPista", "comprimento", "Comprimento", "Comprimento da Pista") ||
      valorPorContem("comprimento") ||
      valorPorContem("pista")
  );

  const larguraPista = extrairNumero(
    valorPorNome("Largura1", "larguraPista", "largura", "Largura") || valorPorContem("largura")
  );

  const operacaoTexto = limparTexto(
    valorPorNome("OperaçãoDiurna", "Operação Diurna", "tipoOperacao") ||
      valorPorNome("OperaçãoNoturna", "Operação Noturna") ||
      valorPorContem("operacao")
  );

  const superficieTexto = limparTexto(
    valorPorNome("Superfície1", "superficie", "Superfície", "pavimento") ||
      valorPorContem("superficie") ||
      valorPorContem("pavimento")
  );

  const noturnoTexto = limparTexto(
    valorPorNome("OperaçãoNoturna", "Operação Noturna", "noturno") ||
      valorPorContem("noturna") ||
      valorPorContem("noturno")
  );

  const tipoOperacao = operacaoTexto.includes("IFR") ? "IFR" : "VFR";
  const operacaoNoturna =
    noturnoTexto.includes("VFR") ||
    noturnoTexto.includes("IFR") ||
    noturnoTexto.includes("NOTURN") ||
    noturnoTexto.includes("CAT");

  const pavimentado =
    superficieTexto.includes("ASFALT") ||
    superficieTexto.includes("CONCRET") ||
    superficieTexto.includes("PAVIMENT");

  const codigoNumero = classificarCodigoNumero(comprimentoPista);
  let codigoLetra = codigoNumero >= 3 ? "C" : "B";

  const aeronaveCritica = limparTexto(
    valorPorNome("AERONAVE CRÍTICA", "Aeronave Crítica", "aeronaveCritica")
  );

  if (aeronaveCritica.includes("A330") || aeronaveCritica.includes("B777")) {
    codigoLetra = "E";
  } else if (
    aeronaveCritica.includes("A320") ||
    aeronaveCritica.includes("B737") ||
    aeronaveCritica.includes("ATR") ||
    aeronaveCritica.includes("E195")
  ) {
    codigoLetra = "C";
  }

  const classeFinal = classeRBAC153 || classificarRBAC153(0, true);

  return {
    nomeAerodromo,
    icao: limparTexto(icao),
    municipio,
    uf,
    usoPublico: true,
    passageirosAno: 0,
    classeRBAC153: classeFinal.includes("I") && classeFinal.includes("B") ? "Classe I" : classeFinal,
    perfilClasseI: classeFinal.includes("I-B") || classeFinal.includes("121") ? "B" : "",
    classificacaoRBAC153: classeFinal,
    categoriaRBAC107: classeRBAC107 || "AP-0",
    comprimentoPista,
    larguraPista,
    aeronaveCritica: aeronaveCritica || "",
    horarioFuncionamento: "",
    aeroportoCertificado: "",
    representantesAeroporto: "",
    itensEspecificosVCP: "",
    codigoNumero,
    codigoLetra,
    codigoReferenciaRBAC154: `${codigoNumero}${codigoLetra}`,
    tipoOperacao,
    operacaoNoturna,
    internacional: false,
    possuiPista: true,
    possuiTaxiway: true,
    possuiPatio: true,
    pavimentado,
    sistemaEletrico: operacaoNoturna,
    possuiSinalizacaoLuminosa: operacaoNoturna,
    possuiBalizas: operacaoNoturna,
    possuiOperacaoPassageiros: true,
    possuiOperacaoCarga: false,
    possuiAVSEC: true,
    fonteClassificacao: "Base ANAC bruta com normalização automática.",
    revisaoManual: true,
  };
}

function classeStatus(status) {
  if (status === "CONFORME") return "conforme";
  if (status === "NÃO CONFORME") return "nao-conforme";
  if (status === "NÃO APLICÁVEL") return "nao-aplicavel";
  return "pendente";
}

function gerarIdEvidencia(index) {
  return `EV-${String(index + 1).padStart(3, "0")}`;
}


function obterTimestampInspecao(inspecao = {}) {
  return new Date(inspecao.atualizadoEm || inspecao.criadoEm || 0).getTime() || 0;
}

function mesclarInspecoesPorAtualizacao(...listas) {
  const mapa = new Map();
  listas.flat().filter(Boolean).forEach((inspecao) => {
    if (!inspecao?.id) return;
    const existente = mapa.get(inspecao.id);
    if (!existente || obterTimestampInspecao(inspecao) >= obterTimestampInspecao(existente)) {
      mapa.set(inspecao.id, inspecao);
    }
  });
  return Array.from(mapa.values()).sort((a, b) => obterTimestampInspecao(b) - obterTimestampInspecao(a));
}

function rolarParaConsultaICAO() {
  if (typeof window === "undefined") return;
  window.setTimeout(() => {
    const alvo = document.getElementById("consulta-icao-section") || document.querySelector(".consulta-card");
    if (alvo?.scrollIntoView) alvo.scrollIntoView({ behavior: "smooth", block: "start" });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  }, 250);
}

function limparInputArquivo(evento) {
  if (evento?.target) evento.target.value = "";
}

function baixarEvidenciaNoDispositivo(evidencia, nomePadrao = "evidencia-velox.jpg") {
  const fonte = obterUrlImagemEvidencia(evidencia);
  if (!fonte || typeof document === "undefined") {
    alert("Imagem não disponível para salvar neste dispositivo.");
    return;
  }
  try {
    const link = document.createElement("a");
    link.href = fonte;
    link.download = evidencia?.nome || nomePadrao;
    link.rel = "noopener";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (erro) {
    console.error("Erro ao salvar imagem no dispositivo:", erro);
    window.open(fonte, "_blank", "noopener,noreferrer");
  }
}

async function urlParaBase64(url) {
  const resposta = await fetch(url);
  const blob = await resposta.blob();

  return await new Promise((resolve, reject) => {
    const leitor = new FileReader();
    leitor.onloadend = () => resolve(leitor.result);
    leitor.onerror = reject;
    leitor.readAsDataURL(blob);
  });
}

function extensaoImagem(dataUrl) {
  if (String(dataUrl).includes("image/png")) return "png";
  return "jpeg";
}

async function prepararImagemParaRelatorio(imagem) {
  try {
    const fonte = obterUrlImagemEvidencia(imagem);
    if (!fonte) return "";

    if (String(fonte).startsWith("data:image")) {
      return fonte;
    }

    return await urlParaBase64(fonte);
  } catch (erro) {
    console.error("Erro ao preparar imagem para relatório:", erro);
    return "";
  }
}


function normalizarImagemEvidenciaParaRelatorio(imagem = {}, resposta = {}, itemId = "") {
  const data = imagem?.data || imagem?.previewLocal || imagem?.base64 || "";
  const url = imagem?.downloadURL || imagem?.url || "";
  const geolocalizacao = imagem?.geolocalizacao || null;
  const latitude = imagem?.latitude ?? geolocalizacao?.latitude ?? null;
  const longitude = imagem?.longitude ?? geolocalizacao?.longitude ?? null;
  const precisaoGPS =
    imagem?.precisaoGPS ??
    imagem?.precisao ??
    geolocalizacao?.precisao ??
    null;

  return {
    ...imagem,
    data: data || url,
    previewLocal: imagem?.previewLocal || data || "",
    downloadURL: imagem?.downloadURL || url || "",
    url: url || data || "",
    storagePath: imagem?.storagePath || "",
    imagemSalvaOnline: Boolean(imagem?.imagemSalvaOnline || url || imagem?.storagePath),
    geolocalizacao,
    latitude,
    longitude,
    precisaoGPS,
    precisao: imagem?.precisao ?? precisaoGPS,
    linkMaps:
      imagem?.linkMaps ||
      geolocalizacao?.linkMaps ||
      (latitude && longitude ? `https://www.google.com/maps?q=${latitude},${longitude}` : ""),
    capturadoEm: imagem?.capturadoEm || imagem?.criadoEm || "",
    criadoEm: imagem?.criadoEm || imagem?.capturadoEm || "",
    responsavel: imagem?.responsavel || resposta?.responsavel || "",
    itemVinculado: imagem?.itemVinculado || itemId || "",
  };
}

function corStatus(status) {
  if (status === "CONFORME") return "16A34A";
  if (status === "NÃO CONFORME") return "EF4444";
  if (status === "NÃO APLICÁVEL") return "64748B";
  return "C9A300";
}

function hexParaRgb(hex) {
  const limpo = String(hex || "000000").replace("#", "");
  const numero = parseInt(limpo, 16);
  return [
    (numero >> 16) & 255,
    (numero >> 8) & 255,
    numero & 255,
  ];
}


function verificarAplicabilidadePorNorma(normaId, item, configAerodromo) {
  if (normaId === "VCP") {
    return true;
  }

  if (normaId === "INFRA") {
    return verificarAplicabilidadeInfra(item, configAerodromo);
  }

  return verificarAplicabilidade(item, configAerodromo);
}

function criarSnapshotAeroporto(configAerodromo) {
  return {
    icao: configAerodromo.icao || "",
    nome: configAerodromo.nomeAerodromo || "Não informado",
    municipio: configAerodromo.municipio || "",
    uf: configAerodromo.uf || "",
    classificacao153: configAerodromo.classificacaoRBAC153 || configAerodromo.classeRBAC153 || "",
    codigoNumero154: configAerodromo.codigoNumero,
    codigoLetra154: configAerodromo.codigoLetra,
    codigoReferencia154: configAerodromo.codigoReferenciaRBAC154,
    categoria107: configAerodromo.categoriaRBAC107 || "AP-0",
  };
}


function sanitizarValorFirebase(valor) {
  if (valor === undefined) return null;
  if (valor === null) return null;

  if (typeof valor === "string" || typeof valor === "number" || typeof valor === "boolean") {
    return valor;
  }

  if (valor instanceof Date) {
    return valor.toISOString();
  }

  if (Array.isArray(valor)) {
    return valor.map((item) => sanitizarValorFirebase(item)).filter((item) => item !== undefined);
  }

  if (typeof valor === "object") {
    const limpo = {};
    Object.entries(valor).forEach(([chave, conteudo]) => {
      if (typeof conteudo === "function") return;
      const sanitizado = sanitizarValorFirebase(conteudo);
      if (sanitizado !== undefined) limpo[chave] = sanitizado;
    });
    return limpo;
  }

  return String(valor);
}

function sanitizarObjetoFirebase(objeto) {
  return sanitizarValorFirebase(objeto);
}

function criarRespostasLevesParaFirebase(respostasOriginais = {}) {
  const lista = [];

  NORMAS_IDS.forEach((normaId) => {
    const respostasNorma = respostasOriginais?.[normaId] || {};

    Object.entries(respostasNorma).forEach(([chave, resposta]) => {
      const respostaLeve = { ...(resposta || {}) };

      // Fotos em base64/DataURL não devem ir para o Firestore:
      // além de deixar o documento muito pesado, podem causar erro de entidade aninhada.
      // A versão completa continua no estado/local do app durante a inspeção; futuramente
      // as imagens devem ir para Firebase Storage.
      if (Array.isArray(respostaLeve.evidenciasAnexadas)) {
        respostaLeve.evidenciasAnexadas = respostaLeve.evidenciasAnexadas.map((ev) => ({
          id: ev?.id || "",
          nome: ev?.nome || "",
          tipo: ev?.tipo || "",
          tamanho: ev?.tamanho || ev?.size || null,
          criadoEm: ev?.criadoEm || "",
          capturadoEm: ev?.capturadoEm || ev?.criadoEm || "",
          enviadoEm: ev?.enviadoEm || "",
          responsavel: ev?.responsavel || "",
          itemVinculado: ev?.itemVinculado || "",
          storagePath: ev?.storagePath || "",
          downloadURL: ev?.downloadURL || ev?.url || "",
          imagemSalvaOnline: Boolean(ev?.downloadURL || ev?.storagePath || ev?.imagemSalvaOnline),
          latitude: ev?.latitude ?? ev?.geolocalizacao?.latitude ?? null,
          longitude: ev?.longitude ?? ev?.geolocalizacao?.longitude ?? null,
          precisaoGPS: ev?.precisaoGPS ?? ev?.precisao ?? ev?.geolocalizacao?.precisao ?? null,
          precisao: ev?.precisao ?? ev?.precisaoGPS ?? ev?.geolocalizacao?.precisao ?? null,
          linkMaps: ev?.linkMaps || ev?.geolocalizacao?.linkMaps || "",
          geolocalizacao: ev?.geolocalizacao
            ? {
                latitude: ev.geolocalizacao.latitude ?? null,
                longitude: ev.geolocalizacao.longitude ?? null,
                precisao: ev.geolocalizacao.precisao ?? null,
                capturadoEm: ev.geolocalizacao.capturadoEm || ev?.criadoEm || "",
                linkMaps: ev.geolocalizacao.linkMaps || ev?.linkMaps || "",
              }
            : null,
        }));
      }

      lista.push({
        normaId,
        chave: String(chave),
        resposta: sanitizarValorFirebase(respostaLeve),
      });
    });
  });

  return lista;
}

function reconstruirRespostasPorNorma(inspecao) {
  if (inspecao?.respostasPorNorma && typeof inspecao.respostasPorNorma === "object") {
    return { ...criarRespostasNormas(), ...inspecao.respostasPorNorma };
  }

  const reconstruido = criarRespostasNormas();
  const lista = Array.isArray(inspecao?.respostasPorNormaLista)
    ? inspecao.respostasPorNormaLista
    : [];

  lista.forEach((registro) => {
    const normaId = registro?.normaId;
    const chave = registro?.chave;
    if (!normaId || !chave) return;
    reconstruido[normaId] = {
      ...(reconstruido[normaId] || {}),
      [chave]: registro.resposta || {},
    };
  });

  return reconstruido;
}

function prepararInspecaoParaFirebase(objeto) {
  const limpo = sanitizarObjetoFirebase(objeto);

  const normasResumo = {};
  NORMAS_IDS.forEach((normaId) => {
    const respostasNorma = objeto?.respostasPorNorma?.[normaId] || {};
    const r = objeto?.normas?.[normaId] || {};
    normasResumo[normaId] = {
      status: r.status || "em_andamento",
      percentualConcluido: Number(r.percentualConcluido || 0),
      totalItens: Number(r.totalItens || 0),
      totalRespostas: Object.keys(respostasNorma || {}).length,
    };
  });

  // Firestore estava rejeitando objetos profundamente aninhados em "normas" e
  // depois em "respostasPorNorma". Para salvar online com segurança, usamos:
  // - normasResumo: resumo simples;
  // - respostasPorNormaLista: lista plana, sem chaves com pontos e sem base64 das fotos.
  delete limpo.normas;
  delete limpo.respostasPorNorma;

  limpo.normasResumo = normasResumo;
  limpo.respostasPorNormaLista = criarRespostasLevesParaFirebase(objeto?.respostasPorNorma || {});

  return limpo;
}


const vcpStyles = {
  fichaBox: {
    background: "rgba(255,255,255,0.96)",
    color: "#0f172a",
    borderRadius: 22,
    padding: 22,
    margin: "0 0 22px",
    boxShadow: "0 18px 40px rgba(0,0,0,0.18)",
    border: "1px solid rgba(15, 23, 42, 0.10)",
  },
  tituloPrincipal: {
    color: "#0b3b78",
    fontSize: 24,
    margin: "0 0 18px",
    fontWeight: 900,
  },
  tabela: {
    width: "100%",
    borderCollapse: "collapse",
    background: "#ffffff",
    fontSize: 14,
  },
  subtitulo: {
    background: "#2f3a40",
    color: "#ffffff",
    textAlign: "left",
    padding: "6px 8px",
    fontSize: 16,
    fontWeight: 800,
    border: "1px solid #2f3a40",
  },
  numero: {
    width: 74,
    fontWeight: 900,
    padding: 8,
    border: "1px solid #1f2933",
    background: "#eef2f4",
    color: "#000",
    verticalAlign: "middle",
  },
  tema: {
    width: "34%",
    fontWeight: 900,
    color: "#00a9a7",
    padding: 8,
    border: "1px solid #1f2933",
    background: "#e7ecef",
    verticalAlign: "middle",
  },
  valor: {
    padding: 6,
    border: "1px solid #1f2933",
    background: "#ffffff",
    verticalAlign: "middle",
  },
  campoInput: {
    width: "100%",
    minHeight: 34,
    border: "1px solid #d1d5db",
    borderRadius: 8,
    padding: "8px 10px",
    color: "#111827",
    background: "#ffffff",
    fontWeight: 700,
  },
  campoTexto: {
    width: "100%",
    border: "1px solid #d1d5db",
    borderRadius: 8,
    padding: "8px 10px",
    color: "#111827",
    background: "#ffffff",
    fontWeight: 700,
    resize: "vertical",
  },
  panBox: {
    marginTop: 16,
    padding: 14,
    borderRadius: 14,
    background: "#eef8ff",
    border: "1px solid #bfdbfe",
    color: "#0f172a",
    lineHeight: 1.5,
  },
  cardOperacional: {
    background: "rgba(255,255,255,0.96)",
    color: "#111827",
    borderRadius: 18,
    overflow: "hidden",
    marginBottom: 18,
    border: "1px solid rgba(15,23,42,0.15)",
    boxShadow: "0 14px 34px rgba(0,0,0,0.16)",
  },
  cardCabecalho: {
    display: "grid",
    gridTemplateColumns: "110px minmax(240px, 1fr) minmax(320px, 1.25fr)",
    gap: 0,
    background: "#2f3a40",
    color: "#fff",
    fontWeight: 900,
    padding: "8px 10px",
  },
  cardConteudo: {
    display: "grid",
    gridTemplateColumns: "110px minmax(240px, 1fr) minmax(320px, 1.25fr)",
    gap: 0,
    borderTop: "1px solid #111827",
  },
  numeroGrande: {
    padding: 18,
    fontSize: 18,
    fontWeight: 900,
    background: "#eef2f4",
    borderRight: "1px solid #111827",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  blocoPergunta: {
    padding: 18,
    borderRight: "1px solid #111827",
    background: "#ffffff",
  },
  temaCard: {
    display: "block",
    fontSize: 16,
    marginBottom: 6,
  },
  perguntaCard: {
    margin: "0 0 16px",
    lineHeight: 1.45,
  },
  classificacaoBox: {
    marginTop: 12,
  },
  quadradosLinha: {
    display: "flex",
    gap: 0,
    marginTop: 8,
  },
  quadrado: {
    width: 34,
    height: 30,
    border: "1px solid #111827",
    background: "#ffffff",
    cursor: "pointer",
  },
  quadradoAtivo: {
    background: "#10b981",
  },
  escalaLinha: {
    display: "flex",
    justifyContent: "space-between",
    maxWidth: 176,
    fontSize: 12,
    marginTop: 4,
    fontWeight: 700,
  },
  referencia: {
    display: "block",
    marginTop: 14,
    color: "#475569",
    fontWeight: 700,
  },
  blocoCondicao: {
    padding: 18,
    background: "#ffffff",
  },
  labelVCP: {
    display: "block",
    marginTop: 12,
    fontWeight: 900,
    color: "#0f172a",
  },
  textareaVCP: {
    width: "100%",
    minHeight: 96,
    marginTop: 6,
    border: "1px solid #cbd5e1",
    borderRadius: 12,
    padding: 12,
    background: "#f8fafc",
    color: "#111827",
    resize: "vertical",
    lineHeight: 1.5,
  },
};

export default function App() {
  const [normaSelecionada, setNormaSelecionada] = useState("RBAC153");
  const [configAerodromo, setConfigAerodromo] = useState(CONFIG_INICIAL);
  const [baseANAC, setBaseANAC] = useState([]);
  const [icao, setIcao] = useState("");
  const [mensagemBase, setMensagemBase] = useState("");
  const [busca, setBusca] = useState("");
  const [respostasPorNorma, setRespostasPorNorma] = useState(criarRespostasNormas);
  const [mostrarConfig, setMostrarConfig] = useState(false);
  const [gerandoRelatorio, setGerandoRelatorio] = useState(false);
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioLogado, setUsuarioLogado] = useState(null);
  const [inspecoes, setInspecoes] = useState([]);
  const [inspecaoAtualId, setInspecaoAtualId] = useState(null);
  const [modoAuth, setModoAuth] = useState("login");
  const [authForm, setAuthForm] = useState({
    nomeCompleto: "",
    email: "",
    telefone: "",
    cpf: "",
    senha: "",
  });
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarMinhasInspecoes, setMostrarMinhasInspecoes] = useState(true);
  const [adminUsuarioSelecionado, setAdminUsuarioSelecionado] = useState("");
  const [isMobileVCP, setIsMobileVCP] = useState(false);

  useEffect(() => {
    const atualizarModoMobile = () => {
      if (typeof window === "undefined") return;
      setIsMobileVCP(window.innerWidth <= 768);
    };

    atualizarModoMobile();
    window.addEventListener("resize", atualizarModoMobile);
    window.addEventListener("orientationchange", atualizarModoMobile);

    return () => {
      window.removeEventListener("resize", atualizarModoMobile);
      window.removeEventListener("orientationchange", atualizarModoMobile);
    };
  }, []);

  const respostas = respostasPorNorma[normaSelecionada] || {};

  const panInfo = useMemo(
    () => buscarPANPorICAO(configAerodromo.icao),
    [configAerodromo.icao]
  );

  const codigoFaixaPANAtual = panInfo
    ? `${configAerodromo.codigoReferenciaRBAC154 || "Código RBAC 154 não informado"} / ${panInfo.codigoFaixaPAN} / CAPEX ${panInfo.capexEstimadoFinal}`
    : `${configAerodromo.codigoReferenciaRBAC154 || "Código RBAC 154 não informado"} / Faixa PAN não cadastrada para este ICAO`;

  useEffect(() => {
    const baseSalva = safeParse(localStorage.getItem(STORAGE_KEYS.baseANAC), []);
    setBaseANAC(Array.isArray(baseSalva) ? baseSalva : []);

    const cancelarSessao = observarSessaoFirebase((perfil) => {
      if (!perfil) {
        setUsuarioLogado(null);
        sessionStorage.removeItem(STORAGE_KEYS.usuarioLogado);
        localStorage.removeItem(STORAGE_KEYS.usuarioLogado);
        return;
      }

      const emailPerfil = normalizarEmail(perfil.email);
      const master = ehEmailAdminMasterOficial(emailPerfil) || perfil.adminMaster === true || perfil.tipo === "adminMaster";

      const usuarioSeguro = {
        ...perfil,
        id: perfil.id || perfil.uid,
        email: emailPerfil,
        tipo: master ? "adminMaster" : perfil.tipo || "inspetor",
        adminMaster: master,
        ativo: master ? true : perfil.ativo === true,
        statusCadastro: master ? "aprovado" : perfil.statusCadastro || (perfil.ativo ? "aprovado" : "pendente"),
      };

      if (usuarioSeguro.ativo === false) {
        setUsuarioLogado(null);
        return;
      }

      setUsuarioLogado(usuarioSeguro);
      sessionStorage.setItem(STORAGE_KEYS.usuarioLogado, JSON.stringify(usuarioSeguro));
    });

    const cancelarUsuarios = observarUsuariosFirebase((listaUsuarios) => {
      const normalizados = Array.isArray(listaUsuarios)
        ? listaUsuarios
            .filter((usuario) => !ehEmailAdminMasterAntigo(usuario.email))
            .map((usuario) => {
              const emailUsuario = normalizarEmail(usuario.email);
              const master = ehEmailAdminMasterOficial(emailUsuario) || usuario.adminMaster === true || usuario.tipo === "adminMaster";
              return {
                ...usuario,
                id: usuario.id || usuario.uid,
                email: emailUsuario,
                tipo: master ? "adminMaster" : usuario.tipo || "inspetor",
                adminMaster: master,
                ativo: master ? true : usuario.ativo === true,
                statusCadastro: master ? "aprovado" : usuario.statusCadastro || (usuario.ativo ? "aprovado" : "pendente"),
              };
            })
        : [];

      setUsuarios(normalizados);
      localStorage.setItem(STORAGE_KEYS.usuarios, JSON.stringify(normalizados));
    });

    const cancelarInspecoes = observarInspecoesFirebase((listaInspecoes) => {
      const online = Array.isArray(listaInspecoes) ? listaInspecoes : [];
      const local = safeParse(localStorage.getItem(STORAGE_KEYS.inspecoes), []);
      const mescladas = mesclarInspecoesPorAtualizacao(local, online);
      setInspecoes(mescladas);
      localStorage.setItem(STORAGE_KEYS.inspecoes, JSON.stringify(mescladas));
    });

    const respostasAntigas = safeParse(localStorage.getItem("respostas-inspecao"), null);
    const configAntiga = safeParse(localStorage.getItem("config-aerodromo"), null);

    if (respostasAntigas || configAntiga) {
      setConfigAerodromo({ ...CONFIG_INICIAL, ...(configAntiga || {}) });
      setRespostasPorNorma((prev) => ({
        ...prev,
        RBAC153: respostasAntigas || {},
      }));
      setMensagemBase(
        "Dados antigos encontrados e carregados como inspeção temporária. Clique em 'Salvar inspeção' para gravar no novo modelo online por aeródromo."
      );
    }

    return () => {
      cancelarSessao?.();
      cancelarUsuarios?.();
      cancelarInspecoes?.();
    };
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.usuarios, JSON.stringify(usuarios));
  }, [usuarios]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.inspecoes, JSON.stringify(inspecoes));
  }, [inspecoes]);

  useEffect(() => {
    if (usuarioLogado) {
      sessionStorage.setItem(STORAGE_KEYS.usuarioLogado, JSON.stringify(usuarioLogado));
    } else {
      sessionStorage.removeItem(STORAGE_KEYS.usuarioLogado);
      localStorage.removeItem(STORAGE_KEYS.usuarioLogado);
    }
  }, [usuarioLogado]);

  async function carregarBaseSeNecessario() {
    if (baseANAC.length > 0) return baseANAC;

    setMensagemBase("Carregando base ANAC de apoio...");
    const dados = await atualizarBaseANAC();

    if (Array.isArray(dados)) {
      setBaseANAC(dados);
      localStorage.setItem(STORAGE_KEYS.baseANAC, JSON.stringify(dados));
      return dados;
    }

    return [];
  }

  function aplicarConfigAerodromo(novaConfig) {
    setConfigAerodromo((prev) => ({ ...prev, ...novaConfig }));
    setIcao(novaConfig.icao || "");
  }

  async function aplicarAerodromoPorICAO(codigoInformado) {
    try {
      const codigo = limparTexto(codigoInformado);
      if (codigo.length !== 4) return;

      const consolidado = buscarAerodromoConsolidado(codigo);

      if (consolidado) {
        const config = montarConfigDoConsolidado(consolidado);
        aplicarConfigAerodromo(config);
        setNormaSelecionada("RBAC153");
        setMensagemBase(
          `${config.nomeAerodromo} | ${
            config.classificacaoRBAC153 || config.classeRBAC153
          } | RBAC 154 ${config.codigoReferenciaRBAC154} | RBAC 107 ${
            config.categoriaRBAC107
          }`
        );
        return;
      }

      const base = await carregarBaseSeNecessario();
      const aero = buscarAerodromoPorICAO(base, codigo);

      if (!aero) {
        setMensagemBase(`Aeródromo ${codigo} não encontrado na base disponível.`);
        return;
      }

      const normalizado = normalizarAerodromoBruto(aero, codigo);
      aplicarConfigAerodromo(normalizado);
      setNormaSelecionada("RBAC153");
      setMensagemBase(
        `${normalizado.nomeAerodromo} | ${
          normalizado.classificacaoRBAC153 || normalizado.classeRBAC153
        } | RBAC 154 ${normalizado.codigoReferenciaRBAC154} | RBAC 107 ${
          normalizado.categoriaRBAC107
        }`
      );
    } catch (erro) {
      console.error(erro);
      setMensagemBase("Erro ao aplicar aeródromo automaticamente.");
    }
  }

  useEffect(() => {
    const codigo = limparTexto(icao);
    if (codigo.length !== 4) return;

    const timer = setTimeout(() => {
      aplicarAerodromoPorICAO(codigo);
    }, 400);

    return () => clearTimeout(timer);
  }, [icao]);

  const normaAtual = NORMAS[normaSelecionada] || { itens: [] };

  function itensAplicaveisDaNorma(normaId) {
    const norma = NORMAS[normaId] || { itens: [] };

    if (normaId === "VCP") {
      return (norma.itens || []).filter((item) => {
        const id = String(item.id || "");
        return !id.startsWith("1.") && id !== "5.1";
      });
    }

    if (normaId === "INFRA") {
      return gerarChecklistInfra(norma.itens || [], configAerodromo).filter(
        (item) => item.aplicavel !== false
      );
    }

    return (norma.itens || []).filter((item) =>
      verificarAplicabilidadePorNorma(normaId, item, configAerodromo)
    );
  }

  const itensAplicaveis = useMemo(() => itensAplicaveisDaNorma(normaSelecionada), [normaSelecionada, configAerodromo]);

  const itensVisiveis = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    if (!termo) return itensAplicaveis;

    return itensAplicaveis.filter((item) =>
      [item.ref, item.id, item.subparte, item.grupo, item.item, item.titulo, item.descricao, item.criterio, item.evidencias, item.risco, item.criticidade]
        .join(" ")
        .toLowerCase()
        .includes(termo)
    );
  }, [itensAplicaveis, busca]);

  function calcularResumoNorma(normaId, config = configAerodromo, respostasBase = respostasPorNorma[normaId] || {}) {
    const norma = NORMAS[normaId] || { itens: [] };
    const itens = (norma.itens || []).filter((item) =>
      verificarAplicabilidadePorNorma(normaId, item, config)
    );
    const contagem = STATUS.reduce((acc, status) => {
      acc[status] = 0;
      return acc;
    }, {});

    itens.forEach((item) => {
      const chave = item.id || item.ref;
      const status = respostasBase[chave]?.status || "NÃO VERIFICADO";
      contagem[status]++;
    });

    const respondidos = itens.filter((item) => {
      const chave = item.id || item.ref;
      const status = respostasBase[chave]?.status || "NÃO VERIFICADO";
      return status !== "NÃO VERIFICADO";
    }).length;

    return {
      total: itens.length,
      respondidos,
      percentual: itens.length ? Math.round((respondidos / itens.length) * 100) : 0,
      contagem,
    };
  }

  const resumo = useMemo(
    () => calcularResumoNorma(normaSelecionada),
    [normaSelecionada, configAerodromo, respostasPorNorma]
  );

  const resumoTecnicoInfra = useMemo(() => {
    if (normaSelecionada !== "INFRA") return null;
    return gerarResumoTecnicoInfra(configAerodromo);
  }, [normaSelecionada, configAerodromo]);

  const resumoGeral = useMemo(() => {
    const base = STATUS.reduce((acc, status) => {
      acc[status] = 0;
      return acc;
    }, {});

    let total = 0;
    let respondidos = 0;

    NORMAS_IDS.forEach((normaId) => {
      const r = calcularResumoNorma(normaId);
      total += r.total;
      respondidos += r.respondidos;
      STATUS.forEach((status) => {
        base[status] += r.contagem[status] || 0;
      });
    });

    return {
      total,
      respondidos,
      percentual: total ? Math.round((respondidos / total) * 100) : 0,
      contagem: base,
    };
  }, [configAerodromo, respostasPorNorma]);

  const minhasInspecoes = useMemo(() => {
    if (!usuarioLogado?.id) return [];
    return inspecoes
      .filter((insp) => insp.usuarioId === usuarioLogado.id)
      .sort((a, b) => String(b.atualizadoEm).localeCompare(String(a.atualizadoEm)));
  }, [inspecoes, usuarioLogado]);

  const estatisticasAdmin = useMemo(() => {
    const totalUsuarios = usuarios.length;
    const pendentes = usuarios.filter((u) => u.ativo === false && u.statusCadastro !== "bloqueado").length;
    const bloqueados = usuarios.filter((u) => u.statusCadastro === "bloqueado").length;
    const ativos = usuarios.filter((u) => u.ativo !== false).length;
    const admins = usuarios.filter((u) => ehAdmin(u)).length;
    const concluidas = inspecoes.filter((i) => i.statusGeral === "concluida").length;

    return {
      totalUsuarios,
      ativos,
      pendentes,
      bloqueados,
      admins,
      totalInspecoes: inspecoes.length,
      concluidas,
      emAndamento: inspecoes.length - concluidas,
    };
  }, [usuarios, inspecoes]);

  const inspecoesUsuarioAdmin = useMemo(() => {
    if (!adminUsuarioSelecionado) return [];
    return inspecoes
      .filter((insp) => insp.usuarioId === adminUsuarioSelecionado)
      .sort((a, b) => String(b.atualizadoEm).localeCompare(String(a.atualizadoEm)));
  }, [inspecoes, adminUsuarioSelecionado]);

  function atualizarResposta(item, campo, valor) {
    const chave = item.id || item.ref;

    setRespostasPorNorma((prev) => ({
      ...prev,
      [normaSelecionada]: {
        ...(prev[normaSelecionada] || {}),
        [chave]: {
          ...(prev[normaSelecionada]?.[chave] || {}),
          [campo]: valor,
        },
      },
    }));
  }

  function atualizarIdentificacaoVCP(id, valor) {
    setRespostasPorNorma((prev) => ({
      ...prev,
      VCP: {
        ...(prev.VCP || {}),
        [id]: {
          ...(prev.VCP?.[id] || {}),
          valorIdentificacao: valor,
          status: "CONFORME",
        },
      },
    }));
  }

  function valorIdentificacaoVCP(id, fallback = "") {
    const salvo = respostasPorNorma.VCP?.[id]?.valorIdentificacao;
    if (salvo !== undefined && salvo !== null && salvo !== "") return salvo;
    return fallback || "";
  }

  function aplicarClassificacaoVCP(item, nota) {
    const statusAutomatico = Number(nota) <= 2 ? "NÃO CONFORME" : "CONFORME";
    const chave = item.id || item.ref;

    setRespostasPorNorma((prev) => ({
      ...prev,
      VCP: {
        ...(prev.VCP || {}),
        [chave]: {
          ...(prev.VCP?.[chave] || {}),
          classificacaoVCP: nota,
          status: statusAutomatico,
          responsavel: prev.VCP?.[chave]?.responsavel || usuarioLogado?.nomeCompleto || "",
        },
      },
    }));
  }

  function renderFichaIdentificacaoVCP() {
    const linha = (id, titulo, valor, tipo = "input", extraStyle = {}) => (
      <tr key={id}>
        <td style={vcpStyles.numero}>{id}</td>
        <td style={vcpStyles.tema}>{titulo}</td>
        <td style={vcpStyles.valor}>
          {tipo === "textarea" ? (
            <textarea
              value={valorIdentificacaoVCP(id, valor)}
              onChange={(e) => atualizarIdentificacaoVCP(id, e.target.value)}
              style={{ ...vcpStyles.campoTexto, minHeight: extraStyle.minHeight || 54 }}
              placeholder="Preenchimento manual"
            />
          ) : tipo === "select" ? (
            <select
              value={valorIdentificacaoVCP(id, valor)}
              onChange={(e) => atualizarIdentificacaoVCP(id, e.target.value)}
              style={vcpStyles.campoInput}
            >
              <option value="">Selecionar</option>
              <option value="SIM">SIM</option>
              <option value="NÃO">NÃO</option>
            </select>
          ) : (
            <input
              value={valorIdentificacaoVCP(id, valor)}
              onChange={(e) => atualizarIdentificacaoVCP(id, e.target.value)}
              style={vcpStyles.campoInput}
              placeholder="Preenchimento manual"
            />
          )}
        </td>
      </tr>
    );

    return (
      <section style={vcpStyles.fichaBox}>
        <h2 style={vcpStyles.tituloPrincipal}>1&nbsp;&nbsp; Identificação do Aeroporto</h2>

        <table style={vcpStyles.tabela}>
          <tbody>
            <tr><th colSpan="3" style={vcpStyles.subtitulo}>1.1 Informações Gerais</th></tr>
            {linha("1.1.1", "Aeroporto", configAerodromo.nomeAerodromo || "")}
            {linha("1.1.2", "Cidade/Estado", `${configAerodromo.municipio || ""}${configAerodromo.uf ? ` - ${configAerodromo.uf}` : ""}`)}
            {linha("1.1.3", "Data", new Date().toLocaleDateString("pt-BR"))}
            {linha("1.1.4", "Equipe da visita", usuarioLogado?.nomeCompleto || "", "textarea")}
            {linha("1.1.5", "Representantes dos aeroportos (incluindo cargos)", configAerodromo.representantesAeroporto || "", "textarea")}
          </tbody>
        </table>

        <table style={{ ...vcpStyles.tabela, marginTop: 22 }}>
          <tbody>
            <tr><th colSpan="3" style={vcpStyles.subtitulo}>1.2 Informações Específicas</th></tr>
            {linha("1.2.1", "Tipo de operação (geral/comercial)", `${configAerodromo.tipoOperacao || ""}${configAerodromo.operacaoNoturna ? " / Noturna" : ""}`)}
            {linha("1.2.2", "Código / Faixa PAN", codigoFaixaPANAtual, "textarea")}
            {linha("1.2.3", "PPD (comprimento x largura)", `${configAerodromo.comprimentoPista || ""} m x ${configAerodromo.larguraPista || ""} m`)}
            {linha("1.2.4", "Aeronave crítica", configAerodromo.aeronaveCritica || "")}
            {linha("1.2.6", "Horário de funcionamento do aeroporto", configAerodromo.horarioFuncionamento || "")}
            {linha("1.2.7", "Aeroporto certificado?", configAerodromo.aeroportoCertificado || "", "select")}
            {linha("1.2.8", "Itens específicos", configAerodromo.itensEspecificosVCP || "", "textarea", { minHeight: 86 })}
          </tbody>
        </table>

        {panInfo && (
          <div style={vcpStyles.panBox}>
            <strong>Base oficial PAN:</strong> {panInfo.prioridadePAN} • {panInfo.faixaPAN} • CAPEX {panInfo.capexEstimadoFinal}
            <br />
            <span>{panInfo.infraestruturaAlvo}</span>
          </div>
        )}
      </section>
    );
  }

  function renderCardVCP(item, index) {
    const chave = item.id || item.ref || `VCP-${index}`;
    const resposta = respostasPorNorma.VCP?.[chave] || {};
    const nota = Number(resposta.classificacaoVCP || 0);
    const statusAtual = resposta.status || "NÃO VERIFICADO";
    const itemSemClassificacao = String(item.id || "") === "4.7";

    const tituloItem = item.titulo || item.item || "Item VCP";
    const descricaoItem = item.descricao || "";

    if (isMobileVCP) {
      return (
        <article
          key={chave}
          style={{
            background: "rgba(255,255,255,0.98)",
            color: "#0f172a",
            borderRadius: 18,
            overflow: "hidden",
            marginBottom: 18,
            border: "1px solid rgba(15,23,42,0.18)",
            boxShadow: "0 12px 28px rgba(0,0,0,0.18)",
            width: "100%",
          }}
        >
          <div
            style={{
              background: "linear-gradient(135deg, #111827, #2f3a40)",
              color: "#ffffff",
              padding: "14px 16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
            }}
          >
            <strong style={{ fontSize: 18 }}>Item {item.id}</strong>
            <span className={`status-pill ${classeStatus(statusAtual)}`}>{statusAtual}</span>
          </div>

          <div style={{ padding: 16, background: "#ffffff" }}>
            <strong style={{ display: "block", fontSize: 19, lineHeight: 1.25, marginBottom: 10 }}>
              {tituloItem}
            </strong>
            <p style={{ margin: "0 0 16px", fontSize: 16, lineHeight: 1.5 }}>{descricaoItem}</p>

            {!itemSemClassificacao && (
              <div style={{ marginTop: 14, marginBottom: 16 }}>
                <strong style={{ display: "block", marginBottom: 8 }}>Classificação:</strong>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(5, 1fr)",
                    gap: 8,
                    width: "100%",
                  }}
                >
                  {[1, 2, 3, 4, 5].map((valor) => (
                    <button
                      key={valor}
                      type="button"
                      onClick={() => aplicarClassificacaoVCP(item, valor)}
                      style={{
                        minHeight: 46,
                        borderRadius: 16,
                        border: "1px solid #111827",
                        background: nota >= valor ? "#10b981" : "#ffffff",
                        cursor: "pointer",
                        padding: 0,
                      }}
                      title={`Classificação ${valor}`}
                    />
                  ))}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, fontWeight: 900, marginTop: 5 }}>
                  <span>Ruim</span>
                  <span>Ótimo</span>
                </div>
              </div>
            )}

            {itemSemClassificacao && (
              <div style={{ ...vcpStyles.panBox, marginBottom: 14 }}>
                <strong>Registro livre de achados:</strong><br />
                Use este item para registrar riscos, pontos críticos, oportunidades de melhoria ou fatos relevantes que não apareceram nas perguntas anteriores.
              </div>
            )}

            {item.referenciaNormativa?.length > 0 && (
              <small style={{ display: "block", color: "#475569", fontWeight: 800, marginBottom: 16 }}>
                Referência de apoio: {item.referenciaNormativa.join(" • ")}
              </small>
            )}
          </div>

          <div style={{ padding: 16, background: "#ffffff", borderTop: "1px solid rgba(15,23,42,0.14)" }}>
            {itemSemClassificacao && (
              <div className="status-row" style={{ marginTop: 0, marginBottom: 12 }}>
                {["NÃO VERIFICADO", "CONFORME", "NÃO CONFORME"].map((status) => {
                  const ativo = statusAtual === status;
                  const classe = classeStatus(status);
                  return (
                    <button
                      key={status}
                      type="button"
                      className={ativo ? `status-btn ${classe} active` : `status-btn ${classe}`}
                      onClick={() => atualizarResposta(item, "status", status)}
                    >
                      {status}
                    </button>
                  );
                })}
              </div>
            )}

            <label style={{ ...vcpStyles.labelVCP, marginTop: 0 }}>
              Condição atual
              <textarea
                value={resposta.condicaoAtual || ""}
                onChange={(e) => atualizarResposta(item, "condicaoAtual", e.target.value)}
                placeholder={itemSemClassificacao ? "Descreva o item identificado, risco, oportunidade, achado relevante ou ponto crítico observado na visita." : "Descreva a condição atual observada em campo. Ex.: cerca íntegra, trechos danificados, ausência de barreira, pavimento com trincas..."}
                style={{ ...vcpStyles.textareaVCP, minHeight: 145, fontSize: 16 }}
              />
            </label>

            <div className="evidencias-box" style={{ marginTop: 14 }}>
              <strong>Fotos da condição atual</strong>
              <p>Adicione fotos tiradas na hora ou selecione imagens da galeria do celular.</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 10 }}>
                <label className="upload-evidencia" style={{ width: "100%" }}>
                  📷 Tirar foto
                  <input type="file" accept="image/*" capture="environment" onChange={(e) => { adicionarEvidencias(item, e.target.files); limparInputArquivo(e); }} />
                </label>
                <label className="upload-evidencia" style={{ width: "100%" }}>
                  🖼 Anexar da galeria
                  <input type="file" accept="image/*" multiple onChange={(e) => { adicionarEvidencias(item, e.target.files); limparInputArquivo(e); }} />
                </label>
              </div>
              {resposta.evidenciasAnexadas?.length > 0 && (
                <div className="preview-evidencias">
                  {resposta.evidenciasAnexadas.map((ev, indexEv) => (
                    <div className="preview-card" key={`${ev.nome}-${indexEv}`}>
                      <img src={obterUrlImagemEvidencia(ev)} alt={ev.nome} />
                      {ev.latitude && ev.longitude && (
                        <small>GPS: {Number(ev.latitude).toFixed(5)}, {Number(ev.longitude).toFixed(5)}</small>
                      )}
                      <button type="button" onClick={() => baixarEvidenciaNoDispositivo(ev, `${configAerodromo.icao || "VELOX"}-${chave}-${indexEv + 1}.jpg`)}>Salvar foto no celular</button>
                      <button type="button" onClick={() => removerEvidencia(item, indexEv)}>Remover</button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <label style={vcpStyles.labelVCP}>
              Observação
              <textarea
                value={resposta.obs || ""}
                onChange={(e) => atualizarResposta(item, "obs", e.target.value)}
                placeholder="Campo complementar técnico, recomendações, pendências e comentários da visita."
                style={{ ...vcpStyles.textareaVCP, minHeight: 145, fontSize: 16 }}
              />
            </label>

            <div className="grid field-grid" style={{ marginTop: 10 }}>
              <div className="col-12">
                <label>
                  Responsável
                  <input
                    value={resposta.responsavel || usuarioLogado?.nomeCompleto || ""}
                    onChange={(e) => atualizarResposta(item, "responsavel", e.target.value)}
                    placeholder="Responsável"
                  />
                </label>
              </div>
              <div className="col-12">
                <label>
                  Prazo
                  <select value={resposta.prazo || ""} onChange={(e) => atualizarResposta(item, "prazo", e.target.value)}>
                    <option value="">Não definido</option>
                    <option>IMEDIATO</option>
                    <option>CURTO PRAZO</option>
                    <option>MÉDIO PRAZO</option>
                    <option>LONGO PRAZO</option>
                  </select>
                </label>
              </div>
            </div>
          </div>
        </article>
      );
    }

    return (
      <article key={chave} style={vcpStyles.cardOperacional}>
        <div style={vcpStyles.cardCabecalho}>
          <span>Nº do item</span>
          <span>Tema</span>
          <span>Condição atual</span>
        </div>

        <div style={vcpStyles.cardConteudo}>
          <div style={vcpStyles.numeroGrande}>{item.id}</div>
          <div style={vcpStyles.blocoPergunta}>
            <strong style={vcpStyles.temaCard}>{tituloItem}</strong>
            <p style={vcpStyles.perguntaCard}>{descricaoItem}</p>

            {!itemSemClassificacao && (
              <div style={vcpStyles.classificacaoBox}>
                <strong>Classificação:</strong>
                <div style={vcpStyles.quadradosLinha}>
                  {[1, 2, 3, 4, 5].map((valor) => (
                    <button
                      key={valor}
                      type="button"
                      onClick={() => aplicarClassificacaoVCP(item, valor)}
                      style={{
                        ...vcpStyles.quadrado,
                        ...(nota >= valor ? vcpStyles.quadradoAtivo : {}),
                      }}
                      title={`Classificação ${valor}`}
                    />
                  ))}
                </div>
                <div style={vcpStyles.escalaLinha}>
                  <span>Ruim</span>
                  <span>Ótimo</span>
                </div>
              </div>
            )}

            {itemSemClassificacao && (
              <div style={vcpStyles.panBox}>
                <strong>Registro livre de achados:</strong><br />
                Use este item para registrar riscos, pontos críticos, oportunidades de melhoria ou fatos relevantes que não apareceram nas perguntas anteriores.
              </div>
            )}

            {item.referenciaNormativa?.length > 0 && (
              <small style={vcpStyles.referencia}>Referência de apoio: {item.referenciaNormativa.join(" • ")}</small>
            )}
          </div>

          <div style={vcpStyles.blocoCondicao}>
            <span className={`status-pill ${classeStatus(statusAtual)}`}>{statusAtual}</span>

            {itemSemClassificacao && (
              <div className="status-row" style={{ marginTop: 10, marginBottom: 10 }}>
                {["NÃO VERIFICADO", "CONFORME", "NÃO CONFORME"].map((status) => {
                  const ativo = statusAtual === status;
                  const classe = classeStatus(status);
                  return (
                    <button
                      key={status}
                      type="button"
                      className={ativo ? `status-btn ${classe} active` : `status-btn ${classe}`}
                      onClick={() => atualizarResposta(item, "status", status)}
                    >
                      {status}
                    </button>
                  );
                })}
              </div>
            )}

            <label style={vcpStyles.labelVCP}>
              Condição atual
              <textarea
                value={resposta.condicaoAtual || ""}
                onChange={(e) => atualizarResposta(item, "condicaoAtual", e.target.value)}
                placeholder={itemSemClassificacao ? "Descreva o item identificado, risco, oportunidade, achado relevante ou ponto crítico observado na visita." : "Descreva a condição atual observada em campo. Ex.: cerca íntegra, trechos danificados, ausência de barreira, pavimento com trincas..."}
                style={vcpStyles.textareaVCP}
              />
            </label>

            <div className="evidencias-box" style={{ marginTop: 10 }}>
              <strong>Fotos da condição atual</strong>
              <p>Adicione fotos tiradas na hora ou selecione imagens da galeria do celular.</p>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <label className="upload-evidencia">
                  📷 Tirar foto
                  <input type="file" accept="image/*" capture="environment" onChange={(e) => { adicionarEvidencias(item, e.target.files); limparInputArquivo(e); }} />
                </label>
                <label className="upload-evidencia">
                  🖼 Anexar da galeria
                  <input type="file" accept="image/*" multiple onChange={(e) => { adicionarEvidencias(item, e.target.files); limparInputArquivo(e); }} />
                </label>
              </div>
              {resposta.evidenciasAnexadas?.length > 0 && (
                <div className="preview-evidencias">
                  {resposta.evidenciasAnexadas.map((ev, indexEv) => (
                    <div className="preview-card" key={`${ev.nome}-${indexEv}`}>
                      <img src={obterUrlImagemEvidencia(ev)} alt={ev.nome} />
                      {ev.latitude && ev.longitude && (
                        <small>GPS: {Number(ev.latitude).toFixed(5)}, {Number(ev.longitude).toFixed(5)}</small>
                      )}
                      <button type="button" onClick={() => baixarEvidenciaNoDispositivo(ev, `${configAerodromo.icao || "VELOX"}-${chave}-${indexEv + 1}.jpg`)}>Salvar foto no celular</button>
                      <button type="button" onClick={() => removerEvidencia(item, indexEv)}>Remover</button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <label style={vcpStyles.labelVCP}>
              Observação
              <textarea
                value={resposta.obs || ""}
                onChange={(e) => atualizarResposta(item, "obs", e.target.value)}
                placeholder="Campo complementar técnico, recomendações, pendências e comentários da visita."
                style={vcpStyles.textareaVCP}
              />
            </label>

            <div className="grid field-grid" style={{ marginTop: 10 }}>
              <div className="col-6">
                <label>Responsável<input value={resposta.responsavel || usuarioLogado?.nomeCompleto || ""} onChange={(e) => atualizarResposta(item, "responsavel", e.target.value)} placeholder="Responsável" /></label>
              </div>
              <div className="col-6">
                <label>Prazo<select value={resposta.prazo || ""} onChange={(e) => atualizarResposta(item, "prazo", e.target.value)}><option value="">Não definido</option><option>IMEDIATO</option><option>CURTO PRAZO</option><option>MÉDIO PRAZO</option><option>LONGO PRAZO</option></select></label>
              </div>
            </div>
          </div>
        </div>
      </article>
    );
  }

  function renderFinalizacaoVCP() {
    const itemFinal = { id: "VCP-FINALIZACAO" };
    const resposta = respostasPorNorma.VCP?.[itemFinal.id] || {};

    return (
      <section style={vcpStyles.fichaBox}>
        <h2 style={vcpStyles.tituloPrincipal}>Finalização do Relatório VCP</h2>
        <div className="grid field-grid">
          <div className="col-6">
            <label style={vcpStyles.labelVCP}>
              Responsável pela visita
              <input
                value={resposta.responsavelVisita || usuarioLogado?.nomeCompleto || ""}
                onChange={(e) => atualizarResposta(itemFinal, "responsavelVisita", e.target.value)}
                placeholder="Responsável pela visita"
              />
            </label>
          </div>
          <div className="col-6">
            <label style={vcpStyles.labelVCP}>
              Participantes adicionais
              <input
                value={resposta.participantesAdicionais || ""}
                onChange={(e) => atualizarResposta(itemFinal, "participantesAdicionais", e.target.value)}
                placeholder="Ex.: representante do aeroporto, operador, equipe técnica..."
              />
            </label>
          </div>
          <div className="col-12">
            <label style={vcpStyles.labelVCP}>
              Observações finais da visita
              <textarea
                value={resposta.obsFinal || ""}
                onChange={(e) => atualizarResposta(itemFinal, "obsFinal", e.target.value)}
                placeholder="Registre observações finais, encaminhamentos e pontos de atenção para o relatório."
                style={vcpStyles.textareaVCP}
              />
            </label>
          </div>
        </div>
      </section>
    );
  }

  function atualizarCampoConfig(campo, valor) {
    setConfigAerodromo((prev) => {
      const novo = { ...prev, [campo]: valor };

      if (campo === "passageirosAno" || campo === "usoPublico") {
        novo.classeRBAC153 = classificarRBAC153(
          campo === "passageirosAno" ? valor : novo.passageirosAno,
          campo === "usoPublico" ? valor : novo.usoPublico
        );
        novo.classificacaoRBAC153 = novo.classeRBAC153;
      }

      if (campo === "comprimentoPista") {
        novo.codigoNumero = classificarCodigoNumero(valor);
        novo.codigoReferenciaRBAC154 = `${novo.codigoNumero}${novo.codigoLetra}`;
      }

      if (campo === "codigoNumero" || campo === "codigoLetra") {
        novo.codigoReferenciaRBAC154 = `${novo.codigoNumero}${novo.codigoLetra}`;
      }

      return novo;
    });
  }

  async function capturarGeolocalizacaoEvidencia() {
    if (!navigator.geolocation) {
      return {
        disponivel: false,
        mensagem: "Geolocalização não suportada pelo navegador.",
        criadoEm: new Date().toISOString(),
      };
    }

    try {
      const posicao = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 12000,
          maximumAge: 0,
        });
      });

      const latitude = Number(posicao.coords.latitude);
      const longitude = Number(posicao.coords.longitude);
      const precisao = Number(posicao.coords.accuracy || 0);

      return {
        disponivel: true,
        latitude,
        longitude,
        precisao,
        altitude: posicao.coords.altitude ?? null,
        capturadoEm: new Date(posicao.timestamp || Date.now()).toISOString(),
        linkMaps: `https://www.google.com/maps?q=${latitude},${longitude}`,
      };
    } catch (erro) {
      return {
        disponivel: false,
        mensagem:
          erro?.code === 1
            ? "Localização não autorizada pelo usuário."
            : "Não foi possível obter a localização no momento da foto.",
        criadoEm: new Date().toISOString(),
      };
    }
  }

  async function adicionarEvidencias(item, arquivos) {
    const chave = item.id || item.ref;
    const listaArquivos = Array.from(arquivos || []).filter((arquivo) =>
      String(arquivo?.type || "").startsWith("image/")
    );
    if (!listaArquivos.length) return;

    const geolocalizacao = await capturarGeolocalizacaoEvidencia();

    for (const arquivo of listaArquivos) {
      const agora = new Date().toISOString();
      let previewBase64 = "";
      let uploadResultado = null;
      let erroUpload = null;

      try {
        previewBase64 = await arquivoParaBase64(arquivo);
      } catch (erro) {
        console.error("Erro ao gerar preview local da imagem:", erro);
        alert("Não foi possível ler a imagem selecionada.");
        continue;
      }

      try {
        uploadResultado = await enviarEvidenciaParaStorage({
          arquivo,
          usuario: usuarioLogado,
          inspecaoId: inspecaoAtualId || `TEMP-${Date.now()}`,
          icao: configAerodromo.icao || icao || "SEM-ICAO",
          normaId: normaSelecionada,
          itemId: chave,
          previewLocal: previewBase64,
          geolocalizacao,
          latitude: geolocalizacao?.latitude ?? null,
          longitude: geolocalizacao?.longitude ?? null,
          precisaoGPS: geolocalizacao?.precisao ?? null,
          linkMaps: geolocalizacao?.linkMaps || "",
          responsavel: usuarioLogado?.nomeCompleto || "",
        });
      } catch (erro) {
        erroUpload = erro;
        console.warn("Imagem mantida no aparelho; upload online falhou:", erro);
      }

      const evidenciaNova = {
        id: `EV-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        nome: arquivo.name || `foto-${Date.now()}.jpg`,
        tipo: arquivo.type || "image/jpeg",
        tamanho: arquivo.size || null,
        data: previewBase64,
        previewLocal: previewBase64,
        storagePath: uploadResultado?.storagePath || "",
        downloadURL: uploadResultado?.downloadURL || "",
        url: uploadResultado?.downloadURL || uploadResultado?.url || "",
        imagemSalvaOnline: Boolean(uploadResultado?.downloadURL || uploadResultado?.storagePath),
        pendenteUpload: Boolean(erroUpload),
        erroUpload: erroUpload ? mensagemErroFirebase(erroUpload) : "",
        criadoEm: agora,
        capturadoEm: agora,
        enviadoEm: uploadResultado?.enviadoEm || "",
        responsavel: usuarioLogado?.nomeCompleto || "",
        itemVinculado: chave,
        geolocalizacao,
        latitude: geolocalizacao?.latitude ?? null,
        longitude: geolocalizacao?.longitude ?? null,
        precisaoGPS: geolocalizacao?.precisao ?? null,
        linkMaps: geolocalizacao?.linkMaps || "",
      };

      setRespostasPorNorma((prev) => {
        const respostasNorma = prev[normaSelecionada] || {};
        const evidenciasAtuais = respostasNorma[chave]?.evidenciasAnexadas || [];

        return {
          ...prev,
          [normaSelecionada]: {
            ...respostasNorma,
            [chave]: {
              ...respostasNorma[chave],
              evidenciasAnexadas: [...evidenciasAtuais, evidenciaNova],
            },
          },
        };
      });
    }
  }

  function removerEvidencia(item, indexEvidencia) {
    const chave = item.id || item.ref;

    setRespostasPorNorma((prev) => {
      const respostasNorma = prev[normaSelecionada] || {};
      const evidenciasAtuais = respostasNorma[chave]?.evidenciasAnexadas || [];

      return {
        ...prev,
        [normaSelecionada]: {
          ...respostasNorma,
          [chave]: {
            ...respostasNorma[chave],
            evidenciasAnexadas: evidenciasAtuais.filter((_, index) => index !== indexEvidencia),
          },
        },
      };
    });
  }

  function limparRespostasNormaAtual() {
    if (!window.confirm(`Deseja limpar somente as respostas da ${normaAtual.nome}?`)) return;

    setRespostasPorNorma((prev) => ({
      ...prev,
      [normaSelecionada]: {},
    }));
  }

  function limparInspecaoAtual() {
    if (!window.confirm("Deseja limpar completamente a inspeção atual?")) return;
    setConfigAerodromo(CONFIG_INICIAL);
    setIcao("");
    setMensagemBase("");
    setBusca("");
    setRespostasPorNorma(criarRespostasNormas());
    setInspecaoAtualId(null);
    setNormaSelecionada("RBAC153");
  }

  function itemEntraNoRelatorio(status) {
    return status === "CONFORME" || status === "NÃO CONFORME";
  }

  function itensInspecionadosParaRelatorio(normaId) {
    const respostasNorma = respostasPorNorma[normaId] || {};

    return itensAplicaveisDaNorma(normaId).filter((item) => {
      const chave = item.id || item.ref;
      const status = respostasNorma[chave]?.status || "NÃO VERIFICADO";
      return itemEntraNoRelatorio(status);
    });
  }

  function calcularResumoRelatorio() {
    const resumoRelatorio = {
      total: 0,
      conforme: 0,
      naoConforme: 0,
      evidencias: 0,
      porNorma: {},
    };

    NORMAS_GERAIS_RELATORIO_IDS.forEach((normaId) => {
      const respostasNorma = respostasPorNorma[normaId] || {};
      const itens = itensInspecionadosParaRelatorio(normaId);

      const dadosNorma = {
        total: itens.length,
        conforme: 0,
        naoConforme: 0,
        evidencias: 0,
      };

      itens.forEach((item) => {
        const chave = item.id || item.ref;
        const resposta = respostasNorma[chave] || {};
        const status = resposta.status || "NÃO VERIFICADO";

        if (status === "CONFORME") {
          dadosNorma.conforme += 1;
          resumoRelatorio.conforme += 1;
        }

        if (status === "NÃO CONFORME") {
          dadosNorma.naoConforme += 1;
          resumoRelatorio.naoConforme += 1;
        }

        const totalEvidencias = (resposta.evidenciasAnexadas || []).length;
        dadosNorma.evidencias += totalEvidencias;
        resumoRelatorio.evidencias += totalEvidencias;
      });

      resumoRelatorio.total += dadosNorma.total;
      resumoRelatorio.porNorma[normaId] = dadosNorma;
    });

    return resumoRelatorio;
  }

  function montarEvidencias(todasNormas = true) {
    const lista = [];
    const normasParaLer = todasNormas ? NORMAS_GERAIS_RELATORIO_IDS : [normaSelecionada];

    normasParaLer.forEach((normaId) => {
      const norma = NORMAS[normaId] || { itens: [] };
      const respostasNorma = respostasPorNorma[normaId] || {};
      const itens = itensInspecionadosParaRelatorio(normaId);

      itens.forEach((item) => {
        const chave = item.id || item.ref;
        const resposta = respostasNorma[chave] || {};
        const status = resposta.status || "NÃO VERIFICADO";
        const imagens = Array.isArray(resposta.evidenciasAnexadas)
          ? resposta.evidenciasAnexadas
          : [];

        imagens.forEach((imagemOriginal) => {
          const imagem = normalizarImagemEvidenciaParaRelatorio(
            imagemOriginal,
            resposta,
            chave
          );

          lista.push({
            id: gerarIdEvidencia(lista.length),
            normaId,
            normaNome: norma.nome || normaId,
            itemId: chave,
            itemTitulo: item.item || item.titulo || item.descricao || "Item de inspeção",
            requisito: item.criterio || "",
            observacao: resposta.obs || "",
            condicaoAtual: resposta.condicaoAtual || "",
            classificacaoVCP: resposta.classificacaoVCP || "",
            status,
            imagem,
            data: imagem.data || imagem.previewLocal || imagem.downloadURL || imagem.url || "",
            url: imagem.downloadURL || imagem.url || imagem.data || imagem.previewLocal || "",
            downloadURL: imagem.downloadURL || imagem.url || "",
            previewLocal: imagem.previewLocal || imagem.data || "",
            geolocalizacao: imagem.geolocalizacao || null,
            latitude: imagem.latitude ?? null,
            longitude: imagem.longitude ?? null,
            precisaoGPS: imagem.precisaoGPS ?? null,
            linkMaps: imagem.linkMaps || "",
            capturadoEm: imagem.capturadoEm || imagem.criadoEm || "",
            responsavel: imagem.responsavel || resposta.responsavel || usuarioLogado?.nomeCompleto || "",
          });
        });
      });
    });

    return lista;
  }

  function criarObjetoInspecao(idExistente = inspecaoAtualId) {
    const agora = new Date().toISOString();
    const existente = idExistente ? inspecoes.find((insp) => insp.id === idExistente) : null;
    const resumoAtual = resumoGeral;

    return {
      id: idExistente || gerarId("INSP"),
      usuarioId: usuarioLogado.id,
      inspetorNome: usuarioLogado.nomeCompleto,
      aeroporto: criarSnapshotAeroporto(configAerodromo),
      configAerodromo,
      respostasPorNorma,
      criadoEm: existente?.criadoEm || agora,
      atualizadoEm: agora,
      statusGeral: resumoAtual.percentual >= 100 ? "concluida" : "em_andamento",
      percentualConcluido: resumoAtual.percentual,
      totalItens: resumoAtual.total,
      totalNaoConformidades: resumoAtual.contagem["NÃO CONFORME"] || 0,
      normas: NORMAS_IDS.reduce((acc, normaId) => {
        const r = calcularResumoNorma(normaId);
        acc[normaId] = {
          respostas: respostasPorNorma[normaId] || {},
          status: r.percentual >= 100 ? "concluida" : "em_andamento",
          percentualConcluido: r.percentual,
          totalItens: r.total,
        };
        return acc;
      }, {}),
    };
  }

  async function salvarInspecaoAtual() {
    if (!usuarioLogado) {
      alert("Faça login para salvar a inspeção.");
      return null;
    }

    if (!configAerodromo.icao && !configAerodromo.nomeAerodromo) {
      alert("Informe ou carregue um aeródromo antes de salvar a inspeção.");
      return null;
    }

    const objeto = criarObjetoInspecao(inspecaoAtualId);
    const proximaLista = mesclarInspecoesPorAtualizacao([objeto], inspecoes);

    setInspecoes(proximaLista);
    localStorage.setItem(STORAGE_KEYS.inspecoes, JSON.stringify(proximaLista));
    setInspecaoAtualId(objeto.id);

    try {
      await salvarInspecaoFirebase(prepararInspecaoParaFirebase(objeto));
      setMensagemBase(`Inspeção salva e sincronizada: ${objeto.aeroporto.nome} (${objeto.aeroporto.icao || "sem ICAO"}).`);
    } catch (erro) {
      console.error(erro);
      setMensagemBase(`Inspeção salva neste aparelho, mas ainda não sincronizada online: ${mensagemErroFirebase(erro)}`);
      alert(`A inspeção foi salva no aparelho, mas não sincronizou online agora: ${mensagemErroFirebase(erro)}`);
    }

    return objeto;
  }

  async function novaInspecao() {
    const possuiConteudo =
      configAerodromo.icao ||
      configAerodromo.nomeAerodromo ||
      Object.values(respostasPorNorma).some((respostasNorma) => Object.keys(respostasNorma || {}).length > 0);

    if (possuiConteudo) {
      const deveSalvar = window.confirm("Deseja salvar a inspeção atual antes de iniciar uma nova?");
      if (deveSalvar) {
        const salva = await salvarInspecaoAtual();
        if (!salva) return;
      }
    }

    setConfigAerodromo(CONFIG_INICIAL);
    setIcao("");
    setMensagemBase("Nova inspeção iniciada. Carregue um aeroporto pelo código ICAO.");
    setBusca("");
    setRespostasPorNorma(criarRespostasNormas());
    setInspecaoAtualId(null);
    setNormaSelecionada("RBAC153");
  }

  function abrirInspecao(inspecao) {
    try {
      const configSalva = inspecao?.configAerodromo || {};
      const aeroportoSalvo = inspecao?.aeroporto || {};
      setInspecaoAtualId(inspecao.id);
      setConfigAerodromo({ ...CONFIG_INICIAL, ...configSalva });
      setIcao(aeroportoSalvo.icao || configSalva.icao || "");
      setRespostasPorNorma(reconstruirRespostasPorNorma(inspecao));
      setNormaSelecionada("RBAC153");
      setMensagemBase(`Inspeção aberta: ${aeroportoSalvo.nome || configSalva.nomeAerodromo || "Aeródromo"}.`);
      rolarParaConsultaICAO();
    } catch (erro) {
      console.error("Erro ao abrir inspeção:", erro);
      alert("Não foi possível abrir esta inspeção. O registro pode estar incompleto ou corrompido.");
    }
  }

  function duplicarInspecao(inspecao) {
    const agora = new Date().toISOString();
    const copia = {
      ...inspecao,
      id: gerarId("INSP"),
      criadoEm: agora,
      atualizadoEm: agora,
      statusGeral: "em_andamento",
      aeroporto: {
        ...(inspecao.aeroporto || {}),
        nome: `${inspecao.aeroporto?.nome || "Inspeção"} - Cópia`,
      },
    };
    setInspecoes((prev) => [copia, ...prev]);
    salvarInspecaoFirebase(prepararInspecaoParaFirebase(copia)).catch((erro) => {
      console.error(erro);
      alert(`Erro ao duplicar inspeção online: ${mensagemErroFirebase(erro)}`);
    });
    setMensagemBase("Inspeção duplicada com sucesso.");
  }

  function excluirInspecao(id) {
    if (!window.confirm("Deseja excluir esta inspeção salva? Esta ação não poderá ser desfeita.")) return;
    setInspecoes((prev) => prev.filter((insp) => insp.id !== id));
    excluirInspecaoFirebase(id).catch((erro) => {
      console.error(erro);
      alert(`Erro ao excluir inspeção online: ${mensagemErroFirebase(erro)}`);
    });
    if (inspecaoAtualId === id) limparInspecaoAtual();
  }

  function excluirTodasMinhasInspecoes() {
    if (!window.confirm("Deseja excluir TODAS as suas inspeções salvas?")) return;
    const usuarioId = usuarioLogado.id;
    setInspecoes((prev) => prev.filter((insp) => insp.usuarioId !== usuarioId));
    excluirInspecoesDoUsuarioFirebase(usuarioId).catch((erro) => {
      console.error(erro);
      alert(`Erro ao excluir inspeções online: ${mensagemErroFirebase(erro)}`);
    });
    limparInspecaoAtual();
  }

  async function limparTodasInspecoesSistemaAdminMaster() {
    if (!ehAdminMaster(usuarioLogado)) {
      alert("Somente o Admin Master pode limpar todas as inspeções do sistema.");
      return;
    }

    if (!inspecoes.length) {
      alert("Não há inspeções salvas para excluir.");
      return;
    }

    const primeiraConfirmacao = window.confirm(
      `ATENÇÃO: você está prestes a excluir TODAS as ${inspecoes.length} inspeções salvas de TODOS os usuários.\n\nUsuários, cadastros e Admin Master serão preservados. Deseja continuar?`
    );

    if (!primeiraConfirmacao) return;

    const textoConfirmacao = window.prompt(
      "Para confirmar a limpeza total das inspeções, digite exatamente: LIMPAR SISTEMA"
    );

    if (String(textoConfirmacao || "").trim().toUpperCase() !== "LIMPAR SISTEMA") {
      alert("Confirmação inválida. Nenhuma inspeção foi apagada.");
      return;
    }

    try {
      setMensagemBase("Limpando todas as inspeções do sistema...");

      await Promise.all(
        inspecoes
          .filter((insp) => insp?.id)
          .map((insp) => excluirInspecaoFirebase(insp.id))
      );

      setInspecoes([]);
      localStorage.setItem(STORAGE_KEYS.inspecoes, JSON.stringify([]));
      setInspecaoAtualId(null);
      setRespostasPorNorma(criarRespostasNormas());
      setMensagemBase("Limpeza total concluída. Todas as inspeções foram excluídas. Usuários preservados.");
      alert("Limpeza total concluída. Todas as inspeções foram excluídas do sistema.");
    } catch (erro) {
      console.error(erro);
      alert(`Erro ao limpar todas as inspeções: ${mensagemErroFirebase(erro)}`);
      setMensagemBase("Falha ao limpar todas as inspeções. Verifique o console e tente novamente.");
    }
  }

  async function fazerCadastro(e) {
    e.preventDefault();
    const email = normalizarEmail(authForm.email);
    const senhaCadastro = senhaLimpa(authForm.senha);
    const nomeCompleto = String(authForm.nomeCompleto || "").trim();
    const telefone = String(authForm.telefone || "").trim();
    const cpf = String(authForm.cpf || "").trim();

    if (!nomeCompleto || !email || !senhaCadastro) {
      alert("Preencha nome completo, e-mail e senha.");
      return;
    }

    if (!telefone || !cpf) {
      alert("Preencha telefone e CPF para solicitar acesso.");
      return;
    }

    if (senhaCadastro.length < 6) {
      alert("A senha deve ter pelo menos 6 caracteres para o Firebase Authentication.");
      return;
    }

    if (email === ADMIN_MASTER_EMAIL) {
      alert("Este e-mail já é o Admin Master oficial. Clique em Entrar e use a senha inicial 123456.");
      setModoAuth("login");
      return;
    }

    try {
      await cadastrarUsuarioFirebase({
        nomeCompleto,
        email,
        telefone,
        cpf,
        senha: senhaCadastro,
      });

      setAuthForm({ nomeCompleto: "", email: "", telefone: "", cpf: "", senha: "" });
      setMostrarSenha(false);
      alert("Cadastro enviado com sucesso. Aguarde aprovação do administrador Velox para acessar o sistema.");
      setModoAuth("login");
    } catch (erro) {
      console.error(erro);
      alert(mensagemErroFirebase(erro));
    }
  }

  async function fazerLogin(e) {
    e.preventDefault();
    const email = normalizarEmail(authForm.email);
    const senhaDigitada = senhaLimpa(authForm.senha);

    try {
      const usuario = await entrarUsuarioFirebase(email, senhaDigitada, {
        email: ADMIN_MASTER_EMAIL,
        senhaInicial: ADMIN_MASTER_SENHA_INICIAL,
        nomeCompleto: ADMIN_MASTER_NOME,
        telefone: ADMIN_MASTER_TELEFONE,
        cpf: ADMIN_MASTER_CPF,
      });

      if (!usuario) {
        alert("Usuário não encontrado.");
        return;
      }

      const usuarioSeguro = {
        ...usuario,
        id: usuario.id || usuario.uid,
        email: normalizarEmail(usuario.email),
      };

      if (usuarioSeguro.ativo === false) {
        await sairFirebase();
        alert(usuarioSeguro.statusCadastro === "bloqueado" ? "Usuário bloqueado pelo administrador." : "Cadastro pendente de aprovação pelo administrador Velox.");
        return;
      }

      setUsuarioLogado(usuarioSeguro);
      setAuthForm({ nomeCompleto: "", email: "", telefone: "", cpf: "", senha: "" });
      setMostrarSenha(false);
    } catch (erro) {
      console.error(erro);
      alert(mensagemErroFirebase(erro));
    }
  }

  async function sair() {
    if (!window.confirm("Deseja sair do sistema?")) return;
    try {
      await sairFirebase();
    } catch (erro) {
      console.error(erro);
    }
    sessionStorage.removeItem(STORAGE_KEYS.usuarioLogado);
    localStorage.removeItem(STORAGE_KEYS.usuarioLogado);
    setUsuarioLogado(null);
    setInspecaoAtualId(null);
    setConfigAerodromo(CONFIG_INICIAL);
    setRespostasPorNorma(criarRespostasNormas());
    setIcao("");
    setMensagemBase("");
  }

  function aprovarUsuario(usuarioId) {
    if (!ehAdmin(usuarioLogado)) return;
    const usuario = usuarios.find((u) => u.id === usuarioId);
    atualizarUsuarioFirebase(usuarioId, {
      ativo: true,
      statusCadastro: "aprovado",
      aprovadoEm: new Date().toISOString(),
    }).then(() => {
      if (usuario) alert(`Usuário ${usuario.nomeCompleto} aprovado. Ele deve entrar com o mesmo e-mail e senha cadastrados.`);
    }).catch((erro) => {
      console.error(erro);
      alert(`Erro ao aprovar usuário: ${mensagemErroFirebase(erro)}`);
    });
  }

  function bloquearUsuario(usuarioId) {
    if (!ehAdmin(usuarioLogado)) return;
    const usuario = usuarios.find((u) => u.id === usuarioId);
    if (!usuario || usuario.id === usuarioLogado.id) return;
    if (!window.confirm(`Deseja bloquear o acesso de ${usuario.nomeCompleto}?`)) return;

    atualizarUsuarioFirebase(usuarioId, {
      ativo: false,
      statusCadastro: "bloqueado",
      bloqueadoEm: new Date().toISOString(),
    }).catch((erro) => {
      console.error(erro);
      alert(`Erro ao bloquear usuário: ${mensagemErroFirebase(erro)}`);
    });
  }

  function desbloquearUsuario(usuarioId) {
    if (!ehAdmin(usuarioLogado)) return;
    const usuario = usuarios.find((u) => u.id === usuarioId);
    atualizarUsuarioFirebase(usuarioId, {
      ativo: true,
      statusCadastro: "aprovado",
      aprovadoEm: usuario?.aprovadoEm || new Date().toISOString(),
    }).catch((erro) => {
      console.error(erro);
      alert(`Erro ao desbloquear usuário: ${mensagemErroFirebase(erro)}`);
    });
  }

  function excluirUsuario(usuarioId) {
    if (!ehAdmin(usuarioLogado)) return;
    const usuario = usuarios.find((u) => u.id === usuarioId);
    if (!usuario || usuario.id === usuarioLogado.id) return;
    if (ehAdminMaster(usuario)) {
      alert("O Admin Master não pode ser excluído pelo painel.");
      return;
    }
    if (!window.confirm(`Excluir o usuário ${usuario.nomeCompleto} e todas as inspeções vinculadas a ele?`)) return;

    excluirUsuarioFirebase(usuarioId).catch((erro) => {
      console.error(erro);
      alert(`Erro ao excluir usuário: ${mensagemErroFirebase(erro)}`);
    });
    excluirInspecoesDoUsuarioFirebase(usuarioId).catch((erro) => console.error(erro));
    if (adminUsuarioSelecionado === usuarioId) setAdminUsuarioSelecionado("");
  }

  function resetarSenhaUsuario(usuarioId) {
    if (!ehAdmin(usuarioLogado)) return;
    const usuario = usuarios.find((u) => u.id === usuarioId);
    if (!usuario?.email) return;
    if (!window.confirm(`Enviar e-mail de redefinição de senha para ${usuario.email}?`)) return;

    enviarResetSenhaFirebase(usuario.email).then(() => {
      alert("E-mail de redefinição de senha enviado com sucesso.");
    }).catch((erro) => {
      console.error(erro);
      alert(`Erro ao enviar redefinição de senha: ${mensagemErroFirebase(erro)}`);
    });
  }

  function alternarTipoAdmin(usuarioId) {
    if (!ehAdminMaster(usuarioLogado)) {
      alert("Somente o Admin Master pode tornar outro usuário administrador.");
      return;
    }
    const usuario = usuarios.find((u) => u.id === usuarioId);
    if (!usuario || usuario.id === usuarioLogado.id) return;
    if (ehAdminMaster(usuario)) {
      alert("O Admin Master oficial não pode ser rebaixado.");
      return;
    }
    const usuarioEhAdmin = ehAdmin(usuario);
    const novoTipo = usuarioEhAdmin ? "inspetor" : "admin";
    if (!window.confirm(`Deseja transformar ${usuario.nomeCompleto} em ${novoTipo === "admin" ? "administrador" : "inspetor"}?`)) return;

    atualizarUsuarioFirebase(usuarioId, {
      tipo: novoTipo,
      adminMaster: false,
    }).catch((erro) => {
      console.error(erro);
      alert(`Erro ao alterar perfil: ${mensagemErroFirebase(erro)}`);
    });
  }


  function obterItensVCPParaRelatorio() {
    return itensAplicaveisDaNorma("VCP");
  }

  function obterRespostaVCP(item) {
    const chave = item.id || item.ref;
    return respostasPorNorma.VCP?.[chave] || {};
  }

  function obterIdentificacaoVCPParaRelatorio() {
    return [
      ["Aeroporto", valorIdentificacaoVCP("1.1.1", configAerodromo.nomeAerodromo || "")],
      ["Cidade/Estado", valorIdentificacaoVCP("1.1.2", `${configAerodromo.municipio || ""}${configAerodromo.uf ? ` - ${configAerodromo.uf}` : ""}`)],
      ["Data", valorIdentificacaoVCP("1.1.3", new Date().toLocaleDateString("pt-BR"))],
      ["Equipe da visita", valorIdentificacaoVCP("1.1.4", usuarioLogado?.nomeCompleto || "")],
      ["Representantes dos aeroportos", valorIdentificacaoVCP("1.1.5", configAerodromo.representantesAeroporto || "")],
      ["Tipo de operação", valorIdentificacaoVCP("1.2.1", `${configAerodromo.tipoOperacao || ""}${configAerodromo.operacaoNoturna ? " / Noturna" : ""}`)],
      ["Código / Faixa PAN", valorIdentificacaoVCP("1.2.2", codigoFaixaPANAtual)],
      ["PPD (comprimento x largura)", valorIdentificacaoVCP("1.2.3", `${configAerodromo.comprimentoPista || ""} m x ${configAerodromo.larguraPista || ""} m`)],
      ["Aeronave crítica", valorIdentificacaoVCP("1.2.4", configAerodromo.aeronaveCritica || "")],
      ["Horário de funcionamento", valorIdentificacaoVCP("1.2.6", configAerodromo.horarioFuncionamento || "")],
      ["Aeroporto certificado?", valorIdentificacaoVCP("1.2.7", configAerodromo.aeroportoCertificado || "")],
      ["Itens específicos", valorIdentificacaoVCP("1.2.8", configAerodromo.itensEspecificosVCP || "")],
    ];
  }

  function montarEvidenciasVCP() {
    const lista = [];

    obterItensVCPParaRelatorio().forEach((item) => {
      const chave = item.id || item.ref;
      const resposta = respostasPorNorma.VCP?.[chave] || {};
      const imagens = Array.isArray(resposta.evidenciasAnexadas)
        ? resposta.evidenciasAnexadas
        : [];

      imagens.forEach((imagemOriginal) => {
        const imagem = normalizarImagemEvidenciaParaRelatorio(
          imagemOriginal,
          resposta,
          chave
        );

        lista.push({
          id: gerarIdEvidencia(lista.length),
          normaId: "VCP",
          normaNome: "VCP",
          itemId: chave,
          itemTitulo: item.titulo || item.item || item.descricao || "Item VCP",
          descricao: item.descricao || "",
          observacao: resposta.obs || "",
          condicaoAtual: resposta.condicaoAtual || "",
          classificacaoVCP: resposta.classificacaoVCP || "",
          status: resposta.status || "NÃO VERIFICADO",
          imagem,
          data: imagem.data || imagem.previewLocal || imagem.downloadURL || imagem.url || "",
          url: imagem.downloadURL || imagem.url || imagem.data || imagem.previewLocal || "",
          downloadURL: imagem.downloadURL || imagem.url || "",
          previewLocal: imagem.previewLocal || imagem.data || "",
          geolocalizacao: imagem.geolocalizacao || null,
          latitude: imagem.latitude ?? null,
          longitude: imagem.longitude ?? null,
          precisaoGPS: imagem.precisaoGPS ?? null,
          linkMaps: imagem.linkMaps || "",
          capturadoEm: imagem.capturadoEm || imagem.criadoEm || "",
          responsavel: imagem.responsavel || resposta.responsavel || usuarioLogado?.nomeCompleto || "",
        });
      });
    });

    return lista;
  }

  async function exportarExcelVCP() {
    try {
      setGerandoRelatorio(true);
      // Não salva automaticamente durante a geração do XLS VCP.
      // Isso evita re-renderização pesada/Firestore durante o download do relatório.

      const workbook = new ExcelJS.Workbook();
      workbook.creator = "Velox Service";
      workbook.created = new Date();

      const logoBase64 = await urlParaBase64(logoVeloxRelatorio);
      const logoId = workbook.addImage({ base64: logoBase64, extension: extensaoImagem(logoBase64) });
      const itensVCP = obterItensVCPParaRelatorio();
      const evidencias = montarEvidenciasVCP();

      const wsIdentificacao = workbook.addWorksheet("Identificação VCP", {
        pageSetup: { paperSize: 9, orientation: "portrait" },
        headerFooter: { oddHeader: "&CRelatório VCP - Velox Service", oddFooter: "&LVELOX SERVICE&R&P de &N" },
      });
      wsIdentificacao.columns = [{ width: 34 }, { width: 90 }];
      wsIdentificacao.addImage(logoId, { tl: { col: 0.2, row: 0.2 }, ext: { width: 230, height: 63 } });
      wsIdentificacao.mergeCells("A5:B5");
      wsIdentificacao.getCell("A5").value = "RELATÓRIO DE INSPEÇÃO / VERIFICAÇÃO — VCP";
      wsIdentificacao.getCell("A5").font = { bold: true, size: 18, color: { argb: "FFFFFFFF" } };
      wsIdentificacao.getCell("A5").alignment = { horizontal: "center" };
      wsIdentificacao.getCell("A5").fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF129446" } };

      obterIdentificacaoVCPParaRelatorio().forEach(([campo, valor], index) => {
        const row = wsIdentificacao.getRow(index + 7);
        row.values = [campo, valor || "—"];
        row.getCell(1).font = { bold: true, color: { argb: "FF0F172A" } };
        row.eachCell((cell) => {
          cell.alignment = { vertical: "top", wrapText: true };
          cell.border = {
            top: { style: "thin", color: { argb: "FFD1D5DB" } },
            left: { style: "thin", color: { argb: "FFD1D5DB" } },
            bottom: { style: "thin", color: { argb: "FFD1D5DB" } },
            right: { style: "thin", color: { argb: "FFD1D5DB" } },
          };
          cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: index % 2 === 0 ? "FFF8FAFC" : "FFFFFFFF" } };
        });
      });

      if (panInfo) {
        const baseRow = wsIdentificacao.getRow(22);
        baseRow.values = ["Base PAN", `${panInfo.prioridadePAN} • ${panInfo.faixaPAN} • CAPEX ${panInfo.capexEstimadoFinal}`];
        wsIdentificacao.getRow(23).values = ["Infraestrutura alvo", panInfo.infraestruturaAlvo || "—"];
      }

      const finalizacao = respostasPorNorma.VCP?.["VCP-FINALIZACAO"] || {};
      wsIdentificacao.getRow(25).values = ["Responsável pela visita", finalizacao.responsavelVisita || usuarioLogado?.nomeCompleto || "—"];
      wsIdentificacao.getRow(26).values = ["Participantes adicionais", finalizacao.participantesAdicionais || "—"];
      wsIdentificacao.getRow(27).values = ["Observações finais", finalizacao.obsFinal || "—"];

      const wsCards = workbook.addWorksheet("Cards VCP", { views: [{ state: "frozen", ySplit: 1 }] });
      wsCards.columns = [
        { header: "Nº do item", key: "id", width: 14 },
        { header: "Tema", key: "tema", width: 34 },
        { header: "Pergunta / Verificação", key: "descricao", width: 58 },
        { header: "Condição atual", key: "condicaoAtual", width: 48 },
        { header: "Observação", key: "obs", width: 44 },
        { header: "Classificação", key: "classificacao", width: 16 },
        { header: "Status", key: "status", width: 18 },
        { header: "Responsável", key: "responsavel", width: 28 },
        { header: "Prazo", key: "prazo", width: 18 },
        { header: "Fotos vinculadas", key: "fotos", width: 24 },
      ];
      wsCards.getRow(1).eachCell((cell) => {
        cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF129446" } };
        cell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
      });

      itensVCP.forEach((item) => {
        const chave = item.id || item.ref;
        const resposta = obterRespostaVCP(item);
        const fotos = evidencias.filter((ev) => ev.itemId === chave).map((ev) => ev.id).join(", ");
        const itemSemClassificacao = String(item.id || "") === "4.7";
        const status = resposta.status || "NÃO VERIFICADO";
        const row = wsCards.addRow({
          id: chave,
          tema: item.titulo || item.item || "Item VCP",
          descricao: item.descricao || "",
          condicaoAtual: resposta.condicaoAtual || "",
          obs: resposta.obs || "",
          classificacao: itemSemClassificacao ? "Sem classificação" : resposta.classificacaoVCP ? `${resposta.classificacaoVCP}/5` : "—",
          status,
          responsavel: resposta.responsavel || usuarioLogado?.nomeCompleto || "",
          prazo: resposta.prazo || "",
          fotos: fotos || "Sem foto vinculada",
        });
        row.eachCell((cell) => {
          cell.alignment = { vertical: "top", wrapText: true };
          cell.border = {
            top: { style: "thin", color: { argb: "FFD1D5DB" } },
            left: { style: "thin", color: { argb: "FFD1D5DB" } },
            bottom: { style: "thin", color: { argb: "FFD1D5DB" } },
            right: { style: "thin", color: { argb: "FFD1D5DB" } },
          };
        });
        row.getCell(7).font = { bold: true, color: { argb: "FFFFFFFF" } };
        row.getCell(7).fill = { type: "pattern", pattern: "solid", fgColor: { argb: `FF${corStatus(status)}` } };
      });

      const wsFotos = workbook.addWorksheet("Fotos VCP", { headerFooter: { oddHeader: "&CFotos VCP - Velox Service", oddFooter: "&LRegistro Fotográfico VCP&R&P de &N" } });
      wsFotos.columns = [
        { header: "ID Foto", key: "id", width: 16 },
        { header: "Item", key: "itemId", width: 14 },
        { header: "Tema", key: "itemTitulo", width: 42 },
        { header: "Condição atual", key: "condicaoAtual", width: 48 },
        { header: "Observação", key: "observacao", width: 42 },
        { header: "Latitude", key: "latitude", width: 18 },
        { header: "Longitude", key: "longitude", width: 18 },
        { header: "Precisão GPS", key: "precisaoGPS", width: 16 },
        { header: "Data/hora", key: "capturadoEm", width: 24 },
        { header: "Responsável", key: "responsavel", width: 26 },
        { header: "Link Google Maps", key: "linkMaps", width: 45 },
        { header: "Foto", key: "foto", width: 34 },
      ];
      wsFotos.getRow(1).eachCell((cell) => {
        cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF129446" } };
        cell.alignment = { horizontal: "center", vertical: "middle" };
      });

      for (const [index, ev] of evidencias.entries()) {
        const rowIndex = index + 2;
        const row = wsFotos.addRow({
          id: ev.id,
          itemId: ev.itemId,
          itemTitulo: ev.itemTitulo,
          condicaoAtual: ev.condicaoAtual,
          observacao: ev.observacao,
          latitude: ev.latitude ?? "",
          longitude: ev.longitude ?? "",
          precisaoGPS: ev.precisaoGPS ? `${Math.round(ev.precisaoGPS)} m` : "",
          capturadoEm: dataBR(ev.capturadoEm || ev.imagem?.capturadoEm || ev.imagem?.criadoEm),
          responsavel: ev.responsavel || ev.imagem?.responsavel || usuarioLogado?.nomeCompleto || "",
          linkMaps: ev.linkMaps || ev.imagem?.linkMaps || "",
          foto: "Imagem inserida ao lado",
        });
        row.height = 120;
        row.eachCell((cell) => {
          cell.alignment = { vertical: "top", wrapText: true };
          cell.border = {
            top: { style: "thin", color: { argb: "FFD1D5DB" } },
            left: { style: "thin", color: { argb: "FFD1D5DB" } },
            bottom: { style: "thin", color: { argb: "FFD1D5DB" } },
            right: { style: "thin", color: { argb: "FFD1D5DB" } },
          };
        });
        try {
          const imagemBase64 = await prepararImagemParaRelatorio(ev.imagem);
          if (imagemBase64) {
            const imgId = workbook.addImage({ base64: imagemBase64, extension: extensaoImagem(imagemBase64) });
            wsFotos.addImage(imgId, { tl: { col: 11.1, row: rowIndex - 0.9 }, ext: { width: 190, height: 110 } });
          } else {
            row.getCell("foto").value = "Imagem não disponível";
          }
        } catch (erro) {
          console.error("Erro ao inserir foto VCP no Excel:", erro);
        }
      }

      const buffer = await workbook.xlsx.writeBuffer();
      saveAs(
        new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }),
        `Relatorio_VCP_${configAerodromo.icao || "VELOX"}.xlsx`
      );
    } catch (erro) {
      console.error(erro);
      alert("Erro ao gerar Excel exclusivo VCP.");
    } finally {
      setGerandoRelatorio(false);
    }
  }

  async function exportarPDFVCP() {
    try {
      setGerandoRelatorio(true);
      // Não salva automaticamente durante a geração do PDF VCP.
      // O salvamento deve ser feito pelo botão de salvar inspeção, separando relatório e Firebase.

      const doc = new jsPDF("p", "mm", "a4");
      const largura = doc.internal.pageSize.getWidth();
      const altura = doc.internal.pageSize.getHeight();
      const logoBase64 = await urlParaBase64(logoVeloxRelatorio);
      const itensVCP = obterItensVCPParaRelatorio();
      const evidencias = montarEvidenciasVCP();
      const finalizacao = respostasPorNorma.VCP?.["VCP-FINALIZACAO"] || {};

      const CORES = {
        grafite: [14, 17, 18],
        grafite2: [28, 32, 34],
        verde1: [18, 148, 70],
        verde2: [87, 190, 51],
        amareloVerde: [211, 211, 0],
        texto: [15, 23, 42],
        cinza: [75, 85, 99],
        borda: [220, 225, 230],
        fundo: [248, 250, 252],
      };

      function setRGB(rgb) {
        doc.setFillColor(rgb[0], rgb[1], rgb[2]);
      }

      function textoQuebrado(texto, x, y, maxWidth, lineHeight = 4.2) {
        const linhas = doc.splitTextToSize(String(texto || "—"), maxWidth);
        doc.text(linhas, x, y);
        return y + linhas.length * lineHeight;
      }

      function desenharDegradeHorizontal(x, y, w, h) {
        const passos = 32;
        for (let i = 0; i < passos; i += 1) {
          const t = i / (passos - 1);
          const r = Math.round(CORES.verde1[0] * (1 - t) + CORES.amareloVerde[0] * t);
          const g = Math.round(CORES.verde1[1] * (1 - t) + CORES.amareloVerde[1] * t);
          const b = Math.round(CORES.verde1[2] * (1 - t) + CORES.amareloVerde[2] * t);
          doc.setFillColor(r, g, b);
          doc.rect(x + (w / passos) * i, y, w / passos + 0.5, h, "F");
        }
      }

      function rodapeVCP(titulo = "") {
        desenharDegradeHorizontal(0, altura - 15, largura, 15);
        doc.setFillColor(17, 24, 28);
        doc.rect(0, altura - 15, 70, 15, "F");
        doc.setFontSize(7.6);
        doc.setTextColor(255, 255, 255);
        doc.text("VELOX SERVICE • Relatório VCP", 12, altura - 7);
        doc.text(titulo, largura - 12, altura - 7, { align: "right" });
      }

      function cabecalhoVCP(titulo) {
        desenharDegradeHorizontal(0, 0, largura, 24);
        doc.addImage(logoBase64, "PNG", 9, 4.5, 54, 14.8);
        doc.setFontSize(9.5);
        doc.setTextColor(255, 255, 255);
        doc.text(titulo, largura - 10, 14, { align: "right" });
      }

      function statusColor(status) {
        if (status === "CONFORME") return [22, 163, 74];
        if (status === "NÃO CONFORME") return [220, 38, 38];
        if (status === "NÃO APLICÁVEL") return [100, 116, 139];
        return [82, 90, 96];
      }

      function textoGeo(ev) {
        const lat = ev.latitude ?? ev.imagem?.latitude ?? ev.imagem?.geolocalizacao?.latitude;
        const lng = ev.longitude ?? ev.imagem?.longitude ?? ev.imagem?.geolocalizacao?.longitude;
        const precisao = ev.precisaoGPS ?? ev.imagem?.precisaoGPS ?? ev.imagem?.geolocalizacao?.precisao;
        if (lat === null || lat === undefined || lng === null || lng === undefined) {
          return "Localização: não autorizada ou indisponível";
        }
        const p = precisao ? ` ± ${Math.round(precisao)} m` : "";
        return `${Number(lat).toFixed(6)}, ${Number(lng).toFixed(6)}${p}`;
      }

      // CAPA PREMIUM
      setRGB(CORES.grafite);
      doc.rect(0, 0, largura, altura, "F");
      doc.setFillColor(24, 28, 30);
      doc.rect(0, 0, largura * 0.58, altura, "F");
      desenharDegradeHorizontal(largura * 0.58, 0, largura * 0.42, altura);
      doc.setFillColor(255, 255, 255);
      doc.triangle(114, 0, 124, 0, 96, altura, "F");
      doc.addImage(logoBase64, "PNG", 18, 25, 92, 25.2);

      doc.setFontSize(18);
      doc.setTextColor(255, 255, 255);
      doc.text("Relatório de", 18, 83);
      doc.setFontSize(24);
      doc.text("Inspeção / Verificação", 18, 96);
      doc.setFontSize(34);
      doc.text("VCP", 18, 113);
      doc.setFontSize(12);
      doc.setTextColor(142, 220, 72);
      doc.text("Aeroportos Brasil Viracopos", 18, 126);
      doc.setTextColor(255, 255, 255);
      doc.text("• Checklist operacional exclusivo", 18, 134);
      doc.setDrawColor(120, 210, 67);
      doc.line(18, 151, 128, 151);

      doc.setFontSize(10);
      doc.setTextColor(210, 220, 225);
      const capaDados = [
        ["Aeródromo", configAerodromo.nomeAerodromo || "Não informado"],
        ["ICAO", configAerodromo.icao || "Não informado"],
        ["Município/UF", `${configAerodromo.municipio || "—"} / ${configAerodromo.uf || "—"}`],
        ["Data", new Date().toLocaleDateString("pt-BR")],
        ["Responsável", finalizacao.responsavelVisita || usuarioLogado?.nomeCompleto || "Inspetor Velox"],
      ];
      let cy = 166;
      capaDados.forEach(([label, valor]) => {
        doc.setTextColor(142, 220, 72);
        doc.text(`${label}:`, 18, cy);
        doc.setTextColor(255, 255, 255);
        doc.setFont(undefined, "bold");
        doc.text(String(valor || "—"), 18, cy + 6);
        doc.setFont(undefined, "normal");
        cy += 17;
      });
      rodapeVCP("Capa");

      // IDENTIFICAÇÃO
      doc.addPage();
      cabecalhoVCP("Identificação do Aeroporto");
      doc.setFontSize(16);
      doc.setTextColor(...CORES.texto);
      doc.text("1  Identificação do Aeroporto", 14, 40);
      let y = 54;
      obterIdentificacaoVCPParaRelatorio().forEach(([campo, valor], index) => {
        const linhasValor = doc.splitTextToSize(String(valor || "—"), 110);
        const boxHeight = Math.max(10, linhasValor.length * 4.2 + 5);
        if (y + boxHeight > 255) {
          rodapeVCP("Identificação");
          doc.addPage();
          cabecalhoVCP("Identificação do Aeroporto");
          y = 40;
        }
        doc.setDrawColor(...CORES.borda);
        doc.setFillColor(index % 2 === 0 ? 248 : 255, index % 2 === 0 ? 250 : 255, index % 2 === 0 ? 252 : 255);
        doc.roundedRect(14, y - 6, 182, boxHeight, 2, 2, "FD");
        doc.setFontSize(8.2);
        doc.setTextColor(28, 120, 50);
        doc.setFont(undefined, "bold");
        doc.text(campo, 18, y);
        doc.setFont(undefined, "normal");
        doc.setTextColor(...CORES.cinza);
        doc.text(linhasValor, 78, y);
        y += boxHeight + 2;
      });
      if (panInfo) {
        y += 6;
        doc.setDrawColor(195, 225, 195);
        doc.setFillColor(244, 252, 244);
        doc.roundedRect(14, y - 4, 182, 34, 3, 3, "FD");
        doc.setFillColor(22, 148, 70);
        doc.circle(28, y + 13, 9, "F");
        doc.setFontSize(10);
        doc.setTextColor(22, 101, 52);
        doc.setFont(undefined, "bold");
        doc.text("Base PAN", 44, y + 5);
        doc.setFont(undefined, "normal");
        doc.setTextColor(...CORES.cinza);
        textoQuebrado(`${panInfo.prioridadePAN} • ${panInfo.faixaPAN} • CAPEX ${panInfo.capexEstimadoFinal}`, 44, y + 14, 140);
        textoQuebrado(panInfo.infraestruturaAlvo || "—", 44, y + 23, 140);
      }
      rodapeVCP("Identificação");

      // CARDS VCP
      doc.addPage();
      cabecalhoVCP("Cards VCP - Checklist Operacional");
      y = 40;
      itensVCP.forEach((item) => {
        const chave = item.id || item.ref;
        const resposta = obterRespostaVCP(item);
        const status = resposta.status || "NÃO VERIFICADO";
        const primeiraFoto = resposta.evidenciasAnexadas?.[0];
        const itemSemClassificacao = String(item.id || "") === "4.7";

        if (y > 232) {
          rodapeVCP("Cards VCP");
          doc.addPage();
          cabecalhoVCP("Cards VCP - Checklist Operacional");
          y = 38;
        }

        doc.setDrawColor(...CORES.borda);
        doc.setFillColor(255, 255, 255);
        doc.roundedRect(14, y - 5, 182, 58, 3, 3, "FD");
        const sc = statusColor(status);
        doc.setFillColor(sc[0], sc[1], sc[2]);
        doc.roundedRect(18, y, 14, 12, 2, 2, "F");
        doc.setFontSize(8.5);
        doc.setTextColor(255, 255, 255);
        doc.setFont(undefined, "bold");
        doc.text(String(chave), 25, y + 8, { align: "center" });

        doc.setTextColor(...CORES.texto);
        doc.setFontSize(9.2);
        doc.text(item.titulo || item.item || "Item VCP", 38, y + 4);
        doc.setFont(undefined, "normal");
        doc.setFontSize(7.3);
        doc.setTextColor(...CORES.cinza);
        doc.text(doc.splitTextToSize(item.descricao || "—", primeiraFoto ? 78 : 98), 38, y + 12);
        doc.setFontSize(7.1);
        doc.text(doc.splitTextToSize(`Condição: ${resposta.condicaoAtual || "—"}`, primeiraFoto ? 78 : 98), 38, y + 32);
        doc.text(doc.splitTextToSize(`Obs.: ${resposta.obs || "—"}`, primeiraFoto ? 78 : 98), 38, y + 42);

        doc.setFillColor(sc[0], sc[1], sc[2]);
        doc.roundedRect(142, y, 38, 9, 2, 2, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(6.8);
        doc.setFont(undefined, "bold");
        doc.text(status, 161, y + 6, { align: "center" });
        doc.setFont(undefined, "normal");
        doc.setTextColor(...CORES.cinza);
        doc.setFontSize(7.2);
        doc.text("Classificação:", 151, y + 22, { align: "center" });
        doc.setFontSize(13);
        doc.setTextColor(sc[0], sc[1], sc[2]);
        doc.setFont(undefined, "bold");
        doc.text(itemSemClassificacao ? "—" : resposta.classificacaoVCP ? `${resposta.classificacaoVCP}/5` : "—", 161, y + 34, { align: "center" });
        doc.setFont(undefined, "normal");

        if (primeiraFoto?.data) {
          try {
            const formato = extensaoImagem(primeiraFoto.data) === "png" ? "PNG" : "JPEG";
            doc.addImage(primeiraFoto.data, formato, 108, y + 15, 30, 30);
          } catch (erro) {
            console.error("Erro ao inserir foto VCP no PDF:", erro);
          }
        }
        y += 64;
      });
      rodapeVCP("Cards VCP");

      // FINALIZAÇÃO
      doc.addPage();
      cabecalhoVCP("Finalização VCP");
      doc.setFontSize(16);
      doc.setTextColor(...CORES.texto);
      doc.text("Finalização do Relatório VCP", 14, 40);
      doc.setFontSize(9);
      doc.setTextColor(...CORES.cinza);
      textoQuebrado(`Responsável pela visita: ${finalizacao.responsavelVisita || usuarioLogado?.nomeCompleto || "—"}`, 14, 56, 176);
      textoQuebrado(`Participantes adicionais: ${finalizacao.participantesAdicionais || "—"}`, 14, 70, 176);
      textoQuebrado(`Observações finais: ${finalizacao.obsFinal || "—"}`, 14, 84, 176);
      doc.setDrawColor(22, 148, 70);
      doc.line(20, 245, 95, 245);
      doc.line(115, 245, 190, 245);
      doc.setFontSize(8);
      doc.text("Responsável Velox", 57, 251, { align: "center" });
      doc.text("Representante do Aeroporto", 152, 251, { align: "center" });
      rodapeVCP("Finalização");

      // FOTOS VINCULADAS
      if (evidencias.length > 0) {
        doc.addPage();
        cabecalhoVCP("Fotos vinculadas aos cards");
        doc.setFontSize(16);
        doc.setTextColor(...CORES.texto);
        doc.text("Fotos vinculadas aos cards", 14, 40);
        y = 54;
        for (const ev of evidencias) {
          if (y > 222) {
            rodapeVCP("Fotos vinculadas");
            doc.addPage();
            cabecalhoVCP("Fotos vinculadas aos cards");
            y = 40;
          }
          doc.setDrawColor(...CORES.borda);
          doc.setFillColor(...CORES.fundo);
          doc.roundedRect(14, y - 5, 182, 58, 3, 3, "FD");
          doc.setFontSize(8.2);
          doc.setTextColor(17, 83, 37);
          doc.setFont(undefined, "bold");
          doc.text(`${ev.id} • Item ${ev.itemId}`, 18, y + 2);
          doc.setFont(undefined, "normal");
          doc.setFontSize(7.4);
          doc.setTextColor(...CORES.cinza);
          doc.text(doc.splitTextToSize(ev.itemTitulo, 90), 18, y + 11);
          doc.text(doc.splitTextToSize(`Condição: ${ev.condicaoAtual || "—"}`, 90), 18, y + 24);
          doc.text(dataBR(ev.capturadoEm || ev.imagem?.capturadoEm || ev.imagem?.criadoEm), 18, y + 36);
          doc.text(textoGeo(ev), 18, y + 43);
          doc.text(`Responsável: ${ev.responsavel || ev.imagem?.responsavel || usuarioLogado?.nomeCompleto || "—"}`, 18, y + 50);
          if (ev.linkMaps || ev.imagem?.linkMaps) {
            doc.setTextColor(22, 148, 70);
            doc.textWithLink("Ver no mapa", 93, y + 50, { url: ev.linkMaps || ev.imagem?.linkMaps });
          }
          try {
            const imagemBase64 = await prepararImagemParaRelatorio(ev.imagem);
            if (imagemBase64) {
              const formato = extensaoImagem(imagemBase64) === "png" ? "PNG" : "JPEG";
              doc.addImage(imagemBase64, formato, 122, y - 1, 62, 46);
            } else {
              doc.setFontSize(8);
              doc.setTextColor(239, 68, 68);
              doc.text("Imagem não disponível.", 122, y + 15);
            }
          } catch (erro) {
            console.error("Erro ao inserir imagem VCP no PDF:", erro);
          }
          y += 65;
        }
        rodapeVCP("Fotos vinculadas");
      }

      const pdfBlob = doc.output("blob");
      saveAs(pdfBlob, `Relatorio_VCP_${configAerodromo.icao || "VELOX"}.pdf`);
    } catch (erro) {
      console.error(erro);
      alert("Erro ao gerar PDF exclusivo VCP.");
    } finally {
      setGerandoRelatorio(false);
    }
  }

  async function exportarExcelPremium() {
    if (normaSelecionada === "VCP") {
      await exportarExcelVCP();
      return;
    }

    try {
      setGerandoRelatorio(true);
      if (configAerodromo.icao || configAerodromo.nomeAerodromo) await salvarInspecaoAtual();

      const workbook = new ExcelJS.Workbook();
      workbook.creator = "Velox Service";
      workbook.created = new Date();

      const logoBase64 = await urlParaBase64(logoVelox);
      const logoId = workbook.addImage({ base64: logoBase64, extension: extensaoImagem(logoBase64) });
      const resumoRelatorio = calcularResumoRelatorio();

      if (resumoRelatorio.total === 0) {
        alert("Nenhum item CONFORME ou NÃO CONFORME foi inspecionado. O relatório não será gerado.");
        return;
      }

      const evidencias = montarEvidencias(true);

      const wsResumo = workbook.addWorksheet("Resumo Geral", {
        pageSetup: { paperSize: 9, orientation: "portrait" },
        headerFooter: {
          oddHeader: "&CRelatório de Inspeção Aeroportuária - Velox Service",
          oddFooter: "&LVELOX SERVICE&R&P de &N",
        },
      });

      wsResumo.addImage(logoId, { tl: { col: 0.2, row: 0.2 }, ext: { width: 230, height: 63 } });
      wsResumo.mergeCells("A5:F5");
      wsResumo.getCell("A5").value = "RELATÓRIO COMPLETO DE INSPEÇÃO AEROPORTUÁRIA";
      wsResumo.getCell("A5").font = { bold: true, size: 18, color: { argb: "FFFFFFFF" } };
      wsResumo.getCell("A5").alignment = { horizontal: "center" };
      wsResumo.getCell("A5").fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF0A1F12" } };
      wsResumo.columns = [{ width: 30 }, { width: 62 }, { width: 18 }, { width: 18 }, { width: 18 }, { width: 18 }];

      const resumoLinhas = [
        ["Data da inspeção", new Date().toLocaleDateString("pt-BR")],
        ["Aeródromo", configAerodromo.nomeAerodromo || "Não informado"],
        ["Código ICAO", configAerodromo.icao || "Não informado"],
        ["Município/UF", `${configAerodromo.municipio || "—"} / ${configAerodromo.uf || "—"}`],
        ["Responsável", usuarioLogado?.nomeCompleto || "Inspetor Velox"],
        ["RBAC 153", configAerodromo.classificacaoRBAC153 || configAerodromo.classeRBAC153],
        ["RBAC 154", configAerodromo.codigoReferenciaRBAC154],
        ["RBAC 107", configAerodromo.categoriaRBAC107 || "AP-0"],
        ["Total inspecionado no relatório", resumoRelatorio.total],
        ["Conformes inspecionados", resumoRelatorio.conforme],
        ["Não conformes inspecionados", resumoRelatorio.naoConforme],
        ["Evidências fotográficas no relatório", resumoRelatorio.evidencias],
        ["Itens não aplicáveis", "Não incluídos no relatório"],
        ["Itens não verificados", "Não incluídos no relatório"],
      ];

      resumoLinhas.forEach((linha, index) => {
        const row = wsResumo.getRow(index + 7);
        row.values = linha;
        row.getCell(1).font = { bold: true, color: { argb: "FF07120B" } };
        row.eachCell((cell) => {
          cell.border = {
            top: { style: "thin", color: { argb: "FFD1D5DB" } },
            left: { style: "thin", color: { argb: "FFD1D5DB" } },
            bottom: { style: "thin", color: { argb: "FFD1D5DB" } },
            right: { style: "thin", color: { argb: "FFD1D5DB" } },
          };
          cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: index % 2 === 0 ? "FFF8FAFC" : "FFFFFFFF" } };
        });
      });

      const wsItens = workbook.addWorksheet("Itens Inspecionados", {
        views: [{ state: "frozen", ySplit: 1 }],
        headerFooter: { oddHeader: "&CItens Inspecionados - Velox Service", oddFooter: "&LRelatório Oficial&R&P de &N" },
      });

      wsItens.columns = [
        { header: "Norma", key: "norma", width: 16 },
        { header: "ID", key: "id", width: 18 },
        { header: "Descrição", key: "descricao", width: 48 },
        { header: "Requisito / Critério", key: "criterio", width: 48 },
        { header: "Condição atual", key: "condicaoAtual", width: 46 },
        { header: "Observações", key: "obs", width: 42 },
        { header: "Status", key: "status", width: 20 },
        { header: "Responsável", key: "responsavel", width: 28 },
        { header: "Prazo", key: "prazo", width: 18 },
        { header: "Fotos / Evidências", key: "evidencias", width: 24 },
      ];

      wsItens.getRow(1).eachCell((cell) => {
        cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF0A1F12" } };
        cell.alignment = { horizontal: "center", vertical: "middle" };
      });

      NORMAS_IDS.forEach((normaId) => {
        const norma = NORMAS[normaId] || { itens: [] };
        const respostasNorma = respostasPorNorma[normaId] || {};
        const itens = itensInspecionadosParaRelatorio(normaId);

        itens.forEach((item) => {
          const chave = item.id || item.ref;
          const resposta = respostasNorma[chave] || {};
          const evDoItem = evidencias.filter((ev) => ev.normaId === normaId && ev.itemId === chave).map((ev) => ev.id).join(", ");
          const status = resposta.status || "NÃO VERIFICADO";

          const row = wsItens.addRow({
            norma: norma.nome || normaId,
            id: chave,
            descricao: item.item || item.titulo || item.descricao || "",
            criterio: item.criterio || item.descricao || item.evidencias || "",
            condicaoAtual: resposta.condicaoAtual || resposta.valorEncontrado || "",
            obs: resposta.obs || "",
            status,
            responsavel: resposta.responsavel || usuarioLogado?.nomeCompleto || "",
            prazo: resposta.prazo || "",
            evidencias: evDoItem || "Sem evidência",
          });

          row.eachCell((cell) => {
            cell.alignment = { vertical: "top", wrapText: true };
            cell.border = {
              top: { style: "thin", color: { argb: "FFD1D5DB" } },
              left: { style: "thin", color: { argb: "FFD1D5DB" } },
              bottom: { style: "thin", color: { argb: "FFD1D5DB" } },
              right: { style: "thin", color: { argb: "FFD1D5DB" } },
            };
          });
          row.getCell(7).font = { bold: true, color: { argb: "FFFFFFFF" } };
          row.getCell(7).fill = { type: "pattern", pattern: "solid", fgColor: { argb: `FF${corStatus(status)}` } };
        });
      });

      const wsEvidencias = workbook.addWorksheet("Evidências Fotográficas", {
        headerFooter: { oddHeader: "&CEvidências Fotográficas - Velox Service", oddFooter: "&LRegistro Fotográfico Oficial&R&P de &N" },
      });

      wsEvidencias.columns = [
        { header: "ID Evidência", key: "id", width: 18 },
        { header: "Norma", key: "normaNome", width: 18 },
        { header: "ID Item", key: "itemId", width: 18 },
        { header: "Item Inspecionado", key: "itemTitulo", width: 48 },
        { header: "Status", key: "status", width: 20 },
        { header: "Observação", key: "observacao", width: 48 },
        { header: "Foto", key: "foto", width: 34 },
      ];

      wsEvidencias.getRow(1).eachCell((cell) => {
        cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF0A1F12" } };
        cell.alignment = { horizontal: "center", vertical: "middle" };
      });

      for (const [index, ev] of evidencias.entries()) {
        const rowIndex = index + 2;
        const row = wsEvidencias.addRow({
          id: ev.id,
          normaNome: ev.normaNome,
          itemId: ev.itemId,
          itemTitulo: ev.itemTitulo,
          status: ev.status,
          observacao: ev.observacao,
          foto: "Imagem inserida ao lado",
        });
        row.height = 115;
        row.eachCell((cell) => {
          cell.alignment = { vertical: "top", wrapText: true };
          cell.border = {
            top: { style: "thin", color: { argb: "FFD1D5DB" } },
            left: { style: "thin", color: { argb: "FFD1D5DB" } },
            bottom: { style: "thin", color: { argb: "FFD1D5DB" } },
            right: { style: "thin", color: { argb: "FFD1D5DB" } },
          };
        });

        try {
          const imagemBase64 = await prepararImagemParaRelatorio(ev.imagem);
          if (imagemBase64) {
            const imgId = workbook.addImage({ base64: imagemBase64, extension: extensaoImagem(imagemBase64) });
            wsEvidencias.addImage(imgId, { tl: { col: 6.1, row: rowIndex - 0.9 }, ext: { width: 185, height: 105 } });
          } else {
            row.getCell("foto").value = "Imagem não disponível";
          }
        } catch (erro) {
          console.error("Erro ao inserir imagem no Excel:", erro);
        }
      }

      const buffer = await workbook.xlsx.writeBuffer();
      saveAs(
        new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }),
        `Relatorio_Completo_${configAerodromo.icao || "VELOX"}.xlsx`
      );
    } catch (erro) {
      console.error(erro);
      alert("Erro ao gerar Excel premium.");
    } finally {
      setGerandoRelatorio(false);
    }
  }

  async function exportarPDFPremium() {
    if (normaSelecionada === "VCP") {
      await exportarPDFVCP();
      return;
    }

    try {
      setGerandoRelatorio(true);
      if (configAerodromo.icao || configAerodromo.nomeAerodromo) await salvarInspecaoAtual();

      const doc = new jsPDF("p", "mm", "a4");
      const largura = doc.internal.pageSize.getWidth();
      const altura = doc.internal.pageSize.getHeight();
      const logoBase64 = await urlParaBase64(logoVelox);
      const resumoRelatorio = calcularResumoRelatorio();

      if (resumoRelatorio.total === 0) {
        alert("Nenhum item CONFORME ou NÃO CONFORME foi inspecionado. O relatório não será gerado.");
        return;
      }

      const evidencias = montarEvidencias(true);

      function rodape(paginaTitulo = "") {
        doc.setFillColor(6, 19, 11);
        doc.rect(0, altura - 15, largura, 15, "F");
        doc.setFontSize(8);
        doc.setTextColor(220, 255, 230);
        doc.text("VELOX SERVICE • Gestão e Administração Aeroportuária", 12, altura - 7);
        doc.text(paginaTitulo, largura - 12, altura - 7, { align: "right" });
      }

      function cabecalho(titulo) {
        doc.setFillColor(6, 19, 11);
        doc.rect(0, 0, largura, 24, "F");
        doc.addImage(logoBase64, "PNG", 10, 5, 52, 14.2);
        doc.setFontSize(11);
        doc.setTextColor(255, 255, 255);
        doc.text(titulo, largura - 10, 14, { align: "right" });
      }

      doc.setFillColor(6, 19, 11);
      doc.rect(0, 0, largura, altura, "F");
      doc.setFillColor(32, 196, 90);
      doc.rect(0, 0, 8, altura, "F");
      doc.addImage(logoBase64, "PNG", 22, 24, 90, 24.7);
      doc.setFontSize(24);
      doc.setTextColor(255, 255, 255);
      doc.text("Relatório Completo", 22, 82);
      doc.text("de Inspeção Aeroportuária", 22, 94);
      doc.setFontSize(11);
      doc.setTextColor(210, 230, 218);
      doc.text("RBAC 153 • RBAC 154 • RBAC 107 em uma única inspeção por aeródromo.", 22, 106);
      doc.setDrawColor(32, 196, 90);
      doc.line(22, 114, 185, 114);
      doc.setFontSize(12);
      doc.setTextColor(255, 255, 255);
      doc.text(`Aeródromo: ${configAerodromo.nomeAerodromo || "Não informado"}`, 22, 132);
      doc.text(`ICAO: ${configAerodromo.icao || "Não informado"}`, 22, 142);
      doc.text(`Município/UF: ${configAerodromo.municipio || "—"} / ${configAerodromo.uf || "—"}`, 22, 152);
      doc.text(`Data: ${new Date().toLocaleDateString("pt-BR")}`, 22, 162);
      doc.text(`Responsável: ${usuarioLogado?.nomeCompleto || "Inspetor Velox"}`, 22, 172);
      rodape("Capa");

      doc.addPage();
      cabecalho("Sumário Executivo");
      doc.setTextColor(20, 30, 40);
      doc.setFontSize(18);
      doc.text("Sumário Executivo", 14, 40);

      const dadosGerais = [
        ["Aeródromo", configAerodromo.nomeAerodromo || "Não informado"],
        ["ICAO", configAerodromo.icao || "Não informado"],
        ["Município/UF", `${configAerodromo.municipio || "—"} / ${configAerodromo.uf || "—"}`],
        ["Inspetor", usuarioLogado?.nomeCompleto || "Inspetor Velox"],
        ["RBAC 153", configAerodromo.classificacaoRBAC153 || configAerodromo.classeRBAC153],
        ["RBAC 154", configAerodromo.codigoReferenciaRBAC154],
        ["RBAC 107", configAerodromo.categoriaRBAC107 || "AP-0"],
        ["Itens no relatório", `${resumoRelatorio.total} item(ns) inspecionado(s)`],
      ];

      let y = 54;
      dadosGerais.forEach(([label, valor], index) => {
        doc.setFillColor(index % 2 === 0 ? 248 : 255, index % 2 === 0 ? 250 : 255, index % 2 === 0 ? 252 : 255);
        doc.rect(14, y - 6, 180, 8, "F");
        doc.setFontSize(9);
        doc.setTextColor(10, 31, 18);
        doc.text(label, 18, y);
        doc.setTextColor(45, 55, 65);
        doc.text(String(valor), 70, y);
        y += 9;
      });

      y += 10;
      const indicadores = [
        ["Relatório", resumoRelatorio.total, "0A1F12"],
        ["Conforme", resumoRelatorio.conforme, "16A34A"],
        ["Não Conf.", resumoRelatorio.naoConforme, "EF4444"],
        ["Evidências", resumoRelatorio.evidencias, "64748B"],
        ["Filtrados", "N/A + NV", "C9A300"],
      ];

      indicadores.forEach(([label, valor, cor], index) => {
        const x = 14 + index * 36;
        doc.setFillColor(...hexParaRgb(cor));
        doc.roundedRect(x, y, 32, 24, 3, 3, "F");
        doc.setFontSize(13);
        doc.setTextColor(255, 255, 255);
        doc.text(String(valor), x + 16, y + 10, { align: "center" });
        doc.setFontSize(6.7);
        doc.text(label, x + 16, y + 18, { align: "center" });
      });
      rodape("Resumo");

      NORMAS_IDS.forEach((normaId) => {
        const norma = NORMAS[normaId] || { nome: normaId, itens: [] };
        const respostasNorma = respostasPorNorma[normaId] || {};
        const itens = itensInspecionadosParaRelatorio(normaId);
        const resumoNormaRelatorio = resumoRelatorio.porNorma[normaId] || {
          total: 0,
          conforme: 0,
          naoConforme: 0,
          evidencias: 0,
        };

        if (itens.length === 0) return;

        doc.addPage();
        cabecalho(`${norma.nome || normaId} - Itens Inspecionados`);
        doc.setFontSize(16);
        doc.setTextColor(10, 31, 18);
        doc.text(
          `${norma.nome || normaId} • ${resumoNormaRelatorio.total} item(ns) no relatório`,
          14,
          40
        );
        y = 52;

        itens.forEach((item) => {
          const chave = item.id || item.ref;
          const resposta = respostasNorma[chave] || {};
          const status = resposta.status || "NÃO VERIFICADO";

          if (!itemEntraNoRelatorio(status)) return;

          const textoItem = item.item || item.titulo || item.descricao || "Item de inspeção";
          const condicaoAtual = resposta.condicaoAtual || "-";
          const obs = resposta.obs || "-";
          const primeiraFoto = Array.isArray(resposta.evidenciasAnexadas)
            ? normalizarImagemEvidenciaParaRelatorio(resposta.evidenciasAnexadas[0], resposta, chave)
            : null;

          if (y > 250) {
            doc.addPage();
            cabecalho(`${norma.nome || normaId} - Itens Inspecionados`);
            y = 38;
          }

          doc.setDrawColor(210, 215, 220);
          doc.setFillColor(248, 250, 252);

          if (normaId === "VCP") {
            doc.roundedRect(14, y - 5, 182, 58, 2, 2, "FD");
            doc.setFontSize(7.3);
            doc.setTextColor(255, 255, 255);
            doc.setFillColor(...hexParaRgb(corStatus(status)));
            doc.roundedRect(16, y - 2, 34, 7, 2, 2, "F");
            doc.text(status, 33, y + 3, { align: "center" });
            doc.setTextColor(10, 31, 18);
            doc.setFontSize(8.5);
            doc.text(`${String(chave)} • ${item.titulo || "Item VCP"}`, 54, y + 3);
            doc.setFontSize(7.8);
            doc.setTextColor(45, 55, 65);
            doc.text(doc.splitTextToSize(item.descricao || textoItem, primeiraFoto ? 94 : 160), 16, y + 12);
            doc.setFontSize(7.2);
            doc.setTextColor(80, 90, 100);
            if (String(item.id || "") !== "4.7") {
              doc.text(doc.splitTextToSize(`Classificação: ${resposta.classificacaoVCP || "-"}/5`, 92), 16, y + 28);
              doc.text(doc.splitTextToSize(`Condição atual: ${condicaoAtual}`, primeiraFoto ? 92 : 160), 16, y + 36);
              doc.text(doc.splitTextToSize(`Obs.: ${obs}`, primeiraFoto ? 92 : 160), 16, y + 48);
            } else {
              doc.text(doc.splitTextToSize(`Condição atual: ${condicaoAtual}`, primeiraFoto ? 92 : 160), 16, y + 30);
              doc.text(doc.splitTextToSize(`Obs.: ${obs}`, primeiraFoto ? 92 : 160), 16, y + 44);
            }

            if (primeiraFoto?.data && String(primeiraFoto.data).startsWith("data:image")) {
              try {
                const formato = extensaoImagem(primeiraFoto.data) === "png" ? "PNG" : "JPEG";
                doc.addImage(primeiraFoto.data, formato, 124, y + 7, 58, 40);
              } catch (erro) {
                console.error("Erro ao inserir imagem do item VCP no PDF:", erro);
              }
            }
            y += 64;
          } else {
            doc.roundedRect(14, y - 5, 182, 30, 2, 2, "FD");
            doc.setFontSize(7.3);
            doc.setTextColor(255, 255, 255);
            doc.setFillColor(...hexParaRgb(corStatus(status)));
            doc.roundedRect(16, y - 2, 34, 7, 2, 2, "F");
            doc.text(status, 33, y + 3, { align: "center" });
            doc.setTextColor(10, 31, 18);
            doc.setFontSize(8.5);
            doc.text(String(chave), 54, y + 3);
            doc.setFontSize(8);
            doc.setTextColor(45, 55, 65);
            doc.text(doc.splitTextToSize(textoItem, 132), 16, y + 12);
            doc.setFontSize(7.5);
            doc.setTextColor(80, 90, 100);
            doc.text(doc.splitTextToSize(`Obs.: ${obs}`, 168), 16, y + 23);
            y += 36;
          }
        });
        rodape(norma.nome || normaId);
      });

      if (respostasPorNorma.VCP?.["VCP-FINALIZACAO"]) {
        const finalizacao = respostasPorNorma.VCP["VCP-FINALIZACAO"];
        doc.addPage();
        cabecalho("Finalização VCP");
        doc.setFontSize(16);
        doc.setTextColor(10, 31, 18);
        doc.text("Finalização do Relatório VCP", 14, 40);
        doc.setFontSize(9);
        doc.setTextColor(45, 55, 65);
        doc.text(doc.splitTextToSize(`Responsável pela visita: ${finalizacao.responsavelVisita || usuarioLogado?.nomeCompleto || "-"}`, 176), 14, 56);
        doc.text(doc.splitTextToSize(`Participantes adicionais: ${finalizacao.participantesAdicionais || "-"}`, 176), 14, 68);
        doc.text(doc.splitTextToSize(`Observações finais: ${finalizacao.obsFinal || "-"}`, 176), 14, 82);
        rodape("Finalização VCP");
      }

      doc.addPage();
      cabecalho("Evidências Fotográficas");
      doc.setFontSize(16);
      doc.setTextColor(10, 31, 18);
      doc.text("Evidências Fotográficas", 14, 40);
      y = 52;

      if (evidencias.length === 0) {
        doc.setFontSize(10);
        doc.setTextColor(80, 90, 100);
        doc.text("Nenhuma evidência fotográfica foi anexada nesta inspeção.", 14, y);
      }

      for (const ev of evidencias) {
        if (y > 220) {
          doc.addPage();
          cabecalho("Evidências Fotográficas");
          y = 38;
        }

        doc.setDrawColor(210, 215, 220);
        doc.setFillColor(248, 250, 252);
        doc.roundedRect(14, y - 5, 182, 58, 3, 3, "FD");
        doc.setFontSize(9);
        doc.setTextColor(10, 31, 18);
        doc.text(`${ev.id} • ${ev.normaNome} • Item ${ev.itemId}`, 18, y + 2);
        doc.setFontSize(8);
        doc.setTextColor(45, 55, 65);
        doc.text(doc.splitTextToSize(ev.itemTitulo, 95), 18, y + 10);
        doc.setFontSize(7.5);
        doc.setTextColor(80, 90, 100);
        doc.text(doc.splitTextToSize(`Status: ${ev.status}`, 95), 18, y + 30);
        doc.text(doc.splitTextToSize(`Observação: ${ev.observacao || "-"}`, 95), 18, y + 38);

        try {
          const imagemBase64 = await prepararImagemParaRelatorio(ev.imagem);
          if (imagemBase64) {
            const formato = extensaoImagem(imagemBase64) === "png" ? "PNG" : "JPEG";
            doc.addImage(imagemBase64, formato, 122, y - 1, 62, 46);
          } else {
            doc.setFontSize(8);
            doc.setTextColor(239, 68, 68);
            doc.text("Imagem não disponível.", 122, y + 15);
          }
        } catch (erro) {
          console.error("Erro ao inserir imagem no PDF:", erro);
          doc.setFontSize(8);
          doc.setTextColor(239, 68, 68);
          doc.text("Imagem não pôde ser renderizada.", 122, y + 15);
        }
        y += 65;
      }

      rodape("Evidências");
      doc.save(`Relatorio_Completo_${configAerodromo.icao || "VELOX"}.pdf`);
    } catch (erro) {
      console.error(erro);
      alert("Erro ao gerar PDF premium.");
    } finally {
      setGerandoRelatorio(false);
    }
  }

  if (!usuarioLogado) {
    return (
      <div className="app auth-page">
        <section className="auth-card">
          <img src={logoVelox} alt="Velox Service" className="auth-logo" />
          <h1>Sistema Inteligente de Inspeção Aeroportuária</h1>
          <p>Entre ou cadastre-se para salvar inspeções por aeroporto e separar os trabalhos por inspetor.</p>

          <div className="auth-tabs">
            <button className={modoAuth === "login" ? "active" : ""} onClick={() => setModoAuth("login")}>Entrar</button>
            <button className={modoAuth === "cadastro" ? "active" : ""} onClick={() => setModoAuth("cadastro")}>Cadastrar</button>
          </div>

          <form onSubmit={modoAuth === "login" ? fazerLogin : fazerCadastro} className="auth-form">
            {modoAuth === "cadastro" && (
              <>
                <label>Nome completo<input value={authForm.nomeCompleto} onChange={(e) => setAuthForm((p) => ({ ...p, nomeCompleto: e.target.value }))} /></label>
                <label>Telefone<input value={authForm.telefone} onChange={(e) => setAuthForm((p) => ({ ...p, telefone: e.target.value }))} /></label>
                <label>CPF<input value={authForm.cpf} onChange={(e) => setAuthForm((p) => ({ ...p, cpf: e.target.value }))} /></label>
              </>
            )}
            <label>E-mail<input type="email" value={authForm.email} onChange={(e) => setAuthForm((p) => ({ ...p, email: e.target.value }))} /></label>
            <label>
              Senha
              <input
                type={mostrarSenha ? "text" : "password"}
                value={authForm.senha}
                onChange={(e) => setAuthForm((p) => ({ ...p, senha: e.target.value }))}
              />
            </label>
            <label className="mostrar-senha-check">
              <input
                type="checkbox"
                checked={mostrarSenha}
                onChange={(e) => setMostrarSenha(e.target.checked)}
              />
              <span>Mostrar senha digitada</span>
            </label>
            <button className="btn btn-dark" type="submit">{modoAuth === "login" ? "Entrar no sistema" : "Criar acesso"}</button>
          </form>

          <div className="auth-alert">
            Cadastros novos entram como pendentes. O Admin Master aprova o acesso no painel de gestão.
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="brand-area">
          <img src={logoVelox} alt="Velox Service" className="brand-logo" />
          <div className="brand-system">
            <strong>Sistema Inteligente de Inspeção Aeroportuária</strong>
            <span>RBAC 153 • RBAC 154 • RBAC 107</span>
          </div>
        </div>
        <div className="user-chip">
          <span>{usuarioLogado.nomeCompleto}</span>
          <small>{ehAdminMaster(usuarioLogado) ? "Admin Master" : ehAdmin(usuarioLogado) ? "Administrador" : "Inspetor"}</small>
          <button type="button" onClick={sair}>Sair</button>
        </div>
      </header>

      <section className="hero">
        <div className="hero-content">
          <span className="hero-tag">VELOX SERVICE • INSPEÇÃO ANAC</span>
          <h1>Eficiência, qualidade e controle técnico para inspeções aeroportuárias.</h1>
          <p>
            Sistema profissional para auditoria de operação, infraestrutura e AVSEC,
            com salvamento único por aeródromo e aplicabilidade automática.
          </p>
        </div>
      </section>

      <main className="container">
        <section className="card action-card">
          <div className="grid">
            <div className="col-8">
              <h2 className="card-title">Gestão da inspeção atual</h2>
              <p className="card-subtitle">
                Agora a inspeção é salva por aeroporto: RBAC 153, RBAC 154 e RBAC 107 ficam dentro do mesmo processo.
              </p>
            </div>
            <div className="col-4 actions-stack">
              <button className="btn btn-dark" onClick={salvarInspecaoAtual}>Salvar inspeção</button>
              <button className="btn btn-secondary" onClick={novaInspecao}>Nova inspeção</button>
              <button className="btn btn-danger" onClick={limparInspecaoAtual}>Limpar atual</button>
            </div>
          </div>
        </section>

        <section className="card inspections-card">
          <div className="grid">
            <div className="col-8">
              <h2 className="card-title">Minhas inspeções</h2>
              <p className="card-subtitle">
                Abra, continue, duplique, exporte ou exclua inspeções já salvas por aeroporto.
              </p>
            </div>
            <div className="col-4 align-end">
              <button className="btn btn-secondary" onClick={() => setMostrarMinhasInspecoes(!mostrarMinhasInspecoes)}>
                {mostrarMinhasInspecoes ? "Ocultar lista" : "Mostrar lista"}
              </button>
            </div>
          </div>

          {mostrarMinhasInspecoes && (
            <div className="inspections-list">
              {minhasInspecoes.length === 0 && <div className="empty-state">Nenhuma inspeção salva para este usuário.</div>}
              {minhasInspecoes.map((inspecao) => (
                <article className={inspecaoAtualId === inspecao.id ? "inspection-row active" : "inspection-row"} key={inspecao.id}>
                  <div>
                    {isMobileVCP ? (
                      <>
                        <strong style={{ fontSize: 22, letterSpacing: 1 }}>{inspecao.aeroporto?.icao || inspecao.configAerodromo?.icao || "SEM ICAO"}</strong>
                        <small>Atualizada em {dataBR(inspecao.atualizadoEm)}</small>
                      </>
                    ) : (
                      <>
                        <strong>{inspecao.aeroporto?.nome || "Aeródromo não informado"}</strong>
                        <span>{inspecao.aeroporto?.icao || "Sem ICAO"} • {inspecao.aeroporto?.municipio || "—"}/{inspecao.aeroporto?.uf || "—"}</span>
                        <small>Atualizada em {dataBR(inspecao.atualizadoEm)} • Inspetor: {inspecao.inspetorNome}</small>
                      </>
                    )}
                  </div>
                  <div className="inspection-progress">
                    <b>{inspecao.percentualConcluido || 0}%</b>
                    <small>{inspecao.statusGeral === "concluida" ? "Concluída" : "Em andamento"}</small>
                  </div>
                  <div className="inspection-actions">
                    <button className="btn btn-dark" onClick={() => abrirInspecao(inspecao)}>Abrir</button>
                    <button className="btn btn-secondary" onClick={() => duplicarInspecao(inspecao)}>Duplicar</button>
                    <button className="btn btn-danger" onClick={() => excluirInspecao(inspecao.id)}>Excluir</button>
                  </div>
                </article>
              ))}
              {minhasInspecoes.length > 0 && (
                <button className="btn btn-danger full-width" onClick={excluirTodasMinhasInspecoes}>Excluir todas as minhas inspeções</button>
              )}
            </div>
          )}
        </section>

        {ehAdmin(usuarioLogado) && usuarios.length > 0 && (
          <section className="card admin-card">
            <div className="grid">
              <div className="col-8">
                <h2 className="card-title">Gestão de usuários</h2>
                <p className="card-subtitle">Aprovação, bloqueio, reset de senha, permissões administrativas e controle das inspeções cadastradas.</p>
              </div>
              <div className="col-4">
                <div className="admin-status-box">
                  <strong>{estatisticasAdmin.pendentes}</strong>
                  <span>cadastro(s) pendente(s)</span>
                </div>
              </div>
            </div>

            <div className="admin-stats-grid">
              <div><b>{estatisticasAdmin.totalUsuarios}</b><span>Usuários</span></div>
              <div><b>{estatisticasAdmin.ativos}</b><span>Ativos</span></div>
              <div><b>{estatisticasAdmin.bloqueados}</b><span>Bloqueados</span></div>
              <div><b>{estatisticasAdmin.admins}</b><span>Admins</span></div>
              <div><b>{estatisticasAdmin.totalInspecoes}</b><span>Inspeções</span></div>
              <div><b>{estatisticasAdmin.concluidas}</b><span>Concluídas</span></div>
              <div><b>{estatisticasAdmin.emAndamento}</b><span>Em andamento</span></div>
            </div>

            {ehAdminMaster(usuarioLogado) && (
              <div className="admin-danger-zone" style={{ marginTop: 18, padding: 16, borderRadius: 16, border: "1px solid rgba(239,68,68,0.35)", background: "rgba(239,68,68,0.08)" }}>
                <h3 style={{ margin: "0 0 6px", color: "#fecaca" }}>Zona crítica do Admin Master</h3>
                <p style={{ margin: "0 0 12px", color: "#e5e7eb" }}>
                  Exclui todas as inspeções salvas de todos os usuários. Usuários, cadastros, permissões e Admin Master serão preservados.
                </p>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={limparTodasInspecoesSistemaAdminMaster}
                  disabled={estatisticasAdmin.totalInspecoes === 0}
                >
                  ⚠ Limpar todas as inspeções do sistema
                </button>
              </div>
            )}

            <div className="admin-users">
              {usuarios.map((usuario) => {
                const totalDoUsuario = inspecoes.filter((insp) => insp.usuarioId === usuario.id).length;
                const pendente = usuario.ativo === false && usuario.statusCadastro !== "bloqueado";
                const bloqueado = usuario.statusCadastro === "bloqueado";

                return (
                  <div className={usuario.id === usuarioLogado.id ? "admin-user-row current" : "admin-user-row"} key={usuario.id}>
                    <div className="admin-user-main">
                      <strong>{usuario.nomeCompleto}</strong>
                      <span>{usuario.email} • {usuario.telefone || "sem telefone"} • CPF {usuario.cpf || "não informado"}</span>
                      <small>Perfil: {ehAdminMaster(usuario) ? "Admin Master" : ehAdmin(usuario) ? "Administrador" : "Inspetor"} • Inspeções: {totalDoUsuario}</small>
                    </div>

                    <div className="admin-user-status">
                      <span className={bloqueado ? "admin-badge blocked" : pendente ? "admin-badge pending" : "admin-badge active"}>
                        {bloqueado ? "Bloqueado" : pendente ? "Pendente" : "Aprovado"}
                      </span>
                    </div>

                    <div className="admin-user-actions">
                      {pendente && (
                        <button className="btn btn-dark" onClick={() => aprovarUsuario(usuario.id)}>Aprovar</button>
                      )}
                      {bloqueado ? (
                        <button className="btn btn-dark" onClick={() => desbloquearUsuario(usuario.id)}>Desbloquear</button>
                      ) : (
                        <button className="btn btn-danger" onClick={() => bloquearUsuario(usuario.id)} disabled={usuario.id === usuarioLogado.id}>Bloquear</button>
                      )}
                      <button className="btn btn-secondary" onClick={() => resetarSenhaUsuario(usuario.id)}>Resetar senha</button>
                      <button className="btn btn-secondary" onClick={() => alternarTipoAdmin(usuario.id)} disabled={usuario.id === usuarioLogado.id || !ehAdminMaster(usuarioLogado)}>
                        {ehAdmin(usuario) ? "Tornar inspetor" : "Tornar admin"}
                      </button>
                      <button className="btn btn-secondary" onClick={() => setAdminUsuarioSelecionado(adminUsuarioSelecionado === usuario.id ? "" : usuario.id)}>
                        Ver inspeções
                      </button>
                      <button className="btn btn-danger" onClick={() => excluirUsuario(usuario.id)} disabled={usuario.id === usuarioLogado.id}>Excluir</button>
                    </div>
                  </div>
                );
              })}
            </div>

            {adminUsuarioSelecionado && (
              <div className="admin-inspections-panel">
                <h3>Inspeções do usuário selecionado</h3>
                {inspecoesUsuarioAdmin.length === 0 && <div className="empty-state">Nenhuma inspeção vinculada a este usuário.</div>}
                {inspecoesUsuarioAdmin.map((inspecao) => (
                  <article className="inspection-row" key={inspecao.id}>
                    <div>
                      <strong>{inspecao.aeroporto?.nome || "Aeródromo não informado"}</strong>
                      <span>{inspecao.aeroporto?.icao || "Sem ICAO"} • {inspecao.aeroporto?.municipio || "—"}/{inspecao.aeroporto?.uf || "—"}</span>
                      <small>Atualizada em {dataBR(inspecao.atualizadoEm)} • {inspecao.percentualConcluido || 0}% concluída</small>
                    </div>
                    <div className="inspection-actions">
                      <button className="btn btn-dark" onClick={() => abrirInspecao(inspecao)}>Abrir</button>
                      <button className="btn btn-secondary" onClick={() => duplicarInspecao(inspecao)}>Duplicar para mim</button>
                      <button className="btn btn-danger" onClick={() => excluirInspecao(inspecao.id)}>Excluir</button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        )}

        <section id="consulta-icao-section" className="card consulta-card">
          <div className="grid">
            <div className="col-8">
              <h2 className="card-title">Consulta automática por ICAO</h2>
              <p className="card-subtitle">
                Digite o código ICAO para carregar automaticamente os dados do aeródromo, classificações e aplicabilidade.
              </p>
            </div>

            <div className="col-4">
              <div className="icao-box">
                <span>Código ICAO</span>
                <input value={icao} onChange={(e) => setIcao(e.target.value.toUpperCase())} placeholder="SBGO" maxLength={4} />
              </div>
            </div>

            {mensagemBase && (
              <div className="col-12"><div className="mensagem">{mensagemBase}</div></div>
            )}
          </div>
        </section>

        <section className="grid">
          <div className="col-4"><div className="metric-card"><div className="metric-label">Aeródromo ativo</div><div className="metric-value">{configAerodromo.icao || "—"}</div><p>{configAerodromo.nomeAerodromo || "Nenhum aeródromo carregado"}</p></div></div>
          <div className="col-4"><div className="metric-card"><div className="metric-label">Localidade</div><div className="metric-value small">{configAerodromo.municipio || "—"}</div><p>{configAerodromo.uf || "UF não informada"}</p></div></div>
          <div className="col-4"><div className="metric-card total"><div className="metric-label">Conclusão geral</div><div className="metric-value">{resumoGeral.percentual}%</div><p>{resumoGeral.respondidos} de {resumoGeral.total} itens respondidos</p></div></div>
        </section>

        <section className="grid">
          <div className="col-4"><div className="metric-card"><div className="metric-label">RBAC 153</div><div className="metric-value small">{configAerodromo.classificacaoRBAC153 || configAerodromo.classeRBAC153}</div><p>Classificação operacional</p></div></div>
          <div className="col-4"><div className="metric-card"><div className="metric-label">RBAC 154</div><div className="metric-value">{configAerodromo.codigoReferenciaRBAC154}</div><p>{configAerodromo.comprimentoPista ? `${configAerodromo.comprimentoPista} m` : "Pista não informada"}</p></div></div>
          <div className="col-4"><div className="metric-card"><div className="metric-label">RBAC 107</div><div className="metric-value">{configAerodromo.categoriaRBAC107 || "AP-0"}</div><p>Categoria AVSEC</p></div></div>
        </section>

        <section className="card">
          <div className="grid">
            <div className="col-8"><h2 className="card-title">Parâmetros de aplicabilidade</h2><p className="card-subtitle">Ajuste manualmente somente quando o banco automático estiver incompleto ou quando houver necessidade técnica.</p></div>
            <div className="col-4 align-end"><button className="btn btn-dark" onClick={() => setMostrarConfig(!mostrarConfig)}>{mostrarConfig ? "Ocultar parâmetros" : "Ajustar parâmetros avançados"}</button></div>
          </div>

          {mostrarConfig && (
            <div className="grid config-grid">
              <div className="col-4"><label>Uso público<select value={configAerodromo.usoPublico ? "SIM" : "NÃO"} onChange={(e) => atualizarCampoConfig("usoPublico", e.target.value === "SIM")}><option>SIM</option><option>NÃO</option></select></label></div>
              <div className="col-4"><label>Passageiros/ano<input type="number" value={configAerodromo.passageirosAno} onChange={(e) => atualizarCampoConfig("passageirosAno", Number(e.target.value))} /></label></div>
              <div className="col-4"><label>Classe RBAC 153<select value={configAerodromo.classeRBAC153} onChange={(e) => atualizarCampoConfig("classeRBAC153", e.target.value)}><option>Classe I</option><option>Classe II</option><option>Classe III</option><option>Classe IV</option><option>Não classificado</option></select></label></div>
              <div className="col-4"><label>Comprimento da pista<input type="number" value={configAerodromo.comprimentoPista} onChange={(e) => atualizarCampoConfig("comprimentoPista", Number(e.target.value))} /></label></div>
              <div className="col-4"><label>Código número RBAC 154<select value={configAerodromo.codigoNumero} onChange={(e) => atualizarCampoConfig("codigoNumero", Number(e.target.value))}><option value={1}>1</option><option value={2}>2</option><option value={3}>3</option><option value={4}>4</option></select></label></div>
              <div className="col-4"><label>Código letra RBAC 154<select value={configAerodromo.codigoLetra} onChange={(e) => atualizarCampoConfig("codigoLetra", e.target.value)}><option>A</option><option>B</option><option>C</option><option>D</option><option>E</option><option>F</option></select></label></div>
              <div className="col-4"><label>Tipo de operação<select value={configAerodromo.tipoOperacao} onChange={(e) => atualizarCampoConfig("tipoOperacao", e.target.value)}><option>VFR</option><option>IFR</option></select></label></div>
              <div className="col-4"><label>Operação noturna<select value={configAerodromo.operacaoNoturna ? "SIM" : "NÃO"} onChange={(e) => atualizarCampoConfig("operacaoNoturna", e.target.value === "SIM")}><option>SIM</option><option>NÃO</option></select></label></div>
              <div className="col-4"><label>Pavimentado<select value={configAerodromo.pavimentado ? "SIM" : "NÃO"} onChange={(e) => atualizarCampoConfig("pavimentado", e.target.value === "SIM")}><option>SIM</option><option>NÃO</option></select></label></div>
            </div>
          )}
        </section>

        <section className="card">
          <div className="norma-tabs">
            {Object.values(NORMAS).map((norma) => (
              <button key={norma.id} className={normaSelecionada === norma.id ? "norma-tab active" : "norma-tab"} onClick={() => setNormaSelecionada(norma.id)}>{norma.nome}</button>
            ))}
          </div>

          <div className="grid section-space">
            <div className="col-8"><h2 className="card-title">{normaAtual.nome}</h2><p className="card-subtitle">{normaAtual.titulo}</p></div>
            <div className="col-4 align-end"><button className="btn btn-secondary" onClick={limparRespostasNormaAtual}>Limpar esta norma</button></div>
          </div>

          <div className="grid">
            <div className="col-4"><div className="metric-card total"><div className="metric-label">Total aplicável</div><div className="metric-value">{resumo.total}</div></div></div>
            {STATUS.map((status) => (<div className="col-4" key={status}><div className="metric-card"><div className="metric-label">{status}</div><div className="metric-value">{resumo.contagem[status]}</div></div></div>))}
          </div>

          <div className="grid section-space">
            <div className="col-6"><button className="btn btn-dark" onClick={exportarExcelPremium} disabled={gerandoRelatorio}>{gerandoRelatorio ? "Gerando relatório..." : normaSelecionada === "VCP" ? "Exportar XLS VCP" : "Exportar Excel Inspecionados"}</button></div>
            <div className="col-6"><button className="btn btn-secondary" onClick={exportarPDFPremium} disabled={gerandoRelatorio}>{gerandoRelatorio ? "Gerando relatório..." : normaSelecionada === "VCP" ? "Exportar PDF VCP" : "Exportar PDF Inspecionados"}</button></div>
          </div>

          <div className="search-box"><label>Buscar no checklist<input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar item, referência, critério, evidência ou risco..." /></label></div>
        </section>


        {normaSelecionada === "INFRA" && resumoTecnicoInfra && (
          <section className="infra-panel">
            <div className="infra-header">
              <div>
                <h2>Painel Técnico INFRA</h2>
                <p>
                  Assistente técnico aeroportuário com parâmetros calculados automaticamente
                  conforme código de referência, operação IFR/VFR e operação noturna.
                </p>
              </div>

              <span className="infra-badge">
                {resumoTecnicoInfra.codigoReferencia}
              </span>
            </div>

            <div className="infra-grid">
              <div className="infra-card">
                <h3>Operação</h3>
                <p>
                  {resumoTecnicoInfra.tipoOperacao}
                  {resumoTecnicoInfra.operacaoNoturna
                    ? " • NOTURNA"
                    : " • DIURNA"}
                </p>
              </div>

              <div className="infra-card">
                <h3>Pista</h3>
                <p>
                  Largura mínima:{" "}
                  <strong>{resumoTecnicoInfra.larguraMinimaPista}</strong>
                </p>
              </div>

              <div className="infra-card">
                <h3>Faixa de Pista</h3>
                <p>
                  Largura esperada:{" "}
                  <strong>
                    {resumoTecnicoInfra.faixaPista || "Verificar cenário"}
                  </strong>
                </p>
              </div>

              <div className="infra-card">
                <h3>Taxiway</h3>
                <p>
                  Largura referencial:{" "}
                  <strong>{resumoTecnicoInfra.larguraTaxiwayReferencial}</strong>
                </p>
              </div>

              <div className="infra-card">
                <h3>RESA</h3>
                <p>
                  {resumoTecnicoInfra.exigeRESA
                    ? "OBRIGATÓRIA"
                    : "VERIFICAR APLICABILIDADE"}
                </p>
                <small>
                  Comprimento esperado:{" "}
                  <strong>
                  {resumoTecnicoInfra.dimensaoRESA || "Verificar cenário"}
                  </strong>
                </small>
              </div>

              <div className="infra-card">
                <h3>Faixa Preparada</h3>
                <p>
                  {resumoTecnicoInfra.exigeFaixaPreparada ? "EXIGIDA" : "PADRÃO"}
                </p>
                <small>
                  Parâmetro esperado:{" "}
                  <strong>
                    {resumoTecnicoInfra.faixaPreparada || "Verificar cenário"}
                  </strong>
                </small>
              </div>

              <div className="infra-card">
                <h3>Sinalização</h3>
                <p>
                  {resumoTecnicoInfra.exigeSinalizacaoLuminosa
                    ? "LUMINOSA OBRIGATÓRIA"
                    : "PADRÃO DIURNO"}
                </p>
              </div>

              <div className="infra-card">
                <h3>Posição de Espera IFR</h3>
                <p>
                  {resumoTecnicoInfra.exigePosicaoEsperaIFR
                    ? "EXIGIDA"
                    : "CONFORME CENÁRIO"}
                </p>
              </div>
            </div>

            <div className="infra-alertas">
              <h3>Alertas Operacionais</h3>

              {resumoTecnicoInfra.alertasOperacionais?.length ? (
                resumoTecnicoInfra.alertasOperacionais.map((alerta, index) => (
                  <div key={index} className="infra-alerta">
                    ⚠ {alerta}
                  </div>
                ))
              ) : (
                <div className="infra-ok">
                  Nenhum alerta operacional relevante para o cenário atual.
                </div>
              )}
            </div>
          </section>
        )}


        {normaSelecionada === "VCP" && (
          <section className="infra-panel">
            <div className="infra-header">
              <div>
                <h2>Painel VCP / Visita Técnica</h2>
                <p>
                  Checklist operacional de visita técnica seguindo a sequência do documento:
                  identificação automática/editável, lado ar, lado terra, red flags e assinaturas.
                </p>
              </div>
              <span className="infra-badge">VCP</span>
            </div>

            <div className="infra-grid">
              <div className="infra-card">
                <h3>Aeroporto</h3>
                <p>{configAerodromo.icao || "ICAO não informado"}</p>
                <small>{configAerodromo.nomeAerodromo || "Carregue o aeroporto pelo código ICAO"}</small>
              </div>

              <div className="infra-card">
                <h3>Código / Faixa PAN</h3>
                <p>{panInfo ? panInfo.faixaPAN : "Não cadastrado"}</p>
                <small>{panInfo ? `${panInfo.prioridadePAN} • CAPEX ${panInfo.capexEstimadoFinal}` : "Base PAN vinculada aos aeroportos do Edital AmpliAR/PAN"}</small>
              </div>

              <div className="infra-card">
                <h3>Escopo</h3>
                <p>Visita Técnica</p>
                <small>Lado Ar • Lado Terra • Red Flags</small>
              </div>

              <div className="infra-card">
                <h3>Relatório</h3>
                <p>Premium Velox</p>
                <small>Condição atual, fotos, classificação e observações por item</small>
              </div>
            </div>
          </section>
        )}

        {normaSelecionada === "VCP" && renderFichaIdentificacaoVCP()}

        <section>
          {itensVisiveis.length === 0 && <div className="card">Nenhum item aplicável encontrado para os parâmetros atuais.</div>}

          {itensVisiveis.map((item, index) => {
            const chave = item.id || item.ref || `${normaSelecionada}-${index}`;
            const resposta = respostas[chave] || {};
            const statusAtual = resposta.status || "NÃO VERIFICADO";

            const exigeValorNumericoInfra =
              normaSelecionada === "INFRA" &&
              item.exigeValorNumerico === true;

            const analiseConformidadeCampo =
              normaSelecionada === "INFRA" &&
              exigeValorNumericoInfra &&
              resposta.valorEncontrado
                ? avaliarConformidadeInfra({
                    grupo: item.grupo || item.item || item.id || item.ref,
                    valorEncontrado: resposta.valorEncontrado,
                    valorEsperado:
                      item.valorEsperadoComparacao ||
                      item.parametroEsperadoCalculado,
                    tipoComparacao: item.tipoComparacao || "MINIMO",
                    valorLimite: item.valorLimite || null,
                  })
                : null;

            if (normaSelecionada === "VCP") {
              return renderCardVCP(item, index);
            }

            return (
              <article key={chave} className="checklist-item">
                <div className="checklist-head"><span className="item-ref">{item.ref || item.id}</span><span className={`status-pill ${classeStatus(statusAtual)}`}>{statusAtual}</span></div>
                <h3 className="item-title">{item.item || item.titulo || item.descricao || "Item de verificação"}</h3>
                {item.subparte && <p className="item-text"><strong>Subparte:</strong> {item.subparte}</p>}
                {item.descricao && (item.item || item.titulo) && <p className="item-text">{item.descricao}</p>}
                {(item.criterioTecnicoCalculado || item.criterio) && (
                  <div className="item-text">
                    <strong>Critério:</strong>
                    <pre style={{ whiteSpace: "pre-wrap", fontFamily: "inherit", margin: "8px 0 0", color: "inherit", lineHeight: 1.6 }}>
                      {normaSelecionada === "INFRA"
                        ? item.criterioTecnicoCalculado || item.criterio
                        : item.criterio}
                    </pre>
                  </div>
                )}
                {item.evidencias && <p className="item-text"><strong>Evidências esperadas:</strong> {item.evidencias}</p>}
                {item.risco && <p className="item-text"><strong>Risco:</strong> {item.risco}</p>}
                {normaSelecionada === "VCP" && item.grupo && <p className="item-text"><strong>Grupo:</strong> {item.grupo}</p>}
                {normaSelecionada === "VCP" && item.criticidade && <p className="item-text"><strong>Criticidade:</strong> {item.criticidade}</p>}
                {normaSelecionada === "VCP" && item.exigeFoto && <p className="item-text"><strong>Evidência:</strong> Foto obrigatória para este item.</p>}
                {normaSelecionada === "VCP" && item.referenciaNormativa?.length > 0 && <p className="item-text"><strong>Referência de apoio:</strong> {item.referenciaNormativa.join(" • ")}</p>}
                {normaSelecionada === "INFRA" && item.parametroEsperadoCalculado && (
                  <div className="item-text infra-parametro-item">
                    <strong>Parâmetro técnico calculado:</strong>
                    <pre style={{ whiteSpace: "pre-wrap", fontFamily: "inherit", margin: "8px 0 0", color: "inherit", lineHeight: 1.6 }}>
                      {item.parametroEsperadoCalculado}
                    </pre>
                  </div>
                )}
                {normaSelecionada === "INFRA" && item.comoInspecionarCalculado && (
                  <div className="item-text infra-parametro-item">
                    <strong>Como inspecionar em campo:</strong>
                    <pre style={{ whiteSpace: "pre-wrap", fontFamily: "inherit", margin: "8px 0 0", color: "inherit", lineHeight: 1.6 }}>
                      {item.comoInspecionarCalculado}
                    </pre>
                  </div>
                )}

                {normaSelecionada === "INFRA" && (
                  <div className="item-text infra-parametro-item" style={{ border: "1px solid rgba(56, 189, 248, 0.28)", borderRadius: 14, padding: 14, background: "rgba(15, 23, 42, 0.28)" }}>
                    {exigeValorNumericoInfra ? (
                      <>
                        <strong>Valor encontrado em campo:</strong>

                        {item.logicaConformidade && (
                          <p style={{ margin: "8px 0 0", opacity: 0.9 }}>
                            <strong>Lógica de conformidade:</strong>{" "}
                            {item.logicaConformidade}
                          </p>
                        )}

                        <div className="grid field-grid" style={{ marginTop: 10 }}>
                          <div className="col-6">
                            <label>
                              Valor medido / encontrado
                              <input
                                value={resposta.valorEncontrado || ""}
                                onChange={(e) =>
                                  atualizarResposta(item, "valorEncontrado", e.target.value)
                                }
                                placeholder={
                                  item.tipoComparacao === "MAXIMO"
                                    ? `Ex.: 14 ${item.unidade || ""}`
                                    : "Ex.: 90 m, 90 x 60 m, 75 m"
                                }
                              />
                            </label>
                          </div>

                          <div className="col-6">
                            <label>
                              Resultado automático
                              <input
                                value={analiseConformidadeCampo?.status || "NÃO VERIFICADO"}
                                readOnly
                              />
                            </label>
                          </div>
                        </div>

                        {item.tipoComparacao && (
                          <p style={{ margin: "8px 0 0", opacity: 0.85 }}>
                            <strong>Tipo de comparação:</strong>{" "}
                            {item.tipoComparacao}
                            {item.valorLimite !== null && item.valorLimite !== undefined
                              ? ` • Limite: ${item.valorLimite} ${item.unidade || ""}`
                              : ""}
                          </p>
                        )}

                        {analiseConformidadeCampo && (
                          <div style={{ marginTop: 10 }}>
                            <p style={{ margin: "4px 0" }}>
                              <strong>Status:</strong> {analiseConformidadeCampo.status}
                            </p>
                            <p style={{ margin: "4px 0" }}>
                              <strong>Criticidade:</strong> {analiseConformidadeCampo.criticidade}
                            </p>
                            <pre style={{ whiteSpace: "pre-wrap", fontFamily: "inherit", margin: "8px 0 0", color: "inherit", lineHeight: 1.6 }}>
                              {analiseConformidadeCampo.recomendacao}
                            </pre>

                            {(analiseConformidadeCampo.status === "CONFORME" ||
                              analiseConformidadeCampo.status === "NÃO CONFORME") && (
                              <button
                                type="button"
                                className="status-btn"
                                onClick={() =>
                                  atualizarResposta(
                                    item,
                                    "status",
                                    analiseConformidadeCampo.status
                                  )
                                }
                              >
                                Aplicar status automático
                              </button>
                            )}
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        <strong>Avaliação qualitativa do inspetor:</strong>
                        <p style={{ margin: "8px 0 0", opacity: 0.9 }}>
                          Este item não exige valor numérico. Avalie a condição observada em campo e marque
                          CONFORME ou NÃO CONFORME nos botões abaixo.
                        </p>

                        {item.logicaConformidade && (
                          <p style={{ margin: "8px 0 0", opacity: 0.9 }}>
                            <strong>Lógica de conformidade:</strong>{" "}
                            {item.logicaConformidade}
                          </p>
                        )}
                      </>
                    )}
                  </div>
                )}

                <div className="status-row">
                  {STATUS.map((status) => {
                    const ativo = statusAtual === status;
                    const classe = classeStatus(status);
                    return <button key={status} type="button" className={ativo ? `status-btn ${classe} active` : `status-btn ${classe}`} onClick={() => atualizarResposta(item, "status", status)}>{status}</button>;
                  })}
                </div>

                <div className="grid field-grid">
                  <div className="col-6"><label>Responsável<input value={resposta.responsavel || usuarioLogado.nomeCompleto || ""} onChange={(e) => atualizarResposta(item, "responsavel", e.target.value)} placeholder="Responsável" /></label></div>
                  <div className="col-6"><label>Prazo<select value={resposta.prazo || ""} onChange={(e) => atualizarResposta(item, "prazo", e.target.value)}><option value="">Não definido</option><option>IMEDIATO</option><option>CURTO PRAZO</option><option>MÉDIO PRAZO</option><option>LONGO PRAZO</option></select></label></div>
                  <div className="col-12"><div className="evidencias-box"><strong>Evidências fotográficas</strong><p>Adicione fotos tiradas na hora ou selecione imagens da galeria do celular.</p><div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}><label className="upload-evidencia">📷 Tirar foto<input type="file" accept="image/*" capture="environment" onChange={(e) => { adicionarEvidencias(item, e.target.files); limparInputArquivo(e); }} /></label><label className="upload-evidencia">🖼 Anexar da galeria<input type="file" accept="image/*" multiple onChange={(e) => { adicionarEvidencias(item, e.target.files); limparInputArquivo(e); }} /></label></div>{resposta.evidenciasAnexadas?.length > 0 && (<div className="preview-evidencias">{resposta.evidenciasAnexadas.map((ev, indexEv) => (<div className="preview-card" key={`${ev.nome}-${indexEv}`}><img src={obterUrlImagemEvidencia(ev)} alt={ev.nome} />{ev.pendenteUpload && <small style={{ color: "#f59e0b", fontWeight: 800 }}>Pendente de sincronização</small>}<button type="button" onClick={() => baixarEvidenciaNoDispositivo(ev, `${configAerodromo.icao || "VELOX"}-${chave}-${indexEv + 1}.jpg`)}>Salvar foto no celular</button><button type="button" onClick={() => removerEvidencia(item, indexEv)}>Remover</button></div>))}</div>)}</div></div>
                  <div className="col-12"><label>Observações de campo<textarea value={resposta.obs || ""} onChange={(e) => atualizarResposta(item, "obs", e.target.value)} placeholder="Observações, evidências coletadas, pendências ou recomendações..." /></label></div>
                </div>
              </article>
            );
          })}
        </section>

        {normaSelecionada === "VCP" && renderFinalizacaoVCP()}
      </main>
    </div>
  );
}
