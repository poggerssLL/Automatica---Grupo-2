/* Aqua Index Etapa 02. A única exposição opcional é module.exports para os testes Node. */
const AquaIndexEtapa02 = (() => {
  "use strict";
  const freezeGraph = graph => Object.freeze({ ...graph, nodes: Object.freeze([...graph.nodes]), edges: Object.freeze(graph.edges.map(edge => Object.freeze({ ...edge }))) });
  const make = (id, directed, unit, nodes, edges, source) => freezeGraph({ id, directed, unit, nodes, edges, source });
  const water = make("water", true, "cm", ["TK-101_Agua","P-101_BombaA","P-102_BombaB","MAN-200_Agua","DOS-201_Dosador","BIC-202_Bico","MAG-100_Copos","MESA-000_Index","EST-500_Saida"], [
    ["a1","TK-101_Agua","P-101_BombaA",150,"XV-101A"],["a2","TK-101_Agua","P-102_BombaB",150,"XV-101B"],["a3","P-101_BombaA","MAN-200_Agua",80,"XV-200A"],["a4","P-102_BombaB","MAN-200_Agua",85,"XV-200B"],["a5","MAN-200_Agua","DOS-201_Dosador",40,"XV-201"],["a6","DOS-201_Dosador","BIC-202_Bico",20,"XV-202"],["a7","BIC-202_Bico","MESA-000_Index",10,"gravidade"],["a8","MAG-100_Copos","MESA-000_Index",15,"cil A"],["a9","MESA-000_Index","EST-500_Saida",50,"cil H"]
  ].map(([id,from,to,weight,label])=>({id,from,to,weight,label})), "A11, A14 e A15");
  const search = make("search", true, "s", ["Reservatorio","Bomba","V1","V2","Envasadora","Estacao_Inspecao","Empacotadora"], [
    ["b1","Reservatorio","Bomba",5],["b2","Bomba","V1",2],["b3","Bomba","V2",3],["b4","V1","Envasadora",4],["b5","V2","Envasadora",6],["b6","Envasadora","Estacao_Inspecao",3],["b7","Estacao_Inspecao","Empacotadora",2]
  ].map(([id,from,to,weight])=>({id,from,to,weight,label:id})), "A13");
  const round = make("round", false, "min", ["PAINEL","FRL-001","S100","S200","S300","S400","S500","MESA"], [
    ["t1","PAINEL","FRL-001",3],["t2","FRL-001","S100",2],["t3","S100","S200",2.5],["t4","S200","S300",3],["t5","S300","S400",2.5],["t6","S400","S500",3.5],["t7","S500","PAINEL",3],["t8","MESA","S200",1.5],["t9","S200","S400",2],["t10","S400","MESA",1.5]
  ].map(([id,from,to,weight])=>({id,from,to,weight,label:id})), "A16 — ronda não dirigida");
  const agv = make("agv", false, "s", ["Lab","TK301","TK302","R101","TK303","GRAN201"], [
    ["g1","Lab","TK301",45],["g2","Lab","TK302",50],["g3","Lab","R101",80],["g4","Lab","TK303",75],["g5","Lab","GRAN201",110],["g6","TK301","TK302",20],["g7","TK301","R101",55],["g8","TK301","TK303",60],["g9","TK301","GRAN201",95],["g10","TK302","R101",45],["g11","TK302","TK303",50],["g12","TK302","GRAN201",85],["g13","R101","TK303",25],["g14","R101","GRAN201",40],["g15","TK303","GRAN201",35]
  ].map(([id,from,to,weight])=>({id,from,to,weight,label:id})), "A17 — matriz ilustrativa legada");
  const materials = make("materials", true, "m", ["RECEB_COPOS","ESTOQUE_COPOS","MAG-100_Copos","E1_DISPENSA","RECEB_AGUA","TK-101_Agua","E2_ENVASE","RECEB_TAMPAS","ESTOQUE_TAMPAS","E3_TAMPA","E4_SELAGEM","E5_EJECAO","EST-500_Saida","EMBALAGEM","ESTOQUE_PRODUTO","DOCA_EXPEDICAO"], [
    ["m1","RECEB_COPOS","ESTOQUE_COPOS",8],["m2","ESTOQUE_COPOS","MAG-100_Copos",6],["m3","MAG-100_Copos","E1_DISPENSA",1],["m4","RECEB_AGUA","TK-101_Agua",10],["m5","TK-101_Agua","E2_ENVASE",2.7],["m6","RECEB_TAMPAS","ESTOQUE_TAMPAS",7],["m7","ESTOQUE_TAMPAS","E3_TAMPA",5],["m8","E1_DISPENSA","E2_ENVASE",.6],["m9","E2_ENVASE","E3_TAMPA",.6],["m10","E3_TAMPA","E4_SELAGEM",.6],["m11","E4_SELAGEM","E5_EJECAO",.6],["m12","E5_EJECAO","EST-500_Saida",.8],["m13","EST-500_Saida","EMBALAGEM",3],["m14","EMBALAGEM","ESTOQUE_PRODUTO",5],["m15","ESTOQUE_PRODUTO","DOCA_EXPEDICAO",8]
  ].map(([id,from,to,weight])=>({id,from,to,weight,label:id})), "A18 — DAG de materiais");
  const vehicles = make("vehicles", true, "m", ["PORTARIA","RECEBIMENTO","CORREDOR_A","CORREDOR_B","ABASTECIMENTO","ESTOQUE_FINAL","DOCA_EXPEDICAO","SAIDA","VIA_EXTERNA"], [
    ["v1","PORTARIA","RECEBIMENTO",20],["v2","RECEBIMENTO","CORREDOR_A",10],["v3","CORREDOR_A","RECEBIMENTO",10],["v4","CORREDOR_A","ABASTECIMENTO",8],["v5","ABASTECIMENTO","CORREDOR_A",8],["v6","CORREDOR_A","CORREDOR_B",12],["v7","CORREDOR_B","CORREDOR_A",12],["v8","CORREDOR_B","ESTOQUE_FINAL",8],["v9","ESTOQUE_FINAL","CORREDOR_B",8],["v10","ESTOQUE_FINAL","DOCA_EXPEDICAO",10],["v11","DOCA_EXPEDICAO","SAIDA",15],["v12","SAIDA","PORTARIA",10],["v13","RECEBIMENTO","VIA_EXTERNA",30],["v14","VIA_EXTERNA","DOCA_EXPEDICAO",35]
  ].map(([id,from,to,weight])=>({id,from,to,weight,label:id})), "A18 — veículos");
  const GRAPH = Object.freeze({ water, search, round, agv, materials, vehicles });

  const rawCouplingLinks = [
    { id: "c1", from: "water:TK-101_Agua", to: "materials:TK-101_Agua", fromZone: "water", fromNode: "TK-101_Agua", toZone: "materials", toNode: "TK-101_Agua", sourceZone: "water", sourceNode: "TK-101_Agua", targetZone: "materials", targetNode: "TK-101_Agua" },
    { id: "c2", from: "water:TK-101_Agua", to: "search:Reservatorio", fromZone: "water", fromNode: "TK-101_Agua", toZone: "search", toNode: "Reservatorio", sourceZone: "water", sourceNode: "TK-101_Agua", targetZone: "search", targetNode: "Reservatorio" },
    { id: "c3", from: "water:MAG-100_Copos", to: "materials:MAG-100_Copos", fromZone: "water", fromNode: "MAG-100_Copos", toZone: "materials", toNode: "MAG-100_Copos", sourceZone: "water", sourceNode: "MAG-100_Copos", targetZone: "materials", targetNode: "MAG-100_Copos" },
    { id: "c4", from: "water:DOS-201_Dosador", to: "materials:E2_ENVASE", fromZone: "water", fromNode: "DOS-201_Dosador", toZone: "materials", toNode: "E2_ENVASE", sourceZone: "water", sourceNode: "DOS-201_Dosador", targetZone: "materials", targetNode: "E2_ENVASE" },
    { id: "c5", from: "water:MESA-000_Index", to: "round:MESA", fromZone: "water", fromNode: "MESA-000_Index", toZone: "round", toNode: "MESA", sourceZone: "water", sourceNode: "MESA-000_Index", targetZone: "round", targetNode: "MESA" },
    { id: "c6", from: "water:MESA-000_Index", to: "search:Envasadora", fromZone: "water", fromNode: "MESA-000_Index", toZone: "search", toNode: "Envasadora", sourceZone: "water", sourceNode: "MESA-000_Index", targetZone: "search", targetNode: "Envasadora" },
    { id: "c7", from: "water:EST-500_Saida", to: "materials:EST-500_Saida", fromZone: "water", fromNode: "EST-500_Saida", toZone: "materials", toNode: "EST-500_Saida", sourceZone: "water", sourceNode: "EST-500_Saida", targetZone: "materials", targetNode: "EST-500_Saida" },
    { id: "c8", from: "search:Empacotadora", to: "materials:EMBALAGEM", fromZone: "search", fromNode: "Empacotadora", toZone: "materials", toNode: "EMBALAGEM", sourceZone: "search", sourceNode: "Empacotadora", targetZone: "materials", targetNode: "EMBALAGEM" },
    { id: "c9", from: "search:Estacao_Inspecao", to: "agv:Lab", fromZone: "search", fromNode: "Estacao_Inspecao", toZone: "agv", toNode: "Lab", sourceZone: "search", sourceNode: "Estacao_Inspecao", targetZone: "agv", targetNode: "Lab" },
    { id: "c10", from: "round:S100", to: "materials:E1_DISPENSA", fromZone: "round", fromNode: "S100", toZone: "materials", toNode: "E1_DISPENSA", sourceZone: "round", sourceNode: "S100", targetZone: "materials", targetNode: "E1_DISPENSA" },
    { id: "c11", from: "round:S500", to: "materials:E5_EJECAO", fromZone: "round", fromNode: "S500", toZone: "materials", toNode: "E5_EJECAO", sourceZone: "round", sourceNode: "S500", targetZone: "materials", targetNode: "E5_EJECAO" },
    { id: "c12", from: "materials:RECEB_COPOS", to: "vehicles:RECEBIMENTO", fromZone: "materials", fromNode: "RECEB_COPOS", toZone: "vehicles", toNode: "RECEBIMENTO", sourceZone: "materials", sourceNode: "RECEB_COPOS", targetZone: "vehicles", targetNode: "RECEBIMENTO" },
    { id: "c13", from: "materials:ESTOQUE_PRODUTO", to: "vehicles:ESTOQUE_FINAL", fromZone: "materials", fromNode: "ESTOQUE_PRODUTO", toZone: "vehicles", toNode: "ESTOQUE_FINAL", sourceZone: "materials", sourceNode: "ESTOQUE_PRODUTO", targetZone: "vehicles", targetNode: "ESTOQUE_FINAL" },
    { id: "c14", from: "materials:DOCA_EXPEDICAO", to: "vehicles:DOCA_EXPEDICAO", fromZone: "materials", fromNode: "DOCA_EXPEDICAO", toZone: "vehicles", toNode: "DOCA_EXPEDICAO", sourceZone: "materials", sourceNode: "DOCA_EXPEDICAO", targetZone: "vehicles", targetNode: "DOCA_EXPEDICAO" }
  ];
  const COUPLING_LINKS = Object.freeze(rawCouplingLinks.map(link => Object.freeze({ ...link })));

  const zoneWater = Object.freeze({ id: "water", title: "Água / copos · Dijkstra", code: "14 / 15", unit: "cm", directed: true, x: 20, y: 20, width: 510, height: 455 });
  const zoneSearch = Object.freeze({ id: "search", title: "Busca · BFS · DFS", code: "13 / busca", unit: "s", directed: true, x: 555, y: 20, width: 510, height: 455 });
  const zoneRound = Object.freeze({ id: "round", title: "Inspeção · Euler", code: "16 / inspeção", unit: "min", directed: false, x: 1090, y: 20, width: 510, height: 455 });
  const zoneMaterials = Object.freeze({ id: "materials", title: "Materiais · Kahn", code: "18 / materiais", unit: "m", directed: true, x: 20, y: 505, width: 510, height: 455 });
  const zoneVehicles = Object.freeze({ id: "vehicles", title: "Veículos · Dijkstra", code: "18 / veículos", unit: "m", directed: true, x: 555, y: 505, width: 510, height: 455 });
  const zoneAgv = Object.freeze({ id: "agv", title: "AGV · NN · 2-Opt", code: "17 / AGV", unit: "s", directed: false, x: 1090, y: 505, width: 510, height: 455 });

  const ZONES = Object.freeze(Object.assign(
    [zoneWater, zoneSearch, zoneRound, zoneMaterials, zoneVehicles, zoneAgv],
    {
      water: zoneWater,
      search: zoneSearch,
      round: zoneRound,
      materials: zoneMaterials,
      vehicles: zoneVehicles,
      agv: zoneAgv
    }
  ));

  const validGraph = graph => graph && Array.isArray(graph.nodes) && Array.isArray(graph.edges) && graph.edges.every(edge => graph.nodes.includes(edge.from) && graph.nodes.includes(edge.to) && Number.isFinite(edge.weight) && edge.weight >= 0);
  const edgeList = (graph, blockedEdges = new Set(), blockedNodes = new Set()) => validGraph(graph) ? graph.edges.filter(edge => !blockedEdges.has(edge.id) && !blockedNodes.has(edge.from) && !blockedNodes.has(edge.to)) : [];
  const neighbors = (graph, node, blockedEdges, blockedNodes) => edgeList(graph, blockedEdges, blockedNodes).flatMap(edge => edge.from === node ? [{node:edge.to,edge}] : (!graph.directed && edge.to === node ? [{node:edge.from,edge}] : []));
  function dijkstra(graph, origin, destination, options = {}) {
    if (!validGraph(graph) || !graph.nodes.includes(origin) || !graph.nodes.includes(destination)) return { ok:false, reason:"nó desconhecido", distance:Infinity, path:[], edgeIds:[] };
    const blockedEdges = options.blockedEdges || new Set(), blockedNodes = options.blockedNodes || new Set();
    if (blockedNodes.has(origin) || blockedNodes.has(destination)) return { ok:false, reason:"origem ou destino bloqueado", distance:Infinity, path:[], edgeIds:[] };
    if (origin === destination) return { ok:true, distance:0, path:[origin], edgeIds:[] };
    const dist = new Map(graph.nodes.map(node => [node,Infinity])), prev = new Map(), seen = new Set(); dist.set(origin,0);
    while (seen.size < graph.nodes.length) { const current = graph.nodes.filter(node=>!seen.has(node)).sort((a,b)=>dist.get(a)-dist.get(b)||a.localeCompare(b))[0]; if (!current || !Number.isFinite(dist.get(current))) break; if (current === destination) break; seen.add(current); for (const next of neighbors(graph,current,blockedEdges,blockedNodes)) { if(seen.has(next.node))continue; const candidate=dist.get(current)+next.edge.weight; if(candidate<dist.get(next.node)){dist.set(next.node,candidate);prev.set(next.node,{node:current,edgeId:next.edge.id});} } }
    if (!Number.isFinite(dist.get(destination))) return { ok:false, reason:"sem rota", distance:Infinity, path:[], edgeIds:[] };
    const path=[],edgeIds=[]; let step=destination; while(step!==origin){path.unshift(step);const item=prev.get(step);if(!item)return {ok:false,reason:"sem rota",distance:Infinity,path:[],edgeIds:[]};edgeIds.unshift(item.edgeId);step=item.node;} path.unshift(origin); return {ok:true,distance:dist.get(destination),path,edgeIds};
  }
  function bfs(graph, origin, destination, options = {}) { if(!validGraph(graph)||!graph.nodes.includes(origin)||!graph.nodes.includes(destination))return {ok:false,reason:"nó desconhecido",path:[],edgeIds:[]};const blockedNodes=options.blockedNodes||new Set();if(blockedNodes.has(origin)||blockedNodes.has(destination))return {ok:false,reason:"origem ou destino bloqueado",path:[],edgeIds:[]};if(origin===destination)return {ok:true,path:[origin],edgeIds:[],hops:0}; const q=[origin], prev=new Map(), seen=new Set([origin]); while(q.length){const current=q.shift();if(current===destination)break;for(const next of neighbors(graph,current,options.blockedEdges||new Set(),blockedNodes))if(!seen.has(next.node)){seen.add(next.node);prev.set(next.node,{node:current,edgeId:next.edge.id});q.push(next.node);}} if(!seen.has(destination))return {ok:false,reason:"sem rota",path:[],edgeIds:[]};const path=[],edgeIds=[];let step=destination;while(step!==origin){path.unshift(step);const item=prev.get(step);edgeIds.unshift(item.edgeId);step=item.node;}path.unshift(origin);return {ok:true,path,edgeIds,hops:edgeIds.length}; }
  function dfsPaths(graph, origin, destination, options = {}) { if(!validGraph(graph)||!graph.nodes.includes(origin)||!graph.nodes.includes(destination))return {ok:false,reason:"nó desconhecido",paths:[]};const blockedNodes=options.blockedNodes||new Set();if(blockedNodes.has(origin)||blockedNodes.has(destination))return {ok:false,reason:"origem ou destino bloqueado",paths:[]};const limit=Number.isInteger(options.limit)?options.limit:40, paths=[];function walk(node,path,edgeIds){if(paths.length>=limit)return;if(node===destination){paths.push({path:[...path],edgeIds:[...edgeIds]});return;}for(const next of neighbors(graph,node,options.blockedEdges||new Set(),blockedNodes))if(!path.includes(next.node))walk(next.node,[...path,next.node],[...edgeIds,next.edge.id]);}walk(origin,[origin],[]);return paths.length?{ok:true,paths,limited:paths.length>=limit}:{ok:false,reason:"sem rota",paths:[]}; }
  function euler(graph, options = {}) { if(!validGraph(graph)||graph.directed)return {ok:false,reason:"requer grafo não dirigido",path:[],edgeIds:[]}; const edges=edgeList(graph,options.blockedEdges||new Set(),options.blockedNodes||new Set()); if(!edges.length)return {ok:false,reason:"sem trechos ativos",path:[],edgeIds:[]}; const adj=new Map(graph.nodes.map(node=>[node,[]]));for(const edge of edges){adj.get(edge.from).push(edge);adj.get(edge.to).push(edge);}const active=[...adj].filter(([,list])=>list.length).map(([node])=>node), visited=new Set(), stack=[active[0]];while(stack.length){const node=stack.pop();if(visited.has(node))continue;visited.add(node);for(const edge of adj.get(node))stack.push(edge.from===node?edge.to:edge.from);}if(active.some(node=>!visited.has(node)))return {ok:false,reason:"subgrafo desconexo",path:[],edgeIds:[]};const odd=active.filter(node=>adj.get(node).length%2);if(odd.length!==0&&odd.length!==2)return {ok:false,reason:"paridade inválida",path:[],edgeIds:[]};const used=new Set(), outNodes=[],outEdges=[],work=new Map([...adj].map(([node,list])=>[node,[...list]]));const vertexStack=[odd[0]||active[0]], edgeStack=[];while(vertexStack.length){const node=vertexStack[vertexStack.length-1], next=work.get(node).find(edge=>!used.has(edge.id));if(next){used.add(next.id);vertexStack.push(next.from===node?next.to:next.from);edgeStack.push(next.id);}else{outNodes.push(vertexStack.pop());if(edgeStack.length)outEdges.push(edgeStack.pop());}}return {ok:true,kind:odd.length?"trilha":"circuito",path:outNodes.reverse(),edgeIds:outEdges.reverse(),weight:edges.reduce((sum,edge)=>sum+edge.weight,0)}; }
  const distanceFor = (graph, route) => route.slice(0,-1).reduce((total,node,index)=>{const next=route[index+1],edge=graph.edges.filter(item=>(item.from===node&&item.to===next)||(!graph.directed&&item.from===next&&item.to===node)).sort((a,b)=>a.weight-b.weight)[0];return total+(edge?edge.weight:Infinity);},0);
  function nearestNeighbor(graph,start){if(!validGraph(graph)||!graph.nodes.includes(start))return {ok:false,reason:"nó desconhecido",route:[],distance:Infinity};const route=[start],left=new Set(graph.nodes.filter(node=>node!==start));while(left.size){const last=route.at(-1),next=[...left].map(node=>({node,edge:graph.edges.filter(edge=>(edge.from===last&&edge.to===node)||(!graph.directed&&edge.to===last&&edge.from===node)).sort((a,b)=>a.weight-b.weight)[0]})).filter(item=>item.edge).sort((a,b)=>a.edge.weight-b.edge.weight||a.node.localeCompare(b.node))[0];if(!next)return {ok:false,reason:"sem ciclo",route:[],distance:Infinity};route.push(next.node);left.delete(next.node);}const last=route.at(-1),closing=graph.edges.find(edge=>(edge.from===last&&edge.to===start)||(!graph.directed&&edge.to===last&&edge.from===start));if(!closing)return {ok:false,reason:"sem retorno à base",route:[],distance:Infinity};route.push(start);return {ok:true,route,distance:distanceFor(graph,route)};}
  const routeEdgeIds=(graph,route)=>route.slice(0,-1).map((node,index)=>graph.edges.filter(edge=>(edge.from===node&&edge.to===route[index+1])||(!graph.directed&&edge.from===route[index+1]&&edge.to===node)).sort((a,b)=>a.weight-b.weight)[0]?.id).filter(Boolean);
  function twoOpt(graph,route){if(!Array.isArray(route)||route.length<5)return {route:[...(route||[])],distance:distanceFor(graph,route||[]),improved:false};let best=[...route],bestDistance=distanceFor(graph,best),improved=true;while(improved){improved=false;for(let i=1;i<best.length-2;i++)for(let j=i+1;j<best.length-1;j++){const candidate=[...best.slice(0,i),...best.slice(i,j+1).reverse(),...best.slice(j+1)],value=distanceFor(graph,candidate);if(value<bestDistance){best=candidate;bestDistance=value;improved=true;break;}}}return {route:best,distance:bestDistance,improved:bestDistance<distanceFor(graph,route)};}
  function kahn(graph, options={}){if(!validGraph(graph))return {ok:false,reason:"grafo inválido",order:[]};const edges=edgeList(graph,options.blockedEdges||new Set(),options.blockedNodes||new Set()), nodes=graph.nodes.filter(node=>!(options.blockedNodes||new Set()).has(node)),incoming=new Map(nodes.map(node=>[node,0]));for(const edge of edges)incoming.set(edge.to,incoming.get(edge.to)+1);const ready=nodes.filter(node=>incoming.get(node)===0).sort(),order=[];while(ready.length){const node=ready.shift();order.push(node);for(const edge of edges.filter(item=>item.from===node)){incoming.set(edge.to,incoming.get(edge.to)-1);if(incoming.get(edge.to)===0){ready.push(edge.to);ready.sort();}}}return {ok:order.length===nodes.length,reason:order.length===nodes.length?"":"ciclo detectado",order};}
  const api={GRAPH,dijkstra,bfs,dfsPaths,euler,nearestNeighbor,twoOpt,kahn,distanceFor,routeEdgeIds,COUPLING_LINKS,ZONES}; if(typeof module!=="undefined"&&module.exports)module.exports=api;
  if(typeof document==="undefined")return api;
  const $=(root,selector)=>root.querySelector(selector), $$=(root,selector)=>[...root.querySelectorAll(selector)], svgNS="http://www.w3.org/2000/svg";
  function add(parent,name,attrs={},text="",ns=false){const node=ns?document.createElementNS(svgNS,name):document.createElement(name);for(const [key,value] of Object.entries(attrs))node.setAttribute(key,String(value));if(text)node.textContent=text;parent.append(node);return node;}
  function initTabs(){const box=$(document,"[data-etapa02-tabs]");if(!box)return;document.body.classList.add("js-e02-ready");const tabs=$$(box,"[data-e02-tab]"),panels=$$(box,"[data-e02-panel]");function select(id,focus=false){tabs.forEach(tab=>{const on=tab.dataset.e02Tab===id;tab.setAttribute("aria-selected",String(on));tab.tabIndex=on?0:-1;if(on&&focus)tab.focus();});panels.forEach(panel=>panel.hidden=panel.dataset.e02Panel!==id);if(location.hash!==`#${id}`)history.replaceState(null,"",`#${id}`);}tabs.forEach((tab,index)=>{tab.addEventListener("click",()=>select(tab.dataset.e02Tab));tab.addEventListener("keydown",event=>{if(!["ArrowLeft","ArrowRight","Home","End"].includes(event.key))return;event.preventDefault();const target=event.key==="Home"?0:event.key==="End"?tabs.length-1:(index+(event.key==="ArrowRight"?1:tabs.length-1))%tabs.length;select(tabs[target].dataset.e02Tab,true);});});select(tabs.some(tab=>tab.dataset.e02Tab===location.hash.slice(1))?location.hash.slice(1):"apresentacao");}
  const MODE={water:{graph:water,code:"14 / 15",title:"Água e copos: menor caminho",description:"Consulta até o dosador; somente os trechos de água entram no cálculo.",kind:"dijkstra",origin:"TK-101_Agua",destination:"DOS-201_Dosador",blocks:["a3","a4","MAN-200_Agua"]},search:{graph:search,code:"13 / busca",title:"BFS e DFS: saltos e caminhos",description:"BFS minimiza arestas; DFS lista caminhos simples (limite 40). Pesos em segundos não são usados pela BFS.",kind:"search",origin:"Reservatorio",destination:"Empacotadora",blocks:["V1","V2"]},round:{graph:round,code:"16 / inspeção",title:"Ronda: circuito Euleriano",description:"Grafo não dirigido: a rota só aparece quando paridade e conectividade permitem.",kind:"euler",blocks:round.edges.map(edge=>edge.id)},agv:{graph:agv,code:"17 / AGV",title:"Matriz legada: NN e 2-Opt",description:"Rótulos e custos da matriz ilustrativa do notebook; resultado é candidato, não ótimo global.",kind:"agv",origin:"Lab",blocks:[]},materials:{graph:materials,code:"18 / materiais",title:"Precedências: ordenação de Kahn",description:"O DAG mostra ordem estrutural; E1–E5 são obrigatórias, mas convergência não prova disponibilidade conjunta.",kind:"kahn",blocks:[]},vehicles:{graph:vehicles,code:"18 / veículos",title:"Veículos: menor caminho",description:"Dígrafo de circulação em metros, separado do DAG de materiais.",kind:"dijkstra",origin:"RECEBIMENTO",destination:"DOCA_EXPEDICAO",blocks:["CORREDOR_B","VIA_EXTERNA"]}};
  function initDeck(){const deck=$(document,"[data-etapa02-deck]");if(!deck)return;const slides=$$(deck,"[data-e02-slide]"),buttons=$$(deck,"[data-e02-go-slide]"),count=$(deck,"[data-e02-slide-count]"),title=$(deck,"[data-e02-slide-title]"),progress=$(deck,"[data-e02-progress]");let current=0;function show(index){current=(index+slides.length)%slides.length;slides.forEach((slide,i)=>slide.classList.toggle("is-current",i===current));buttons.forEach((button,i)=>{button.setAttribute("aria-current",i===current?"true":"false");button.setAttribute("aria-label",`Slide ${i+1}: ${slides[i].dataset.title}`);});count.textContent=`${String(current+1).padStart(2,"0")} / ${String(slides.length).padStart(2,"0")}`;title.textContent=slides[current].dataset.title;progress.value=current+1;}buttons.forEach((button,index)=>button.addEventListener("click",()=>show(index)));$(deck,"[data-e02-prev]").addEventListener("click",()=>show(current-1));$(deck,"[data-e02-next]").addEventListener("click",()=>show(current+1));deck.addEventListener("keydown",event=>{if(event.key==="ArrowLeft"){event.preventDefault();show(current-1);}if(event.key==="ArrowRight"){event.preventDefault();show(current+1);}});show(0);}
  function initFiles(){const rail=$(document,"[data-e02-file-rail]");if(!rail)return;$$ (rail,'a[href^="https://github.com/"]').forEach(link=>{link.target="_blank";link.rel="noopener";});const buttons=$$(rail,"[data-e02-file]"),cards=$$(document,"[data-e02-file-panel]");rail.setAttribute("role","tablist");rail.setAttribute("aria-label","Arquivos da Etapa 02");buttons.forEach((button,index)=>{const id=button.dataset.e02File,card=cards.find(item=>item.dataset.e02FilePanel===id);button.id=`e02-file-tab-${id}`;button.setAttribute("role","tab");button.setAttribute("aria-controls",`e02-file-panel-${id}`);button.tabIndex=index? -1:0;card.id=`e02-file-panel-${id}`;card.setAttribute("role","tabpanel");card.setAttribute("aria-labelledby",button.id);});function show(id,focus=false){buttons.forEach(button=>{const on=button.dataset.e02File===id;button.classList.toggle("is-active",on);button.setAttribute("aria-selected",String(on));button.tabIndex=on?0:-1;if(on&&focus)button.focus();});cards.forEach(card=>card.classList.toggle("is-active",card.dataset.e02FilePanel===id));}buttons.forEach((button,index)=>{button.addEventListener("click",()=>show(button.dataset.e02File));button.addEventListener("keydown",event=>{if(!["ArrowLeft","ArrowRight","Home","End"].includes(event.key))return;event.preventDefault();const target=event.key==="Home"?0:event.key==="End"?buttons.length-1:(index+(event.key==="ArrowRight"?1:buttons.length-1))%buttons.length;show(buttons[target].dataset.e02File,true);});});show("readme");}

  function initSimulator(){
    const root=$(document,"[data-etapa02-simulator]");if(!root)return;
    const state={
      mode:"water",
      blocksByMode:{
        water:{blockedEdges:new Set(),blockedNodes:new Set()},
        search:{blockedEdges:new Set(),blockedNodes:new Set()},
        round:{blockedEdges:new Set(),blockedNodes:new Set()},
        agv:{blockedEdges:new Set(),blockedNodes:new Set()},
        materials:{blockedEdges:new Set(),blockedNodes:new Set()},
        vehicles:{blockedEdges:new Set(),blockedNodes:new Set()}
      },
      origins:{water:"TK-101_Agua",search:"Reservatorio",agv:"Lab",vehicles:"RECEBIMENTO"},
      destinations:{water:"DOS-201_Dosador",search:"Empacotadora",vehicles:"DOCA_EXPEDICAO"},
      solutions:{},
      logs:[]
    };
    const graphSvg=$(root,"[data-e02-graph]"),
          selection=$(root,"[data-e02-selection]"),
          blocks=$(root,"[data-e02-blocks]"),
          routeNode=$(root,"[data-e02-route]"),
          logNode=$(root,"[data-e02-log]"),
          modelSelect=$(root,"[data-e02-model-select]");

    function meta(){return MODE[state.mode];}
    function currentBlocks(){return state.blocksByMode[state.mode];}

    function log(message){
      state.logs.unshift(message);
      state.logs=state.logs.slice(0,4);
      logNode.replaceChildren(...state.logs.map(line=>add(document.createDocumentFragment(),"li",{},line)));
    }

    function opts(zoneId,value){
      const nodes=zoneId==="water"?["TK-101_Agua","P-101_BombaA","P-102_BombaB","MAN-200_Agua","DOS-201_Dosador","BIC-202_Bico"]:GRAPH[zoneId].nodes;
      return nodes.map(node=>`<option value="${node}"${node===value?" selected":""}>${node}</option>`).join("");
    }

    function controls(){
      const mode=meta(),g=mode.graph,cur=currentBlocks();
      selection.replaceChildren();
      if(["dijkstra","search"].includes(mode.kind)){
        const one=add(add(selection,"label",{},"Origem"),"select",{"data-e02-origin":""});
        one.innerHTML=opts(state.mode,state.origins[state.mode]||mode.origin);
        const two=add(add(selection,"label",{},"Destino"),"select",{"data-e02-destination":""});
        two.innerHTML=opts(state.mode,state.destinations[state.mode]||mode.destination);
        one.addEventListener("change",()=>{state.origins[state.mode]=one.value;run();});
        two.addEventListener("change",()=>{state.destinations[state.mode]=two.value;run();});
      }else if(mode.kind==="agv"){
        const one=add(add(selection,"label",{},"Partida (matriz ilustrativa)"),"select",{"data-e02-origin":""});
        one.innerHTML=opts("agv",state.origins.agv||"Lab");
        one.addEventListener("change",()=>{state.origins.agv=one.value;run();});
      }else{
        add(selection,"p",{},mode.kind==="kahn"?"A ordenação topológica considera todo o fluxo de materiais da planta.":"Bloqueie trechos no diagrama para testar paridade e conectividade.");
      }

      blocks.replaceChildren();
      const choices=mode.blocks||[];
      if(!choices.length){
        blocks.textContent="Este modelo de análise não possui bloqueios interativos cadastrados.";
        return;
      }
      choices.forEach(id=>{
        const edge=g.edges.find(item=>item.id===id),isNode=g.nodes.includes(id),label=add(blocks,"label"),input=add(label,"input",{type:"checkbox",value:id,"data-e02-block":""});
        input.checked=isNode?cur.blockedNodes.has(id):cur.blockedEdges.has(id);
        add(label,"span",{},isNode?`Nó · ${id}`:`${edge.id} · ${edge.from} ${g.directed?"→":"—"} ${edge.to} · ${edge.weight} ${g.unit}`);
        input.addEventListener("change",()=>{
          (isNode?cur.blockedNodes:cur.blockedEdges)[input.checked?"add":"delete"](id);
          run();
        });
      });
    }

    const nodePositions={
      water:{
        "TK-101_Agua":{x:95,y:195},"P-101_BombaA":{x:215,y:125},"P-102_BombaB":{x:215,y:265},
        "MAN-200_Agua":{x:335,y:195},"DOS-201_Dosador":{x:445,y:195},"BIC-202_Bico":{x:445,y:300},
        "MAG-100_Copos":{x:95,y:405},"MESA-000_Index":{x:270,y:405},"EST-500_Saida":{x:445,y:405}
      },
      search:{
        "Reservatorio":{x:635,y:250},"Bomba":{x:740,y:250},"V1":{x:840,y:145},"V2":{x:840,y:355},
        "Envasadora":{x:935,y:250},"Estacao_Inspecao":{x:1010,y:155},"Empacotadora":{x:1010,y:345}
      },
      round:{
        "PAINEL":{x:1165,y:250},"FRL-001":{x:1235,y:120},"S100":{x:1345,y:90},"S200":{x:1465,y:125},
        "S300":{x:1525,y:250},"S400":{x:1465,y:380},"S500":{x:1345,y:415},"MESA":{x:1345,y:250}
      },
      materials:{
        "RECEB_COPOS":{x:70,y:560},"ESTOQUE_COPOS":{x:185,y:560},"MAG-100_Copos":{x:305,y:560},"E1_DISPENSA":{x:445,y:560},
        "RECEB_AGUA":{x:70,y:625},"TK-101_Agua":{x:235,y:625},"E2_ENVASE":{x:445,y:625},
        "RECEB_TAMPAS":{x:70,y:690},"ESTOQUE_TAMPAS":{x:235,y:690},"E3_TAMPA":{x:445,y:690},
        "E4_SELAGEM":{x:445,y:755},"E5_EJECAO":{x:445,y:820},"EST-500_Saida":{x:445,y:900},
        "EMBALAGEM":{x:320,y:900},"ESTOQUE_PRODUTO":{x:195,y:900},"DOCA_EXPEDICAO":{x:70,y:900}
      },
      vehicles:{
        "PORTARIA":{x:630,y:600},"SAIDA":{x:990,y:600},"ABASTECIMENTO":{x:810,y:600},
        "RECEBIMENTO":{x:630,y:745},"CORREDOR_A":{x:745,y:745},"CORREDOR_B":{x:875,y:745},
        "ESTOQUE_FINAL":{x:990,y:745},"VIA_EXTERNA":{x:810,y:895},"DOCA_EXPEDICAO":{x:990,y:895}
      },
      agv:{
        "Lab":{x:1345,y:600},"TK301":{x:1485,y:675},"TK302":{x:1485,y:820},
        "R101":{x:1345,y:895},"TK303":{x:1205,y:820},"GRAN201":{x:1205,y:675}
      }
    };

    function renderGraph(){
      const width=1620,height=980,activeMode=state.mode;
      const activeSol=state.solutions[activeMode]||{};
      const activeRouteNodes=new Set(activeSol.path||activeSol.order||[]);
      const activeRouteEdges=new Set(activeSol.edgeIds||[]);
      const activeBlockedNodes=state.blocksByMode[activeMode]?.blockedNodes||new Set();
      const activeBlockedEdges=state.blocksByMode[activeMode]?.blockedEdges||new Set();

      const coupledRouteNodes=new Set(),coupledBlockedNodes=new Set(),coupledRouteLinks=new Set(),coupledBlockedLinks=new Set();
      COUPLING_LINKS.forEach(link=>{
        const srcActive=(link.sourceZone===activeMode),tgtActive=(link.targetZone===activeMode);
        if(srcActive){
          if(activeRouteNodes.has(link.sourceNode)){coupledRouteLinks.add(link.id);coupledRouteNodes.add(`${link.targetZone}:${link.targetNode}`);}
          if(activeBlockedNodes.has(link.sourceNode)){coupledBlockedLinks.add(link.id);coupledBlockedNodes.add(`${link.targetZone}:${link.targetNode}`);}
        }else if(tgtActive){
          if(activeRouteNodes.has(link.targetNode)){coupledRouteLinks.add(link.id);coupledRouteNodes.add(`${link.sourceZone}:${link.sourceNode}`);}
          if(activeBlockedNodes.has(link.targetNode)){coupledBlockedLinks.add(link.id);coupledBlockedNodes.add(`${link.sourceZone}:${link.sourceNode}`);}
        }
      });

      graphSvg.setAttribute("viewBox",`0 0 ${width} ${height}`);
      graphSvg.replaceChildren();

      const defs=add(graphSvg,"defs",{},"",true);
      const makeArrow=(id,fill)=>{
        const marker=add(defs,"marker",{id,viewBox:"0 0 10 10",refX:9.5,refY:5,markerWidth:11,markerHeight:11,markerUnits:"userSpaceOnUse",orient:"auto-start-reverse"},"",true);
        add(marker,"path",{d:"M 0 0 L 10 5 L 0 10 z",fill},"",true);
      };
      makeArrow("e02-arrow","var(--ink-muted)");
      makeArrow("e02-arrow-route","var(--teal)");
      makeArrow("e02-arrow-context-route","color-mix(in srgb, var(--teal) 65%, var(--ink-muted))");
      makeArrow("e02-arrow-blocked","var(--red)");

      const zoneLayer=add(graphSvg,"g",{class:"e02-zone-layer"},"",true);
      const couplingLayer=add(graphSvg,"g",{class:"e02-coupling-layer"},"",true);
      const edgeLayer=add(graphSvg,"g",{class:"e02-edge-layer"},"",true);
      const nodeLayer=add(graphSvg,"g",{class:"e02-node-layer"},"",true);
      const labelLayer=add(graphSvg,"g",{class:"e02-label-layer"},"",true);

      ZONES.forEach(z=>{
        const isActive=(z.id===activeMode);
        const zg=add(zoneLayer,"g",{class:`e02-zone ${isActive?"is-active-zone":""}`,"data-e02-zone":z.id,role:"region","aria-label":z.title},"",true);
        add(zg,"rect",{class:"e02-zone-box",x:z.x,y:z.y,width:z.width,height:z.height,rx:10},"",true);
        add(zg,"text",{class:"e02-zone-title",x:z.x+16,y:z.y+26},z.title,true);
        zg.addEventListener("click",()=>{if(state.mode!==z.id)changeMode(z.id,true);});
      });

      COUPLING_LINKS.forEach(link=>{
        const a=nodePositions[link.sourceZone]?.[link.sourceNode];
        const b=nodePositions[link.targetZone]?.[link.targetNode];
        if(!a||!b)return;
        const dx=b.x-a.x,dy=b.y-a.y;
        const cx1=a.x+dx*0.25,cy1=a.y+dy*0.5,cx2=a.x+dx*0.75,cy2=a.y+dy*0.5;
        const d=`M ${a.x} ${a.y} C ${cx1} ${cy1} ${cx2} ${cy2} ${b.x} ${b.y}`;
        const isRoute=coupledRouteLinks.has(link.id),isBlocked=coupledBlockedLinks.has(link.id);
        add(couplingLayer,"path",{
          d,
          class:`e02-coupling-edge ${isRoute?"is-coupled-route":""} ${isBlocked?"is-coupled-blocked":""}`,
          "data-e02-coupling":link.id,
          "data-coupling-from":link.from,
          "data-coupling-to":link.to,
          "aria-label":`Elo de interconexão entre ${link.from} e ${link.to}`
        },"",true);
      });

      ZONES.forEach(z=>{
        const g=GRAPH[z.id],isCurrentZone=(z.id===activeMode);
        const sol=state.solutions[z.id]||{};
        const routeEdges=new Set(sol.edgeIds||[]);
        const bEdges=state.blocksByMode[z.id]?.blockedEdges||new Set();
        const bNodes=state.blocksByMode[z.id]?.blockedNodes||new Set();
        const interactive=(MODE[z.id].blocks||[]).length>0;

        g.edges.forEach(edge=>{
          const a=nodePositions[z.id][edge.from],b=nodePositions[z.id][edge.to];
          if(!a||!b)return;
          const dx=b.x-a.x,dy=b.y-a.y,length=Math.hypot(dx,dy)||1,ux=dx/length,uy=dy/length;
          const pad=Math.min(48/(Math.abs(ux)||Number.EPSILON),14/(Math.abs(uy)||Number.EPSILON));
          const start={x:a.x+ux*pad,y:a.y+uy*pad},end={x:b.x-ux*pad,y:b.y-uy*pad};
          const reverse=g.edges.some(item=>item.from===edge.to&&item.to===edge.from);
          const curve=reverse?18:0,cx=(start.x+end.x)/2-dy/length*curve,cy=(start.y+end.y)/2+dx/length*curve;
          const path=`M ${start.x} ${start.y} Q ${cx} ${cy} ${end.x} ${end.y}`;

          const isBlocked=bEdges.has(edge.id)||bNodes.has(edge.from)||bNodes.has(edge.to);
          const isRoute=isCurrentZone&&routeEdges.has(edge.id);
          const isContextRoute=!isCurrentZone&&routeEdges.has(edge.id);

          const line=add(edgeLayer,"path",{
            d:path,
            "data-e02-edge-id":edge.id,
            "data-e02-zone":z.id,
            class:`e02-edge ${interactive?"e02-svg-edge":""} ${isRoute?"is-route":""} ${isContextRoute?"is-context-route":""} ${isBlocked?"is-blocked":""}`
          },"",true);

          if(g.directed){
            const markerId=isBlocked?"e02-arrow-blocked":isRoute?"e02-arrow-route":isContextRoute?"e02-arrow-context-route":"e02-arrow";
            line.setAttribute("marker-end",`url(#${markerId})`);
          }
          line.setAttribute("aria-label",`${edge.id}: ${edge.from} para ${edge.to}, ${edge.weight} ${g.unit}${interactive?". Alternar bloqueio.":"."}`);

          if(interactive){
            line.setAttribute("tabindex","0");
            line.setAttribute("role","button");
            const toggle=()=>{
              if(state.mode!==z.id)changeMode(z.id);
              bEdges.has(edge.id)?bEdges.delete(edge.id):bEdges.add(edge.id);
              state.focusSelector=`[data-e02-edge-id="${edge.id}"][data-e02-zone="${z.id}"]`;
              run();
            };
            line.addEventListener("click",toggle);
            line.addEventListener("keydown",event=>{if(event.key==="Enter"||event.key===" "){event.preventDefault();toggle();}});
          }

          const mid={x:(start.x+2*cx+end.x)/4,y:(start.y+2*cy+end.y)/4};
          const shift=z.id==="materials"?({"m9":0,"m10":0}[edge.id]??-22):z.id==="search"||z.id==="vehicles"?26:z.id==="agv"?({"g3":-22,"g8":22,"g12":-16}[edge.id]||10):10;
          add(labelLayer,"text",{x:mid.x-uy*shift,y:mid.y+ux*shift,class:"e02-edge-label"},`${edge.id} · ${edge.weight}`,true);
        });

        const blockableNodes=new Set((MODE[z.id].blocks||[]).filter(id=>g.nodes.includes(id)));
        g.nodes.forEach(node=>{
          const point=nodePositions[z.id][node];
          if(!point)return;
          const isBlocked=bNodes.has(node);
          const isRoute=isCurrentZone&&activeRouteNodes.has(node);
          const isContextRoute=!isCurrentZone&&(new Set(sol.path||sol.order||[])).has(node);
          const isCoupledRoute=coupledRouteNodes.has(`${z.id}:${node}`);
          const isCoupledBlocked=coupledBlockedNodes.has(`${z.id}:${node}`);
          const isCoupledNode=isCoupledRoute||isCoupledBlocked;
          const clickable=blockableNodes.has(node);

          const group=add(nodeLayer,"g",{
            class:`e02-node ${clickable?"e02-svg-node":""} ${isRoute?"is-route":""} ${isContextRoute?"is-context-route":""} ${isBlocked?"is-blocked":""} ${isCoupledNode?"is-coupled-node":""} ${isCoupledRoute?"is-coupled-route":""} ${isCoupledBlocked?"is-coupled-blocked":""}`,
            "data-e02-node-id":node,
            "data-e02-zone":z.id
          },"",true);

          add(group,"rect",{x:point.x-48,y:point.y-14,width:96,height:28,rx:4},"",true);
          add(group,"text",{x:point.x,y:point.y+1},node.length>14?`${node.slice(0,13)}…`:node,true);

          if(clickable){
            group.setAttribute("tabindex","0");
            group.setAttribute("role","button");
            group.setAttribute("aria-label",`${node}. Alternar bloqueio.`);
            const toggle=()=>{
              if(state.mode!==z.id)changeMode(z.id);
              bNodes.has(node)?bNodes.delete(node):bNodes.add(node);
              state.focusSelector=`.e02-svg-node[data-e02-node-id="${node}"][data-e02-zone="${z.id}"]`;
              run();
            };
            group.addEventListener("click",toggle);
            group.addEventListener("keydown",event=>{if(event.key==="Enter"||event.key===" "){event.preventDefault();toggle();}});
          }else{
            group.addEventListener("click",()=>{if(state.mode!==z.id)changeMode(z.id);});
          }
        });
      });

      const interactive=(MODE[activeMode].blocks||[]).length>0;
      const legendItems=[
        {text:"aresta",class:""},
        {text:"rota calculada",class:"route"},
        {text:"rota em outra vista",class:"context-route"},
        {text:"elo entre vistas (interconexão)",class:"coupling"},
        {text:interactive?"bloqueio acionável":"bloqueio",class:"block"}
      ];
      $(root,"[data-e02-legend]").replaceChildren(
        ...legendItems.map(item=>add(document.createDocumentFragment(),"span",{class:item.class},item.text))
      );

      if(state.focusSelector){
        graphSvg.querySelector(state.focusSelector)?.focus();
        state.focusSelector=null;
      }
    }

    function syncBlocks(){
      const active=MODE[state.mode],cur=currentBlocks();
      blocks.querySelectorAll("[data-e02-block]").forEach(input=>{
        input.checked=active.graph.nodes.includes(input.value)?cur.blockedNodes.has(input.value):cur.blockedEdges.has(input.value);
      });
      graphSvg.querySelectorAll(".e02-svg-edge").forEach(line=>{
        const zId=line.dataset.e02Zone,eId=line.dataset.e02EdgeId;
        line.setAttribute("aria-pressed",String(state.blocksByMode[zId]?.blockedEdges.has(eId)));
      });
      graphSvg.querySelectorAll(".e02-svg-node").forEach(node=>{
        const zId=node.dataset.e02Zone,nId=node.dataset.e02NodeId;
        node.setAttribute("aria-pressed",String(state.blocksByMode[zId]?.blockedNodes.has(nId)));
      });
      const extras=[...cur.blockedEdges].filter(id=>!(active.blocks||[]).includes(id));
      let note=$(blocks,"[data-e02-extra-blocks]");
      if(extras.length){
        if(!note)note=add(blocks,"p",{"data-e02-extra-blocks":"","aria-live":"polite"});
        note.textContent=`Arestas bloqueadas no diagrama: ${extras.join(", ")}.`;
      }else note?.remove();
    }

    function computeZoneSolution(modeKey){
      const mode=MODE[modeKey],g=mode.graph,b=state.blocksByMode[modeKey];
      const origin=state.origins[modeKey]||mode.origin;
      const destination=state.destinations[modeKey]||mode.destination;
      const options={blockedEdges:b.blockedEdges,blockedNodes:b.blockedNodes};

      if(mode.kind==="dijkstra") return dijkstra(g,origin,destination,options);
      if(mode.kind==="search"){
        const wide=bfs(g,origin,destination,options);
        const depth=dfsPaths(g,origin,destination,{...options,limit:40});
        return {...wide,paths:depth.paths||[],limited:depth.limited};
      }
      if(mode.kind==="euler") return euler(g,options);
      if(mode.kind==="agv"){
        const nn=nearestNeighbor(g,origin||"Lab");
        const opt=nn.ok?twoOpt(g,nn.route):nn;
        return {ok:nn.ok,nn,opt,path:opt.route||[],edgeIds:nn.ok?routeEdgeIds(g,opt.route):[]};
      }
      if(mode.kind==="kahn"){
        const ans=kahn(g,options);
        return {ok:ans.ok,order:ans.order,path:ans.order,edgeIds:ans.ok?["m8","m9","m10","m11"]:[],reason:ans.reason};
      }
      return {ok:false,path:[],edgeIds:[]};
    }

    function run(){
      Object.keys(MODE).forEach(key=>{
        state.solutions[key]=computeZoneSolution(key);
      });

      const mode=meta(),sol=state.solutions[state.mode],g=mode.graph;
      const origin=state.origins[state.mode]||mode.origin;
      const destination=state.destinations[state.mode]||mode.destination;

      let title="",desc="",path=[],edgeIds=[];
      if(mode.kind==="dijkstra"){
        title=sol.ok?`${sol.distance} ${g.unit}`:"Sem rota";
        desc=sol.ok?`${origin} → ${destination}; Dijkstra respeitou direção, pesos e bloqueios.`:`${sol.reason}. Nenhum caminho é exibido.`;
        path=sol.path||[];edgeIds=sol.edgeIds||[];
        log(sol.ok?`Dijkstra: ${sol.distance} ${g.unit}.`:`Dijkstra: ${sol.reason}.`);
      }else if(mode.kind==="search"){
        const paths=sol.paths?.map(item=>item.path.join(" → ")).join(" | ");
        title=sol.ok?`${sol.hops} arestas por BFS`:"Sem rota";
        desc=sol.ok?`DFS encontrou ${sol.paths.length} caminho(s) simples${sol.limited?" (limite atingido)":""}: ${paths}; BFS ignora os pesos em s.`:`${sol.reason}.`;
        path=sol.path||[];edgeIds=sol.edgeIds||[];
        log(sol.ok?`BFS: ${sol.hops} saltos; DFS: ${sol.paths.length} caminho(s).`:`Busca: ${sol.reason}.`);
      }else if(mode.kind==="euler"){
        title=sol.ok?`${sol.kind[0].toUpperCase()+sol.kind.slice(1)} · ${sol.weight} min`:"Rota Euleriana indisponível";
        desc=sol.ok?`Hierholzer usou ${sol.edgeIds.length} IDs uma vez cada (${sol.edgeIds.join(" → ")}).`:`${sol.reason}; não há rota exibida.`;
        path=sol.path||[];edgeIds=sol.edgeIds||[];
        log(sol.ok?`Euler: ${sol.kind}, ${sol.weight} min.`:`Euler: ${sol.reason}.`);
      }else if(mode.kind==="agv"){
        const nn=sol.nn||{},opt=sol.opt||{};
        title=sol.ok?`NN ${nn.distance} s → 2-Opt ${opt.distance} s`:"Ciclo indisponível";
        desc=sol.ok?`NN inicial (${nn.route.join(" → ")}) refinada por 2-Opt; a melhoria aceita apenas troca estritamente melhor e é candidata, não ótimo global.`:"A matriz não fecha um ciclo.";
        path=opt.route||[];edgeIds=sol.edgeIds||[];
        log(sol.ok?`NN ${nn.distance} s; 2-Opt ${opt.distance} s.`:"AGV: sem ciclo.");
      }else{
        const chain=["E1_DISPENSA","E2_ENVASE","E3_TAMPA","E4_SELAGEM","E5_EJECAO"];
        title=sol.ok?`${sol.order.length} vértices ordenados`:"Ciclo detectado";
        desc=sol.ok?`Kahn ordenou precedências; ${chain.join(" → ")} (E1–E5) permanece no DAG.`:"A ordenação ficou incompleta; não há sequência válida.";
        path=sol.order||[];edgeIds=sol.edgeIds||[];
        log(sol.ok?`Kahn: ${sol.order.length} vértices.`:"Kahn: ciclo detectado.");
      }

      $(root,"[data-e02-result-title]").textContent=title;
      $(root,"[data-e02-result]").textContent=desc;
      routeNode.replaceChildren(...path.map(node=>add(document.createDocumentFragment(),"li",{},node)));
      renderGraph();
      syncBlocks();
    }

    function changeMode(id,focus=false){
      state.mode=id;
      const mode=meta();
      $$(root,"[data-e02-mode]").forEach(button=>{
        const on=button.dataset.e02Mode===id;
        button.setAttribute("aria-selected",String(on));
        button.tabIndex=on?0:-1;
        if(on&&focus)button.focus();
      });
      if(modelSelect&&modelSelect.value!==id)modelSelect.value=id;
      root.setAttribute("aria-labelledby",`e02-mode-${id}`);
      $(root,"[data-e02-mode-code]").textContent=mode.code;
      $(root,"[data-e02-mode-title]").textContent=mode.title;
      $(root,"[data-e02-mode-description]").textContent=mode.description;
      $(root,"[data-e02-mode-unit]").textContent=`${mode.graph.unit} · ${mode.graph.directed?"dirigido":"não dirigido"}`;
      graphSvg.setAttribute("aria-label",`Diagrama unificado — modelo ativo: ${mode.title}`);
      state.logs=[`Modelo ${mode.title} selecionado.`];
      controls();
      run();
    }

    const modeButtons=$$(root,"[data-e02-mode]");
    modeButtons.forEach((button,index)=>{
      button.addEventListener("click",()=>changeMode(button.dataset.e02Mode));
      button.addEventListener("keydown",event=>{
        if(!["ArrowLeft","ArrowRight","Home","End"].includes(event.key))return;
        event.preventDefault();
        const target=event.key==="Home"?0:event.key==="End"?modeButtons.length-1:(index+(event.key==="ArrowRight"?1:modeButtons.length-1))%modeButtons.length;
        changeMode(modeButtons[target].dataset.e02Mode,true);
      });
    });

    if(modelSelect){
      modelSelect.addEventListener("change",()=>changeMode(modelSelect.value));
    }

    $(root,"[data-e02-run]").addEventListener("click",run);
    $(root,"[data-e02-reset]").addEventListener("click",()=>{
      state.blocksByMode[state.mode].blockedEdges.clear();
      state.blocksByMode[state.mode].blockedNodes.clear();
      state.origins[state.mode]=meta().origin;
      state.destinations[state.mode]=meta().destination;
      controls();
      run();
    });

    changeMode("water");
  }

  function init(){initTabs();initDeck();initFiles();initSimulator();}
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
  return api;
})();
