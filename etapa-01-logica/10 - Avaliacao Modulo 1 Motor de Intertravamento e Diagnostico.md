# Aula 10: Avaliação Integrada do Módulo 1 — Motor de Intertravamento e Diagnóstico

## 1. Escopo e Diretrizes do Desafio de Engenharia

Nesta avaliação integradora, consolidamos os conceitos do **Módulo 1: Lógica Formal & Sistemas Especialistas**, demonstrando o funcionamento conjunto aplicado à **Máquina Pneumática de Envasamento de Água em Copos**:
1. Catálogo e telemetria de *Tags* ISA-5.1 (sensores magnéticos, capacitivos, pressostato e temperatura) com discretização proposicional.
2. Motor de intertravamento e prova formal de tautologia de segurança (garantindo paradas seguras e bloqueios em caso de falta de copo ou falha térmica).
3. Base de conhecimento especialista e motor de inferência *Forward Chaining* para isolamento de causa-raiz e diagnóstico da mesa indexadora.

---

### 1.1 Visão Geral da Arquitetura de Decisão

O Módulo 1 do nosso sistema **SCADA** consolidida o fluxo de dados desde o "chão de fábrica" virtual (Automation Studio) até a tomada de decisão no nível de supervisão. A arquitetura lógica que construímos opera em três camadas sucessivas:

1. **Telemetria (Sinais Analógicos/Digitais):** O SCADA lê dados brutos do processo simulado. Ex: `Temp_Termosselagem = 175.5°C`.
2. **Mapeador Proposicional (Discretização):** Transforma dados contínuos em fatos booleanos (T/F). Ex: Se T < 180°C, então a variável lógica `baixa_temp` é cravada como **True**.
3. **Motor de Inferência Especialista (Forward Chaining):** Analisa a Base de Conhecimento e dispara dedutivamente a cascata de consequências (Ex: `baixa_temp` $\rightarrow$ `bloqueia_prensa`).

---

### 1.2 Base de Conhecimento: Intertravamentos da Envasadora

As regras de produção do nosso Sistema Especialista foram extraídas diretamente da **Tabela de Estratégia de Controle e Intertravamentos** do processo pneumático:

| Regra | Condição Lógica (Antecedentes) | Ação de Intertravamento (Consequente) | Setor ISA-5.1 | Justificativa |
| :--- | :--- | :--- | :--- | :--- |
| **R-01** | `["e1"]` | `parada_imediata` | 000 | O botão de emergência acionado corta todo o ciclo. |
| **R-02** | `["falta_copo"]` | `alarme_sem_copo` | 100 | Copo ausente na dispensação gera alarme e impede o prosseguimento. |
| **R-03** | `["alarme_sem_copo"]` | `bloqueia_dosador` | 200 | Falta de copo impede abertura do bico no Setor 200 para evitar derramamento. |
| **R-04** | `["tem_copo", "baixa_temp"]` | `bloqueia_prensa` | 400 | A prensa não inicia a termosselagem se a temperatura não for atingida. |
| **R-05** | `["tem_copo", "t1"]` | `libera_prensa` | 400 | Prensa avança e aplica pressão somente após atingir a temperatura ideal. |

---

## 2. O Ciclo de Scan do Autograder (Entregável)

O entregável desta aula é o script executável em Python (`.ipynb`) que avalia o motor de inferência submetendo a planta a três cenários críticos de estresse:

*   **Cenário A (Falta de Copo):** Simula a ausência de recipiente no Setor 100. Espera-se que o motor infira `alarme_sem_copo` e, em cascata, `bloqueia_dosador`.
*   **Cenário B (Bloqueio Térmico):** Simula o Setor 400 com copo presente, porém com a resistência fria. Espera-se que o motor infira `bloqueia_prensa`.
*   **Cenário C (Operação Normal):** Todas as condições nominais atingidas. Espera-se que o sistema valide as regras libere o processo (`libera_prensa`).
