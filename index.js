const URL = 'https://cdnimagenvenus.blob.core.windows.net/imagenes/Storage-Imagenes_QA.jpg';

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
