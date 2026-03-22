# Base Certa — Documentação do Projeto

> App educativo de matemática desenvolvido como ferramenta do ecossistema Pai MOVIDO.
> Criado por Leandro Casemiro — professor de matemática com 17 anos de experiência na rede estadual do Rio de Janeiro.

---

## 1. Contexto e Problema

### Por que esse app existe

Muitos alunos chegam às séries finais do fundamental e até ao ensino médio sem dominar operações básicas e tabuada. Essa defasagem trava toda a matemática posterior e gera desânimo, vergonha e dificuldade acumulada.

A escola sozinha não resolve — e é exatamente aí que o Pai MOVIDO atua: ajudando pais a assumirem a formação dos filhos dentro de casa.

O **Base Certa** é uma ferramenta prática para que alunos possam praticar matemática de forma leve, rápida e sem a pressão de uma prova escolar.

### Público-alvo

- Alunos do fundamental 2 e início do ensino médio
- Alunos com defasagem de base matemática
- Filhos de pais que acompanham o Pai MOVIDO

---

## 2. Decisões de Produto (antes de codar)

Todas as decisões abaixo foram tomadas antes do desenvolvimento, com base em critérios pedagógicos e de experiência de produto.

### Nome

Foram considerados: Tabuada Game, Conta Rápida, MatQuiz, Conta Comigo, Tabuada MOVIDO.

**Escolha final: Base Certa**
- Remete diretamente ao problema que resolve (falta de base matemática)
- Funciona sozinho e dentro do ecossistema Pai MOVIDO
- URL limpa: `basecerta.vercel.app`

### Modos de jogo

| # | Modo | Grupo |
|---|---|---|
| 1 | Adição | Operações Básicas |
| 2 | Subtração | Operações Básicas |
| 3 | Multiplicação | Operações Básicas |
| 4 | Divisão | Operações Básicas |
| 5 | Tabuada | Operações Básicas |
| 6 | Adição com Inteiros | Números Inteiros |
| 7 | Subtração com Inteiros | Números Inteiros |
| 8 | Multiplicação com Inteiros | Números Inteiros |
| 9 | Divisão com Inteiros | Números Inteiros |

### Níveis de dificuldade

| Nível | Label | Descrição |
|---|---|---|
| beginner | Iniciante | Números pequenos, sem pressão |
| intermediate | Desafiador | Números maiores, bom treino |
| expert | Expert | Números grandes, máximo desafio |

### Faixas numéricas por nível

| Modo | Iniciante | Desafiador | Expert |
|---|---|---|---|
| Adição | 1–10 + 1–10 | 1–20 + 1–20 | 1–50 + 1–50 |
| Subtração | até 15, positivo | até 30, positivo | até 100, positivo |
| Multiplicação | 2–5 × 2–5 | 2–12 × 2–9 | 2–15 × 2–12 |
| Divisão | quoc. 1–5, div. 2–5 | quoc. 1–10, div. 2–10 | quoc. 1–20, div. 2–12 |
| Tabuada | 1–5 × 1–5 | 1–10 × 1–10 | 1–12 × 1–12 |
| Inteiros (+/−) | −5 a 5 | −10 a 10 | −20 a 20 |
| Inteiros (×/÷) | −5 a 5 (excl. 0) | −10 a 10 (excl. 0) | −15 a 15 (excl. 0) |

### Regras do jogo

- 10 perguntas por rodada
- 4 alternativas por questão (1 correta)
- Feedback imediato: acerto = verde, erro = vermelho + mostra a resposta correta em verde
- Ao errar: caixa amarela com explicação pedagógica usando os números reais da questão
- Avanço manual (botão "Próxima") — dá tempo de assimilar o erro
- Histórico salvo por modo + nível no LocalStorage

### Decisões descartadas (não incluir no MVP)

Login, banco de dados, cadastro, ranking online, painel de pais/professor, sons, animações complexas, moedas, avatares.

---

## 3. Stack Técnica

| Tecnologia | Função |
|---|---|
| Next.js 16 (App Router) | Framework principal |
| TypeScript | Tipagem estática |
| Tailwind CSS | Estilização |
| LocalStorage | Persistência do histórico |
| Vercel | Hospedagem e deploy |
| GitHub | Controle de versão |

---

## 4. Arquitetura do Projeto

```
base-certa/
├── src/
│   ├── app/
│   │   ├── layout.tsx        — HTML shell, metadata
│   │   ├── globals.css       — Tailwind base
│   │   └── page.tsx          — Orquestrador de telas (estado global)
│   │
│   ├── components/
│   │   ├── HomeScreen.tsx    — Tela inicial com os 9 modos
│   │   ├── DifficultyScreen.tsx — Seleção de nível + melhor pontuação
│   │   ├── GameScreen.tsx    — Pergunta, alternativas, feedback, explicação
│   │   ├── ResultScreen.tsx  — Resultado final com acertos/erros
│   │   ├── OptionButton.tsx  — Botão de alternativa com estados visuais
│   │   └── ProgressBar.tsx   — Barra de progresso da rodada
│   │
│   ├── hooks/
│   │   └── useGameSession.ts — Toda a lógica de estado da sessão de jogo
│   │
│   └── lib/
│       ├── types.ts          — Interfaces TypeScript
│       ├── constants.ts      — Modos, níveis e configurações
│       ├── gameEngine.ts     — Geração de questões e explicações
│       └── storage.ts        — LocalStorage (salvar/ler histórico)
```

### Fluxo de telas

```
Home → (clica modo) → DifficultyScreen → (clica nível) → GameScreen → ResultScreen
                                                                           ↓
                                                               Jogar novamente → GameScreen
                                                               Voltar ao início → Home
```

### Como funciona a geração de questões

O `gameEngine.ts` gera questões dinamicamente para cada modo e nível. Para cada questão:

1. Gera os operandos aleatoriamente dentro da faixa do nível
2. Calcula a resposta correta
3. Gera 3 alternativas erradas plausíveis (próximas ao valor correto, com spread proporcional)
4. Embaralha as 4 opções (Fisher-Yates)
5. Cria a explicação com os números reais da questão
6. Garante 10 questões únicas por rodada (sem repetição de texto)

### Explicações pedagógicas por modo

| Modo | Exemplo de explicação |
|---|---|
| Adição básica | "Some 7 com 8: 7 + 8 = 15." |
| Subtração básica | "Retire 4 de 13: 13 − 4 = 9." |
| Multiplicação | "3 grupos de 7: 3 × 7 = 21. Lembre: 7 × 3 também vale 21." |
| Divisão | "6 × 7 = 42, então 42 ÷ 6 = 7." |
| Tabuada | "Tabuada do 8: 8 × 9 = 72. Grave este resultado!" |
| Inteiros — adição | Regra de sinais com os valores reais |
| Inteiros — subtração | "Subtrair (−5) é somar 5: ..." |
| Inteiros — multiplicação | "Sinais iguais → positivo / Sinais diferentes → negativo" |
| Inteiros — divisão | Regra de sinais + verificação pela multiplicação inversa |

---

## 5. Componentes em Detalhe

### `page.tsx` — Orquestrador
Controla qual tela está ativa (`home`, `difficulty`, `game`, `result`). Passa callbacks para os componentes filhos. Não contém lógica de jogo.

### `useGameSession.ts` — Hook central
Toda a lógica de uma partida:
- `startGame(mode, level)` — gera as questões e inicializa o estado
- `selectOption(value)` — registra a resposta e aciona o feedback
- `nextQuestion()` — avança para a próxima questão ou finaliza
- `resetGame()` — volta ao estado inicial
- Usa `useRef` para score e mode — evita problemas de closure stale em callbacks

### `gameEngine.ts` — Motor de questões
Funções puras, sem estado. Recebe modo + nível e retorna array de 10 questões únicas com texto, opções, resposta correta e explicação.

### `storage.ts` — Persistência
Salva e lê histórico no LocalStorage. Chave composta `modo__nível` para separar os recordes. Protegido com `try/catch` para não quebrar em modo privado ou storage cheio.

---

## 6. Deploy

### Repositório
- GitHub: `https://github.com/casemiroya/base-certa`
- Branch principal: `main`

### Hospedagem
- Plataforma: Vercel (plano Hobby — gratuito)
- Deploy automático a cada push na branch `main`

### Para atualizar o app após mudanças

```bash
cd "D:/1. PROJETOS/CLAUDE CODE/IMERSAO COM TATA/base-certa"
git add .
git commit -m "descrição do que foi alterado"
git push
```

A Vercel detecta o push e faz o novo deploy automaticamente em ~1 minuto.

---

## 7. Próximos Passos Sugeridos

### Curto prazo
- [ ] Revisar as explicações pedagógicas dos inteiros com olhar de professor
- [ ] Testar com a Yasmin e coletar feedback real de uso
- [ ] Ajustar faixas numéricas se algum nível estiver fácil ou difícil demais

### Médio prazo
- [ ] Adicionar sons simples (acerto/erro) — melhora a experiência lúdica
- [ ] Tela de histórico — o aluno vê sua evolução ao longo do tempo
- [ ] Modo contrarrelógio — adiciona pressão controlada para alunos mais avançados

### Longo prazo
- [ ] Login simples (Google) para salvar histórico na nuvem
- [ ] Painel do pai/professor para acompanhar o desempenho
- [ ] Integração como bônus ou ferramenta dentro do programa Pai MOVIDO

---

## 8. Observações Importantes

- As explicações pedagógicas para **Números Inteiros** foram geradas automaticamente. Recomenda-se revisão com olhar de professor antes de usar com alunos em contexto formal.
- O app funciona 100% no navegador, sem instalação. Qualquer dispositivo com internet acessa pelo link da Vercel.
- Todo o histórico fica salvo no dispositivo do aluno (LocalStorage). Se o aluno trocar de dispositivo ou limpar o cache, o histórico é perdido — isso só muda com login + banco de dados.

---

*Documento gerado em 22/03/2026 — Base Certa v1.0*
