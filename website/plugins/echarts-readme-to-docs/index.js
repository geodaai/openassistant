import fs from 'fs';
import path from 'path';

async function echartsReadmeToDocsPlugin(context) {
  return {
    name: 'echarts-readme-to-docs',
    async loadContent() {
      const readmePath = path.join(context.siteDir, '..', 'packages', 'echarts', 'README.md');
      const docsPath = path.join(context.siteDir, 'docs', 'tools', 'echarts-plugin.md');

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
sidebar_position: 2
sidebar_label: eCharts Tools
---

${readmeContent}`;

        // Write to echarts-plugin.md
        fs.writeFileSync(docsPath, docusaurusContent);
        console.log('Successfully generated echarts-plugin.md from README.md');
      } catch (error) {
        console.error('Error generating echarts-plugin.md:', error);
      }
    },
  };
}

export default echartsReadmeToDocsPlugin; 