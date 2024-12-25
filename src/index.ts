#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  ListToolsRequestSchema,
  CallToolRequestSchema,
  McpError,
  ErrorCode,
} from '@modelcontextprotocol/sdk/types.js';
import dotenv from 'dotenv';
dotenv.config();
import fs from 'fs';
import path from 'path';

// Define __filename and __dirname in ES module scope
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
// Remove __dirname since we'll use alternative methods

import { getSuggestionsHandler } from './handlers/getSuggestionsHandler.js';
import { addDocumentationHandler } from './handlers/addDocumentationHandler.js';
import { getProjectPath } from './utils/getProjectPath.js';

class CodingAssistantServer {
  private server: Server;

  constructor() {
    this.server = new Server(
      {
        name: 'coding-assistant',
        version: '0.3.2',
      },
      {
        capabilities: {
          resources: {},
          tools: {},
        },
      }
    );

    // Write project path to project_path.txt on startup
    this.writeProjectPath();

    this.setupToolHandlers();

    // Error handling
    this.server.onerror = (error) => this.handleError(error);
    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  private writeProjectPath() {
    const projectPath = getProjectPath();
    // Use import.meta.url to determine the correct path
    const projectPathUrl = new URL('../project_path.txt', import.meta.url);
    const projectPathFile = fileURLToPath(projectPathUrl);
    if (projectPath) {
      fs.writeFileSync(projectPathFile, projectPath);
      console.log(`Updated project_path.txt with path: ${projectPath}`);
    } else {
      console.error('Project path is not available to write to project_path.txt');
    }
  }

  private handleError(error: any) {
    console.error('[MCP Error]', error);

    // Log error to action_log.txt
    const logFilePath = path.resolve(process.cwd(), 'action_log.txt');
    const timestamp = new Date().toISOString();
    const errorMsg = `[${timestamp}] [ERROR] ${error.message}\nStack Trace:\n${error.stack}\n\n`;
    fs.appendFileSync(logFilePath, errorMsg);
  }

  private setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'get_suggestions',
          description: 'Get code suggestions based on provided code context',
          inputSchema: {
            type: 'object',
            properties: {
              codeContext: {
                type: 'object',
                properties: {
                  code: { type: 'string', description: 'Code snippet' },
                  language: {
                    type: 'string',
                    description: 'Programming language',
                  },
                },
                required: ['code'],
              },
            },
            required: ['codeContext'],
          },
        },
        {
          name: 'add_documentation',
          description:
            'Add documentation from provided URLs or automatically based on detected technologies',
          inputSchema: {
            type: 'object',
            properties: {
              urls: {
                type: 'array',
                items: { type: 'string' },
                description: 'Array of documentation URLs to download',
              },
              projectPath: {
                type: 'string',
                description:
                  'Path to the project directory for technology detection. If not provided, the server will attempt to read the path from the PROJECT_PATH environment variable',
              },
            },
            required: [],
          },
        },
      ],
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name } = request.params;

      if (name === 'get_suggestions') {
        return getSuggestionsHandler(request);
      } else if (name === 'add_documentation') {
        return addDocumentationHandler(request);
      } else {
        throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
      }
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Coding Assistant MCP server running on stdio');
  }
}

const server = new CodingAssistantServer();
server.run().catch((error) => {
  console.error('Error starting the server:', error);
  // Log error to action_log.txt
  const logFilePath = path.resolve(process.cwd(), 'action_log.txt');
  const timestamp = new Date().toISOString();
  const errorMsg = `[${timestamp}] [ERROR] ${error.message}\nStack Trace:\n${error.stack}\n\n`;
  fs.appendFileSync(logFilePath, errorMsg);
});
