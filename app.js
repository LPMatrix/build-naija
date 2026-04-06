let CITY_LIBRARY = [];
let INITIATIVE_LIBRARY = {};
let EVENT_LIBRARY = {};

const METRIC_CONFIG = [
  { key: "economy", label: "Economy", barClass: "bg-green" },
  { key: "mobility", label: "Mobility", barClass: "bg-red" },
  { key: "housing", label: "Housing", barClass: "bg-amber" },
  { key: "resilience", label: "Resilience", barClass: "bg-teal" },
  { key: "environment", label: "Environment", barClass: "bg-red" },
  { key: "jobs", label: "Jobs", barClass: "bg-green" },
  { key: "trust", label: "Trust", barClass: "bg-amber" },
  { key: "budget", label: "Budget", barClass: "bg-green", currency: true },
];

const TRACKED_METRICS = ["economy", "mobility", "housing", "resilience", "environment", "jobs", "trust", "budget"];
const START_YEAR = 2026;
const TOTAL_ROUNDS = 10;
const DEFAULT_THEME = {
  accent: "#5d9813",
  soft: "#dfe8c6",
  eventBg: "#f2e3c9",
  eventBorder: "#d89b27",
  eventText: "#8e5611",
};
const CITY_THEMES = {
  lagos: { accent: "#6c9b12", soft: "#dde8c3", eventBg: "#efe5cf", eventBorder: "#d4a24b", eventText: "#8d5a13" },
  abuja: { accent: "#8f7c30", soft: "#eadfb9", eventBg: "#efe3c9", eventBorder: "#c9a050", eventText: "#826020" },
  "port-harcourt": { accent: "#1f6f57", soft: "#d7e8e2", eventBg: "#ebddd4", eventBorder: "#b95e4d", eventText: "#7f3023" },
  kano: { accent: "#a06e11", soft: "#efe0c3", eventBg: "#f1e0c4", eventBorder: "#d4902d", eventText: "#885311" },
  maiduguri: { accent: "#8c5318", soft: "#ead7c0", eventBg: "#ecdfcf", eventBorder: "#c37833", eventText: "#7a4613" },
  jos: { accent: "#44765b", soft: "#dce9e1", eventBg: "#e8e0d3", eventBorder: "#9d8d65", eventText: "#5b6c54" },
};
const EVENT_FLASHES = {
  "coastal-flood": "rgba(60, 122, 196, 0.4)",
  "oil-spill": "rgba(125, 24, 16, 0.46)",
  "federal-grant": "rgba(207, 167, 57, 0.42)",
  "community-protest": "rgba(155, 44, 34, 0.34)",
  "investment-wave": "rgba(112, 160, 56, 0.28)",
  "rent-strike": "rgba(174, 58, 39, 0.28)",
  "dry-season": "rgba(193, 122, 26, 0.28)",
  "market-boom": "rgba(94, 152, 19, 0.24)",
  "migration-surge": "rgba(167, 93, 30, 0.26)",
};

const CITY_META = {
  aba: { state: "Abia", region: "South East" },
  abakaliki: { state: "Ebonyi", region: "South East" },
  abeokuta: { state: "Ogun", region: "South West" },
  abuja: { state: "FCT", region: "North Central" },
  "ado-ekiti": { state: "Ekiti", region: "South West" },
  akure: { state: "Ondo", region: "South West" },
  asaba: { state: "Delta", region: "South South" },
  awka: { state: "Anambra", region: "South East" },
  bauchi: { state: "Bauchi", region: "North East" },
  "benin-city": { state: "Edo", region: "South South" },
  "birnin-kebbi": { state: "Kebbi", region: "North West" },
  calabar: { state: "Cross River", region: "South South" },
  damaturu: { state: "Yobe", region: "North East" },
  dutse: { state: "Jigawa", region: "North West" },
  enugu: { state: "Enugu", region: "South East" },
  gombe: { state: "Gombe", region: "North East" },
  gusau: { state: "Zamfara", region: "North West" },
  ibadan: { state: "Oyo", region: "South West" },
  ilorin: { state: "Kwara", region: "North Central" },
  jalingo: { state: "Taraba", region: "North East" },
  jos: { state: "Plateau", region: "North Central" },
  kaduna: { state: "Kaduna", region: "North West" },
  kano: { state: "Kano", region: "North West" },
  katsina: { state: "Katsina", region: "North West" },
  lafia: { state: "Nasarawa", region: "North Central" },
  lagos: { state: "Lagos", region: "South West" },
  lokoja: { state: "Kogi", region: "North Central" },
  maiduguri: { state: "Borno", region: "North East" },
  makurdi: { state: "Benue", region: "North Central" },
  minna: { state: "Niger", region: "North Central" },
  osogbo: { state: "Osun", region: "South West" },
  owerri: { state: "Imo", region: "South East" },
  "port-harcourt": { state: "Rivers", region: "South South" },
  sokoto: { state: "Sokoto", region: "North West" },
  umuahia: { state: "Abia", region: "South East" },
  uyo: { state: "Akwa Ibom", region: "South South" },
  yenagoa: { state: "Bayelsa", region: "South South" },
  yola: { state: "Adamawa", region: "North East" },
};
const REGION_ORDER = ["North West", "North East", "North Central", "South West", "South East", "South South"];

const elements = {
  openCityPicker: document.querySelector("#open-city-picker"),
  openCityPickerMobile: document.querySelector("#open-city-picker-mobile"),
  closeCityPicker: document.querySelector("#close-city-picker"),
  cityPickerPanel: document.querySelector("#city-picker-panel"),
  cityPickerGroups: document.querySelector("#city-picker-groups"),
  cityPickerLabel: document.querySelector("#city-picker-label"),
  cityPickerLabelMobile: document.querySelector("#city-picker-label-mobile"),
  toggleHistory: document.querySelector("#toggle-history"),
  hideHistory: document.querySelector("#hide-history"),
  historyPanel: document.querySelector("#history-panel"),
  historyLog: document.querySelector("#history-log"),
  roundDisplay: document.querySelector("#round-display"),
  cityMeta: document.querySelector("#city-meta"),
  heroCityName: document.querySelector("#hero-city-name"),
  heroCitySummary: document.querySelector("#hero-city-summary"),
  budgetPill: document.querySelector("#budget-pill"),
  metricsGrid: document.querySelector("#metrics-grid"),
  eventBanner: document.querySelector("#event-banner"),
  initiativeList: document.querySelector("#initiative-list"),
  initiativesSection: document.querySelector("#initiatives-section"),
  selectionStatus: document.querySelector("#selection-status"),
  advanceButton: document.querySelector("#advance-turn"),
  eventBanner: document.querySelector("#event-banner"),
  verdictLine: document.querySelector("#verdict-line"),
  screenFlash: document.querySelector("#screen-flash"),
  endScreen: document.querySelector("#end-screen"),
  gameFooter: document.querySelector("#game-footer"),
};

let activeCityId = null;
let state = null;
let displayedMetrics = null;
let animationFrameId = null;
let historyVisible = false;

function createMetricDelta() {
  return TRACKED_METRICS.reduce((accumulator, key) => {
    accumulator[key] = 0;
    return accumulator;
  }, {});
}

function createState(cityId) {
  const city = getCityById(cityId);
  const openingCrisis = getOpeningCrisis(city);
  return {
    cityId,
    round: 1,
    gameOver: false,
    endMode: null,
    selectedInitiatives: [],
    cooldowns: {},
    usedEvents: [],
    metrics: { ...city.metrics },
    lastRoundDelta: createMetricDelta(),
    currentAlert: openingCrisis,
    currentVerdict: openingCrisis.verdict,
    roundLog: [],
  };
}

function render() {
  if (!state) {
    return;
  }

  const city = getActiveCity();
  applyCityTheme(city.id);
  renderCitySelectors();
  renderHero(city);
  renderMetrics();
  renderAlert();
  renderHistory();
  renderInitiatives(city);
  renderFooter();
  renderEndScreen(city);
  elements.roundDisplay.textContent = `Round ${state.round} of ${TOTAL_ROUNDS}`;
  elements.advanceButton.disabled = state.gameOver;
  elements.advanceButton.textContent = state.gameOver ? "Campaign complete" : "End round ↗";
  elements.verdictLine.textContent = state.currentVerdict || "";
  elements.initiativesSection.classList.toggle("hidden", state.gameOver);
  elements.gameFooter.classList.toggle("hidden", state.gameOver);
}

function applyCityTheme(cityId) {
  const theme = getCityTheme(cityId);
  document.documentElement.style.setProperty("--city-accent", theme.accent);
  document.documentElement.style.setProperty("--city-soft", theme.soft);
  document.documentElement.style.setProperty("--city-event", theme.eventBg);
  document.documentElement.style.setProperty("--city-event-border", theme.eventBorder);
  document.documentElement.style.setProperty("--city-event-text", theme.eventText);
}

function getCityTheme(cityId) {
  const specificTheme = CITY_THEMES[cityId];
  if (specificTheme) {
    return specificTheme;
  }

  const region = getCityMeta(cityId).region;
  if (region === "South South") {
    return { accent: "#1d7561", soft: "#d8e9e2", eventBg: "#ebddd4", eventBorder: "#b56e5d", eventText: "#7f3127" };
  }
  if (region === "South West") {
    return { accent: "#6a9518", soft: "#dfe8c6", eventBg: "#f1e5cf", eventBorder: "#d39b44", eventText: "#895712" };
  }
  if (region === "South East") {
    return { accent: "#758a1c", soft: "#e4e6c8", eventBg: "#efe3cf", eventBorder: "#c89a56", eventText: "#875a1e" };
  }
  if (region === "North West") {
    return { accent: "#9b6917", soft: "#ecdac2", eventBg: "#efe0ca", eventBorder: "#cf8b37", eventText: "#865315" };
  }
  if (region === "North East") {
    return { accent: "#8c5418", soft: "#ead7c0", eventBg: "#ecddcd", eventBorder: "#c57e38", eventText: "#7b4b12" };
  }
  if (region === "North Central") {
    return { accent: "#4d7d60", soft: "#d9e6df", eventBg: "#e9e0d2", eventBorder: "#a78f67", eventText: "#5f6c58" };
  }
  return DEFAULT_THEME;
}

function getOpeningCrisis(city) {
  const meta = getCityMeta(city.id);
  const crises = {
    lagos: {
      title: "Gridlock is eating the city's edge",
      body: "Commuters are losing hours to congestion while rent and flood pressure keep tightening around growth corridors.",
      summary: "Mobility and housing are under strain before your first move.",
      verdict: "The city is impatient, ambitious, and already overheating."
    },
    abuja: {
      title: "Expansion is outrunning affordability",
      body: "Land pressure and commuter friction are rising faster than the capital's infrastructure can absorb.",
      summary: "Citizens expect order, but the city is stretching beyond it.",
      verdict: "The capital looks polished, but the cracks are widening underneath."
    },
    "port-harcourt": {
      title: "Pollution is crushing legitimacy",
      body: "Oil-linked wealth still matters, but polluted corridors and distrust are undermining every public promise.",
      summary: "The city starts rich in potential and weak in confidence.",
      verdict: "People believe the city can pay for change; they do not yet believe it will."
    },
    kano: {
      title: "Trade is strong, but systems are brittle",
      body: "Market depth is real, yet water pressure and weak industrial reliability are dragging on momentum.",
      summary: "Commerce wants to move faster than infrastructure allows.",
      verdict: "The city is productive, but one hard shock could stall it."
    },
    maiduguri: {
      title: "Recovery is still unfinished",
      body: "Reconstruction pressure is colliding with service delivery gaps and fragile household confidence.",
      summary: "Every early choice will be judged through the lens of stability.",
      verdict: "This is a city asking for proof before trust."
    },
  };

  if (crises[city.id]) {
    return crises[city.id];
  }

  if (meta.region === "South South") {
    return {
      title: `${city.name} is living with environmental drag`,
      body: "Water, waste, and uneven infrastructure are taking a toll on confidence even where revenue opportunities exist.",
      summary: "Resilience and legitimacy are the first tests of your leadership.",
      verdict: "The city is watching whether growth will finally feel fair."
    };
  }
  if (meta.region === "North East") {
    return {
      title: `${city.name} starts under resilience pressure`,
      body: "Service gaps and social strain mean basic stability matters as much as headline investment.",
      summary: "If systems wobble early, recovery gets harder.",
      verdict: "This city needs steadiness before spectacle."
    };
  }
  if (meta.region === "North West") {
    return {
      title: `${city.name} needs stronger urban systems`,
      body: "Trade energy is present, but water security, roads, and trust are not strong enough for the next stage of growth.",
      summary: "Commercial momentum exists, but the urban backbone is thin.",
      verdict: "The city is ready to move if you can stop it from grinding itself down."
    };
  }
  if (meta.region === "South West") {
    return {
      title: `${city.name} is feeling the cost of growth`,
      body: "Housing pressure and traffic are rising faster than service delivery, squeezing the city's most productive districts.",
      summary: "The engine is running, but the chassis is under stress.",
      verdict: "People can feel the upside of growth and the friction of it at the same time."
    };
  }
  if (meta.region === "South East") {
    return {
      title: `${city.name} has talent but needs lift`,
      body: "Enterprise is strong, yet mobility and public systems are not keeping pace with economic ambition.",
      summary: "The city has energy, but not enough shared infrastructure.",
      verdict: "This city feels clever, restless, and underserved."
    };
  }

  return {
    title: `${city.name} enters a fragile balance`,
    body: "The city has room to grow, but core systems are not yet strong enough to carry stress without consequences.",
    summary: `Your first round in ${meta.state} will set the tone for everything that follows.`,
    verdict: "The city is balanced on potential, not certainty."
  };
}

function renderCitySelectors() {
  const activeCity = getActiveCity();
  const activeMeta = getCityMeta(activeCity.id);
  const label = `${activeCity.name} · ${activeMeta.state}`;
  elements.cityPickerLabel.textContent = label;
  elements.cityPickerLabelMobile.textContent = activeCity.name;

  elements.cityPickerGroups.innerHTML = REGION_ORDER.map((region) => {
    const cities = CITY_LIBRARY
      .filter((city) => getCityMeta(city.id).region === region)
      .map((city) => {
        const meta = getCityMeta(city.id);
        const isActive = city.id === activeCityId;
        return `
          <button
            type="button"
            data-city-id="${city.id}"
            class="flex items-center justify-between rounded-2xl border px-4 py-3 text-left transition ${isActive ? "border-[#96c633] bg-[#dde7c9] text-[#395d0c]" : "border-[#4c4944] bg-[#282723] text-[#f3ede3] hover:border-[#77736a] hover:bg-[#2d2c28]"}"
          >
            <span>
              <span class="block text-base font-semibold">${city.name}</span>
              <span class="mt-1 block text-xs uppercase tracking-[0.14em] ${isActive ? "text-[#567819]" : "text-[#a6a091]"}">${meta.state}</span>
            </span>
            <span class="text-xs font-bold ${isActive ? "text-[#567819]" : "text-[#8e887d]"}">${calculateCityScore(city.metrics)}/100</span>
          </button>
        `;
      }).join("");

    return `
      <section class="rounded-[1.35rem] border border-[#403d39] bg-[#252420] p-4">
        <p class="mb-3 text-xs font-extrabold uppercase tracking-[0.18em] text-[#9b9488]">${region}</p>
        <div class="grid gap-3">${cities}</div>
      </section>
    `;
  }).join("");

  elements.cityPickerGroups.querySelectorAll("[data-city-id]").forEach((button) => {
    button.addEventListener("click", () => {
      handleCityChange(button.dataset.cityId);
      closeCityPicker();
    });
  });
}

function renderHero(city) {
  const meta = getCityMeta(city.id);
  const theme = getCityTheme(city.id);
  elements.cityMeta.textContent = `${meta.state} · ${meta.region} · ${city.resources.join(" · ")}`;
  elements.heroCityName.textContent = city.name;
  elements.heroCitySummary.textContent = city.summary;
  elements.budgetPill.textContent = `₦${clampMetric(state.metrics.budget)}B budget`;
  elements.budgetPill.style.backgroundColor = theme.soft;
  elements.budgetPill.style.color = theme.accent;
}

function renderMetrics() {
  elements.metricsGrid.innerHTML = METRIC_CONFIG.map((metric) => {
    const value = clampMetric((displayedMetrics || state.metrics)[metric.key]);
    const actualValue = clampMetric(state.metrics[metric.key]);
    const delta = state.lastRoundDelta[metric.key] ?? 0;
    const deltaClass = delta > 0 ? "text-green" : delta < 0 ? "text-red" : "text-[#aaa396]";
    const deltaPrefix = delta > 0 ? "+" : "";
    const isDanger = actualValue < 30;
    const warningMarkup = isDanger
      ? `<p class="mt-3 text-[0.82rem] font-bold uppercase tracking-[0.14em] text-[#ff8a7b]">Critical pressure</p>`
      : "";
    const cardBorder = isDanger ? "border border-[#8f2b24] shadow-[0_0_0_1px_rgba(173,48,39,0.22)]" : "";

    return `
      <article class="rounded-[1.35rem] bg-card px-6 py-5 ${cardBorder}">
        <p class="text-[1.05rem] font-semibold uppercase tracking-[0.05em] text-[#cfc8bc]">${metric.label}</p>
        <p class="mt-1 text-5xl font-semibold leading-none text-[#f7f3eb]">${value}</p>
        <div class="mt-5 h-1.5 overflow-hidden rounded-full bg-[#4e4b46]">
          <div class="h-full ${metric.barClass}" style="width:${Math.max(0, Math.min(value, 100))}%"></div>
        </div>
        <p class="mt-4 text-[0.95rem] font-semibold ${deltaClass}">${deltaPrefix}${delta} this round</p>
        ${warningMarkup}
      </article>
    `;
  }).join("");
}

function renderAlert() {
  const theme = getCityTheme(activeCityId);
  elements.eventBanner.style.backgroundColor = theme.eventBg;
  elements.eventBanner.style.borderColor = theme.eventBorder;
  elements.eventBanner.style.color = theme.eventText;
  elements.eventBanner.innerHTML = `
    <div class="flex gap-4">
      <div class="pt-1 text-4xl text-[#e29a00]">⚡</div>
      <div>
        <p class="text-[0.82rem] font-extrabold uppercase tracking-[0.18em] opacity-70">City event</p>
        <h3 class="mt-1 text-3xl font-extrabold leading-tight">${state.currentAlert.title}</h3>
        <p class="mt-3 text-[1.08rem] font-medium leading-8">${state.currentAlert.body}</p>
        <p class="mt-2 text-[1.08rem] font-semibold leading-8">${state.currentAlert.summary}</p>
      </div>
    </div>
  `;
}

function renderInitiatives(city) {
  const initiatives = city.initiatives
    .map((id) => INITIATIVE_LIBRARY[id])
    .filter(Boolean);

  elements.initiativeList.innerHTML = initiatives.map((initiative) => {
    const isSelected = state.selectedInitiatives.includes(initiative.id);
    const cooldown = state.cooldowns[initiative.id] || 0;
    const isLocked = cooldown > 0;
    const effectEntries = Object.entries(initiative.effects);
    const positiveBadges = effectEntries
      .filter(([, value]) => value > 0)
      .slice(0, 2)
      .map(([key]) => renderEffectBadge(`+${shortMetricName(key)}`, true))
      .join("");
    const negativeBadges = effectEntries
      .filter(([, value]) => value < 0)
      .slice(0, 2)
      .map(([key]) => renderEffectBadge(`-${shortMetricName(key)}`, false))
      .join("");
    const cardClasses = isSelected
      ? "border-[#9cca33] bg-[#dde7c9] text-[#f4f0e6]"
      : "border-[#4a4843] bg-card text-[#f4f0e6]";
    const titleColor = isSelected ? "text-[#f7f3eb]" : "text-[#f7f3eb]";
    const bodyColor = isSelected ? "text-[#c8c2b6]" : "text-[#c8c2b6]";
    const preview = getInitiativePreview(initiative);
    const toggleLabel = isLocked ? `Locked ${cooldown}` : isSelected ? "Selected" : "Select";
    const toggleClass = isLocked
      ? "border-[#5d3c39] bg-[#2a1d1c] text-[#c59b95] cursor-not-allowed"
      : isSelected
      ? "border-[#9cca33] bg-[#dfe8c6] text-[#395d0c]"
      : "border-[#5c5a55] bg-transparent text-[#f3eee4]";
    const previewMarkup = preview.metrics.map((item) => `
      <span class="rounded-full ${item.delta >= 0 ? "bg-[#e4efcf] text-[#447313]" : "bg-[#f3dddd] text-[#b3362d]"} px-3 py-1.5 text-[0.92rem] font-semibold">
        ${item.label} ${item.from}→${item.to}
      </span>
    `).join("");
    const warningMarkup = isLocked
      ? `<p class="mt-3 text-sm font-semibold text-[#d39e97]">Cooldown active. Available in ${cooldown} ${cooldown === 1 ? "round" : "rounds"}.</p>`
      : preview.budgetWarning
      ? `<p class="mt-3 text-sm font-semibold text-[#ffb372]">${preview.budgetWarning}</p>`
      : "";

    return `
      <article class="flex min-h-[212px] flex-col justify-between rounded-[1.35rem] border ${cardClasses} px-6 py-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
        <div>
          <div class="mb-3 flex items-start justify-between gap-4">
            <div>
              <h3 class="text-[2rem] font-semibold leading-tight ${titleColor}">${initiative.title}</h3>
            </div>
            <button
              type="button"
              data-initiative-id="${initiative.id}"
              ${isLocked ? "disabled" : ""}
              class="rounded-full border px-4 py-2 text-sm font-bold transition hover:-translate-y-0.5 ${toggleClass}"
            >
              ${toggleLabel}
            </button>
          </div>
          <p class="max-w-3xl text-[1.05rem] font-medium leading-9 ${bodyColor}">${initiative.description}</p>
          <div class="mt-4">
            <p class="text-[0.76rem] font-extrabold uppercase tracking-[0.16em] text-[#a9a296]">Projected if chosen</p>
            <div class="mt-2 flex flex-wrap gap-2">
              ${previewMarkup}
            </div>
            ${warningMarkup}
          </div>
        </div>
        <div class="mt-6 flex flex-wrap items-center justify-between gap-3">
          <span class="rounded-full bg-[#f1dfd8] px-4 py-2 text-[0.95rem] font-bold text-[#a84b22]">₦${initiative.cost}B</span>
          <div class="flex flex-wrap items-center gap-2">
            ${positiveBadges}
            ${negativeBadges}
          </div>
        </div>
      </article>
    `;
  }).join("");

  elements.initiativeList.querySelectorAll("[data-initiative-id]").forEach((button) => {
    button.addEventListener("click", () => toggleInitiative(button.dataset.initiativeId));
  });
}

function renderFooter() {
  const count = state.selectedInitiatives.length;
  const label = count === 1 ? "initiative" : "initiatives";
  const projected = getCurrentPackageProjection();
  const budgetFragment = count > 0 ? ` · projected budget ₦${projected.budget}B` : "";
  const warningFragment = projected.warning ? ` · ${projected.warning}` : "";
  elements.selectionStatus.textContent = `${count} of 2 ${label} selected${budgetFragment}${warningFragment}`;
}

function renderHistory() {
  elements.historyPanel.classList.toggle("hidden", !historyVisible || state.roundLog.length === 0);
  elements.historyLog.innerHTML = [...state.roundLog]
    .reverse()
    .map((entry) => `
      <article class="rounded-[1.2rem] border border-[#403d39] bg-[#252420] p-4">
        <div class="flex items-center justify-between gap-3">
          <p class="text-xs font-extrabold uppercase tracking-[0.18em] text-[#9b9488]">Round ${entry.round}</p>
          <p class="text-xs font-semibold text-[#b7b0a4]">${entry.initiatives.length} initiative${entry.initiatives.length === 1 ? "" : "s"}</p>
        </div>
        <p class="mt-2 text-lg font-semibold text-[#f3ede3]">${entry.alert.title}</p>
        <p class="mt-2 text-sm leading-7 text-[#cbc4b8]">${entry.verdict}</p>
        <p class="mt-3 text-xs uppercase tracking-[0.14em] text-[#8f887d]">${entry.initiatives.length > 0 ? entry.initiatives.join(" · ") : "No initiatives selected"}</p>
      </article>
    `)
    .join("");
}

function renderEndScreen(city) {
  if (!state.gameOver) {
    elements.endScreen.classList.add("hidden");
    elements.endScreen.innerHTML = "";
    return;
  }

  elements.endScreen.classList.remove("hidden");
  elements.endScreen.innerHTML = state.endMode === "receivership"
    ? renderReceivershipScreen(city)
    : renderLegacyScreen(city);
  elements.endScreen.querySelectorAll("[data-share]").forEach((button) => {
    button.addEventListener("click", () => shareResult(button.dataset.share));
  });
}

function renderLegacyScreen(city) {
  const meta = getCityMeta(city.id);
  const score = calculateScore();
  const grade = score >= 75 ? "A" : score >= 65 ? "B" : score >= 55 ? "C" : score >= 45 ? "D" : "F";
  const strongest = findStrongestMetrics(state.metrics);
  const weakest = findWeakestMetrics(state.metrics);
  const legacyBullets = buildLegacyBullets();
  const headline = buildNewspaperHeadline(city.name, score);

  return `
    <article class="overflow-hidden rounded-[2rem] border border-[#d1c3aa] bg-[#f3ead7] text-[#30261a] shadow-[0_28px_80px_rgba(0,0,0,0.35)]">
      <div class="border-b border-[#cfb98f] bg-[#efe2c8] px-8 py-6 md:px-10">
        <div class="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p class="text-xs font-extrabold uppercase tracking-[0.28em] text-[#7f5f2b]">The Build Naija Times</p>
            <h3 class="mt-2 font-display text-6xl font-semibold leading-none md:text-7xl">${headline}</h3>
            <p class="mt-3 text-sm font-semibold uppercase tracking-[0.16em] text-[#7b6a53]">${city.name}, ${meta.state} · Final edition · ${START_YEAR + TOTAL_ROUNDS - 1}</p>
          </div>
          <div class="rounded-[1.4rem] border border-[#cfb98f] bg-[#fbf4e7] px-6 py-4 text-right">
            <p class="text-xs font-extrabold uppercase tracking-[0.2em] text-[#7f5f2b]">Civic grade</p>
            <p class="mt-1 font-display text-6xl leading-none">${grade}</p>
            <p class="mt-2 text-lg font-semibold">Score ${score}/100</p>
            <button
              type="button"
              data-share="legacy"
              class="mt-4 rounded-full border border-[#cfb98f] bg-[#efe2c8] px-4 py-2 text-sm font-bold text-[#6e542a] transition hover:bg-[#ead9bb]"
            >
              Share result
            </button>
          </div>
        </div>
      </div>
      <div class="grid gap-8 px-8 py-8 md:px-10 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <p class="text-2xl font-semibold leading-10 text-[#4a3c29]">${state.currentVerdict}</p>
          <div class="mt-8 grid gap-4 md:grid-cols-3">
            <div class="rounded-[1.3rem] border border-[#d8c6a4] bg-[#fbf4e7] p-5">
              <p class="text-xs font-extrabold uppercase tracking-[0.18em] text-[#7f5f2b]">History says</p>
              <p class="mt-3 text-lg font-semibold leading-8">${buildHistoryMemory(score, state.metrics)}</p>
            </div>
            <div class="rounded-[1.3rem] border border-[#d8c6a4] bg-[#fbf4e7] p-5">
              <p class="text-xs font-extrabold uppercase tracking-[0.18em] text-[#7f5f2b]">You built up</p>
              <p class="mt-3 text-lg font-semibold leading-8">${strongest.map(prettyMetricName).join(" and ")}</p>
            </div>
            <div class="rounded-[1.3rem] border border-[#d8c6a4] bg-[#fbf4e7] p-5">
              <p class="text-xs font-extrabold uppercase tracking-[0.18em] text-[#7f5f2b]">You neglected</p>
              <p class="mt-3 text-lg font-semibold leading-8">${weakest.map(prettyMetricName).join(" and ")}</p>
            </div>
          </div>
          <div class="mt-8 rounded-[1.5rem] border border-[#d8c6a4] bg-[#fbf4e7] p-6">
            <p class="text-xs font-extrabold uppercase tracking-[0.18em] text-[#7f5f2b]">Legacy summary</p>
            <ul class="mt-4 space-y-3 text-lg leading-8 text-[#443724]">
              ${legacyBullets.map((bullet) => `<li>• ${bullet}</li>`).join("")}
            </ul>
          </div>
        </div>
        <div class="space-y-4">
          <div class="rounded-[1.5rem] border border-[#d8c6a4] bg-[#fbf4e7] p-6">
            <p class="text-xs font-extrabold uppercase tracking-[0.18em] text-[#7f5f2b]">Final city ledger</p>
            <div class="mt-4 space-y-3">
              ${TRACKED_METRICS.map((key) => `
                <div class="flex items-center justify-between border-b border-[#eadbc0] pb-2 text-lg last:border-b-0">
                  <span>${prettyMetricName(key)}</span>
                  <strong>${clampMetric(state.metrics[key])}</strong>
                </div>
              `).join("")}
            </div>
          </div>
          <div class="rounded-[1.5rem] border border-[#d8c6a4] bg-[#fbf4e7] p-6">
            <p class="text-xs font-extrabold uppercase tracking-[0.18em] text-[#7f5f2b]">Key moments</p>
            <div class="mt-4 space-y-4">
              ${state.roundLog.slice(-4).reverse().map((entry) => `
                <div class="border-l-2 border-[#b48d3f] pl-4">
                  <p class="text-sm font-extrabold uppercase tracking-[0.14em] text-[#8a6c39]">Round ${entry.round}</p>
                  <p class="mt-1 text-lg font-semibold">${entry.alert.title}</p>
                  <p class="mt-1 text-sm leading-7 text-[#5d4d37]">${entry.verdict}</p>
                </div>
              `).join("")}
            </div>
          </div>
        </div>
      </div>
    </article>
  `;
}

function renderReceivershipScreen(city) {
  const meta = getCityMeta(city.id);
  const weakest = findWeakestMetrics(state.metrics);
  return `
    <article class="overflow-hidden rounded-[2rem] border border-[#6a2623] bg-[linear-gradient(180deg,#220d0d,#120909)] text-[#f6e9e3] shadow-[0_28px_80px_rgba(0,0,0,0.45)]">
      <div class="border-b border-[#5b2623] bg-[#2b1111] px-8 py-6 md:px-10">
        <p class="text-xs font-extrabold uppercase tracking-[0.28em] text-[#db8e86]">Federal emergency notice</p>
        <h3 class="mt-3 font-display text-6xl font-semibold leading-none md:text-7xl">Receivership In ${city.name}</h3>
        <p class="mt-4 max-w-4xl text-xl font-semibold leading-9 text-[#f0cbc5]">The city treasury has failed. Abuja has suspended local financial control and moved in to stabilize essential services.</p>
        <button
          type="button"
          data-share="receivership"
          class="mt-5 rounded-full border border-[#7c3733] bg-[#341716] px-4 py-2 text-sm font-bold text-[#f2d6d2] transition hover:bg-[#41201f]"
        >
          Share result
        </button>
      </div>
      <div class="grid gap-8 px-8 py-8 md:px-10 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <div class="rounded-[1.5rem] border border-[#5d2522] bg-[#1a0d0d] p-6">
            <p class="text-xs font-extrabold uppercase tracking-[0.18em] text-[#d6897f]">Official finding</p>
            <p class="mt-4 text-2xl font-semibold leading-10 text-[#f7e8e2]">${state.currentVerdict}</p>
            <p class="mt-4 text-lg leading-8 text-[#d8b6b0]">${city.name}, ${meta.state} will be remembered for collapsing under the weight of ${weakest.map(prettyMetricName).join(" and ")} before its growth story could hold.</p>
          </div>
          <div class="mt-6 rounded-[1.5rem] border border-[#5d2522] bg-[#1a0d0d] p-6">
            <p class="text-xs font-extrabold uppercase tracking-[0.18em] text-[#d6897f]">What triggered the takeover</p>
            <ul class="mt-4 space-y-3 text-lg leading-8 text-[#f0cbc5]">
              <li>• Budget fell to ${clampMetric(state.metrics.budget)}, leaving almost no room to govern.</li>
              <li>• Public trust closed at ${clampMetric(state.metrics.trust)}, weakening political legitimacy.</li>
              <li>• The city ended with acute stress in ${weakest.map(prettyMetricName).join(" and ")}.</li>
            </ul>
          </div>
        </div>
        <div class="space-y-4">
          <div class="rounded-[1.5rem] border border-[#5d2522] bg-[#1a0d0d] p-6">
            <p class="text-xs font-extrabold uppercase tracking-[0.18em] text-[#d6897f]">Final distress ledger</p>
            <div class="mt-4 space-y-3">
              ${TRACKED_METRICS.map((key) => `
                <div class="flex items-center justify-between border-b border-[#3a1b1a] pb-2 text-lg last:border-b-0">
                  <span>${prettyMetricName(key)}</span>
                  <strong>${clampMetric(state.metrics[key])}</strong>
                </div>
              `).join("")}
            </div>
          </div>
          <div class="rounded-[1.5rem] border border-[#5d2522] bg-[#1a0d0d] p-6">
            <p class="text-xs font-extrabold uppercase tracking-[0.18em] text-[#d6897f]">Last rounds before collapse</p>
            <div class="mt-4 space-y-4">
              ${state.roundLog.slice(-3).reverse().map((entry) => `
                <div class="border-l-2 border-[#8a3330] pl-4">
                  <p class="text-sm font-extrabold uppercase tracking-[0.14em] text-[#d6897f]">Round ${entry.round}</p>
                  <p class="mt-1 text-lg font-semibold text-[#f7e8e2]">${entry.alert.title}</p>
                  <p class="mt-1 text-sm leading-7 text-[#d8b6b0]">${entry.verdict}</p>
                </div>
              `).join("")}
            </div>
          </div>
        </div>
      </div>
    </article>
  `;
}

function renderEffectBadge(label, positive) {
  const classes = positive
    ? "bg-[#e4efcf] text-[#447313]"
    : "bg-[#f3dddd] text-[#b3362d]";
  return `<span class="rounded-full px-3 py-1.5 text-[0.95rem] font-semibold ${classes}">${label}</span>`;
}

function getInitiativePreview(initiative) {
  const selectedSet = state.selectedInitiatives.filter((id) => id !== initiative.id);
  const projectedEffects = createMetricDelta();

  selectedSet.forEach((id) => {
    const selectedInitiative = INITIATIVE_LIBRARY[id];
    if (selectedInitiative) {
      mergeEffects(projectedEffects, selectedInitiative.effects);
    }
  });

  mergeEffects(projectedEffects, initiative.effects);

  const metrics = Object.entries(projectedEffects)
    .filter(([, delta]) => delta !== 0)
    .map(([key, delta]) => {
      const from = clampMetric(state.metrics[key] ?? 0);
      const to = clampMetric((state.metrics[key] ?? 0) + delta);
      return {
        key,
        label: shortMetricName(key),
        from,
        to,
        delta,
      };
    })
    .sort((left, right) => Math.abs(right.delta) - Math.abs(left.delta));

  const projectedBudget = clampMetric((state.metrics.budget ?? 0) + (projectedEffects.budget ?? 0));
  let budgetWarning = "";
  if (projectedBudget < 15) {
    budgetWarning = `Treasury danger: this package would leave only ₦${projectedBudget}B in budget.`;
  } else if (projectedBudget < 25) {
    budgetWarning = `Budget strain: this package drops the treasury to ₦${projectedBudget}B.`;
  }

  return {
    metrics,
    projectedBudget,
    budgetWarning,
  };
}

function getCurrentPackageProjection() {
  const effects = createMetricDelta();
  state.selectedInitiatives.forEach((id) => {
    const initiative = INITIATIVE_LIBRARY[id];
    if (initiative) {
      mergeEffects(effects, initiative.effects);
    }
  });

  const budget = clampMetric((state.metrics.budget ?? 0) + (effects.budget ?? 0));
  let warning = "";
  if (budget < 15) {
    warning = "treasury danger";
  } else if (budget < 25) {
    warning = "budget strain";
  }

  return { budget, warning };
}

function mergeEffects(target, effects = {}) {
  Object.entries(effects).forEach(([key, value]) => {
    if (typeof target[key] !== "number") {
      target[key] = 0;
    }
    target[key] += value;
  });
}

function toggleInitiative(id) {
  if (state.gameOver) {
    return;
  }

  if ((state.cooldowns[id] || 0) > 0) {
    return;
  }

  const isSelected = state.selectedInitiatives.includes(id);
  if (isSelected) {
    state.selectedInitiatives = state.selectedInitiatives.filter((entry) => entry !== id);
    render();
    return;
  }

  if (state.selectedInitiatives.length >= 2) {
    state.currentAlert = {
      title: "Planning cap reached",
      body: "You can only push two major initiatives in a single round.",
      summary: "Drop one selected initiative before adding another.",
    };
    render();
    return;
  }

  state.selectedInitiatives = [...state.selectedInitiatives, id];
  render();
}

function advanceRound() {
  if (state.gameOver) {
    return;
  }

  const previousMetrics = { ...state.metrics };
  const roundDelta = createMetricDelta();
  let alert = {
    title: "Round review",
    body: "Your planning package lands across the city.",
    summary: "Momentum shifts, but not every system moves in the same direction.",
  };
  let verdict = "The city is moving, but the balance is still unsettled.";
  let flashColor = null;

  if (state.selectedInitiatives.length === 0) {
    applyEffectsToState({ trust: -3, economy: -2 }, [roundDelta]);
    alert = {
      title: "A quiet round costs momentum",
      body: "Holding back preserves options, but people and businesses notice when the agenda slows.",
      summary: "Trust -3, Economy -2.",
    };
    verdict = "Citizens read caution as drift, and drift as weakness.";
  }

  state.selectedInitiatives
    .map((id) => INITIATIVE_LIBRARY[id])
    .filter(Boolean)
    .forEach((initiative) => {
      applyEffectsToState(initiative.effects, [roundDelta]);
    });

  applyPassiveDrift(roundDelta);

  const event = rollEvent();
  if (event) {
    const eventDelta = createMetricDelta();
    applyConditionalEffects(event.conditionalEffects || [], [roundDelta, eventDelta]);
    applyEffectsToState(event.effects || {}, [roundDelta, eventDelta]);
    alert = {
      title: event.title,
      body: event.body,
      summary: buildDeltaSummary(eventDelta),
    };
    flashColor = EVENT_FLASHES[event.id] || null;
  }

  normaliseMetrics();
  state.lastRoundDelta = roundDelta;
  state.currentAlert = alert;
  state.currentVerdict = buildVerdict(roundDelta, state.metrics);
  updateCooldowns(state.selectedInitiatives);
  state.roundLog.push({
    round: state.round,
    initiatives: state.selectedInitiatives.map((id) => INITIATIVE_LIBRARY[id]?.title).filter(Boolean),
    alert,
    verdict: state.currentVerdict,
    delta: { ...roundDelta },
    metrics: { ...state.metrics },
  });
  state.selectedInitiatives = [];

  if (state.metrics.budget <= 0) {
    state.gameOver = true;
    state.endMode = "receivership";
    state.currentAlert = {
      title: "Federal receivership",
      body: `${getActiveCity().name} has run out of money. The federal government has stepped in to manage the city's finances.`,
      summary: "Debt has become the story. Control has slipped out of your hands.",
    };
    state.currentVerdict = "History records the collapse as a failure of restraint.";
    flashColor = "rgba(95, 20, 20, 0.48)";
  } else if (state.round >= TOTAL_ROUNDS) {
    state.gameOver = true;
    state.endMode = "legacy";
    state.currentAlert = {
      title: "Campaign complete",
      body: `You guided ${getActiveCity().name} through ${TOTAL_ROUNDS} rounds of trade-offs and pressure.`,
      summary: `Final balance score ${calculateScore()}/100.`,
    };
    state.currentVerdict = buildLegacyVerdict(state.metrics);
  } else {
    state.round += 1;
  }

  if (flashColor) {
    triggerScreenFlash(flashColor);
  }
  animateMetrics(previousMetrics, state.metrics);
  render();
}

function updateCooldowns(usedInitiatives) {
  const nextCooldowns = {};

  Object.entries(state.cooldowns).forEach(([id, turns]) => {
    const nextValue = turns - 1;
    if (nextValue > 0) {
      nextCooldowns[id] = nextValue;
    }
  });

  usedInitiatives.forEach((id) => {
    const initiative = INITIATIVE_LIBRARY[id];
    if (!initiative) {
      return;
    }
    nextCooldowns[id] = getCooldownRounds(initiative);
  });

  state.cooldowns = nextCooldowns;
}

function getCooldownRounds(initiative) {
  return initiative.cost >= 14 ? 2 : 1;
}

function applyEffectsToState(effects, deltaTrackers = []) {
  Object.entries(effects).forEach(([key, value]) => {
    if (typeof state.metrics[key] !== "number") {
      state.metrics[key] = 50;
    }

    state.metrics[key] += value;
    deltaTrackers.forEach((tracker) => {
      if (typeof tracker[key] !== "number") {
        tracker[key] = 0;
      }
      tracker[key] += value;
    });
  });
}

function applyConditionalEffects(conditionalEffects, deltaTrackers = []) {
  for (const condition of conditionalEffects) {
    if (!condition.metric) {
      applyEffectsToState(condition.effects || {}, deltaTrackers);
      return;
    }

    const metricValue = state.metrics[condition.metric] ?? 0;
    if (matchesCondition(metricValue, condition.operator, condition.value)) {
      applyEffectsToState(condition.effects || {}, deltaTrackers);
      return;
    }
  }
}

function matchesCondition(metricValue, operator, expectedValue) {
  switch (operator) {
    case "<":
      return metricValue < expectedValue;
    case "<=":
      return metricValue <= expectedValue;
    case ">":
      return metricValue > expectedValue;
    case ">=":
      return metricValue >= expectedValue;
    case "===":
      return metricValue === expectedValue;
    default:
      return false;
  }
}

function applyPassiveDrift(roundDelta) {
  const city = getActiveCity();
  const drift = city.drift || {};
  applyEffectsToState(drift, [roundDelta]);
}

function rollEvent() {
  const city = getActiveCity();
  let pool = city.events
    .map((id) => (EVENT_LIBRARY[id] ? { id, ...EVENT_LIBRARY[id] } : null))
    .filter(Boolean)
    .filter((event) => !state.usedEvents.includes(event.id));

  if (pool.length === 0) {
    state.usedEvents = [];
    pool = city.events
      .map((id) => (EVENT_LIBRARY[id] ? { id, ...EVENT_LIBRARY[id] } : null))
      .filter(Boolean);
  }

  const event = pool[Math.floor(Math.random() * pool.length)];
  if (event) state.usedEvents.push(event.id);
  return event;
}

function normaliseMetrics() {
  Object.keys(state.metrics).forEach((key) => {
    if (key === "budget") {
      state.metrics[key] = Math.max(0, Math.min(state.metrics[key], 100));
      return;
    }

    state.metrics[key] = clampMetric(state.metrics[key]);
  });
}

function buildDeltaSummary(delta) {
  const parts = Object.entries(delta)
    .filter(([, value]) => value !== 0)
    .map(([key, value]) => `${prettyMetricName(key)} ${value > 0 ? "+" : ""}${value}`);

  return parts.length > 0 ? `${parts.join(", ")}.` : "No measurable shift this round.";
}

function buildVerdict(roundDelta, metrics) {
  const positives = ["economy", "jobs", "trust", "resilience"].filter((key) => roundDelta[key] > 0);
  const negatives = ["mobility", "housing", "environment", "budget", "trust", "resilience"].filter((key) => roundDelta[key] < 0);

  if (metrics.trust < 30) {
    return "The city mood is souring fast, and patience is running out.";
  }
  if (metrics.budget < 25) {
    return "The city is still functioning, but the treasury is starting to look nervous.";
  }
  if (metrics.resilience < 30 || metrics.environment < 30) {
    return "Growth is no longer the story; fragility is.";
  }
  if (positives.length >= 3 && negatives.length === 0) {
    return "For the first time in a while, the city feels like it is on your side.";
  }
  if (positives.length >= 2 && negatives.length >= 2) {
    return "Progress landed, but it came with visible bruises.";
  }
  if (positives.length === 0 && negatives.length >= 2) {
    return "This round felt like the city pushing back.";
  }
  return "The city is moving, but not yet in one clear direction.";
}

function buildLegacyVerdict(metrics) {
  const score = calculateScore();
  if (score >= 72) {
    return "History remembers your term as the moment the city found its footing.";
  }
  if (score >= 58) {
    return "History remembers a mixed legacy: steadier systems, unfinished promises.";
  }
  if (metrics.trust < 35 || metrics.budget < 20) {
    return "History remembers a city that survived you, not because of you.";
  }
  return "History remembers ambition, but not enough balance to sustain it.";
}

function buildLegacyBullets() {
  const strong = findStrongestMetrics(state.metrics);
  const weak = findWeakestMetrics(state.metrics);
  const initiativeCounts = {};

  state.roundLog.forEach((entry) => {
    entry.initiatives.forEach((title) => {
      initiativeCounts[title] = (initiativeCounts[title] || 0) + 1;
    });
  });

  const signatureMove = Object.entries(initiativeCounts).sort((left, right) => right[1] - left[1])[0]?.[0];
  const bullets = [
    `${getActiveCity().name} finished with its strongest footing in ${strong.map(prettyMetricName).join(" and ")}.`,
    `The administration never fully solved ${weak.map(prettyMetricName).join(" and ")}.`,
    signatureMove
      ? `Your signature play became ${signatureMove.toLowerCase()}, a move the city came to associate with your term.`
      : "Your term was defined more by pressure management than by one signature project.",
  ];

  if (state.metrics.trust >= 65) {
    bullets.push("Citizens leave your era with more confidence in the city than they had at the start.");
  } else if (state.metrics.trust < 40) {
    bullets.push("Even where conditions improved, public faith in leadership never fully recovered.");
  }

  return bullets;
}

function buildHistoryMemory(score, metrics) {
  if (score >= 75) {
    return "As a reform era that made competence visible in everyday life.";
  }
  if (score >= 60) {
    return "As a stabilizing term that improved some systems but left hard trade-offs unresolved.";
  }
  if (metrics.trust < 40) {
    return "As an era of strained legitimacy, where progress never fully convinced the public.";
  }
  return "As a difficult term that promised more balance than it ultimately delivered.";
}

function buildNewspaperHeadline(cityName, score) {
  if (score >= 75) {
    return `${cityName} Finds Its Footing`;
  }
  if (score >= 60) {
    return `${cityName} Ends On A Narrow Gain`;
  }
  if (score >= 45) {
    return `${cityName} Leaves A Divided Ledger`;
  }
  return `${cityName} Staggers To The Finish`;
}

function findStrongestMetrics(metrics) {
  return [...TRACKED_METRICS]
    .sort((left, right) => clampMetric(metrics[right]) - clampMetric(metrics[left]))
    .slice(0, 2);
}

function findWeakestMetrics(metrics) {
  return [...TRACKED_METRICS]
    .sort((left, right) => clampMetric(metrics[left]) - clampMetric(metrics[right]))
    .slice(0, 2);
}

function animateMetrics(fromMetrics, toMetrics) {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }

  const start = performance.now();
  const duration = 850;
  displayedMetrics = { ...fromMetrics };

  const step = (now) => {
    const progress = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - progress, 4);

    displayedMetrics = TRACKED_METRICS.reduce((accumulator, key) => {
      const fromValue = fromMetrics[key] ?? 0;
      const toValue = toMetrics[key] ?? 0;
      accumulator[key] = Math.round(fromValue + (toValue - fromValue) * eased);
      return accumulator;
    }, {});

    renderMetrics();

    if (progress < 1) {
      animationFrameId = requestAnimationFrame(step);
    } else {
      displayedMetrics = { ...toMetrics };
      renderMetrics();
      animationFrameId = null;
    }
  };

  animationFrameId = requestAnimationFrame(step);
}

function triggerScreenFlash(color) {
  elements.screenFlash.style.background = `radial-gradient(circle at center, ${color}, transparent 68%)`;
  elements.screenFlash.classList.remove("screen-flash");
  void elements.screenFlash.offsetWidth;
  elements.screenFlash.classList.add("screen-flash");
}

function calculateScore() {
  const total = TRACKED_METRICS.reduce((sum, key) => sum + clampMetric(state.metrics[key]), 0);
  return Math.round(total / TRACKED_METRICS.length);
}

function clampMetric(value) {
  return Math.max(0, Math.min(Math.round(value), 100));
}

function prettyMetricName(key) {
  const labels = {
    economy: "Economy",
    mobility: "Mobility",
    housing: "Housing",
    resilience: "Resilience",
    environment: "Environment",
    jobs: "Jobs",
    trust: "Trust",
    budget: "Budget",
    health: "Health",
  };
  return labels[key] || key;
}

function shortMetricName(key) {
  const labels = {
    economy: "Economy",
    mobility: "Mobility",
    housing: "Housing",
    resilience: "Resilience",
    environment: "Env",
    jobs: "Jobs",
    trust: "Trust",
    budget: "Budget",
    health: "Health",
  };
  return labels[key] || prettyMetricName(key);
}

function getCityMeta(cityId) {
  return CITY_META[cityId] || { state: "Unknown", region: "Unknown" };
}

function getCityById(cityId) {
  return CITY_LIBRARY.find((city) => city.id === cityId);
}

function getActiveCity() {
  return getCityById(activeCityId);
}

function handleCityChange(cityId) {
  activeCityId = cityId;
  state = createState(cityId);
  displayedMetrics = { ...state.metrics };
  render();
}

function attachEvents() {
  elements.openCityPicker.addEventListener("click", openCityPicker);
  elements.openCityPickerMobile.addEventListener("click", openCityPicker);
  elements.closeCityPicker.addEventListener("click", closeCityPicker);
  elements.toggleHistory.addEventListener("click", () => {
    historyVisible = !historyVisible;
    renderHistory();
  });
  elements.hideHistory.addEventListener("click", () => {
    historyVisible = false;
    renderHistory();
  });
  elements.advanceButton.addEventListener("click", advanceRound);
}

function openCityPicker() {
  elements.cityPickerPanel.classList.remove("hidden");
}

function closeCityPicker() {
  elements.cityPickerPanel.classList.add("hidden");
}

async function shareResult(mode) {
  const text = buildShareText(mode);

  if (navigator.share) {
    try {
      await navigator.share({
        title: "Build Naija",
        text,
      });
      return;
    } catch (error) {
      if (error && error.name === "AbortError") {
        return;
      }
    }
  }

  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    state.currentAlert = {
      title: "Scorecard copied",
      body: "Your Build Naija result is now in the clipboard, ready for Twitter or WhatsApp.",
      summary: text,
    };
    renderAlert();
    return;
  }

  window.prompt("Copy your result", text);
}

function buildShareText(mode) {
  const city = getActiveCity();
  const score = calculateScore();
  if (mode === "receivership") {
    return `Build Naija: I drove ${city.name} into federal receivership. Final score ${score}/100. Budget ${clampMetric(state.metrics.budget)}, Trust ${clampMetric(state.metrics.trust)}.`;
  }

  return `Build Naija: I finished a ${TOTAL_ROUNDS}-round term in ${city.name} with score ${score}/100. Strongest systems: ${findStrongestMetrics(state.metrics).map(prettyMetricName).join(" and ")}. Weakest: ${findWeakestMetrics(state.metrics).map(prettyMetricName).join(" and ")}.`;
}

async function loadCities() {
  const response = await fetch("./cities.json");
  if (!response.ok) {
    throw new Error(`Failed to load cities.json: ${response.status}`);
  }

  const cities = await response.json();
  return cities.sort((left, right) => left.name.localeCompare(right.name));
}

async function loadJsonFile(path) {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Failed to load ${path}: ${response.status}`);
  }

  return response.json();
}

async function init() {
  try {
    const [cities, initiatives, events] = await Promise.all([
      loadCities(),
      loadJsonFile("./initiatives.json"),
      loadJsonFile("./events.json"),
    ]);

    CITY_LIBRARY = cities;
    INITIATIVE_LIBRARY = initiatives;
    EVENT_LIBRARY = events;
    activeCityId = CITY_LIBRARY[0]?.id ?? null;
    state = activeCityId ? createState(activeCityId) : null;
    displayedMetrics = state ? { ...state.metrics } : null;
    attachEvents();
    render();
  } catch (error) {
    document.body.innerHTML = `
      <main class="grid min-h-screen place-items-center bg-shell px-6 text-center text-cream">
        <div>
          <h1 class="font-display text-5xl">Build Naija</h1>
          <p class="mt-4 text-lg text-[#d0c9bd]">The app could not load its data files.</p>
          <p class="mt-2 text-sm text-[#a9a294]">Run it through a local web server so the browser can fetch <code>cities.json</code>, <code>initiatives.json</code>, and <code>events.json</code>.</p>
        </div>
      </main>
    `;
    console.error(error);
  }
}

init();
