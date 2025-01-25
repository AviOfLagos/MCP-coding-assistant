# Coding Assistant Server
[![smithery badge](https://smithery.ai/badge/coding-assistant-server)](https://smithery.ai/server/coding-assistant-server)

The Coding Assistant Server is an MCP (Model Context Protocol) server that enhances the capabilities of the Cline coding agent. It provides intelligent code suggestions, reduces hallucinations, and documents the knowledge base by leveraging your project's documentation and detecting the technologies used in your codebase.

## Features

* **Code Suggestions** : Offers context-aware code suggestions based on your code snippets and project documentation.
* **Documentation Integration** : Loads and vectorizes documentation files from the `docs` directory or from provided URLs.
* **Technology Detection** : Automatically detects programming languages, frameworks, and libraries used in your project.
* **Automatic Documentation Retrieval** : Finds and adds official documentation links for detected technologies to the knowledge base.
* **Project Path Automation** : Reads the project path from `project_path.txt` to seamlessly integrate with your current project in Cline.
* **Multiple Documentation Sources** : Accepts multiple documents and links to enrich the knowledge base.

## Installation

### Installing via Smithery

To install Coding Assistant Server for Cline automatically via [Smithery](https://smithery.ai/server/coding-assistant-server):

```bash
npx -y @smithery/cli install coding-assistant-server --client cline
```

### Prerequisites

* **Node.js** v14 or higher
* **npm** v6 or higher
* **OpenAI API Key**

### Steps

1. **Clone the Repository**
   ```bash
   git clone [repository-url]
   ```
2. **Navigate to the Project Directory**
   ```bash
   cd coding-assistant-server
   ```
3. **Install Dependencies**
   ```bash
   npm install
   ```
4. **Set Up Environment Variables**
   * Create a `.env` file in the root directory.
   * Add your OpenAI API key:
     ```javascript
     OPENAI_API_KEY=your_openai_api_key_here
     ```
5. **Build the Project**
   ```bash
   npm run build
   ```

## Usage

### Starting the Server

Start the Coding Assistant MCP server:

```bash
node build/index.js
```

### Integrating with Cline

1. **Update MCP Settings**
   * Edit your MCP settings configuration file (e.g., `cline_mcp_settings.json`) to include the coding assistant server:
     ```json
     {
       "mcpServers": {
         "coding-assistant": {
           "command": "node",
           "args": ["/path/to/coding-assistant-server/build/index.js"],
           "env": {
             "OPENAI_API_KEY": "your_openai_api_key_here"
           }
         }
       }
     }
     ```
2. **Set the Project Path**
   * Create or update the `project_path.txt` file in the `coding-assistant-server` directory with the absolute path to your current project:
     ```javascript
     /path/to/your/project
     ```
3. **Restart Cline**
   * Restart Cline or reload the MCP settings to connect the coding assistant server.

### Using the Tools

#### `get_suggestions` Tool

Provides code suggestions based on the provided code context.

 **Example Usage** :

<iframe></iframe>

Cline used a tool on the `coding-assistant` MCP server:

get_suggestions

Get code suggestions based on provided code context

Arguments

```json
{
    "codeContext": {
      "code": "function helloWorld() { console.log('Hello, world!'); }",
      "language": "JavaScript"
    }
  }
```

<iframe></iframe>

Response

```json
{
  "suggestions": [
    {
      "source": "example.txt",
      "content": "# Coding Assistant Documentation\n\nThis is a sample documentation file for the coding assistant server. You can add more documentation files here for the server to use.\n"
    }
  ]
}
```
