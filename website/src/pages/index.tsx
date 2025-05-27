import { type ReactNode } from 'react';
import clsx from 'clsx';
// import Link from '@docusaurus/Link';
// import Heading from '@theme/Heading';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';

import styles from './index.module.css';
import { Link } from '@heroui/react';

function HomepageHeader() {
  // const { siteConfig } = useDocusaurusContext();
  return (
    <header
      className={clsx(
        'mb-0 p-0 w-full items-center flex justify-center',
        styles.heroBanner
      )}
    >
      <div className="container m-4">
        <div className="flex flex-col gap-2">
          <div className="text-gray-600 dark:text-gray-100 font-bold text-[46px]">
            OpenAssistant
          </div>
          <div className="text-gray-400 text-[32px]">
            A javascript library for building AI assistant
            <br />
            with powerful <span className="text-warning font-bold">
              tools
            </span>{' '}
            and {' '}
            <span className="text-purple-400 font-bold">interactive</span> React chat
            component
          </div>
          <div className="flex flex-row gap-2 justify-center">
            <div className="mt-8 rounded-lg  w-fit bg-gray-400 dark:bg-gray-800 p-4">
              <Link size="lg" href="/docs/intro" color="success">
                Get Started
              </Link>
            </div>
            <div className="mt-8 rounded-lg  w-fit bg-gray-400 dark:bg-gray-800 p-4">
              <Link
                size="lg"
                href="https://openassistant-playground.vercel.app"
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
  return (
    <div>
      <div className="relative">
        <HomepageHeader />
        <main className="items-center flex justify-center">
          <HomepageFeatures />
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
