import React from "react";
import clsx from "clsx";

import Link from "@docusaurus/Link";
import Head from "@docusaurus/Head";
import Translate from "@docusaurus/Translate";

import Layout from "@theme/Layout";

import HomepageFeatures from "@site/src/components/HomepageFeatures";
import styles from "./index.module.css";

const HomepageHeader = () => {
  return (
    <header className={clsx("hero hero--primary", styles.heroBanner)}>
      <div className="container">
        <h1 className="hero__title">
          <Translate id="hero.title">
            lpadder: the future of launchpadding.
          </Translate>
        </h1>
        <p className="hero__subtitle">
          <Translate id="hero.subtitle">
            With lpadder you'll be able to create covers more easily.
          </Translate>
        </p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/intro"
          >
            <Translate id="hero.button">
              Learn lpadder
            </Translate>
          </Link>
        </div>
      </div>
    </header>
  );
};

const Home = () => {
  return (
    <Layout
      title="lpadder documentation"
      description="Welcome to lpadder's documentation !">
      <Head>
        <title>lpadder: build your next cover</title>
      </Head>
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
};

export default Home;
