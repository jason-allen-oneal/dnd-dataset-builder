# 📚 D&D 5e Alpaca Dataset Builder

This project builds a **Dungeons & Dragons 5th Edition** dataset in the **Alpaca instruction-following format**, using the [D&D 5e API](https://www.dnd5eapi.co/) plus any custom content you add.

It then optionally uploads the generated dataset to the [Hugging Face Hub](https://huggingface.co/).

---

## 🚀 What It Does

✅ Fetches official SRD data (classes, races, spells, monsters, etc.)  
✅ Converts each item into an `instruction` → `output` pair for LLM training  
✅ Saves the dataset as **JSONL** in `/data`  
✅ Supports extra homebrew content (`customBackgrounds`)  
✅ Can upload the dataset and README to Hugging Face repositories

---

## ⚙️ Usage

1. Install dependencies:

```bash
npm install
