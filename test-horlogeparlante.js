// Test de la nouvelle fonction scrapeCurrentTime avec horlogeparlante.com
import { PlaywrightServer } from './build/servers/playwright-server.js';

async function testHorlogeParlante() {
  console.log('🕐 Test de la fonction scrapeCurrentTime avec horlogeparlante.com...\n');
  
  const playwrightServer = new PlaywrightServer();
  
  try {
    console.log('🌐 Récupération de l\'heure depuis horlogeparlante.com...');
    const timeInfo = await playwrightServer.scrapeCurrentTime();
    
    console.log('✅ Heure récupérée avec succès !');
    console.log(`⏰ Heure: ${timeInfo.time}`);
    console.log(`📅 Date: ${timeInfo.date}`);
    console.log(`🌐 Source: ${timeInfo.source}`);
    
    // Vérifier que l'heure est au bon format
    const timeRegex = /^\d{1,2}:\d{2}:\d{2}$/;
    if (timeRegex.test(timeInfo.time)) {
      console.log('✅ Format d\'heure validé (HH:MM:SS)');
    } else {
      console.log('⚠️ Format d\'heure inattendu:', timeInfo.time);
    }
    
    await playwrightServer.close();
    console.log('\n🎉 Test terminé avec succès !');
    
  } catch (error) {
    console.error('❌ Erreur lors du test:', error.message);
    await playwrightServer.close();
    process.exit(1);
  }
}

testHorlogeParlante();
