const path = require('path');
const express = require('express');
const app = require('./app');
const connectDatabase = require('./instagram/config/database');

const PORT = process.env.PORT || 4000;

connectDatabase();

const rootDir = path.resolve(__dirname, '..');

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(rootDir, 'frontend', 'build')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(rootDir, 'frontend', 'build', 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send('Backend is running.');
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});