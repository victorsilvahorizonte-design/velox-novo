import {EXTRA_TRANSLATIONS} from './i18n-extra.js';
/**
 * VeloX — base nativa de idiomas: quatro idiomas.
 * Traduz os textos de interface mapeados, jamais dados digitados pelo usuário.
 * Este módulo não ativa tradução automática do navegador nem substitui a revisão humana.
 */
export const LOCALES = Object.freeze(['pt-BR', 'en', 'es', 'fr']);
export const DEFAULT_LOCALE = 'pt-BR';
const STORAGE_KEY = 'vx.ui.locale';
const map = {"Histórico e Auditoria":["History & Audit","Historial y auditoría","Historique et audit"],"Campos alterados":["Changed fields","Campos modificados","Champs modifiés"],"Data e hora":["Date and time","Fecha y hora","Date et heure"],"Nenhum evento encontrado":["No events found","No se encontraron eventos","Aucun événement trouvé"],
  'ou': ['or', 'o'],
  'OU': ['OR', 'O'],
  'Ainda não tem uma conta?': ["Don't have an account yet?", '¿Aún no tienes una cuenta?'],
  'Cadastre-se': ['Sign up', 'Regístrate'],
  // Login V10
  'ACESSO RESTRITO': ['RESTRICTED ACCESS', 'ACCESO RESTRINGIDO'],
  'Bem-vindo de volta.': ['Welcome back.', 'Bienvenido de nuevo.'],
  'Entre com sua conta para acessar o Sistema de Gestão VeloX.': ['Sign in to your account to access the VeloX Management System.', 'Inicia sesión para acceder al Sistema de Gestión VeloX.'],
  'Entrar com Google': ['Sign in with Google', 'Entrar con Google'],
  'ou entre com e-mail': ['or sign in with email', 'o inicia sesión con correo electrónico'],
  'E-mail': ['Email', 'Correo electrónico'],
  'Senha': ['Password', 'Contraseña'],
  'Digite sua senha': ['Enter your password', 'Escribe tu contraseña'],
  'Mostrar': ['Show', 'Mostrar'],
  'Ocultar': ['Hide', 'Ocultar'],
  'Lembrar de mim': ['Remember me', 'Recordarme'],
  'Esqueceu a senha?': ['Forgot password?', '¿Olvidaste tu contraseña?'],
  'Entrar no sistema': ['Sign in', 'Iniciar sesión'],
  'Entrando...': ['Signing in...', 'Iniciando sesión...'],
  'CARREGANDO EXPERIÊNCIA': ['LOADING EXPERIENCE', 'CARGANDO EXPERIENCIA'],
  'Pular intro →': ['Skip intro →', 'Saltar introducción →'],
  'VeloX Service · Sistema de Gestão': ['VeloX Service · Management System', 'VeloX Service · Sistema de Gestión'],
  'PRÉVIA DE DESENVOLVIMENTO • ACESSO SIMULADO': ['DEVELOPMENT PREVIEW • SIMULATED ACCESS', 'VISTA PREVIA DE DESARROLLO • ACCESO SIMULADO'],
  // Navegação e cabeçalho
  'SISTEMA DE GESTÃO': ['MANAGEMENT SYSTEM', 'SISTEMA DE GESTIÓN'],
  'PRINCIPAL': ['MAIN', 'PRINCIPAL'],
  'Início': ['Home', 'Inicio'],
  'Visão geral': ['Overview', 'Vista general'],
  'COLABORADORES': ['EMPLOYEES', 'EMPLEADOS'],
  'Contratados': ['Active employees', 'Empleados contratados'],
  'Desligados': ['Former employees', 'Empleados desvinculados'],
  'Relatórios': ['Reports', 'Informes'],
  'CADASTROS': ['RECORDS', 'REGISTROS'],
  'Centros de custo': ['Cost centers', 'Centros de costos'],
  'Equipes': ['Teams', 'Equipos'],
  'Cargos': ['Job positions', 'Puestos de trabajo'],
  'GESTÃO EMPRESARIAL': ['BUSINESS MANAGEMENT', 'GESTIÓN EMPRESARIAL'],
  'Gestão de Obrigações': ['Obligations management', 'Gestión de obligaciones'],
  'Gestão de Contratos': ['Contract management', 'Gestión de contratos'],
  'Acessos externos': ['External links', 'Accesos externos'],
  "GESTÃO DE PESSOAS": ["PEOPLE MANAGEMENT", "GESTIÓN DE PERSONAS"],
  "FINANCEIRO E CONTÁBIL": ["FINANCE AND ACCOUNTING", "FINANZAS Y CONTABILIDAD"],
  "COMERCIAL E CLIENTES": ["SALES AND CUSTOMERS", "COMERCIAL Y CLIENTES"],
  "INTELIGÊNCIA E CONTROLE": ["INTELLIGENCE AND CONTROL", "INTELIGENCIA Y CONTROL"],
  "Ponto e jornada": ["Time and attendance", "Control horario"],
  "Escalas e ausências": ["Schedules and absences", "Turnos y ausencias"],
  "Folha de pagamento": ["Payroll", "Nómina"],
  "Compras e fornecedores": ["Purchasing and suppliers", "Compras y proveedores"],
  "Estoque e patrimônio": ["Inventory and assets", "Inventario y activos"],
  "Frota e projetos": ["Fleet and projects", "Flota y proyectos"],
  "Financeiro": ["Finance", "Finanzas"],
  "Contábil e fiscal": ["Accounting and tax", "Contabilidad e impuestos"],
  "CRM e relacionamento": ["CRM and relationships", "CRM y relaciones"],
  "Portal e atendimento": ["Portal and support", "Portal y atención"],
  "Relatórios e inteligência": ["Reports and intelligence", "Informes e inteligencia"],
  "Automações e integrações": ["Automation and integrations", "Automatizaciones e integraciones"],
  "VeloX Master": ["VeloX Master", "VeloX Master"],
  "Central exclusiva do proprietário": ["Owner-only control center", "Centro de control exclusivo del propietario"],
  "Buscar módulo": ["Search modules", "Buscar módulos"],
  "Buscar módulo...": ["Search modules...", "Buscar módulos..."],
  "PAINEL EXECUTIVO": ["EXECUTIVE DASHBOARD", "PANEL EJECUTIVO"],
  "Bom dia!": ["Good morning!", "¡Buenos días!"],
  "Boa tarde!": ["Good afternoon!", "¡Buenas tardes!"],
  "Boa noite!": ["Good evening!", "¡Buenas noches!"],
  "Aqui está o panorama geral da sua operação.": ["Here is an overview of your operation.", "Aquí tienes una visión general de tu operación."],
  "Indicadores calculados a partir dos dados cadastrados no VeloX.": ["Indicators calculated from data registered in VeloX.", "Indicadores calculados a partir de los datos registrados en VeloX."],
  "Colaboradores ativos": ["Active employees", "Empleados activos"],
  "Equipes cadastradas": ["Registered teams", "Equipos registrados"],
  "Contratos vigentes": ["Active contracts", "Contratos vigentes"],
  "Cadastros ativos": ["Active records", "Registros activos"],
  "Estrutura organizacional": ["Organizational structure", "Estructura organizativa"],
  "Cadastros disponíveis": ["Available records", "Registros disponibles"],
  "Registros acompanhados": ["Tracked records", "Registros supervisados"],
  "Movimentação de colaboradores": ["Employee movements", "Movimientos de empleados"],
  "Admissões e desligamentos registrados · últimos seis meses": ["Recorded hires and terminations · last six months", "Altas y bajas registradas · últimos seis meses"],
  "Desligamentos": ["Terminations", "Bajas"],
  "Estrutura da equipe": ["Team structure", "Estructura del equipo"],
  "Distribuição por centro de custo": ["Distribution by cost center", "Distribución por centro de costos"],
  "Nenhum colaborador cadastrado para distribuir.": ["No registered employees to display.", "No hay empleados registrados para mostrar."],
  "Atividades recentes": ["Recent activity", "Actividad reciente"],
  "Últimas atualizações nos cadastros": ["Latest record updates", "Últimas actualizaciones de registros"],
  "Cadastro de colaborador": ["Employee record", "Registro de empleado"],
  "Data não informada": ["Date not provided", "Fecha no informada"],
  "Acompanhamento operacional": ["Operational overview", "Seguimiento operativo"],
  "Situação atual da base": ["Current database status", "Estado actual de la base"],
  "Obrigações pendentes": ["Pending obligations", "Obligaciones pendientes"],
  "Prazos e obrigações": ["Deadlines and obligations", "Plazos y obligaciones"],
  "Datas registradas para acompanhamento": ["Recorded dates for monitoring", "Fechas registradas para seguimiento"],
  "Abrir obrigações": ["Open obligations", "Abrir obligaciones"],
  "Nenhum prazo registrado para acompanhamento.": ["No deadlines are recorded for monitoring.", "No hay plazos registrados para seguimiento."],
  "Atalhos para as áreas mais utilizadas": ["Shortcuts to frequently used areas", "Accesos directos a las áreas más utilizadas"],
  "Cadastros": ["Records", "Registros"],
  "O ecossistema está crescendo": ["The ecosystem is growing", "El ecosistema está creciendo"],
  "Novos produtos previstos para as próximas etapas": ["New products planned for upcoming stages", "Nuevos productos previstos para las próximas etapas"],
  "Registro mobile e gestão de jornada": ["Mobile time clock and attendance management", "Registro móvil y gestión de jornada"],
  "Receitas, despesas e fluxo de caixa": ["Revenue, expenses and cash flow", "Ingresos, gastos y flujo de caja"],
  "Contabilidade e obrigações fiscais": ["Accounting and tax obligations", "Contabilidad y obligaciones fiscales"],
  "Os indicadores acima usam somente informações existentes no VeloX. Módulos ainda não implementados não geram números fictícios.": ["The indicators above use only information already available in VeloX. Modules not yet implemented do not display fictitious figures.", "Los indicadores anteriores utilizan únicamente información existente en VeloX. Los módulos aún no implementados no muestran cifras ficticias."],
  "MÓDULO EM PLANEJAMENTO": ["MODULE IN PLANNING", "MÓDULO EN PLANIFICACIÓN"],
  "EXPANSÃO DO VELOX BUSINESS": ["VELOX BUSINESS EXPANSION", "EXPANSIÓN DE VELOX BUSINESS"],
  "Funcionalidades previstas": ["Planned features", "Funciones previstas"],
  "Esta área está no planejamento. As funcionalidades serão desenhadas, aprovadas, desenvolvidas e homologadas antes de serem liberadas para uso real.": ["This area is in planning. Features will be designed, approved, developed and validated before being released for real use.", "Esta área está en planificación. Las funciones se diseñarán, aprobarán, desarrollarán y validarán antes de habilitarse para uso real."],
  "ACESSO EXCLUSIVO DO PROPRIETÁRIO": ["OWNER-ONLY ACCESS", "ACCESO EXCLUSIVO DEL PROPIETARIO"],
  "CENTRAL DE COMANDO": ["COMMAND CENTER", "CENTRO DE CONTROL"],
  "Áreas da central": ["Control center areas", "Áreas del centro de control"],
  "Empresas, clientes e ambientes": ["Companies, customers and environments", "Empresas, clientes y entornos"],
  "Planos, assinaturas e faturamento": ["Plans, subscriptions and billing", "Planes, suscripciones y facturación"],
  "Parceiros e Marketplace supervisionado": ["Partners and supervised marketplace", "Socios y marketplace supervisado"],
  "Produtos, versões e atualizações": ["Products, versions and updates", "Productos, versiones y actualizaciones"],
  "Segurança, auditoria e visão executiva": ["Security, audit and executive overview", "Seguridad, auditoría y visión ejecutiva"],
  "O núcleo tecnológico, os dados dos clientes e as regras de distribuição permanecem sob controle da VeloX. Os recursos desta central serão implementados com autenticação reforçada e auditoria.": ["The technology core, customer data and distribution rules remain under VeloX control. This control center will be implemented with strong authentication and auditing.", "El núcleo tecnológico, los datos de los clientes y las reglas de distribución permanecen bajo el control de VeloX. Esta central se implementará con autenticación reforzada y auditoría."],
  "Voltar ao início": ["Back to home", "Volver al inicio"],
  'Ir para Início': ['Go to Home', 'Ir al inicio'],
  'Recolher menu': ['Collapse menu', 'Contraer menú'],
  'Expandir menu': ['Expand menu', 'Expandir menú'],
  'Voltar à tela anterior': ['Return to previous screen', 'Volver a la pantalla anterior'],
  'Voltar': ['Back', 'Volver'],
  'Caminho de navegação': ['Breadcrumb', 'Ruta de navegación'],
  'Menu principal': ['Main menu', 'Menú principal'],
  'Seções do sistema': ['System sections', 'Secciones del sistema'],
  'Abrir pasta dos colaboradores no Google Drive': ['Open employee folder in Google Drive', 'Abrir carpeta de empleados en Google Drive'],
  'Conta proprietária': ['Owner account', 'Cuenta propietaria'],
  'Proprietário da conta': ['Account owner', 'Propietario de la cuenta'],
  'Ambiente de desenvolvimento': ['Development environment', 'Entorno de desarrollo'],
  'PRÉVIA LOCAL • NÃO USE DADOS REAIS': ['LOCAL PREVIEW • DO NOT USE REAL DATA', 'VISTA PREVIA LOCAL • NO USES DATOS REALES'],
  'Desativar pato decorativo': ['Disable decorative duck', 'Desactivar pato decorativo'],
  'Ativar pato decorativo': ['Enable decorative duck', 'Activar pato decorativo'],
  // Painel inicial e mensagens comuns
  'PLATAFORMA DE GESTÃO': ['MANAGEMENT PLATFORM', 'PLATAFORMA DE GESTIÓN'],
  'Sistema de Gestão VeloX': ['VeloX Management System', 'Sistema de Gestión VeloX'],
  'Organização, controle e eficiência para sua operação.': ['Organization, control, and efficiency for your operation.', 'Organización, control y eficiencia para tu operación.'],
  'Acesso rápido': ['Quick access', 'Acceso rápido'],
  'Consultar colaboradores': ['View employees', 'Consultar empleados'],
  'Novo colaborador': ['New employee', 'Nuevo empleado'],
  'Abrir formulário de cadastro': ['Open registration form', 'Abrir formulario de registro'],
  'Documentos': ['Documents', 'Documentos'],
  'Abrir pasta no Google Drive': ['Open folder in Google Drive', 'Abrir carpeta en Google Drive'],
  'Consultar e exportar dados': ['View and export data', 'Consultar y exportar datos'],
  'Colaboradores': ['Employees', 'Empleados'],
  'Ativos': ['Active', 'Activos'],
  'Indicadores da base atual do VeloX.': ['Indicators from the current VeloX dataset.', 'Indicadores de la base actual de VeloX.'],
  'VeloX Service · Plataforma de gestão': ['VeloX Service · Management platform', 'VeloX Service · Plataforma de gestión'],
  'Documentos no seu Google Drive': ['Documents in your Google Drive', 'Documentos en tu Google Drive'],
  'Abrindo o VeloX': ['Opening VeloX', 'Abriendo VeloX'],
  'Preparando o VeloX.': ['Preparing VeloX.', 'Preparando VeloX.'],
  // Cadastros e modais genéricos
  'Cadastre aqui para selecionar na ficha do colaborador.': ['Add records here for selection in the employee profile.', 'Registra aquí los datos para seleccionarlos en la ficha del empleado.'],
  'Atualizar': ['Refresh', 'Actualizar'],
  'Cadastrar cargo': ['Add job position', 'Registrar puesto'],
  'Cadastrar equipe': ['Add team', 'Registrar equipo'],
  'Cadastrar centro de custo': ['Add cost center', 'Registrar centro de costos'],
  'Pesquisar cargos': ['Search job positions', 'Buscar puestos'],
  'Pesquisar equipes': ['Search teams', 'Buscar equipos'],
  'Pesquisar centros de custo': ['Search cost centers', 'Buscar centros de costos'],
  'Todos os cadastros': ['All records', 'Todos los registros'],
  'Inativos': ['Inactive', 'Inactivos'],
  'Cadastre seu primeiro cargo': ['Add your first job position', 'Registra tu primer puesto'],
  'Cadastre sua primeira equipe': ['Add your first team', 'Registra tu primer equipo'],
  'Cadastre seu primeiro centro de custo': ['Add your first cost center', 'Registra tu primer centro de costos'],
  'Use o botão acima. Ele ficará disponível no cadastro do colaborador.': ['Use the button above. It will be available when registering an employee.', 'Usa el botón de arriba. Estará disponible al registrar un empleado.'],
  'Disponíveis para os colaboradores': ['Available for employees', 'Disponibles para los empleados'],
  'Fechar': ['Close', 'Cerrar'],
  'Cancelar': ['Cancel', 'Cancelar'],
  'Salvar': ['Save', 'Guardar'],
  'Editar': ['Edit', 'Editar'],
  'Excluir': ['Delete', 'Eliminar'],
  'Adicionar site': ['Add website', 'Añadir sitio web'],
  'Nenhum site cadastrado.': ['No websites registered.', 'No hay sitios web registrados.'],
  'Sair sem salvar?': ['Leave without saving?', '¿Salir sin guardar?'],
  'Você tem alterações ou arquivos pendentes. Se sair agora, o que ainda não foi salvo será perdido.': ['You have pending changes or files. If you leave now, unsaved work will be lost.', 'Tienes cambios o archivos pendientes. Si sales ahora, se perderá el trabajo no guardado.'],
  'Continuar editando': ['Keep editing', 'Seguir editando'],
  'Descartar e sair': ['Discard and leave', 'Descartar y salir'],
  'Atualizações': ['Updates', 'Actualizaciones'],
  'Nenhum site cadastrado': ['No websites registered', 'No hay sitios web registrados'],
  'Cursor do sistema': ['System cursor', 'Cursor del sistema'],
};




// VeloX i18n consolidated dictionary v0.4 — dashboard, records, employee forms, contracts and obligations.
Object.assign(map, {
 "Idioma da interface": [
  "Interface language",
  "Idioma de la interfaz"
 ],
 "Seções administrativas": [
  "Administration sections",
  "Secciones administrativas"
 ],
 "Conta proprietária": [
  "Owner account",
  "Cuenta propietaria"
 ],
 "Google Drive": [
  "Google Drive",
  "Google Drive"
 ],
 "O resumo dos seus colaboradores, em um só lugar.": [
  "Your employee overview, all in one place.",
  "El resumen de tus empleados, en un solo lugar."
 ],
 "Central de controle": [
  "Control center",
  "Centro de control"
 ],
 "Configurar avisos": [
  "Configure alerts",
  "Configurar avisos"
 ],
 "Obrigações vencidas": [
  "Overdue obligations",
  "Obligaciones vencidas"
 ],
 "Próximos 7 dias": [
  "Next 7 days",
  "Próximos 7 días"
 ],
 "Próximos 30 dias": [
  "Next 30 days",
  "Próximos 30 días"
 ],
 "Pendências resolvidas": [
  "Resolved issues",
  "Pendientes resueltos"
 ],
 "Contratos próximos do fim": [
  "Contracts nearing expiration",
  "Contratos próximos al vencimiento"
 ],
 "Experiência a conferir": [
  "Probation periods to review",
  "Períodos de prueba por revisar"
 ],
 "Exibição": [
  "View",
  "Visualización"
 ],
 "Selecione": [
  "Select",
  "Seleccione"
 ],
 "Alertas por urgência": [
  "Alerts by urgency",
  "Alertas por urgencia"
 ],
 "Agenda completa": [
  "Full schedule",
  "Agenda completa"
 ],
 "Categoria": [
  "Category",
  "Categoría"
 ],
 "Todas": [
  "All",
  "Todas"
 ],
 "Todos": [
  "All",
  "Todos"
 ],
 "Até": [
  "To",
  "Hasta"
 ],
 "De": [
  "From",
  "Desde"
 ],
 "Filtrar": [
  "Filter",
  "Filtrar"
 ],
 "Nenhum compromisso no período selecionado.": [
  "No scheduled items for the selected period.",
  "No hay compromisos en el período seleccionado."
 ],
 "Prazos informados nos registros. Nenhum vencimento legal, pagamento ou prorrogação é presumido. Os indicadores de colaboradores continuam abaixo.": [
  "Deadlines come from entered records. Legal due dates, payments and extensions are not assumed. Employee indicators appear below.",
  "Los plazos provienen de los registros ingresados. No se presumen vencimientos legales, pagos ni prórrogas. Los indicadores de empleados aparecen abajo."
 ],
 "Últimos 6 meses": [
  "Last 6 months",
  "Últimos 6 meses"
 ],
 "Centro de custo": [
  "Cost center",
  "Centro de costos"
 ],
 "Todos os centros de custo": [
  "All cost centers",
  "Todos los centros de costos"
 ],
 "Equipe": [
  "Team",
  "Equipo"
 ],
 "Todas as equipes": [
  "All teams",
  "Todos los equipos"
 ],
 "Sem equipe": [
  "No team",
  "Sin equipo"
 ],
 "Situação atual": [
  "Current status",
  "Situación actual"
 ],
 "Totais atuais, independentes do período de movimentações": [
  "Current totals, regardless of movement period",
  "Totales actuales, independientemente del período de movimientos"
 ],
 "Vínculos cadastrados": [
  "Registered employment records",
  "Vínculos laborales registrados"
 ],
 "Situação atual · Ver colaboradores": [
  "Current status · View employees",
  "Situación actual · Ver empleados"
 ],
 "Afastados": [
  "On leave",
  "De baja temporal"
 ],
 "Distribuição de colaboradores": [
  "Employee distribution",
  "Distribución de empleados"
 ],
 "Todos os cadastros nos filtros selecionados": [
  "All records matching the selected filters",
  "Todos los registros que coinciden con los filtros"
 ],
 "Agrupar por": [
  "Group by",
  "Agrupar por"
 ],
 "Cargo": [
  "Job position",
  "Puesto de trabajo"
 ],
 "Gênero": [
  "Gender",
  "Género"
 ],
 "Nenhum colaborador nestes filtros": [
  "No employees match these filters",
  "Ningún empleado coincide con estos filtros"
 ],
 "Ajuste os filtros ou cadastre seu primeiro colaborador.": [
  "Adjust the filters or register your first employee.",
  "Ajusta los filtros o registra a tu primer empleado."
 ],
 "Aniversariantes": [
  "Birthdays",
  "Cumpleaños"
 ],
 "Colaboradores ativos e afastados": [
  "Active employees and those on leave",
  "Empleados activos y de baja temporal"
 ],
 "Mês": [
  "Month",
  "Mes"
 ],
 "Janeiro": [
  "January",
  "Enero"
 ],
 "Fevereiro": [
  "February",
  "Febrero"
 ],
 "Março": [
  "March",
  "Marzo"
 ],
 "Abril": [
  "April",
  "Abril"
 ],
 "Maio": [
  "May",
  "Mayo"
 ],
 "Junho": [
  "June",
  "Junio"
 ],
 "Julho": [
  "July",
  "Julio"
 ],
 "Agosto": [
  "August",
  "Agosto"
 ],
 "Setembro": [
  "September",
  "Septiembre"
 ],
 "Outubro": [
  "October",
  "Octubre"
 ],
 "Novembro": [
  "November",
  "Noviembre"
 ],
 "Dezembro": [
  "December",
  "Diciembre"
 ],
 "A lista usa o mês escolhido e as datas de nascimento cadastradas.": [
  "This list uses the selected month and recorded birth dates.",
  "La lista utiliza el mes elegido y las fechas de nacimiento registradas."
 ],
 "Salário médio": [
  "Average salary",
  "Salario promedio"
 ],
 "Salário bruto cadastrado": [
  "Recorded gross salary",
  "Salario bruto registrado"
 ],
 "Não informado": [
  "Not provided",
  "No informado"
 ],
 "A média usa apenas os valores cadastrados. Salários não informados ficam fora do cálculo.": [
  "The average includes only recorded values. Missing salaries are excluded.",
  "El promedio incluye únicamente los valores registrados. Los salarios no informados se excluyen."
 ],
 "Admissões e desligamentos": [
  "Hires and departures",
  "Altas y bajas"
 ],
 "Movimentações pelas datas registradas no cadastro": [
  "Changes by recorded employment dates",
  "Movimientos según las fechas registradas"
 ],
 "Admissões no período": [
  "Hires during the period",
  "Contrataciones en el período"
 ],
 "Desligamentos no período": [
  "Departures during the period",
  "Desvinculaciones en el período"
 ],
 "Nenhuma movimentação registrada no período": [
  "No employment changes in this period",
  "No hay movimientos registrados en el período"
 ],
 "Selecione outro período ou informe as datas na ficha do colaborador.": [
  "Choose another period or enter the dates in the employee record.",
  "Selecciona otro período o registra las fechas en la ficha del empleado."
 ],
 "Todos os cadastros nos filtros selecionados têm as datas necessárias.": [
  "All records matching these filters have the required dates.",
  "Todos los registros filtrados tienen las fechas necesarias."
 ],
 "Informações a completar": [
  "Information to complete",
  "Información por completar"
 ],
 "Campos opcionais que ajudam a preencher o painel": [
  "Optional fields that improve the dashboard",
  "Campos opcionales que ayudan a completar el panel"
 ],
 "Nenhum cadastro nestes filtros": [
  "No records match these filters",
  "No hay registros con estos filtros"
 ],
 "Ajuste os filtros para consultar seus colaboradores.": [
  "Adjust the filters to view your employees.",
  "Ajusta los filtros para consultar a tus empleados."
 ],
 "Equipe é opcional. As informações acima não bloqueiam o cadastro.": [
  "Team is optional. The information above does not block registration.",
  "El equipo es opcional. La información anterior no impide el registro."
 ],
 "Consulte o cadastro. Clique no nome para abrir as pastas e documentos.": [
  "Browse records. Click a name to open folders and documents.",
  "Consulta los registros. Haz clic en un nombre para abrir carpetas y documentos."
 ],
 "Filtros": [
  "Filters",
  "Filtros"
 ],
 "Nenhum colaborador encontrado": [
  "No employees found",
  "No se encontraron empleados"
 ],
 "Ajuste a pesquisa ou os filtros.": [
  "Adjust the search or filters.",
  "Ajusta la búsqueda o los filtros."
 ],
 "Anterior": [
  "Previous",
  "Anterior"
 ],
 "Próxima": [
  "Next",
  "Siguiente"
 ],
 "Relatórios de colaboradores": [
  "Employee reports",
  "Informes de empleados"
 ],
 "Consulte a mesma base do VeloX e escolha os campos do relatório.": [
  "Use the same VeloX records and choose your report fields.",
  "Consulta los mismos datos de VeloX y elige los campos del informe."
 ],
 "Configurar colunas": [
  "Configure columns",
  "Configurar columnas"
 ],
 "Nome, CPF ou contato": [
  "Name, CPF or contact",
  "Nombre, CPF o contacto"
 ],
 "Sem cargo": [
  "No job position",
  "Sin puesto"
 ],
 "Situação": [
  "Status",
  "Situación"
 ],
 "Ativo": [
  "Active",
  "Activo"
 ],
 "Afastado": [
  "On leave",
  "De baja temporal"
 ],
 "Desligado": [
  "Former employee",
  "Desvinculado"
 ],
 "Data do período": [
  "Period date",
  "Fecha del período"
 ],
 "Admissão": [
  "Hire date",
  "Contratación"
 ],
 "Desligamento": [
  "Departure",
  "Desvinculación"
 ],
 "Limpar filtros": [
  "Clear filters",
  "Limpiar filtros"
 ],
 "Resultado": [
  "Results",
  "Resultado"
 ],
 "Nenhum resultado": [
  "No results",
  "Sin resultados"
 ],
 "Ajuste ou limpe os filtros para consultar os colaboradores.": [
  "Adjust or clear the filters to view employees.",
  "Ajusta o limpia los filtros para consultar empleados."
 ],
 "Cadastre seu primeiro equipe": [
  "Cadastre sua primeira equipe",
  "Registra tu primer equipo"
 ],
 "Gestão empresarial": [
  "Business management",
  "Gestión empresarial"
 ],
 "Obrigações": [
  "Obligations",
  "Obligaciones"
 ],
 "Datas e situações confirmadas pelo operador. Documentos permanecem no Google Drive.": [
  "Dates and statuses confirmed by the operator. Documents remain in Google Drive.",
  "Fechas y estados confirmados por el operador. Los documentos permanecen en Google Drive."
 ],
 "Nova obrigação": [
  "New obligation",
  "Nueva obligación"
 ],
 "Pesquisar": [
  "Search",
  "Buscar"
 ],
 "Pendente": [
  "Pending",
  "Pendiente"
 ],
 "Próximo do vencimento": [
  "Near due date",
  "Próximo al vencimiento"
 ],
 "Vencido": [
  "Overdue",
  "Vencido"
 ],
 "Concluído": [
  "Completed",
  "Completado"
 ],
 "Não se aplica": [
  "Not applicable",
  "No aplica"
 ],
 "Data inicial": [
  "Start date",
  "Fecha inicial"
 ],
 "Data final": [
  "End date",
  "Fecha final"
 ],
 "Nenhum registro": [
  "No records",
  "Sin registros"
 ],
 "Cadastre informações confirmadas ou ajuste os filtros. Nenhum dado é criado automaticamente.": [
  "Enter confirmed information or adjust filters. No data is created automatically.",
  "Registra información confirmada o ajusta los filtros. No se crea ningún dato automáticamente."
 ],
 "Acervo contábil existente no Drive": [
  "Existing accounting records in Drive",
  "Archivo contable existente en Drive"
 ],
 "Contratos": [
  "Contracts",
  "Contratos"
 ],
 "Novo contrato": [
  "New contract",
  "Nuevo contrato"
 ],
 "Referência PMGO 61/2024": [
  "PMGO 61/2024 reference",
  "Referencia PMGO 61/2024"
 ],
 "Em conferência": [
  "Under review",
  "En revisión"
 ],
 "Vigente": [
  "Active",
  "Vigente"
 ],
 "Em renovação": [
  "Under renewal",
  "En renovación"
 ],
 "Suspenso": [
  "Suspended",
  "Suspendido"
 ],
 "Encerrado": [
  "Closed",
  "Cerrado"
 ],
 "Recarregar": [
  "Reload",
  "Recargar"
 ],
 "Imprimir": [
  "Print",
  "Imprimir"
 ],
 "Configurações": [
  "Settings",
  "Configuración"
 ],
 "Ajuda": [
  "Help",
  "Ayuda"
 ],
 "Cadastro do colaborador": [
  "Employee registration",
  "Registro de empleado"
 ],
 "Dados pessoais": [
  "Personal information",
  "Datos personales"
 ],
 "Endereço": [
  "Address",
  "Dirección"
 ],
 "Dados bancários": [
  "Banking information",
  "Datos bancarios"
 ],
 "Dependentes": [
  "Dependents",
  "Dependientes"
 ],
 "Situação do trabalho": [
  "Employment details",
  "Situación laboral"
 ],
 "Adicionar foto": [
  "Add photo",
  "Añadir foto"
 ],
 "JPG, PNG ou WebP · até 3 MB": [
  "JPG, PNG or WebP · up to 3 MB",
  "JPG, PNG o WebP · hasta 3 MB"
 ],
 "Nome completo *": [
  "Full name *",
  "Nombre completo *"
 ],
 "Nome completo": [
  "Full name",
  "Nombre completo"
 ],
 "CPF (opcional)": [
  "CPF (optional)",
  "CPF (opcional)"
 ],
 "Nome social": [
  "Preferred name",
  "Nombre social"
 ],
 "Data de nascimento": [
  "Date of birth",
  "Fecha de nacimiento"
 ],
 "Nome da mãe": [
  "Mother's name",
  "Nombre de la madre"
 ],
 "Nome do pai": [
  "Father's name",
  "Nombre del padre"
 ],
 "Feminino": [
  "Female",
  "Femenino"
 ],
 "Masculino": [
  "Male",
  "Masculino"
 ],
 "Não binário": [
  "Non-binary",
  "No binario"
 ],
 "Outro": [
  "Other",
  "Otro"
 ],
 "Prefiro não informar": [
  "Prefer not to say",
  "Prefiero no informar"
 ],
 "Estado civil": [
  "Marital status",
  "Estado civil"
 ],
 "Solteiro(a)": [
  "Single",
  "Soltero(a)"
 ],
 "Casado(a)": [
  "Married",
  "Casado(a)"
 ],
 "Divorciado(a)": [
  "Divorced",
  "Divorciado(a)"
 ],
 "Viúvo(a)": [
  "Widowed",
  "Viudo(a)"
 ],
 "União estável": [
  "Domestic partnership",
  "Unión de hecho"
 ],
 "Separado(a)": [
  "Separated",
  "Separado(a)"
 ],
 "Etnia / raça": [
  "Ethnicity / race",
  "Etnia / raza"
 ],
 "Branca": [
  "White",
  "Blanca"
 ],
 "Preta": [
  "Black",
  "Negra"
 ],
 "Parda": [
  "Mixed-race",
  "Mestiza"
 ],
 "Amarela": [
  "East Asian",
  "Asiática"
 ],
 "Indígena": [
  "Indigenous",
  "Indígena"
 ],
 "Escolaridade": [
  "Education level",
  "Nivel educativo"
 ],
 "Não informada": [
  "Not provided",
  "No informada"
 ],
 "Não alfabetizado(a)": [
  "No formal literacy",
  "No alfabetizado(a)"
 ],
 "Fundamental incompleto": [
  "Incomplete primary education",
  "Educación primaria incompleta"
 ],
 "Fundamental completo": [
  "Completed primary education",
  "Educación primaria completa"
 ],
 "Médio incompleto": [
  "Incomplete secondary education",
  "Educación secundaria incompleta"
 ],
 "Médio completo": [
  "Completed secondary education",
  "Educación secundaria completa"
 ],
 "Superior incompleto": [
  "Incomplete higher education",
  "Educación superior incompleta"
 ],
 "Superior completo": [
  "Completed higher education",
  "Educación superior completa"
 ],
 "Pós-graduação": [
  "Postgraduate education",
  "Posgrado"
 ],
 "Nacionalidade": [
  "Nationality",
  "Nacionalidad"
 ],
 "País de nascimento": [
  "Country of birth",
  "País de nacimiento"
 ],
 "Data de naturalização": [
  "Naturalization date",
  "Fecha de naturalización"
 ],
 "Informe uma nacionalidade estrangeira para habilitar.": [
  "Enter a foreign nationality to enable this field.",
  "Indica una nacionalidad extranjera para habilitar este campo."
 ],
 "Pessoa com deficiência (PCD)": [
  "Person with disability (PwD)",
  "Persona con discapacidad (PcD)"
 ],
 "Casado(a) com brasileiro(a)": [
  "Married to a Brazilian citizen",
  "Casado(a) con ciudadano(a) brasileño(a)"
 ],
 "Filho(a) brasileiro(a)": [
  "Brazilian child",
  "Hijo(a) brasileño(a)"
 ],
 "Contato": [
  "Contact",
  "Contacto"
 ],
 "Celular": [
  "Mobile phone",
  "Teléfono móvil"
 ],
 "Continuar": [
  "Continue",
  "Continuar"
 ],
 "Salvar cadastro": [
  "Save record",
  "Guardar registro"
 ],
 "RG e CNH": [
  "RG and driver's license",
  "RG y licencia de conducir"
 ],
 "Número do RG": [
  "RG number",
  "Número del RG"
 ],
 "Data de expedição do RG": [
  "RG issue date",
  "Fecha de expedición del RG"
 ],
 "Órgão emissor do RG": [
  "RG issuing authority",
  "Organismo emisor del RG"
 ],
 "Número da CNH": [
  "Driver's license number",
  "Número de licencia de conducir"
 ],
 "Validade da CNH": [
  "Driver's license expiration",
  "Vencimiento de la licencia"
 ],
 "CTPS e NIS": [
  "Work card and NIS",
  "Libreta laboral y NIS"
 ],
 "Número da CTPS": [
  "Work card number (CTPS)",
  "Número de libreta laboral (CTPS)"
 ],
 "Série da CTPS": [
  "Work card series",
  "Serie de la libreta laboral"
 ],
 "Data de emissão da CTPS": [
  "Work card issue date",
  "Fecha de emisión de la libreta laboral"
 ],
 "UF da CTPS": [
  "Work card state",
  "Estado de la libreta laboral"
 ],
 "NIS (PIS/PASEP/NIT)": [
  "NIS (PIS/PASEP/NIT)",
  "NIS (PIS/PASEP/NIT)"
 ],
 "Estrangeiro(a)": [
  "Foreign national",
  "Extranjero(a)"
 ],
 "Anexar documentos": [
  "Attach documents",
  "Adjuntar documentos"
 ],
 "Arquivos": [
  "Files",
  "Archivos"
 ],
 "Arraste os documentos aqui": [
  "Drag documents here",
  "Arrastra documentos aquí"
 ],
 "ou clique em selecionar · Ctrl+V para colar arquivos": [
  "or click to select · Ctrl+V to paste files",
  "o haz clic para seleccionar · Ctrl+V para pegar archivos"
 ],
 "Selecionar arquivos": [
  "Select files",
  "Seleccionar archivos"
 ],
 "Nenhum arquivo selecionado": [
  "No files selected",
  "No hay archivos seleccionados"
 ],
 "Tipo de documento": [
  "Document type",
  "Tipo de documento"
 ],
 "Escolha a pasta de destino": [
  "Choose destination folder",
  "Elige la carpeta de destino"
 ],
 "01 - Documentos Pessoais": [
  "01 - Personal Documents",
  "01 - Documentos personales"
 ],
 "02 - Comprovantes de Endereço": [
  "02 - Proof of Address",
  "02 - Comprobantes de domicilio"
 ],
 "03 - CTPS": [
  "03 - Work Card (CTPS)",
  "03 - Libreta laboral (CTPS)"
 ],
 "04 - Admissão e Contrato": [
  "04 - Hiring and Contract",
  "04 - Contratación y contrato"
 ],
 "05 - ASO": [
  "05 - Occupational Health Certificate (ASO)",
  "05 - Certificado de aptitud laboral (ASO)"
 ],
 "06 - Vacinas": [
  "06 - Vaccinations",
  "06 - Vacunas"
 ],
 "07 - Dependentes": [
  "07 - Dependents",
  "07 - Dependientes"
 ],
 "08 - Ficha de EPI": [
  "08 - PPE Record",
  "08 - Registro de EPP"
 ],
 "09 - Espelho de Ponto e Justificativas": [
  "09 - Time Records and Explanations",
  "09 - Registro de asistencia y justificantes"
 ],
 "10 - Holerites": [
  "10 - Payslips",
  "10 - Recibos de nómina"
 ],
 "11 - Comprovantes de Pagamento": [
  "11 - Payment Receipts",
  "11 - Comprobantes de pago"
 ],
 "12 - Férias": [
  "12 - Vacation",
  "12 - Vacaciones"
 ],
 "13 - 13º Salário": [
  "13 - Thirteenth Salary",
  "13 - Decimotercer salario"
 ],
 "14 - Desligamento": [
  "14 - Termination",
  "14 - Desvinculación"
 ],
 "Adicionar": [
  "Add",
  "Añadir"
 ],
 "Os arquivos serão enviados ao salvar, para as pastas escolhidas. Até 20 MB por arquivo.": [
  "Files will be uploaded to the selected folders when saved. Up to 20 MB per file.",
  "Al guardar, los archivos se enviarán a las carpetas elegidas. Hasta 20 MB por archivo."
 ],
 "CEP": [
  "Postal code (CEP)",
  "Código postal (CEP)"
 ],
 "Digite o CEP para preencher o endereço.": [
  "Enter the postal code to fill in the address.",
  "Escribe el código postal para completar la dirección."
 ],
 "Rua / logradouro": [
  "Street / thoroughfare",
  "Calle / vía"
 ],
 "Número": [
  "Number",
  "Número"
 ],
 "Complemento": [
  "Address details",
  "Complemento"
 ],
 "Bairro": [
  "District / neighborhood",
  "Barrio"
 ],
 "Cidade": [
  "City",
  "Ciudad"
 ],
 "UF": [
  "State",
  "Estado"
 ],
 "Endereço no exterior": [
  "Address abroad",
  "Dirección en el extranjero"
 ],
 "Banco": [
  "Bank",
  "Banco"
 ],
 "Agência": [
  "Branch",
  "Sucursal"
 ],
 "Número da conta": [
  "Account number",
  "Número de cuenta"
 ],
 "Tipo de conta": [
  "Account type",
  "Tipo de cuenta"
 ],
 "Conta corrente": [
  "Checking account",
  "Cuenta corriente"
 ],
 "Conta poupança": [
  "Savings account",
  "Cuenta de ahorro"
 ],
 "Conta salário": [
  "Payroll account",
  "Cuenta nómina"
 ],
 "Conta de pagamento": [
  "Payment account",
  "Cuenta de pago"
 ],
 "Chave Pix": [
  "Pix key",
  "Clave Pix"
 ],
 "Tipo de dependente": [
  "Dependent type",
  "Tipo de dependiente"
 ],
 "Filho(a)": [
  "Child",
  "Hijo(a)"
 ],
 "Cônjuge": [
  "Spouse",
  "Cónyuge"
 ],
 "Companheiro(a)": [
  "Partner",
  "Pareja"
 ],
 "Enteado(a)": [
  "Stepchild",
  "Hijastro(a)"
 ],
 "Pai / mãe": [
  "Parent",
  "Padre / madre"
 ],
 "Sexo": [
  "Sex",
  "Sexo"
 ],
 "Dependente para imposto de renda": [
  "Income tax dependent",
  "Dependiente para el impuesto sobre la renta"
 ],
 "Dependente para salário família": [
  "Family allowance dependent",
  "Dependiente para subsidio familiar"
 ],
 "PCD": [
  "PwD",
  "PcD"
 ],
 "Adicionar dependente": [
  "Add dependent",
  "Añadir dependiente"
 ],
 "Limpar campos": [
  "Clear fields",
  "Limpiar campos"
 ],
 "Nenhum dependente adicionado.": [
  "No dependents added.",
  "No hay dependientes añadidos."
 ],
 "Vínculo e organização": [
  "Employment and organization",
  "Vínculo y organización"
 ],
 "Situação do colaborador *": [
  "Employee status *",
  "Situación del empleado *"
 ],
 "Data de admissão": [
  "Hiring date",
  "Fecha de contratación"
 ],
 "Data de desligamento": [
  "Termination date",
  "Fecha de desvinculación"
 ],
 "Centro de custo *": [
  "Cost center *",
  "Centro de costos *"
 ],
 "Escolha o centro de custo": [
  "Choose a cost center",
  "Elige un centro de costos"
 ],
 "Equipe (opcional)": [
  "Team (optional)",
  "Equipo (opcional)"
 ],
 "Cargo (opcional)": [
  "Job position (optional)",
  "Puesto (opcional)"
 ],
 "Cadastre centros de custo, equipes e cargos pelas opções do menu. Depois, escolha-os nas listas acima.": [
  "Register cost centers, teams and positions in the menu first. Then choose them from the lists above.",
  "Registra centros de costos, equipos y puestos desde el menú y después selecciónalos en las listas anteriores."
 ],
 "Cadastre um centro de custo no menu antes de salvar um novo colaborador.": [
  "Register a cost center from the menu before saving a new employee.",
  "Registra un centro de costos desde el menú antes de guardar un empleado."
 ],
 "Experiência — conferir os prazos aplicáveis": [
  "Probation period — verify applicable deadlines",
  "Período de prueba — verificar los plazos aplicables"
 ],
 "Período inicial (dias, opcional)": [
  "Initial period (days, optional)",
  "Período inicial (días, opcional)"
 ],
 "Prorrogação confirmada (dias)": [
  "Confirmed extension (days)",
  "Prórroga confirmada (días)"
 ],
 "Data final confirmada (opcional)": [
  "Confirmed end date (optional)",
  "Fecha final confirmada (opcional)"
 ],
 "Decisão administrativa registrada em": [
  "Administrative decision recorded on",
  "Decisión administrativa registrada el"
 ],
 "Nenhuma prorrogação ou desligamento é automático. Registre somente o período e a decisão realmente confirmados.": [
  "Extensions and terminations are never automatic. Record only confirmed periods and decisions.",
  "Las prórrogas y desvinculaciones nunca son automáticas. Registra únicamente períodos y decisiones confirmados."
 ],
 "Dados do trabalho": [
  "Work details",
  "Datos laborales"
 ],
 "Salário bruto": [
  "Gross salary",
  "Salario bruto"
 ],
 "Carga horária / jornada": [
  "Working hours / schedule",
  "Horario / jornada laboral"
 ],
 "Comissionado(a)": [
  "Commission-based",
  "Por comisión"
 ],
 "Observações": [
  "Notes",
  "Observaciones"
 ],
 "Cadastre seu primeiro colaborador": [
  "Register your first employee",
  "Registra a tu primer empleado"
 ],
 "Documento obrigatório": [
  "Required document",
  "Documento obligatorio"
 ],
 "Anexo": [
  "Attachment",
  "Archivo adjunto"
 ],
 "Escolher arquivo": [
  "Choose file",
  "Elegir archivo"
 ],
 "Abrir arquivo": [
  "Open file",
  "Abrir archivo"
 ],
 "Baixar arquivo": [
  "Download file",
  "Descargar archivo"
 ],
 "Remover arquivo": [
  "Remove file",
  "Quitar archivo"
 ],
 "Arquivo inválido": [
  "Invalid file",
  "Archivo inválido"
 ],
 "Salvar alterações": [
  "Save changes",
  "Guardar cambios"
 ],
 "Confirmar": [
  "Confirm",
  "Confirmar"
 ],
 "Voltar à lista": [
  "Back to list",
  "Volver a la lista"
 ],
 "Ver detalhes": [
  "View details",
  "Ver detalles"
 ],
 "Nova pasta": [
  "New folder",
  "Nueva carpeta"
 ],
 "Pesquisar colaboradores": [
  "Search employees",
  "Buscar empleados"
 ],
 "CADASTRO": [
  "RECORD",
  "REGISTRO"
 ],
 "Nome *": [
  "Name *",
  "Nombre *"
 ],
 "Código (opcional)": [
  "Code (optional)",
  "Código (opcional)"
 ],
 "Código / CBO (opcional)": [
  "Code / CBO (optional)",
  "Código / CBO (opcional)"
 ],
 "Situação *": [
  "Status *",
  "Estado *"
 ],
 "Descrição (opcional)": [
  "Description (optional)",
  "Descripción (opcional)"
 ],
 "Inativo": [
  "Inactive",
  "Inactivo"
 ],
 "Cadastros inativos permanecem vinculados aos colaboradores existentes.": [
  "Inactive records remain linked to existing employees.",
  "Los registros inactivos siguen vinculados a los empleados existentes."
 ],
 "Cadastre sua primeira equipe": [
  "Add your first team",
  "Registra tu primer equipo"
 ],
 "Cadastrar obrigação": [
  "Register obligation",
  "Registrar obligación"
 ],
 "Área / tipo *": [
  "Area / type *",
  "Área / tipo *"
 ],
 "Categoria *": [
  "Category *",
  "Categoría *"
 ],
 "Descrição *": [
  "Description *",
  "Descripción *"
 ],
 "Competência (ex.: 10/2026 ou 13º)": [
  "Reporting period (e.g., 10/2026 or 13th salary)",
  "Período de referencia (p. ej., 10/2026 o decimotercer salario)"
 ],
 "Valor em reais": [
  "Amount in Brazilian reais",
  "Valor en reales brasileños"
 ],
 "Data de emissão": [
  "Issue date",
  "Fecha de emisión"
 ],
 "Vencimento confirmado": [
  "Confirmed due date",
  "Vencimiento confirmado"
 ],
 "Periodicidade *": [
  "Frequency *",
  "Periodicidad *"
 ],
 "Única": [
  "One-time",
  "Única"
 ],
 "Mensal": [
  "Monthly",
  "Mensual"
 ],
 "Trimestral": [
  "Quarterly",
  "Trimestral"
 ],
 "Semestral": [
  "Semiannual",
  "Semestral"
 ],
 "Anual": [
  "Annual",
  "Anual"
 ],
 "Outra": [
  "Other",
  "Otra"
 ],
 "Recebimento documental *": [
  "Documents received *",
  "Recepción de documentos *"
 ],
 "Parcial": [
  "Partial",
  "Parcial"
 ],
 "Recebido": [
  "Received",
  "Recibido"
 ],
 "Pagamento *": [
  "Payment *",
  "Pago *"
 ],
 "Pago": [
  "Paid",
  "Pagado"
 ],
 "Contrato vinculado": [
  "Linked contract",
  "Contrato vinculado"
 ],
 "Sem contrato": [
  "No contract",
  "Sin contrato"
 ],
 "Não presumimos datas legais, valores ou prorrogações. Receber um documento não confirma o pagamento. Anexe documentos depois de salvar o registro.": [
  "We do not assume legal due dates, amounts or extensions. Receiving a document does not confirm payment. Attach documents after saving the record.",
  "No se presumen fechas legales, importes ni prórrogas. Recibir un documento no confirma el pago. Adjunta documentos después de guardar el registro."
 ],
 "Selecione ao menos uma coluna. Use as setas para definir a ordem. Dados bancários e dependentes não fazem parte deste relatório.": [
  "Select at least one column. Use the arrows to set the order. Banking and dependent information is excluded from this report.",
  "Selecciona al menos una columna. Usa las flechas para definir el orden. Los datos bancarios y de dependientes quedan excluidos de este informe."
 ],
 "Nome": [
  "Name",
  "Nombre"
 ],
 "Aplicar colunas": [
  "Apply columns",
  "Aplicar columnas"
 ],
 "Antecedência dos avisos": [
  "Alert lead time",
  "Antelación de los avisos"
 ],
 "Obrigações (dias) *": [
  "Obligations (days) *",
  "Obligaciones (días) *"
 ],
 "Experiência (dias) *": [
  "Probation (days) *",
  "Período de prueba (días) *"
 ],
 "A antecedência contratual é configurada em cada contrato. Nenhuma decisão é executada automaticamente.": [
  "The contractual lead time is configured for each contract. No decision is executed automatically.",
  "La antelación contractual se configura en cada contrato. Ninguna decisión se ejecuta automáticamente."
 ]
});

// VeloX 11-improvement release: standardized HR document taxonomy and navigation groups.
Object.assign(map, {
 "PRINCIPAL": ["MAIN", "PRINCIPAL"],
 "COLABORADORES": ["EMPLOYEES", "COLABORADORES"],
 "CADASTROS": ["REGISTRATIONS", "REGISTROS"],
 "GESTÃO EMPRESARIAL": ["BUSINESS MANAGEMENT", "GESTIÓN EMPRESARIAL"],
 "OUTRAS PASTAS": ["OTHER FOLDERS", "OTRAS CARPETAS"],
 "Cadastro e Identificação": ["Registration and Identification", "Registro e Identificación"],
 "Admissão e Vínculo Trabalhista": ["Hiring and Employment", "Contratación y Relación Laboral"],
 "Saúde e Segurança do Trabalho": ["Occupational Health and Safety", "Salud y Seguridad en el Trabajo"],
 "Jornada e Frequência": ["Work Hours and Attendance", "Jornada y Asistencia"],
 "Remuneração e Direitos": ["Compensation and Entitlements", "Remuneración y Derechos"],
 "Desligamento e Rescisão": ["Termination and Severance", "Baja y Liquidación"],
 "Documentos de Identificação": ["Identity Documents", "Documentos de Identificación"],
 "Comprovantes de Residência": ["Proof of Residence", "Comprobantes de Domicilio"],
 "Carteira de Trabalho (CTPS)": ["Employment Record Book (CTPS)", "Libreta de Trabajo (CTPS)"],
 "Admissão e Contrato de Trabalho": ["Hiring and Employment Contract", "Admisión y Contrato de Trabajo"],
 "Saúde Ocupacional (ASO e Exames)": ["Occupational Health (Medical Certificates and Exams)", "Salud Ocupacional (Certificados y Exámenes)"],
 "Registros de Vacinação": ["Vaccination Records", "Registros de Vacunación"],
 "Dependentes": ["Dependents", "Personas a Cargo"],
 "Equipamentos de Proteção Individual (EPI)": ["Personal Protective Equipment (PPE)", "Equipos de Protección Personal (EPP)"],
 "Demonstrativos de Pagamento (Holerites)": ["Pay Statements", "Recibos de Nómina"],
 "Comprovantes de Pagamento Salarial": ["Salary Payment Receipts", "Comprobantes de Pago Salarial"],
 "Férias": ["Vacation", "Vacaciones"],
 "13º Salário": ["13th Salary", "Sueldo Anual Complementario"],
 "Desligamento e Rescisão Contratual": ["Employment Termination and Severance", "Baja y Liquidación Laboral"],
});

const ADDITIONAL_UI_TRANSLATIONS = {
  // Calendar, date validation and accessibility.
  'Selecionar data': ['Select date','Seleccionar fecha','Sélectionner une date'],
  'Informe uma data válida: DD/MM/AAAA.': ['Enter a valid date: DD/MM/YYYY.','Introduce una fecha válida: DD/MM/AAAA.','Saisissez une date valide : JJ/MM/AAAA.'],
  'Data mínima:': ['Earliest date:','Fecha mínima:','Date minimale :'],
  'Data máxima:': ['Latest date:','Fecha máxima:','Date maximale :'],
  'Mês anterior': ['Previous month','Mes anterior','Mois précédent'],
  'Anos anteriores': ['Previous years','Años anteriores','Années précédentes'],
  'Selecionar mês e ano': ['Select month and year','Seleccionar mes y año','Sélectionner le mois et l’année'],
  'Selecionar ano': ['Select year','Seleccionar año','Sélectionner l’année'],
  'Voltar aos meses': ['Back to months','Volver a los meses','Retour aux mois'],
  'Próximo mês': ['Next month','Mes siguiente','Mois suivant'],
  'Próximos anos': ['Next years','Años siguientes','Années suivantes'],
  ', hoje': [', today',', hoy',', aujourd’hui'],
  'Escolher mês': ['Choose month','Elegir mes','Choisir le mois'],
  'Escolher ano': ['Choose year','Elegir año','Choisir l’année'],
  'Selecione uma data. Escape ou clique fora para sair. Use as setas para navegar.': ['Select a date. Press Escape or click outside to close. Use the arrow keys to navigate.','Selecciona una fecha. Pulsa Escape o haz clic fuera para salir. Usa las flechas para navegar.','Sélectionnez une date. Appuyez sur Échap ou cliquez à l’extérieur pour fermer. Utilisez les flèches pour naviguer.'],
  'Domingo': ['Sunday','Domingo','Dimanche'],
  'Segunda-feira': ['Monday','Lunes','Lundi'],
  'Terça-feira': ['Tuesday','Martes','Mardi'],
  'Quarta-feira': ['Wednesday','Miércoles','Mercredi'],
  'Quinta-feira': ['Thursday','Jueves','Jeudi'],
  'Sexta-feira': ['Friday','Viernes','Vendredi'],
  'Sábado': ['Saturday','Sábado','Samedi'],
  'Confira o período: a data inicial deve ser anterior ou igual à final.': ['Check the date range: the start date must be on or before the end date.','Comprueba el período: la fecha inicial debe ser anterior o igual a la final.','Vérifiez la période : la date de début doit être antérieure ou égale à la date de fin.'],
  'Escolha a data de admissão ou desligamento para filtrar o período.': ['Choose the hiring or termination date to filter the period.','Elige la fecha de contratación o baja para filtrar el período.','Choisissez la date d’embauche ou de départ pour filtrer la période.'],
  'Informe um período válido: a data inicial deve ser anterior ou igual à final.': ['Enter a valid date range: the start date must be on or before the end date.','Introduce un período válido: la fecha inicial debe ser anterior o igual a la final.','Saisissez une période valide : la date de début doit être antérieure ou égale à la date de fin.'],
  'Selecione ao menos uma coluna.': ['Select at least one column.','Selecciona al menos una columna.','Sélectionnez au moins une colonne.'],
  'Selecione ao menos uma coluna. Use as setas para definir a ordem. Dados bancários e dependentes não fazem parte deste relatório.': ['Select at least one column. Use the arrows to set the order. Banking details and dependents are excluded from this report.','Selecciona al menos una columna. Usa las flechas para definir el orden. Los datos bancarios y los dependientes no forman parte de este informe.','Sélectionnez au moins une colonne. Utilisez les flèches pour définir l’ordre. Les données bancaires et les personnes à charge sont exclues de ce rapport.'],
  // Common feedback, home and overview.
  'Selecione, arraste ou cole um arquivo.': ['Select, drag or paste a file.','Selecciona, arrastra o pega un archivo.','Sélectionnez, faites glisser ou collez un fichier.'],
  'Não foi possível concluir. Tente novamente.': ['Could not complete the operation. Try again.','No se pudo completar la operación. Inténtalo de nuevo.','Impossible de terminer l’opération. Réessayez.'],
  'Carregando…': ['Loading…','Cargando…','Chargement…'],
  'Não foi possível abrir esta tela': ['This page could not be opened','No se pudo abrir esta pantalla','Impossible d’ouvrir cet écran'],
  'Tentar novamente': ['Try again','Intentar de nuevo','Réessayer'],
  'Operação concluída.': ['Operation completed.','Operación completada.','Opération terminée.'],
  'Alteração salva. Atualize a tela para conferir.': ['Changes saved. Refresh the page to review them.','Cambios guardados. Actualiza la pantalla para revisarlos.','Modifications enregistrées. Actualisez l’écran pour les vérifier.'],
  'A alteração foi salva, mas a tela não pôde ser atualizada.': ['The change was saved, but the page could not be refreshed.','El cambio se guardó, pero no se pudo actualizar la pantalla.','La modification a été enregistrée, mais l’écran n’a pas pu être actualisé.'],
  'Indicadores da base atual do VeloX.': ['Indicators from the current VeloX database.','Indicadores de la base actual de VeloX.','Indicateurs de la base VeloX actuelle.'],
  'Totais atuais, independentes do período de movimentações': ['Current totals, independent of the activity period','Totales actuales, independientes del período de movimientos','Totaux actuels, indépendants de la période des mouvements'],
  'Distribuição de colaboradores': ['Employee distribution','Distribución de empleados','Répartition des employés'],
  'Todos os cadastros nos filtros selecionados': ['All records matching the selected filters','Todos los registros según los filtros seleccionados','Tous les dossiers correspondant aux filtres sélectionnés'],
  'Colaboradores ativos e afastados': ['Active employees and employees on leave','Empleados activos y de baja temporal','Employés actifs et en congé'],
  'Salário médio': ['Average salary','Salario promedio','Salaire moyen'],
  'Salário bruto cadastrado': ['Registered gross salary','Salario bruto registrado','Salaire brut enregistré'],
  'Admissões e desligamentos': ['Hirings and terminations','Altas y bajas','Embauches et départs'],
  'Movimentações pelas datas registradas no cadastro': ['Changes based on the dates recorded in each employee record','Movimientos según las fechas registradas en el expediente','Mouvements selon les dates enregistrées dans le dossier'],
  'Informações a completar': ['Information to complete','Información por completar','Informations à compléter'],
  'Campos opcionais que ajudam a preencher o painel': ['Optional fields that help complete the dashboard','Campos opcionales que ayudan a completar el panel','Champs facultatifs qui aident à compléter le tableau de bord'],
  'Admissões no período': ['Hirings during the period','Altas durante el período','Embauches sur la période'],
  'Desligamentos no período': ['Terminations during the period','Bajas durante el período','Départs sur la période'],
  'Ver números em tabela': ['View figures in a table','Ver cifras en una tabla','Voir les chiffres dans un tableau'],
  'Movimentações no período selecionado': ['Changes during the selected period','Movimientos durante el período seleccionado','Mouvements sur la période sélectionnée'],
  'Centro não informado': ['Cost center not provided','Centro de costo no informado','Centre de coûts non renseigné'],
  'Hoje!': ['Today!','¡Hoy!','Aujourd’hui !'],
  'A média usa apenas os valores cadastrados. Salários não informados ficam fora do cálculo.': ['The average uses only recorded values. Salaries that have not been provided are excluded.','El promedio utiliza solo los valores registrados. Los salarios no informados quedan fuera del cálculo.','La moyenne utilise uniquement les valeurs enregistrées. Les salaires non renseignés sont exclus du calcul.'],
  'Dados do painel preenchidos': ['Dashboard information completed','Datos del panel completos','Données du tableau de bord complétées'],
  'Os campos utilizados na visão geral estão informados.': ['The fields used in the overview are filled in.','Los campos utilizados en la vista general están informados.','Les champs utilisés dans la vue d’ensemble sont renseignés.'],
  'Indicadores de situação, distribuição e salário representam os vínculos atuais. Cada contratação mantém seu próprio histórico.': ['Status, distribution and salary indicators reflect current employment relationships. Each hiring retains its own history.','Los indicadores de situación, distribución y salario reflejan las relaciones laborales actuales. Cada contratación conserva su propio historial.','Les indicateurs de statut, de répartition et de salaire reflètent les relations de travail actuelles. Chaque embauche conserve son propre historique.'],
  'Filtros de colaboradores': ['Employee filters','Filtros de empleados','Filtres des employés'],
  'Pesquisar colaboradores': ['Search employees','Buscar empleados','Rechercher des employés'],
  'Pesquisar nome, CPF ou contato': ['Search by name, CPF or contact','Buscar por nombre, CPF o contacto','Rechercher par nom, CPF ou contact'],
  'Lista de colaboradores': ['Employee list','Lista de empleados','Liste des employés'],
  'Sem nome': ['No name','Sin nombre','Sans nom'],
  'Colaborador não encontrado. Atualize a lista.': ['Employee not found. Refresh the list.','No se encontró al empleado. Actualiza la lista.','Employé introuvable. Actualisez la liste.'],
  'Este colaborador já está desligado.': ['This employee has already been terminated.','Este empleado ya está desvinculado.','Cet employé a déjà quitté l’entreprise.'],
  'Desligar colaborador': ['Terminate employee','Dar de baja al empleado','Mettre fin au contrat de l’employé'],
  'Confira a data efetiva. Esta ação não agenda um desligamento futuro.': ['Check the effective date. This action does not schedule a future termination.','Comprueba la fecha efectiva. Esta acción no programa una baja futura.','Vérifiez la date effective. Cette action ne programme pas un départ futur.'],
  'Confirmar desligamento': ['Confirm termination','Confirmar baja','Confirmer le départ'],
  'ENCERRAMENTO DO VÍNCULO': ['END OF EMPLOYMENT','FINALIZACIÓN DE LA RELACIÓN LABORAL','FIN DE LA RELATION DE TRAVAIL'],
  'Exportação inclui todos os vínculos filtrados.': ['The export includes all filtered employment relationships.','La exportación incluye todas las relaciones laborales filtradas.','L’exportation inclut toutes les relations de travail filtrées.'],
  'Pesquisar no resultado': ['Search results','Buscar en los resultados','Rechercher dans les résultats'],
  'Pesquisar no resultado por nome, CPF ou contato': ['Search results by name, CPF or contact','Buscar resultados por nombre, CPF o contacto','Rechercher dans les résultats par nom, CPF ou contact'],
  'Relatório de colaboradores': ['Employee report','Informe de empleados','Rapport des employés'],
  'Corrija o período antes de exportar.': ['Correct the date range before exporting.','Corrige el período antes de exportar.','Corrigez la période avant l’exportation.'],
  'Não há resultados para exportar.': ['There are no results to export.','No hay resultados para exportar.','Aucun résultat à exporter.'],
  'Ajuste a busca ou o filtro.': ['Adjust the search or filter.','Ajusta la búsqueda o el filtro.','Modifiez la recherche ou le filtre.'],

  // Employee documents, uploads and registration.
  'Abrindo a pasta do colaborador…': ['Opening the employee folder…','Abriendo la carpeta del empleado…','Ouverture du dossier de l’employé…'],
  'Abrindo documentos…': ['Opening documents…','Abriendo documentos…','Ouverture des documents…'],
  'Outras pastas': ['Other folders','Otras carpetas','Autres dossiers'],
  'Selecione os documentos.': ['Select the documents.','Selecciona los documentos.','Sélectionnez les documents.'],
  'O lote excede 100 MB. Selecione menos documentos.': ['The batch exceeds 100 MB. Select fewer documents.','El lote supera los 100 MB. Selecciona menos documentos.','Le lot dépasse 100 Mo. Sélectionnez moins de documents.'],
  'Download preparado. Arquivos originais preservados.': ['Download prepared. Original files were preserved.','Descarga preparada. Se conservaron los archivos originales.','Téléchargement préparé. Les fichiers originaux ont été conservés.'],
  'Pastas e documentos do colaborador.': ['Employee folders and documents.','Carpetas y documentos del empleado.','Dossiers et documents de l’employé.'],
  'Documentos do colaborador': ['Employee documents','Documentos del empleado','Documents de l’employé'],
  'Solte arquivos sobre uma categoria ou abra uma pasta para enviar.': ['Drop files onto a category or open a folder to upload them.','Suelta archivos sobre una categoría o abre una carpeta para enviarlos.','Déposez les fichiers sur une catégorie ou ouvrez un dossier pour les envoyer.'],
  'Enviar documentos': ['Upload documents','Enviar documentos','Envoyer des documents'],
  'Baixar selecionados': ['Download selected','Descargar seleccionados','Télécharger la sélection'],
  'Documentos da pasta atual': ['Documents in the current folder','Documentos de la carpeta actual','Documents du dossier actuel'],
  'Pasta pronta para receber documentos': ['Folder ready to receive documents','Carpeta lista para recibir documentos','Dossier prêt à recevoir des documents'],
  'Clique em Enviar documentos ou crie uma subpasta.': ['Click Upload documents or create a subfolder.','Haz clic en Enviar documentos o crea una subcarpeta.','Cliquez sur Envoyer des documents ou créez un sous-dossier.'],
  'Existem mais itens nesta pasta do que os exibidos.': ['This folder contains more items than are currently displayed.','Esta carpeta contiene más elementos de los que se muestran.','Ce dossier contient plus d’éléments que ceux affichés.'],
  'Arquivos do colaborador': ['Employee files','Archivos del empleado','Fichiers de l’employé'],
  'Outros vínculos deste CPF': ['Other employment relationships for this CPF','Otras relaciones laborales de este CPF','Autres relations de travail associées à ce CPF'],
  'Admissão não informada': ['Hiring date not provided','Fecha de contratación no informada','Date d’embauche non renseignée'],
  'Em aberto': ['Open','Abierto','En cours'],
  'Adicionar documentos por seleção, arrastar ou colar': ['Add documents by selecting, dragging or pasting','Añadir documentos seleccionando, arrastrando o pegando','Ajouter des documents en les sélectionnant, en les faisant glisser ou en les collant'],
  'ou clique em selecionar · Ctrl+V para colar arquivos': ['or click Select · Ctrl+V to paste files','o haz clic en Seleccionar · Ctrl+V para pegar archivos','ou cliquez sur Sélectionner · Ctrl+V pour coller des fichiers'],
  'Limpar seleção': ['Clear selection','Limpiar selección','Effacer la sélection'],
  'Nenhum arquivo selecionado': ['No file selected','Ningún archivo seleccionado','Aucun fichier sélectionné'],
  'Informe um valor em reais, por exemplo 1.711,00.': ['Enter an amount in Brazilian reais, for example 1,711.00.','Introduce un importe en reales brasileños, por ejemplo 1.711,00.','Saisissez un montant en réaux brésiliens, par exemple 1 711,00.'],
  'Preencha se houver naturalização.': ['Complete this field if naturalization applies.','Completa este campo si hubo naturalización.','À remplir en cas de naturalisation.'],
  'Não se aplica à nacionalidade brasileira.': ['Not applicable to Brazilian nationality.','No se aplica a la nacionalidad brasileña.','Ne s’applique pas à la nationalité brésilienne.'],
  'Digite para ver sugestões': ['Type to see suggestions','Escribe para ver sugerencias','Saisissez du texte pour voir les suggestions'],
  'Sugestões de': ['Suggestions for','Sugerencias de','Suggestions pour'],
  'Digite o CEP para preencher o endereço.': ['Enter the postal code to fill in the address.','Introduce el código postal para completar la dirección.','Saisissez le code postal pour remplir l’adresse.'],
  'Consultando CEP…': ['Checking postal code…','Consultando código postal…','Vérification du code postal…'],
  'Cidade e UF preenchidas. Complete e confira os demais campos.': ['City and state filled in. Complete and review the remaining fields.','Ciudad y estado completados. Completa y revisa los demás campos.','Ville et État renseignés. Complétez et vérifiez les autres champs.'],
  'Endereço preenchido. Confira número e complemento.': ['Address filled in. Check the number and additional details.','Dirección completada. Comprueba el número y el complemento.','Adresse renseignée. Vérifiez le numéro et le complément.'],
  'A consulta demorou. Preencha manualmente ou digite o CEP novamente.': ['The lookup took too long. Enter the address manually or re-enter the postal code.','La consulta tardó demasiado. Completa la dirección manualmente o vuelve a introducir el código postal.','La recherche a pris trop de temps. Saisissez l’adresse manuellement ou entrez à nouveau le code postal.'],
  'Consulta indisponível. Preencha o endereço manualmente.': ['Lookup unavailable. Enter the address manually.','Consulta no disponible. Completa la dirección manualmente.','Recherche indisponible. Saisissez l’adresse manuellement.'],
  'Solte os arquivos no botão Enviar documentos ou na área de seleção.': ['Drop files on the Upload documents button or in the selection area.','Suelta los archivos en el botón Enviar documentos o en el área de selección.','Déposez les fichiers sur le bouton Envoyer des documents ou dans la zone de sélection.'],
  'Cadastros inativos permanecem vinculados aos colaboradores existentes.': ['Inactive records remain linked to their existing employees.','Los registros inactivos permanecen vinculados a los empleados existentes.','Les dossiers inactifs restent associés aux employés existants.'],
  'Os documentos podem ser consultados na ficha do colaborador.': ['Documents can be viewed in the employee profile.','Los documentos pueden consultarse en la ficha del empleado.','Les documents peuvent être consultés dans le dossier de l’employé.'],
  'Etapas do cadastro': ['Registration steps','Etapas del registro','Étapes de l’inscription'],
  'CPF inválido. Corrija ou deixe o campo vazio.': ['Invalid CPF. Correct it or leave the field blank.','CPF no válido. Corrígelo o deja el campo vacío.','CPF invalide. Corrigez-le ou laissez le champ vide.'],
  'Informe o nome completo do dependente.': ['Enter the dependent’s full name.','Introduce el nombre completo del dependiente.','Saisissez le nom complet de la personne à charge.'],
  'CPF do dependente inválido. Corrija ou deixe vazio.': ['The dependent’s CPF is invalid. Correct it or leave it blank.','El CPF del dependiente no es válido. Corrígelo o déjalo vacío.','Le CPF de la personne à charge est invalide. Corrigez-le ou laissez-le vide.'],
  'Confira a data de nascimento do dependente.': ['Check the dependent’s date of birth.','Comprueba la fecha de nacimiento del dependiente.','Vérifiez la date de naissance de la personne à charge.'],
  'Nenhum dependente adicionado.': ['No dependents added.','No se añadieron dependientes.','Aucune personne à charge ajoutée.'],
  'Selecione os arquivos.': ['Select the files.','Selecciona los archivos.','Sélectionnez les fichiers.'],
  'Escolha o tipo de documento.': ['Choose the document type.','Elige el tipo de documento.','Choisissez le type de document.'],
  'Nome do arquivo:': ['File name:','Nombre del archivo:','Nom du fichier :'],
  'Conferi os destinos e nomes dos anexos.': ['I checked the destinations and attachment names.','He comprobado los destinos y nombres de los archivos adjuntos.','J’ai vérifié les destinations et les noms des pièces jointes.'],
  'Selecione uma foto JPG, PNG ou WebP de até 3 MB.': ['Select a JPG, PNG or WebP photo up to 3 MB.','Selecciona una foto JPG, PNG o WebP de hasta 3 MB.','Sélectionnez une photo JPG, PNG ou WebP de 3 Mo maximum.'],
  'Prévia da foto do colaborador': ['Employee photo preview','Vista previa de la foto del empleado','Aperçu de la photo de l’employé'],
  'Já existe vínculo ativo ou afastado para este CPF.': ['An active or leave-status employment relationship already exists for this CPF.','Ya existe una relación laboral activa o en situación de baja temporal para este CPF.','Une relation de travail active ou en congé existe déjà pour ce CPF.'],
  'Este CPF tem vínculo encerrado. Confira a admissão e confirme um novo vínculo; o histórico e os documentos anteriores serão preservados.': ['This CPF has a closed employment relationship. Review the hiring details and confirm a new relationship; previous history and documents will be preserved.','Este CPF tiene una relación laboral finalizada. Revisa la contratación y confirma una nueva relación; se conservarán el historial y los documentos anteriores.','Ce CPF possède une relation de travail clôturée. Vérifiez l’embauche et confirmez une nouvelle relation ; l’historique et les documents précédents seront conservés.'],
  'Confirmo uma nova contratação, com pasta e histórico separados.': ['I confirm a new hiring, with a separate folder and history.','Confirmo una nueva contratación, con carpeta e historial separados.','Je confirme une nouvelle embauche, avec un dossier et un historique distincts.'],
  'Há anexos com o mesmo nome final. Use um nome alternativo.': ['Some attachments have the same final name. Use an alternative name.','Hay archivos adjuntos con el mismo nombre final. Usa un nombre alternativo.','Plusieurs pièces jointes ont le même nom final. Utilisez un autre nom.'],
  'Confira e confirme os nomes dos anexos antes de salvar.': ['Review and confirm attachment names before saving.','Revisa y confirma los nombres de los archivos adjuntos antes de guardar.','Vérifiez et confirmez les noms des pièces jointes avant l’enregistrement.'],
  'Salvando cadastro e preparando as pastas…': ['Saving the record and preparing folders…','Guardando el registro y preparando las carpetas…','Enregistrement du dossier et préparation des dossiers…'],
  'Colaborador salvo. Pastas e documentos prontos.': ['Employee saved. Folders and documents are ready.','Empleado guardado. Carpetas y documentos listos.','Employé enregistré. Les dossiers et documents sont prêts.'],
  'Cadastro salvo. Atualize a tela para conferir.': ['Record saved. Refresh the page to review it.','Registro guardado. Actualiza la pantalla para revisarlo.','Dossier enregistré. Actualisez l’écran pour le vérifier.'],
  'O cadastro foi salvo, mas a tela não pôde ser atualizada.': ['The record was saved, but the page could not be refreshed.','El registro se guardó, pero no se pudo actualizar la pantalla.','Le dossier a été enregistré, mais l’écran n’a pas pu être actualisé.'],
  'O cadastro já foi salvo.': ['The record has already been saved.','El registro ya se ha guardado.','Le dossier a déjà été enregistré.'],
  'Clique em Salvar cadastro para continuar os envios pendentes.': ['Click Save record to continue the pending uploads.','Haz clic en Guardar registro para continuar con los envíos pendientes.','Cliquez sur Enregistrer le dossier pour poursuivre les envois en attente.'],
  'Os arquivos já enviados serão preservados.': ['Files already uploaded will be preserved.','Se conservarán los archivos que ya se han enviado.','Les fichiers déjà envoyés seront conservés.'],
  'Nome da pasta': ['Folder name','Nombre de la carpeta','Nom du dossier'],
  'Criar pasta': ['Create folder','Crear carpeta','Créer un dossier'],
  'Tipo do documento': ['Document type','Tipo de documento','Type de document'],
  'MANTER NOME ORIGINAL': ['KEEP ORIGINAL NAME','MANTENER NOMBRE ORIGINAL','CONSERVER LE NOM D’ORIGINE'],
  'Data do documento (opcional)': ['Document date (optional)','Fecha del documento (opcional)','Date du document (facultatif)'],
  'Tipo do ASO': ['Occupational health certificate type','Tipo de certificado de salud ocupacional','Type de certificat de santé au travail'],
  'Data do ASO': ['Occupational health certificate date','Fecha del certificado de salud ocupacional','Date du certificat de santé au travail'],
  'Data do documento': ['Document date','Fecha del documento','Date du document'],
  'Mês / ano de referência': ['Reference month / year','Mes / año de referencia','Mois / année de référence'],
  'Nome alternativo (se houver conflito; preserve a extensão)': ['Alternative name (if there is a conflict; keep the file extension)','Nombre alternativo (si hay conflicto; conserva la extensión)','Nom alternatif (en cas de conflit ; conservez l’extension)'],
  'Conferi o destino e os nomes dos arquivos.': ['I checked the destination and file names.','He comprobado el destino y los nombres de los archivos.','J’ai vérifié la destination et les noms des fichiers.'],
  'Escolha uma categoria para enviar os documentos.': ['Choose a category to upload the documents.','Elige una categoría para enviar los documentos.','Choisissez une catégorie pour envoyer les documents.'],
  'Documentos *': ['Documents *','Documentos *','Documents *'],
  'Selecionar documentos': ['Select documents','Seleccionar documentos','Sélectionner des documents'],
  'Confira e confirme os nomes antes do envio.': ['Review and confirm the names before uploading.','Revisa y confirma los nombres antes del envío.','Vérifiez et confirmez les noms avant l’envoi.'],
  'Dois arquivos geram o mesmo nome. Preencha nomes alternativos antes de enviar.': ['Two files produce the same name. Enter alternative names before uploading.','Dos archivos generan el mismo nombre. Introduce nombres alternativos antes de enviarlos.','Deux fichiers produisent le même nom. Saisissez des noms différents avant l’envoi.'],
  'Confirmar e enviar': ['Confirm and upload','Confirmar y enviar','Confirmer et envoyer'],
  'Fechar menu': ['Close menu','Cerrar menú','Fermer le menu'],
  'Abrir menu': ['Open menu','Abrir menú','Ouvrir le menu'],

  // Contract management, reports and external websites.
  'Carregando gestão empresarial…': ['Loading business management…','Cargando gestión empresarial…','Chargement de la gestion d’entreprise…'],
  'Datas e situações confirmadas pelo operador. Documentos serão armazenados no VeloX.': ['Dates and statuses are confirmed by the operator. Documents will be stored in VeloX.','Fechas y estados confirmados por el operador. Los documentos se almacenarán en VeloX.','Dates et statuts confirmés par l’opérateur. Les documents seront stockés dans VeloX.'],
  'Descrição, contrato ou competência': ['Description, contract or reference period','Descripción, contrato o período','Description, contrat ou période de référence'],
  'Confira a ordem das datas do período.': ['Check the order of the dates in the period.','Comprueba el orden de las fechas del período.','Vérifiez l’ordre des dates de la période.'],
  'Contrato / contratante': ['Contract / contracting party','Contrato / contratante','Contrat / donneur d’ordre'],
  'Descrição / categoria': ['Description / category','Descripción / categoría','Description / catégorie'],
  'Vigência final': ['End of term','Fin de vigencia','Fin de validité'],
  'Objeto não informado': ['Subject not provided','Objeto no informado','Objet non renseigné'],
  'Nenhum registro': ['No records','Ningún registro','Aucun dossier'],
  'Cadastre informações confirmadas ou ajuste os filtros. Nenhum dado é criado automaticamente.': ['Enter confirmed information or adjust the filters. No data is created automatically.','Registra información confirmada o ajusta los filtros. No se crea ningún dato automáticamente.','Saisissez des informations confirmées ou ajustez les filtres. Aucune donnée n’est créée automatiquement.'],
  'Número do contrato': ['Contract number','Número de contrato','Numéro du contrat'],
  'Data inicial confirmada': ['Confirmed start date','Fecha inicial confirmada','Date de début confirmée'],
  'Data final confirmada': ['Confirmed end date','Fecha final confirmada','Date de fin confirmée'],
  'Conferir renovação / prorrogação em': ['Review renewal / extension on','Revisar renovación / prórroga el','Vérifier le renouvellement / la prolongation le'],
  'Avisar com antecedência (dias)': ['Notify in advance (days)','Avisar con antelación (días)','Prévenir à l’avance (jours)'],
  'Área / tipo': ['Area / type','Área / tipo','Domaine / type'],
  'Não presumimos datas legais, valores ou prorrogações. Receber um documento não confirma o pagamento. Anexe documentos depois de salvar o registro.': ['We do not assume legal dates, amounts or extensions. Receiving a document does not confirm payment. Attach documents after saving the record.','No presumimos fechas legales, importes ni prórrogas. Recibir un documento no confirma el pago. Adjunta los documentos después de guardar el registro.','Nous ne présumons ni dates légales, ni montants, ni prolongations. La réception d’un document ne confirme pas le paiement. Joignez les documents après l’enregistrement.'],
  'Fim da vigência': ['End of term','Fin de vigencia','Fin de validité'],
  'Conferir renovação': ['Review renewal','Revisar renovación','Vérifier le renouvellement'],
  'Controle independente de documentos, recebimento e pagamento': ['Independent tracking of documents, receipt and payment','Control independiente de documentos, recepción y pago','Suivi indépendant des documents, de la réception et du paiement'],
  'Registrar resolução': ['Record resolution','Registrar resolución','Enregistrer la résolution'],
  'Nova competência': ['New reference period','Nuevo período','Nouvelle période de référence'],
  'Sem observações.': ['No notes.','Sin observaciones.','Aucune observation.'],
  'Documentos vinculados': ['Linked documents','Documentos vinculados','Documents associés'],
  'Enviado em': ['Uploaded on','Enviado el','Envoyé le'],
  'Novo documento': ['New document','Nuevo documento','Nouveau document'],
  'Nenhum documento vinculado.': ['No linked documents.','No hay documentos vinculados.','Aucun document associé.'],
  'Obrigações vinculadas': ['Linked obligations','Obligaciones vinculadas','Obligations associées'],
  'Adicionar obrigação': ['Add obligation','Añadir obligación','Ajouter une obligation'],
  'Sem competência': ['No reference period','Sin período','Aucune période de référence'],
  'Histórico de acompanhamento': ['Tracking history','Historial de seguimiento','Historique de suivi'],
  'O que foi efetivamente resolvido?': ['What was actually resolved?','¿Qué se resolvió realmente?','Qu’est-ce qui a été effectivement résolu ?'],
  'Conferi documentos, recebimento e pagamento aplicáveis.': ['I checked the applicable documents, receipt and payment.','He comprobado los documentos, la recepción y el pago aplicables.','J’ai vérifié les documents, la réception et le paiement concernés.'],
  'Recebimento e pagamento devem estar conferidos no cadastro. Nenhum deles é alterado automaticamente.': ['Receipt and payment must be verified in the record. Neither is changed automatically.','La recepción y el pago deben verificarse en el registro. Ninguno se modifica automáticamente.','La réception et le paiement doivent être vérifiés dans le dossier. Aucun des deux n’est modifié automatiquement.'],
  'Confirmar resolução': ['Confirm resolution','Confirmar resolución','Confirmer la résolution'],
  'Comprovante de pagamento': ['Payment receipt','Comprobante de pago','Justificatif de paiement'],
  'Termo de Referência': ['Terms of Reference','Términos de Referencia','Cahier des charges'],
  'Até 500 KB por arquivo. Os novos documentos serão organizados na pasta principal do VeloX. Arquivos históricos não serão movidos.': ['Up to 500 KB per file. New documents will be organized in the main VeloX folder. Historical files will not be moved.','Hasta 500 KB por archivo. Los documentos nuevos se organizarán en la carpeta principal de VeloX. Los archivos históricos no se moverán.','Jusqu’à 500 Ko par fichier. Les nouveaux documents seront classés dans le dossier principal de VeloX. Les fichiers historiques ne seront pas déplacés.'],
  'Selecione ao menos um arquivo.': ['Select at least one file.','Selecciona al menos un archivo.','Sélectionnez au moins un fichier.'],
  'Carregando compromissos…': ['Loading commitments…','Cargando compromisos…','Chargement des échéances…'],
  'Central de controle': ['Control center','Centro de control','Centre de contrôle'],
  'Confira as datas do período.': ['Check the dates in the period.','Comprueba las fechas del período.','Vérifiez les dates de la période.'],
  'Nenhum compromisso no período selecionado.': ['No commitments in the selected period.','No hay compromisos en el período seleccionado.','Aucun engagement sur la période sélectionnée.'],
  'Documentação mensal': ['Monthly documentation','Documentación mensual','Documentation mensuelle'],
  // External websites.
  'Abrir site': ['Open website','Abrir sitio','Ouvrir le site'],
  'Editar site': ['Edit website','Editar sitio','Modifier le site'],
  'Excluir site': ['Delete website','Eliminar sitio','Supprimer le site'],
  'Nenhum site cadastrado.': ['No websites registered.','No hay sitios registrados.','Aucun site enregistré.'],
  'Editar site externo': ['Edit external website','Editar sitio externo','Modifier le site externe'],
  'Novo site externo': ['New external website','Nuevo sitio externo','Nouveau site externe'],
  'Nome personalizado (opcional)': ['Custom name (optional)','Nombre personalizado (opcional)','Nom personnalisé (facultatif)'],
  'Logo personalizada (opcional)': ['Custom logo (optional)','Logotipo personalizado (opcional)','Logo personnalisé (facultatif)'],
  'Use logo PNG, JPG ou WebP de até 256 KB.': ['Use a PNG, JPG or WebP logo up to 256 KB.','Usa un logotipo PNG, JPG o WebP de hasta 256 KB.','Utilisez un logo PNG, JPG ou WebP de 256 Ko maximum.'],
  'Nenhum arquivo escolhido': ['No file chosen','Ningún archivo seleccionado','Aucun fichier choisi'],
  'Logo: PNG, JPG ou WebP de até 256 KB.': ['Logo: PNG, JPG or WebP up to 256 KB.','Logotipo: PNG, JPG o WebP de hasta 256 KB.','Logo : PNG, JPG ou WebP de 256 Ko maximum.'],
  'Confirmar exclusão': ['Confirm deletion','Confirmar eliminación','Confirmer la suppression'],
  'Excluir definitivamente': ['Delete permanently','Eliminar definitivamente','Supprimer définitivement'],

  // Backend validation and operational errors shown to users.
  'Texto inválido ou muito longo.': ['Invalid or excessively long text.','Texto no válido o demasiado largo.','Texte invalide ou trop long.'],
  'Opção inválida.': ['Invalid option.','Opción no válida.','Option invalide.'],
  'Informe um nome de pasta sem barras.': ['Enter a folder name without slashes.','Introduce un nombre de carpeta sin barras.','Saisissez un nom de dossier sans barre oblique.'],
  'Dados do cadastro inválidos.': ['Invalid record data.','Los datos del registro no son válidos.','Données du dossier invalides.'],
  'Operação não reconhecida.': ['Unrecognized operation.','Operación no reconocida.','Opération non reconnue.'],
  'Colaborador não encontrado.': ['Employee not found.','Empleado no encontrado.','Employé introuvable.'],
  'Escolha um centro de custo cadastrado.': ['Choose a registered cost center.','Elige un centro de costo registrado.','Choisissez un centre de coûts enregistré.'],
  'Atualize a página e tente novamente.': ['Refresh the page and try again.','Actualiza la página e inténtalo de nuevo.','Actualisez la page et réessayez.'],
  'Arquivo acima de 20 MB.': ['File exceeds 20 MB.','El archivo supera los 20 MB.','Le fichier dépasse 20 Mo.'],
  'Os dados foram alterados após uma tentativa de salvar. Confira e tente novamente.': ['The data changed after a save attempt. Review it and try again.','Los datos cambiaron después de intentar guardar. Revísalos e inténtalo de nuevo.','Les données ont changé après une tentative d’enregistrement. Vérifiez-les et réessayez.'],
  'Site não encontrado.': ['Website not found.','Sitio no encontrado.','Site introuvable.'],
  'Este site foi atualizado. Reabra antes de editar.': ['This website was updated. Reopen it before editing.','Este sitio se actualizó. Vuelve a abrirlo antes de editar.','Ce site a été mis à jour. Rouvrez-le avant de le modifier.'],
  'Esse endereço já está cadastrado. Edite o site existente.': ['This address is already registered. Edit the existing website.','Esta dirección ya está registrada. Edita el sitio existente.','Cette adresse est déjà enregistrée. Modifiez le site existant.'],
  'Não foi possível atribuir a posição do site.': ['Could not assign the website position.','No se pudo asignar la posición del sitio.','Impossible d’attribuer la position du site.'],
  'Confirme a exclusão do site.': ['Confirm website deletion.','Confirma la eliminación del sitio.','Confirmez la suppression du site.'],
  'Este site foi atualizado. Reabra antes de excluir.': ['This website was updated. Reopen it before deleting.','Este sitio se actualizó. Vuelve a abrirlo antes de eliminarlo.','Ce site a été mis à jour. Rouvrez-le avant de le supprimer.'],
  'Cadastro auxiliar não reconhecido.': ['Unrecognized auxiliary record.','Registro auxiliar no reconocido.','Dossier auxiliaire non reconnu.'],
  'Cadastro não encontrado.': ['Record not found.','Registro no encontrado.','Dossier introuvable.'],
  'Esse cadastro foi atualizado. Reabra antes de editar.': ['This record was updated. Reopen it before editing.','Este registro se actualizó. Vuelve a abrirlo antes de editar.','Ce dossier a été mis à jour. Rouvrez-le avant de le modifier.'],
  'Informe o nome.': ['Enter the name.','Introduce el nombre.','Saisissez le nom.'],
  'Esse nome ou código já está cadastrado. Edite o cadastro existente.': ['This name or code is already registered. Edit the existing record.','Este nombre o código ya está registrado. Edita el registro existente.','Ce nom ou code est déjà enregistré. Modifiez le dossier existant.'],
  'Confirme o desligamento do colaborador.': ['Confirm the employee’s termination.','Confirma la baja del empleado.','Confirmez le départ de l’employé.'],
  'Esse cadastro foi atualizado. Reabra antes de desligar.': ['This record was updated. Reopen it before terminating the relationship.','Este registro se actualizó. Vuelve a abrirlo antes de tramitar la baja.','Ce dossier a été mis à jour. Rouvrez-le avant de mettre fin à la relation de travail.'],
  'Esse colaborador já está desligado.': ['This employee has already left.','Este empleado ya está desvinculado.','Cet employé a déjà quitté l’entreprise.'],
  'Confira a situação atual antes de desligar.': ['Check the current status before terminating the relationship.','Comprueba la situación actual antes de tramitar la baja.','Vérifiez la situation actuelle avant de mettre fin à la relation de travail.'],
  'Informe a data de desligamento.': ['Enter the termination date.','Introduce la fecha de baja.','Saisissez la date de départ.'],
  'O desligamento não pode estar no futuro.': ['The termination date cannot be in the future.','La fecha de baja no puede ser futura.','La date de départ ne peut pas être dans le futur.'],
  'O desligamento deve ocorrer a partir da admissão.': ['The termination date must be on or after the hiring date.','La baja debe ser en la fecha de contratación o después.','La date de départ doit être égale ou postérieure à la date d’embauche.'],
  'Esse cadastro foi atualizado. Reabra a ficha antes de editar.': ['This record was updated. Reopen the profile before editing.','Este registro se actualizó. Vuelve a abrir la ficha antes de editar.','Ce dossier a été mis à jour. Rouvrez le profil avant de le modifier.'],
  'Informe o nome completo do colaborador.': ['Enter the employee’s full name.','Introduce el nombre completo del empleado.','Saisissez le nom complet de l’employé.'],
  'Escolha a situação do colaborador.': ['Choose the employee’s status.','Elige la situación del empleado.','Choisissez le statut de l’employé.'],
  'Use a ação Desligar para encerrar o vínculo com confirmação.': ['Use the Terminate action to end the employment relationship with confirmation.','Usa la acción Dar de baja para finalizar la relación laboral con confirmación.','Utilisez l’action Mettre fin au contrat pour clôturer la relation de travail après confirmation.'],
  'Reativação exige um fluxo específico; preserve a situação do cadastro.': ['Reactivation requires a dedicated workflow; preserve the record status.','La reactivación requiere un proceso específico; conserva la situación del registro.','La réactivation nécessite un processus spécifique ; préservez le statut du dossier.'],
  'Confira o e-mail do colaborador.': ['Check the employee’s email address.','Comprueba el correo electrónico del empleado.','Vérifiez l’adresse e-mail de l’employé.'],
  'expedição do RG': ['ID issue date','fecha de expedición del documento de identidad','date de délivrance de la pièce d’identité'],
  'validade da CNH': ['driver’s license expiration date','fecha de vencimiento del permiso de conducir','date d’expiration du permis de conduire'],
  'emissão da CTPS': ['employment record issue date','fecha de emisión de la libreta de trabajo','date de délivrance du livret de travail'],
  'Confira o CEP.': ['Check the postal code.','Comprueba el código postal.','Vérifiez le code postal.'],
  'fim da experiência': ['probation end date','fecha de finalización del período de prueba','date de fin de la période d’essai'],
  'conferência da experiência': ['probation review','revisión del período de prueba','vérification de la période d’essai'],
  'Confira os dias de experiência e prorrogação.': ['Check the probation and extension periods in days.','Comprueba los días del período de prueba y de la prórroga.','Vérifiez le nombre de jours de la période d’essai et de sa prolongation.'],
  'O fim da experiência não pode anteceder a admissão.': ['The probation end date cannot be before the hiring date.','La fecha de fin del período de prueba no puede ser anterior a la contratación.','La fin de la période d’essai ne peut pas précéder l’embauche.'],
  'Confira o salário bruto. Use apenas o valor numérico.': ['Check the gross salary. Enter numbers only.','Comprueba el salario bruto. Introduce solo el valor numérico.','Vérifiez le salaire brut. Saisissez uniquement une valeur numérique.'],
  'Confira a lista de dependentes.': ['Check the list of dependents.','Comprueba la lista de dependientes.','Vérifiez la liste des personnes à charge.'],
  'Há dependentes repetidos na lista.': ['There are duplicate dependents in the list.','Hay dependientes duplicados en la lista.','La liste contient des personnes à charge en double.'],
  'Já existe vínculo ativo ou afastado para este CPF. Abra o cadastro existente.': ['An active or leave-status employment relationship already exists for this CPF. Open the existing record.','Ya existe una relación laboral activa o de baja temporal para este CPF. Abre el registro existente.','Une relation de travail active ou en congé existe déjà pour ce CPF. Ouvrez le dossier existant.'],
  'O vínculo anterior está sem data de desligamento válida. Confira o histórico antes de recontratar.': ['The previous employment relationship has no valid termination date. Review the history before rehiring.','La relación laboral anterior no tiene una fecha de baja válida. Revisa el historial antes de volver a contratar.','La relation de travail précédente ne comporte pas de date de départ valide. Vérifiez l’historique avant une nouvelle embauche.'],
  'Informe admissão posterior ao último desligamento.': ['Enter a hiring date after the most recent termination.','Introduce una fecha de contratación posterior a la última baja.','Saisissez une date d’embauche postérieure au dernier départ.'],
  'Confirme a abertura de um novo vínculo, preservando o histórico anterior.': ['Confirm the creation of a new employment relationship while preserving the previous history.','Confirma la apertura de una nueva relación laboral, conservando el historial anterior.','Confirmez l’ouverture d’une nouvelle relation de travail en préservant l’historique précédent.'],
  'Informe a admissão para conferir os períodos desse CPF.': ['Enter the hiring date to check the periods associated with this CPF.','Introduce la fecha de contratación para comprobar los períodos de este CPF.','Saisissez la date d’embauche pour vérifier les périodes associées à ce CPF.'],
  'Informe o desligamento para conferir o histórico.': ['Enter the termination date to review the history.','Introduce la fecha de baja para comprobar el historial.','Saisissez la date de départ pour vérifier l’historique.'],
  'Os períodos desse CPF se sobrepõem ou têm datas incompletas. Confira o histórico.': ['The periods for this CPF overlap or contain incomplete dates. Review the history.','Los períodos de este CPF se solapan o tienen fechas incompletas. Revisa el historial.','Les périodes associées à ce CPF se chevauchent ou comportent des dates incomplètes. Vérifiez l’historique.'],
  'Esse colaborador já está cadastrado. Localize o cadastro para editar.': ['This employee is already registered. Find the existing record to edit it.','Este empleado ya está registrado. Localiza el registro existente para editarlo.','Cet employé est déjà enregistré. Retrouvez le dossier existant pour le modifier.'],
  'Abra uma categoria para enviar documentos. A raiz não recebe arquivos soltos.': ['Open a category to upload documents. The root folder does not accept loose files.','Abre una categoría para enviar documentos. La carpeta raíz no admite archivos sueltos.','Ouvrez une catégorie pour envoyer des documents. Le dossier racine n’accepte pas les fichiers isolés.'],
  'Confira e confirme a prévia dos nomes antes do envio.': ['Review and confirm the filename preview before uploading.','Revisa y confirma la vista previa de los nombres antes del envío.','Vérifiez et confirmez l’aperçu des noms avant l’envoi.'],
  'Nome de arquivo inválido.': ['Invalid file name.','Nombre de archivo no válido.','Nom de fichier invalide.'],
  'Selecione de 1 a 100 arquivos distintos da pasta atual.': ['Select 1 to 100 distinct files from the current folder.','Selecciona de 1 a 100 archivos distintos de la carpeta actual.','Sélectionnez de 1 à 100 fichiers distincts du dossier actuel.'],
  'Documentos dos colaboradores': ['Employee documents','Documentos de los empleados','Documents des employés'],
  'Falha ao salvar os dados:': ['Failed to save data:','Error al guardar los datos:','Échec de l’enregistrement des données :'],
  'Não foi possível salvar os dados. Libere espaço no navegador e tente novamente.': ['Could not save the data. Free up browser storage and try again.','No se pudieron guardar los datos. Libera espacio en el navegador e inténtalo de nuevo.','Impossible d’enregistrer les données. Libérez de l’espace dans le navigateur et réessayez.'],
  'Esta pasta não pertence ao colaborador.': ['This folder does not belong to the employee.','Esta carpeta no pertenece al empleado.','Ce dossier n’appartient pas à l’employé.'],
  'Pasta pai indisponível.': ['Parent folder unavailable.','Carpeta principal no disponible.','Dossier parent indisponible.'],
  'O arquivo excede o limite permitido de 500 KB.': ['The file exceeds the 500 KB limit.','El archivo supera el límite permitido de 500 KB.','Le fichier dépasse la limite autorisée de 500 Ko.'],
  'Já existe documento com esse nome nesta pasta.': ['A document with this name already exists in this folder.','Ya existe un documento con ese nombre en esta carpeta.','Un document portant ce nom existe déjà dans ce dossier.'],
  'Não foi possível preparar o download. Tente novamente.': ['Could not prepare the download. Try again.','No se pudo preparar la descarga. Inténtalo de nuevo.','Impossible de préparer le téléchargement. Réessayez.'],
  'Não foi possível enviar o logotipo. Tente novamente.': ['Could not upload the logo. Try again.','No se pudo subir el logotipo. Inténtalo de nuevo.','Impossible d’envoyer le logo. Réessayez.'],
  'Não foi possível vincular o documento. Tente novamente.': ['Could not link the document. Try again.','No se pudo vincular el documento. Inténtalo de nuevo.','Impossible de lier le document. Réessayez.'],
  'Não foi possível enviar os documentos. Tente novamente.': ['Could not upload the documents. Try again.','No se pudieron enviar los documentos. Inténtalo de nuevo.','Impossible d’envoyer les documents. Réessayez.'],
  'Não foi possível preparar a exportação em PDF. Tente novamente.': ['Could not prepare the PDF export. Try again.','No se pudo preparar la exportación en PDF. Inténtalo de nuevo.','Impossible de préparer l’exportation PDF. Réessayez.'],
  'Não foi possível concluir esta operação. Tente novamente.': ['Could not complete this operation. Try again.','No se pudo completar esta operación. Inténtalo de nuevo.','Impossible de terminer cette opération. Réessayez.'],
  'Informe uma data válida do documento.': ['Enter a valid document date.','Introduce una fecha válida del documento.','Saisissez une date de document valide.'],
  'Nome completo do colaborador não disponível.': ['Employee full name unavailable.','El nombre completo del empleado no está disponible.','Nom complet de l’employé indisponible.'],
  'Escolha o tipo do documento de admissão.': ['Choose the hiring document type.','Elige el tipo de documento de contratación.','Choisissez le type de document d’embauche.'],
  'Escolha o tipo do ASO.': ['Choose the occupational health certificate type.','Elige el tipo de certificado de salud ocupacional.','Choisissez le type de certificat de santé au travail.'],
  'Informe mês e ano de referência.': ['Enter the reference month and year.','Introduce el mes y año de referencia.','Saisissez le mois et l’année de référence.'],
  'Nome final muito longo. Escolha um nome alternativo preservando a extensão.': ['The final name is too long. Choose an alternative name while preserving the extension.','El nombre final es demasiado largo. Elige un nombre alternativo que conserve la extensión.','Le nom final est trop long. Choisissez un autre nom en conservant l’extension.'],
  'Informe uma data válida.': ['Enter a valid date.','Introduce una fecha válida.','Saisissez une date valide.'],
  'Informe o valor em reais, sem separador de milhar.': ['Enter the amount in Brazilian reais without a thousands separator.','Introduce el importe en reales brasileños sin separador de miles.','Saisissez le montant en réaux brésiliens sans séparateur de milliers.'],
  'Informe categoria e descrição.': ['Enter a category and description.','Introduce una categoría y una descripción.','Saisissez une catégorie et une description.'],
  'Confira recebimento, pagamento e periodicidade.': ['Check receipt, payment and frequency.','Comprueba la recepción, el pago y la periodicidad.','Vérifiez la réception, le paiement et la périodicité.'],
  'O vencimento não pode anteceder a emissão.': ['The due date cannot be earlier than the issue date.','La fecha de vencimiento no puede ser anterior a la emisión.','La date d’échéance ne peut pas précéder la date d’émission.'],
  'Informe contratante e número do contrato.': ['Enter the contracting party and contract number.','Introduce el contratante y el número de contrato.','Saisissez le donneur d’ordre et le numéro du contrat.'],
  'A data final deve ser posterior à inicial.': ['The end date must be after the start date.','La fecha final debe ser posterior a la inicial.','La date de fin doit être postérieure à la date de début.'],
  'Confira situação e antecedência.': ['Check the status and advance notice period.','Comprueba la situación y la antelación.','Vérifiez le statut et le délai de préavis.'],
  'Registro não encontrado.': ['Record not found.','Registro no encontrado.','Dossier introuvable.'],
  'Tipo de registro inválido.': ['Invalid record type.','Tipo de registro no válido.','Type de dossier invalide.'],
  'O registro foi atualizado. Reabra antes de salvar.': ['The record was updated. Reopen it before saving.','El registro se actualizó. Vuelve a abrirlo antes de guardar.','Le dossier a été mis à jour. Rouvrez-le avant de l’enregistrer.'],
  'Esse contrato já está cadastrado.': ['This contract is already registered.','Este contrato ya está registrado.','Ce contrat est déjà enregistré.'],
  'A obrigação já foi concluída. Preserve as confirmações de recebimento e pagamento.': ['This obligation has already been completed. Keep the receipt and payment confirmations.','La obligación ya se ha completado. Conserva las confirmaciones de recepción y pago.','Cette obligation est déjà terminée. Conservez les confirmations de réception et de paiement.'],
  'Dados conferidos e salvos pelo operador.': ['Data reviewed and saved by the operator.','Datos revisados y guardados por el operador.','Données vérifiées et enregistrées par l’opérateur.'],
  'Dados conferidos sem alteração de campos.': ['Data reviewed; no fields were changed.','Datos revisados sin cambios en los campos.','Données vérifiées sans modification des champs.'],
  'Confirme a resolução da pendência.': ['Confirm that the issue has been resolved.','Confirma la resolución de la incidencia.','Confirmez la résolution du problème.'],
  'O registro foi atualizado.': ['The record was updated.','El registro se actualizó.','Le dossier a été mis à jour.'],
  'Confira separadamente o recebimento e o pagamento antes de concluir.': ['Check receipt and payment separately before completing.','Comprueba por separado la recepción y el pago antes de finalizar.','Vérifiez séparément la réception et le paiement avant de terminer.'],
  'Registre o que foi efetivamente resolvido.': ['Record what was actually resolved.','Registra lo que se resolvió realmente.','Enregistrez ce qui a été effectivement résolu.'],
  'Informe antecedências de 0 a 365 dias.': ['Enter advance notice periods from 0 to 365 days.','Introduce antelaciones de 0 a 365 días.','Saisissez un délai de préavis compris entre 0 et 365 jours.'],
  'Tipo inválido.': ['Invalid type.','Tipo no válido.','Type invalide.'],
  'Referência de documento': ['Document reference','Referencia del documento','Référence du document'],
  'Envio de documento': ['Document upload','Envío de documento','Envoi de document'],
  'Operação de gestão não reconhecida.': ['Unrecognized management operation.','Operación de gestión no reconocida.','Opération de gestion non reconnue.'],
  'Informe uma URL HTTPS válida, sem espaços ou credenciais.': ['Enter a valid HTTPS URL without spaces or credentials.','Introduce una URL HTTPS válida, sin espacios ni credenciales.','Saisissez une URL HTTPS valide, sans espaces ni identifiants.'],
  'Use um endereço HTTPS completo.': ['Use a complete HTTPS address.','Usa una dirección HTTPS completa.','Utilisez une adresse HTTPS complète.'],
  'Use um domínio público válido, sem usuário, senha ou porta especial.': ['Use a valid public domain without a username, password or non-standard port.','Usa un dominio público válido, sin usuario, contraseña ni puerto especial.','Utilisez un domaine public valide, sans nom d’utilisateur, mot de passe ni port spécial.'],
  'Não salve senhas, tokens ou credenciais no endereço.': ['Do not include passwords, tokens or credentials in the address.','No guardes contraseñas, tokens ni credenciales en la dirección.','N’enregistrez pas de mots de passe, jetons ou identifiants dans l’adresse.'],
  'Informe uma situação válida.': ['Enter a valid status.','Introduce una situación válida.','Saisissez un statut valide.'],
  'Nome: até 100 caracteres. Descrição: até 240.': ['Name: up to 100 characters. Description: up to 240.','Nombre: hasta 100 caracteres. Descripción: hasta 240.','Nom : 100 caractères maximum. Description : 240 maximum.'],
  'Escolha uma categoria válida.': ['Choose a valid category.','Elige una categoría válida.','Choisissez une catégorie valide.'],
  'Ambiente de uso real ainda não configurado. Não insira dados.': ['The production environment is not configured yet. Do not enter data.','El entorno de producción aún no está configurado. No introduzcas datos.','L’environnement de production n’est pas encore configuré. Ne saisissez aucune donnée.'],
  'Acesso indisponível: falta ativar o servidor seguro.': ['Access unavailable: the secure server must be enabled.','Acceso no disponible: es necesario activar el servidor seguro.','Accès indisponible : le serveur sécurisé doit être activé.'],
  'Informe o e-mail e a senha do proprietário.': ['Enter the owner’s email and password.','Introduce el correo electrónico y la contraseña del propietario.','Saisissez l’adresse e-mail et le mot de passe du propriétaire.'],
  'Validando acesso seguro…': ['Verifying secure access…','Validando el acceso seguro…','Vérification de l’accès sécurisé…'],
  'Não foi possível autenticar. Confira as credenciais.': ['Authentication failed. Check the credentials.','No se pudo autenticar. Comprueba las credenciales.','Échec de l’authentification. Vérifiez les identifiants.'],
  'Não foi possível entrar.': ['Could not sign in.','No se pudo iniciar sesión.','Impossible de se connecter.'],
  'VeloX não configurado para uso real. Não cadastre dados nesta versão.': ['VeloX is not configured for production use. Do not enter data in this version.','VeloX no está configurado para uso real. No registres datos en esta versión.','VeloX n’est pas configuré pour une utilisation réelle. Ne saisissez pas de données dans cette version.'],
  'Sessão encerrada. Faça login novamente.': ['Session ended. Sign in again.','La sesión ha finalizado. Inicia sesión de nuevo.','Session terminée. Connectez-vous à nouveau.'],
  'O servidor não respondeu corretamente.': ['The server did not respond correctly.','El servidor no respondió correctamente.','Le serveur n’a pas répondu correctement.'],
  'Até 5 MB por arquivo': ['Up to 5 MB per file','Hasta 5 MB por archivo','Jusqu’à 5 Mo par fichier'],
  // Document labels and management categories shown in selectors.
  'ACORDO DE COMPENSAÇÃO DE HORAS TRABALHADAS': ['WORKING HOURS COMPENSATION AGREEMENT','ACUERDO DE COMPENSACIÓN DE HORAS TRABAJADAS','ACCORD DE COMPENSATION DES HEURES DE TRAVAIL'],
  'CONTRATO DE EXPERIÊNCIA': ['PROBATIONARY EMPLOYMENT CONTRACT','CONTRATO DE PERÍODO DE PRUEBA','CONTRAT DE PÉRIODE D’ESSAI'],
  'FICHA DE REGISTRO': ['EMPLOYEE REGISTRATION FORM','FICHA DE REGISTRO','FICHE D’ENREGISTREMENT'],
  'Retorno ao Trabalho': ['Return to Work','Reincorporación al trabajo','Reprise du travail'],
  'Mudança de Riscos Ocupacionais': ['Occupational Risk Change','Cambio de riesgos laborales','Modification des risques professionnels'],
  'Comprovante de Residência -': ['Proof of Residence -','Comprobante de domicilio -','Justificatif de domicile -'],
  'Ficha de EPI -': ['PPE Record -','Registro de EPP -','Fiche EPI -'],
  'Comprovante de Pagamento Salarial': ['Salary Payment Receipt','Comprobante de pago salarial','Justificatif de paiement du salaire'],
  'Contribuição Assistencial': ['Union Assistance Contribution','Contribución asistencial','Contribution d’assistance syndicale'],
  'Extratos Mensais': ['Monthly Statements','Extractos mensuales','Relevés mensuels'],
  'Recibos de Pró-labore': ['Management Compensation Receipts','Recibos de remuneración de socios','Reçus de rémunération des dirigeants'],
  'Recibos de Pagamentos': ['Payment Receipts','Recibos de pagos','Reçus de paiement'],
  'Empréstimo Consignado': ['Payroll-Deducted Loan','Préstamo con descuento de nómina','Prêt avec retenue sur salaire'],
  'Benefício Amparo Familiar': ['Family Support Benefit','Beneficio de apoyo familiar','Prestation de soutien familial'],
  'Guia': ['Payment slip','Comprobante','Formulaire de paiement'],
  'Demonstrativo': ['Statement','Comprobante detallado','Relevé'],
  'Declaração': ['Declaration','Declaración','Déclaration'],
  'Recibo': ['Receipt','Recibo','Reçu'],
  'Contrato': ['Contract','Contrato','Contrat'],
  'Aditivo': ['Amendment','Adenda','Avenant'],
  'Complementar': ['Supplementary','Complementario','Complémentaire'],
  'Retificação': ['Correction','Rectificación','Rectification'],
  'Todos os registros': ['All records','Todos los registros','Tous les dossiers'],
  'Filtros:': ['Filters:','Filtros:','Filtres :'],
  'USO INTERNO': ['INTERNAL USE','USO INTERNO','USAGE INTERNE'],
  'USO INTERNO — contém dados pessoais': ['INTERNAL USE — contains personal data','USO INTERNO — contiene datos personales','USAGE INTERNE — contient des données personnelles'],
  'Relação de Colaboradores': ['Employee Roster','Relación de empleados','Liste des employés'],
  'Gerado em': ['Generated on','Generado el','Généré le'],
  'VeloX Service · Gestão · Uso interno': ['VeloX Service · Management · Internal use','VeloX Service · Gestión · Uso interno','VeloX Service · Gestion · Usage interne'],
  'Página': ['Page','Página','Page'],
  'O PDF contém um caractere não suportado pela fonte. Exporte em Excel (.xlsx) para preservar o texto integral.': ['The PDF contains a character that the font does not support. Export to Excel (.xlsx) to preserve the full text.','El PDF contiene un carácter no compatible con la fuente. Exporta a Excel (.xlsx) para conservar el texto completo.','Le PDF contient un caractère non pris en charge par la police. Exportez vers Excel (.xlsx) pour préserver l’intégralité du texte.'],
  'VeloX — Relação de Colaboradores': ['VeloX — Employee Roster','VeloX — Relación de empleados','VeloX — Liste des employés'],

  // Additional labels, navigation, accessibility and localized empty states.
  'Consultar documentos de colaboradores': ['View employee documents','Consultar documentos de empleados','Consulter les documents des employés'],
  'Abrindo a visão geral…': ['Opening the overview…','Abriendo la vista general…','Ouverture de la vue d’ensemble…'],
  'Abrindo colaboradores…': ['Opening employees…','Abriendo empleados…','Ouverture des employés…'],
  'Abrindo relatórios…': ['Opening reports…','Abriendo informes…','Ouverture des rapports…'],
  'Todos os colaboradores': ['All employees','Todos los empleados','Tous les employés'],
  'Editar cadastro': ['Edit record','Editar registro','Modifier le dossier'],
  'Editar colaborador': ['Edit employee','Editar empleado','Modifier l’employé'],
  'Situação do colaborador': ['Employee status','Situación del empleado','Statut de l’employé'],
  'Salvando…': ['Saving…','Guardando…','Enregistrement…'],
  'Mover para cima': ['Move up','Mover hacia arriba','Déplacer vers le haut'],
  'Mover para baixo': ['Move down','Mover hacia abajo','Déplacer vers le bas'],
  'Abrir registro': ['Open record','Abrir registro','Ouvrir le dossier'],
  'Editar registro': ['Edit record','Editar registro','Modifier le dossier'],
  'Vínculo': ['Employment relationship','Relación laboral','Relation de travail'],
  'Competência': ['Reference period','Período','Période de référence'],
  'Renovação': ['Renewal','Renovación','Renouvellement'],
  'Descrição': ['Description','Descripción','Description'],
  'Obrigação': ['Obligation','Obligación','Obligation'],
  'obrigação': ['obligation','obligación','obligation'],
  'Antecedência': ['Advance notice','Antelación','Délai de préavis'],
  'Área': ['Area','Área','Domaine'],
  'Emissão': ['Issue','Emisión','Émission'],
  'Fim de vigência': ['End of term','Fin de vigencia','Fin de validité'],
  'Experiência': ['Probation','Período de prueba','Période d’essai'],
  'Conferir experiência': ['Review probation','Revisar período de prueba','Vérifier la période d’essai'],
  'Atualização': ['Update','Actualización','Mise à jour'],
  'Conclusão': ['Completion','Finalización','Achèvement'],
  'Periódico': ['Periodic','Periódico','Périodique'],
  'Benefícios': ['Benefits','Beneficios','Avantages'],
  'Comunicação': ['Communications','Comunicación','Communication'],
  'Destino de acesso indisponível.': ['Access destination unavailable.','Destino de acceso no disponible.','Destination d’accès indisponible.'],
  'Não foi possível abrir o acesso. Recarregue a página e tente novamente.': ['Could not open the access page. Reload and try again.','No se pudo abrir el acceso. Recarga la página e inténtalo de nuevo.','Impossible d’ouvrir l’accès. Rechargez la page et réessayez.'],
  'seuemail@exemplo.com': ['youremail@example.com','tucorreo@ejemplo.com','votreemail@exemple.com'],
  'Equipe VeloX em ambiente de trabalho': ['VeloX team at work','Equipo VeloX en el entorno de trabajo','Équipe VeloX au travail'],
  'Idioma:': ['Language:','Idioma:','Langue :'],
  'Não foi possível conectar ao VeloX. Recarregue a página e tente novamente.': ['Could not connect to VeloX. Reload the page and try again.','No se pudo conectar con VeloX. Recarga la página e inténtalo de nuevo.','Impossible de se connecter à VeloX. Rechargez la page et réessayez.'],
  'VeloX Service · Gestão · Uso interno': ['VeloX Service · Management · Internal use','VeloX Service · Gestión · Uso interno','VeloX Service · Gestion · Usage interne'],
  'Sistema de Gestão': ['Management System','Sistema de gestión','Système de gestion'],
  'SISTEMA DE GESTÃO': ['MANAGEMENT SYSTEM','SISTEMA DE GESTIÓN','SYSTÈME DE GESTION'],
  'VeloX Service · Sistema de Gestão': ['VeloX Service · Management System','VeloX Service · Sistema de gestión','VeloX Service · Système de gestion'],
  'Excluir site externo': ['Delete external website','Eliminar sitio externo','Supprimer le site externe'],
  'Idioma: Português': ['Language: Portuguese','Idioma: portugués','Langue : portugais'],
  'Abrir documento': ['Open document','Abrir documento','Ouvrir le document'],
  'Baixar documento': ['Download document','Descargar documento','Télécharger le document'],
  'Idioma da interface': ['Interface language','Idioma de la interfaz','Langue de l’interface'],
  'Página': ['Page','Página','Page'],
  'Hoje': ['Today','Hoy','Aujourd’hui'],
  'Não informado': ['Not provided','No informado','Non renseigné'],
  'não informado': ['not provided','no informado','non renseigné'],
  'Proprietário': ['Owner','Propietario','Propriétaire'],
  'Abrir': ['Open','Abrir','Ouvrir'],
  'Fechar': ['Close','Cerrar','Fermer'],
  'Editar': ['Edit','Editar','Modifier'],
  'Salvar': ['Save','Guardar','Enregistrer'],
  'Cancelar': ['Cancel','Cancelar','Annuler'],
  'Excluir': ['Delete','Eliminar','Supprimer'],
  'Enviar': ['Upload','Enviar','Envoyer'],
  'Selecionar': ['Select','Seleccionar','Sélectionner'],
};
const DOMAIN_TRANSLATIONS = {
 'Cadastro e Identificação':['Registration and Identity','Registro e Identificación','Inscription et identité'],
 'Admissão e Vínculo Trabalhista':['Hiring and Employment','Contratación y Relación Laboral','Embauche et relation de travail'],
 'Saúde e Segurança do Trabalho':['Occupational Health and Safety','Salud y Seguridad en el Trabajo','Santé et sécurité au travail'],
 'Jornada e Frequência':['Working Hours and Attendance','Jornada y Asistencia','Temps de travail et présence'],
 'Remuneração e Direitos':['Compensation and Entitlements','Remuneración y Derechos','Rémunération et droits'],
 'Desligamento e Rescisão':['Termination and Separation','Baja y Liquidación','Départ et rupture du contrat'],
 'Documentos de Identificação':['Identity Documents','Documentos de Identificación','Documents d’identité'],
 'Comprovantes de Residência':['Proof of Residence','Comprobantes de Domicilio','Justificatifs de domicile'],
 'Carteira de Trabalho (CTPS)':['Employment Record Book (CTPS)','Libreta de Trabajo (CTPS)','Livret de travail (CTPS)'],
 'Admissão e Contrato de Trabalho':['Hiring and Employment Contract','Contratación y Contrato de Trabajo','Embauche et contrat de travail'],
 'Saúde Ocupacional (ASO e Exames)':['Occupational Health (ASO and Examinations)','Salud Ocupacional (ASO y Exámenes)','Santé au travail (ASO et examens)'],
 'Registros de Vacinação':['Vaccination Records','Registros de Vacunación','Registres de vaccination'],
 'Dependentes':['Dependents','Personas a Cargo','Personnes à charge'],
 'Equipamentos de Proteção Individual (EPI)':['Personal Protective Equipment (PPE)','Equipos de Protección Individual (EPI)','Équipements de protection individuelle (EPI)'],
 'Jornada e Frequência':['Working Hours and Attendance','Jornada y Asistencia','Temps de travail et présence'],
 'Demonstrativos de Pagamento (Holerites)':['Pay Statements (Payslips)','Comprobantes de Pago (Nóminas)','Bulletins de paie'],
 'Comprovantes de Pagamento Salarial':['Salary Payment Receipts','Comprobantes de Pago Salarial','Justificatifs de paiement du salaire'],
 'Férias':['Vacation','Vacaciones','Congés'],
 '13º Salário':['13th Salary Payment','Pago del 13.º Salario','13e mois'],
 'Desligamento e Rescisão Contratual':['Termination and Contract Settlement','Baja y Liquidación Contractual','Départ et solde de tout compte'],
 'Admissional':['Pre-employment','Preocupacional','À l’embauche'],
 'Demissional':['Termination','De egreso','De départ'],
 'Outro':['Other','Otro','Autre'],
 'REQUERIMENTO VT':['TRANSPORT BENEFIT REQUEST','SOLICITUD DE VALE DE TRANSPORTE','DEMANDE DE TITRE DE TRANSPORT'],
 'TERMO LGPD':['LGPD CONSENT FORM','FORMULARIO DE CONSENTIMIENTO LGPD','FORMULAIRE DE CONSENTEMENT LGPD'],
 'Institucional':['Institutional','Institucional','Institutionnel'],
 'Governo/Fiscal':['Government / Tax','Gobierno / Fiscal','Gouvernement / Fiscalité'],
 'Documentação':['Documentation','Documentación','Documentation'],
 'Operação':['Operations','Operación','Opérations'],
 'FGTS':['FGTS','FGTS','FGTS'],
 'DARF':['DARF','DARF','DARF'],
 'DCTFWeb':['DCTFWeb','DCTFWeb','DCTFWeb'],
 'Em conferência':['Under review','En revisión','En vérification'],
 'Vigente':['Active','Vigente','En vigueur'],
 'Encerrado':['Closed','Finalizado','Clôturé'],
 'Suspenso':['Suspended','Suspendido','Suspendu'],
 'Em renovação':['Renewal in progress','En renovación','En cours de renouvellement'],
 'Concluído':['Completed','Completado','Terminé'],
 'Não se aplica':['Not applicable','No aplica','Sans objet'],
 'Vencido':['Overdue','Vencido','En retard'],
 'Próximo do vencimento':['Due soon','Próximo al vencimiento','Bientôt à échéance'],
 'Pendente':['Pending','Pendiente','En attente'],
 'Parcial':['Partial','Parcial','Partiel'],
 'Recebido':['Received','Recibido','Reçu'],
 'Pago':['Paid','Pagado','Payé'],
 'Mensal':['Monthly','Mensual','Mensuel'],
 'Trimestral':['Quarterly','Trimestral','Trimestriel'],
 'Semestral':['Semiannual','Semestral','Semestriel'],
 'Anual':['Annual','Anual','Annuel'],
 'Única':['One-time','Única','Unique'],
 'Outra':['Other','Otra','Autre']
};
for (const [source, targets] of Object.entries(DOMAIN_TRANSLATIONS)) {
 if (!map[source]) map[source] = targets;
}

const FINAL_UI_TRANSLATIONS = {
 'Não':['No','No','Non'],
 'Salário':['Salary','Salario','Salaire'],
 'MÊS':['MONTH','MES','MOIS'],
 'centro de custo':['cost center','centro de costo','centre de coûts'],
 'Sugestões de país':['Country suggestions','Sugerencias de países','Suggestions de pays'],
 'Sugestões de nacionalidade':['Nationality suggestions','Sugerencias de nacionalidad','Suggestions de nationalité'],
 'CEP não encontrado. Confira os números ou preencha o endereço manualmente.':['Postal code not found. Check the digits or enter the address manually.','No se encontró el código postal. Comprueba los números o completa la dirección manualmente.','Code postal introuvable. Vérifiez les chiffres ou saisissez l’adresse manuellement.'],
 'Digite os oito números do CEP.':['Enter the eight digits of the postal code.','Introduce los ocho dígitos del código postal.','Saisissez les huit chiffres du code postal.'],
 'Não foi possível consultar o CEP. Você pode preencher o endereço manualmente.':['The postal code could not be checked. You can enter the address manually.','No se pudo consultar el código postal. Puedes completar la dirección manualmente.','Impossible de vérifier le code postal. Vous pouvez saisir l’adresse manuellement.'],
 'A consulta retornou outro CEP. Preencha o endereço manualmente.':['The lookup returned a different postal code. Enter the address manually.','La consulta devolvió otro código postal. Completa la dirección manualmente.','La recherche a renvoyé un autre code postal. Saisissez l’adresse manuellement.'],
 ': selecione um arquivo com conteúdo e até 20 MB.':[': select a non-empty file up to 20 MB. ',': selecciona un archivo con contenido de hasta 20 MB.',': sélectionnez un fichier non vide de 20 Mo maximum.'],
 'Atualizar dependente':['Update dependent','Actualizar dependiente','Mettre à jour la personne à charge'],
 'Obrigações (dias)':['Obligations (days)','Obligaciones (días)','Obligations (jours)'],
 'Experiência (dias)':['Probation (days)','Período de prueba (días)','Période d’essai (jours)'],
 'naturalização':['naturalization','naturalización','naturalisation'],
 'admissão':['hiring','contratación','embauche'],
 'Informe o nome completo do dependente':['Enter the dependent’s full name','Introduce el nombre completo del dependiente','Saisissez le nom complet de la personne à charge'],
 'CPF do dependente':['Dependent’s CPF','CPF del dependiente','CPF de la personne à charge'],
 'nascimento do dependente':['dependent’s date of birth','fecha de nacimiento del dependiente','date de naissance de la personne à charge'],
 'O nome alternativo deve preservar a extensão':['The alternative name must preserve the extension','El nombre alternativo debe conservar la extensión','Le nom alternatif doit conserver l’extension'],
 'contrato:':['contract:','contrato:','contrat :'],
 'Conferir experiência —':['Review probation —','Revisar período de prueba —','Vérifier la période d’essai —'],
 'Arraste os documentos aqui':['Drop documents here','Arrastra los documentos aquí','Déposez les documents ici'],
 'Selecionar todos':['Select all','Seleccionar todo','Tout sélectionner'],
 'SELEÇÃO':['SELECTION','SELECCIÓN','SÉLECTION'],
 'DOCUMENTO':['DOCUMENT','DOCUMENTO','DOCUMENT'],
 'TAMANHO':['SIZE','TAMAÑO','TAILLE'],
 'ATUALIZADO':['UPDATED','ACTUALIZADO','MIS À JOUR'],
 'AÇÕES':['ACTIONS','ACCIONES','ACTIONS'],
 'Nenhum colaborador nestes filtros':['No employees match these filters','Ningún empleado coincide con estos filtros','Aucun employé ne correspond à ces filtres'],
 'Ajuste os filtros ou cadastre seu primeiro colaborador.':['Adjust the filters or register your first employee.','Ajusta los filtros o registra tu primer empleado.','Modifiez les filtres ou enregistrez votre premier employé.'],
 'Nenhuma movimentação registrada no período':['No activity recorded for this period','No hay movimientos registrados en este período','Aucun mouvement enregistré sur cette période'],
 'Selecione outro período ou informe as datas na ficha do colaborador.':['Select another period or enter the dates in the employee profile.','Selecciona otro período o introduce las fechas en la ficha del empleado.','Sélectionnez une autre période ou saisissez les dates dans le dossier de l’employé.'],
 'A lista usa o mês escolhido e considera apenas colaboradores ativos ou afastados.':['The list uses the selected month and includes only active employees or employees on leave.','La lista utiliza el mes seleccionado y solo incluye empleados activos o de baja temporal.','La liste utilise le mois sélectionné et ne comprend que les employés actifs ou en congé.'],
 'colaborador ativo ou afastado':['active employee or employee on leave','empleado activo o de baja temporal','employé actif ou en congé'],
 'colaboradores ativos ou afastados':['active employees or employees on leave','empleados activos o de baja temporal','employés actifs ou en congé']
};
for (const [source, targets] of Object.entries(FINAL_UI_TRANSLATIONS)) {
 if (!map[source]) map[source] = targets;
}

for (const [source, targets] of Object.entries(ADDITIONAL_UI_TRANSLATIONS)) {
 if (!map[source]) map[source] = targets;
}


// Complements finais: opções de RH/DP, mensagens operacionais e componentes de gestão.
const COMPLETION_UI_TRANSLATIONS = {
 'Central de alertas':['Alert Center','Centro de alertas','Centre d’alertes'],
 'Fechar formulário':['Close form','Cerrar formulario','Fermer le formulaire'],
 'Admissões':['Hirings','Altas','Embauches'],
 'ADMISSÕES':['HIRINGS','ALTAS','EMBAUCHES'],
 'DESLIGAMENTOS':['TERMINATIONS','BAJAS','DÉPARTS'],
 'Ações':['Actions','Acciones','Actions'],
 'AÇÕES':['ACTIONS','ACCIONES','ACTIONS'],
 'Centro de custo:':['Cost center:','Centro de costos:','Centre de coûts :'],
 'Situação:':['Status:','Situación:','Statut :'],
 'Abrir cadastro existente':['Open existing record','Abrir registro existente','Ouvrir un dossier existant'],
 'Criar dentro de:':['Create inside:','Crear dentro de:','Créer dans :'],
 'Informações sobre o arquivo':['File information','Información del archivo','Informations sur le fichier'],
 'Recebimento documental':['Document receipt','Recepción documental','Réception des documents'],
 'Abrindo registro…':['Opening record…','Abriendo registro…','Ouverture du dossier…'],
 'Acompanhamento contratual e documental':['Contract and document tracking','Seguimiento contractual y documental','Suivi contractuel et documentaire'],
 'Urgência':['Urgency','Urgencia','Urgence'],
 'Pesquisa no resultado:':['Search within results:','Búsqueda en los resultados:','Recherche dans les résultats :'],
 'PNG, JPG ou WebP · até 256 KB. Sem logo, será exibido um ícone neutro.':['PNG, JPG or WebP · up to 256 KB. A neutral icon appears when no logo is provided.','PNG, JPG o WebP · hasta 256 KB. Si no hay logotipo, se mostrará un icono neutro.','PNG, JPG ou WebP · jusqu’à 256 Ko. Une icône neutre sera affichée en l’absence de logo.'],
 'Os originais existentes não serão substituídos.':['Existing originals will not be replaced.','Los originales existentes no serán reemplazados.','Les originaux existants ne seront pas remplacés.'],
 'Você está encerrando o vínculo de':['You are ending the employment relationship of','Estás finalizando la relación laboral de','Vous mettez fin au contrat de travail de'],
 '. O cadastro ficará em Desligados. A pasta, os documentos e o histórico serão preservados.':['. The record will move to Former employees. The folder, documents, and history will be preserved.','. El registro pasará a Bajas. Se conservarán la carpeta, los documentos y el historial.','. Le dossier passera dans les employés sortis. Le dossier, les documents et l’historique seront conservés.'],
 'Confirmo o desligamento de':['I confirm the termination of','Confirmo la baja de','Je confirme le départ de'],
 'Deseja excluir permanentemente':['Do you want to permanently delete','¿Quieres eliminar permanentemente','Voulez-vous supprimer définitivement'],
 '? Este acesso será removido da lista.':['? This access will be removed from the list.','? Este acceso se eliminará de la lista.','? Cet accès sera supprimé de la liste.'],
 'Confirmar exclusão':['Confirm deletion','Confirmar eliminación','Confirmer la suppression'],
 'Logo personalizada (opcional)':['Custom logo (optional)','Logotipo personalizado (opcional)','Logo personnalisé (facultatif)'],
 'Nome personalizado (opcional)':['Custom name (optional)','Nombre personalizado (opcional)','Nom personnalisé (facultatif)'],
 'Nenhum arquivo escolhido':['No file selected','Ningún archivo seleccionado','Aucun fichier sélectionné'],
 'Logo cadastrada':['Logo registered','Logotipo registrado','Logo enregistré'],
 'Escolher arquivo':['Choose file','Elegir archivo','Choisir un fichier'],
 'Excluir definitivamente':['Delete permanently','Eliminar definitivamente','Supprimer définitivement'],
 'Descrição / categoria':['Description / category','Descripción / categoría','Description / catégorie'],
 'Contrato / contratante':['Contract / contracting party','Contrato / contratante','Contrat / donneur d’ordre'],
 'Vigência final':['End date','Vigencia final','Date de fin'],
 'Renovação':['Renewal','Renovación','Renouvellement'],
 'Tipo':['Type','Tipo','Type'],
 'Origem':['Source','Origen','Origine'],
 'Enviado em':['Uploaded on','Enviado el','Envoyé le'],
 'Documento':['Document','Documento','Document'],
 'Obrigações vinculadas':['Linked obligations','Obligaciones vinculadas','Obligations associées'],
 'Histórico de acompanhamento':['Tracking history','Historial de seguimiento','Historique de suivi'],
 'Registrar resolução':['Record resolution','Registrar resolución','Enregistrer la résolution'],
 'Nova competência':['New period','Nuevo período','Nouvelle période'],
 'O que foi efetivamente resolvido?':['What was actually resolved?','¿Qué se resolvió realmente?','Qu’est-ce qui a été effectivement résolu ?'],
 'Conferi documentos, recebimento e pagamento aplicáveis.':['I checked the applicable documents, receipt, and payment.','He comprobado los documentos, la recepción y el pago correspondientes.','J’ai vérifié les documents, la réception et le paiement applicables.'],
 'Confirmar resolução':['Confirm resolution','Confirmar resolución','Confirmer la résolution'],
 'Até 500 KB por arquivo. Os novos documentos serão organizados na pasta principal do VeloX. Arquivos históricos não serão movidos.':['Up to 500 KB per file. New documents will be organized in the VeloX main folder. Historical files will not be moved.','Hasta 500 KB por archivo. Los documentos nuevos se organizarán en la carpeta principal de VeloX. Los archivos históricos no se moverán.','Jusqu’à 500 Ko par fichier. Les nouveaux documents seront classés dans le dossier principal de VeloX. Les fichiers historiques ne seront pas déplacés.'],
 'A antecedência contratual é configurada em cada contrato. Nenhuma decisão é executada automaticamente.':['The contract notice period is configured in each contract. No decision is carried out automatically.','El plazo de aviso contractual se configura en cada contrato. No se ejecuta ninguna decisión automáticamente.','Le délai de préavis contractuel est défini dans chaque contrat. Aucune décision n’est exécutée automatiquement.'],
 'Configurar avisos':['Configure alerts','Configurar avisos','Configurer les alertes'],
 'Obrigações vencidas':['Overdue obligations','Obligaciones vencidas','Obligations échues'],
 'Próximos 7 dias':['Next 7 days','Próximos 7 días','7 prochains jours'],
 'Próximos 30 dias':['Next 30 days','Próximos 30 días','30 prochains jours'],
 'Pendências resolvidas':['Resolved items','Pendientes resueltos','Éléments résolus'],
 'Contratos próximos do fim':['Contracts nearing end date','Contratos próximos a finalizar','Contrats arrivant à échéance'],
 'Experiência a conferir':['Probation period to review','Período de prueba por revisar','Période d’essai à vérifier'],
 'Alertas por urgência':['Urgency alerts','Alertas por urgencia','Alertes par urgence'],
 'Agenda completa':['Full agenda','Agenda completa','Agenda complète'],
 'Prazos informados nos registros. Nenhum vencimento legal, pagamento ou prorrogação é presumido. Os indicadores de colaboradores continuam abaixo.':['Deadlines are based on recorded entries. No legal due date, payment, or extension is assumed. Employee indicators remain below.','Los plazos se basan en los registros. No se presupone ningún vencimiento legal, pago ni prórroga. Los indicadores de empleados continúan abajo.','Les échéances proviennent des dossiers. Aucune échéance légale, aucun paiement ni aucune prolongation ne sont présumés. Les indicateurs des employés figurent ci-dessous.'],
 'Compromisso':['Commitment','Compromiso','Engagement'],
 'Abrir registro':['Open record','Abrir registro','Ouvrir le dossier'],
 'Nenhum compromisso no período selecionado.':['No commitments in the selected period.','No hay compromisos en el período seleccionado.','Aucun engagement sur la période sélectionnée.'],
 'Carregando compromissos…':['Loading commitments…','Cargando compromisos…','Chargement des engagements…'],
 'Confira as datas do período.':['Check the dates in the selected period.','Comprueba las fechas del período.','Vérifiez les dates de la période.'],
 'JPG, PNG ou WebP · até 3 MB':['JPG, PNG or WebP · up to 3 MB','JPG, PNG o WebP · hasta 3 MB','JPG, PNG ou WebP · jusqu’à 3 Mo'],
 'Até 20 MB por arquivo.':['Up to 20 MB per file.','Hasta 20 MB por archivo.','Jusqu’à 20 Mo par fichier.'],
 'Sem equipe':['No team','Sin equipo','Aucune équipe'],
 'Sem cargo':['No position','Sin cargo','Aucun poste'],
 'Hoje':['Today','Hoy','Aujourd’hui'],
 'Amanhã':['Tomorrow','Mañana','Demain'],
 'Ontem':['Yesterday','Ayer','Hier'],
 'Sim':['Yes','Sí','Oui'],
 'Feminino':['Female','Femenino','Féminin'],
 'Masculino':['Male','Masculino','Masculin'],
 'Não binário':['Non-binary','No binario','Non binaire'],
 'Outro':['Other','Otro','Autre'],
 'Prefiro não informar':['Prefer not to say','Prefiero no decirlo','Préfère ne pas répondre'],
 'Solteiro(a)':['Single','Soltero/a','Célibataire'],
 'Casado(a)':['Married','Casado/a','Marié(e)'],
 'Divorciado(a)':['Divorced','Divorciado/a','Divorcé(e)'],
 'Viúvo(a)':['Widowed','Viudo/a','Veuf/veuve'],
 'União estável':['Domestic partnership','Unión de hecho','Union civile / concubinage'],
 'Separado(a)':['Separated','Separado/a','Séparé(e)'],
 'Branca':['White','Blanca','Blanche'],
 'Preta':['Black','Negra','Noire'],
 'Parda':['Mixed race','Mestiza','Métisse'],
 'Amarela':['Yellow (Asian descent)','Amarilla (origen asiático)','Jaune (origine asiatique)'],
 'Indígena':['Indigenous','Indígena','Autochtone'],
 'Não informada':['Not provided','No informada','Non renseignée'],
 'Não alfabetizado(a)':['Not literate','No alfabetizado/a','Non alphabétisé(e)'],
 'Fundamental incompleto':['Incomplete elementary education','Educación primaria incompleta','Enseignement primaire incomplet'],
 'Fundamental completo':['Completed elementary education','Educación primaria completa','Enseignement primaire terminé'],
 'Médio incompleto':['Incomplete secondary education','Educación secundaria incompleta','Enseignement secondaire incomplet'],
 'Médio completo':['Completed secondary education','Educación secundaria completa','Enseignement secondaire terminé'],
 'Superior incompleto':['Some higher education','Educación superior incompleta','Études supérieures inachevées'],
 'Superior completo':['Completed higher education','Educación superior completa','Études supérieures terminées'],
 'Pós-graduação':['Postgraduate education','Estudios de posgrado','Études de troisième cycle'],
 'Filho(a)':['Child','Hijo/a','Enfant'],
 'Cônjuge':['Spouse','Cónyuge','Conjoint(e)'],
 'Companheiro(a)':['Partner','Pareja','Partenaire'],
 'Enteado(a)':['Stepchild','Hijastro/a','Beau-fils / belle-fille'],
 'Pai / mãe':['Parent','Padre / madre','Père / mère'],
 'Conta corrente':['Checking account','Cuenta corriente','Compte courant'],
 'Conta poupança':['Savings account','Cuenta de ahorro','Compte d’épargne'],
 'Conta salário':['Payroll account','Cuenta de nómina','Compte de paie'],
 'Conta de pagamento':['Payment account','Cuenta de pago','Compte de paiement'],
 'Ativo':['Active','Activo','Actif'],
 'Afastado':['On leave','De baja temporal','En congé'],
 'Desligado':['Terminated','Desvinculado','Sorti de l’entreprise'],
 'Inativo':['Inactive','Inactivo','Inactif'],
 'Em conferência':['Under review','En revisión','En cours de vérification'],
 'Vigente':['Active','Vigente','En vigueur'],
 'Em renovação':['Renewal in progress','En renovación','En renouvellement'],
 'Suspenso':['Suspended','Suspendido','Suspendu'],
 'Encerrado':['Closed','Cerrado','Clôturé'],
 'Pendente':['Pending','Pendiente','En attente'],
 'Parcial':['Partial','Parcial','Partiel'],
 'Recebido':['Received','Recibido','Reçu'],
 'Pago':['Paid','Pagado','Payé'],
 'Não se aplica':['Not applicable','No aplica','Sans objet'],
 'Concluído':['Completed','Completado','Terminé'],
 'Próximo do vencimento':['Due soon','Próximo al vencimiento','Bientôt à échéance'],
 'Vencido':['Overdue','Vencido','Échu'],
 'Única':['One-time','Única','Unique'],
 'Mensal':['Monthly','Mensual','Mensuel'],
 'Trimestral':['Quarterly','Trimestral','Trimestriel'],
 'Semestral':['Semiannual','Semestral','Semestriel'],
 'Anual':['Annual','Anual','Annuel'],
 'Outra':['Other','Otra','Autre'],
 'Guia':['Payment slip','Guía','Bordereau'],
 'Demonstrativo':['Statement','Comprobante','Relevé'],
 'Declaração':['Declaration','Declaración','Déclaration'],
 'Recibo':['Receipt','Recibo','Reçu'],
 'Comprovante de pagamento':['Proof of payment','Comprobante de pago','Justificatif de paiement'],
 'Termo de Referência':['Terms of Reference','Pliego de referencia','Cahier des charges'],
 'Aditivo':['Amendment','Adenda','Avenant'],
 'Complementar':['Supplementary','Complementario','Complémentaire'],
 'Retificação':['Correction','Rectificación','Rectification'],
 'Institucional':['Institutional','Institucional','Institutionnel'],
 'Governo/Fiscal':['Government / Tax','Gobierno / Fiscal','Administration / Fiscalité'],
 'Benefícios':['Benefits','Beneficios','Avantages'],
 'Comunicação':['Communication','Comunicación','Communication'],
 'Outros':['Other','Otros','Autres'],
 'VeloX V10 — Tela de Login Premium':['VeloX V10 — Premium Login Screen','VeloX V10 — Pantalla de inicio de sesión prémium','VeloX V10 — Écran de connexion premium'],
 'Relação de Colaboradores':['Employee Report','Relación de empleados','Liste des employés'],
 'Filtros:':['Filters:','Filtros:','Filtres :'],
 'Todos os registros':['All records','Todos los registros','Tous les dossiers'],
 'registros':['records','registros','dossiers'],
 'USO INTERNO':['INTERNAL USE','USO INTERNO','USAGE INTERNE'],
 'contém dados pessoais':['contains personal data','contiene datos personales','contient des données personnelles'],
 'Página':['Page','Página','Page'],
 'Relação de Colaboradores — Uso interno':['Employee Report — Internal use','Relación de empleados — Uso interno','Liste des employés — Usage interne'],
 'Colaboradores':['Employees','Empleados','Employés'],
 'Data':['Date','Fecha','Date'],
 'Período':['Period','Período','Période'],
 'Filtros aplicados':['Applied filters','Filtros aplicados','Filtres appliqués'],
 'Vínculos cadastrados':['Registered employment relationships','Relaciones laborales registradas','Relations de travail enregistrées'],
 'Pessoas identificadas':['Identified people','Personas identificadas','Personnes identifiées'],
 'Todos os resultados incluídos na exportação.':['All results are included in the export.','Todos los resultados están incluidos en la exportación.','Tous les résultats sont inclus dans l’exportation.'],
 'Gerado em':['Generated on','Generado el','Généré le'],
 'VeloX Service · Gestão · Uso interno':['VeloX Service · Management · Internal use','VeloX Service · Gestión · Uso interno','VeloX Service · Gestion · Usage interne'],
 'Nenhum aniversariante em novembro':['No birthdays in November','No hay cumpleaños en noviembre','Aucun anniversaire en novembre'],
 'Página anterior':['Previous page','Página anterior','Page précédente'],
 'Próxima página':['Next page','Página siguiente','Page suivante'],
 'Primeira página':['First page','Primera página','Première page'],
 'Última página':['Last page','Última página','Dernière page'],
 'Selecionar todos':['Select all','Seleccionar todo','Tout sélectionner'],
 'Selecionar arquivos':['Select files','Seleccionar archivos','Sélectionner des fichiers'],
 'Adicionar foto':['Add photo','Añadir foto','Ajouter une photo'],
 'Data de emissão da CTPS':['Work card issue date','Fecha de expedición de la tarjeta laboral','Date de délivrance du livret de travail'],
 'Tipo de conta':['Account type','Tipo de cuenta','Type de compte'],
 'Pessoa com deficiência (PCD)':['Person with disability (PwD)','Persona con discapacidad (PcD)','Personne en situation de handicap'],
 'Casado(a) com brasileiro(a)':['Married to a Brazilian citizen','Casado/a con una persona brasileña','Marié(e) à un(e) Brésilien(ne)'],
 'Filho(a) brasileiro(a)':['Brazilian child','Hijo/a brasileño/a','Enfant brésilien'],
 'Dependente para imposto de renda':['Dependent for income tax purposes','Dependiente para el impuesto sobre la renta','Personne à charge pour l’impôt sur le revenu'],
 'Dependente para salário família':['Dependent for family allowance','Dependiente para el subsidio familiar','Personne à charge pour l’allocation familiale'],
 'Conta proprietária':['Owner account','Cuenta propietaria','Compte propriétaire'],
 'Conta do proprietário':['Owner account','Cuenta del propietario','Compte du propriétaire'],
 'Nenhum resultado encontrado':['No results found','No se encontraron resultados','Aucun résultat trouvé'],
 'Últimos 6 meses':['Last 6 months','Últimos 6 meses','6 derniers mois'],
 'Próximos 6 meses':['Next 6 months','Próximos 6 meses','6 prochains mois'],
 'MÊS':['MONTH','MES','MOIS'],
 'ANO':['YEAR','AÑO','ANNÉE'],
 'Jan':['Jan','Ene','Janv.'],
 'Fev':['Feb','Feb','Févr.'],
 'Mar':['Mar','Mar','Mars'],
 'Abr':['Apr','Abr','Avr.'],
 'Mai':['May','May','Mai'],
 'Jun':['Jun','Jun','Juin'],
 'Jul':['Jul','Jul','Juil.'],
 'Ago':['Aug','Ago','Août'],
 'Set':['Sep','Sep','Sept.'],
 'Out':['Oct','Oct','Oct.'],
 'Nov':['Nov','Nov','Nov.'],
 'Dez':['Dec','Dic','Déc.'],
 'Não informado':['Not provided','No informado','Non renseigné'],
 'Brasileiro':['Brazilian','Brasileño','Brésilien'],
 'Brasileira':['Brazilian','Brasileña','Brésilienne'],
 'Transferência':['Transfer','Traslado','Transfert'],
 'Afastamento':['Leave of absence','Ausencia','Congé'],
 'Cadastro':['Registration','Registro','Enregistrement'],
 'Atualização':['Update','Actualización','Mise à jour'],
 'Conclusão':['Completion','Finalización','Achèvement'],
 'Acervo existente':['Existing archive','Archivo existente','Fonds existant'],
 'Novo documento':['New document','Nuevo documento','Nouveau document'],
 'Sem observações.':['No notes.','Sin observaciones.','Aucune observation.'],
 'Objeto não informado':['Object not provided','Objeto no informado','Objet non renseigné'],
 'Nenhum registro':['No records','Ningún registro','Aucun dossier'],
 'Nenhum documento vinculado.':['No linked documents.','No hay documentos vinculados.','Aucun document associé.'],
 'Hoje!':['Today!','¡Hoy!','Aujourd’hui !'],
 'Concluída em':['Completed on','Completada el','Terminée le'],
 'Acesso externo':['External access','Acceso externo','Accès externe'],
 'Novo site externo':['New external site','Nuevo sitio externo','Nouveau site externe'],
 'Editar site externo':['Edit external site','Editar sitio externo','Modifier le site externe'],
 'Excluir site externo':['Delete external site','Eliminar sitio externo','Supprimer le site externe'],
 'Nenhum site cadastrado.':['No sites registered.','No hay sitios registrados.','Aucun site enregistré.'],
 'Todos os cadastros':['All records','Todos los registros','Tous les dossiers'],
 'Ativos':['Active','Activos','Actifs'],
 'Inativos':['Inactive','Inactivos','Inactifs'],
 'Disponíveis para os colaboradores':['Available to employees','Disponibles para los empleados','Disponibles pour les employés'],
 'Nenhum resultado encontrado':['No results found','No se encontraron resultados','Aucun résultat trouvé'],
 'Ajuste a busca ou o filtro.':['Adjust the search or filter.','Ajusta la búsqueda o el filtro.','Ajustez la recherche ou le filtre.'],
 'Use o botão acima. Ele ficará disponível no cadastro do colaborador.':['Use the button above. It will be available in the employee record.','Usa el botón de arriba. Estará disponible en el registro del empleado.','Utilisez le bouton ci-dessus. Il sera disponible dans le dossier de l’employé.'],
 'CÓDIGO':['CODE','CÓDIGO','CODE'],
 'NOME':['NAME','NOMBRE','NOM'],
 'DESCRIÇÃO':['DESCRIPTION','DESCRIPCIÓN','DESCRIPTION'],
 'COLABORADORES':['EMPLOYEES','EMPLEADOS','EMPLOYÉS'],
 'SITUAÇÃO':['STATUS','SITUACIÓN','STATUT'],
 'ETAPA':['STEP','ETAPA','ÉTAPE'],
 'CÓDIGO / CBO':['CODE / CBO','CÓDIGO / CBO','CODE / CBO'],
 'Dados do colaborador em dia.':['Employee information is up to date.','Los datos del empleado están al día.','Les informations de l’employé sont à jour.'],
 'Destino:':['Destination:','Destino:','Destination :'],
 '. Os originais existentes não serão substituídos.':['. Existing originals will not be replaced.','. Los originales existentes no serán reemplazados.','. Les originaux existants ne seront pas remplacés.'],
 'Pesquisar em todo o VeloX':["Search all of VeloX", "Buscar en todo VeloX", "Rechercher dans tout VeloX"],
 'BUSCA UNIVERSAL':["UNIVERSAL SEARCH", "BÚSQUEDA UNIVERSAL", "RECHERCHE UNIVERSELLE"],
 'Digite pelo menos 2 caracteres':["Enter at least 2 characters", "Introduce al menos 2 caracteres", "Saisissez au moins 2 caractères"],
 'Pesquise por nome, CPF, contrato, documento, obrigação ou equipe.':["Search by name, CPF, contract, document, obligation, or team.", "Busca por nombre, CPF, contrato, documento, obligación o equipo.", "Recherchez par nom, CPF, contrat, document, obligation ou équipe."],
 'Pesquisando...':["Searching...", "Buscando...", "Recherche en cours..."],
 'Aguarde enquanto consultamos os registros.':["Please wait while we search the records.", "Espera mientras consultamos los registros.", "Veuillez patienter pendant la recherche des dossiers."],
 'Confira a escrita ou tente outro termo.':["Check the spelling or try another term.", "Comprueba la escritura o prueba otro término.", "Vérifiez l’orthographe ou essayez un autre terme."],
 'Não foi possível pesquisar':["Search unavailable", "No fue posible buscar", "Recherche indisponible"],
 'Não foi possível concluir a pesquisa.':["The search could not be completed.", "No se pudo completar la búsqueda.", "La recherche n’a pas pu être effectuée."],
 'resultados':["results", "resultados", "résultats"],
 'Mostrando':["Showing", "Mostrando", "Affichage de"],
 'de':["of", "de", "sur"],
 'Refine a busca para ver outros registros.':["Refine your search to see other records.", "Afina la búsqueda para ver otros registros.", "Affinez votre recherche pour voir d’autres dossiers."],
 'Sem dados adicionais':["No additional details", "Sin datos adicionales", "Aucun détail supplémentaire"],
 'Abra o registro para consultar mais informações.':["Open the record to view more information.", "Abre el registro para consultar más información.", "Ouvrez le dossier pour consulter plus d’informations."],
 'Este arquivo pertence a uma categoria sensível. O conteúdo não é exibido na busca.':["This file belongs to a sensitive category. Its contents are not shown in search.", "Este archivo pertenece a una categoría sensible. Su contenido no se muestra en la búsqueda.", "Ce fichier appartient à une catégorie sensible. Son contenu n’apparaît pas dans la recherche."],
 'Abrir pasta':["Open folder", "Abrir carpeta", "Ouvrir le dossier"],
 'Abrir equipes':["Open teams", "Abrir equipos", "Ouvrir les équipes"],
 'Abrindo...':["Opening...", "Abriendo...", "Ouverture..."],
 'Não foi possível abrir este registro.':["This record could not be opened.", "No se pudo abrir este registro.", "Impossible d’ouvrir ce dossier."],
 'Fechar detalhes da busca':["Close search details", "Cerrar detalles de búsqueda", "Fermer les détails de recherche"],
 'Fechar detalhes':["Close details", "Cerrar detalles", "Fermer les détails"],
 'Sensível':["Sensitive", "Sensible", "Sensible"],
 'Formato':["Format", "Formato", "Format"],
 'Tamanho':["Size", "Tamaño", "Taille"],
 'Classificação':["Classification", "Clasificación", "Classification"],
};
Object.assign(map, COMPLETION_UI_TRANSLATIONS);

export const TRANSLATIONS = Object.freeze(Object.fromEntries(
 Object.entries(map).map(([source, targets])=>[source,Object.freeze(Array.isArray(targets) ? (targets.length >= 3 ? {en:targets[0],es:targets[1],fr:targets[2]} : {en:targets[0],es:targets[1],...EXTRA_TRANSLATIONS[source]}) : {...targets})])
));
export const COVERED_LABELS = Object.keys(TRANSLATIONS).length;
export function normalizeLocale(value){
 const raw=String(value||'').trim().toLowerCase();
 if(raw==='en'||raw.startsWith('en-'))return'en';
 if(raw==='es'||raw.startsWith('es-'))return'es';
 if(raw==='fr'||raw.startsWith('fr-'))return'fr';
 return 'pt-BR';
}
const MONTHS = Object.freeze({
 'pt-BR':['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'],
 'en':['January','February','March','April','May','June','July','August','September','October','November','December'],
 'es':['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'],
 'fr':['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre']});
const DYNAMIC_LABELS=Object.freeze({
 'en':{
  results:(a,b,c)=>`${a} results · Page ${b} of ${c}`,
  records:(a,b)=>`${a} of ${b} records`,step:(a,b)=>`Step ${a} of ${b}`,
  salary:(a,b)=>`${a} of ${b} active or on-leave employees with a recorded salary.`,
  links:(a,b)=>`${a} employment records · ${b} identified people · All results included in the export.`,
  updated:x=>`Updated on ${x}`, birthday:x=>`No birthdays in ${x}`,
  incomplete:x=>`Information to complete: ${x}`,
  shown:(a,b)=>`Showing ${a} of ${b} employees. Status, distribution and salary indicators reflect current employment records. Each hiring has its own history.`
 },
 'es':{
  results:(a,b,c)=>`${a} resultados · Página ${b} de ${c}`,
  records:(a,b)=>`${a} de ${b} registros`,step:(a,b)=>`Paso ${a} de ${b}`,
  salary:(a,b)=>`${a} de ${b} empleados activos o de baja temporal con salario informado.`,
  links:(a,b)=>`${a} vínculos laborales · ${b} personas identificadas · Todos los resultados incluidos en la exportación.`,
  updated:x=>`Actualizado el ${x}`,birthday:x=>`No hay cumpleaños en ${x}`,
  incomplete:x=>`Información por completar: ${x}`,
  shown:(a,b)=>`Mostrando ${a} de ${b} empleados. Los indicadores de situación, distribución y salario reflejan los vínculos actuales. Cada contratación conserva su historial.`
 },
 'fr':{
  results:(a,b,c)=>`${a} résultats · Page ${b} sur ${c}`,
  records:(a,b)=>`${a} enregistrements sur ${b}`,step:(a,b)=>`Étape ${a} sur ${b}`,
  salary:(a,b)=>`${a} employés actifs ou en congé sur ${b} avec un salaire enregistré.`,
  links:(a,b)=>`${a} contrats de travail · ${b} personnes identifiées · Tous les résultats inclus dans l'exportation.`,
  updated:x=>`Mis à jour le ${x}`,birthday:x=>`Aucun anniversaire en ${x}`,
  incomplete:x=>`Informations à compléter : ${x}`,
  shown:(a,b)=>`Affichage de ${a} employés sur ${b}. Les indicateurs de statut, de répartition et de salaire reflètent les relations de travail actuelles. Chaque embauche conserve son historique.`
 }});
const DYNAMIC_TERMS = Object.freeze({
 en:{photo:'Photo of',logo:'Logo of',editRecord:'Edit record for',terminate:'Terminate',upload:'Uploading',saved:'Saved:',read:'Could not read',overdue:'Overdue by',in:'In',days:'days',selected:'selected',folders:'folders',documents:'documents',records:'records',page:'page',commitments:'commitments',today:'today',createFirst:'Create your first',hirings:'hirings',terminations:'terminations',recordsWithoutHiring:'records without a hiring date',formerWithoutTermination:'former employees without a termination date',activeOrLeave:'active or on leave',employee:'employee',employees:'employees',of:'of',noBirthdays:'No birthdays in'},
 es:{photo:'Foto de',logo:'Logotipo de',editRecord:'Editar registro de',terminate:'Dar de baja a',upload:'Enviando',saved:'Guardado:',read:'No se pudo leer',overdue:'Vencido hace',in:'En',days:'días',selected:'seleccionados',folders:'carpetas',documents:'documentos',records:'registros',page:'página',commitments:'compromisos',today:'hoy',createFirst:'Crea tu primer',hirings:'altas',terminations:'bajas',recordsWithoutHiring:'registros sin fecha de contratación',formerWithoutTermination:'empleados desvinculados sin fecha de baja',activeOrLeave:'activos o de baja temporal',employee:'empleado',employees:'empleados',of:'de',noBirthdays:'No hay cumpleaños en'},
 fr:{photo:'Photo de',logo:'Logo de',editRecord:'Modifier le dossier de',terminate:'Mettre fin au contrat de',upload:'Envoi de',saved:'Enregistré :',read:'Impossible de lire',overdue:'En retard de',in:'Dans',days:'jours',selected:'sélectionnés',folders:'dossiers',documents:'documents',records:'dossiers',page:'page',commitments:'échéances',today:'aujourd’hui',createFirst:'Créez votre premier',hirings:'embauches',terminations:'départs',recordsWithoutHiring:'dossiers sans date d’embauche',formerWithoutTermination:'anciens employés sans date de départ',activeOrLeave:'actifs ou en congé',employee:'employé',employees:'employés',of:'sur',noBirthdays:'Aucun anniversaire en'}});

const DYNAMIC_NOUNS = Object.freeze({
 'colaborador':['employee','empleado','employé'],
 'centro de custo':['cost center','centro de costo','centre de coûts'],
 'equipe':['team','equipo','équipe'],
 'cargo':['position','puesto','poste'],
 'contrato':['contract','contrato','contrat'],
 'obrigação':['obligation','obligación','obligation']
});

function translateDynamic(source,locale){
 if(locale==='pt-BR')return source;
 const d=DYNAMIC_LABELS[locale],terms=DYNAMIC_TERMS[locale];if(!d||!terms)return null;
 const tr=(key)=>TRANSLATIONS[key]?.[locale]||key;
 const localDate=(raw)=>{
  const value=String(raw||'').trim();
  let m=/^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if(m)return formatDate(value,locale);
  m=/^(\d{2})\/(\d{2})\/(\d{4})(.*)$/.exec(value);
  if(m){const iso=`${m[3]}-${m[2]}-${m[1]}`;return formatDate(iso,locale)+(m[4]||'');}
  return value;
 };
 let m;
 if((m=/^(\d+) resultados · Página (\d+) de (\d+)$/.exec(source)))return d.results(...m.slice(1));
 if((m=/^(\d+) de (\d+) cadastros$/.exec(source)))return d.records(...m.slice(1));
 if((m=/^Etapa (\d+) de (\d+)$/.exec(source)))return d.step(...m.slice(1));
 if((m=/^(\d+) de (\d+) colaboradores ativos ou afastados com salário informado\.$/.exec(source)))return d.salary(...m.slice(1));
 if((m=/^(\d+) vínculos · (\d+) pessoas identificadas · Todos os resultados incluídos na exportação\.$/.exec(source)))return d.links(...m.slice(1));
 if((m=/^Atualizado em (.+)$/.exec(source)))return d.updated(localDate(m[1]));
 if((m=/^Gerado em (.+)$/.exec(source)))return `${tr('Gerado em')} ${localDate(m[1])}`;
 if((m=/^Data mínima: (.+)$/.exec(source)))return `${tr('Data mínima:')} ${localDate(m[1])}`;
 if((m=/^Data máxima: (.+)$/.exec(source)))return `${tr('Data máxima:')} ${localDate(m[1])}`;
 if((m=/^Nenhum aniversariante em (\p{L}+)$/u.exec(source))){const i=MONTHS['pt-BR'].indexOf(m[1].toLowerCase());if(i<0)return null;return d.birthday(MONTHS[locale][i]);}
 if((m=/^Informações a completar (\d+)$/.exec(source)))return d.incomplete(m[1]);
 if((m=/^Mostrando (\d+) de (\d+) colaboradores\. Indicadores de situação, distribuição e salário representam os vínculos atuais\. Cada contratação mantém seu próprio histórico\.$/.exec(source)))return d.shown(...m.slice(1));
 if((m=/^(.+), hoje$/.exec(source)))return `${localDate(m[1])}${tr(', hoje')}`;
 if((m=/^\d{2}\/\d{2}\/\d{4}$/.exec(source)))return localDate(source);
 if((m=/^R\$\s*(-?[\d.]+,\d{2})$/.exec(source))){const amount=Number(m[1].replace(/\./g,'').replace(',','.'));return Number.isFinite(amount)?formatCurrency(amount,locale,'BRL'):null;}
 if((m=/^Foto de (.+)$/.exec(source)))return `${terms.photo} ${m[1]}`;
 if((m=/^Logo de (.+)$/.exec(source)))return `${terms.logo} ${m[1]}`;
 if((m=/^Editar cadastro de (.+)$/.exec(source)))return `${terms.editRecord} ${m[1]}`;
 if((m=/^Desligar (.+)$/.exec(source)))return `${terms.terminate} ${m[1]}`;
 if((m=/^(Abrir|Editar|Excluir) (.+)$/.exec(source))){const action=TRANSLATIONS[m[1]]?.[locale];return action?`${action} ${m[2]}`:null;}
 if((m=/^Cadastre seu primeiro (.+)$/.exec(source))){const noun=DYNAMIC_NOUNS[m[1].toLowerCase()];return noun?`${terms.createFirst} ${noun[LOCALES.indexOf(locale)-1]}`:null;}
 if((m=/^Enviando (\d+) de (\d+): (.+)$/.exec(source)))return `${terms.upload} ${m[1]} ${terms.of} ${m[2]}: ${m[3]}`;
 if((m=/^Enviando (.+)…$/.exec(source)))return `${terms.upload} ${m[1]}…`;
 if((m=/^Salvo: (.+)$/.exec(source)))return `${terms.saved} ${m[1]}`;
 if((m=/^Não foi possível ler (.+)$/.exec(source)))return `${terms.read} ${m[1]}`;
 if((m=/^Vencido há (\d+) dias$/.exec(source)))return `${terms.overdue} ${m[1]} ${terms.days}`;
 if((m=/^Em (\d+) dias$/.exec(source)))return `${terms.in} ${m[1]} ${terms.days}`;
 if((m=/^(\d+) selecionados$/.exec(source)))return `${m[1]} ${terms.selected}`;
 if((m=/^(\d+) pastas · (\d+) documentos exibidos$/.exec(source)))return `${m[1]} ${terms.folders} · ${m[2]} ${terms.documents}`;
 if((m=/^(\d+) pastas(?: · (.+))?$/.exec(source)))return `${m[1]} ${terms.folders}${m[2]?' · '+m[2]:''}`;
 if((m=/^(\d+) arquivos? selecionados$/.exec(source)))return `${m[1]} ${terms.documents} ${terms.selected}`;
 if((m=/^(\d+) documentos? selecionados$/.exec(source)))return `${m[1]} ${terms.documents} ${terms.selected}`;
 if((m=/^Ver (\d+) (?:colaborador|colaboradores) (ativos ou afastados|ativo ou afastado)$/.exec(source)))return `${locale==='en'?'View':locale==='es'?'Ver':'Voir'} ${m[1]} ${terms.activeOrLeave} ${terms.employees}`;
 if((m=/^Cadastre sua primeira (.+)$/.exec(source))){const noun=DYNAMIC_NOUNS[m[1].toLowerCase()];return noun?`${locale==='en'?'Create your first':locale==='es'?'Registra tu primer':'Créez votre première'} ${noun[LOCALES.indexOf(locale)-1]}`:null;}
 if((m=/^(\d+) registros · página (\d+) de (\d+)$/.exec(source)))return `${m[1]} ${terms.records} · ${terms.page} ${m[2]} ${terms.of} ${m[3]}`;
 if((m=/^(\d+) registros · página (\d+)$/.exec(source)))return `${m[1]} ${terms.records} · ${terms.page} ${m[2]}`;
 if((m=/^(\d+) compromissos( · exibindo os primeiros 100; refine os filtros)?$/.exec(source))){const suffix=m[2]?(locale==='en'?' · showing the first 100; refine the filters':locale==='es'?' · se muestran los primeros 100; ajusta los filtros':' · les 100 premiers sont affichés ; affinez les filtres'):'';return `${m[1]} ${terms.commitments}${suffix}`;}
 if((m=/^(\d+) cadastros? sem data de admissão$/.exec(source)))return `${m[1]} ${terms.recordsWithoutHiring}`;
 if((m=/^(\d+) desligados? sem data de desligamento$/.exec(source)))return `${m[1]} ${terms.formerWithoutTermination}`;
 if((m=/^(.+): (\d+) admissões, (\d+) desligamentos$/.exec(source)))return `${m[1]}: ${m[2]} ${terms.hirings}, ${m[3]} ${terms.terminations}`;
 if((m=/^Ver (\d+) colaboradores?: (.+)$/.exec(source)))return `${locale==='en'?'View':locale==='es'?'Ver':'Voir'} ${m[1]} ${terms.employees}: ${m[2]}`;
 if((m=/^Página (\d+) de (\d+)$/.exec(source)))return `${terms.page[0].toUpperCase()+terms.page.slice(1)} ${m[1]} ${terms.of} ${m[2]}`;
 if((m=/^(.+): selecione um arquivo com conteúdo e até 20 MB\.$/.exec(source)))return `${tr(m[1]+':')} ${locale==='en'?'select a file with content up to 20 MB.':locale==='es'?'selecciona un archivo con contenido de hasta 20 MB.':'sélectionnez un fichier contenant des données de 20 Mo maximum.'}`;
 if((m=/^Confira a data de (.+)\.$/.exec(source)))return `${locale==='en'?'Check the date for':locale==='es'?'Comprueba la fecha de':'Vérifiez la date de'} ${tr(m[1])}.`;
 if((m=/^Escolha um (.+) ativo e cadastrado\.$/.exec(source))){const noun=DYNAMIC_NOUNS[m[1].toLowerCase()];return noun?`${locale==='en'?'Choose an active registered':locale==='es'?'Elige un':'Choisissez un'} ${noun[LOCALES.indexOf(locale)-1]}${locale==='es'?' activo y registrado':locale==='fr'?' actif et enregistré':''}.`:null;}
 if((m=/^([A-Z]{2,}) inválido\. Corrija ou deixe o campo vazio\.$/.exec(source)))return `${m[1]} ${locale==='en'?'is invalid. Correct it or leave the field blank.':locale==='es'?'no es válido. Corrígelo o deja el campo vacío.':'est invalide. Corrigez-le ou laissez le champ vide.'}`;
 if((m=/^O nome alternativo deve preservar a extensão (.+)\.$/.exec(source)))return `${locale==='en'?'The alternative name must preserve the extension':locale==='es'?'El nombre alternativo debe conservar la extensión':'Le nom alternatif doit conserver l’extension'} ${m[1]}.`;
 if((m=/^Arquivo (PDF|XLSX) gerado com (\d+) registros\. Uso interno; compartilhe apenas com autorização\.$/.exec(source))){
  const labels={en:`${m[1]} report generated with ${m[2]} records. Internal use; share only with authorization.`,es:`Informe ${m[1]} generado con ${m[2]} registros. Uso interno; compártalo solo con autorización.`,fr:`Rapport ${m[1]} généré avec ${m[2]} dossiers. Usage interne ; partage uniquement avec autorisation.`};return labels[locale];
 }
 return null;
}
function canonical(value){return String(value||'').trim().replace(/\s+/g,' ');}
function sourceExists(value){return Object.prototype.hasOwnProperty.call(TRANSLATIONS,value)||translateDynamic(value,'en')!==null;}
export function translateText(value,locale=DEFAULT_LOCALE){
 const text=String(value??'');const trimmed=canonical(text);const language=normalizeLocale(locale);
 if(language===DEFAULT_LOCALE)return text;
 const translated=TRANSLATIONS[trimmed]?.[language]||translateDynamic(trimmed,language);
 if(!translated)return text;
 // Preserve the DOM layout's original leading/trailing whitespace.
 const prefix=text.match(/^\s*/)?.[0]||'';
 const suffix=text.match(/\s*$/)?.[0]||'';
 return prefix+translated+suffix;
}
export function formatDate(value,locale=DEFAULT_LOCALE){
 const iso=String(value||'');
 if(!/^\d{4}-\d{2}-\d{2}$/.test(iso))return'';
 const [year,month,day]=iso.split('-').map(Number);
 const date=new Date(Date.UTC(year,month-1,day));
 if(date.getUTCFullYear()!==year||date.getUTCMonth()!==month-1||date.getUTCDate()!==day)return'';
 return new Intl.DateTimeFormat(normalizeLocale(locale),{day:'2-digit',month:'2-digit',year:'numeric',timeZone:'UTC'}).format(date);
}
export function formatCurrency(value,locale=DEFAULT_LOCALE,currency='BRL'){
 const amount=Number(value);
 if(!Number.isFinite(amount))return'';
 return new Intl.NumberFormat(normalizeLocale(locale),{style:'currency',currency}).format(amount);
}

const COUNTRY_REGION_CODES = Object.freeze({
 'AFRICA DO SUL':'ZA','ALEMANHA':'DE','ANGOLA':'AO','ARABIA SAUDITA':'SA','ARGENTINA':'AR','AUSTRALIA':'AU','AUSTRIA':'AT','BANGLADESH':'BD','BELGICA':'BE','BOLIVIA':'BO','BULGARIA':'BG','CABO VERDE':'CV','CAMAROES':'CM','CANADA':'CA','CHILE':'CL','CHINA':'CN','COLOMBIA':'CO','COREIA DO SUL':'KR','COSTA RICA':'CR','CUBA':'CU','DINAMARCA':'DK','EGITO':'EG','EL SALVADOR':'SV','EMIRADOS ARABES UNIDOS':'AE','EQUADOR':'EC','ESPANHA':'ES','ESTADOS UNIDOS':'US','FILIPINAS':'PH','FINLANDIA':'FI','FRANCA':'FR','GANA':'GH','GRECIA':'GR','GUATEMALA':'GT','GUINE-BISSAU':'GW','HAITI':'HT','HONDURAS':'HN','HUNGRIA':'HU','INDIA':'IN','INDONESIA':'ID','IRLANDA':'IE','ISRAEL':'IL','ITALIA':'IT','JAMAICA':'JM','JAPAO':'JP','LIBANO':'LB','MEXICO':'MX','MOCAMBIQUE':'MZ','NIGERIA':'NG','NORUEGA':'NO','NOVA ZELANDIA':'NZ','PAISES BAIXOS':'NL','PANAMA':'PA','PARAGUAI':'PY','PERU':'PE','POLONIA':'PL','PORTUGAL':'PT','QUENIA':'KE','REINO UNIDO':'GB','REPUBLICA DOMINICANA':'DO','ROMENIA':'RO','RUSSIA':'RU','SAO TOME E PRINCIPE':'ST','SENEGAL':'SN','SIRIA':'SY','SUECIA':'SE','SUICA':'CH','TAILANDIA':'TH','TURQUIA':'TR','UCRANIA':'UA','URUGUAI':'UY','VENEZUELA':'VE','VIETNA':'VN','BRASIL':'BR'
});
function countryLookupKey(value){return String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleUpperCase('pt-BR').replace(/\s+/g,' ').trim();}
function isKnownCountry(value){return Object.prototype.hasOwnProperty.call(COUNTRY_REGION_CODES,countryLookupKey(value));}
export function formatCountryName(value,locale=DEFAULT_LOCALE){
 const original=String(value||'');const code=COUNTRY_REGION_CODES[countryLookupKey(original)];
 if(!code||typeof Intl.DisplayNames!=='function')return original;
 try{
  const language=normalizeLocale(locale);const label=new Intl.DisplayNames([language],{type:'region'}).of(code);
  if(!label||label===code)return original;
  return language===DEFAULT_LOCALE?label.toLocaleUpperCase('pt-BR'):label;
 }catch(_){return original;}
}
export function formatNumber(value,locale=DEFAULT_LOCALE,options={}){
 const amount=Number(value);if(!Number.isFinite(amount))return'';
 return new Intl.NumberFormat(normalizeLocale(locale),options).format(amount);
}
export function formatDateTime(value,locale=DEFAULT_LOCALE,options={}){
 if(value==null||value==='')return'';
 const raw=String(value);
 if(/^\d{4}-\d{2}-\d{2}$/.test(raw))return formatDate(raw,locale);
 const date=value instanceof Date?value:new Date(value);
 if(!Number.isFinite(date.getTime()))return raw;
 const base=('dateStyle'in options||'timeStyle'in options)?{}:{dateStyle:'short'};return new Intl.DateTimeFormat(normalizeLocale(locale),{...base,...options}).format(date);
}
export function formatMonthName(monthIndex,locale=DEFAULT_LOCALE,style='long'){
 const index=Number(monthIndex);if(!Number.isInteger(index)||index<0||index>11)return'';
 return new Intl.DateTimeFormat(normalizeLocale(locale),{month:style,timeZone:'UTC'}).format(new Date(Date.UTC(2024,index,1)));
}
export function formatWeekdayName(dayIndex,locale=DEFAULT_LOCALE,style='long'){
 const index=Number(dayIndex);if(!Number.isInteger(index)||index<0||index>6)return'';
 return new Intl.DateTimeFormat(normalizeLocale(locale),{weekday:style,timeZone:'UTC'}).format(new Date(Date.UTC(2024,0,7+index)));
}

// Language selector approved for VeloX: compact 86×32 px button with animated 25×17 flags.
// Language names always follow the CURRENTLY selected interface language.
export const LANGUAGE_OPTIONS = Object.freeze([
 {id:'pt-BR',code:'PT',flag:'br',names:['Português','Portuguese','Portugués','Portugais']},
 {id:'en',code:'EN',flag:'us',names:['Inglês','English','Inglés','Anglais']},
 {id:'es',code:'ES',flag:'es',names:['Espanhol','Spanish','Español','Espagnol']},
 {id:'fr',code:'FR',flag:'fr',names:['Francês','French','Francés','Français']}]);
export function languageNames(locale){
 const index=LOCALES.indexOf(normalizeLocale(locale));
 return LANGUAGE_OPTIONS.map(option=>option.names[index<0?0:index]);
}
const FLAG_GRAPHICS=Object.freeze({
 br:"<rect width=\"30\" height=\"20\" fill=\"#009B3A\"/>\n<path d=\"M15 1.75 28 10 15 18.25 2 10Z\" fill=\"#FFDF00\"/>\n<circle cx=\"15\" cy=\"10\" r=\"5.55\" fill=\"#002776\"/>\n<g fill=\"#fff\"><polygon points=\"12.500,6.140 12.536,6.251 12.652,6.251 12.558,6.319 12.594,6.429 12.500,6.361 12.406,6.429 12.442,6.319 12.348,6.251 12.464,6.251\"/><polygon points=\"13.900,5.680 13.949,5.832 14.109,5.832 13.980,5.926 14.029,6.078 13.900,5.984 13.771,6.078 13.820,5.926 13.691,5.832 13.851,5.832\"/><polygon points=\"15.100,6.530 15.138,6.648 15.262,6.647 15.161,6.720 15.200,6.838 15.100,6.765 15.000,6.838 15.039,6.720 14.938,6.647 15.062,6.648\"/><polygon points=\"16.600,6.130 16.627,6.213 16.714,6.213 16.643,6.264 16.671,6.347 16.600,6.296 16.529,6.347 16.557,6.264 16.486,6.213 16.573,6.213\"/><polygon points=\"18.350,6.760 18.381,6.857 18.483,6.857 18.401,6.916 18.432,7.013 18.350,6.953 18.268,7.013 18.299,6.916 18.217,6.857 18.319,6.857\"/><polygon points=\"11.100,8.060 11.131,8.157 11.233,8.157 11.151,8.216 11.182,8.313 11.100,8.253 11.018,8.313 11.049,8.216 10.967,8.157 11.069,8.157\"/><polygon points=\"12.000,9.450 12.022,9.519 12.095,9.519 12.036,9.562 12.059,9.631 12.000,9.588 11.941,9.631 11.964,9.562 11.905,9.519 11.978,9.519\"/><polygon points=\"13.400,10.890 13.436,11.001 13.552,11.001 13.458,11.069 13.494,11.179 13.400,11.111 13.306,11.179 13.342,11.069 13.248,11.001 13.364,11.001\"/><polygon points=\"14.700,10.520 14.729,10.610 14.824,10.610 14.747,10.665 14.776,10.755 14.700,10.699 14.624,10.755 14.653,10.665 14.576,10.610 14.671,10.610\"/><polygon points=\"17.100,11.280 17.138,11.398 17.262,11.397 17.161,11.470 17.200,11.588 17.100,11.515 17.000,11.588 17.039,11.470 16.938,11.397 17.062,11.398\"/><polygon points=\"18.500,12.290 18.525,12.366 18.605,12.366 18.540,12.413 18.565,12.489 18.500,12.442 18.435,12.489 18.460,12.413 18.395,12.366 18.475,12.366\"/><polygon points=\"16.700,13.770 16.729,13.860 16.824,13.860 16.747,13.915 16.776,14.005 16.700,13.949 16.624,14.005 16.653,13.915 16.576,13.860 16.671,13.860\"/><polygon points=\"15.050,14.180 15.077,14.263 15.164,14.263 15.093,14.314 15.121,14.397 15.050,14.346 14.979,14.397 15.007,14.314 14.936,14.263 15.023,14.263\"/><polygon points=\"12.800,12.490 12.825,12.566 12.905,12.566 12.840,12.613 12.865,12.689 12.800,12.642 12.735,12.689 12.760,12.613 12.695,12.566 12.775,12.566\"/><polygon points=\"19.100,10.310 19.120,10.372 19.186,10.372 19.133,10.411 19.153,10.473 19.100,10.434 19.047,10.473 19.067,10.411 19.014,10.372 19.080,10.372\"/><polygon points=\"15.900,9.600 15.922,9.669 15.995,9.669 15.936,9.712 15.959,9.781 15.900,9.738 15.841,9.781 15.864,9.712 15.805,9.669 15.878,9.669\"/><polygon points=\"10.800,11.800 10.822,11.869 10.895,11.869 10.836,11.912 10.859,11.981 10.800,11.938 10.741,11.981 10.764,11.912 10.705,11.869 10.778,11.869\"/><polygon points=\"19.500,8.280 19.527,8.363 19.614,8.363 19.543,8.414 19.571,8.497 19.500,8.446 19.429,8.497 19.457,8.414 19.386,8.363 19.473,8.363\"/><polygon points=\"11.900,13.500 11.922,13.569 11.995,13.569 11.936,13.612 11.959,13.681 11.900,13.638 11.841,13.681 11.864,13.612 11.805,13.569 11.878,13.569\"/><polygon points=\"17.900,13.800 17.922,13.869 17.995,13.869 17.936,13.912 17.959,13.981 17.900,13.938 17.841,13.981 17.864,13.912 17.805,13.869 17.878,13.869\"/><polygon points=\"16.900,8.400 16.922,8.469 16.995,8.469 16.936,8.512 16.959,8.581 16.900,8.538 16.841,8.581 16.864,8.512 16.805,8.469 16.878,8.469\"/><polygon points=\"14.300,8.000 14.322,8.069 14.395,8.069 14.336,8.112 14.359,8.181 14.300,8.138 14.241,8.181 14.264,8.112 14.205,8.069 14.278,8.069\"/><polygon points=\"16.500,5.000 16.522,5.069 16.595,5.069 16.536,5.112 16.559,5.181 16.500,5.138 16.441,5.181 16.464,5.112 16.405,5.069 16.478,5.069\"/><polygon points=\"18.400,9.240 18.425,9.316 18.505,9.316 18.440,9.363 18.465,9.439 18.400,9.392 18.335,9.439 18.360,9.363 18.295,9.316 18.375,9.316\"/><polygon points=\"13.200,7.010 13.220,7.072 13.286,7.072 13.233,7.111 13.253,7.173 13.200,7.134 13.147,7.173 13.167,7.111 13.114,7.072 13.180,7.072\"/><polygon points=\"15.300,12.400 15.322,12.469 15.395,12.469 15.336,12.512 15.359,12.581 15.300,12.538 15.241,12.581 15.264,12.512 15.205,12.469 15.278,12.469\"/><polygon points=\"11.300,6.500 11.322,6.569 11.395,6.569 11.336,6.612 11.359,6.681 11.300,6.638 11.241,6.681 11.264,6.612 11.205,6.569 11.278,6.569\"/></g>\n<path d=\"M9.46 8.64c3.26-1.68 7.1-1.63 11.03.17\" fill=\"none\" stroke=\"#fff\" stroke-width=\"1.16\"/>\n<text x=\"10.1\" y=\"8.25\" fill=\"#009B3A\" font-family=\"Arial,sans-serif\" font-size=\".73\" font-weight=\"700\" transform=\"rotate(-2 15 8)\">ORDEM E PROGRESSO</text>",
 us:"<rect width=\"30\" height=\"20\" fill=\"#fff\"/>\n<rect x=\"0\" y=\"0.00000\" width=\"30\" height=\"1.53846\" fill=\"#B22234\"/>\n<rect x=\"0\" y=\"3.07692\" width=\"30\" height=\"1.53846\" fill=\"#B22234\"/>\n<rect x=\"0\" y=\"6.15385\" width=\"30\" height=\"1.53846\" fill=\"#B22234\"/>\n<rect x=\"0\" y=\"9.23077\" width=\"30\" height=\"1.53846\" fill=\"#B22234\"/>\n<rect x=\"0\" y=\"12.30769\" width=\"30\" height=\"1.53846\" fill=\"#B22234\"/>\n<rect x=\"0\" y=\"15.38462\" width=\"30\" height=\"1.53846\" fill=\"#B22234\"/>\n<rect x=\"0\" y=\"18.46154\" width=\"30\" height=\"1.53846\" fill=\"#B22234\"/>\n<rect width=\"12\" height=\"10.769\" fill=\"#3C3B6E\"/>\n<g fill=\"#fff\">\n<polygon points=\"0.950,0.460 1.045,0.729 1.330,0.736 1.104,0.910 1.185,1.184 0.950,1.022 0.715,1.184 0.796,0.910 0.570,0.736 0.855,0.729\"/>\n<polygon points=\"2.970,0.460 3.065,0.729 3.350,0.736 3.124,0.910 3.205,1.184 2.970,1.022 2.735,1.184 2.816,0.910 2.590,0.736 2.875,0.729\"/>\n<polygon points=\"4.990,0.460 5.085,0.729 5.370,0.736 5.144,0.910 5.225,1.184 4.990,1.022 4.755,1.184 4.836,0.910 4.610,0.736 4.895,0.729\"/>\n<polygon points=\"7.010,0.460 7.105,0.729 7.390,0.736 7.164,0.910 7.245,1.184 7.010,1.022 6.775,1.184 6.856,0.910 6.630,0.736 6.915,0.729\"/>\n<polygon points=\"9.030,0.460 9.125,0.729 9.410,0.736 9.184,0.910 9.265,1.184 9.030,1.022 8.795,1.184 8.876,0.910 8.650,0.736 8.935,0.729\"/>\n<polygon points=\"11.050,0.460 11.145,0.729 11.430,0.736 11.204,0.910 11.285,1.184 11.050,1.022 10.815,1.184 10.896,0.910 10.670,0.736 10.955,0.729\"/>\n<polygon points=\"1.960,1.615 2.055,1.884 2.340,1.891 2.114,2.065 2.195,2.339 1.960,2.177 1.725,2.339 1.806,2.065 1.580,1.891 1.865,1.884\"/>\n<polygon points=\"3.980,1.615 4.075,1.884 4.360,1.891 4.134,2.065 4.215,2.339 3.980,2.177 3.745,2.339 3.826,2.065 3.600,1.891 3.885,1.884\"/>\n<polygon points=\"6.000,1.615 6.095,1.884 6.380,1.891 6.154,2.065 6.235,2.339 6.000,2.177 5.765,2.339 5.846,2.065 5.620,1.891 5.905,1.884\"/>\n<polygon points=\"8.020,1.615 8.115,1.884 8.400,1.891 8.174,2.065 8.255,2.339 8.020,2.177 7.785,2.339 7.866,2.065 7.640,1.891 7.925,1.884\"/>\n<polygon points=\"10.040,1.615 10.135,1.884 10.420,1.891 10.194,2.065 10.275,2.339 10.040,2.177 9.805,2.339 9.886,2.065 9.660,1.891 9.945,1.884\"/>\n<polygon points=\"0.950,2.770 1.045,3.039 1.330,3.046 1.104,3.220 1.185,3.494 0.950,3.332 0.715,3.494 0.796,3.220 0.570,3.046 0.855,3.039\"/>\n<polygon points=\"2.970,2.770 3.065,3.039 3.350,3.046 3.124,3.220 3.205,3.494 2.970,3.332 2.735,3.494 2.816,3.220 2.590,3.046 2.875,3.039\"/>\n<polygon points=\"4.990,2.770 5.085,3.039 5.370,3.046 5.144,3.220 5.225,3.494 4.990,3.332 4.755,3.494 4.836,3.220 4.610,3.046 4.895,3.039\"/>\n<polygon points=\"7.010,2.770 7.105,3.039 7.390,3.046 7.164,3.220 7.245,3.494 7.010,3.332 6.775,3.494 6.856,3.220 6.630,3.046 6.915,3.039\"/>\n<polygon points=\"9.030,2.770 9.125,3.039 9.410,3.046 9.184,3.220 9.265,3.494 9.030,3.332 8.795,3.494 8.876,3.220 8.650,3.046 8.935,3.039\"/>\n<polygon points=\"11.050,2.770 11.145,3.039 11.430,3.046 11.204,3.220 11.285,3.494 11.050,3.332 10.815,3.494 10.896,3.220 10.670,3.046 10.955,3.039\"/>\n<polygon points=\"1.960,3.925 2.055,4.194 2.340,4.201 2.114,4.375 2.195,4.649 1.960,4.487 1.725,4.649 1.806,4.375 1.580,4.201 1.865,4.194\"/>\n<polygon points=\"3.980,3.925 4.075,4.194 4.360,4.201 4.134,4.375 4.215,4.649 3.980,4.487 3.745,4.649 3.826,4.375 3.600,4.201 3.885,4.194\"/>\n<polygon points=\"6.000,3.925 6.095,4.194 6.380,4.201 6.154,4.375 6.235,4.649 6.000,4.487 5.765,4.649 5.846,4.375 5.620,4.201 5.905,4.194\"/>\n<polygon points=\"8.020,3.925 8.115,4.194 8.400,4.201 8.174,4.375 8.255,4.649 8.020,4.487 7.785,4.649 7.866,4.375 7.640,4.201 7.925,4.194\"/>\n<polygon points=\"10.040,3.925 10.135,4.194 10.420,4.201 10.194,4.375 10.275,4.649 10.040,4.487 9.805,4.649 9.886,4.375 9.660,4.201 9.945,4.194\"/>\n<polygon points=\"0.950,5.080 1.045,5.349 1.330,5.356 1.104,5.530 1.185,5.804 0.950,5.642 0.715,5.804 0.796,5.530 0.570,5.356 0.855,5.349\"/>\n<polygon points=\"2.970,5.080 3.065,5.349 3.350,5.356 3.124,5.530 3.205,5.804 2.970,5.642 2.735,5.804 2.816,5.530 2.590,5.356 2.875,5.349\"/>\n<polygon points=\"4.990,5.080 5.085,5.349 5.370,5.356 5.144,5.530 5.225,5.804 4.990,5.642 4.755,5.804 4.836,5.530 4.610,5.356 4.895,5.349\"/>\n<polygon points=\"7.010,5.080 7.105,5.349 7.390,5.356 7.164,5.530 7.245,5.804 7.010,5.642 6.775,5.804 6.856,5.530 6.630,5.356 6.915,5.349\"/>\n<polygon points=\"9.030,5.080 9.125,5.349 9.410,5.356 9.184,5.530 9.265,5.804 9.030,5.642 8.795,5.804 8.876,5.530 8.650,5.356 8.935,5.349\"/>\n<polygon points=\"11.050,5.080 11.145,5.349 11.430,5.356 11.204,5.530 11.285,5.804 11.050,5.642 10.815,5.804 10.896,5.530 10.670,5.356 10.955,5.349\"/>\n<polygon points=\"1.960,6.235 2.055,6.504 2.340,6.511 2.114,6.685 2.195,6.959 1.960,6.797 1.725,6.959 1.806,6.685 1.580,6.511 1.865,6.504\"/>\n<polygon points=\"3.980,6.235 4.075,6.504 4.360,6.511 4.134,6.685 4.215,6.959 3.980,6.797 3.745,6.959 3.826,6.685 3.600,6.511 3.885,6.504\"/>\n<polygon points=\"6.000,6.235 6.095,6.504 6.380,6.511 6.154,6.685 6.235,6.959 6.000,6.797 5.765,6.959 5.846,6.685 5.620,6.511 5.905,6.504\"/>\n<polygon points=\"8.020,6.235 8.115,6.504 8.400,6.511 8.174,6.685 8.255,6.959 8.020,6.797 7.785,6.959 7.866,6.685 7.640,6.511 7.925,6.504\"/>\n<polygon points=\"10.040,6.235 10.135,6.504 10.420,6.511 10.194,6.685 10.275,6.959 10.040,6.797 9.805,6.959 9.886,6.685 9.660,6.511 9.945,6.504\"/>\n<polygon points=\"0.950,7.390 1.045,7.659 1.330,7.666 1.104,7.840 1.185,8.114 0.950,7.952 0.715,8.114 0.796,7.840 0.570,7.666 0.855,7.659\"/>\n<polygon points=\"2.970,7.390 3.065,7.659 3.350,7.666 3.124,7.840 3.205,8.114 2.970,7.952 2.735,8.114 2.816,7.840 2.590,7.666 2.875,7.659\"/>\n<polygon points=\"4.990,7.390 5.085,7.659 5.370,7.666 5.144,7.840 5.225,8.114 4.990,7.952 4.755,8.114 4.836,7.840 4.610,7.666 4.895,7.659\"/>\n<polygon points=\"7.010,7.390 7.105,7.659 7.390,7.666 7.164,7.840 7.245,8.114 7.010,7.952 6.775,8.114 6.856,7.840 6.630,7.666 6.915,7.659\"/>\n<polygon points=\"9.030,7.390 9.125,7.659 9.410,7.666 9.184,7.840 9.265,8.114 9.030,7.952 8.795,8.114 8.876,7.840 8.650,7.666 8.935,7.659\"/>\n<polygon points=\"11.050,7.390 11.145,7.659 11.430,7.666 11.204,7.840 11.285,8.114 11.050,7.952 10.815,8.114 10.896,7.840 10.670,7.666 10.955,7.659\"/>\n<polygon points=\"1.960,8.545 2.055,8.814 2.340,8.821 2.114,8.995 2.195,9.269 1.960,9.107 1.725,9.269 1.806,8.995 1.580,8.821 1.865,8.814\"/>\n<polygon points=\"3.980,8.545 4.075,8.814 4.360,8.821 4.134,8.995 4.215,9.269 3.980,9.107 3.745,9.269 3.826,8.995 3.600,8.821 3.885,8.814\"/>\n<polygon points=\"6.000,8.545 6.095,8.814 6.380,8.821 6.154,8.995 6.235,9.269 6.000,9.107 5.765,9.269 5.846,8.995 5.620,8.821 5.905,8.814\"/>\n<polygon points=\"8.020,8.545 8.115,8.814 8.400,8.821 8.174,8.995 8.255,9.269 8.020,9.107 7.785,9.269 7.866,8.995 7.640,8.821 7.925,8.814\"/>\n<polygon points=\"10.040,8.545 10.135,8.814 10.420,8.821 10.194,8.995 10.275,9.269 10.040,9.107 9.805,9.269 9.886,8.995 9.660,8.821 9.945,8.814\"/>\n<polygon points=\"0.950,9.700 1.045,9.969 1.330,9.976 1.104,10.150 1.185,10.424 0.950,10.262 0.715,10.424 0.796,10.150 0.570,9.976 0.855,9.969\"/>\n<polygon points=\"2.970,9.700 3.065,9.969 3.350,9.976 3.124,10.150 3.205,10.424 2.970,10.262 2.735,10.424 2.816,10.150 2.590,9.976 2.875,9.969\"/>\n<polygon points=\"4.990,9.700 5.085,9.969 5.370,9.976 5.144,10.150 5.225,10.424 4.990,10.262 4.755,10.424 4.836,10.150 4.610,9.976 4.895,9.969\"/>\n<polygon points=\"7.010,9.700 7.105,9.969 7.390,9.976 7.164,10.150 7.245,10.424 7.010,10.262 6.775,10.424 6.856,10.150 6.630,9.976 6.915,9.969\"/>\n<polygon points=\"9.030,9.700 9.125,9.969 9.410,9.976 9.184,10.150 9.265,10.424 9.030,10.262 8.795,10.424 8.876,10.150 8.650,9.976 8.935,9.969\"/>\n<polygon points=\"11.050,9.700 11.145,9.969 11.430,9.976 11.204,10.150 11.285,10.424 11.050,10.262 10.815,10.424 10.896,10.150 10.670,9.976 10.955,9.969\"/>\n</g>",
 es:"<rect width=\"30\" height=\"20\" fill=\"#AA151B\"/><rect y=\"5\" width=\"30\" height=\"10\" fill=\"#F1BF00\"/>\n<!-- Columns of Hercules, with golden capitals and red ribbons -->\n<g transform=\"translate(6.7 6.05)\">\n<path d=\"M0.2 2.25h1.25v5H.2z\" fill=\"#f4f4ee\" stroke=\"#9d9c9a\" stroke-width=\".12\"/>\n<path d=\"M-.05 2h1.75v.5H-.05zm0 5.3h1.75v.48H-.05\" fill=\"#d7b253\"/>\n<path d=\"M.05 3.6Q.95 2.8 1.64 3.6M.05 5.5Q.95 4.7 1.64 5.5\" stroke=\"#b52633\" stroke-width=\".36\" fill=\"none\"/>\n</g><g transform=\"translate(14.5 6.05)\">\n<path d=\"M.2 2.25h1.25v5H.2z\" fill=\"#f4f4ee\" stroke=\"#9d9c9a\" stroke-width=\".12\"/>\n<path d=\"M-.05 2h1.75v.5H-.05zm0 5.3h1.75v.48H-.05\" fill=\"#d7b253\"/>\n<path d=\"M.05 3.6Q.95 2.8 1.64 3.6M.05 5.5Q.95 4.7 1.64 5.5\" stroke=\"#b52633\" stroke-width=\".36\" fill=\"none\"/>\n</g>\n<!-- Crown -->\n<path d=\"M9.05 7.2 8.7 5.95l.9.45.75-.9.9.83.83-.85.73.9.94-.42-.35 1.22z\" fill=\"#F1BF00\" stroke=\"#ae2b33\" stroke-width=\".2\"/>\n<path d=\"M8.92 7h4.22v.62H8.92z\" fill=\"#f9ce40\" stroke=\"#ae2b33\" stroke-width=\".25\"/>\n<!-- Royal shield divided into 4 quarters -->\n<path d=\"M9 7.75h4.1v4.4q-.03 1.5-2.05 2.35Q9 13.65 9 12.15z\" fill=\"#f8f5eb\" stroke=\"#b22b38\" stroke-width=\".4\"/>\n<path d=\"M9.2 7.96h1.82v2.35H9.2z\" fill=\"#be1e2d\"/>\n<path d=\"M11.1 7.96h1.8v2.35h-1.8z\" fill=\"#fff9f0\"/>\n<path d=\"M9.2 10.45h1.82v1.98H9.2z\" fill=\"#ffd230\"/>\n<path d=\"M11.1 10.45h1.8v1.98h-1.8z\" fill=\"#c52940\"/>\n<!-- Castile castle -->\n<path d=\"M9.55 8.9h1.18v.87H9.55z M9.45 8.72h.26v.33h-.26zM10 8.72h.26v.33H10zM10.55 8.72h.25v.33h-.25z\" fill=\"#F1BF00\"/>\n<path d=\"M10.02 9.3h.25v.48h-.25z\" fill=\"#a11828\"/>\n<!-- Leon lion -->\n<path d=\"M11.85 8.52l.24.32-.19.3.18.34-.3.43-.25-.35-.17-.05.2-.37-.08-.28.25.09.12-.43z\" fill=\"#8A4A9A\"/>\n<!-- Aragon stripes -->\n<path d=\"M9.55 10.5v1.88M9.98 10.5v1.88M10.43 10.5v1.88\" stroke=\"#C32C36\" stroke-width=\".23\"/>\n<!-- Navarre chains -->\n<path d=\"M11.3 10.7l1.45 1.45m0-1.45L11.3 12.15m.74-1.55v1.76\" stroke=\"#ffd148\" stroke-width=\".25\"/>\n<!-- Granada pomegranate, Bourbon escutcheon -->\n<path d=\"M10.6 13.2q.43-.52.87 0-.25.52-.44.55z\" fill=\"#e6eee6\" stroke=\"#518b55\" stroke-width=\".15\"/>\n<ellipse cx=\"11.06\" cy=\"10.2\" rx=\".42\" ry=\".52\" fill=\"#3365ac\" stroke=\"#fff\" stroke-width=\".12\"/>\n<path d=\"M10.9 10.09l.13-.15.12.15-.12.2z\" fill=\"#f8d43e\"/>",
 fr:"<rect width=\"10\" height=\"20\" fill=\"#0055A4\"/><rect x=\"10\" width=\"10\" height=\"20\" fill=\"#FFFFFF\"/><rect x=\"20\" width=\"10\" height=\"20\" fill=\"#EF4135\"/>"});
const FLAG_RESOLUTION=Object.freeze({width:25,height:17});
function createFlag(doc,code){
 const wrap=doc.createElement('span');wrap.className='vx-lang-flag-wrap';wrap.dataset.flag=code;
 const svg=doc.createElementNS('http://www.w3.org/2000/svg','svg');
 svg.setAttribute('viewBox','0 0 30 20');svg.setAttribute('width','25');svg.setAttribute('height','17');
 svg.setAttribute('aria-hidden','true');svg.setAttribute('focusable','false');
 svg.setAttribute('class','vx-lang-flag');svg.innerHTML=FLAG_GRAPHICS[code]||'';
 wrap.append(svg);
 return wrap;
}
// Bandeiras 3D aprovadas: ondulação de tecido, luz e sombra com dimensões fixas 25 × 17 px.
let FLAG_ENGINE_INSTALLED=false;
function installFlagEngine(doc){
 if(FLAG_ENGINE_INSTALLED)return;
 FLAG_ENGINE_INSTALLED=true;
 const win=doc.defaultView||window;
 const ratio=Math.min(3,Math.max(2,win.devicePixelRatio||2));
 const width=Math.round(FLAG_RESOLUTION.width*ratio),height=Math.round(FLAG_RESOLUTION.height*ratio);
 const textureWidth=150,textureHeight=100;
 const textures=new Map();
 const reduced=win.matchMedia?.('(prefers-reduced-motion: reduce)');
 let ready=false,lastFrame=0;
 function loadTexture(code,content){
  return new Promise(resolve=>{
   const img=new win.Image();
   const markup='<svg xmlns="http://www.w3.org/2000/svg" width="150" height="100" viewBox="0 0 30 20">'+content+'</svg>';
   img.onload=()=>{
    const canvas=doc.createElement('canvas');canvas.width=textureWidth;canvas.height=textureHeight;
    const ctx=canvas.getContext('2d');if(!ctx){resolve(null);return}
    ctx.drawImage(img,0,0,textureWidth,textureHeight);resolve(canvas);
   };
   img.onerror=()=>resolve(null);
   img.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(markup);
  });
 }
 function paint(wrapper,now,ordinal){
  const texture=textures.get(wrapper.dataset.flag);
  if(!texture)return;
  let canvas=wrapper.querySelector('canvas.vxcloth');
  if(!canvas){canvas=doc.createElement('canvas');canvas.className='vxcloth';canvas.width=width;canvas.height=height;canvas.setAttribute('aria-hidden','true');wrapper.appendChild(canvas)}
  const ctx=canvas.getContext('2d');if(!ctx)return;
  wrapper.classList.add('vxcloth-ready');
  const time=now*.001,phaseOffset=ordinal===0?.25:ordinal*.43;
  // Brisa leve aprovada: rajadas discretas, onda progressiva e pouca deformação.
  const gust=.94+.06*Math.sin(time*.42+phaseOffset*2);
  ctx.clearRect(0,0,width,height);
  for(let x=0;x<width;x++){
   const u=(x+.5)/width,amplitude=Math.pow(u,.78);
   const phase=(u*1.44-time*.31+phaseOffset)*Math.PI*2;
   const secondary=(u*2.35-time*.40+phaseOffset)*Math.PI*2;
   const vertical=ratio*amplitude*gust*(.3875*Math.sin(phase)+.095*Math.sin(secondary));
   const pinch=ratio*amplitude*(.06*Math.cos(phase+.65));
   const clothHeight=height+ratio*amplitude*.20*Math.sin(secondary);
   const imageX=(x/width)*textureWidth,tx=Math.floor(imageX),tw=Math.max(1,Math.ceil(textureWidth/width)+1);
   ctx.drawImage(texture,tx,0,Math.min(tw,textureWidth-tx),textureHeight,x,vertical+pinch,1.35,clothHeight);
  }
  ctx.globalCompositeOperation='source-atop';
  for(let x=0;x<width;x++){
   const u=(x+.5)/width,a=Math.pow(u,.65);
   const phase=(u*1.44-time*.31+phaseOffset)*Math.PI*2;
   const light=Math.cos(phase+.45);
   const gloss=.025+.13*a*Math.max(0,light),shadow=.020+.16*a*Math.max(0,-light);
   ctx.fillStyle=light>=0?`rgba(255,255,255,${gloss.toFixed(3)})`:`rgba(0,0,0,${shadow.toFixed(3)})`;
   ctx.fillRect(x,0,1.1,height);
  }
  const top=ctx.createLinearGradient(0,0,0,height);
  top.addColorStop(0,'rgba(255,255,255,.09)');top.addColorStop(.24,'rgba(255,255,255,0)');
  top.addColorStop(.72,'rgba(0,0,0,0)');top.addColorStop(1,'rgba(0,0,0,.09)');
  ctx.fillStyle=top;ctx.fillRect(0,0,width,height);ctx.globalCompositeOperation='source-over';
 }
 function loop(now){
  if(!doc.documentElement.isConnected)return;
  if(ready&&doc.visibilityState!=='hidden'&&(!reduced||!reduced.matches)&&now-lastFrame>=32){
   lastFrame=now;
   doc.querySelectorAll('.vx-lang-flag-wrap').forEach((wrapper,i)=>paint(wrapper,now,i));
  }else if(reduced?.matches){
   doc.querySelectorAll('.vx-lang-flag-wrap.vxcloth-ready').forEach(w=>w.classList.remove('vxcloth-ready'));
  }
  win.requestAnimationFrame(loop);
 }
 Promise.all(Object.entries(FLAG_GRAPHICS).map(async([code,content])=>[code,await loadTexture(code,content)])).then(entries=>{
  if(entries.some(([,texture])=>!texture))return;
  for(const [code,texture] of entries)textures.set(code,texture);
  ready=true;
 });
 win.requestAnimationFrame(loop);
}
const LANGUAGE_STYLE=`
.vx-lang-trigger,#v10full .vx-lang-trigger{box-sizing:border-box;display:inline-flex;align-items:center;justify-content:center;gap:7px;width:auto;min-width:86px;max-width:calc(100vw - 32px);height:32px;padding:0 8px;border:1px solid transparent;border-radius:7px;background:transparent;color:#345840;cursor:pointer;font:750 12px/1 Inter,Montserrat,Arial,sans-serif;white-space:nowrap;letter-spacing:.2px;box-shadow:none;transition:background .14s,border-color .14s,box-shadow .14s,color .14s}
.vx-lang-trigger:hover,#v10full .vx-lang-trigger:hover{background:#eaf4ed;border-color:transparent;box-shadow:none;color:#173c26}
.vx-lang-trigger:focus-visible{outline:2px solid #357e4f;outline-offset:2px}
.vx-lang-trigger[aria-expanded="true"]{border-color:#cfe4d6}
#v10full .vx-lang-trigger.vx-lang-trigger-login{width:auto;min-width:86px;max-width:calc(100vw - 32px);height:32px;border:1px solid transparent;border-radius:7px;background:transparent;color:var(--fg,#eef8ea);box-shadow:none;letter-spacing:.2px}
#v10full .vx-lang-trigger.vx-lang-trigger-login:hover{background:rgba(173,214,175,.10);border-color:transparent;color:var(--fg,#eef8ea);box-shadow:none}
#v10full .vx-lang-trigger.vx-lang-trigger-login[aria-expanded="true"]{background:rgba(173,214,175,.12);border-color:transparent;box-shadow:none}
.vx-lang-flag-wrap{display:block;position:relative;width:25px;height:17px;flex:0 0 25px;border-radius:2px;overflow:hidden;isolation:isolate;box-shadow:0 0 0 1px rgba(0,0,0,.12),0 1px 2px rgba(0,0,0,.12)}
.vx-lang-flag-wrap>.vx-lang-flag{position:absolute;inset:0;display:block;width:25px;height:17px;box-shadow:none;transform-origin:10% 50%;will-change:transform;animation:vx-flag-breeze 4.4s cubic-bezier(.45,0,.55,1) infinite}
.vx-lang-flag-wrap::after{content:"";pointer-events:none;position:absolute;inset:0;z-index:1;background:linear-gradient(103deg,rgba(255,255,255,.06) 0%,rgba(255,255,255,.02) 15%,rgba(255,255,255,.17) 27%,rgba(0,0,0,.09) 40%,rgba(255,255,255,.16) 54%,rgba(0,0,0,.08) 69%,rgba(255,255,255,.09) 86%,rgba(0,0,0,.03) 100%);background-size:190% 100%;animation:vx-flag-light 4.4s cubic-bezier(.45,0,.55,1) infinite}
@keyframes vx-flag-breeze{0%,100%{transform:perspective(140px) rotateY(-2.2deg) skewY(-.35deg) scaleX(.998)}38%{transform:perspective(140px) rotateY(2.8deg) skewY(.35deg) scaleX(.992)}72%{transform:perspective(140px) rotateY(-1.4deg) skewY(-.2deg) scaleX(.998)}}
@keyframes vx-flag-light{0%,100%{background-position:2% 50%;opacity:.72}28%{background-position:34% 50%;opacity:.88}53%{background-position:91% 50%;opacity:.78}78%{background-position:46% 50%;opacity:.86}}
.vx-lang-flag-wrap canvas.vxcloth{position:absolute;inset:0;display:block;width:25px;height:17px;opacity:0;z-index:0;pointer-events:none;transform-origin:8% 50%;animation:vx-cloth-perspective 4.4s cubic-bezier(.45,0,.55,1) infinite}
.vx-lang-flag-wrap.vxcloth-ready canvas.vxcloth{opacity:1}
.vx-lang-flag-wrap.vxcloth-ready>.vx-lang-flag{opacity:0;animation:none}
.vx-lang-flag-wrap.vxcloth-ready::after{display:none}
@keyframes vx-cloth-perspective{0%,100%{transform:perspective(140px) rotateY(-1.8deg)}38%{transform:perspective(140px) rotateY(2.5deg)}72%{transform:perspective(140px) rotateY(-1.2deg)}}
.vx-lang-option:nth-child(2n) .vx-lang-flag-wrap>.vx-lang-flag,.vx-lang-option:nth-child(2n) .vx-lang-flag-wrap::after{animation-delay:-1.1s}
.vx-lang-option:nth-child(3n) .vx-lang-flag-wrap>.vx-lang-flag,.vx-lang-option:nth-child(3n) .vx-lang-flag-wrap::after{animation-delay:-2.1s}
@media(prefers-reduced-motion:reduce){.vx-lang-flag-wrap>.vx-lang-flag,.vx-lang-flag-wrap::after,.vx-lang-flag-wrap canvas.vxcloth{animation:none}}
.vx-lang-name{font-weight:750;font-size:12px;letter-spacing:0;line-height:1;white-space:nowrap}
/* Country abbreviation as a small superscript, without enlarging the approved 86px button. */
.vx-lang-trigger,#v10full .vx-lang-trigger,#v10full .vx-lang-trigger.vx-lang-trigger-login{gap:4px;padding-inline:6px}
.vx-lang-country{display:inline-block;font-size:7.5px;font-weight:800;line-height:0;letter-spacing:0;vertical-align:super;margin-right:1px}
.vx-lang-option-label .vx-lang-country{font-size:8px}
.vx-lang-chevron{width:10px;height:10px;flex:0 0 10px;transition:transform .14s}
.vx-lang-trigger[aria-expanded="true"] .vx-lang-chevron{transform:rotate(180deg)}
.vx-lang-native{display:none!important}
.vx-lang-menu{box-sizing:border-box;position:fixed;z-index:2147483000;width:132px;padding:5px;background:#fff;border:1px solid #cdded2;border-radius:9px;box-shadow:0 13px 30px rgba(20,48,31,.16);overflow:auto;overscroll-behavior:contain}
.vx-lang-menu[hidden]{display:none!important}
.vx-lang-menu.vx-lang-menu-login{background:transparent;border:0;border-radius:9px;box-shadow:none;padding:5px}
.vx-lang-menu.vx-lang-menu-login .vx-lang-option{background:transparent;color:#edf5eb}
.vx-lang-menu.vx-lang-menu-login .vx-lang-option:hover,.vx-lang-menu.vx-lang-menu-login .vx-lang-option:focus-visible{background:rgba(166,208,171,.16);color:inherit;outline:none}
.vx-lang-menu.vx-lang-menu-login .vx-lang-option[aria-selected="true"]{background:rgba(164,207,171,.08);color:inherit;font-weight:750}
.vx-lang-menu.vx-lang-menu-login .vx-lang-option[aria-selected="true"]:hover,.vx-lang-menu.vx-lang-menu-login .vx-lang-option[aria-selected="true"]:focus-visible{background:rgba(164,207,171,.12)}
.vx-lang-menu.vx-lang-menu-login .vx-lang-check{color:#b5d8ae}
.vx-lang-option{box-sizing:border-box;display:flex;align-items:center;gap:10px;width:100%;height:37px;min-height:37px;padding:0 10px;border:0;border-radius:6px;background:#fff;color:#171717;text-align:left;font:600 13px/1.3 Inter,Montserrat,Arial,sans-serif;cursor:pointer;transition:background-color .12s,color .12s}
.vx-lang-option:hover,.vx-lang-option:focus-visible{background:#d1e9d9;color:#171717;outline:none}
.vx-lang-option[aria-selected="true"]{background:#eaf4ed;color:#171717;font-weight:750}
.vx-lang-option[aria-selected="true"]:hover,.vx-lang-option[aria-selected="true"]:focus-visible{background:#a7d4b5}
.vx-lang-option-label{flex:1;min-width:0;white-space:nowrap}
.vx-lang-check{font-size:16px;color:#216438;font-weight:900}
@media(max-width:380px){.vx-lang-menu{width:min(132px,calc(100vw - 16px))}}
`;
function installLanguageButtons(doc,selectors,readLocale,writeLocale){
 if(!selectors.length)return()=>{};
 const win=doc.defaultView||window;
 if(!doc.getElementById('vx-lang-style')){
  const style=doc.createElement('style');style.id='vx-lang-style';style.textContent=LANGUAGE_STYLE;doc.head.appendChild(style);
 }
 installFlagEngine(doc);
 const widgets=[];
 const withCountrySuperscript=(label,flag)=>{
  const country=doc.createElement('sup');
  country.className='vx-lang-country';
  country.textContent=flag.toUpperCase();
  country.setAttribute('aria-hidden','true');
  label.prepend(country);
 };
 const closeAll=()=>widgets.forEach(w=>w.close());
 for(const native of selectors){
  // Keep the existing native select synchronized with the four supported choices.
  for(const option of LANGUAGE_OPTIONS){
   if(![...native.options].some(existing=>existing.value===option.id)){
    const entry=doc.createElement('option');entry.value=option.id;entry.textContent=option.code;native.appendChild(entry);
   }
  }
  native.classList.add('vx-lang-native');native.tabIndex=-1;native.setAttribute('aria-hidden','true');
  const parent=native.parentElement;parent.setAttribute('translate','no');parent.setAttribute('data-vx-i18n-ignore','');
  const isLoginSelector=parent.classList.contains('vx-locale-login');
  const trigger=doc.createElement('button');trigger.type='button';trigger.className=isLoginSelector?'vx-lang-trigger vx-lang-trigger-login':'vx-lang-trigger';
  trigger.setAttribute('aria-label','Selecionar idioma');trigger.setAttribute('aria-haspopup','listbox');trigger.setAttribute('aria-expanded','false');trigger.setAttribute('translate','no');
  const flagHolder=doc.createElement('span');flagHolder.className='vx-lang-current-flag';
  const short=doc.createElement('span');short.className='vx-lang-name';
  const chevron=doc.createElementNS('http://www.w3.org/2000/svg','svg');
  chevron.setAttribute('viewBox','0 0 24 24');chevron.setAttribute('class','vx-lang-chevron');chevron.setAttribute('aria-hidden','true');chevron.innerHTML='<path d="m6 9 6 6 6-6" stroke="currentColor" stroke-width="2.1" fill="none" stroke-linecap="round" stroke-linejoin="round"/>';
  trigger.append(flagHolder,short,chevron);native.after(trigger);
  const menu=doc.createElement('div');menu.className=isLoginSelector?'vx-lang-menu vx-lang-menu-login':'vx-lang-menu';menu.setAttribute('role','listbox');menu.setAttribute('translate','no');menu.setAttribute('data-vx-i18n-ignore','');menu.hidden=true;
  const menuId=`vx-lang-menu-${widgets.length+1}`;menu.id=menuId;trigger.setAttribute('aria-controls',menuId);
  const rows=[];
  for(const option of LANGUAGE_OPTIONS){
   const item=doc.createElement('button');item.type='button';item.className='vx-lang-option';item.setAttribute('role','option');item.dataset.locale=option.id;
   const label=doc.createElement('span');label.className='vx-lang-option-label';
   const check=doc.createElement('span');check.className='vx-lang-check';check.textContent='✓';check.setAttribute('aria-hidden','true');
   item.append(createFlag(doc,option.flag),label,check);
   item.addEventListener('click',()=>{
    writeLocale(option.id);closeAll();trigger.focus();
   });
   menu.appendChild(item);rows.push({item,label,check,option});
  }
  doc.body.appendChild(menu);
  function position(){
   if(menu.hidden)return;
   if(isLoginSelector){
    const currentColor=win.getComputedStyle(trigger).color;
    menu.style.color=currentColor;
    rows.forEach(row=>row.item.style.color=currentColor);
   }
   const rect=trigger.getBoundingClientRect();
   const viewportW=win.innerWidth,viewportH=win.innerHeight;
   const desired=menu.scrollHeight;
   const below=viewportH-rect.bottom-7,above=rect.top-7;
   const upwards=below<desired&&above>below;
   const available=Math.max(90,upwards?above:below);
   const height=Math.min(desired,available);
   const width=Math.min(132,viewportW-16);
   menu.style.width=width+'px';menu.style.maxHeight=height+'px';
   menu.style.left=Math.max(8,Math.min(viewportW-width-8,rect.right-width))+'px';
   menu.style.top=(upwards?Math.max(8,rect.top-height-4):Math.min(viewportH-height-8,rect.bottom+7))+'px';
  }
  function close(){menu.hidden=true;trigger.setAttribute('aria-expanded','false')}
  trigger.addEventListener('click',()=>{
   if(!menu.hidden){close();return;}
   closeAll();menu.hidden=false;trigger.setAttribute('aria-expanded','true');position();
  });
  trigger.addEventListener('keydown',e=>{
   if(e.key==='ArrowDown'||e.key==='Enter'&&menu.hidden){
    e.preventDefault();if(menu.hidden)trigger.click();
    (rows.find(r=>r.option.id===readLocale())||rows[0]).item.focus();
   }
  });
  menu.addEventListener('keydown',e=>{
   if(e.key==='Escape'){e.preventDefault();close();trigger.focus()}
   if(e.key==='ArrowDown'||e.key==='ArrowUp'){
    e.preventDefault();const at=rows.findIndex(r=>r.item===doc.activeElement),step=e.key==='ArrowDown'?1:-1;
    rows[(at+step+rows.length)%rows.length].item.focus();
   }
  });
  widgets.push({trigger,menu,position,close,flagHolder,short,rows});
 }
 function render(locale){
  const selected=normalizeLocale(locale),index=LOCALES.indexOf(selected);
  const current=LANGUAGE_OPTIONS.find(x=>x.id===selected)||LANGUAGE_OPTIONS[0];
  for(const w of widgets){
   w.flagHolder.replaceChildren(createFlag(doc,current.flag));w.short.textContent=current.code;
   withCountrySuperscript(w.short,current.flag);
   w.trigger.setAttribute('aria-label',`Idioma: ${current.names[index]}`);
   for(const row of w.rows){
    row.label.textContent=row.option.code;
    withCountrySuperscript(row.label,row.option.flag);
    row.item.setAttribute('aria-label',row.option.names[index]);
    const selectedRow=row.option.id===selected;
    row.item.setAttribute('aria-selected',String(selectedRow));row.check.hidden=!selectedRow;
   }
  }
 }
 function onPointer(event){
  if(!widgets.some(w=>w.trigger.contains(event.target)||w.menu.contains(event.target)))closeAll();
 }
 function onKey(event){if(event.key==='Escape')closeAll()}
 doc.addEventListener('pointerdown',onPointer);
 doc.addEventListener('keydown',onKey);
 win.addEventListener('resize',()=>widgets.forEach(w=>w.position()));
 win.addEventListener('scroll',()=>widgets.forEach(w=>w.position()),true);
 render(readLocale());
 return {render,closeAll};
}

/** UI localization: translates interface labels, never editable field values or user-table cells. */
export function installI18n(doc=document){
 const win=doc.defaultView||window;
 // A página pode importar este módulo por mais de um ponto. Inicializar uma única vez
 // evita duplicar os seletores visuais de idioma e seus menus.
 if(win.__vxI18nCleanup)return win.__vxI18nCleanup;
 const sourceNodes=new WeakMap(), sourceAttrs=new WeakMap();
 let language=DEFAULT_LOCALE;
 try{language=normalizeLocale(win.localStorage.getItem('vx.ui.locale'));}catch(_){/* Optional browser storage. */}
 const selectors=[...doc.querySelectorAll('[data-vx-language]')];
 const forbidden='script,style,svg,math,template,textarea,pre,code,[contenteditable],[data-vx-i18n-ignore],[data-vx-user-data]';
 function available(element){
  if(!element||element.closest(forbidden))return false;
  const cell=element.closest('td');
  if(cell&&!element.closest('[data-vx-ui-text]'))return false;
  // Dynamic catalogue values may resemble UI labels, and must be preserved.
  const option=element.closest('option');
  if(option){
   const value=String(option.value||'');
   if(/^[0-9a-f]{10,}$/i.test(value)||/^rec_[a-z0-9_-]{8,}$/i.test(value))return false;
  }
  return true;
 }
 function updateNode(node){
  const parent=node.parentElement;
  if(!available(parent))return;
  const present=String(node.nodeValue||'');
  const current=canonical(present);
  if(!current)return;
  const countryLabel=!!parent.closest('[data-vx-country-label]');
  const recognized=value=>sourceExists(value)||(countryLabel&&isKnownCountry(value));
  let source=sourceNodes.get(node);
  if(source){
   const known=countryLabel
    ?[source,...LOCALES.filter(l=>l!==DEFAULT_LOCALE).map(l=>canonical(formatCountryName(source,l)))]
    :[source,...LOCALES.filter(l=>l!==DEFAULT_LOCALE).map(l=>canonical(translateText(source,l)))];
   if(!known.includes(current)){
    source=recognized(current)?current:null;
    if(source)sourceNodes.set(node,source);
    else{sourceNodes.delete(node);return;}
   }
  } else if(recognized(current)){
   source=current;sourceNodes.set(node,source);
  }
  if(!source)return;
  const output=language==='pt-BR'?source:canonical(countryLabel?formatCountryName(source,language):translateText(source,language));
  const prefix=present.match(/^\s*/)?.[0]||'';
  const suffix=present.match(/\s*$/)?.[0]||'';
  const proposed=prefix+output+suffix;
  if(present!==proposed)node.nodeValue=proposed;
 }
 function updateAttributes(element){
  if(!available(element))return;
  const attrs=['aria-label','aria-description','placeholder','alt','data-tooltip'];
  if(element.matches('input[type=button],input[type=reset],input[type=submit]'))attrs.push('value');
  for(const attr of attrs){
   if(!element.hasAttribute(attr))continue;
   const current=element.getAttribute(attr);
   const canonicalCurrent=canonical(current);
   let source=sourceAttrs.get(element)?.[attr];
   if(source&&![source,...LOCALES.filter(l=>l!==DEFAULT_LOCALE).map(l=>canonical(translateText(source,l)))].includes(canonicalCurrent))source=null;
   if(!source&&sourceExists(canonicalCurrent))source=canonicalCurrent;
   if(!source)continue;
   const record=sourceAttrs.get(element)||{};record[attr]=source;sourceAttrs.set(element,record);
   const target=language==='pt-BR'?source:canonical(translateText(source,language));
   if(current!==target)element.setAttribute(attr,target);
  }
 }
 function process(subtree){
  if(!subtree)return;
  if(subtree.nodeType===3){updateNode(subtree);return;}
  if(subtree.nodeType!==1)return;
  if(!available(subtree))return;
  updateAttributes(subtree);
  const walker=doc.createTreeWalker(subtree,win.NodeFilter.SHOW_ELEMENT|win.NodeFilter.SHOW_TEXT);
  while(walker.nextNode()){
   const n=walker.currentNode;
   if(n.nodeType===3)updateNode(n);
   else updateAttributes(n);
  }
 }
 const originalTitle=doc.title;
 function setLocale(next){
  language=normalizeLocale(next);
  doc.documentElement.lang=language;
  for(const picker of selectors)picker.value=language;
  buttonWidgets?.render(language);
  try{win.localStorage.setItem('vx.ui.locale',language);}catch(_){/* Optional browser storage. */}
  process(doc.body);
  try{doc.dispatchEvent(new CustomEvent('vx:localechange',{detail:{locale:language}}));}catch(_){}
  if(sourceExists(originalTitle))doc.title=language==='pt-BR'?originalTitle:translateText(originalTitle,language);
  return language;
 }
 const buttonWidgets=installLanguageButtons(doc,selectors,()=>language,setLocale);
 for(const selector of selectors)selector.addEventListener('change',()=>setLocale(selector.value));
 setLocale(language);
 const queued=new Set();let scheduled=false;
 function flush(){
  scheduled=false;
  const pending=[...queued];queued.clear();
  for(const item of pending)process(item);
 }
 const observer=new win.MutationObserver(records=>{
  for(const record of records){
   if(record.type==='characterData')queued.add(record.target);
   else if(record.type==='attributes')queued.add(record.target);
   else for(const node of record.addedNodes)queued.add(node);
  }
  if(!scheduled&&queued.size){scheduled=true;win.queueMicrotask(flush);}
 });
 observer.observe(doc.body,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['aria-label','aria-description','placeholder','alt','data-tooltip','value']});
 win.VXI18n=Object.freeze({get locale(){return language;},setLocale,translate:(value)=>translateText(value,language),date:(value)=>formatDate(value,language),dateTime:(value,options)=>formatDateTime(value,language,options),currency:(value,currency)=>formatCurrency(value,language,currency),number:(value,options)=>formatNumber(value,language,options),month:(index,style)=>formatMonthName(index,language,style),weekday:(index,style)=>formatWeekdayName(index,language,style),country:(value)=>formatCountryName(value,language),coveredLabels:COVERED_LABELS});
 const cleanup=()=>{observer.disconnect();queued.clear();};
 win.__vxI18nCleanup=cleanup;
 return cleanup;
}

/**
 * Tooltip visual único do VeloX.
 * Converte títulos nativos em dicas próprias, preserva dicas específicas já
 * existentes e atende mouse, teclado, idiomas e componentes inseridos depois.
 */
function installVeloXTooltips(doc){
 if(!doc?.body||doc.getElementById('vx-tooltip-layer'))return;
 const win=doc.defaultView||window;
 // app.html and index.html already install the single pointer-only tooltip controller.
 // Do not start a second focus-driven tooltip manager on the same page.
 if(win.__vxGlobalTooltipManager)return;
 const style=doc.createElement('style');
 style.id='vx-tooltip-styles';
 style.textContent=`
  #vx-tooltip-layer{position:fixed;z-index:10050;max-width:min(280px,calc(100vw - 20px));padding:7px 10px;border:1px solid #315d42;border-radius:7px;background:#173d29;color:#fff;font:600 11px/1.45 Inter,"Segoe UI",Arial,sans-serif;letter-spacing:.01em;box-shadow:0 7px 20px rgba(12,35,20,.22);pointer-events:none;white-space:normal;overflow-wrap:anywhere;opacity:0;visibility:hidden;transform:translateY(3px);transition:opacity .14s ease,transform .14s ease,visibility .14s}
  #vx-tooltip-layer[data-visible="true"]{opacity:1;visibility:visible;transform:translateY(0)}
  #vx-tooltip-layer::after{content:"";position:absolute;width:7px;height:7px;background:#173d29;transform:rotate(45deg)}
  #vx-tooltip-layer[data-placement="top"]::after{left:calc(50% - 4px);bottom:-4px;border-right:1px solid #315d42;border-bottom:1px solid #315d42}
  #vx-tooltip-layer[data-placement="bottom"]::after{left:calc(50% - 4px);top:-4px;border-left:1px solid #315d42;border-top:1px solid #315d42}
  #vx-tooltip-layer[data-placement="right"]::after{left:-4px;top:calc(50% - 4px);border-left:1px solid #315d42;border-bottom:1px solid #315d42}
  #vx-tooltip-layer[data-placement="left"]::after{right:-4px;top:calc(50% - 4px);border-right:1px solid #315d42;border-top:1px solid #315d42}
  @media(prefers-reduced-motion:reduce){#vx-tooltip-layer{transition:none}}
 `;
 doc.head?.appendChild(style);
 const tip=doc.createElement('div');
 tip.id='vx-tooltip-layer';
 tip.setAttribute('role','tooltip');
 tip.hidden=true;
 doc.body.appendChild(tip);
 const selector='[data-tooltip]';
 let hovered=null,focused=null,active=null,timer=null,sequence=0;
 const described=new WeakMap();
 const isCompactNav=target=>!!target?.closest('.sidebar .nav-item')&&
  !!win.matchMedia?.('(min-width: 761px)').matches&&doc.body.classList.contains('collapsed');
 function hasDedicatedTooltip(target){
  const ids=String(target.getAttribute('aria-describedby')||'').split(/\s+/).filter(Boolean);
  return ids.some(id=>id!==tip.id&&doc.getElementById(id)?.getAttribute('role')==='tooltip');
 }
 function migrateTitle(element){
  if(!element||element.nodeType!==1||!element.hasAttribute('title'))return;
  const value=String(element.getAttribute('title')||'').trim();
  if(value&&!element.hasAttribute('data-tooltip')&&!hasDedicatedTooltip(element)){
   element.setAttribute('data-tooltip',value);
  }
  element.removeAttribute('title');
 }
 function migrateTree(root){
  if(!root||root.nodeType!==1)return;
  migrateTitle(root);
  root.querySelectorAll?.('[title]').forEach(migrateTitle);
 }
 migrateTree(doc.documentElement);
 function canShow(target){
  if(!target?.isConnected||!target.matches(selector))return false;
  if(target.closest('[hidden],[aria-hidden="true"]'))return false;
  if(target.matches(':disabled,[aria-disabled="true"]'))return false;
  if(target.closest('.sidebar .nav-item')&&!isCompactNav(target))return false;
  if(hasDedicatedTooltip(target))return false;
  return !!String(target.getAttribute('data-tooltip')||'').trim();
 }
 function addDescription(target){
  const tokens=String(target.getAttribute('aria-describedby')||'').split(/\s+/).filter(Boolean);
  if(!tokens.includes(tip.id)){
   tokens.push(tip.id);target.setAttribute('aria-describedby',tokens.join(' '));described.set(target,true);
  }
 }
 function removeDescription(target){
  if(!target||!described.get(target))return;
  const tokens=String(target.getAttribute('aria-describedby')||'').split(/\s+/).filter(id=>id&&id!==tip.id);
  if(tokens.length)target.setAttribute('aria-describedby',tokens.join(' '));
  else target.removeAttribute('aria-describedby');
  described.delete(target);
 }
 function hide(){
  clearTimeout(timer);timer=null;sequence++;
  if(active)removeDescription(active);
  active=null;tip.hidden=true;tip.removeAttribute('data-visible');
 }
 function place(target){
  if(!active||active!==target||!target.isConnected){hide();return;}
  const rect=target.getBoundingClientRect(),box=tip.getBoundingClientRect(),pad=8,gap=9;
  const vw=win.innerWidth||doc.documentElement.clientWidth,vh=win.innerHeight||doc.documentElement.clientHeight;
  let left,top,placement='top';
  if(isCompactNav(target)){
   left=rect.right+gap;top=rect.top+(rect.height-box.height)/2;placement='right';
   if(left+box.width>vw-pad){left=rect.left-box.width-gap;placement='left';}
  }else{
   left=rect.left+(rect.width-box.width)/2;top=rect.top-box.height-gap;
   if(top<pad){top=rect.bottom+gap;placement='bottom';}
  }
  left=Math.max(pad,Math.min(left,vw-box.width-pad));
  top=Math.max(pad,Math.min(top,vh-box.height-pad));
  tip.dataset.placement=placement;tip.style.left=Math.round(left)+'px';tip.style.top=Math.round(top)+'px';
 }
 function show(target,delay=0){
  clearTimeout(timer);
  if(active&&active!==target)hide();
  if(!canShow(target)){hide();return;}
  const ticket=++sequence;
  const run=()=>{
   if(ticket!==sequence||!canShow(target))return;
   if(active&&active!==target)removeDescription(active);
   active=target;tip.textContent=String(target.getAttribute('data-tooltip')||'').trim();
   tip.hidden=false;tip.dataset.visible='true';addDescription(target);place(target);
  };
  if(delay)timer=win.setTimeout(run,delay);else run();
 }
 function targetFrom(event){
  const origin=event.target?.nodeType===1?event.target:event.target?.parentElement;
  return origin?.closest?.(selector)||null;
 }
 doc.addEventListener('pointerover',event=>{
  if(event.pointerType==='touch')return;
  const target=targetFrom(event);if(!target)return;
  if(event.relatedTarget&&target.contains(event.relatedTarget))return;
  hovered=target;show(target,350);
 },true);
 doc.addEventListener('pointerout',event=>{
  const target=targetFrom(event);if(!target)return;
  if(event.relatedTarget&&target.contains(event.relatedTarget))return;
  if(hovered===target)hovered=null;
  if(focused===target){show(target);return;}
  if(active===target||(!hovered&&!focused))hide();
 },true);
 doc.addEventListener('focusin',event=>{
  const target=targetFrom(event);if(!target)return;
  focused=target;show(target);
 },true);
 doc.addEventListener('focusout',event=>{
  const target=targetFrom(event);if(!target)return;
  if(focused===target)focused=null;
  if(hovered===target){show(target,120);return;}
  if(active===target||(!hovered&&!focused))hide();
 },true);
 doc.addEventListener('keydown',event=>{if(event.key==='Escape')hide();},true);
 win.addEventListener('scroll',()=>{if(active)place(active);},true);
 win.addEventListener('resize',()=>{if(active)place(active);},{passive:true});
 win.addEventListener('blur',hide);
 const observer=new win.MutationObserver(records=>{
  for(const record of records){
   if(record.type==='attributes'){
    if(record.attributeName==='title')migrateTitle(record.target);
    else if(record.attributeName==='data-tooltip'&&record.target===active){
     const next=String(active.getAttribute('data-tooltip')||'').trim();
     if(next){tip.textContent=next;place(active);}else hide();
    }
   }else{
    for(const node of record.addedNodes)if(node.nodeType===1)migrateTree(node);
   }
  }
  if(active&&!active.isConnected)hide();
 });
 observer.observe(doc.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['title','data-tooltip']});
 return ()=>{hide();observer.disconnect();style.remove();tip.remove();};
}

if(typeof document!=='undefined'){
 const boot=()=>{installVeloXTooltips(document);installI18n(document);};
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
 else boot();
}


