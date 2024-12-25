"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadDocumentation = loadDocumentation;
var fs_1 = require("fs");
var path_1 = require("path");
var openai_1 = require("langchain/embeddings/openai");
var memory_1 = require("langchain/vectorstores/memory");
var document_1 = require("langchain/document");
function loadDocumentation(OPENAI_API_KEY) {
    return __awaiter(this, void 0, void 0, function () {
        var __dirname, docsPath, docFiles, documents, _i, docFiles_1, file, filePath, content, embeddings, vectorStore;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('Loading and vectorizing documentation...');
                    __dirname = path_1.default.dirname(new URL(import.meta.url).pathname);
                    docsPath = path_1.default.resolve(__dirname, '..', '..', 'docs');
                    if (!fs_1.default.existsSync(docsPath)) {
                        throw new Error("Documentation directory not found at ".concat(docsPath));
                    }
                    docFiles = fs_1.default.readdirSync(docsPath);
                    documents = [];
                    for (_i = 0, docFiles_1 = docFiles; _i < docFiles_1.length; _i++) {
                        file = docFiles_1[_i];
                        filePath = path_1.default.join(docsPath, file);
                        content = fs_1.default.readFileSync(filePath, 'utf-8');
                        documents.push(new document_1.Document({
                            pageContent: content,
                            metadata: {
                                source: file,
                                type: path_1.default.extname(file).toLowerCase(),
                                lastUpdated: fs_1.default.statSync(filePath).mtime,
                            },
                        }));
                    }
                    embeddings = new openai_1.OpenAIEmbeddings({
                        openAIApiKey: OPENAI_API_KEY,
                    });
                    return [4 /*yield*/, memory_1.MemoryVectorStore.fromDocuments(documents, embeddings)];
                case 1:
                    vectorStore = _a.sent();
                    console.log("Successfully loaded ".concat(documents.length, " documentation files."));
                    return [2 /*return*/, vectorStore];
            }
        });
    });
}
