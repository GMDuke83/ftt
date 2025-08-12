# Futures Trade Tracker – GitHub (klassisch)

## Variante A: Nur als Repository (privat, ohne Hosting)
1. Neues **privates** Repo bei GitHub anlegen (z. B. `ftt-classic`), ohne README/License.
2. Dateien aus diesem Ordner committen und pushen:
   ```bash
   git init
   git add .
   git commit -m "Initiale Version"
   git branch -M main
   git remote add origin https://github.com/<DEIN_USER>/ftt-classic.git
   git push -u origin main
   ```
3. Zugriff steuerst du über GitHub (Collaborators). **Passwortschutz der Seite** ist hier nicht relevant, da keine Seite öffentlich ausgeliefert wird.

## Variante B: GitHub Pages (statisch, ohne echten Passwortschutz)
> GitHub Pages bietet keinen serverseitigen Passwortschutz. Für „echte“ Zugangskontrolle nutze vorausschauend einen vorgeschalteten Dienst (z. B. Cloudflare Access) **oder** deploye zu Render/Netlify mit Basic Auth.
1. Repo (auch privat möglich, dann Pages nur mit Enterprise). Für public:
2. In den Repo-Settings → **Pages**:
   - **Source**: `Deploy from a branch`
   - **Branch**: `main` und Folder: `/ (root)` (weil `index.html` im Root liegt)
3. Speichern → Deine Seite erscheint unter `https://<DEIN_USER>.github.io/ftt-classic/`.

## Echte Zugangskontrolle (empfohlen)
- **Empfohlen**: GitHub als Quell-Repo, Deployment zu **Render** (Basic Auth), wie in der Render-Variante beschrieben.
- Alternativ: GitHub Pages hinter **Cloudflare Access** (SSO/OTP).

---
Hinweis: Die Anwendung ist rein statisch (`index.html`). Keine Build-Tools nötig.
