import axios from 'axios';

export async function findDocumentationLinks(technologies: string[]): Promise<string[]> {
  console.log('Finding documentation links for detected technologies...');
  // Hardcoded mapping of technologies to documentation URLs
  const docLinks: Record<string, string> = {
    react: 'https://reactjs.org/docs/getting-started.html',
    vue: 'https://vuejs.org/v2/guide/',
    angular: 'https://angular.io/docs',
    express: 'https://expressjs.com/en/guide/routing.html',
    node: 'https://nodejs.org/en/docs/',
    typescript: 'https://www.typescriptlang.org/docs/',
    python: 'https://docs.python.org/3/',
    java: 'https://docs.oracle.com/en/java/javase/11/docs/api/index.html',
    php: 'https://www.php.net/docs.php',
    ruby: 'https://www.ruby-lang.org/en/documentation/',
    'c#': 'https://docs.microsoft.com/en-us/dotnet/csharp/',
  };

  const documentationLinks: string[] = [];

  for (const tech of technologies) {
    const techKey = tech.toLowerCase();
    if (docLinks[techKey]) {
      documentationLinks.push(docLinks[techKey]);
    } else {
      // Optionally, implement a search to find documentation
      // For now, we'll skip technologies without a predefined link
      console.warn(`No documentation link found for ${tech}`);
    }
  }

  console.log('Found documentation links:', documentationLinks);
  return documentationLinks;
}
