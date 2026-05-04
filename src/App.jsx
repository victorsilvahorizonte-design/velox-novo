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
      const bate = partes.every((parte) =>
        chaveLimpa.includes(limparTexto(parte))
      );

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
    valorPorNome(
      "icao",
      "ICAO",
      "CódigoOACI",
      "Código OACI",
      "CODIGO OACI",
      "Código ICAO",
      "CODIGO ICAO"
    ) || codigoDigitado;

  const nomeAerodromo =
    valorPorNome(
      "nomeAerodromo",
      "Nome",
      "nome",
      "Aeródromo",
      "AERODROMO",
      "Nome do Aeródromo",
      "NOME DO AERODROMO"
    ) ||
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
    valorPorNome("Classe RBAC 153", "classeRBAC153", "CLASSIFICAÇÃO RBAC 153") ||
    "";

  const classeRBAC107 =
    valorPorNome("Classe RBAC 107", "classeRBAC107", "Classificação AVSEC 2026") ||
    "";

  const comprimentoPista = extrairNumero(
    valorPorNome(
      "Comprimento1",
      "comprimentoPista",
      "comprimento",
      "Comprimento",
      "Comprimento da Pista"
    ) ||
      valorPorContem("comprimento") ||
      valorPorContem("pista")
  );

  const larguraPista = extrairNumero(
    valorPorNome("Largura1", "larguraPista", "largura", "Largura") ||
      valorPorContem("largura")
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
    classeRBAC153:
      classeFinal.includes("I") && classeFinal.includes("B")
        ? "Classe I"
        : classeFinal,
    perfilClasseI:
      classeFinal.includes("I-B") || classeFinal.includes("121") ? "B" : "",
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

export default function App() {
  const [normaSelecionada, setNormaSelecionada] = useState("RBAC153");
  const [configAerodromo, setConfigAerodromo] = useState(CONFIG_INICIAL);
  const [baseANAC, setBaseANAC] = useState([]);
  const [icao, setIcao] = useState("");
  const [mensagemBase, setMensagemBase] = useState("");
  const [busca, setBusca] = useState("");
  const [respostas, setRespostas] = useState({});
  const [mostrarConfig, setMostrarConfig] = useState(false);
  const [gerandoRelatorio, setGerandoRelatorio] = useState(false);

  useEffect(() => {
    const respostasSalvas = localStorage.getItem("respostas-inspecao");
    const baseSalva = localStorage.getItem("baseANAC");
    const configSalva = localStorage.getItem("config-aerodromo");

    if (respostasSalvas) {
      try {
        setRespostas(JSON.parse(respostasSalvas));
      } catch {
        setRespostas({});
      }
    }

    if (baseSalva) {
      try {
        setBaseANAC(JSON.parse(baseSalva));
      } catch {
        setBaseANAC([]);
      }
    }

    if (configSalva) {
      try {
        setConfigAerodromo({
          ...CONFIG_INICIAL,
          ...JSON.parse(configSalva),
        });
      } catch {
        setConfigAerodromo(CONFIG_INICIAL);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("respostas-inspecao", JSON.stringify(respostas));
  }, [respostas]);

  useEffect(() => {
    localStorage.setItem("config-aerodromo", JSON.stringify(configAerodromo));
  }, [configAerodromo]);

  async function carregarBaseSeNecessario() {
    if (baseANAC.length > 0) return baseANAC;

    setMensagemBase("Carregando base ANAC de apoio...");

    const dados = await atualizarBaseANAC();

    if (Array.isArray(dados)) {
      setBaseANAC(dados);
      localStorage.setItem("baseANAC", JSON.stringify(dados));
      return dados;
    }

    return [];
  }

  async function aplicarAerodromoPorICAO(codigoInformado) {
    try {
      const codigo = limparTexto(codigoInformado);

      if (codigo.length !== 4) return;

      const consolidado = buscarAerodromoConsolidado(codigo);

      if (consolidado) {
        const config = montarConfigDoConsolidado(consolidado);

        setConfigAerodromo((prev) => ({
          ...prev,
          ...config,
        }));

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

      setConfigAerodromo((prev) => ({
        ...prev,
        ...normalizado,
      }));

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

  const itensAplicaveis = useMemo(() => {
    return (normaAtual.itens || []).filter((item) =>
      verificarAplicabilidade(item, configAerodromo)
    );
  }, [normaAtual, configAerodromo]);

  const itensVisiveis = useMemo(() => {
    const termo = busca.trim().toLowerCase();

    if (!termo) return itensAplicaveis;

    return itensAplicaveis.filter((item) =>
      [
        item.ref,
        item.id,
        item.subparte,
        item.item,
        item.descricao,
        item.criterio,
        item.evidencias,
        item.risco,
      ]
        .join(" ")
        .toLowerCase()
        .includes(termo)
    );
  }, [itensAplicaveis, busca]);

  const resumo = useMemo(() => {
    const contagem = STATUS.reduce((acc, status) => {
      acc[status] = 0;
      return acc;
    }, {});

    itensAplicaveis.forEach((item) => {
      const chave = item.id || item.ref;
      const status = respostas[chave]?.status || "NÃO VERIFICADO";
      contagem[status]++;
    });

    return {
      total: itensAplicaveis.length,
      contagem,
    };
  }, [itensAplicaveis, respostas]);

  function atualizarResposta(item, campo, valor) {
    const chave = item.id || item.ref;

    setRespostas((prev) => ({
      ...prev,
      [chave]: {
        ...prev[chave],
        [campo]: valor,
      },
    }));
  }

  function atualizarCampoConfig(campo, valor) {
    setConfigAerodromo((prev) => {
      const novo = {
        ...prev,
        [campo]: valor,
      };

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
        setRespostas((prev) => {
          const evidenciasAtuais = prev[chave]?.evidenciasAnexadas || [];

          return {
            ...prev,
            [chave]: {
              ...prev[chave],
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
          };
        });
      };

      leitor.readAsDataURL(arquivo);
    });
  }

  function removerEvidencia(item, indexEvidencia) {
    const chave = item.id || item.ref;

    setRespostas((prev) => {
      const evidenciasAtuais = prev[chave]?.evidenciasAnexadas || [];

      return {
        ...prev,
        [chave]: {
          ...prev[chave],
          evidenciasAnexadas: evidenciasAtuais.filter(
            (_, index) => index !== indexEvidencia
          ),
        },
      };
    });
  }

  function limparRespostas() {
    if (!window.confirm("Deseja limpar todas as respostas da inspeção?")) return;

    setRespostas({});
    localStorage.removeItem("respostas-inspecao");
  }

  function montarEvidencias() {
    const lista = [];

    itensAplicaveis.forEach((item) => {
      const chave = item.id || item.ref;
      const resposta = respostas[chave] || {};
      const imagens = resposta.evidenciasAnexadas || [];

      imagens.forEach((imagem) => {
        lista.push({
          id: gerarIdEvidencia(lista.length),
          itemId: chave,
          itemTitulo: item.item || item.descricao || "Item de inspeção",
          requisito: item.criterio || "",
          observacao: resposta.obs || "",
          status: resposta.status || "NÃO VERIFICADO",
          imagem,
        });
      });
    });

    return lista;
  }

  async function exportarExcelPremium() {
    try {
      setGerandoRelatorio(true);

      const workbook = new ExcelJS.Workbook();
      workbook.creator = "Velox Service";
      workbook.created = new Date();

      const logoBase64 = await urlParaBase64(logoVelox);
      const logoId = workbook.addImage({
        base64: logoBase64,
        extension: extensaoImagem(logoBase64),
      });

      const evidencias = montarEvidencias();

      const wsResumo = workbook.addWorksheet("Resumo", {
        pageSetup: { paperSize: 9, orientation: "portrait" },
        headerFooter: {
          oddHeader: "&CRelatório de Inspeção Aeroportuária - Velox Service",
          oddFooter: "&LVELOX SERVICE&R&P de &N",
        },
      });

      wsResumo.addImage(logoId, {
        tl: { col: 0.2, row: 0.2 },
        ext: { width: 210, height: 75 },
      });

      wsResumo.mergeCells("A5:F5");
      wsResumo.getCell("A5").value = "RELATÓRIO DE INSPEÇÃO AEROPORTUÁRIA";
      wsResumo.getCell("A5").font = {
        bold: true,
        size: 18,
        color: { argb: "FFFFFFFF" },
      };
      wsResumo.getCell("A5").alignment = { horizontal: "center" };
      wsResumo.getCell("A5").fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF0A1F12" },
      };

      const resumoLinhas = [
        ["Data da inspeção", new Date().toLocaleDateString("pt-BR")],
        ["Aeródromo", configAerodromo.nomeAerodromo || "Não informado"],
        ["Código ICAO", configAerodromo.icao || "Não informado"],
        ["Município/UF", `${configAerodromo.municipio || "—"} / ${configAerodromo.uf || "—"}`],
        ["Responsável", "Inspetor Velox"],
        ["Norma selecionada", `${normaAtual.nome || normaSelecionada} - ${normaAtual.titulo || ""}`],
        ["Classificação RBAC 153", configAerodromo.classificacaoRBAC153 || configAerodromo.classeRBAC153],
        ["Código RBAC 154", configAerodromo.codigoReferenciaRBAC154],
        ["Categoria RBAC 107", configAerodromo.categoriaRBAC107 || "AP-0"],
        ["Total aplicável", resumo.total],
        ["Conformes", resumo.contagem["CONFORME"]],
        ["Não conformes", resumo.contagem["NÃO CONFORME"]],
        ["Não aplicáveis", resumo.contagem["NÃO APLICÁVEL"]],
        ["Não verificados", resumo.contagem["NÃO VERIFICADO"]],
      ];

      wsResumo.columns = [
        { width: 28 },
        { width: 60 },
        { width: 18 },
        { width: 18 },
        { width: 18 },
        { width: 18 },
      ];

      resumoLinhas.forEach((linha, index) => {
        const row = wsResumo.getRow(index + 7);
        row.values = linha;
        row.getCell(1).font = { bold: true, color: { argb: "FF07120B" } };
        row.getCell(2).font = { color: { argb: "FF0F172A" } };
        row.eachCell((cell) => {
          cell.border = {
            top: { style: "thin", color: { argb: "FFD1D5DB" } },
            left: { style: "thin", color: { argb: "FFD1D5DB" } },
            bottom: { style: "thin", color: { argb: "FFD1D5DB" } },
            right: { style: "thin", color: { argb: "FFD1D5DB" } },
          };
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: index % 2 === 0 ? "FFF8FAFC" : "FFFFFFFF" },
          };
        });
      });

      const wsItens = workbook.addWorksheet("Itens Inspecionados", {
        views: [{ state: "frozen", ySplit: 1 }],
        headerFooter: {
          oddHeader: "&CItens Inspecionados - Velox Service",
          oddFooter: "&LRelatório Oficial&R&P de &N",
        },
      });

      wsItens.columns = [
        { header: "ID", key: "id", width: 18 },
        { header: "Descrição", key: "descricao", width: 48 },
        { header: "Requisito Violado / Critério", key: "criterio", width: 48 },
        { header: "Observações", key: "obs", width: 42 },
        { header: "Status", key: "status", width: 20 },
        { header: "Responsável", key: "responsavel", width: 24 },
        { header: "Prazo", key: "prazo", width: 18 },
        { header: "Evidências", key: "evidencias", width: 24 },
      ];

      wsItens.getRow(1).eachCell((cell) => {
        cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FF0A1F12" },
        };
        cell.alignment = { horizontal: "center", vertical: "middle" };
      });

      itensAplicaveis.forEach((item) => {
        const chave = item.id || item.ref;
        const resposta = respostas[chave] || {};
        const evDoItem = evidencias
          .filter((ev) => ev.itemId === chave)
          .map((ev) => ev.id)
          .join(", ");

        const row = wsItens.addRow({
          id: chave,
          descricao: item.item || item.descricao || "",
          criterio: item.criterio || item.evidencias || "",
          obs: resposta.obs || "",
          status: resposta.status || "NÃO VERIFICADO",
          responsavel: resposta.responsavel || "",
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

        row.getCell(5).font = {
          bold: true,
          color: { argb: "FFFFFFFF" },
        };
        row.getCell(5).fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: `FF${corStatus(resposta.status || "NÃO VERIFICADO")}` },
        };
      });

      const wsEvidencias = workbook.addWorksheet("Evidências", {
        headerFooter: {
          oddHeader: "&CEvidências Fotográficas - Velox Service",
          oddFooter: "&LRegistro Fotográfico Oficial&R&P de &N",
        },
      });

      wsEvidencias.columns = [
        { header: "ID Evidência", key: "id", width: 18 },
        { header: "ID Item", key: "itemId", width: 18 },
        { header: "Item Inspecionado", key: "itemTitulo", width: 48 },
        { header: "Status", key: "status", width: 20 },
        { header: "Observação", key: "observacao", width: 48 },
        { header: "Foto", key: "foto", width: 34 },
      ];

      wsEvidencias.getRow(1).eachCell((cell) => {
        cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FF0A1F12" },
        };
        cell.alignment = { horizontal: "center", vertical: "middle" };
      });

      evidencias.forEach((ev, index) => {
        const rowIndex = index + 2;
        const row = wsEvidencias.addRow({
          id: ev.id,
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
          const imgId = workbook.addImage({
            base64: ev.imagem.data,
            extension: extensaoImagem(ev.imagem.data),
          });

          wsEvidencias.addImage(imgId, {
            tl: { col: 5.1, row: rowIndex - 0.9 },
            ext: { width: 185, height: 105 },
          });
        } catch (erro) {
          console.error("Erro ao inserir imagem no Excel:", erro);
        }
      });

      const buffer = await workbook.xlsx.writeBuffer();

      saveAs(
        new Blob([buffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        }),
        `Relatorio_Inspecao_${configAerodromo.icao || "VELOX"}.xlsx`
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

      const doc = new jsPDF("p", "mm", "a4");
      const largura = doc.internal.pageSize.getWidth();
      const altura = doc.internal.pageSize.getHeight();
      const logoBase64 = await urlParaBase64(logoVelox);
      const evidencias = montarEvidencias();

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
      doc.text("Relatório de Inspeção", 22, 82);
      doc.text("Aeroportuária", 22, 94);

      doc.setFontSize(11);
      doc.setTextColor(210, 230, 218);
      doc.text("Relatório técnico oficial com checklist, observações e evidências fotográficas.", 22, 106);

      doc.setDrawColor(32, 196, 90);
      doc.line(22, 114, 185, 114);

      doc.setFontSize(12);
      doc.setTextColor(255, 255, 255);
      doc.text(`Aeródromo: ${configAerodromo.nomeAerodromo || "Não informado"}`, 22, 132);
      doc.text(`ICAO: ${configAerodromo.icao || "Não informado"}`, 22, 142);
      doc.text(`Município/UF: ${configAerodromo.municipio || "—"} / ${configAerodromo.uf || "—"}`, 22, 152);
      doc.text(`Data: ${new Date().toLocaleDateString("pt-BR")}`, 22, 162);
      doc.text(`Responsável: Inspetor Velox`, 22, 172);

      doc.setFontSize(9);
      doc.setTextColor(180, 210, 190);
      doc.text("RBAC 153 • RBAC 154 • RBAC 107", 22, 194);
      rodape("Capa");

      doc.addPage();
      cabecalho("Sumário Executivo");
      doc.setTextColor(20, 30, 40);

      doc.setFontSize(18);
      doc.text("Sumário", 14, 40);

      doc.setFontSize(11);
      const sumario = [
        "1. Introdução",
        "2. Informações gerais da inspeção",
        "3. Indicadores de conformidade",
        "4. Itens inspecionados",
        "5. Observações de campo",
        "6. Evidências fotográficas",
      ];

      let y = 55;
      sumario.forEach((item) => {
        doc.text(item, 20, y);
        y += 9;
      });

      rodape("Sumário");

      doc.addPage();
      cabecalho("Introdução e Dados Gerais");

      doc.setFontSize(16);
      doc.setTextColor(10, 31, 18);
      doc.text("1. Introdução", 14, 40);

      doc.setFontSize(10);
      doc.setTextColor(45, 55, 65);
      const intro = doc.splitTextToSize(
        "Este relatório consolida as informações coletadas durante a inspeção aeroportuária realizada por meio do Sistema Inteligente de Inspeção Aeroportuária da Velox Service. O documento apresenta os itens verificados, os requisitos avaliados, as observações de campo, os status de conformidade e as evidências fotográficas vinculadas a cada item inspecionado.",
        180
      );
      doc.text(intro, 14, 50);

      doc.setFontSize(16);
      doc.setTextColor(10, 31, 18);
      doc.text("2. Informações Gerais", 14, 88);

      const dadosGerais = [
        ["Aeródromo", configAerodromo.nomeAerodromo || "Não informado"],
        ["ICAO", configAerodromo.icao || "Não informado"],
        ["Município/UF", `${configAerodromo.municipio || "—"} / ${configAerodromo.uf || "—"}`],
        ["Norma", `${normaAtual.nome || normaSelecionada}`],
        ["RBAC 153", configAerodromo.classificacaoRBAC153 || configAerodromo.classeRBAC153],
        ["RBAC 154", configAerodromo.codigoReferenciaRBAC154],
        ["RBAC 107", configAerodromo.categoriaRBAC107 || "AP-0"],
      ];

      y = 100;
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

      doc.setFontSize(16);
      doc.setTextColor(10, 31, 18);
      doc.text("3. Indicadores de Conformidade", 14, y + 12);

      y += 24;
      const indicadores = [
        ["Total Aplicável", resumo.total, "0A1F12"],
        ["Conforme", resumo.contagem["CONFORME"], "16A34A"],
        ["Não Conforme", resumo.contagem["NÃO CONFORME"], "EF4444"],
        ["Não Aplicável", resumo.contagem["NÃO APLICÁVEL"], "64748B"],
        ["Não Verificado", resumo.contagem["NÃO VERIFICADO"], "C9A300"],
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

      rodape("Introdução");

      doc.addPage();
      cabecalho("Itens Inspecionados");

      doc.setFontSize(16);
      doc.setTextColor(10, 31, 18);
      doc.text("4. Itens Inspecionados", 14, 40);

      y = 52;

      itensAplicaveis.forEach((item) => {
        const chave = item.id || item.ref;
        const resposta = respostas[chave] || {};
        const status = resposta.status || "NÃO VERIFICADO";
        const textoItem = item.item || item.descricao || "Item de inspeção";
        const obs = resposta.obs || "-";

        if (y > 250) {
          doc.addPage();
          cabecalho("Itens Inspecionados");
          y = 38;
        }

        doc.setDrawColor(210, 215, 220);
        doc.setFillColor(248, 250, 252);
        doc.roundedRect(14, y - 5, 182, 30, 2, 2, "FD");

        doc.setFontSize(8);
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

      rodape("Itens Inspecionados");

      doc.addPage();
      cabecalho("Observações de Campo");

      doc.setFontSize(16);
      doc.setTextColor(10, 31, 18);
      doc.text("5. Observações", 14, 40);

      y = 52;

      itensAplicaveis.forEach((item) => {
        const chave = item.id || item.ref;
        const resposta = respostas[chave] || {};
        if (!resposta.obs) return;

        if (y > 260) {
          doc.addPage();
          cabecalho("Observações de Campo");
          y = 38;
        }

        doc.setFontSize(9);
        doc.setTextColor(10, 31, 18);
        doc.text(`${chave} - ${item.item || item.descricao || "Item"}`, 14, y);

        y += 6;

        doc.setFontSize(8);
        doc.setTextColor(45, 55, 65);
        doc.text(doc.splitTextToSize(resposta.obs, 180), 14, y);

        y += 18;
      });

      rodape("Observações");

      doc.addPage();
      cabecalho("Evidências Fotográficas");

      doc.setFontSize(16);
      doc.setTextColor(10, 31, 18);
      doc.text("6. Evidências", 14, 40);

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
        doc.text(`${ev.id} • Item ${ev.itemId}`, 18, y + 2);

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

      doc.save(`Relatorio_Inspecao_${configAerodromo.icao || "VELOX"}.pdf`);
    } catch (erro) {
      console.error(erro);
      alert("Erro ao gerar PDF premium.");
    } finally {
      setGerandoRelatorio(false);
    }
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
      </header>

      <section className="hero">
        <div className="hero-content">
          <span className="hero-tag">VELOX SERVICE • INSPEÇÃO ANAC</span>
          <h1>Eficiência, qualidade e controle técnico para inspeções aeroportuárias.</h1>
          <p>
            Sistema profissional para auditoria de operação, infraestrutura e AVSEC,
            com aplicabilidade automática por aeródromo.
          </p>
        </div>
      </section>

      <main className="container">
        <section className="card consulta-card">
          <div className="grid">
            <div className="col-8">
              <h2 className="card-title">Consulta automática por ICAO</h2>
              <p className="card-subtitle">
                Digite o código ICAO para carregar automaticamente os dados do
                aeródromo, suas classificações e a aplicabilidade das normas.
              </p>
            </div>

            <div className="col-4">
              <div className="icao-box">
                <span>Código ICAO</span>
                <input
                  value={icao}
                  onChange={(e) => setIcao(e.target.value.toUpperCase())}
                  placeholder="SBGO"
                  maxLength={4}
                />
              </div>
            </div>

            {mensagemBase && (
              <div className="col-12">
                <div className="mensagem">{mensagemBase}</div>
              </div>
            )}
          </div>
        </section>

        <section className="grid">
          <div className="col-4">
            <div className="metric-card">
              <div className="metric-label">Aeródromo ativo</div>
              <div className="metric-value">{configAerodromo.icao || "—"}</div>
              <p>{configAerodromo.nomeAerodromo || "Nenhum aeródromo carregado"}</p>
            </div>
          </div>

          <div className="col-4">
            <div className="metric-card">
              <div className="metric-label">Localidade</div>
              <div className="metric-value small">
                {configAerodromo.municipio || "—"}
              </div>
              <p>{configAerodromo.uf || "UF não informada"}</p>
            </div>
          </div>

          <div className="col-4">
            <div className="metric-card">
              <div className="metric-label">Fonte</div>
              <div className="metric-value small">
                {configAerodromo.fonteClassificacao
                  ? "Consolidada"
                  : baseANAC.length
                  ? `${baseANAC.length} registros`
                  : "—"}
              </div>
              <p>Banco ANAC / Velox</p>
            </div>
          </div>
        </section>

        <section className="grid">
          <div className="col-4">
            <div className="metric-card">
              <div className="metric-label">RBAC 153</div>
              <div className="metric-value small">
                {configAerodromo.classificacaoRBAC153 ||
                  configAerodromo.classeRBAC153}
              </div>
              <p>Classificação operacional</p>
            </div>
          </div>

          <div className="col-4">
            <div className="metric-card">
              <div className="metric-label">RBAC 154</div>
              <div className="metric-value">{configAerodromo.codigoReferenciaRBAC154}</div>
              <p>
                {configAerodromo.comprimentoPista
                  ? `${configAerodromo.comprimentoPista} m`
                  : "Pista não informada"}
              </p>
            </div>
          </div>

          <div className="col-4">
            <div className="metric-card">
              <div className="metric-label">RBAC 107</div>
              <div className="metric-value">{configAerodromo.categoriaRBAC107 || "AP-0"}</div>
              <p>Categoria AVSEC</p>
            </div>
          </div>
        </section>

        <section className="card">
          <div className="grid">
            <div className="col-8">
              <h2 className="card-title">Parâmetros de aplicabilidade</h2>
              <p className="card-subtitle">
                Ajuste manualmente somente quando o banco automático estiver
                incompleto ou quando houver necessidade técnica.
              </p>
            </div>

            <div className="col-4 align-end">
              <button
                className="btn btn-dark"
                onClick={() => setMostrarConfig(!mostrarConfig)}
              >
                {mostrarConfig
                  ? "Ocultar parâmetros"
                  : "Ajustar parâmetros avançados"}
              </button>
            </div>
          </div>

          {mostrarConfig && (
            <div className="grid config-grid">
              <div className="col-4">
                <label>
                  Uso público
                  <select
                    value={configAerodromo.usoPublico ? "SIM" : "NÃO"}
                    onChange={(e) =>
                      atualizarCampoConfig("usoPublico", e.target.value === "SIM")
                    }
                  >
                    <option>SIM</option>
                    <option>NÃO</option>
                  </select>
                </label>
              </div>

              <div className="col-4">
                <label>
                  Passageiros/ano
                  <input
                    type="number"
                    value={configAerodromo.passageirosAno}
                    onChange={(e) =>
                      atualizarCampoConfig("passageirosAno", Number(e.target.value))
                    }
                  />
                </label>
              </div>

              <div className="col-4">
                <label>
                  Classe RBAC 153
                  <select
                    value={configAerodromo.classeRBAC153}
                    onChange={(e) =>
                      atualizarCampoConfig("classeRBAC153", e.target.value)
                    }
                  >
                    <option>Classe I</option>
                    <option>Classe II</option>
                    <option>Classe III</option>
                    <option>Classe IV</option>
                    <option>Não classificado</option>
                  </select>
                </label>
              </div>

              <div className="col-4">
                <label>
                  Comprimento da pista
                  <input
                    type="number"
                    value={configAerodromo.comprimentoPista}
                    onChange={(e) =>
                      atualizarCampoConfig("comprimentoPista", Number(e.target.value))
                    }
                  />
                </label>
              </div>

              <div className="col-4">
                <label>
                  Código número RBAC 154
                  <select
                    value={configAerodromo.codigoNumero}
                    onChange={(e) =>
                      atualizarCampoConfig("codigoNumero", Number(e.target.value))
                    }
                  >
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                    <option value={4}>4</option>
                  </select>
                </label>
              </div>

              <div className="col-4">
                <label>
                  Código letra RBAC 154
                  <select
                    value={configAerodromo.codigoLetra}
                    onChange={(e) =>
                      atualizarCampoConfig("codigoLetra", e.target.value)
                    }
                  >
                    <option>A</option>
                    <option>B</option>
                    <option>C</option>
                    <option>D</option>
                    <option>E</option>
                    <option>F</option>
                  </select>
                </label>
              </div>

              <div className="col-4">
                <label>
                  Tipo de operação
                  <select
                    value={configAerodromo.tipoOperacao}
                    onChange={(e) =>
                      atualizarCampoConfig("tipoOperacao", e.target.value)
                    }
                  >
                    <option>VFR</option>
                    <option>IFR</option>
                  </select>
                </label>
              </div>

              <div className="col-4">
                <label>
                  Operação noturna
                  <select
                    value={configAerodromo.operacaoNoturna ? "SIM" : "NÃO"}
                    onChange={(e) =>
                      atualizarCampoConfig("operacaoNoturna", e.target.value === "SIM")
                    }
                  >
                    <option>SIM</option>
                    <option>NÃO</option>
                  </select>
                </label>
              </div>

              <div className="col-4">
                <label>
                  Pavimentado
                  <select
                    value={configAerodromo.pavimentado ? "SIM" : "NÃO"}
                    onChange={(e) =>
                      atualizarCampoConfig("pavimentado", e.target.value === "SIM")
                    }
                  >
                    <option>SIM</option>
                    <option>NÃO</option>
                  </select>
                </label>
              </div>
            </div>
          )}
        </section>

        <section className="card">
          <div className="norma-tabs">
            {Object.values(NORMAS).map((norma) => (
              <button
                key={norma.id}
                className={
                  normaSelecionada === norma.id
                    ? "norma-tab active"
                    : "norma-tab"
                }
                onClick={() => setNormaSelecionada(norma.id)}
              >
                {norma.nome}
              </button>
            ))}
          </div>

          <div className="grid section-space">
            <div className="col-8">
              <h2 className="card-title">{normaAtual.nome}</h2>
              <p className="card-subtitle">{normaAtual.titulo}</p>
            </div>

            <div className="col-4 align-end">
              <button className="btn btn-secondary" onClick={limparRespostas}>
                Limpar respostas
              </button>
            </div>
          </div>

          <div className="grid">
            <div className="col-4">
              <div className="metric-card total">
                <div className="metric-label">Total aplicável</div>
                <div className="metric-value">{resumo.total}</div>
              </div>
            </div>

            {STATUS.map((status) => (
              <div className="col-4" key={status}>
                <div className="metric-card">
                  <div className="metric-label">{status}</div>
                  <div className="metric-value">{resumo.contagem[status]}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid section-space">
            <div className="col-6">
              <button
                className="btn btn-dark"
                onClick={exportarExcelPremium}
                disabled={gerandoRelatorio}
              >
                {gerandoRelatorio ? "Gerando relatório..." : "Exportar Excel Premium"}
              </button>
            </div>

            <div className="col-6">
              <button
                className="btn btn-secondary"
                onClick={exportarPDFPremium}
                disabled={gerandoRelatorio}
              >
                {gerandoRelatorio ? "Gerando relatório..." : "Exportar PDF Premium"}
              </button>
            </div>
          </div>

          <div className="search-box">
            <label>
              Buscar no checklist
              <input
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Buscar item, referência, critério, evidência ou risco..."
              />
            </label>
          </div>
        </section>

        <section>
          {itensVisiveis.length === 0 && (
            <div className="card">
              Nenhum item aplicável encontrado para os parâmetros atuais.
            </div>
          )}

          {itensVisiveis.map((item, index) => {
            const chave = item.id || item.ref || `${normaSelecionada}-${index}`;
            const resposta = respostas[chave] || {};
            const statusAtual = resposta.status || "NÃO VERIFICADO";

            return (
              <article key={chave} className="checklist-item">
                <div className="checklist-head">
                  <span className="item-ref">{item.ref || item.id}</span>
                  <span className={`status-pill ${classeStatus(statusAtual)}`}>
                    {statusAtual}
                  </span>
                </div>

                <h3 className="item-title">
                  {item.item || item.descricao || "Item de verificação"}
                </h3>

                {item.subparte && (
                  <p className="item-text">
                    <strong>Subparte:</strong> {item.subparte}
                  </p>
                )}

                {item.descricao && item.item && (
                  <p className="item-text">{item.descricao}</p>
                )}

                {item.criterio && (
                  <p className="item-text">
                    <strong>Critério:</strong> {item.criterio}
                  </p>
                )}

                {item.evidencias && (
                  <p className="item-text">
                    <strong>Evidências esperadas:</strong> {item.evidencias}
                  </p>
                )}

                {item.risco && (
                  <p className="item-text">
                    <strong>Risco:</strong> {item.risco}
                  </p>
                )}

                <div className="status-row">
                  {STATUS.map((status) => {
                    const ativo = statusAtual === status;
                    const classe = classeStatus(status);

                    return (
                      <button
                        key={status}
                        type="button"
                        className={
                          ativo
                            ? `status-btn ${classe} active`
                            : `status-btn ${classe}`
                        }
                        onClick={() => atualizarResposta(item, "status", status)}
                      >
                        {status}
                      </button>
                    );
                  })}
                </div>

                <div className="grid field-grid">
                  <div className="col-6">
                    <label>
                      Responsável
                      <input
                        value={resposta.responsavel || ""}
                        onChange={(e) =>
                          atualizarResposta(item, "responsavel", e.target.value)
                        }
                        placeholder="Responsável"
                      />
                    </label>
                  </div>

                  <div className="col-6">
                    <label>
                      Prazo
                      <select
                        value={resposta.prazo || ""}
                        onChange={(e) =>
                          atualizarResposta(item, "prazo", e.target.value)
                        }
                      >
                        <option value="">Não definido</option>
                        <option>IMEDIATO</option>
                        <option>CURTO PRAZO</option>
                        <option>MÉDIO PRAZO</option>
                        <option>LONGO PRAZO</option>
                      </select>
                    </label>
                  </div>

                  <div className="col-12">
                    <div className="evidencias-box">
                      <strong>Evidências fotográficas</strong>
                      <p>
                        Adicione fotos tiradas na hora ou selecione imagens da
                        galeria do celular.
                      </p>

                      <label className="upload-evidencia">
                        Tirar foto ou anexar imagem
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={(e) => adicionarEvidencias(item, e.target.files)}
                        />
                      </label>

                      {resposta.evidenciasAnexadas?.length > 0 && (
                        <div className="preview-evidencias">
                          {resposta.evidenciasAnexadas.map((ev, indexEv) => (
                            <div className="preview-card" key={`${ev.nome}-${indexEv}`}>
                              <img src={ev.data} alt={ev.nome} />
                              <button
                                type="button"
                                onClick={() => removerEvidencia(item, indexEv)}
                              >
                                Remover
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="col-12">
                    <label>
                      Observações de campo
                      <textarea
                        value={resposta.obs || ""}
                        onChange={(e) =>
                          atualizarResposta(item, "obs", e.target.value)
                        }
                        placeholder="Observações, evidências coletadas, pendências ou recomendações..."
                      />
                    </label>
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      </main>
    </div>
  );
}