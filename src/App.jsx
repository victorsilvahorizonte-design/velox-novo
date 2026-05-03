import React, { useEffect, useMemo, useState } from "react";
import "./App.css";

import { NORMAS } from "./data/normas";
import { CONFIG_INICIAL_RBAC154 } from "./data/configuracaoAerodromo";
import { verificarAplicabilidade } from "./utils/aplicabilidade";
import { buscarAerodromoPorICAO } from "./utils/buscarAerodromoPorICAO";
import { classificarAerodromo } from "./utils/classificacaoAerodromo";

function normalizarItem(item) {
  return {
    ref: item["REF"] ?? item.ref ?? "",
    subparte: item["Subparte"] ?? item.subparte ?? "Sem subparte",
    itemVerificavel: item["Item verificável"] ?? item.itemVerificavel ?? "",
    criterio: item["Critério de conformidade"] ?? item.criterio ?? "",
    evidencias: item["Evidências esperadas"] ?? item.evidencias ?? "",
    risco: item["Risco associado"] ?? item.risco ?? "",
    statusInicial: item["Status"] ?? item.statusInicial ?? "NÃO VERIFICADO",
    observacaoInicial: item["Observação"] ?? item.observacaoInicial ?? "",
    evidenciaInicial: item["Evidência coletada"] ?? item.evidenciaInicial ?? "",
    responsavelInicial: item["Responsável"] ?? item.responsavelInicial ?? "",
    prazoInicial: item["Prazo"] ?? item.prazoInicial ?? "CURTO PRAZO",
    criticidade: item["Criticidade"] ?? item.criticidade ?? "MÉDIO",
    aplicabilidade: item["Aplicabilidade"] ?? item.aplicabilidade ?? "APLICÁVEL",
    motivoNA: item["Motivo N/A"] ?? item.motivoNA ?? "",
    classeMinima: Number(item["Classe mínima"] ?? item.classeMinima ?? 0),
    condicaoComplementar:
      item["Condição complementar"] ?? item.condicaoComplementar ?? "Sempre",
    regraAplicabilidade: item.regraAplicabilidade ?? null,
  };
}

const STATUS = ["CONFORME", "NÃO CONFORME", "NÃO APLICÁVEL", "NÃO VERIFICADO"];
const PRAZOS = ["IMEDIATO", "CURTO PRAZO", "MÉDIO PRAZO", "LONGO PRAZO"];
const CRITICIDADES = ["TODAS", "ALTO", "MÉDIO", "BAIXO"];

function pesoCriticidade(valor) {
  const texto = String(valor || "").toUpperCase();
  if (texto.includes("ALTO") || texto.includes("CRÍTICO") || texto.includes("CRITICO")) return 3;
  if (texto.includes("MÉDIO") || texto.includes("MEDIO")) return 2;
  return 1;
}

function chaveStorage(aerodromo, icao, normaSelecionada) {
  return `inspecao-${normaSelecionada}-${String(icao || aerodromo || "rascunho")
    .trim()
    .toLowerCase()}`;
}

function criarRespostasIniciais(checklistBase) {
  return checklistBase.reduce((acc, item) => {
    acc[item.ref] = {
      status: item.statusInicial || "NÃO VERIFICADO",
      observacao: item.observacaoInicial || "",
      evidencia: item.evidenciaInicial || "",
      responsavel: item.responsavelInicial || "",
      prazo:
        item.prazoInicial ||
        (pesoCriticidade(item.criticidade) === 3 ? "IMEDIATO" : "CURTO PRAZO"),
      anexo: "",
    };
    return acc;
  }, {});
}

function csvEscape(v) {
  const texto = String(v ?? "").replace(/"/g, '""');
  return `"${texto}"`;
}

function baixarArquivo(nome, conteudo, tipo = "text/plain;charset=utf-8") {
  const blob = new Blob([conteudo], { type: tipo });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = nome;
  a.click();
  URL.revokeObjectURL(url);
}

export default function App() {
  const [normaSelecionada, setNormaSelecionada] = useState("RBAC154");
  const [aerodromo, setAerodromo] = useState("Aeroporto Auditado");
  const [icao, setIcao] = useState("");
  const [inspetor, setInspetor] = useState("");
  const [data, setData] = useState(new Date().toISOString().slice(0, 10));

  const [classe, setClasse] = useState(0);
  const [busca, setBusca] = useState("");
  const [subparte, setSubparte] = useState("TODAS");
  const [statusFiltro, setStatusFiltro] = useState("TODOS");
  const [criticidadeFiltro, setCriticidadeFiltro] = useState("TODAS");
  const [aba, setAba] = useState("checklist");
  const [configAerodromo, setConfigAerodromo] = useState(CONFIG_INICIAL_RBAC154);
  const [mensagemICAO, setMensagemICAO] = useState("");

  const [tipoUso, setTipoUso] = useState("");
  const [passageirosAno, setPassageirosAno] = useState(0);
  const [tipoAeronave, setTipoAeronave] = useState("");
  const [comprimentoPista, setComprimentoPista] = useState(0);
  const [envergaduraMaxima, setEnvergaduraMaxima] = useState(0);
  const [operacaoDomestica, setOperacaoDomestica] = useState(false);
  const [operacaoInternacional, setOperacaoInternacional] = useState(false);
  const [operacaoCarga, setOperacaoCarga] = useState(false);
  const [operacaoPassageiros, setOperacaoPassageiros] = useState(false);

  const tipoOperacaoAVSEC = useMemo(() => {
    const ops = [];
    if (operacaoDomestica) ops.push("doméstica");
    if (operacaoInternacional) ops.push("internacional");
    if (operacaoCarga) ops.push("carga");
    if (operacaoPassageiros) ops.push("passageiros");
    return ops;
  }, [operacaoDomestica, operacaoInternacional, operacaoCarga, operacaoPassageiros]);

  const classificacao = useMemo(
    () =>
      classificarAerodromo({
        tipoUso,
        passageirosAno: Number(passageirosAno),
        comprimentoPista: Number(comprimentoPista),
        envergaduraMaxima: Number(envergaduraMaxima),
        tipoOperacaoAVSEC,
      }),
    [tipoUso, passageirosAno, comprimentoPista, envergaduraMaxima, tipoOperacaoAVSEC]
  );

  const CHECKLIST = useMemo(() => {
    const dados = NORMAS[normaSelecionada]?.dados || [];
    return dados.map(normalizarItem);
  }, [normaSelecionada]);

  const [respostas, setRespostas] = useState(() => criarRespostasIniciais(CHECKLIST));

  useEffect(() => {
    setRespostas(criarRespostasIniciais(CHECKLIST));
    setSubparte("TODAS");
    setStatusFiltro("TODOS");
    setCriticidadeFiltro("TODAS");
    setAba("checklist");
  }, [normaSelecionada, CHECKLIST]);

  useEffect(() => {
    if (icao.length !== 4) {
      setMensagemICAO("");
      return;
    }

    const dados = buscarAerodromoPorICAO(icao);

    if (!dados) {
      setMensagemICAO("ICAO não encontrado na base local.");
      setAerodromo("Aeroporto Auditado");
      setTipoUso("");
      setPassageirosAno(0);
      setComprimentoPista(0);
      setEnvergaduraMaxima(0);
      setTipoAeronave("");
      setClasse(0);
      return;
    }

    setMensagemICAO("Dados carregados automaticamente.");
    setAerodromo(`${dados.nome} - ${dados.cidade}/${dados.uf}`);
    setTipoUso(dados.uso || "Público");
    setPassageirosAno(Number(dados.passageirosAno || 0));
    setComprimentoPista(Number(dados.comprimentoPista || 0));
    setEnvergaduraMaxima(Number(dados.envergaduraMaxima || 0));
    setTipoAeronave(dados.tipoAeronave || "médias");

    const ops = dados.tipoOperacaoAVSEC || [];

    setOperacaoDomestica(ops.includes("doméstica") || ops.includes("domestica"));
    setOperacaoInternacional(ops.includes("internacional"));
    setOperacaoCarga(ops.includes("carga"));
    setOperacaoPassageiros(ops.includes("passageiros"));

    const resultado = classificarAerodromo({
      tipoUso: dados.uso || "Público",
      passageirosAno: Number(dados.passageirosAno || 0),
      comprimentoPista: Number(dados.comprimentoPista || 0),
      envergaduraMaxima: Number(dados.envergaduraMaxima || 0),
      tipoOperacaoAVSEC: ops,
    });

    setClasse(resultado.classe153);

    setConfigAerodromo((prev) => ({
      ...prev,
      codigoNumero: resultado.codigoNumero,
      codigoLetra: resultado.codigoLetra,
      tipoOperacao: dados.operacao === "IFR" ? "IFR_NAO_PRECISAO" : "VFR",
      pista: true,
      taxiway: Boolean(dados.taxiway ?? true),
      patio: Boolean(dados.patio ?? true),
      pavimentado: Boolean(dados.pavimentado ?? true),
      sistemaEletrico: Boolean(dados.sistemaEletrico ?? false),
      operacaoNoturna: Boolean(dados.operacaoNoturna ?? false),
    }));
  }, [icao]);

  useEffect(() => {
    const salvo = localStorage.getItem(chaveStorage(aerodromo, icao, normaSelecionada));
    if (!salvo) return;

    try {
      const dados = JSON.parse(salvo);
      setRespostas({ ...criarRespostasIniciais(CHECKLIST), ...(dados.respostas || {}) });
      setInspetor(dados.inspetor || "");
      setData(dados.data || new Date().toISOString().slice(0, 10));
      setConfigAerodromo(dados.configAerodromo || CONFIG_INICIAL_RBAC154);
    } catch (e) {
      console.error("Falha ao carregar rascunho", e);
    }
  }, [aerodromo, icao, normaSelecionada, CHECKLIST]);

  useEffect(() => {
    const t = setTimeout(() => salvar(false), 600);
    return () => clearTimeout(t);
  }, [respostas, aerodromo, icao, inspetor, data, classe, normaSelecionada, configAerodromo]);

  const checklist = useMemo(() => {
    return CHECKLIST.map((item, idx) => {
      const aplicavelPorClasse = Number(classe) >= Number(item.classeMinima || 0);
      const aplicavelPorRegra =
        normaSelecionada === "RBAC154"
          ? verificarAplicabilidade(item, configAerodromo)
          : true;

      const aplicavelFinal = aplicavelPorClasse && aplicavelPorRegra;

      return {
        ...item,
        idInterno: `${normaSelecionada}-${item.ref}-${idx}`,
        aplicavelPorClasse: aplicavelFinal,
        motivoNA: !aplicavelPorClasse
          ? "Não aplicável pela classe automática RBAC 153"
          : !aplicavelPorRegra
          ? "Não aplicável pela configuração RBAC 154"
          : "",
      };
    });
  }, [CHECKLIST, classe, configAerodromo, normaSelecionada]);

  const subpartes = useMemo(
    () => ["TODAS", ...Array.from(new Set(CHECKLIST.map((i) => i.subparte)))],
    [CHECKLIST]
  );

  const filtrados = useMemo(() => {
    return checklist.filter((item) => {
      const r = respostas[item.ref] || {};
      const statusReal = item.aplicavelPorClasse
        ? r.status || "NÃO VERIFICADO"
        : "NÃO APLICÁVEL";

      const texto = [
        item.ref,
        item.subparte,
        item.itemVerificavel,
        item.criterio,
        item.evidencias,
        item.risco,
        item.criticidade,
      ]
        .join(" ")
        .toLowerCase();

      return (
        texto.includes(busca.toLowerCase()) &&
        (subparte === "TODAS" || item.subparte === subparte) &&
        (statusFiltro === "TODOS" || statusReal === statusFiltro) &&
        (criticidadeFiltro === "TODAS" || item.criticidade === criticidadeFiltro)
      );
    });
  }, [checklist, respostas, busca, subparte, statusFiltro, criticidadeFiltro]);

  const metricas = useMemo(() => {
    const aplicaveis = checklist.filter((i) => i.aplicavelPorClasse);
    const conformes = checklist.filter(
      (i) => i.aplicavelPorClasse && respostas[i.ref]?.status === "CONFORME"
    );
    const ncs = checklist.filter(
      (i) => i.aplicavelPorClasse && respostas[i.ref]?.status === "NÃO CONFORME"
    );
    const pendentes = checklist.filter(
      (i) =>
        i.aplicavelPorClasse &&
        (!respostas[i.ref]?.status || respostas[i.ref]?.status === "NÃO VERIFICADO")
    );
    const naoAplicaveis = checklist.filter(
      (i) => !i.aplicavelPorClasse || respostas[i.ref]?.status === "NÃO APLICÁVEL"
    );
    const ncAlto = ncs.filter((i) => pesoCriticidade(i.criticidade) === 3);

    return {
      total: checklist.length,
      aplicaveis: aplicaveis.length,
      conformes: conformes.length,
      ncs: ncs.length,
      pendentes: pendentes.length,
      naoAplicaveis: naoAplicaveis.length,
      ncAlto: ncAlto.length,
      percentual: aplicaveis.length
        ? Math.round((conformes.length / aplicaveis.length) * 100)
        : 0,
    };
  }, [checklist, respostas]);

  const rankingNC = useMemo(
    () =>
      checklist
        .filter((i) => i.aplicavelPorClasse && respostas[i.ref]?.status === "NÃO CONFORME")
        .sort((a, b) => pesoCriticidade(b.criticidade) - pesoCriticidade(a.criticidade)),
    [checklist, respostas]
  );

  const naoAplicaveis = useMemo(
    () =>
      checklist.filter(
        (i) => !i.aplicavelPorClasse || respostas[i.ref]?.status === "NÃO APLICÁVEL"
      ),
    [checklist, respostas]
  );

  function atualizar(ref, campo, valor) {
    setRespostas((prev) => ({
      ...prev,
      [ref]: { ...(prev[ref] || {}), [campo]: valor },
    }));
  }

  function salvar(alertar = true) {
    localStorage.setItem(
      chaveStorage(aerodromo, icao, normaSelecionada),
      JSON.stringify({
        respostas,
        aerodromo,
        icao,
        inspetor,
        data,
        classeAutomaticaRBAC153: classe,
        passageirosAno,
        normaSelecionada,
        configAerodromo,
        classificacao,
        salvoEm: new Date().toISOString(),
      })
    );
    if (alertar) alert("Auditoria salva neste navegador/dispositivo.");
  }

  function limpar() {
    if (!confirm("Deseja limpar todas as respostas desta auditoria?")) return;
    setRespostas(criarRespostasIniciais(CHECKLIST));
    localStorage.removeItem(chaveStorage(aerodromo, icao, normaSelecionada));
  }

  function exportarCSV() {
    const cabecalho = [
      "Norma",
      "Aeródromo",
      "ICAO",
      "Data",
      "Inspetor",
      "Classe RBAC 153",
      "Passageiros/ano",
      "Código RBAC 154",
      "Aplicabilidade RBAC 107",
      "REF",
      "Subparte",
      "Item verificável",
      "Critério de conformidade",
      "Evidências esperadas",
      "Risco associado",
      "Criticidade",
      "Classe mínima",
      "Aplicável",
      "Motivo N/A",
      "Status",
      "Observação",
      "Evidência coletada",
      "Responsável",
      "Prazo",
      "Anexo/Foto",
    ];

    const linhas = checklist.map((item) => {
      const r = respostas[item.ref] || {};
      const statusReal = item.aplicavelPorClasse
        ? r.status || "NÃO VERIFICADO"
        : "NÃO APLICÁVEL";

      return [
        NORMAS[normaSelecionada]?.nome || normaSelecionada,
        aerodromo,
        icao,
        data,
        inspetor,
        classificacao.RBAC_153,
        passageirosAno,
        classificacao.RBAC_154,
        classificacao.RBAC_107,
        item.ref,
        item.subparte,
        item.itemVerificavel,
        item.criterio,
        item.evidencias,
        item.risco,
        item.criticidade,
        item.classeMinima,
        item.aplicavelPorClasse ? "SIM" : "NÃO",
        item.motivoNA,
        statusReal,
        r.observacao,
        r.evidencia,
        r.responsavel,
        r.prazo,
        r.anexo,
      ].map(csvEscape);
    });

    const csv = [cabecalho.map(csvEscape), ...linhas]
      .map((l) => l.join(";"))
      .join("\n");

    baixarArquivo(
      `inspecao-${normaSelecionada}-${icao || aerodromo}.csv`.replace(/\s+/g, "-"),
      "\ufeff" + csv,
      "text/csv;charset=utf-8"
    );
  }

  function exportarJSON() {
    baixarArquivo(
      `inspecao-${normaSelecionada}-${icao || aerodromo}.json`.replace(/\s+/g, "-"),
      JSON.stringify(
        {
          norma: NORMAS[normaSelecionada]?.nome || normaSelecionada,
          aerodromo,
          icao,
          inspetor,
          data,
          classeAutomaticaRBAC153: classe,
          passageirosAno,
          configAerodromo,
          classificacao,
          metricas,
          respostas,
        },
        null,
        2
      ),
      "application/json"
    );
  }

  const tituloNorma = NORMAS[normaSelecionada]?.nome || normaSelecionada;

  return (
    <div>
      <header className="topbar">
        <div>
          <h1>🛫 App de Inspeção Aeroportuária ANAC</h1>
          <p>{tituloNorma} • Checklist inteligente para auditoria em campo</p>
        </div>
        <div className="actions">
          <button onClick={() => salvar(true)}>💾 Salvar</button>
          <button onClick={exportarCSV}>⬇️ Exportar CSV</button>
          <button onClick={exportarJSON}>⬇️ Exportar JSON</button>
          <button className="danger" onClick={limpar}>
            🗑️ Limpar
          </button>
        </div>
      </header>

      <main>
        <section className="panel">
          <h2>1. Identificação automática do aeródromo</h2>

          <div className="grid2">
            <label>
              Código ICAO
              <input
                value={icao}
                onChange={(e) => setIcao(e.target.value.toUpperCase())}
                placeholder="Ex.: SBGO"
                maxLength={4}
              />
            </label>

            <label>
              Aeródromo
              <input value={aerodromo} readOnly />
            </label>

            <label>
              Inspetor
              <input value={inspetor} onChange={(e) => setInspetor(e.target.value)} />
            </label>

            <label>
              Data
              <input type="date" value={data} onChange={(e) => setData(e.target.value)} />
            </label>
          </div>

          {mensagemICAO && <p><b>{mensagemICAO}</b></p>}
        </section>

        <section className="panel">
          <h2>2. Dados automáticos do aeródromo</h2>

          <div className="grid2">
            <label>
              Tipo de uso
              <input value={tipoUso || "Não informado"} readOnly />
            </label>

            <label>
              Passageiros processados por ano
              <input type="number" value={passageirosAno} readOnly />
            </label>

            <label>
              Tipo de aeronaves
              <input value={tipoAeronave || "Não informado"} readOnly />
            </label>

            <label>
              Comprimento da pista em metros
              <input type="number" value={comprimentoPista} readOnly />
            </label>

            <label>
              Envergadura máxima em metros
              <input type="number" value={envergaduraMaxima} readOnly />
            </label>

            <label>
              Classe automática RBAC 153
              <input value={classificacao.RBAC_153} readOnly />
            </label>
          </div>

          <div className="metrics">
            <Metric titulo="RBAC 153" valor={classificacao.RBAC_153} />
            <Metric titulo="RBAC 154" valor={classificacao.RBAC_154} />
            <Metric titulo="RBAC 107" valor={classificacao.RBAC_107} />
          </div>
        </section>

        <section className="panel">
          <h2>3. Selecionar norma para inspeção</h2>
          <div className="tabs">
            <button
              className={normaSelecionada === "RBAC153" ? "active" : ""}
              onClick={() => setNormaSelecionada("RBAC153")}
            >
              RBAC 153 - Operação
            </button>

            <button
              className={normaSelecionada === "RBAC154" ? "active" : ""}
              onClick={() => setNormaSelecionada("RBAC154")}
            >
              RBAC 154 - Infraestrutura
            </button>

            {NORMAS.RBAC107 && (
              <button
                className={normaSelecionada === "RBAC107" ? "active" : ""}
                onClick={() => setNormaSelecionada("RBAC107")}
              >
                RBAC 107 - AVSEC
              </button>
            )}
          </div>
        </section>

        {normaSelecionada === "RBAC154" && (
          <section className="panel">
            <h2>4. Configuração técnica RBAC 154</h2>

            <div className="grid2">
              <label>
                Código de referência - número
                <input value={configAerodromo.codigoNumero} readOnly />
              </label>

              <label>
                Código de referência - letra
                <input value={configAerodromo.codigoLetra} readOnly />
              </label>

              <label>
                Tipo de operação
                <input value={configAerodromo.tipoOperacao} readOnly />
              </label>

              <CampoSimNao label="Operação noturna" valor={configAerodromo.operacaoNoturna} disabled />
              <CampoSimNao label="Possui pista" valor={configAerodromo.pista} disabled />
              <CampoSimNao label="Taxiway" valor={configAerodromo.taxiway} disabled />
              <CampoSimNao label="Pátio" valor={configAerodromo.patio} disabled />
              <CampoSimNao label="Pista pavimentada" valor={configAerodromo.pavimentado} disabled />
              <CampoSimNao label="Sistema elétrico" valor={configAerodromo.sistemaEletrico} disabled />
            </div>
          </section>
        )}

        <section className="metrics">
          <Metric titulo="Conformidade" valor={`${metricas.percentual}%`} />
          <Metric titulo="Itens" valor={metricas.total} />
          <Metric titulo="Aplicáveis" valor={metricas.aplicaveis} />
          <Metric titulo="Conformes" valor={metricas.conformes} ok />
          <Metric titulo="Não conformes" valor={metricas.ncs} danger />
          <Metric titulo="NC alto risco" valor={metricas.ncAlto} danger />
          <Metric titulo="Pendentes" valor={metricas.pendentes} warn />
          <Metric titulo="Não aplicáveis" valor={metricas.naoAplicaveis} />
        </section>

        <section className="panel filters">
          <input
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por REF, item, critério, evidência ou risco..."
          />

          <select value={subparte} onChange={(e) => setSubparte(e.target.value)}>
            {subpartes.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>

          <select value={statusFiltro} onChange={(e) => setStatusFiltro(e.target.value)}>
            <option>TODOS</option>
            {STATUS.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>

          <select
            value={criticidadeFiltro}
            onChange={(e) => setCriticidadeFiltro(e.target.value)}
          >
            {CRITICIDADES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </section>

        <nav className="tabs">
          <button className={aba === "checklist" ? "active" : ""} onClick={() => setAba("checklist")}>Checklist</button>
          <button className={aba === "resumo" ? "active" : ""} onClick={() => setAba("resumo")}>Resumo executivo</button>
          <button className={aba === "ncs" ? "active" : ""} onClick={() => setAba("ncs")}>Não conformes</button>
          <button className={aba === "na" ? "active" : ""} onClick={() => setAba("na")}>Não aplicáveis</button>
        </nav>

        {aba === "checklist" && (
          <section className="cards">
            {filtrados.map((item) => (
              <ItemCard
                key={item.idInterno}
                item={item}
                resposta={respostas[item.ref] || {}}
                atualizar={atualizar}
              />
            ))}
          </section>
        )}

        {aba === "resumo" && (
          <Resumo
            aerodromo={aerodromo}
            icao={icao}
            inspetor={inspetor}
            passageirosAno={passageirosAno}
            norma={tituloNorma}
            metricas={metricas}
            rankingNC={rankingNC}
            classificacao={classificacao}
          />
        )}

        {aba === "ncs" && (
          <Lista titulo="Itens não conformes" itens={rankingNC} respostas={respostas} />
        )}

        {aba === "na" && (
          <Lista titulo="Itens não aplicáveis" itens={naoAplicaveis} respostas={respostas} />
        )}
      </main>
    </div>
  );
}

function CampoSimNao({ label, valor, disabled = false }) {
  return (
    <label>
      {label}
      <select value={valor ? "SIM" : "NAO"} disabled={disabled} onChange={() => {}}>
        <option value="SIM">Sim</option>
        <option value="NAO">Não</option>
      </select>
    </label>
  );
}

function Metric({ titulo, valor, danger, ok, warn }) {
  return (
    <div className={`metric ${danger ? "dangerBox" : ok ? "okBox" : warn ? "warnBox" : ""}`}>
      <span>{titulo}</span>
      <b>{valor}</b>
    </div>
  );
}

function ItemCard({ item, resposta, atualizar }) {
  const disabled = !item.aplicavelPorClasse;
  const statusReal = disabled ? "NÃO APLICÁVEL" : resposta.status || "NÃO VERIFICADO";

  return (
    <article className={`card ${disabled ? "disabled" : ""}`}>
      <div className="itemHead">
        <div>
          <span className="ref">{item.ref}</span>
          <span className={`crit c${pesoCriticidade(item.criticidade)}`}>{item.criticidade}</span>
          <span className="status">{statusReal}</span>
        </div>
        <small>
          {item.subparte} • Classe mínima: {item.classeMinima} • Condição: {item.condicaoComplementar}
          {item.motivoNA ? ` • Motivo N/A: ${item.motivoNA}` : ""}
        </small>
      </div>

      <h2>{item.itemVerificavel}</h2>

      <div className="info">
        <p><b>Critério:</b> {item.criterio}</p>
        <p><b>Evidências:</b> {item.evidencias}</p>
        <p><b>Risco:</b> {item.risco}</p>
      </div>

      <div className="statusGrid">
        {STATUS.map((s) => (
          <button
            key={s}
            disabled={disabled && s !== "NÃO APLICÁVEL"}
            className={statusReal === s ? "selected" : ""}
            onClick={() => atualizar(item.ref, "status", s)}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="formGrid">
        <textarea
          placeholder="Observação"
          value={resposta.observacao || ""}
          onChange={(e) => atualizar(item.ref, "observacao", e.target.value)}
        />

        <textarea
          placeholder="Evidência coletada"
          value={resposta.evidencia || ""}
          onChange={(e) => atualizar(item.ref, "evidencia", e.target.value)}
        />

        <input
          placeholder="Responsável"
          value={resposta.responsavel || ""}
          onChange={(e) => atualizar(item.ref, "responsavel", e.target.value)}
        />

        <select
          value={resposta.prazo || "CURTO PRAZO"}
          onChange={(e) => atualizar(item.ref, "prazo", e.target.value)}
        >
          {PRAZOS.map((p) => (
            <option key={p}>{p}</option>
          ))}
        </select>

        <input
          className="full"
          placeholder="Descrição de foto/anexo coletado"
          value={resposta.anexo || ""}
          onChange={(e) => atualizar(item.ref, "anexo", e.target.value)}
        />
      </div>
    </article>
  );
}

function Resumo({ aerodromo, icao, inspetor, passageirosAno, norma, metricas, rankingNC, classificacao }) {
  return (
    <section className="panel">
      <h2>Resumo executivo</h2>

      <p>
        A inspeção do aeródromo <b>{aerodromo}</b> {icao && <b>({icao})</b>}, com classificação automática <b>{classificacao.RBAC_153}</b>, baseada em <b>{passageirosAno}</b> passageiros/ano, norma <b>{norma}</b>, conduzida por {inspetor || "inspetor não informado"}, apresenta <b>{metricas.percentual}%</b> de conformidade.
      </p>

      <h3>Classificação automática</h3>
      <p><b>RBAC 153:</b> {classificacao.RBAC_153}</p>
      <p><b>RBAC 154:</b> {classificacao.RBAC_154}</p>
      <p><b>RBAC 107:</b> {classificacao.RBAC_107}</p>

      <h3>Prioridade de ação</h3>
      {rankingNC.length === 0 ? (
        <p>Sem não conformidades registradas.</p>
      ) : (
        rankingNC.slice(0, 10).map((i) => (
          <p key={i.ref}>
            <b>{i.ref}</b> • {i.criticidade} • {i.itemVerificavel}
          </p>
        ))
      )}
    </section>
  );
}

function Lista({ titulo, itens, respostas }) {
  return (
    <section className="panel">
      <h2>{titulo}</h2>

      {itens.length === 0 ? (
        <p>Nenhum item nesta categoria.</p>
      ) : (
        itens.map((i) => (
          <div className="listItem" key={i.idInterno || i.ref}>
            <b>{i.ref} • {i.criticidade}</b>
            <p>{i.itemVerificavel}</p>
            <small>{i.subparte}</small>
            {i.motivoNA && <p><b>Motivo N/A:</b> {i.motivoNA}</p>}
            <p><b>Obs:</b> {respostas[i.ref]?.observacao || "-"}</p>
            <p><b>Evidência:</b> {respostas[i.ref]?.evidencia || "-"}</p>
          </div>
        ))
      )}
    </section>
  );
}