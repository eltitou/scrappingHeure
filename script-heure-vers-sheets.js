// Script autonome : Heure de horlogeparlante.com → Google Sheets
import { PlaywrightServer } from './build/servers/playwright-server.js';

async function heureVersSheets() {
  console.log('🎯 SCRIPT AUTONOME : Heure → Google Sheets');
  console.log('='.repeat(50));
  
  const playwrightServer = new PlaywrightServer();
  const spreadsheetUrl = 'https://docs.google.com/spreadsheets/d/16ld2Skv7L8umCKP6TVH36QlU78HQupdJ0Vk5ZxTXdSs/edit?gid=0#gid=0';
  
  try {
    // Étape 1 : Récupérer l'heure depuis horlogeparlante.com
    console.log('\n1️⃣ Récupération de l\'heure depuis horlogeparlante.com...');
    const timeInfo = await playwrightServer.scrapeCurrentTime();
    
    console.log('✅ Heure récupérée avec succès !');
    console.log(`   ⏰ Heure: ${timeInfo.time}`);
    console.log(`   📅 Date: ${timeInfo.date}`);
    console.log(`   🌐 Source: ${timeInfo.source}`);
    
    // Étape 2 : Préparer les données pour Google Sheets
    console.log('\n2️⃣ Préparation des données...');
    const donnees = [timeInfo.date, timeInfo.time, timeInfo.source];
    console.log('   📊 Données à insérer:', donnees);
    
    // Étape 3 : Ajouter une nouvelle ligne dans Google Sheets
    console.log('\n3️⃣ Insertion dans Google Sheets...');
    console.log('   🔗 URL cible:', spreadsheetUrl);
    
    const result = await playwrightServer.appendToGoogleSheets(spreadsheetUrl, donnees);
    
    if (result.success) {
      console.log('✅ Sauvegarde réussie dans Google Sheets !');
      console.log(`   📝 ${result.message}`);
      console.log('\n🎉 MISSION ACCOMPLIE !');
      console.log('   • Heure récupérée depuis horlogeparlante.com ✅');
      console.log('   • Données insérées dans Google Sheets ✅');
      console.log('   • Processus entièrement automatisé ✅');
    } else {
      console.log('❌ Erreur lors de la sauvegarde:', result.message);
    }
    
    await playwrightServer.close();
    
  } catch (error) {
    console.error('❌ Erreur pendant le processus:', error.message);
    await playwrightServer.close();
    process.exit(1);
  }
}

heureVersSheets();
