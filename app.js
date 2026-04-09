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

// --- Muscle Groups ---
const MUSCLE_GROUPS = {
  push: { name: "Push", muscles: ["Chest", "Shoulders", "Triceps"], color: "#EF4444" },
  pull: { name: "Pull", muscles: ["Back", "Biceps", "Forearms"], color: "#3B82F6" },
  legs: { name: "Legs", muscles: ["Quads", "Hamstrings", "Glutes", "Calves"], color: "#F97316" },
  core: { name: "Core", muscles: ["Abs", "Obliques", "Lower Back"], color: "#FBBF24" },
  upper: { name: "Upper", muscles: ["Chest", "Back", "Shoulders", "Arms"], color: "#3B82F6" },
  lower: { name: "Lower", muscles: ["Quads", "Hamstrings", "Glutes", "Calves"], color: "#F97316" },
  full: { name: "Full Body", muscles: ["All Major Groups"], color: "#8B5CF6" },
  chest: { name: "Chest", muscles: ["Chest", "Triceps"], color: "#EF4444" },
  back: { name: "Back", muscles: ["Back", "Biceps"], color: "#3B82F6" },
  shoulders: { name: "Shoulders", muscles: ["Shoulders", "Traps"], color: "#F97316" },
  arms: { name: "Arms", muscles: ["Biceps", "Triceps", "Forearms"], color: "#FBBF24" },
};

// --- Exercise Database ---
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
  upper: [
    { id: "bp", name: "Bench Press", equipment: "Barbell", muscles: ["Chest", "Triceps"], sets: 4, reps: "8-10", rest: 90 },
    { id: "br", name: "Barbell Row", equipment: "Barbell", muscles: ["Back", "Biceps"], sets: 4, reps: "8-10", rest: 90 },
    { id: "ohp", name: "Overhead Press", equipment: "Barbell", muscles: ["Shoulders"], sets: 3, reps: "8-10", rest: 90 },
    { id: "pu", name: "Pull-Up", equipment: "Bodyweight", muscles: ["Back", "Biceps"], sets: 3, reps: "6-10", rest: 90 },
    { id: "lr", name: "Lateral Raise", equipment: "Dumbbells", muscles: ["Shoulders"], sets: 3, reps: "15-20", rest: 45 },
    { id: "dc", name: "Dumbbell Curl", equipment: "Dumbbells", muscles: ["Biceps"], sets: 3, reps: "10-12", rest: 60 },
    { id: "cpf", name: "Cable Pushdown", equipment: "Cable", muscles: ["Triceps"], sets: 3, reps: "12-15", rest: 45 },
  ],
  lower: [
    { id: "sq", name: "Barbell Squat", equipment: "Barbell", muscles: ["Quads", "Glutes"], sets: 4, reps: "6-8", rest: 120 },
    { id: "rdl", name: "Romanian Deadlift", equipment: "Barbell", muscles: ["Hamstrings", "Glutes"], sets: 4, reps: "8-10", rest: 90 },
    { id: "lp", name: "Leg Press", equipment: "Machine", muscles: ["Quads", "Glutes"], sets: 3, reps: "10-12", rest: 90 },
    { id: "lc", name: "Leg Curl", equipment: "Machine", muscles: ["Hamstrings"], sets: 3, reps: "12-15", rest: 60 },
    { id: "wl", name: "Walking Lunge", equipment: "Dumbbells", muscles: ["Quads", "Glutes"], sets: 3, reps: "12 each", rest: 60 },
    { id: "cr", name: "Calf Raise", equipment: "Machine", muscles: ["Calves"], sets: 4, reps: "15-20", rest: 45 },
  ],
  full: [
    { id: "sq", name: "Barbell Squat", equipment: "Barbell", muscles: ["Quads", "Glutes"], sets: 3, reps: "8-10", rest: 120 },
    { id: "bp", name: "Bench Press", equipment: "Barbell", muscles: ["Chest", "Triceps"], sets: 3, reps: "8-10", rest: 90 },
    { id: "br", name: "Barbell Row", equipment: "Barbell", muscles: ["Back", "Biceps"], sets: 3, reps: "8-10", rest: 90 },
    { id: "ohp", name: "Overhead Press", equipment: "Barbell", muscles: ["Shoulders"], sets: 3, reps: "8-10", rest: 90 },
    { id: "rdl", name: "Romanian Deadlift", equipment: "Barbell", muscles: ["Hamstrings"], sets: 3, reps: "10-12", rest: 90 },
    { id: "pu", name: "Pull-Up", equipment: "Bodyweight", muscles: ["Back", "Biceps"], sets: 3, reps: "6-10", rest: 90 },
  ],
  chest: [
    { id: "bp", name: "Bench Press", equipment: "Barbell", muscles: ["Chest"], sets: 4, reps: "8-10", rest: 90 },
    { id: "ibp", name: "Incline Bench Press", equipment: "Barbell", muscles: ["Upper Chest"], sets: 3, reps: "8-10", rest: 90 },
    { id: "idf", name: "Dumbbell Fly", equipment: "Dumbbells", muscles: ["Chest"], sets: 3, reps: "12-15", rest: 60 },
    { id: "cpf", name: "Cable Pushdown", equipment: "Cable", muscles: ["Triceps"], sets: 3, reps: "12-15", rest: 45 },
    { id: "td", name: "Tricep Dip", equipment: "Bodyweight", muscles: ["Triceps", "Chest"], sets: 3, reps: "10-12", rest: 60 },
  ],
  back: [
    { id: "dl", name: "Deadlift", equipment: "Barbell", muscles: ["Back"], sets: 4, reps: "5-6", rest: 120 },
    { id: "br", name: "Barbell Row", equipment: "Barbell", muscles: ["Back"], sets: 4, reps: "8-10", rest: 90 },
    { id: "pu", name: "Pull-Up", equipment: "Bodyweight", muscles: ["Back", "Biceps"], sets: 3, reps: "6-10", rest: 90 },
    { id: "fc", name: "Face Pull", equipment: "Cable", muscles: ["Back"], sets: 3, reps: "15-20", rest: 45 },
    { id: "dc", name: "Dumbbell Curl", equipment: "Dumbbells", muscles: ["Biceps"], sets: 3, reps: "10-12", rest: 60 },
  ],
  shoulders: [
    { id: "ohp", name: "Overhead Press", equipment: "Barbell", muscles: ["Shoulders"], sets: 4, reps: "8-10", rest: 90 },
    { id: "lr", name: "Lateral Raise", equipment: "Dumbbells", muscles: ["Shoulders"], sets: 4, reps: "15-20", rest: 45 },
    { id: "fc", name: "Face Pull", equipment: "Cable", muscles: ["Rear Delts"], sets: 3, reps: "15-20", rest: 45 },
    { id: "su", name: "Shrugs", equipment: "Dumbbells", muscles: ["Traps"], sets: 3, reps: "12-15", rest: 60 },
  ],
  arms: [
    { id: "dc", name: "Barbell Curl", equipment: "Barbell", muscles: ["Biceps"], sets: 4, reps: "8-10", rest: 60 },
    { id: "cpf", name: "Cable Pushdown", equipment: "Cable", muscles: ["Triceps"], sets: 4, reps: "10-12", rest: 60 },
    { id: "hc", name: "Hammer Curl", equipment: "Dumbbells", muscles: ["Biceps"], sets: 3, reps: "10-12", rest: 60 },
    { id: "ske", name: "Skull Crusher", equipment: "Barbell", muscles: ["Triceps"], sets: 3, reps: "10-12", rest: 60 },
    { id: "wc", name: "Wrist Curl", equipment: "Dumbbells", muscles: ["Forearms"], sets: 3, reps: "15-20", rest: 45 },
  ],
};

// --- Programs ---
const PROGRAMS = {
  ppl: {
    id: "ppl",
    name: "Push / Pull / Legs",
    desc: "6 days per week. High volume, targets each muscle group twice.",
    schedule: [
      { day: "Mon", type: "push", label: "Push Day" },
      { day: "Tue", type: "pull", label: "Pull Day" },
      { day: "Wed", type: "legs", label: "Leg Day" },
      { day: "Thu", type: "push", label: "Push Day" },
      { day: "Fri", type: "pull", label: "Pull Day" },
      { day: "Sat", type: "legs", label: "Leg Day" },
      { day: "Sun", type: null, label: "Rest / Active Recovery" },
    ],
    preview: ["Push", "Pull", "Legs", "Push", "Pull", "Legs", "Rest"],
  },
  upper_lower: {
    id: "upper_lower",
    name: "Upper / Lower",
    desc: "4 days per week. Balanced split with built-in recovery days.",
    schedule: [
      { day: "Mon", type: "upper", label: "Upper Body" },
      { day: "Tue", type: "lower", label: "Lower Body" },
      { day: "Wed", type: null, label: "Rest / Active Recovery" },
      { day: "Thu", type: "upper", label: "Upper Body" },
      { day: "Fri", type: "lower", label: "Lower Body" },
      { day: "Sat", type: null, label: "Rest / Active Recovery" },
      { day: "Sun", type: null, label: "Rest / Active Recovery" },
    ],
    preview: ["Upper", "Lower", "Rest", "Upper", "Lower", "Rest", "Rest"],
  },
  full_body: {
    id: "full_body",
    name: "Full Body",
    desc: "3 days per week. Great for beginners or time-constrained lifters.",
    schedule: [
      { day: "Mon", type: "full", label: "Full Body" },
      { day: "Tue", type: null, label: "Rest / Active Recovery" },
      { day: "Wed", type: "full", label: "Full Body" },
      { day: "Thu", type: null, label: "Rest / Active Recovery" },
      { day: "Fri", type: "full", label: "Full Body" },
      { day: "Sat", type: null, label: "Rest / Active Recovery" },
      { day: "Sun", type: null, label: "Rest / Active Recovery" },
    ],
    preview: ["Full", "Rest", "Full", "Rest", "Full", "Rest", "Rest"],
  },
  bro: {
    id: "bro",
    name: "Body Part Split",
    desc: "5 days per week. Classic bro split hitting one group per day.",
    schedule: [
      { day: "Mon", type: "chest", label: "Chest & Triceps" },
      { day: "Tue", type: "back", label: "Back & Biceps" },
      { day: "Wed", type: "shoulders", label: "Shoulders & Traps" },
      { day: "Thu", type: "legs", label: "Leg Day" },
      { day: "Fri", type: "arms", label: "Arms" },
      { day: "Sat", type: null, label: "Rest / Active Recovery" },
      { day: "Sun", type: null, label: "Rest / Active Recovery" },
    ],
    preview: ["Chest", "Back", "Shldrs", "Legs", "Arms", "Rest", "Rest"],
  },
};

// --- State ---
let state = {
  tab: 'train',
  activeWorkout: null,
  completedSets: {},
  setData: {},  // { "exId-setIdx": { weight: 135, reps: 10 } }
  restTimer: null,
  restTimerInterval: null,
  restTimeLeft: 0,
  profile: DB.get('profile', null),
  program: DB.get('program', null),
  workoutLog: DB.get('workoutLog', []),
  bodyWeight: DB.get('bodyWeight', null),
  weightHistory: DB.get('weightHistory', []),
  recovery: DB.get('recovery', { push: 100, pull: 100, legs: 100, core: 100 }),
  lastRecoveryUpdate: DB.get('lastRecoveryUpdate', Date.now()),
  restingHR: DB.get('restingHR', null),
  hrHistory: DB.get('hrHistory', []),
  baselineHR: DB.get('baselineHR', null),
  planConfig: DB.get('planConfig', {
    goal: "fat_loss",
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

function getSchedule() {
  const prog = PROGRAMS[state.program] || PROGRAMS.ppl;
  return prog.schedule;
}

function getTodaySchedule() {
  const d = new Date().getDay();
  const schedule = getSchedule();
  return schedule[d === 0 ? 6 : d - 1];
}

function getTodayIndex() {
  const d = new Date().getDay();
  return d === 0 ? 6 : d - 1;
}

function save() {
  DB.set('profile', state.profile);
  DB.set('program', state.program);
  DB.set('workoutLog', state.workoutLog);
  DB.set('bodyWeight', state.bodyWeight);
  DB.set('weightHistory', state.weightHistory);
  DB.set('recovery', state.recovery);
  DB.set('lastRecoveryUpdate', state.lastRecoveryUpdate);
  DB.set('restingHR', state.restingHR);
  DB.set('hrHistory', state.hrHistory);
  DB.set('baselineHR', state.baselineHR);
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

function getGroupForType(type) {
  return MUSCLE_GROUPS[type] || { name: type, muscles: [], color: "#3B82F6" };
}

// --- Render Engine ---
function render() {
  const content = $('.content');
  if (!content) return;

  if (!state.profile || !state.program) {
    renderOnboarding(content);
    const tabBar = $('.tab-bar');
    if (tabBar) tabBar.style.display = 'none';
    const headerUser = $('.header-user');
    if (headerUser) headerUser.textContent = '';
    return;
  }

  const tabBar = $('.tab-bar');
  if (tabBar) tabBar.style.display = 'flex';

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
  if (state.profile && !state.program) {
    renderProgramSelection(el);
    return;
  }

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

        <button onclick="completeProfileStep()" style="
          width:100%;padding:16px;background:var(--accent);color:#fff;
          border:none;border-radius:14px;font-size:16px;font-weight:700;
          cursor:pointer;font-family:var(--font-display);
          box-shadow:0 4px 20px var(--accent-glow);
        ">
          Next — Choose Program
        </button>

        <div id="onboard-error" style="color:var(--danger);font-size:13px;text-align:center;margin-top:12px;display:none"></div>
      </div>
    </div>`;

  setTimeout(() => {
    const nameInput = document.getElementById('onboard-name');
    if (nameInput) nameInput.focus();
  }, 100);
}

function renderProgramSelection(el) {
  let selectedProgram = state._tempProgram || null;

  let html = `
    <div style="display:flex;flex-direction:column;align-items:center;padding:20px 0">
      <div style="font-size:32px;margin-bottom:12px">📋</div>
      <div style="font-size:22px;font-weight:800;margin-bottom:4px;text-align:center">
        Choose Your Program
      </div>
      <div style="font-size:14px;color:var(--text-muted);margin-bottom:24px;text-align:center">
        You can change this anytime in Settings
      </div>
    </div>`;

  Object.values(PROGRAMS).forEach(prog => {
    const isSelected = selectedProgram === prog.id;
    html += `
      <div class="program-card ${isSelected ? 'selected' : ''}" onclick="selectOnboardProgram('${prog.id}')">
        <div class="program-card-title">${prog.name}</div>
        <div class="program-card-desc">${prog.desc}</div>
        <div class="program-card-schedule">
          ${prog.preview.map((d, i) => {
            const dayLabels = ['M','T','W','T','F','S','S'];
            const isRest = d === 'Rest';
            return `<div class="program-card-day" style="${isRest ? '' : 'color:var(--accent)'}">${dayLabels[i]}<br>${d}</div>`;
          }).join('')}
        </div>
      </div>`;
  });

  html += `
    <button id="confirm-program-btn" onclick="confirmProgram()" style="
      width:100%;padding:16px;background:${selectedProgram ? 'var(--accent)' : 'var(--card-border)'};
      color:${selectedProgram ? '#fff' : 'var(--text-muted)'};
      border:none;border-radius:14px;font-size:16px;font-weight:700;
      cursor:pointer;font-family:var(--font-display);
      box-shadow:${selectedProgram ? '0 4px 20px var(--accent-glow)' : 'none'};
      margin-top:12px;transition:all 0.2s;
      pointer-events:${selectedProgram ? 'auto' : 'none'};
    ">
      ${selectedProgram ? "Let's Go" : "Select a program"}
    </button>`;

  el.innerHTML = html;
}

window.selectOnboardProgram = function(progId) {
  state._tempProgram = progId;
  const content = $('.content');
  if (content) renderProgramSelection(content);
};

window.confirmProgram = function() {
  if (!state._tempProgram) return;
  state.program = state._tempProgram;
  delete state._tempProgram;
  save();
  render();
  if (navigator.vibrate) navigator.vibrate([50, 30, 50]);
};

window.completeProfileStep = function() {
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
  const currentSchedule = getSchedule();

  let html = `
    <div style="margin-bottom:20px">
      <div class="section-label">${dateStr}</div>
      <div class="section-title">${schedule.label}</div>
    </div>`;

  if (schedule.type) {
    const group = getGroupForType(schedule.type);
    const exercises = EXERCISES[schedule.type] || [];

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

  currentSchedule.forEach((d, i) => {
    const isToday = i === dayIdx;
    const grp = d.type ? getGroupForType(d.type) : null;
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
  const group = getGroupForType(type);
  const exercises = EXERCISES[type] || [];
  const totalSets = exercises.reduce((s, e) => s + e.sets, 0);
  const done = Object.keys(state.completedSets).length;
  const elapsed = Math.round((Date.now() - startedAt) / 60000);

  // Get last logged weights for this exercise type
  const lastWeights = DB.get(`lastWeights_${type}`, {});

  let html = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
      <div>
        <div style="font-size:22px;font-weight:700">${group.name} Day</div>
        <div style="font-size:13px;color:var(--text-muted);margin-top:2px">${done}/${totalSets} sets · ~${elapsed} min</div>
      </div>
      <button onclick="finishWorkout()" style="background:var(--accent);color:#fff;border:none;border-radius:10px;padding:10px 20px;font-weight:600;font-size:14px;cursor:pointer;font-family:var(--font-display)">Finish</button>
    </div>
    <div class="progress-bar"><div class="progress-fill" style="width:${(done / totalSets) * 100}%"></div></div>`;

  exercises.forEach((ex) => {
    const lastW = lastWeights[ex.id] || '';
    html += `<div class="card">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px">
        <div>
          <div style="font-size:16px;font-weight:600">${ex.name}</div>
          <div style="font-size:12px;color:var(--text-muted);margin-top:2px">${ex.equipment} · ${ex.muscles.join(', ')}</div>
        </div>
        <div style="font-size:12px;color:var(--text-muted);text-align:right">${ex.reps} reps<br>${ex.rest}s rest</div>
      </div>`;

    // Header row
    html += `<div style="display:flex;gap:8px;margin-bottom:6px;padding:0 2px">
      <div style="width:36px;font-size:10px;color:var(--text-muted);text-align:center;font-weight:600">SET</div>
      <div style="flex:1;font-size:10px;color:var(--text-muted);text-align:center;font-weight:600">LBS</div>
      <div style="flex:1;font-size:10px;color:var(--text-muted);text-align:center;font-weight:600">REPS</div>
      <div style="width:44px;font-size:10px;color:var(--text-muted);text-align:center;font-weight:600"></div>
    </div>`;

    for (let i = 0; i < ex.sets; i++) {
      const key = `${ex.id}-${i}`;
      const isDone = state.completedSets[key];
      const data = state.setData[key] || {};
      const weightVal = data.weight !== undefined ? data.weight : (lastW || '');
      const repsVal = data.reps !== undefined ? data.reps : '';

      html += `<div style="display:flex;gap:8px;align-items:center;margin-bottom:6px" class="set-row ${isDone ? 'set-done' : ''}">
        <div style="width:36px;text-align:center;font-size:13px;font-weight:600;color:${isDone ? 'var(--accent)' : 'var(--text-muted)'};font-family:var(--font-mono)">${i + 1}</div>
        <input type="number" inputmode="decimal" placeholder="—"
          id="w-${key}" value="${weightVal}"
          onchange="updateSetData('${key}','weight',this.value)"
          style="flex:1;background:${isDone ? 'rgba(59,130,246,0.08)' : 'var(--bg)'};border:1px solid ${isDone ? 'rgba(59,130,246,0.3)' : 'var(--card-border)'};border-radius:8px;padding:10px 8px;color:var(--text);font-size:14px;font-family:var(--font-mono);text-align:center;outline:none;-webkit-appearance:none" />
        <input type="number" inputmode="numeric" placeholder="—"
          id="r-${key}" value="${repsVal}"
          onchange="updateSetData('${key}','reps',this.value)"
          style="flex:1;background:${isDone ? 'rgba(59,130,246,0.08)' : 'var(--bg)'};border:1px solid ${isDone ? 'rgba(59,130,246,0.3)' : 'var(--card-border)'};border-radius:8px;padding:10px 8px;color:var(--text);font-size:14px;font-family:var(--font-mono);text-align:center;outline:none;-webkit-appearance:none" />
        <button onclick="toggleSet('${ex.id}',${i},${ex.rest})" style="
          width:44px;height:40px;border-radius:8px;border:none;
          background:${isDone ? 'var(--accent)' : 'var(--card-border)'};
          color:${isDone ? '#fff' : 'var(--text-muted)'};
          font-size:16px;font-weight:700;cursor:pointer;
          display:flex;align-items:center;justify-content:center;
        ">${isDone ? '✓' : '○'}</button>
      </div>`;
    }

    html += `</div>`;
  });

  el.innerHTML = html;
}

// --- Body Tab ---
function renderBody(el) {
  const recoveryColors = (val) => val >= 80 ? '#22C55E' : val >= 50 ? '#FBBF24' : '#EF4444';

  const hist = state.weightHistory;

  // Weight trend section
  let trendHtml = '';
  if (hist.length >= 2) {
    const latest = hist[hist.length - 1].weight;
    const first = hist[0].weight;
    const prev = hist[hist.length - 2].weight;
    const totalDelta = latest - first;
    const lastDelta = latest - prev;

    // Sparkline chart
    const minW = Math.min(...hist.map(h => h.weight)) - 1;
    const maxW = Math.max(...hist.map(h => h.weight)) + 1;
    const range = maxW - minW || 1;
    const chartW = 280;
    const chartH = 80;
    const padX = 10;
    const padY = 8;

    let pathD = '';
    let areaD = '';
    let dots = '';
    hist.forEach((p, i) => {
      const x = (i / (hist.length - 1)) * chartW + padX;
      const y = (chartH - padY) - ((p.weight - minW) / range) * (chartH - padY * 2);
      if (i === 0) {
        pathD += `M${x},${y}`;
        areaD += `M${x},${chartH} L${x},${y}`;
      } else {
        pathD += ` L${x},${y}`;
        areaD += ` L${x},${y}`;
      }
      if (i === hist.length - 1) {
        areaD += ` L${x},${chartH}`;
      }
      // Bigger dot on last point
      const r = i === hist.length - 1 ? 4 : 2.5;
      dots += `<circle cx="${x}" cy="${y}" r="${r}" fill="var(--accent)" />`;
    });

    // Goal line
    const goalY = (chartH - padY) - ((state.profile.goalWeight - minW) / range) * (chartH - padY * 2);
    const goalInRange = goalY > 0 && goalY < chartH;

    trendHtml = `
      <div style="display:flex;gap:8px;margin-bottom:12px">
        <div style="flex:1;background:var(--bg);border-radius:8px;padding:8px 10px;border:1px solid var(--card-border)">
          <div style="font-size:10px;color:var(--text-muted)">Since Start</div>
          <div style="font-size:15px;font-weight:700;font-family:var(--font-mono);color:${totalDelta <= 0 ? '#22C55E' : '#EF4444'};margin-top:2px">
            ${totalDelta > 0 ? '+' : ''}${totalDelta.toFixed(1)} lb
          </div>
        </div>
        <div style="flex:1;background:var(--bg);border-radius:8px;padding:8px 10px;border:1px solid var(--card-border)">
          <div style="font-size:10px;color:var(--text-muted)">Last Change</div>
          <div style="font-size:15px;font-weight:700;font-family:var(--font-mono);color:${lastDelta <= 0 ? '#22C55E' : '#EF4444'};margin-top:2px">
            ${lastDelta > 0 ? '+' : ''}${lastDelta.toFixed(1)} lb
          </div>
        </div>
        <div style="flex:1;background:var(--bg);border-radius:8px;padding:8px 10px;border:1px solid var(--card-border)">
          <div style="font-size:10px;color:var(--text-muted)">Entries</div>
          <div style="font-size:15px;font-weight:700;font-family:var(--font-mono);color:var(--accent);margin-top:2px">${hist.length}</div>
        </div>
      </div>
      <svg viewBox="0 0 300 ${chartH}" width="100%" height="${chartH}" style="display:block">
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="var(--accent)" stop-opacity="0.2" />
            <stop offset="100%" stop-color="var(--accent)" stop-opacity="0" />
          </linearGradient>
        </defs>
        <path d="${areaD} Z" fill="url(#areaGrad)" />
        <path d="${pathD}" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        ${goalInRange ? `<line x1="${padX}" y1="${goalY}" x2="${chartW + padX}" y2="${goalY}" stroke="#22C55E" stroke-width="1" stroke-dasharray="4,3" opacity="0.5" />
        <text x="${chartW + padX - 2}" y="${goalY - 4}" fill="#22C55E" font-size="8" font-family="var(--font-mono)" text-anchor="end" opacity="0.7">Goal</text>` : ''}
        ${dots}
      </svg>
      <div style="display:flex;justify-content:space-between;margin-top:4px;padding:0 4px">
        <span style="font-size:9px;color:var(--text-muted)">${hist[0].date}</span>
        ${hist.length > 2 ? `<span style="font-size:9px;color:var(--text-muted)">${hist[Math.floor(hist.length / 2)].date}</span>` : ''}
        <span style="font-size:9px;color:var(--text-muted)">${hist[hist.length - 1].date}</span>
      </div>`;
  } else if (hist.length === 1) {
    trendHtml = `<div style="text-align:center;padding:16px 0;font-size:13px;color:var(--text-muted)">Log daily weigh-ins to see your trend chart</div>`;
  }

  // --- HR Recovery Score ---
  let hrRecoveryScore = null;
  let hrRecoveryColor = 'var(--text-muted)';
  let hrRecoveryLabel = '';
  if (state.restingHR && state.baselineHR) {
    const diff = state.restingHR - state.baselineHR;
    // Score: baseline = 100%, each bpm above baseline reduces score
    // 0-2 above = fully recovered, 3-5 = moderate, 6-9 = fatigued, 10+ = overtrained
    if (diff <= 2) {
      hrRecoveryScore = 100;
      hrRecoveryColor = '#22C55E';
      hrRecoveryLabel = 'Fully Recovered';
    } else if (diff <= 5) {
      hrRecoveryScore = 80 - (diff - 3) * 10;
      hrRecoveryColor = '#FBBF24';
      hrRecoveryLabel = 'Moderate Fatigue';
    } else if (diff <= 9) {
      hrRecoveryScore = 50 - (diff - 6) * 8;
      hrRecoveryColor = '#F97316';
      hrRecoveryLabel = 'Elevated — Consider Rest';
    } else {
      hrRecoveryScore = Math.max(5, 20 - (diff - 10) * 5);
      hrRecoveryColor = '#EF4444';
      hrRecoveryLabel = 'Overtrained — Rest Day';
    }
    hrRecoveryScore = Math.max(5, Math.min(100, hrRecoveryScore));
  }

  // HR sparkline
  const hrHist = state.hrHistory;
  let hrSparkHtml = '';
  if (hrHist.length >= 2) {
    const minHR = Math.min(...hrHist.map(h => h.hr)) - 2;
    const maxHR = Math.max(...hrHist.map(h => h.hr)) + 2;
    const range = maxHR - minHR || 1;
    let pathD = '';
    let dots = '';
    hrHist.forEach((p, i) => {
      const x = (i / (hrHist.length - 1)) * 280 + 10;
      const y = 55 - ((p.hr - minHR) / range) * 45;
      if (i === 0) pathD += `M${x},${y}`;
      else pathD += ` L${x},${y}`;
      // Color dot based on deviation from baseline
      let dotColor = '#22C55E';
      if (state.baselineHR) {
        const d = p.hr - state.baselineHR;
        if (d > 5) dotColor = '#F97316';
        else if (d > 2) dotColor = '#FBBF24';
      }
      dots += `<circle cx="${x}" cy="${y}" r="3" fill="${dotColor}" />`;
    });
    hrSparkHtml = `<svg viewBox="0 0 300 60" width="100%" height="60" style="margin-top:8px">
      <path d="${pathD}" fill="none" stroke="#EF4444" stroke-width="2" stroke-linecap="round" opacity="0.6" />
      ${dots}
      ${state.baselineHR ? (() => {
        const baseY = 55 - ((state.baselineHR - minHR) / range) * 45;
        return `<line x1="10" y1="${baseY}" x2="290" y2="${baseY}" stroke="#22C55E" stroke-width="1" stroke-dasharray="4,3" opacity="0.5" />`;
      })() : ''}
    </svg>
    <div style="display:flex;justify-content:space-between;margin-top:4px">
      ${hrHist.map(p => `<span style="font-size:9px;color:var(--text-muted)">${p.date}</span>`).join('')}
    </div>`;
  }

  let html = `
    <div style="font-size:22px;font-weight:700;margin-bottom:16px">Body</div>

    <div class="card">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
        <div style="font-size:13px;color:var(--text-muted);letter-spacing:1px;text-transform:uppercase">Weight</div>
        <div style="font-size:24px;font-weight:700;font-family:var(--font-mono)">${state.bodyWeight}<span style="font-size:14px;color:var(--text-muted)"> lb</span></div>
      </div>
      ${trendHtml}
      <div style="margin-top:12px;display:flex;gap:8px">
        <input type="number" id="weight-input" value="${state.bodyWeight}" style="flex:1" />
        <button onclick="logWeight()" style="background:var(--accent-dim);color:var(--accent);border:1px solid rgba(59,130,246,0.25);border-radius:8px;padding:10px 16px;font-size:13px;font-weight:600;cursor:pointer">Log</button>
      </div>
      <div style="font-size:12px;color:var(--text-muted);margin-top:8px;text-align:center">
        Goal: ${state.profile.goalWeight} lb · ${Math.abs(state.bodyWeight - state.profile.goalWeight)} lb to ${state.bodyWeight > state.profile.goalWeight ? 'go' : 'gained'}
      </div>
    </div>

    <!-- Resting Heart Rate Card -->
    <div class="card">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
        <div style="display:flex;align-items:center;gap:8px">
          <div style="font-size:13px;color:var(--text-muted);letter-spacing:1px;text-transform:uppercase">Resting HR</div>
        </div>
        <div style="display:flex;align-items:center;gap:6px">
          ${state.restingHR ? `<span style="font-size:24px;font-weight:700;font-family:var(--font-mono);color:${hrRecoveryColor || 'var(--text)'}">${state.restingHR}</span>` : ''}
          <span style="font-size:14px;color:var(--text-muted)">bpm</span>
        </div>
      </div>`;

  // Recovery score gauge
  if (hrRecoveryScore !== null) {
    html += `
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;padding:10px;background:var(--bg);border-radius:10px;border:1px solid var(--card-border)">
        <div style="position:relative;width:48px;height:48px;flex-shrink:0">
          <svg viewBox="0 0 48 48" width="48" height="48">
            <circle cx="24" cy="24" r="20" fill="none" stroke="var(--card-border)" stroke-width="4" />
            <circle cx="24" cy="24" r="20" fill="none" stroke="${hrRecoveryColor}" stroke-width="4"
              stroke-dasharray="${2 * Math.PI * 20}"
              stroke-dashoffset="${2 * Math.PI * 20 * (1 - hrRecoveryScore / 100)}"
              stroke-linecap="round" transform="rotate(-90 24 24)" />
          </svg>
          <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;font-family:var(--font-mono);color:${hrRecoveryColor}">${hrRecoveryScore}</div>
        </div>
        <div>
          <div style="font-size:14px;font-weight:600;color:${hrRecoveryColor}">${hrRecoveryLabel}</div>
          <div style="font-size:11px;color:var(--text-muted);margin-top:2px">${state.restingHR - state.baselineHR > 0 ? '+' : ''}${state.restingHR - state.baselineHR} bpm from baseline (${state.baselineHR} bpm)</div>
        </div>
      </div>`;
  }

  // HR sparkline
  html += hrSparkHtml;

  // HR input row
  html += `
      <div style="margin-top:12px;display:flex;gap:8px">
        <input type="number" id="hr-input" placeholder="${state.restingHR || 'e.g. 62'}" inputmode="numeric"
          style="flex:1;background:var(--bg);border:1px solid var(--card-border);border-radius:8px;padding:10px;
          color:var(--text);font-size:14px;font-family:var(--font-mono);outline:none;-webkit-appearance:none;text-align:center" />
        <button onclick="logHR()" style="background:rgba(239,68,68,0.12);color:#EF4444;border:1px solid rgba(239,68,68,0.25);border-radius:8px;padding:10px 16px;font-size:13px;font-weight:600;cursor:pointer">Log</button>
      </div>`;

  // Baseline setter
  if (!state.baselineHR) {
    html += `
      <div style="margin-top:10px;padding:10px;background:rgba(59,130,246,0.06);border:1px dashed rgba(59,130,246,0.3);border-radius:8px;text-align:center">
        <div style="font-size:12px;color:var(--text-muted);margin-bottom:6px">Set your resting baseline to enable recovery scoring</div>
        <div style="display:flex;gap:8px;justify-content:center">
          <input type="number" id="baseline-hr-input" placeholder="e.g. 60" inputmode="numeric"
            style="width:80px;background:var(--bg);border:1px solid var(--card-border);border-radius:8px;padding:8px;
            color:var(--text);font-size:14px;font-family:var(--font-mono);outline:none;-webkit-appearance:none;text-align:center" />
          <button onclick="setBaselineHR()" style="background:var(--accent-dim);color:var(--accent);border:1px solid rgba(59,130,246,0.25);border-radius:8px;padding:8px 14px;font-size:12px;font-weight:600;cursor:pointer">Set Baseline</button>
        </div>
      </div>`;
  } else {
    html += `
      <div style="margin-top:8px;display:flex;justify-content:space-between;align-items:center">
        <div style="font-size:11px;color:var(--text-muted)">Baseline: ${state.baselineHR} bpm</div>
        <button onclick="resetBaseline()" style="background:none;border:none;color:var(--text-muted);font-size:11px;cursor:pointer;text-decoration:underline;font-family:var(--font-display)">Reset</button>
      </div>`;
  }

  html += `</div>

    <div class="card">
      <div style="font-size:13px;color:var(--text-muted);letter-spacing:1px;text-transform:uppercase;margin-bottom:12px">Muscle Recovery</div>
      <div class="stat-grid">`;

  Object.entries(state.recovery).forEach(([key, val]) => {
    const grp = MUSCLE_GROUPS[key];
    if (!grp) return;
    const color = recoveryColors(val);
    html += `<div class="stat-box">
      <div style="display:flex;justify-content:space-between;margin-bottom:6px">
        <span style="font-size:12px;font-weight:500">${grp.name}</span>
        <span style="font-size:12px;color:${color};font-family:var(--font-mono)">${val}%</span>
      </div>
      <div style="height:3px;background:var(--card-border);border-radius:2px;overflow:hidden">
        <div style="height:100%;width:${val}%;background:${color};border-radius:2px;transition:width 0.5s"></div>
      </div>
    </div>`;
  });

  html += `</div>
      <div style="display:flex;gap:12px;margin-top:12px;justify-content:center">
        ${[{ l: 'Fresh', c: '#22C55E' }, { l: 'Moderate', c: '#FBBF24' }, { l: 'Fatigued', c: '#EF4444' }].map(x =>
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
  const currentProg = PROGRAMS[state.program] || PROGRAMS.ppl;
  const schedule = currentProg.schedule;

  let html = `<div style="font-size:22px;font-weight:700;margin-bottom:16px">Training Plan</div>`;

  // Compact program card — horizontal schedule as pill row
  html += `<div class="card" style="border-color:rgba(59,130,246,0.3);background:linear-gradient(135deg,var(--card),rgba(59,130,246,0.06))">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
      <div>
        <div style="font-size:11px;color:var(--accent);letter-spacing:1px;text-transform:uppercase">Program</div>
        <div style="font-size:17px;font-weight:700;margin-top:2px">${currentProg.name}</div>
      </div>
      <button onclick="showProgramModal()" style="
        background:var(--accent-dim);color:var(--accent);border:1px solid rgba(59,130,246,0.25);
        border-radius:8px;padding:7px 14px;font-size:12px;font-weight:600;cursor:pointer;
        font-family:var(--font-display);
      ">Change</button>
    </div>
    <div style="display:flex;gap:4px">
      ${schedule.map((d, i) => {
        const grp = d.type ? getGroupForType(d.type) : null;
        return `<div style="flex:1;text-align:center;padding:6px 2px;border-radius:8px;background:var(--bg);border:1px solid var(--card-border)">
          <div style="font-size:10px;font-weight:600;color:var(--text-muted)">${d.day}</div>
          <div style="font-size:9px;margin-top:2px;font-weight:600;color:${grp ? grp.color : 'var(--text-muted)'}">${grp ? grp.name : 'Rest'}</div>
        </div>`;
      }).join('')}
    </div>
  </div>`;

  // Goal + Experience in one card, side by side
  html += `<div class="card" style="padding:14px">
    <div style="display:flex;gap:16px">
      <div style="flex:1">
        <div style="font-size:11px;color:var(--text-muted);letter-spacing:1px;text-transform:uppercase;margin-bottom:8px">Goal</div>
        ${[
          { value: 'fat_loss', label: 'Fat Loss' },
          { value: 'muscle', label: 'Muscle' },
          { value: 'strength', label: 'Strength' },
          { value: 'endurance', label: 'Endurance' },
        ].map(opt => `<button onclick="setPlan('goal','${opt.value}')" style="
          display:block;width:100%;text-align:left;padding:7px 10px;margin-bottom:4px;
          border-radius:7px;border:none;font-size:13px;font-weight:500;cursor:pointer;
          font-family:var(--font-display);transition:all 0.15s;
          background:${cfg.goal === opt.value ? 'var(--accent-dim)' : 'transparent'};
          color:${cfg.goal === opt.value ? 'var(--accent)' : 'var(--text-muted)'};
        ">${cfg.goal === opt.value ? '● ' : ''}${opt.label}</button>`).join('')}
      </div>
      <div style="width:1px;background:var(--card-border)"></div>
      <div style="flex:1">
        <div style="font-size:11px;color:var(--text-muted);letter-spacing:1px;text-transform:uppercase;margin-bottom:8px">Level</div>
        ${[
          { value: 'beginner', label: 'Beginner' },
          { value: 'intermediate', label: 'Intermediate' },
          { value: 'advanced', label: 'Advanced' },
        ].map(opt => `<button onclick="setPlan('experience','${opt.value}')" style="
          display:block;width:100%;text-align:left;padding:7px 10px;margin-bottom:4px;
          border-radius:7px;border:none;font-size:13px;font-weight:500;cursor:pointer;
          font-family:var(--font-display);transition:all 0.15s;
          background:${cfg.experience === opt.value ? 'var(--accent-dim)' : 'transparent'};
          color:${cfg.experience === opt.value ? 'var(--accent)' : 'var(--text-muted)'};
        ">${cfg.experience === opt.value ? '● ' : ''}${opt.label}</button>`).join('')}
      </div>
    </div>
  </div>`;

  // Cardio + Duration + Warmup combined
  html += `<div class="card" style="padding:14px">
    <div style="font-size:11px;color:var(--text-muted);letter-spacing:1px;text-transform:uppercase;margin-bottom:8px">Cardio</div>
    <div style="display:flex;gap:6px;margin-bottom:14px">
      ${[
        { value: 'off', label: 'Off' },
        { value: 'before', label: 'Before' },
        { value: 'after', label: 'After' },
      ].map(opt => `<button class="chip ${cfg.cardio === opt.value ? 'active' : ''}" onclick="setPlan('cardio','${opt.value}')" style="flex:1;text-align:center;padding:8px 0">${opt.label}</button>`).join('')}
    </div>
    <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-top:1px solid var(--card-border)">
      <div>
        <div style="font-size:13px;font-weight:500">Session Duration</div>
      </div>
      <div style="display:flex;align-items:center;gap:8px">
        <input type="range" min="30" max="120" step="5" value="${cfg.duration}"
          oninput="setPlan('duration',Number(this.value));document.getElementById('dur-val').textContent=this.value+'m'"
          style="width:100px" />
        <span id="dur-val" style="font-size:15px;font-weight:600;font-family:var(--font-mono);min-width:40px">${cfg.duration}m</span>
      </div>
    </div>
    <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-top:1px solid var(--card-border)">
      <span style="font-size:13px;font-weight:500">Warm-up Sets</span>
      <button class="toggle-track ${cfg.warmup ? 'on' : 'off'}" onclick="setPlan('warmup',${!cfg.warmup})">
        <div class="toggle-thumb"></div>
      </button>
    </div>
  </div>`;

  // Profile — compact
  html += `<div class="card" style="padding:14px">
    <div style="font-size:11px;color:var(--text-muted);letter-spacing:1px;text-transform:uppercase;margin-bottom:8px">Profile</div>
    <div style="display:flex;gap:12px;margin-bottom:10px">
      <div style="flex:1;background:var(--bg);border-radius:8px;padding:10px;border:1px solid var(--card-border)">
        <div style="font-size:10px;color:var(--text-muted)">Name</div>
        <div style="font-size:14px;font-weight:600;margin-top:2px">${state.profile.name}</div>
      </div>
      <div style="flex:1;background:var(--bg);border-radius:8px;padding:10px;border:1px solid var(--card-border)">
        <div style="font-size:10px;color:var(--text-muted)">Start</div>
        <div style="font-size:14px;font-weight:600;margin-top:2px;font-family:var(--font-mono)">${state.profile.startWeight}<span style="font-size:11px;color:var(--text-muted)"> lb</span></div>
      </div>
      <div style="flex:1;background:var(--bg);border-radius:8px;padding:10px;border:1px solid var(--card-border)">
        <div style="font-size:10px;color:var(--text-muted)">Goal</div>
        <div style="font-size:14px;font-weight:600;margin-top:2px;font-family:var(--font-mono)">${state.profile.goalWeight}<span style="font-size:11px;color:var(--text-muted)"> lb</span></div>
      </div>
    </div>
    <button onclick="resetProfile()" style="
      width:100%;padding:10px;
      background:transparent;border:1px solid var(--card-border);
      border-radius:8px;color:var(--danger);font-size:12px;
      font-weight:500;cursor:pointer;font-family:var(--font-display);
    ">
      Reset All Data
    </button>
  </div>`;

  el.innerHTML = html;
}

// --- Program Change Modal ---
window.showProgramModal = function() {
  const existing = document.getElementById('program-modal');
  if (existing) existing.remove();

  let tempSelection = state.program;

  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.id = 'program-modal';

  function renderModalContent() {
    let html = `<div class="modal-sheet">
      <div class="modal-handle"></div>
      <div style="font-size:20px;font-weight:700;margin-bottom:4px">Change Program</div>
      <div style="font-size:13px;color:var(--text-muted);margin-bottom:20px">Select a new training split</div>`;

    Object.values(PROGRAMS).forEach(prog => {
      const isSelected = tempSelection === prog.id;
      const isCurrent = state.program === prog.id;
      html += `
        <div class="program-card ${isSelected ? 'selected' : ''}" data-prog="${prog.id}">
          <div style="display:flex;justify-content:space-between;align-items:center">
            <div class="program-card-title">${prog.name}</div>
            ${isCurrent ? '<span style="font-size:11px;color:var(--accent);background:var(--accent-dim);padding:2px 8px;border-radius:4px">Current</span>' : ''}
          </div>
          <div class="program-card-desc">${prog.desc}</div>
          <div class="program-card-schedule">
            ${prog.preview.map((d, i) => {
              const dayLabels = ['M','T','W','T','F','S','S'];
              const isRest = d === 'Rest';
              return `<div class="program-card-day" style="${isRest ? '' : 'color:var(--accent)'}">${dayLabels[i]}<br>${d}</div>`;
            }).join('')}
          </div>
        </div>`;
    });

    html += `
      <div style="display:flex;gap:10px;margin-top:16px">
        <button id="modal-cancel" style="
          flex:1;padding:14px;background:var(--card-border);color:var(--text-muted);
          border:none;border-radius:12px;font-size:15px;font-weight:600;cursor:pointer;
          font-family:var(--font-display);
        ">Cancel</button>
        <button id="modal-confirm" style="
          flex:1;padding:14px;background:var(--accent);color:#fff;
          border:none;border-radius:12px;font-size:15px;font-weight:700;cursor:pointer;
          font-family:var(--font-display);box-shadow:0 4px 20px var(--accent-glow);
        ">Confirm</button>
      </div>
    </div>`;

    overlay.innerHTML = html;
  }

  renderModalContent();
  document.body.appendChild(overlay);

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      overlay.remove();
      return;
    }
    if (e.target.id === 'modal-cancel') {
      overlay.remove();
      return;
    }
    if (e.target.id === 'modal-confirm') {
      state.program = tempSelection;
      save();
      overlay.remove();
      render();
      if (navigator.vibrate) navigator.vibrate([50, 30, 50]);
      return;
    }
    const card = e.target.closest('.program-card');
    if (card) {
      tempSelection = card.dataset.prog;
      renderModalContent();
    }
  });
};

// --- Log Tab ---
function renderLog(el) {
  const log = state.workoutLog;

  let html = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
      <div style="font-size:22px;font-weight:700">Log</div>
      <div style="font-size:13px;color:var(--text-muted)">${log.length} workouts</div>
    </div>

    <div class="card">
      <div style="font-size:12px;color:var(--text-muted);letter-spacing:1px;text-transform:uppercase;margin-bottom:10px">Weekly Volume Targets</div>`;

  ['push', 'pull', 'legs', 'core'].forEach((key) => {
    const grp = MUSCLE_GROUPS[key];
    if (!grp) return;
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
      const grp = getGroupForType(entry.type);
      const color = grp.color || 'var(--accent)';
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
  state.setData = {};
  state.tab = 'train';
  render();
};

window.updateSetData = function(key, field, value) {
  if (!state.setData[key]) state.setData[key] = {};
  state.setData[key][field] = value === '' ? undefined : parseFloat(value);
};

window.toggleSet = function(exId, setIdx, restSec) {
  const key = `${exId}-${setIdx}`;

  // Capture current input values before re-render
  const wInput = document.getElementById(`w-${key}`);
  const rInput = document.getElementById(`r-${key}`);
  if (wInput && wInput.value !== '') {
    if (!state.setData[key]) state.setData[key] = {};
    state.setData[key].weight = parseFloat(wInput.value);
  }
  if (rInput && rInput.value !== '') {
    if (!state.setData[key]) state.setData[key] = {};
    state.setData[key].reps = parseFloat(rInput.value);
  }

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
  const type = state.activeWorkout.type;
  const exercises = EXERCISES[type] || [];
  const totalSets = exercises.reduce((s, e) => s + e.sets, 0);
  const done = Object.keys(state.completedSets).length;
  const now = new Date();

  const group = getGroupForType(type);

  // Capture any unsaved input values
  exercises.forEach(ex => {
    for (let i = 0; i < ex.sets; i++) {
      const key = `${ex.id}-${i}`;
      const wInput = document.getElementById(`w-${key}`);
      const rInput = document.getElementById(`r-${key}`);
      if (wInput && wInput.value !== '') {
        if (!state.setData[key]) state.setData[key] = {};
        state.setData[key].weight = parseFloat(wInput.value);
      }
      if (rInput && rInput.value !== '') {
        if (!state.setData[key]) state.setData[key] = {};
        state.setData[key].reps = parseFloat(rInput.value);
      }
    }
  });

  // Save last weights per exercise for auto-fill next session
  const lastWeights = {};
  exercises.forEach(ex => {
    for (let i = ex.sets - 1; i >= 0; i--) {
      const key = `${ex.id}-${i}`;
      const d = state.setData[key];
      if (d && d.weight) {
        lastWeights[ex.id] = d.weight;
        break;
      }
    }
  });
  DB.set(`lastWeights_${type}`, lastWeights);

  // Build detailed set log
  const setDetails = {};
  Object.entries(state.setData).forEach(([key, data]) => {
    if (state.completedSets[key]) {
      setDetails[key] = data;
    }
  });

  const entry = {
    date: now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    type,
    label: group.name,
    duration: Math.round((Date.now() - state.activeWorkout.startedAt) / 60000),
    setsCompleted: done,
    totalSets,
    setDetails,
    timestamp: Date.now(),
  };

  state.workoutLog.unshift(entry);
  if (state.recovery[type] !== undefined) {
    state.recovery[type] = Math.max(0, state.recovery[type] - 60);
  }
  state.lastRecoveryUpdate = Date.now();
  state.activeWorkout = null;
  state.completedSets = {};
  state.setData = {};
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

window.logHR = function() {
  const input = document.getElementById('hr-input');
  if (!input) return;
  const hr = parseInt(input.value);
  if (isNaN(hr) || hr < 30 || hr > 220) return;
  state.restingHR = hr;
  const d = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const lastEntry = state.hrHistory[state.hrHistory.length - 1];
  if (lastEntry && lastEntry.date === d) {
    lastEntry.hr = hr;
  } else {
    state.hrHistory.push({ date: d, hr });
    if (state.hrHistory.length > 30) state.hrHistory.shift();
  }
  // Auto-set baseline from first entry if not set
  if (!state.baselineHR && state.hrHistory.length === 1) {
    state.baselineHR = hr;
  }
  save();
  render();
  if (navigator.vibrate) navigator.vibrate(50);
};

window.setBaselineHR = function() {
  const input = document.getElementById('baseline-hr-input');
  if (!input) return;
  const hr = parseInt(input.value);
  if (isNaN(hr) || hr < 30 || hr > 220) return;
  state.baselineHR = hr;
  save();
  render();
  if (navigator.vibrate) navigator.vibrate(50);
};

window.resetBaseline = function() {
  state.baselineHR = null;
  save();
  render();
};

window.setPlan = function(key, value) {
  state.planConfig[key] = value;
  save();
  render();
};

window.resetProfile = function() {
  if (!confirm('This will reset your profile and all data. Are you sure?')) return;
  const keys = [];
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k && k.startsWith('ironlog_')) keys.push(k);
  }
  keys.forEach(k => localStorage.removeItem(k));
  state.profile = null;
  state.program = null;
  state.workoutLog = [];
  state.bodyWeight = null;
  state.weightHistory = [];
  state.restingHR = null;
  state.hrHistory = [];
  state.baselineHR = null;
  state.recovery = { push: 100, pull: 100, legs: 100, core: 100 };
  state.planConfig = { goal: 'fat_loss', daysPerWeek: 6, duration: 75, experience: 'intermediate', warmup: true, cardio: 'after' };
  state.activeWorkout = null;
  state.completedSets = {};
  state.setData = {};
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

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
      .then(() => console.log('SW registered'))
      .catch((err) => console.log('SW registration failed:', err));
  }
}

document.addEventListener('DOMContentLoaded', init);
