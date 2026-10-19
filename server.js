const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    app: 'LifeDashboard Gym',
    runtime: 'Node.js'
  });
});

// Express 5 wildcard route
app.get('/{*path}', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`LifeDashboard Gym está disponible en http://localhost:${PORT}`);
});