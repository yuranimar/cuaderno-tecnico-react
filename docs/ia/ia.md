---
id: ia
title: Inteligencia Artificial para Developers
sidebar_label: Inteligencia Artificial
sidebar_position: 1
description: LLMs, Prompt Engineering, integración de APIs de IA en proyectos web, RAG, embeddings y herramientas del ecosistema actual.
tags: [ia, llm, prompt-engineering, openai, anthropic, rag, embeddings, python]
---

# Inteligencia Artificial para Developers

<span className="badge-tech">LLMs</span>
<span className="badge-tech">Prompt Engineering</span>
<span className="badge-tech">OpenAI API</span>
<span className="badge-tech">Claude API</span>
<span className="badge-tech">Python</span>
<span className="badge-tech">RAG</span>

---

## Mapa del territorio

```
Inteligencia Artificial (IA)
│
├── Machine Learning (ML) — aprender de datos
│   ├── Supervisado    → datos etiquetados → clasificación, regresión
│   ├── No supervisado → sin etiquetas     → clustering, reducción dimensional
│   └── Por refuerzo   → recompensa/penalización → juegos, robótica
│
├── Deep Learning — redes neuronales profundas
│   ├── CNN  → visión por computadora
│   ├── RNN / LSTM → secuencias, texto, series de tiempo
│   └── Transformers → base de los LLMs modernos
│
└── IA Generativa — crear contenido nuevo
    ├── Texto    → GPT-4o, Claude 3.5, Gemini 1.5
    ├── Imágenes → DALL-E 3, Midjourney, Stable Diffusion
    ├── Audio    → Whisper (STT), ElevenLabs (TTS)
    ├── Video    → Sora, Runway
    └── Código   → GitHub Copilot, Claude Code, Cursor
```

---

## Conceptos clave

| Término | Definición |
|---|---|
| **LLM** | Large Language Model — modelo entrenado en texto masivo para predecir el siguiente token |
| **Token** | Unidad mínima de texto que procesa el modelo (~¾ de una palabra en inglés) |
| **Contexto (Context Window)** | Cantidad máxima de tokens que el modelo puede "ver" a la vez |
| **Temperature** | Aleatoriedad de la respuesta (0 = determinístico, 1 = creativo) |
| **Top-p / Top-k** | Controlan la diversidad del muestreo de tokens |
| **Embedding** | Representación vectorial de texto en espacio n-dimensional |
| **Fine-tuning** | Reentrenar un modelo base con datos propios |
| **RAG** | Retrieval-Augmented Generation — buscar info relevante antes de generar |
| **Prompt** | Instrucción de texto que guía al modelo |
| **System prompt** | Instrucción de contexto/rol que el usuario no ve |
| **Hallucination** | El modelo genera información falsa pero con confianza |

---

## Modelos disponibles (2024-2025)

| Modelo | Empresa | Fortaleza | Context |
|---|---|---|---|
| **GPT-4o** | OpenAI | Multimodal, balanceado | 128K |
| **o1 / o3** | OpenAI | Razonamiento profundo (math, código) | 128K |
| **Claude 3.5 Sonnet** | Anthropic | Código, análisis, escritura técnica | 200K |
| **Claude 3 Opus** | Anthropic | Tareas complejas, máxima calidad | 200K |
| **Gemini 1.5 Pro** | Google | Contexto masivo, multimodal | 1M |
| **Llama 3.1** | Meta | Open source, self-hosted | 128K |
| **Mistral Large** | Mistral | Open source europeo | 128K |
| **DeepSeek-V3** | DeepSeek | Open source, muy eficiente | 64K |

---

## Prompt Engineering

<div className="concept-card">
<strong>📌 Prompt Engineering</strong>
El arte de diseñar instrucciones para obtener resultados consistentes, precisos y útiles de los modelos de lenguaje. No es magia — es especificidad, estructura y contexto.
</div>

### Anatomía de un prompt efectivo

```
[ROL]       Actúa como un arquitecto de software senior con 10 años de experiencia
            en Node.js y bases de datos relacionales.

[TAREA]     Revisa el siguiente código y encuentra todos los problemas de seguridad,
            rendimiento y mantenibilidad.

[CONTEXTO]  Es una API REST en Express.js que maneja autenticación de usuarios y
            procesa pagos. Está en producción con ~500 usuarios activos.

[RESTRICCIONES] No sugieras cambiar el stack tecnológico. Prioriza por severidad.

[FORMATO]   Responde con una lista numerada. Para cada problema incluye:
            - Severidad: CRÍTICO / ALTO / MEDIO / BAJO
            - Descripción del problema
            - Riesgo concreto
            - Solución con código de ejemplo

[INPUT]
```javascript
app.get('/user', (req, res) => {
  const id = req.query.id;
  db.query(`SELECT * FROM users WHERE id = ${id}`, (err, result) => {
    res.json(result);
  });
});
```
```

### Técnicas principales

**Zero-shot** — sin ejemplos
```
Clasifica este email como SPAM o NO SPAM:
"Ganaste $1,000,000. Haz clic aquí para reclamar."
```

**Few-shot** — con ejemplos
```
Clasifica el sentimiento de estos textos:
Email: "Excelente servicio, muy rápido" → POSITIVO
Email: "Tuve que esperar 3 horas" → NEGATIVO
Email: "El producto llegó bien embalado" → POSITIVO

Ahora clasifica:
Email: "La entrega fue correcta pero tardó más de lo esperado" → ?
```

**Chain of Thought (CoT)** — razonamiento paso a paso
```
Resuelve este problema. Piensa paso a paso antes de dar la respuesta final.

Problema: Un e-commerce tiene 150 pedidos pendientes. Cada operador
puede procesar 12 pedidos por hora. Si trabajan 8 horas, ¿cuántos
operadores necesitan para procesar todos los pedidos hoy?
```

**Role prompting**
```
Eres un revisor de código experto y muy estricto. Tu trabajo es encontrar
TODOS los problemas en el código que te muestro, sin excepción.
No te limites a los obvios. Actúa como si el código fuera a producción
con millones de usuarios.
```

### Errores comunes en prompts

```
❌ Vago:     "Ayúdame con mi código"
✅ Específico: "Refactoriza esta función en TypeScript para que use async/await
               en lugar de callbacks, manteniendo el mismo comportamiento"

❌ Sin formato: "Dame ideas para la app"
✅ Con formato: "Lista exactamente 5 funcionalidades para una app de logística,
                ordenadas por impacto para el usuario. Formato: número. nombre: descripción"

❌ Demasiado abierto: "Escribe algo sobre APIs"
✅ Con restricciones: "Explica qué es REST en máximo 3 párrafos, para un desarrollador
                       junior que ya conoce HTTP pero nunca ha diseñado una API"
```

---

## Integración con APIs de IA

### OpenAI API

```bash
npm install openai
```

```typescript title="lib/openai.ts"
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ── Completion básico ──────────────────────────────────────────
export const completar = async (prompt: string, systemPrompt?: string) => {
  const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [];

  if (systemPrompt) {
    messages.push({ role: 'system', content: systemPrompt });
  }
  messages.push({ role: 'user', content: prompt });

  const response = await openai.chat.completions.create({
    model:       'gpt-4o-mini',  // más barato para desarrollo
    messages,
    temperature: 0.7,
    max_tokens:  1000,
  });

  return response.choices[0].message.content;
};

// ── Streaming — respuesta en tiempo real ──────────────────────
export const completarStreaming = async (
  prompt: string,
  onChunk: (text: string) => void
) => {
  const stream = await openai.chat.completions.create({
    model:    'gpt-4o',
    messages: [{ role: 'user', content: prompt }],
    stream:   true,
  });

  for await (const chunk of stream) {
    const text = chunk.choices[0]?.delta?.content || '';
    if (text) onChunk(text);
  }
};

// ── JSON estructurado ─────────────────────────────────────────
export const extraerDatos = async <T>(texto: string, schema: string): Promise<T> => {
  const response = await openai.chat.completions.create({
    model:    'gpt-4o',
    messages: [
      {
        role: 'system',
        content: `Extrae información del texto y devuelve SOLO JSON válido con este schema: ${schema}. Sin texto adicional, sin markdown.`
      },
      { role: 'user', content: texto }
    ],
    temperature:    0,
    response_format: { type: 'json_object' },
  });

  return JSON.parse(response.choices[0].message.content!);
};
```

### Anthropic (Claude) API

```bash
npm install @anthropic-ai/sdk
```

```typescript title="lib/claude.ts"
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export const preguntarClaude = async (
  prompt: string,
  systemPrompt = 'Eres un asistente técnico experto. Responde en español.'
) => {
  const message = await anthropic.messages.create({
    model:      'claude-sonnet-4-6',
    max_tokens: 1024,
    system:     systemPrompt,
    messages:   [{ role: 'user', content: prompt }],
  });

  return (message.content[0] as { text: string }).text;
};

// ── Análisis de imagen ─────────────────────────────────────────
export const analizarImagen = async (imageBase64: string, pregunta: string) => {
  const message = await anthropic.messages.create({
    model:      'claude-sonnet-4-6',
    max_tokens: 1024,
    messages: [{
      role: 'user',
      content: [
        {
          type:   'image',
          source: { type: 'base64', media_type: 'image/jpeg', data: imageBase64 },
        },
        { type: 'text', text: pregunta },
      ],
    }],
  });

  return (message.content[0] as { text: string }).text;
};
```

---

## Embeddings y búsqueda semántica

Los embeddings son la base de la búsqueda semántica y RAG. Convierten texto en vectores numéricos donde textos similares quedan cerca en el espacio vectorial.

```typescript title="Búsqueda semántica de productos"
import OpenAI from 'openai';
import { supabase } from './supabase';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// 1. Generar embedding de un texto
const generarEmbedding = async (texto: string): Promise<number[]> => {
  const response = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: texto,
  });
  return response.data[0].embedding;
};

// 2. Indexar producto al crearlo
export const indexarProducto = async (producto: Producto) => {
  const texto = `${producto.nombre} ${producto.descripcion} ${producto.categoria}`;
  const embedding = await generarEmbedding(texto);

  await supabase.from('productos_embeddings').upsert({
    producto_id: producto.id,
    embedding,   // vector(1536) en Supabase con pgvector
  });
};

// 3. Búsqueda semántica
export const buscarProductos = async (consulta: string, limite = 5) => {
  const queryEmbedding = await generarEmbedding(consulta);

  const { data } = await supabase.rpc('buscar_productos_similares', {
    query_embedding: queryEmbedding,
    match_count:     limite,
  });

  return data;
};
```

```sql title="Función PostgreSQL para búsqueda vectorial (Supabase)"
-- Habilitar extensión pgvector
CREATE EXTENSION IF NOT EXISTS vector;

-- Tabla de embeddings
CREATE TABLE productos_embeddings (
  producto_id INT REFERENCES productos(id),
  embedding   vector(1536),
  PRIMARY KEY (producto_id)
);

-- Índice para búsqueda eficiente
CREATE INDEX ON productos_embeddings
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

-- Función de búsqueda
CREATE OR REPLACE FUNCTION buscar_productos_similares(
  query_embedding vector(1536),
  match_count     INT DEFAULT 5
)
RETURNS TABLE (
  producto_id INT,
  similitud   FLOAT
)
LANGUAGE SQL
AS $$
  SELECT
    producto_id,
    1 - (embedding <=> query_embedding) AS similitud
  FROM productos_embeddings
  ORDER BY embedding <=> query_embedding
  LIMIT match_count;
$$;
```

---

## RAG — Retrieval Augmented Generation

Patrón para hacer que un LLM responda sobre tus propios documentos sin necesidad de fine-tuning.

```
Usuario pregunta
      │
      ▼
Generar embedding de la pregunta
      │
      ▼
Buscar documentos similares en la BD vectorial
      │
      ▼
Construir prompt: [contexto recuperado] + [pregunta]
      │
      ▼
LLM genera respuesta basada en el contexto
      │
      ▼
Respuesta fundamentada (con fuentes)
```

```typescript title="RAG básico — chatbot sobre documentos"
export const preguntarSobreDocumentos = async (pregunta: string) => {
  // 1. Buscar fragmentos relevantes
  const fragmentos = await buscarFragmentos(pregunta, 3);

  if (!fragmentos.length) {
    return 'No encontré información relevante en los documentos.';
  }

  // 2. Construir contexto
  const contexto = fragmentos
    .map((f, i) => `[Fuente ${i + 1}: ${f.titulo}]\n${f.contenido}`)
    .join('\n\n---\n\n');

  // 3. Preguntarle al LLM con el contexto
  const prompt = `
Usa SOLO la siguiente información para responder la pregunta.
Si la respuesta no está en el contexto, di "No tengo esa información".

CONTEXTO:
${contexto}

PREGUNTA: ${pregunta}
  `;

  return await preguntarClaude(prompt, 'Eres un asistente que responde basándose en documentos.');
};
```

---

## IA en proyectos web — Casos de uso prácticos

### Generación de descripciones de productos

```typescript title="Caso real: Isamar • Tejidos y Crochet"
export const generarDescripcionProducto = async (producto: {
  nombre: string;
  materiales: string[];
  colores: string[];
  dimensiones?: string;
}) => {
  const prompt = `
Eres una experta en marketing para tiendas de artesanías y crochet.
Escribe una descripción de producto para una tienda colombiana.

Producto: ${producto.nombre}
Materiales: ${producto.materiales.join(', ')}
Colores disponibles: ${producto.colores.join(', ')}
${producto.dimensiones ? `Dimensiones: ${producto.dimensiones}` : ''}

Requisitos:
- 2 párrafos máximo
- Tono cálido y artesanal
- Menciona que es hecho a mano
- Termina con una llamada a la acción sutil
- En español colombiano, sin jerga
  `;

  return await preguntarClaude(prompt);
};
```

### Clasificación automática de pedidos de soporte

```typescript
export const clasificarTicket = async (mensaje: string) => {
  const resultado = await extraerDatos<{
    categoria: string;
    prioridad: 'baja' | 'media' | 'alta' | 'crítica';
    sentimiento: 'positivo' | 'neutro' | 'negativo' | 'frustrado';
    requiere_humano: boolean;
    resumen: string;
  }>(mensaje, `{
    "categoria": "envío | pago | producto | cuenta | otro",
    "prioridad": "baja | media | alta | crítica",
    "sentimiento": "positivo | neutro | negativo | frustrado",
    "requiere_humano": boolean,
    "resumen": "string de máximo 100 caracteres"
  }`);

  return resultado;
};
```

---

## Herramientas del ecosistema

### Para developers

| Herramienta | Categoría | Para qué |
|---|---|---|
| **GitHub Copilot** | IDE | Autocompletado de código contextual |
| **Cursor** | IDE completo | Chat + edición con IA integrada |
| **Claude Code** | CLI | Agentic coding en terminal |
| **v0 (Vercel)** | UI Generation | Generar componentes React con IA |
| **Codeium** | IDE (gratis) | Alternativa gratuita a Copilot |

### Para integrar en apps

| SDK / Framework | Lenguaje | Para qué |
|---|---|---|
| **openai** | JS / Python | API oficial de OpenAI |
| **@anthropic-ai/sdk** | JS / Python | API oficial de Anthropic |
| **LangChain** | JS / Python | Orquestar agentes y cadenas de LLMs |
| **LlamaIndex** | JS / Python | RAG y bases de conocimiento |
| **Vercel AI SDK** | TypeScript | Streaming de IA en apps Next.js |
| **Ollama** | Local | Correr LLMs open source en tu máquina |

### Bases de datos vectoriales

| BD | Tipo | Cuándo usar |
|---|---|---|
| **Supabase + pgvector** | SQL + vectorial | Ya usas Supabase — la opción más simple |
| **Pinecone** | Vectorial managed | Escala masiva, búsqueda ultra rápida |
| **Weaviate** | Vectorial open source | Self-hosted, datos privados |
| **Chroma** | Vectorial local | Desarrollo y prototipos |

---

## Consideraciones éticas y prácticas

:::caution Alucinaciones
Los LLMs pueden inventar información con total confianza. **Nunca** uses un LLM como fuente única para datos críticos (médicos, legales, financieros). Siempre valida con fuentes confiables o usa RAG con documentos verificados.
:::

:::danger Seguridad — Prompt Injection
Si permites que usuarios envíen texto que luego incluyes en un prompt, un atacante puede intentar "inyectar" instrucciones maliciosas. Sanitiza el input del usuario y nunca le des al LLM acceso a sistemas críticos sin validación humana intermedia.
:::

:::tip Costos
Monitorea el uso de tokens desde el primer día. `gpt-4o-mini` cuesta ~100x menos que `gpt-4o`. Usa modelos potentes solo donde el resultado justifica el costo — para clasificaciones simples, un modelo pequeño es suficiente.
:::
