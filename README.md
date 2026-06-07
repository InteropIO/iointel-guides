# io.Intelligence Guides

Runnable code for io.Intelligence guides.

This repository contains public starter and solution projects that accompany the io.Intelligence documentation. Use the starter projects when following a guide, and use the solution projects as reference implementations.

## Guides

### io.Assist Anywhere

Build an ACME Banking assistant that runs in io.Connect Browser and io.Connect Desktop, using io.Assist, AI Web, MCP Web, MCP HTTP, Working Context, MCP Apps, and a Mastra backend.

| Path | Purpose |
| --- | --- |
| `io-assist-anywhere-start/` | Starting point for the guide. |
| `io-assist-anywhere-solution/` | Completed reference implementation. |
| `agentic-backend/` | Local Mastra backend used by the assistant apps. |

## Setup

Install dependencies in each project you plan to run:

```bash
cd io-assist-anywhere-start
npm install

cd ../agentic-backend
npm install
```

Create local `.env` files from the provided templates. You will need:

- an io.Connect Browser license key
- an io.Intelligence license key
- an Anthropic API key for the local backend

Do not commit real secrets.

## Run

Start the backend:

```bash
cd agentic-backend
npm start
```

Start the frontend apps:

```bash
cd io-assist-anywhere-start
npm start
```

Open the io.Connect Browser platform at:

```text
http://localhost:4200
```

The solution project uses the same flow:

```bash
cd io-assist-anywhere-solution
npm install
npm start
```

## Ports

| App | Port |
| --- | --- |
| io.Connect Browser platform | `4200` |
| Client List | `4201` |
| Client Portfolio | `4202` |
| io.Connect Desktop MCP host | `4203` |
| Angular io.Assist | `4003` |
| React io.Assist | `4004` |
| Custom AI Web assistant | `4005` |
| Mastra backend | `4111` |

## Documentation

Follow the full guide in the io.Intelligence documentation site. This repo only contains the runnable guide code.
