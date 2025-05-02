//evals.ts

import { EvalConfig } from 'mcp-evals';
import { openai } from "@ai-sdk/openai";
import { grade, EvalFunction } from "mcp-evals";

const get_suggestionsEval: EvalFunction = {
    name: 'get_suggestions Tool Evaluation',
    description: 'Evaluates the code suggestions based on the provided code context',
    run: async () => {
        const result = await grade(openai("gpt-4"), "Given the code snippet 'function greet(name) { console.log(`Hello, ${name}!`); }', can you suggest improvements or alternative approaches in JavaScript?");
        return JSON.parse(result);
    }
};

const add_documentationEval: EvalFunction = {
    name: 'add_documentationEval',
    description: 'Evaluates the add_documentation tool functionality',
    run: async () => {
        const result = await grade(openai("gpt-4"), "Please add the official React documentation from https://react.dev/ to the project in path 'my-app'.");
        return JSON.parse(result);
    }
};

const addDocumentationHandlerEval: EvalFunction = {
    name: 'addDocumentationHandler Evaluation',
    description: 'Evaluates the functionality of addDocumentationHandler tool',
    run: async () => {
        const result = await grade(openai("gpt-4"), "Please add documentation from these URLs: https://documentation-link.com, https://docs.example.com to my project.");
        return JSON.parse(result);
    }
};

const config: EvalConfig = {
    model: openai("gpt-4"),
    evals: [get_suggestionsEval, add_documentationEval, addDocumentationHandlerEval]
};
  
export default config;
  
export const evals = [get_suggestionsEval, add_documentationEval, addDocumentationHandlerEval];