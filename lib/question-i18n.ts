import { SECTIONS } from "./questions";
import type { Locale } from "./i18n";
import type { Question, Section } from "./types";

type QuestionCopy = Partial<Pick<Question, "label" | "hint" | "placeholder">> & {
  options?: Record<string, string>;
};

type SectionCopy = {
  title: string;
  eyebrow: string;
  description: string;
  questions: Record<string, QuestionCopy>;
};

const es: Record<string, SectionCopy> = {
  "getting-started": {
    title: "Nombre de la idea y titularidad",
    eyebrow: "Sección 1 de 7",
    description:
      "Asigne un nombre de trabajo a la idea, registre quién la posee y si ya existen solicitudes relacionadas. Esta es la divulgación confidencial de invención que se usa antes de involucrar a la asesoría jurídica.",
    questions: {
      title: {
        label: "Nombre de la idea",
        placeholder: "Un nombre breve y específico para la idea",
      },
      companyName: { label: "Nombre de la empresa" },
      patentabilitySearch: {
        label: "¿Debe realizarse una búsqueda de patentabilidad?",
        hint: "Una búsqueda para determinar si otros ya divulgaron o usaron públicamente la invención.",
      },
      freedomToOperate: {
        label: "¿Debe realizarse una búsqueda de libertad de operación?",
        hint: "Una búsqueda para determinar si patentes de terceros se infringirían si Scotiabank explota la invención.",
      },
      priorFilings: {
        label:
          "¿Ya se han presentado solicitudes de patente o diseños industriales relacionados con esta invención en Canadá u otro país?",
        hint: "Si es así, incluya los números de solicitud.",
        placeholder: "No, o liste países y números de solicitud",
      },
      ownerLicensee: {
        label: "¿Quién será titular o licenciatario de la invención?",
        placeholder: "p. ej. The Bank of Nova Scotia",
      },
      entityType: {
        label: "¿Scotiabank o un posible licenciatario es alguno de los siguientes?",
        options: {
          over500: "Una empresa con más de 500 empleados",
          charity: "Una organización benéfica",
          university: "Una universidad",
        },
      },
      outsideContractors: {
        label:
          "¿Participaron contratistas externos, estudiantes, una universidad u otra empresa en la invención?",
        hint: "Si es así, proporcione información de contacto.",
        placeholder: "No, o liste nombres y contactos",
      },
      outsideFunding: {
        label:
          "¿El trabajo fue financiado por alguien distinto de Scotiabank (subvención gubernamental, universidad, otra empresa, joint venture)?",
        hint: "Si es así, detalle el acuerdo bajo el cual se otorgó el financiamiento.",
      },
      internalProject: {
        label:
          "Nombre del proyecto interno, si existe, o del producto al que se relaciona la invención",
      },
    },
  },
  timeline: {
    title: "Cronología y registros",
    eyebrow: "Sección 2 de 7",
    description:
      "Las fechas de concepción y de reducción a la práctica importan. Conserve registros fechados. Las notas del formulario de divulgación aparecen bajo cada pregunta.",
    questions: {
      conceptionDate: {
        label: "Fecha en que tuvo por primera vez la idea que llevó a la invención",
        hint: "Esta es la fecha de concepción: cuando se formó una idea definida y permanente de la invención completa y operativa. Conserve bitácoras de investigación y notas internas.",
      },
      reductionDate: {
        label:
          "Fecha, si existe, en que la idea se redujo por primera vez a una realización física funcional",
        hint: "Fecha de reducción efectiva a la práctica: cuando el concepto se incorporó a una forma física (o implementada) viable.",
      },
      reverseEngineer: {
        label:
          "¿Puede la invención someterse a ingeniería inversa? Si no, ¿podría mantenerse como secreto comercial?",
      },
      firstDescriptionDate: {
        label: "Fecha de la primera descripción escrita o dibujos",
      },
      signedDated: {
        label: "¿La primera descripción escrita y los dibujos están firmados y fechados?",
      },
      labRecords: {
        label: "La invención también está descrita en un cuaderno de laboratorio u otros registros identificados",
        placeholder: "Número de cuaderno, página de Confluence, repositorio, IDs de tickets",
      },
      customerRequested: {
        label:
          "¿La invención fue solicitada por un cliente, distribuidor u otra persona no empleada por Scotiabank?",
        hint: "Si es así, ¿quién la solicitó?",
      },
      thirdPartyProduct: {
        label:
          "¿Usó o incorporó un producto o proceso de otro al inventar esto?",
      },
    },
  },
  disclosure: {
    title: "Divulgación pública y uso",
    eyebrow: "Sección 3 de 7",
    description:
      "Puede haber publicación al compartir una descripción con un solo miembro del público sin confidencialidad. Ventas, demostraciones y artículos cuentan. Este es un factor central de evaluación.",
    questions: {
      disclosedAnyone: {
        label: "¿Se ha divulgado la invención a alguien? Si es así, ¿cuándo y dónde?",
        hint: "Una divulgación puede ser oral, escrita, electrónica, una demostración o una venta.",
      },
      disclosedToWhom: { label: "¿A quién se ha divulgado la invención?" },
      writtenPublication: {
        label: "¿Alguna parte de la invención se ha descrito en una publicación escrita?",
        hint: "Si es así, indique cuándo.",
      },
      plannedPublication: {
        label: "¿Hay planes de publicación escrita que describa la invención?",
        hint: "Si es así, incluya la fecha prevista.",
      },
      shownOrSold: {
        label:
          "¿Alguna parte de la invención se ha publicado, mostrado, anunciado, ofrecido en venta o vendido?",
        hint: "Si es así, ¿cuándo, dónde y a quién?",
      },
      plannedMarketing: {
        label:
          "¿Hay planes de publicar, comercializar, mostrar, anunciar, ofrecer o vender?",
        hint: "Si es así, incluya la fecha prevista.",
      },
      offerForSale: {
        label: "¿Ha habido una oferta de venta? Si es así, ¿cuándo, dónde y a quién?",
        hint: "La confidencialidad de una venta no es relevante para esta pregunta.",
      },
      usedAnywhere: {
        label: "¿Se ha usado la invención en algún lugar? Si es así, ¿cuándo y dónde?",
      },
    },
  },
  invention: {
    title: "La invención",
    eyebrow: "Sección 4 de 7",
    description:
      "Describa qué es nuevo, por qué es mejor, cómo interactúan las partes y qué es previo. No se limite a un prototipo. Los métodos y procesos también pueden ser patentables, al igual que los sistemas.",
    questions: {
      problemsSolved: {
        label: "Identifique los problemas que resuelve la invención o idea",
        hint: "Describa los problemas actuales, dificultades y desventajas de los enfoques conocidos (engorrosos, costosos, propensos a fallar, ineficientes).",
      },
      howOvercomes: {
        label:
          "Describa cómo la invención supera esos problemas, cómo se descubrió y cualquier otro uso (incluso en campos no relacionados)",
      },
      structureOperation: {
        label:
          "Describa la estructura, construcción o fabricación, y el funcionamiento de la invención",
        hint: "Incluya esquemas, diagramas de bloques, flujogramas y detalle de implementación. Para software, describa hardware/software, datos almacenados o transformados y cualquier efecto en el mundo físico. Explique por qué se requiere una computadora.",
      },
      alternativeDesigns: {
        label:
          "¿Puede pensar en otra forma de obtener las ventajas de esta característica con un diseño distinto? Si es así, ¿cómo?",
      },
      additionalFunding: {
        label: "Si tuviera financiamiento adicional, ¿cómo cambiaría o mejoraría la invención?",
      },
    },
  },
  "prior-art": {
    title: "Estado de la técnica y competencia",
    eyebrow: "Sección 5 de 7",
    description:
      "Es tan importante señalar lo que no forma parte de su invención como explicar qué es nuevo. Nombre la tecnología competidora y quién la posee.",
    questions: {
      priorSolutions: {
        label:
          "Identifique soluciones previas a los problemas, si las hay, y sus desventajas. Si no hay, describa la tecnología existente.",
        hint: "Incluya productos de la empresa o de competidores, publicaciones y patentes, comercializados o no.",
      },
      competingTech: {
        label:
          "¿Qué tecnología competiría con la invención? ¿Quién la fabrica, vende o posee? ¿En qué es mejor o diferente esta invención?",
      },
      advantages: {
        label:
          "Identifique ventajas y diferencias de la invención respecto de lo que se ha intentado o ya se conoce",
        hint: "Evite decir que es simplemente “mejor”. Explique por qué y qué la hace diferente.",
      },
      similarPatents: {
        label:
          "¿Conoce patentes, documentos u otra información que divulguen un producto o proceso similar?",
      },
      detectUse: {
        label:
          "Describa cómo Scotiabank detectaría el uso de la invención por competidores u otros terceros",
      },
    },
  },
  business: {
    title: "Caso de negocio y evaluación",
    eyebrow: "Sección 6 de 7",
    description:
      "Estas respuestas alimentan el modelo de seis factores: novedad, desarrollo, divulgación pública, ingresos, reputación y riesgo de copia por competidores.",
    questions: {
      category: {
        label: "¿En qué categoría encaja esta idea?",
        options: {
          ai: "IA / aprendizaje automático",
          blockchain: "Cadena de bloques / registro distribuido",
          uiux: "UI / UX",
          payments: "Pagos / movimiento de dinero",
          risk: "Riesgo, fraude o cumplimiento",
          data: "Datos, analítica o infraestructura",
          process: "Proceso, operaciones u otro",
        },
      },
      plainLanguageIdea: {
        label: "Describa la idea en lenguaje sencillo",
        hint: "Asuma que el lector no está en su equipo.",
      },
      filingPurpose: {
        label: "¿Cuál es el propósito de negocio de presentar una solicitud de patente?",
        hint: "Por ejemplo: demandar a terceros, bloquear competidores, comercializar un producto o servicio, obtener financiamiento o subvenciones.",
      },
      costsAssessed: {
        label:
          "¿Se han evaluado los costos esperados de desarrollo, los ingresos potenciales y aspectos económicos similares?",
      },
      revenueImpact: {
        label: "¿Es probable que los ingresos anuales de la mejora superen 1 millón CAD?",
        options: {
          yes: "Sí — probablemente más de 1 millón al año",
          maybe: "Posiblemente — depende de la adopción",
          no: "No — probablemente menos de 1 millón",
          unknown: "Aún no se ha evaluado",
        },
      },
      revenueDetail: { label: "Explique la oportunidad de ingresos o de ahorro de costos" },
      reputationHelp: {
        label: "¿Es probable que esto ayude a la reputación de Scotiabank?",
        options: {
          yes: "Sí — claramente positivo para la marca",
          somewhat: "En cierta medida — valor incremental de marca",
          neutral: "Neutral / solo interno",
          no: "No — efecto reputacional limitado o negativo",
        },
      },
      reputationDetail: {
        label: "¿Cómo ayudaría (o no) esto a la reputación de Scotiabank?",
      },
      competitorCopy: {
        label: "¿Es probable que un competidor quiera copiarlo?",
        options: {
          yes: "Sí — los competidores querrían esto",
          possibly: "Posiblemente — algunos lo harían",
          no: "No — es poco probable que se copie",
        },
      },
      productIntent: {
        label:
          "¿La invención está actualmente destinada a incorporarse a algún producto o servicio de Scotiabank?",
        hint: "Si es así, proporcione detalles, incluida la fecha prevista de lanzamiento.",
      },
      competitorsWant: {
        label:
          "¿Qué competidores querrían usar esta invención? ¿Cómo podrían rediseñarla para evitar copiarla (incluya versiones inferiores)?",
      },
    },
  },
  affirmation: {
    title: "Afirmación del inventor",
    eyebrow: "Sección 7 de 7",
    description:
      "Usted afirma que, a su leal saber y entender, esta divulgación describe una invención original y que todas las personas que podrían reclamar titularidad están identificadas.",
    questions: {},
  },
};

function localizeQuestion(question: Question, copy?: QuestionCopy): Question {
  if (!copy) return question;
  return {
    ...question,
    label: copy.label ?? question.label,
    hint: copy.hint ?? question.hint,
    placeholder: copy.placeholder ?? question.placeholder,
    options: question.options?.map((option) => ({
      ...option,
      label: copy.options?.[option.value] ?? option.label,
    })),
  };
}

export function localizedSections(locale: Locale): Section[] {
  if (locale !== "es") return SECTIONS;
  return SECTIONS.map((section) => {
    const copy = es[section.id];
    if (!copy) return section;
    return {
      ...section,
      title: copy.title,
      eyebrow: copy.eyebrow,
      description: copy.description,
      questions: section.questions.map((question) =>
        localizeQuestion(question, copy.questions[question.id]),
      ),
    };
  });
}

export function localizedSectionTitle(locale: Locale, sectionId: string, fallback: string): string {
  if (locale !== "es") return fallback;
  return es[sectionId]?.title ?? fallback;
}
