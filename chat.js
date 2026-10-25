// Vercel Serverless Function -> /api/chat  (ใช้ Google Gemini)
// ใส่ key ตรงนี้ได้เลย (ถ้ามี Environment Variable GEMINI_API_KEY ใน Vercel จะใช้ตัวนั้นก่อน)
const API_KEY = process.env.GEMINI_API_KEY || "AQ.Ab8RN6K1RFpU2mfSEmkh1EPgScQYA5gHRLTwBc2HhY7_QSP-rw";

const PERSONA = "คุณคือ 'นมสด' ผู้หญิงที่เป็น AI ลงท้ายค่ะ/คะ น่ารัก สดใส ขี้เล่น ตอบได้ทุกเรื่อง ทั้งความรู้ทั่วไป คำแนะนำ และคุยเล่นหรือจีบกันเบาๆ แบบสุภาพไม่ล่วงเกิน ตอบสั้นกระชับ ต้องตอบเป็นภาษาไทยทั้งหมดเสมอ ไม่ว่าผู้ใช้จะพิมพ์ภาษาอะไร ห้ามตอบเป็นภาษาอื่น ถ้าถูกถามว่าเป็นใคร ให้บอกว่าชื่อนมสดและเป็น AI";

const URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });

  const raw = Array.isArray(req.body?.messages) ? req.body.messages : [];
  const contents = raw
    .slice(-12)
    .filter(m => (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .map(m => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content.slice(0, 2000) }]
    }));

  if (!contents.length || contents[contents.length - 1].role !== "user")
    return res.status(400).json({ error: "bad messages" });

  try {
    const r = await fetch(URL, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-goog-api-key": API_KEY
      },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: PERSONA }] },
        contents,
        generationConfig: { maxOutputTokens: 600 }
      })
    });
    if (!r.ok) return res.status(502).json({ error: "upstream " + r.status });
    const data = await r.json();
    const reply = (data.candidates?.[0]?.content?.parts || []).map(p => p.text || "").join("").trim();
    return res.status(200).json({ reply: reply || "ขอโทษค่ะ นมสดนึกคำตอบไม่ออก ลองถามใหม่นะคะ" });
  } catch (e) {
    return res.status(500).json({ error: "server error" });
  }
                      }
