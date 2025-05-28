import { chromium, Browser, BrowserContext, Page } from "playwright";

export class PlaywrightServer {
  private browser: Browser | null = null;
  private context: BrowserContext | null = null;

  async ensureBrowser(): Promise<void> {
    if (!this.browser) {
      this.browser = await chromium.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      this.context = await this.browser.newContext({
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      });
    }
  }

  async scrapePageTitle(url: string): Promise<string> {
    try {
      await this.ensureBrowser();
      
      if (!this.context) {
        throw new Error("Impossible d'initialiser le contexte du navigateur");
      }

      const page = await this.context.newPage();
      
      try {
        // Naviguer vers la page avec un timeout de 30 secondes
        await page.goto(url, { 
          waitUntil: 'domcontentloaded',
          timeout: 30000 
        });

        // Attendre que le titre soit disponible
        await page.waitForFunction(() => document.title !== '', { timeout: 5000 });

        // Récupérer le titre de la page
        const title = await page.title();
        
        if (!title || title.trim() === '') {
          throw new Error("Aucun titre trouvé sur cette page");
        }

        return title.trim();
      } finally {
        await page.close();
      }
    } catch (error) {
      throw new Error(
        `Erreur lors du scraping de ${url}: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  async scrapePageContent(url: string, selector?: string): Promise<string> {
    try {
      await this.ensureBrowser();
      
      if (!this.context) {
        throw new Error("Impossible d'initialiser le contexte du navigateur");
      }

      const page = await this.context.newPage();
      
      try {
        await page.goto(url, { 
          waitUntil: 'domcontentloaded',
          timeout: 30000 
        });

        if (selector) {
          // Attendre que l'élément soit présent
          await page.waitForSelector(selector, { timeout: 10000 });
          const element = await page.$(selector);
          if (!element) {
            throw new Error(`Élément avec le sélecteur "${selector}" non trouvé`);
          }
          return await element.textContent() || '';
        } else {
          // Récupérer tout le texte de la page
          return await page.textContent('body') || '';
        }
      } finally {
        await page.close();
      }
    } catch (error) {
      throw new Error(
        `Erreur lors du scraping de ${url}: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  async scrapeMetadata(url: string): Promise<{
    title: string;
    description?: string;
    keywords?: string;
    ogTitle?: string;
    ogDescription?: string;
  }> {
    try {
      await this.ensureBrowser();
      
      if (!this.context) {
        throw new Error("Impossible d'initialiser le contexte du navigateur");
      }

      const page = await this.context.newPage();
      
      try {
        await page.goto(url, { 
          waitUntil: 'domcontentloaded',
          timeout: 30000 
        });        const metadata = await page.evaluate(() => {
          const title = document.title;
          const description = document.querySelector('meta[name="description"]')?.getAttribute('content');
          const keywords = document.querySelector('meta[name="keywords"]')?.getAttribute('content');
          const ogTitle = document.querySelector('meta[property="og:title"]')?.getAttribute('content');
          const ogDescription = document.querySelector('meta[property="og:description"]')?.getAttribute('content');

          return {
            title,
            description: description || undefined,
            keywords: keywords || undefined,
            ogTitle: ogTitle || undefined,
            ogDescription: ogDescription || undefined,
          };
        });

        return metadata;
      } finally {
        await page.close();
      }
    } catch (error) {
      throw new Error(
        `Erreur lors de la récupération des métadonnées de ${url}: ${error instanceof Error ? error.message : String(error)}`
      );
    }  }

  /**
   * Écrit des données dans une feuille Google Sheets via l'interface web
   */
  async writeToGoogleSheets(
    spreadsheetUrl: string, 
    data: string[][], 
    startCell: string = 'A1'
  ): Promise<{ success: boolean; message: string }> {
    try {
      await this.ensureBrowser();
      
      if (!this.context) {
        throw new Error("Impossible d'initialiser le contexte du navigateur");
      }

      const page = await this.context.newPage();
      
      try {
        // Naviguer vers la feuille Google Sheets
        await page.goto(spreadsheetUrl, { 
          waitUntil: 'networkidle',
          timeout: 30000 
        });

        // Attendre que la feuille soit chargée
        await page.waitForSelector('[data-sheet-viewport]', { timeout: 15000 });

        // Cliquer sur la cellule de départ
        const cellSelector = `[aria-label*="${startCell}"]`;
        await page.waitForSelector(cellSelector, { timeout: 10000 });
        await page.click(cellSelector);

        // Entrer les données ligne par ligne
        for (let rowIndex = 0; rowIndex < data.length; rowIndex++) {
          const row = data[rowIndex];
          
          for (let colIndex = 0; colIndex < row.length; colIndex++) {
            const cellValue = row[colIndex];
            
            // Si ce n'est pas la première cellule, se déplacer à la cellule suivante
            if (rowIndex > 0 || colIndex > 0) {
              if (colIndex === 0 && rowIndex > 0) {
                // Nouvelle ligne : descendre et revenir à la première colonne
                await page.keyboard.press('Enter');
                for (let i = 0; i < row.length - 1; i++) {
                  await page.keyboard.press('ArrowLeft');
                }
              } else {
                // Même ligne : aller à la cellule suivante
                await page.keyboard.press('Tab');
              }
            }

            // Entrer la valeur
            await page.keyboard.type(cellValue);
          }
        }

        // Finaliser avec Enter
        await page.keyboard.press('Enter');

        return {
          success: true,
          message: `${data.length} ligne(s) et ${data[0]?.length || 0} colonne(s) écrites avec succès`
        };

      } finally {
        await page.close();
      }
    } catch (error) {
      return {
        success: false,
        message: `Erreur lors de l'écriture dans Google Sheets: ${error instanceof Error ? error.message : String(error)}`
      };
    }
  }

  /**
   * Ajoute une nouvelle ligne à la fin de la feuille Google Sheets
   */
  async appendToGoogleSheets(
    spreadsheetUrl: string, 
    data: string[]
  ): Promise<{ success: boolean; message: string }> {
    try {
      await this.ensureBrowser();
      
      if (!this.context) {
        throw new Error("Impossible d'initialiser le contexte du navigateur");
      }

      const page = await this.context.newPage();
      
      try {
        // Naviguer vers la feuille Google Sheets
        await page.goto(spreadsheetUrl, { 
          waitUntil: 'networkidle',
          timeout: 30000 
        });

        // Attendre que la feuille soit chargée
        await page.waitForSelector('[data-sheet-viewport]', { timeout: 15000 });

        // Utiliser Ctrl+End pour aller à la dernière cellule utilisée
        await page.keyboard.press('Control+End');
        
        // Descendre d'une ligne pour la nouvelle entrée
        await page.keyboard.press('ArrowDown');
        
        // Aller au début de la ligne (colonne A)
        await page.keyboard.press('Home');

        // Entrer les données
        for (let i = 0; i < data.length; i++) {
          if (i > 0) {
            await page.keyboard.press('Tab');
          }
          await page.keyboard.type(data[i]);
        }

        // Finaliser avec Enter
        await page.keyboard.press('Enter');

        return {
          success: true,
          message: `Nouvelle ligne ajoutée avec ${data.length} colonne(s)`
        };

      } finally {
        await page.close();
      }
    } catch (error) {
      return {
        success: false,
        message: `Erreur lors de l'ajout dans Google Sheets: ${error instanceof Error ? error.message : String(error)}`
      };
    }
  }  /**
   * Récupère l'heure exacte depuis horlogeparlante.com ou via l'heure système
   */
  async scrapeCurrentTime(): Promise<{
    time: string;
    date: string;
    source: string;
  }> {
    try {
      await this.ensureBrowser();
      
      if (!this.context) {
        throw new Error("Impossible d'initialiser le contexte du navigateur");
      }

      const page = await this.context.newPage();
        try {
        // Essayer d'abord horlogeparlante.com
        await page.goto('https://www.horlogeparlante.com/', { 
          waitUntil: 'domcontentloaded',
          timeout: 15000 
        });

        // Attendre que le contenu se charge
        await page.waitForTimeout(2000);

        // Chercher l'heure dans le texte de la page
        const bodyText = await page.textContent('body') || '';
        
        // Horlogeparlante.com affiche l'heure au format HH:MM:SS:MS (ex: 17:53:23:81)
        // On cherche un pattern d'heure précis
        const timePattern = /(\d{1,2}:\d{2}:\d{2})(?::\d{2})?/;
        const timeMatch = bodyText.match(timePattern);
        
        if (timeMatch) {
          const currentDate = new Date().toLocaleDateString('fr-FR');
          return {
            time: timeMatch[1], // On prend seulement HH:MM:SS sans les millisecondes
            date: currentDate,
            source: 'horlogeparlante.com'
          };
        }

      } catch (webError) {
        // Si le web scraping échoue, utiliser l'heure système locale
        console.error('Web scraping failed, using system time:', webError);
      } finally {
        await page.close();
      }

      // Plan C: Utiliser l'heure système
      const now = new Date();
      const currentTime = now.toLocaleTimeString('fr-FR', { 
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
      const currentDate = now.toLocaleDateString('fr-FR');

      return {
        time: currentTime,
        date: currentDate,
        source: 'Heure système locale'
      };

    } catch (error) {
      throw new Error(
        `Erreur lors de la récupération de l'heure: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  async close(): Promise<void> {
    if (this.context) {
      await this.context.close();
      this.context = null;
    }
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }

  // Cleanup lors de l'arrêt du processus
  setupCleanup(): void {
    const cleanup = async () => {
      await this.close();
    };

    process.on('exit', cleanup);
    process.on('SIGINT', cleanup);
    process.on('SIGTERM', cleanup);
    process.on('uncaughtException', cleanup);
  }
}
