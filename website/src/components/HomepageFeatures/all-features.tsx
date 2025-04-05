import { Card, CardBody, CardFooter, CardHeader } from '@nextui-org/react';
import { ReactNode } from 'react';

type FeatureItem = {
  title: string;
  icon: string;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Multiple AI Provider Support',
    icon: '🤖',
    description: (
      <>
        <li>OpenAI (GPT models)</li>
        <li>Google Gemini</li>
        <li>Anthropic (Claude models)</li>
        <li>xAI (Groq models)</li>
        <li>DeepSeek</li>
        <li>Ollama (local AI models)</li>
        <li>...</li>
      </>
    ),
  },
  {
    title: 'Built-in Advanced Capabilities',
    icon: '🎯',
    description: (
      <>
        <li>Screenshot-to-ask functionality</li>
        <li>Voice interactions</li>
        <li>Comprehensive function calling support</li>
      </>
    ),
  },
  {
    title: 'AI Assistant Plugins',
    icon: '🌟',
    description: (
      <>
        <li>Data analysis with DuckDB</li>
        <li>Data visualization with ECharts</li>
        <li>Spatial data analysis using GeoDa WASM</li>
      </>
    ),
  },
  {
    title: 'Customizable UI Components',
    icon: '🎨',
    description: (
      <>
        <li>Pre-built chat and LLM configuration interfaces</li>
        <li>Screenshot wrapper</li>
        <li>Theme support</li>
      </>
    ),
  },
  {
    title: 'Easy Integration',
    icon: '📦',
    description: (
      <>
        <li>Simple integration with CLI tools</li>
        <li>TypeScript support</li>
        <li>Tailwind CSS integration</li>
      </>
    ),
  },
];

function Feature({ title, icon, description }: FeatureItem) {
  return (
    <Card className="overflow-none relative w-[300px] sm:w-[380px] border-small border-foreground/10 bg-right-bottom">
      <CardHeader>
        <div className="flex items-center gap-3">
          <p className="text-4xl">{icon}</p>
          <p className="text-large font-medium">{title}</p>
        </div>
      </CardHeader>
      <CardBody className="px-3">
        <div className="flex flex-col gap-2 px-2">
          <p className="text-small">{description}</p>
        </div>
      </CardBody>
      <CardFooter></CardFooter>
    </Card>
  );
}

export function AllFeatures() {
  return (
    <div className="w-10/12 mt-10 flex flex-col p-4 gap-4">
      <div className=" text-gray-600 font-bold leading-[1.2] tracking-tighter sm:text-[36px]">
        <div className="bg-hero-section-title bg-clip-text">All Features</div>
      </div>
      <div className="container max-w-[1400px] md:mr-[460px]">
        <div className="flex flex-wrap justify-start gap-4">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </div>
  );
}
