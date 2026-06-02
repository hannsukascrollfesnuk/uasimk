/*
  Smart Campus Dashboard - script.js
  - Render launcher card dari array data
  - Search filter
  - Theme toggle (dark/light)
  - Digital clock + current date realtime
  - Quotes generator random tiap refresh / tombol
  - To-Do List + Notes (localStorage)
  - Notification toast + click animation
*/

const $ = (id) => document.getElementById(id);

// -----------------------------
// Theme toggle (dark/light)
// -----------------------------
const THEME_KEY = 'scd_theme';

function applyTheme(theme){
  // theme: 'dark' | 'light'
  if(theme === 'light'){
    document.documentElement.setAttribute('data-theme','light');
  }else{
    document.documentElement.removeAttribute('data-theme');
  }
}

function initTheme(){
  const saved = localStorage.getItem(THEME_KEY);
  const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;

  if(saved){
    applyTheme(saved);
  }else{
    applyTheme(prefersLight ? 'light' : 'dark');
  }
}

$('themeBtn')?.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
  const next = current === 'light' ? 'dark' : 'light';
  applyTheme(next);
  localStorage.setItem(THEME_KEY, next);
});

initTheme();

// -----------------------------
// Sidebar toggle (mobile)
// -----------------------------
$('sidebarBtn')?.addEventListener('click', () => {
  const el = $('sidebar');
  if(!el) return;
  el.classList.toggle('open');
});

// -----------------------------
// Realtime clock + date
// -----------------------------
function pad2(n){ return String(n).padStart(2,'0'); }

function updateClock(){
  const now = new Date();

  const hh = pad2(now.getHours());
  const mm = pad2(now.getMinutes());
  const ss = pad2(now.getSeconds());

  const timeStr = `${hh}:${mm}:${ss}`;
  $('digitalClock').textContent = timeStr;
  $('widgetClock').textContent = timeStr;

  const dateStr = now.toLocaleDateString('id-ID', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  $('currentDate').textContent = dateStr;
  $('widgetDate').textContent = dateStr;
}

updateClock();
setInterval(updateClock, 1000);

// -----------------------------
// Welcome banner
// -----------------------------
const welcomeText = $('welcomeText');
const hour = new Date().getHours();
let greeting = 'Semoga produktif hari ini.';
if(hour < 11) greeting = 'Selamat pagi! Yuk mulai produktif.';
else if(hour < 15) greeting = 'Selamat siang! Tetap fokus ya.';
else greeting = 'Selamat sore! Jangan lupa istirahat sebentar.';
if(welcomeText) welcomeText.textContent = greeting;

// -----------------------------
// Launcher data
// -----------------------------
const apps = [
  {
    name: 'Google Search',
    desc: 'Cari informasi cepat & akurat.',
    url: 'https://google.com',
    icon: 'fa-brands fa-google'
  },
  {
    name: 'YouTube',
    desc: 'Tonton video pembelajaran.',
    url: 'https://youtube.com',
    icon: 'fa-brands fa-youtube'
  },
  {
    name: 'WhatsApp Web',
    desc: 'Chat dengan teman & dosen.',
    url: 'https://web.whatsapp.com',
    icon: 'fa-brands fa-whatsapp'
  },
  {
    name: 'Gmail',
    desc: 'Kelola email akademik.',
    url: 'https://mail.google.com',
    icon: 'fa-regular fa-envelope'
  },
  {
    name: 'Spotify',
    desc: 'Musik biar semangat belajar.',
    url: 'https://open.spotify.com',
    icon: 'fa-brands fa-spotify'
  },
  {
    name: 'Instagram',
    desc: 'Update feed & inspirasi.',
    url: 'https://instagram.com',
    icon: 'fa-brands fa-instagram'
  },
  {
    name: 'ChatGPT',
    desc: 'Bantu tugas & ide kreatif.',
    url: 'https://chatgpt.com',
    icon: 'fa-solid fa-robot'
  }
];

function createCard(app){
  const btn = document.createElement('a');
  btn.className = 'launch-card glass';
  btn.href = app.url;
  btn.target = '_blank';
  btn.rel = 'noopener noreferrer';

  btn.setAttribute('data-name', app.name.toLowerCase());

  btn.innerHTML = `
    <div class="inner">
      <div class="launch-icon"><i class="${app.icon}"></i></div>
      <div>
        <div class="launch-name">${app.name}</div>
        <div class="launch-desc">${app.desc}</div>
      </div>
    </div>
    <div class="launch-foot">
      <span style="font-weight:1000; color: var(--muted);">Buka</span>
      <i class="fa-solid fa-arrow-right"></i>
    </div>
  `;

  // Click animation + toast
  btn.addEventListener('click', (e) => {
    // Ripple kecil untuk animasi click
    createRipple(btn, e.clientX, e.clientY);
    showToast(`Membuka ${app.name}...`);
  });

  return btn;
}

function renderGrid(){
  const grid = $('grid');
  if(!grid) return;
  grid.innerHTML = '';
  apps.forEach(app => grid.appendChild(createCard(app)));
}

renderGrid();

// -----------------------------
// Search filter
// -----------------------------
$('search')?.addEventListener('input', (e) => {
  const q = e.target.value.trim().toLowerCase();
  const cards = document.querySelectorAll('.launch-card');

  cards.forEach(card => {
    const name = card.getAttribute('data-name') || '';
    card.style.display = name.includes(q) ? '' : 'none';
  });
});

// -----------------------------
// Toast helper
// -----------------------------
let toastTimer = null;
function showToast(message){
  const toast = $('toast');
  if(!toast) return;
  toast.textContent = message;
  toast.classList.add('show');

  if(toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 1600);
}

// -----------------------------
// Ripple click effect
// -----------------------------
function createRipple(el, clientX, clientY){
  const r = el.getBoundingClientRect();
  const x = clientX - r.left;
  const y = clientY - r.top;

  const dot = document.createElement('div');
  dot.className = 'click-ripple';
  dot.style.left = `${x}px`;
  dot.style.top = `${y}px`;
  el.appendChild(dot);

  dot.animate([
    { opacity: 0.0, transform: 'translate(-50%,-50%) scale(.6)', offset: 0 },
    { opacity: 0.8, transform: 'translate(-50%,-50%) scale(3.2)', offset: 0.65 },
    { opacity: 0.0, transform: 'translate(-50%,-50%) scale(4)', offset: 1 }
  ], { duration: 520, easing: 'ease-out' });

  setTimeout(() => dot.remove(), 600);
}

// -----------------------------
// ToDo List (localStorage)
// -----------------------------
const TODO_KEY = 'scd_todos_v1';

function loadTodos(){
  try{
    return JSON.parse(localStorage.getItem(TODO_KEY) || '[]');
  }catch{
    return [];
  }
}

function saveTodos(todos){
  localStorage.setItem(TODO_KEY, JSON.stringify(todos));
}

function renderTodos(){
  const list = $('todoList');
  if(!list) return;

  const todos = loadTodos();
  list.innerHTML = '';

  if(todos.length === 0){
    const empty = document.createElement('div');
    empty.className = 'todo-item';
    empty.innerHTML = `<div class="todo-left"><input class="todo-check" type="checkbox" disabled /><div class="todo-text">Belum ada tugas.</div></div>`;
    list.appendChild(empty);
    return;
  }

  todos.forEach((t) => {
    const item = document.createElement('div');
    item.className = 'todo-item';

    item.innerHTML = `
      <div class="todo-left">
        <input class="todo-check" type="checkbox" ${t.done ? 'checked' : ''} aria-label="Tandai selesai" />
        <div class="todo-text ${t.done ? 'done' : ''}">${escapeHtml(t.text)}</div>
      </div>
      <div class="todo-actions">
        <button class="todo-mini" type="button" aria-label="Hapus"><i class="fa-solid fa-xmark"></i></button>
      </div>
    `;

    const checkbox = item.querySelector('input[type="checkbox"]');
    checkbox.addEventListener('change', () => {
      t.done = checkbox.checked;
      saveTodos(todos);
      renderTodos();
    });

    const delBtn = item.querySelector('.todo-mini');
    delBtn.addEventListener('click', () => {
      const idx = todos.findIndex(x => x.id === t.id);
      if(idx >= 0) todos.splice(idx, 1);
      saveTodos(todos);
      renderTodos();
      showToast('Tugas dihapus');
    });

    list.appendChild(item);
  });
}

function escapeHtml(str){
  return String(str)
    .replaceAll('&','&amp;')
    .replaceAll('<','<')
    .replaceAll('>','>')
    .replaceAll('"','"')
    .replaceAll("'",'&#039;');
}

// add new todo
$('todoForm')?.addEventListener('submit', (e) => {
  e.preventDefault();

  const input = $('todoInput');
  const text = (input.value || '').trim();
  if(!text) return;

  const todos = loadTodos();
  todos.push({ id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()), text, done: false });
  saveTodos(todos);

  input.value = '';
  renderTodos();
  showToast('Tugas ditambahkan');
});

renderTodos();

// -----------------------------
// Notes (auto save)
// -----------------------------
const NOTES_KEY = 'scd_notes_v1';

function loadNotes(){
  return localStorage.getItem(NOTES_KEY) || '';
}

function saveNotes(val){
  localStorage.setItem(NOTES_KEY, val);
}

const notesArea = $('notesArea');
if(notesArea){
  notesArea.value = loadNotes();
  notesArea.addEventListener('input', () => saveNotes(notesArea.value));
}

$('clearNotes')?.addEventListener('click', () => {
  if(!confirm('Yakin mau menghapus semua notes?')) return;
  if(notesArea) notesArea.value = '';
  saveNotes('');
  showToast('Notes dikosongkan');
});

// -----------------------------
// Quotes generator
// -----------------------------
const quotes = [
  'Belajar bukan tentang cepat, tapi tentang konsisten.',
  'Kerjakan pelan-pelan, yang penting jangan berhenti.',
  'Kamu tidak perlu sempurna untuk mulai—cukup mulai.',
  'Tugas hari ini adalah langkah kecil menuju tujuan besar.',
  'Fokus pada proses, bukan hanya hasil akhir.',
  'Sedikit kemajuan setiap hari akan jadi perubahan besar.'
];

function pickQuote(){
  const q = quotes[Math.floor(Math.random() * quotes.length)];
  const el = $('quoteText');
  if(el) el.textContent = q;
}

$('newQuote')?.addEventListener('click', () => {
  pickQuote();
  showToast('Quote diperbarui');
});

pickQuote(); // tiap refresh

// -----------------------------
// Weather dummy (optional)
// -----------------------------
// UI dummy tetap statis agar tidak perlu API.

// -----------------------------
// Floating action button
// -----------------------------
$('fab')?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// close sidebar when link clicked (mobile)
document.querySelectorAll('.nav-link').forEach(a => {
  a.addEventListener('click', () => {
    const sb = $('sidebar');
    if(sb && sb.classList.contains('open')) sb.classList.remove('open');
  });
});

// update year
if($('year')) $('year').textContent = new Date().getFullYear();

