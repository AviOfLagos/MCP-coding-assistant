"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProjectPath = getProjectPath;
var fs_1 = require("fs");
function getProjectPath() {
    var projectPath = process.env.PROJECT_PATH;
    if (projectPath && fs_1.default.existsSync(projectPath)) {
        console.log("Using project path from environment variable: ".concat(projectPath));
        return projectPath;
    }
    else {
        console.error('PROJECT_PATH environment variable is not set or the path does not exist.');
        return undefined;
    }
}
