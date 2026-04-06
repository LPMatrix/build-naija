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

const elements = {
  citySelect: document.querySelector("#city-select"),
  citySelectMobile: document.querySelector("#city-select-mobile"),
  roundDisplay: document.querySelector("#round-display"),
  cityMeta: document.querySelector("#city-meta"),
  heroCityName: document.querySelector("#hero-city-name"),
  heroCitySummary: document.querySelector("#hero-city-summary"),
  budgetPill: document.querySelector("#budget-pill"),
  metricsGrid: document.querySelector("#metrics-grid"),
  eventBanner: document.querySelector("#event-banner"),
  initiativeList: document.querySelector("#initiative-list"),
  selectionStatus: document.querySelector("#selection-status"),
  advanceButton: document.querySelector("#advance-turn"),
};

let activeCityId = null;
let state = null;

function createMetricDelta() {
  return TRACKED_METRICS.reduce((accumulator, key) => {
    accumulator[key] = 0;
    return accumulator;
  }, {});
}

function createState(cityId) {
  const city = getCityById(cityId);
  return {
    cityId,
    round: 1,
    gameOver: false,
    selectedInitiatives: [],
    usedEvents: [],
    metrics: { ...city.metrics },
    lastRoundDelta: createMetricDelta(),
    currentAlert: {
      title: "Planning desk opens",
      body: city.summary,
      summary: "Pick one or two initiatives to start shifting the city's balance.",
    },
  };
}

function render() {
  if (!state) {
    return;
  }

  const city = getActiveCity();
  renderCitySelectors();
  renderHero(city);
  renderMetrics();
  renderAlert();
  renderInitiatives(city);
  renderFooter();
  elements.roundDisplay.textContent = `Round ${state.round} of ${TOTAL_ROUNDS}`;
  elements.advanceButton.disabled = state.gameOver;
  elements.advanceButton.textContent = state.gameOver ? "Campaign complete" : "End round ↗";
}

function renderCitySelectors() {
  const options = CITY_LIBRARY.map((city) => {
    const meta = getCityMeta(city.id);
    const selected = city.id === activeCityId ? "selected" : "";
    return `<option value="${city.id}" ${selected}>${city.name} · ${meta.state}</option>`;
  }).join("");

  elements.citySelect.innerHTML = options;
  elements.citySelectMobile.innerHTML = options;
}

function renderHero(city) {
  const meta = getCityMeta(city.id);
  elements.cityMeta.textContent = `${meta.state} · ${meta.region} · ${city.resources.join(" · ")}`;
  elements.heroCityName.textContent = city.name;
  elements.heroCitySummary.textContent = city.summary;
  elements.budgetPill.textContent = `₦${clampMetric(state.metrics.budget)}B budget`;
}

function renderMetrics() {
  elements.metricsGrid.innerHTML = METRIC_CONFIG.map((metric) => {
    const value = clampMetric(state.metrics[metric.key]);
    const delta = state.lastRoundDelta[metric.key] ?? 0;
    const deltaClass = delta > 0 ? "text-green" : delta < 0 ? "text-red" : "text-[#aaa396]";
    const deltaPrefix = delta > 0 ? "+" : "";

    return `
      <article class="rounded-[1.35rem] bg-card px-6 py-5">
        <p class="text-[1.05rem] font-semibold uppercase tracking-[0.05em] text-[#cfc8bc]">${metric.label}</p>
        <p class="mt-1 text-5xl font-semibold leading-none text-[#f7f3eb]">${value}</p>
        <div class="mt-5 h-1.5 overflow-hidden rounded-full bg-[#4e4b46]">
          <div class="h-full ${metric.barClass}" style="width:${Math.max(0, Math.min(value, 100))}%"></div>
        </div>
        <p class="mt-4 text-[0.95rem] font-semibold ${deltaClass}">${deltaPrefix}${delta} this round</p>
      </article>
    `;
  }).join("");
}

function renderAlert() {
  elements.eventBanner.innerHTML = `
    <div class="flex gap-4">
      <div class="pt-1 text-3xl text-[#e29a00]">⚡</div>
      <div>
        <h3 class="text-2xl font-semibold text-[#7e4a0d]">${state.currentAlert.title}</h3>
        <p class="mt-2 text-[1.05rem] font-medium leading-8 text-[#955c11]">${state.currentAlert.body}</p>
        <p class="mt-1 text-[1.05rem] font-semibold leading-8 text-[#955c11]">${state.currentAlert.summary}</p>
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
    const toggleLabel = isSelected ? "Selected" : "Select";
    const toggleClass = isSelected
      ? "border-[#9cca33] bg-[#dfe8c6] text-[#395d0c]"
      : "border-[#5c5a55] bg-transparent text-[#f3eee4]";

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
              class="rounded-full border px-4 py-2 text-sm font-bold transition hover:-translate-y-0.5 ${toggleClass}"
            >
              ${toggleLabel}
            </button>
          </div>
          <p class="max-w-3xl text-[1.05rem] font-medium leading-9 ${bodyColor}">${initiative.description}</p>
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
  elements.selectionStatus.textContent = `${count} of 2 ${label} selected`;
}

function renderEffectBadge(label, positive) {
  const classes = positive
    ? "bg-[#e4efcf] text-[#447313]"
    : "bg-[#f3dddd] text-[#b3362d]";
  return `<span class="rounded-full px-3 py-1.5 text-[0.95rem] font-semibold ${classes}">${label}</span>`;
}

function toggleInitiative(id) {
  if (state.gameOver) {
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

  const roundDelta = createMetricDelta();
  let alert = {
    title: "Round review",
    body: "Your planning package lands across the city.",
    summary: "Momentum shifts, but not every system moves in the same direction.",
  };

  if (state.selectedInitiatives.length === 0) {
    applyEffectsToState({ trust: -3, economy: -2 }, [roundDelta]);
    alert = {
      title: "A quiet round costs momentum",
      body: "Holding back preserves options, but people and businesses notice when the agenda slows.",
      summary: "Trust -3, Economy -2.",
    };
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
  }

  normaliseMetrics();
  state.lastRoundDelta = roundDelta;
  state.currentAlert = alert;
  state.selectedInitiatives = [];

  if (state.metrics.budget <= 0) {
    state.gameOver = true;
    state.currentAlert = {
      title: "Federal receivership",
      body: `${getActiveCity().name} has run out of money. The federal government has stepped in to manage the city's finances.`,
      summary: "The campaign ends here.",
    };
  } else if (state.round >= TOTAL_ROUNDS) {
    state.gameOver = true;
    state.currentAlert = {
      title: "Campaign complete",
      body: `You guided ${getActiveCity().name} through ${TOTAL_ROUNDS} rounds of trade-offs and pressure.`,
      summary: `Final balance score ${calculateScore()}/100.`,
    };
  } else {
    state.round += 1;
  }

  render();
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
    .map((id) => EVENT_LIBRARY[id])
    .filter(Boolean)
    .filter((event) => !state.usedEvents.includes(event.id));

  if (pool.length === 0) {
    state.usedEvents = [];
    pool = city.events.map((id) => EVENT_LIBRARY[id]).filter(Boolean);
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
  render();
}

function attachEvents() {
  elements.citySelect.addEventListener("change", (event) => handleCityChange(event.target.value));
  elements.citySelectMobile.addEventListener("change", (event) => handleCityChange(event.target.value));
  elements.advanceButton.addEventListener("click", advanceRound);
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