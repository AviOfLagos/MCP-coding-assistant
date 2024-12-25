import fs from 'fs';
import path from 'path';
import glob from 'glob';

export async function detectTechnologies(projectPath: string): Promise<string[]> {
  console.log(`Detecting technologies used in the project at ${projectPath}...`);
  const techSet = new Set<string>();

  // Analyze package.json for dependencies (Node.js projects)
  const packageJsonPath = path.join(projectPath, 'package.json');
  if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
    const dependencies = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies,
    };
    for (const dep in dependencies) {
      techSet.add(dep);
    }
  }

  // Analyze files for common programming languages and frameworks
  const filePatterns = [
    '**/*.js',
    '**/*.ts',
    '**/*.py',
    '**/*.java',
    '**/*.rb',
    '**/*.php',
    '**/*.cs',
  ];
  const files = glob.sync(`{${filePatterns.join(',')}}`, {
    cwd: projectPath,
    absolute: true,
  });

  for (const file of files) {
    const ext = path.extname(file);
    switch (ext) {
      case '.js':
        techSet.add('JavaScript');
        break;
      case '.ts':
        techSet.add('TypeScript');
        break;
      case '.py':
        techSet.add('Python');
        break;
      case '.java':
        techSet.add('Java');
        break;
      case '.rb':
        techSet.add('Ruby');
        break;
      case '.php':
        techSet.add('PHP');
        break;
      case '.cs':
        techSet.add('C#');
        break;
    }

    // Additional analysis to detect frameworks can be added here
  }

  console.log('Detected technologies:', Array.from(techSet));
  return Array.from(techSet);
}
