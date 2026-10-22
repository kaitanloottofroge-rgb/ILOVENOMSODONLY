/* ============================================================
   นมสด ONLY — เกมประมูล
   ============================================================ */

const $ = (id) => document.getElementById(id);

const START_MONEY = 1_000_000_000;        // เงินเริ่มต้น 1 พันล้าน
const FORCE_BID   = 1_000_000_000;        // ประมูลบังคับ 1 พันล้าน
const BOT_BID     = 900_000_000_000_000;  // คิวประมูล

const state = {
  money: START_MONEY,
};

const fmt  = (n) => n.toLocaleString("en-US");
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

/* ---------- จัดการหน้า ---------- */
function showPage(id) {
  document.querySelectorAll(".page").forEach((p) => {
    p.classList.toggle("active", p.id === id);
  });
}

/* ---------- ข้อความในกล่องแชท ---------- */
const logEl = $("log");

function addBubble(text, type = "") {
  const div = document.createElement("div");
  div.className = "bubble" + (type ? " " + type : "");
  div.textContent = text;
  logEl.appendChild(div);
  logEl.scrollTop = logEl.scrollHeight;
  return div;
}

/* ---------- นับถอยหลังกลางจอ ---------- */
async function countdown(numbers) {
  const stage = $("stage");
  stage.classList.remove("hidden");

  for (const n of numbers) {
    stage.textContent = n;
    stage.classList.remove("pop");
    void stage.offsetWidth;
    stage.classList.add("pop");
    await wait(650);
  }

  stage.classList.add("hidden");
  stage.textContent = "";
}

/* ============================================================
   หน้าที่ 1 : เข้าประมูล → เข้าหน้าประมูลทันที
   ============================================================ */
$("btn-enter").addEventListener("click", () => {
  state.money = START_MONEY;
  $("show-money").textContent = fmt(state.money);
  showPage("page-auction");
});

/* ============================================================
   หน้าที่ 2 : หน้าประมูล
   ============================================================ */
let started = false;

$("btn-start").addEventListener("click", () => {
  if (started) return;
  started = true;

  $("btn-start").classList.add("hidden");

  // ✅ เปลี่ยนข้อความเป็น "เริ่มประมูลคุณนมสด"
  addBubble("เริ่มประมูลคุณนมสด", "sys");

  // โผล่ปุ่มกลางล่าง = ประมูลบังคับ
  $("btn-force").classList.remove("hidden");
});

/* ---------- กดประมูลบังคับ ---------- */
$("btn-force").addEventListener("click", async () => {
  $("btn-force").classList.add("hidden");

  addBubble("คุณประมูลบังคับ " + fmt(FORCE_BID) + " บาท", "me");

  // นับจำนวนที่ประมูล 3 → 2 → 1
  addBubble("จำนวนที่ประมูล...", "sys");
  await countdown(["3", "2", "1"]);

  // ✅ เปลี่ยน "บอทประมูล" → "คิวเริ่มประมูล" และเอาสติ๊กเกอร์ 🤖 ออก
  addBubble("คิวเริ่มประมูล " + fmt(BOT_BID) + " บาท", "bot");
  await wait(750);

  // สรุปผล
  addBubble(
    "คิวได้ประมูลคุณนมสดราคา " + fmt(BOT_BID) + " แล้วเราแพ้ 😢",
    "big"
  );

  // โผล่ปุ่มกลางล่าง = ถามว่าประมูลไปทำไม
  $("btn-why").classList.remove("hidden");
});

/* ---------- ถามว่าประมูลไปทำไม ---------- */
$("btn-why").addEventListener("click", () => {
  $("btn-why").classList.add("hidden");

  addBubble("ถามว่าประมูลไปทำไม 🤔", "me");

  setTimeout(() => {
    addBubble("ประมูลไปรักได้มั้ยครับ 💗", "big");
  }, 650);
});
