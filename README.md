# Dashboard OEE — Protótipo de Sistema MES

Código do projeto de **TCC** _"Desenvolvimento de um Protótipo de Sistema de Análise de Desempenho Produtivo Baseado em Eficiência Global do Equipamento (OEE)"_, desenvolvido por **Diogo Padoveis Antunes** e **Abner Freire Martins**.

O sistema é um protótipo de MES (Manufacturing Execution System) que calcula automaticamente os indicadores de **Disponibilidade**, **Performance** e **OEE** de reatores de pirólise (produção de biochar), a partir de dados de telemetria e produção, e os apresenta em um painel analítico com séries temporais.

## Stack

- **Back-end:** Node.js + TypeScript, Express, Zod, SQLite (`sql.js`) — arquitetura em camadas (Clean Architecture).
- **Front-end:** React + TypeScript + Vite.

## Como rodar

**Pré-requisitos:** Node.js 18+ e Python 3 (usado pelo gerador de dados).

### 1. Back-end (API)

```bash
cd back
npm install
npm run generate   # (opcional) gera os dados sintéticos -> back/data/*.csv
npm run seed       # popula o banco SQLite a partir dos CSVs
npm run dev        # sobe a API em http://localhost:3001
```

### 2. Front-end (painel)

```bash
cd front
npm install
npm run dev        # abre http://localhost:5173 (proxy /api -> :3001)
```

Com os dois rodando, o painel abre automaticamente no navegador consumindo a API local.

## Geração de dados

O arquivo **`back/scripts/generate_data.py`** é um gerador de dados sintéticos do projeto: ele cria as séries temporais de telemetria e os registros de produção (os CSVs em `back/data/`) que alimentam o protótipo. É executado pelo comando `npm run generate` dentro da pasta `back`.
