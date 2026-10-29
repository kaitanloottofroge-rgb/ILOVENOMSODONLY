// Vercel Serverless Function -> /api/chat
// ลอง Gemini ก่อน ถ้าไม่ได้ จะสำรองด้วย Groq อัตโนมัติ

const GEMINI_KEY = process.env.GEMINI_API_KEY || "AQ.Ab8RN6LlBK29NaGQpv59DDWUk1ZW-OUPkSWJJZj-2Lq_RUZJdw";
const GROQ_KEY = process.env.GROQ_API_KEY || "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";

const PERSONA = "คุณคือ 'นมสด' ผู้หญิงที่เป็น AI ลงท้ายค่ะ/คะ น่ารัก สดใส ขี้เล่น ตอบได้ทุกเรื่อง ทั้งความรู้ทั่วไป คำแนะนำ และคุยเล่นหรือจีบกันเบาๆ แบบสุภาพไม่ล่วงเกิน ตอบสั้นกระชับ ต้องตอบเป็นภาษาไทยทั้งหมดเสมอ ไม่ว่าผู้ใช้จะพิมพ์ภาษาอะไร ห้ามตอบเป็นภาษาอื่น ถ้าถูกถามว่าเป็นใคร ให้บอกว่าชื่อนมสดและเป็น AI";

// key ขึ้นต้น AQ. ใช้กับ Vertex AI, ขึ้นต้น AIza ใช้กับ Gemini API ปกติ
async function askGemini(history) {
  const isVertex = GEMINI_KEY.startsWith("AQ.");
  const url = isVertex
    ? "https://aiplatform.googleapis.com/v1/publishers/google/models/gemini-2.5-flash:generateContent?key=" + encodeURIComponent(GEMINI_KEY)
    : "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=" + encodeURIComponent(GEMINI_KEY);

  const r = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: PERSONA }] },
      contents: history.map(m => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }]
      })),
      generationConfig: { maxOutputTokens: 800 }
    })
  });
  if (!r.ok) throw new Error("gemini " + r.status + " " + (await r.text()).slice(0, 200));
  const data = await r.json();
  const text = (data.candidates?.[0]?.content?.parts || []).map(p => p.text || "").join("").trim();
  if (!text) throw new Error("gemini empty");
  return text;
}

async function askGroq(history) {
  const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: { "content-type": "application/json", authorization: "Bearer " + GROQ_KEY },
    body: JSON.stringify({
      model: "openai/gpt-oss-20b",
      reasoning_effort: "low",
      max_tokens: 1500,
      temperature: 0.8,
      messages: [{ role: "system", content: PERSONA }, ...history]
    })
  });
  if (!r.ok) throw new Error("groq " + r.status + " " + (await r.text()).slice(0, 200));
  const data = await r.json();
  const text = (data.choices?.[0]?.message?.content || "").trim();
  if (!text) throw new Error("groq empty");
  return text;
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });

  const raw = Array.isArray(req.body?.messages) ? req.body.messages : [];
  const history = raw
    .slice(-12)
    .filter(m => (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .map(m => ({ role: m.role, content: m.content.slice(0, 2000) }));

  if (!history.length || history[history.length - 1].role !== "user")
    return res.status(400).json({ error: "bad messages" });

  const errors = [];
  for (const ask of [askGemini, askGroq]) {
    try {
      return res.status(200).json({ reply: await ask(history) });
    } catch (e) {
      errors.push(e.message);
    }
  }
  return res.status(502).json({ error: "all failed", detail: errors.join(" | ").slice(0, 400) });
      }
