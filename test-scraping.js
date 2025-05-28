// Test simple du serveur Playwright
import { PlaywrightServer } from './build/servers/playwright-server.js';

async function testScraping() {
    console.log('🧪 Test du scraping avec Playwright...\n');
    
    const playwrightServer = new PlaywrightServer();
    
    try {
        // Test 1: Scraper le titre d'une page simple
        console.log('📄 Test 1: Récupération du titre de https://example.com');
        const title = await playwrightServer.scrapePageTitle('https://example.com');
        console.log('✅ Titre récupéré:', title);
        console.log('');
        
        // Test 2: Récupérer les métadonnées
        console.log('📄 Test 2: Récupération des métadonnées de https://example.com');
        const metadata = await playwrightServer.scrapeMetadata('https://example.com');
        console.log('✅ Métadonnées récupérées:');
        console.log('   - Titre:', metadata.title);
        console.log('   - Description:', metadata.description || 'Non disponible');
        console.log('   - Keywords:', metadata.keywords || 'Non disponible');
        console.log('');
        
        // Test 3: Test avec une vraie page web
        console.log('📄 Test 3: Test avec Google.com');
        const googleTitle = await playwrightServer.scrapePageTitle('https://www.google.com');
        console.log('✅ Titre Google récupéré:', googleTitle);
        console.log('');
        
        await playwrightServer.close();
        
        console.log('🎉 Tous les tests de scraping ont réussi !');
        console.log('✅ Le serveur Playwright est parfaitement opérationnel\n');
        
        return true;
        
    } catch (error) {
        console.error('❌ Erreur lors du test:', error.message);
        await playwrightServer.close();
        return false;
    }
}

// Exécuter le test
testScraping()
    .then(success => {
        if (success) {
            console.log('🚀 Prêt pour les tests d\'intégration MCP !');
        } else {
            console.log('⚠️  Des problèmes ont été détectés');
            process.exit(1);
        }
    })
    .catch(error => {
        console.error('💥 Erreur fatale:', error);
        process.exit(1);
    });