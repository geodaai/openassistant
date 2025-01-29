import { useState, type ReactNode } from 'react';
import clsx from 'clsx';
// import Link from '@docusaurus/Link';
// import Heading from '@theme/Heading';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';

import styles from './index.module.css';
import { AiAssistantConfig } from '@openassistant/ui';
import { Link } from '@nextui-org/react';

function HomepageHeader() {
  // const { siteConfig } = useDocusaurusContext();
  return (
    <header
      className={clsx(
        'hero hero--primary bg-white dark:bg-black mb-0 p-0 w-full items-center flex justify-center',
        styles.heroBanner
      )}
    >
      <div className="container m-4">
        {/*<Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
         <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/intro">
            Docusaurus Tutorial - 5min ⏱️
          </Link>
        </div> */}
        <div className="flex flex-col gap-2">
          <div className="text-gray-600 dark:text-gray-100 font-bold text-[46px]">
            Build AI-Powered Applications
          </div>
          <div className="text-gray-400 text-[32px]">
            with built-in{' '}
            <span className="text-purple-400 font-bold">interactive</span>{' '}
            features and powerful{' '}
            <span className="text-warning font-bold">plugins</span>
            <br />
            while keeping your data{' '}
            <span className="text-gray-400 font-bold">secure</span>
          </div>
          <div className="flex flex-row gap-2 justify-center">
            <div className="mt-8 rounded-lg  w-fit bg-gray-200 dark:bg-gray-800 p-4">
              <Link size="lg" href="/docs/intro" showAnchorIcon color="success">
                Get Started
              </Link>
            </div>
            <div className="mt-8 rounded-lg  w-fit bg-gray-200 dark:bg-gray-800 p-4">
              <Link
                size="lg"
                href="https://openassistant-playground.vercel.app"
                showAnchorIcon
                color="primary"
              >
                Playground
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

function HomeContent() {
  const [aiConfig, setAiConfig] = useState<AiAssistantConfig>({
    isReady: false,
    provider: 'openai',
    model: 'gpt-4o',
    apiKey: '',
    baseUrl: 'http://127.0.0.1:11434',
    temperature: 0.8,
    topP: 1.0,
  });

  const onAiConfigChange = (config: AiAssistantConfig) => {
    setAiConfig(config);
  };

  return (
    <div>
      <div className="relative">
        <HomepageHeader />
        <main className="items-center flex justify-center">
          <HomepageFeatures
            aiConfig={aiConfig}
            onAiConfigChange={onAiConfigChange}
          />
        </main>
      </div>
    </div>
  );
}

export default function Home(): ReactNode {
  const { siteConfig } = useDocusaurusContext();

  return (
    <Layout
      title={`${siteConfig.title}`}
      description="OpenAssistant: A simple, powerful, and extensible chatbot framework for building AI applications."
    >
      <HomeContent />
    </Layout>
  );
}
