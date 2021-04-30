import Head from 'next/head'
import Layout from '../components/layout.tsx'
import utilStyles from '../styles/utils.module.css'
import Link from 'next/link'
import { GetStaticProps } from 'next'
import { CssBaseline, Container } from "@material-ui/core";

import Header from "../components/topNavigation/Header";

export default function Home() {
  return (       
    <Layout home>      
      <Head>
        <title>site Title</title>
      </Head>
      <section className={utilStyles.headingMd}>
        <p>Your Self Introduction</p>
        <p>
          (This is a sample website - you’ll be building a site like this in{' '}
          <a href="https://nextjs.org/learn">our Next.js tutorial</a>.)
        </p>
      </section>
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>Blog</h2>
        
      </section>
    </Layout>       
  )
}

/*
<ul className={utilStyles.list}>
          {allPostsData.map(({ id, date, title }) => (
            <li className={utilStyles.listItem} key={id}>
              <Link href={`/posts/${id}`}>
                <a>{title}</a>
              </Link>
              <br />
              <small className={utilStyles.lightText}>
                <Date dateString={date} />
              </small>
            </li>
          ))}
        </ul>
        */