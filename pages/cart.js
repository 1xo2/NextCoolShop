import React from "react";
import { Alert } from "@material-ui/lab";
import Layout from "../components/Layout";
//import styles from "../styles/Home.module.css";
import getCommerce from "../utils/commerce";
import dynamic from "next/dynamic";
import {
  Button,
  Card,
  CircularProgress,
  Grid,
  List,
  ListItem,
  MenuItem,
  Select,
  Slide,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@material-ui/core";
import Link from "next/link";
import { useContext } from "react";
import { Store } from "../components/Store";
import { useStyles } from "../utils/Styles";
import { CART_RETRIEVE_SUCCESS } from "../utils/Constants";
import Router from "next/Router";

function Cart(props) {
  //const { products } = props;
  const classes = useStyles();

  const { state, dispatch } = useContext(Store);
  const { cart } = state;

  const quantityChangeHandler = async (lineItem,quantity) => {
    const commerce = getCommerce(props.commercePublicKey);
    const cartData = await commerce.cart.update(lineItem.id,{quantity});
    dispatch({ type: CART_RETRIEVE_SUCCESS, payload: cartData.cart });
    
  };
  
  const removeCartItemHandler = async (lineItem) => {
    const commerce = getCommerce(props.commercePublicKey);
    const cartData = await commerce.cart.remove(lineItem.id);
    dispatch({ type: CART_RETRIEVE_SUCCESS, payload: cartData.cart });
  };

  const processToCheckoutHandler = () => {
      Router.push('/checkout')
  };

  return (
    <Layout title="Home" commercePublicKey={props.commercePublicKey}>
      {cart.loading ? (
        <CircularProgress />
      ) : cart.data.line_items.length === 0 ? (
        <Alert icon={false} severity="error">
          Cart is empty. <Link href="/">Go Shopping</Link>
        </Alert>
      ) : (
        <React.Fragment>
          <Typography variant="h1" component="h1">
            Shopping Cart
          </Typography>
          <Slide direction="up" in={true}>
            <Grid container spacing={1}>
              <Grid item md={9}>
                <TableContainer>
                  <Table aria-label="Orders">
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell align="right">Quantity</TableCell>
                        <TableCell align="right">Unit Price</TableCell>
                        <TableCell align="right">Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {cart.data.line_items.map((cartItem) => (
                        <TableRow key={cartItem.name}>
                          <TableCell component="th" scope="row">
                            {cartItem.name}
                          </TableCell>
                          <TableCell align="right">
                            <Select
                              id="quantity"
                              labelId="quantity-label"
                              onChange={(e) =>
                                quantityChangeHandler(cartItem, e.target.value)
                              }
                              value={cartItem.quantity}
                            >
                              {[...Array(10).keys()].map((i) => (
                                <MenuItem key={i + 1} value={i + 1}>
                                  {i + 1}
                                </MenuItem>
                              ))}
                            </Select>
                          </TableCell>
                          <TableCell align="right">
                            {cartItem.price.formatted_with_symbol}
                          </TableCell>
                          <TableCell align="right">
                            <Button
                              variant="contained"
                              color="secondary"
                              onClick={() => removeCartItemHandler(cartItem)}
                            >
                              X
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
              <Grid item md={3} xs={12}>
                <Card className={classes.Card}>
                  <List>
                    <ListItem>
                      <Grid container>
                        <Typography variant="h6">
                          SubTotal: {cart.data.subtotal.formatted_with_symbol}
                        </Typography>
                      </Grid>
                    </ListItem>
                    <ListItem>
                      {cart.data.total_items > 0 && (
                        <Button
                          type="button"
                          fullWidth
                          variant="contained"
                          color="primary"
                          onClick={processToCheckoutHandler}
                        >
                          Proceed to checkout
                        </Button>
                      )}
                    </ListItem>
                  </List>
                </Card>
              </Grid>
            </Grid>
          </Slide>
        </React.Fragment>
      )}
    </Layout>
  );
}

// export async function getStaticProps() {
//   const commerce = getCommerce();
//   const { data: products } = await commerce.products.list();

//   return { props: { products } };
// }

export default dynamic(() => Promise.resolve(Cart), { ssr: false });
