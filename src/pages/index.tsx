import Head from 'next/head';
import LandingCard from './components/LandingCard';
import LoginModal from './components/LoginPanel';
//import { trpc } from '../utils/trpc';
import type { NextPage } from 'next';

const Home: NextPage = () => {
  return (
    <section>
      <Head>
        <title>GrowAGram | Show your Grow 🪴</title>
        <meta name="description" content="At GrowAGram, we provide a platform for cannabis enthusiasts to showcase their growing skills and share their knowledge." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>

        <LandingCard />



      </main>
    </section>
  );
};

export default Home;
