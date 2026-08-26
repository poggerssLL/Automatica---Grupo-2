# Aula 07: Validade de Argumentos e Inferência Lógica na Segurança de Processos

## 1. Fundamentos Matemáticos: Argumentos Dedutivos e Validade no SCADA

Na engenharia de controle e automação, especialmente na arquitetura Cliente-Servidor do nosso sistema SCADA (Automation Studio) para a **Máquina de Envasamento de Copos Plásticos**, a segurança e o intertravamento não podem depender de intuição. Eles devem ser fundamentados na **Validade Lógica Dedutiva**.

### 1.1. Definição Formal de Argumento e Validade

Um **argumento dedutivo** é uma estrutura formal composta por um conjunto finito de premissas $\{P_1, P_2, \dots, P_k\}$ e uma conclusão $C$, denotado formalmente por:

$$P_1, P_2, \dots, P_k \vdash C$$

Diz-se que o argumento é **semanticamente válido** se e somente se for **impossível** que todas as premissas sejam verdadeiras e a conclusão seja simultaneamente falsa[cite: 2]. Na nossa planta, isso garante que em todos os $2^n$ estados possíveis do processo, as travas de segurança nunca falhem.

```mermaid
graph TD
    subgraph "Processo de Prova Formal - Envasadora"
        P1["P1: e1 (Emergência Acionada no Setor 000)"] --> CONJ["Conjunção: P1 ∧ P2"]
        P2["P2: e1 → parada (Intertravamento Global)"] --> CONJ
        CONJ --> IMPL["Implicação: (P1 ∧ P2) → parada"]
        IMPL --> EVAL{"Avaliação em todos 2^n estados"}
        EVAL -->|Sempre Verdadeiro| VAL["Argumento VÁLIDO (Máquina Segura)"]
        EVAL -->|Existe contraexemplo| INV["Argumento INVÁLIDO (Risco de Acidente)"]
    end
