# Identidade visual — Aqua Index

## Intenção

O portal apresenta quatro etapas acadêmicas sobre um mesmo caso de estudo conceitual. A abertura dá prioridade a **Lógica, Grafos, Árvores e Relações**; as cinco estações da envasadora aparecem depois, como contexto separado. Não usar imagens de máquina construída, desenhos envelhecidos ou textura de blueprint.

## Sistema visual

- Composição de atlas editorial: divisões por linhas finas, módulos de leitura e tipografia em escala ampla, sem cartões genéricos ou métricas decorativas.
- Fundo claro quase branco (#f8f9f7), texto azul escuro (#142534) e vermelho de orientação (#c62f24). O tema escuro usa #101a21, #f1f4f2 e #ff7666.
- Títulos em Georgia; navegação e texto funcional em Segoe UI ou substituto do sistema. O contraste entre serifas e texto de interface organiza a leitura.
- Diagramas SVG abstratos e precisos representam os quatro campos de estudo. São sinais de navegação, não modelos técnicos validados.
- Etapas 01 e 02 são links; 03 e 04 mostram estado planejado e não simulam disponibilidade.
- Interações são discretas: realce dos links, foco visível, alternância de tema e menu existente. Respeitar movimento reduzido.

## Implementação e limites

index.html contém a composição principal. doc/css/portal.css aplica a identidade à casca do portal por meio de @scope (.portal-ui); as páginas internas preservam conteúdo e controles. A URL versionada desse CSS em cinco páginas usa o SHA-256 do arquivo normalizado com LF.

Os slides e simuladores das Etapas 01 e 02 recebem o novo tratamento visual em `doc/css/revamp.css`, carregado por último nessas duas páginas. A apresentação usa folhas claras, linhas finas, diagramas e serifas; os laboratórios destacam estados e resultados com controles planos e legíveis. Os módulos funcionais permanecem em `doc/js/main.js` e `doc/js/etapa-02-simulator.js`; os seletores e atributos `data-*` foram preservados. O arquivo CSS novo tem URL versionada pelo SHA-256 do próprio conteúdo.

Nenhuma imagem gerada compõe o site publicado. A imagem aprovada foi apenas referência de composição; os dados e rótulos finais são do repositório e da orientação do autor.
