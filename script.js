/* ============================================================
   นมสด ONLY — ลำดับเหตุการณ์ตามโจทย์ตอนแรกเป๊ะๆ
   ============================================================ */

const $ = (id) => document.getElementById(id);

const START_MONEY = 1_000_000_000;        // เงินเริ่มต้น 1 พันล้าน
const FORCE_BID   = 1_000_000_000;        // ประมูลบังคับ 1 พันล้าน
const BOT_BID     = 900_000_000_000_000;  // คิวประมูล 900 ล้านล้าน

const state = { name: "", money: START_MONEY };
const fmt  = (n) => n.toLocaleString("en-US");
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

// สลับหน้า
function showPage(id) {
  document.querySelectorAll(".page").forEach((p) => p.classList.toggle("active", p.id === id));
}

// เพิ่มข้อความลงกล่องแชท
const logEl = $("log");
function addBubble(text, type = "") {
  const div = document.createElement("div");
  div.className = "bubble " + type;
  div.textContent = text;
  logEl.appendChild(div);
  logEl.scrollTop = logEl.scrollHeight;
}

// นับถอยหลัง 3 2 1
async function countdown(numbers) {
  const stage = $("stage");
  stage.classList.remove("hidden");
  for (const n of numbers) {
    stage.textContent = n;
    stage.classList.remove("pop");
    void stage.offsetWidth; // รีเซ็ตแอนิเมชัน
    stage.classList.add("pop");
    await wait(650);
  }
  stage.classList.add("hidden");
}

/* ============================================================
   ลำดับที่ 1: เข้าประมูล -> ตั้งชื่อ
   ============================================================ */
$("btn-enter").addEventListener("click", () => {
  showPage("page-name");
  setTimeout(() => $("input-name").focus(), 120);
});

function confirmName() {
  const v = $("input-name").value.trim();
  state.name = v || "คุณลูกค้า";
  state.money = START_MONEY;
  $("show-name").textContent = state.name;
  $("show-money").textContent = fmt(state.money);
  showPage("page-auction");
}
$("btn-name-ok").addEventListener("click", confirmName);
$("input-name").addEventListener("keydown", (e) => { if (e.key === "Enter") confirmName(); });

/* ============================================================
   ลำดับที่ 2: กดเริ่มประมูล -> โผล่ปุ่มบังคับ 1 พันล้าน
   ============================================================ */
$("btn-start").addEventListener("click", () => {
  $("btn-start").classList.add("hidden");
  addBubble("เริ่มประมูลคุณนมสด", "sys"); // แก้ตามที่ขอรอบก่อน
  $("btn-force").classList.remove("hidden");
});

/* ============================================================
   ลำดับที่ 3: กดบังคับประมูล -> นับ 3 2 1 -> คิวประมูล -> แพ้
   ============================================================ */
$("btn-force").addEventListener("click", async () => {
  $("btn-force").classList.add("hidden");
  addBubble("คุณประมูลบังคับ " + fmt(FORCE_BID) + " บาท", "me");
  
  addBubble("จำนวนที่ประมูล...", "sys");
  await countdown(["3", "2", "1"]); // นับ 3 2 1

  // คิวประมูล (เอาไอคอนบอทออกแล้ว)
  addBubble("คิวเริ่มประมูล " + fmt(BOT_BID) + " บาท", "bot");
  await wait(800);

  // สรุปผลเราแพ้
  addBubble("คิวได้ประมูลคุณนมสดราคา " + fmt(BOT_BID) + " แล้วเราแพ้ 😢", "big");

  // โผล่ปุ่มถาม
  $("btn-why").classList.remove("hidden");
});

/* ============================================================
   ลำดับที่ 4: กดถามว่าประมูลไปทำไม -> คิวตอบ
   ============================================================ */
$("btn-why").addEventListener("click", () => {
  $("btn-why").classList.add("hidden");
  addBubble("ถามว่าประมูลไปทำไม 🤔", "me");
  
  setTimeout(() => {
    addBubble("ประมูลไปรักได้มั้ยครับ 💗", "big");
  }, 600);
});
