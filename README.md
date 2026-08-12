# Projeto SCADA de uma Máquina de Envasamento de Água em Copos

## 1. Visão geral

Este projeto tem como objetivo principal aplicar conhecimentos de **lógica formal**, **teoria dos grafos**, **árvores** e **relações** na resolução de um problema real, seguindo a metodologia **PBL** (*Project-Based Learning* ou Aprendizagem Baseada em Projetos). A aplicação prática escolhida para consolidar e validar esses conceitos matemáticos e computacionais é o desenvolvimento de um sistema **SCADA** (Supervisão, Controle e Aquisição de Dados) para um processo industrial.

O processo selecionado como objeto de estudo é uma **máquina pneumática de envasamento de água em copos.** A planta é organizada em uma mesa giratória indexada com cinco estações: dispensação de copos, envase, posicionamento de tampa, termosselagem e ejeção.

> O conteúdo descreve uma solução de engenharia proposta e simulada, baseada no relatório técnico do projeto. Não deve ser interpretado como registro de uma implementação física concluída.

---

## 2. Objetivo do sistema supervisório

Desenvolver uma aplicação de supervisão para acompanhar a operação de uma máquina de envase de água em copos no automation studio.

### 2.1 Objetivos específicos

O sistema deve permitir que o operador compreenda ou atue, em tempo de execução:

- Ligar, desligar e colocar em estado de emergência.
- Monitorar visualmente o estado dos atuadores em cada estágio
- Monitirar visualmente o estado dos sensores em cada estágio
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
 ↓
Cilindro A recuado   -> libera o copo inferior ao alojamento da mesa
 ↓
Sensor Magnético     -> confirma posição de recuado
 ↓
Sensor Capacitivo    -> confirma presença do copo
 ↓
Retorno por mola     -> restabelece a condição de bloqueio
 
```

O sensoriamento do estágio é composto por:

- 2 sensores magnéticos de fim de curso, um para posição de avançado e recuado;
- sensor capacitivo de presença, que verifica se o copo foi depositado no alojamento da mesa.

Na ausência de copo, o controle gera alarme e bloqueia o avanço do ciclo.

### 5.2 Estágio 2 - Envase e dosagem de água

O sistema de dosagem reúne três subsistemas coordenados:

1. **Direcionamento do líquido:** o Cilindro B, um atuador rotativo de dupla ação, movimenta uma válvula de três vias para conectar o funil à câmara de dosagem durante o enchimento ou a câmara ao bico durante o envase. poussui 1 sensor magnético para saber a posição.
2. **Dosagem volumétrica:** o Cilindro C, de dupla ação, movimenta o dosador tipo seringa. No recuo, aspira o líquido para a câmara; no avanço, empurra a dose para o copo. poussui 2 sensores magnéticos para saber a posição de avançado e recuado.
3. **Abertura e fechamento do bico:** o cilindro do bico comanda a saída de líquido. O acionamento pneumático abre a passagem; o retorno por mola fecha o bico e interrompe o fluxo ao término da dosagem. poussui 1 sensor magnético para saber se o bico abriu ou não 
4.sensor capacitivo, verifica presença do copo
Sequência operacional descrita:

```text
Sensor Capacitivo confirma presença do copo
        ↓
Cilindro B na posição "puxar"
        ↓
Cilindro C recua e enche a câmara de dosagem
        ↓
Cilindro B na posição "empurrar"
        ↓
Bico abre
        ↓
Cilindro C avança e entrega a dose ao copo
        ↓
Bico fecha por retorno de mola
```

Os fins de curso confirmam as posições de enchimento, de entrega e de abertura/fechamento do bico. O controle de volume é definido pela geometria do dosador, que já tem um espaço exato de 150ml

### 5.3 Estágio 3 - Posicionamento da Tampa

O Estágio 3 é um manipulador pneumático do tipo *pick-and-place*. Ele combina:

- **Cilindro D:** atuador rotativo responsável pelo giro do braço entre a posição de captura e a posição de entrega, possui 2 sensores magnéticos para saber a posição de captura e entrega;
- **Cilindro E:** atuador linear dupla ação para aproximação vertical da ventosa,  possui 2 sensores magnéticos, um para avançao e outro para recuo 
- **Válvula geradora de Vácuo/Ventosa:** geração e aplicação do vácuo para capturar a tampa;
- **pressostato de vácuo:** confirmação de que a tampa está efetivamente aderida à ventosa.
- sensor capacitivo, verifica presença do copo
Sequência de controle descrita:

```text
Sensor Capacitivo confirma presença do copo
      ↓
Acionar válvula de vácuo
      ↓
Confirmar "peça capturada" pelo pressostato
      ↓
Mover o cilindro vertical e girar o braço para a posição sobre o copo
      ↓
Desligar válvula de vácuo e confirmar que soltou a tampa
      ↓
Retornar cilindro vertical e braço à posição inicial
```

Sensores de fim de curso confirmam as posições do atuador linear e do giro. Antes da próxima indexação.

### 5.4 Estágio 4 - Termosselagem

O Estágio 4 sela a tampa ao copo pela ação combinada de pressão, temperatura e tempo. O Cilindro F movimenta verticalmente um cabeçote de alumínio que contém uma resistência cartucho. Uma mola de compressão entre o atuador e o cabeçote distribui a força, compensa variações de altura e reduz o risco de esmagamento do copo.
- O Cilindro F, possui 2 sensores magnéticos, um para avançao e outro para recuo 
- resistência cartucho
- sensor de temperatura
- sensor capacitivo, verifica presença do copo
```text
Sensor Capacitivo confirma presença do copo
      ↓
Ligar resistência
      ↓
Alcançou temperatura desejada
      ↓
Prensa avança e aplica pressão
      ↓
Fim de curso confirma posição de selagem
      ↓
Temporizador mantém calor e pressão por 2 s
      ↓
Prensa recua e libera a mesa
``` 

### 5.5 Estágio 5 - Ejeção

Ao final do processo, o Cilindro G eleva o copo selado até o nível da esteira. O Cilindro H realiza a transferência lateral do produto para a esteira transportadora.
- Cilindro G simples ação retorno por mola, vertical, possui 2 sensores magnéticos, um para avançao e outro para recuo.
- Cilindro H simples ação avanço por mola, horizontal, possui 2 sensores magnéticos, um para avançao e outro para recuo.
- sensor capacitivo, verifica presença do copo
```text
Sensor Capacitivo confirma presença do copo
              ↓
Cilindro G avança: eleva o copo
              ↓
Sensor mágnetico confirma que o copo atingiu o nível da esteira
              ↓
Cilindro H recua: transfere o copo
              ↓
Cilindro H avança e Cilindro G recua
              ↓
Fins de curso liberam o início de novo ciclo
```
### 5.6 Controle Geral do processo
- motor da mesa indexadora, sensor de posição da mesa
- motor da esteira de saída
- botão ligar
- LED ligado
- botão desligar
- emergencia
- LED emergência
- botão parar
- chave energizada
- LED energizado 

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
| Temperatura de selagem não está adequada | A prensa não inicia o ciclo de termosselagem. |
| Prensa não está recuada | Novo giro da mesa não é permitido. |

---
