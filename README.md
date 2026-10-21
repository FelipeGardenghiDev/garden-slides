# 📽️ Garden Slides

> **Markdown-Driven Presentation Slide Deck & Staff Presenter Runner.**
> Crie apresentações profissionais de alta performance apenas escrevendo Markdown, com visual moderno, suporte a colunas duplas, notas do orador, cronômetro ao vivo, exportação para PDF e APK Android nativo.

Parte da **Garden Suite** — ferramentas de código aberto de nível Senior/Staff, focadas em produtividade, privacidade e independência tecnológica.

---

## ✨ Recursos

- 📝 **Markdown Nativo & Sintaxe Simples**: Separe slides com `---`, adicione notas do orador com `???` e divida colunas com `|||`.
- 🎙️ **Modo Orador Completo (Presenter View)**:
  - Visualização simultânea do slide atual e do próximo slide.
  - Notas de orador com alta legibilidade em tela dedicada.
  - Cronômetro de apresentação com Pausa/Play/Reset.
  - Relógio de parede do sistema em tempo real.
- 🎨 **Temas Visuais de Alto Impacto**: *Emerald Studio*, *Dark Velvet*, *Cyber Neon* e *Clean Light*.
- 🖨️ **Exportação para PDF Nativa**: Estilos `@media print` otimizados para que cada slide ocupe uma página horizontal perfeita no salvamento como PDF.
- ⌨️ **Navegação por Teclado**:
  - `Seta Direita / Espaço / PageDown`: Próximo slide
  - `Seta Esquerda / PageUp`: Slide anterior
  - `P`: Alternar Modo Orador
  - `F`: Tela Cheia
  - `Esc`: Sair do Modo Orador ou Tela Cheia
- 📱 **PWA & APK Android Nativo**: Empacotado via Capacitor (`@capacitor/android`) para rodar em tablets e celulares em reuniões ou palcos sem conexão de internet.
- 💾 **Persistência Local (Offline-First)**: Conteúdo e preferências salvos automaticamente no `localStorage`.

---

## 🛠️ Stack Tecnológica

- **Frontend**: React 19 + TypeScript
- **Estilização**: Tailwind CSS v4 + Lucide Icons
- **Slide Engine**: Custom Staff Markdown Deck Parser & AST Layout Classifier
- **Mobile Engine**: Capacitor 8 (Android)
- **Testes & CI**: Vitest + GitHub Actions

---

## 🚀 Como Executar

### 1. Requisitos
- Node.js 20+
- npm 10+

### 2. Instalação e Desenvolvimento Web
```bash
git clone https://github.com/FelipeGardenghiDev/garden-slides.git
cd garden-slides
npm install
npm run dev
```

### 3. Testes Unitários
```bash
npm test
```

### 4. Build para Produção
```bash
npm run build
```

### 5. Executar no Android (APK / Emulador)
```bash
npm run mobile:sync
npm run mobile:open # Abre o projeto no Android Studio
```

---

## 📜 Licença

MIT License © 2026 Felipe Gardenghi. Feito com foco em performance e apresentações sem distrações.
