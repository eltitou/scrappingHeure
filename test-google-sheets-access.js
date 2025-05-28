// Test simple de la fonctionnalité Google Sheets avec Playwright
const { chromium } = require('playwright');

async function testGoogleSheetsAccess() {
  console.log('🧪 Test d\'accès à Google Sheets...');
  
  const browser = await chromium.launch({ 
    headless: false, // Pour voir ce qui se passe
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    });
    
    const page = await context.newPage();
    
    // URL de votre feuille Google Sheets
    const spreadsheetUrl = 'https://docs.google.com/spreadsheets/d/16ld2Skv7L8umCKP6TVH36QlU78HQupdJ0Vk5ZxTXdSs/edit?gid=0#gid=0';
    
    console.log('📊 Navigation vers Google Sheets...');
    await page.goto(spreadsheetUrl, { waitUntil: 'networkidle', timeout: 30000 });
    
    // Attendre que la feuille soit chargée
    console.log('⏳ Attente du chargement de la feuille...');
    await page.waitForSelector('[data-sheet-viewport]', { timeout: 15000 });
    
    console.log('✅ Google Sheets accessible !');
    
    // Prendre une capture d'écran pour vérifier
    await page.screenshot({ path: 'google-sheets-test.png' });
    console.log('📸 Capture d\'écran sauvegardée: google-sheets-test.png');
    
    await browser.close();
    console.log('🎉 Test réussi ! La feuille Google Sheets est accessible.');
    
  } catch (error) {
    console.error('❌ Erreur lors du test:', error.message);
    await browser.close();
    process.exit(1);
  }
}

// Lancer le test
testGoogleSheetsAccess().catch(console.error);
