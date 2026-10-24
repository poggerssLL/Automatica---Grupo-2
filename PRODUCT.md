# Aqua Index

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Colegas e avaliadores que percorrem as etapas acadêmicas e experimentam os simuladores didáticos no navegador.

## Product Purpose

Apresentar a evolução do projeto de uma envasadora pneumática de água em copos e permitir explorar suas etapas, documentação e simulações locais. A primeira tela deve facilitar a exploração das etapas.

## Positioning

O portal conecta uma planta de cinco estações aos estudos de lógica formal e grafos, com simulações e material de apoio consultáveis no próprio repositório.

## Operating Context

Projeto acadêmico ECAA08, Grupo 2. A Etapa 01 apresenta lógica formal e um simulador de regras da envasadora; a Etapa 02 apresenta grafos e seis modelos didáticos interativos. As Etapas 03 e 04 estão indicadas como planejadas.

## Capabilities and Constraints

- GitHub Pages com HTML, CSS e JavaScript locais; sem build de aplicação.
- Preservar o funcionamento dos simuladores e seus controles, dados e resultados.
- O projeto permanecerá conceitual; a envasadora não será construída. Conteúdo e imagens não devem sugerir uma máquina física concluída ou um sistema de segurança certificado.
- O usuário não indicou identidade visual adicional que precise permanecer igual.

## Evidence on Hand

- `index.html` e páginas em `doc/` contêm o conteúdo e a navegação atuais.
- `doc/js/main.js` e `doc/css/styles.css` implementam e estilizam o simulador da Etapa 01.
- `doc/js/etapa-02-simulator.js` e `doc/css/etapa-02.css` implementam e estilizam o simulador da Etapa 02.

## Product Principles

- Deixar as etapas fáceis de encontrar e comparar.
- Tornar explícito o caráter didático dos resultados.
- Preservar a operação dos simuladores durante mudanças visuais no portal.
