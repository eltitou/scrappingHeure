// Exemple d'utilisation simple des fonctionnalités d'heure
import { spawn } from 'child_process';

console.log('🕐 Test simple des fonctionnalités d\'heure MCP');

const spreadsheetUrl = 'https://docs.google.com/spreadsheets/d/16ld2Skv7L8umCKP6TVH36QlU78HQupdJ0Vk5ZxTXdSs/edit?gid=0#gid=0';

console.log('\n🔧 Démarrage du serveur MCP...');
const server = spawn('node', ['build/index.js'], { 
  stdio: ['pipe', 'pipe', 'pipe'],
  cwd: process.cwd()
});

let isServerReady = false;

server.stdout.on('data', (data) => {
  const output = data.toString().trim();
  if (output) {
    try {
      const response = JSON.parse(output);
      console.log('📤 Réponse du serveur:', JSON.stringify(response, null, 2));
    } catch (e) {
      console.log('📤 Sortie brute:', output);
    }
  }
});

server.stderr.on('data', (data) => {
  const error = data.toString().trim();
  if (error.includes('démarré')) {
    console.log('✅', error);
    isServerReady = true;
    setTimeout(testTimeFeatures, 2000);
  } else if (error) {
    console.log('🚨', error);
  }
});

function sendMCPRequest(method, params = {}) {
  const request = {
    jsonrpc: "2.0",
    id: Date.now(),
    method: method,
    params: params
  };
  
  console.log(`\n📨 Envoi: ${method}`);
  console.log('📋 Paramètres:', JSON.stringify(params, null, 2));
  server.stdin.write(JSON.stringify(request) + '\n');
}

function testTimeFeatures() {
  console.log('\n🧪 === TEST DES FONCTIONNALITÉS D\'HEURE ===\n');
  
  // Test 1: Récupérer l'heure
  console.log('1️⃣ Test: Récupération de l\'heure');
  sendMCPRequest('tools/call', {
    name: 'scrape-time',
    arguments: {}
  });
  
  setTimeout(() => {
    // Test 2: Sauvegarder l'heure
    console.log('\n2️⃣ Test: Sauvegarde de l\'heure dans Google Sheets');
    sendMCPRequest('tools/call', {
      name: 'save-time-to-sheet',
      arguments: {
        spreadsheetUrl: spreadsheetUrl
      }
    });
  }, 5000);
  
  setTimeout(() => {
    console.log('\n🏁 Test terminé - vérifiez votre feuille Google Sheets!');
    console.log('🔗', spreadsheetUrl);
    server.kill('SIGTERM');
    setTimeout(() => process.exit(0), 1000);
  }, 15000);
}

// Attendre 5 secondes puis démarrer si le serveur n'a pas envoyé de signal
setTimeout(() => {
  if (!isServerReady) {
    console.log('⚠️ Le serveur ne semble pas avoir démarré, tentative de test...');
    testTimeFeatures();
  }
}, 5000);

server.on('close', (code) => {
  console.log(`\n🔚 Serveur fermé avec le code: ${code}`);
});

server.on('error', (err) => {
  console.error('❌ Erreur:', err);
  process.exit(1);
});
