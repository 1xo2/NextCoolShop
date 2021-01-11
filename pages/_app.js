import "../styles/globals.css";
import { Store } from "../components/Store";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import Router from 'next/router'

Router.events.on('routeChangeStart',()=>NProgress.start());
Router.events.on('routeChangeComplete',()=>NProgress.done());
Router.events.on('routeChangeError',()=>NProgress.done());


function MyApp({ Component, pageProps }) {
  return (
    <Store.Provider>
      <Component {...pageProps} />
    </Store.Provider>
  );
}

export default MyApp;

MyApp.getInitialProps = async () => {
  return {
    pageProps: {
      commercePublicKey: process.env.COMMERCE_PUBLIC_KEY,
    },
  };
};
