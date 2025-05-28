# 🚀 MCP Web Scraper to Google Sheets (Playwright)

Ce projet est un serveur MCP (Model Context Protocol) qui utilise **Playwright** pour le web scraping et l'interaction directe avec Google Sheets via l'interface web.

## ✨ Fonctionnalités

- 🌐 **Web Scraping** : Extraction de titres et contenu de pages web
- 📊 **Google Sheets** : Écriture directe dans les feuilles de calcul via l'interface web
- 🔄 **Scrape & Save** : Fonction combinée pour scraper et sauvegarder automatiquement
- 🛡️ **Validation** : Validation des entrées avec Zod
- 🎭 **Playwright** : Automatisation web robuste avec gestion d'erreurs

## 🛠️ Installation

```bash
npm install
npm run build
```

## 🎯 Utilisation

### Démarrer le serveur MCP

```bash
npm start
```

### Outils disponibles

#### 1. `scrape-title`
Récupère le titre d'une page web.

**Paramètres :**
- `url` (string) : L'URL de la page à analyser

#### 2. `write-to-sheet`
Écrit des données dans une feuille Google Sheets à une position spécifique.

**Paramètres :**
- `spreadsheetUrl` (string) : L'URL complète de la feuille Google Sheets
- `data` (array[array[string]]) : Données à écrire (tableau 2D)
- `startCell` (string, optionnel) : Cellule de départ (défaut: "A1")

#### 3. `append-to-sheet`
Ajoute une nouvelle ligne à la fin d'une feuille Google Sheets.

**Paramètres :**
- `spreadsheetUrl` (string) : L'URL complète de la feuille Google Sheets
- `data` (array[string]) : Données à ajouter en tant que nouvelle ligne

#### 4. `scrape-and-save`
Fonction combinée qui scrape le titre d'une page et l'ajoute automatiquement à Google Sheets.

**Paramètres :**
- `url` (string) : L'URL de la page à analyser
- `spreadsheetUrl` (string) : L'URL complète de la feuille Google Sheets

## 📋 Exemple d'utilisation

Pour votre feuille Google Sheets : `https://docs.google.com/spreadsheets/d/16ld2Skv7L8umCKP6TVH36QlU78HQupdJ0Vk5ZxTXdSs/edit?gid=0#gid=0`

```javascript
// Scraper et sauvegarder automatiquement
{
  "url": "https://example.com",
  "spreadsheetUrl": "https://docs.google.com/spreadsheets/d/16ld2Skv7L8umCKP6TVH36QlU78HQupdJ0Vk5ZxTXdSs/edit?gid=0#gid=0"
}
```

## 🏗️ Architecture

- **`src/index.ts`** : Serveur MCP principal avec gestion des outils
- **`src/servers/playwright-server.ts`** : Serveur Playwright pour web scraping et Google Sheets
- **`build/`** : Fichiers TypeScript compilés

## 🔧 Avantages de cette approche

✅ **Simplicité** : Plus besoin de configuration Google API complexe  
✅ **Robustesse** : Playwright gère automatiquement les interactions web  
✅ **Flexibilité** : Fonctionne avec n'importe quelle feuille Google Sheets publique  
✅ **Maintenance** : Moins de dépendances externes  

## 🚨 Notes importantes

- La feuille Google Sheets doit être accessible (publique ou partagée)
- Playwright lance un navigateur pour interagir avec l'interface web
- Les données sont ajoutées via l'interface utilisateur de Google Sheets

## 📝 Structure des données sauvegardées

Quand vous utilisez `scrape-and-save`, les données sont ajoutées dans cet ordre :
1. **Horodatage** (Date et heure)
2. **URL** (URL de la page scrapée)
3. **Titre** (Titre de la page)

## 🔄 Migration depuis l'API Google Drive

Cette version remplace l'approche API Google Drive par une interaction directe via Playwright, offrant :
- Configuration plus simple
- Moins de dépendances
- Fonctionnement plus visuel et intuitif
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "votre-service@votre-projet.iam.gserviceaccount.com",
  "client_id": "...",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "...",
  "client_x509_cert_url": "..."
}
```

### Étape 3: Partager votre feuille Google Sheets

1. Créez une nouvelle feuille Google Sheets
2. Partagez-la avec l'email du compte de service (client_email du fichier JSON)
3. Donnez les permissions d'édition au compte de service
4. Copiez l'ID de la feuille depuis l'URL

## 🎯 Utilisation

### Configuration MCP

Créez le fichier de configuration VS Code MCP :

```json
{
  "servers": {
    "web-scraper-to-sheets": {
      "type": "stdio",
      "command": "node",
      "args": ["C:\\chemin\\absolu\\vers\\votre\\projet\\build\\index.js"]
    }
  }
}
```

### Outils disponibles

#### 1. `scrape-title`
Récupère le titre d'une page web.

```json
{
  "name": "scrape-title",
  "arguments": {
    "url": "https://example.com"
  }
}
```

#### 2. `write-to-sheet`
Écrit des données dans une feuille Google Sheets.

```json
{
  "name": "write-to-sheet",
  "arguments": {
    "spreadsheetId": "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms",
    "range": "A1:C1",
    "values": [["Horodatage", "URL", "Titre"]]
  }
}
```

#### 3. `scrape-and-save` (Recommandé)
Combine le scraping et la sauvegarde en une seule opération.

```json
{
  "name": "scrape-and-save",
  "arguments": {
    "url": "https://example.com",
    "spreadsheetId": "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms",
    "range": "A2"
  }
}
```

## 📝 Exemple d'utilisation

1. **Créer une feuille avec en-têtes** :
```json
{
  "name": "write-to-sheet",
  "arguments": {
    "spreadsheetId": "VOTRE_SPREADSHEET_ID",
    "range": "A1:C1",
    "values": [["Horodatage", "URL", "Titre"]]
  }
}
```

2. **Scraper et sauvegarder** :
```json
{
  "name": "scrape-and-save",
  "arguments": {
    "url": "https://github.com",
    "spreadsheetId": "VOTRE_SPREADSHEET_ID",
    "range": "A2"
  }
}
```

## 🔧 Scripts disponibles

- `npm run build` : Compile le projet TypeScript
- `npm run start` : Lance le serveur MCP compilé
- `npm run dev` : Compile et lance le serveur

## 🐛 Dépannage

### Erreurs d'authentification Google
- Vérifiez que le fichier `credentials.json` est présent
- Vérifiez que les APIs Google Sheets et Drive sont activées
- Vérifiez que la feuille est partagée avec le compte de service

### Erreurs de scraping
- Vérifiez que l'URL est accessible
- Certains sites peuvent bloquer les bots - essayez avec d'autres sites
- Vérifiez votre connexion internet

### Erreurs MCP
- Vérifiez que le chemin vers le fichier compilé est correct
- Vérifiez que le projet est compilé (`npm run build`)
- Redémarrez Claude Desktop après avoir modifié la configuration

## 📁 Structure du projet

```
├── src/
│   ├── index.ts                 # Serveur MCP principal
│   └── servers/
│       ├── playwright-server.ts # Serveur Playwright
│       └── google-drive-server.ts # Serveur Google Drive
├── build/                       # Fichiers compilés
├── credentials.json             # Clés Google (à créer)
├── package.json
├── tsconfig.json
└── README.md
```

## 🔒 Sécurité

- Ne jamais commiter le fichier `credentials.json`
- Utilisez des comptes de service avec des permissions minimales
- Limitez l'accès aux feuilles Google Sheets selon vos besoins

## 📄 License

ISC
