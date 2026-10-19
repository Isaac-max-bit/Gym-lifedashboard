const workouts = [
  {id:1,day:'LUN',name:'Pecho + tríceps',focus:'Fuerza',duration:'55 min',color:'orange',exercises:5},
  {id:2,day:'MAR',name:'Espalda + bíceps',focus:'Hipertrofia',duration:'50 min',color:'purple',exercises:4},
  {id:3,day:'MIÉ',name:'Piernas + glúteos',focus:'Fuerza',duration:'60 min',color:'green',exercises:5},
  {id:4,day:'JUE',name:'Descanso activo',focus:'Movilidad',duration:'20 min',color:'blue',exercises:3},
  {id:5,day:'VIE',name:'Hombros + abdomen',focus:'Hipertrofia',duration:'45 min',color:'pink',exercises:4}
];
const exercises = [
  {name:'Press de banca',group:'Pecho',sets:'4 × 8–10',rest:'90 s'},
  {name:'Press inclinado con mancuernas',group:'Pecho',sets:'3 × 10–12',rest:'75 s'},
  {name:'Cruces en polea',group:'Pecho',sets:'3 × 12',rest:'60 s'},
  {name:'Extensión de tríceps en polea',group:'Tríceps',sets:'3 × 12',rest:'60 s'},
  {name:'Fondos asistidos',group:'Tríceps',sets:'3 × 8–10',rest:'90 s'}
];
let completed = [1];
let currentPage = 'resumen';
const pageNames = {resumen:'Resumen',rutina:'Mi rutina',calendario:'Calendario',progreso:'Progreso',ajustes:'Ajustes'};
const pageTitle = document.querySelector('#pageTitle');
const crumbPage = document.querySelector('#crumbPage');
const pageContent = document.querySelector('#pageContent');
const searchInput = document.querySelector('#searchInput');
const toast = document.querySelector('#toast');

function notify(message) {
  toast.textContent = message;
  toast.classList.add('show');
  window.clearTimeout(notify.timer);
  notify.timer = window.setTimeout(() => toast.classList.remove('show'), 1800);
}
function updateSide() {
  document.querySelector('#sideProgress').style.width = `${completed.length/5*100}%`;
  document.querySelector('#sideCount').textContent = `${completed.length} de 5 sesiones completadas`;
}
function toggleWorkout(id) {
  completed = completed.includes(id) ? completed.filter(x => x !== id) : [...completed, id];
  updateSide();
  renderPage();
  notify('Progreso actualizado');
}
function statsMarkup() {
  const mins = completed.reduce((sum,id) => sum + ({1:55,2:50,3:60,4:20,5:45}[id] || 0),0);
  return `<section class="stats">
    <article class="stat"><div class="stat-icon orange">✣</div><span>Sesiones completadas</span><div class="stat-number">${completed.length}<small> / 5</small></div><div class="stat-foot">Esta semana</div></article>
    <article class="stat"><div class="stat-icon green">◷</div><span>Tiempo entrenado</span><div class="stat-number">${mins}<small> min</small></div><div class="stat-foot">Tiempo registrado</div></article>
    <article class="stat"><div class="stat-icon purple">♨</div><span>Racha actual</span><div class="stat-number">${completed.length}<small> días</small></div><div class="stat-foot">La constancia importa</div></article>
    <article class="stat"><div class="stat-icon blue">◎</div><span>Objetivo semanal</span><div class="stat-number">5<small> sesiones</small></div><div class="stat-foot">${5-completed.length} sesiones por completar</div></article>
  </section>`;
}
function workoutRows() {
  return workouts.map(w => `<div class="workout-row">
    <div class="day-pill ${w.color}">${w.day}</div>
    <div class="workout-info"><strong>${w.name}</strong><small>${w.focus} · ${w.exercises} ejercicios</small></div>
    <span class="duration">◷ ${w.duration}</span>
    <button class="check ${completed.includes(w.id)?'done':''}" data-toggle="${w.id}" aria-label="Marcar ${w.name}">${completed.includes(w.id)?'●':'○'}</button>
  </div>`).join('');
}
function renderResumen() {
  return `<section class="hero"><div class="hero-copy"><span class="hero-kicker">✦ PLAN DE LA SEMANA</span><h2>Pequeños pasos.<br><em>Grandes cambios.</em></h2><p>Tu rutina está preparada. Concéntrate en la técnica, respeta tus descansos y escucha a tu cuerpo.</p><button class="primary" data-page="rutina">▶ &nbsp; Comenzar rutina</button></div><div class="hero-art"><div class="dumbbell"></div></div></section>
  ${statsMarkup()}<section class="lower"><article class="panel"><div class="panel-heading"><div><p class="eyebrow">TU PLAN</p><h3>Rutina de la semana</h3></div><button class="text-button" data-page="calendario">Ver calendario ›</button></div><div class="workout-list">${workoutRows()}</div></article>
  <article class="panel"><div class="panel-heading"><div><p class="eyebrow">RECUERDA</p><h3>Tu enfoque</h3></div><span>♡</span></div><div class="focus-quote">“No necesitas hacerlo perfecto. Necesitas seguir construyendo el hábito.”</div><div class="tip"><div class="stat-icon green">★</div><div><b>Consejo de hoy</b><p>Calienta de 5 a 10 minutos y empieza con cargas que puedas controlar con buena técnica.</p></div></div><div class="water"><span>Hidratación</span><b>Recuerda beber agua</b></div></article></section>`;
}
function renderRutina() {
  const q = searchInput.value.trim().toLowerCase();
  const filtered = exercises.filter(e => `${e.name} ${e.group}`.toLowerCase().includes(q));
  const rows = filtered.map((e,i)=>`<div class="exercise-row"><span class="exercise-index">${String(i+1).padStart(2,'0')}</span><div class="exercise-info"><b>${e.name}</b><small>${e.group} · Descanso ${e.rest}</small></div><span class="sets">${e.sets}</span><button class="outline" data-exercise="${e.name}">Ver detalle</button></div>`).join('');
  return `<section class="panel panel-page"><div class="panel-heading"><div><p class="eyebrow">ENTRENAMIENTO</p><h3>Plan de ejercicios · Pecho + tríceps</h3></div><span class="tag">◷ &nbsp;55 min</span></div><p class="page-intro">Ejemplo de rutina general. Ajusta los ejercicios a tu nivel y prioriza la técnica correcta.</p><div class="exercise-list">${rows || '<p class="empty">No se encontraron ejercicios. Prueba con otro término.</p>'}</div><div class="notice">♡ <p><strong>Entrena con seguridad.</strong> Si eres principiante, tienes lesiones o una condición médica, consulta a un profesional antes de iniciar o modificar una rutina.</p></div></section>`;
}
function renderCalendario() {
  return `<section class="panel panel-page"><div class="panel-heading"><div><p class="eyebrow">PLANIFICACIÓN</p><h3>Calendario semanal</h3></div><span class="tag">5 sesiones planeadas</span></div><div class="calendar-grid">${workouts.map(w=>`<button class="calendar-day \${completed.includes(w.id)?'complete':''}" data-toggle="${w.id}"><span>${w.day}</span><div class="stat-icon \${w.color}">✣</div><strong>${w.name}</strong><small>${w.duration}</small><span class="calendar-state">\${completed.includes(w.id)?'Completado':'Pendiente'}</span></button>`).join('')}</div><p class="page-intro">Selecciona una tarjeta para marcar la sesión como completada o pendiente.</p></section>`;
}
function renderProgreso() {
  return `<section class="panel panel-page"><div class="panel-heading"><div><p class="eyebrow">SEGUIMIENTO</p><h3>Tu progreso semanal</h3></div><span>↗</span></div><div class="progress-summary"><div><span>Sesiones realizadas</span><strong>${completed.length} <small>/ 5</small></strong></div><div><span>Objetivo alcanzado</span><strong>${Math.round(completed.length/5*100)}<small>%</small></strong></div><div><span>Sesiones pendientes</span><strong>${5-completed.length}</strong></div></div><div class="progress-bars">${workouts.map(w=>`<div class="progress-line"><span>\${w.name}</span><div><i class="${completed.includes(w.id)?'done':''}"></i></div><small>${completed.includes(w.id)?'Hecho':'Pendiente'}</small></div>`).join('')}</div><div class="notice">◎ <p>Evalúa tu avance por constancia, técnica y recuperación, no solo por el peso levantado.</p></div></section>`;
}
function renderAjustes() {
  const rows = [['Objetivo semanal','Sesiones planificadas de entrenamiento','5 sesiones'],['Duración promedio','Tiempo estimado por sesión','45–60 min'],['Enfoque del plan','Fuerza, hipertrofia y movilidad','Mixto'],['Recordatorio','Revisar la rutina antes de entrenar','Activado']];
  return `<section class="panel panel-page"><div class="panel-heading"><div><p class="eyebrow">PERSONALIZACIÓN</p><h3>Ajustes de entrenamiento</h3></div><span>⚙</span></div><div class="settings-list">${rows.map(r=>`<div class="settings-row"><div><b>${r[0]}</b><p>${r[1]}</p></div><span class="setting-value">\${r[2]}</span></div>`).join('')}</div><p class="page-intro" style="margin-top:20px">Esta demostración no utiliza base de datos ni cuentas personales. El progreso se conserva solo durante la sesión actual.</p></section>`;
}
function renderPage(page=currentPage) {
  currentPage = page;
  document.querySelectorAll('.nav-item').forEach(btn=>btn.classList.toggle('active',btn.dataset.page===page));
  crumbPage.textContent = pageNames[page];
  pageTitle.textContent = page==='resumen' ? 'Hoy es un buen día para avanzar.' : pageNames[page];
  pageContent.innerHTML = ({resumen:renderResumen,rutina:renderRutina,calendario:renderCalendario,progreso:renderProgreso,ajustes:renderAjustes})[page]();
}
document.addEventListener('click', e => {
  const nav = e.target.closest('[data-page]');
  const toggle = e.target.closest('[data-toggle]');
  const exercise = e.target.closest('[data-exercise]');
  if (nav) renderPage(nav.dataset.page);
  if (toggle) toggleWorkout(Number(toggle.dataset.toggle));
  if (exercise) notify(`Ejercicio seleccionado: ${exercise.dataset.exercise}`);
});
searchInput.addEventListener('input', () => { if (currentPage==='rutina') renderPage('rutina'); });
document.querySelector('#menuButton').addEventListener('click', () => document.querySelector('#sidebar').classList.toggle('open'));
updateSide();
renderPage();