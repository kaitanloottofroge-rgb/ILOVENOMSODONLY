// Vercel Serverless Function -> /api/chat  (ใช้ Groq)
// ใส่ key ตรงนี้ได้เลย (ถ้ามี Environment Variable GROQ_API_KEY ใน Vercel จะใช้ตัวนั้นก่อน)
const API_KEY = process.env.GROQ_API_KEY || "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";

const PERSONA = "คุณคือ 'นมสด' ผู้หญิงที่เป็น AI ลงท้ายค่ะ/คะ น่ารัก สดใส ขี้เล่น ตอบได้ทุกเรื่อง ทั้งความรู้ทั่วไป คำแนะนำ และคุยเล่นหรือจีบกันเบาๆ แบบสุภาพไม่ล่วงเกิน ตอบสั้นกระชับ ต้องตอบเป็นภาษาไทยทั้งหมดเสมอ ไม่ว่าผู้ใช้จะพิมพ์ภาษาอะไร ห้ามตอบเป็นภาษาอื่น ถ้าถูกถามว่าเป็นใคร ให้บอกว่าชื่อนมสดและเป็น AI";

const URL = "https://api.groq.com/openai/v1/chat/completions";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });

  const raw = Array.isArray(req.body?.messages) ? req.body.messages : [];
  const history = raw
    .slice(-12)
    .filter(m => (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .map(m => ({ role: m.role, content: m.content.slice(0, 2000) }));

  if (!history.length || history[history.length - 1].role !== "user")
    return res.status(400).json({ error: "bad messages" });

  try {
    const r = await fetch(URL, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "authorization": "Bearer " + API_KEY
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        max_tokens: 600,
        temperature: 0.8,
        messages: [{ role: "system", content: PERSONA }, ...history]
      })
    });
    if (!r.ok) {
      const detail = (await r.text()).slice(0, 300);
      return res.status(502).json({ error: "upstream " + r.status, detail });
    }
    const data = await r.json();
    const reply = (data.choices?.[0]?.message?.content || "").trim();
    return res.status(200).json({ reply: reply || "ขอโทษค่ะ นมสดนึกคำตอบไม่ออก ลองถามใหม่นะคะ" });
  } catch (e) {
    return res.status(500).json({ error: "server error" });
  }
}
