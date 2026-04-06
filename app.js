let CITY_LIBRARY = [];

const INITIATIVE_LIBRARY = {
  transit: {
    id: "transit",
    title: "Bus Rapid Transit Expansion",
    description:
      "Create dedicated lanes and modern bus terminals to move more people faster across the city.",
    cost: 18,
    time: "2 years",
    effects: {
      mobility: 15,
      economy: 6,
      trust: 5,
      budget: -10,
      environment: 3,
    },
    tradeOff: "Fast mobility gains, but eats a large slice of capital budget.",
  },
  housing: {
    id: "housing",
    title: "Mixed-Income Housing Program",
    description:
      "Unlock land, support densification, and co-fund affordable housing near job clusters.",
    cost: 16,
    time: "3 years",
    effects: {
      housing: 16,
      trust: 6,
      jobs: 5,
      budget: -9,
      environment: -3,
    },
    tradeOff: "Improves inclusion and housing pressure, but can trigger land and infrastructure stress.",
  },
  drainage: {
    id: "drainage",
    title: "Drainage and Flood Defense",
    description:
      "Upgrade drainage channels, desilt waterways, and expand flood defense in vulnerable districts.",
    cost: 14,
    time: "2 years",
    effects: {
      resilience: 16,
      trust: 4,
      environment: 6,
      budget: -8,
      economy: -2,
    },
    tradeOff: "Protects long-term growth, but the wins are less visible than shiny new projects.",
  },
  waste: {
    id: "waste",
    title: "Waste Collection Overhaul",
    description:
      "Improve collection routes, sorting hubs, and enforcement against illegal dumping.",
    cost: 9,
    time: "1 year",
    effects: {
      environment: 12,
      trust: 5,
      resilience: 5,
      budget: -5,
    },
    tradeOff: "Low glamour, high impact. Keeps the city healthier but rarely excites investors.",
  },
  "tech-hubs": {
    id: "tech-hubs",
    title: "Startup and Innovation District",
    description:
      "Create serviced workspaces, small grants, and talent pipelines for high-growth firms.",
    cost: 12,
    time: "2 years",
    effects: {
      economy: 12,
      jobs: 8,
      trust: -2,
      budget: -7,
      housing: -3,
    },
    tradeOff: "Strong growth story, but can deepen inequality if basics are ignored.",
  },
  markets: {
    id: "markets",
    title: "Market Modernisation",
    description:
      "Upgrade stalls, storage, sanitation, and access roads for informal and formal trade hubs.",
    cost: 10,
    time: "1 year",
    effects: {
      economy: 8,
      jobs: 10,
      trust: 4,
      budget: -6,
      mobility: 2,
    },
    tradeOff: "Boosts everyday commerce quickly, but can stall if traffic and utilities stay weak.",
  },
  "industrial-power": {
    id: "industrial-power",
    title: "Power Reliability for Industry",
    description:
      "Support captive power, mini-grids, and substation upgrades for factories and industrial clusters.",
    cost: 15,
    time: "2 years",
    effects: {
      economy: 14,
      jobs: 7,
      resilience: 5,
      budget: -9,
      environment: -4,
    },
    tradeOff: "Unlocks production and jobs, but the wrong energy mix can worsen emissions.",
  },
  vocational: {
    id: "vocational",
    title: "Vocational Skills Push",
    description:
      "Expand technical training in construction, fabrication, logistics, and digital operations.",
    cost: 8,
    time: "1 year",
    effects: {
      jobs: 12,
      economy: 5,
      trust: 4,
      budget: -4,
    },
    tradeOff: "Builds long-term earning power, but needs follow-through from employers to stick.",
  },
  water: {
    id: "water",
    title: "Water Security Upgrade",
    description:
      "Expand borehole networks, treatment systems, and distribution upgrades in underserved areas.",
    cost: 13,
    time: "2 years",
    effects: {
      resilience: 11,
      trust: 8,
      health: 8,
      budget: -7,
      economy: 2,
    },
    tradeOff: "Essential for public health and resilience, though it competes with more visible spending.",
  },
  roads: {
    id: "roads",
    title: "Inner-City Road Rehabilitation",
    description:
      "Repair critical roads and junctions connecting markets, schools, and residential zones.",
    cost: 11,
    time: "1 year",
    effects: {
      mobility: 9,
      economy: 6,
      trust: 3,
      budget: -6,
      environment: -2,
    },
    tradeOff: "Popular and practical, but road-first strategy can become an expensive trap.",
  },
  health: {
    id: "health",
    title: "Primary Health Access",
    description:
      "Upgrade local clinics, recruit staff, and improve medicine availability in dense communities.",
    cost: 10,
    time: "1 year",
    effects: {
      trust: 9,
      resilience: 6,
      jobs: 3,
      budget: -6,
    },
    tradeOff: "Citizens feel the benefit fast, but financial return is indirect and slower.",
  },
  cleanup: {
    id: "cleanup",
    title: "Pollution Cleanup and Monitoring",
    description:
      "Fund cleanup teams, water testing, and environmental enforcement in heavily impacted areas.",
    cost: 12,
    time: "2 years",
    effects: {
      environment: 17,
      trust: 6,
      resilience: 4,
      budget: -7,
      economy: -2,
    },
    tradeOff: "Repairs damage and builds legitimacy, but may constrain extractive activity in the short term.",
  },
  skills: {
    id: "skills",
    title: "Youth Employment Compact",
    description:
      "Blend apprenticeships, SME support, and placement incentives for unemployed young adults.",
    cost: 9,
    time: "1 year",
    effects: {
      jobs: 11,
      trust: 7,
      economy: 5,
      budget: -5,
    },
    tradeOff: "Raises optimism quickly, but weak business conditions can limit the payoff.",
  },
};

const EVENT_LIBRARY = {
  "coastal-flood": {
    title: "Coastal flooding surges again",
    body: "Heavy rains test waterfront neighborhoods and expose weak drainage corridors.",
    apply: (state) => {
      const penalty = state.metrics.resilience < 55 ? -10 : -4;
      state.metrics.resilience += penalty;
      state.metrics.trust -= 4;
      state.metrics.budget -= 3;
      state.metrics.environment -= 2;
    },
  },
  "investment-wave": {
    title: "Investors circle the city",
    body: "Fresh interest from logistics and tech firms lifts sentiment around future growth.",
    apply: (state) => {
      state.metrics.economy += 8;
      state.metrics.jobs += 5;
      state.metrics.housing -= 3;
    },
  },
  "rent-strike": {
    title: "Housing pressure sparks protests",
    body: "Rent increases trigger public anger and put your urban agenda under scrutiny.",
    apply: (state) => {
      state.metrics.trust -= 7;
      state.metrics.housing -= 5;
      state.metrics.economy -= 2;
    },
  },
  "dry-season": {
    title: "A harsh dry season hits supply chains",
    body: "Water stress raises costs for households and manufacturers alike.",
    apply: (state) => {
      state.metrics.resilience -= 7;
      state.metrics.economy -= 4;
      state.metrics.trust -= 3;
    },
  },
  "market-boom": {
    title: "Regional trade picks up",
    body: "Stronger market activity gives local commerce and transport operators a lift.",
    apply: (state) => {
      state.metrics.economy += 7;
      state.metrics.jobs += 6;
      state.metrics.mobility -= 2;
    },
  },
  "migration-surge": {
    title: "New arrivals strain city services",
    body: "Population growth expands the labour pool but adds pressure to housing and roads.",
    apply: (state) => {
      state.metrics.jobs += 2;
      state.metrics.housing -= 6;
      state.metrics.mobility -= 4;
    },
  },
  "oil-spill": {
    title: "Fresh spill damages public confidence",
    body: "Communities demand faster cleanup as pollution worsens around key corridors.",
    apply: (state) => {
      state.metrics.environment -= 10;
      state.metrics.trust -= 6;
      state.metrics.budget -= 2;
    },
  },
  "federal-grant": {
    title: "Federal support lands",
    body: "A major grant eases pressure on the treasury and unlocks stalled improvements.",
    apply: (state) => {
      state.metrics.budget += 12;
      state.metrics.trust += 3;
      state.metrics.resilience += 4;
    },
  },
  "community-protest": {
    title: "Community groups push back",
    body: "Residents demand fairer access to services and better communication on new projects.",
    apply: (state) => {
      state.metrics.trust -= 8;
      state.metrics.housing -= 2;
      state.metrics.jobs -= 2;
    },
  },
};

const METRIC_CONFIG = [
  { key: "budget", label: "Budget", unit: "bn" },
  { key: "trust", label: "Public trust", unit: "%" },
  { key: "economy", label: "Economy", unit: "%" },
  { key: "jobs", label: "Jobs", unit: "%" },
  { key: "mobility", label: "Mobility", unit: "%" },
  { key: "housing", label: "Housing", unit: "%" },
  { key: "resilience", label: "Resilience", unit: "%" },
  { key: "environment", label: "Environment", unit: "%" },
];

const START_YEAR = 2026;
const END_YEAR = 2038;

const elements = {
  cityList: document.querySelector("#city-list"),
  metricsGrid: document.querySelector("#metrics-grid"),
  resourceList: document.querySelector("#resource-list"),
  initiativeList: document.querySelector("#initiative-list"),
  yearDisplay: document.querySelector("#year-display"),
  scoreDisplay: document.querySelector("#score-display"),
  selectionSummary: document.querySelector("#selection-summary"),
  adviceList: document.querySelector("#advice-list"),
  eventLog: document.querySelector("#event-log"),
  headlineEvent: document.querySelector("#headline-event"),
  advanceButton: document.querySelector("#advance-turn"),
  resetButton: document.querySelector("#reset-game"),
  heroCityName: document.querySelector("#hero-city-name"),
  heroCitySummary: document.querySelector("#hero-city-summary"),
  heroBudget: document.querySelector("#hero-budget"),
  heroTrust: document.querySelector("#hero-trust"),
  cityCount: document.querySelector("#city-count"),
};

let activeCityId = null;
let state = null;

function createState(cityId) {
  const city = CITY_LIBRARY.find((entry) => entry.id === cityId);
  return {
    cityId,
    year: START_YEAR,
    selectedInitiatives: [],
    metrics: { ...city.metrics, health: 50 },
    history: [
      {
        year: START_YEAR,
        title: `${city.name} planning desk opens`,
        body: city.summary,
      },
    ],
    headline: {
      title: "Your first brief is ready",
      body: "Study the city's strengths, choose up to two moves, and try not to chase growth at the expense of balance.",
    },
  };
}

function render() {
  if (!state) {
    return;
  }
  const city = getActiveCity();
  renderCityCards(city);
  renderHero(city);
  renderMetrics();
  renderResources(city);
  renderInitiatives(city);
  renderSelectionSummary();
  renderInsights();
  elements.yearDisplay.textContent = state.year;
  elements.scoreDisplay.textContent = `${calculateScore()}/100`;
  elements.advanceButton.disabled = state.year >= END_YEAR;
  elements.advanceButton.textContent =
    state.year >= END_YEAR ? "Campaign complete" : "Simulate next year";
}

function renderCityCards(activeCity) {
  elements.cityList.innerHTML = CITY_LIBRARY.map((city) => {
    const classes = ["city-card"];
    if (city.id === activeCity.id) {
      classes.push("active");
    }

    return `
      <button class="${classes.join(" ")}" type="button" data-city-id="${city.id}">
        <h3>${city.name}</h3>
        <p>${city.summary}</p>
        <div class="city-footer">
          <span>Budget ${city.metrics.budget}bn</span>
          <span>Trust ${city.metrics.trust}%</span>
          <span>Economy ${city.metrics.economy}%</span>
        </div>
      </button>
    `;
  }).join("");

  elements.cityList.querySelectorAll("[data-city-id]").forEach((button) => {
    button.addEventListener("click", () => {
      activeCityId = button.dataset.cityId;
      state = createState(activeCityId);
      render();
    });
  });
}

function renderHero(city) {
  elements.heroCityName.textContent = city.name;
  elements.heroCitySummary.textContent = city.summary;
  elements.heroBudget.textContent = `₦${Math.max(0, Math.round(state.metrics.budget))}bn`;
  elements.heroTrust.textContent = `${clampMetric(state.metrics.trust)}%`;
}

function renderMetrics() {
  elements.metricsGrid.innerHTML = METRIC_CONFIG.map((metric) => {
    const rawValue = state.metrics[metric.key];
    const displayValue = metric.key === "budget"
      ? `₦${Math.max(0, Math.round(rawValue))}${metric.unit}`
      : `${clampMetric(rawValue)}${metric.unit}`;
    const fillValue = metric.key === "budget"
      ? Math.min(Math.max(rawValue, 0), 100)
      : clampMetric(rawValue);
    return `
      <article class="metric-card">
        <span class="metric-label">${metric.label}</span>
        <strong class="metric-value">${displayValue}</strong>
        <div class="metric-bar" aria-hidden="true">
          <div class="metric-fill" style="width: ${fillValue}%"></div>
        </div>
      </article>
    `;
  }).join("");
}

function renderResources(city) {
  elements.resourceList.innerHTML = city.resources
    .map((resource) => `<span class="resource-tag">${resource}</span>`)
    .join("");
}

function renderInitiatives(city) {
  const availableInitiatives = city.initiatives.map((id) => INITIATIVE_LIBRARY[id]);
  elements.initiativeList.innerHTML = availableInitiatives.map((initiative) => {
    const isSelected = state.selectedInitiatives.includes(initiative.id);
    const effects = Object.entries(initiative.effects)
      .filter(([key]) => key !== "health")
      .slice(0, 4)
      .map(([key, value]) => {
        const sign = value > 0 ? "+" : "";
        return `<span>${prettyMetricName(key)} ${sign}${value}</span>`;
      })
      .join("");

    return `
      <article class="initiative-card">
        <div class="initiative-topline">
          <div>
            <p class="initiative-meta">Cost ₦${initiative.cost}bn · ${initiative.time}</p>
            <h3>${initiative.title}</h3>
          </div>
          <button class="toggle-button ${isSelected ? "active" : ""}" type="button" data-initiative-id="${initiative.id}">
            ${isSelected ? "Selected" : "Add plan"}
          </button>
        </div>
        <p class="initiative-text">${initiative.description}</p>
        <div class="initiative-impact">${effects}</div>
        <div class="initiative-footer">
          <span>${initiative.tradeOff}</span>
        </div>
      </article>
    `;
  }).join("");

  elements.initiativeList.querySelectorAll("[data-initiative-id]").forEach((button) => {
    button.addEventListener("click", () => toggleInitiative(button.dataset.initiativeId));
  });
}

function renderSelectionSummary() {
  const selections = state.selectedInitiatives.map((id) => INITIATIVE_LIBRARY[id]);
  if (selections.length === 0) {
    elements.selectionSummary.innerHTML = "No moves selected yet. Pick one or two initiatives before simulating the year.";
    return;
  }

  const totalCost = selections.reduce((sum, item) => sum + item.cost, 0);
  elements.selectionSummary.innerHTML = `
    ${selections.map((item) => `<span class="selection-chip">${item.title}</span>`).join("")}
    <span class="selection-chip">Total cost ₦${totalCost}bn</span>
  `;
}

function renderInsights() {
  elements.headlineEvent.innerHTML = `
    <h3>${state.headline.title}</h3>
    <p>${state.headline.body}</p>
  `;

  const advice = generateAdvice();
  elements.adviceList.innerHTML = advice.map((item) => `<li>${item}</li>`).join("");

  elements.eventLog.innerHTML = [...state.history]
    .reverse()
    .map((entry) => `
      <article class="event-item">
        <span class="event-year">${entry.year}</span>
        <h3>${entry.title}</h3>
        <p>${entry.body}</p>
      </article>
    `)
    .join("");
}

function toggleInitiative(id) {
  const isSelected = state.selectedInitiatives.includes(id);
  if (isSelected) {
    state.selectedInitiatives = state.selectedInitiatives.filter((item) => item !== id);
  } else {
    if (state.selectedInitiatives.length >= 2) {
      state.headline = {
        title: "Planning cap reached",
        body: "You can only push two major initiatives in a single year. Drop one before adding another.",
      };
      render();
      return;
    }
    state.selectedInitiatives = [...state.selectedInitiatives, id];
  }
  render();
}

function advanceYear() {
  if (state.year >= END_YEAR) {
    return;
  }

  if (state.selectedInitiatives.length === 0) {
    state.headline = {
      title: "A quiet year costs momentum",
      body: "Doing nothing preserves cash, but citizens and businesses notice when plans stall.",
    };
    state.metrics.trust -= 3;
    state.metrics.economy -= 2;
  }

  const selections = state.selectedInitiatives.map((id) => INITIATIVE_LIBRARY[id]);
  selections.forEach((initiative) => {
    applyEffects(initiative.effects);
    state.history.push({
      year: state.year,
      title: initiative.title,
      body: initiative.tradeOff,
    });
  });

  applyPassiveDrift();

  const event = rollEvent();
  if (event) {
    event.apply(state);
    state.headline = {
      title: event.title,
      body: event.body,
    };
    state.history.push({
      year: state.year + 1,
      title: event.title,
      body: event.body,
    });
  }

  normaliseMetrics();
  state.selectedInitiatives = [];
  state.year += 1;

  if (state.year >= END_YEAR) {
    state.headline = {
      title: "Campaign complete",
      body: `You guided ${getActiveCity().name} to a final balance score of ${calculateScore()}/100. Restart the city or try a different one to compare outcomes.`,
    };
  }

  render();
}

function applyEffects(effects) {
  Object.entries(effects).forEach(([key, value]) => {
    if (typeof state.metrics[key] !== "number") {
      state.metrics[key] = 50;
    }
    state.metrics[key] += value;
  });
}

function applyPassiveDrift() {
  state.metrics.budget += 4;
  state.metrics.economy += 1;
  state.metrics.housing -= 1;
  state.metrics.mobility -= 1;
  state.metrics.environment -= 1;
}

function rollEvent() {
  const city = getActiveCity();
  const pool = city.events.map((id) => EVENT_LIBRARY[id]);
  return pool[Math.floor(Math.random() * pool.length)];
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

function clampMetric(value) {
  return Math.max(0, Math.min(Math.round(value), 100));
}

function calculateScore() {
  const tracked = ["trust", "economy", "jobs", "mobility", "housing", "resilience", "environment"];
  const total = tracked.reduce((sum, key) => sum + clampMetric(state.metrics[key]), 0);
  const budgetWeight = Math.min(Math.max(state.metrics.budget, 0), 100);
  return Math.round((total + budgetWeight) / 8);
}

function prettyMetricName(key) {
  const map = {
    budget: "Budget",
    trust: "Trust",
    economy: "Economy",
    mobility: "Mobility",
    housing: "Housing",
    resilience: "Resilience",
    environment: "Environment",
    jobs: "Jobs",
    health: "Health",
  };
  return map[key] || key;
}

function generateAdvice() {
  const advice = [];
  if (state.metrics.budget < 25) {
    advice.push("Budget is getting dangerously thin. Mix in lower-cost reforms or wait for a grant event.");
  }
  if (state.metrics.trust < 45) {
    advice.push("Public trust is shaky. Health, housing, and visible service upgrades can stabilise your position.");
  }
  if (state.metrics.environment < 40) {
    advice.push("Environmental conditions are dragging down the city. Cleanup, drainage, or waste work should move up the list.");
  }
  if (state.metrics.mobility < 40) {
    advice.push("Movement across the city is becoming a bottleneck. Congestion can erase economic wins if ignored.");
  }
  if (state.metrics.jobs < 50) {
    advice.push("Employment needs attention. Markets, skills, or industrial power can create faster job momentum.");
  }
  if (advice.length === 0) {
    advice.push("The city is reasonably balanced right now. Use the next round to deepen a strength without exposing a weak flank.");
  }
  return advice.slice(0, 4);
}

function getActiveCity() {
  return CITY_LIBRARY.find((city) => city.id === activeCityId);
}

elements.advanceButton.addEventListener("click", advanceYear);
elements.resetButton.addEventListener("click", () => {
  state = createState(activeCityId);
  render();
});

async function loadCities() {
  const response = await fetch("./cities.json");
  if (!response.ok) {
    throw new Error(`Failed to load cities.json: ${response.status}`);
  }

  const cities = await response.json();
  return cities.sort((left, right) => left.name.localeCompare(right.name));
}

async function init() {
  try {
    CITY_LIBRARY = await loadCities();
    activeCityId = CITY_LIBRARY[0]?.id ?? null;
    state = activeCityId ? createState(activeCityId) : null;
    elements.cityCount.textContent = `${CITY_LIBRARY.length} cities`;
    render();
  } catch (error) {
    elements.cityCount.textContent = "City data unavailable";
    elements.headlineEvent.innerHTML = `
      <h3>City data could not load</h3>
      <p>Build Naija now reads cities from <code>cities.json</code>. Open the app through a local web server so the browser can fetch the data file.</p>
    `;
    elements.advanceButton.disabled = true;
    elements.resetButton.disabled = true;
    elements.cityList.innerHTML = "";
    elements.initiativeList.innerHTML = "";
    console.error(error);
  }
}

init();
