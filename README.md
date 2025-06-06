Redash CSV Search App

A Tauri-based native desktop app combining a Next.js frontend with a Python FastAPI backend (sidecar). Originally forked from example-tauri-python-server-sidecar.

⸻

🛠️ Tech Stack

<div align="center">


</div>




⸻

📖 About This Project

The Redash CSV Search App simplifies troubleshooting and support workflows by quickly searching integration data exported from Redash queries.

Originally adapted from the example-tauri-python-server-sidecar by dieharders, it has evolved into a practical internal-use tool leveraging Tauri (Rust), Next.js (frontend), and FastAPI (Python backend).

⸻

🌟 Core Features
	•	🚀 Fast CSV Search: Quickly find specific data points to simplify troubleshooting workflows.
	•	🖥️ Native Desktop Experience: Built with Tauri, offering native performance without the bulk of Electron.
	•	🐍 Python Backend Sidecar: FastAPI backend running as a Tauri-managed sidecar for smooth backend-frontend communication.
	•	🌐 Next.js Frontend: Modern, performant UI built with React and TypeScript.

⸻

🗂️ Project Structure

.
├── app/                 # Next.js frontend source code (TypeScript/React)
├── src/backends/        # Python backend (FastAPI)
│   ├── config.json.example  # Template configuration
│   └── main.py          # API entry point used by the sidecar
├── src-tauri/
│   ├── bin/api          # Compiled Python sidecar executables
│   ├── src/main.rs      # Tauri (Rust) main application logic
│   └── tauri.conf.json  # Tauri app configuration
├── LICENSE              # MIT License for Jack Gallagher's contributions
├── LICENSE-APACHE       # Original Apache License from forked repo
└── README.md            # This document



⸻

🚦 Getting Started

⚙️ Install Dependencies

Install both frontend and backend dependencies with:

pnpm install-reqs

Copy `src/backends/config.json.example` to `src/backends/config.json` and
update the `redash_csv_url` value to point at your CSV export.

	•	Frontend-only:

pnpm install

	•	Backend-only (using a Python virtual environment is strongly recommended):

pip install -r requirements.txt



⸻

🧑‍💻 Running the App

To launch the application in development mode:

pnpm tauri dev



⸻

📦 Building the Application

1. Compile Python Backend (sidecar)

Use PyInstaller scripts for your platform:
	•	macOS:

pnpm build:sidecar-macos

	•	Windows:

pnpm build:sidecar-winos

	•	Linux:

pnpm build:sidecar-linux

2. Build Frontend & Tauri App

To build a production-ready version:

pnpm tauri build

In sequence:

pnpm install-reqs
pnpm build:sidecar-<platform>
pnpm tauri build

Your compiled installers and executables are located in:
	•	Installer: src-tauri/target/release/bundle
	•	Executable: src-tauri/target/release

⸻

🔗 Helpful Resources
	•	Tauri Documentation
	•	Next.js Documentation
	•	FastAPI Documentation
	•	PyInstaller Docs

⸻

⚖️ License

This project was initially forked from example-tauri-python-server-sidecar by dieharders, licensed under Apache License 2.0. See LICENSE-APACHE.

All modifications, extensions, and additions made by Jack Gallagher are licensed under the MIT License. See LICENSE.

⸻

✨ Happy coding! ✨