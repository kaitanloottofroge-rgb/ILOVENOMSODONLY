// รอให้ HTML โหลดเสร็จ 100% ก่อนเริ่มทำงาน
document.addEventListener("DOMContentLoaded", () => {
  const $ = (id) => document.getElementById(id);

  const START_MONEY = 1_000_000_000;        
  const FORCE_BID   = 1_000_000_000;        
  const BOT_BID     = 900_000_000_000_000;  

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
      void stage.offsetWidth; 
      stage.classList.add("pop");
      await wait(650);
    }
    stage.classList.add("hidden");
  }

  // --- เริ่มผูกปุ่มต่างๆ ---

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

  $("btn-start").addEventListener("click", () => {
    $("btn-start").classList.add("hidden");
    addBubble("เริ่มประมูลคุณนมสด", "sys"); 
    $("btn-force").classList.remove("hidden");
  });

  $("btn-force").addEventListener("click", async () => {
    $("btn-force").classList.add("hidden");
    addBubble("คุณประมูลบังคับ " + fmt(FORCE_BID) + " บาท", "me");
    addBubble("จำนวนที่ประมูล...", "sys");
    
    await countdown(["3", "2", "1"]); 

    addBubble("คิวเริ่มประมูล " + fmt(BOT_BID) + " บาท", "bot");
    await wait(800);

    addBubble("คิวได้ประมูลคุณนมสดราคา " + fmt(BOT_BID) + " แล้วเราแพ้ 😢", "big");
    $("btn-why").classList.remove("hidden");
  });

  $("btn-why").addEventListener("click", () => {
    $("btn-why").classList.add("hidden");
    addBubble("ถามว่าประมูลไปทำไม 🤔", "me");
    setTimeout(() => {
      addBubble("ประมูลไปรักได้มั้ยครับ 💗", "big");
    }, 600);
  });
});
