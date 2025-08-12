# Futures Trade Tracker – Deployment (GitHub + Render, mit Passwort)

Bewährter Weg, wie man es immer gemacht hat – Schritt für Schritt.

## 1) Repository vorbereiten

```bash
git init ftt-classic && cd ftt-classic
```

Dateien aus diesem Paket in den Ordner kopieren.

```bash
git add .
git commit -m "Initiale Version: klassisch mit Basic Auth"
git branch -M main
git remote add origin https://github.com/<DEIN_USER>/ftt-classic.git
git push -u origin main
```

## 2) Render einrichten

**Variante A – Blueprint (empfohlen, klassisch reproduzierbar):**

1. In Render „New → Blueprint“.
2. Als Repo `ftt-classic` wählen (enthält `render.yaml`).
3. Zwei **Environment Variables** setzen:
   - `BASIC_AUTH_USER` = Dein Benutzername
   - `BASIC_AUTH_PASS` = Dein Passwort
4. Deploy starten. URL z. B. `https://ftt-classic.onrender.com`.

**Variante B – Manuell:**

1. In Render „New → Web Service“ → Repository verbinden → Node.
2. Build Command: `npm install`
3. Start Command: `node server.js`
4. Environment:
   - `BASIC_AUTH_USER` (Secret)
   - `BASIC_AUTH_PASS` (Secret)
5. Deploy.

## 3) Lokal testen (optional)

```bash
npm install
cp .env.example .env
# Werte in .env anpassen oder als Umgebungsvariablen setzen
npm start
# Aufruf: http://localhost:3000 (Browser fragt nach Benutzer+Passwort)
```

## Hinweise

- **HTTPS** übernimmt Render automatisch → Basic Auth läuft sicher über TLS.
- Die Anwendung liefert statische Dateien aus `public/`. Deine `index.html` wurde bereits übernommen.
- Für spätere Updates: lokal committen & `git push` → Render deployt automatisch.
- Falls die Seite nur intern genutzt wird, kann man IP-Filter ergänzen oder User/Pass regelmäßig wechseln.
