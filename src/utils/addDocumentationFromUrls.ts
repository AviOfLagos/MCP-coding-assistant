import axios from 'axios';
import { Document } from 'langchain/document';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import fs from 'fs';
import path from 'path';

export async function addDocumentationFromUrls(
  urls: string[],
  vectorStore: MemoryVectorStore
): Promise<string[]> {
  // Setup log file path
  const logFilePath = path.resolve(process.cwd(), 'action_log.txt');

  // Limit the number of URLs to process
  const MAX_URLS = 5;
  const urlsToProcess = urls.slice(0, MAX_URLS);

  const successfulUrls: string[] = [];

  for (const url of urlsToProcess) {
    try {
      // Set a timeout for the HTTP request (e.g., 10 seconds)
      const response = await axios.get(url, { timeout: 10000 });
      const contentType = response.headers['content-type'];

      let textContent: string;

      // Handle different content types if necessary
      if (contentType && contentType.includes('text/')) {
        textContent = response.data as string;
      } else {
        throw new Error(`Unsupported content type at ${url}`);
      }

      // Create a new Document
      const document = new Document({
        pageContent: textContent,
        metadata: {
          source: url,
          type: 'url',
          lastUpdated: new Date(),
        },
      });

      // Add to vector store
      if (!vectorStore) {
        const errorMsg = 'Vector store is not initialized.';
        console.error(errorMsg);
        logAction(logFilePath, 'error', errorMsg);
        continue;
      }

      await vectorStore.addDocuments([document]);
      const successMsg = `Successfully added documentation from ${url}`;
      console.log(successMsg);
      logAction(logFilePath, 'success', successMsg);

      // Record successful URL
      successfulUrls.push(url);
    } catch (error: any) {
      const errorMsg = `Error adding documentation from ${url}: ${error.message}`;
      console.error(errorMsg);
      logAction(logFilePath, 'error', errorMsg, error.stack);
      // Continue to the next URL
    }
  }

  return successfulUrls;
}

// Helper function to log actions
function logAction(
  logFilePath: string,
  status: 'success' | 'error',
  message: string,
  errorStack?: string
) {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] [${status.toUpperCase()}] ${message}${
    errorStack ? `\nStack Trace:\n${errorStack}\n` : ''
  }\n`;
  fs.appendFileSync(logFilePath, logEntry);
}
