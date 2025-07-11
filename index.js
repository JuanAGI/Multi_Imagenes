const express = require('express');
const { exec } = require('child_process');
const SftpClient = require('ssh2-sftp-client');
const app = express();

console.log('📦 Iniciando app...');

app.get('/', (req, res) => {
  res.send('✅ App corriendo correctamente');
});

const https = require('https');

app.get('/ping', (req, res) => {
  https.get('https://www.google.com', (resp) => {
    res.send(`✅ Conexión HTTPS exitosa. Código: ${resp.statusCode}`);
  }).on('error', (err) => {
    res.status(500).send(`❌ Error al conectar: ${err.message}`);
  });
});

app.get('/sftp-test', async (req, res) => {
  const sftp = new SftpClient();

  const config = {
    host: '137.117.83.118',
    port: 10050,
    username: 'mercuriosftp',
    password: '$or14n4$F' // o usa una clave privada
  };

  try {
    console.log('🔐 Conectando al servidor SFTP...');
    await sftp.connect(config);
    console.log('✅ Conectado');

    const list = await sftp.list('/');
    console.log('📂 Contenido del directorio raíz:', list);

    res.send(`✅ Conexión SFTP exitosa. Archivos:\n\n${JSON.stringify(list, null, 2)}`);
  } catch (err) {
    console.error('❌ Error SFTP:', err.message);
    res.status(500).send(`❌ Error en conexión SFTP: ${err.message}`);
  } finally {
    await sftp.end();
    console.log('🔌 Conexión SFTP cerrada');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});
