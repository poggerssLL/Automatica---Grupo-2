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
```
A mesa é movimentada por motor elétrico servocontrolado, com encoder integrado para garantir a precisão do giro e o posicionamento dos alojamentos. Entre estações de trabalho há um espaço intermediário para copo, conforme a concepção descrita no relatório.

## 4. Arquitetura da aplicação

A nossa aplicação funciona no modelo **Cliente-Servidor**. Como a física da máquina foi toda montada no **Automation Studio**, o nosso sistema SCADA vai se comunicar com essa simulação através da rede.

A estrutura funciona da seguinte maneira:

### 4.1. SCADA (Cliente)
É a tela que o operador vai usar. Ela faz duas coisas principais:
*   **Monitorar:** Recebe os dados do processo para mostrar o que está acontecendo (sensores, posição da mesa, copos cheios).
*   **Atuar:** Envia comandos para a máquina, como iniciar o ciclo, pausar, resetar ou alterar configurações.

### 4.2. Processo (Servidor)
É a simulação da **Máquina de Envasamento de Água em Copos** rodando no Automation Studio. Ele executa a lógica da máquina, obedece aos comandos que vêm do SCADA e devolve as informações de status.

---

### Diagrama de Comunicação
```text
               (cliente)
             ┌───────────┐
             │           │
             │   SCADA   │
             │           │
             └─┬───────▲─┘
               │       │
         atuar │       │ monitorar
               │       │
             ┌─▼───────┴─┐
             │           │
             │ processo  │
             │           │
             └───────────┘
              (servidor)
```
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
