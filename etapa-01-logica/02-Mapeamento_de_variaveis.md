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
