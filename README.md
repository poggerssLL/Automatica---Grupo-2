# SCADA para Máquina de Envasamento de Água em Copos

## 1. Visão geral

Este projeto propõe a aplicação de conceitos de supervisão, controle sequencial e automação industrial a uma máquina pneumática de envasamento de água em copos. A planta é organizada em uma mesa giratória indexada com cinco estações: dispensação de copos, envase, posicionamento de tampa, termosselagem e ejeção.

O foco do repositório é a **camada de controle e supervisão do processo**, isto é, a representação dos estados da máquina, o acompanhamento das variáveis de processo, a validação das permissões de operação e a identificação de falhas pelos sinais de campo. A planta pneumática é o processo supervisionado; não é o objeto principal da aplicação de software.

> O escopo foi estruturado a partir do relatório técnico da máquina de envase. Recursos que não aparecem no relatório são tratados como evolução futura, e não como funcionalidade já implementada.

---

## 2. Objetivo do sistema supervisório

Desenvolver uma aplicação de supervisão para acompanhar a operação de uma máquina de envase de água em copos, integrando o sequenciamento do CLP, os sensores, os atuadores pneumáticos e as condições de processo relevantes para a produção segura e repetível.

O sistema deve permitir que o operador compreenda, em tempo de execução:

- o estado global do ciclo de produção;
- o estágio em que cada copo se encontra;
- a posição e a confirmação de cada atuador;
- a condição das permissões de ciclo e dos intertravamentos;
- a ocorrência de falhas de processo, como ausência de copo, tampa não capturada, falha de dosagem ou temperatura inadequada;
- a contagem de produtos finalizados e os parâmetros operacionais da máquina.

---

## 3. Processo supervisionado

A máquina opera sobre uma mesa giratória indexada. Cada avanço da mesa posiciona os copos para a próxima operação e depende da conclusão segura do estágio anterior.

```text
Magazine de copos
       │
       ▼
[E1] Dispensa do copo
       │
       ▼
[E2] Envase e dosagem
       │
       ▼
[E3] Captura e posicionamento da tampa
       │
       ▼
[E4] Termosselagem
       │
       ▼
[E5] Ejeção ──► Esteira de saída ──► Contagem de produção
```

### 3.1 Contexto físico resumido

| Estágio | Operação supervisionada | Elementos de campo principais |
| --- | --- | --- |
| E1 | Liberação individual de copo | Cilindro A, sensor magnético, sensor óptico de copo |
| E2 | Aspiração, dosagem e fechamento do bico | Atuadores B, C e Bico; medidor de fluxo; sensor ultrassônico |
| E3 | Captura e deposição de tampa | Atuadores D e E; ejetor Venturi; ventosa; pressostato de vácuo |
| E4 | Aplicação de calor e pressão | Cilindro F, resistência cartucho, termopar |
| E5 | Transferência do produto para a esteira | Cilindros G e H; sensor de contagem |

Os parâmetros nominais registrados para a planta são 150 mL por copo, tolerância de ±3 mL, ciclo de 2,2 s, produção de 27 copos/min, pressão pneumática de 6 bar, temperatura de selagem de 180 °C e tempo de selagem de 2 s.

---

## 4. Arquitetura da aplicação

O sistema é organizado em três camadas, separando claramente o processo físico, o controle determinístico e a visualização supervisória.

```text
┌────────────────────────────────────────────────────────────────────┐
│                    CAMADA DE SUPERVISÃO                            │
│  Estado da máquina | Variáveis de processo | Alarmes | Produção    │
└───────────────────────────────▲────────────────────────────────────┘
                                │
┌───────────────────────────────┴────────────────────────────────────┐
│                     CAMADA DE CONTROLE                              │
│      FSM global | FSM por estágio | Intertravamentos | CLP          │
│              ST / LD / SFC conforme IEC 61131-3                    │
└───────────────────────────────▲────────────────────────────────────┘
                                │
┌───────────────────────────────┴────────────────────────────────────┐
│                       CAMADA DE PROCESSO                            │
│ Mesa indexada | Atuadores pneumáticos | Vácuo | Sensores | Selagem │
└────────────────────────────────────────────────────────────────────┘
```

### 4.1 Processo e instrumentação

A camada de processo fornece os sinais físicos usados pelo controle: fim de curso dos cilindros, presença de copo, posição da mesa, presença de tampa, confirmação de vácuo, pulsos do medidor de fluxo, nível e temperatura de selagem. Os comandos do CLP acionam válvulas direcionais, o ejetor de vácuo, a resistência de aquecimento e a mesa indexada.

### 4.2 Controle sequencial

O comportamento da máquina é modelado por Máquinas de Estados Finitos (FSM). Existe uma máquina de estados global para sincronizar a mesa e máquinas específicas para os estágios E1 a E5. Cada transição só ocorre quando os sinais de campo confirmam a condição esperada.

O controle é previsto em CODESYS e Automation Studio, com uso de Structured Text (ST), Ladder Diagram (LD) e Sequential Function Chart (SFC), conforme IEC 61131-3. O controlador indicado no memorial é o **Schneider Modicon TM221CE16R**, com módulos de expansão de 32 entradas digitais e 32 saídas digitais.

### 4.3 Supervisão

A camada supervisória consolida as informações produzidas pelo controle em uma visão operacional da máquina. Seu papel é apresentar o estado do processo e permitir o acompanhamento de permissões, eventos e indicadores, sem substituir os intertravamentos do CLP.

---

## 5. Escopo funcional da supervisão

### 5.1 Estado global da máquina

A supervisão deve apresentar a condição do ciclo e os bloqueios que impedem seu avanço. A FSM global coordena o sincronismo entre os estágios e a indexação da mesa.

```text
Pronto para ciclo
       ↓
Execução dos estágios conforme posição dos copos
       ↓
Confirmações de sensores e de processo
       ↓
Mesa liberada para indexação
       ↓
Próximo ciclo
```

Quando uma condição necessária não é confirmada, o ciclo permanece bloqueado ou é pausado, conforme a regra de controle aplicável.

### 5.2 Visão por estágio

Cada estação deve ser apresentada como uma unidade funcional, contendo no mínimo:

| Estágio | Informações que devem estar disponíveis à supervisão |
| --- | --- |
| E1 - Dispensa | Estado do Cilindro A, presença de copo no alojamento e condição de liberação do ciclo. |
| E2 - Envase | Posição do direcionamento, estado do dosador, estado do bico, volume contado e condição de fechamento. |
| E3 - Tampa | Posição do braço, posição vertical, estado de vácuo e confirmação de tampa posicionada. |
| E4 - Selagem | Posição da prensa, temperatura do cabeçote, temporização de selagem e condição de mesa livre. |
| E5 - Ejeção | Posição do elevador, posição do extrator e contagem de produto na saída. |

### 5.3 Variáveis e parâmetros de processo

| Variável | Origem | Aplicação supervisória |
| --- | --- | --- |
| Posição da mesa | Encoder/posicionamento da mesa | Indicação do estágio ocupado e permissão de indexação. |
| Presença de copo | Sensor óptico | Validação da dispensação e continuidade do ciclo. |
| Volume envasado | Medidor de fluxo, 1.000 pulsos/L | Controle de 150 mL por copo. |
| Nível de envase | Sensor ultrassônico | Redundância de nível e condição de corte. |
| Captura de tampa | Pressostato de vácuo | Permissão para movimentação do manipulador. |
| Presença de tampa | Sensor capacitivo ou óptico | Validação antes da próxima indexação. |
| Temperatura | Termopar no cabeçote | Permissão para início da termosselagem. |
| Fins de curso | Sensores magnéticos | Confirmação das posições dos atuadores. |
| Produtos concluídos | Sensor da esteira | Contagem de produção. |

Os parâmetros de referência que precisam estar claramente identificados são pressão de rede de 6 bar, volume de 150 mL, tolerância de ±3 mL, temperatura de 180 °C, selagem de 2 s e capacidade nominal de 27 copos/min.

---

## 6. Sequências de controle monitoradas

### 6.1 Dispensa de copo

```text
Mesa posicionada
      ↓
Cilindro A libera o copo
      ↓
Sensor óptico confirma a presença no alojamento
      ↓
Cilindro retorna à condição de bloqueio
      ↓
Estágio concluído
```

### 6.2 Envase

```text
Válvula direcionada para enchimento
      ↓
Dosador recua e aspira a dose
      ↓
Válvula direcionada para envase
      ↓
Bico abre
      ↓
Dosador avança e entrega 150 mL
      ↓
Bico fecha
      ↓
Estágio concluído
```

O fechamento da dosagem é associado à contagem de 150 pulsos do medidor de fluxo, pois cada pulso equivale a 1 mL.

### 6.3 Posicionamento de tampa

```text
Vácuo acionado
      ↓
Pressostato confirma tampa capturada
      ↓
Braço movimenta-se até a posição sobre o copo
      ↓
Vácuo desacionado
      ↓
Confirmação de tampa posicionada
      ↓
Manipulador retorna à condição inicial
```

### 6.4 Termosselagem

```text
Temperatura de processo válida
      ↓
Prensa avança
      ↓
Fim de curso confirma posição de selagem
      ↓
Temporização de 2 s
      ↓
Prensa recua
      ↓
Mesa liberada
```

### 6.5 Ejeção

```text
Elevador posiciona o copo no nível da esteira
      ↓
Extrator transfere o copo
      ↓
Atuadores retornam à condição inicial
      ↓
Sensor de saída contabiliza o produto
```

---

## 7. Intertravamentos e tratamento de falhas

Os intertravamentos são executados na camada de controle e devem ser disponibilizados ao operador pela supervisão com indicação clara da condição que bloqueou o processo.

| Evento ou condição | Efeito no processo | Informação a apresentar |
| --- | --- | --- |
| Mesa fora de posição | Estágio não inicia. | Mesa não posicionada. |
| Copo não detectado em E1 | Ciclo não prossegue. | Ausência de copo no alojamento. |
| Fim de curso do dosador não confirmado | Dose não é considerada aspirada ou entregue. | Falha de confirmação do dosador. |
| Bico sem confirmação de posição | Envase não é concluído. | Falha de abertura/fechamento do bico. |
| Vácuo insuficiente | Manipulador não prossegue. | Tampa não capturada. |
| Tampa não detectada sobre o copo | Próxima indexação é bloqueada. | Tampa não posicionada. |
| Temperatura inválida | Selagem não inicia. | Temperatura fora da condição de processo. |
| Prensa sem retorno confirmado | Mesa não gira. | Prensa não recuada. |
| Três erros consecutivos | Processo é pausado automaticamente. | Pausa automática por falhas consecutivas. |

O relatório prevê que, na ocorrência de três falhas consecutivas - por exemplo, falta de tampa ou falha de dosagem -, o processo seja automaticamente pausado para reduzir desperdício de material.

---

## 8. Indicadores operacionais do escopo atual

Com base nas medições e condições explicitamente previstas para a máquina, a supervisão pode consolidar os seguintes indicadores:

| Indicador | Base de cálculo ou origem |
| --- | --- |
| Produção total | Sensor de passagem no final da esteira. |
| Ritmo nominal de produção | Referência de 27 copos/min. |
| Tempo nominal de ciclo | Referência de 2,2 s por copo. |
| Volume por copo | Medidor de fluxo, com alvo de 150 mL. |
| Condição de selagem | Temperatura de 180 °C e temporização de 2 s. |
| Estado dos atuadores | Sensores magnéticos de fim de curso. |
| Consumo estimado de ar | 67,25 L/min ANR, conforme memorial de cálculo. |

O consumo total estimado é composto por 55,25 L/min ANR dos atuadores e 12,00 L/min ANR do ejetor Venturi. O memorial recomenda um compressor com reservatório mínimo de 100 L, pressão de regime de 8 bar e vazão mínima de 5,0 Nm³/h.

---

## 9. Limites do escopo atual

O projeto documentado contempla a modelagem, a simulação pneumática, o sequenciamento por FSM, a instrumentação, o dimensionamento de componentes, a estimativa de consumo de ar e a BOM.

Não são apresentados no relatório como entregas concluídas:

- uma IHM/SCADA física ou software supervisório implementado;
- comunicação industrial configurada entre CLP e sistema supervisório;
- banco de dados histórico, relatórios ou rastreabilidade de lotes;
- gestão de usuários e permissões;
- inspeção de qualidade por visão computacional;
- construção, montagem e comissionamento físico da máquina.

Esses itens podem orientar evoluções posteriores, mas não devem ser tratados como funcionalidades existentes.

---

## 10. Evoluções futuras sugeridas no relatório

O relatório indica as seguintes possibilidades de evolução:

1. visão computacional para inspeção da qualidade da selagem térmica em tempo real;
2. integração com plataformas de supervisão remota e acompanhamento de indicadores como OEE;
3. otimização energética do Estágio 2, incluindo análise de cilindros menores ou recuperação de ar comprimido;
4. substituição do ejetor Venturi por bomba elétrica de vácuo de deslocamento positivo, para reduzir o consumo pneumático do Estágio 3.

---

## 11. Referência técnica

Relatório técnico: *Projeto de Automação Pneumática de uma Máquina de Envasamento de Água em Copos*, UNIFEI, 2026.
