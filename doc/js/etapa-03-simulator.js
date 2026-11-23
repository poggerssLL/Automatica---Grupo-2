/* Aqua Index — Etapa 03: Motor Algorítmico e Simulador Interativo (Aulas 19, 20, 21 e 22).
 * Exportação condicional via module.exports para testes unitários em Node.js sem DOM.
 */
const AquaIndexEtapa03 = (() => {
  "use strict";

  const deepFreeze = (obj) => {
    if (obj && typeof obj === "object" && !Object.isFrozen(obj)) {
      Object.freeze(obj);
      for (const value of Object.values(obj)) {
        deepFreeze(value);
      }
    }
    return obj;
  };

  const round = (value, decimals = 4) => {
    const factor = Math.pow(10, decimals);
    return Math.round((value + Number.EPSILON) * factor) / factor;
  };

  /* ============================================================================
   * MODO 1 — AULA 19: MST (KRUSKAL E PRIM) NA ENVASADORA AQUA INDEX
   * ============================================================================ */

  const MST_NODES = deepFreeze([
    { id: "PLC-001", code: "v1", label: "Painel Central CLP/SCADA", sector: "Setor 000", x: 115, y: 270 },
    { id: "MESA-001", code: "v2", label: "Servomotor / Encoder SE-001", sector: "Setor 000", x: 470, y: 270 },
    { id: "E1-DISP", code: "v3", label: "Estação 1: Dispensa de Copos", sector: "Setor 100", x: 300, y: 120 },
    { id: "E2-ENV", code: "v4", label: "Estação 2: Envase 150 mL", sector: "Setor 200", x: 545, y: 95 },
    { id: "E3-TAMP", code: "v5", label: "Estação 3: Manipulador Tampas", sector: "Setor 300", x: 705, y: 210 },
    { id: "E4-SEL", code: "v6", label: "Estação 4: Termosselagem", sector: "Setor 400", x: 640, y: 405 },
    { id: "E5-EJEC", code: "v7", label: "Estação 5: Ejeção Pneumática", sector: "Setor 500", x: 365, y: 430 },
    { id: "EST-501", code: "v8", label: "Esteira de Saída / Contagem", sector: "Setor 500", x: 855, y: 430 }
  ]);

  const MST_EDGES = deepFreeze([
    { id: "e01", from: "E5-EJEC", to: "EST-501", weight: 1.1, label: "E5-EJEC ↔ EST-501" },
    { id: "e02", from: "E1-DISP", to: "E2-ENV", weight: 1.2, label: "E1-DISP ↔ E2-ENV" },
    { id: "e03", from: "E2-ENV", to: "E3-TAMP", weight: 1.3, label: "E2-ENV ↔ E3-TAMP" },
    { id: "e04", from: "E3-TAMP", to: "E4-SEL", weight: 1.4, label: "E3-TAMP ↔ E4-SEL" },
    { id: "e05", from: "E4-SEL", to: "E5-EJEC", weight: 1.5, label: "E4-SEL ↔ E5-EJEC" },
    { id: "e06", from: "MESA-001", to: "E1-DISP", weight: 1.6, label: "MESA-001 ↔ E1-DISP" },
    { id: "e07", from: "MESA-001", to: "E2-ENV", weight: 1.7, label: "MESA-001 ↔ E2-ENV" },
    { id: "e08", from: "PLC-001", to: "E1-DISP", weight: 1.8, label: "PLC-001 ↔ E1-DISP" },
    { id: "e09", from: "MESA-001", to: "E3-TAMP", weight: 1.9, label: "MESA-001 ↔ E3-TAMP" },
    { id: "e10", from: "PLC-001", to: "MESA-001", weight: 2.0, label: "PLC-001 ↔ MESA-001" },
    { id: "e11", from: "MESA-001", to: "E4-SEL", weight: 2.1, label: "MESA-001 ↔ E4-SEL" },
    { id: "e12", from: "MESA-001", to: "E5-EJEC", weight: 2.2, label: "MESA-001 ↔ E5-EJEC" },
    { id: "e13", from: "E5-EJEC", to: "E1-DISP", weight: 2.6, label: "E5-EJEC ↔ E1-DISP" },
    { id: "e14", from: "PLC-001", to: "EST-501", weight: 3.4, label: "PLC-001 ↔ EST-501" }
  ]);

  const MST_GRAPH = deepFreeze({
    id: "aqua-index-mst",
    unit: "m",
    directed: false,
    nodes: MST_NODES,
    edges: MST_EDGES,
    totalMeshWeight: round(MST_EDGES.reduce((acc, e) => acc + e.weight, 0), 3)
  });

  function normalizeNodeIds(nodes) {
    if (!Array.isArray(nodes)) return [];
    return nodes.map((n) => (typeof n === "string" ? n : n && n.id)).filter(Boolean);
  }

  function normalizeBlockedSet(blocked) {
    if (!blocked) return new Set();
    if (blocked instanceof Set) return new Set(blocked);
    if (Array.isArray(blocked)) return new Set(blocked);
    return new Set();
  }

  function kruskalMST(edges = MST_EDGES, nodes = MST_NODES, options = {}) {
    const nodeIds = normalizeNodeIds(nodes);
    const nodeSet = new Set(nodeIds);
    const blocked = normalizeBlockedSet(options.blockedEdges);
    const fullWeight = round(
      (Array.isArray(edges) ? edges : []).reduce((sum, e) => sum + (Number.isFinite(e.weight) ? e.weight : 0), 0),
      3
    );

    if (nodeIds.length === 0) {
      return {
        ok: false,
        algorithm: "kruskal",
        reason: "grafo sem módulos",
        edges: [],
        edgeIds: [],
        rejectedEdges: [],
        steps: [],
        totalWeight: 0,
        fullWeight,
        reductionPct: 0,
        connected: false,
        componentsCount: 0
      };
    }

    const parent = new Map(nodeIds.map((id) => [id, id]));
    const rank = new Map(nodeIds.map((id) => [id, 0]));

    const find = (x) => {
      let root = x;
      while (parent.get(root) !== root) root = parent.get(root);
      let curr = x;
      while (curr !== root) {
        const next = parent.get(curr);
        parent.set(curr, root);
        curr = next;
      }
      return root;
    };

    const union = (a, b) => {
      const ra = find(a);
      const rb = find(b);
      if (ra === rb) return false;
      const rankA = rank.get(ra);
      const rankB = rank.get(rb);
      if (rankA < rankB) {
        parent.set(ra, rb);
      } else if (rankA > rankB) {
        parent.set(rb, ra);
      } else {
        parent.set(rb, ra);
        rank.set(ra, rankA + 1);
      }
      return true;
    };

    const validEdges = (Array.isArray(edges) ? edges : [])
      .filter(
        (e) =>
          e &&
          nodeSet.has(e.from) &&
          nodeSet.has(e.to) &&
          Number.isFinite(e.weight) &&
          e.weight >= 0
      )
      .map((e) => ({ ...e }))
      .sort((a, b) => a.weight - b.weight || String(a.id).localeCompare(String(b.id)));

    const mstEdges = [];
    const rejectedEdges = [];
    const steps = [];
    const targetCount = Math.max(0, nodeIds.length - 1);

    let order = 0;
    for (const edge of validEdges) {
      order += 1;
      if (blocked.has(edge.id)) {
        steps.push({ order, edge, decision: "blocked", cycleDetected: false });
        continue;
      }
      if (mstEdges.length >= targetCount) {
        rejectedEdges.push(edge);
        steps.push({ order, edge, decision: "skipped_complete", cycleDetected: true });
        continue;
      }
      if (union(edge.from, edge.to)) {
        mstEdges.push(edge);
        steps.push({ order, edge, decision: "included", cycleDetected: false });
      } else {
        rejectedEdges.push(edge);
        steps.push({ order, edge, decision: "rejected_cycle", cycleDetected: true });
      }
    }

    const roots = new Set(nodeIds.map((id) => find(id)));
    const connected = mstEdges.length === targetCount && roots.size === 1;
    const totalWeight = round(mstEdges.reduce((sum, e) => sum + e.weight, 0), 3);
    const reductionPct = fullWeight > 0 && connected ? round((1 - totalWeight / fullWeight) * 100, 1) : 0;

    return {
      ok: connected,
      algorithm: "kruskal",
      reason: connected ? "" : `rede desconexa (${roots.size} componentes)`,
      edges: mstEdges,
      edgeIds: mstEdges.map((e) => e.id),
      rejectedEdges,
      steps,
      totalWeight,
      fullWeight,
      reductionPct,
      connected,
      componentsCount: roots.size
    };
  }

  function primMST(edges = MST_EDGES, nodes = MST_NODES, startNode = "PLC-001", options = {}) {
    const nodeIds = normalizeNodeIds(nodes);
    const nodeSet = new Set(nodeIds);
    const blocked = normalizeBlockedSet(options.blockedEdges);
    const fullWeight = round(
      (Array.isArray(edges) ? edges : []).reduce((sum, e) => sum + (Number.isFinite(e.weight) ? e.weight : 0), 0),
      3
    );

    if (!nodeIds.length || !nodeSet.has(startNode)) {
      return {
        ok: false,
        algorithm: "prim",
        startNode,
        reason: "módulo inicial desconhecido",
        edges: [],
        edgeIds: [],
        steps: [],
        totalWeight: 0,
        fullWeight,
        reductionPct: 0,
        connected: false,
        unvisitedNodes: [...nodeIds]
      };
    }

    const activeEdges = (Array.isArray(edges) ? edges : [])
      .filter(
        (e) =>
          e &&
          !blocked.has(e.id) &&
          nodeSet.has(e.from) &&
          nodeSet.has(e.to) &&
          Number.isFinite(e.weight) &&
          e.weight >= 0
      )
      .map((e) => ({ ...e }));

    const visited = new Set([startNode]);
    const mstEdges = [];
    const steps = [];
    let iteration = 0;

    while (visited.size < nodeIds.length) {
      let bestEdge = null;
      let addedNode = null;

      for (const edge of activeEdges) {
        const fromIn = visited.has(edge.from);
        const toIn = visited.has(edge.to);
        if (fromIn === toIn) continue;
        const candidateNode = fromIn ? edge.to : edge.from;
        if (
          !bestEdge ||
          edge.weight < bestEdge.weight ||
          (edge.weight === bestEdge.weight && String(edge.id).localeCompare(String(bestEdge.id)) < 0)
        ) {
          bestEdge = edge;
          addedNode = candidateNode;
        }
      }

      if (!bestEdge) break;

      iteration += 1;
      const visitedBefore = [...visited];
      visited.add(addedNode);
      mstEdges.push(bestEdge);
      steps.push({
        iteration,
        visitedBefore,
        edge: bestEdge,
        addedNode,
        weight: bestEdge.weight
      });
    }

    const unvisitedNodes = nodeIds.filter((id) => !visited.has(id));
    const connected = unvisitedNodes.length === 0 && mstEdges.length === Math.max(0, nodeIds.length - 1);
    const totalWeight = round(mstEdges.reduce((sum, e) => sum + e.weight, 0), 3);
    const reductionPct = fullWeight > 0 && connected ? round((1 - totalWeight / fullWeight) * 100, 1) : 0;

    return {
      ok: connected,
      algorithm: "prim",
      startNode,
      reason: connected ? "" : `rede desconexa (módulos isolados: ${unvisitedNodes.join(", ")})`,
      edges: mstEdges,
      edgeIds: mstEdges.map((e) => e.id),
      steps,
      totalWeight,
      fullWeight,
      reductionPct,
      connected,
      unvisitedNodes
    };
  }

  /* ============================================================================
   * MODO 2 — AULA 20: COMPRESSÃO DE TELEMETRIA SCADA VIA HUFFMAN
   * ============================================================================ */

  const HUFFMAN_STATES = deepFreeze([
    { symbol: "00000", tag: "NOMINAL", label: "Operação Nominal Estável (Ciclo Liberado)", prob: 0.88 },
    { symbol: "10000", tag: "ZS-102", label: "Falta de Copo / Magazine Vazio (E1 · R-04)", prob: 0.055 },
    { symbol: "00100", tag: "PIT-301", label: "Falha de Vácuo / Tampa não Capturada (E3 · R-03)", prob: 0.03 },
    { symbol: "00010", tag: "TIT-401", label: "Selagem Fria < 180 °C (E4 · R-02)", prob: 0.02 },
    { symbol: "01000", tag: "ZSC-203", label: "Bico Dosador não Confirmado (E2 · R-05)", prob: 0.012 },
    { symbol: "00001", tag: "HS-004", label: "Parada de Emergência Geral (ESD-001 / e1)", prob: 0.003 }
  ]);

  const HUFFMAN_PROFILES = deepFreeze({
    nominal: {
      id: "nominal",
      name: "Nominal 88% (Aula 20)",
      description: "Turno estável com 88% de quadros nominais 00000.",
      probs: { "00000": 0.88, "10000": 0.055, "00100": 0.03, "00010": 0.02, "01000": 0.012, "00001": 0.003 }
    },
    cup_shortage: {
      id: "cup_shortage",
      name: "Alta Falha de Copos (ZS-102)",
      description: "Oscilação no magazine MAG-100 elevando alarmes ZS-102 para 30%.",
      probs: { "00000": 0.55, "10000": 0.3, "00100": 0.06, "00010": 0.04, "01000": 0.035, "00001": 0.015 }
    },
    alarm_stress: {
      id: "alarm_stress",
      name: "Stress de Alarmes (Chuva)",
      description: "Distribuição dispersa sob múltiplos intertravamentos simultâneos.",
      probs: { "00000": 0.3, "10000": 0.22, "00100": 0.18, "00010": 0.14, "01000": 0.11, "00001": 0.05 }
    }
  });

  function normalizeHuffmanSymbols(symbols) {
    if (!Array.isArray(symbols) || symbols.length === 0) return [];
    const cleaned = symbols
      .filter((item) => item && typeof item.symbol === "string" && Number.isFinite(item.prob) && item.prob > 0)
      .map((item) => ({
        symbol: item.symbol,
        tag: item.tag || item.symbol,
        label: item.label || item.symbol,
        prob: Number(item.prob)
      }));
    const total = cleaned.reduce((sum, item) => sum + item.prob, 0);
    if (total <= 0) return [];
    const needsNorm = Math.abs(total - 1) > 1e-9;
    return cleaned.map((item) => ({
      ...item,
      prob: needsNorm ? item.prob / total : item.prob
    }));
  }

  function buildHuffmanTree(symbols = HUFFMAN_STATES) {
    const normalized = normalizeHuffmanSymbols(symbols);
    if (normalized.length === 0) {
      return { ok: false, reason: "alfabeto vazio ou probabilidades inválidas", root: null, codes: {}, mergeSteps: [], symbols: [] };
    }

    const queue = normalized.map((item) => ({
      id: `leaf:${item.symbol}`,
      symbol: item.symbol,
      tag: item.tag,
      label: item.label,
      weight: item.prob,
      left: null,
      right: null,
      isLeaf: true
    }));

    const compareNodes = (a, b) => {
      if (Math.abs(a.weight - b.weight) > 1e-12) return a.weight - b.weight;
      return a.id.localeCompare(b.id);
    };

    const mergeSteps = [];
    let internalIndex = 0;

    while (queue.length > 1) {
      queue.sort(compareNodes);
      const left = queue.shift();
      const right = queue.shift();
      internalIndex += 1;
      const parent = {
        id: `N${internalIndex}`,
        symbol: null,
        tag: `N${internalIndex}`,
        label: `Nó interno N${internalIndex}`,
        weight: round(left.weight + right.weight, 6),
        left,
        right,
        isLeaf: false
      };
      mergeSteps.push({
        step: internalIndex,
        nodeId: parent.id,
        leftId: left.isLeaf ? left.symbol : left.id,
        leftWeight: round(left.weight, 4),
        rightId: right.isLeaf ? right.symbol : right.id,
        rightWeight: round(right.weight, 4),
        weight: round(parent.weight, 4)
      });
      queue.push(parent);
    }

    const root = queue[0];
    const codes = {};

    if (root.isLeaf) {
      root.code = "0";
      codes[root.symbol] = "0";
    } else {
      const assign = (node, prefix) => {
        if (!node) return;
        if (node.isLeaf) {
          node.code = prefix;
          codes[node.symbol] = prefix;
          return;
        }
        assign(node.left, `${prefix}0`);
        assign(node.right, `${prefix}1`);
      };
      assign(root, "");
    }

    return {
      ok: true,
      root,
      codes,
      mergeSteps,
      symbols: normalized
    };
  }

  function encodeHuffman(sequence, codes) {
    if (!Array.isArray(sequence) || !codes || typeof codes !== "object") {
      return { ok: false, reason: "sequência ou tabela de códigos inválida", bitstring: "", encodedParts: [], originalBits: 0, compressedBits: 0, savingPct: 0 };
    }
    const encodedParts = [];
    let fixedWidth = 5;
    for (const sym of sequence) {
      const code = codes[sym];
      if (typeof code !== "string" || !code.length) {
        return {
          ok: false,
          reason: `símbolo desconhecido na sequência: ${sym}`,
          bitstring: "",
          encodedParts: [],
          originalBits: 0,
          compressedBits: 0,
          savingPct: 0
        };
      }
      if (typeof sym === "string" && sym.length > 0) fixedWidth = sym.length;
      encodedParts.push({ symbol: sym, code });
    }
    const bitstring = encodedParts.map((p) => p.code).join("");
    const originalBits = sequence.length * fixedWidth;
    const compressedBits = bitstring.length;
    const savingPct = originalBits > 0 ? round((1 - compressedBits / originalBits) * 100, 2) : 0;

    return {
      ok: true,
      bitstring,
      encodedParts,
      originalBits,
      compressedBits,
      savingPct
    };
  }

  function decodeHuffman(bitstring, tree) {
    const root = tree && tree.root ? tree.root : tree;
    if (!root || typeof bitstring !== "string") {
      return { ok: false, reason: "árvore ou fluxo de bits inválido", sequence: [], leftoverBits: "" };
    }
    if (!/^[01]*$/.test(bitstring)) {
      return { ok: false, reason: "fluxo contém caracteres fora de {0, 1}", sequence: [], leftoverBits: bitstring };
    }
    if (bitstring.length === 0) {
      return { ok: true, sequence: [], leftoverBits: "" };
    }
    if (root.isLeaf) {
      if (bitstring.includes("1")) {
        return { ok: false, reason: "bit inválido para árvore unitária", sequence: [], leftoverBits: bitstring };
      }
      return { ok: true, sequence: Array.from(bitstring, () => root.symbol), leftoverBits: "" };
    }

    const sequence = [];
    let current = root;
    let lastCompleteIndex = 0;

    for (let i = 0; i < bitstring.length; i += 1) {
      const bit = bitstring[i];
      current = bit === "0" ? current.left : current.right;
      if (!current) {
        return { ok: false, reason: "caminho inexistente na árvore de Huffman", sequence, leftoverBits: bitstring.slice(lastCompleteIndex) };
      }
      if (current.isLeaf) {
        sequence.push(current.symbol);
        current = root;
        lastCompleteIndex = i + 1;
      }
    }

    if (current !== root) {
      return {
        ok: false,
        reason: "fluxo de bits truncado (não termina em folha)",
        sequence,
        leftoverBits: bitstring.slice(lastCompleteIndex)
      };
    }

    return { ok: true, sequence, leftoverBits: "" };
  }

  function computeHuffmanMetrics(symbols = HUFFMAN_STATES, codes = null, fixedBits = 5) {
    const normalized = normalizeHuffmanSymbols(symbols);
    if (normalized.length === 0) {
      return {
        ok: false,
        entropy: 0,
        avgLength: 0,
        fixedBits,
        reductionPct: 0,
        efficiencyPct: 0,
        redundancy: 0,
        kraftSum: 0,
        isPrefixFree: false
      };
    }
    const table = codes || buildHuffmanTree(normalized).codes;
    let entropy = 0;
    let avgLength = 0;
    let kraftSum = 0;
    const codeList = [];

    for (const item of normalized) {
      const code = table[item.symbol];
      if (typeof code !== "string" || !code.length) {
        return {
          ok: false,
          entropy: 0,
          avgLength: 0,
          fixedBits,
          reductionPct: 0,
          efficiencyPct: 0,
          redundancy: 0,
          kraftSum: 0,
          isPrefixFree: false
        };
      }
      entropy -= item.prob * Math.log2(item.prob);
      avgLength += item.prob * code.length;
      kraftSum += Math.pow(2, -code.length);
      codeList.push(code);
    }

    let isPrefixFree = true;
    for (let i = 0; i < codeList.length && isPrefixFree; i += 1) {
      for (let j = 0; j < codeList.length; j += 1) {
        if (i !== j && codeList[j].startsWith(codeList[i])) {
          isPrefixFree = false;
          break;
        }
      }
    }

    const reductionPct = fixedBits > 0 ? (1 - avgLength / fixedBits) * 100 : 0;
    const efficiencyPct = avgLength > 0 ? (entropy / avgLength) * 100 : 0;

    return {
      ok: true,
      entropy: round(entropy, 4),
      avgLength: round(avgLength, 4),
      fixedBits,
      reductionPct: round(reductionPct, 2),
      efficiencyPct: round(efficiencyPct, 2),
      redundancy: round(avgLength - entropy, 4),
      kraftSum: round(kraftSum, 6),
      isPrefixFree
    };
  }

  /* ============================================================================
   * MODO 3 — AULA 21: BDT CONTEXTUAL DA FSM + ÁRVORE AVL DO HISTORIADOR SCADA
   * ============================================================================ */

  const BDT_DEFAULT_STATE = deepFreeze({
    reqGiro: false,
    reqDose: false,
    reqPrensa: false,
    reqBraco: false,
    posDispensa: false,
    e1_HS004: false,
    sensorConflict_R06: false,
    c7r_ZSC401: true,
    c4_ZSC203: true,
    tempC_TIT401: 188,
    p1_PIT301: true,
    s1_ZS102: true
  });

  const BDT_NODES = deepFreeze([
    { id: "N1_EMERGENCIA", level: 1, title: "HS-004 (e1)", expr: "e1 = 1?", yesLeaf: "L_TRIP_EMERGENCIA", yesAction: "TRIP_EMERGENCIA", rule: "E-00" },
    { id: "N2_CONFLITO_R06", level: 2, title: "Conflito Mag.", expr: "c_a ∧ c_r?", yesLeaf: "L_TRAVA_SENSOR_MAGNETICO", yesAction: "TRAVA_SENSOR_MAGNETICO", rule: "R-06" },
    { id: "N3_COLISAO_R01", level: 3, title: "Colisão Mesa", expr: "reqGiro ∧ ¬c7r?", yesLeaf: "L_BLOQUEIO_COLISAO_MESA", yesAction: "BLOQUEIO_COLISAO_MESA", rule: "R-01" },
    { id: "N4_DOSADOR_R05", level: 4, title: "Bico Dosador", expr: "reqDose ∧ ¬c4?", yesLeaf: "L_BLOQUEIO_DOSADOR", yesAction: "BLOQUEIO_DOSADOR", rule: "R-05" },
    { id: "N5_SELAGEM_R02", level: 5, title: "Temp. TIT-401", expr: "reqPrensa ∧ T<180?", yesLeaf: "L_HOLD_ESTAGIO_4", yesAction: "HOLD_ESTAGIO_4", rule: "R-02" },
    { id: "N6_VACUO_R03", level: 6, title: "Vácuo PIT-301", expr: "reqBraco ∧ ¬p1?", yesLeaf: "L_HOLD_ESTAGIO_3", yesAction: "HOLD_ESTAGIO_3", rule: "R-03" },
    { id: "N7_COPO_R04", level: 7, title: "Copo ZS-102", expr: "posDisp ∧ ¬s1?", yesLeaf: "L_ALARME_REABASTECIMENTO", yesAction: "ALARME_REABASTECIMENTO", rule: "R-04" }
  ]);

  const BDT_PRESETS = deepFreeze({
    nominal: {
      id: "nominal",
      label: "Operação Nominal (Ciclo Liberado)",
      state: { ...BDT_DEFAULT_STATE, reqGiro: true }
    },
    sealing_valid: {
      id: "sealing_valid",
      label: "Selagem Ativa (¬c7r sem reqGiro — SEM falso positivo)",
      state: { ...BDT_DEFAULT_STATE, reqGiro: false, reqPrensa: true, c7r_ZSC401: false, tempC_TIT401: 186 }
    },
    collision_r01: {
      id: "collision_r01",
      label: "Colisão Mecânica (R-01: reqGiro ∧ ¬c7r)",
      state: { ...BDT_DEFAULT_STATE, reqGiro: true, c7r_ZSC401: false }
    },
    doser_r05: {
      id: "doser_r05",
      label: "Sobrepressão Dosador (R-05: reqDose ∧ ¬c4)",
      state: { ...BDT_DEFAULT_STATE, reqDose: true, c4_ZSC203: false }
    },
    multi_alarm: {
      id: "multi_alarm",
      label: "Falhas Simultâneas (HS-004 + R-02 + R-04)",
      state: { ...BDT_DEFAULT_STATE, e1_HS004: true, reqPrensa: true, tempC_TIT401: 162, posDispensa: true, s1_ZS102: false }
    }
  });

  function evaluateBDT(inputState = {}) {
    const s = {
      ...BDT_DEFAULT_STATE,
      ...(inputState || {})
    };
    const tempC = Number.isFinite(Number(s.tempC_TIT401)) ? Number(s.tempC_TIT401) : 188;

    const checks = [
      {
        nodeId: "N1_EMERGENCIA",
        leafId: "L_TRIP_EMERGENCIA",
        triggered: Boolean(s.e1_HS004),
        action: "TRIP_EMERGENCIA",
        severity: "EMERGENCIA",
        level: 1,
        rule: "E-00",
        tag: "HS-004",
        message: "Botão de Parada de Emergência HS-004 acionado (desarme total)."
      },
      {
        nodeId: "N2_CONFLITO_R06",
        leafId: "L_TRAVA_SENSOR_MAGNETICO",
        triggered: Boolean(s.sensorConflict_R06),
        action: "TRAVA_SENSOR_MAGNETICO",
        severity: "ALTA",
        level: 2,
        rule: "R-06",
        tag: "ZSC/ZSO",
        message: "Incoerência elétrica: fim de curso de avanço e recuo simultâneos."
      },
      {
        nodeId: "N3_COLISAO_R01",
        leafId: "L_BLOQUEIO_COLISAO_MESA",
        triggered: Boolean(s.reqGiro) && !Boolean(s.c7r_ZSC401),
        action: "BLOQUEIO_COLISAO_MESA",
        severity: "CRITICA",
        level: 3,
        rule: "R-01",
        tag: "ZSC-401 / M-001",
        message: "Risco de colisão: giro da mesa solicitado com prensa XV-401 fora do recuo."
      },
      {
        nodeId: "N4_DOSADOR_R05",
        leafId: "L_BLOQUEIO_DOSADOR",
        triggered: Boolean(s.reqDose) && !Boolean(s.c4_ZSC203),
        action: "BLOQUEIO_DOSADOR",
        severity: "CRITICA",
        level: 4,
        rule: "R-05",
        tag: "ZSC-203 / XV-202",
        message: "Risco de sobrepressão: dosagem solicitada com bico XV-203 fechado."
      },
      {
        nodeId: "N5_SELAGEM_R02",
        leafId: "L_HOLD_ESTAGIO_4",
        triggered: Boolean(s.reqPrensa) && tempC < 180,
        action: "HOLD_ESTAGIO_4",
        severity: "ALTA",
        level: 5,
        rule: "R-02",
        tag: "TIT-401 / XV-401",
        message: `Selagem fria (${tempC.toFixed(1)} °C < 180 °C): avanço da prensa XV-401 inibido.`
      },
      {
        nodeId: "N6_VACUO_R03",
        leafId: "L_HOLD_ESTAGIO_3",
        triggered: Boolean(s.reqBraco) && !Boolean(s.p1_PIT301),
        action: "HOLD_ESTAGIO_3",
        severity: "MEDIA",
        level: 6,
        rule: "R-03",
        tag: "PIT-301 / XV-301",
        message: "Vácuo não confirmado em PIT-301: manipulador de tampas pausado."
      },
      {
        nodeId: "N7_COPO_R04",
        leafId: "L_ALARME_REABASTECIMENTO",
        triggered: Boolean(s.posDispensa) && !Boolean(s.s1_ZS102),
        action: "ALARME_REABASTECIMENTO",
        severity: "ALTA",
        level: 7,
        rule: "R-04",
        tag: "ZS-102 / MAG-100",
        message: "Falta de copo na Estação 1 pós-dispensa: solicitar reabastecimento MAG-100."
      }
    ];

    const activeAlarms = checks
      .filter((c) => c.triggered)
      .map((c) => ({
        action: c.action,
        rule: c.rule,
        tag: c.tag,
        level: c.level,
        severity: c.severity,
        message: c.message
      }));

    const pathNodes = [];
    let winner = null;

    for (const check of checks) {
      pathNodes.push(check.nodeId);
      if (check.triggered) {
        winner = check;
        pathNodes.push(check.leafId);
        break;
      }
    }

    if (!winner) {
      pathNodes.push("L_OPERACAO_NORMAL");
    }

    const action = winner ? winner.action : "OPERACAO_NORMAL";
    const severity = winner ? winner.severity : "NORMAL";
    const level = winner ? winner.level : 0;

    const actuators = {
      m0_M001: action === "OPERACAO_NORMAL" && Boolean(s.reqGiro),
      v3_XV202: action === "OPERACAO_NORMAL" && Boolean(s.reqDose),
      v4_XV203_forceOpen: action === "BLOQUEIO_DOSADOR",
      v8_XV401: action === "OPERACAO_NORMAL" && Boolean(s.reqPrensa),
      v5_XV301: action === "OPERACAO_NORMAL" && Boolean(s.reqBraco),
      h1_HT401: action !== "TRIP_EMERGENCIA",
      il001_Ligado: action === "OPERACAO_NORMAL",
      il002_Emergencia: action === "TRIP_EMERGENCIA"
    };

    return {
      action,
      severity,
      level,
      rule: winner ? winner.rule : "NOMINAL",
      message: winner ? winner.message : "Permissivos satisfeitos: ciclo automático liberado.",
      pathNodes,
      activeAlarms,
      suppressedAlarms: activeAlarms.slice(1),
      actuators
    };
  }

  /* --- Árvore AVL Pura para Historiador SCADA --- */

  const AVL_INITIAL_EVENTS = deepFreeze([
    { timestamp: 1050, tag: "TIT-401", kind: "ANA", value: "186.4 °C", detail: "Leitura térmica estável" },
    { timestamp: 1030, tag: "SE-001", kind: "CoS", value: "72° OK", detail: "Indexação da mesa concluída" },
    { timestamp: 1010, tag: "ZS-102", kind: "CoS", value: "COPO=1", detail: "Copo confirmado na E1" },
    { timestamp: 1070, tag: "TIT-401", kind: "ANA", value: "184.2 °C", detail: "Zona térmica nominal" },
    { timestamp: 1090, tag: "PIT-301", kind: "CoS", value: "VAC=1", detail: "Tampa aderida na E3" },
    { timestamp: 1020, tag: "ZSC-203", kind: "CoS", value: "BICO=1", detail: "Abertura de bico confirmada" },
    { timestamp: 1015, tag: "SE-001", kind: "CoS", value: "144° OK", detail: "Pacote fora de ordem (retransmissão)" },
    { timestamp: 1040, tag: "TIT-401", kind: "ANA", value: "177.5 °C", detail: "Queda térmica — alerta R-02" },
    { timestamp: 1045, tag: "ZSC-401", kind: "CoS", value: "REC=1", detail: "Prensa recuada na E4" }
  ]);

  class AVLTree {
    constructor() {
      this.root = null;
      this._size = 0;
      this.rotations = { LL: 0, RR: 0, LR: 0, RL: 0, total: 0 };
      this.rotationLog = [];
    }

    get size() {
      return this._size;
    }

    getHeight(node = this.root) {
      return node ? node.height : 0;
    }

    getBalanceFactor(node) {
      return node ? this.getHeight(node.left) - this.getHeight(node.right) : 0;
    }

    _updateHeight(node) {
      node.height = 1 + Math.max(this.getHeight(node.left), this.getHeight(node.right));
      return node;
    }

    _rotateRight(y) {
      const x = y.left;
      const t2 = x.right;
      x.right = y;
      y.left = t2;
      this._updateHeight(y);
      this._updateHeight(x);
      return x;
    }

    _rotateLeft(x) {
      const y = x.right;
      const t2 = y.left;
      y.left = x;
      x.right = t2;
      this._updateHeight(x);
      this._updateHeight(y);
      return y;
    }

    _recordRotation(kind, pivotTimestamp, insertedTimestamp) {
      this.rotations[kind] += 1;
      this.rotations.total += 1;
      this.rotationLog.push({ kind, pivot: pivotTimestamp, trigger: insertedTimestamp });
    }

    insert(timestamp, payload = {}) {
      const ts = Number(timestamp);
      if (!Number.isFinite(ts)) {
        return { ok: false, reason: "timestamp inválido", updated: false, rotations: [] };
      }
      const stepRotations = [];
      let updated = false;

      const insertNode = (node) => {
        if (!node) {
          this._size += 1;
          return { timestamp: ts, payload: { ...payload }, height: 1, left: null, right: null };
        }
        if (ts < node.timestamp) {
          node.left = insertNode(node.left);
        } else if (ts > node.timestamp) {
          node.right = insertNode(node.right);
        } else {
          node.payload = { ...payload };
          updated = true;
          return node;
        }

        this._updateHeight(node);
        const bf = this.getBalanceFactor(node);

        if (bf > 1 && ts < node.left.timestamp) {
          this._recordRotation("LL", node.timestamp, ts);
          stepRotations.push({ kind: "LL", pivot: node.timestamp });
          return this._rotateRight(node);
        }
        if (bf < -1 && ts > node.right.timestamp) {
          this._recordRotation("RR", node.timestamp, ts);
          stepRotations.push({ kind: "RR", pivot: node.timestamp });
          return this._rotateLeft(node);
        }
        if (bf > 1 && ts > node.left.timestamp) {
          this._recordRotation("LR", node.timestamp, ts);
          stepRotations.push({ kind: "LR", pivot: node.timestamp });
          node.left = this._rotateLeft(node.left);
          return this._rotateRight(node);
        }
        if (bf < -1 && ts < node.right.timestamp) {
          this._recordRotation("RL", node.timestamp, ts);
          stepRotations.push({ kind: "RL", pivot: node.timestamp });
          node.right = this._rotateRight(node.right);
          return this._rotateLeft(node);
        }

        return node;
      };

      this.root = insertNode(this.root);
      return { ok: true, timestamp: ts, updated, rotations: stepRotations };
    }

    search(timestamp) {
      const ts = Number(timestamp);
      if (!Number.isFinite(ts)) return { found: false, node: null, path: [] };
      let current = this.root;
      const path = [];
      while (current) {
        path.push(current.timestamp);
        if (ts === current.timestamp) {
          return {
            found: true,
            node: {
              timestamp: current.timestamp,
              payload: { ...current.payload },
              height: current.height,
              bf: this.getBalanceFactor(current)
            },
            path
          };
        }
        current = ts < current.timestamp ? current.left : current.right;
      }
      return { found: false, node: null, path };
    }

    rangeQuery(tStart, tEnd) {
      const lo = Math.min(Number(tStart), Number(tEnd));
      const hi = Math.max(Number(tStart), Number(tEnd));
      if (!Number.isFinite(lo) || !Number.isFinite(hi)) return [];
      const results = [];

      const visit = (node) => {
        if (!node) return;
        if (node.timestamp > lo) visit(node.left);
        if (node.timestamp >= lo && node.timestamp <= hi) {
          results.push({
            timestamp: node.timestamp,
            payload: { ...node.payload },
            bf: this.getBalanceFactor(node)
          });
        }
        if (node.timestamp < hi) visit(node.right);
      };

      visit(this.root);
      return results;
    }

    inOrder() {
      const items = [];
      const walk = (node) => {
        if (!node) return;
        walk(node.left);
        items.push({
          timestamp: node.timestamp,
          payload: { ...node.payload },
          height: node.height,
          bf: this.getBalanceFactor(node)
        });
        walk(node.right);
      };
      walk(this.root);
      return items;
    }

    isBalanced(node = this.root) {
      const check = (curr, min, max) => {
        if (!curr) return { ok: true, height: 0 };
        if (curr.timestamp <= min || curr.timestamp >= max) return { ok: false, height: 0 };
        const left = check(curr.left, min, curr.timestamp);
        if (!left.ok) return { ok: false, height: 0 };
        const right = check(curr.right, curr.timestamp, max);
        if (!right.ok) return { ok: false, height: 0 };
        const expectedHeight = 1 + Math.max(left.height, right.height);
        const bf = left.height - right.height;
        return {
          ok: Math.abs(bf) <= 1 && curr.height === expectedHeight,
          height: expectedHeight
        };
      };
      return check(node, -Infinity, Infinity).ok;
    }

    toTreeLayout(width = 860, startY = 82, levelGap = 94) {
      if (!this.root) return { nodes: [], edges: [] };
      const nodes = [];
      const edges = [];
      const orderIndex = new Map();
      let cursor = 0;

      const indexInOrder = (node) => {
        if (!node) return;
        indexInOrder(node.left);
        orderIndex.set(node.timestamp, cursor);
        cursor += 1;
        indexInOrder(node.right);
      };
      indexInOrder(this.root);

      const count = Math.max(1, cursor);
      const marginX = 65;
      const usableW = Math.max(120, width - marginX * 2);

      const place = (node, depth, parentCoords) => {
        if (!node) return;
        const idx = orderIndex.get(node.timestamp);
        const x = count === 1 ? width / 2 : marginX + (idx / (count - 1)) * usableW;
        const y = startY + depth * levelGap;
        const entry = {
          timestamp: node.timestamp,
          payload: { ...node.payload },
          height: node.height,
          bf: this.getBalanceFactor(node),
          depth,
          x: round(x, 1),
          y: round(y, 1),
          parentTimestamp: parentCoords ? parentCoords.timestamp : null
        };
        nodes.push(entry);

        if (parentCoords) {
          edges.push({
            from: parentCoords.timestamp,
            to: node.timestamp,
            x1: parentCoords.x,
            y1: parentCoords.y,
            x2: entry.x,
            y2: entry.y,
            side: entry.timestamp < parentCoords.timestamp ? "L" : "R"
          });
        }
        place(node.left, depth + 1, entry);
        place(node.right, depth + 1, entry);
      };

      place(this.root, 0, null);
      return { nodes, edges };
    }
  }

  /* ============================================================================
   * MODO 4 — AULA 22: RRT CINEMÁTICO SE(2) NO REABASTECIMENTO EXTERNO MAG-100
   * ============================================================================ */

  const RRT_WORKSPACE = deepFreeze({
    width: 12.0,
    height: 7.0,
    robotRadius: 0.28,
    start: { x: 1.1, y: 1.15, theta: 0, label: "ESTOQUE_COPOS" },
    goal: { x: 10.7, y: 5.75, theta: 0, radius: 0.8, label: "MAG-100" },
    baseObstacles: [
      { id: "celula_envasadora", label: "Célula Envasadora", x: 3.9, y: 2.2, width: 3.0, height: 2.3 },
      { id: "painel_plc", label: "Painel PLC-001", x: 1.3, y: 4.6, width: 1.6, height: 1.35 },
      { id: "esteira_est500", label: "Esteira EST-500", x: 8.6, y: 1.0, width: 2.4, height: 1.4 }
    ],
    palletObstacle: { id: "palete_corredor", label: "Palete no Corredor", x: 4.8, y: 5.0, width: 1.5, height: 1.2 }
  });

  function mulberry32(seed) {
    let a = (Number(seed) || 1) >>> 0;
    return function nextRandom() {
      a = (a + 0x6d2b79f5) >>> 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function wrapAngle(angle) {
    let a = angle;
    while (a > Math.PI) a -= 2 * Math.PI;
    while (a < -Math.PI) a += 2 * Math.PI;
    return a;
  }

  function pointCollides(x, y, obstacles, radius, width, height) {
    if (x < radius || x > width - radius || y < radius || y > height - radius) return true;
    for (const obs of obstacles) {
      if (
        x >= obs.x - radius &&
        x <= obs.x + obs.width + radius &&
        y >= obs.y - radius &&
        y <= obs.y + obs.height + radius
      ) {
        return true;
      }
    }
    return false;
  }

  function segmentCollides(p1, p2, obstacles, radius, width, height, steps = 48) {
    for (let i = 0; i <= steps; i += 1) {
      const t = i / steps;
      const x = p1.x + (p2.x - p1.x) * t;
      const y = p1.y + (p2.y - p1.y) * t;
      if (pointCollides(x, y, obstacles, radius, width, height)) return true;
    }
    return false;
  }

  function verifyArborescence(nodes, edges) {
    if (!Array.isArray(nodes) || !Array.isArray(edges) || nodes.length === 0) {
      return { isArborescence: false, edgeCountValid: false };
    }
    const edgeCountValid = edges.length === nodes.length - 1;
    if (!edgeCountValid) return { isArborescence: false, edgeCountValid: false };

    const inDegree = new Map(nodes.map((n) => [n.id, 0]));
    const children = new Map(nodes.map((n) => [n.id, []]));
    for (const edge of edges) {
      if (!inDegree.has(edge.from) || !inDegree.has(edge.to)) {
        return { isArborescence: false, edgeCountValid };
      }
      inDegree.set(edge.to, inDegree.get(edge.to) + 1);
      children.get(edge.from).push(edge.to);
    }

    const roots = nodes.filter((n) => inDegree.get(n.id) === 0);
    if (roots.length !== 1 || roots[0].id !== 0) {
      return { isArborescence: false, edgeCountValid };
    }
    for (const n of nodes) {
      if (n.id !== 0 && inDegree.get(n.id) !== 1) {
        return { isArborescence: false, edgeCountValid };
      }
    }

    const visited = new Set([0]);
    const queue = [0];
    while (queue.length > 0) {
      const curr = queue.shift();
      for (const nxt of children.get(curr)) {
        if (visited.has(nxt)) return { isArborescence: false, edgeCountValid };
        visited.add(nxt);
        queue.push(nxt);
      }
    }

    return { isArborescence: visited.size === nodes.length, edgeCountValid };
  }

  function planRRT_SE2(options = {}) {
    const seed = Number.isFinite(Number(options.seed)) ? Number(options.seed) : 42;
    const goalBias = Math.min(0.6, Math.max(0.02, Number.isFinite(Number(options.goalBias)) ? Number(options.goalBias) : 0.16));
    const maxIterations = Math.max(50, Math.min(2500, Number.isInteger(options.maxIterations) ? options.maxIterations : 1200));
    const hs004Emergency = Boolean(options.hs004Emergency);
    const zs102Empty = options.zs102Empty === undefined ? true : Boolean(options.zs102Empty);
    const palletObstacle = Boolean(options.palletObstacle);

    const width = RRT_WORKSPACE.width;
    const height = RRT_WORKSPACE.height;
    const radius = RRT_WORKSPACE.robotRadius;
    const start = { ...RRT_WORKSPACE.start };
    const goal = { ...RRT_WORKSPACE.goal };

    const obstacles = palletObstacle
      ? [...RRT_WORKSPACE.baseObstacles, RRT_WORKSPACE.palletObstacle].map((o) => ({ ...o }))
      : RRT_WORKSPACE.baseObstacles.map((o) => ({ ...o }));

    const directCollides = segmentCollides(start, goal, obstacles, radius, width, height, 60);
    const rootNode = { id: 0, x: start.x, y: start.y, theta: start.theta, parentId: null, cost: 0 };

    if (hs004Emergency) {
      const arb = verifyArborescence([rootNode], []);
      return {
        ok: false,
        reason: "Bloqueio Φ_SCADA: emergência HS-004 acionada — célula travada.",
        phiScada: false,
        seed,
        goalBias,
        iterations: 0,
        nodes: [rootNode],
        edges: [],
        path: [],
        pathLength: 0,
        directCollides,
        prunedCount: 0,
        isArborescence: arb.isArborescence,
        edgeCountValid: arb.edgeCountValid,
        obstacles,
        start,
        goal
      };
    }

    if (!zs102Empty) {
      const arb = verifyArborescence([rootNode], []);
      return {
        ok: false,
        reason: "Reabastecimento em standby: magazine MAG-100 abastecido (ZS-102 normal).",
        phiScada: true,
        seed,
        goalBias,
        iterations: 0,
        nodes: [rootNode],
        edges: [],
        path: [],
        pathLength: 0,
        directCollides,
        prunedCount: 0,
        isArborescence: arb.isArborescence,
        edgeCountValid: arb.edgeCountValid,
        obstacles,
        start,
        goal
      };
    }

    const rng = mulberry32(seed);
    const nodes = [rootNode];
    const edges = [];
    let prunedCount = 0;
    let goalNode = null;
    let iterations = 0;

    // Modelo cinemático uniciclo/bicicleta em SE(2): ẋ = v cos θ, ẏ = v sin θ, θ̇ = ω
    const velocity = 0.9; // m/s
    const stepTime = 0.62; // s -> arco de ~0.558 m
    const substeps = 6;
    const dt = stepTime / substeps;
    const omegaCandidates = [-1.5, -1.0, -0.5, 0, 0.5, 1.0, 1.5];
    const angleWeight = 0.22;

    const se2Dist = (a, b) => {
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      const dTheta = Math.abs(wrapAngle(a.theta - b.theta));
      return Math.hypot(dx, dy) + angleWeight * dTheta;
    };

    for (let iter = 1; iter <= maxIterations; iter += 1) {
      iterations = iter;
      const sampleGoal = rng() < goalBias;
      const qRand = sampleGoal
        ? { x: goal.x, y: goal.y, theta: goal.theta }
        : {
            x: radius + rng() * (width - 2 * radius),
            y: radius + rng() * (height - 2 * radius),
            theta: (rng() * 2 - 1) * Math.PI
          };

      let nearest = nodes[0];
      let bestDist = Infinity;
      for (const n of nodes) {
        const d = se2Dist(n, qRand);
        if (d < bestDist) {
          bestDist = d;
          nearest = n;
        }
      }

      let bestCandidate = null;
      let bestCandDist = Infinity;

      for (const omega of omegaCandidates) {
        let cx = nearest.x;
        let cy = nearest.y;
        let cTheta = nearest.theta;
        let collided = false;
        const trail = [{ x: cx, y: cy, theta: cTheta }];

        for (let s = 0; s < substeps; s += 1) {
          const midTheta = cTheta + 0.5 * omega * dt;
          cx += velocity * Math.cos(midTheta) * dt;
          cy += velocity * Math.sin(midTheta) * dt;
          cTheta = wrapAngle(cTheta + omega * dt);
          if (pointCollides(cx, cy, obstacles, radius, width, height)) {
            collided = true;
            break;
          }
          trail.push({ x: cx, y: cy, theta: cTheta });
        }

        if (collided) continue;

        const cand = { x: cx, y: cy, theta: cTheta, omega, trail };
        const dGoal = Math.hypot(cx - qRand.x, cy - qRand.y) + 0.15 * Math.abs(wrapAngle(cTheta - qRand.theta));
        if (dGoal < bestCandDist) {
          bestCandDist = dGoal;
          bestCandidate = cand;
        }
      }

      if (!bestCandidate) {
        prunedCount += 1;
        continue;
      }

      const arcLen = velocity * stepTime;
      const newNode = {
        id: nodes.length,
        x: round(bestCandidate.x, 4),
        y: round(bestCandidate.y, 4),
        theta: round(bestCandidate.theta, 4),
        parentId: nearest.id,
        cost: round(nearest.cost + arcLen, 4)
      };

      nodes.push(newNode);
      edges.push({
        from: nearest.id,
        to: newNode.id,
        omega: bestCandidate.omega,
        length: round(arcLen, 4),
        trail: bestCandidate.trail.map((pt) => ({ x: round(pt.x, 3), y: round(pt.y, 3), theta: round(pt.theta, 3) }))
      });

      if (Math.hypot(newNode.x - goal.x, newNode.y - goal.y) <= goal.radius) {
        goalNode = newNode;
        break;
      }
    }

    const path = [];
    if (goalNode) {
      let cursor = goalNode;
      while (cursor !== null) {
        path.unshift(cursor);
        cursor = cursor.parentId === null ? null : nodes[cursor.parentId];
      }
    }

    const arb = verifyArborescence(nodes, edges);

    return {
      ok: Boolean(goalNode),
      reason: goalNode ? "" : "limite de iterações atingido sem alcançar a zona MAG-100",
      phiScada: true,
      seed,
      goalBias,
      iterations,
      nodes,
      edges,
      path,
      pathLength: goalNode ? goalNode.cost : 0,
      directCollides,
      prunedCount,
      isArborescence: arb.isArborescence,
      edgeCountValid: arb.edgeCountValid,
      obstacles,
      start,
      goal
    };
  }

  /* ============================================================================
   * EXPORTAÇÃO DA API PURA (NODE.JS & BROWSER)
   * ============================================================================ */

  const api = {
    MST_NODES,
    MST_EDGES,
    MST_GRAPH,
    kruskalMST,
    primMST,
    HUFFMAN_STATES,
    HUFFMAN_PROFILES,
    buildHuffmanTree,
    encodeHuffman,
    decodeHuffman,
    computeHuffmanMetrics,
    BDT_DEFAULT_STATE,
    BDT_NODES,
    BDT_PRESETS,
    evaluateBDT,
    AVL_INITIAL_EVENTS,
    AVLTree,
    RRT_WORKSPACE,
    mulberry32,
    planRRT_SE2
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }

  if (typeof document === "undefined") {
    return api;
  }

  /* ============================================================================
   * CAMADA DE INTERFACE E RENDERIZAÇÃO SVG (DOM BROWSER)
   * ============================================================================ */

  const $ = (root, selector) => (root ? root.querySelector(selector) : null);
  const $$ = (root, selector) => (root ? [...root.querySelectorAll(selector)] : []);
  const SVG_NS = "http://www.w3.org/2000/svg";

  function addEl(parent, tag, attrs = {}, text = "", isSvg = false) {
    const el = isSvg ? document.createElementNS(SVG_NS, tag) : document.createElement(tag);
    for (const [key, val] of Object.entries(attrs)) {
      if (val !== undefined && val !== null) el.setAttribute(key, String(val));
    }
    if (text !== undefined && text !== null && text !== "") el.textContent = String(text);
    if (parent) parent.append(el);
    return el;
  }

  function formatPt(num, digits = 2) {
    return Number(num).toFixed(digits).replace(".", ",");
  }

  /* --- 1. Navegação de Abas da Página ([data-etapa03-tabs]) --- */
  function initTabs() {
    const box = $(document, "[data-etapa03-tabs]");
    if (!box) return;
    document.body.classList.add("js-e03-ready");

    const tabs = $$(box, "[data-e03-tab]");
    const panels = $$(document, "[data-e03-panel]");
    if (!tabs.length) return;

    function select(id, focus = false) {
      const targetId = tabs.some((t) => t.dataset.e03Tab === id) ? id : tabs[0].dataset.e03Tab;
      tabs.forEach((tab) => {
        const on = tab.dataset.e03Tab === targetId;
        tab.setAttribute("role", "tab");
        tab.setAttribute("aria-selected", String(on));
        tab.classList.toggle("is-active", on);
        tab.tabIndex = on ? 0 : -1;
        if (on && focus) tab.focus();
      });
      panels.forEach((panel) => {
        const on = panel.dataset.e03Panel === targetId;
        panel.hidden = !on;
        panel.classList.toggle("is-active", on);
      });
      if (location.hash !== `#${targetId}`) {
        history.replaceState(null, "", `#${targetId}`);
      }
    }

    tabs.forEach((tab, index) => {
      tab.setAttribute("role", "tab");
      tab.addEventListener("click", () => select(tab.dataset.e03Tab));
      tab.addEventListener("keydown", (event) => {
        if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
        event.preventDefault();
        const nextIdx =
          event.key === "Home"
            ? 0
            : event.key === "End"
              ? tabs.length - 1
              : (index + (event.key === "ArrowRight" ? 1 : tabs.length - 1)) % tabs.length;
        select(tabs[nextIdx].dataset.e03Tab, true);
      });
    });

    window.addEventListener("hashchange", () => {
      const hashId = location.hash.replace(/^#/, "");
      if (tabs.some((t) => t.dataset.e03Tab === hashId)) {
        select(hashId, false);
      }
    });

    const initialHash = location.hash.replace(/^#/, "");
    select(tabs.some((t) => t.dataset.e03Tab === initialHash) ? initialHash : "apresentacao");
  }

  /* --- 2. Deck de Slides ([data-etapa03-deck]) --- */
  function initDeck() {
    const deck = $(document, "[data-etapa03-deck]");
    if (!deck) return;

    const slides = $$(deck, "[data-e03-slide]");
    if (!slides.length) return;
    const buttons = $$(deck, "[data-e03-go-slide]");
    const prevBtn = $(deck, "[data-e03-prev]");
    const nextBtn = $(deck, "[data-e03-next]");
    const countEl = $(deck, "[data-e03-slide-count]");
    const titleEl = $(deck, "[data-e03-slide-title]");
    const progressEl = $(deck, "[data-e03-progress]");

    let current = 0;

    function show(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach((slide, i) => {
        const on = i === current;
        slide.classList.toggle("is-current", on);
        slide.hidden = !on;
      });
      buttons.forEach((button, i) => {
        const on = i === current;
        button.classList.toggle("is-current", on);
        button.setAttribute("aria-current", on ? "true" : "false");
        if (slides[i] && slides[i].dataset.title) {
          button.setAttribute("aria-label", `Slide ${i + 1}: ${slides[i].dataset.title}`);
        }
      });
      if (countEl) {
        countEl.textContent = `${String(current + 1).padStart(2, "0")} / ${String(slides.length).padStart(2, "0")}`;
      }
      if (titleEl) {
        titleEl.textContent = slides[current].dataset.title || `Slide ${current + 1}`;
      }
      if (progressEl) {
        if ("max" in progressEl) progressEl.max = slides.length;
        if ("value" in progressEl) progressEl.value = current + 1;
        else progressEl.style.width = `${((current + 1) / slides.length) * 100}%`;
      }
    }

    buttons.forEach((btn, idx) => btn.addEventListener("click", () => show(idx)));
    if (prevBtn) prevBtn.addEventListener("click", () => show(current - 1));
    if (nextBtn) nextBtn.addEventListener("click", () => show(current + 1));

    deck.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        show(current - 1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        show(current + 1);
      }
    });

    show(0);
  }

  /* --- 3. Trilho de Arquivos ([data-e03-file-rail]) --- */
  function initFiles() {
    const rail = $(document, "[data-e03-file-rail]");
    if (!rail) return;

    $$(rail, 'a[href^="https://github.com/"]').forEach((link) => {
      link.target = "_blank";
      link.rel = "noopener";
    });

    const buttons = $$(rail, "[data-e03-file]");
    const panels = $$(document, "[data-e03-file-panel]");
    if (!buttons.length) return;

    rail.setAttribute("role", "tablist");
    rail.setAttribute("aria-label", "Arquivos da Etapa 03");

    buttons.forEach((button, index) => {
      const id = button.dataset.e03File;
      const panel = panels.find((p) => p.dataset.e03FilePanel === id);
      button.id = `e03-file-tab-${id}`;
      button.setAttribute("role", "tab");
      button.tabIndex = index === 0 ? 0 : -1;
      if (panel) {
        panel.id = `e03-file-panel-${id}`;
        panel.setAttribute("role", "tabpanel");
        panel.setAttribute("aria-labelledby", button.id);
        button.setAttribute("aria-controls", panel.id);
      }
    });

    function show(id, focus = false) {
      const validId = buttons.some((b) => b.dataset.e03File === id) ? id : buttons[0].dataset.e03File;
      buttons.forEach((button) => {
        const on = button.dataset.e03File === validId;
        button.classList.toggle("is-active", on);
        button.setAttribute("aria-selected", String(on));
        button.tabIndex = on ? 0 : -1;
        if (on && focus) button.focus();
      });
      panels.forEach((panel) => {
        const on = panel.dataset.e03FilePanel === validId;
        panel.classList.toggle("is-active", on);
        panel.hidden = !on;
      });
    }

    buttons.forEach((button, index) => {
      button.addEventListener("click", () => show(button.dataset.e03File));
      button.addEventListener("keydown", (event) => {
        if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
        event.preventDefault();
        const target =
          event.key === "Home"
            ? 0
            : event.key === "End"
              ? buttons.length - 1
              : (index + (event.key === "ArrowRight" ? 1 : buttons.length - 1)) % buttons.length;
        show(buttons[target].dataset.e03File, true);
      });
    });

    const defaultId = buttons.some((b) => b.dataset.e03File === "readme") ? "readme" : buttons[0].dataset.e03File;
    show(defaultId);
  }

  /* --- 4. Simulador Interativo ([data-etapa03-simulator]) --- */
  const MODE_META = {
    mst: {
      code: "AULA 19 · MST",
      title: "Kruskal e Prim — Infraestrutura SCADA e Pneumática",
      desc: "Árvore Geradora Mínima sobre os 8 módulos e 14 rotas físicas (25,8 m) da Aqua Index.",
      limit: "Limitação: MST minimiza extensão linear (CAPEX) sem garantir redundância N-1 ou equilíbrio de perda de carga."
    },
    huffman: {
      code: "AULA 20 · HUFFMAN",
      title: "Compressão Lossless de Telemetria SCADA",
      desc: "Codificação ótima livre de prefixo para os 6 estados binários de intertravamento (5 bits fixos).",
      limit: "Limitação: dicionário estático perde ganho se a distribuição real de falhas desviar do regime nominal."
    },
    binary: {
      code: "AULA 21 · BDT + AVL",
      title: "BDT Contextual da FSM e Historiador SCADA em Árvore AVL",
      desc: "Decisão hierárquica sensível ao ciclo da FSM e indexação balanceada O(log n) de eventos fora de ordem.",
      limit: "Limitação: a BDT aplica curto-circuito para ação prioritária; o SCADA precisa manter visíveis todos os alarmes simultâneos."
    },
    rrt: {
      code: "AULA 22 · RRT SE(2)",
      title: "RRT Cinemático SE(2) — Reabastecimento Externo MAG-100",
      desc: "Planejamento não-holonômico de AGV entre ESTOQUE_COPOS e MAG-100 condicionado à barreira Φ_SCADA.",
      limit: "Limitação: RRT clássico é probabilisticamente completo, mas gera rotas subótimas sem suavização ou RRT*."
    }
  };

  function initSimulator() {
    const root = $(document, "[data-etapa03-simulator]");
    if (!root) return;

    const modeButtons = $$(root, "[data-e03-mode]");
    const codeSlot = $(root, "[data-e03-mode-code]");
    const titleSlot = $(root, "[data-e03-mode-title]");
    const descSlot = $(root, "[data-e03-mode-desc]");
    const limitSlot = $(root, "[data-e03-mode-limit]");
    const controlsEl = $(root, "[data-e03-controls]");
    const runBtn = $(root, "[data-e03-run]");
    const resetBtn = $(root, "[data-e03-reset]");
    const svg = $(root, "[data-e03-svg]");
    const metricsEl = $(root, "[data-e03-metrics]");
    const outputEl = $(root, "[data-e03-output]");
    const logEl = $(root, "[data-e03-log]");

    const createInitialAVL = () => {
      const tree = new AVLTree();
      for (const evt of AVL_INITIAL_EVENTS) {
        tree.insert(evt.timestamp, { tag: evt.tag, kind: evt.kind, value: evt.value, detail: evt.detail });
      }
      return tree;
    };

    const state = {
      mode: "mst",
      mst: {
        algorithm: "kruskal",
        startNode: "PLC-001",
        blockedEdges: new Set()
      },
      huffman: {
        profile: "nominal",
        sequence: ["00000", "10000", "00000", "00100", "00001"]
      },
      binary: {
        subview: "bdt",
        bdtState: { ...BDT_DEFAULT_STATE, reqGiro: true },
        avl: createInitialAVL(),
        rangeStart: 1015,
        rangeEnd: 1055,
        newTimestamp: 1035,
        newTag: "PIT-301",
        newValue: "VAC=0"
      },
      rrt: {
        zs102Empty: true,
        hs004Emergency: false,
        palletObstacle: false,
        seed: 42,
        goalBias: 0.16
      },
      logs: []
    };

    function pushLog(message) {
      state.logs.unshift(message);
      state.logs = state.logs.slice(0, 6);
      if (!logEl) return;
      logEl.replaceChildren();
      for (const line of state.logs) {
        addEl(logEl, "li", {}, line);
      }
    }

    function renderMetrics(items) {
      if (!metricsEl) return;
      metricsEl.replaceChildren();
      for (const item of items) {
        const card = addEl(metricsEl, "div", { class: `e03-metric ${item.tone ? `is-${item.tone}` : ""}` });
        addEl(card, "span", { class: "e03-metric-label" }, item.label);
        addEl(card, "strong", { class: "e03-metric-value" }, item.value);
        if (item.sub) addEl(card, "small", { class: "e03-metric-sub" }, item.sub);
      }
    }

    function resetSvg() {
      if (!svg) return null;
      svg.setAttribute("viewBox", "0 0 960 540");
      svg.replaceChildren();
      const defs = addEl(svg, "defs", {}, "", true);
      const marker = addEl(
        defs,
        "marker",
        { id: "e03-arrow", viewBox: "0 0 10 10", refX: 8, refY: 5, markerWidth: 7, markerHeight: 7, orient: "auto" },
        "",
        true
      );
      addEl(marker, "path", { d: "M 0 1 L 10 5 L 0 9 z", fill: "var(--e03-accent, #0f766e)" }, "", true);
      return defs;
    }

    function renderControls() {
      if (!controlsEl) return;
      controlsEl.replaceChildren();

      if (state.mode === "mst") {
        const row = addEl(controlsEl, "div", { class: "e03-control-row" });
        const algWrap = addEl(row, "label", { class: "e03-field" }, "Algoritmo MST");
        const algSel = addEl(algWrap, "select", { "data-e03-mst-algo": "" });
        [
          ["kruskal", "Kruskal (Arestas / Union-Find)"],
          ["prim", "Prim (Fronteira / Min-Heap)"]
        ].forEach(([val, lbl]) => {
          const opt = addEl(algSel, "option", { value: val }, lbl);
          if (state.mst.algorithm === val) opt.selected = true;
        });
        algSel.addEventListener("change", () => {
          state.mst.algorithm = algSel.value;
          renderControls();
          run();
        });

        const startWrap = addEl(row, "label", { class: "e03-field" }, "Nó inicial (Prim)");
        const startSel = addEl(startWrap, "select", { "data-e03-mst-start": "" });
        startSel.disabled = state.mst.algorithm !== "prim";
        MST_NODES.forEach((n) => {
          const opt = addEl(startSel, "option", { value: n.id }, `${n.id} (${n.code})`);
          if (state.mst.startNode === n.id) opt.selected = true;
        });
        startSel.addEventListener("change", () => {
          state.mst.startNode = startSel.value;
          run();
        });

        const blockBox = addEl(controlsEl, "fieldset", { class: "e03-check-grid" });
        addEl(blockBox, "legend", {}, "Simular bloqueio de trechos (clique aqui ou nas arestas do SVG)");
        MST_EDGES.forEach((edge) => {
          const lbl = addEl(blockBox, "label", { class: "e03-check-item" });
          const cb = addEl(lbl, "input", { type: "checkbox", value: edge.id });
          cb.checked = state.mst.blockedEdges.has(edge.id);
          cb.addEventListener("change", () => {
            if (cb.checked) state.mst.blockedEdges.add(edge.id);
            else state.mst.blockedEdges.delete(edge.id);
            run();
          });
          addEl(lbl, "span", {}, `${edge.id}: ${edge.from}–${edge.to} (${formatPt(edge.weight, 1)} m)`);
        });
        return;
      }

      if (state.mode === "huffman") {
        const row = addEl(controlsEl, "div", { class: "e03-control-row" });
        const profWrap = addEl(row, "label", { class: "e03-field" }, "Perfil Operacional SCADA");
        const profSel = addEl(profWrap, "select", { "data-e03-huff-profile": "" });
        Object.values(HUFFMAN_PROFILES).forEach((p) => {
          const opt = addEl(profSel, "option", { value: p.id }, p.name);
          if (state.huffman.profile === p.id) opt.selected = true;
        });
        profSel.addEventListener("change", () => {
          state.huffman.profile = profSel.value;
          run();
        });

        const seqBox = addEl(controlsEl, "fieldset", { class: "e03-seq-grid" });
        addEl(seqBox, "legend", {}, "Sequência de 5 quadros para teste Lossless (Encode → Decode)");
        state.huffman.sequence.forEach((sym, idx) => {
          const wrap = addEl(seqBox, "label", { class: "e03-field e03-field-compact" }, `Q${idx + 1}`);
          const sel = addEl(wrap, "select", { "data-e03-huff-seq": idx });
          HUFFMAN_STATES.forEach((st) => {
            const opt = addEl(sel, "option", { value: st.symbol }, `${st.symbol} · ${st.tag}`);
            if (st.symbol === sym) opt.selected = true;
          });
          sel.addEventListener("change", () => {
            state.huffman.sequence[idx] = sel.value;
            run();
          });
        });
        return;
      }

      if (state.mode === "binary") {
        const subRow = addEl(controlsEl, "div", { class: "e03-subview-bar" });
        [
          ["bdt", "BDT Contextual (FSM)"],
          ["avl", "Árvore AVL (Historiador)"]
        ].forEach(([key, label]) => {
          const btn = addEl(
            subRow,
            "button",
            {
              type: "button",
              class: `e03-subview-btn ${state.binary.subview === key ? "is-active" : ""}`,
              "aria-pressed": String(state.binary.subview === key)
            },
            label
          );
          btn.addEventListener("click", () => {
            state.binary.subview = key;
            renderControls();
            run();
          });
        });

        if (state.binary.subview === "bdt") {
          const presetRow = addEl(controlsEl, "div", { class: "e03-control-row" });
          const presetWrap = addEl(presetRow, "label", { class: "e03-field" }, "Cenário Rápido da Envasadora");
          const presetSel = addEl(presetWrap, "select", { "data-e03-bdt-preset": "" });
          addEl(presetSel, "option", { value: "" }, "— Selecionar cenário —");
          Object.values(BDT_PRESETS).forEach((p) => {
            addEl(presetSel, "option", { value: p.id }, p.label);
          });
          presetSel.addEventListener("change", () => {
            const chosen = BDT_PRESETS[presetSel.value];
            if (!chosen) return;
            state.binary.bdtState = { ...chosen.state };
            renderControls();
            run();
          });

          const tempWrap = addEl(presetRow, "label", { class: "e03-field" }, `TIT-401 (${state.binary.bdtState.tempC_TIT401} °C)`);
          const tempInput = addEl(tempWrap, "input", {
            type: "range",
            min: 140,
            max: 210,
            step: 1,
            value: state.binary.bdtState.tempC_TIT401
          });
          tempInput.addEventListener("input", () => {
            state.binary.bdtState.tempC_TIT401 = Number(tempInput.value);
            tempWrap.firstChild.textContent = `TIT-401 (${state.binary.bdtState.tempC_TIT401} °C)`;
            run();
          });

          const fsmBox = addEl(controlsEl, "fieldset", { class: "e03-check-grid" });
          addEl(fsmBox, "legend", {}, "Contexto da FSM (Solicitações de Ciclo)");
          [
            ["reqGiro", "reqGiro (Giro Mesa M-001)"],
            ["reqDose", "reqDose (Dosador XV-202)"],
            ["reqPrensa", "reqPrensa (Prensa XV-401)"],
            ["reqBraco", "reqBraco (Braço XV-301)"],
            ["posDispensa", "posDispensa (Pós-Dispensa E1)"]
          ].forEach(([key, label]) => {
            const lbl = addEl(fsmBox, "label", { class: "e03-check-item" });
            const cb = addEl(lbl, "input", { type: "checkbox" });
            cb.checked = Boolean(state.binary.bdtState[key]);
            cb.addEventListener("change", () => {
              state.binary.bdtState[key] = cb.checked;
              run();
            });
            addEl(lbl, "span", {}, label);
          });

          const sensBox = addEl(controlsEl, "fieldset", { class: "e03-check-grid" });
          addEl(sensBox, "legend", {}, "Sensores ISA-5.1");
          [
            ["e1_HS004", "e1 · HS-004 Emergência (1 = TRIP)"],
            ["sensorConflict_R06", "R-06 · Conflito Fim de Curso (1 = Falha)"],
            ["c7r_ZSC401", "c7r · ZSC-401 Prensa Recuada (1 = OK)"],
            ["c4_ZSC203", "c4 · ZSC-203 Bico Aberto (1 = OK)"],
            ["p1_PIT301", "p1 · PIT-301 Vácuo OK (1 = OK)"],
            ["s1_ZS102", "s1 · ZS-102 Copo Presente (1 = OK)"]
          ].forEach(([key, label]) => {
            const lbl = addEl(sensBox, "label", { class: "e03-check-item" });
            const cb = addEl(lbl, "input", { type: "checkbox" });
            cb.checked = Boolean(state.binary.bdtState[key]);
            cb.addEventListener("change", () => {
              state.binary.bdtState[key] = cb.checked;
              run();
            });
            addEl(lbl, "span", {}, label);
          });
        } else {
          const insRow = addEl(controlsEl, "div", { class: "e03-control-row" });
          const tsWrap = addEl(insRow, "label", { class: "e03-field" }, "Novo Timestamp (ms)");
          const tsInput = addEl(tsWrap, "input", { type: "number", value: state.binary.newTimestamp, step: 1 });
          tsInput.addEventListener("input", () => {
            state.binary.newTimestamp = Number(tsInput.value);
          });

          const tagWrap = addEl(insRow, "label", { class: "e03-field" }, "Tag ISA-5.1");
          const tagSel = addEl(tagWrap, "select", {});
          ["TIT-401", "SE-001", "PIT-301", "ZS-102", "ZSC-203", "HS-004"].forEach((t) => {
            const opt = addEl(tagSel, "option", { value: t }, t);
            if (state.binary.newTag === t) opt.selected = true;
          });
          tagSel.addEventListener("change", () => {
            state.binary.newTag = tagSel.value;
          });

          const insBtn = addEl(insRow, "button", { type: "button", class: "e03-inline-btn" }, "Inserir Evento AVL");
          insBtn.addEventListener("click", () => {
            const res = state.binary.avl.insert(state.binary.newTimestamp, {
              tag: state.binary.newTag,
              kind: "CoS",
              value: state.binary.newValue,
              detail: "Evento inserido interativamente"
            });
            const rotTxt = res.rotations.length
              ? `Rotações: ${res.rotations.map((r) => `${r.kind}@${r.pivot}`).join(", ")}`
              : "Sem rotação";
            pushLog(`AVL insert(${state.binary.newTimestamp}, ${state.binary.newTag}): ${rotTxt}.`);
            state.binary.newTimestamp += 3;
            tsInput.value = state.binary.newTimestamp;
            run();
          });

          const qRow = addEl(controlsEl, "div", { class: "e03-control-row" });
          const loWrap = addEl(qRow, "label", { class: "e03-field" }, "Consulta t1 (ms)");
          const loInput = addEl(loWrap, "input", { type: "number", value: state.binary.rangeStart, step: 5 });
          loInput.addEventListener("change", () => {
            state.binary.rangeStart = Number(loInput.value);
            run();
          });

          const hiWrap = addEl(qRow, "label", { class: "e03-field" }, "Consulta t2 (ms)");
          const hiInput = addEl(hiWrap, "input", { type: "number", value: state.binary.rangeEnd, step: 5 });
          hiInput.addEventListener("change", () => {
            state.binary.rangeEnd = Number(hiInput.value);
            run();
          });
        }
        return;
      }

      if (state.mode === "rrt") {
        const checks = addEl(controlsEl, "fieldset", { class: "e03-check-grid" });
        addEl(checks, "legend", {}, "Condições SCADA (Φ_SCADA) e Obstáculos do Corredor");
        [
          ["zs102Empty", "Alarme ZS-102 (Magazine vazio — dispara reabastecimento)"],
          ["hs004Emergency", "Emergência HS-004 (Φ_SCADA bloqueia célula)"],
          ["palletObstacle", "Palete no corredor (obstáculo móvel)"]
        ].forEach(([key, label]) => {
          const lbl = addEl(checks, "label", { class: "e03-check-item" });
          const cb = addEl(lbl, "input", { type: "checkbox" });
          cb.checked = Boolean(state.rrt[key]);
          cb.addEventListener("change", () => {
            state.rrt[key] = cb.checked;
            run();
          });
          addEl(lbl, "span", {}, label);
        });

        const row = addEl(controlsEl, "div", { class: "e03-control-row" });
        const seedWrap = addEl(row, "label", { class: "e03-field" }, "Seed PRNG (Mulberry32)");
        const seedSel = addEl(seedWrap, "select", { "data-e03-rrt-seed": "" });
        [42, 7, 108, 314, 2025].forEach((s) => {
          const opt = addEl(seedSel, "option", { value: s }, `Seed ${s}`);
          if (state.rrt.seed === s) opt.selected = true;
        });
        seedSel.addEventListener("change", () => {
          state.rrt.seed = Number(seedSel.value);
          run();
        });

        const biasWrap = addEl(row, "label", { class: "e03-field" }, `Goal Bias (${Math.round(state.rrt.goalBias * 100)}%)`);
        const biasInput = addEl(biasWrap, "input", {
          type: "range",
          min: 0.05,
          max: 0.35,
          step: 0.01,
          value: state.rrt.goalBias
        });
        biasInput.addEventListener("input", () => {
          state.rrt.goalBias = Number(biasInput.value);
          biasWrap.firstChild.textContent = `Goal Bias (${Math.round(state.rrt.goalBias * 100)}%)`;
          run();
        });
      }
    }

    function renderMSTView() {
      const res =
        state.mst.algorithm === "prim"
          ? primMST(MST_EDGES, MST_NODES, state.mst.startNode, { blockedEdges: state.mst.blockedEdges })
          : kruskalMST(MST_EDGES, MST_NODES, { blockedEdges: state.mst.blockedEdges });

      resetSvg();
      const pos = new Map(MST_NODES.map((n) => [n.id, n]));
      const mstSet = new Set(res.edgeIds);

      addEl(
        svg,
        "circle",
        {
          cx: 470,
          cy: 270,
          r: 178,
          fill: "none",
          stroke: "var(--e03-border, #cbd5e1)",
          "stroke-width": 1.5,
          "stroke-dasharray": "6 6",
          opacity: 0.7
        },
        "",
        true
      );
      addEl(
        svg,
        "text",
        {
          x: 470,
          y: 44,
          "text-anchor": "middle",
          fill: "var(--e03-muted, #64748b)",
          "font-size": 12,
          "font-weight": 600
        },
        `TOPOLOGIA AQUA INDEX · ${state.mst.algorithm === "prim" ? `PRIM (RAIZ: ${state.mst.startNode})` : "KRUSKAL (UNION-FIND)"}`,
        true
      );

      const edgeLayer = addEl(svg, "g", { class: "e03-mst-edges" }, "", true);
      const labelLayer = addEl(svg, "g", { class: "e03-mst-labels" }, "", true);
      const nodeLayer = addEl(svg, "g", { class: "e03-mst-nodes" }, "", true);

      MST_EDGES.forEach((edge) => {
        const a = pos.get(edge.from);
        const b = pos.get(edge.to);
        const isBlocked = state.mst.blockedEdges.has(edge.id);
        const isMst = mstSet.has(edge.id);

        const stroke = isBlocked
          ? "var(--e03-danger, #dc2626)"
          : isMst
            ? "var(--e03-accent, #0f766e)"
            : "var(--e03-border, #94a3b8)";

        const line = addEl(
          edgeLayer,
          "line",
          {
            x1: a.x,
            y1: a.y,
            x2: b.x,
            y2: b.y,
            stroke,
            "stroke-width": isMst ? 4 : isBlocked ? 2.5 : 1.75,
            "stroke-dasharray": isMst ? "" : isBlocked ? "4 4" : "6 5",
            opacity: isMst ? 1 : isBlocked ? 0.85 : 0.45,
            class: `e03-svg-edge ${isMst ? "is-mst" : ""} ${isBlocked ? "is-blocked" : ""}`,
            "data-e03-edge": edge.id,
            role: "button",
            tabindex: "0",
            style: "cursor:pointer"
          },
          "",
          true
        );

        const toggle = () => {
          if (state.mst.blockedEdges.has(edge.id)) state.mst.blockedEdges.delete(edge.id);
          else state.mst.blockedEdges.add(edge.id);
          renderControls();
          run();
        };
        line.addEventListener("click", toggle);
        line.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            toggle();
          }
        });

        const mx = (a.x + b.x) / 2;
        const my = (a.y + b.y) / 2;
        const badge = addEl(labelLayer, "g", {}, "", true);
        addEl(
          badge,
          "rect",
          {
            x: mx - 23,
            y: my - 10,
            width: 46,
            height: 20,
            rx: 5,
            fill: isMst ? "var(--e03-accent, #0f766e)" : "var(--e03-surface, #ffffff)",
            stroke: isBlocked ? "var(--e03-danger, #dc2626)" : isMst ? "var(--e03-accent, #0f766e)" : "var(--e03-border, #cbd5e1)",
            "stroke-width": 1
          },
          "",
          true
        );
        addEl(
          badge,
          "text",
          {
            x: mx,
            y: my + 4,
            "text-anchor": "middle",
            "font-size": 10.5,
            "font-weight": isMst ? 700 : 500,
            fill: isMst ? "#ffffff" : isBlocked ? "var(--e03-danger, #dc2626)" : "var(--e03-muted, #475569)"
          },
          `${formatPt(edge.weight, 1)}m`,
          true
        );
      });

      MST_NODES.forEach((node) => {
        const isRoot = state.mst.algorithm === "prim" && node.id === state.mst.startNode;
        const isIsolated = state.mst.algorithm === "prim" && (res.unvisitedNodes || []).includes(node.id);
        const g = addEl(nodeLayer, "g", { class: "e03-svg-node" }, "", true);
        addEl(
          g,
          "rect",
          {
            x: node.x - 58,
            y: node.y - 24,
            width: 116,
            height: 48,
            rx: 10,
            fill: isRoot ? "var(--e03-accent, #0f766e)" : "var(--e03-surface, #ffffff)",
            stroke: isIsolated ? "var(--e03-danger, #dc2626)" : "var(--e03-accent, #0f766e)",
            "stroke-width": isRoot ? 2.5 : 1.75
          },
          "",
          true
        );
        addEl(
          g,
          "text",
          {
            x: node.x,
            y: node.y - 3,
            "text-anchor": "middle",
            "font-size": 12,
            "font-weight": 700,
            fill: isRoot ? "#ffffff" : "var(--e03-ink, #0f172a)"
          },
          node.id,
          true
        );
        addEl(
          g,
          "text",
          {
            x: node.x,
            y: node.y + 13,
            "text-anchor": "middle",
            "font-size": 10,
            fill: isRoot ? "#e2f5f2" : "var(--e03-muted, #64748b)"
          },
          `${node.code} · ${node.sector}`,
          true
        );
      });

      renderMetrics([
        { label: "Extensão MST", value: res.ok ? `${formatPt(res.totalWeight, 1)} m` : "Desconexa", tone: res.ok ? "ok" : "danger" },
        { label: "Arestas Selecionadas", value: `${res.edges.length} / ${MST_NODES.length - 1}`, sub: `Bloqueadas: ${state.mst.blockedEdges.size}` },
        { label: "Redução vs Malha", value: res.ok ? `${formatPt(res.reductionPct, 1)}%` : "—", sub: `Malha cheia: ${formatPt(res.fullWeight, 1)} m` },
        { label: "Conectividade", value: res.ok ? "Árvore Válida" : "Sem MST", tone: res.ok ? "ok" : "danger" }
      ]);

      if (outputEl) {
        outputEl.replaceChildren();
        addEl(
          outputEl,
          "p",
          { class: "e03-out-summary" },
          res.ok
            ? `${state.mst.algorithm === "prim" ? `Prim (raiz ${state.mst.startNode})` : "Kruskal"} conectou os 8 módulos em ${formatPt(res.totalWeight, 1)} m (economia de ${formatPt(res.reductionPct, 1)}%).`
            : `Falha topológica: ${res.reason}.`
        );
        const list = addEl(outputEl, "ol", { class: "e03-out-list" });
        res.edges.forEach((e) => {
          addEl(list, "li", {}, `${e.id}: ${e.from} ↔ ${e.to} — ${formatPt(e.weight, 1)} m`);
        });
      }

      pushLog(
        res.ok
          ? `MST (${state.mst.algorithm}): ${formatPt(res.totalWeight, 1)} m (${res.edges.length} trechos, -${formatPt(res.reductionPct, 1)}%).`
          : `MST (${state.mst.algorithm}): ${res.reason}.`
      );
    }

    function renderHuffmanView() {
      const profile = HUFFMAN_PROFILES[state.huffman.profile] || HUFFMAN_PROFILES.nominal;
      const symbols = HUFFMAN_STATES.map((item) => ({
        ...item,
        prob: profile.probs[item.symbol]
      }));
      const built = buildHuffmanTree(symbols);
      const metrics = computeHuffmanMetrics(symbols, built.codes, 5);
      const encoded = encodeHuffman(state.huffman.sequence, built.codes);
      const decoded = decodeHuffman(encoded.bitstring, built.root);
      const losslessOk =
        decoded.ok &&
        decoded.sequence.length === state.huffman.sequence.length &&
        decoded.sequence.every((sym, idx) => sym === state.huffman.sequence[idx]);

      resetSvg();
      addEl(
        svg,
        "text",
        {
          x: 480,
          y: 32,
          "text-anchor": "middle",
          fill: "var(--e03-muted, #64748b)",
          "font-size": 12,
          "font-weight": 600
        },
        `ÁRVORE BINÁRIA DE HUFFMAN · PERFIL: ${profile.name.toUpperCase()} (ESQ = 0 · DIR = 1)`,
        true
      );

      const leafOrder = [];
      const collectLeaves = (node) => {
        if (!node) return;
        if (node.isLeaf) leafOrder.push(node);
        else {
          collectLeaves(node.left);
          collectLeaves(node.right);
        }
      };
      collectLeaves(built.root);

      const maxDepth = (() => {
        const depthOf = (n, d) => (!n ? d - 1 : Math.max(depthOf(n.left, d + 1), depthOf(n.right, d + 1)));
        return Math.max(1, depthOf(built.root, 0));
      })();

      const coords = new Map();
      const marginX = 92;
      const usableW = 960 - marginX * 2;
      const topY = 74;
      const levelGap = Math.min(82, (465 - topY) / maxDepth);

      const assignCoords = (node, depth) => {
        if (!node) return 0;
        if (node.isLeaf) {
          const idx = leafOrder.indexOf(node);
          const x = leafOrder.length === 1 ? 480 : marginX + (idx / (leafOrder.length - 1)) * usableW;
          const y = topY + depth * levelGap;
          coords.set(node, { x, y });
          return x;
        }
        const lx = assignCoords(node.left, depth + 1);
        const rx = assignCoords(node.right, depth + 1);
        const x = (lx + rx) / 2;
        const y = topY + depth * levelGap;
        coords.set(node, { x, y });
        return x;
      };
      assignCoords(built.root, 0);

      const edgeLayer = addEl(svg, "g", {}, "", true);
      const nodeLayer = addEl(svg, "g", {}, "", true);

      const drawEdges = (node) => {
        if (!node || node.isLeaf) return;
        const p = coords.get(node);
        [
          [node.left, "0"],
          [node.right, "1"]
        ].forEach(([child, bit]) => {
          if (!child) return;
          const c = coords.get(child);
          addEl(
            edgeLayer,
            "line",
            {
              x1: p.x,
              y1: p.y + 18,
              x2: c.x,
              y2: c.y - 20,
              stroke: bit === "0" ? "var(--e03-accent-2, #0369a1)" : "var(--e03-accent, #0f766e)",
              "stroke-width": 2.2
            },
            "",
            true
          );
          const mx = (p.x + c.x) / 2;
          const my = (p.y + c.y) / 2;
          addEl(
            edgeLayer,
            "circle",
            {
              cx: mx,
              cy: my,
              r: 10,
              fill: "var(--e03-surface, #ffffff)",
              stroke: bit === "0" ? "var(--e03-accent-2, #0369a1)" : "var(--e03-accent, #0f766e)",
              "stroke-width": 1.4
            },
            "",
            true
          );
          addEl(
            edgeLayer,
            "text",
            {
              x: mx,
              y: my + 4,
              "text-anchor": "middle",
              "font-size": 11,
              "font-weight": 700,
              fill: bit === "0" ? "var(--e03-accent-2, #0369a1)" : "var(--e03-accent, #0f766e)"
            },
            bit,
            true
          );
          drawEdges(child);
        });
      };
      drawEdges(built.root);

      const drawNodes = (node) => {
        if (!node) return;
        const { x, y } = coords.get(node);
        if (node.isLeaf) {
          addEl(
            nodeLayer,
            "rect",
            {
              x: x - 58,
              y: y - 24,
              width: 116,
              height: 58,
              rx: 9,
              fill: "var(--e03-surface, #ffffff)",
              stroke: "var(--e03-accent, #0f766e)",
              "stroke-width": 2
            },
            "",
            true
          );
          addEl(
            nodeLayer,
            "text",
            { x, y: y - 8, "text-anchor": "middle", "font-size": 11.5, "font-weight": 700, fill: "var(--e03-ink, #0f172a)" },
            `${node.symbol} · ${node.tag}`,
            true
          );
          addEl(
            nodeLayer,
            "text",
            { x, y: y + 8, "text-anchor": "middle", "font-size": 10.5, fill: "var(--e03-muted, #475569)" },
            `P=${formatPt(node.weight, 3)}`,
            true
          );
          addEl(
            nodeLayer,
            "text",
            { x, y: y + 25, "text-anchor": "middle", "font-size": 11.5, "font-weight": 700, fill: "var(--e03-accent, #0f766e)" },
            `Cód: ${node.code}`,
            true
          );
        } else {
          addEl(
            nodeLayer,
            "rect",
            {
              x: x - 44,
              y: y - 18,
              width: 88,
              height: 36,
              rx: 18,
              fill: "var(--e03-panel, #f1f5f9)",
              stroke: "var(--e03-border, #64748b)",
              "stroke-width": 1.6
            },
            "",
            true
          );
          addEl(
            nodeLayer,
            "text",
            { x, y: y - 2, "text-anchor": "middle", "font-size": 11, "font-weight": 700, fill: "var(--e03-ink, #0f172a)" },
            node === built.root ? "RAIZ" : node.id,
            true
          );
          addEl(
            nodeLayer,
            "text",
            { x, y: y + 12, "text-anchor": "middle", "font-size": 10, fill: "var(--e03-muted, #475569)" },
            formatPt(node.weight, 3),
            true
          );
          drawNodes(node.left);
          drawNodes(node.right);
        }
      };
      drawNodes(built.root);

      renderMetrics([
        { label: "Entropia H(S)", value: `${formatPt(metrics.entropy, 4)} bits`, sub: `Eficiência: ${formatPt(metrics.efficiencyPct, 1)}%` },
        { label: "Comprimento Médio L", value: `${formatPt(metrics.avgLength, 4)} bits`, sub: "vs 5 bits fixos" },
        { label: "Redução de Banda", value: `${formatPt(metrics.reductionPct, 2)}%`, tone: "ok" },
        { label: "Kraft Σ2^(-l)", value: formatPt(metrics.kraftSum, 4), sub: metrics.isPrefixFree ? "Livre de prefixo" : "Inválido", tone: "ok" }
      ]);

      if (outputEl) {
        outputEl.replaceChildren();
        addEl(
          outputEl,
          "p",
          { class: "e03-out-summary" },
          `Roundtrip 5 quadros (${encoded.originalBits} → ${encoded.compressedBits} bits, -${formatPt(encoded.savingPct, 1)}%): ${losslessOk ? "LOSSLESS CONFIRMADO" : "ERRO"}.`
        );
        addEl(outputEl, "p", { class: "e03-mono" }, `Bitstream: ${encoded.bitstring}`);
        const list = addEl(outputEl, "ul", { class: "e03-out-list" });
        symbols.forEach((s) => {
          const code = built.codes[s.symbol];
          addEl(list, "li", {}, `${s.symbol} (${s.tag}) · P=${formatPt(s.prob, 3)} → ${code} (${code.length} bit${code.length > 1 ? "s" : ""})`);
        });
      }

      pushLog(`Huffman (${profile.name}): H=${formatPt(metrics.entropy, 4)}, L=${formatPt(metrics.avgLength, 4)}, -${formatPt(metrics.reductionPct, 2)}%.`);
    }

    function renderBinaryView() {
      resetSvg();

      if (state.binary.subview === "bdt") {
        const res = evaluateBDT(state.binary.bdtState);
        const visited = new Set(res.pathNodes);

        addEl(
          svg,
          "text",
          { x: 480, y: 28, "text-anchor": "middle", fill: "var(--e03-muted, #64748b)", "font-size": 12, "font-weight": 600 },
          "ÁRVORE DE DECISÃO BINÁRIA CONTEXTUAL (BDT) · AVALIAÇÃO POR PRIORIDADE SIL",
          true
        );

        const startX = 240;
        const leafX = 690;
        const startY = 66;
        const gapY = 62;

        BDT_NODES.forEach((node, idx) => {
          const y = startY + idx * gapY;
          const active = visited.has(node.id);
          const tookYes = visited.has(node.yesLeaf);
          const nextNode = BDT_NODES[idx + 1];
          const nextId = nextNode ? nextNode.id : "L_OPERACAO_NORMAL";
          const tookNo = active && visited.has(nextId);

          addEl(
            svg,
            "line",
            {
              x1: startX + 108,
              y1: y,
              x2: leafX - 132,
              y2: y,
              stroke: tookYes ? "var(--e03-danger, #dc2626)" : "var(--e03-border, #cbd5e1)",
              "stroke-width": tookYes ? 3.2 : 1.5
            },
            "",
            true
          );
          addEl(
            svg,
            "text",
            {
              x: (startX + 108 + leafX - 132) / 2,
              y: y - 6,
              "text-anchor": "middle",
              "font-size": 10.5,
              "font-weight": 700,
              fill: tookYes ? "var(--e03-danger, #dc2626)" : "var(--e03-muted, #64748b)"
            },
            "SIM",
            true
          );

          addEl(
            svg,
            "line",
            {
              x1: startX,
              y1: y + 22,
              x2: startX,
              y2: y + gapY - 22,
              stroke: tookNo ? "var(--e03-accent, #0f766e)" : "var(--e03-border, #cbd5e1)",
              "stroke-width": tookNo ? 3.2 : 1.5
            },
            "",
            true
          );
          addEl(
            svg,
            "text",
            {
              x: startX - 24,
              y: y + gapY / 2 + 4,
              "text-anchor": "middle",
              "font-size": 10,
              "font-weight": 700,
              fill: tookNo ? "var(--e03-accent, #0f766e)" : "var(--e03-muted, #94a3b8)"
            },
            "NÃO",
            true
          );

          addEl(
            svg,
            "rect",
            {
              x: startX - 108,
              y: y - 22,
              width: 216,
              height: 44,
              rx: 8,
              fill: active ? "var(--e03-panel, #ecfdf5)" : "var(--e03-surface, #ffffff)",
              stroke: tookYes ? "var(--e03-danger, #dc2626)" : active ? "var(--e03-accent, #0f766e)" : "var(--e03-border, #cbd5e1)",
              "stroke-width": active ? 2.4 : 1.4
            },
            "",
            true
          );
          addEl(
            svg,
            "text",
            { x: startX, y: y - 4, "text-anchor": "middle", "font-size": 11.5, "font-weight": 700, fill: "var(--e03-ink, #0f172a)" },
            `N${node.level} · ${node.title} (${node.rule})`,
            true
          );
          addEl(
            svg,
            "text",
            { x: startX, y: y + 13, "text-anchor": "middle", "font-size": 10.5, fill: "var(--e03-muted, #475569)" },
            node.expr,
            true
          );

          addEl(
            svg,
            "rect",
            {
              x: leafX - 132,
              y: y - 18,
              width: 264,
              height: 36,
              rx: 7,
              fill: tookYes ? "var(--e03-danger, #dc2626)" : "var(--e03-surface, #ffffff)",
              stroke: tookYes ? "var(--e03-danger, #dc2626)" : "var(--e03-border, #cbd5e1)",
              "stroke-width": tookYes ? 2.2 : 1.2
            },
            "",
            true
          );
          addEl(
            svg,
            "text",
            {
              x: leafX,
              y: y + 4,
              "text-anchor": "middle",
              "font-size": 11,
              "font-weight": 700,
              fill: tookYes ? "#ffffff" : "var(--e03-muted, #64748b)"
            },
            node.yesAction,
            true
          );
        });

        const normalY = startY + BDT_NODES.length * gapY;
        const isNormal = visited.has("L_OPERACAO_NORMAL");
        addEl(
          svg,
          "rect",
          {
            x: startX - 108,
            y: normalY - 19,
            width: 216,
            height: 38,
            rx: 19,
            fill: isNormal ? "var(--e03-ok, #15803d)" : "var(--e03-surface, #ffffff)",
            stroke: isNormal ? "var(--e03-ok, #15803d)" : "var(--e03-border, #cbd5e1)",
            "stroke-width": isNormal ? 2.4 : 1.4
          },
          "",
          true
        );
        addEl(
          svg,
          "text",
          {
            x: startX,
            y: normalY + 4,
            "text-anchor": "middle",
            "font-size": 11.5,
            "font-weight": 700,
            fill: isNormal ? "#ffffff" : "var(--e03-muted, #64748b)"
          },
          "OPERACAO_NORMAL",
          true
        );

        renderMetrics([
          { label: "Ação Prioritária", value: res.action, tone: res.level === 0 ? "ok" : "danger" },
          { label: "Severidade / Nível", value: `${res.severity} (N${res.level})`, sub: `Regra ${res.rule}` },
          { label: "Alarmes Simultâneos", value: String(res.activeAlarms.length), sub: `Suprimidos na BDT: ${res.suppressedAlarms.length}` },
          { label: "Nós Avaliados", value: `${res.pathNodes.length}`, sub: "Caminho curto-circuitado" }
        ]);

        if (outputEl) {
          outputEl.replaceChildren();
          addEl(outputEl, "p", { class: "e03-out-summary" }, res.message);
          addEl(
            outputEl,
            "p",
            { class: "e03-mono" },
            `Atuadores: M-001=${res.actuators.m0_M001 ? 1 : 0} · XV-202=${res.actuators.v3_XV202 ? 1 : 0} · XV-401=${res.actuators.v8_XV401 ? 1 : 0} · XV-301=${res.actuators.v5_XV301 ? 1 : 0} · HT-401=${res.actuators.h1_HT401 ? 1 : 0}`
          );
          if (res.activeAlarms.length) {
            const list = addEl(outputEl, "ul", { class: "e03-out-list" });
            res.activeAlarms.forEach((a, idx) => {
              addEl(list, "li", {}, `${idx === 0 ? "[PRIORITÁRIO] " : "[SIMULTÂNEO] "}${a.rule} (${a.tag}) → ${a.action}: ${a.message}`);
            });
          }
        }

        pushLog(`BDT: ${res.action} (${res.severity}) · ${res.activeAlarms.length} alarme(s) ativo(s).`);
        return;
      }

      const avl = state.binary.avl;
      const layout = avl.toTreeLayout(900, 82, 95);
      const rangeMatches = avl.rangeQuery(state.binary.rangeStart, state.binary.rangeEnd);
      const matchSet = new Set(rangeMatches.map((m) => m.timestamp));

      addEl(
        svg,
        "text",
        { x: 480, y: 30, "text-anchor": "middle", fill: "var(--e03-muted, #64748b)", "font-size": 12, "font-weight": 600 },
        `ÁRVORE AVL DO HISTORIADOR SCADA · CONSULTA [${Math.min(state.binary.rangeStart, state.binary.rangeEnd)}, ${Math.max(state.binary.rangeStart, state.binary.rangeEnd)}] ms`,
        true
      );

      const offsetX = 30;
      layout.edges.forEach((e) => {
        addEl(
          svg,
          "line",
          {
            x1: e.x1 + offsetX,
            y1: e.y1 + 22,
            x2: e.x2 + offsetX,
            y2: e.y2 - 22,
            stroke: "var(--e03-border, #94a3b8)",
            "stroke-width": 2
          },
          "",
          true
        );
      });

      layout.nodes.forEach((n) => {
        const hit = matchSet.has(n.timestamp);
        const cx = n.x + offsetX;
        const cy = n.y;
        addEl(
          svg,
          "rect",
          {
            x: cx - 44,
            y: cy - 24,
            width: 88,
            height: 48,
            rx: 9,
            fill: hit ? "var(--e03-accent, #0f766e)" : "var(--e03-surface, #ffffff)",
            stroke: hit ? "var(--e03-accent, #0f766e)" : "var(--e03-border, #64748b)",
            "stroke-width": hit ? 2.4 : 1.6
          },
          "",
          true
        );
        addEl(
          svg,
          "text",
          { x: cx, y: cy - 6, "text-anchor": "middle", "font-size": 12, "font-weight": 700, fill: hit ? "#ffffff" : "var(--e03-ink, #0f172a)" },
          `${n.timestamp}`,
          true
        );
        addEl(
          svg,
          "text",
          { x: cx, y: cy + 9, "text-anchor": "middle", "font-size": 10, fill: hit ? "#e2f5f2" : "var(--e03-muted, #475569)" },
          `${n.payload.tag || "TAG"} · BF=${n.bf > 0 ? `+${n.bf}` : n.bf}`,
          true
        );
      });

      const rots = avl.rotations;
      renderMetrics([
        { label: "Eventos Indexados", value: String(avl.size), sub: `Altura h = ${avl.getHeight()}` },
        { label: "Invariante AVL", value: avl.isBalanced() ? "|BF| ≤ 1 OK" : "Violada", tone: avl.isBalanced() ? "ok" : "danger" },
        { label: "Rotações Totais", value: String(rots.total), sub: `LL:${rots.LL} RR:${rots.RR} LR:${rots.LR} RL:${rots.RL}` },
        { label: "No Intervalo", value: `${rangeMatches.length} evento(s)`, sub: `[${state.binary.rangeStart}, ${state.binary.rangeEnd}] ms` }
      ]);

      if (outputEl) {
        outputEl.replaceChildren();
        addEl(
          outputEl,
          "p",
          { class: "e03-out-summary" },
          `Consulta por intervalo [${Math.min(state.binary.rangeStart, state.binary.rangeEnd)}, ${Math.max(state.binary.rangeStart, state.binary.rangeEnd)}] retornou ${rangeMatches.length} evento(s) ordenados em O(log n + k).`
        );
        const list = addEl(outputEl, "ul", { class: "e03-out-list" });
        rangeMatches.forEach((m) => {
          addEl(list, "li", {}, `t=${m.timestamp} ms · ${m.payload.tag || "SCADA"} (${m.payload.value || ""}) — ${m.payload.detail || ""}`);
        });
      }

      pushLog(`AVL: ${avl.size} nós, h=${avl.getHeight()}, ${rots.total} rotações, ${rangeMatches.length} no intervalo.`);
    }

    function renderRRTView() {
      const res = planRRT_SE2({
        seed: state.rrt.seed,
        goalBias: state.rrt.goalBias,
        hs004Emergency: state.rrt.hs004Emergency,
        zs102Empty: state.rrt.zs102Empty,
        palletObstacle: state.rrt.palletObstacle
      });

      resetSvg();

      const padL = 54;
      const padT = 46;
      const mapW = 852;
      const mapH = 456;
      const sx = (x) => padL + (x / RRT_WORKSPACE.width) * mapW;
      const sy = (y) => padT + mapH - (y / RRT_WORKSPACE.height) * mapH;
      const sw = (w) => (w / RRT_WORKSPACE.width) * mapW;
      const sh = (h) => (h / RRT_WORKSPACE.height) * mapH;

      addEl(
        svg,
        "text",
        { x: 480, y: 26, "text-anchor": "middle", fill: "var(--e03-muted, #64748b)", "font-size": 12, "font-weight": 600 },
        `PLANTA LOGÍSTICA EXTERNA (12 m × 7 m) · RRT SE(2) · SEED=${res.seed}`,
        true
      );

      addEl(
        svg,
        "rect",
        {
          x: padL,
          y: padT,
          width: mapW,
          height: mapH,
          rx: 8,
          fill: "var(--e03-panel, #f8fafc)",
          stroke: "var(--e03-border, #cbd5e1)",
          "stroke-width": 1.5
        },
        "",
        true
      );

      for (let gx = 1; gx < RRT_WORKSPACE.width; gx += 1) {
        addEl(svg, "line", { x1: sx(gx), y1: padT, x2: sx(gx), y2: padT + mapH, stroke: "var(--e03-border, #e2e8f0)", "stroke-width": 0.8 }, "", true);
      }
      for (let gy = 1; gy < RRT_WORKSPACE.height; gy += 1) {
        addEl(svg, "line", { x1: padL, y1: sy(gy), x2: padL + mapW, y2: sy(gy), stroke: "var(--e03-border, #e2e8f0)", "stroke-width": 0.8 }, "", true);
      }

      res.obstacles.forEach((obs) => {
        const rx = sx(obs.x);
        const ry = sy(obs.y + obs.height);
        const rw = sw(obs.width);
        const rh = sh(obs.height);
        addEl(
          svg,
          "rect",
          {
            x: rx,
            y: ry,
            width: rw,
            height: rh,
            rx: 6,
            fill: obs.id === "palete_corredor" ? "var(--e03-warn, #f59e0b)" : "var(--e03-border, #cbd5e1)",
            "fill-opacity": obs.id === "palete_corredor" ? 0.32 : 0.65,
            stroke: obs.id === "palete_corredor" ? "var(--e03-warn, #d97706)" : "var(--e03-muted, #475569)",
            "stroke-width": 1.8
          },
          "",
          true
        );
        addEl(
          svg,
          "text",
          {
            x: rx + rw / 2,
            y: ry + rh / 2 + 4,
            "text-anchor": "middle",
            "font-size": 11.5,
            "font-weight": 700,
            fill: "var(--e03-ink, #1e293b)"
          },
          obs.label,
          true
        );
      });

      addEl(
        svg,
        "line",
        {
          x1: sx(res.start.x),
          y1: sy(res.start.y),
          x2: sx(res.goal.x),
          y2: sy(res.goal.y),
          stroke: "var(--e03-danger, #dc2626)",
          "stroke-width": 1.8,
          "stroke-dasharray": "6 5",
          opacity: 0.7
        },
        "",
        true
      );

      const treeLayer = addEl(svg, "g", { opacity: 0.55 }, "", true);
      res.edges.forEach((edge) => {
        if (edge.trail && edge.trail.length > 1) {
          const d = edge.trail
            .map((pt, i) => `${i === 0 ? "M" : "L"} ${sx(pt.x).toFixed(1)} ${sy(pt.y).toFixed(1)}`)
            .join(" ");
          addEl(treeLayer, "path", { d, fill: "none", stroke: "var(--e03-accent-2, #0284c7)", "stroke-width": 1.2 }, "", true);
        } else {
          const a = res.nodes[edge.from];
          const b = res.nodes[edge.to];
          addEl(
            treeLayer,
            "line",
            { x1: sx(a.x), y1: sy(a.y), x2: sx(b.x), y2: sy(b.y), stroke: "var(--e03-accent-2, #0284c7)", "stroke-width": 1.2 },
            "",
            true
          );
        }
      });

      if (res.ok && res.path.length > 1) {
        const edgeByTo = new Map(res.edges.map((e) => [e.to, e]));
        const pathPts = [];
        for (let i = 1; i < res.path.length; i += 1) {
          const e = edgeByTo.get(res.path[i].id);
          if (e && e.trail) {
            e.trail.forEach((pt, idx) => {
              if (i === 1 || idx > 0) pathPts.push(pt);
            });
          } else {
            pathPts.push(res.path[i]);
          }
        }
        const dPath = pathPts
          .map((pt, i) => `${i === 0 ? "M" : "L"} ${sx(pt.x).toFixed(1)} ${sy(pt.y).toFixed(1)}`)
          .join(" ");
        addEl(
          svg,
          "path",
          {
            d: dPath,
            fill: "none",
            stroke: "var(--e03-accent, #0f766e)",
            "stroke-width": 4,
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
          },
          "",
          true
        );

        const stepArrow = Math.max(1, Math.floor(res.path.length / 8));
        for (let i = 1; i < res.path.length; i += stepArrow) {
          const p = res.path[i];
          const px = sx(p.x);
          const py = sy(p.y);
          const dx = Math.cos(p.theta) * 16;
          const dy = -Math.sin(p.theta) * 16;
          addEl(
            svg,
            "line",
            {
              x1: px - dx * 0.4,
              y1: py - dy * 0.4,
              x2: px + dx,
              y2: py + dy,
              stroke: "var(--e03-accent, #0f766e)",
              "stroke-width": 2.2,
              "marker-end": "url(#e03-arrow)"
            },
            "",
            true
          );
        }
      }

      const startX = sx(res.start.x);
      const startY = sy(res.start.y);
      addEl(svg, "circle", { cx: startX, cy: startY, r: 10, fill: "var(--e03-accent-2, #0369a1)", stroke: "#ffffff", "stroke-width": 2.2 }, "", true);
      addEl(svg, "text", { x: startX, y: startY + 24, "text-anchor": "middle", "font-size": 11, "font-weight": 700, fill: "var(--e03-ink, #0f172a)" }, "ESTOQUE_COPOS", true);

      const goalX = sx(res.goal.x);
      const goalY = sy(res.goal.y);
      addEl(
        svg,
        "circle",
        {
          cx: goalX,
          cy: goalY,
          r: sw(res.goal.radius),
          fill: "var(--e03-accent, #0f766e)",
          "fill-opacity": 0.14,
          stroke: "var(--e03-accent, #0f766e)",
          "stroke-dasharray": "4 3",
          "stroke-width": 1.6
        },
        "",
        true
      );
      addEl(svg, "circle", { cx: goalX, cy: goalY, r: 9, fill: "var(--e03-ok, #15803d)", stroke: "#ffffff", "stroke-width": 2.2 }, "", true);
      addEl(svg, "text", { x: goalX, y: goalY - 16, "text-anchor": "middle", "font-size": 11, "font-weight": 700, fill: "var(--e03-ink, #0f172a)" }, "MAG-100", true);

      if (state.rrt.hs004Emergency) {
        addEl(
          svg,
          "rect",
          { x: 250, y: 235, width: 460, height: 68, rx: 10, fill: "var(--e03-danger, #dc2626)", opacity: 0.94 },
          "",
          true
        );
        addEl(
          svg,
          "text",
          { x: 480, y: 266, "text-anchor": "middle", "font-size": 15, "font-weight": 700, fill: "#ffffff" },
          "BLOQUEIO Φ_SCADA · EMERGÊNCIA HS-004 ATIVA",
          true
        );
        addEl(
          svg,
          "text",
          { x: 480, y: 288, "text-anchor": "middle", "font-size": 11.5, fill: "#fee2e2" },
          "Expansão da árvore RRT abortada por intertravamento de segurança.",
          true
        );
      }

      renderMetrics([
        { label: "Status RRT SE(2)", value: res.ok ? "Rota Segura" : "Bloqueado", tone: res.ok ? "ok" : "danger" },
        { label: "Árvore |V| / |E|", value: `${res.nodes.length} / ${res.edges.length}`, sub: res.isArborescence && res.edgeCountValid ? "Arborescência válida" : "Inválida" },
        { label: "Extensão da Rota", value: res.ok ? `${formatPt(res.pathLength, 2)} m` : "—", sub: `Linha reta: ${res.directCollides ? "colide" : "livre"}` },
        { label: "Podas por Colisão", value: String(res.prunedCount), sub: `Iterações: ${res.iterations}` }
      ]);

      if (outputEl) {
        outputEl.replaceChildren();
        addEl(
          outputEl,
          "p",
          { class: "e03-out-summary" },
          res.ok
            ? `Trajetória não-holonômica encontrada em ${res.iterations} iterações (${res.path.length} poses SE(2), ${formatPt(res.pathLength, 2)} m). Linha reta direta colide com a Célula Envasadora.`
            : res.reason
        );
        addEl(
          outputEl,
          "p",
          { class: "e03-mono" },
          `Φ_SCADA=${res.phiScada ? 1 : 0} · |E|=|V|-1: ${res.edgeCountValid ? "SIM" : "NÃO"} · Arborescência: ${res.isArborescence ? "SIM" : "NÃO"}`
        );
      }

      pushLog(
        res.ok
          ? `RRT SE(2) [seed=${res.seed}]: rota ${formatPt(res.pathLength, 2)} m (${res.nodes.length} nós, ${res.prunedCount} podas).`
          : `RRT SE(2): ${res.reason}`
      );
    }

    function run() {
      if (state.mode === "mst") renderMSTView();
      else if (state.mode === "huffman") renderHuffmanView();
      else if (state.mode === "binary") renderBinaryView();
      else if (state.mode === "rrt") renderRRTView();
    }

    function changeMode(modeId, focus = false) {
      if (!MODE_META[modeId]) return;
      state.mode = modeId;
      const meta = MODE_META[modeId];

      modeButtons.forEach((btn) => {
        const on = btn.dataset.e03Mode === modeId;
        btn.setAttribute("aria-pressed", String(on));
        btn.classList.toggle("is-active", on);
        if (on && focus) btn.focus();
      });

      if (codeSlot) codeSlot.textContent = meta.code;
      if (titleSlot) titleSlot.textContent = meta.title;
      if (descSlot) descSlot.textContent = meta.desc;
      if (limitSlot) limitSlot.textContent = meta.limit;
      if (svg) svg.setAttribute("aria-label", `Visualização interativa — ${meta.title}`);

      renderControls();
      run();
    }

    modeButtons.forEach((btn, index) => {
      btn.addEventListener("click", () => changeMode(btn.dataset.e03Mode));
      btn.addEventListener("keydown", (event) => {
        if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
        event.preventDefault();
        const target =
          event.key === "Home"
            ? 0
            : event.key === "End"
              ? modeButtons.length - 1
              : (index + (event.key === "ArrowRight" ? 1 : modeButtons.length - 1)) % modeButtons.length;
        changeMode(modeButtons[target].dataset.e03Mode, true);
      });
    });

    if (runBtn) runBtn.addEventListener("click", run);

    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        if (state.mode === "mst") {
          state.mst.algorithm = "kruskal";
          state.mst.startNode = "PLC-001";
          state.mst.blockedEdges.clear();
        } else if (state.mode === "huffman") {
          state.huffman.profile = "nominal";
          state.huffman.sequence = ["00000", "10000", "00000", "00100", "00001"];
        } else if (state.mode === "binary") {
          state.binary.bdtState = { ...BDT_DEFAULT_STATE, reqGiro: true };
          state.binary.avl = createInitialAVL();
          state.binary.rangeStart = 1015;
          state.binary.rangeEnd = 1055;
        } else if (state.mode === "rrt") {
          state.rrt = { zs102Empty: true, hs004Emergency: false, palletObstacle: false, seed: 42, goalBias: 0.16 };
        }
        pushLog(`Estado do modo ${state.mode.toUpperCase()} restaurado.`);
        renderControls();
        run();
      });
    }

    changeMode("mst");
  }

  function init() {
    initTabs();
    initDeck();
    initFiles();
    initSimulator();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }

  return api;
})();
