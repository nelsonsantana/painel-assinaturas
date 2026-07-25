# Painel de Vencimentos — Deploy na Vercel (grátis)

Página web mobile-friendly que mostra os vencimentos em cards. Some
dado nenhum é calculado aqui — ela só *exibe* o que o robô do seu
PC/servidor manda pra ela.

## 1. Criar conta na Vercel

Acesse https://vercel.com e crie uma conta (pode ser com GitHub).

## 2. Subir este projeto

**Opção mais simples — sem git:**

1. No dashboard da Vercel, clique em **Add New → Project**
2. Escolha **Deploy without Git** (ou arraste a pasta, dependendo da
   versão da interface) — ou instale a CLI:
   ```bash
   npm i -g vercel
   cd painel-vencimentos
   vercel
   ```
   Siga as perguntas (aceite os padrões). Ele te dá uma URL tipo
   `https://painel-vencimentos-xxxx.vercel.app`.

**Opção recomendada — com GitHub (fica mais fácil atualizar depois):**

1. Crie um repositório novo no GitHub e suba esta pasta
2. Na Vercel: **Add New → Project → Import** o repositório
3. Framework Preset: ele detecta **Next.js** sozinho — não mude nada

## 3. Criar o banco Redis (Upstash, grátis)

1. Dentro do seu projeto na Vercel, vá na aba **Storage**
2. **Create Database → Upstash Redis** (tier grátis é mais que
   suficiente pra esse uso)
3. Conecte ao seu projeto — a Vercel preenche sozinha as variáveis
   `UPSTASH_REDIS_REST_URL` e `UPSTASH_REDIS_REST_TOKEN`

## 4. Configurar as outras variáveis de ambiente

Na Vercel: **Settings → Environment Variables**, adicione:

| Nome | Valor |
|---|---|
| `PAGE_PASSWORD` | a senha que você vai digitar pra entrar na página |
| `INGEST_SECRET` | um valor aleatório — gere com: `node -e "console.log(require('crypto').randomBytes(24).toString('hex'))"` |

Depois de adicionar, vá em **Deployments** e clique em **Redeploy**
(as variáveis só valem a partir do próximo deploy).

## 5. Testar

Acesse a URL que a Vercel te deu (ex:
`https://painel-vencimentos-xxxx.vercel.app`). Deve pedir a senha.
Depois de entrar, vai mostrar "Ainda não recebi nenhum dado do robô"
— normal, porque ainda não conectamos o script local. Isso vem no
próximo passo.

## 6. Salva a página no seu celular

No navegador do celular, abre a URL, faz login, e usa **"Adicionar à
tela inicial"** (Chrome/Safari) — fica com carinha de app.

---

Depois de fazer esse deploy, volta pro projeto `controle-assinaturas`
(o robô) — vou te passar o arquivo que ele precisa pra mandar os
dados pra essa página.
