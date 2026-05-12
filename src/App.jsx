import React, { useEffect, useMemo, useState } from "react";
import "./App.css";

import logoVelox from "./assets/logo-velox.png";

import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";

import { NORMAS } from "./data/normas";
import { CONFIG_INICIAL_RBAC154 } from "./data/configuracaoAerodromo";
import { verificarAplicabilidade } from "./utils/aplicabilidade";

import {
  atualizarBaseANAC,
  buscarAerodromoPorICAO,
} from "./services/anacService";

import { buscarAerodromoConsolidado } from "./data/aerodromosConsolidados";

const STATUS = [
  "NÃO VERIFICADO",
  "CONFORME",
  "NÃO CONFORME",
  "NÃO APLICÁVEL",
];

const NORMAS_IDS = ["RBAC153", "RBAC154", "RBAC107"];

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

function corStatus(status) {
  if (status === "CONFORME") return "16A34A";
  if (status === "NÃO CONFORME") return "EF4444";
  if (status === "NÃO APLICÁVEL") return "64748B";
  return "C9A300";
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

  const respostas = respostasPorNorma[normaSelecionada] || {};

  useEffect(() => {
    const usuariosSalvos = safeParse(localStorage.getItem(STORAGE_KEYS.usuarios), []);
    const usuarioSessao = safeParse(sessionStorage.getItem(STORAGE_KEYS.usuarioLogado), null);
    const inspecoesSalvas = safeParse(localStorage.getItem(STORAGE_KEYS.inspecoes), []);
    const baseSalva = safeParse(localStorage.getItem(STORAGE_KEYS.baseANAC), []);

    const usuariosNormalizados = Array.isArray(usuariosSalvos)
      ? usuariosSalvos
          // remove o admin master antigo para não travar o novo cadastro oficial
          .filter((usuario) => !ehEmailAdminMasterAntigo(usuario.email))
          .map((usuario) => {
            const emailUsuario = normalizarEmail(usuario.email);
            const master = ehEmailAdminMasterOficial(emailUsuario);
            const tipoSeguro = usuario.tipo === "admin" ? "admin" : "inspetor";

            return {
              ...usuario,
              email: emailUsuario,
              senha: senhaLimpa(usuario.senha),
              tipo: master ? "adminMaster" : tipoSeguro,
              adminMaster: master,
              ativo: master ? true : usuario.ativo === true,
              statusCadastro: master
                ? "aprovado"
                : usuario.statusCadastro || (usuario.ativo ? "aprovado" : "pendente"),
            };
          })
      : [];

    const existeAdminMasterOficial = usuariosNormalizados.some((usuario) =>
      ehEmailAdminMasterOficial(usuario.email)
    );

    const usuariosComAdminMaster = existeAdminMasterOficial
      ? usuariosNormalizados.map((usuario) =>
          ehEmailAdminMasterOficial(usuario.email)
            ? {
                ...usuario,
                id: usuario.id || "USR-ADMIN-MASTER-VELOX",
                nomeCompleto: usuario.nomeCompleto || ADMIN_MASTER_NOME,
                telefone: usuario.telefone || ADMIN_MASTER_TELEFONE,
                cpf: usuario.cpf || ADMIN_MASTER_CPF,
                senha: senhaLimpa(usuario.senha) || ADMIN_MASTER_SENHA_INICIAL,
                ativo: true,
                tipo: "adminMaster",
                adminMaster: true,
                statusCadastro: "aprovado",
                aprovadoEm: usuario.aprovadoEm || new Date().toISOString(),
              }
            : usuario
        )
      : [criarAdminMasterInicial(), ...usuariosNormalizados];

    setUsuarios(usuariosComAdminMaster);
    localStorage.setItem(STORAGE_KEYS.usuarios, JSON.stringify(usuariosComAdminMaster));
    setInspecoes(Array.isArray(inspecoesSalvas) ? inspecoesSalvas : []);
    setBaseANAC(Array.isArray(baseSalva) ? baseSalva : []);

    if (usuarioSessao?.id && usuarioSessao?.ativo !== false) {
      setUsuarioLogado(usuarioSessao);
    }

    const respostasAntigas = safeParse(localStorage.getItem("respostas-inspecao"), null);
    const configAntiga = safeParse(localStorage.getItem("config-aerodromo"), null);

    if (respostasAntigas || configAntiga) {
      setConfigAerodromo({ ...CONFIG_INICIAL, ...(configAntiga || {}) });
      setRespostasPorNorma((prev) => ({
        ...prev,
        RBAC153: respostasAntigas || {},
      }));
      setMensagemBase(
        "Dados antigos encontrados e carregados como inspeção temporária. Clique em 'Salvar inspeção' para gravar no novo modelo por aeródromo."
      );
    }
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
    return (norma.itens || []).filter((item) => verificarAplicabilidade(item, configAerodromo));
  }

  const itensAplicaveis = useMemo(() => itensAplicaveisDaNorma(normaSelecionada), [normaSelecionada, configAerodromo]);

  const itensVisiveis = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    if (!termo) return itensAplicaveis;

    return itensAplicaveis.filter((item) =>
      [item.ref, item.id, item.subparte, item.item, item.descricao, item.criterio, item.evidencias, item.risco]
        .join(" ")
        .toLowerCase()
        .includes(termo)
    );
  }, [itensAplicaveis, busca]);

  function calcularResumoNorma(normaId, config = configAerodromo, respostasBase = respostasPorNorma[normaId] || {}) {
    const norma = NORMAS[normaId] || { itens: [] };
    const itens = (norma.itens || []).filter((item) => verificarAplicabilidade(item, config));
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

  function adicionarEvidencias(item, arquivos) {
    const chave = item.id || item.ref;
    const listaArquivos = Array.from(arquivos || []);

    listaArquivos.forEach((arquivo) => {
      const leitor = new FileReader();

      leitor.onload = () => {
        setRespostasPorNorma((prev) => {
          const respostasNorma = prev[normaSelecionada] || {};
          const evidenciasAtuais = respostasNorma[chave]?.evidenciasAnexadas || [];

          return {
            ...prev,
            [normaSelecionada]: {
              ...respostasNorma,
              [chave]: {
                ...respostasNorma[chave],
                evidenciasAnexadas: [
                  ...evidenciasAtuais,
                  {
                    nome: arquivo.name,
                    tipo: arquivo.type,
                    data: leitor.result,
                    criadoEm: new Date().toISOString(),
                  },
                ],
              },
            },
          };
        });
      };

      leitor.readAsDataURL(arquivo);
    });
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

  function montarEvidencias(todasNormas = true) {
    const lista = [];
    const normasParaLer = todasNormas ? NORMAS_IDS : [normaSelecionada];

    normasParaLer.forEach((normaId) => {
      const norma = NORMAS[normaId] || { itens: [] };
      const respostasNorma = respostasPorNorma[normaId] || {};
      const itens = (norma.itens || []).filter((item) => verificarAplicabilidade(item, configAerodromo));

      itens.forEach((item) => {
        const chave = item.id || item.ref;
        const resposta = respostasNorma[chave] || {};
        const imagens = resposta.evidenciasAnexadas || [];

        imagens.forEach((imagem) => {
          lista.push({
            id: gerarIdEvidencia(lista.length),
            normaId,
            normaNome: norma.nome || normaId,
            itemId: chave,
            itemTitulo: item.item || item.descricao || "Item de inspeção",
            requisito: item.criterio || "",
            observacao: resposta.obs || "",
            status: resposta.status || "NÃO VERIFICADO",
            imagem,
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

  function salvarInspecaoAtual() {
    if (!usuarioLogado) {
      alert("Faça login para salvar a inspeção.");
      return null;
    }

    if (!configAerodromo.icao && !configAerodromo.nomeAerodromo) {
      alert("Informe ou carregue um aeródromo antes de salvar a inspeção.");
      return null;
    }

    const objeto = criarObjetoInspecao(inspecaoAtualId);

    setInspecoes((prev) => {
      const existe = prev.some((insp) => insp.id === objeto.id);
      if (existe) return prev.map((insp) => (insp.id === objeto.id ? objeto : insp));
      return [objeto, ...prev];
    });

    setInspecaoAtualId(objeto.id);
    setMensagemBase(`Inspeção salva: ${objeto.aeroporto.nome} (${objeto.aeroporto.icao || "sem ICAO"}).`);
    return objeto;
  }

  function novaInspecao() {
    const possuiConteudo =
      configAerodromo.icao ||
      configAerodromo.nomeAerodromo ||
      Object.values(respostasPorNorma).some((respostasNorma) => Object.keys(respostasNorma || {}).length > 0);

    if (possuiConteudo) {
      const deveSalvar = window.confirm("Deseja salvar a inspeção atual antes de iniciar uma nova?");
      if (deveSalvar) {
        const salva = salvarInspecaoAtual();
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
    setInspecaoAtualId(inspecao.id);
    setConfigAerodromo({ ...CONFIG_INICIAL, ...(inspecao.configAerodromo || {}) });
    setIcao(inspecao.aeroporto?.icao || inspecao.configAerodromo?.icao || "");
    setRespostasPorNorma({ ...criarRespostasNormas(), ...(inspecao.respostasPorNorma || {}) });
    setNormaSelecionada("RBAC153");
    setMensagemBase(`Inspeção aberta: ${inspecao.aeroporto?.nome || "Aeródromo"}.`);
    window.scrollTo({ top: 0, behavior: "smooth" });
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
    setMensagemBase("Inspeção duplicada com sucesso.");
  }

  function excluirInspecao(id) {
    if (!window.confirm("Deseja excluir esta inspeção salva? Esta ação não poderá ser desfeita.")) return;
    setInspecoes((prev) => prev.filter((insp) => insp.id !== id));
    if (inspecaoAtualId === id) limparInspecaoAtual();
  }

  function excluirTodasMinhasInspecoes() {
    if (!window.confirm("Deseja excluir TODAS as suas inspeções salvas?")) return;
    setInspecoes((prev) => prev.filter((insp) => insp.usuarioId !== usuarioLogado.id));
    limparInspecaoAtual();
  }

  function fazerCadastro(e) {
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

    if (senhaCadastro.length < 4) {
      alert("A senha deve ter pelo menos 4 caracteres.");
      return;
    }

    if (email === ADMIN_MASTER_EMAIL) {
      alert("Este e-mail já é o Admin Master oficial. Clique em Entrar e use a senha inicial 123456.");
      setModoAuth("login");
      return;
    }

    const emailJaExiste = usuarios.some((u) => normalizarEmail(u.email) === email);

    if (emailJaExiste) {
      alert("Este e-mail já está cadastrado. Faça login ou use outro e-mail.");
      return;
    }

    const novoUsuario = {
      id: gerarId("USR"),
      nomeCompleto,
      email,
      telefone,
      cpf,
      senha: senhaCadastro,
      ativo: false,
      tipo: "inspetor",
      adminMaster: false,
      statusCadastro: "pendente",
      criadoEm: new Date().toISOString(),
      aprovadoEm: "",
    };

    setUsuarios((prev) => [...prev, novoUsuario]);
    setAuthForm({ nomeCompleto: "", email: "", telefone: "", cpf: "", senha: "" });
    setMostrarSenha(false);
    alert("Cadastro enviado com sucesso. Aguarde aprovação do administrador Velox para acessar o sistema.");
    setModoAuth("login");
  }

  function fazerLogin(e) {
    e.preventDefault();
    const email = normalizarEmail(authForm.email);
    const senhaDigitada = senhaLimpa(authForm.senha);
    const usuario = usuarios.find(
      (u) => normalizarEmail(u.email) === email && senhaLimpa(u.senha) === senhaDigitada
    );

    if (!usuario) {
      alert("E-mail ou senha inválidos.");
      return;
    }

    if (usuario.ativo === false) {
      alert(usuario.statusCadastro === "bloqueado" ? "Usuário bloqueado pelo administrador." : "Cadastro pendente de aprovação pelo administrador Velox.");
      return;
    }

    setUsuarioLogado(usuario);
    setAuthForm({ nomeCompleto: "", email: "", telefone: "", cpf: "", senha: "" });
    setMostrarSenha(false);
  }

  function sair() {
    if (!window.confirm("Deseja sair do sistema?")) return;
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
    setUsuarios((prev) =>
      prev.map((usuario) =>
        usuario.id === usuarioId
          ? { ...usuario, ativo: true, statusCadastro: "aprovado", aprovadoEm: new Date().toISOString() }
          : usuario
      )
    );
    if (usuario) alert(`Usuário ${usuario.nomeCompleto} aprovado. Ele deve entrar com o mesmo e-mail e senha cadastrados.`);
  }

  function bloquearUsuario(usuarioId) {
    if (!ehAdmin(usuarioLogado)) return;
    const usuario = usuarios.find((u) => u.id === usuarioId);
    if (!usuario || usuario.id === usuarioLogado.id) return;
    if (!window.confirm(`Deseja bloquear o acesso de ${usuario.nomeCompleto}?`)) return;

    setUsuarios((prev) =>
      prev.map((u) =>
        u.id === usuarioId
          ? { ...u, ativo: false, statusCadastro: "bloqueado", bloqueadoEm: new Date().toISOString() }
          : u
      )
    );
  }

  function desbloquearUsuario(usuarioId) {
    if (!ehAdmin(usuarioLogado)) return;
    setUsuarios((prev) =>
      prev.map((usuario) =>
        usuario.id === usuarioId
          ? { ...usuario, ativo: true, statusCadastro: "aprovado", aprovadoEm: usuario.aprovadoEm || new Date().toISOString() }
          : usuario
      )
    );
  }

  function excluirUsuario(usuarioId) {
    if (!ehAdmin(usuarioLogado)) return;
    const usuario = usuarios.find((u) => u.id === usuarioId);
    if (!usuario || usuario.id === usuarioLogado.id) return;
    if (!window.confirm(`Excluir o usuário ${usuario.nomeCompleto} e todas as inspeções vinculadas a ele?`)) return;

    setUsuarios((prev) => prev.filter((u) => u.id !== usuarioId));
    setInspecoes((prev) => prev.filter((insp) => insp.usuarioId !== usuarioId));
    if (adminUsuarioSelecionado === usuarioId) setAdminUsuarioSelecionado("");
  }

  function resetarSenhaUsuario(usuarioId) {
    if (!ehAdmin(usuarioLogado)) return;
    const usuario = usuarios.find((u) => u.id === usuarioId);
    if (!usuario) return;
    const novaSenha = window.prompt(`Digite a nova senha para ${usuario.nomeCompleto}:`);
    const senhaLimpa = String(novaSenha || "").trim();
    if (!senhaLimpa) return;
    if (senhaLimpa.length < 4) {
      alert("A nova senha deve ter pelo menos 4 caracteres.");
      return;
    }

    setUsuarios((prev) =>
      prev.map((u) => (u.id === usuarioId ? { ...u, senha: senhaLimpa, senhaAlteradaEm: new Date().toISOString() } : u))
    );
    alert("Senha alterada com sucesso.");
  }

  function alternarTipoAdmin(usuarioId) {
    if (!ehAdminMaster(usuarioLogado)) {
      alert("Somente o Admin Master pode tornar outro usuário administrador.");
      return;
    }
    const usuario = usuarios.find((u) => u.id === usuarioId);
    if (!usuario || usuario.id === usuarioLogado.id) return;
    const usuarioEhAdmin = ehAdmin(usuario);
    const novoTipo = usuarioEhAdmin ? "inspetor" : "admin";
    if (!window.confirm(`Deseja transformar ${usuario.nomeCompleto} em ${novoTipo === "admin" ? "administrador" : "inspetor"}?`)) return;

    setUsuarios((prev) =>
      prev.map((u) => (u.id === usuarioId ? { ...u, tipo: novoTipo } : u))
    );
  }

  async function exportarExcelPremium() {
    try {
      setGerandoRelatorio(true);
      if (configAerodromo.icao || configAerodromo.nomeAerodromo) salvarInspecaoAtual();

      const workbook = new ExcelJS.Workbook();
      workbook.creator = "Velox Service";
      workbook.created = new Date();

      const logoBase64 = await urlParaBase64(logoVelox);
      const logoId = workbook.addImage({ base64: logoBase64, extension: extensaoImagem(logoBase64) });
      const evidencias = montarEvidencias(true);

      const wsResumo = workbook.addWorksheet("Resumo Geral", {
        pageSetup: { paperSize: 9, orientation: "portrait" },
        headerFooter: {
          oddHeader: "&CRelatório de Inspeção Aeroportuária - Velox Service",
          oddFooter: "&LVELOX SERVICE&R&P de &N",
        },
      });

      wsResumo.addImage(logoId, { tl: { col: 0.2, row: 0.2 }, ext: { width: 210, height: 75 } });
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
        ["Total aplicável", resumoGeral.total],
        ["Percentual concluído", `${resumoGeral.percentual}%`],
        ["Conformes", resumoGeral.contagem["CONFORME"]],
        ["Não conformes", resumoGeral.contagem["NÃO CONFORME"]],
        ["Não aplicáveis", resumoGeral.contagem["NÃO APLICÁVEL"]],
        ["Não verificados", resumoGeral.contagem["NÃO VERIFICADO"]],
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
        { header: "Observações", key: "obs", width: 42 },
        { header: "Status", key: "status", width: 20 },
        { header: "Responsável", key: "responsavel", width: 28 },
        { header: "Prazo", key: "prazo", width: 18 },
        { header: "Evidências", key: "evidencias", width: 24 },
      ];

      wsItens.getRow(1).eachCell((cell) => {
        cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF0A1F12" } };
        cell.alignment = { horizontal: "center", vertical: "middle" };
      });

      NORMAS_IDS.forEach((normaId) => {
        const norma = NORMAS[normaId] || { itens: [] };
        const respostasNorma = respostasPorNorma[normaId] || {};
        const itens = itensAplicaveisDaNorma(normaId);

        itens.forEach((item) => {
          const chave = item.id || item.ref;
          const resposta = respostasNorma[chave] || {};
          const evDoItem = evidencias.filter((ev) => ev.normaId === normaId && ev.itemId === chave).map((ev) => ev.id).join(", ");
          const status = resposta.status || "NÃO VERIFICADO";

          const row = wsItens.addRow({
            norma: norma.nome || normaId,
            id: chave,
            descricao: item.item || item.descricao || "",
            criterio: item.criterio || item.evidencias || "",
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
          row.getCell(6).font = { bold: true, color: { argb: "FFFFFFFF" } };
          row.getCell(6).fill = { type: "pattern", pattern: "solid", fgColor: { argb: `FF${corStatus(status)}` } };
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

      evidencias.forEach((ev, index) => {
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
          const imgId = workbook.addImage({ base64: ev.imagem.data, extension: extensaoImagem(ev.imagem.data) });
          wsEvidencias.addImage(imgId, { tl: { col: 6.1, row: rowIndex - 0.9 }, ext: { width: 185, height: 105 } });
        } catch (erro) {
          console.error("Erro ao inserir imagem no Excel:", erro);
        }
      });

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
    try {
      setGerandoRelatorio(true);
      if (configAerodromo.icao || configAerodromo.nomeAerodromo) salvarInspecaoAtual();

      const doc = new jsPDF("p", "mm", "a4");
      const largura = doc.internal.pageSize.getWidth();
      const altura = doc.internal.pageSize.getHeight();
      const logoBase64 = await urlParaBase64(logoVelox);
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
        doc.addImage(logoBase64, "PNG", 10, 5, 42, 14);
        doc.setFontSize(11);
        doc.setTextColor(255, 255, 255);
        doc.text(titulo, largura - 10, 14, { align: "right" });
      }

      doc.setFillColor(6, 19, 11);
      doc.rect(0, 0, largura, altura, "F");
      doc.setFillColor(32, 196, 90);
      doc.rect(0, 0, 8, altura, "F");
      doc.addImage(logoBase64, "PNG", 22, 24, 78, 28);
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
        ["Conclusão geral", `${resumoGeral.percentual}%`],
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
        ["Total", resumoGeral.total, "0A1F12"],
        ["Conforme", resumoGeral.contagem["CONFORME"], "16A34A"],
        ["Não Conf.", resumoGeral.contagem["NÃO CONFORME"], "EF4444"],
        ["N/A", resumoGeral.contagem["NÃO APLICÁVEL"], "64748B"],
        ["Pendente", resumoGeral.contagem["NÃO VERIFICADO"], "C9A300"],
      ];

      indicadores.forEach(([label, valor, cor], index) => {
        const x = 14 + index * 36;
        doc.setFillColor(`#${cor}`);
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
        const itens = itensAplicaveisDaNorma(normaId);
        const resumoNorma = calcularResumoNorma(normaId);

        doc.addPage();
        cabecalho(`${norma.nome || normaId} - Itens Inspecionados`);
        doc.setFontSize(16);
        doc.setTextColor(10, 31, 18);
        doc.text(`${norma.nome || normaId} • ${resumoNorma.percentual}% concluído`, 14, 40);
        y = 52;

        itens.forEach((item) => {
          const chave = item.id || item.ref;
          const resposta = respostasNorma[chave] || {};
          const status = resposta.status || "NÃO VERIFICADO";
          const textoItem = item.item || item.descricao || "Item de inspeção";
          const obs = resposta.obs || "-";

          if (y > 250) {
            doc.addPage();
            cabecalho(`${norma.nome || normaId} - Itens Inspecionados`);
            y = 38;
          }

          doc.setDrawColor(210, 215, 220);
          doc.setFillColor(248, 250, 252);
          doc.roundedRect(14, y - 5, 182, 30, 2, 2, "FD");
          doc.setFontSize(7.3);
          doc.setTextColor(255, 255, 255);
          doc.setFillColor(`#${corStatus(status)}`);
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
        });
        rodape(norma.nome || normaId);
      });

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

      evidencias.forEach((ev) => {
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
          const formato = extensaoImagem(ev.imagem.data) === "png" ? "PNG" : "JPEG";
          doc.addImage(ev.imagem.data, formato, 122, y - 1, 62, 46);
        } catch (erro) {
          console.error("Erro ao inserir imagem no PDF:", erro);
          doc.setFontSize(8);
          doc.setTextColor(239, 68, 68);
          doc.text("Imagem não pôde ser renderizada.", 122, y + 15);
        }
        y += 65;
      });

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
                    <strong>{inspecao.aeroporto?.nome || "Aeródromo não informado"}</strong>
                    <span>{inspecao.aeroporto?.icao || "Sem ICAO"} • {inspecao.aeroporto?.municipio || "—"}/{inspecao.aeroporto?.uf || "—"}</span>
                    <small>Atualizada em {dataBR(inspecao.atualizadoEm)} • Inspetor: {inspecao.inspetorNome}</small>
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

        <section className="card consulta-card">
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
            <div className="col-6"><button className="btn btn-dark" onClick={exportarExcelPremium} disabled={gerandoRelatorio}>{gerandoRelatorio ? "Gerando relatório..." : "Exportar Excel Completo"}</button></div>
            <div className="col-6"><button className="btn btn-secondary" onClick={exportarPDFPremium} disabled={gerandoRelatorio}>{gerandoRelatorio ? "Gerando relatório..." : "Exportar PDF Completo"}</button></div>
          </div>

          <div className="search-box"><label>Buscar no checklist<input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar item, referência, critério, evidência ou risco..." /></label></div>
        </section>

        <section>
          {itensVisiveis.length === 0 && <div className="card">Nenhum item aplicável encontrado para os parâmetros atuais.</div>}

          {itensVisiveis.map((item, index) => {
            const chave = item.id || item.ref || `${normaSelecionada}-${index}`;
            const resposta = respostas[chave] || {};
            const statusAtual = resposta.status || "NÃO VERIFICADO";

            return (
              <article key={chave} className="checklist-item">
                <div className="checklist-head"><span className="item-ref">{item.ref || item.id}</span><span className={`status-pill ${classeStatus(statusAtual)}`}>{statusAtual}</span></div>
                <h3 className="item-title">{item.item || item.descricao || "Item de verificação"}</h3>
                {item.subparte && <p className="item-text"><strong>Subparte:</strong> {item.subparte}</p>}
                {item.descricao && item.item && <p className="item-text">{item.descricao}</p>}
                {item.criterio && <p className="item-text"><strong>Critério:</strong> {item.criterio}</p>}
                {item.evidencias && <p className="item-text"><strong>Evidências esperadas:</strong> {item.evidencias}</p>}
                {item.risco && <p className="item-text"><strong>Risco:</strong> {item.risco}</p>}

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
                  <div className="col-12"><div className="evidencias-box"><strong>Evidências fotográficas</strong><p>Adicione fotos tiradas na hora ou selecione imagens da galeria do celular.</p><label className="upload-evidencia">Tirar foto ou anexar imagem<input type="file" accept="image/*" multiple onChange={(e) => adicionarEvidencias(item, e.target.files)} /></label>{resposta.evidenciasAnexadas?.length > 0 && (<div className="preview-evidencias">{resposta.evidenciasAnexadas.map((ev, indexEv) => (<div className="preview-card" key={`${ev.nome}-${indexEv}`}><img src={ev.data} alt={ev.nome} /><button type="button" onClick={() => removerEvidencia(item, indexEv)}>Remover</button></div>))}</div>)}</div></div>
                  <div className="col-12"><label>Observações de campo<textarea value={resposta.obs || ""} onChange={(e) => atualizarResposta(item, "obs", e.target.value)} placeholder="Observações, evidências coletadas, pendências ou recomendações..." /></label></div>
                </div>
              </article>
            );
          })}
        </section>
      </main>
    </div>
  );
}
