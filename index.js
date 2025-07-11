const SftpClient = require('ssh2-sftp-client');
const sftp = new SftpClient();

const config = {
  host: '137.117.83.118',
  port: 10050,
  username: 'mercuriosftp',
  password: '$or14n4$F'
};

async function run() {
  console.log('📦 Iniciando conexión SFTP...');

  try {
    await sftp.connect(config);
    console.log('✅ Conectado al servidor SFTP');

    const list = await sftp.list('/');
    console.log('📂 Contenido del directorio raíz:\n', list);
  } catch (err) {
    console.error('❌ Error durante la conexión SFTP:', err.message);
  } finally {
    await sftp.end();
    console.log('🔌 Conexión SFTP cerrada');
    process.exit(0);
  }
}

run();
