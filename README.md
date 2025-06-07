# 🧬 Evo2 Variant Analysis Backend (Modal + FastAPI)

This backend provides GPU-accelerated inference using the Evo2 model (by Arc Institute) to analyze BRCA1 variant data and score genomic variants via a FastAPI web endpoint. It is designed to work with a Next.js frontend.

---

## 🔧 Tech Stack

- **Python 3.12**
- **Modal** (GPU-native serverless platform)
- **FastAPI** (for exposing HTTP API endpoints)
- **Evo2** (7B parameter model for genomic likelihood scoring)
- **Pandas, Seaborn, Scikit-learn, BioPython**
- **Next.js** frontend (uses this backend)

---

## 📁 Project Structure

| File/Folder                  | Description                                     |
|-----------------------------|-------------------------------------------------|
| `main.py`                   | Modal app definition with web + GPU endpoints   |
| `requirements.txt`          | All required Python dependencies                |
| `evo2/` (runtime cloned)     | Evo2 model codebase (cloned inside image) just for reference |
| `brca1_analysis_plot.png`   | Plot output for BRCA1 variant scoring (optional) |
| `/notebooks/brca1/`         | BRCA1 reference dataset + genome FASTA          |

---

## ✅ Prerequisites

- Modal CLI installed and authenticated  
  → [Modal Docs – Getting Started](https://modal.com/docs/guide/getting-started)
- Modal token configured:  
  `modal token set <your-token>`
- Hugging Face cache volume created:
  ```bash
  modal volume create hf_cache
