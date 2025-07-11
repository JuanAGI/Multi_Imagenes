const express = require('express');
const { exec } = require('child_process');
const SftpClient = require('ssh2-sftp-client');
const app = express();

console.log('📦 Iniciando app...');

app.get('/ping', (req, res) => {
  console.log('🔔 Petición a /ping recibida');
  exec('ping -c 1 google.com', (error, stdout, stderr) => {
    if (error) {
      return res.status(500).send(`❌ Error al hacer ping: ${stderr || error.message}`);
    }
    res.send(`✅ Respuesta del ping:\n\n${stdout}`);
  });
});

app.get('/sftp-test', async (req, res) => {
  const sftp = new SftpClient();

  const config = {
    host: 'sftp.ejemplo.com',
    port: 22,
    username: 'usuario',
    password: 'tu_contraseña' // o usa una clave privada
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
