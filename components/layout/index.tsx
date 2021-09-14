import Head from 'next/head'
import TopNavigation from "./top-nav/TopNavigation";
import Footer from "./Footer";

export const siteTitle = 'Cash Flow App'

const Layout = ({ children }:{ children:React.ReactNode}) => {
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, height=device-height, initial-scale=1, viewport-fit=cover"
        />
      </Head>
      <TopNavigation />
      {children}
      <Footer />
    </>
  );
};

export default Layout;