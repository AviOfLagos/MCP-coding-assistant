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
exports.addDocumentationFromUrls = addDocumentationFromUrls;
var axios_1 = require("axios");
var document_1 = require("langchain/document");
var fs_1 = require("fs");
var path_1 = require("path");
function addDocumentationFromUrls(urls, vectorStore) {
    return __awaiter(this, void 0, void 0, function () {
        var logFilePath, MAX_URLS, urlsToProcess, successfulUrls, _i, urlsToProcess_1, url, response, contentType, textContent, document_2, errorMsg, successMsg, error_1, errorMsg;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    logFilePath = path_1.default.resolve(process.cwd(), 'action_log.txt');
                    MAX_URLS = 5;
                    urlsToProcess = urls.slice(0, MAX_URLS);
                    successfulUrls = [];
                    _i = 0, urlsToProcess_1 = urlsToProcess;
                    _a.label = 1;
                case 1:
                    if (!(_i < urlsToProcess_1.length)) return [3 /*break*/, 7];
                    url = urlsToProcess_1[_i];
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 5, , 6]);
                    return [4 /*yield*/, axios_1.default.get(url, { timeout: 10000 })];
                case 3:
                    response = _a.sent();
                    contentType = response.headers['content-type'];
                    textContent = void 0;
                    // Handle different content types if necessary
                    if (contentType && contentType.includes('text/')) {
                        textContent = response.data;
                    }
                    else {
                        throw new Error("Unsupported content type at ".concat(url));
                    }
                    document_2 = new document_1.Document({
                        pageContent: textContent,
                        metadata: {
                            source: url,
                            type: 'url',
                            lastUpdated: new Date(),
                        },
                    });
                    // Add to vector store
                    if (!vectorStore) {
                        errorMsg = 'Vector store is not initialized.';
                        console.error(errorMsg);
                        logAction(logFilePath, 'error', errorMsg);
                        return [3 /*break*/, 6];
                    }
                    return [4 /*yield*/, vectorStore.addDocuments([document_2])];
                case 4:
                    _a.sent();
                    successMsg = "Successfully added documentation from ".concat(url);
                    console.log(successMsg);
                    logAction(logFilePath, 'success', successMsg);
                    // Record successful URL
                    successfulUrls.push(url);
                    return [3 /*break*/, 6];
                case 5:
                    error_1 = _a.sent();
                    errorMsg = "Error adding documentation from ".concat(url, ": ").concat(error_1.message);
                    console.error(errorMsg);
                    logAction(logFilePath, 'error', errorMsg, error_1.stack);
                    return [3 /*break*/, 6];
                case 6:
                    _i++;
                    return [3 /*break*/, 1];
                case 7: return [2 /*return*/, successfulUrls];
            }
        });
    });
}
// Helper function to log actions
function logAction(logFilePath, status, message, errorStack) {
    var timestamp = new Date().toISOString();
    var logEntry = "[".concat(timestamp, "] [").concat(status.toUpperCase(), "] ").concat(message).concat(errorStack ? "\nStack Trace:\n".concat(errorStack, "\n") : '', "\n");
    fs_1.default.appendFileSync(logFilePath, logEntry);
}
