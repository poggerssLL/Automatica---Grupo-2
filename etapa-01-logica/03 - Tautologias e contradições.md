# Representação Simbólica das Regras de Processo e Intertravamentos

Com as variáveis mapeadas, os permissivos e as lógicas de bloqueio da máquina de envase são traduzidos em equações de lógica proposicional.

## A. Permissivo de Giro da Mesa Indexadora (Sincronismo Global)

A mesa giratória ($m_0$) não pode sofrer um novo giro caso a prensa de termosselagem não esteja em sua posição de repouso recuada ($c_{7r}$). O giro também exige que a máquina não esteja em parada de emergência ($\neg e_1$).

*   **Condição de Permissivo de Giro ($P_{giro}$):**

$$P_{giro} \equiv c_{7r} \land \neg e_1$$

*   **Regra de Intertravamento:**

$$m_0 \rightarrow P_{giro}$$

## B. Permissivo de Termosselagem (Qualidade e Segurança)

O cilindro da prensa do cabeçote quente ($v_8$) só pode avançar se três condições forem cumpridas simultaneamente: a mesa indexadora estar na posição exata ($p_0$), o sensor capacitivo acusar a presença de um copo ($s_4$) e a temperatura da resistência for igual ou superior a 180°C ($t_1$).

*   **Regra de Acionamento da Prensa:**

$$v_8 \rightarrow (p_0 \land s_4 \land t_1)$$

## C. Permissivo do Manipulador Pick-and-Place (Tampa)

O braço pneumático só realiza o giro para a posição de entrega sobre o copo ($v_5$) se o pressostato confirmar que a tampa foi efetivamente capturada pelo vácuo ($p_1$) e a mesa estiver estacionada na posição correta ($p_0$).

*   **Regra de Bloqueio do Manipulador:**

$$v_5 \rightarrow (p_1 \land p_0)$$

## D. Intertrava de Bloqueio por Ausência de Copo (Estágio 1)

Se o sensor capacitivo do estágio de dispensa não detectar copo após a atuação do cilindro ($\neg s_1$), o sistema deve emitir um alarme sonoro/visual ($l_2$) e bloquear imediatamente o próximo giro da mesa ($\neg m_0$).

*   **Condição de Falha de Insumo ($F_{copo}$):**

$$F_{copo} \equiv \neg s_1$$

*   **Regra Operacional de Parada:**

$$F_{copo} \rightarrow (l_2 \land \neg m_0)$$

---

# Validação Formal por Prova Lógica (Tautologias de Segurança)

Para garantir ao controle lógico que a máquina nunca entrará em estados críticos de colisão ou falha de processo, constrói-se a demonstração formal das contradições.

### Teorema 1: Proteção contra Colisão da Prensa
*   **Afirmação de Segurança:** "É impossível o motor da mesa girar ($m_0$) e a prensa térmica não estar recuada ($\neg c_{7r}$) simultaneamente."
*   **Proposição do Estado de Risco ($S_{risco}$):**

$$S_{risco} \equiv m_0 \land \neg c_{7r}$$

Dada a regra de permissivo implementada: $m_0 \rightarrow c_{7r}$
Aplica-se a equivalência lógica ($\mathbf{A} \rightarrow \mathbf{B} \equiv \neg \mathbf{A} \lor \mathbf{B}$):

$$\neg m_0 \lor c_{7r}$$

Testando o estado de risco sob a premissa de que a regra é verdadeira:

$$S_{risco} \land (\neg m_0 \lor c_{7r})$$
$$(m_0 \land \neg c_{7r}) \land (\neg m_0 \lor c_{7r})$$

Distribuindo os termos lógicos:

$$\big((m_0 \land \neg c_{7r}) \land \neg m_0\big) \lor \big((m_0 \land \neg c_{7r}) \land c_{7r}\big)$$

Aplicando a lei da contradição ($\mathbf{A} \land \neg \mathbf{A} \equiv \text{Falso}$):

$$(Falso \land \neg c_{7r}) \lor (m_0 \land Falso)$$
$$Falso \lor Falso \equiv \text{FALSO}$$

### Teorema 2: Prevenção de Selagem a Frio
*   **Afirmação de Segurança:** "A prensa nunca avançará ($v_8$) com a temperatura inadequada ($\neg t_1$)."
*   **Proposição de Risco:** $v_8 \land \neg t_1$
*   **Regra Implementada:** $v_8 \rightarrow t_1 \equiv \neg v_8 \lor t_1$

Testando a condição de falha no sistema:
$$(v_8 \land \neg t_1) \land (\neg v_8 \lor t_1)$$
$$\big((v_8 \land \neg t_1) \land \neg v_8\big) \lor \big((v_8 \land \neg t_1) \land t_1\big)$$
$$(Falso \land \neg t_1) \lor (v_8 \land Falso) \equiv \text{FALSO}$$
