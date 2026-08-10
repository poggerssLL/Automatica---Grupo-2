# Projeto de Automação Pneumática de uma Máquina de Envasamento de Água em Copos

## 1. Visão geral

Este projeto tem como objetivo principal aplicar conhecimentos de **lógica formal**, **teoria dos grafos**, **árvores** e **relações** na resolução de um problema real, seguindo a metodologia **PBL** (*Project-Based Learning* ou Aprendizagem Baseada em Projetos). A aplicação prática escolhida para consolidar e validar esses conceitos matemáticos e computacionais é o desenvolvimento de um sistema **SCADA** (Supervisão, Controle e Aquisição de Dados) para um processo industrial.

O processo selecionado como objeto de estudo é uma **máquina pneumática de envasamento de água em copos.** A planta é organizada em uma mesa giratória indexada com cinco estações: dispensação de copos, envase, posicionamento de tampa, termosselagem e ejeção.

> O conteúdo descreve uma solução de engenharia proposta e simulada, baseada no relatório técnico do projeto. Não deve ser interpretado como registro de uma implementação física concluída.

---

## 2. Objetivo do sistema supervisório

Desenvolver uma aplicação de supervisão para acompanhar a operação de uma máquina de envase de água em copos, integrando o sequenciamento do CLP, os sensores, os atuadores pneumáticos e as condições de processo relevantes para a produção segura e repetível.

### 2.1 Objetivos específicos

O sistema deve permitir que o operador compreenda, em tempo de execução:

- 
---

## 3. Conceito de operação

## 3. Processo supervisionado

A máquina opera sobre uma mesa giratória indexada. Cada avanço da mesa posiciona os copos para a próxima operação e depende da conclusão segura do estágio anterior.

```text
Magazine de copos
       |
       v
[E1] Dispensa do copo
       |
       v
[E2] Envase e dosagem
       |
       v
[E3] Captura e posicionamento da tampa
       |
       v
[E4] Termosselagem
       |
       v
[E5] Ejeção ──> Esteira de saída ──> Contagem de produção

A mesa é movimentada por motor elétrico servocontrolado, com encoder integrado para garantir a precisão do giro e o posicionamento dos alojamentos. Entre estações de trabalho há um espaço intermediário para copo, conforme a concepção descrita no relatório.

---

## 4. Arquitetura da aplicação

A arquitetura do sistema baseia-se no modelo **Cliente-Servidor**, estabelecendo um fluxo bidirecional de dados entre a interface de supervisão e o controle do processo. 

Como a planta física da máquina foi desenvolvida e simulada dentro do software **Automation Studio**, a nossa aplicação precisará estabelecer uma comunicação de rede direta com este ambiente de simulação.

A estrutura define-se da seguinte forma:

### 4.1. SCADA (Cliente)
É a ferramenta visual que faz a interface com o operador. Suas atribuições principais são divididas nos seguintes fluxos:
*   **Monitorar (Sentido: Servidor -> Cliente):** *O que vamos monitorar?* O SCADA lê continuamente os dados do processo para apresentar a realidade da máquina na tela. Isso engloba o estado atual da máquina de estados (FSM), sinais dos sensores ópticos e magnéticos, e a contagem das garrafas/copos envasados.
*   **Atuar (Sentido: Cliente -> Servidor):** *Onde o nosso SCADA pode atuar?* A aplicação tem o poder de intervir no processo enviando comandos diretos. Isso inclui atuar nos comandos operacionais de Iniciar, Pausar e Resetar a máquina, além de poder alterar parâmetros de setpoint (como volume desejado de envase).

### 4.2. Processo (Servidor)
É a base de execução das regras de controle e da física da máquina.
*   **Em qual processo?** O processo escolhido é a **Máquina de Envasamento de Água em Copos** (conforme definição do projeto, descartando outras opções como "Geração de Matéria Prima").
*   Neste cenário, o servidor é a própria simulação rodando no **Automation Studio**. Ele é responsável por calcular o comportamento dos atuadores pneumáticos, processar as lógicas de intertravamento e responder às requisições de monitoramento e atuação feitas pelo SCADA.
---

## 5. Descrição técnica do processo

### 5.1 Estágio 1 - Dispensa do copo

O Estágio 1 libera individualmente os copos de uma pilha posicionada em um magazine vertical. O Cilindro A, de simples ação, atua como retentor na base do magazine:

```text
Cilindro A avançado  -> bloqueia a queda do copo
Cilindro A recuado   -> libera o copo inferior ao alojamento da mesa
Retorno por mola     -> restabelece a condição de bloqueio
```

O sensoriamento do estágio é composto por:

- sensor magnético de fim de curso, que confirma o retorno à posição de bloqueio;
- sensor óptico de presença, que verifica se o copo foi depositado no alojamento da mesa.

Na ausência de copo, o controle gera alarme e bloqueia o avanço do ciclo.

### 5.2 Estágio 2 - Envase e dosagem de água

O sistema de dosagem reúne três subsistemas coordenados:

1. **Direcionamento do líquido:** o Cilindro B, um atuador rotativo de dupla ação, movimenta uma válvula de três vias para conectar o funil à câmara de dosagem durante o enchimento ou a câmara ao bico durante o envase.
2. **Dosagem volumétrica:** o Cilindro C, de dupla ação, movimenta o dosador tipo seringa. No recuo, aspira o líquido para a câmara; no avanço, empurra a dose para o copo.
3. **Abertura e fechamento do bico:** o cilindro do bico comanda a saída de líquido. O acionamento pneumático abre a passagem; o retorno por mola fecha o bico e interrompe o fluxo ao término da dosagem.

Sequência operacional descrita:

```text
1. Cilindro B na posição "puxar"
        ↓
2. Cilindro C recua e enche a câmara de dosagem
        ↓
3. Cilindro B na posição "empurrar"
        ↓
4. Bico abre
        ↓
5. Cilindro C avança e entrega a dose ao copo
        ↓
6. Bico fecha por retorno de mola
```

Os fins de curso confirmam as posições de enchimento, de entrega e de abertura/fechamento do bico. O controle de volume é fechado pelo medidor de fluxo de **1.000 pulsos/L**, equivalente a 1 mL por pulso: o CLP comanda o fechamento ao contabilizar 150 pulsos. O relatório também especifica sensor ultrassônico de nível como redundância, com corte em `h >= 38 mm`.

Para o dimensionamento hidráulico, o relatório adota 150 mL em 0,7 s de tempo útil, resultando em vazão requerida de **12,9 L/min**. O bocal foi definido como DN15 (1/2"), com velocidade calculada de 1,21 m/s, abaixo do limite de 1,5 m/s empregado como critério anti-aeração.

### 5.3 Estágio 3 - Alimentação e posicionamento da tampa

O Estágio 3 é um manipulador pneumático do tipo *pick-and-place*. Ele combina:

- **Cilindro D:** atuador rotativo responsável pelo giro do braço entre a posição de captura e a posição de entrega;
- **Cilindro E:** atuador linear para aproximação vertical da ventosa;
- **ejetor Venturi e ventosa:** geração e aplicação do vácuo para capturar a tampa;
- **pressostato de vácuo:** confirmação de que a tampa está efetivamente aderida à ventosa.

Sequência de controle descrita:

```text
Acionar vácuo
      ↓
Confirmar "peça capturada" pelo pressostato
      ↓
Mover o conjunto e girar o braço para a posição sobre o copo
      ↓
Desligar vácuo e confirmar perda de vácuo
      ↓
Retornar cilindro vertical e braço à posição inicial
```

Sensores de fim de curso confirmam as posições do atuador linear e do giro. Antes da próxima indexação, um sensor capacitivo ou óptico verifica se a tampa está posicionada no topo do copo.

### 5.4 Estágio 4 - Termosselagem

O Estágio 4 sela a tampa ao copo pela ação combinada de pressão, temperatura e tempo. O Cilindro F movimenta verticalmente um cabeçote de alumínio que contém uma resistência cartucho. Uma mola de compressão entre o atuador e o cabeçote distribui a força, compensa variações de altura e reduz o risco de esmagamento do copo.

```text
Temperatura válida
      ↓
Prensa avança e aplica pressão
      ↓
Fim de curso confirma posição de selagem
      ↓
Temporizador mantém calor e pressão por 2 s
      ↓
Prensa recua e libera a mesa
```

Um termopar instalado no cabeçote fornece a medição de temperatura, e sensores magnéticos confirmam as posições avançada e recuada da prensa.

### 5.5 Estágio 5 - Ejeção e contagem

Ao final do processo, o Cilindro G eleva o copo selado até o nível da esteira. O Cilindro H realiza a transferência lateral do produto para a esteira transportadora.

```text
1. Cilindro G avança: eleva o copo
2. Sensor confirma que o copo atingiu o nível da esteira
3. Cilindro H recua: transfere o copo
4. Cilindro H avança e Cilindro G recua
5. Fins de curso liberam o início de novo ciclo
```

Um sensor no final da esteira é acionado pela passagem do produto e realiza a contagem total de copos finalizados.

---

## 6. Estratégia de controle e intertravamentos

O processo é estruturado por uma FSM global, responsável pelo sincronismo dos estágios e pela indexação da mesa, e por FSMs específicas para E1, E2, E3, E4 e E5. A passagem de um estado para outro requer confirmação por sensores, temporização ou condição de processo.

Os intertravamentos explicitamente descritos incluem:

| Condição monitorada | Resposta prevista |
| --- | --- |
| Mesa não posicionada | O estágio não inicia. |
| Copo ausente após a dispensação | Gera alarme e impede o prosseguimento. |
| Cilindro C não alcança o fim de curso de recuo | A dose não é considerada aspirada. |
| Bico não confirma abertura ou fechamento | A sequência de envase não é concluída. |
| Vácuo não confirma tampa capturada | O manipulador não prossegue com a movimentação. |
| Tampa não identificada sobre o copo | A indexação seguinte é bloqueada. |
| Temperatura de selagem não está adequada | A prensa não inicia o ciclo de termosselagem. |
| Prensa não está recuada | Novo giro da mesa não é permitido. |
| Três erros consecutivos de processo | A máquina é automaticamente pausada. |

Reguladores de fluxo são previstos em todos os atuadores para produzir movimentos suaves e reduzir oscilações e derramamento durante a indexação.

---

## 7. Instrumentação e sistema de controle

### 7.1 Sensores e medições

| Dispositivo | Finalidade |
| --- | --- |
| Sensores magnéticos de fim de curso | Confirmação das posições dos atuadores pneumáticos. |
| Sensores fotoelétricos difusos | Presença de copo e detecção em linha. |
| Sensor indutivo M8 | Confirmação de posicionamento da mesa. |
| Sensor capacitivo M8 | Presença de tampa. |
| Pressostato de vácuo | Validação da captura e da liberação da tampa. |
| Medidor de fluxo por turbina | Medição da dose; 1.000 pulsos/L. |
| Sensor ultrassônico de nível | Redundância no envase. |
| Termopar | Controle de temperatura do cabeçote selador. |

### 7.2 I/O e CLP

O projeto seleciona o CLP **Schneider Modicon TM221CE16R**, com os módulos de expansão **TM3DI32K** (32 entradas digitais) e **TM3DQ32TK** (32 saídas digitais), além de fonte de alimentação de 24 Vcc/5 A.

O memorial de controle contabiliza seis válvulas 3/2 monoestáveis, três válvulas 5/2 biestáveis e um ejetor de vácuo. Isso corresponde a 13 saídas digitais de acionamento pneumático, somadas às entradas de sensores, pressostato, medidor de fluxo e sensor ultrassônico.

---

## 8. Dimensionamento pneumático

As condições gerais empregadas no memorial de cálculo são:

| Variável | Valor |
| --- | ---: |
| Pressão de serviço | 6,0 bar |
| Pressão atmosférica absoluta | 1,013 bar |
| Rendimento mecânico dos atuadores | 80% |
| Perda de carga inicial arbitrada | 0,5 bar |
| Pressão inicial de cálculo | 5,5 bar |
| Produção nominal | 27 copos/min |
| Produto | Água/suco leve em copo de 150 mL |

O método empregado divide o cálculo em onze etapas. Para atuadores de simples ação, são aplicadas as verificações de área, diâmetro, vazão, seleção da válvula, perda de pressão e força de avanço. Para atuadores de dupla ação, acrescentam-se os cálculos da câmara de retorno e da força dinâmica resultante.

### 8.1 Resultado consolidado

| Estágio | Atuador | Tipo e dimensões | Válvula selecionada | Resultado final |
| --- | --- | --- | --- | --- |
| E1 | Cilindro A - dispensa | SA, Ø16 mm, curso 40 mm | 3/2 monoestável, G1/8, `Qn >= 250 L/min` | 93,6 N; margem 3,74x |
| E2 | Válvula de processo | Assento NF, DN15 | Piloto 5/2 biestável, G1/8 | `Kv = 4,0 m³/h` |
| E2 | Cilindro do bico | SA, Ø16 mm, curso 10 mm | 3/2 monoestável, G1/8, `Qn >= 250 L/min` | 93,6 N; margem 6,24x |
| E3 | Cilindro E - vertical | SA, Ø20 mm, curso 60 mm | 3/2 monoestável, G1/4, `Qn >= 550 L/min` | 146,0 N; margem 4,87x |
| E3 | Cilindro D - giro | Rotativo SA, 90°, `Vd >= 4 cm³/rad` | 3/2 monoestável, G1/8, `Qn >= 200 L/min` | 1,87 Nm; margem 1,25x |
| E4 | Cilindro F - prensa | DA, Ø50 mm, haste Ø20 mm, curso 25 mm | 5/2 biestável, G1/2, `Qn >= 1.800 L/min` | 863,5 N de força dinâmica real |
| E5 | Cilindro G - elevador | SA, Ø16 mm, curso 30 mm | 3/2 monoestável, G1/8, `Qn >= 250 L/min` | 93,7 N; margem 4,69x |
| E5 | Cilindro H - extrator | SA, Ø16 mm, curso 80 mm | 3/2 monoestável, G1/4, `Qn >= 500 L/min` | 93,4 N; margem 6,23x |

---

## 9. Consumo de ar comprimido e compressor

O consumo é expresso em condições atmosféricas de referência (ANR) e considera 27 ciclos por minuto. Para cilindros de simples ação, apenas a câmara de avanço consome ar; nos atuadores de dupla ação, ambas as câmaras são contabilizadas alternadamente.

| Atuador | Consumo calculado |
| --- | ---: |
| Cilindro A - E1 | 1,50 L/min ANR |
| Cilindro B - E2, rotativo | 1,88 L/min ANR |
| Cilindro C - E2, dosador | 24,06 L/min ANR |
| Cilindro do Bico - E2 | 0,38 L/min ANR |
| Cilindro E - E3, vertical | 3,52 L/min ANR |
| Cilindro D - E3, giro | 0,67 L/min ANR |
| Cilindro F - E4, prensa | 18,35 L/min ANR |
| Cilindro G - E5, elevador | 1,13 L/min ANR |
| Cilindro H - E5, extrator | 3,01 L/min ANR |
| **Subtotal dos atuadores** | **55,25 L/min ANR** |
| Ejetor Venturi de vácuo | 12,00 L/min ANR |
| **Consumo total estimado** | **67,25 L/min ANR** |

O relatório recomenda compressor de pistão ou parafuso, com reservatório de no mínimo 100 L, pressão de regime de 8 bar e vazão mínima de 5,0 Nm³/h (aproximadamente 83 L/min ANR). Foram considerados fator de utilização de 0,75, fator de vazamento de 1,15 e reserva para expansão futura de 1,25.

---

## 10. Lista de materiais (BOM)

### 10.1 Atuadores pneumáticos

| Item | Quantidade | Especificação indicada | Aplicação |
| --- | ---: | --- | --- |
| Cilindro A | 1 | Festo ADVC-16-40-A-P-A | Dispensa de copo |
| Atuador rotativo B | 1 | Festo DRVS-16-90-P | Direcionamento do envase |
| Cilindro C | 1 | Festo DSBC-32-80-PPSA-N3 | Dosador |
| Cilindro do Bico | 1 | Festo ADVC-16-10-A-P-A | Abertura/fechamento do bico |
| Cilindro E | 1 | Festo ADN-20-60-A-P-A | Movimento vertical da tampa |
| Cilindro F | 1 | Festo DSBC-50-25-PPSA-N3 | Prensa de selagem |
| Cilindro G | 1 | Festo ADN-16-30-A-P-A | Elevador |
| Cilindro H | 1 | Festo ADN-16-80-A-P-A | Extrator |
| Atuador rotativo D | 1 | Festo DRVS-16-90-P | Giro da tampa |

Subtotal informado para os atuadores: **R$ 6.100,00**.

### 10.2 Válvulas, vácuo e tratamento de ar

| Grupo | Elementos indicados |
| --- | --- |
| Válvulas direcionais | Válvulas 3/2 monoestáveis e 5/2 biestáveis Festo VUVG, dimensionadas de G1/8 a G1/2 conforme o atuador. |
| Válvula de processo do envase | Festo VZWF-B-L-M22C-N15-135-V-2AP4-6, 2/2 NF, DN15. |
| Vácuo | Ejetor Venturi Festo VADM-45-N-1/8-PU, ventosa NBR Ø40 mm e pressostato Festo SPAB-B2R-G18-2P. |
| Tratamento de ar | Unidade FRL Festo MSB6-1/2:J5M:D7M:D7M. |
| Controle de fluxo | Seis reguladores G1/8 QS-8, quatro G1/4 QS-8 e um G1/2 QS-12. |

Subtotais informados: válvulas direcionais **R$ 5.150,00**; controle de fluxo, vácuo e tratamento de ar **R$ 7.190,00**.

### 10.3 Sensores e sistema de controle

| Item | Quantidade na BOM | Especificação indicada |
| --- | ---: | --- |
| Sensor magnético de fim de curso | 12 | Festo SME-8-S-LED-24 |
| Sensor fotoelétrico difuso | 2 | Festo SOEG-L-Q30-P-A-S-2L |
| Sensor indutivo M8 | 1 | Festo SIEN-M8B-PO-K-L |
| Sensor capacitivo M8 | 1 | Festo SIEF-M8B-PO-K-L |
| Medidor de fluxo | 1 | Festo FHEM / VSE 0.1 (equivalente) |
| Sensor ultrassônico de nível | 1 | SONAR-M30-PS-20-SA-2L-M12 |
| CLP | 1 | Schneider Modicon TM221CE16R |
| Módulo de entradas digitais | 1 | Schneider TM3DI32K |
| Módulo de saídas digitais | 1 | Schneider TM3DQ32TK |
| Fonte 24 Vcc / 5 A | 1 | Schneider ABLS1A24050E |

Subtotais informados: sensores e medição **R$ 6.730,00**; sistema de controle **R$ 6.207,00**. O total geral informado na BOM é **R$ 31.377,00**.

---

## 11. Escopo técnico

O escopo registrado no relatório compreende:

- modelagem do processo em cinco estações;
- simulação do circuito pneumático;
- diagramas trajeto-passo;
- FSM global e FSMs individuais por estágio;
- lógica de controle IEC 61131-3;
- seleção e dimensionamento de atuadores e válvulas;
- instrumentação, controle de volume e intertravamentos;
- estimativa de consumo de ar e seleção preliminar do compressor;
- BOM, cronograma de implantação e orçamento.

Não fazem parte do resultado concluído do projeto: aquisição de componentes, construção mecânica, montagem, comissionamento ou operação física da máquina.

---

## 12. Possíveis trabalhos futuros

As evoluções sugeridas no relatório são:

1. implementar visão computacional para inspecionar a qualidade da selagem térmica em tempo real;
2. integrar plataformas de supervisão remota para acompanhamento de indicadores, incluindo OEE;
3. estudar a otimização energética do Estágio 2, avaliando cilindros menores ou sistemas de recuperação de ar comprimido;
4. substituir o ejetor Venturi por uma bomba elétrica de vácuo de deslocamento positivo, visando reduzir o consumo pneumático do Estágio 3.

---

## 13. Inconsistências internas identificadas no relatório

Os pontos abaixo são registrados para rastreabilidade. Eles não foram corrigidos silenciosamente neste README.

| Tema | Divergência encontrada |
| --- | --- |
| Cilindro do bico | Descrito, dimensionado e listado na BOM como simples ação com retorno por mola; a conclusão afirma uma revisão para dupla ação. |
| Giro do manipulador de tampas | A descrição operacional apresenta posições de 0° e 180°, enquanto o dimensionamento e a BOM especificam atuador rotativo de 90°. |
| Saídas digitais | O memorial de controle totaliza 13 saídas digitais para os acionamentos pneumáticos; a conclusão informa 14. |
| Sensores magnéticos | O memorial de controle cita 13 sensores magnéticos; a BOM lista 12 unidades. |
| Valores de custo | A BOM totaliza R$ 31.377,00. O capítulo de orçamento informa R$ 66.777,00, mas cita R$ 32.377,00 como componentes diretos; a conclusão menciona R$ 58.957,00. |
| Percentuais de consumo | Os percentuais da tabela de consumo por atuador não são compatíveis com os subtotais apresentados. O texto posterior atribui aproximadamente 44% do consumo total ao Cilindro C. |

---

## 14. Fonte técnica

Relatório técnico: *Projeto de Automação Pneumática de uma Máquina de Envasamento de Água em Copos*, UNIFEI, 2026.
