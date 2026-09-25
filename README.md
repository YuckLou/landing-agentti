# landing-agentti

Landing pública do Agentti em https://www.agentti.ia.br (Vercel, site estático, sem build).

- `index.html`, `assets/` — página e estilos.
- `vercel.json` — redirects (`/planos`, `/login`, `/cadastro`, `/app/*` para o app) e cabeçalhos de segurança.
- Login e cadastro acontecem em https://app.agentti.ia.br (`/?login=1`, `/?register=1`). Esta página não guarda sessão.

Números da base citados na página (medidos em set/2026, amostra de 0,5%): 28,3 mi estabelecimentos ativos,
99,7% geolocalizados (72% no nível da rua ou do número), 97% com telefone, 90% com e-mail.
Revisar quando a base mudar de forma relevante.

Pré-visualizar localmente: `python -m http.server 8765` e abrir http://127.0.0.1:8765/.
