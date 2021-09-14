import { Container } from "@material-ui/core";
import Head from 'next/head'
import styles from '../styles/layout.module.css'
import Link from 'next/link'

export const siteTitle = 'Cash Flow App'

interface layoutI {
  children: React.ReactNode
  home?: boolean
}

export default function Layout({children, home}:layoutI) {
  return (    
    <Container>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="description"
          content="Learn how to build a personal website using Next.js"
        />
        <meta
          property="og:image"
          content={`https://og-image.vercel.app/${encodeURI(
            siteTitle
          )}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.zeit.co%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`}
        />
        <meta name="og:title" content={siteTitle} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>         
      {children}       
      <div className={styles.backToHome}>
        <Link href="/">
          <a>← Back to home</a>
        </Link>
      </div>  
    </Container>    
  )
}