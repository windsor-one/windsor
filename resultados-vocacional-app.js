import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import { getAuth, GoogleAuthProvider, signInWithRedirect, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import { getFirestore, collection, getDocs } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

const firebaseConfig = {
  apiKey: 'AIzaSyCJnhzk4nRN1BS2GWpkMIDvu4nyKmfhfHo',
  authDomain: 'test-vocacional-windsor.firebaseapp.com',
  projectId: 'test-vocacional-windsor',
  storageBucket: 'test-vocacional-windsor.firebasestorage.app',
  messagingSenderId: '613099111381',
  appId: '1:613099111381:web:75bd30fcbc55213e29b35c'
};
const ADMIN_EMAIL = 'alexhrnndz32@gmail.com';
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();
let records = [];

const $ = (selector) => document.querySelector(selector);
const loginCard = $('#admin-login');
const dashboard = $('#admin-dashboard');
const errorBox = $('#admin-error');
const sessionStatus = $('#admin-session-status');
const statusBox = $('#results-status');
const body = $('#results-body');
const empty = $('#results-empty');

function escapeHTML(value) {
  return String(value ?? '').replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
}
function showError(text) { errorBox.textContent = text; errorBox.hidden = !text; }
function formatDate(value) {
  if (!value) return '—';
  const date = typeof value.toDate === 'function' ? value.toDate() : new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat('es-SV', { dateStyle: 'medium', timeStyle: 'short' }).format(date);
}
function recordDate(record) { return record.createdAt?.toDate ? record.createdAt.toDate() : new Date(0); }
function renderRecords() {
  $('#results-count').textContent = `${records.length} ${records.length === 1 ? 'resultado' : 'resultados'}`;
  body.innerHTML = records.map((record) => {
    const candidate = record.candidate || {};
    const average = Number(record.average?.[record.topArea] ?? 0).toFixed(1);
    return `<tr><td><strong>${escapeHTML(candidate.name || 'Sin nombre')}</strong><small>${escapeHTML(candidate.school || 'Sin centro escolar')} · ${escapeHTML(candidate.gender || '—')}</small></td><td>${escapeHTML(formatDate(record.createdAt))}</td><td><span class="table-tag">${escapeHTML(record.topArea || '—')}</span></td><td>${escapeHTML(record.validity?.label || '—')}</td><td><strong>${average}</strong> / 99</td><td><button class="table-detail-button" type="button" data-record-id="${escapeHTML(record.id)}">Ver detalle</button></td></tr>`;
  }).join('');
  empty.hidden = records.length !== 0;
  body.querySelectorAll('[data-record-id]').forEach((button) => button.addEventListener('click', () => showDetail(button.dataset.recordId)));
}
function showDetail(id) {
  const record = records.find((item) => item.id === id);
  if (!record) return;
  const areas = Object.entries(record.average || {}).sort(([,a],[,b]) => Number(b) - Number(a)).map(([area, score]) => `<li><span>${escapeHTML(area)}</span><b>${Number(score).toFixed(1)}</b></li>`).join('');
  const modal = document.createElement('div');
  modal.className = 'result-detail-modal';
  modal.innerHTML = `<div class="result-detail-dialog" role="dialog" aria-modal="true" aria-labelledby="detail-title"><button class="result-detail-close" type="button" aria-label="Cerrar detalle">×</button><span class="extension-label">DETALLE DEL REGISTRO</span><h2 id="detail-title">${escapeHTML(record.candidate?.name || 'Estudiante')}</h2><p class="detail-meta">${escapeHTML(formatDate(record.createdAt))} · ID ${escapeHTML(record.id)}</p><div class="detail-summary"><div><span>Perfil principal</span><strong>${escapeHTML(record.topArea || '—')}</strong></div><div><span>Validez Kuder</span><strong>${escapeHTML(record.validity?.label || '—')}</strong></div><div><span>Puntaje principal</span><strong>${Number(record.average?.[record.topArea] || 0).toFixed(1)} / 99</strong></div></div><ul class="detail-areas">${areas}</ul></div>`;
  document.body.appendChild(modal);
  const close = () => modal.remove();
  modal.querySelector('.result-detail-close').addEventListener('click', close);
  modal.addEventListener('click', (event) => { if (event.target === modal) close(); });
  document.addEventListener('keydown', function escape(event) { if (event.key === 'Escape') { close(); document.removeEventListener('keydown', escape); } });
}
async function loadRecords() {
  statusBox.className = 'test-save-status is-loading';
  statusBox.textContent = 'Actualizando registros…';
  try {
    const snapshot = await getDocs(collection(db, 'testResults'));
    records = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      .sort((a, b) => recordDate(b).getTime() - recordDate(a).getTime());
    renderRecords();
    statusBox.className = 'test-save-status is-success';
    statusBox.textContent = 'Registros actualizados. Cada fila corresponde a una sesión independiente.';
  } catch (error) {
    console.error('No se pudieron leer los resultados', error);
    statusBox.className = 'test-save-status is-error';
    statusBox.textContent = 'No se pudieron cargar los resultados. Verifica que Firestore esté configurado y que tu cuenta tenga acceso.';
  }
}
function csvCell(value) { return `"${String(value ?? '').replace(/"/g, '""')}"`; }
function exportCSV() {
  const header = ['ID','Fecha','Nombre','Edad','Género','Centro escolar','Área principal','Puntaje principal','Validez Kuder','Puntaje validez'];
  const rows = records.map((record) => [record.id, formatDate(record.createdAt), record.candidate?.name, record.candidate?.age, record.candidate?.gender, record.candidate?.school, record.topArea, Number(record.average?.[record.topArea] || 0).toFixed(1), record.validity?.label, record.validity?.raw]);
  const csv = '\uFEFF' + [header, ...rows].map((row) => row.map(csvCell).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url; link.download = `resultados-vocacionales-${new Date().toISOString().slice(0,10)}.csv`; link.click();
  URL.revokeObjectURL(url);
}
$('#admin-login-button').addEventListener('click', async () => {
  showError('');
  try { await signInWithRedirect(auth, provider); } catch (error) { console.error(error); showError('No se pudo iniciar sesión. Intenta nuevamente.'); }
});
$('#admin-logout').addEventListener('click', () => signOut(auth));
$('#refresh-results').addEventListener('click', loadRecords);
$('#export-results').addEventListener('click', exportCSV);
onAuthStateChanged(auth, (user) => {
  if (user && user.email?.toLowerCase() === ADMIN_EMAIL) {
    loginCard.hidden = true; dashboard.hidden = false; sessionStatus.textContent = 'ACCESO AUTORIZADO'; loadRecords();
  } else {
    if (user) signOut(auth);
    loginCard.hidden = false; dashboard.hidden = true; sessionStatus.textContent = 'ACCESO RESTRINGIDO';
  }
});
