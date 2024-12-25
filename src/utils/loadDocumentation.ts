import fs from 'fs';
import path from 'path';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { Document } from 'langchain/document';

export async function loadDocumentation(OPENAI_API_KEY: string): Promise<MemoryVectorStore> {
  console.log('Loading and vectorizing documentation...');
  const __dirname = path.dirname(new URL(import.meta.url).pathname);
  const docsPath = path.resolve(__dirname, '..', '..', 'docs');

  if (!fs.existsSync(docsPath)) {
    throw new Error(`Documentation directory not found at ${docsPath}`);
  }

  const docFiles = fs.readdirSync(docsPath);
  const documents: Document[] = [];

  for (const file of docFiles) {
    const filePath = path.join(docsPath, file);
    const content = fs.readFileSync(filePath, 'utf-8');

    documents.push(
      new Document({
        pageContent: content,
        metadata: {
          source: file,
          type: path.extname(file).toLowerCase(),
          lastUpdated: fs.statSync(filePath).mtime,
        },
      })
    );
  }

  const embeddings = new OpenAIEmbeddings({
    openAIApiKey: OPENAI_API_KEY,
  });

  const vectorStore = await MemoryVectorStore.fromDocuments(documents, embeddings);
  console.log(`Successfully loaded ${documents.length} documentation files.`);
  return vectorStore;
}
