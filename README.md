# Dashboard OEE — MES Prototype

**🇬🇧 English** · [🇧🇷 Português](#-português)

Source code of the undergraduate final project (TCC) _"Development of a Prototype System for Productive Performance Analysis Based on Overall Equipment Effectiveness (OEE)"_, developed by **Diogo Padoveis Antunes** and **Abner Freire Martins**.

The system is a MES (Manufacturing Execution System) prototype that automatically computes the **Availability**, **Performance** and **OEE** indicators of pyrolysis reactors (biochar production) from telemetry and production data, presenting them in an analytical dashboard with time series.

## Stack

- **Back-end:** Node.js + TypeScript, Express, Zod, SQLite (`sql.js`) — layered (Clean) architecture.
- **Front-end:** React + TypeScript + Vite.

## Getting started

**Prerequisites:** Node.js 18+ and Python 3 (used by the data generator).

### 1. Back-end (API)

```bash
cd back
npm install
npm run generate   # (optional) generates the synthetic data -> back/data/*.csv
npm run seed       # seeds the SQLite database from the CSVs
npm run dev        # starts the API at http://localhost:3001
```

### 2. Front-end (dashboard)

```bash
cd front
npm install
npm run dev        # opens http://localhost:5173 (proxies /api -> :3001)
```

With both running, the dashboard opens automatically in the browser consuming the local API.

## Data generation

The file **`back/scripts/generate_data.py`** is the project's synthetic data generator: it creates the telemetry time series and production records (the CSVs in `back/data/`) that feed the prototype. It is run via `npm run generate` inside the `back` folder.

---

# 🇧🇷 Português

[🇬🇧 English](#dashboard-oee--mes-prototype) · **🇧🇷 Português**

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

O arquivo **`back/scripts/generate_data.py`** é o gerador de dados sintéticos do projeto: ele cria as séries temporais de telemetria e os registros de produção (os CSVs em `back/data/`) que alimentam o protótipo. É executado pelo comando `npm run generate` dentro da pasta `back`.
