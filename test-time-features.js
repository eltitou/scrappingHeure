// Test des nouvelles fonctionnalités d'heure
import { spawn } from 'child_process';

console.log('🕐 Test des fonctionnalités de récupération d\'heure');
console.log('📊 Feuille cible: https://docs.google.com/spreadsheets/d/16ld2Skv7L8umCKP6TVH36QlU78HQupdJ0Vk5ZxTXdSs/edit?gid=0#gid=0');

// URL de votre feuille Google Sheets
const spreadsheetUrl = 'https://docs.google.com/spreadsheets/d/16ld2Skv7L8umCKP6TVH36QlU78HQupdJ0Vk5ZxTXdSs/edit?gid=0#gid=0';

// Démarrer le serveur MCP
console.log('\n🔧 Démarrage du serveur MCP...');
const server = spawn('node', ['build/index.js'], { 
  stdio: ['pipe', 'pipe', 'pipe'],
  cwd: process.cwd()
});

let requestId = 1;

server.stdout.on('data', (data) => {
  const output = data.toString().trim();
  if (output) {
    console.log('📤', output);
  }
});

server.stderr.on('data', (data) => {
  const error = data.toString().trim();
  if (error && !error.includes('démarré')) {
    console.log('🚨', error);
  } else if (error.includes('démarré')) {
    console.log('✅', error);
    // Démarrer les tests une fois le serveur prêt
    setTimeout(runTimeTests, 2000);
  }
});

function sendRequest(method, params) {
  const request = {
    jsonrpc: "2.0",
    id: requestId++,
    method: method,
    params: params
  };
  
  console.log(`\n📨 Envoi de la requête: ${method}`);
  server.stdin.write(JSON.stringify(request) + '\n');
}

async function runTimeTests() {
  console.log('\n🕐 === TESTS DES FONCTIONNALITÉS D\'HEURE ===\n');
  
  // Test 1: Lister les outils disponibles
  console.log('1️⃣ Test: Lister les outils disponibles');
  sendRequest('tools/list', {});
  
  setTimeout(() => {
    // Test 2: Récupérer l'heure exacte
    console.log('\n2️⃣ Test: Récupérer l\'heure exacte');
    sendRequest('tools/call', {
      name: 'scrape-time',
      arguments: {}
    });
  }, 3000);
  
  setTimeout(() => {
    // Test 3: Sauvegarder l'heure dans Google Sheets
    console.log('\n3️⃣ Test: Sauvegarder l\'heure dans Google Sheets');
    sendRequest('tools/call', {
      name: 'save-time-to-sheet',
      arguments: {
        spreadsheetUrl: spreadsheetUrl
      }
    });
  }, 8000);
  
  setTimeout(() => {
    // Test 4: Re-sauvegarder l'heure (pour voir la différence de temps)
    console.log('\n4️⃣ Test: Re-sauvegarder l\'heure (nouvelle mesure)');
    sendRequest('tools/call', {
      name: 'save-time-to-sheet',
      arguments: {
        spreadsheetUrl: spreadsheetUrl
      }
    });
  }, 15000);
  
  // Arrêter après tous les tests
  setTimeout(() => {
    console.log('\n🏁 === FIN DES TESTS D\'HEURE ===');
    console.log('\n📋 Vérifiez votre feuille Google Sheets pour voir les heures enregistrées:');
    console.log('🔗', spreadsheetUrl);
    console.log('\n📝 Les colonnes devraient contenir:');
    console.log('   - Colonne A: Date (format français)');
    console.log('   - Colonne B: Heure (HH:MM:SS)');
    console.log('   - Colonne C: Source (quelleheureestil.fr)');
    
    server.kill('SIGTERM');
    setTimeout(() => process.exit(0), 2000);
  }, 22000);
}

server.on('close', (code) => {
  console.log(`\n🔚 Serveur fermé avec le code: ${code}`);
});

server.on('error', (err) => {
  console.error('❌ Erreur de démarrage du serveur:', err);
  process.exit(1);
});
