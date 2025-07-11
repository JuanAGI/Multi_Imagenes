const URL = 'https://imagenesqa-evesgkd8ezdnb0bf.a03.azurefd.net/';

async function validateCDNConnection() {
  console.log(`🌐 Verificando conexión a: ${URL}`);

  try {
    const res = await fetch(URL, { method: 'GET', timeout: 5000 });
    if (res.ok) {
      console.log('✅ Conexión exitosa. Código de estado:', res.status);
    } else {
      console.warn('⚠️ Respuesta con error:', res.status);
    }
  } catch (error) {
    console.error('❌ Error al conectar:', error.message);
  }
}

validateCDNConnection();
