<div align="center">
  <h2>Universidade Federal de Itajubá (UNIFEI)</h2>
  <p>Engenharia de Controle e Automação | Disciplina: Automática</p>
  <p>Projeto: SCADA - Máquina de Envasamento de Copos Plásticos</p>
  <hr>
</div>

# Mapeamento de Variáveis de Processo para Proposições Lógicas

Na automação industrial (norma ISA-5.1), instrumentos e atuadores emitem e recebem sinais discretos (binários: 0 = Falso / 1 = Verdadeiro). Abaixo, as variáveis da planta de envasamento de copos são discretizadas em proposições lógicas para a programação e intertravamento no sistema de controle:

## Diagrama P&ID Simplificado do Sistema

```mermaid
flowchart TD
    %% Setor 000: Mesa Giratória e Controle
    subgraph S0 [Setor 000: Controle Geral]
        M001[Motor da Mesa] -->|Indexa| MESA((Mesa<br>Giratória))
        SE001[Encoder] -.->|Precisão| M001
        PAINEL[Painel: Botões e LEDs] -.->|Interface SCADA| MESA
    end

    %% Setor 100: Dispensa de Copo
    subgraph S1 [Setor 100: Dispensa]
        XV101[Cilindro A<br>Retentor] -->|Avança/Recua| MESA
        ZSC101[2x Sensores Mag.] -.->|Posição| XV101
        ZS102[Sensor Capacitivo] -.->|Presença Copo| MESA
    end

    %% Setor 200: Envase de Água
    subgraph S2 [Setor 200: Envase e Dosagem]
        ZS200[Sensor Capacitivo] -.->|Presença Copo| MESA
        XV201[Cilindro B<br>Direcionamento] -->|Válvula 3 vias| XV202
        ZSC201[1x Sensor Mag.] -.->|Posição| XV201
        XV202[Cilindro C<br>Dosador 150ml] -->|Empurra Dose| XV203
        ZSC202[2x Sensores Mag.] -.->|Avanço/Recuo| XV202
        XV203[Cilindro Bico] -->|Abre/Fecha| MESA
        ZSC203[1x Sensor Mag.] -.->|Posição| XV203
    end

    %% Setor 300: Pick-and-Place
    subgraph S3 [Setor 300: Posicionamento Tampa]
        ZS300[Sensor Capacitivo] -.->|Presença Copo| MESA
        XV301[Cilindro D<br>Giro] -->|Gira Braço| BRACO{Manipulador}
        ZSC301[2x Sensores Mag.] -.->|Captura/Entrega| XV301
        XV302[Cilindro E<br>Vertical] -->|Sobe/Desce| BRACO
        ZSC302[2x Sensores Mag.] -.->|Avanço/Recuo| XV302
        VAC301[Válvula Vácuo] -->|Sucção| BRACO
        PIT301[Pressostato] -.->|Confirma Adesão| BRACO
        BRACO -->|Posiciona Tampa| MESA
    end

    %% Setor 400: Termosselagem
    subgraph S4 [Setor 400: Termosselagem]
        ZS400[Sensor Capacitivo] -.->|Presença Copo| MESA
        XV401[Cilindro F<br>Prensa] -->|Pressão| CABECOTE{Cabeçote}
        ZSC401[2x Sensores Mag.] -.->|Avanço/Recuo| XV401
        HT401[Resistência] -->|Calor| CABECOTE
        TIT401[Sensor Temp.] -.->|Monitora| CABECOTE
        CABECOTE -->|Sela 2s| MESA
    end

    %% Setor 500: Ejeção
    subgraph S5 [Setor 500: Ejeção]
        ZS500[Sensor Capacitivo] -.->|Presença Copo| MESA
        XV501[Cilindro G<br>Elevador Vertical] -->|Sobe Copo| MESA
        ZSC501[2x Sensores Mag.] -.->|Avanço/Recuo| XV501
        XV502[Cilindro H<br>Transferência Horiz.] -->|Empurra| ESTEIRA
        ZSC502[2x Sensores Mag.] -.->|Avanço/Recuo| XV502
        M501[Motor Esteira] -->|Transporta| ESTEIRA
    end

    %% Sincronismo da Mesa
    S1 -.->|Avança Indexador| S2 -.->|Avança Indexador| S3 -.->|Avança Indexador| S4 -.->|Avança Indexador| S5
