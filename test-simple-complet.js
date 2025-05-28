// Test simple et complet : Heure -> Google Sheets
import { PlaywrightServer } from './build/servers/playwright-server.js';

async function testComplet() {
  console.log('🎯 TEST COMPLET : Horlogeparlante.com -> Google Sheets');
  console.log('================================================');
  
  const server = new PlaywrightServer();
  const sheetUrl = 'https://docs.google.com/spreadsheets/d/16ld2Skv7L8umCKP6TVH36QlU78HQupdJ0Vk5ZxTXdSs/edit?gid=0#gid=0';
  
  try {
    // Etape 1: Recuperer l'heure
    console.log('\n1️⃣ Recuperation heure depuis horlogeparlante.com...');
    const timeInfo = await server.scrapeCurrentTime();
    
    console.log('✅ Heure recuperee !');
    console.log(`   Heure: ${timeInfo.time}`);
    console.log(`   Date: ${timeInfo.date}`);
    console.log(`   Source: ${timeInfo.source}`);
    
    // Etape 2: Preparer donnees
    console.log('\n2️⃣ Preparation des donnees...');
    const donnees = [timeInfo.date, timeInfo.time, timeInfo.source];
    console.log(`   Donnees: ${JSON.stringify(donnees)}`);
    
    // Etape 3: Sauvegarder dans Google Sheets
    console.log('\n3️⃣ Sauvegarde dans Google Sheets...');
    console.log('   (Cette etape peut prendre 30-60 secondes)');
    
    const result = await server.appendToGoogleSheets(sheetUrl, donnees);
    
    if (result.success) {
      console.log('✅ SUCCES ! Donnees ajoutees dans Google Sheets');
      console.log(`   Message: ${result.message}`);
      console.log('\n🎉 MISSION ACCOMPLIE !');
      console.log('   Verifiez votre feuille Google Sheets');
      console.log(`   URL: ${sheetUrl}`);
    } else {
      console.log('❌ Erreur sauvegarde:', result.message);
    }
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  } finally {
    await server.close();
    console.log('\n🔚 Test termine');
  }
}

testComplet();
