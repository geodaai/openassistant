import fs from 'fs';
import path from 'path';

async function geodaReadmeToDocsPlugin(context) {
  return {
    name: 'geoda-readme-to-docs',
    async loadContent() {
      const readmePath = path.join(context.siteDir, '..', 'packages', 'geoda', 'README.md');
      const docsPath = path.join(context.siteDir, 'docs', 'tools', 'geoda-plugin.md');

      try {
        // Create the docs/tools directory if it doesn't exist
        const docsDir = path.dirname(docsPath);
        if (!fs.existsSync(docsDir)) {
          fs.mkdirSync(docsDir, { recursive: true });
        }

        // Read the content of README.md
        const readmeContent = fs.readFileSync(readmePath, 'utf8');

        // Add Docusaurus frontmatter
        const docusaurusContent = `---
sidebar_position: 3
sidebar_label: Geoda Tools
---

${readmeContent}`;

        // Write to geoda-plugin.md
        fs.writeFileSync(docsPath, docusaurusContent);
        console.log('Successfully generated geoda-plugin.md from README.md');
      } catch (error) {
        console.error('Error generating geoda-plugin.md:', error);
      }
    },
  };
}

export default geodaReadmeToDocsPlugin; 