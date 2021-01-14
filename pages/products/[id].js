import { Alert } from "@material-ui/lab";
import {
  Box,
  Button,
  Card,
  Grid,
  List,
  ListItem,
  MenuItem,
  Select,
  Slide,
  Typography,
} from "@material-ui/core";
//import Link from "next/link";
import React, { useContext, useState } from "react";
import { useStyles } from "../../utils/Styles";
import Layout from "../../components/Layout";
import getCommerce from "../../utils/commerce";
import { Store } from "../../components/Store";
import Router from "next/router";
import {
//  CART_RETRIEVE_REQUEST,
  CART_RETRIEVE_SUCCESS,
//  ORDER_SET,
} from "../../utils/Constants";





export default function Product(props) {
  const { product } = props;
  const [quantity, setQuantity] = useState(1);
  const classes = useStyles();

  const { state, dispatch } = useContext(Store);
  const { cart } = state;

  const addToCartHandler = async () => {
    const commerce = getCommerce(props.commercePublicKey);

    const lineItem = cart.data.line_items.find(
      (x) => x.product_id === product.id
    );

    let cartData;

    if (lineItem) {
      cartData = await commerce.cart.update(lineItem.id, {
        quantity: quantity,
      });
    } else {
      cartData = await commerce.cart.add(product.id, quantity);
    }
    dispatch({ type: CART_RETRIEVE_SUCCESS, payload: cartData.cart });
    Router.push("/cart");
  };

  return (
    <Layout title={product.name} commercePublicKey={props.commercePublicKey}>
      <Slide direction="up" in={true}>
        <Grid container spacing={1}>
          <Grid item md={6}>
            <img
              src={product.media.source}
              alt={product.name}
              className={classes.imgProd}
            ></img>
          </Grid>
          <Grid item md={3} xs={12}>
            <List>
              <ListItem>
                <Typography
                  gutterBottom
                  variant="h6"
                  color="textPrimary"
                  component="h1"
                >
                  {product.name}
                </Typography>
              </ListItem>
              <ListItem>
                <Box
                  dangerouslySetInnerHTML={{ __html: product.description }}
                ></Box>
              </ListItem>
            </List>
          </Grid>

          <Grid item md={3} xs={12}>
            <Card>
              <List>
                <ListItem>
                  <Grid container>
                    <Grid item xs={6}>
                      Price
                    </Grid>
                    <Grid item xs={6}>
                      {product.price.formatted_with_symbol}
                    </Grid>
                  </Grid>
                </ListItem>

                <ListItem>
                  <Grid alignItems="center" container>
                    <Grid item xs={6}>
                      Status
                    </Grid>
                    <Grid item xs={6}>
                      {product.quantity > 0 ? (
                        <Alert icon={false} security="success">
                          In Stock
                        </Alert>
                      ) : (
                        <Alert icon={false} security="error">
                          Unavailable
                        </Alert>
                      )}
                    </Grid>
                  </Grid>
                </ListItem>

                {product.quantity > 0 && (
                  <>
                    <ListItem>
                      <Grid container justify="flex-end">
                        <Grid item xs={6}>
                          Quantity
                        </Grid>

                        <Grid item xs={6}>
                          <Select
                            labelId="quantity-label"
                            id="quantity"
                            fullWidth
                            onChange={(e) => setQuantity(e.target.value)}
                            value={quantity}
                          >
                            {[...Array(product.quantity).keys()].map((x) => (
                              <MenuItem key={x + 1} value={x + 1}>
                                {x + 1}
                              </MenuItem>
                            ))}
                          </Select>
                        </Grid>
                      </Grid>
                    </ListItem>
                    <ListItem>
                      <Button
                        type="button"
                        fullWidth
                        variant="contained"
                        color="primary"
                        onClick={addToCartHandler}
                      >
                        Add To Card
                      </Button>
                    </ListItem>
                  </>
                )}
              </List>
            </Card>
          </Grid>
        </Grid>
      </Slide>
    </Layout>
  );
}

export async function getServerSideProps({ params }) {
  const { id } = params;
  console.log("id:", id);
  const commerce = getCommerce();
  const product = await commerce.products.retrieve(id, {
    type: "permalink",
  });

  console.log("product:", product);
  return { props: { product } };
}
