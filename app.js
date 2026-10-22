const $ = id => document.getElementById(id);
const fmt = n => Number(n).toLocaleString('en-US');
let playerName = 'ผู้เข้าประมูล';
const sleep = ms => new Promise(r => setTimeout(r, ms));

// หน้า 1 -> ตั้งชื่อ
$('enterBtn').onclick = () => {
  $('nameModal').classList.add('show');
  $('nameInput').focus();
};

function confirmName() {
  playerName = $('nameInput').value.trim() || 'ผู้เข้าประมูล';
  $('nameModal').classList.remove('show');
  $('page1').classList.remove('active');
  $('page2').classList.add('active');
  $('whoName').textContent = '🎀 ' + playerName;
}
$('nameOk').onclick = confirmName;
$('nameInput').onkeydown = e => { if (e.key === 'Enter') confirmName(); };

// หน้า 2
$('startBtn').onclick = () => {
  $('startBtn').classList.add('hidden');
  $('msg').textContent = 'ประมูลบังคับ 1 พันล้านนะ!';
  $('bidBtn').classList.remove('hidden');
};

$('bidBtn').onclick = async () => {
  $('bidBtn').classList.add('hidden');
  const msg = $('msg');
  msg.textContent = `คุณ${playerName} ประมูล ${fmt(1000000000)}`;
  await sleep(1200);
  for (let i = 3; i >= 1; i--) {
    msg.innerHTML = `จำนวนที่ประมูล<br><span class="big">${i}...</span>`;
    await sleep(1000);
  }
  msg.textContent = `คิวประมูล ${fmt(900000000000000)}`;
  await sleep(1800);
  msg.innerHTML = `คิวได้ประมูลคุณนมสด<br>ราคา ${fmt(900000000000000)}<br>😭 คุณแพ้แล้ว`;
  await sleep(1500);
  $('whyBtn').classList.remove('hidden');
};

$('whyBtn').onclick = () => {
  $('whyBtn').classList.add('hidden');
  $('msg').innerHTML = 'คิว: "ประมูลไปรักได้มั้ยครับ" 💖';
};
