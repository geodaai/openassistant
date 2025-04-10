import fs from 'fs';
import path from 'path';

async function uiReadmeToDocsPlugin(context) {
  return {
    name: 'ui-readme-to-docs',
    async loadContent() {
      const readmePath = path.join(context.siteDir, '..', 'packages', 'ui', 'README.md');
      const docsPath = path.join(context.siteDir, 'docs', 'chatui', 'add-config-ui.md');

      try {
        // Read the content of README.md
        const readmeContent = fs.readFileSync(readmePath, 'utf8');

        // Add Docusaurus frontmatter
        const docusaurusContent = `---
sidebar_position: 1
---

# Get Started

${readmeContent}`;

        // Write to add-config-ui.md
        fs.writeFileSync(docsPath, docusaurusContent);
        console.log('Successfully generated add-config-ui.md from packages/ui/README.md');
      } catch (error) {
        console.error('Error generating add-config-ui.md:', error);
      }
    },
  };
}

export default uiReadmeToDocsPlugin; 