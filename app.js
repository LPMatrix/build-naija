const { createApp } = window.Vue;

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
const REGION_ORDER = ["North West", "North East", "North Central", "South West", "South East", "South South"];

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

function clampMetric(value) {
  return Math.max(0, Math.min(Math.round(value), 100));
}

function createMetricDelta() {
  return TRACKED_METRICS.reduce((accumulator, key) => {
    accumulator[key] = 0;
    return accumulator;
  }, {});
}

function getCityMeta(cityId) {
  return CITY_META[cityId] || { state: "Unknown", region: "Unknown" };
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

function mergeEffects(target, effects = {}) {
  Object.entries(effects).forEach(([key, value]) => {
    if (typeof target[key] !== "number") {
      target[key] = 0;
    }
    target[key] += value;
  });
}

createApp({
  data() {
    return {
      cityLibrary: [],
      initiativeLibrary: {},
      eventLibrary: {},
      startYear: START_YEAR,
      totalRounds: TOTAL_ROUNDS,
      activeCityId: null,
      state: null,
      displayedMetrics: null,
      animationFrameId: null,
      historyVisible: false,
      cityPickerOpen: false,
      flashOverlay: "",
      flashActive: false,
    };
  },
  computed: {
    activeCity() {
      return this.cityLibrary.find((city) => city.id === this.activeCityId) || null;
    },
    activeMeta() {
      return this.activeCity ? getCityMeta(this.activeCity.id) : { state: "", region: "" };
    },
    roundLabel() {
      return this.state ? `Round ${this.state.round} of ${TOTAL_ROUNDS}` : "";
    },
    currentTheme() {
      return this.activeCity ? this.getCityTheme(this.activeCity.id) : DEFAULT_THEME;
    },
    groupedCities() {
      return REGION_ORDER.map((region) => ({
        region,
        cities: this.cityLibrary.filter((city) => getCityMeta(city.id).region === region),
      }));
    },
    renderedMetrics() {
      const source = this.displayedMetrics || (this.state ? this.state.metrics : {});
      if (!source) {
        return [];
      }
      return METRIC_CONFIG.map((metric) => {
        const value = clampMetric(source[metric.key]);
        const actualValue = clampMetric(this.state.metrics[metric.key]);
        const delta = this.state.lastRoundDelta[metric.key] ?? 0;
        return {
          ...metric,
          value,
          delta,
          deltaPrefix: delta > 0 ? "+" : "",
          deltaClass: delta > 0 ? "text-green" : delta < 0 ? "text-red" : "text-[#aaa396]",
          isDanger: actualValue < 30,
        };
      });
    },
    visibleInitiatives() {
      if (!this.activeCity || !this.state) {
        return [];
      }
      return this.activeCity.initiatives
        .map((id) => this.initiativeLibrary[id])
        .filter(Boolean)
        .map((initiative) => {
          const cooldown = this.state.cooldowns[initiative.id] || 0;
          const isSelected = this.state.selectedInitiatives.includes(initiative.id);
          const preview = this.getInitiativePreview(initiative);
          const effectEntries = Object.entries(initiative.effects);
          return {
            ...initiative,
            cooldown,
            isLocked: cooldown > 0,
            isSelected,
            preview,
            positiveBadges: effectEntries
              .filter(([, value]) => value > 0)
              .slice(0, 2)
              .map(([key]) => `+${shortMetricName(key)}`),
            negativeBadges: effectEntries
              .filter(([, value]) => value < 0)
              .slice(0, 2)
              .map(([key]) => `-${shortMetricName(key)}`),
          };
        });
    },
    selectionStatus() {
      if (!this.state) {
        return "";
      }
      const count = this.state.selectedInitiatives.length;
      const projection = this.getCurrentPackageProjection();
      const label = count === 1 ? "initiative" : "initiatives";
      const budgetFragment = count > 0 ? ` · projected budget ₦${projection.budget}B` : "";
      const warningFragment = projection.warning ? ` · ${projection.warning}` : "";
      return `${count} of 2 ${label} selected${budgetFragment}${warningFragment}`;
    },
    recentHistory() {
      if (!this.state) {
        return [];
      }
      return [...this.state.roundLog].reverse();
    },
    finalScore() {
      return this.state ? this.calculateScore(this.state.metrics) : 0;
    },
    legacyStrongest() {
      return this.state ? this.findStrongestMetrics(this.state.metrics) : [];
    },
    legacyWeakest() {
      return this.state ? this.findWeakestMetrics(this.state.metrics) : [];
    },
    endHeadline() {
      return this.activeCity ? this.buildNewspaperHeadline(this.activeCity.name, this.finalScore) : "";
    },
    endGrade() {
      if (this.finalScore >= 75) return "A";
      if (this.finalScore >= 65) return "B";
      if (this.finalScore >= 55) return "C";
      if (this.finalScore >= 45) return "D";
      return "F";
    },
    legacyBullets() {
      return this.state ? this.buildLegacyBullets() : [];
    },
  },
  methods: {
    async initialize() {
      const [cities, initiatives, events] = await Promise.all([
        this.loadCities(),
        this.loadJsonFile("./initiatives.json"),
        this.loadJsonFile("./events.json"),
      ]);
      this.cityLibrary = cities;
      this.initiativeLibrary = initiatives;
      this.eventLibrary = events;
      this.activeCityId = this.cityLibrary[0]?.id || null;
      this.state = this.activeCityId ? this.createState(this.activeCityId) : null;
      this.displayedMetrics = this.state ? { ...this.state.metrics } : null;
      this.applyCityTheme();
    },
    async loadCities() {
      const response = await fetch("./cities.json");
      if (!response.ok) {
        throw new Error(`Failed to load cities.json: ${response.status}`);
      }
      const cities = await response.json();
      return cities.sort((left, right) => left.name.localeCompare(right.name));
    },
    async loadJsonFile(path) {
      const response = await fetch(path);
      if (!response.ok) {
        throw new Error(`Failed to load ${path}: ${response.status}`);
      }
      return response.json();
    },
    createState(cityId) {
      const city = this.cityLibrary.find((entry) => entry.id === cityId);
      const openingCrisis = this.getOpeningCrisis(city);
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
    },
    getCityTheme(cityId) {
      const specificTheme = CITY_THEMES[cityId];
      if (specificTheme) {
        return specificTheme;
      }
      const region = getCityMeta(cityId).region;
      if (region === "South South") return { accent: "#1d7561", soft: "#d8e9e2", eventBg: "#ebddd4", eventBorder: "#b56e5d", eventText: "#7f3127" };
      if (region === "South West") return { accent: "#6a9518", soft: "#dfe8c6", eventBg: "#f1e5cf", eventBorder: "#d39b44", eventText: "#895712" };
      if (region === "South East") return { accent: "#758a1c", soft: "#e4e6c8", eventBg: "#efe3cf", eventBorder: "#c89a56", eventText: "#875a1e" };
      if (region === "North West") return { accent: "#9b6917", soft: "#ecdac2", eventBg: "#efe0ca", eventBorder: "#cf8b37", eventText: "#865315" };
      if (region === "North East") return { accent: "#8c5418", soft: "#ead7c0", eventBg: "#ecddcd", eventBorder: "#c57e38", eventText: "#7b4b12" };
      if (region === "North Central") return { accent: "#4d7d60", soft: "#d9e6df", eventBg: "#e9e0d2", eventBorder: "#a78f67", eventText: "#5f6c58" };
      return DEFAULT_THEME;
    },
    clampMetric(value) {
      return clampMetric(value);
    },
    prettyMetricName(key) {
      return prettyMetricName(key);
    },
    getCityMeta(cityId) {
      return getCityMeta(cityId);
    },
    metricBarWidth(value) {
      return `${clampMetric(value)}%`;
    },
    applyCityTheme() {
      if (!this.activeCity) {
        return;
      }
      const theme = this.getCityTheme(this.activeCity.id);
      document.documentElement.style.setProperty("--city-accent", theme.accent);
      document.documentElement.style.setProperty("--city-soft", theme.soft);
      document.documentElement.style.setProperty("--city-event", theme.eventBg);
      document.documentElement.style.setProperty("--city-event-border", theme.eventBorder);
      document.documentElement.style.setProperty("--city-event-text", theme.eventText);
    },
    getOpeningCrisis(city) {
      const meta = getCityMeta(city.id);
      const crises = {
        lagos: {
          title: "Gridlock is eating the city's edge",
          body: "Commuters are losing hours to congestion while rent and flood pressure keep tightening around growth corridors.",
          summary: "Mobility and housing are under strain before your first move.",
          verdict: "The city is impatient, ambitious, and already overheating.",
        },
        abuja: {
          title: "Expansion is outrunning affordability",
          body: "Land pressure and commuter friction are rising faster than the capital's infrastructure can absorb.",
          summary: "Citizens expect order, but the city is stretching beyond it.",
          verdict: "The capital looks polished, but the cracks are widening underneath.",
        },
        "port-harcourt": {
          title: "Pollution is crushing legitimacy",
          body: "Oil-linked wealth still matters, but polluted corridors and distrust are undermining every public promise.",
          summary: "The city starts rich in potential and weak in confidence.",
          verdict: "People believe the city can pay for change; they do not yet believe it will.",
        },
        kano: {
          title: "Trade is strong, but systems are brittle",
          body: "Market depth is real, yet water pressure and weak industrial reliability are dragging on momentum.",
          summary: "Commerce wants to move faster than infrastructure allows.",
          verdict: "The city is productive, but one hard shock could stall it.",
        },
        maiduguri: {
          title: "Recovery is still unfinished",
          body: "Reconstruction pressure is colliding with service delivery gaps and fragile household confidence.",
          summary: "Every early choice will be judged through the lens of stability.",
          verdict: "This is a city asking for proof before trust.",
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
          verdict: "The city is watching whether growth will finally feel fair.",
        };
      }
      if (meta.region === "North East") {
        return {
          title: `${city.name} starts under resilience pressure`,
          body: "Service gaps and social strain mean basic stability matters as much as headline investment.",
          summary: "If systems wobble early, recovery gets harder.",
          verdict: "This city needs steadiness before spectacle.",
        };
      }
      if (meta.region === "North West") {
        return {
          title: `${city.name} needs stronger urban systems`,
          body: "Trade energy is present, but water security, roads, and trust are not strong enough for the next stage of growth.",
          summary: "Commercial momentum exists, but the urban backbone is thin.",
          verdict: "The city is ready to move if you can stop it from grinding itself down.",
        };
      }
      if (meta.region === "South West") {
        return {
          title: `${city.name} is feeling the cost of growth`,
          body: "Housing pressure and traffic are rising faster than service delivery, squeezing the city's most productive districts.",
          summary: "The engine is running, but the chassis is under stress.",
          verdict: "People can feel the upside of growth and the friction of it at the same time.",
        };
      }
      if (meta.region === "South East") {
        return {
          title: `${city.name} has talent but needs lift`,
          body: "Enterprise is strong, yet mobility and public systems are not keeping pace with economic ambition.",
          summary: "The city has energy, but not enough shared infrastructure.",
          verdict: "This city feels clever, restless, and underserved.",
        };
      }
      return {
        title: `${city.name} enters a fragile balance`,
        body: "The city has room to grow, but core systems are not yet strong enough to carry stress without consequences.",
        summary: `Your first round in ${meta.state} will set the tone for everything that follows.`,
        verdict: "The city is balanced on potential, not certainty.",
      };
    },
    cityCardClasses(cityId) {
      const isActive = cityId === this.activeCityId;
      return isActive
        ? "border-[#96c633] bg-[#dde7c9] text-[#395d0c]"
        : "border-[#4c4944] bg-[#282723] text-[#f3ede3] hover:border-[#77736a] hover:bg-[#2d2c28]";
    },
    cityStateClasses(cityId) {
      return cityId === this.activeCityId ? "text-[#567819]" : "text-[#a6a091]";
    },
    metricCardClasses(metric) {
      return metric.isDanger
        ? "border border-[#8f2b24] shadow-[0_0_0_1px_rgba(173,48,39,0.22)]"
        : "";
    },
    initiativeCardClasses(initiative) {
      return initiative.isSelected
        ? "border-[#9cca33] bg-[#dde7c9] text-[#f4f0e6]"
        : "border-[#4a4843] bg-card text-[#f4f0e6]";
    },
    initiativeToggleClasses(initiative) {
      if (initiative.isLocked) {
        return "border-[#5d3c39] bg-[#2a1d1c] text-[#c59b95] cursor-not-allowed";
      }
      return initiative.isSelected
        ? "border-[#9cca33] bg-[#dfe8c6] text-[#395d0c]"
        : "border-[#5c5a55] bg-transparent text-[#f3eee4]";
    },
    previewBadgeClasses(delta) {
      return delta >= 0 ? "bg-[#e4efcf] text-[#447313]" : "bg-[#f3dddd] text-[#b3362d]";
    },
    handleCityChange(cityId) {
      this.activeCityId = cityId;
      this.state = this.createState(cityId);
      this.displayedMetrics = { ...this.state.metrics };
      this.cityPickerOpen = false;
      this.applyCityTheme();
    },
    getInitiativePreview(initiative) {
      const selectedSet = this.state.selectedInitiatives.filter((id) => id !== initiative.id);
      const projectedEffects = createMetricDelta();
      selectedSet.forEach((id) => {
        const selectedInitiative = this.initiativeLibrary[id];
        if (selectedInitiative) {
          mergeEffects(projectedEffects, selectedInitiative.effects);
        }
      });
      mergeEffects(projectedEffects, initiative.effects);
      const metrics = Object.entries(projectedEffects)
        .filter(([, delta]) => delta !== 0)
        .map(([key, delta]) => ({
          key,
          label: shortMetricName(key),
          from: clampMetric(this.state.metrics[key] ?? 0),
          to: clampMetric((this.state.metrics[key] ?? 0) + delta),
          delta,
        }))
        .sort((left, right) => Math.abs(right.delta) - Math.abs(left.delta));
      const projectedBudget = clampMetric((this.state.metrics.budget ?? 0) + (projectedEffects.budget ?? 0));
      let budgetWarning = "";
      if (projectedBudget < 15) {
        budgetWarning = `Treasury danger: this package would leave only ₦${projectedBudget}B in budget.`;
      } else if (projectedBudget < 25) {
        budgetWarning = `Budget strain: this package drops the treasury to ₦${projectedBudget}B.`;
      }
      return { metrics, projectedBudget, budgetWarning };
    },
    getCurrentPackageProjection() {
      const effects = createMetricDelta();
      this.state.selectedInitiatives.forEach((id) => {
        const initiative = this.initiativeLibrary[id];
        if (initiative) {
          mergeEffects(effects, initiative.effects);
        }
      });
      const budget = clampMetric((this.state.metrics.budget ?? 0) + (effects.budget ?? 0));
      let warning = "";
      if (budget < 15) warning = "treasury danger";
      else if (budget < 25) warning = "budget strain";
      return { budget, warning };
    },
    toggleInitiative(id) {
      if (this.state.gameOver || (this.state.cooldowns[id] || 0) > 0) {
        return;
      }
      const isSelected = this.state.selectedInitiatives.includes(id);
      if (isSelected) {
        this.state.selectedInitiatives = this.state.selectedInitiatives.filter((entry) => entry !== id);
        return;
      }
      if (this.state.selectedInitiatives.length >= 2) {
        this.state.currentAlert = {
          title: "Planning cap reached",
          body: "You can only push two major initiatives in a single round.",
          summary: "Drop one selected initiative before adding another.",
        };
        return;
      }
      this.state.selectedInitiatives = [...this.state.selectedInitiatives, id];
    },
    updateCooldowns(usedInitiatives) {
      const nextCooldowns = {};
      Object.entries(this.state.cooldowns).forEach(([id, turns]) => {
        const nextValue = turns - 1;
        if (nextValue > 0) nextCooldowns[id] = nextValue;
      });
      usedInitiatives.forEach((id) => {
        const initiative = this.initiativeLibrary[id];
        if (initiative) {
          nextCooldowns[id] = initiative.cost >= 14 ? 2 : 1;
        }
      });
      this.state.cooldowns = nextCooldowns;
    },
    applyEffectsToState(effects, deltaTrackers = []) {
      Object.entries(effects).forEach(([key, value]) => {
        if (typeof this.state.metrics[key] !== "number") {
          this.state.metrics[key] = 50;
        }
        this.state.metrics[key] += value;
        deltaTrackers.forEach((tracker) => {
          if (typeof tracker[key] !== "number") tracker[key] = 0;
          tracker[key] += value;
        });
      });
    },
    applyConditionalEffects(conditionalEffects, deltaTrackers = []) {
      for (const condition of conditionalEffects) {
        if (!condition.metric) {
          this.applyEffectsToState(condition.effects || {}, deltaTrackers);
          return;
        }
        const metricValue = this.state.metrics[condition.metric] ?? 0;
        if (this.matchesCondition(metricValue, condition.operator, condition.value)) {
          this.applyEffectsToState(condition.effects || {}, deltaTrackers);
          return;
        }
      }
    },
    matchesCondition(metricValue, operator, expectedValue) {
      switch (operator) {
        case "<": return metricValue < expectedValue;
        case "<=": return metricValue <= expectedValue;
        case ">": return metricValue > expectedValue;
        case ">=": return metricValue >= expectedValue;
        case "===": return metricValue === expectedValue;
        default: return false;
      }
    },
    applyPassiveDrift(roundDelta) {
      const drift = this.activeCity.drift || {};
      this.applyEffectsToState(drift, [roundDelta]);
    },
    rollEvent() {
      let pool = this.activeCity.events
        .map((id) => (this.eventLibrary[id] ? { id, ...this.eventLibrary[id] } : null))
        .filter(Boolean)
        .filter((event) => !this.state.usedEvents.includes(event.id));
      if (pool.length === 0) {
        this.state.usedEvents = [];
        pool = this.activeCity.events
          .map((id) => (this.eventLibrary[id] ? { id, ...this.eventLibrary[id] } : null))
          .filter(Boolean);
      }
      const event = pool[Math.floor(Math.random() * pool.length)];
      if (event) this.state.usedEvents.push(event.id);
      return event;
    },
    normaliseMetrics() {
      Object.keys(this.state.metrics).forEach((key) => {
        if (key === "budget") {
          this.state.metrics[key] = Math.max(0, Math.min(this.state.metrics[key], 100));
          return;
        }
        this.state.metrics[key] = clampMetric(this.state.metrics[key]);
      });
    },
    buildDeltaSummary(delta) {
      const parts = Object.entries(delta)
        .filter(([, value]) => value !== 0)
        .map(([key, value]) => `${prettyMetricName(key)} ${value > 0 ? "+" : ""}${value}`);
      return parts.length > 0 ? `${parts.join(", ")}.` : "No measurable shift this round.";
    },
    buildVerdict(roundDelta, metrics) {
      const positives = ["economy", "jobs", "trust", "resilience"].filter((key) => roundDelta[key] > 0);
      const negatives = ["mobility", "housing", "environment", "budget", "trust", "resilience"].filter((key) => roundDelta[key] < 0);
      if (metrics.trust < 30) return "The city mood is souring fast, and patience is running out.";
      if (metrics.budget < 25) return "The city is still functioning, but the treasury is starting to look nervous.";
      if (metrics.resilience < 30 || metrics.environment < 30) return "Growth is no longer the story; fragility is.";
      if (positives.length >= 3 && negatives.length === 0) return "For the first time in a while, the city feels like it is on your side.";
      if (positives.length >= 2 && negatives.length >= 2) return "Progress landed, but it came with visible bruises.";
      if (positives.length === 0 && negatives.length >= 2) return "This round felt like the city pushing back.";
      return "The city is moving, but not yet in one clear direction.";
    },
    buildLegacyVerdict(metrics) {
      const score = this.calculateScore(metrics);
      if (score >= 72) return "History remembers your term as the moment the city found its footing.";
      if (score >= 58) return "History remembers a mixed legacy: steadier systems, unfinished promises.";
      if (metrics.trust < 35 || metrics.budget < 20) return "History remembers a city that survived you, not because of you.";
      return "History remembers ambition, but not enough balance to sustain it.";
    },
    findStrongestMetrics(metrics) {
      return [...TRACKED_METRICS].sort((left, right) => clampMetric(metrics[right]) - clampMetric(metrics[left])).slice(0, 2);
    },
    findWeakestMetrics(metrics) {
      return [...TRACKED_METRICS].sort((left, right) => clampMetric(metrics[left]) - clampMetric(metrics[right])).slice(0, 2);
    },
    calculateScore(metrics) {
      const total = TRACKED_METRICS.reduce((sum, key) => sum + clampMetric(metrics[key]), 0);
      return Math.round(total / TRACKED_METRICS.length);
    },
    buildLegacyBullets() {
      const strong = this.findStrongestMetrics(this.state.metrics);
      const weak = this.findWeakestMetrics(this.state.metrics);
      const initiativeCounts = {};
      this.state.roundLog.forEach((entry) => {
        entry.initiatives.forEach((title) => {
          initiativeCounts[title] = (initiativeCounts[title] || 0) + 1;
        });
      });
      const signatureMove = Object.entries(initiativeCounts).sort((left, right) => right[1] - left[1])[0]?.[0];
      const bullets = [
        `${this.activeCity.name} finished with its strongest footing in ${strong.map(prettyMetricName).join(" and ")}.`,
        `The administration never fully solved ${weak.map(prettyMetricName).join(" and ")}.`,
        signatureMove
          ? `Your signature play became ${signatureMove.toLowerCase()}, a move the city came to associate with your term.`
          : "Your term was defined more by pressure management than by one signature project.",
      ];
      if (this.state.metrics.trust >= 65) bullets.push("Citizens leave your era with more confidence in the city than they had at the start.");
      else if (this.state.metrics.trust < 40) bullets.push("Even where conditions improved, public faith in leadership never fully recovered.");
      return bullets;
    },
    buildHistoryMemory(score, metrics) {
      if (score >= 75) return "As a reform era that made competence visible in everyday life.";
      if (score >= 60) return "As a stabilizing term that improved some systems but left hard trade-offs unresolved.";
      if (metrics.trust < 40) return "As an era of strained legitimacy, where progress never fully convinced the public.";
      return "As a difficult term that promised more balance than it ultimately delivered.";
    },
    buildNewspaperHeadline(cityName, score) {
      if (score >= 75) return `${cityName} Finds Its Footing`;
      if (score >= 60) return `${cityName} Ends On A Narrow Gain`;
      if (score >= 45) return `${cityName} Leaves A Divided Ledger`;
      return `${cityName} Staggers To The Finish`;
    },
    animateMetrics(fromMetrics, toMetrics) {
      if (this.animationFrameId) {
        cancelAnimationFrame(this.animationFrameId);
      }
      const start = performance.now();
      const duration = 850;
      this.displayedMetrics = { ...fromMetrics };
      const step = (now) => {
        const progress = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - progress, 4);
        this.displayedMetrics = TRACKED_METRICS.reduce((accumulator, key) => {
          const fromValue = fromMetrics[key] ?? 0;
          const toValue = toMetrics[key] ?? 0;
          accumulator[key] = Math.round(fromValue + (toValue - fromValue) * eased);
          return accumulator;
        }, {});
        if (progress < 1) {
          this.animationFrameId = requestAnimationFrame(step);
        } else {
          this.displayedMetrics = { ...toMetrics };
          this.animationFrameId = null;
        }
      };
      this.animationFrameId = requestAnimationFrame(step);
    },
    triggerScreenFlash(color) {
      this.flashOverlay = `radial-gradient(circle at center, ${color}, transparent 68%)`;
      this.flashActive = false;
      requestAnimationFrame(() => {
        this.flashActive = true;
        window.setTimeout(() => {
          this.flashActive = false;
        }, 850);
      });
    },
    async shareResult(mode) {
      const text = this.buildShareText(mode);
      if (navigator.share) {
        try {
          await navigator.share({ title: "Build Naija", text });
          return;
        } catch (error) {
          if (error && error.name === "AbortError") {
            return;
          }
        }
      }
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        this.state.currentAlert = {
          title: "Scorecard copied",
          body: "Your Build Naija result is now in the clipboard, ready for Twitter or WhatsApp.",
          summary: text,
        };
        return;
      }
      window.prompt("Copy your result", text);
    },
    buildShareText(mode) {
      if (mode === "receivership") {
        return `Build Naija: I drove ${this.activeCity.name} into federal receivership. Final score ${this.finalScore}/100. Budget ${clampMetric(this.state.metrics.budget)}, Trust ${clampMetric(this.state.metrics.trust)}.`;
      }
      return `Build Naija: I finished a ${TOTAL_ROUNDS}-round term in ${this.activeCity.name} with score ${this.finalScore}/100. Strongest systems: ${this.legacyStrongest.map(prettyMetricName).join(" and ")}. Weakest: ${this.legacyWeakest.map(prettyMetricName).join(" and ")}.`;
    },
    advanceRound() {
      if (this.state.gameOver) {
        return;
      }
      const previousMetrics = { ...this.state.metrics };
      const roundDelta = createMetricDelta();
      let alert = {
        title: "Round review",
        body: "Your planning package lands across the city.",
        summary: "Momentum shifts, but not every system moves in the same direction.",
      };
      let flashColor = null;
      if (this.state.selectedInitiatives.length === 0) {
        this.applyEffectsToState({ trust: -3, economy: -2 }, [roundDelta]);
        alert = {
          title: "A quiet round costs momentum",
          body: "Holding back preserves options, but people and businesses notice when the agenda slows.",
          summary: "Trust -3, Economy -2.",
        };
      }
      this.state.selectedInitiatives
        .map((id) => this.initiativeLibrary[id])
        .filter(Boolean)
        .forEach((initiative) => {
          this.applyEffectsToState(initiative.effects, [roundDelta]);
        });
      this.applyPassiveDrift(roundDelta);
      const event = this.rollEvent();
      if (event) {
        const eventDelta = createMetricDelta();
        this.applyConditionalEffects(event.conditionalEffects || [], [roundDelta, eventDelta]);
        this.applyEffectsToState(event.effects || {}, [roundDelta, eventDelta]);
        alert = {
          title: event.title,
          body: event.body,
          summary: this.buildDeltaSummary(eventDelta),
        };
        flashColor = EVENT_FLASHES[event.id] || null;
      }
      this.normaliseMetrics();
      this.state.lastRoundDelta = roundDelta;
      this.state.currentAlert = alert;
      this.state.currentVerdict = this.buildVerdict(roundDelta, this.state.metrics);
      this.updateCooldowns(this.state.selectedInitiatives);
      this.state.roundLog.push({
        round: this.state.round,
        initiatives: this.state.selectedInitiatives.map((id) => this.initiativeLibrary[id]?.title).filter(Boolean),
        alert,
        verdict: this.state.currentVerdict,
        delta: { ...roundDelta },
        metrics: { ...this.state.metrics },
      });
      this.state.selectedInitiatives = [];
      if (this.state.metrics.budget <= 0) {
        this.state.gameOver = true;
        this.state.endMode = "receivership";
        this.state.currentAlert = {
          title: "Federal receivership",
          body: `${this.activeCity.name} has run out of money. The federal government has stepped in to manage the city's finances.`,
          summary: "Debt has become the story. Control has slipped out of your hands.",
        };
        this.state.currentVerdict = "History records the collapse as a failure of restraint.";
        flashColor = "rgba(95, 20, 20, 0.48)";
      } else if (this.state.round >= TOTAL_ROUNDS) {
        this.state.gameOver = true;
        this.state.endMode = "legacy";
        this.state.currentAlert = {
          title: "Campaign complete",
          body: `You guided ${this.activeCity.name} through ${TOTAL_ROUNDS} rounds of trade-offs and pressure.`,
          summary: `Final balance score ${this.finalScore}/100.`,
        };
        this.state.currentVerdict = this.buildLegacyVerdict(this.state.metrics);
      } else {
        this.state.round += 1;
      }
      if (flashColor) {
        this.triggerScreenFlash(flashColor);
      }
      this.animateMetrics(previousMetrics, this.state.metrics);
    },
  },
  async mounted() {
    try {
      await this.initialize();
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
  },
  template: `
    <div v-if="state" class="min-h-screen pb-28">
      <div
        class="pointer-events-none fixed inset-0 z-40 opacity-0"
        :class="{ 'screen-flash': flashActive }"
        :style="{ background: flashOverlay }"
      ></div>

      <header class="border-b border-line bg-[#32312d]">
        <div class="mx-auto flex w-[min(1360px,calc(100vw-1.5rem))] flex-col gap-4 px-2 py-5 md:flex-row md:items-center md:justify-between">
          <div class="flex items-center gap-4">
            <h1 class="font-display text-4xl font-semibold tracking-[-0.02em] text-[#f7f3eb]">
              Build <span class="text-green">Naija</span>
            </h1>
            <button
              type="button"
              class="hidden items-center gap-3 rounded-full border border-line bg-[#272622] px-4 py-2 text-left text-sm text-[#d3cec3] transition hover:border-[#7a776f] hover:bg-[#2d2c28] md:flex"
              @click="cityPickerOpen = true"
            >
              <span class="text-xs uppercase tracking-[0.18em] text-[#a29d94]">City</span>
              <span class="font-semibold text-[#f3ede3]">{{ activeCity.name }} · {{ activeMeta.state }}</span>
            </button>
          </div>
          <div class="flex items-center gap-3">
            <button
              type="button"
              class="flex items-center gap-2 rounded-full border border-line bg-[#272622] px-4 py-2 text-sm text-[#d3cec3] md:hidden"
              @click="cityPickerOpen = true"
            >
              <span class="text-xs uppercase tracking-[0.18em] text-[#a29d94]">City</span>
              <span class="font-semibold text-[#f3ede3]">{{ activeCity.name }}</span>
            </button>
            <button
              type="button"
              class="rounded-full border border-line bg-[#272622] px-4 py-2 text-sm font-semibold text-[#d7d1c6] transition hover:border-[#7a776f] hover:bg-[#2d2c28]"
              @click="historyVisible = !historyVisible"
            >
              History
            </button>
            <div class="rounded-full border border-line bg-[#272622] px-6 py-2 text-[0.95rem] font-semibold leading-tight text-[#d7d1c6]">
              {{ roundLabel }}
            </div>
          </div>
        </div>
      </header>

      <section v-if="cityPickerOpen" class="relative z-20 border-b border-line bg-[#1f1e1b]">
        <div class="mx-auto w-[min(1360px,calc(100vw-1.5rem))] px-2 py-5">
          <div class="mb-4 flex items-center justify-between gap-4">
            <div>
              <p class="text-xs font-extrabold uppercase tracking-[0.18em] text-[#a29d94]">Choose City</p>
              <p class="mt-1 text-lg font-semibold text-[#f3ede3]">Browse by geopolitical zone, not a flat list.</p>
            </div>
            <button type="button" class="rounded-full border border-line px-4 py-2 text-sm font-semibold text-[#d7d1c6]" @click="cityPickerOpen = false">Close</button>
          </div>
          <div class="grid gap-4 lg:grid-cols-3">
            <section
              v-for="group in groupedCities"
              :key="group.region"
              class="rounded-[1.35rem] border border-[#403d39] bg-[#252420] p-4"
            >
              <p class="mb-3 text-xs font-extrabold uppercase tracking-[0.18em] text-[#9b9488]">{{ group.region }}</p>
              <div class="grid gap-3">
                <button
                  v-for="city in group.cities"
                  :key="city.id"
                  type="button"
                  class="flex items-center justify-between rounded-2xl border px-4 py-3 text-left transition"
                  :class="cityCardClasses(city.id)"
                  @click="handleCityChange(city.id)"
                >
                  <span>
                    <span class="block text-base font-semibold">{{ city.name }}</span>
                    <span class="mt-1 block text-xs uppercase tracking-[0.14em]" :class="cityStateClasses(city.id)">{{ getCityMeta(city.id).state }}</span>
                  </span>
                  <span class="text-xs font-bold" :class="cityStateClasses(city.id)">{{ calculateScore(city.metrics) }}/100</span>
                </button>
              </div>
            </section>
          </div>
        </div>
      </section>

      <main class="relative z-10 mx-auto w-[min(1360px,calc(100vw-1.5rem))] px-2 py-7">
        <section class="mb-8">
          <div class="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div class="max-w-3xl">
              <p class="mb-3 text-sm uppercase tracking-[0.2em] text-[#8d877c]">{{ activeMeta.state }} · {{ activeMeta.region }} · {{ activeCity.resources.join(' · ') }}</p>
              <h2 class="font-display text-6xl font-semibold leading-none text-[#f7f3eb] md:text-7xl">{{ activeCity.name }}</h2>
              <p class="mt-4 max-w-2xl text-xl font-semibold leading-[1.45] text-[#d6d0c5]">{{ activeCity.summary }}</p>
            </div>
            <div class="flex flex-wrap items-center gap-3">
              <div class="rounded-full px-8 py-3 text-xl font-semibold" :style="{ backgroundColor: currentTheme.soft, color: currentTheme.accent }">
                ₦{{ clampMetric(state.metrics.budget) }}B budget
              </div>
            </div>
          </div>
        </section>

        <section class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <article
            v-for="metric in renderedMetrics"
            :key="metric.key"
            class="rounded-[1.35rem] bg-card px-6 py-5"
            :class="metricCardClasses(metric)"
          >
            <p class="text-[1.05rem] font-semibold uppercase tracking-[0.05em] text-[#cfc8bc]">{{ metric.label }}</p>
            <p class="mt-1 text-5xl font-semibold leading-none text-[#f7f3eb]">{{ metric.value }}</p>
            <div class="mt-5 h-1.5 overflow-hidden rounded-full bg-[#4e4b46]">
              <div class="h-full" :class="metric.barClass" :style="{ width: metricBarWidth(metric.value) }"></div>
            </div>
            <p class="mt-4 text-[0.95rem] font-semibold" :class="metric.deltaClass">{{ metric.deltaPrefix }}{{ metric.delta }} this round</p>
            <p v-if="metric.isDanger" class="mt-3 text-[0.82rem] font-bold uppercase tracking-[0.14em] text-[#ff8a7b]">Critical pressure</p>
          </article>
        </section>

        <section
          class="banner-pop mt-8 rounded-3xl border px-8 py-6"
          :style="{ backgroundColor: currentTheme.eventBg, borderColor: currentTheme.eventBorder, color: currentTheme.eventText }"
        >
          <div class="flex gap-4">
            <div class="pt-1 text-4xl text-[#e29a00]">⚡</div>
            <div>
              <p class="text-[0.82rem] font-extrabold uppercase tracking-[0.18em] opacity-70">City event</p>
              <h3 class="mt-1 text-3xl font-extrabold leading-tight">{{ state.currentAlert.title }}</h3>
              <p class="mt-3 text-[1.08rem] font-medium leading-8">{{ state.currentAlert.body }}</p>
              <p class="mt-2 text-[1.08rem] font-semibold leading-8">{{ state.currentAlert.summary }}</p>
            </div>
          </div>
        </section>

        <section class="mt-5">
          <p class="text-sm uppercase tracking-[0.22em] text-[#958f84]">Round verdict</p>
          <p class="mt-2 text-2xl font-semibold leading-tight text-[#f0eadf]">{{ state.currentVerdict }}</p>
        </section>

        <section v-if="historyVisible && recentHistory.length > 0" class="mt-8 rounded-[1.6rem] border border-[#3e3c37] bg-[#1e1d1a] px-6 py-5">
          <div class="mb-4 flex items-center justify-between gap-4">
            <div>
              <p class="text-xs font-extrabold uppercase tracking-[0.18em] text-[#989286]">Round history</p>
              <p class="mt-1 text-lg font-semibold text-[#f3ede3]">A scannable record of what you did and what happened.</p>
            </div>
            <button type="button" class="rounded-full border border-[#55524d] px-4 py-2 text-sm font-semibold text-[#d8d1c5]" @click="historyVisible = false">Hide</button>
          </div>
          <div class="grid gap-3 lg:grid-cols-2">
            <article v-for="entry in recentHistory" :key="entry.round" class="rounded-[1.2rem] border border-[#403d39] bg-[#252420] p-4">
              <div class="flex items-center justify-between gap-3">
                <p class="text-xs font-extrabold uppercase tracking-[0.18em] text-[#9b9488]">Round {{ entry.round }}</p>
                <p class="text-xs font-semibold text-[#b7b0a4]">{{ entry.initiatives.length }} initiative{{ entry.initiatives.length === 1 ? '' : 's' }}</p>
              </div>
              <p class="mt-2 text-lg font-semibold text-[#f3ede3]">{{ entry.alert.title }}</p>
              <p class="mt-2 text-sm leading-7 text-[#cbc4b8]">{{ entry.verdict }}</p>
              <p class="mt-3 text-xs uppercase tracking-[0.14em] text-[#8f887d]">{{ entry.initiatives.length > 0 ? entry.initiatives.join(' · ') : 'No initiatives selected' }}</p>
            </article>
          </div>
        </section>

        <section v-if="!state.gameOver" class="mt-8">
          <div class="mb-5 border-b border-[#d7d1c6] pb-4">
            <p class="text-2xl font-extrabold uppercase tracking-[0.08em] text-[#ddd6ca]">
              Choose Your Initiatives <span class="text-[#b4aea2]">- Pick Up To 2</span>
            </p>
          </div>
          <div class="grid gap-4 xl:grid-cols-2">
            <article
              v-for="initiative in visibleInitiatives"
              :key="initiative.id"
              class="flex min-h-[212px] flex-col justify-between rounded-[1.35rem] border px-6 py-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]"
              :class="initiativeCardClasses(initiative)"
            >
              <div>
                <div class="mb-3 flex items-start justify-between gap-4">
                  <div>
                    <h3 class="text-[2rem] font-semibold leading-tight text-[#f7f3eb]">{{ initiative.title }}</h3>
                  </div>
                  <button
                    type="button"
                    class="rounded-full border px-4 py-2 text-sm font-bold transition hover:-translate-y-0.5"
                    :class="initiativeToggleClasses(initiative)"
                    :disabled="initiative.isLocked"
                    @click="toggleInitiative(initiative.id)"
                  >
                    {{ initiative.isLocked ? 'Locked ' + initiative.cooldown : initiative.isSelected ? 'Selected' : 'Select' }}
                  </button>
                </div>
                <p class="max-w-3xl text-[1.05rem] font-medium leading-9 text-[#c8c2b6]">{{ initiative.description }}</p>
                <div class="mt-4">
                  <p class="text-[0.76rem] font-extrabold uppercase tracking-[0.16em] text-[#a9a296]">Projected if chosen</p>
                  <div class="mt-2 flex flex-wrap gap-2">
                    <span
                      v-for="metric in initiative.preview.metrics"
                      :key="initiative.id + '-' + metric.key"
                      class="rounded-full px-3 py-1.5 text-[0.92rem] font-semibold"
                      :class="previewBadgeClasses(metric.delta)"
                    >
                      {{ metric.label }} {{ metric.from }}→{{ metric.to }}
                    </span>
                  </div>
                  <p v-if="initiative.isLocked" class="mt-3 text-sm font-semibold text-[#d39e97]">Cooldown active. Available in {{ initiative.cooldown }} {{ initiative.cooldown === 1 ? 'round' : 'rounds' }}.</p>
                  <p v-else-if="initiative.preview.budgetWarning" class="mt-3 text-sm font-semibold text-[#ffb372]">{{ initiative.preview.budgetWarning }}</p>
                </div>
              </div>
              <div class="mt-6 flex flex-wrap items-center justify-between gap-3">
                <span class="rounded-full bg-[#f1dfd8] px-4 py-2 text-[0.95rem] font-bold text-[#a84b22]">₦{{ initiative.cost }}B</span>
                <div class="flex flex-wrap items-center gap-2">
                  <span v-for="badge in initiative.positiveBadges" :key="initiative.id + '-pos-' + badge" class="rounded-full bg-[#e4efcf] px-3 py-1.5 text-[0.95rem] font-semibold text-[#447313]">{{ badge }}</span>
                  <span v-for="badge in initiative.negativeBadges" :key="initiative.id + '-neg-' + badge" class="rounded-full bg-[#f3dddd] px-3 py-1.5 text-[0.95rem] font-semibold text-[#b3362d]">{{ badge }}</span>
                </div>
              </div>
            </article>
          </div>
        </section>

        <section v-if="state.gameOver" class="mt-10">
          <article v-if="state.endMode === 'receivership'" class="overflow-hidden rounded-[2rem] border border-[#6a2623] bg-[linear-gradient(180deg,#220d0d,#120909)] text-[#f6e9e3] shadow-[0_28px_80px_rgba(0,0,0,0.45)]">
            <div class="border-b border-[#5b2623] bg-[#2b1111] px-8 py-6 md:px-10">
              <p class="text-xs font-extrabold uppercase tracking-[0.28em] text-[#db8e86]">Federal emergency notice</p>
              <h3 class="mt-3 font-display text-6xl font-semibold leading-none md:text-7xl">Receivership In {{ activeCity.name }}</h3>
              <p class="mt-4 max-w-4xl text-xl font-semibold leading-9 text-[#f0cbc5]">The city treasury has failed. Abuja has suspended local financial control and moved in to stabilize essential services.</p>
              <button type="button" class="mt-5 rounded-full border border-[#7c3733] bg-[#341716] px-4 py-2 text-sm font-bold text-[#f2d6d2] transition hover:bg-[#41201f]" @click="shareResult('receivership')">Share result</button>
            </div>
            <div class="grid gap-8 px-8 py-8 md:px-10 lg:grid-cols-[1.15fr_0.85fr]">
              <div>
                <div class="rounded-[1.5rem] border border-[#5d2522] bg-[#1a0d0d] p-6">
                  <p class="text-xs font-extrabold uppercase tracking-[0.18em] text-[#d6897f]">Official finding</p>
                  <p class="mt-4 text-2xl font-semibold leading-10 text-[#f7e8e2]">{{ state.currentVerdict }}</p>
                  <p class="mt-4 text-lg leading-8 text-[#d8b6b0]">{{ activeCity.name }}, {{ activeMeta.state }} will be remembered for collapsing under the weight of {{ legacyWeakest.map(prettyMetricName).join(' and ') }} before its growth story could hold.</p>
                </div>
                <div class="mt-6 rounded-[1.5rem] border border-[#5d2522] bg-[#1a0d0d] p-6">
                  <p class="text-xs font-extrabold uppercase tracking-[0.18em] text-[#d6897f]">What triggered the takeover</p>
                  <ul class="mt-4 space-y-3 text-lg leading-8 text-[#f0cbc5]">
                    <li>• Budget fell to {{ clampMetric(state.metrics.budget) }}, leaving almost no room to govern.</li>
                    <li>• Public trust closed at {{ clampMetric(state.metrics.trust) }}, weakening political legitimacy.</li>
                    <li>• The city ended with acute stress in {{ legacyWeakest.map(prettyMetricName).join(' and ') }}.</li>
                  </ul>
                </div>
              </div>
              <div class="space-y-4">
                <div class="rounded-[1.5rem] border border-[#5d2522] bg-[#1a0d0d] p-6">
                  <p class="text-xs font-extrabold uppercase tracking-[0.18em] text-[#d6897f]">Final distress ledger</p>
                  <div class="mt-4 space-y-3">
                    <div v-for="metric in renderedMetrics" :key="'end-' + metric.key" class="flex items-center justify-between border-b border-[#3a1b1a] pb-2 text-lg last:border-b-0">
                      <span>{{ metric.label }}</span>
                      <strong>{{ clampMetric(state.metrics[metric.key]) }}</strong>
                    </div>
                  </div>
                </div>
                <div class="rounded-[1.5rem] border border-[#5d2522] bg-[#1a0d0d] p-6">
                  <p class="text-xs font-extrabold uppercase tracking-[0.18em] text-[#d6897f]">Last rounds before collapse</p>
                  <div class="mt-4 space-y-4">
                    <div v-for="entry in recentHistory.slice(0, 3)" :key="'collapse-' + entry.round" class="border-l-2 border-[#8a3330] pl-4">
                      <p class="text-sm font-extrabold uppercase tracking-[0.14em] text-[#d6897f]">Round {{ entry.round }}</p>
                      <p class="mt-1 text-lg font-semibold text-[#f7e8e2]">{{ entry.alert.title }}</p>
                      <p class="mt-1 text-sm leading-7 text-[#d8b6b0]">{{ entry.verdict }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </article>

          <article v-else class="overflow-hidden rounded-[2rem] border border-[#d1c3aa] bg-[#f3ead7] text-[#30261a] shadow-[0_28px_80px_rgba(0,0,0,0.35)]">
            <div class="border-b border-[#cfb98f] bg-[#efe2c8] px-8 py-6 md:px-10">
              <div class="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                  <p class="text-xs font-extrabold uppercase tracking-[0.28em] text-[#7f5f2b]">The Build Naija Times</p>
                  <h3 class="mt-2 font-display text-6xl font-semibold leading-none md:text-7xl">{{ endHeadline }}</h3>
                  <p class="mt-3 text-sm font-semibold uppercase tracking-[0.16em] text-[#7b6a53]">{{ activeCity.name }}, {{ activeMeta.state }} · Final edition · {{ startYear + totalRounds - 1 }}</p>
                </div>
                <div class="rounded-[1.4rem] border border-[#cfb98f] bg-[#fbf4e7] px-6 py-4 text-right">
                  <p class="text-xs font-extrabold uppercase tracking-[0.2em] text-[#7f5f2b]">Civic grade</p>
                  <p class="mt-1 font-display text-6xl leading-none">{{ endGrade }}</p>
                  <p class="mt-2 text-lg font-semibold">Score {{ finalScore }}/100</p>
                  <button type="button" class="mt-4 rounded-full border border-[#cfb98f] bg-[#efe2c8] px-4 py-2 text-sm font-bold text-[#6e542a] transition hover:bg-[#ead9bb]" @click="shareResult('legacy')">Share result</button>
                </div>
              </div>
            </div>
            <div class="grid gap-8 px-8 py-8 md:px-10 lg:grid-cols-[1.2fr_0.8fr]">
              <div>
                <p class="text-2xl font-semibold leading-10 text-[#4a3c29]">{{ state.currentVerdict }}</p>
                <div class="mt-8 grid gap-4 md:grid-cols-3">
                  <div class="rounded-[1.3rem] border border-[#d8c6a4] bg-[#fbf4e7] p-5">
                    <p class="text-xs font-extrabold uppercase tracking-[0.18em] text-[#7f5f2b]">History says</p>
                    <p class="mt-3 text-lg font-semibold leading-8">{{ buildHistoryMemory(finalScore, state.metrics) }}</p>
                  </div>
                  <div class="rounded-[1.3rem] border border-[#d8c6a4] bg-[#fbf4e7] p-5">
                    <p class="text-xs font-extrabold uppercase tracking-[0.18em] text-[#7f5f2b]">You built up</p>
                    <p class="mt-3 text-lg font-semibold leading-8">{{ legacyStrongest.map(prettyMetricName).join(' and ') }}</p>
                  </div>
                  <div class="rounded-[1.3rem] border border-[#d8c6a4] bg-[#fbf4e7] p-5">
                    <p class="text-xs font-extrabold uppercase tracking-[0.18em] text-[#7f5f2b]">You neglected</p>
                    <p class="mt-3 text-lg font-semibold leading-8">{{ legacyWeakest.map(prettyMetricName).join(' and ') }}</p>
                  </div>
                </div>
                <div class="mt-8 rounded-[1.5rem] border border-[#d8c6a4] bg-[#fbf4e7] p-6">
                  <p class="text-xs font-extrabold uppercase tracking-[0.18em] text-[#7f5f2b]">Legacy summary</p>
                  <ul class="mt-4 space-y-3 text-lg leading-8 text-[#443724]">
                    <li v-for="bullet in legacyBullets" :key="bullet">• {{ bullet }}</li>
                  </ul>
                </div>
              </div>
              <div class="space-y-4">
                <div class="rounded-[1.5rem] border border-[#d8c6a4] bg-[#fbf4e7] p-6">
                  <p class="text-xs font-extrabold uppercase tracking-[0.18em] text-[#7f5f2b]">Final city ledger</p>
                  <div class="mt-4 space-y-3">
                    <div v-for="metric in renderedMetrics" :key="'ledger-' + metric.key" class="flex items-center justify-between border-b border-[#eadbc0] pb-2 text-lg last:border-b-0">
                      <span>{{ metric.label }}</span>
                      <strong>{{ clampMetric(state.metrics[metric.key]) }}</strong>
                    </div>
                  </div>
                </div>
                <div class="rounded-[1.5rem] border border-[#d8c6a4] bg-[#fbf4e7] p-6">
                  <p class="text-xs font-extrabold uppercase tracking-[0.18em] text-[#7f5f2b]">Key moments</p>
                  <div class="mt-4 space-y-4">
                    <div v-for="entry in recentHistory.slice(0, 4)" :key="'legacy-' + entry.round" class="border-l-2 border-[#b48d3f] pl-4">
                      <p class="text-sm font-extrabold uppercase tracking-[0.14em] text-[#8a6c39]">Round {{ entry.round }}</p>
                      <p class="mt-1 text-lg font-semibold">{{ entry.alert.title }}</p>
                      <p class="mt-1 text-sm leading-7 text-[#5d4d37]">{{ entry.verdict }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </article>
        </section>
      </main>

      <footer v-if="!state.gameOver" class="fixed bottom-0 left-0 right-0 border-t border-line bg-[#32312d]/95 backdrop-blur">
        <div class="mx-auto flex w-[min(1440px,100vw)] items-center justify-between gap-4 px-6 py-5">
          <div>
            <p class="text-lg font-semibold text-[#e6dfd2]">{{ selectionStatus }}</p>
          </div>
          <button
            type="button"
            class="rounded-3xl border border-[#6c6a65] bg-transparent px-10 py-4 text-2xl font-semibold text-[#faf7f1] transition hover:border-[#908d86] hover:bg-[#3a3935] disabled:cursor-not-allowed disabled:opacity-50"
            :disabled="state.gameOver"
            @click="advanceRound"
          >
            {{ state.gameOver ? 'Campaign complete' : 'End round ↗' }}
          </button>
        </div>
      </footer>
    </div>
  `,
}).mount("#app");
