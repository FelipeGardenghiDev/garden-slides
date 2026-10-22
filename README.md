# 📽️ Garden Slides

> **Markdown-Driven Presentation Slide Deck & Staff Presenter Runner.**
> Crie apresentações profissionais de alta performance apenas escrevendo Markdown, com transições 3D/Fade, controle remoto por QR Code, suporte a colunas duplas, notas do orador, cronômetro ao vivo, exportação para PDF e APK Android nativo.

Parte da **Garden Suite** — ferramentas de código aberto de nível Senior/Staff, focadas em produtividade, privacidade e independência tecnológica.

[![Part of Garden Suite](https://img.shields.io/badge/Part%20of-Garden%20Apps-10B981?style=flat-square)](https://github.com/FelipeGardenghiDev/garden-cut)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8+-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Capacitor Android](https://img.shields.io/badge/Capacitor-Android%20APK-3880FF?style=flat-square&logo=capacitor)](https://capacitorjs.com/)
[![100% Client-Side](https://img.shields.io/badge/Privacy-100%25%20Offline--First-blueviolet?style=flat-square)](#)
[![License](https://img.shields.io/badge/License-MIT-emerald?style=flat-square)](LICENSE)

---

## ✨ Recursos

- 📝 **Markdown Nativo & Sintaxe Simples**: Separe slides com `---`, adicione notas do orador com `???` e divida colunas com `|||`.
- 🎭 **Transições Cinematográficas**: Escolha entre *Fade Suave*, *Slide Horizontal*, *Zoom Pop* e *Flip 3D* com aceleração GPU.
- 📱 **Controle Remoto Sem Fio (QR Code)**: Escaneie o QR Code gerado pelo app com seu celular para alternar slides no palco ou reunião.
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

## 🚀 Deploy Web & Aplicativo Android (APK)

* **Web App (GitHub Pages):** [felipegardenghidev.github.io/garden-slides](https://felipegardenghidev.github.io/garden-slides/)
* **Download do APK Android:** A cada commit na branch principal, o GitHub Actions compila automaticamente o APK nativo através do pipeline Capacitor + Gradle e disponibiliza o artefato `garden-slides-debug-apk` para download direto na aba **Actions** do repositório, dispensando o Android Studio na máquina local.

---

## 🛠️ Stack Tecnológica

- **Frontend**: React 19 + TypeScript
- **Estilização**: Tailwind CSS v4 + Lucide Icons
- **Slide Engine**: Custom Staff Markdown Deck Parser & AST Layout Classifier
- **Mobile Engine**: Capacitor 8 (Android)
- **Testes & CI**: Vitest + GitHub Actions

---

## 📄 Licença
Distribuído sob a licença MIT. Criado por Felipe Gardenghi.
