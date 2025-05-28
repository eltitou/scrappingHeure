# 🕐 Guide : Récupérer l'heure dans Google Sheets

## 🎯 Objectif
Récupérer l'heure précise depuis horlogeparlante.com et l'insérer automatiquement dans votre feuille Google Sheets.

## 🔗 Votre feuille Google Sheets
```
https://docs.google.com/spreadsheets/d/16ld2Skv7L8umCKP6TVH36QlU78HQupdJ0Vk5ZxTXdSs/edit?gid=0#gid=0
```

## 🚀 Méthodes disponibles

### **Méthode 1 : Script simple (RECOMMANDÉ)**
```powershell
cd c:\Users\trist\projetMCP
node script-heure-vers-sheets.js
```

**Ce qui se passe :**
1. 🌐 Connexion à horlogeparlante.com
2. ⏰ Récupération de l'heure précise (ex: 18:05:23)
3. 📅 Récupération de la date (ex: 28/05/2025)
4. 📊 Insertion d'une nouvelle ligne dans Google Sheets avec :
   - Colonne A : Date
   - Colonne B : Heure
   - Colonne C : Source (horlogeparlante.com)

### **Méthode 2 : Via serveur MCP**
```powershell
# Terminal 1 : Démarrer le serveur
npm start

# Terminal 2 : Tester
node test-heure-vers-sheets.js
```

### **Méthode 3 : Planificateur automatique**
```powershell
node planificateur-heure-sheets.js
```
- Récupère l'heure toutes les 5 minutes
- Ajoute automatiquement les données dans Sheets
- Ctrl+C pour arrêter

## 📊 Format des données dans Google Sheets

| Date | Heure | Source |
|------|-------|--------|
| 28/05/2025 | 18:05:23 | horlogeparlante.com |
| 28/05/2025 | 18:10:23 | horlogeparlante.com |
| 28/05/2025 | 18:15:23 | horlogeparlante.com |

## ⚡ Exécution rapide
Pour un usage immédiat, utilisez simplement :
```powershell
node script-heure-vers-sheets.js
```

Le script :
- ✅ Récupère l'heure en temps réel
- ✅ L'insère dans votre feuille automatiquement
- ✅ Confirme le succès de l'opération
- ✅ Ferme proprement tous les navigateurs

## 🔧 Personnalisation

Pour changer l'intervalle du planificateur, modifiez la ligne dans `planificateur-heure-sheets.js` :
```javascript
planificateur.demarrer(10); // 10 minutes au lieu de 5
```

## 🎉 Résultat attendu
Après exécution, vous verrez une nouvelle ligne dans votre feuille Google Sheets avec l'heure exacte récupérée depuis horlogeparlante.com !
