# 🤖 WrongCorrect™ – The Auto Corrupter

> **"Correctly incorrect your perfectly correct text."**

WrongCorrect™ is a web-based tool that takes user input (typed or pasted text), pretends to auto-correct it, but instead applies advanced AI-inspired algorithms to introduce realistic, chaotic, and often hilarious spelling mistakes.

It’s built for fun, chaos, and creative misuse. Think of it as the anti-grammar tool.


---

## ✨ Features

### 🔁 Smart Text Corruption Engine
- Multi-layered word corruption:
  - Letter swaps (transpositions)
  - Character deletions and insertions
  - Keyboard-neighbor substitutions (based on physical key proximity)
  - Vowel chaos injection
  - Double-letter glitches
  - Common typo patterns (e.g. `tion` → `toin`)
  - Word scrambling and noise
- Preserves original word casing (Upper/lower/mixed)

### 🧠 AI-Inspired Intelligence
- Uses language-aware logic to decide what to corrupt
- Avoids changing short or irrelevant words
- Allows for multiple levels of corruption per word
- Live word count and correction tracker

### 💻 Input & Control
- Live textarea input (typed or pasted)
- Load complex sample paragraphs
- Toggle for enabling/disabling correction engine
- Clear text or regenerate with one click

### 🎨 Stunning UI/UX
- Animated glitch title ("WrongCorrect™")
- Matrix-inspired animated gradient background
- Floating particles, pulsing badges, animated icons
- Responsive layout (desktop/mobile)
- Live correction status with pulse indicators

---

## 🛠️ Tech Stack

| Layer        | Tech                                                                 |
|--------------|----------------------------------------------------------------------|
| **Frontend** | [Next.js (App Router)](https://nextjs.org), [React](https://react.dev), [TypeScript](https://www.typescriptlang.org) |
| **Styling**  | [Tailwind CSS](https://tailwindcss.com), [ShadCN/UI](https://ui.shadcn.com), [Radix UI](https://www.radix-ui.com/) |
| **Icons**    | [Lucide Icons](https://lucide.dev)                                   |
| **Logic**    | Custom-built typo generator using keyboard mapping, string mutation  |


---

## 📦 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/wrong-correct.git
cd wrong-correct
