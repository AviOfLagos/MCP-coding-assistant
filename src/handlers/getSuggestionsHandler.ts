import { CallToolRequest } from '@modelcontextprotocol/sdk/types.js';
import { loadDocumentation } from '../utils/loadDocumentation.js';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';

let vectorStore: MemoryVectorStore | null = null;

export async function getSuggestionsHandler(request: CallToolRequest) {
  const args = request.params.arguments || {};

  interface GetSuggestionsArgs {
    codeContext: {
      code: string;
      language?: string;
    };
  }

  function isGetSuggestionsArgs(obj: any): obj is GetSuggestionsArgs {
    return (
      obj &&
      typeof obj === 'object' &&
      obj.codeContext &&
      typeof obj.codeContext === 'object' &&
      typeof obj.codeContext.code === 'string'
    );
  }

  if (!isGetSuggestionsArgs(args)) {
    throw new Error('Invalid arguments for get_suggestions');
  }

  const { codeContext } = args;

  try {
    if (!vectorStore) {
      const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
      if (!OPENAI_API_KEY) {
        throw new Error('OPENAI_API_KEY environment variable is required');
      }
      vectorStore = await loadDocumentation(OPENAI_API_KEY);
    }

    const results = await vectorStore.similaritySearch(
      codeContext.code,
      5
    );

    const suggestions = results.map((result) => ({
      source: result.metadata.source as string,
      content: result.pageContent,
    }));

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({ suggestions }, null, 2),
        },
      ],
    };
  } catch (error: any) {
    console.error('Error generating suggestions:', error);
    throw new Error(`Error generating suggestions: ${error.message}`);
  }
}
