function normalizarICAO(valor) {
    return String(valor || "")
      .trim()
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "");
  }
  
  function numero(valor) {
    const n = Number(valor);
    return Number.isFinite(n) ? n : 0;
  }
  
  export function validarEPadronizarBase(lista = []) {
    const erros = [];
    const baseFinal = {};
    const icaosVistos = new Set();
  
    lista.forEach((item, index) => {
      const icao = normalizarICAO(item.icao || item.codigoIcao || item.CIAD);
  
      if (!icao || icao.length !== 4) {
        erros.push(`Item ${index} sem ICAO válido`);
        return;
      }
  
      if (icaosVistos.has(icao)) {
        erros.push(`ICAO duplicado: ${icao}`);
        return;
      }
  
      icaosVistos.add(icao);
  
      baseFinal[icao] = {
        icao,
        nome: item.nome || "Aeroporto não informado",
        cidade: item.cidade || "",
        uf: item.uf || "",
        uso: item.uso || "Público",
  
        passageirosAno: numero(item.passageirosAno),
        comprimentoPista: numero(item.comprimentoPista),
        larguraPista: numero(item.larguraPista),
        envergaduraMaxima: numero(item.envergaduraMaxima),
  
        tipoAeronave: item.tipoAeronave || "médias",
        tipoOperacaoAVSEC: Array.isArray(item.tipoOperacaoAVSEC)
          ? item.tipoOperacaoAVSEC
          : [],
  
        operacao: item.operacao || "VFR",
  
        pavimentado: Boolean(item.pavimentado),
        taxiway: Boolean(item.taxiway),
        patio: Boolean(item.patio),
        sistemaEletrico: Boolean(item.sistemaEletrico),
        operacaoNoturna: Boolean(item.operacaoNoturna),
      };
    });
  
    return {
      base: baseFinal,
      total: Object.keys(baseFinal).length,
      erros,
    };
  }