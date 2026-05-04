import React, { useEffect, useMemo, useState } from "react";
import "./App.css";

import logoVelox from "./assets/logo-velox.png";

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

export default function App() {
  const [normaSelecionada, setNormaSelecionada] = useState("RBAC153");
  const [configAerodromo, setConfigAerodromo] = useState(CONFIG_INICIAL);
  const [baseANAC, setBaseANAC] = useState([]);
  const [icao, setIcao] = useState("");
  const [mensagemBase, setMensagemBase] = useState("");
  const [busca, setBusca] = useState("");
  const [respostas, setRespostas] = useState({});
  const [mostrarConfig, setMostrarConfig] = useState(false);

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