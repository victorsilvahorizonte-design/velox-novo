export async function atualizarBaseANAC() {
  try {
    const resposta = await fetch("/data/aerodromosCompletos.json");

    if (!resposta.ok) {
      throw new Error("Erro ao carregar /data/aerodromosCompletos.json");
    }

    const dados = await resposta.json();

    if (!Array.isArray(dados)) {
      throw new Error("A base ANAC precisa ser um array");
    }

    console.log("BASE ANAC CARREGADA:", dados);
    console.log("PRIMEIRO REGISTRO:", dados[0]);

    return dados;
  } catch (erro) {
    console.error("Erro na base ANAC:", erro);
    return [];
  }
}

function limparTexto(valor) {
  return String(valor || "")
    .trim()
    .toUpperCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function buscarAerodromoPorICAO(baseANAC, codigoICAO) {
  if (!Array.isArray(baseANAC)) return null;

  const codigo = limparTexto(codigoICAO);

  const encontrado = baseANAC.find((aero) => {
    const possiveisICAO = [
      aero.icao,
      aero.ICAO,
      aero.codigoICAO,
      aero.codigo_icao,
      aero.codICAO,
      aero.COD_ICAO,
      aero.Código,
      aero.codigo,
      aero.Codigo,
      aero.identificador,
      aero.ident,
      aero["Código OACI"],
      aero["CODIGO OACI"],
      aero["CÓDIGO OACI"],
      aero["Código ICAO"],
      aero["CODIGO ICAO"],
      aero["CÓDIGO ICAO"],
    ];

    return possiveisICAO.some((campo) => limparTexto(campo) === codigo);
  });

  console.log("BUSCA ICAO:", codigo, encontrado);

  return encontrado || null;
}

export function normalizarAerodromoANAC(aero, codigoDigitado = "") {
  if (!aero) return null;

  const get = (...campos) => {
    for (const campo of campos) {
      if (aero[campo] !== undefined && aero[campo] !== null && aero[campo] !== "") {
        return aero[campo];
      }
    }
    return "";
  };

  const icao =
    get(
      "icao",
      "ICAO",
      "codigoICAO",
      "codigo_icao",
      "codICAO",
      "COD_ICAO",
      "Código ICAO",
      "CODIGO ICAO",
      "CÓDIGO ICAO",
      "Código OACI",
      "CODIGO OACI",
      "CÓDIGO OACI"
    ) || codigoDigitado;

  const nome = get(
    "nome",
    "Nome",
    "nomeAerodromo",
    "aerodromo",
    "Aeródromo",
    "AERODROMO",
    "nome_aerodromo",
    "denominacao",
    "Denominação",
    "DENOMINACAO"
  );

  const municipio = get(
    "municipio",
    "Município",
    "MUNICIPIO",
    "cidade",
    "Cidade"
  );

  const uf = get("uf", "UF", "estado", "Estado");

  const uso = get(
    "uso",
    "Uso",
    "tipoUso",
    "Tipo de Uso",
    "TIPO_USO",
    "usoAerodromo",
    "UTILIZACAO",
    "Utilização"
  );

  const pista = Number(
    get(
      "comprimentoPista",
      "comprimento",
      "Comprimento",
      "comprimento_pista",
      "COMPRIMENTO_PISTA",
      "dimensaoPista",
      "Dimensão da Pista",
      "comprimentoMaiorPista",
      "Comprimento da Pista"
    ) || 0
  );

  const passageirosAno = Number(
    get(
      "passageirosAno",
      "passageiros",
      "pax",
      "PAX",
      "movimentoPassageiros",
      "Movimento de Passageiros",
      "passageiros_ano"
    ) || 0
  );

  const operacao = limparTexto(
    get(
      "tipoOperacao",
      "Tipo de Operação",
      "operacao",
      "Operação",
      "OPERACAO",
      "regraVoo",
      "Regra de Voo"
    )
  );

  const pavimento = limparTexto(
    get(
      "pavimentado",
      "Pavimentado",
      "tipoPavimento",
      "Tipo de Pavimento",
      "pavimento",
      "Pavimento",
      "superficie",
      "Superfície"
    )
  );

  const noturno = limparTexto(
    get(
      "operacaoNoturna",
      "Operação Noturna",
      "noturno",
      "Noturno",
      "luzes",
      "balizamento",
      "Balizamento"
    )
  );

  return {
    bruto: aero,
    icao,
    nome,
    municipio,
    uf,
    uso,
    comprimentoPista: pista,
    passageirosAno,
    tipoOperacao: operacao.includes("IFR") ? "IFR" : "VFR",
    operacaoIFR: operacao.includes("IFR"),
    operacaoNoturna:
      noturno.includes("SIM") ||
      noturno.includes("S") ||
      noturno.includes("NOTURN") ||
      noturno.includes("BALIZ"),
    pavimentado:
      pavimento.includes("ASF") ||
      pavimento.includes("CONC") ||
      pavimento.includes("PAV") ||
      pavimento.includes("SIM"),
    usoPublico:
      limparTexto(uso).includes("PUBLIC") ||
      limparTexto(uso).includes("PUB"),
  };
}