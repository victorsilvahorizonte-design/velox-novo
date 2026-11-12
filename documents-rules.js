/** Regras compartilhadas pelo servidor e pela prévia de envio. Só arquivos novos. */
function createDocumentRules_() {
  'use strict';
  const contracts=['ACORDO DE COMPENSAÇÃO DE HORAS TRABALHADAS','CONTRATO DE EXPERIÊNCIA','FICHA DE REGISTRO','REQUERIMENTO VT','TERMO LGPD'];
  const aso=['Admissional','Periódico','Demissional','Retorno ao Trabalho','Mudança de Riscos Ocupacionais','Outro'];
  // Catálogo profissional: IDs permanentes; nomes e grupos são apenas apresentação.
  const catalog=[
    Object.freeze({id:1,code:'IDENTIFICATION',name:"Documentos de Identificação",groupId:'registration',classification:'personal'}),
    Object.freeze({id:2,code:'RESIDENCE',name:"Comprovantes de Residência",groupId:'registration',classification:'personal'}),
    Object.freeze({id:3,code:'CTPS',name:"Carteira de Trabalho (CTPS)",groupId:'registration',classification:'personal'}),
    Object.freeze({id:4,code:'HIRING',name:"Admissão e Contrato de Trabalho",groupId:'employment',classification:'employment'}),
    Object.freeze({id:5,code:'OCCUPATIONAL_HEALTH',name:"Saúde Ocupacional (ASO e Exames)",groupId:'safety',classification:'sensitive'}),
    Object.freeze({id:6,code:'VACCINATION',name:"Registros de Vacinação",groupId:'safety',classification:'sensitive'}),
    Object.freeze({id:7,code:'DEPENDENTS',name:"Dependentes",groupId:'registration',classification:'personal'}),
    Object.freeze({id:8,code:'PPE',name:"Equipamentos de Proteção Individual (EPI)",groupId:'safety',classification:'employment'}),
    Object.freeze({id:9,code:'ATTENDANCE',name:"Jornada e Frequência",groupId:'attendance',classification:'employment'}),
    Object.freeze({id:10,code:'PAYSLIPS',name:"Demonstrativos de Pagamento (Holerites)",groupId:'compensation',classification:'financial'}),
    Object.freeze({id:11,code:'SALARY_RECEIPTS',name:"Comprovantes de Pagamento Salarial",groupId:'compensation',classification:'financial'}),
    Object.freeze({id:12,code:'VACATION',name:"Férias",groupId:'compensation',classification:'employment'}),
    Object.freeze({id:13,code:'THIRTEENTH_SALARY',name:"13º Salário",groupId:'compensation',classification:'financial'}),
    Object.freeze({id:14,code:'TERMINATION',name:"Desligamento e Rescisão Contratual",groupId:'termination',classification:'employment'})
  ];
  const groups=[
    Object.freeze({id:'registration',name:"Cadastro e Identificação",order:1}),
    Object.freeze({id:'employment',name:"Admissão e Vínculo Trabalhista",order:2}),
    Object.freeze({id:'safety',name:"Saúde e Segurança do Trabalho",order:3}),
    Object.freeze({id:'attendance',name:"Jornada e Frequência",order:4}),
    Object.freeze({id:'compensation',name:"Remuneração e Direitos",order:5}),
    Object.freeze({id:'termination',name:"Desligamento e Rescisão",order:6})
  ];
  const byId=id=>catalog.find(item=>item.id===Number(id))||null;
  const categoryName=id=>byId(id)?.name||'';
  function day(value) {
    const s=String(value||''),d=new Date(s+'T12:00:00Z');
    if(!/^\d{4}-\d{2}-\d{2}$/.test(s)||!Number.isFinite(d.getTime())||d.toISOString().slice(0,10)!==s)throw new Error('Informe uma data válida do documento.');
    return s.split('-').reverse().join('-');
  }
  function name(category,person,original,meta) {
    meta=meta||{};category=Number(category);
    const extension=(String(original).match(/\.[^./\\]+$/)||[''])[0];
    const full=String(person||'').trim().replace(/[\\/]/g,' - ');
    if(!full)throw new Error('Nome completo do colaborador não disponível.');
    let prefix='';
    if(category===2)prefix='Comprovante de Residência - '+full;
    if(category===4&&meta.type&&meta.type!=='original'){
      if(!contracts.includes(meta.type))throw new Error('Escolha o tipo do documento de admissão.');
      prefix=meta.type+' - '+full+(meta.date?' - '+day(meta.date):'');
    }
    if(category===5){if(!aso.includes(meta.type))throw new Error('Escolha o tipo do ASO.');prefix='ASO '+meta.type+' - '+full+' - '+day(meta.date);}
    if(category===8)prefix='Ficha de EPI - '+full+' - '+day(meta.date);
    if([10,11].includes(category)){
      if(!/^\d{4}-(0[1-9]|1[0-2])$/.test(meta.month||''))throw new Error('Informe mês e ano de referência.');
      prefix=(category===10?'Holerite':'Comprovante de Pagamento Salarial')+' - '+full+' - '+meta.month.slice(5)+'-'+meta.month.slice(0,4);
    }
    const generated=prefix?prefix+extension:String(original);
    if(meta.alternative){
      const alternative=String(meta.alternative).trim();
      if(/[\\/]/.test(alternative)||!alternative||alternative.length>240||extension&&!alternative.endsWith(extension))throw new Error('O nome alternativo deve preservar a extensão '+extension+'.');
      return alternative;
    }
    if(generated.length>240)throw new Error('Nome final muito longo. Escolha um nome alternativo preservando a extensão.');
    return generated;
  }
  return {name,day,contracts,aso,catalog,groups,byId,categoryName};
}
var VeloXDocuments = createDocumentRules_();

window.VXDocuments=createDocumentRules_();
