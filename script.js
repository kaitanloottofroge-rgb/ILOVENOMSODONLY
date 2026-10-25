// ===== ตั้งค่า =====
// หลังบ้านอยู่บน Vercel ที่เดียวกัน
const API_URL = "/api/chat";

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
      body: JSON.stringify({ messages: hist.slice(-12) })
    });
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      throw new Error((j.error || res.status) + " " + (j.detail || ""));
    }
    const data = await res.json();
    b.textContent = data.reply;
    hist.push({ role: "assistant", content: data.reply });
  } catch (e) {
    b.textContent = "ขอโทษค่ะ ตอนนี้ตอบไม่ได้ ลองใหม่อีกครั้งนะคะ\n[debug: " + e.message + "]";
    hist.pop();
  }
  log.scrollTop = log.scrollHeight;
  busy = false;
}

s.onclick = send;
t.addEventListener("keydown", (e) => { if (e.key === "Enter") send(); });
