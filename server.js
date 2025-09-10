// server.js
const { createServer } = require('http');
const next = require('next');
// const { startAutoDepositCron } = require('./lib/cron');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  // Start the auto‑deposit cron job (runs every Sunday at midnight)
//  startAutoDepositCron();

  createServer((req, res) => {
    handle(req, res);
  }).listen(3000, (err) => {
    if (err) throw err;
    console.log('> Ready on http://localhost:3000');
  });
});

