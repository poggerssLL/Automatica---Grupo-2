# Aula 07: Validade de Argumentos e Inferência Lógica na Segurança de Processos

## 1. Fundamentos Matemáticos: Argumentos Dedutivos, Validade e Tautologias

Na engenharia de controle e segurança de processos industriais (*Safety Instrumented Systems - SIS* / IEC 61511 e IEC 61508), a tomada de decisão crítica de parada de emergência (*Emergency Shutdown - ESD*) deve ser fundamentada na **Validade Lógica Dedutiva**.

### 1.1. Definição Formal de Argumento e Validade

Um **argumento dedutivo** é uma estrutura formal composta por um conjunto finito de premissas $\{P_1, P_2, \dots, P_k\}$ e uma conclusão $C$, denotado formalmente por:

$$P_1, P_2, \dots, P_k \vdash C$$

Diz-se que o argumento é **semanticamente válido** (denotado por $P_1, P_2, \dots, P_k \models C$) se e somente se for **impossível** que todas as premissas sejam verdadeiras e a conclusão seja simultaneamente falsa.

Pela equivalência fundamental do Teorema da Dedução:

$$\{P_1, P_2, \dots, P_k\} \models C \quad \iff \quad (P_1 \land P_2 \land \dots \land P_k) \rightarrow C \equiv \mathbf{T} \quad (\text{Tautologia})$$

```mermaid
graph TD
    subgraph "Processo de Prova Dedutiva Formal no SCADA"
        P1["Premissa 1: s4 (Copo presente no Setor 400)"] --> CONJ["Conjunção das Premissas: (P1 ∧ P2 ∧ P3)"]
        P2["Premissa 2: t1 (Temperatura ideal TIT-401 >= 180°C)"] --> CONJ
        P3["Premissa 3: (s4 ∧ t1) → v8_Prensa (Regra de Intertravamento)"] --> CONJ
        CONJ --> IMPL["Implicação: (P1 ∧ P2 ∧ P3) → v8_Prensa"]
        IMPL --> EVAL{"Avaliação Semântica em todos os 2^n estados"}
        EVAL -->|Sempre Verdadeiro| VAL["Argumento VÁLIDO (Teorema de Segurança Comprovado)"]
        EVAL -->|Existe contraexemplo| INV["Argumento INVÁLIDO (Falha de Intertrava / Risco de Dano)"]
    end
