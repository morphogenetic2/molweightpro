# MolecularWeight Pro

**The ultimate lab companion for precise molecular analysis, buffer preparation, and dilutions.**

MolecularWeight Pro is a sleek, portable, and dependency-free web application designed for chemists, researchers, and students. It provides fast and accurate molecular weight calculations, chemical property lookups, and specialized lab preparation tools.

## ✨ Key Features

### 🧪 MW Calculator
- **Intelligent Search**: Calculate molecular weight by formula (e.g., `H2O`, `C6H12O6`) or name (e.g., `Aspirin`).
- **Deep Insights**: Powered by local formula parsing and PubChem API integration.
- **Visual Analysis**: 
    - Mass composition breakdown with dynamic bars.
    - Automatic fetching of 2D chemical structures.
    - Synonyms and solubility data lookup.
- **Smart History**: 10 most recent calculations stored for quick access.

### 🧪 Buffer Calculator
- **Multi-Solute Support**: Build complex recipes with multiple reagents simultaneously.
- **Universal Units**: Supports M, mM, μM, μg/mL, mg/mL, mg/L, g/L, %, and Dilution (X).
- **Automation**: One-click MW lookup for any solute in the table.
- **Safety Gear**: "Clear Recipe" button with confirmation to prevent data loss.

### 🧪 Dilution Calculator (New!)
- **Dynamic Dilutions**: Calculate stock volumes ($V_1$) for any target concentration.
- **Cross-Unit Capability**: Effortlessly convert between Molar and Mass-based dilutions (requires MW).
- **Seamless Integration**: 
    - **Add to Recipe**: Transfer your dilution result directly to the Buffer Calculator.
    - **Grab Volume**: One-click to sync the final volume setting from your buffer recipe.

## 🚀 Lab-Grade Polish (UX)

- **Persistent Storage**: The app remembers everything. Your searches, buffer recipes, dilution settings, and active view are saved automatically—even after a page refresh.
- **Adaptive Unit Scaling**: Results automatically format for readability (e.g., `15.8 ng` instead of `0.0000000158 g`; `5.0 nL` instead of `0.000005 mL`).
- **Chemical Subscripts**: Professional-grade formula formatting (e.g., `H₂SO₄`, `KMnO₄`) across the entire interface.
- **Standardized Symbols**: Consistent use of the scientific `μ` (mu) for all micro-units.
- **Glow Results**: High-contrast, glowing displays for calculated values to ensure they are never missed.

## 🛠 Tech Stack

- **HTML5**: Semantic structure and modern accessibility.
- **Vanilla CSS**: Custom design system with glassmorphism, adaptive layouts, and dynamic background blobs.
- **Vanilla JavaScript**: Robust logic for formula parsing, unit normalization, and state persistence.
- **PubChem PUG REST API**: Real-time external chemical data lookup.

## 🚀 Getting Started

MolecularWeight Pro is built with vanilla tech. It requires no installation or build steps.

1. Clone or download this repository.
2. Open `index.html` in any modern web browser.

---

*Brought to you by MiMe vibecoding dept.*

*Disclaimer: This has been conceived by a postdoc and implemented with the help of Gemini 3 Flash (the MVP) with the help of Gemini 3 Pro and Claude 4.5 Opus Sonnet (using Antigravity AI).*

---

### 🤖 AI Reflections

*A quick word from your friendly neighborhood AI assistant:*

Building **MolecularWeight Pro** was an exercise in creating a professional-grade lab tool without the overhead of heavy frameworks. The app's strength lies in its "bridge" features—like the ability to calculate a single dilution and instantly transfer it to a complex recipe. 

The aesthetic is tailored to feel premium and tech-forward, with silky-smooth animations that don't distract from the core scientific math. It's a testament to what "vibecoding" can achieve when focused on real-world utility.

**Enjoy your time in the lab!** 🚀