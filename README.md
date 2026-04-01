# AI Email Triage Frontend

A React + TypeScript + Vite + Tailwind dashboard for reviewing customer support emails, AI triage output, and human follow-up actions.

## Tech stack

- React 19
- TypeScript
- Vite
- Tailwind CSS

## Getting started

1. Install dependencies:

```bash
npm install
```

2. Create your environment file:

```bash
copy .env.example .env
```

3. Update `VITE_API_BASE_URL` if your backend runs somewhere else.

4. Start the development server:

```bash
npm run dev
```

5. Open the app in the browser using the URL Vite prints in the terminal.

## Notes

- The frontend never uses the Gemini API key directly.
- If the backend is unavailable, the app automatically falls back to local mock data.
- Mock triage actions still work so you can demo the full flow before backend integration is finished.

## Suggested folder structure

```text
src/
  app/
  components/
    common/
    email/
    layout/
    triage/
  data/
  hooks/
  pages/
  services/
  styles/
  types/
  utils/
```

