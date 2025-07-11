const axios = require('axios');
const SftpClient = require('ssh2-sftp-client');
const sftp = new SftpClient();

const blobUrl = 'https://cdnimagenvenus.blob.core.windows.net/imagenes/Storage-Imagenes_QA.jpg';
const frontDoorUrl = 'https://imagenesqa-evesgkd8ezdnb0bf.a03.azurefd.net';

const sftpConfig = {
  host: '137.117.83.118',
  port: 10050,
  username: 'mercuriosftp',
  password: '$or14n4$F',
};

function logWithTime(message) {
  const now = new Date();
  const time = now.toISOString().split('T')[1].split('.')[0]; // HH:MM:SS
  console.log(`[${time}] ${message}`);
}

async function checkUrl(name, url) {
  const start = Date.now();
  logWithTime(`🌐 Verificando ${name}: ${url}`);
  try {
    const response = await axios.get(url, { timeout: 5000 });
    const duration = ((Date.now() - start) / 1000).toFixed(2);
    if (response.status === 200) {
      logWithTime(`✅ ${name} respondió correctamente en ${duration}s`);
    } else {
      logWithTime(`⚠️ ${name} respondió con código: ${response.status} en ${duration}s`);
    }
  } catch (err) {
    const duration = ((Date.now() - start) / 1000).toFixed(2);
    logWithTime(`❌ Error en ${name} (${duration}s): ${err.message}`);
  }
}

async function checkSftpConnection(config) {
  const start = Date.now();
  logWithTime('🔌 Verificando conexión SFTP...');
  try {
    await sftp.connect(config);
    logWithTime('✅ Conectado al servidor SFTP');
    const list = await sftp.list('/');
    logWithTime(`📂 Directorio raíz del SFTP contiene ${list.length} elementos`);
  } catch (err) {
    logWithTime(`❌ Error en conexión SFTP: ${err.message}`);
  } finally {
    await sftp.end();
    logWithTime('🔒 Conexión SFTP cerrada');
    const duration = ((Date.now() - start) / 1000).toFixed(2);
    logWithTime(`🕒 Tiempo total conexión SFTP: ${duration}s`);
  }
}

async function runChecks() {
  const globalStart = Date.now();
  logWithTime('🚀 Iniciando validaciones...');

  await Promise.all([
    checkUrl('Blob Storage', blobUrl),
    checkUrl('Front Door CDN', frontDoorUrl),
    checkSftpConnection(sftpConfig),
  ]);

  const totalDuration = ((Date.now() - globalStart) / 1000).toFixed(2);
  logWithTime(`✅ Todas las validaciones completadas en ${totalDuration}s`);
}

runChecks();
