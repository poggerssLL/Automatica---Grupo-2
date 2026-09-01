"use strict";

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initMenu();
  initHeader();
  initReveal();
  initTableTabs();
  initSlideDeck();
  initSimulator();
});

function initTheme() {
  const root = document.documentElement;
  const button = document.querySelector("[data-theme-toggle]");
  const icon = document.querySelector("[data-theme-icon]");
  const saved = localStorage.getItem("aqua-index-theme");
  const preferred = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  const theme = saved || preferred;

  root.dataset.theme = theme;
  if (icon) icon.textContent = theme === "dark" ? "☀" : "◐";

  button?.addEventListener("click", () => {
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    localStorage.setItem("aqua-index-theme", next);
    if (icon) icon.textContent = next === "dark" ? "☀" : "◐";
  });
}

function initMenu() {
  const button = document.querySelector("[data-menu-toggle]");
  const nav = document.getElementById("main-nav");
  if (!button || !nav) return;

  button.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    button.setAttribute("aria-expanded", String(open));
  });

  nav.addEventListener("click", event => {
    if (event.target.closest("a")) {
      nav.classList.remove("open");
      button.setAttribute("aria-expanded", "false");
    }
  });
}

function initHeader() {
  const header = document.querySelector("[data-header]");
  if (!header) return;
  const update = () => header.classList.toggle("scrolled", window.scrollY > 12);
  update();
  window.addEventListener("scroll", update, { passive: true });
}

function initReveal() {
  const elements = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    elements.forEach(element => element.classList.add("visible"));
    return;
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  elements.forEach(element => observer.observe(element));
}

function initTableTabs() {
  document.querySelectorAll("[data-table-tabs]").forEach(group => {
    const buttons = [...group.querySelectorAll("[data-tab-target]")];
    const panels = [...group.querySelectorAll(".tab-panel")];

    buttons.forEach(button => {
      button.addEventListener("click", () => {
        buttons.forEach(item => {
          const active = item === button;
          item.classList.toggle("active", active);
          item.setAttribute("aria-selected", String(active));
        });
        panels.forEach(panel => panel.classList.toggle("active", panel.id === button.dataset.tabTarget));
      });
    });
  });
}

function initSlideDeck() {
  const deck = document.querySelector("[data-slide-deck]");
  if (!deck) return;

  const slides = [...deck.querySelectorAll("[data-slide]")];
  const previous = deck.querySelector("[data-slide-prev]");
  const next = deck.querySelector("[data-slide-next]");
  const counter = deck.querySelector("[data-slide-counter]");
  const dots = deck.querySelector("[data-slide-dots]");
  let current = 0;

  slides.forEach((_, index) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.setAttribute("aria-label", `Ir para o quadro ${index + 1}`);
    dot.addEventListener("click", () => show(index));
    dots?.appendChild(dot);
  });

  function show(index) {
    current = Math.max(0, Math.min(slides.length - 1, index));
    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle("active", slideIndex === current);
      slide.setAttribute("aria-hidden", String(slideIndex !== current));
    });
    [...(dots?.children || [])].forEach((dot, dotIndex) => dot.classList.toggle("active", dotIndex === current));
    if (counter) counter.textContent = `${String(current + 1).padStart(2, "0")} / ${String(slides.length).padStart(2, "0")}`;
    if (previous) previous.disabled = current === 0;
    if (next) next.disabled = current === slides.length - 1;
  }

  previous?.addEventListener("click", () => show(current - 1));
  next?.addEventListener("click", () => show(current + 1));
  deck.addEventListener("keydown", event => {
    if (event.key === "ArrowLeft") show(current - 1);
    if (event.key === "ArrowRight") show(current + 1);
  });
  show(0);
}

function initSimulator() {
  const simulator = document.querySelector("[data-simulator]");
  if (!simulator) return;

  const rules = [
    {
      id: "R-01", priority: 10,
      antecedents: ["SOLICITA_GIRO_MESA", "PRENSA_NAO_RECUADA"],
      consequent: "TRIP_COLISAO_MESA",
      diagnosis: "Risco de colisão: mesa solicitada com a prensa fora do recuo seguro.",
      action: "Bloquear M-001 e comandar retorno seguro da prensa."
    },
    {
      id: "R-07", priority: 10,
      antecedents: ["TRIP_COLISAO_MESA"],
      consequent: "ALARME_GERAL_PARADA",
      diagnosis: "Parada geral derivada do trip de colisão da mesa.",
      action: "Inibir movimentos e acionar sinalização de parada."
    },
    {
      id: "R-05", priority: 9,
      antecedents: ["SOLICITA_DOSE_AGUA", "BICO_FECHADO"],
      consequent: "SOBREPRESSAO_DOSADOR",
      diagnosis: "Dosagem solicitada com o bico indicado como fechado.",
      action: "Abortar avanço do dosador e levar o conjunto a estado seguro."
    },
    {
      id: "R-02", priority: 8,
      antecedents: ["SOLICITA_PRENSA", "TEMPERATURA_ABAIXO_MIN"],
      consequent: "BLOQUEIO_SELAGEM_FRIO",
      diagnosis: "Temperatura abaixo de 180 °C durante a solicitação da prensa.",
      action: "Inibir avanço de XV-401 e verificar TIT-401 / HT-401."
    },
    {
      id: "R-06", priority: 8,
      antecedents: ["FIM_CURSO_AVANCO_ATIVO", "FIM_CURSO_RECUO_ATIVO"],
      consequent: "FALHA_INCOERENCIA_SENSOR",
      diagnosis: "Fins de curso antagônicos estão ativos simultaneamente.",
      action: "Inibir automático e solicitar inspeção elétrica."
    },
    {
      id: "R-04", priority: 7,
      antecedents: ["CICLO_DISPENSA_CONCLUIDO", "COPO_ESTACAO1_AUSENTE"],
      consequent: "MAGAZINE_COPOS_VAZIO",
      diagnosis: "Nenhum copo foi detectado após o ciclo de dispensação.",
      action: "Pausar a indexação e verificar magazine / ZS-102."
    },
    {
      id: "R-03", priority: 6,
      antecedents: ["SOLICITA_GIRO_BRACO", "VACUO_NAO_CONFIRMADO"],
      consequent: "FALHA_CAPTURA_TAMPA",
      diagnosis: "Tampa não confirmada pela ventosa antes do giro.",
      action: "Pausar XV-301 e verificar VAC-301 / PIT-301."
    }
  ];

  const input = name => simulator.querySelector(`[data-sim-input="${name}"]`);
  const scenarioButtons = [...simulator.querySelectorAll("[data-scenario]")];
  const status = simulator.querySelector("[data-sim-status]");
  const factChips = simulator.querySelector("[data-fact-chips]");
  const factCount = simulator.querySelector("[data-fact-count]");
  const firedRules = simulator.querySelector("[data-fired-rules]");
  const summary = simulator.querySelector("[data-inference-summary]");
  const temperatureValue = simulator.querySelector("[data-temp-value]");
  const proofGoal = simulator.querySelector("[data-proof-goal]");
  const proofResult = simulator.querySelector("[data-proof-result]");
  const consoleLines = simulator.querySelector("[data-console-lines]");
  const ejectionReadout = simulator.querySelector("[data-ejection-readout]");
  const permissiveBoard = simulator.querySelector("[data-permissive-board]");
  const generalLogic = simulator.querySelector("[data-general-logic]");
  const modeLogic = simulator.querySelector("[data-mode-logic]");
  const sensorLogic = simulator.querySelector("[data-sensor-logic]");
  const positionState = simulator.querySelector("[data-position-state]");
  const table = simulator.querySelector(".sim-table");
  const autoController = simulator.querySelector("[data-auto-controller]");
  const autoState = simulator.querySelector("[data-auto-state]");
  const autoStep = simulator.querySelector("[data-auto-step]");
  const autoCycle = simulator.querySelector("[data-auto-cycle]");
  const autoProgress = simulator.querySelector("[data-auto-progress]");
  const autoPrepare = simulator.querySelector("[data-auto-prepare]");
  const autoStart = simulator.querySelector("[data-auto-start]");
  const autoStop = simulator.querySelector("[data-auto-stop]");
  const motionKeys = ["table", "nozzle", "dose", "cap", "press", "elevator", "extractor"];
  const motions = Object.fromEntries(motionKeys.map(key => [key, { active: false, armed: true, completed: false, departed: false }]));
  const automatic = { running: false, prepared: false, fault: "", step: "PARADO", progress: 0, cycle: 0, token: 0 };
  const autoRequestNames = ["reqTable", "reqNozzle", "reqDose", "reqArm", "reqPress", "reqLift", "reqExtract"];
  const autoUnlockedInputs = new Set(["generalEnabled", "autoMode", "manualMode", "offPressed", "stopPressed", "temperature", "emergency"]);
  const AUTO_DELAY = 420;
  const AUTO_TIMEOUT = 2500;
  let lastSignature = "";

  const scenarios = {
    nominal: { temperature: 185, vacuumConfirmed: true, cupE1Present: true },
    collision: { reqTable: true, pressRetracted: false, pressAdvanced: true, temperature: 185, vacuumConfirmed: true, cupE1Present: true },
    cold: { reqPress: true, temperature: 150, vacuumConfirmed: true, cupE1Present: true },
    vacuum: { reqArm: true, temperature: 185, vacuumConfirmed: false, cupE1Present: true },
    empty: { dispenseDone: true, temperature: 185, vacuumConfirmed: true, cupE1Present: false },
    nozzle: { reqDose: true, doserAdvanced: false, doserRetracted: true, nozzleClosed: true, nozzleOpenConfirmed: false, temperature: 185, vacuumConfirmed: true, cupE1Present: true },
    sensors: { pressAdvanced: true, pressRetracted: true, temperature: 185, vacuumConfirmed: true, cupE1Present: true },
    emergency: { emergency: true, temperature: 185, vacuumConfirmed: true, cupE1Present: true }
  };

  function resetMotionMemory() {
    motionKeys.forEach(key => Object.assign(motions[key], { active: false, armed: true, completed: false, departed: false }));
  }

  function resetInputs() {
    resetMotionMemory();
    simulator.querySelectorAll("[data-sim-input]").forEach(control => {
      if (control.type === "checkbox") control.checked = false;
    });
    input("temperature").value = 185;
    input("vacuumConfirmed").checked = true;
    input("cupE1Present").checked = true;
    input("generalEnabled").checked = true;
    input("autoMode").checked = true;
    input("tablePositioned").checked = true;
    input("retainerAdvanced").checked = true;
    input("cupE2Present").checked = true;
    input("routeReached").checked = true;
    input("doserAdvanced").checked = true;
    input("cupE3Present").checked = true;
    input("armHome").checked = true;
    input("verticalRetracted").checked = true;
    input("cupE4Present").checked = true;
    input("pressRetracted").checked = true;
    input("cupE5Present").checked = true;
    input("liftRetracted").checked = true;
    input("extractorAdvanced").checked = true;
  }

  function applyScenario(name, initial = false) {
    automatic.token += 1;
    Object.assign(automatic, { running: false, prepared: false, fault: "", step: "PARADO", progress: 0 });
    resetInputs();
    const values = scenarios[name] || scenarios.nominal;
    Object.entries(values).forEach(([key, value]) => {
      const control = input(key);
      if (!control) return;
      if (control.type === "checkbox") control.checked = Boolean(value);
      else control.value = value;
    });
    scenarioButtons.forEach(button => button.classList.toggle("active", button.dataset.scenario === name));
    if (!initial) addLog(`Cenário carregado: ${buttonName(name)}.`, name === "nominal" ? "ok" : "alarm");
    update();
  }

  function buttonName(name) {
    return scenarioButtons.find(button => button.dataset.scenario === name)?.textContent.trim() || name;
  }

  function renderAutomatic() {
    if (!autoController) return;
    const complete = !automatic.running && !automatic.fault && automatic.step === "CICLO CONCLUÍDO";
    autoController.className = `auto-controller${automatic.running ? " running" : automatic.fault ? " fault" : complete ? " complete" : ""}`;
    if (autoState) autoState.textContent = automatic.fault ? "FALHA · NOVA PREPARAÇÃO" : automatic.running ? "CICLO EM EXECUÇÃO" : complete ? "CICLO CONCLUÍDO" : automatic.prepared ? "PRONTO PARA PARTIDA" : "AGUARDANDO PREPARAÇÃO";
    if (autoStep) autoStep.textContent = automatic.step;
    if (autoCycle) autoCycle.textContent = `CICLO ${String(automatic.cycle).padStart(2, "0")}`;
    if (autoProgress) autoProgress.style.width = `${automatic.progress}%`;
    if (autoPrepare) autoPrepare.disabled = automatic.running;
    if (autoStart) autoStart.disabled = automatic.running || !automatic.prepared;
    if (autoStop) autoStop.disabled = !automatic.running;
    simulator.querySelectorAll("[data-sim-input]").forEach(control => {
      const locked = automatic.running && !autoUnlockedInputs.has(control.dataset.simInput);
      control.disabled = locked;
      control.toggleAttribute("data-auto-locked", locked);
    });
    scenarioButtons.forEach(button => { button.disabled = automatic.running; });
  }

  function setAutoStep(label, progress, log = false) {
    automatic.step = label;
    automatic.progress = progress;
    renderAutomatic();
    if (log) addLog(`AUTO: ${label}.`, "ok");
  }

  function setAutoInputs(values) {
    Object.entries(values).forEach(([name, value]) => {
      const control = input(name);
      if (!control) return;
      if (control.type === "checkbox") control.checked = Boolean(value);
      else control.value = value;
    });
    if (values.nozzleClosed) input("nozzleOpenConfirmed").checked = false;
    if (values.nozzleOpenConfirmed) input("nozzleClosed").checked = false;
    update();
  }

  function clearAutoRequests() {
    autoRequestNames.forEach(name => { input(name).checked = false; });
  }

  function prepareAutomatic() {
    automatic.token += 1;
    Object.assign(automatic, { running: false, prepared: true, fault: "", step: "PRONTO · 1 COPO EM E1", progress: 0 });
    resetInputs();
    input("autoMode").checked = true;
    input("manualMode").checked = false;
    input("cupE1Present").checked = true;
    input("cupE2Present").checked = false;
    input("cupE3Present").checked = false;
    input("cupE4Present").checked = false;
    input("cupE5Present").checked = false;
    scenarioButtons.forEach(button => button.classList.remove("active"));
    update();
    addLog("Automático preparado: um copo carregado em E1 e mecanismos em repouso.", "ok");
  }

  function validateAutomaticStart() {
    const state = readPlantState();
    if (!automatic.prepared) return "prepare a planta antes da partida";
    if (!state.auto || state.manual) return "selecione somente o modo automático";
    if (!state.k1 || state.e1 || state.b2 || state.b3) return "habilitação geral indisponível";
    if (!state.p0) return "mesa não posicionada";
    if (!state.t1) return "temperatura abaixo de 180 °C";
    if (findIncoherences(state).length) return "fins de curso incoerentes";
    if (!state.s1) return "não há copo em E1";
    if (Object.values(state.requests).some(Boolean) || motionKeys.some(key => motions[key].active)) return "há solicitação ou movimento ativo";
    const restSafe = state.c1a && !state.c1r && state.c3a && !state.c3r && !state.c4 && state.c5r && !state.c5a && state.c6r && !state.c6a && state.c7r && !state.c7a && state.c8r && !state.c8a && state.c9a && !state.c9r;
    if (!restSafe) return "mecanismos fora do repouso seguro";
    return "";
  }

  function stopAutomatic(reason = "CICLO INTERROMPIDO", fault = false) {
    const wasRunning = automatic.running;
    automatic.token += 1;
    automatic.running = false;
    automatic.prepared = false;
    automatic.fault = fault ? reason : "";
    automatic.step = fault ? "PARADA DE SEGURANÇA" : reason;
    clearAutoRequests();
    resetMotionMemory();
    update();
    if (wasRunning || fault) addLog(`AUTO: ${reason}.`, fault ? "alarm" : "ok");
  }

  function completeAutomatic() {
    automatic.running = false;
    automatic.prepared = false;
    automatic.fault = "";
    automatic.step = "CICLO CONCLUÍDO";
    automatic.progress = 100;
    clearAutoRequests();
    resetMotionMemory();
    update();
    addLog("AUTO: copo envasado, tampado, selado e ejetado. Ciclo concluído.", "ok");
  }

  function autoCancellation() {
    const error = new Error("AUTO_CANCELLED");
    error.cancelled = true;
    return error;
  }

  function assertAutomaticSafe(token) {
    if (token !== automatic.token || !automatic.running) throw autoCancellation();
    const state = readPlantState();
    if (!state.k1 || state.e1 || state.b2 || state.b3 || !state.auto || state.manual) throw new Error("habilitação ou modo automático perdido");
    if (findIncoherences(state).length) throw new Error("fins de curso incoerentes");
    const inference = forward(collectFacts(state));
    if (inference.fired.length) throw new Error(`diagnóstico ativo: ${inference.fired.map(rule => rule.id).join(" → ")}`);
  }

  async function autoPause(token, multiplier = 1) {
    await new Promise(resolve => setTimeout(resolve, AUTO_DELAY * multiplier));
    assertAutomaticSafe(token);
  }

  async function autoWaitFor(predicate, description, token, timeout = AUTO_TIMEOUT) {
    const started = Date.now();
    while (!predicate()) {
      assertAutomaticSafe(token);
      if (Date.now() - started >= timeout) throw new Error(`TIMEOUT: ${description}`);
      await new Promise(resolve => setTimeout(resolve, 40));
    }
    assertAutomaticSafe(token);
  }

  async function autoStartMotion(requestName, motionKey, label, progress, token) {
    setAutoStep(label, progress);
    setAutoInputs({ [requestName]: true });
    await autoWaitFor(() => motions[motionKey].active, `partida de ${label}`, token);
  }

  async function autoFinishMotion(requestName, motionKey, label, token) {
    await autoWaitFor(() => motions[motionKey].completed, `fim de curso de ${label}`, token);
    setAutoInputs({ [requestName]: false });
    await autoPause(token, 0.35);
  }

  async function autoTransitionPair(initialName, finalName, token) {
    setAutoInputs({ [initialName]: false });
    await autoPause(token, 0.55);
    setAutoInputs({ [finalName]: true });
  }

  async function autoIndex(label, progress, token) {
    await autoStartMotion("reqTable", "table", label, progress, token);
    await autoPause(token, 0.65);
    setAutoInputs({ tablePositioned: false });
    await autoWaitFor(() => motions.table.departed, "saída do índice da mesa", token);
    await autoPause(token, 0.65);
    setAutoInputs({ tablePositioned: true });
    await autoFinishMotion("reqTable", "table", label, token);
  }

  async function runAutomaticCycle(token) {
    try {
      setAutoStep("E1 · DISPENSAR COPO", 3, true);
      await autoPause(token);
      setAutoInputs({ dispenseDone: true });
      await autoPause(token);
      setAutoInputs({ dispenseDone: false });

      await autoIndex("MESA · E1 → E2", 10, token);
      setAutoInputs({ cupE1Present: false, cupE2Present: true });

      setAutoStep("E2 · PREPARAR DOSADOR", 20, true);
      await autoTransitionPair("doserAdvanced", "doserRetracted", token);
      await autoPause(token, 0.45);
      await autoStartMotion("reqNozzle", "nozzle", "E2 · ABRIR BICO", 24, token);
      await autoPause(token);
      setAutoInputs({ nozzleOpenConfirmed: true });
      await autoFinishMotion("reqNozzle", "nozzle", "abertura do bico", token);
      await autoStartMotion("reqDose", "dose", "E2 · DOSAR 150 mL", 29, token);
      await autoPause(token);
      await autoTransitionPair("doserRetracted", "doserAdvanced", token);
      await autoFinishMotion("reqDose", "dose", "dosagem", token);
      setAutoInputs({ nozzleOpenConfirmed: false });
      await autoPause(token, 0.45);

      await autoIndex("MESA · E2 → E3", 38, token);
      setAutoInputs({ cupE2Present: false, cupE3Present: true });

      setAutoStep("E3 · POSICIONAR TAMPA", 47, true);
      await autoStartMotion("reqArm", "cap", "E3 · GIRAR PARA ENTREGA", 48, token);
      await autoPause(token);
      await autoTransitionPair("armHome", "armDelivered", token);
      await autoFinishMotion("reqArm", "cap", "entrega da tampa", token);
      setAutoStep("E3 · RETORNAR BRAÇO", 52);
      await autoTransitionPair("armDelivered", "armHome", token);
      await autoPause(token, 0.45);

      await autoIndex("MESA · E3 → E4", 58, token);
      setAutoInputs({ cupE3Present: false, cupE4Present: true });

      setAutoStep("E4 · TERMOSSELAR", 67, true);
      await autoStartMotion("reqPress", "press", "E4 · DESCER PRENSA", 68, token);
      await autoPause(token);
      await autoTransitionPair("pressRetracted", "pressAdvanced", token);
      await autoFinishMotion("reqPress", "press", "descida da prensa", token);
      setAutoStep("E4 · RETORNAR PRENSA", 72);
      await autoTransitionPair("pressAdvanced", "pressRetracted", token);
      await autoPause(token, 0.45);

      await autoIndex("MESA · E4 → E5", 78, token);
      setAutoInputs({ cupE4Present: false, cupE5Present: true });

      setAutoStep("E5 · ELEVAR COPO", 85, true);
      await autoStartMotion("reqLift", "elevator", "E5 · ELEVAR COPO", 85, token);
      await autoPause(token);
      await autoTransitionPair("liftRetracted", "liftAdvanced", token);
      await autoFinishMotion("reqLift", "elevator", "elevação", token);
      await autoStartMotion("reqExtract", "extractor", "E5 · EXTRAIR COPO", 90, token);
      await autoPause(token);
      await autoTransitionPair("extractorAdvanced", "extractorRetracted", token);
      await autoFinishMotion("reqExtract", "extractor", "extração", token);
      setAutoStep("E5 · RETORNAR MECANISMOS", 95);
      await autoTransitionPair("extractorRetracted", "extractorAdvanced", token);
      await autoTransitionPair("liftAdvanced", "liftRetracted", token);
      setAutoInputs({ cupE5Present: false });
      await autoPause(token, 0.45);
      completeAutomatic();
    } catch (error) {
      if (error.cancelled) return;
      stopAutomatic(error.message, true);
    }
  }

  function startAutomatic() {
    const problem = validateAutomaticStart();
    if (problem) {
      automatic.prepared = false;
      automatic.fault = problem;
      automatic.step = "PARTIDA RECUSADA";
      update();
      addLog(`AUTO: partida recusada — ${problem}.`, "alarm");
      return;
    }
    automatic.token += 1;
    automatic.running = true;
    automatic.prepared = false;
    automatic.fault = "";
    automatic.progress = 1;
    automatic.cycle += 1;
    const token = automatic.token;
    update();
    runAutomaticCycle(token);
  }

  function readPlantState() {
    const checked = name => Boolean(input(name)?.checked);
    const temperature = Number(input("temperature")?.value ?? 0);
    return {
      k1: checked("generalEnabled"),
      e1: checked("emergency"),
      b2: checked("offPressed"),
      b3: checked("stopPressed"),
      auto: checked("autoMode"),
      manual: checked("manualMode"),
      p0: checked("tablePositioned"),
      c1a: checked("retainerAdvanced"),
      c1r: checked("retainerRetracted"),
      s1: checked("cupE1Present"),
      dispenseDone: checked("dispenseDone"),
      s2: checked("cupE2Present"),
      c2: checked("routeReached"),
      c3r: checked("doserRetracted"),
      c3a: checked("doserAdvanced"),
      c4: checked("nozzleOpenConfirmed"),
      nozzleClosed: checked("nozzleClosed"),
      s3: checked("cupE3Present"),
      p1: checked("vacuumConfirmed"),
      c5r: checked("armHome"),
      c5a: checked("armDelivered"),
      c6r: checked("verticalRetracted"),
      c6a: checked("verticalAdvanced"),
      s4: checked("cupE4Present"),
      c7r: checked("pressRetracted"),
      c7a: checked("pressAdvanced"),
      temperature,
      t1: temperature >= 180,
      s5: checked("cupE5Present"),
      c8r: checked("liftRetracted"),
      c8a: checked("liftAdvanced"),
      c9a: checked("extractorAdvanced"),
      c9r: checked("extractorRetracted"),
      requests: {
        table: checked("reqTable"),
        nozzle: checked("reqNozzle"),
        dose: checked("reqDose"),
        cap: checked("reqArm"),
        press: checked("reqPress"),
        elevator: checked("reqLift"),
        extractor: checked("reqExtract")
      }
    };
  }

  function findIncoherences(state) {
    return [
      { id: "A", station: "dispense", active: state.c1a && state.c1r, tags: ["ZSC-101", "ZSO-101"] },
      { id: "C", station: "fill", active: state.c3a && state.c3r, tags: ["ZSO-202", "ZSC-202"] },
      { id: "D", station: "cap", active: state.c5a && state.c5r, tags: ["ZSO-301", "ZSC-301"] },
      { id: "E", station: "cap", active: state.c6a && state.c6r, tags: ["ZSO-302", "ZSC-302"] },
      { id: "F", station: "seal", active: state.c7a && state.c7r, tags: ["ZSO-401", "ZSC-401"] },
      { id: "G", station: "eject", active: state.c8a && state.c8r, tags: ["ZSO-501", "ZSC-501"] },
      { id: "H", station: "eject", active: state.c9a && state.c9r, tags: ["ZSC-502", "ZSO-502"] }
    ].filter(pair => pair.active);
  }

  function collectFacts(state = readPlantState()) {
    const facts = new Set();
    const incoherences = findIncoherences(state);
    if (state.requests.table || motions.table.active) facts.add("SOLICITA_GIRO_MESA");
    if (!state.c7r) facts.add("PRENSA_NAO_RECUADA");
    if (state.requests.press || motions.press.active) facts.add("SOLICITA_PRENSA");
    if (!state.t1) facts.add("TEMPERATURA_ABAIXO_MIN");
    if (state.requests.cap || motions.cap.active) facts.add("SOLICITA_GIRO_BRACO");
    if (!state.p1) facts.add("VACUO_NAO_CONFIRMADO");
    if (state.dispenseDone) facts.add("CICLO_DISPENSA_CONCLUIDO");
    if (!state.s1) facts.add("COPO_ESTACAO1_AUSENTE");
    if (state.requests.dose || motions.dose.active) facts.add("SOLICITA_DOSE_AGUA");
    if (state.nozzleClosed) facts.add("BICO_FECHADO");
    if (incoherences.length) {
      facts.add("FIM_CURSO_AVANCO_ATIVO");
      facts.add("FIM_CURSO_RECUO_ATIVO");
      incoherences.forEach(pair => facts.add(`INCOERENCIA_CILINDRO_${pair.id}`));
    }
    if (state.k1) facts.add("CHAVE_GERAL_ENERGIZADA");
    if (state.auto) facts.add("MODO_AUTOMATICO");
    if (state.manual) facts.add("MODO_MANUAL");
    if (state.b2) facts.add("BOTAO_DESLIGAR_ATIVO");
    if (state.b3) facts.add("BOTAO_PARAR_ATIVO");
    if (state.p0) facts.add("MESA_POSICIONADA");
    if (state.s5) facts.add("COPO_ESTACAO5_PRESENTE");
    if (state.c8r) facts.add("ELEVADOR_RECUADO");
    if (state.c8a) facts.add("ELEVADOR_AVANCADO");
    if (state.c9a) facts.add("EXTRATOR_AVANCADO");
    if (state.c9r) facts.add("EXTRATOR_RECUADO");
    if (state.requests.elevator) facts.add("SOLICITA_ELEVADOR");
    if (state.requests.extractor) facts.add("SOLICITA_EXTRATOR");
    if (state.e1) facts.add("EMERGENCIA_ATIVA");
    if (automatic.running) facts.add("CICLO_AUTOMATICO_ATIVO");
    if (automatic.fault) facts.add(automatic.fault.startsWith("TIMEOUT") ? "FALHA_TIMEOUT_AUTOMATICO" : "FALHA_CICLO_AUTOMATICO");
    return facts;
  }

  function evaluateControl(state, facts) {
    const incoherences = findIncoherences(state);
    const hg = state.k1 && !state.e1 && !state.b2 && !state.b3;
    const modeValid = state.auto !== state.manual;
    const sensorSafe = incoherences.length === 0;
    const baseSafe = hg && sensorSafe;
    const generalTrip = facts.has("ALARME_GERAL_PARADA");

    const permissives = {
      table: baseSafe && state.p0 && state.c1a && state.c3a && !state.c4 && state.c5r && state.c6r && state.c7r && state.c8r && state.c9a,
      nozzle: baseSafe && state.p0 && state.s2 && state.c2 && state.c3r && !state.c4,
      dose: baseSafe && state.p0 && state.s2 && state.c2 && state.c3r && state.c4 && !state.c3a,
      cap: baseSafe && state.p0 && state.s3 && state.p1 && state.c5r && state.c6r,
      press: baseSafe && state.p0 && state.s4 && state.t1 && state.c7r,
      elevator: baseSafe && state.p0 && state.s5 && state.c8r && state.c9a,
      extractor: baseSafe && state.p0 && state.s5 && state.c8a && state.c9a
    };
    const interlocks = { press: baseSafe && state.p0 && state.s4 && state.t1 };
    const releases = Object.fromEntries(Object.keys(permissives).map(key => [key, state.requests[key] && modeValid && permissives[key]]));

    return { hg, modeValid, sensorSafe, baseSafe, generalTrip, incoherences, permissives, interlocks, releases };
  }

  function updateMotionControl(state, control, facts) {
    const hardSafe = control.hg && control.modeValid && control.sensorSafe && !control.generalTrip;
    const popInhibits = {
      table: facts.has("TRIP_COLISAO_MESA") || facts.has("MAGAZINE_COPOS_VAZIO"),
      nozzle: false,
      dose: facts.has("SOBREPRESSAO_DOSADOR"),
      cap: facts.has("FALHA_CAPTURA_TAMPA"),
      press: facts.has("BLOQUEIO_SELAGEM_FRIO"),
      elevator: false,
      extractor: false
    };
    const tableRouteSafe = state.c1a && state.c3a && !state.c4 && state.c5r && state.c6r && state.c7r && state.c8r && state.c9a;
    const continuousSafe = {
      table: hardSafe && tableRouteSafe && !popInhibits.table,
      nozzle: hardSafe && state.p0 && state.s2 && state.c2 && state.c3r,
      dose: hardSafe && state.p0 && state.s2 && state.c2 && state.c4 && !state.nozzleClosed && !popInhibits.dose,
      cap: hardSafe && state.p0 && state.s3 && state.p1 && state.c6r && !popInhibits.cap,
      press: hardSafe && control.interlocks.press && !popInhibits.press,
      elevator: hardSafe && state.p0 && state.s5 && state.c9a,
      extractor: hardSafe && state.p0 && state.s5 && state.c8a
    };
    const finished = {
      nozzle: state.c4,
      dose: state.c3a,
      cap: state.c5a,
      press: state.c7a,
      elevator: state.c8a,
      extractor: state.c9r
    };
    const rawAvailability = Object.fromEntries(motionKeys.map(key => [key, control.modeValid && control.permissives[key] && continuousSafe[key] && !popInhibits[key]]));
    const stationKeys = motionKeys.filter(key => key !== "table");
    const stationMotionActive = stationKeys.some(key => motions[key].active);
    const stationStartCandidate = stationKeys.some(key => state.requests[key] && motions[key].armed && rawAvailability[key]);
    const availability = { ...rawAvailability, table: rawAvailability.table && !stationMotionActive && !stationStartCandidate };
    stationKeys.forEach(key => { availability[key] = rawAvailability[key] && !motions.table.active; });
    const startAllowed = {};

    motionKeys.forEach(key => {
      const motion = motions[key];
      const request = state.requests[key];
      startAllowed[key] = control.releases[key] && availability[key];

      if (motion.completed) {
        const endStillConfirmed = key === "table" ? state.p0 : finished[key];
        if (!endStillConfirmed) motion.completed = false;
      }

      if (motion.active) {
        if (key === "table" && !state.p0) motion.departed = true;
        const reachedEnd = key === "table" ? motion.departed && state.p0 : finished[key];
        if (!continuousSafe[key]) {
          Object.assign(motion, { active: false, completed: false, departed: false });
        } else if (reachedEnd) {
          Object.assign(motion, { active: false, completed: true, departed: false });
        }
      }

      if (!motion.active && !request) {
        motion.armed = true;
      }
      if (!motion.active && motion.armed && request) {
        motion.armed = false;
        motion.completed = false;
        if (startAllowed[key]) Object.assign(motion, { active: true, departed: false });
      }
    });

    const commands = Object.fromEntries(motionKeys.map(key => [key, motions[key].active]));
    const completed = Object.fromEntries(motionKeys.map(key => [key, motions[key].completed]));
    const rearmRequired = Object.fromEntries(motionKeys.map(key => [key, state.requests[key] && !motions[key].armed && !commands[key] && !completed[key]]));
    const blocked = Object.fromEntries(motionKeys.map(key => [key, state.requests[key] && !commands[key] && !completed[key] && (!startAllowed[key] || rearmRequired[key])]));
    return { ...control, popInhibits, availability, startAllowed, commands, completed, rearmRequired, blocked };
  }

  function forward(initialFacts) {
    const facts = new Set(initialFacts);
    const fired = [];
    const firedIds = new Set();

    while (true) {
      const candidates = rules
        .filter(rule => !firedIds.has(rule.id) && !facts.has(rule.consequent) && rule.antecedents.every(item => facts.has(item)))
        .sort((a, b) => b.priority - a.priority || b.antecedents.length - a.antecedents.length || a.id.localeCompare(b.id));
      if (!candidates.length) break;
      const rule = candidates[0];
      firedIds.add(rule.id);
      facts.add(rule.consequent);
      fired.push(rule);
    }
    return { facts, fired };
  }

  function prove(goal, facts, path = [], memo = new Map()) {
    if (facts.has(goal)) return { goal, proved: true, origin: "fato", children: [] };
    if (path.includes(goal)) return { goal, proved: false, origin: "ciclo", children: [] };
    if (memo.has(goal)) return memo.get(goal);
    const producers = rules
      .filter(rule => rule.consequent === goal)
      .sort((a, b) => b.priority - a.priority || b.antecedents.length - a.antecedents.length || a.id.localeCompare(b.id));
    if (!producers.length) {
      const missing = { goal, proved: false, origin: "ausente", children: [] };
      memo.set(goal, missing);
      return missing;
    }

    const attempts = [];
    for (const rule of producers) {
      const children = rule.antecedents.map(item => prove(item, facts, [...path, goal], memo));
      const node = { goal, proved: children.every(child => child.proved), origin: rule.id, children };
      if (node.proved) {
        memo.set(goal, node);
        return node;
      }
      attempts.push(node);
    }
    const failed = attempts.length === 1
      ? attempts[0]
      : { goal, proved: false, origin: "rotas rejeitadas", children: attempts };
    if (!flattenProof(failed).some(line => line.text.endsWith("· ciclo"))) memo.set(goal, failed);
    return failed;
  }

  function flattenProof(node, depth = 0, lines = []) {
    lines.push({ depth, text: `${node.goal} · ${node.origin}`, proved: node.proved });
    node.children.forEach(child => flattenProof(child, depth + 1, lines));
    return lines;
  }

  function updateProof(initialFacts) {
    if (!proofResult || !proofGoal) return;
    const root = prove(proofGoal.value, initialFacts);
    const label = root.proved ? "PROVADA" : "NÃO PROVADA";
    proofResult.innerHTML = `<strong class="proof-line ${root.proved ? "proved" : "failed"}">${label}</strong>` + flattenProof(root).map(line => `<span class="proof-line ${line.proved ? "proved" : "failed"}" style="padding-left:${line.depth * 12}px">${line.depth ? "└ " : ""}${line.text}</span>`).join("");
  }

  function setStation(name, fault, text, running = false, blocked = false, stopped = false) {
    const station = simulator.querySelector(`[data-station="${name}"]`);
    if (!station) return;
    station.classList.toggle("fault", fault);
    station.classList.toggle("running", running && !fault);
    station.classList.toggle("blocked", blocked && !fault && !stopped);
    station.classList.toggle("stopped", stopped && !fault);
    const output = station.querySelector("[data-station-status]");
    if (output) output.textContent = text;
  }

  function setDevice(tag, active, fault, label, blocked = false) {
    simulator.querySelectorAll(`[data-device="${tag}"]`).forEach(device => {
      device.classList.toggle("active", Boolean(active) && !fault);
      device.classList.toggle("fault", Boolean(fault));
      device.classList.toggle("blocked", Boolean(blocked) && !fault);
      const output = device.querySelector("[data-device-state]");
      if (output) output.textContent = label;
    });
  }

  function updateProcess(state, control, facts) {
    const globalStop = state.e1 || control.generalTrip;
    const collision = facts.has("TRIP_COLISAO_MESA");
    const dispenseFault = facts.has("MAGAZINE_COPOS_VAZIO");
    const fillFault = facts.has("SOBREPRESSAO_DOSADOR");
    const capFault = facts.has("FALHA_CAPTURA_TAMPA");
    const sealFault = facts.has("BLOQUEIO_SELAGEM_FRIO");
    const stationFault = name => control.incoherences.some(pair => pair.station === name);
    const stationBlocked = name => ({
      fill: control.blocked.nozzle || control.blocked.dose,
      cap: control.blocked.cap,
      seal: control.blocked.press,
      eject: control.blocked.elevator || control.blocked.extractor
    })[name] || false;
    const available = (...keys) => keys.some(key => control.availability[key]);
    const completed = (...keys) => keys.some(key => control.completed[key]);
    const needsRearm = (...keys) => keys.some(key => control.rearmRequired[key]);

    table?.classList.toggle("warning", collision || globalStop || control.blocked.table);
    const tableState = simulator.querySelector("[data-table-state]");
    if (tableState) tableState.textContent = globalStop ? "PARADA GERAL" : collision ? "TRIP DE COLISÃO" : control.commands.table ? "MESA EM COMANDO" : control.completed.table ? "INDEXAÇÃO CONCLUÍDA" : needsRearm("table") ? "REARMAR SOLICITAÇÃO" : control.blocked.table ? "GIRO BLOQUEADO" : available("table") ? "MESA PRONTA" : "AGUARDANDO PERMISSIVO";
    if (positionState) positionState.textContent = state.p0 ? "SE-001 · posição confirmada" : "SE-001 · posição não confirmada";

    setStation("dispense", dispenseFault || stationFault("dispense"), globalStop ? "parada" : dispenseFault ? "sem copo" : stationFault("dispense") ? "sensores incoerentes" : state.dispenseDone ? "ciclo concluído" : "monitorada", false, false, globalStop);
    setStation("fill", fillFault || stationFault("fill"), globalStop ? "parada" : fillFault ? "sobrepressão" : stationFault("fill") ? "sensores incoerentes" : control.commands.dose ? "dosando" : control.commands.nozzle ? "abrindo bico" : completed("dose") ? "dose concluída" : completed("nozzle") ? "bico aberto" : needsRearm("nozzle", "dose") ? "rearmar solicitação" : stationBlocked("fill") ? "permissivo bloqueado" : available("nozzle", "dose") ? "partida disponível" : "aguardando sequência", control.commands.dose || control.commands.nozzle, stationBlocked("fill"), globalStop);
    setStation("cap", capFault || stationFault("cap"), globalStop ? "parada" : capFault ? "sem vácuo" : stationFault("cap") ? "sensores incoerentes" : control.commands.cap ? "entrega em curso" : completed("cap") ? "entrega concluída" : needsRearm("cap") ? "rearmar solicitação" : stationBlocked("cap") ? "permissivo bloqueado" : available("cap") ? "partida disponível" : "aguardando permissivo", control.commands.cap, stationBlocked("cap"), globalStop);
    setStation("seal", sealFault || stationFault("seal"), globalStop ? "parada" : sealFault ? `${state.temperature} °C · bloqueada` : stationFault("seal") ? "sensores incoerentes" : control.commands.press ? "prensa em curso" : completed("press") ? "descida concluída" : needsRearm("press") ? "rearmar solicitação" : stationBlocked("seal") ? "permissivo bloqueado" : available("press") ? `${state.temperature} °C · pronta` : `${state.temperature} °C · não habilitada`, control.commands.press, stationBlocked("seal"), globalStop);
    setStation("eject", stationFault("eject"), globalStop ? "parada" : stationFault("eject") ? "sensores incoerentes" : control.commands.extractor ? "extração em curso" : control.commands.elevator ? "elevação em curso" : completed("extractor") ? "transferência concluída" : completed("elevator") ? "elevação concluída" : needsRearm("elevator", "extractor") ? "rearmar solicitação" : stationBlocked("eject") ? "permissivo bloqueado" : available("elevator", "extractor") ? "partida disponível" : "aguardando permissivo", control.commands.elevator || control.commands.extractor, stationBlocked("eject"), globalStop);

    setDevice("M-001", control.commands.table, collision, globalStop ? "PARADA" : collision ? "TRIP" : control.commands.table ? "COMANDO ON" : control.completed.table ? "CICLO OK" : needsRearm("table") ? "REARME REQ" : control.blocked.table ? "BLOQUEADA" : available("table") ? "PRONTA" : "NÃO HABILITADA", control.blocked.table);
    setDevice("XV-101", false, dispenseFault, globalStop ? "PARADA" : dispenseFault ? "BLOQUEADA" : "FORA DO ESCOPO");
    setDevice("ZS-102", state.s1, dispenseFault, state.s1 ? "PRESENTE" : "AUSENTE");
    setDevice("XV-203", control.commands.nozzle, false, globalStop ? "PARADA" : fillFault && control.commands.nozzle ? "ABERTURA DE ALÍVIO" : fillFault ? "VERIFICAR BICO" : control.commands.nozzle ? "COMANDO ON" : control.completed.nozzle ? "ETAPA OK" : control.blocked.nozzle ? "BLOQUEADA" : "STANDBY", control.blocked.nozzle);
    setDevice("XV-202", control.commands.dose, fillFault, globalStop ? "PARADA" : fillFault ? "ABORTADA" : control.commands.dose ? "COMANDO ON" : control.completed.dose ? "ETAPA OK" : control.blocked.dose ? "BLOQUEADA" : "STANDBY", control.blocked.dose);
    setDevice("ZSC-203", state.c4, false, state.c4 ? "ABERTO" : "NÃO DETECTADO");
    setDevice("XV-301", control.commands.cap, capFault, globalStop ? "PARADA" : control.commands.cap ? "COMANDO ON" : control.completed.cap ? "ETAPA OK" : control.blocked.cap ? "BLOQUEADA" : "STANDBY", control.blocked.cap);
    setDevice("PIT-301", state.p1, capFault, state.p1 ? "TAMPA CAPTURADA" : "NÃO CONFIRMADA");
    setDevice("XV-401", control.commands.press, sealFault, globalStop ? "PARADA" : control.commands.press ? "COMANDO ON" : control.completed.press ? "ETAPA OK" : control.blocked.press ? "BLOQUEADA" : "STANDBY", control.blocked.press);
    setDevice("TIT-401", state.t1, sealFault, `${state.temperature} °C`);
    setDevice("XV-501", control.commands.elevator, false, globalStop ? "PARADA" : control.commands.elevator ? "COMANDO ON" : control.completed.elevator ? "ETAPA OK" : control.blocked.elevator ? "BLOQUEADA" : "STANDBY", control.blocked.elevator);
    setDevice("XV-502", control.commands.extractor, false, globalStop ? "PARADA" : control.commands.extractor ? "COMANDO ON" : control.completed.extractor ? "ETAPA OK" : control.blocked.extractor ? "BLOQUEADA" : "STANDBY", control.blocked.extractor);
    setDevice("ZS-500", state.s5, false, state.s5 ? "PRESENTE" : "AUSENTE");
    setDevice("ZSC-501", state.c8r, state.c8r && state.c8a, state.c8r ? "RECUADO" : "INATIVO");
    setDevice("ZSO-501", state.c8a, state.c8r && state.c8a, state.c8a ? "AVANÇADO" : "INATIVO");
    setDevice("ZSC-502", state.c9a, state.c9a && state.c9r, state.c9a ? "AVANÇADO" : "INATIVO");
    setDevice("ZSO-502", state.c9r, state.c9a && state.c9r, state.c9r ? "RECUADO" : "INATIVO");

    if (ejectionReadout) {
      const ejectionFault = stationFault("eject");
      const ejectionBlocked = stationBlocked("eject");
      ejectionReadout.className = `ejection-readout ${ejectionFault ? "fault" : ejectionBlocked || !control.baseSafe ? "blocked" : ""}`;
      ejectionReadout.querySelector("strong").textContent = globalStop ? "E5 PARADA" : ejectionFault ? "FINS DE CURSO INCOERENTES" : control.commands.extractor ? "XV-502 COMANDO ON" : control.commands.elevator ? "XV-501 COMANDO ON" : control.completed.extractor ? "TRANSFERÊNCIA CONCLUÍDA" : control.completed.elevator ? "ELEVAÇÃO CONCLUÍDA" : ejectionBlocked ? "SOLICITAÇÃO BLOQUEADA" : available("elevator", "extractor") ? "E5 PRONTA" : "E5 AGUARDANDO PERMISSIVO";
      ejectionReadout.querySelector("small").textContent = `P_ELEV=${Number(control.permissives.elevator)} · LIB_ELEV=${Number(control.releases.elevator)} · P_EXT=${Number(control.permissives.extractor)} · LIB_EXT=${Number(control.releases.extractor)}`;
    }
  }

  function renderPermissives(state, control) {
    const setLogic = (node, text, ok) => {
      if (!node) return;
      node.textContent = text;
      node.className = ok ? "logic-ok" : "logic-fault";
    };
    setLogic(generalLogic, `H_G=${Number(control.hg)}`, control.hg);
    setLogic(modeLogic, `M_VÁLIDO=${Number(control.modeValid)}`, control.modeValid);
    setLogic(sensorLogic, `F_SENSORES=${Number(!control.sensorSafe)}`, control.sensorSafe);
    if (!permissiveBoard) return;
    const labels = [
      ["Mesa", "GIRO", "table"],
      ["Envase", "BICO", "nozzle"],
      ["Envase", "DOSE", "dose"],
      ["Tampa", "TAMPA", "cap"],
      ["Prensa", "PRENSA", "press"],
      ["Ejeção", "ELEV", "elevator"],
      ["Ejeção", "EXTR", "extractor"]
    ];
    permissiveBoard.innerHTML = labels.map(([station, label, key]) => {
      const requested = Boolean(state.requests[key]);
      const className = control.commands[key] ? "released" : control.blocked[key] ? "blocked" : control.completed[key] ? "completed" : control.popInhibits[key] ? "inhibited" : control.availability[key] ? "ready" : "";
      const interlock = key === "press" ? `<div><span>I</span><b>${Number(control.interlocks.press)}</b></div>` : "";
      const pop = control.popInhibits[key] ? '<div><span>POP</span><b>1</b></div>' : "";
      const rearm = control.rearmRequired[key] ? '<div><span>REARM</span><b>1</b></div>' : "";
      return `<article class="permissive-card ${className}"><header><span>${station}</span><strong>${label}</strong></header><div><span>P</span><b>${Number(control.permissives[key])}</b></div>${interlock}${pop}${rearm}<div><span>REQ</span><b>${Number(requested)}</b></div><div><span>LIB</span><b>${Number(control.releases[key])}</b></div><div><span>CMD</span><b>${Number(control.commands[key])}</b></div></article>`;
    }).join("");
  }

  function renderFacts(initialFacts, result) {
    if (!factChips) return;
    const all = [...result.facts].sort();
    factChips.innerHTML = all.length ? all.map(fact => `<span class="${initialFacts.has(fact) ? "" : "derived"}">${fact}</span>`).join("") : '<span class="empty-chip">Nenhuma solicitação ativa</span>';
    if (factCount) factCount.textContent = String(all.length).padStart(2, "0");
  }

  function renderRules(result) {
    if (!firedRules || !summary) return;
    const emergency = result.facts.has("EMERGENCIA_ATIVA");
    const hasEvents = result.fired.length > 0 || emergency;
    summary.classList.toggle("warning", hasEvents);
    summary.innerHTML = hasEvents
      ? `<span class="ok-mark">!</span><div><strong>${emergency ? "Emergência manual ativa" : `${result.fired.length} regra(s) disparada(s)`}</strong><p>${emergency ? "Os movimentos foram representados em estado de parada." : "Diagnósticos ordenados por prioridade local."}</p></div>`
      : '<span class="ok-mark">✓</span><div><strong>Nenhuma regra disparada</strong><p>O conjunto de fatos está sem diagnóstico ativo.</p></div>';
    firedRules.innerHTML = result.fired.map(rule => `<article class="fired-rule"><header><span>${rule.id}</span><span>PRIO ${String(rule.priority).padStart(2, "0")}</span></header><strong>${rule.consequent}</strong><p>${rule.diagnosis}</p><p>POP: ${rule.action}</p></article>`).join("");
  }

  function updateStatus(result, control) {
    if (!status) return;
    const emergency = result.facts.has("EMERGENCIA_ATIVA");
    const trip = emergency || result.facts.has("ALARME_GERAL_PARADA");
    const blocked = Object.values(control.blocked).some(Boolean);
    const warning = automatic.fault || result.fired.length > 0 || blocked || !control.hg || !control.modeValid || !control.sensorSafe;
    status.className = `sim-status ${trip ? "trip" : warning ? "warning" : "nominal"}`;
    status.querySelector("strong").textContent = trip ? "PARADA ATIVA" : automatic.fault ? "AUTOMÁTICO EM FALHA" : result.fired.length ? "DIAGNÓSTICO ATIVO" : blocked ? "PERMISSIVO BLOQUEADO" : warning ? "CONTROLE NÃO HABILITADO" : automatic.running ? "CICLO AUTOMÁTICO" : "OPERAÇÃO NOMINAL";
  }

  function addLog(message, type = "") {
    if (!consoleLines) return;
    const now = new Date().toLocaleTimeString("pt-BR", { hour12: false });
    const line = document.createElement("p");
    line.className = type;
    line.textContent = `[${now}] ${message}`;
    consoleLines.prepend(line);
  }

  function update() {
    const state = readPlantState();
    const initialFacts = collectFacts(state);
    const result = forward(initialFacts);
    const control = updateMotionControl(state, evaluateControl(state, result.facts), result.facts);
    if (temperatureValue) temperatureValue.textContent = `${input("temperature").value} °C`;
    renderFacts(initialFacts, result);
    renderRules(result);
    updateProcess(state, control, result.facts);
    renderPermissives(state, control);
    updateStatus(result, control);
    updateProof(initialFacts);
    renderAutomatic();

    const signature = `${[...initialFacts].sort().join("|")}::${result.fired.map(rule => rule.id).join("|")}`;
    if (lastSignature && signature !== lastSignature && (!automatic.running || result.fired.length)) {
      const message = result.fired.length ? `Inferência: ${result.fired.map(rule => rule.id).join(" → ")}.` : "Base atualizada sem novo diagnóstico.";
      addLog(message, result.fired.length ? "alarm" : "ok");
    }
    lastSignature = signature;
  }

  scenarioButtons.forEach(button => button.addEventListener("click", () => applyScenario(button.dataset.scenario)));
  simulator.querySelectorAll("[data-sim-input]").forEach(control => control.addEventListener(control.type === "range" ? "input" : "change", () => {
    if (control.checked && control.dataset.simInput === "nozzleClosed") input("nozzleOpenConfirmed").checked = false;
    if (control.checked && control.dataset.simInput === "nozzleOpenConfirmed") input("nozzleClosed").checked = false;
    if (automatic.running && autoUnlockedInputs.has(control.dataset.simInput)) {
      const state = readPlantState();
      if (!state.k1 || state.e1 || state.b2 || state.b3 || !state.auto || state.manual) {
        stopAutomatic("habilitação ou modo automático perdido", true);
        return;
      }
    }
    scenarioButtons.forEach(button => button.classList.remove("active"));
    update();
  }));
  autoPrepare?.addEventListener("click", prepareAutomatic);
  autoStart?.addEventListener("click", startAutomatic);
  autoStop?.addEventListener("click", () => stopAutomatic("CICLO INTERROMPIDO PELO OPERADOR"));
  proofGoal?.addEventListener("change", () => updateProof(collectFacts()));
  simulator.querySelector("[data-clear-log]")?.addEventListener("click", () => {
    if (consoleLines) consoleLines.innerHTML = "";
    addLog("Histórico reiniciado pelo usuário.", "ok");
  });

  addLog("Laboratório lógico inicializado. Nenhum comando externo é enviado.", "ok");
  applyScenario("nominal", true);
}
