import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { 
  CallToolRequestSchema, 
  CallToolResult, 
  ListToolsRequestSchema,
  Tool 
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { PlaywrightServer } from "./servers/playwright-server.js";

// Créer le serveur MCP principal
const server = new Server(
  {
    name: "web-scraper-to-sheets",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Initialiser le serveur Playwright
const playwrightServer = new PlaywrightServer();

// Schemas de validation Zod
const ScrapeTitleSchema = z.object({
  url: z.string().url("URL invalide"),
});

const WriteToSheetSchema = z.object({
  spreadsheetUrl: z.string().url("URL de la feuille Google Sheets invalide"),
  data: z.array(z.array(z.string())).min(1, "Au moins une ligne de données requise"),
  startCell: z.string().default("A1"),
});

const AppendToSheetSchema = z.object({
  spreadsheetUrl: z.string().url("URL de la feuille Google Sheets invalide"),
  data: z.array(z.string()).min(1, "Au moins une donnée requise"),
});

const ScrapeAndSaveSchema = z.object({
  url: z.string().url("URL invalide"),
  spreadsheetUrl: z.string().url("URL de la feuille Google Sheets invalide"),
});

const ScrapeTimeSchema = z.object({
  // Pas de paramètres nécessaires pour récupérer l'heure
});

const SaveTimeToSheetSchema = z.object({
  spreadsheetUrl: z.string().url("URL de la feuille Google Sheets invalide"),
});

// Liste des outils disponibles
const tools: Tool[] = [
  {
    name: "scrape-title",
    description: "Récupère le titre d'une page web en utilisant Playwright",
    inputSchema: {
      type: "object",
      properties: {
        url: {
          type: "string",
          format: "uri",
          description: "L'URL de la page web à analyser",
        },
      },
      required: ["url"],
    },
  },
  {
    name: "write-to-sheet",
    description: "Écrit des données dans une feuille Google Sheets via l'interface web",
    inputSchema: {
      type: "object",
      properties: {
        spreadsheetUrl: {
          type: "string",
          format: "uri",
          description: "L'URL complète de la feuille Google Sheets",
        },
        data: {
          type: "array",
          items: {
            type: "array",
            items: { type: "string" },
          },
          description: "Les données à écrire (tableau 2D)",
        },
        startCell: {
          type: "string",
          description: "La cellule de départ (ex: A1, B2, etc.)",
          default: "A1",
        },
      },
      required: ["spreadsheetUrl", "data"],
    },
  },
  {
    name: "append-to-sheet",
    description: "Ajoute une nouvelle ligne à la fin d'une feuille Google Sheets",
    inputSchema: {
      type: "object",
      properties: {
        spreadsheetUrl: {
          type: "string",
          format: "uri",
          description: "L'URL complète de la feuille Google Sheets",
        },
        data: {
          type: "array",
          items: { type: "string" },
          description: "Les données à ajouter en tant que nouvelle ligne",
        },
      },
      required: ["spreadsheetUrl", "data"],
    },
  },
  {
    name: "scrape-and-save",
    description: "Récupère le titre d'une page web et l'ajoute à une feuille Google Sheets",
    inputSchema: {
      type: "object",
      properties: {
        url: {
          type: "string",
          format: "uri",
          description: "L'URL de la page web à analyser",
        },
        spreadsheetUrl: {
          type: "string",
          format: "uri",
          description: "L'URL complète de la feuille Google Sheets",
        },
      },
      required: ["url", "spreadsheetUrl"],
    },
  },
  {
    name: "scrape-time",
    description: "Récupère l'heure exacte depuis quelleheureestil.fr",
    inputSchema: {
      type: "object",
      properties: {},
      required: [],
    },
  },
  {
    name: "save-time-to-sheet",
    description: "Récupère l'heure exacte et l'ajoute à une feuille Google Sheets",
    inputSchema: {
      type: "object",
      properties: {
        spreadsheetUrl: {
          type: "string",
          format: "uri",
          description: "L'URL complète de la feuille Google Sheets",
        },
      },
      required: ["spreadsheetUrl"],
    },
  },
];

// Gestionnaire pour lister les outils
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools };
});

// Gestionnaire pour exécuter les outils
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  // Outil pour récupérer le titre d'une page web
  if (request.params.name === "scrape-title") {
    try {
      const args = ScrapeTitleSchema.parse(request.params.arguments);
      const title = await playwrightServer.scrapePageTitle(args.url);
      
      return {
        content: [
          {
            type: "text",
            text: `Titre de la page: ${title}`,
          },
        ],
      } as CallToolResult;
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Erreur lors du scraping: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      } as CallToolResult;
    }
  }

  // Outil pour écrire dans une feuille Google Sheets
  if (request.params.name === "write-to-sheet") {
    try {
      const args = WriteToSheetSchema.parse(request.params.arguments);
      const result = await playwrightServer.writeToGoogleSheets(
        args.spreadsheetUrl,
        args.data,
        args.startCell
      );
      
      return {
        content: [
          {
            type: "text",
            text: result.success ? 
              `✅ ${result.message}` : 
              `❌ ${result.message}`,
          },
        ],
        isError: !result.success,
      } as CallToolResult;
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Erreur lors de l'écriture: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      } as CallToolResult;
    }
  }

  // Outil pour ajouter une ligne à une feuille Google Sheets
  if (request.params.name === "append-to-sheet") {
    try {
      const args = AppendToSheetSchema.parse(request.params.arguments);
      const result = await playwrightServer.appendToGoogleSheets(
        args.spreadsheetUrl,
        args.data
      );
      
      return {
        content: [
          {
            type: "text",
            text: result.success ? 
              `✅ ${result.message}` : 
              `❌ ${result.message}`,
          },
        ],
        isError: !result.success,
      } as CallToolResult;
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Erreur lors de l'ajout: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      } as CallToolResult;
    }
  }

  // Outil combiné pour scraper et sauvegarder
  if (request.params.name === "scrape-and-save") {
    try {
      const args = ScrapeAndSaveSchema.parse(request.params.arguments);
      
      // 1. Scraper le titre
      const title = await playwrightServer.scrapePageTitle(args.url);
      
      // 2. Préparer les données pour la feuille
      const timestamp = new Date().toLocaleString('fr-FR');
      const data = [timestamp, args.url, title];
      
      // 3. Ajouter dans la feuille
      const result = await playwrightServer.appendToGoogleSheets(
        args.spreadsheetUrl,
        data
      );
      
      if (result.success) {
        return {
          content: [
            {
              type: "text",
              text: `✅ Scraping et sauvegarde terminés!\n` +
                    `🌐 URL: ${args.url}\n` +
                    `📄 Titre: ${title}\n` +
                    `📊 ${result.message}\n` +
                    `⏰ Horodatage: ${timestamp}`,
            },
          ],
        } as CallToolResult;
      } else {
        return {
          content: [
            {
              type: "text",
              text: `⚠️ Scraping réussi mais erreur lors de la sauvegarde:\n` +
                    `📄 Titre récupéré: ${title}\n` +
                    `❌ Erreur: ${result.message}`,
            },
          ],
          isError: true,
        } as CallToolResult;
      }
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Erreur lors du scraping et sauvegarde: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      } as CallToolResult;
    }
  }

  // Outil pour récupérer l'heure actuelle
  if (request.params.name === "scrape-time") {
    try {
      const timeInfo = await playwrightServer.scrapeCurrentTime();
      
      return {
        content: [
          {
            type: "text",
            text: `🕐 Heure exacte récupérée:\n` +
                  `⏰ Heure: ${timeInfo.time}\n` +
                  `📅 Date: ${timeInfo.date}\n` +
                  `🌐 Source: ${timeInfo.source}`,
          },
        ],
      } as CallToolResult;
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Erreur lors de la récupération de l'heure: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      } as CallToolResult;
    }
  }

  // Outil pour récupérer l'heure et la sauvegarder dans Google Sheets
  if (request.params.name === "save-time-to-sheet") {
    try {
      const args = SaveTimeToSheetSchema.parse(request.params.arguments);
      
      // 1. Récupérer l'heure
      const timeInfo = await playwrightServer.scrapeCurrentTime();
      
      // 2. Préparer les données pour la feuille
      const data = [timeInfo.date, timeInfo.time, timeInfo.source];
      
      // 3. Ajouter dans la feuille
      const result = await playwrightServer.appendToGoogleSheets(
        args.spreadsheetUrl,
        data
      );
      
      if (result.success) {
        return {
          content: [
            {
              type: "text",
              text: `✅ Heure sauvegardée avec succès!\n` +
                    `⏰ Heure: ${timeInfo.time}\n` +
                    `📅 Date: ${timeInfo.date}\n` +
                    `🌐 Source: ${timeInfo.source}\n` +
                    `📊 ${result.message}`,
            },
          ],
        } as CallToolResult;
      } else {
        return {
          content: [
            {
              type: "text",
              text: `⚠️ Heure récupérée mais erreur lors de la sauvegarde:\n` +
                    `⏰ Heure récupérée: ${timeInfo.time}\n` +
                    `❌ Erreur: ${result.message}`,
            },
          ],
          isError: true,
        } as CallToolResult;
      }
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Erreur lors de la récupération et sauvegarde de l'heure: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      } as CallToolResult;
    }
  }

  throw new Error(`Outil inconnu: ${request.params.name}`);
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("🚀 Serveur MCP Web Scraper to Sheets (Playwright) démarré");
  
  // Configurer le nettoyage pour Playwright
  playwrightServer.setupCleanup();
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error("❌ Erreur fatale:", error);
    process.exit(1);
  });
}
