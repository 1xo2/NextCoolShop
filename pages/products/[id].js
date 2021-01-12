import { Alert } from "@material-ui/lab";
import Layout from "../components/Layout";
import getCommerce from "../utils/commerce";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Grid,
  Slide,
  Typography,
} from "@material-ui/core";
import Link from "next/link";

export default function Product(props) {
  const { products } = props;

  return (
    <Layout title="Product" commercePublicKey={props.commercePublicKey}>
      {products.length === 0 && <Alert>No Product has be found.</Alert>}

      <Grid container spacing={1}>
        {products.map((product) => (
          <Slide key={product.id} direction="up" in={true}>
            <Grid item md={3}>
              <Card>
                <Link href={`/products/${product.permalink}`}>
                  <CardActionArea>
                    <CardMedia
                      component="img"
                      alt={product.name}
                      image={product.media.source}
                    />
                    <CardContent>
                      <Typography
                        gutterBottom
                        variant="body2"
                        color="textPrimary"
                        component="p"
                      >
                        {product.name}
                      </Typography>
                      <Box>
                        <Typography
                          variant="body1"
                          color="textPrimary"
                          component="p"
                        >
                          {product.price.formatted_with_symbol}
                        </Typography>
                      </Box>
                    </CardContent>
                  </CardActionArea>
                </Link>
              </Card>
            </Grid>
          </Slide>
        ))}
      </Grid>
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