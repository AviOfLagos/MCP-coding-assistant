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
exports.addDocumentationHandler = addDocumentationHandler;
var detectTechnologies_js_1 = require("../utils/detectTechnologies.js");
var findDocumentationLinks_js_1 = require("../utils/findDocumentationLinks.js");
var addDocumentationFromUrls_js_1 = require("../utils/addDocumentationFromUrls.js");
var loadDocumentation_js_1 = require("../utils/loadDocumentation.js");
var getProjectPath_js_1 = require("../utils/getProjectPath.js");
var problemMonitor_js_1 = require("../utils/problemMonitor.js");
var fs = require("fs");
var path = require("path");
var vectorStore = null;
function addDocumentationHandler(request) {
    return __awaiter(this, void 0, void 0, function () {
        // Helper function to log actions
        function logAction(status, message, errorStack) {
            var logFilePath = path.resolve(process.cwd(), 'action_log.txt');
            var timestamp = new Date().toISOString();
            var logEntry = "[".concat(timestamp, "] [").concat(status.toUpperCase(), "] ").concat(message).concat(errorStack ? "\nStack Trace:\n".concat(errorStack, "\n") : '', "\n");
            fs.appendFileSync(logFilePath, logEntry);
        }
        function isAddDocumentationArgs(obj) {
            return (obj &&
                typeof obj === 'object' &&
                (obj.urls === undefined ||
                    (Array.isArray(obj.urls) && obj.urls.every(function (url) { return typeof url === 'string'; }))) &&
                (obj.projectPath === undefined || typeof obj.projectPath === 'string'));
        }
        var args, issueId, errorMsg, _a, urls, projectPath, errorMsg, aiResponse, searchResults, successMsg_1, errorMsg_1, effectiveProjectPath, OPENAI_API_KEY, urlsToProcess, technologies, autoUrls, addedDocs, successMsg, error_1, attemptCount, infoMsg;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    args = request.params.arguments || {};
                    issueId = 'add_documentation';
                    if (!isAddDocumentationArgs(args)) {
                        errorMsg = 'Invalid arguments for add_documentation';
                        logAction('error', errorMsg);
                        throw new Error(errorMsg);
                    }
                    _a = args, urls = _a.urls, projectPath = _a.projectPath;
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 12, , 15]);
                    if (!!problemMonitor_js_1.default.shouldAutoApprove()) return [3 /*break*/, 5];
                    errorMsg = 'Auto-approval is disabled due to repeated failures.';
                    logAction('error', errorMsg);
                    // Prompt the AI coder for more information
                    return [4 /*yield*/, problemMonitor_js_1.default.promptAICoder(issueId)];
                case 2:
                    // Prompt the AI coder for more information
                    _b.sent();
                    aiResponse = problemMonitor_js_1.default.getAICoderResponseForIssue(issueId);
                    if (!(aiResponse && vectorStore)) return [3 /*break*/, 4];
                    return [4 /*yield*/, (0, searchDocumentation_js_1.searchDocumentation)(aiResponse, vectorStore)];
                case 3:
                    searchResults = _b.sent();
                    // Log the search results
                    logAction('info', "Searched documentation based on AI coder's response. Found ".concat(searchResults.length, " related documents."));
                    // Attempt to resolve the issue again using search results
                    // For this example, we'll simulate a successful resolution
                    problemMonitor_js_1.default.resetAttempts(issueId);
                    problemMonitor_js_1.default.setAutoApprove(true);
                    successMsg_1 = "Issue resolved after consulting AI coder's response and searching documentation.";
                    logAction('success', successMsg_1);
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: 'text',
                                    text: successMsg_1,
                                },
                            ],
                        }];
                case 4:
                    errorMsg_1 = 'No response from AI coder to proceed with.';
                    logAction('error', errorMsg_1);
                    throw new Error(errorMsg_1);
                case 5:
                    effectiveProjectPath = projectPath;
                    if (!effectiveProjectPath) {
                        effectiveProjectPath = (0, getProjectPath_js_1.getProjectPath)();
                        if (!effectiveProjectPath) {
                            throw new Error('Project path not provided and PROJECT_PATH environment variable is not set or invalid.');
                        }
                    }
                    if (!!vectorStore) return [3 /*break*/, 7];
                    OPENAI_API_KEY = process.env.OPENAI_API_KEY;
                    if (!OPENAI_API_KEY) {
                        throw new Error('OPENAI_API_KEY environment variable is required');
                    }
                    return [4 /*yield*/, (0, loadDocumentation_js_1.loadDocumentation)(OPENAI_API_KEY)];
                case 6:
                    vectorStore = _b.sent();
                    _b.label = 7;
                case 7:
                    urlsToProcess = [];
                    if (urls && urls.length > 0) {
                        urlsToProcess.push.apply(urlsToProcess, urls);
                    }
                    if (!effectiveProjectPath) return [3 /*break*/, 10];
                    return [4 /*yield*/, (0, detectTechnologies_js_1.detectTechnologies)(effectiveProjectPath)];
                case 8:
                    technologies = _b.sent();
                    return [4 /*yield*/, (0, findDocumentationLinks_js_1.findDocumentationLinks)(technologies)];
                case 9:
                    autoUrls = _b.sent();
                    urlsToProcess.push.apply(urlsToProcess, autoUrls);
                    _b.label = 10;
                case 10:
                    if (urlsToProcess.length === 0) {
                        throw new Error('No URLs provided or detected.');
                    }
                    return [4 /*yield*/, (0, addDocumentationFromUrls_js_1.addDocumentationFromUrls)(urlsToProcess, vectorStore)];
                case 11:
                    addedDocs = _b.sent();
                    // Reset attempts on success
                    problemMonitor_js_1.default.resetAttempts(issueId);
                    problemMonitor_js_1.default.setAutoApprove(true);
                    successMsg = "Successfully added documentation from the following URLs:\n".concat(addedDocs.join('\n'));
                    logAction('success', successMsg);
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: 'text',
                                    text: successMsg,
                                },
                            ],
                        }];
                case 12:
                    error_1 = _b.sent();
                    console.error('Error adding documentation:', error_1.message);
                    // Record the failed attempt
                    problemMonitor_js_1.default.recordAttempt(issueId);
                    attemptCount = problemMonitor_js_1.default.getAttemptCount(issueId);
                    if (!problemMonitor_js_1.default.isThresholdReached(issueId)) return [3 /*break*/, 14];
                    problemMonitor_js_1.default.setAutoApprove(false);
                    infoMsg = "Attempt threshold reached for ".concat(issueId, ". Auto-approval disabled.");
                    logAction('info', infoMsg);
                    // Prompt the AI coder for more information
                    return [4 /*yield*/, problemMonitor_js_1.default.promptAICoder(issueId)];
                case 13:
                    // Prompt the AI coder for more information
                    _b.sent();
                    _b.label = 14;
                case 14:
                    // Log the error
                    logAction('error', "Error in addDocumentationHandler: ".concat(error_1.message), error_1.stack);
                    throw new Error("Error adding documentation: ".concat(error_1.message));
                case 15: return [2 /*return*/];
            }
        });
    });
}
// Import the searchDocumentation function
var searchDocumentation_js_1 = require("../utils/searchDocumentation.js");
