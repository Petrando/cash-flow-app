import Head from 'next/head'
import Link from 'next/link'
import {Container} from "@material-ui/core"
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Cash Flow Task</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
      <Container>
        <h1 className={styles.title}>
          Welcome to Cash Flow App
        </h1>

        <p className={styles.description}>
          Choose your menu below : 
        </p>

        <div className={styles.grid}>
          <Link href="/WalletList">
            <a className={styles.card}>
              <h3>Wallet &rarr;</h3>
              <p>All of your wallets.</p>
            </a>
          </Link>
          <Link href="/CategoryManagement">
            <a className={styles.card}>
              <h3>Category Menu &rarr;</h3>
              <p>Manage categories and sub categories.</p>
            </a>
          </Link>          
        </div>
      </Container>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <img src="/vercel.svg" alt="Vercel Logo" className={styles.logo} />
        </a>
      </footer>
    </div>
  )
}
