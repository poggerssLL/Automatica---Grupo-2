# Compressão de Telemetria via Algoritmo de Huffman no SCADA Aqua Index

## 1. Escopo e Arquitetura do Sistema de Transmissão

O sistema supervisório **Aqua Index** atua na arquitetura **Cliente-Servidor**, recebendo continuamente os estados de campo da simulação da **Máquina Pneumática de Envasamento de Água em Copos** (servidor no Automation Studio / CLP) através da rede de comunicação industrial (Modbus-RTU, OPC-UA ou soquete TCP/IP). Em transmissões não comprimidas, o estado lógico dos sensores de segurança e intertravamento da norma ISA-5.1 é empacotado em palavras binárias de tamanho fixo.

Considerando os **5 sinais críticos de intertravamento e parada** distribuídos pelas estações da mesa giratória indexada e pelo painel geral — `ZS-102` (Falta de Copo em E1), `ZSC-203` (Falha de Abertura do Bico em E2), `PIT-301` (Falha de Vácuo em E3), `TIT-401` (Baixa Temperatura de Termosselagem em E4) e `ESD-001` (Parada de Emergência Geral no Setor 000) —, o formato fixo exige **5 bits** por *frame* de telemetria.

Com altas taxas de varredura (*scan rates* de $10\text{ ms}$ a $50\text{ ms}$) em barramentos industriais com largura de banda limitada, o envio repetitivo de quadros nominais redundantes gera tráfego desnecessário. Como a envasadora opera em condição nominal estável durante a maior parte do turno produtivo, a aplicação da codificação de **Huffman** realiza a compressão sem perdas (*lossless*) da telemetria antes da transmissão.

## 2. Modelo Probabilístico e Algoritmo de Huffman

O alfabeto discreto de mensagens $S = \{s_1, s_2, \dots, s_6\}$ representa as combinações do vetor binário de falhas `[ZS-102, ZSC-203, PIT-301, TIT-401, ESD-001]`, onde `0` indica condição conforme e `1` indica alarme/intertravamento ativo.

### Matriz de Probabilidades Operacionais

| Código do Estado | Tag ISA-5.1 em Alarme (Nível 1) | Condição Operacional da Envasadora | Probabilidade $P(s_i)$ |
| :--- | :--- | :--- | :--- |
| `00000` | Nenhum | Operação Nominal Estável (Ciclo Liberado) | $0{,}880$ ($88{,}0\%$) |
| `10000` | `ZS-102` (Setor 100 - E1) | Falta de Copo / Magazine Vazio (`R-04`) | $0{,}055$ ($5{,}5\%$) |
| `00100` | `PIT-301` (Setor 300 - E3) | Falha de Vácuo / Tampa não Capturada (`R-03`) | $0{,}030$ ($3{,}0\%$) |
| `00010` | `TIT-401` (Setor 400 - E4) | Selagem Fria ($T < 180^\circ\text{C}$, `R-02`) | $0{,}020$ ($2{,}0\%$) |
| `01000` | `ZSC-203` (Setor 200 - E2) | Bico Dosador não Confirmado (`R-05`) | $0{,}012$ ($1{,}2\%$) |
| `00001` | `ESD-001` (Setor 000 - Geral) | Botão de Parada de Emergência Acionado (`e1`) | $0{,}003$ ($0{,}3\%$) |

### Construção da Árvore de Huffman

Utilizando uma fila de prioridade (*min-heap*), os dois nós de menor peso são combinados iterativamente até formar a raiz única:

1. **Combinação 1:** Os dois símbolos mais raros, `00001` ($0{,}003$, esquerda) e `01000` ($0{,}012$, direita), formam o nó intermediário $N_1$ com peso $0{,}015$.
2. **Combinação 2:** Une-se $N_1$ ($0{,}015$, esquerda) ao símbolo `00010` ($0{,}020$, direita), resultando no nó $N_2$ com peso $0{,}035$.
3. **Combinação 3:** Une-se `00100` ($0{,}030$, esquerda) ao nó $N_2$ ($0{,}035$, direita), gerando o nó $N_3$ com peso $0{,}065$.
4. **Combinação 4:** Une-se `10000` ($0{,}055$, esquerda) ao nó $N_3$ ($0{,}065$, direita), gerando o nó $N_4$ com peso $0{,}120$.
5. **Combinação 5:** Une-se $N_4$ ($0{,}120$, esquerda) ao estado nominal `00000` ($0{,}880$, direita), formando a raiz da árvore binária com peso $1{,}000$.

Seguindo a convenção da árvore construída por *min-heap* (ramificação à esquerda = bit `0`, ramificação à direita = bit `1`), obtém-se o dicionário de códigos livres de prefixo:

| Estado Original (Fixo: 5 bits) | Código de Huffman | Comprimento $l(s_i)$ |
| :--- | :--- | :--- |
| `00000` | `1` | 1 bit |
| `10000` | `00` | 2 bits |
| `00100` | `010` | 3 bits |
| `00010` | `0111` | 4 bits |
| `01000` | `01101` | 5 bits |
| `00001` | `01100` | 5 bits |

> A verificação da desigualdade de Kraft confirma a optimalidade do código prefixado: $\sum 2^{-l(s_i)} = 2^{-1} + 2^{-2} + 2^{-3} + 2^{-4} + 2^{-5} + 2^{-5} = 1$.

### Avaliação de Desempenho e Economia de Banda

* **Entropia Teórica de Shannon ($H(S)$):**

$$H(S) = -\sum_{i=1}^{6} P(s_i) \log_2 P(s_i) \approx 0{,}7588 \text{ bits/símbolo}$$

* **Comprimento Médio da Palavra-Código ($L$):**

$$L = \sum_{i=1}^{6} P(s_i) \cdot l(s_i) = (0{,}880 \cdot 1) + (0{,}055 \cdot 2) + (0{,}030 \cdot 3) + (0{,}020 \cdot 4) + (0{,}012 \cdot 5) + (0{,}003 \cdot 5) = 1{,}2350 \text{ bits/símbolo}$$

* **Taxa de Economia de Banda (Compressão):**

$$\text{Redução de Banda} = \left( 1 - \frac{L}{L_{\text{fixo}}} \right) \times 100\% = \left( 1 - \frac{1{,}2350}{5} \right) \times 100\% = 75{,}30\%$$

## 3. Protocolo de Enquadramento e Integração Processo/SCADA

### Estrutura do Pacote de Transmissão em Campo

Para trafegar os bits codificados entre o servidor do processo (CLP / Automation Studio) e o cliente SCADA **Aqua Index** sem perda de sincronismo de bit, o fluxo comprimido é encapsulado no quadro abaixo:

```text
+------------------+-------------------+--------------------+--------------------+
| Header (8 bits)  | Length (8 bits)   | Huffman Payload    | CRC-16 (16 bits)   |
| 0xA5 (Start Byte)| Tamanho do Payload| Bits Codificados   | Verificação Erro   |
+------------------+-------------------+--------------------+--------------------+
