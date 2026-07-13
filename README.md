# TLK Oasis — Sistema da Organização

Sistema web para gestão dos times de Valorant da TLK (Karma, Alfa, Omega): cadastro por convite, agenda/compromissos, vínculo de Riot ID, elo atual/peak (Tracker.gg com fallback manual) e inscrições em campeonatos. Acesso por role: `player`, `coach`, `admin`.

## Stack

- Next.js (App Router, TypeScript) + Tailwind CSS
- Postgres via Prisma (Prisma 7, driver adapter `@prisma/adapter-pg`)
- NextAuth (Auth.js) v5 — Credentials + sessão JWT
- Deploy: Vercel (com Vercel Cron para atualização periódica de elo)

## Rodando localmente

1. Instale as dependências:
   ```bash
   npm install
   ```
2. Configure o `.env` (copie de `.env.example`). Para desenvolvimento local sem depender de um banco na nuvem, você pode usar o Postgres local do próprio Prisma:
   ```bash
   npx prisma dev
   ```
   Isso imprime uma `DATABASE_URL` local — cole no seu `.env`.
3. Aplique o schema e rode o seed (cria os times Karma/Alfa/Omega + 1 usuário admin):
   ```bash
   npx prisma db push
   npx tsx prisma/seed.ts
   ```
   O seed imprime o email/senha do admin criado (padrão: `admin@tlk.gg` / `TrocarSenha123!` — troque após o primeiro login). Pode customizar via `ADMIN_EMAIL`/`ADMIN_PASSWORD` no ambiente antes de rodar o seed.
4. Suba o servidor:
   ```bash
   npm run dev
   ```
5. Acesse `http://localhost:3000`, faça login como admin e crie convites em **Admin → Convites** para trazer coaches e jogadores.

## Variáveis de ambiente (produção / Vercel)

| Variável | Descrição |
|---|---|
| `DATABASE_URL` | Connection string do Postgres. Provisionado pela aba **Storage** da Vercel (Postgres via Neon) — a variável é injetada automaticamente ao conectar o banco ao projeto. |
| `NEXTAUTH_SECRET` | Gere com `npx auth secret`. |
| `NEXTAUTH_URL` | URL pública do deploy (ex: `https://tlk.vercel.app`). |
| `CRON_SECRET` | String aleatória; a Vercel envia automaticamente como header `Authorization: Bearer <CRON_SECRET>` nas chamadas de cron. |
| `TRACKER_API_KEY` | Opcional. Chave da API oficial do Tracker.gg (developer.tracker.gg). Enquanto não configurada, o sistema usa entrada manual de elo (funciona normalmente, só não busca automático). |

## Deploy na Vercel

1. Importe o repositório na Vercel.
2. Crie o banco **direto pelo painel da Vercel**: na aba **Storage** do projeto → **Create Database** → **Postgres** (isso provisiona um banco Neon por baixo dos panos e já injeta as variáveis de conexão automaticamente no projeto — não precisa criar conta separada no site do Neon nem copiar/colar connection string).
   - Depois de conectar, confira em **Settings → Environment Variables** o nome exato da variável injetada (normalmente `DATABASE_URL`, mas a Vercel também pode criar `POSTGRES_URL`/`POSTGRES_PRISMA_URL` dependendo da versão da integração). O projeto lê `DATABASE_URL` (configurado em `prisma.config.ts`) — se a Vercel injetar outro nome, adicione um alias `DATABASE_URL` apontando pro mesmo valor.
3. Configure as demais variáveis de ambiente (tabela acima): `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `CRON_SECRET`, e opcionalmente `TRACKER_API_KEY`.
4. No primeiro deploy, rode as migrações e o seed contra o banco de produção (uma vez, com a `DATABASE_URL` de produção — pode pegar o valor em Storage → seu banco → `.env.local` da Vercel):
   ```bash
   DATABASE_URL="<url-do-banco-na-vercel>" npx prisma migrate deploy
   DATABASE_URL="<url-do-banco-na-vercel>" npx tsx prisma/seed.ts
   ```
5. O `vercel.json` já configura o cron de atualização de elo (`/api/cron/refresh-elo`, a cada 6h) — a Vercel ativa automaticamente ao detectar o arquivo.
6. Quando a chave do Tracker.gg for aprovada, basta adicionar `TRACKER_API_KEY` nas env vars do projeto — nenhuma mudança de código é necessária.

## Estrutura

- `src/app/(auth)` — login, "não tenho conta", aceite de convite
- `src/app/(dashboard)/{player,coach,admin}` — áreas por role
- `src/components/profile` — abas reutilizadas entre player/coach/admin (Agenda, Riot ID, Elo, Time, Campeonatos)
- `src/lib/elo` — abstração do provider de elo (Tracker.gg real + fallback manual)
- `src/actions` — server actions (mutações)
- `prisma/schema.prisma` — modelo de dados
