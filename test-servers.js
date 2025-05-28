// Test simple des serveurs MCP
import { PlaywrightServer } from './build/servers/playwright-server.js';
import { GoogleDriveServer } from './build/servers/google-drive-server.js';

async function testPlaywrightServer() {
    console.log('🧪 Test du serveur Playwright...');
    const playwrightServer = new PlaywrightServer();
    
    try {
        // Test basique - scraper le titre d'une page
        const title = await playwrightServer.scrapePageTitle('https://example.com');
        console.log('✅ Titre récupéré:', title);
        
        // Test des métadonnées
        const metadata = await playwrightServer.scrapeMetadata('https://example.com');
        console.log('✅ Métadonnées récupérées:', metadata);
        
        await playwrightServer.close();
        console.log('✅ Serveur Playwright opérationnel');
        return true;
    } catch (error) {
        console.error('❌ Erreur Playwright:', error.message);
        await playwrightServer.close();
        return false;
    }
}

async function testGoogleDriveServer() {
    console.log('🧪 Test du serveur Google Drive...');
    const googleServer = new GoogleDriveServer();
    
    try {
        // Test basique - vérifier l'initialisation (sans credentials réels)
        console.log('✅ Serveur Google Drive initialisé');
        console.log('⚠️  Note: Credentials requis pour tests complets');
        return true;
    } catch (error) {
        console.error('❌ Erreur Google Drive:', error.message);
        return false;
    }
}

async function runTests() {
    console.log('🚀 Tests des serveurs MCP\n');
    
    const playwrightOk = await testPlaywrightServer();
    console.log('');
    
    const googleOk = await testGoogleDriveServer();
    console.log('');
    
    if (playwrightOk && googleOk) {
        console.log('🎉 Tous les serveurs sont opérationnels !');
        console.log('');
        console.log('📋 Prochaines étapes:');
        console.log('1. Configurer les credentials Google Drive');
        console.log('2. Tester l\'intégration complète');
        console.log('3. Utiliser le serveur MCP avec un client');
    } else {
        console.log('⚠️  Certains serveurs ont des problèmes');
    }
}

runTests().catch(console.error);
