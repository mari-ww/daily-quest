/* =========================================================
   DAILY QUEST — PORTFOLIO DEMO
   Static portfolio preview with simulated interactions.
========================================================= */

const DEMO_ASSETS = {
  avatar: "./avatar.jpeg",
  avatarBackground: "./avatar-background.jpeg",
  calendarBackground: "./calendar-background.jpeg",
  quoteBackground: "./quote-background.jpeg",
  clockBackground: "./clock-background.jpeg",
};

const DEMO_MUSIC_URL =
  "https://www.youtube.com/watch?v=vpMTehdSKw8&t=1835s";

const DEMO_YOUTUBE_ID = "vpMTehdSKw8";
const DEMO_YOUTUBE_START = 1835;

const state = {
  name: "Sua",

  level: 7,
  xp: 340,
  xpToNextLevel: 600,

  hp: 78,
  mana: 64,

  mood: "good",

  tasks: [
  {
    id: 1,
    title: "Rehearse today's stage performance",
    is_completed: true,
    is_important: false,
    xp_reward: 20,
    stats: ["creativity"],
  },
  {
    id: 2,
    title: "Practice vocals until the lights go out",
    is_completed: false,
    is_important: true,
    xp_reward: 30,
    stats: ["creativity", "mental"],
  },
  {
    id: 3,
    title: "Study the next song's lyrics",
    is_completed: false,
    is_important: false,
    xp_reward: 20,
    stats: ["intelligence"],
  },
  {
    id: 4,
    title: "Survive another day under the spotlight",
    is_completed: true,
    is_important: false,
    xp_reward: 10,
    stats: ["mental"],
  },
],

activities: [
  {
    id: 1,
    title: "Listen to Mizi's favorite songs",
    mana_reward: 20,
    stat: "mental",
    is_completed: false,
  },
  {
    id: 2,
    title: "Rewatch Mizi's stage performance",
    mana_reward: 15,
    stat: "creativity",
    is_completed: true,
  },
  {
    id: 3,
    title: "Write a song for Mizi",
    mana_reward: 25,
    stat: "creativity",
    is_completed: false,
  },
],

  monthlyStats: {
    intelligence: 68,
    physical: 42,
    creativity: 81,
    social: 35,
    mental: 57,
  },

  selectedDate: new Date(),
  calendarDate: new Date(),

  timerDuration: 25 * 60,
  timerSeconds: 25 * 60,
  timerRunning: false,
  timerInterval: null,

  avatar: DEMO_ASSETS.avatar,
  avatarBackground: DEMO_ASSETS.avatarBackground,
  calendarBackground: DEMO_ASSETS.calendarBackground,
  quoteBackground: DEMO_ASSETS.quoteBackground,
  clockBackground: DEMO_ASSETS.clockBackground,

  youtubeUrl: DEMO_MUSIC_URL,
  youtubeVideoId: DEMO_YOUTUBE_ID,

  musicLoaded: true,
  musicPlaying: true,

  editingProfile: false,
};


/* =========================================================
   CONSTANTS
========================================================= */

const statOptions = [
  "intelligence",
  "physical",
  "creativity",
  "social",
  "mental",
];

const statLabels = {
  intelligence: "Intelligence",
  physical: "Physical",
  creativity: "Creativity",
  social: "Social",
  mental: "Mental",
};

const moods = [
  {
    value: "happy",
    label: "Happy",
    color: "#cdb25b",
    icon: `
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
        width="40"
        height="40"
      >
        <circle cx="12" cy="12" r="8"/>
        <circle cx="9" cy="10" r=".8" fill="currentColor"/>
        <circle cx="15" cy="10" r=".8" fill="currentColor"/>
        <path d="M8.5 14c1 1.4 2.2 2 3.5 2s2.5-.6 3.5-2"/>
      </svg>
    `,
  },

  {
    value: "good",
    label: "Good",
    color: "#2e8cb4",
    icon: `
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
        width="40"
        height="40"
      >
        <circle cx="12" cy="12" r="8"/>
        <circle cx="9" cy="10" r=".8" fill="currentColor"/>
        <circle cx="15" cy="10" r=".8" fill="currentColor"/>
        <path d="M9 14c.8.8 1.8 1.2 3 1.2s2.2-.4 3-1.2"/>
      </svg>
    `,
  },

  {
    value: "neutral",
    label: "Neutral",
    color: "#2f3ba9",
    icon: `
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
        width="40"
        height="40"
      >
        <circle cx="12" cy="12" r="8"/>
        <circle cx="9" cy="10" r=".8" fill="currentColor"/>
        <circle cx="15" cy="10" r=".8" fill="currentColor"/>
        <path d="M9 14h6"/>
      </svg>
    `,
  },

  {
    value: "sad",
    label: "Sad",
    color: "#684fb3",
    icon: `
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
        width="40"
        height="40"
      >
        <circle cx="12" cy="12" r="8"/>
        <circle cx="9" cy="10" r=".8" fill="currentColor"/>
        <circle cx="15" cy="10" r=".8" fill="currentColor"/>
        <path d="M9 15.5c.8-.9 1.8-1.4 3-1.4s2.2.5 3 1.4"/>
      </svg>
    `,
  },

  {
    value: "angry",
    label: "Angry",
    color: "#994545",
    icon: `
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
        width="40"
        height="40"
      >
        <circle cx="12" cy="12" r="8"/>
        <path d="M8.5 9.5 10 10"/>
        <path d="M15.5 9.5 14 10"/>
        <circle cx="9.5" cy="11" r=".8" fill="currentColor"/>
        <circle cx="14.5" cy="11" r=".8" fill="currentColor"/>
        <path d="M9 15c1-.8 1.9-1.1 3-1.1s2 .3 3 1.1"/>
      </svg>
    `,
  },
];


/* =========================================================
   DEMO NOTICE
========================================================= */

function showDemoNotice(message) {
  let notice = document.querySelector(".demo-feature-notice");

  if (!notice) {
    notice = document.createElement("div");
    notice.className = "demo-feature-notice";

    Object.assign(notice.style, {
      position: "fixed",
      left: "50%",
      bottom: "22px",
      zIndex: "99999",
      transform: "translate(-50%, 12px)",
      opacity: "0",
      pointerEvents: "none",

      display: "flex",
      alignItems: "center",
      gap: "10px",

      padding: "11px 15px",

      border: "1px solid #30323a",
      background:
        "linear-gradient(135deg, rgba(11,12,16,.98), rgba(8,9,12,.98))",

      color: "#9a9ba3",

      fontFamily:
        "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif",

      fontSize: "9px",
      fontWeight: "600",
      lineHeight: "1.4",
      letterSpacing: ".08em",
      textTransform: "uppercase",
      textAlign: "center",

      boxShadow:
        "0 10px 35px rgba(0,0,0,.55), 0 0 25px rgba(80,80,120,.08)",

      transition:
        "opacity .2s ease, transform .2s ease",

      maxWidth: "calc(100vw - 30px)",
    });

    document.body.appendChild(notice);
  }

  notice.textContent = `Demo preview · ${message}`;

  requestAnimationFrame(() => {
    notice.style.opacity = "1";
    notice.style.transform = "translate(-50%, 0)";
  });

  clearTimeout(notice._hideTimeout);

  notice._hideTimeout = setTimeout(() => {
    notice.style.opacity = "0";
    notice.style.transform =
      "translate(-50%, 12px)";
  }, 2800);
}


/* =========================================================
   DATE
========================================================= */

function formatDateInput(date) {
  const year = date.getFullYear();

  const month = String(
    date.getMonth() + 1,
  ).padStart(2, "0");

  const day = String(
    date.getDate(),
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatDisplayDate(date) {
  return date.toLocaleDateString(
    "en-US",
    {
      month: "long",
      day: "numeric",
      year: "numeric",
    },
  );
}

function formatWeekday(date) {
  return date.toLocaleDateString(
    "en-US",
    {
      weekday: "long",
    },
  );
}

function changeDay(amount) {
  const date = new Date(
    state.selectedDate,
  );

  date.setDate(
    date.getDate() + amount,
  );

  state.selectedDate = date;

  state.calendarDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    1,
  );

  render();
}


/* =========================================================
   CALENDAR
========================================================= */

function getCalendarDays() {
  const year =
    state.calendarDate.getFullYear();

  const month =
    state.calendarDate.getMonth();

  const firstDay =
    new Date(year, month, 1);

  const daysInMonth =
    new Date(
      year,
      month + 1,
      0,
    ).getDate();

  const startingDay =
    firstDay.getDay();

  const days = [];

  for (
    let index = 0;
    index < startingDay;
    index++
  ) {
    days.push(null);
  }

  for (
    let day = 1;
    day <= daysInMonth;
    day++
  ) {
    days.push(day);
  }

  return days;
}

function changeCalendarMonth(amount) {
  state.calendarDate = new Date(
    state.calendarDate.getFullYear(),
    state.calendarDate.getMonth() + amount,
    1,
  );

  render();
}

function selectCalendarDay(day) {
  state.selectedDate = new Date(
    state.calendarDate.getFullYear(),
    state.calendarDate.getMonth(),
    day,
  );

  render();
}

function isToday(day) {
  const today = new Date();

  return (
    today.getFullYear() ===
      state.calendarDate.getFullYear() &&
    today.getMonth() ===
      state.calendarDate.getMonth() &&
    today.getDate() === day
  );
}

function isSelectedDay(day) {
  const date = new Date(
    state.calendarDate.getFullYear(),
    state.calendarDate.getMonth(),
    day,
  );

  return (
    formatDateInput(date) ===
    formatDateInput(state.selectedDate)
  );
}

function getMoodForDay(day) {
  if (!isToday(day)) {
    return null;
  }

  return moods.find(
    (mood) =>
      mood.value === state.mood,
  );
}


/* =========================================================
   WEATHER
========================================================= */

function getWeatherIcon() {
  return `
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.4"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <circle cx="12" cy="12" r="4"/>
      <path d="
        M12 2v2
        M12 20v2
        M4.93 4.93l1.41 1.41
        M17.66 17.66l1.41 1.41
        M2 12h2
        M20 12h2
        M4.93 19.07l1.41-1.41
        M17.66 6.34l1.41-1.41
      "/>
    </svg>
  `;
}

function getWeatherLabel() {
  return "Clear";
}


/* =========================================================
   TASKS
========================================================= */

function toggleTask(taskId) {
  const task = state.tasks.find(
    (item) => item.id === taskId,
  );

  if (!task) {
    return;
  }

  task.is_completed =
    !task.is_completed;

  if (task.is_completed) {
    state.xp += task.xp_reward;
  } else {
    state.xp = Math.max(
      0,
      state.xp - task.xp_reward,
    );
  }

  state.xp = Math.min(
    state.xp,
    state.xpToNextLevel,
  );

  render();
}

function demoCreateTask(event) {
  event.preventDefault();

  showDemoNotice(
    "adding tasks is disabled in the portfolio demo.",
  );
}

function demoDeleteTask() {
  showDemoNotice(
    "deleting tasks is disabled in the portfolio demo.",
  );
}

function demoTaskStat() {
  showDemoNotice(
    "task configuration is disabled in the portfolio demo.",
  );
}


/* =========================================================
   REWARDS
========================================================= */

function toggleActivity(activityId) {
  const activity =
    state.activities.find(
      (item) => item.id === activityId,
    );

  if (!activity) {
    return;
  }

  const stat = activity.stat;

  if (activity.is_completed) {
    activity.is_completed = false;

    state.mana = Math.max(
      0,
      state.mana - activity.mana_reward,
    );

    if (
      stat &&
      state.monthlyStats[stat] !==
        undefined
    ) {
      state.monthlyStats[stat] =
        Math.max(
          0,
          state.monthlyStats[stat] - 5,
        );
    }
  } else {
    activity.is_completed = true;

    state.mana = Math.min(
      100,
      state.mana + activity.mana_reward,
    );

    if (
      stat &&
      state.monthlyStats[stat] !==
        undefined
    ) {
      state.monthlyStats[stat] =
        Math.min(
          100,
          state.monthlyStats[stat] + 5,
        );
    }
  }

  render();
}

function demoCreateActivity(event) {
  event.preventDefault();

  showDemoNotice(
    "adding rewards is disabled in the portfolio demo.",
  );
}

function demoDeleteActivity() {
  showDemoNotice(
    "deleting rewards is disabled in the portfolio demo.",
  );
}

function demoRewardStat() {
  showDemoNotice(
    "reward configuration is disabled in the portfolio demo.",
  );
}


/* =========================================================
   PROFILE
========================================================= */

function openProfileEditor() {
  state.editingProfile = true;
  render();
}

function closeProfileEditor() {
  state.editingProfile = false;
  render();
}

function saveProfile() {
  const input =
    document.getElementById(
      "profile-name-input",
    );

  if (!input) {
    return;
  }

  const value =
    input.value.trim();

  state.name =
    value || "Sua";

  state.editingProfile = false;

  render();
}


/* =========================================================
   BACKGROUNDS / AVATAR
========================================================= */

function demoImageUpload(event) {
  event.preventDefault();

  showDemoNotice(
    "image uploads are disabled in the portfolio demo.",
  );
}

function demoAvatarChange(event) {
  event.preventDefault();

  showDemoNotice(
    "avatar changes are disabled in the portfolio demo.",
  );
}


/* =========================================================
   TIMER
========================================================= */

function formatTimer(seconds) {
  const minutes =
    Math.floor(seconds / 60);

  const remainingSeconds =
    seconds % 60;

  return `${String(minutes).padStart(
    2,
    "0",
  )}:${String(
    remainingSeconds,
  ).padStart(2, "0")}`;
}

function updateTimerDisplay() {
  const element =
    document.querySelector(
      ".timer-time",
    );

  if (element) {
    element.textContent =
      formatTimer(
        state.timerSeconds,
      );
  }
}

function toggleTimer() {
  if (state.timerRunning) {
    clearInterval(
      state.timerInterval,
    );

    state.timerRunning = false;

    render();

    return;
  }

  if (state.timerSeconds <= 0) {
    state.timerSeconds =
      state.timerDuration;
  }

  state.timerRunning = true;

  state.timerInterval =
    setInterval(() => {
      if (state.timerSeconds <= 0) {
        clearInterval(
          state.timerInterval,
        );

        state.timerRunning = false;

        render();

        return;
      }

      state.timerSeconds--;

      updateTimerDisplay();
    }, 1000);

  render();
}

function resetTimer() {
  clearInterval(
    state.timerInterval,
  );

  state.timerRunning = false;

  state.timerSeconds =
    state.timerDuration;

  render();
}

function handleTimerDurationChange(
  event,
) {
  state.timerDuration =
    Number(event.target.value);

  state.timerSeconds =
    state.timerDuration;

  state.timerRunning = false;

  clearInterval(
    state.timerInterval,
  );

  render();
}


/* =========================================================
   YOUTUBE
========================================================= */

function loadYouTubeMusic(event) {
  event.preventDefault();

  showDemoNotice(
    "music loading is fixed to the portfolio demo.",
  );
}

function openYouTubeMusic() {
  window.open(
    DEMO_MUSIC_URL,
    "_blank",
    "noopener,noreferrer",
  );
}

function renderDemoMusicPlayer() {
  return `
    <div class="youtube-player">

      <div
        class="youtube-player-frame"
        style="
          position:relative;
          width:100%;
          height:100%;
          min-height:180px;
          overflow:hidden;
          display:flex;
          align-items:center;
          justify-content:center;
          background:
            radial-gradient(
              circle at center,
              rgba(55,57,70,.25),
              rgba(5,5,7,.96) 72%
            );
        "
      >

        <div
          style="
            position:absolute;
            inset:0;
            display:flex;
            flex-direction:column;
            align-items:center;
            justify-content:center;
            gap:10px;
            text-align:center;
            padding:20px;
          "
        >

          <div
            style="
              width:42px;
              height:42px;
              border:1px solid #30323a;
              border-radius:50%;
              display:flex;
              align-items:center;
              justify-content:center;
              color:#eeeeF1;
              font-size:13px;
              background:rgba(11,12,16,.75);
              box-shadow:0 0 25px rgba(0,0,0,.4);
            "
          >
            ▶
          </div>

          <strong
            style="
              font-size:10px;
              letter-spacing:.12em;
              text-transform:uppercase;
              color:#eeeeF1;
            "
          >
            Daily Quest Music
          </strong>

          <span
            style="
              font-size:8px;
              letter-spacing:.08em;
              text-transform:uppercase;
              color:#777983;
            "
          >
            Starting at 30:35
          </span>

          <button
            type="button"
            data-open-youtube
            style="
              margin-top:4px;
              border:1px solid #30323a;
              background:#0b0c10;
              color:#9a9ba3;
              padding:7px 11px;
              font:600 8px/1
                Inter,
                ui-sans-serif,
                system-ui,
                sans-serif;
              letter-spacing:.08em;
              text-transform:uppercase;
              cursor:pointer;
            "
          >
            Open on YouTube
          </button>

        </div>

      </div>

    </div>
  `;
}


/* =========================================================
   PROFILE MODAL
========================================================= */

function renderProfileModal() {
  if (!state.editingProfile) {
    return "";
  }

  return `
    <div
      class="modal-backdrop"
      id="profile-modal"
    >

      <div
        class="profile-modal"
        data-profile-modal
      >

        <div class="modal-eyebrow">
          Player Character
        </div>

        <h2>
          Edit Profile
        </h2>

        <label class="modal-label">
          Character name

          <input
            id="profile-name-input"
            class="text-input"
            type="text"
            value="${escapeHtml(
              state.name,
            )}"
            autofocus
          />
        </label>

        <div class="modal-actions">

          <button
            type="button"
            class="small-button"
            data-action="profile-cancel"
          >
            Cancel
          </button>

          <button
            type="button"
            class="small-button primary-button"
            data-action="profile-save"
          >
            Save
          </button>

        </div>

      </div>

    </div>
  `;
}


/* =========================================================
   HTML SAFETY
========================================================= */

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}


/* =========================================================
   RENDER
========================================================= */

function render() {
  const root =
    document.getElementById("app");

  if (!root) {
    return;
  }

  const completedTasks =
    state.tasks.filter(
      (task) => task.is_completed,
    ).length;

  const totalTasks =
    state.tasks.length;

  const taskProgress =
    totalTasks > 0
      ? Math.round(
          (completedTasks /
            totalTasks) *
            100,
        )
      : 0;

  const xpProgress = Math.min(
    (state.xp /
      state.xpToNextLevel) *
      100,
    100,
  );

  const currentMoodData =
    moods.find(
      (mood) =>
        mood.value === state.mood,
    );

  const monthName =
    state.calendarDate.toLocaleDateString(
      "en-US",
      {
        month: "long",
      },
    );

  const calendarYear =
    state.calendarDate.getFullYear();

  root.innerHTML = `
    <div class="app">

      <main class="dashboard">

        <!-- HEADER -->

        <header class="dashboard-header">

          <div class="brand">

            <span class="brand-mark">
              ✦
            </span>

            <div class="brand-copy">

              <span class="brand-title">
                DAILY QUEST
              </span>

              <span class="brand-subtitle">
                Your daily adventure awaits
              </span>

            </div>

          </div>


          <div class="header-level">

            <span>
              Lv.
            </span>

            <strong>
              ${state.level}
            </strong>

            <small>
              Soul Wanderer
            </small>

          </div>


          <div class="header-xp">

            <div class="header-xp-top">

              <span>
                Experience
              </span>

              <strong>
                ${state.xp} XP
              </strong>

            </div>

            <div class="header-xp-bar">

              <div
                class="header-xp-fill"
                style="
                  width:${xpProgress}%;
                "
              ></div>

            </div>

          </div>


          <div class="header-date">

            <label
              class="date-button"
              for="date-picker"
            >

              <span>
                ◷
              </span>

              <div>

                <strong>
                  ${formatDisplayDate(
                    state.selectedDate,
                  )}
                </strong>

                <span>
                  ${formatWeekday(
                    state.selectedDate,
                  )}
                </span>

              </div>

            </label>

            <input
              id="date-picker"
              class="date-picker"
              type="date"
              value="${formatDateInput(
                state.selectedDate,
              )}"
            />

          </div>


          <div class="header-weather">

            <span class="header-weather-icon">
              ${getWeatherIcon()}
            </span>

            <div>

              <strong>
                28°C
              </strong>

              <span>
                ${getWeatherLabel()}
              </span>

              <small>
                Fortaleza, CE
              </small>

            </div>

          </div>


          <div class="header-actions">

            <button
              type="button"
              class="header-action"
              data-action="previous-day"
            >
              ‹
            </button>

            <button
              type="button"
              class="header-action"
              data-action="next-day"
            >
              ›
            </button>

          </div>

        </header>


        <!-- HERO -->

        <section class="hero-grid">

          <article
            class="character-hero"
            style="
              background-image:
                linear-gradient(
                  90deg,
                  rgba(5,5,7,.96) 0%,
                  rgba(5,5,7,.86) 48%,
                  rgba(5,5,7,.55) 100%
                ),
                url('${state.avatarBackground}');
            "
          >

            <div
              class="hero-character-glow"
            ></div>


            <div
              class="hero-avatar"
              title="Change avatar"
              data-action="avatar"
            >

              <img
                src="${state.avatar}"
                alt="Character avatar"
              />

              <input
                type="file"
                accept="image/*"
                data-demo-upload="avatar"
              />

            </div>


            <label
              class="background-button"
              title="Change background"
              data-demo-background="avatar"
            >

              ✧

              <input
                type="file"
                accept="image/*"
                data-demo-upload="avatar-background"
              />

            </label>


            <div class="hero-character-info">

              <div class="hero-eyebrow">
                Player Character
              </div>

              <h1 class="hero-character-name">
                ${escapeHtml(
                  state.name,
                )}
              </h1>

              <p class="hero-quote">
                “Ainda há muito para viver.”
              </p>

              <div class="hero-divider"></div>

              <div class="hero-meta">

                <div class="hero-meta-item">

                  <span>
                    Level
                  </span>

                  <strong>
                    ${state.level}
                  </strong>

                </div>


                <div class="hero-meta-item">

                  <span>
                    XP
                  </span>

                  <strong>
                    ${state.xp}
                  </strong>

                </div>


                <div class="hero-meta-item">

                  <span>
                    Status
                  </span>

                  <strong>
                    ${
                      currentMoodData
                        ? currentMoodData.label
                        : "Unknown"
                    }
                  </strong>

                </div>


                <button
                  type="button"
                  class="profile-button"
                  data-action="profile"
                >
                  ✎ Edit profile
                </button>

              </div>

            </div>

          </article>


          <!-- MOOD -->

          <article class="mood-card">

            <div class="card-eyebrow">
              Daily Mood
            </div>

            <h2 class="mood-title">
              How are you feeling?
            </h2>

            <div class="mood-options">

              ${moods
                .map(
                  (mood) => `
                    <button
                      type="button"
                      class="mood-button ${
                        state.mood ===
                        mood.value
                          ? "active"
                          : ""
                      }"
                      data-mood="${mood.value}"
                      title="${mood.label}"
                    >

                      <div class="mood-icon">
                        ${mood.icon}
                      </div>

                      <span
                        class="mood-indicator"
                        style="
                          background-color:${mood.color};
                        "
                      ></span>

                    </button>
                  `,
                )
                .join("")}

            </div>

            <div class="mood-current">

              ${
                currentMoodData
                  ? `Current mood: ${currentMoodData.label}`
                  : "No mood recorded"
              }

            </div>

          </article>


          <!-- QUOTE -->

          <article
            class="quote-card"
            style="
              background-image:
                linear-gradient(
                  rgba(5,5,7,.80),
                  rgba(5,5,7,.90)
                ),
                url('${state.quoteBackground}');
            "
          >

            <label
              class="background-button quote-background-button"
              title="Change quote background"
              data-demo-background="quote"
            >

              ✧

              <input
                type="file"
                accept="image/*"
                data-demo-upload="quote-background"
              />

            </label>

            <span class="quote-mark">
              “
            </span>

            <blockquote>
              Every day is another
              chance to become who
              you want to be.
            </blockquote>

            <span class="quote-author">
              Daily Quest
            </span>

          </article>

        </section>


        <!-- RESOURCES -->

        <section class="resources-panel">

          <div class="resource-item">

            <div class="resource-header">

              <span>
                HP
              </span>

              <strong>
                ${state.hp} / 100
              </strong>

            </div>

            <div class="resource-bar">

              <div
                class="resource-fill"
                style="
                  width:${state.hp}%;
                "
              ></div>

            </div>

          </div>


          <div class="resource-item">

            <div class="resource-header">

              <span>
                MP
              </span>

              <strong>
                ${state.mana} / 100
              </strong>

            </div>

            <div class="resource-bar">

              <div
                class="resource-fill"
                style="
                  width:${state.mana}%;
                "
              ></div>

            </div>

          </div>


          <div class="resource-item">

            <div class="resource-header">

              <span>
                XP
              </span>

              <strong>
                ${state.xp} / ${state.xpToNextLevel}
              </strong>

            </div>

            <div class="resource-bar">

              <div
                class="resource-fill"
                style="
                  width:${xpProgress}%;
                "
              ></div>

            </div>

          </div>

        </section>


        <!-- MAIN -->

        <section class="main-grid">


          <!-- TASKS -->

          <article class="panel tasks-panel">

            <div class="panel-header">

              <h2 class="panel-title">
                Daily Tasks
              </h2>

              <span class="panel-subtitle">
                ${completedTasks}/${totalTasks} completed
              </span>

            </div>


            <div class="task-list">

              ${
                state.tasks.length === 0
                  ? `
                    <div class="empty-state">
                      No tasks for today.
                    </div>
                  `
                  : state.tasks
                      .map(
                        (task) => `
                          <div
                            class="task-item ${
                              task.is_completed
                                ? "task-completed"
                                : ""
                            }"
                          >

                            <input
                              class="task-checkbox"
                              type="checkbox"
                              ${
                                task.is_completed
                                  ? "checked"
                                  : ""
                              }
                              data-task-id="${task.id}"
                            />

                            <div class="task-content">

                              <div class="task-title">
                                ${escapeHtml(
                                  task.title,
                                )}
                              </div>

                              <div class="task-meta">

                                ${
                                  task.stats.length > 0
                                    ? task.stats
                                        .map(
                                          (stat) =>
                                            statLabels[
                                              stat
                                            ],
                                        )
                                        .join(" · ")
                                    : "Daily task"
                                }

                              </div>

                            </div>

                            <span class="task-xp">
                              +${task.xp_reward} XP
                            </span>

                            <button
                              type="button"
                              class="delete-button"
                              data-delete-task="${task.id}"
                              title="Delete task"
                              aria-label="Delete task"
                            >
                              ×
                            </button>

                          </div>
                        `,
                      )
                      .join("")
              }

            </div>


            <form
              class="inline-form task-form"
              data-create-task
            >

              <input
                class="text-input"
                type="text"
                placeholder="Add a new task..."
              />

              <input
                class="number-input"
                type="number"
                min="10"
                max="100"
                step="10"
                value="10"
                title="XP reward"
              />

              <div
                class="stat-selector"
                role="group"
                aria-label="Task stats"
              >

                ${statOptions
                  .map(
                    (stat, index) => `
                      <button
                        class="stat-option ${
                          index === 0
                            ? "active"
                            : ""
                        }"
                        type="button"
                        data-task-stat="${stat}"
                        aria-pressed="${
                          index === 0
                        }"
                      >
                        ${statLabels[stat]}
                      </button>
                    `,
                  )
                  .join("")}

              </div>

              <button
                class="small-button"
                type="submit"
              >
                Add
              </button>

            </form>

          </article>


          <!-- REWARDS -->

          <article class="panel">

            <div class="panel-header">

              <h2 class="panel-title">
                Rewards
              </h2>

              <span class="panel-subtitle">
                Restore MP
              </span>

            </div>


            <div class="activity-list">

              ${
                state.activities.length === 0
                  ? `
                    <div class="empty-state">
                      No rewards yet.
                    </div>
                  `
                  : state.activities
                      .map(
                        (activity) => `
                          <div
                            class="activity-item ${
                              activity.is_completed
                                ? "activity-completed"
                                : ""
                            }"
                          >

                            <button
                              class="complete-button ${
                                activity.is_completed
                                  ? "completed"
                                  : ""
                              }"
                              type="button"
                              data-activity-id="${activity.id}"
                              title="${
                                activity.is_completed
                                  ? "Undo reward"
                                  : "Use reward"
                              }"
                            >

                              ${
                                activity.is_completed
                                  ? "✓"
                                  : "+"
                              }

                            </button>


                            <div class="activity-content">

                              <div class="activity-title">
                                ${escapeHtml(
                                  activity.title,
                                )}
                              </div>

                              <div class="activity-meta">

                                ${
                                  activity.stat
                                    ? `${statLabels[activity.stat]} · Restore MP`
                                    : "Restore MP"
                                }

                              </div>

                            </div>


                            <span class="reward">
                              +${activity.mana_reward} MP
                            </span>


                            <button
                              type="button"
                              class="delete-button"
                              data-delete-activity="${activity.id}"
                              title="Delete reward"
                              aria-label="Delete reward"
                            >
                              ×
                            </button>

                          </div>
                        `,
                      )
                      .join("")
              }

            </div>


            <form
              class="inline-form"
              data-create-activity
            >

              <input
                class="text-input"
                type="text"
                placeholder="Add a reward..."
              />

              <input
                class="number-input"
                type="number"
                min="1"
                max="100"
                value="10"
                title="MP restored"
              />

              <div class="activity-stat-field">

                <span class="form-field-label">
                  Stat
                </span>

                <select
                  class="select-input reward-stat-select"
                  title="Stat"
                  aria-label="Reward stat"
                >

                  ${statOptions
                    .map(
                      (stat) => `
                        <option value="${stat}">
                          ${statLabels[stat]}
                        </option>
                      `,
                    )
                    .join("")}

                </select>

              </div>

              <button
                class="small-button"
                type="submit"
              >
                Add
              </button>

            </form>

          </article>


          <!-- FOCUS STACK -->

          <div class="focus-stack">


            <!-- TIMER -->

            <article
              class="panel focus-timer-panel"
              style="
                background-image:
                  linear-gradient(
                    to bottom,
                    rgba(5,5,7,0.75),
                    rgba(5,5,7,0.25) 100%,
                    rgba(5,5,7,0.75)
                  ),
                  url('${state.clockBackground}');
              "
            >

              <label
                class="background-button clock-background-button"
                title="Change clock background"
                data-demo-background="clock"
              >

                ✧

                <input
                  type="file"
                  accept="image/*"
                  data-demo-upload="clock-background"
                />

              </label>


              <div class="focus-timer-content">

                <div class="gothic-clock">

                  <svg
                    class="gothic-clock-svg"
                    viewBox="0 0 180 180"
                    aria-hidden="true"
                  >

                    <circle
                      cx="90"
                      cy="90"
                      r="82"
                      class="clock-ring outer"
                    />

                    <circle
                      cx="90"
                      cy="90"
                      r="76"
                      class="clock-ring"
                    />

                    <circle
                      cx="90"
                      cy="90"
                      r="69"
                      class="clock-ring inner"
                    />


                    <line
                      x1="90"
                      y1="20"
                      x2="90"
                      y2="29"
                    />

                    <line
                      x1="90"
                      y1="151"
                      x2="90"
                      y2="160"
                    />

                    <line
                      x1="20"
                      y1="90"
                      x2="29"
                      y2="90"
                    />

                    <line
                      x1="151"
                      y1="90"
                      x2="160"
                      y2="90"
                    />

                    <line
                      x1="40"
                      y1="40"
                      x2="47"
                      y2="47"
                    />

                    <line
                      x1="133"
                      y1="133"
                      x2="140"
                      y2="140"
                    />

                    <line
                      x1="140"
                      y1="40"
                      x2="133"
                      y2="47"
                    />

                    <line
                      x1="47"
                      y1="133"
                      x2="40"
                      y2="140"
                    />


                    <path
                      d="M90 10 L94 17 L90 24 L86 17 Z"
                    />

                    <path
                      d="M90 156 L94 163 L90 170 L86 163 Z"
                    />


                    <line
                      class="clock-hand clock-hour ${
                        state.timerRunning
                          ? "running"
                          : ""
                      }"
                      x1="90"
                      y1="90"
                      x2="90"
                      y2="54"
                    />

                    <line
                      class="clock-hand clock-minute ${
                        state.timerRunning
                          ? "running"
                          : ""
                      }"
                      x1="90"
                      y1="90"
                      x2="117"
                      y2="90"
                    />

                    <circle
                      cx="90"
                      cy="90"
                      r="5"
                      class="clock-center"
                    />

                    <path
                      class="clock-star"
                      d="
                        M90 78
                        L93 87
                        L102 90
                        L93 93
                        L90 102
                        L87 93
                        L78 90
                        L87 87
                        Z
                      "
                    />

                  </svg>


                  <div class="timer-time">
                    ${formatTimer(
                      state.timerSeconds,
                    )}
                  </div>

                </div>


                <div class="timer-controls">

                  <select
                    class="timer-select"
                    data-timer-select
                    ${
                      state.timerRunning
                        ? "disabled"
                        : ""
                    }
                  >

                    <option
                      value="300"
                      ${
                        state.timerDuration ===
                        300
                          ? "selected"
                          : ""
                      }
                    >
                      05 MIN
                    </option>

                    <option
                      value="600"
                      ${
                        state.timerDuration ===
                        600
                          ? "selected"
                          : ""
                      }
                    >
                      10 MIN
                    </option>

                    <option
                      value="900"
                      ${
                        state.timerDuration ===
                        900
                          ? "selected"
                          : ""
                      }
                    >
                      15 MIN
                    </option>

                    <option
                      value="1500"
                      ${
                        state.timerDuration ===
                        1500
                          ? "selected"
                          : ""
                      }
                    >
                      25 MIN
                    </option>

                    <option
                      value="1800"
                      ${
                        state.timerDuration ===
                        1800
                          ? "selected"
                          : ""
                      }
                    >
                      30 MIN
                    </option>

                    <option
                      value="2700"
                      ${
                        state.timerDuration ===
                        2700
                          ? "selected"
                          : ""
                      }
                    >
                      45 MIN
                    </option>

                    <option
                      value="3600"
                      ${
                        state.timerDuration ===
                        3600
                          ? "selected"
                          : ""
                      }
                    >
                      60 MIN
                    </option>

                  </select>


                  <button
                    type="button"
                    class="timer-button"
                    data-action="timer-toggle"
                  >
                    ${
                      state.timerRunning
                        ? "Pause"
                        : "Start"
                    }
                  </button>


                  <button
                    type="button"
                    class="timer-button"
                    data-action="timer-reset"
                  >
                    Reset
                  </button>

                </div>

              </div>

            </article>


            <!-- MUSIC -->

            <article class="panel music-panel">

              <div class="music-content">

                <div
                  class="music-waveform ${
                    state.musicPlaying
                      ? "active"
                      : ""
                  }"
                  aria-hidden="true"
                >

                  ${Array.from(
                    { length: 40 },
                    (_, index) => `
                      <span
                        style="
                          animation-delay:${
                            index * -0.06
                          }s;
                        "
                      ></span>
                    `,
                  ).join("")}

                </div>


                <div class="music-label">

                  <span>
                    ♫
                  </span>

                  YouTube Music

                </div>


                <form
                  class="music-form"
                  data-music-form
                >

                  <input
                    class="music-input"
                    type="text"
                    value="${escapeHtml(
                      state.youtubeUrl,
                    )}"
                    placeholder="Paste YouTube link..."
                    aria-label="YouTube music URL"
                  />

                  <button
                    class="music-load-button"
                    type="submit"
                  >
                    Load
                  </button>

                </form>


                ${
                  state.musicLoaded
                    ? renderDemoMusicPlayer()
                    : ""
                }

              </div>

            </article>

          </div>


          <!-- CALENDAR -->

          <article
            class="panel calendar-panel"
            style="
              background-image:
                linear-gradient(
                  rgba(11,12,16,.86),
                  rgba(11,12,16,.94)
                ),
                url('${state.calendarBackground}');
            "
          >

            <label
              class="background-button calendar-background-button"
              title="Change calendar background"
              data-demo-background="calendar"
            >

              ✧

              <input
                type="file"
                accept="image/*"
                data-demo-upload="calendar-background"
              />

            </label>


            <div class="calendar-header">

              <span class="calendar-month">

                ${monthName}
                ${calendarYear}

              </span>


              <div class="calendar-nav">

                <button
                  type="button"
                  data-action="calendar-prev"
                >
                  ‹
                </button>

                <button
                  type="button"
                  data-action="calendar-next"
                >
                  ›
                </button>

              </div>

            </div>


            <div class="calendar-weekdays">

              ${[
                "S",
                "M",
                "T",
                "W",
                "T",
                "F",
                "S",
              ]
                .map(
                  (day) =>
                    `<span>${day}</span>`,
                )
                .join("")}

            </div>


            <div class="calendar-grid">

              ${getCalendarDays()
                .map(
                  (day, index) => {
                    if (day === null) {
                      return `
                        <span
                          class="calendar-day empty"
                        ></span>
                      `;
                    }

                    const mood =
                      getMoodForDay(day);

                    return `
                      <button
                        type="button"
                        class="calendar-day ${
                          isToday(day)
                            ? "today"
                            : ""
                        } ${
                          isSelectedDay(day)
                            ? "selected"
                            : ""
                        }"
                        data-calendar-day="${day}"
                      >

                        <span
                          class="calendar-day-number"
                        >
                          ${day}
                        </span>

                        ${
                          mood
                            ? `
                              <span
                                class="calendar-day-mood"
                                title="${mood.label}"
                                style="
                                  background-color:${mood.color};
                                  display:block;
                                  position:absolute;
                                  left:50%;
                                  bottom:3px;
                                  transform:translateX(-50%);
                                  width:18px;
                                  height:2px;
                                  border-radius:2px;
                                  z-index:2;
                                  pointer-events:none;
                                "
                              ></span>
                            `
                            : ""
                        }

                      </button>
                    `;
                  },
                )
                .join("")}

            </div>

          </article>


          <!-- SUMMARY -->

          <article class="panel">

            <div class="panel-header">

              <h2 class="panel-title">
                Daily Summary
              </h2>

            </div>


            <div class="summary-content">

              <div class="summary-main">

                <strong>
                  ${taskProgress}%
                </strong>

                <span>
                  Tasks completed
                </span>

              </div>


              <div class="summary-row">

                <span>
                  Tasks
                </span>

                <strong>
                  ${completedTasks}/${totalTasks}
                </strong>

              </div>


              <div class="summary-row">

                <span>
                  Rewards
                </span>

                <strong>
                  ${state.activities.length}
                </strong>

              </div>


              <div class="summary-row">

                <span>
                  XP earned
                </span>

                <strong>
                  ${state.xp} XP
                </strong>

              </div>

            </div>

          </article>


          <!-- STATS -->

          <article class="panel stats-panel-compact">

            <div class="panel-header">

              <h2 class="panel-title">
                Stats
              </h2>

            </div>


            <div class="stats-list stats-scroll">

              ${statOptions
                .map(
                  (stat) => `
                    <div class="stat-row">

                      <span class="stat-name">
                        ${statLabels[stat]}
                      </span>

                      <div class="stat-bar">

                        <div
                          class="stat-fill"
                          style="
                            width:${state.monthlyStats[stat]}%;
                          "
                        ></div>

                      </div>

                      <span class="stat-value">
                        ${state.monthlyStats[stat]}
                      </span>

                    </div>
                  `,
                )
                .join("")}

            </div>

          </article>

        </section>

      </main>


      ${renderProfileModal()}

    </div>
  `;

  attachEvents();
}


/* =========================================================
   EVENTS
========================================================= */

function attachEvents() {

  /* -----------------------------------------
     TASK COMPLETION
  ----------------------------------------- */

  document
    .querySelectorAll(
      "[data-task-id]",
    )
    .forEach((checkbox) => {

      checkbox.addEventListener(
        "change",
        () => {
          toggleTask(
            Number(
              checkbox.dataset.taskId,
            ),
          );
        },
      );

    });


  /* -----------------------------------------
     TASK DELETE
  ----------------------------------------- */

  document
    .querySelectorAll(
      "[data-delete-task]",
    )
    .forEach((button) => {

      button.addEventListener(
        "click",
        demoDeleteTask,
      );

    });


  /* -----------------------------------------
     TASK CREATE
  ----------------------------------------- */

  const taskForm =
    document.querySelector(
      "[data-create-task]",
    );

  if (taskForm) {
    taskForm.addEventListener(
      "submit",
      demoCreateTask,
    );
  }


  /* -----------------------------------------
     TASK STAT BUTTONS
  ----------------------------------------- */

  document
    .querySelectorAll(
      "[data-task-stat]",
    )
    .forEach((button) => {

      button.addEventListener(
        "click",
        () => {
          demoTaskStat();
        },
      );

    });


  /* -----------------------------------------
     ACTIVITIES
  ----------------------------------------- */

  document
    .querySelectorAll(
      "[data-activity-id]",
    )
    .forEach((button) => {

      button.addEventListener(
        "click",
        () => {
          toggleActivity(
            Number(
              button.dataset.activityId,
            ),
          );
        },
      );

    });


  /* -----------------------------------------
     ACTIVITY DELETE
  ----------------------------------------- */

  document
    .querySelectorAll(
      "[data-delete-activity]",
    )
    .forEach((button) => {

      button.addEventListener(
        "click",
        demoDeleteActivity,
      );

    });


  /* -----------------------------------------
     ACTIVITY CREATE
  ----------------------------------------- */

  const activityForm =
    document.querySelector(
      "[data-create-activity]",
    );

  if (activityForm) {
    activityForm.addEventListener(
      "submit",
      demoCreateActivity,
    );
  }


  /* -----------------------------------------
     REWARD STAT
  ----------------------------------------- */

  document
    .querySelectorAll(
      ".reward-stat-select",
    )
    .forEach((select) => {

      select.addEventListener(
        "change",
        (event) => {

          event.preventDefault();

          demoRewardStat();

          select.value =
            "intelligence";

        },
      );

    });


  /* -----------------------------------------
     MOOD
  ----------------------------------------- */

  document
    .querySelectorAll(
      "[data-mood]",
    )
    .forEach((button) => {

      button.addEventListener(
        "click",
        () => {

          state.mood =
            button.dataset.mood;

          render();

        },
      );

    });


  /* -----------------------------------------
     PROFILE
  ----------------------------------------- */

  const profileButton =
    document.querySelector(
      '[data-action="profile"]',
    );

  if (profileButton) {
    profileButton.addEventListener(
      "click",
      openProfileEditor,
    );
  }


  const profileModal =
    document.getElementById(
      "profile-modal",
    );

  if (profileModal) {

    profileModal.addEventListener(
      "click",
      (event) => {

        if (
          event.target ===
          profileModal
        ) {
          closeProfileEditor();
        }

      },
    );

  }


  const profileCancel =
    document.querySelector(
      '[data-action="profile-cancel"]',
    );

  if (profileCancel) {
    profileCancel.addEventListener(
      "click",
      closeProfileEditor,
    );
  }


  const profileSave =
    document.querySelector(
      '[data-action="profile-save"]',
    );

  if (profileSave) {
    profileSave.addEventListener(
      "click",
      saveProfile,
    );
  }


  /* -----------------------------------------
     AVATAR
  ----------------------------------------- */

  const avatar =
    document.querySelector(
      '[data-action="avatar"]',
    );

  if (avatar) {

    avatar.addEventListener(
      "click",
      (event) => {

        event.preventDefault();

        showDemoNotice(
          "avatar changes are disabled in the portfolio demo.",
        );

      },
    );

  }


  /* -----------------------------------------
     BACKGROUND BUTTONS
  ----------------------------------------- */

  document
    .querySelectorAll(
      "[data-demo-background]",
    )
    .forEach((button) => {

      button.addEventListener(
        "click",
        (event) => {

          event.preventDefault();

          showDemoNotice(
            "background changes are disabled in the portfolio demo.",
          );

        },
      );

    });


  /* -----------------------------------------
     FILE INPUTS
  ----------------------------------------- */

  document
    .querySelectorAll(
      "[data-demo-upload]",
    )
    .forEach((input) => {

      input.addEventListener(
        "click",
        (event) => {

          event.preventDefault();

          showDemoNotice(
            "image uploads are disabled in the portfolio demo.",
          );

        },
      );

    });


  /* -----------------------------------------
     TIMER
  ----------------------------------------- */

  const timerToggle =
    document.querySelector(
      '[data-action="timer-toggle"]',
    );

  if (timerToggle) {
    timerToggle.addEventListener(
      "click",
      toggleTimer,
    );
  }


  const timerReset =
    document.querySelector(
      '[data-action="timer-reset"]',
    );

  if (timerReset) {
    timerReset.addEventListener(
      "click",
      resetTimer,
    );
  }


  const timerSelect =
    document.querySelector(
      "[data-timer-select]",
    );

  if (timerSelect) {
    timerSelect.addEventListener(
      "change",
      handleTimerDurationChange,
    );
  }


  /* -----------------------------------------
     MUSIC
  ----------------------------------------- */

  const musicForm =
    document.querySelector(
      "[data-music-form]",
    );

  if (musicForm) {
    musicForm.addEventListener(
      "submit",
      loadYouTubeMusic,
    );
  }


  const youtubeButton =
    document.querySelector(
      "[data-open-youtube]",
    );

  if (youtubeButton) {

    youtubeButton.addEventListener(
      "click",
      openYouTubeMusic,
    );

  }


  /* -----------------------------------------
     DATE PICKER
  ----------------------------------------- */

  const datePicker =
    document.getElementById(
      "date-picker",
    );

  if (datePicker) {

    datePicker.addEventListener(
      "change",
      () => {

        if (!datePicker.value) {
          return;
        }

        state.selectedDate =
          new Date(
            `${datePicker.value}T12:00:00`,
          );

        state.calendarDate =
          new Date(
            state.selectedDate.getFullYear(),
            state.selectedDate.getMonth(),
            1,
          );

        render();

      },
    );

  }


  /* -----------------------------------------
     DAY NAVIGATION
  ----------------------------------------- */

  const previousDay =
    document.querySelector(
      '[data-action="previous-day"]',
    );

  if (previousDay) {

    previousDay.addEventListener(
      "click",
      () => {
        changeDay(-1);
      },
    );

  }


  const nextDay =
    document.querySelector(
      '[data-action="next-day"]',
    );

  if (nextDay) {

    nextDay.addEventListener(
      "click",
      () => {
        changeDay(1);
      },
    );

  }


  /* -----------------------------------------
     CALENDAR NAVIGATION
  ----------------------------------------- */

  const calendarPrev =
    document.querySelector(
      '[data-action="calendar-prev"]',
    );

  if (calendarPrev) {

    calendarPrev.addEventListener(
      "click",
      () => {
        changeCalendarMonth(-1);
      },
    );

  }


  const calendarNext =
    document.querySelector(
      '[data-action="calendar-next"]',
    );

  if (calendarNext) {

    calendarNext.addEventListener(
      "click",
      () => {
        changeCalendarMonth(1);
      },
    );

  }


  /* -----------------------------------------
     CALENDAR DAYS
  ----------------------------------------- */

  document
    .querySelectorAll(
      "[data-calendar-day]",
    )
    .forEach((button) => {

      button.addEventListener(
        "click",
        () => {

          selectCalendarDay(
            Number(
              button.dataset.calendarDay,
            ),
          );

        },
      );

    });
}


/* =========================================================
   INITIALIZE
========================================================= */

render();