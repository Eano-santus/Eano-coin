// Initialization
let EANO = parseInt(localStorage.getItem('freeEANO')) || 100;
let gems = parseInt(localStorage.getItem('gems')) || 200;
let unlockTime = localStorage.getItem('ep2unlock') || 0;
let pname, partner;

function startStory() {
  pname = document.getElementById('pName').value || 'Raine';
  partner = document.getElementById('partnerName').value || 'Echo';
  document.getElementById('nameSection').style.display = 'none';
  document.getElementById('story').style.display = 'block';
  step0();
}

function step0() {
  showText(`The forest under the full moon is silent. You are ${pname}, awakening with no memory — only a word: “Alpha.”`);
  setChoices([
    { t:'Embrace the name', f:()=> step1(true) },
    { t:'Deny it entirely', f:()=> step1(false) }
  ]);
}

// Branch 1
function step1(acceptName) {
  if (acceptName) {
    showText(`You whisper your name—${pname}—and feel a wave of purpose.`);
  } else {
    showText(`You shake your head. “That name isn’t mine.” Uncertainty grips you.`);
  }
  setChoices([
    { t:'Proceed deeper into forest', f:step2 }
  ]);
}

// Currency/Item choice
function step2() {
  showText(`A cloaked Mystic emerges, offering a Talisman for clarity (5 EANO).`);
  setChoices([
    { t:`Buy talisman (${EANO>=5?'5 EANO':'Not enough'})`, f: buyTalisman, x: EANO<5 },
    { t:'Decline offer', f: step3 }
  ]);
}

function buyTalisman() {
  EANO -= 5;
  localStorage.setItem('freeEANO',EANO);
  showText(`Talisman pulses with energy — clarity floods your mind.`);
  step3(true);
}

function step3(hasTalisman=false) {
  if (hasTalisman) showText(`Visions sharpen: you see your partner ${partner}, surrounded by wolves.`);
  else showText(`Your vision blurs — you glimpse shadows and a distant howl.`);
  setChoices([
    { t:'Press for more', f:()=> step4(hasTalisman) },
    { t:'Step back', f:()=> step4(hasTalisman) }
  ]);
}

function step4(hasTalisman) {
  showText(`Mystic warns, "Every answer demands sacrifice."`);
  setChoices([
    { t:'Accept prophecy', f:()=> step5(hasTalisman,'accept') },
    { t:'Refuse and escape', f:()=> step5(hasTalisman,'refuse') }
  ]);
}

function step5(hasTalisman, decision) {
  if (decision==='accept') {
    showText(`You nod. You’ll face whatever comes, for ${partner} and the pack.`);
    if (hasTalisman) showText(`The talisman glows — vision reveals shattered pack.`);
  } else {
    showText(`You turn and run — but the forest shifts, guiding you further in.`);
  }
  endEpisode();
}

// End and set cooldown
function endEpisode() {
  document.getElementById('choices').innerHTML = `<p>Episode complete! +1 EANO & 4 gems added.</p>`;
  EANO++; gems+=4;
  localStorage.setItem('freeEANO',EANO);
  localStorage.setItem('gems',gems);
  unlockTime = Date.now() + 4*3600*1000;
  localStorage.setItem('ep2unlock', unlockTime);
  updateCooldown();
  setInterval(updateCooldown,1000);
}

// Utils
function showText(txt){
  const line=document.getElementById('line0'); line.innerHTML=txt;
}
function setChoices(arr){
  const div=document.getElementById('choices'); div.innerHTML='';
  arr.forEach(c=>{
    const b=document.createElement('button');
    b.textContent=c.t; if(c.x) b.disabled=true; b.onclick=c.f;
    div.appendChild(b);
  });
}
function updateCooldown(){
  const secs=Math.max(0,unlockTime-Date.now());
  const h=String(Math.floor(secs/3600000)).padStart(2,'0');
  const m=String(Math.floor((secs%3600000)/60000)).padStart(2,'0');
  const s=String(Math.floor((secs%60000)/1000)).padStart(2,'0');
  document.getElementById('cooldown').textContent = `${h}:${m}:${s}`;
}
