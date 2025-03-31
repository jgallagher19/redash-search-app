# Redash CSV Search App

*Streamline Operational Support with a Full-Stack Native Desktop Application*

---

## Overview

Developed by **Jack Gallagher** — Integrations Coordinator at **AirPay** — this app simplifies operational and client support by enabling rapid search and retrieval of integration data exported from Redash. Combining a Python FastAPI backend with a React/Next.js frontend and packaged as a native desktop app using Tauri, this tool significantly accelerates troubleshooting and enhances customer interaction quality. This project reflects my ongoing transition from pure Account Management and Operations into more technically focused roles, similar to Technical Customer Success Management.

---

## Key Features

- **Instant CSV Data Retrieval:** Quickly search CSV files from Redash, significantly speeding up client troubleshooting.
- **Native Desktop Application:** Lightweight, cross-platform desktop app built with Tauri for responsiveness.
- **Secure and Modular Backend:** Python FastAPI backend with configurable environment settings.
- **Modern, Intuitive UI:** Built with React, Next.js, TypeScript, and styled using Tailwind CSS.
- **Robust Testing:** Comprehensive unit and integration tests with Jest and React Testing Library.

---

## Example Searches

To help you mimic day-to-day use, here are some example search queries:

| **Search Query**                           | **Description**                                                     |
|--------------------------------------------|---------------------------------------------------------------------|
| `egarrett@hotmail.com`                     | Search for a particular email address.                              |
| `OpenDental`                               | Search for a particular dental practice management system.          |
| `Tanner Dentistry`                         | Search for a dental practice location.                              |
| `dcf07998-3d24-438e-ba39-2cac72ec2773`       | Search for a unique identifier (UID).                               |

---

## Why I Built This

In my current role as Integrations Coordinator, manual data retrieval and inefficient CSV searches often delayed client support resolutions. I developed this app to streamline these processes, improving efficiency, reducing operational friction, and providing faster, better-informed customer interactions. This project is also a significant step in my journey of learning full-stack development and applying Python in practical, production-level scenarios.

---

## Technical Stack

| **Component**         | **Technology**               | **Notes**                   |
|-----------------------|------------------------------|-----------------------------|
| **Frontend**          | Next.js, React, TypeScript   | Tailwind CSS UI             |
| **Backend**           | FastAPI (Python)             | Secure, modular design      |
| **Testing**           | Jest, React Testing Library  | Unit & integration tests    |
| **Desktop Packaging** | Tauri (Rust-based)           | Cross-platform builds       |

---

## Project Structure

```plaintext
.
├── app/                 # Next.js frontend (TypeScript/React)
├── src/backends/        # Python backend (FastAPI)
│   ├── config.json      # Configuration file
│   └── main.py          # API endpoints and data handling
├── src-tauri/           # Tauri configuration and compiled sidecar
├── tests/               # Jest tests (unit & integration)
├── README.md            # This document
├── LICENSE              # MIT License (custom modifications)
└── LICENSE-APACHE       # Original Apache License
```

---

## Setup Instructions

### Prerequisites

- **Node.js** (LTS recommended)
- **npm**
- **Python 3.x and pip**

### Clone the Repository

```bash
git clone <your-repo-url>
cd redash-csv-search-app
```

### Frontend Setup

```bash
cd app
npm install
```

### Backend Setup

```bash
cd ../src/backends
python -m venv venv
# Activate virtual environment:
# On macOS/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate
pip install -r requirements.txt
```

---

### Configuration Setup

1. **Create and Configure:**

   ```bash
   cd src/backends
   cp config.example.json config.json
   ```

2. **Update `config.json` Fields:**
   - `redash_api_key`: Your Redash API key.
   - `redash_csv_url`: URL of your Redash CSV endpoint.
   - `use_mock_data`: Set to true for demo, false for production.
   - `mock_csv_path`: Path to local CSV file (for demo purposes).

> For real deployments, replace placeholder values with actual credentials.

---

### Testing

Run tests from the project root:

```bash
npm test
```

This executes:
- Unit tests (CSV parsing logic)
- Integration tests (frontend/backend communication)

---

### Troubleshooting

- **Configuration Errors:**  
  Double-check your `config.json` file for typos or missing fields. Use demo data initially to verify setup before switching to real data.

- **Virtual Environment Issues:**  
  Ensure your Python virtual environment is activated correctly. If dependencies aren’t recognized, verify the activation command.

- **Tauri API Mocks:**  
  If tests fail due to Tauri API mocking issues, confirm that the mocks in `jest.setup.ts` are properly configured.

---

### Production Build

#### Compile Python Sidecar Backend

- **macOS:**

  ```bash
  npm run build:sidecar-macos
  ```

- **Windows:**

  ```bash
  npm run build:sidecar-winos
  ```

- **Linux:**

  ```bash
  npm run build:sidecar-linux
  ```

#### Build Frontend & Tauri App

```bash
npm run tauri build
```

Compiled artifacts are located at:
- **Installer:** `src-tauri/target/release/bundle`
- **Executable:** `src-tauri/target/release`

---

### Future Enhancements

- Advanced filtering and sorting capabilities.
- UI refinements (responsive layouts, column adjustments).
- Expanded test coverage (end-to-end scenarios).
- Customer analytics for operational insights.

---

### Contact

- **Jack Gallagher**
- **Email:** jgallagher19@gmail.com
- **LinkedIn:** [LinkedIn Profile](#)

---

### License

- Forked from `example-tauri-python-server-sidecar` under Apache License 2.0.
- Custom modifications by Jack Gallagher are licensed under the MIT License.

---

## Troubleshooting & Dev Notes

Below is a quick summary of issues resolved during development:

1. **Fixed CSV Path Logic in Dev**  
   Ensured we join the `mock_csv_path` with the base path so that the local CSV file is found in both dev and bundled modes.

2. **Refactored `load_config()`**  
   Updated `load_config()` to return both the `config` and `base_path`, ensuring consistent file lookups. Removed duplicate definitions of `load_config()`.

3. **Handled the "Too Many Values to Unpack" Error**  
   By having `load_config()` explicitly return `(config, base_path)` everywhere, we avoided confusion in function calls.

4. **Fixed "Invalid Escape Character" in `package.json` Scripts**  
   Kept the PyInstaller command on one line or escaped backslashes properly so that JSON parsing wouldn’t fail.

5. **Installed and Activated PyInstaller**  
   Ensured PyInstaller was installed in our Python virtual environment and that the correct environment was active when running build commands.

6. **Matched the Sidecar Binary Name**  
   Aligned the `--name main-aarch64-apple-darwin` in our PyInstaller build with the Tauri config entry in `tauri.conf.json` (`externalBin`), so Tauri could correctly locate the sidecar.

7. **Verified Dev and Production Builds**  
   Confirmed that the sidecar runs in dev mode (`npm run tauri dev`) and that the production build includes the correct config and CSV file references.