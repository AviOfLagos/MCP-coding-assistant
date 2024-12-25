import fs from 'fs';

export function getProjectPath(): string | undefined {
  const projectPath = process.env.PROJECT_PATH;
  if (projectPath && fs.existsSync(projectPath)) {
    console.log(`Using project path from environment variable: ${projectPath}`);
    return projectPath;
  } else {
    console.error('PROJECT_PATH environment variable is not set or the path does not exist.');
    return undefined;
  }
}
