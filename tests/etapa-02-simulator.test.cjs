const test = require("node:test");
const assert = require("node:assert/strict");
const sim = require("../doc/js/etapa-02-simulator.js");

function oracleShortest(graph, origin, destination, blocked = new Set()) {
  let best = Infinity;
  function visit(node, cost, seen) {
    if (cost >= best) return;
    if (node === destination) { best = cost; return; }
    for (const edge of graph.edges) {
      if (blocked.has(edge.id)) continue;
      const next = edge.from === node ? edge.to : (!graph.directed && edge.to === node ? edge.from : null);
      if (next && !seen.has(next)) visit(next, cost + edge.weight, new Set([...seen, next]));
    }
  }
  visit(origin, 0, new Set([origin]));
  return best;
}

test("Dijkstra respeita direção, pesos, bloqueio e não muta a fonte", () => {
  const water = sim.GRAPH.water;
  const baseline = JSON.stringify(water);
  const nominal = sim.dijkstra(water, "TK-101_Agua", "DOS-201_Dosador");
  assert.equal(nominal.distance, 270);
  assert.equal(nominal.distance, oracleShortest(water, "TK-101_Agua", "DOS-201_Dosador"));
  assert.equal(sim.dijkstra(water, "TK-101_Agua", "DOS-201_Dosador", { blockedEdges: new Set(["a3"]) }).distance, 275);
  assert.equal(sim.dijkstra(water, "TK-101_Agua", "DOS-201_Dosador", { blockedEdges: new Set(["a3", "a4"]) }).ok, false);
  assert.equal(sim.dijkstra(water, "DOS-201_Dosador", "TK-101_Agua").ok, false);
  assert.equal(JSON.stringify(water), baseline);
});

test("Dijkstra trata origem igual ao destino, valores inválidos e nós desconhecidos", () => {
  assert.deepEqual(sim.dijkstra(sim.GRAPH.water, "DOS-201_Dosador", "DOS-201_Dosador"), { ok:true, distance:0, path:["DOS-201_Dosador"], edgeIds:[] });
  assert.equal(sim.dijkstra(sim.GRAPH.water, "DOS-201_Dosador", "DOS-201_Dosador", { blockedNodes:new Set(["DOS-201_Dosador"]) }).ok, false);
  assert.equal(sim.dijkstra(sim.GRAPH.water, "ausente", "DOS-201_Dosador").ok, false);
  const invalid = { nodes:["a","b"], edges:[{ id:"x", from:"a", to:"b", weight:-1 }], directed:true };
  assert.equal(sim.dijkstra(invalid, "a", "b").ok, false);
  const zero = { nodes:["Z","A","B","T"], directed:true, edges:[{id:"za",from:"Z",to:"A",weight:0},{id:"ab",from:"A",to:"B",weight:0},{id:"ba",from:"B",to:"A",weight:0},{id:"at",from:"A",to:"T",weight:1}] };
  assert.deepEqual(sim.dijkstra(zero, "Z", "T").path, ["Z","A","T"]);
});

test("BFS minimiza saltos e DFS responde aos bloqueios sem usar segundos como critério", () => {
  const base = sim.bfs(sim.GRAPH.search, "Reservatorio", "Empacotadora");
  assert.equal(base.hops, 5);
  assert.deepEqual(base.path, ["Reservatorio", "Bomba", "V1", "Envasadora", "Estacao_Inspecao", "Empacotadora"]);
  const byV2 = sim.bfs(sim.GRAPH.search, "Reservatorio", "Empacotadora", { blockedNodes:new Set(["V1"]) });
  assert.equal(byV2.ok, true);
  assert.ok(byV2.path.includes("V2"));
  assert.equal(sim.dfsPaths(sim.GRAPH.search, "Reservatorio", "Empacotadora", { blockedNodes:new Set(["V1", "V2"]) }).ok, false);
});

test("Veículos preserva seus custos e desvios sem misturar o DAG de materiais", () => {
  const vehicles = sim.GRAPH.vehicles;
  assert.equal(sim.dijkstra(vehicles, "RECEBIMENTO", "DOCA_EXPEDICAO").distance, 40);
  assert.equal(sim.dijkstra(vehicles, "RECEBIMENTO", "DOCA_EXPEDICAO", { blockedNodes:new Set(["CORREDOR_B"]) }).distance, 65);
  assert.equal(sim.dijkstra(vehicles, "RECEBIMENTO", "DOCA_EXPEDICAO", { blockedNodes:new Set(["CORREDOR_B", "VIA_EXTERNA"]) }).ok, false);
});

test("Hierholzer usa IDs uma vez e rejeita paridade ou conectividade inválidas", () => {
  const answer = sim.euler(sim.GRAPH.round);
  assert.equal(answer.ok, true);
  assert.equal(answer.weight, 24.5);
  assert.equal(answer.edgeIds.length, 10);
  assert.equal(new Set(answer.edgeIds).size, 10);
  const odd = { nodes:["a","b","c","d"], directed:false, edges:[{id:"1",from:"a",to:"b",weight:1},{id:"2",from:"a",to:"c",weight:1},{id:"3",from:"a",to:"d",weight:1}] };
  const disconnected = { nodes:["a","b","c","d"], directed:false, edges:[{id:"1",from:"a",to:"b",weight:1},{id:"2",from:"c",to:"d",weight:1}] };
  assert.equal(sim.euler(odd).ok, false);
  assert.equal(sim.euler(disconnected).ok, false);
  const allBlocked = new Set(sim.GRAPH.round.edges.map(edge => edge.id));
  assert.deepEqual(sim.euler(sim.GRAPH.round, { blockedEdges: allBlocked }), { ok:false, reason:"sem trechos ativos", path:[], edgeIds:[] });
});

test("NN tem desempate determinístico e 2-Opt só aceita melhoria estrita", () => {
  const nn = sim.nearestNeighbor(sim.GRAPH.agv, "Lab");
  assert.deepEqual(nn.route, ["Lab","TK301","TK302","R101","TK303","GRAN201","Lab"]);
  assert.equal(nn.distance, 280);
  const optimized = sim.twoOpt(sim.GRAPH.agv, nn.route);
  assert.equal(optimized.distance, 260);
  assert.equal(optimized.improved, true);
  assert.equal(sim.twoOpt(sim.GRAPH.agv, optimized.route).improved, false);
  const open = { nodes:["a","b","c"], directed:false, edges:[{id:"ab",from:"a",to:"b",weight:1},{id:"bc",from:"b",to:"c",weight:1}] };
  assert.equal(sim.nearestNeighbor(open, "a").ok, false);
});

test("Kahn mantém E1–E5 e detecta ciclo", () => {
  const answer = sim.kahn(sim.GRAPH.materials);
  assert.equal(answer.ok, true);
  for (const node of ["E1_DISPENSA","E2_ENVASE","E3_TAMPA","E4_SELAGEM","E5_EJECAO"]) assert.ok(answer.order.includes(node));
  assert.ok(answer.order.indexOf("E1_DISPENSA") < answer.order.indexOf("E2_ENVASE"));
  const cycle = { nodes:["a","b"], directed:true, edges:[{id:"x",from:"a",to:"b",weight:0},{id:"y",from:"b",to:"a",weight:0}] };
  assert.equal(sim.kahn(cycle).ok, false);
});
