// ============================================================
// IronLog PWA — app.js
// ============================================================

// --- Data Layer (localStorage) ---
const DB = {
  get(key, fallback) {
    try {
      const raw = localStorage.getItem(`ironlog_${key}`);
      return raw ? JSON.parse(raw) : fallback;
    } catch { return fallback; }
  },
  set(key, val) {
    try { localStorage.setItem(`ironlog_${key}`, JSON.stringify(val)); } catch {}
  },
  remove(key) {
    try { localStorage.removeItem(`ironlog_${key}`); } catch {}
  }
};

// --- Exercise Database ---
const MUSCLE_GROUPS = {
  push: { name: "Push", muscles: ["Chest", "Shoulders", "Triceps"], color: "#E8453C" },
  pull: { name: "Pull", muscles: ["Back", "Biceps", "Forearms"], color: "#3B82F6" },
  legs: { name: "Legs", muscles: ["Quads", "Hamstrings", "Glutes", "Calves"], color: "#10B981" },
  core: { name: "Core", muscles: ["Abs", "Obliques", "Lower Back"], color: "#F59E0B" },
};

const EXERCISES = {
  push: [
    { id: "bp", name: "Bench Press", equipment: "Barbell", muscles: ["Chest", "Triceps"], sets: 4, reps: "8-10", rest: 90 },
    { id: "ohp", name: "Overhead Press", equipment: "Barbell", muscles: ["Shoulders", "Triceps"], sets: 4, reps: "8-10", rest: 90 },
    { id: "idf", name: "Incline Dumbbell Fly", equipment: "Dumbbells", muscles: ["Chest"], sets: 3, reps: "12-15", rest: 60 },
    { id: "lr", name: "Lateral Raise", equipment: "Dumbbells", muscles: ["Shoulders"], sets: 3, reps: "15-20", rest: 45 },
    { id: "td", name: "Tricep Dip", equipment: "Bodyweight", muscles: ["Triceps", "Chest"], sets: 3, reps: "10-12", rest: 60 },
    { id: "cpf", name: "Cable Pushdown", equipment: "Cable", muscles: ["Triceps"], sets: 3, reps: "12-15", rest: 45 },
  ],
  pull: [
    { id: "dl", name: "Deadlift", equipment: "Barbell", muscles: ["Back", "Hamstrings"], sets: 4, reps: "5-6", rest: 120 },
    { id: "br", name: "Barbell Row", equipment: "Barbell", muscles: ["Back", "Biceps"], sets: 4, reps: "8-10", rest: 90 },
    { id: "pu", name: "Pull-Up", equipment: "Bodyweight", muscles: ["Back", "Biceps"], sets: 3, reps: "6-10", rest: 90 },
    { id: "fc", name: "Face Pull", equipment: "Cable", muscles: ["Shoulders", "Back"], sets: 3, reps: "15-20", rest: 45 },
    { id: "dc", name: "Dumbbell Curl", equipment: "Dumbbells", muscles: ["Biceps"], sets: 3, reps: "10-12", rest: 60 },
    { id: "hc", name: "Hammer Curl", equipment: "Dumbbells", muscles: ["Biceps", "Forearms"], sets: 3, reps: "10-12", rest: 60 },
  ],
  legs: [
    { id: "sq", name: "Barbell Squat", equipment: "Barbell", muscles: ["Quads", "Glutes"], sets: 4, reps: "6-8", rest: 120 },
    { id: "rdl", name: "Romanian Deadlift", equipment: "Barbell", muscles: ["Hamstrings", "Glutes"], sets: 4, reps: "8-10", rest: 90 },
    { id: "lp", name: "Leg Press", equipment: "Machine", muscles: ["Quads", "Glutes"], sets: 3, reps: "10-12", rest: 90 },
    { id: "lc", name: "Leg Curl", equipment: "Machine", muscles: ["Hamstrings"], sets: 3, reps: "12-15", rest: 60 },
    { id: "wl", name: "Walking Lunge", equipment: "Dumbbells", muscles: ["Quads", "Glutes"], sets: 3, reps: "12 each", rest: 60 },
    { id: "cr", name: "Calf Raise", equipment: "Machine", muscles: ["Calves"], sets: 4, reps: "15-20", rest: 45 },
  ],
  core: [
    { id: "pl", name: "Plank Hold", equipment: "Bodyweight", muscles: ["Abs"], sets: 3, reps: "45-60s", rest: 45 },
    { id: "wr", name: "Cable Woodchop", equipment: "Cable", muscles: ["Obliques"], sets: 3, reps: "12 each", rest: 45 },
    { id: "bc", name: "Bicycle Crunch", equipment: "Bodyweight", muscles: ["Abs", "Obliques"], sets: 3, reps: "20", rest: 30 },
    { id: "db", name: "Dead Bug", equipment: "Bodyweight", muscles: ["Abs", "Lower Back"], sets: 3, reps: "10 each", rest: 30 },
  ],
};

const PPL_SCHEDULE = [
  { day: "Mon", type: "push", label: "Push Day" },
  { day: "Tue", type: "pull", label: "Pull Day" },
  { day: "Wed", type: "legs", label: "Leg Day" },
  { day: "Thu", type: "push", label: "Push Day" },
  { day: "Fri", type: "pull", label: "Pull Day" },
  { day: "Sat", type: "legs", label: "Leg Day" },
  { day: "Sun", type: null, label: "Rest / Active Recovery" },
];

// --- State ---
let state = {
  tab: 'train',
  activeWorkout: null,
  completedSets: {},
  restTimer: null,
  restTimerInterval: null,
  restTimeLeft: 0,
  profile: DB.get('profile', null), // { name, startWeight, goalWeight }
  workoutLog: DB.get('workoutLog', []),
  bodyWeight: DB.get('bodyWeight', null),
  weightHistory: DB.get('weightHistory', []),
  recovery: DB.get('recovery', { push: 100, pull: 100, legs: 100, core: 100 }),
  lastRecoveryUpdate: DB.get('lastRecoveryUpdate', Date.now()),
  planConfig: DB.get('planConfig', {
    goal: "fat_loss",
    split: "ppl",
    daysPerWeek: 6,
    duration: 75,
    experience: "intermediate",
    warmup: true,
    cardio: "after",
  }),
};

// --- Utilities ---
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);
const formatTime = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

function getTodaySchedule() {
  const d = new Date().getDay();
  return PPL_SCHEDULE[d === 0 ? 6 : d - 1];
}

function getTodayIndex() {
  const d = new Date().getDay();
  return d === 0 ? 6 : d - 1;
}

function save() {
  DB.set('profile', state.profile);
  DB.set('workoutLog', state.workoutLog);
  DB.set('bodyWeight', state.bodyWeight);
  DB.set('weightHistory', state.weightHistory);
  DB.set('recovery', state.recovery);
  DB.set('lastRecoveryUpdate', state.lastRecoveryUpdate);
  DB.set('planConfig', state.planConfig);
}

function tickRecovery() {
  const now = Date.now();
  const elapsed = now - state.lastRecoveryUpdate;
  const hours = elapsed / (1000 * 60 * 60);
  if (hours >= 1) {
    const increment = Math.floor(hours) * 4;
    for (const k in state.recovery) {
      state.recovery[k] = Math.min(100, state.recovery[k] + increment);
    }
    state.lastRecoveryUpdate = now;
    save();
  }
}

// --- Render Engine ---
function render() {
  const content = $('.content');
  if (!content) return;

  // Show onboarding if no profile
  if (!state.profile) {
    renderOnboarding(content);
    const tabBar = $('.tab-bar');
    if (tabBar) tabBar.style.display = 'none';
    const headerUser = $('.header-user');
    if (headerUser) headerUser.textContent = '';
    return;
  }

  // Show tab bar
  const tabBar = $('.tab-bar');
  if (tabBar) tabBar.style.display = 'flex';

  // Update header with user name
  const headerUser = $('.header-user');
  if (headerUser) headerUser.textContent = state.profile.name;

  $$('.tab-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.tab === state.tab);
  });

  switch (state.tab) {
    case 'train': renderTrain(content); break;
    case 'body': renderBody(content); break;
    case 'plan': renderPlan(content); break;
    case 'log': renderLog(content); break;
  }
}

// --- Onboarding ---
function renderOnboarding(el) {
  el.innerHTML = `
    <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:70vh;padding:20px">
      <div style="font-size:48px;margin-bottom:16px">🏋️</div>
      <div style="font-size:28px;font-weight:800;margin-bottom:4px">
        <span style="color:var(--accent)">Iron</span>Log
      </div>
      <div style="font-size:14px;color:var(--text-muted);margin-bottom:36px;text-align:center">
        Set up your profile to get started
      </div>

      <div style="width:100%;max-width:320px">
        <div style="margin-bottom:16px">
          <label style="font-size:12px;color:var(--text-muted);letter-spacing:1px;text-transform:uppercase;display:block;margin-bottom:6px">
            Your Name
          </label>
          <input type="text" id="onboard-name" placeholder="e.g. Bryan" autocomplete="given-name"
            style="width:100%;background:var(--card);border:1px solid var(--card-border);border-radius:10px;padding:14px;color:var(--text);font-size:16px;font-family:var(--font-display);outline:none" />
        </div>

        <div style="margin-bottom:16px">
          <label style="font-size:12px;color:var(--text-muted);letter-spacing:1px;text-transform:uppercase;display:block;margin-bottom:6px">
            Current Weight (lb)
          </label>
          <input type="number" id="onboard-weight" placeholder="e.g. 255" inputmode="decimal"
            style="width:100%;background:var(--card);border:1px solid var(--card-border);border-radius:10px;padding:14px;color:var(--text);font-size:16px;font-family:var(--font-mono);outline:none" />
        </div>

        <div style="margin-bottom:32px">
          <label style="font-size:12px;color:var(--text-muted);letter-spacing:1px;text-transform:uppercase;display:block;margin-bottom:6px">
            Goal Weight (lb)
          </label>
          <input type="number" id="onboard-goal" placeholder="e.g. 175" inputmode="decimal"
            style="width:100%;background:var(--card);border:1px solid var(--card-border);border-radius:10px;padding:14px;color:var(--text);font-size:16px;font-family:var(--font-mono);outline:none" />
        </div>

        <button onclick="completeOnboarding()" style="
          width:100%;padding:16px;background:var(--accent);color:#0B1120;
          border:none;border-radius:14px;font-size:16px;font-weight:700;
          cursor:pointer;font-family:var(--font-display);
          box-shadow:0 4px 20px rgba(16,185,129,0.3);
        ">
          Let's Go
        </button>

        <div id="onboard-error" style="color:var(--danger);font-size:13px;text-align:center;margin-top:12px;display:none"></div>
      </div>
    </div>`;

  setTimeout(() => {
    const nameInput = document.getElementById('onboard-name');
    if (nameInput) nameInput.focus();
  }, 100);
}

window.completeOnboarding = function() {
  const name = document.getElementById('onboard-name')?.value.trim();
  const weight = parseFloat(document.getElementById('onboard-weight')?.value);
  const goal = parseFloat(document.getElementById('onboard-goal')?.value);
  const errEl = document.getElementById('onboard-error');

  if (!name) {
    if (errEl) { errEl.textContent = 'Please enter your name'; errEl.style.display = 'block'; }
    return;
  }
  if (isNaN(weight) || weight < 50 || weight > 600) {
    if (errEl) { errEl.textContent = 'Please enter a valid current weight'; errEl.style.display = 'block'; }
    return;
  }
  if (isNaN(goal) || goal < 50 || goal > 600) {
    if (errEl) { errEl.textContent = 'Please enter a valid goal weight'; errEl.style.display = 'block'; }
    return;
  }

  const d = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  state.profile = { name, startWeight: weight, goalWeight: goal };
  state.bodyWeight = weight;
  state.weightHistory = [{ date: d, weight: weight }];
  save();
  render();

  if (navigator.vibrate) navigator.vibrate([50, 30, 50]);
};

// --- Train Tab ---
function renderTrain(el) {
  if (state.activeWorkout) {
    renderActiveWorkout(el);
    return;
  }

  const today = new Date();
  const schedule = getTodaySchedule();
  const dayIdx = getTodayIndex();
  const dateStr = today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  let html = `
    <div style="margin-bottom:20px">
      <div class="section-label">${dateStr}</div>
      <div class="section-title">${schedule.label}</div>
    </div>`;

  if (schedule.type) {
    const group = MUSCLE_GROUPS[schedule.type];
    const exercises = EXERCISES[schedule.type];

    html += `<div class="card" style="background:linear-gradient(135deg,var(--card),${group.color}15)">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
        <div style="font-size:13px;color:var(--text-muted)">${exercises.length} exercises · ~${state.planConfig.duration} min</div>
        <div style="font-size:11px;color:${group.color};background:${group.color}20;padding:4px 10px;border-radius:6px;font-weight:600">
          ${group.muscles.join(' · ')}
        </div>
      </div>`;

    exercises.forEach((ex) => {
      html += `<div class="exercise-row">
        <div>
          <div class="exercise-name">${ex.name}</div>
          <div class="exercise-sub">${ex.equipment}</div>
        </div>
        <div class="exercise-spec">${ex.sets}×${ex.reps}</div>
      </div>`;
    });

    html += `</div>
      <button class="btn-start" onclick="startWorkout('${schedule.type}')">Start Workout</button>`;
  } else {
    html += `<div class="card empty-state">
      <div style="font-size:32px;margin-bottom:8px">🧘</div>
      <div style="font-size:16px;font-weight:600">Rest Day</div>
      <div style="font-size:13px;color:var(--text-muted);margin-top:4px">Light stretching or a walk would be great today</div>
    </div>`;
  }

  html += `<div style="margin-top:20px">
    <div style="font-size:13px;color:var(--text-muted);letter-spacing:1px;text-transform:uppercase;margin-bottom:10px">This Week</div>
    <div class="week-grid">`;

  PPL_SCHEDULE.forEach((d, i) => {
    const isToday = i === dayIdx;
    const grp = d.type ? MUSCLE_GROUPS[d.type] : null;
    html += `<div class="day-pill ${isToday ? 'today' : ''}" ${d.type ? `onclick="startWorkout('${d.type}')"` : ''}>
      <div class="day-pill-label" style="color:${isToday ? 'var(--accent)' : 'var(--text-muted)'}">${d.day}</div>
      <div class="day-pill-type" style="color:${grp ? grp.color : 'var(--text-muted)'}">${grp ? grp.name : 'Rest'}</div>
    </div>`;
  });

  html += `</div></div>`;
  el.innerHTML = html;
}

function renderActiveWorkout(el) {
  const { type, startedAt } = state.activeWorkout;
  const group = MUSCLE_GROUPS[type];
  const exercises = EXERCISES[type];
  const totalSets = exercises.reduce((s, e) => s + e.sets, 0);
  const done = Object.keys(state.completedSets).length;
  const elapsed = Math.round((Date.now() - startedAt) / 60000);

  let html = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
      <div>
        <div style="font-size:22px;font-weight:700">${group.name} Day</div>
        <div style="font-size:13px;color:var(--text-muted);margin-top:2px">${done}/${totalSets} sets · ~${elapsed} min</div>
      </div>
      <button onclick="finishWorkout()" style="background:var(--accent);color:#0B1120;border:none;border-radius:10px;padding:10px 20px;font-weight:600;font-size:14px;cursor:pointer;font-family:var(--font-display)">Finish</button>
    </div>
    <div class="progress-bar"><div class="progress-fill" style="width:${(done / totalSets) * 100}%"></div></div>`;

  exercises.forEach((ex) => {
    html += `<div class="card">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px">
        <div>
          <div style="font-size:16px;font-weight:600">${ex.name}</div>
          <div style="font-size:12px;color:var(--text-muted);margin-top:2px">${ex.equipment} · ${ex.muscles.join(', ')}</div>
        </div>
        <div style="font-size:12px;color:var(--text-muted);text-align:right">${ex.reps} reps<br>${ex.rest}s rest</div>
      </div>
      <div class="set-grid">`;

    for (let i = 0; i < ex.sets; i++) {
      const key = `${ex.id}-${i}`;
      const isDone = state.completedSets[key];
      html += `<button class="set-btn ${isDone ? 'done' : ''}" onclick="toggleSet('${ex.id}',${i},${ex.rest})">${isDone ? '✓' : 'S' + (i + 1)}</button>`;
    }

    html += `</div></div>`;
  });

  el.innerHTML = html;
}

// --- Body Tab ---
function renderBody(el) {
  const recoveryColors = (val) => val >= 80 ? '#10B981' : val >= 50 ? '#F59E0B' : '#E8453C';

  const hist = state.weightHistory;
  let sparkHtml = '';
  if (hist.length >= 2) {
    const minW = Math.min(...hist.map(h => h.weight));
    const maxW = Math.max(...hist.map(h => h.weight));
    const range = maxW - minW || 1;
    let pathD = '';
    let dots = '';
    hist.forEach((p, i) => {
      const x = (i / (hist.length - 1)) * 280 + 10;
      const y = 55 - ((p.weight - minW) / range) * 45;
      if (i === 0) pathD += `M${x},${y}`;
      else pathD += ` L${x},${y}`;
      dots += `<circle cx="${x}" cy="${y}" r="3" fill="var(--accent)" />`;
    });
    sparkHtml = `<svg viewBox="0 0 300 60" width="100%" height="60">
      <path d="${pathD}" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linecap="round" />
      ${dots}
    </svg>
    <div style="display:flex;justify-content:space-between;margin-top:4px">
      ${hist.map(p => `<span style="font-size:9px;color:var(--text-muted)">${p.date}</span>`).join('')}
    </div>`;
  } else if (hist.length === 1) {
    sparkHtml = `<div style="text-align:center;padding:12px 0;font-size:13px;color:var(--text-muted)">Log more weigh-ins to see your trend</div>`;
  }

  let html = `
    <div style="font-size:22px;font-weight:700;margin-bottom:16px">Body</div>

    <div class="card">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
        <div style="font-size:13px;color:var(--text-muted);letter-spacing:1px;text-transform:uppercase">Weight</div>
        <div style="font-size:24px;font-weight:700;font-family:var(--font-mono)">${state.bodyWeight}<span style="font-size:14px;color:var(--text-muted)"> lb</span></div>
      </div>
      ${sparkHtml}
      <div style="margin-top:12px;display:flex;gap:8px">
        <input type="number" id="weight-input" value="${state.bodyWeight}" style="flex:1" />
        <button onclick="logWeight()" style="background:var(--accent-dim);color:var(--accent);border:1px solid rgba(16,185,129,0.25);border-radius:8px;padding:10px 16px;font-size:13px;font-weight:600;cursor:pointer">Log</button>
      </div>
      <div style="font-size:12px;color:var(--text-muted);margin-top:8px;text-align:center">
        Goal: ${state.profile.goalWeight} lb · ${Math.abs(state.bodyWeight - state.profile.goalWeight)} lb to ${state.bodyWeight > state.profile.goalWeight ? 'go' : 'gained'}
      </div>
    </div>

    <div class="card">
      <div style="font-size:13px;color:var(--text-muted);letter-spacing:1px;text-transform:uppercase;margin-bottom:12px">Recovery Status</div>
      <div class="stat-grid">`;

  Object.entries(state.recovery).forEach(([key, val]) => {
    const color = recoveryColors(val);
    html += `<div class="stat-box">
      <div style="display:flex;justify-content:space-between;margin-bottom:6px">
        <span style="font-size:12px;font-weight:500">${MUSCLE_GROUPS[key].name}</span>
        <span style="font-size:12px;color:${color};font-family:var(--font-mono)">${val}%</span>
      </div>
      <div style="height:3px;background:var(--card-border);border-radius:2px;overflow:hidden">
        <div style="height:100%;width:${val}%;background:${color};border-radius:2px;transition:width 0.5s"></div>
      </div>
    </div>`;
  });

  html += `</div>
      <div style="display:flex;gap:12px;margin-top:12px;justify-content:center">
        ${[{ l: 'Fresh', c: '#10B981' }, { l: 'Moderate', c: '#F59E0B' }, { l: 'Fatigued', c: '#E8453C' }].map(x =>
          `<div style="display:flex;align-items:center;gap:4px;font-size:11px;color:var(--text-muted)">
            <div style="width:8px;height:8px;border-radius:50%;background:${x.c}"></div>${x.l}
          </div>`
        ).join('')}
      </div>
    </div>`;

  el.innerHTML = html;
}

// --- Plan Tab ---
function renderPlan(el) {
  const cfg = state.planConfig;

  const sections = [
    { label: 'Goal', key: 'goal', options: [
      { value: 'fat_loss', label: 'Fat Loss' },
      { value: 'muscle', label: 'Build Muscle' },
      { value: 'strength', label: 'Strength' },
      { value: 'endurance', label: 'Endurance' },
    ]},
    { label: 'Split', key: 'split', options: [
      { value: 'ppl', label: 'Push/Pull/Legs' },
      { value: 'upper_lower', label: 'Upper/Lower' },
      { value: 'full_body', label: 'Full Body' },
      { value: 'bro', label: 'Body Part Split' },
    ]},
    { label: 'Experience', key: 'experience', options: [
      { value: 'beginner', label: 'Beginner' },
      { value: 'intermediate', label: 'Intermediate' },
      { value: 'advanced', label: 'Advanced' },
    ]},
    { label: 'Cardio', key: 'cardio', options: [
      { value: 'off', label: 'Off' },
      { value: 'before', label: 'Before Lifting' },
      { value: 'after', label: 'After Lifting' },
    ]},
  ];

  let html = `<div style="font-size:22px;font-weight:700;margin-bottom:16px">Training Plan</div>`;

  sections.forEach((sec) => {
    html += `<div class="card">
      <div style="font-size:12px;color:var(--text-muted);letter-spacing:1px;text-transform:uppercase;margin-bottom:10px">${sec.label}</div>
      <div class="chip-row">
        ${sec.options.map(opt => `<button class="chip ${cfg[sec.key] === opt.value ? 'active' : ''}" onclick="setPlan('${sec.key}','${opt.value}')">${opt.label}</button>`).join('')}
      </div>
    </div>`;
  });

  html += `<div class="card">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
      <div>
        <div style="font-size:12px;color:var(--text-muted);letter-spacing:1px;text-transform:uppercase">Days / Week</div>
        <div style="font-size:20px;font-weight:700;margin-top:2px;font-family:var(--font-mono)">${cfg.daysPerWeek}</div>
      </div>
      <div style="display:flex;gap:8px">
        ${[3,4,5,6,7].map(d => `<button onclick="setPlan('daysPerWeek',${d})" style="width:36px;height:36px;border-radius:8px;border:none;background:${cfg.daysPerWeek===d?'var(--accent)':'var(--bg)'};color:${cfg.daysPerWeek===d?'#0B1120':'var(--text-muted)'};font-weight:600;font-size:14px;cursor:pointer">${d}</button>`).join('')}
      </div>
    </div>
    <div style="border-top:1px solid var(--card-border);padding-top:12px">
      <div style="font-size:12px;color:var(--text-muted);letter-spacing:1px;text-transform:uppercase;margin-bottom:8px">Session Duration</div>
      <div style="display:flex;align-items:center;gap:12px">
        <input type="range" min="30" max="120" step="5" value="${cfg.duration}" oninput="setPlan('duration',Number(this.value));document.getElementById('dur-val').textContent=this.value+'m'" />
        <span id="dur-val" style="font-size:16px;font-weight:600;font-family:var(--font-mono);min-width:55px">${cfg.duration}m</span>
      </div>
    </div>
  </div>`;

  html += `<div class="card">
    <div class="toggle-row">
      <span style="font-size:14px">Warm-up Sets</span>
      <button class="toggle-track ${cfg.warmup ? 'on' : 'off'}" onclick="setPlan('warmup',${!cfg.warmup})">
        <div class="toggle-thumb"></div>
      </button>
    </div>
  </div>`;

  // Profile section
  html += `<div class="card" style="margin-top:8px">
    <div style="font-size:12px;color:var(--text-muted);letter-spacing:1px;text-transform:uppercase;margin-bottom:10px">Profile</div>
    <div style="display:flex;justify-content:space-between;align-items:center;padding:6px 0;border-bottom:1px solid var(--card-border)">
      <span style="font-size:14px">Name</span>
      <span style="font-size:14px;color:var(--text-muted)">${state.profile.name}</span>
    </div>
    <div style="display:flex;justify-content:space-between;align-items:center;padding:6px 0;border-bottom:1px solid var(--card-border)">
      <span style="font-size:14px">Start Weight</span>
      <span style="font-size:14px;color:var(--text-muted);font-family:var(--font-mono)">${state.profile.startWeight} lb</span>
    </div>
    <div style="display:flex;justify-content:space-between;align-items:center;padding:6px 0;border-bottom:1px solid var(--card-border)">
      <span style="font-size:14px">Goal Weight</span>
      <span style="font-size:14px;color:var(--text-muted);font-family:var(--font-mono)">${state.profile.goalWeight} lb</span>
    </div>
    <button onclick="resetProfile()" style="
      width:100%;margin-top:12px;padding:12px;
      background:transparent;border:1px solid var(--card-border);
      border-radius:10px;color:var(--danger);font-size:13px;
      font-weight:500;cursor:pointer;font-family:var(--font-display);
    ">
      Reset Profile
    </button>
  </div>`;

  el.innerHTML = html;
}
function renderLog(el) {
  const log = state.workoutLog;

  let html = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
      <div style="font-size:22px;font-weight:700">Log</div>
      <div style="font-size:13px;color:var(--text-muted)">${log.length} workouts</div>
    </div>

    <div class="card">
      <div style="font-size:12px;color:var(--text-muted);letter-spacing:1px;text-transform:uppercase;margin-bottom:10px">Weekly Volume Targets</div>`;

  Object.entries(MUSCLE_GROUPS).forEach(([key, grp]) => {
    const weekSets = log.filter(w => w.type === key).reduce((s, w) => s + w.setsCompleted, 0);
    const target = key === 'core' ? 12 : 20;
    html += `<div style="margin-bottom:10px">
      <div style="display:flex;justify-content:space-between;margin-bottom:4px">
        <span style="font-size:13px">${grp.name}</span>
        <span style="font-size:12px;color:var(--text-muted);font-family:var(--font-mono)">${weekSets}/${target} sets</span>
      </div>
      <div style="height:4px;background:var(--card-border);border-radius:2px;overflow:hidden">
        <div style="height:100%;width:${Math.min(100, (weekSets / target) * 100)}%;background:${grp.color};border-radius:2px"></div>
      </div>
    </div>`;
  });

  html += `</div>`;

  if (log.length === 0) {
    html += `<div class="card empty-state">
      <div style="font-size:28px;margin-bottom:8px">📋</div>
      <div style="font-size:14px;color:var(--text-muted)">No workouts logged yet</div>
      <div style="font-size:12px;color:var(--text-muted);margin-top:4px">Complete a workout to see it here</div>
    </div>`;
  } else {
    log.forEach((entry) => {
      const color = MUSCLE_GROUPS[entry.type]?.color || 'var(--accent)';
      html += `<div class="card log-entry" style="border-left-color:${color}">
        <div style="display:flex;justify-content:space-between;align-items:center">
          <div>
            <div style="font-size:15px;font-weight:600">${entry.label} Day</div>
            <div style="font-size:12px;color:var(--text-muted);margin-top:2px">${entry.date} · ${entry.duration} min</div>
          </div>
          <div style="text-align:right">
            <div style="font-size:16px;font-weight:700;color:var(--accent);font-family:var(--font-mono)">${entry.setsCompleted}/${entry.totalSets}</div>
            <div style="font-size:10px;color:var(--text-muted)">sets</div>
          </div>
        </div>
      </div>`;
    });
  }

  el.innerHTML = html;
}

// --- Actions ---
window.startWorkout = function(type) {
  state.activeWorkout = { type, startedAt: Date.now() };
  state.completedSets = {};
  state.tab = 'train';
  render();
};

window.toggleSet = function(exId, setIdx, restSec) {
  const key = `${exId}-${setIdx}`;
  if (state.completedSets[key]) {
    delete state.completedSets[key];
    render();
  } else {
    state.completedSets[key] = true;
    render();
    showRestTimer(restSec);
  }
};

window.finishWorkout = function() {
  if (!state.activeWorkout) return;
  const exercises = EXERCISES[state.activeWorkout.type];
  const totalSets = exercises.reduce((s, e) => s + e.sets, 0);
  const done = Object.keys(state.completedSets).length;
  const now = new Date();

  const entry = {
    date: now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    type: state.activeWorkout.type,
    label: MUSCLE_GROUPS[state.activeWorkout.type].name,
    duration: Math.round((Date.now() - state.activeWorkout.startedAt) / 60000),
    setsCompleted: done,
    totalSets,
    timestamp: Date.now(),
  };

  state.workoutLog.unshift(entry);
  state.recovery[state.activeWorkout.type] = Math.max(0, state.recovery[state.activeWorkout.type] - 60);
  state.lastRecoveryUpdate = Date.now();
  state.activeWorkout = null;
  state.completedSets = {};
  state.tab = 'log';
  save();
  render();

  if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
};

window.logWeight = function() {
  const input = document.getElementById('weight-input');
  if (!input) return;
  const w = parseFloat(input.value);
  if (isNaN(w) || w < 50 || w > 600) return;
  state.bodyWeight = w;
  const d = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const lastEntry = state.weightHistory[state.weightHistory.length - 1];
  if (lastEntry && lastEntry.date === d) {
    lastEntry.weight = w;
  } else {
    state.weightHistory.push({ date: d, weight: w });
    if (state.weightHistory.length > 30) state.weightHistory.shift();
  }
  save();
  render();
  if (navigator.vibrate) navigator.vibrate(50);
};

window.setPlan = function(key, value) {
  state.planConfig[key] = value;
  save();
  render();
};

window.resetProfile = function() {
  if (!confirm('This will reset your profile and all data. Are you sure?')) return;
  // Clear all ironlog data from localStorage
  const keys = [];
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k && k.startsWith('ironlog_')) keys.push(k);
  }
  keys.forEach(k => localStorage.removeItem(k));
  // Reset state
  state.profile = null;
  state.workoutLog = [];
  state.bodyWeight = null;
  state.weightHistory = [];
  state.recovery = { push: 100, pull: 100, legs: 100, core: 100 };
  state.planConfig = { goal: 'fat_loss', split: 'ppl', daysPerWeek: 6, duration: 75, experience: 'intermediate', warmup: true, cardio: 'after' };
  state.activeWorkout = null;
  state.completedSets = {};
  state.tab = 'train';
  render();
};

window.switchTab = function(tab) {
  state.tab = tab;
  render();
  const content = document.querySelector('.content');
  if (content) content.scrollTop = 0;
};

// --- Rest Timer ---
function showRestTimer(seconds) {
  state.restTimeLeft = seconds;
  const overlay = document.createElement('div');
  overlay.className = 'rest-overlay';
  overlay.id = 'rest-overlay';

  const pctFn = () => ((seconds - state.restTimeLeft) / seconds) * 100;

  function updateTimer() {
    const el = document.getElementById('rest-overlay');
    if (!el) return;
    const circ = 2 * Math.PI * 70;
    el.innerHTML = `
      <div class="rest-label">Rest Timer</div>
      <div style="position:relative;width:160px;height:160px">
        <svg width="160" height="160" viewBox="0 0 160 160">
          <circle cx="80" cy="80" r="70" fill="none" stroke="#1E293B" stroke-width="6" />
          <circle cx="80" cy="80" r="70" fill="none" stroke="var(--accent)" stroke-width="6"
            stroke-dasharray="${circ}"
            stroke-dashoffset="${circ * (1 - pctFn() / 100)}"
            stroke-linecap="round" transform="rotate(-90 80 80)"
            style="transition:stroke-dashoffset 1s linear" />
        </svg>
        <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center">
          <span class="rest-time">${formatTime(state.restTimeLeft)}</span>
        </div>
      </div>
      <button class="btn-skip" onclick="dismissRest()">Skip</button>`;
  }

  document.body.appendChild(overlay);
  updateTimer();

  state.restTimerInterval = setInterval(() => {
    state.restTimeLeft--;
    if (state.restTimeLeft <= 0) {
      dismissRest();
      if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
    } else {
      updateTimer();
    }
  }, 1000);
}

window.dismissRest = function() {
  clearInterval(state.restTimerInterval);
  state.restTimerInterval = null;
  const overlay = document.getElementById('rest-overlay');
  if (overlay) overlay.remove();
};

// --- Init ---
function init() {
  tickRecovery();
  render();

  setInterval(tickRecovery, 60000);

  // Register service worker with correct scope for GitHub Pages
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
      .then(() => console.log('SW registered'))
      .catch((err) => console.log('SW registration failed:', err));
  }
}

document.addEventListener('DOMContentLoaded', init);
