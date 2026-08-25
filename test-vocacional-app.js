import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import { getFirestore, collection, addDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

const DATA = window.VOCATIONAL_TEST_DATA;
const firebaseConfig = {
  apiKey: 'AIzaSyCJnhzk4nRN1BS2GWpkMIDvu4nyKmfhfHo',
  authDomain: 'test-vocacional-windsor.firebaseapp.com',
  projectId: 'test-vocacional-windsor',
  storageBucket: 'test-vocacional-windsor.firebasestorage.app',
  messagingSenderId: '613099111381',
  appId: '1:613099111381:web:75bd30fcbc55213e29b35c'
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const KUDER_COUNT = DATA.kuder.groups.length;
const HERRERA_COUNT = DATA.herrera.questions.length;
const TOTAL_COUNT = KUDER_COUNT + HERRERA_COUNT;

const $ = (selector) => document.querySelector(selector);
const intro = $('#test-intro');
const flow = $('#test-flow');
const result = $('#test-result');
const candidateForm = $('#candidate-form');
const candidateError = $('#candidate-error');
const questionError = $('#question-error');
const phaseLabel = $('#test-phase-label');
const stepTitle = $('#test-step-title');
const counter = $('#test-counter');
const counterLarge = $('#test-counter-large');
const progressBar = $('#test-progress-bar');
const kuderSection = $('#kuder-section');
const herreraSection = $('#herrera-section');
const kuderCard = $('#kuder-card');
const herreraCard = $('#herrera-card');
const backButton = $('#test-back');
const nextButton = $('#test-next');
const metaStatus = $('#test-meta-status');

let candidate = null;
let stage = 'kuder';
let kuderPage = 0;
let herreraPage = 0;
let kuderAnswers = [];
let herreraAnswers = {};

function setHidden(element, hidden) {
  if (element) element.hidden = hidden;
}

function escapeHTML(value) {
  return String(value ?? '').replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
}

function showError(element, message) {
  if (!element) return;
  element.textContent = message;
  element.hidden = !message;
}

function clearErrors() {
  showError(candidateError, '');
  showError(questionError, '');
}

function focusCurrentStep() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
  window.setTimeout(() => stepTitle?.focus?.(), 100);
}

function updateProgress() {
  const current = stage === 'kuder' ? kuderPage : KUDER_COUNT + herreraPage;
  const percentage = Math.max(1, Math.min(100, ((current + 0.5) / TOTAL_COUNT) * 100));
  progressBar.style.width = `${percentage}%`;
  metaStatus.textContent = stage === 'kuder' ? 'KUDER' : 'HERRERA';
  counter.textContent = stage === 'kuder' ? `GRUPO ${kuderPage + 1} / ${KUDER_COUNT}` : `PREGUNTA ${herreraPage + 1} / ${HERRERA_COUNT}`;
}

function renderKuder() {
  const group = DATA.kuder.groups[kuderPage];
  if (!group) return;
  phaseLabel.textContent = 'PARTE 01 / KUDER';
  stepTitle.textContent = 'Elige tus preferencias.';
  stepTitle.tabIndex = -1;
  counterLarge.textContent = `${kuderPage + 1} / ${KUDER_COUNT}`;
  setHidden(kuderSection, false);
  setHidden(herreraSection, true);
  backButton.disabled = kuderPage === 0;
  nextButton.textContent = kuderPage === KUDER_COUNT - 1 ? 'Continuar a Herrera ↗' : 'Siguiente ↗';
  const answer = kuderAnswers[group.id - 1] || { most: null, least: null };
  kuderCard.innerHTML = `
    <fieldset class="kuder-group" data-group-id="${group.id}">
      <legend><span>GRUPO ${String(group.id).padStart(3, '0')}</span>Selecciona una actividad en cada columna.</legend>
      <div class="kuder-table-head"><span>Actividad</span><span>ME GUSTA MÁS</span><span>ME GUSTA MENOS</span></div>
      ${group.items.map((item, itemIndex) => `
        <div class="kuder-option-row">
          <span class="kuder-option-text">${escapeHTML(item.text)}</span>
          <label class="choice-dot" aria-label="Me gusta más: ${escapeHTML(item.text)}"><input type="radio" name="more-${group.id}" value="${itemIndex}" ${answer.most === itemIndex ? 'checked' : ''}><span aria-hidden="true"></span></label>
          <label class="choice-dot" aria-label="Me gusta menos: ${escapeHTML(item.text)}"><input type="radio" name="less-${group.id}" value="${itemIndex}" ${answer.least === itemIndex ? 'checked' : ''}><span aria-hidden="true"></span></label>
        </div>
      `).join('')}
    </fieldset>`;
  kuderCard.querySelectorAll('input[type="radio"]').forEach((input) => {
    input.addEventListener('change', () => {
      const groupId = Number(input.closest('[data-group-id]').dataset.groupId);
      const index = Number(input.value);
      const currentAnswer = kuderAnswers[groupId - 1] || { most: null, least: null };
      if (input.name.startsWith('more-')) {
        currentAnswer.most = index;
        if (currentAnswer.least === index) currentAnswer.least = null;
      } else {
        currentAnswer.least = index;
        if (currentAnswer.most === index) currentAnswer.most = null;
      }
      kuderAnswers[groupId - 1] = currentAnswer;
      renderKuderSelectionState(groupId, currentAnswer);
      showError(questionError, '');
    });
  });
  updateProgress();
}

function renderKuderSelectionState(groupId, answer) {
  const group = kuderCard.querySelector(`[data-group-id="${groupId}"]`);
  if (!group) return;
  group.querySelectorAll(`input[name="more-${groupId}"]`).forEach((input) => { input.checked = Number(input.value) === answer.most; });
  group.querySelectorAll(`input[name="less-${groupId}"]`).forEach((input) => { input.checked = Number(input.value) === answer.least; });
}

function renderHerrera() {
  const question = DATA.herrera.questions[herreraPage];
  if (!question) return;
  phaseLabel.textContent = 'PARTE 02 / HERRERA Y MONTES';
  stepTitle.textContent = 'Qué tanto te gustaría.';
  stepTitle.tabIndex = -1;
  counterLarge.textContent = `${herreraPage + 1} / ${HERRERA_COUNT}`;
  setHidden(kuderSection, true);
  setHidden(herreraSection, false);
  backButton.disabled = false;
  nextButton.textContent = herreraPage === HERRERA_COUNT - 1 ? 'Ver mi resultado ↗' : 'Siguiente ↗';
  herreraCard.innerHTML = `
    <fieldset class="herrera-question" data-question-id="${question.id}">
      <legend><span>${String(question.id).padStart(2, '0')}</span>${escapeHTML(question.text)}</legend>
      <div class="scale-options">
        ${DATA.herrera.responseScale.map((option) => `<label><input type="radio" name="herrera-${question.id}" value="${option.value}" ${herreraAnswers[question.id] === option.value ? 'checked' : ''}><span>${escapeHTML(option.label)}</span></label>`).join('')}
      </div>
    </fieldset>`;
  herreraCard.querySelectorAll('input[type="radio"]').forEach((input) => input.addEventListener('change', () => {
    herreraAnswers[Number(input.name.replace('herrera-', ''))] = Number(input.value);
    showError(questionError, '');
  }));
  updateProgress();
}

function validateKuder() {
  const group = DATA.kuder.groups[kuderPage];
  const answer = kuderAnswers[group.id - 1];
  if (!answer || answer.most === null || answer.least === null) {
    showError(questionError, 'Selecciona una actividad que te guste más y otra que te guste menos.');
    return false;
  }
  return true;
}

function validateHerrera() {
  const question = DATA.herrera.questions[herreraPage];
  if (herreraAnswers[question.id] === undefined) {
    showError(questionError, 'Selecciona una respuesta para continuar.');
    return false;
  }
  return true;
}

function advance() {
  clearErrors();
  if (stage === 'kuder') {
    if (!validateKuder()) return;
    if (kuderPage < KUDER_COUNT - 1) {
      kuderPage += 1;
      renderKuder();
      focusCurrentStep();
    } else {
      stage = 'herrera';
      herreraPage = 0;
      renderHerrera();
      focusCurrentStep();
    }
    return;
  }
  if (!validateHerrera()) return;
  if (herreraPage < HERRERA_COUNT - 1) {
    herreraPage += 1;
    renderHerrera();
    focusCurrentStep();
  } else {
    finishTest();
  }
}

function goBack() {
  clearErrors();
  if (stage === 'kuder') {
    if (kuderPage > 0) {
      kuderPage -= 1;
      renderKuder();
      focusCurrentStep();
    }
  } else if (herreraPage > 0) {
    herreraPage -= 1;
    renderHerrera();
    focusCurrentStep();
  } else {
    stage = 'kuder';
    kuderPage = KUDER_COUNT - 1;
    renderKuder();
    focusCurrentStep();
  }
}

function sumCellRefs(cellRefs) {
  return cellRefs.reduce((total, [column, row]) => {
    const answer = kuderAnswers[Number(row) - 4];
    if (!answer) return total;
    const rowIndex = Number(row) - 4;
    const groupItemIndex = rowIndex % 3;
    if (column === 'C' && answer.most === groupItemIndex) return total + 1;
    if (column === 'E' && answer.least === groupItemIndex) return total + 1;
    return total;
  }, 0);
}

function convertNorm(rawScore, table) {
  const pairs = Object.values(table || {});
  if (!pairs.length) return 0;
  const match = pairs.find((pair) => rawScore <= pair.maxRaw);
  return match ? match.equivalent : pairs[pairs.length - 1].equivalent;
}

function convertHerrera(rawScore) {
  const natural = DATA.herrera.baremoNatural;
  const equivalent = DATA.herrera.baremoEquivalent;
  let result = equivalent[0];
  natural.forEach((cutoff, index) => { if (rawScore >= cutoff) result = equivalent[index]; });
  return result;
}

function calculateResult() {
  const genderKey = candidate.gender.toLowerCase() === 'femenino' ? 'femenino' : 'masculino';
  const normTable = DATA.norms[genderKey];
  const kuderRaw = {};
  const kuderEquivalent = {};
  const herreraNatural = {};
  const herreraEquivalent = {};
  const average = {};
  DATA.areas.forEach((area) => {
    kuderRaw[area] = sumCellRefs(DATA.kuder.scaleRefs[area]);
    kuderEquivalent[area] = convertNorm(kuderRaw[area], normTable[area]);
    herreraNatural[area] = DATA.herrera.scaleRefs[area].reduce((sum, id) => sum + (herreraAnswers[id] ?? 0), 0);
    herreraEquivalent[area] = convertHerrera(herreraNatural[area]);
    average[area] = Math.round(((kuderEquivalent[area] + herreraEquivalent[area]) / 2) * 10) / 10;
  });
  const sortedAreas = [...DATA.areas].sort((a, b) => average[b] - average[a]);
  const validityRaw = sumCellRefs(DATA.kuder.validityRefs);
  const validity = validityRaw < 32 ? DATA.kuder.validityLabels.invalid : validityRaw < 36 ? DATA.kuder.validityLabels.doubtful : DATA.kuder.validityLabels.valid;
  return { kuderRaw, kuderEquivalent, herreraNatural, herreraEquivalent, average, sortedAreas, validityRaw, validity };
}

function showResult(resultData, recordId = '') {
  setHidden(intro, true);
  setHidden(flow, true);
  setHidden(result, false);
  const topArea = resultData.sortedAreas[0];
  $('#result-record-label').textContent = recordId ? `ID ${recordId.slice(0, 8).toUpperCase()}` : 'ID PENDIENTE';
  $('#result-summary').textContent = resultData.validity === 'Válida' ? 'Tu perfil está listo. Estas son tus áreas de mayor afinidad.' : `Tu resultado se calculó, pero la escala de validez aparece como ${resultData.validity.toLowerCase()}.`;
  $('#result-top-area').textContent = topArea;
  $('#result-top-score').textContent = `${resultData.average[topArea]} / 99`;
  $('#result-top-description').textContent = `Tu mayor afinidad aparece en ${topArea.toLowerCase()}, combinando tus respuestas de Kuder y Herrera y Montes.`;
  $('#result-bars').innerHTML = resultData.sortedAreas.map((area) => `<div class="result-bar-row"><div><span>${escapeHTML(area)}</span><b>${resultData.average[area]}</b></div><div class="result-bar-track"><span style="width:${Math.min(100, resultData.average[area])}%"></span></div><small>Kuder ${resultData.kuderEquivalent[area]} · Herrera ${resultData.herreraEquivalent[area]}</small></div>`).join('');
  metaStatus.textContent = 'COMPLETADO';
  counter.textContent = 'RESULTADO';
}

async function persistResult(resultData) {
  const saveStatus = $('#result-status');
  saveStatus.className = 'test-save-status is-loading';
  saveStatus.textContent = 'Guardando tu resultado…';
  const answerSnapshot = {
    kuder: kuderAnswers.map((answer) => ({ most: answer?.most ?? null, least: answer?.least ?? null })),
    herrera: herreraAnswers
  };
  try {
    const docRef = await addDoc(collection(db, 'testResults'), {
      testVersion: DATA.version,
      createdAt: serverTimestamp(),
      candidate: { name: candidate.name, age: candidate.age, gender: candidate.gender, school: candidate.school },
      validity: { raw: resultData.validityRaw, label: resultData.validity },
      kuder: { raw: resultData.kuderRaw, equivalent: resultData.kuderEquivalent },
      herrera: { natural: resultData.herreraNatural, equivalent: resultData.herreraEquivalent },
      average: resultData.average,
      topArea: resultData.sortedAreas[0],
      answers: answerSnapshot
    });
    $('#result-record-label').textContent = `ID ${docRef.id.slice(0, 8).toUpperCase()}`;
    saveStatus.className = 'test-save-status is-success';
    saveStatus.textContent = 'Resultado guardado correctamente. Tu registro quedó separado de los demás participantes.';
  } catch (error) {
    console.error('No se pudo guardar el resultado en Firebase', error);
    saveStatus.className = 'test-save-status is-error';
    saveStatus.textContent = 'Tu resultado fue calculado, pero no se pudo guardar automáticamente. Conserva esta pantalla y avisa a la persona encargada.';
  }
}

function finishTest() {
  const resultData = calculateResult();
  showResult(resultData);
  persistResult(resultData);
}

candidateForm.addEventListener('submit', (event) => {
  event.preventDefault();
  clearErrors();
  if (!candidateForm.checkValidity()) {
    candidateForm.reportValidity();
    showError(candidateError, 'Revisa los campos obligatorios antes de comenzar.');
    return;
  }
  candidate = {
    name: $('#candidate-name').value.trim(),
    age: Number($('#candidate-age').value),
    gender: $('#candidate-gender').value,
    school: $('#candidate-school').value.trim()
  };
  kuderAnswers = Array.from({ length: KUDER_COUNT }, () => ({ most: null, least: null }));
  herreraAnswers = {};
  stage = 'kuder';
  kuderPage = 0;
  herreraPage = 0;
  setHidden(intro, true);
  setHidden(result, true);
  setHidden(flow, false);
  renderKuder();
  focusCurrentStep();
});

nextButton.addEventListener('click', advance);
backButton.addEventListener('click', goBack);
$('#restart-test').addEventListener('click', () => {
  candidate = null;
  setHidden(result, true);
  setHidden(flow, true);
  setHidden(intro, false);
  candidateForm.reset();
  metaStatus.textContent = 'INICIO';
  counter.textContent = 'DATOS';
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

renderKuder();
metaStatus.textContent = 'INICIO';
counter.textContent = 'DATOS';
