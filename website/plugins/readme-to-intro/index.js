import fs from 'fs';
import path from 'path';

async function readmeToIntroPlugin(context) {
  return {
    name: 'readme-to-intro',
    async loadContent() {
      const readmePath = path.join(context.siteDir, '..', 'README.md');
      const introPath = path.join(context.siteDir, 'docs', 'intro.md');

      try {
        // Read the content of README.md
        const readmeContent = fs.readFileSync(readmePath, 'utf8');

        // Add Docusaurus frontmatter
        const docusaurusContent = `---
sidebar_position: 1
---

${readmeContent}`;

        // Write to intro.md
        fs.writeFileSync(introPath, docusaurusContent);
        console.log('Successfully generated intro.md from README.md');
      } catch (error) {
        console.error('Error generating intro.md:', error);
      }
    },
  };
}

export default readmeToIntroPlugin; 