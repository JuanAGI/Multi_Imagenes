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

async function checkUrl(name, url) {
  console.log(`🌐 Verificando ${name}: ${url}`);
  try {
    const response = await axios.get(url, { timeout: 5000 });
    if (response.status === 200) {
      console.log(`✅ ${name} conectado correctamente`);
    } else {
      console.warn(`⚠️ ${name} respondió con código: ${response.status}`);
    }
  } catch (err) {
    console.error(`❌ Error en ${name}: ${err.message}`);
  }
}

async function checkSftpConnection(config) {
  console.log('🔌 Verificando conexión SFTP...');
  try {
    await sftp.connect(config);
    console.log('✅ Conectado al servidor SFTP');
    const list = await sftp.list('/');
    console.log('📂 Directorio raíz del SFTP:', list.map(f => f.name));
  } catch (err) {
    console.error('❌ Error en conexión SFTP:', err.message);
  } finally {
    await sftp.end();
    console.log('🔒 Conexión SFTP cerrada');
  }
}

async function runChecks() {
  await Promise.all([
    checkUrl('Blob Storage', blobUrl),
    checkUrl('Front Door CDN', frontDoorUrl),
    checkSftpConnection(sftpConfig)
  ]);

  console.log('🚀 Validaciones completadas');
}

runChecks();
