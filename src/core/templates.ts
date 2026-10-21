export interface TemplateItem {
  id: string;
  name: string;
  description: string;
  markdown: string;
}

export const TEMPLATES: TemplateItem[] = [
  {
    id: 'engineering-rfc',
    name: '🛠️ Engineering RFC & Arquitetura',
    description: 'Apresentação técnica para revisão de arquitetura, trade-offs e decisões de infra.',
    markdown: `[badge: Arquitetura Senior / Staff]
# Garden Architecture RFC
## Migração para Arquitetura Client-Side & Local-First

???
Abertura da apresentação: Focar no objetivo principal da reunião que é aprovar o RFC de soberania de dados e redução de custo de nuvem a zero.

---

[badge: Contexto & Desafio]
# O Desafio do Modelo Tradicional Cloud-SaaS

- 💸 **Custos Lineares**: Cada novo usuário aumenta contas de AWS/GCP (Lambda, S3, RDS, Egress).
- 🔒 **Vulnerabilidade de Privacidade**: Dados confidenciais de clientes armazenados em bancos de terceiros.
- 📶 **Dependência de Conectividade**: Falhas de DNS ou conexão offline quebram o fluxo de trabalho.
- 🐌 **Latência de Round-Trip**: Todo clique e cálculo precisa aguardar resposta HTTP.

???
Mencionar os incidentes recentes de instabilidade de API e como o gasto de infraestrutura estava pesando no orçamento.

---

[badge: Solução Modular]
# Visão Arquitetural: Garden Local-First

|||

### 💻 Client-Side Engine
- Processamento no navegador via WASM & Web Workers.
- Zero envio de dados sensíveis para cloud.
- Armazenamento em IndexedDB / LocalStorage com criptografia local.

|||

### 📱 Android Nativo (Capacitor)
- Mesmo codebase React 19 empacotado como APK nativo.
- Suporte a tablets, smartphones e estações de trabalho.
- Funcionamento 100% offline garantido.

???
Explicar a divisão de colunas e destacar a portabilidade entre web e APK sem reescrever código.

---

[badge: Demonstração de Código]
# Processamento de Áudio com Web Audio API

\`\`\`typescript
const audioCtx = new AudioContext();
const analyser = audioCtx.createAnalyser();
analyser.fftSize = 2048;

const yinDetector = new YinPitchDetector(audioCtx.sampleRate);
const detectedFrequency = yinDetector.getPitch(buffer);
console.log(\`Nota detectada: \${frequencyToNote(detectedFrequency)}\`);
\`\`\`

> "A melhor infraestrutura é aquela que roda na máquina do usuário sem cobrar fatura no final do mês."

???
Explicar como o algoritmo YIN calcula o pitch em tempo real com menos de 5ms de latência.

---

[badge: Decisão]
# Próximos Passos & Rollout

1. ✅ Implementação do pacote Office (Docs, Sheets, PDF, Slides).
2. 🎸 Integração do ecossistema musical (Tuner, Teleprompter).
3. 🚀 Publicação nos repositórios GitHub com CI/CD e suporte a APK.

**Dúvidas & Discussão Aberta**

???
Abrir para perguntas dos engenheiros e liderança técnica.
`,
  },
  {
    id: 'musician-tour',
    name: '🎸 Briefing de Show & Palco (Músico)',
    description: 'Alinhamento de setlist, mapa de palco, frequências de in-ear e automações MIDI.',
    markdown: `[badge: Tour 2026 - Garden Stage]
# Show ao Vivo: Briefing & Setlist
## Alinhamento Técnico de Palco & Automações

???
Boas-vindas à equipe técnica, roadies, operadores de som e banda.

---

[badge: Cronograma & Passagem de Som]
# Cronograma do Evento

- ⏰ **14:00**: Carregamento e montagem do palco (Load-in).
- ⏰ **16:00**: Passagem de som e calibração de In-Ears.
- ⏰ **18:00**: Jantar da equipe e repouso.
- ⏰ **20:30**: Portas abertas ao público.
- ⏰ **21:30**: Início do Show (Duração: 1h45m).

???
Pontualidade é essencial para cumprir a grade do festival.

---

[badge: Automação MIDI]
# Controle do Setlist & Line 6 POD HD 500

|||

### 🎛️ Pedal de Efeitos (POD HD)
- Program Change 01: Timbre Limpo / Shimmer.
- Program Change 02: Drive Crunch / Ritmo.
- Program Change 03: High-Gain Lead Solo (+Boost).

|||

### 📜 Garden Teleprompter
- O pedal envia sinal MIDI via USB para o tablet.
- Troca automática de música no Setlist.
- Rolagem sincronizada com o BPM do metrônomo.

???
Demonstrar a troca do patch MIDI sincronizado com a tela de letras do teleprompter.

---

[badge: Encerramento]
# Bom Show a Todos!

> "Música é conexão, técnica é a ponte para a emoção."

🎸 *Equipe Gardenghi Tour 2026*
`,
  },
];
