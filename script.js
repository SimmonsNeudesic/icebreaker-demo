// Icebreaker data
const ICEBREAKERS = {
  general: [
    "What's something you did this week that you're proud of?",
    "Share one small win from today.",
    "If you could eat only one meal for the rest of your life, what would it be?"
  ],
  team: [
    "What's one tool you can't live without at work?",
    "Describe your work style in one emoji.",
    "What's one thing our team should start doing?"
  ],
  fun: [
    "What's your go-to karaoke song?",
    "If you were a superhero, what would your power be?",
    "What's the weirdest food combo you actually enjoy?"
  ],
  deep: [
    "What's a lesson from the last year you want to remember?",
    "What's a book that changed how you think?",
    "When do you feel most like yourself?"
  ],
  favorites: []
};

// DOM
const categoryEl = document.getElementById('category');
const nextBtn = document.getElementById('nextBtn');
const cardTextEl = document.getElementById('cardText');
const shareBtn = document.getElementById('shareBtn');
const printBtn = document.getElementById('printBtn');
const confettiRoot = document.getElementById('confetti-root');

const favoriteBtn = document.getElementById('favoriteBtn');
const bgColorPicker = document.getElementById('bgColorPicker');

const CATEGORIES = Object.keys(ICEBREAKERS);

// Helpers
function pickRandom(arr){ return arr[Math.floor(Math.random()*arr.length)]; }

function getFavorites() {
  return JSON.parse(localStorage.getItem('ib-favorites') || '[]');
}

function setFavorites(favs) {
  localStorage.setItem('ib-favorites', JSON.stringify(favs));
}

function toggleFavorite(text) {
  const favs = getFavorites();
  const index = favs.indexOf(text);
  if (index > -1) {
    favs.splice(index, 1);
  } else {
    favs.push(text);
  }
  setFavorites(favs);
  updateFavoriteButton(text);
}

function updateFavoriteButton(text) {
  const favs = getFavorites();
  favoriteBtn.textContent = favs.includes(text) ? '★' : '☆';
}

function loadSavedBackgroundColor() {
  const savedColor = localStorage.getItem('ib-bg-color');
  if (savedColor) {
    document.body.style.background = savedColor;
    bgColorPicker.value = savedColor;
  } else {
    // Set default color from current gradient
    bgColorPicker.value = '#071026';
  }
}

function saveBackgroundColor(color) {
  localStorage.setItem('ib-bg-color', color);
  document.body.style.background = color;
}

function getFromCategory(cat){
  if(!cat || !ICEBREAKERS[cat] || ICEBREAKERS[cat].length === 0){
    if(cat === 'favorites'){
      const favs = getFavorites();
      return favs.length > 0 ? pickRandom(favs) : pickRandom(ICEBREAKERS.general);
    }
    return pickRandom(ICEBREAKERS.general);
  }
  return pickRandom(ICEBREAKERS[cat]);
}

function showCard(text){
  cardTextEl.textContent = text;
  updateFavoriteButton(text);
  // update URL state without reload
  const params = new URLSearchParams(location.search);
  params.set('text', text);
  history.replaceState(null, '', '?' + params.toString());
}

// Confetti: tiny DOM-based confetti
function burstConfetti(){
  const colors = ['#FF6B6B','#FFD93D','#6BCB77','#4D96FF','#7C5CFF'];
  for(let i=0;i<24;i++){
    const el = document.createElement('div');
    el.className = 'confetti';
    el.style.background = colors[Math.floor(Math.random()*colors.length)];
    el.style.left = (50 + (Math.random()-0.5)*60) + '%';
    el.style.top = (10 + Math.random()*10) + '%';
    const rot = Math.random()*360;
    el.style.transform = `translate(-50%, -50%) rotate(${rot}deg)`;
    confettiRoot.appendChild(el);

    // animate using JS for simplicity
    const dx = (Math.random()-0.5)*800;
    const dy = 600 + Math.random()*200;
    const duration = 800 + Math.random()*700;
    el.animate([
      { transform: `translate(-50%, -50%) rotate(${rot}deg) translateY(0)`, opacity:1 },
      { transform: `translate(-50%, -50%) rotate(${rot+Math.random()*720}deg) translate(${dx}px, ${dy}px)`, opacity: 0.1 }
    ], {
      duration,
      easing: 'cubic-bezier(.15,.85,.25,1)'
    });
    setTimeout(()=> el.remove(), duration + 50);
  }
}

// Share link: copy current URL
async function copyShare(){
  const url = location.href;
  try {
    await navigator.clipboard.writeText(url);
    shareBtn.textContent = 'Link Copied!';
    setTimeout(()=> shareBtn.textContent = 'Copy Share Link', 1500);
  } catch (e){
    // fallback
    prompt('Copy this link', url);
  }
}

function populateCategories(){
  const pillsRoot = document.getElementById('pills');
  CATEGORIES.forEach(cat=>{
    const btn = document.createElement('button');
    btn.className = 'pill';
    btn.type = 'button';
    btn.dataset.cat = cat;
    btn.textContent = cat === 'general' ? 'All' : cat === 'favorites' ? 'Favorites' : cat[0].toUpperCase() + cat.slice(1);
    btn.addEventListener('click', ()=>{
      document.querySelectorAll('.pill').forEach(p=>p.classList.remove('active'));
      btn.classList.add('active');
      localStorage.setItem('ib-category', cat);
    });
    pillsRoot.appendChild(btn);
  });

  // activate saved or first
  const saved = localStorage.getItem('ib-category') || 'general';
  const initial = document.querySelector(`.pill[data-cat="${saved}"]`) || document.querySelector('.pill');
  if(initial) initial.classList.add('active');
}

function getSelectedCategory(){
  const active = document.querySelector('.pill.active');
  return active ? active.dataset.cat : 'general';
}

function nextCard(){
  const cat = getSelectedCategory() || 'general';
  const text = getFromCategory(cat);
  showCard(text);
  burstConfetti();
}

function handleKey(e){
  if(e.code === 'Space' && document.activeElement.tagName !== 'BUTTON' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'SELECT'){
    e.preventDefault();
    nextCard();
  }
}

function loadFromURL(){
  const params = new URLSearchParams(location.search);
  if(params.has('text')){
    const t = params.get('text');
    cardTextEl.textContent = t;
    updateFavoriteButton(t);
  } else if(params.has('category')){
    const c = params.get('category');
    if(CATEGORIES.includes(c)){
      const pill = document.querySelector(`.pill[data-cat="${c}"]`);
      if(pill){ document.querySelectorAll('.pill').forEach(p=>p.classList.remove('active')); pill.classList.add('active'); }
      showCard(getFromCategory(c));
    } else {
      showCard(getFromCategory('general'));
    }
  } else {
    // initial random
    showCard("Press Next to reveal an icebreaker!");
  }
}

// Init
populateCategories();
loadFromURL();
loadSavedBackgroundColor();

nextBtn.addEventListener('click', nextCard);
favoriteBtn.addEventListener('click', () => toggleFavorite(cardTextEl.textContent));
if(shareBtn) shareBtn.addEventListener('click', copyShare);
if(printBtn) printBtn.addEventListener('click', ()=> window.print());
window.addEventListener('keydown', handleKey);

// Background color picker
bgColorPicker.addEventListener('input', (e) => {
  saveBackgroundColor(e.target.value);
});

// Header share link (uses current card text)
const shareLinkHeader = document.getElementById('shareLinkHeader');
if(shareLinkHeader) shareLinkHeader.addEventListener('click', (e)=>{e.preventDefault(); copyShare();});

// Make the card area clickable to reveal next
document.getElementById('card').addEventListener('click', nextCard);
