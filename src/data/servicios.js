/* ─────────────────────────────────────────────
   servicios.js · fuente única de contenido
   Usado por: Nav (dropdown), hub /servicios,
   subpáginas /servicios/[slug] y home.
   ───────────────────────────────────────────── */

/** Los 4 servicios principales (cada uno con su subpágina). */
export const servicios = [
  {
    slug: 'dashboards',
    label: 'Dashboards',
    cat: 'Visualización de datos',
    name: 'Dashboards y visualización',
    icon: '<path d="M3 3v18h18"/><path d="M7 14l3-3 3 2 5-6"/><path d="M7 18l3-1 3 1 5-3"/>',
    hook: 'Para negocios que tienen datos pero no tienen claridad.',
    title: 'Todo tu negocio en una sola pantalla.',
    positioning:
      'Tus datos viven en Excel, Sheets y formularios, pero no se usan para decidir. Los reunimos en un dashboard con KPIs, tendencias y alertas accionables.',
    panelInvite: 'Arrastra para ver el antes y el después →',
    para: 'Gerencias, equipos comerciales, operaciones, finanzas y marketing que hoy preparan reportes semanales o mensuales a mano.',
    perfiles: [
      {
        icon: '<path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4M10 10h4M10 14h4M10 18h4"/>',
        title: 'Gerencias y dirección',
        desc: 'Que hoy piden reportes a su equipo y reciben Excel con días de retraso.',
      },
      {
        icon: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
        title: 'Equipos operativos',
        desc: 'Comerciales, operaciones, finanzas y marketing con reportes manuales semanales.',
      },
    ],
    usos: [
      'Dashboard de ventas y desempeño comercial',
      'Dashboard de operaciones',
      'Seguimiento de clientes',
      'Monitoreo financiero',
      'Paneles de control de KPIs',
      'Dashboards de revisión mensual de negocio',
    ],
    usosIcons: [
      '<polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>',
      '<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>',
      '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><polyline points="16 11 18 13 22 9"/>',
      '<circle cx="8" cy="8" r="6"/><path d="M18.09 10.37A6 6 0 1 1 10.34 18"/><path d="M7 6h1v4"/><path d="m16.71 13.88.7.71-2.82 2.82"/>',
      '<path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/>',
      '<path d="M8 2v4M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/><path d="m9 16 2 2 4-4"/>',
    ],
    entregable:
      'Dashboard en Looker Studio, Power BI, Google Sheets o interfaz web a medida + Definición de KPIs con tu equipo desde cero + Limpieza y organización de datos antes de conectar + Filtros, Vistas y Segmentaciones personalizadas + Documentación del modelo de datos y fuentes conectadas + Capacitación al equipo para leer y operar el dashboard.',
    entregablesIcons: [
      '<line x1="12" x2="12" y1="20" y2="10"/><line x1="18" x2="18" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="16"/>',
      '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
      '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14a9 3 0 0 0 18 0V5"/><path d="M3 12a9 3 0 0 0 18 0"/>',
      '<line x1="4" x2="4" y1="21" y2="14"/><line x1="4" x2="4" y1="10" y2="3"/><line x1="12" x2="12" y1="21" y2="12"/><line x1="12" x2="12" y1="8" y2="3"/><line x1="20" x2="20" y1="21" y2="16"/><line x1="20" x2="20" y1="12" y2="3"/><line x1="2" x2="6" y1="14" y2="14"/><line x1="10" x2="14" y1="8" y2="8"/><line x1="18" x2="22" y1="16" y2="16"/>',
      '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v5h5"/><path d="M16 13H8M16 17H8M10 9H8"/>',
      '<path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>',
    ],
    metrics: [
      { value: '+30', label: 'dashboards activos', tone: 'purple' },
      { value: '−5 días', label: 'menos de retraso en reportes', tone: 'pink' },
      { value: '30 días', label: 'para ver retorno', tone: 'soft' },
    ],
    cta: 'Quiero ordenar mis datos',
    service: 'dashboard',
  },
  {
    slug: 'automatizacion',
    label: 'Automatización',
    cat: 'Automatización operativa',
    name: 'Automatización de procesos',
    icon: '<path d="M21 12a9 9 0 1 1-3-6.7"/><path d="M21 3v5h-5"/><circle cx="12" cy="12" r="3"/>',
    hook: 'Para equipos que pierden horas en trabajo manual repetitivo.',
    title: 'Deja que tus procesos trabajen solos.',
    positioning:
      'Tu equipo copia datos, envía correos y arma reportes a mano. Conectamos tus herramientas para que esos flujos corran solos, sin errores ni demoras.',
    panelInvite: 'Mira el flujo en movimiento →',
    para: 'Empresas con flujos repetitivos entre 2 o más herramientas: registro de leads, reportes manuales, alertas internas, seguimiento de clientes, operaciones administrativas o sincronización de datos.',
    usos: [
      'Captura automática de leads',
      'Notificaciones y correos automatizados',
      'Generación de reportes',
      'Flujos formulario → base de datos',
      'Actualización de CRM',
      'Recordatorios de seguimiento',
      'Alertas de error y flujos de aprobación',
    ],
    entregable:
      'Flujos n8n funcionando + Webhooks + Integraciones API + Validación de datos + Logs de error + Lógica de reintento cuando aplica + Documentación del flujo + Entrega operativa.',
    metrics: [
      { value: '+40', label: 'flujos entregados', tone: 'purple' },
      { value: '−80%', label: 'trabajo manual', tone: 'pink' },
      { value: '48 h', label: 'tiempo promedio de entrega', tone: 'soft' },
    ],
    cta: 'Quiero automatizar un proceso',
    service: 'automation',
  },
  {
    slug: 'agentes-ia',
    label: 'Agentes IA',
    cat: 'IA aplicada',
    name: 'Agentes IA para operación',
    icon: '<rect x="5" y="7" width="14" height="12" rx="2"/><path d="M9 7V4h6v3"/><path d="M9 12h0M15 12h0"/><path d="M9 16h6"/>',
    hook: 'Asistentes que hacen trabajo operativo real, no chatbots genéricos.',
    title: 'IA que ejecuta, no solo que responde.',
    positioning:
      'No chatbots genéricos: agentes conectados a tus herramientas que responden, clasifican, buscan, generan reportes y ejecutan acciones reales.',
    panelInvite: 'Mira al agente trabajar en tiempo real →',
    para: 'Soporte interno, equipos de ventas, operaciones, administración, flujos de investigación y procesos con alto volumen de documentos o consultas repetitivas.',
    usos: [
      'Asistente personal con IA',
      'Agente de soporte interno',
      'Copiloto de ventas',
      'Agente de investigación',
      'Clasificador de documentos',
      'Generador de reportes',
      'Asistente de respuesta de correos',
      'Agentes conectados a Sheets, Airtable, Gmail, Calendar, APIs o bases de datos',
    ],
    entregable:
      'Prompt maestro + Flujo del agente + Integraciones con herramientas + Base de conocimiento o memoria cuando aplica + Validación de salidas + Reglas anti-alucinación + Panel de monitoreo o logs + Documentación de uso.',
    metrics: [
      { value: '24/7', label: 'disponibilidad', tone: 'purple' },
      { value: '0 min', label: 'en coordinación', tone: 'pink' },
      { value: '−90%', label: 'errores manuales', tone: 'soft' },
    ],
    cta: 'Quiero un agente IA',
    service: 'ai-agent',
  },
  {
    slug: 'web-sistemas',
    label: 'Web y sistemas',
    cat: 'Presencia y sistemas',
    name: 'Websites y sistemas internos',
    icon: '<rect x="3" y="4" width="18" height="13" rx="2"/><path d="M3 9h18"/><path d="M8 21h8M12 17v4"/>',
    hook: 'Interfaces conectadas a tus datos, formularios y automatizaciones.',
    title: 'Una web a la medida de tu negocio, sea cual sea tu rubro.',
    positioning:
      'Desde cero o mejorando la que ya tienes (comercios, servicios, clínicas, estudios, restaurantes, profesionales). Diseño, estructura y conexión a tus datos y flujos.',
    panelInvite: 'Cambia de rubro y míralo →',
    para: 'Negocios que necesitan una web profesional de servicios, una landing enfocada en conversión, portales internos para equipos, o formularios conectados a flujos de trabajo.',
    usos: [
      'Landing page comercial',
      'Sitio web de servicios',
      'Página de captura de leads',
      'Sistema interno de solicitudes',
      'Mini CRM',
      'Formulario de intake de clientes',
      'Panel de operaciones',
      'Dashboard interno',
    ],
    entregable:
      'Web o landing responsive + Estructura clara de servicios + Formulario de contacto + Integración con WhatsApp + Analytics + SEO Básico + Conexión a base de datos o automatizaciones si aplica + Despliegue y entrega.',
    metrics: [
      { value: '+20', label: 'sistemas entregados', tone: 'purple' },
      { value: '100%', label: 'conectado a datos reales', tone: 'pink' },
      { value: '2 sem', label: 'tiempo promedio de entrega', tone: 'soft' },
    ],
    cta: 'Quiero mejorar mi presencia digital',
    service: 'web',
  },
];

/** Diagnóstico, punto de partida, destacado en el hub (no es un servicio del dropdown). */
export const diagnostico = {
  slug: 'diagnostico',
  cat: 'Punto de partida',
  name: 'Diagnóstico digital y roadmap',
  hook: 'Para quienes saben que su operación es ineficiente pero no saben qué resolver primero.',
  title: 'Para quienes saben que su operación es ineficiente, pero no saben qué resolver primero.',
  positioning:
    'Tienes procesos manuales, información dispersa, herramientas desconectadas o cuellos de botella, pero no sabes si necesitas un dashboard, una automatización, un agente IA o un sistema interno. Revisamos tu proceso actual, detectamos las tareas manuales, priorizamos oportunidades y te recomendamos la mejor solución.',
  para: 'Empresas iniciando su transformación digital, negocios con operaciones desordenadas, equipos con demasiadas hojas de cálculo y gerencias que necesitan una ruta clara antes de invertir.',
  usos: [
    'Mapa del proceso actual',
    'Detección de tareas manuales',
    'Evaluación de datos y herramientas',
    'Matriz de oportunidades',
    'Priorización impacto vs. esfuerzo',
    'Arquitectura de solución recomendada',
  ],
  entregable:
    'Mapa de procesos + matriz de oportunidades + priorización impacto/esfuerzo + arquitectura recomendada + roadmap de automatización + alcance estimado por fases.',
  cta: 'Quiero un diagnóstico digital',
  service: 'diagnosis',
};

/** Devuelve un servicio por slug. */
export const getServicio = (slug) => servicios.find((s) => s.slug === slug);
