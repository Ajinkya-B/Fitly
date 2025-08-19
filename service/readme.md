# MCP-Inspired Architecture with Node.js + React

## Overview

This project implements an **MCP (Model Context Protocol)-style architecture** for building an extensible system where tools, resources, and prompts can be registered and orchestrated.

- **React (Host UI)**: Provides the user interface where users initiate requests, approve tool calls, and view results.
- **Node.js (MCP Host + MCP Servers)**: Runs both the **MCP Host runtime** and multiple **MCP Servers** in a single backend process.
- **MCP Clients**: Created by the Host to connect to each MCP Server (in-process for now, but can be replaced with stdio/HTTP transports later).
- **Tool Registry**: Maintained by the Host, aggregating tools discovered from all connected servers.
- **Orchestrator**: Uses GPT-based reasoning and session context to decide which tools to run and in what order.

This structure preserves the separation of concerns defined in the MCP spec, while simplifying deployment by collocating Host and Servers in one Node.js backend.

---

## Architecture

### Host (Node.js)

The **MCP Host** coordinates everything:

- **ClientManager**: Spins up one MCP Client per server, handles initialization and capability negotiation.
- **Tool Registry**: Stores and exposes all available tools aggregated from servers.
- **Session Manager**: Tracks per-user/session context.
- **Orchestrator**: Uses GPT reasoning + session data to determine sequential execution of tools via the Tool Registry.

### Servers (Node.js, collocated)

Each **MCP Server**:

- Declares its own **tools, resources, and prompts**.
- Provides methods like `getTools()` and `executeTool()`.
- Does not know about other servers — all aggregation happens in the Host.

### Clients (Host-side only)

- For each MCP Server, the Host instantiates an **MCP Client**.
- Clients handle protocol-level tasks: initialization, listing tools, executing tools, and sending updates back to the Host.
- Currently implemented as **in-process clients** (function calls), but can later be swapped for stdio or HTTP transports.

### UI (React)

- The React frontend acts as the **user interface of the Host**.
- It does **not** contain MCP clients.
- Instead, it talks to the Host (via Express API routes) to trigger requests and display results.
- The UI may also present approval prompts, progress logs, and output data returned by the Host.

---

## Why this Architecture?

1. **Alignment with MCP Spec**
   - Host creates clients per server, aggregates tools in a registry, and handles orchestration.
   - Servers remain self-contained, exposing only their own tools.

2. **Single Backend Deployment**
   - Host and Servers run inside one Node.js backend.
   - Simplifies development and deployment, but still respects the Host/Server separation.

3. **Future-Proofing**
   - Clients are defined as a separate layer (via `ClientManager`).
   - If servers need to scale into separate processes or containers, only the transport changes — no architectural rewrite required.

4. **UI Simplicity**
   - React is purely a UI layer.
   - It does not manage orchestration or clients; it only communicates with the Host via APIs.

---

## Request Lifecycle (Example)

1. User performs an action in the React UI.
2. Request goes to the Host (`/routes`).
3. The **Orchestrator** decides which tools to run, consulting the **Tool Registry**.
4. The Host calls the appropriate **MCP Client**.
5. The MCP Client invokes the tool on its connected **MCP Server**.
6. Server executes the tool and returns results.
7. Results flow back to the Orchestrator → Host → React UI.

---

## Benefits

- **Spec-accurate separation of concerns** (Host vs Server vs Client).
- **Collocated deployment** for now, but portable to microservices later.
- **Unified tool registry** in the Host, keeping the UI simple.
- **Modular growth path**: servers can be added/removed without changing the client or orchestrator logic.
