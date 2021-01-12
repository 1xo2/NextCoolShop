import Head from "next/head";
import Layout from "../components/Layout";
import styles from "../styles/Home.module.css";
import getCommerce from "../utils/commerce";

export default function Home(props) {
  const { products } = props;

  return (
    <Layout title="Home" commercePublicKey={props.commercePublicKey}>
      <main className={styles.main}>
        {products.map((prod) => (
          <div key={prod.id}>
            <img
              src={prod.media.source}
              alt={prod.name}
              className={styles.imgProd}
            ></img>

            <p>
              {" "}
              <b>{prod.name}</b>
            </p>
            <hr />
            <p>{prod.price.formatted_with_symbol}</p>
          </div>
        ))}
      </main>
    </Layout>
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
