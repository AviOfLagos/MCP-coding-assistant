import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { Document } from 'langchain/document';

export async function searchDocumentation(
  query: string,
  vectorStore: MemoryVectorStore,
): Promise<Document[]> {
  // Perform a similarity search using the AI coder's response as the query
  const results = await vectorStore.similaritySearch(query, 5);
  return results;
}
