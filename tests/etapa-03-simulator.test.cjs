const test = require("node:test");
const assert = require("node:assert/strict");
const sim = require("../doc/js/etapa-03-simulator.js");

/* ============================================================================
 * 0. INTEGRIDADE E IMUTABILIDADE DOS DADOS CONGELADOS
 * ============================================================================ */

test("Constantes exportadas são congeladas (Object.freeze) e íntegras", () => {
  assert.ok(Object.isFrozen(sim.MST_NODES));
  assert.ok(Object.isFrozen(sim.MST_EDGES));
  assert.ok(Object.isFrozen(sim.MST_GRAPH));
  assert.ok(Object.isFrozen(sim.HUFFMAN_STATES));
  assert.ok(Object.isFrozen(sim.HUFFMAN_PROFILES));
  assert.ok(Object.isFrozen(sim.BDT_DEFAULT_STATE));
  assert.ok(Object.isFrozen(sim.AVL_INITIAL_EVENTS));
  assert.ok(Object.isFrozen(sim.RRT_WORKSPACE));

  assert.equal(sim.MST_NODES.length, 8);
  assert.equal(sim.MST_EDGES.length, 14);
  assert.equal(sim.MST_GRAPH.totalMeshWeight, 25.8);
  assert.equal(sim.HUFFMAN_STATES.length, 6);
});

/* ============================================================================
 * 1. MODO MST — AULA 19 (KRUSKAL E PRIM NA AQUA INDEX)
 * ============================================================================ */

test("Kruskal e Prim convergem exatamente para 9,9 m (7 arestas, redução de 61,6%) sem mutar dados", () => {
  const snapshot = JSON.stringify({ nodes: sim.MST_NODES, edges: sim.MST_EDGES });

  const kruskal = sim.kruskalMST(sim.MST_EDGES, sim.MST_NODES);
  const prim = sim.primMST(sim.MST_EDGES, sim.MST_NODES, "PLC-001");

  assert.equal(kruskal.ok, true);
  assert.equal(prim.ok, true);
  assert.equal(kruskal.edges.length, 7);
  assert.equal(prim.edges.length, 7);
  assert.equal(kruskal.totalWeight, 9.9);
  assert.equal(prim.totalWeight, 9.9);
  assert.equal(kruskal.reductionPct, 61.6);
  assert.equal(prim.reductionPct, 61.6);

  // Mesmo conjunto exato de arestas na MST única da Aula 19
  assert.deepEqual([...kruskal.edgeIds].sort(), [...prim.edgeIds].sort());
  assert.deepEqual([...kruskal.edgeIds].sort(), ["e01", "e02", "e03", "e04", "e05", "e06", "e08"]);

  // Ordem exata de expansão de Prim a partir de PLC-001 (Tabela da Aula 19)
  assert.deepEqual(
    prim.steps.map((s) => s.addedNode),
    ["E1-DISP", "E2-ENV", "E3-TAMP", "E4-SEL", "E5-EJEC", "EST-501", "MESA-001"]
  );

  // Independência da raiz no Prim
  for (const node of sim.MST_NODES) {
    const p = sim.primMST(sim.MST_EDGES, sim.MST_NODES, node.id);
    assert.equal(p.ok, true);
    assert.equal(p.totalWeight, 9.9, `Prim a partir de ${node.id} deve resultar em 9,9 m`);
  }

  assert.equal(JSON.stringify({ nodes: sim.MST_NODES, edges: sim.MST_EDGES }), snapshot);
});

test("MST reconfigura após bloqueio de trecho e detecta desconexão quando um módulo fica isolado", () => {
  // Bloquear e08 (PLC-001 <-> E1-DISP, 1.8m) força uso de e10 (PLC-001 <-> MESA-001, 2.0m) => 10.1m
  const blockedOne = new Set(["e08"]);
  const kAlt = sim.kruskalMST(sim.MST_EDGES, sim.MST_NODES, { blockedEdges: blockedOne });
  const pAlt = sim.primMST(sim.MST_EDGES, sim.MST_NODES, "PLC-001", { blockedEdges: blockedOne });

  assert.equal(kAlt.ok, true);
  assert.equal(pAlt.ok, true);
  assert.equal(kAlt.totalWeight, 10.1);
  assert.equal(pAlt.totalWeight, 10.1);
  assert.ok(kAlt.edgeIds.includes("e10"));
  assert.ok(!kAlt.edgeIds.includes("e08"));

  // Isolar EST-501 bloqueando e01 e e14 => grafo desconexo
  const isolateEst = new Set(["e01", "e14"]);
  const kDisc = sim.kruskalMST(sim.MST_EDGES, sim.MST_NODES, { blockedEdges: isolateEst });
  const pDisc = sim.primMST(sim.MST_EDGES, sim.MST_NODES, "PLC-001", { blockedEdges: isolateEst });

  assert.equal(kDisc.ok, false);
  assert.equal(kDisc.connected, false);
  assert.equal(kDisc.componentsCount, 2);
  assert.equal(pDisc.ok, false);
  assert.equal(pDisc.connected, false);
  assert.deepEqual(pDisc.unvisitedNodes, ["EST-501"]);

  // Raiz inválida no Prim
  assert.equal(sim.primMST(sim.MST_EDGES, sim.MST_NODES, "INEXISTENTE").ok, false);
});

/* ============================================================================
 * 2. MODO HUFFMAN — AULA 20 (COMPRESSÃO DE TELEMETRIA SCADA)
 * ============================================================================ */

test("Huffman nominal reproduz exatamente códigos, entropia 0.7588, L=1.2350, redução 75.30% e Kraft=1", () => {
  const snapshot = JSON.stringify(sim.HUFFMAN_STATES);
  const built = sim.buildHuffmanTree(sim.HUFFMAN_STATES);

  assert.equal(built.ok, true);
  assert.deepEqual(built.codes, {
    "00000": "1",
    "10000": "00",
    "00100": "010",
    "00010": "0111",
    "01000": "01101",
    "00001": "01100"
  });

  const metrics = sim.computeHuffmanMetrics(sim.HUFFMAN_STATES, built.codes, 5);
  assert.equal(metrics.ok, true);
  assert.ok(Math.abs(metrics.entropy - 0.7588) < 0.0005, `Entropia obtida: ${metrics.entropy}`);
  assert.equal(metrics.avgLength, 1.235);
  assert.equal(metrics.reductionPct, 75.3);
  assert.equal(metrics.kraftSum, 1);
  assert.equal(metrics.isPrefixFree, true);
  assert.equal(JSON.stringify(sim.HUFFMAN_STATES), snapshot);
});

test("Huffman garante roundtrip lossless (encode → decode === original) e trata erros/perfis alternativos", () => {
  const built = sim.buildHuffmanTree(sim.HUFFMAN_STATES);
  const seq = ["00000", "10000", "00000", "00100", "00010", "01000", "00001", "00000", "00000", "10000"];

  const enc = sim.encodeHuffman(seq, built.codes);
  assert.equal(enc.ok, true);
  assert.equal(enc.originalBits, 50);
  assert.ok(enc.compressedBits < enc.originalBits);

  const dec = sim.decodeHuffman(enc.bitstring, built.root);
  assert.equal(dec.ok, true);
  assert.deepEqual(dec.sequence, seq);

  // Também aceita passar o objeto `built` completo em decodeHuffman
  const decFromObj = sim.decodeHuffman(enc.bitstring, built);
  assert.equal(decFromObj.ok, true);
  assert.deepEqual(decFromObj.sequence, seq);

  // Símbolo desconhecido e bitstring inválido/truncado
  assert.equal(sim.encodeHuffman(["99999"], built.codes).ok, false);
  assert.equal(sim.decodeHuffman("0102", built.root).ok, false);
  assert.equal(sim.decodeHuffman("0110", built.root).ok, false);

  // Perfis alternativos mantêm Kraft = 1 e prefix-free
  for (const profile of Object.values(sim.HUFFMAN_PROFILES)) {
    const syms = sim.HUFFMAN_STATES.map((s) => ({ ...s, prob: profile.probs[s.symbol] }));
    const tree = sim.buildHuffmanTree(syms);
    const m = sim.computeHuffmanMetrics(syms, tree.codes, 5);
    assert.equal(m.kraftSum, 1, `Kraft != 1 no perfil ${profile.id}`);
    assert.equal(m.isPrefixFree, true, `Código não livre de prefixo no perfil ${profile.id}`);
  }
});

/* ============================================================================
 * 3A. MODO BINARY — AULA 21 (BDT CONTEXTUAL DA FSM)
 * ============================================================================ */

test("BDT Contextual prova que ¬c7r_ZSC401 sem reqGiro NÃO dispara bloqueio de colisão", () => {
  // Durante a selagem ativa, a prensa está abaixada (c7r_ZSC401=false), mas a mesa NÃO solicitou giro (reqGiro=false)
  const sealing = sim.evaluateBDT({
    reqGiro: false,
    reqPrensa: true,
    c7r_ZSC401: false,
    tempC_TIT401: 186
  });

  assert.equal(sealing.action, "OPERACAO_NORMAL");
  assert.equal(sealing.level, 0);
  assert.equal(sealing.activeAlarms.length, 0);
  assert.equal(sealing.actuators.v8_XV401, true);
  assert.equal(sealing.actuators.m0_M001, false);

  // Agora, com reqGiro=true e c7r_ZSC401=false, R-01 dispara BLOQUEIO_COLISAO_MESA
  const collision = sim.evaluateBDT({
    reqGiro: true,
    c7r_ZSC401: false
  });
  assert.equal(collision.action, "BLOQUEIO_COLISAO_MESA");
  assert.equal(collision.level, 3);
  assert.equal(collision.rule, "R-01");
  assert.equal(collision.actuators.m0_M001, false);
  assert.equal(collision.activeAlarms.length, 1);
  assert.ok(collision.pathNodes.includes("N3_COLISAO_R01"));
  assert.ok(collision.pathNodes.includes("L_BLOQUEIO_COLISAO_MESA"));
});

test("BDT Contextual respeita hierarquia completa de 7 níveis e preserva TODOS os alarmes simultâneos", () => {
  assert.equal(sim.evaluateBDT({ e1_HS004: true }).action, "TRIP_EMERGENCIA");
  assert.equal(sim.evaluateBDT({ sensorConflict_R06: true }).action, "TRAVA_SENSOR_MAGNETICO");
  assert.equal(sim.evaluateBDT({ reqGiro: true, c7r_ZSC401: false }).action, "BLOQUEIO_COLISAO_MESA");
  assert.equal(sim.evaluateBDT({ reqDose: true, c4_ZSC203: false }).action, "BLOQUEIO_DOSADOR");
  assert.equal(sim.evaluateBDT({ reqPrensa: true, tempC_TIT401: 175 }).action, "HOLD_ESTAGIO_4");
  assert.equal(sim.evaluateBDT({ reqBraco: true, p1_PIT301: false }).action, "HOLD_ESTAGIO_3");
  assert.equal(sim.evaluateBDT({ posDispensa: true, s1_ZS102: false }).action, "ALARME_REABASTECIMENTO");
  assert.equal(sim.evaluateBDT({ reqGiro: true }).action, "OPERACAO_NORMAL");

  // Falhas simultâneas: BDT faz curto-circuito no nível 1 (TRIP_EMERGENCIA),
  // mas activeAlarms lista todas as 5 falhas simultâneas para o supervisório SCADA
  const multi = sim.evaluateBDT({
    e1_HS004: true,
    sensorConflict_R06: true,
    reqGiro: true,
    c7r_ZSC401: false,
    reqPrensa: true,
    tempC_TIT401: 160,
    posDispensa: true,
    s1_ZS102: false
  });

  assert.equal(multi.action, "TRIP_EMERGENCIA");
  assert.equal(multi.severity, "EMERGENCIA");
  assert.equal(multi.level, 1);
  assert.deepEqual(multi.pathNodes, ["N1_EMERGENCIA", "L_TRIP_EMERGENCIA"]);
  assert.equal(multi.activeAlarms.length, 5);
  assert.equal(multi.suppressedAlarms.length, 4);
  assert.deepEqual(
    multi.activeAlarms.map((a) => a.action),
    [
      "TRIP_EMERGENCIA",
      "TRAVA_SENSOR_MAGNETICO",
      "BLOQUEIO_COLISAO_MESA",
      "HOLD_ESTAGIO_4",
      "ALARME_REABASTECIMENTO"
    ]
  );
  assert.equal(multi.actuators.h1_HT401, false);
  assert.equal(multi.actuators.il002_Emergencia, true);
});

/* ============================================================================
 * 3B. MODO BINARY — AULA 21 (ÁRVORE AVL DO HISTORIADOR SCADA)
 * ============================================================================ */

test("AVLTree mantém invariante |BF| <= 1, executa rotações LL/RR/LR/RL e responde rangeQuery", () => {
  // Eventos iniciais da Aqua Index disparam os 4 tipos de rotação (LL, RR, RL, LR)
  const tree = new sim.AVLTree();
  for (const evt of sim.AVL_INITIAL_EVENTS) {
    tree.insert(evt.timestamp, evt);
    assert.equal(tree.isBalanced(), true, `Árvore desbalanceada após inserir ${evt.timestamp}`);
  }

  assert.equal(tree.size, sim.AVL_INITIAL_EVENTS.length);
  assert.ok(tree.rotations.LL >= 1, `Esperava rotação LL, obteve ${JSON.stringify(tree.rotations)}`);
  assert.ok(tree.rotations.RR >= 1, `Esperava rotação RR, obteve ${JSON.stringify(tree.rotations)}`);
  assert.ok(tree.rotations.RL >= 1, `Esperava rotação RL, obteve ${JSON.stringify(tree.rotations)}`);
  assert.ok(tree.rotations.LR >= 1, `Esperava rotação LR, obteve ${JSON.stringify(tree.rotations)}`);

  // Busca exata e inexistente
  const found = tree.search(1040);
  assert.equal(found.found, true);
  assert.equal(found.node.payload.tag, "TIT-401");
  assert.equal(tree.search(9999).found, false);

  // Range query em [1015, 1050]
  const slice = tree.rangeQuery(1015, 1050);
  assert.deepEqual(
    slice.map((item) => item.timestamp),
    [1015, 1020, 1030, 1040, 1045, 1050]
  );

  // Range query com limites invertidos continua funcionando
  assert.equal(tree.rangeQuery(1050, 1015).length, 6);
  assert.equal(tree.rangeQuery(2000, 3000).length, 0);

  // Layout de visualização coerente
  const layout = tree.toTreeLayout(860, 80, 90);
  assert.equal(layout.nodes.length, tree.size);
  assert.equal(layout.edges.length, tree.size - 1);
});

test("AVLTree suporta 60 inserções fora de ordem preservando ordenação e limite logarítmico de altura", () => {
  const tree = new sim.AVLTree();
  const rng = sim.mulberry32(12345);
  const inserted = new Set();

  for (let i = 0; i < 60; i += 1) {
    const ts = Math.floor(rng() * 10000);
    inserted.add(ts);
    tree.insert(ts, { tag: "SE-001", value: i });
    assert.equal(tree.isBalanced(), true);
  }

  assert.equal(tree.size, inserted.size);
  const maxAvlHeight = Math.ceil(1.44 * Math.log2(tree.size + 2));
  assert.ok(tree.getHeight() <= maxAvlHeight, `Altura ${tree.getHeight()} excede limite ${maxAvlHeight}`);

  const ordered = tree.inOrder().map((n) => n.timestamp);
  assert.deepEqual(ordered, [...inserted].sort((a, b) => a - b));
});

/* ============================================================================
 * 4. MODO RRT — AULA 22 (RRT CINEMÁTICO SE(2) NO REABASTECIMENTO MAG-100)
 * ============================================================================ */

test("RRT SE(2) converge com PRNG determinístico, respeita |E|=|V|-1, prova colisão direta e evita obstáculos", () => {
  const run1 = sim.planRRT_SE2({ seed: 42, goalBias: 0.16, zs102Empty: true, hs004Emergency: false, palletObstacle: false });
  const run2 = sim.planRRT_SE2({ seed: 42, goalBias: 0.16, zs102Empty: true, hs004Emergency: false, palletObstacle: false });

  assert.equal(run1.ok, true, `RRT nominal falhou: ${run1.reason}`);
  assert.equal(run1.directCollides, true, "Linha reta direta deve colidir com a Célula Envasadora");
  assert.equal(run1.isArborescence, true);
  assert.equal(run1.edgeCountValid, true);
  assert.equal(run1.edges.length, run1.nodes.length - 1);
  assert.ok(run1.path.length >= 2);

  // Determinismo exato pela mesma seed
  assert.equal(run1.nodes.length, run2.nodes.length);
  assert.equal(run1.pathLength, run2.pathLength);
  assert.deepEqual(run1.path, run2.path);

  // Início e fim da trajetória
  const first = run1.path[0];
  const last = run1.path[run1.path.length - 1];
  assert.equal(first.id, 0);
  assert.ok(
    Math.hypot(last.x - sim.RRT_WORKSPACE.goal.x, last.y - sim.RRT_WORKSPACE.goal.y) <= sim.RRT_WORKSPACE.goal.radius,
    "Última pose deve estar dentro do raio alvo MAG-100"
  );

  // Com palete no corredor também converge mantendo arborescência válida em todas as seeds da interface
  for (const seed of [42, 7, 108, 314, 2025]) {
    const withPallet = sim.planRRT_SE2({ seed, goalBias: 0.16, zs102Empty: true, hs004Emergency: false, palletObstacle: true });
    assert.equal(withPallet.ok, true, `RRT com palete falhou na seed ${seed}: ${withPallet.reason}`);
    assert.equal(withPallet.isArborescence, true);
    assert.equal(withPallet.edgeCountValid, true);
    assert.equal(withPallet.obstacles.length, 4);
  }
});

test("RRT SE(2) respeita barreira booleana Φ_SCADA (HS-004 bloqueia) e standby de ZS-102", () => {
  const emergency = sim.planRRT_SE2({ seed: 42, zs102Empty: true, hs004Emergency: true });
  assert.equal(emergency.ok, false);
  assert.equal(emergency.phiScada, false);
  assert.equal(emergency.nodes.length, 1);
  assert.equal(emergency.edges.length, 0);
  assert.equal(emergency.path.length, 0);
  assert.equal(emergency.isArborescence, true);
  assert.equal(emergency.edgeCountValid, true);
  assert.match(emergency.reason, /HS-004/);

  const standby = sim.planRRT_SE2({ seed: 42, zs102Empty: false, hs004Emergency: false });
  assert.equal(standby.ok, false);
  assert.equal(standby.nodes.length, 1);
  assert.equal(standby.edges.length, 0);
  assert.equal(standby.path.length, 0);
});

/* ============================================================================
 * 5. MODO RSTP — AULA 23 (PROTOCOLO IEEE 802.1w)
 * ============================================================================ */

test("RSTP (IEEE 802.1w) elege SW-SCADA como Root nominal e reconverge com 0 ciclos perdidos", () => {
  assert.ok(Object.isFrozen(sim.RSTP_SWITCHES));
  assert.ok(Object.isFrozen(sim.RSTP_LINKS));
  assert.equal(sim.RSTP_SWITCHES.length, 5);
  assert.equal(sim.RSTP_LINKS.length, 6);

  const nom = sim.runRSTP({ scenario: "nominal" });
  assert.equal(nom.ok, true);
  assert.equal(nom.rootBridge, "SW-SCADA");
  assert.equal(nom.forwardingLinks.length, 4);
  assert.equal(nom.discardingLinks.length, 2);
  assert.equal(nom.lostCyclesRSTP, 0);

  const bFail = sim.runRSTP({ scenario: "backbone_fail" });
  assert.equal(bFail.ok, true);
  assert.equal(bFail.rootBridge, "SW-SCADA");
  assert.ok(bFail.downLinks.includes("L1"));
  assert.equal(bFail.forwardingLinks.length, 4);
  assert.equal(bFail.lostCyclesRSTP, 0);
  assert.ok(bFail.lostCyclesSTP >= 8);

  const sDown = sim.runRSTP({ scenario: "scada_down" });
  assert.equal(sDown.ok, true);
  assert.equal(sDown.rootBridge, "SW-PLC");
  assert.equal(sDown.forwardingLinks.length, 3);
  assert.equal(sDown.lostCyclesRSTP, 0);
});

/* ============================================================================
 * 6. MODO PETRI — AULA 24 (PRÉVIA SINCRONIZÁVEL)
 * ============================================================================ */

test("Petri prévia: cenário ilimitado apresenta ω e cenário K_max=3 prova finitude e 0 deadlocks", () => {
  const unb = sim.buildPetriCoverability("unbounded");
  assert.equal(unb.ok, true);
  assert.equal(unb.preview, true);
  assert.equal(unb.hasOmega, true);
  assert.equal(unb.isBounded, false);
  assert.equal(unb.maxTokensEST500, "ω");

  const bnd = sim.buildPetriCoverability("bounded");
  assert.equal(bnd.ok, true);
  assert.equal(bnd.preview, true);
  assert.equal(bnd.hasOmega, false);
  assert.equal(bnd.isBounded, true);
  assert.equal(bnd.kMax, 3);
  assert.equal(bnd.deadlocks, 0);
  assert.equal(bnd.mutualExclusionOk, true);
  assert.ok(bnd.states.length >= 4);
});

/* ============================================================================
 * 7. MODO BEHAVIOR TREE — AULA 25
 * ============================================================================ */

test("Behavior Tree: preempção HS-004, aquecimento RUNNING e Retry(max=2) em PIT-301", () => {
  const nom = sim.tickBehaviorTree({ tick: 1 });
  assert.equal(nom.rootStatus, "RUNNING");
  assert.equal(nom.activeBranch, "Ciclo_Produtivo");

  const cold = sim.tickBehaviorTree({ tit401: 168, tick: 1 });
  assert.equal(cold.rootStatus, "RUNNING");
  assert.equal(cold.activeBranch, "Pre_Aquecimento_HT401");

  const retry1 = sim.tickBehaviorTree({ pit301Fail: true, retryCount: 0, tick: 1 });
  assert.equal(retry1.rootStatus, "RUNNING");
  assert.equal(retry1.nextRetryCount, 1);

  const retryFail = sim.tickBehaviorTree({ pit301Fail: true, retryCount: 2, tick: 3 });
  assert.equal(retryFail.rootStatus, "FAILURE");
  assert.match(retryFail.activeAction, /R03/);

  const emg = sim.tickBehaviorTree({ hs004: true, tit401: 160, pit301Fail: true, tick: 2 });
  assert.equal(emg.rootStatus, "SUCCESS");
  assert.equal(emg.activeBranch, "Seguranca_Global");
  assert.match(emg.activeAction, /Parada_Segura/);
});

/* ============================================================================
 * 8. MODO KD-TREE — AULA 26
 * ============================================================================ */

test("KD-Tree 2D: vizinho mais próximo e range search concordam 100% com força bruta", () => {
  const tree = sim.buildKDTree2D(sim.KDTREE_POINTS);
  const query = { x: 7.5, y: 9.8 };
  const kdRes = sim.kdNearest(tree, query);

  const bruteBest = [...sim.KDTREE_POINTS].sort(
    (a, b) => Math.hypot(a.x - query.x, a.y - query.y) - Math.hypot(b.x - query.x, b.y - query.y)
  )[0];
  assert.equal(kdRes.nearest.id, bruteBest.id);
  assert.ok(kdRes.visitedNodes <= sim.KDTREE_POINTS.length);

  const low = { x: 1.5, y: 4.0 };
  const high = { x: 9.5, y: 11.0 };
  const rangeRes = sim.kdRangeSearch(tree, low, high);
  const bruteRange = sim.KDTREE_POINTS.filter(
    (p) => p.x >= low.x && p.x <= high.x && p.y >= low.y && p.y <= high.y
  );
  assert.deepEqual(
    rangeRes.matches.map((m) => m.id).sort(),
    bruteRange.map((m) => m.id).sort()
  );
});

/* ============================================================================
 * 9. MODO DECISION TREE — AULA 27 (CART / C4.5)
 * ============================================================================ */

test("Decision Tree (Gini/CART e Entropia/C4.5) atinge > 90% de acurácia e gera matriz de confusão", () => {
  for (const criterion of ["gini", "entropy"]) {
    const tree = sim.trainDecisionTree(sim.DTREE_DATASET, { criterion, maxDepth: 3 });
    const yTrue = sim.DTREE_DATASET.map((r) => r.label);
    const yPred = sim.DTREE_DATASET.map((r) => sim.predictDecisionTree(tree, r).prediction);
    const cm = sim.confusionMatrix(yTrue, yPred);
    assert.equal(cm.total, sim.DTREE_DATASET.length);
    assert.ok(cm.accuracy >= 90, `Acurácia ${criterion} abaixo de 90%: ${cm.accuracy}`);
  }
});

/* ============================================================================
 * 10. MODO INTEGRATED — AULA 28 (FLUXO INTEGRADO DE 9 ESTÁGIOS)
 * ============================================================================ */

test("Simulação Integrada (Aula 28) encadeia 9 estágios nos 4 cenários operacionais", () => {
  for (const id of ["nominal", "cup_shortage", "backbone_cold", "emergency"]) {
    const res = sim.runIntegratedScenario(id);
    assert.equal(res.stages.length, 9);
    assert.equal(res.mst.totalWeight, 9.9);
    assert.equal(res.rstp.lostCyclesRSTP, 0);
  }

  const cup = sim.runIntegratedScenario("cup_shortage");
  assert.equal(cup.bdt.action, "ALARME_REABASTECIMENTO");
  assert.equal(cup.rrt.ok, true);

  const emg = sim.runIntegratedScenario("emergency");
  assert.equal(emg.bdt.action, "TRIP_EMERGENCIA");
  assert.equal(emg.rrt.ok, false);
});
