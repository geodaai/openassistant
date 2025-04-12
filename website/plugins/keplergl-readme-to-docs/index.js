import fs from 'fs';
import path from 'path';

async function keplerglReadmeToDocsPlugin(context) {
  return {
    name: 'keplergl-readme-to-docs',
    async loadContent() {
      const readmePath = path.join(context.siteDir, '..', 'packages', 'keplergl', 'README.md');
      const docsPath = path.join(context.siteDir, 'docs', 'tools', 'keplergl-plugin.md');

      try {
        // Create the docs/keplergl directory if it doesn't exist
        const docsDir = path.dirname(docsPath);
        if (!fs.existsSync(docsDir)) {
          fs.mkdirSync(docsDir, { recursive: true });
        }

        // Read the content of README.md
        const readmeContent = fs.readFileSync(readmePath, 'utf8');

        // Add Docusaurus frontmatter
        const docusaurusContent = `---
sidebar_position: 1
sidebar_label: Introduction
---

${readmeContent}`;

        // Write to intro.md
        fs.writeFileSync(docsPath, docusaurusContent);
        console.log('Successfully generated keplergl intro.md from README.md');
      } catch (error) {
        console.error('Error generating keplergl intro.md:', error);
      }
    },
  };
}

export default keplerglReadmeToDocsPlugin; 