import Head from "next/head";
import styles from "../styles/Home.module.css";
import getCommerce from "../utils/commerce";

export default function Home(props) {
  const { products } = props;

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        {products.map((prod) => (
          <div key={prod.id}>
            <img src={prod.media.source} 
                 alt={prod.name}
                 className={styles.imgProd}></img>
            
            <p> <b>{prod.name}</b></p>
            <hr />
            <p>{prod.price.formatted_with_symbol}</p>            
          </div>
        ))}
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <img src="/vercel.svg" alt="Vercel Logo" className={styles.logo} />
        </a>
      </footer>
    </div>
  );
}

export async function getStaticProps() {
  const commerce = getCommerce();
  //console.log('commerce:', commerce) = 0

  // console.log('await commerce.products:', await commerce.products) = undefined
  // console.log('await commerce.products.list():', await commerce.products.list()) = 'list' of undefined
  const { data: products } = await commerce.products.list();

  return { props: { products } };
}
