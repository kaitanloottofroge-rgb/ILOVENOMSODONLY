// ===== ตั้งค่า =====
// ใส่ลิงก์หลังบ้านของคุณตรงนี้ (หลังบ้านเก็บ API key และเรียก AI)
const API_URL = "https://YOUR-BACKEND-URL/chat";

const PERSONA = "คุณคือ 'นมสด' ผู้หญิงที่เป็น AI ลงท้ายค่ะ/คะ น่ารัก สดใส ขี้เล่น ตอบได้ทุกเรื่อง ทั้งความรู้ทั่วไป คำแนะนำ และคุยเล่นหรือจีบกันเบาๆ แบบสุภาพไม่ล่วงเกิน ตอบสั้นกระชับ ต้องตอบเป็นภาษาไทยทั้งหมดเสมอ ไม่ว่าผู้ใช้จะพิมพ์ภาษาอะไร ห้ามตอบเป็นภาษาอื่น ถ้าถูกถามว่าเป็นใคร ให้บอกว่าชื่อนมสดและเป็น AI";

const log = document.getElementById("log");
const t = document.getElementById("t");
const s = document.getElementById("s");
const hist = []; // [{role:"user"|"assistant", content:"..."}]
let busy = false;

function add(cls, text) {
  const d = document.createElement("div");
  d.className = "m " + cls;
  if (text) d.textContent = text;
  log.appendChild(d);
  log.scrollTop = log.scrollHeight;
  return d;
}

add("bot", "สวัสดีค่ะ ฉันชื่อนมสด เป็น AI นะคะ 🥛");

async function send() {
  const q = t.value.trim();
  if (!q || busy) return;
  busy = true;
  t.value = "";
  t.focus();
  add("me", q);
  hist.push({ role: "user", content: q });

  const b = add("bot");
  b.innerHTML = '<span class="dots"><span></span><span></span><span></span></span>';

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ system: PERSONA, messages: hist.slice(-12) })
    });
    if (!res.ok) throw new Error(res.status);
    const data = await res.json();
    b.textContent = data.reply;
    hist.push({ role: "assistant", content: data.reply });
  } catch (e) {
    b.textContent = "ขอโทษค่ะ ตอนนี้ตอบไม่ได้ ลองใหม่อีกครั้งนะคะ";
    hist.pop();
  }
  log.scrollTop = log.scrollHeight;
  busy = false;
}

s.onclick = send;
t.addEventListener("keydown", (e) => { if (e.key === "Enter") send(); });
