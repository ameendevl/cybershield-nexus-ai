# CyberShield Nexus AI — Autonomous Enterprise SOC Platform 🛡️⚡

[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-cyan.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.4-purple.svg)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8.svg)](https://tailwindcss.com/)
[![Three.js](https://img.shields.io/badge/Three.js-WebGL_3D-black.svg)](https://threejs.org/)
[![License](https://img.shields.io/badge/License-Enterprise-green.svg)](#)
[![Live Demo](https://img.shields.io/badge/Live_Demo-ameendevl.github.io-00d2ff.svg)](https://ameendevl.github.io/cybershield-nexus-ai/)

> 🌐 **Live Website Link**: [https://ameendevl.github.io/cybershield-nexus-ai/](https://ameendevl.github.io/cybershield-nexus-ai/)

> **Next-Generation Autonomous Cybersecurity SOC Operations & Threat Defense Platform** featuring 3D WebGL Threat Telemetry, Live URL Security Scanner, Corporate Domain Uptime & SSL Expiry Monitor, 1-Click Auto-Patch Engine, Multi-Vendor Firewall Blocklist Exporter, and Dual-Theme (Dark & Light) Architecture.

---

## 🚀 Key Modules & Capabilities

### 1. 🌐 3D WebGL Threat Globe & Global Attack Telemetry
- Real-time 3D orbital globe rendered via **Three.js / WebGL** at 60 FPS.
- Interactive ballistic attack arcs with pulse animations between global origins and targets.
- 5 Cyber Aesthetic theme presets (**Holo Cyan**, **Crimson Alert**, **Matrix Green**, **Deep Space**, **Solar Amber**).
- Speed multipliers, manual rotation lock, camera FOV controls, and live attack HUD stats.

### 2. 🔍 Real-Time Website & URL Security Scanner
- Autonomous reconnaissance engine checking SSL/TLS health, cipher strength, and expiration.
- Complete HTTP Security Headers validation (`CSP`, `HSTS`, `X-Frame-Options`, `X-Content-Type-Options`, `COOP`).
- Technology stack & framework fingerprinting with known CVE correlation.
- Perimeter open port detection (HTTP, HTTPS, Dev Proxies, MySQL).
- Instant Nginx configuration code fixes with 1-click clipboard copy.

### 3. ⏱️ Corporate Domain Uptime & SSL Expiry Monitor
- Autonomous availability tracking across global POP edge routes.
- SSL Certificate expiration countdown and TLS 1.3 cryptographic validation.
- Interactive ping telemetry and latency measurement.
- Public status page generator with live infrastructure health matrices.

### 4. 🛠️ 1-Click Auto-Patch & Remediation Script Engine
- Autonomous mitigation generator for critical zero-day vulnerabilities (e.g. CVE-2024-3400, Log4j).
- Multi-platform syntax: **Linux Bash (.sh)**, **Windows PowerShell (.ps1)**, **Kubernetes/Docker (.yaml)**, and **Nginx WAF**.
- Safe in-browser sandbox runner with live progress logs and post-patch validation.

### 5. 🔥 Enterprise Firewall IoC Blocklist Exporter
- Real-time STIX 2.1 threat intelligence feed with confidence ratings.
- Instant conversion to production rule syntax for:
  - **Cisco ASA / Firepower (FTD)**
  - **Fortinet FortiGate**
  - **Palo Alto External Dynamic Lists (EDL)**
  - **AWS WAF & Cloudflare IP Sets**
  - **Snort / Suricata IDS Rules**
  - **Structured CSV Feed**

### 6. 🤖 Autonomous AI Cyber Copilot
- Conversational SOC analyst assistant for threat triage, YARA synthesis, and containment.
- Natural language queries with recommended tactical response actions.

### 7. 🌗 Dual-Theme Architecture (Dark & Light Modes)
- Seamless real-time toggle between **Cyber Dark** (neon glow, scanlines, glassmorphism) and **Enterprise Light** (crisp slate typography, high contrast, clean white containers).
- Fully theme-adaptive navigation sidebar, top header navbar, modals, and metric HUDs.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript, Vite, TailwindCSS, Lucide Icons, Recharts, Three.js (@types/three).
- **Backend**: Node.js, Express, RESTful APIs, SQLite (`cybershield.db`).
- **State Management**: React Context API (`AppContext.tsx`) with localStorage persistence.
- **Audio Effects**: Synthesized Web Audio API sound service for SOC telemetry alerts and clicks.

---

## 📦 Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn

### Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/ameendevl/cybershield-nexus-ai.git
   cd cybershield-nexus-ai
   ```

2. **Install Frontend Dependencies**
   ```bash
   npm install
   ```

3. **Install Backend Dependencies**
   ```bash
   cd cybershield-auth-api
   npm install
   cd ..
   ```

4. **Start the Development Servers**

   In Terminal 1 (Backend API):
   ```bash
   node cybershield-auth-api/server.js
   ```

   In Terminal 2 (Frontend UI):
   ```bash
   npm run dev
   ```

5. **Open the Platform**
   Navigate to [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🧪 Build & Quality Verification

```bash
# Typecheck TypeScript
npm run typecheck

# Build for Production
npm run build
```

---

## 🛡️ Security & Privacy Notice
All demo secrets, keys, and tokens are stored client-side in `localStorage` or read from environment variables (`.env`). No private keys or service account credentials are committed to this repository.

---

## 📄 License
Enterprise MIT License — Created for modern cybersecurity teams and SOC analysts.
