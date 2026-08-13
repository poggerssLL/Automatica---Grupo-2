<div align="center">
  <h2>Universidade Federal de Itajubá (UNIFEI)</h2>
  <p>Engenharia de Controle e Automação | Disciplina: Automática</p>
  <p>Projeto: SCADA - Máquina de Envasamento de Copos Plásticos</p>
  <hr>
</div>

# Mapeamento de Variáveis de Processo para Proposições Lógicas

Na automação industrial (norma ISA-5.1), instrumentos e atuadores emitem e recebem sinais discretos (binários: 0 = Falso / 1 = Verdadeiro). 

## Diagrama P&ID Simplificado do Sistema

```mermaid
flowchart TD
    %% Setor 000: Mesa Giratória Base
    subgraph S0 [Setor 000: Mesa Giratória]
        M001[M-001<br>Servomotor] -->|Indexa| MESA((Mesa<br>Giratória))
        SE001[SE-001<br>Encoder] -.->|Sinal de Posição| M001
        ZS001[ZS-001<br>Sensor Indutivo] -.->|Confirma Alinhamento| MESA
    end

    %% Setor 100: Dispensa de Copo
    subgraph S1 [Setor 100: Dispensa de Copo]
        XV101[XV-101<br>Válvula 3/2] -->|Avanço/Recuo| CYL101[Cilindro A<br>Puxador]
        CYL101 -->|Libera Copo| MESA
        ZSC101[ZSC-101<br>Sensor Fim de Curso] -.->|Copo Retido| CYL101
        ZS102[ZS-102<br>Sensor Óptico] -.->|Confirma Presença| MESA
    end

    %% Setor 200: Envase de Água
    subgraph S2 [Setor 200: Envase de Água]
        LIT201[LIT-201<br>Sensor Ultrassônico] -.->|Monitora Nível| FUNIL[(Funil)]
        FUNIL --> XV201[XV-201<br>Válvula Esfera 3 Vias]
        XV201 -->|Direciona Fluxo| CYL202[Cilindro C<br>Dosador]
        XV202[XV-202<br>Válvula 5/2] -->|Aciona Seringa| CYL202
        CYL202 -->|Puxa/Empurra Dose| FIT201[FIT-201<br>Medidor de Fluxo]
        FIT201 --> XV203[XV-203<br>Cilindro Bico]
        XV203 -->|Abre/Fecha Bico| MESA
    end

    %% Setor 300: Alimentação da Tampa
    subgraph S3 [Setor 300: Tampa Pick-and-Place]
        VAC301[VAC-301<br>Ejetor Vácuo] -->|Gera Sucção| VENTOSA
        PIT301[PIT-301<br>Pressostato] -.->|Confirma Vácuo| VENTOSA
        XV302[XV-302<br>Válvula 3/2] -->|Mov. Vertical| CYL301[Cilindro E]
        XV301[XV-301<br>Válvula 3/2] -->|Giro 180°| CYL302[Cilindro D]
        CYL301 --> VENTOSA
        CYL302 --> VENTOSA
        VENTOSA -->|Posiciona Tampa| MESA
        ZS303[ZS-303<br>Sensor Capacitivo] -.->|Confirma Tampa| MESA
    end

    %% Setor 400: Termosselagem
    subgraph S4 [Setor 400: Termosselagem]
        XV401[XV-401<br>Válvula 5/2] -->|Avança Prensa| CYL401[Cilindro F]
        HT401[HT-401<br>Resist. Cartucho] --> CABECOTE[Cabeçote<br>Selador]
        TIT401[TIT-401<br>Termopar] -.->|Controle de Temp.| CABECOTE
        CYL401 --> CABECOTE
        CABECOTE -->|Calor + Pressão| MESA
    end

    %% Setor 500: Ejeção
    subgraph S5 [Setor 500: Ejeção e Esteira]
        XV501[XV-501<br>Válvula 3/2] -->|Eleva Copo| CYL501[Cilindro G<br>Elevador]
        XV502[XV-502<br>Válvula 3/2] -->|Puxa Copo| CYL502[Cilindro H<br>Extrator]
        CYL501 --> MESA
        CYL502 -->|Transfere| ESTEIRA
        ZS503[ZS-503<br>Sensor Fotoelétrico] -.->|Conta Produção| ESTEIRA
    end

    %% Sincronismo da Mesa (Rotacional)
    S1 -.->|1º Estágio| S2 -.->|2º Estágio| S3 -.->|3º Estágio| S4 -.->|4º Estágio| S5
```

Abaixo, as variáveis da planta de envasamento de copos são discretizadas em proposições lógicas para a programação e intertravamento no sistema de controle:

### Setor 000: Mesa Giratória
| Tag | Dispositivo | Lógica | Estado 1 |
| :--- | :--- | :--- | :--- |
| M-001 | Servomotor | *m0* | Motor LIGADO |
| SE-001 | Encoder Integrado | *p0* | Mesa Indexada |
| ZS-001 | Sensor Indutivo | *z0* | Alojamento alinhado |

### Setor 100: Dispensa de Copo
| Tag | Dispositivo | Lógica | Estado 1 |
| :--- | :--- | :--- | :--- |
| XV-101 | Válvula 3/2 | *v1* | Cilindro recua |
| ZSC-101 | Sensor Mag. | *c1* | Retendo pilha |
| ZS-102 | Sensor Óptico | *s1* | Copo na mesa |

### Setor 200: Envase de Água
| Tag | Dispositivo | Lógica | Estado 1 |
| :--- | :--- | :--- | :--- |
| LIT-201 | Ultrassônico | *l1* | Nível < 38mm |
| XV-201 | Válvula 5/2 | *v2* | Válvula p/ EMPURRAR |
| XV-202 | Válvula 5/2 | *v3* | Dosador AVANÇADO |
| XV-203 | Válvula 3/2 | *v4* | Bico ABERTO |
| ZSC-201 | Sensor Mag. | *c2r* | Dosador recuado |
| ZSO-201 | Sensor Mag. | *c2a* | Dose entregue |
| ZSC-203 | Sensor Mag. | *c3r* | Bico FECHADO |
| ZSO-203 | Sensor Mag. | *c3a* | Bico ABERTO |
| FIT-201 | Med. Fluxo | *f1* | Volume = 150 pulsos |

### Setor 300: Pick-and-Place
| Tag | Dispositivo | Lógica | Estado 1 |
| :--- | :--- | :--- | :--- |
| XV-301 | Válvula 3/2 | *v5* | Braço rot. 180° |
| XV-302 | Válvula 3/2 | *v6* | Vertical AVANÇADO |
| VAC-301 | Ejetor Venturi | *v7* | Ejetor LIGADO |
| PIT-301 | Pressostato | *p1* | Vácuo limite atingido |
| ZSC-301 | Sensor Mag. | *c4r* | Braço em 0° |
| ZSO-301 | Sensor Mag. | *c4a* | Braço em 180° |
| ZS-303 | Capacitivo | *s3* | Tampa sobre copo |

### Setor 400: Termosselagem
| Tag | Dispositivo | Lógica | Estado 1 |
| :--- | :--- | :--- | :--- |
| XV-401 | Válvula 5/2 | *v8* | Prensa AVANÇADA |
| ZSC-401 | Sensor Mag. | *c5r* | Prensa recuada |
| ZSO-401 | Sensor Mag. | *c5a* | Prensa avançada |
| TIT-401 | Termopar | *t1* | Temp. >= 180°C |
| HT-401 | Resist. Cartucho | *h1* | Resistência LIGADA |

### Setor 500: Ejeção
| Tag | Dispositivo | Lógica | Estado 1 |
| :--- | :--- | :--- | :--- |
| XV-501 | Válvula 3/2 | *v9* | Elevador AVANÇADO |
| XV-502 | Válvula 3/2 | *v10* | Extrator AVANÇADO |
| ZSO-501 | Sensor Mag. | *c6a* | Copo na esteira |
| ZSC-502 | Sensor Mag. | *c7r* | Extrator recuado |
| ZS-503 | Fotoelétrico | *s4* | Produto passou (+1) |
