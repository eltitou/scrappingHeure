// Script planifié pour récupérer l'heure toutes les X minutes
import { PlaywrightServer } from './build/servers/playwright-server.js';

class HeureVersSheetsPlanifie {
  constructor() {
    this.playwrightServer = new PlaywrightServer();
    this.spreadsheetUrl = 'https://docs.google.com/spreadsheets/d/16ld2Skv7L8umCKP6TVH36QlU78HQupdJ0Vk5ZxTXdSs/edit?gid=0#gid=0';
    this.intervalId = null;
  }
  
  async recupererEtSauvegarder() {
    try {
      console.log(`\n🕐 ${new Date().toLocaleString('fr-FR')} - Récupération d'heure...`);
      
      // Récupérer l'heure
      const timeInfo = await this.playwrightServer.scrapeCurrentTime();
      console.log(`   ⏰ ${timeInfo.time} depuis ${timeInfo.source}`);
      
      // Sauvegarder dans Google Sheets
      const donnees = [timeInfo.date, timeInfo.time, timeInfo.source];
      const result = await this.playwrightServer.appendToGoogleSheets(this.spreadsheetUrl, donnees);
      
      if (result.success) {
        console.log(`   ✅ Sauvegardé dans Sheets`);
      } else {
        console.log(`   ❌ Erreur: ${result.message}`);
      }
      
    } catch (error) {
      console.error(`   ❌ Erreur: ${error.message}`);
    }
  }
  
  demarrer(intervalMinutes = 5) {
    console.log(`🚀 Démarrage du planificateur (toutes les ${intervalMinutes} minutes)`);
    console.log(`🎯 Feuille cible: ${this.spreadsheetUrl}`);
    
    // Première exécution immédiate
    this.recupererEtSauvegarder();
    
    // Puis répéter toutes les X minutes
    this.intervalId = setInterval(() => {
      this.recupererEtSauvegarder();
    }, intervalMinutes * 60 * 1000);
    
    console.log(`⏰ Prochaine exécution dans ${intervalMinutes} minutes...`);
  }
  
  arreter() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.playwrightServer.close();
    console.log('🛑 Planificateur arrêté');
  }
}

// Utilisation
const planificateur = new HeureVersSheetsPlanifie();

// Démarrer avec un intervalle de 5 minutes
planificateur.demarrer(5);

// Arrêter proprement avec Ctrl+C
process.on('SIGINT', () => {
  console.log('\n👋 Arrêt demandé...');
  planificateur.arreter();
  process.exit(0);
});

// Garder le script en vie
console.log('💡 Appuyez sur Ctrl+C pour arrêter le planificateur');
