# MCP Architecture with Node.js + React

## Overview

This project implements a **Model Context Protocol (MCP)-inspired architecture** where:

- **React (MCP Client)**: Acts as the frontend, sending structured requests to the backend.
- **Node.js (MCP Host + MCP Servers)**: Acts as both the central host (orchestrator) and multiple servers (tools/microservices).
- **GPT-4o integration**: Used by the Host for reasoning and decision-making when needed.

This design provides a clean separation of concerns while still being simple to manage as a single backend project.


## Architecture

### MCP Client (React)

- The React web app plays the role of the **MCP Client**.
- It sends requests (e.g., `Req1`, `Req2`, `Reqn`) to the Host via API calls.
- The client itself doesn’t need to know which tool or service will handle the request — it simply interacts with the Host.

### MCP Host (Node.js)

- The Host is the central controller that decides how requests are handled.
- Components:
  - **Endpoint**: Receives client requests.
  - **Orchestrator**: Decides whether to route a request to normal business logic, GPT-4o, or a tool.
  - **Normal Logic**: Handles requests that don’t need advanced orchestration.
  - **Session Manager**: Maintains per-user/session context to support multi-step workflows.
  - **Tool Registry**: Keeps track of tools available from MCP Servers.

### MCP Servers (Node.js)

- Each server exposes a set of **tools**.
- Tools may handle specialized functionality (e.g., data fetching, analytics, domain-specific logic).
- Requests routed from the Host can be dispatched to the right server via the **Tool Registry**.

## Why This Architecture?

1. **Single Node.js Codebase**
   - MCP Host and Servers are implemented within the same Node.js backend.
   - This makes deployment simpler (only one runtime to manage).
   - Still allows logical separation of concerns: Host manages orchestration, while Servers expose tools.

2. **Separation of Concerns Without Infrastructure Overhead**
   - Instead of spinning up multiple microservices, servers are implemented as modules within the backend.
   - Provides flexibility of the MCP design pattern without introducing distributed complexity too early.

3. **Scalable Design**
   - If needed later, MCP Servers can be split into separate processes/services.
   - For now, keeping them in one backend reduces latency and operational overhead.

4. **React as Client-Only Consumer**
   - The React app remains a pure client, with no knowledge of orchestration or tool routing.
   - This simplifies frontend development — React just interacts with a single endpoint (the Host).

## Benefits

- **Simplified Deployment**: One backend project manages both Host and Server logic.
- **Flexibility**: Clear separation of orchestration, tools, and client.
- **Future-Proofing**: Easy to scale servers into microservices later.
- **Frontend Simplicity**: React app is lightweight, focused only on UI and request handling.