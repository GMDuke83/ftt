
const express = require('express');

const app = express();

// Basic Auth middleware (klassisch & robust)
function basicAuth(req, res, next) {
  const auth = req.headers.authorization || '';
  const token = auth.split(' ')[1] || '';
  let login = '', password = '';
  try {
    [login, password] = Buffer.from(token, 'base64').toString().split(':');
  } catch (e) {}

  const USER = process.env.BASIC_AUTH_USER;
  const PASS = process.env.BASIC_AUTH_PASS;

  if (USER && PASS && login === USER && password === PASS) {
    return next();
  }
  res.set('WWW-Authenticate', 'Basic realm="Protected"');
  return res.status(401).send('Authentication required.');
}

// Apply auth to everything
app.use(basicAuth);

// Serve static files
app.use(express.static('public', {
  extensions: ['html'],
  setHeaders: (res, path, stat) => {
    // security headers (traditionell vorausschauend)
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Referrer-Policy', 'no-referrer');
  }
}));

// Fallback to index.html
app.get('*', (req, res) => res.sendFile(__dirname + '/public/index.html'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`FTT served on :${PORT}`));
