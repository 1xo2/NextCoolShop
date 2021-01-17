import React from "react";
import { Alert } from "@material-ui/lab";
import Layout from "../components/Layout";
//import styles from "../styles/Home.module.css";
import dynamic from "next/dynamic";
import {
  Card,
  Grid,
  List,
  ListItem,
  Slide,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@material-ui/core";
import { useContext } from "react";
import { Store } from "../components/Store";
import { useStyles } from "../utils/Styles";


function Confirmation(props) {
  const classes = useStyles();
  const { state } = useContext(Store);
  const { order } = state;

  return (
    <Layout
      title={`Order ${order.id}`}
      commercePublicKey={props.commercePublicKey}
    >
      {!order ? (
        <Alert severity="error" icon={false}>
          No order has been found.
        </Alert>
      ) : (
        <React.Fragment>
          <Typography variant="h1" component="h1">
            Order ID: { order.id}
          </Typography>
          <Slide direction="up" in={true}>
            <Grid container spacing={1}>
              <Grid item md={9}>
                <Card className={classes.p1}>
                  <Typography variant="h2" component="h2">
                    customer details
                  </Typography>
                  <Typography>
                    {order.customer.firstname} {order.customer.lastname}
                  </Typography>
                  <Typography>{order.customer.email}</Typography>
                </Card>

                <Card className={[classes.p1, classes.mt1]}>
                  <Typography variant="h2" component="h2">
                    Shipping information
                  </Typography>
                  <Typography>{order.shipping.name}</Typography>
                  <Typography>{order.shipping.street}</Typography>
                  <Typography>
                    {order.shipping.town_city}, {order.shipping.country_state}{" "}
                    {order.shipping.country}
                    {order.shipping.postal_zip_code}
                  </Typography>
                </Card>

                <Card className={[classes.p1, classes.mt1]}>
                  <Typography variant="h2" component="h2">
                    Payment details
                  </Typography>
                  {order.transactions && order.transactions[0] ? (
                    <>
                      {console.log(
                        "==--++-- order.transactions:",
                        order.transactions
                      )}
                      <Typography>
                        {order.transactions[0].gateway_name}
                      </Typography>
                      <Typography>
                        Card ending in {order.transactions[0].gateway_reference}
                      </Typography>
                      <Typography>
                        Transaction ID:{" "}
                        {order.transactions[0].gateway_transaction_id}
                      </Typography>
                    </>
                  ) : (
                    <Alert icon={false}>Not payment found</Alert>
                  )}
                </Card>

                <Card className={[classes.p1, classes.mt1]}>
                  <Typography variant="h2" component="h2">
                    Order Items
                  </Typography>
                  <TableContainer>
                    <Table aria-label="Orders">
                      <TableHead>
                        <TableRow>
                          <TableCell>Name</TableCell>
                          <TableCell align="right">Quantity</TableCell>
                          <TableCell align="right">Unit Price</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {order.order.line_items.map((cartItem) => (
                          <TableRow key={cartItem.name}>
                            <TableCell component="th" scope="row">
                              {cartItem.name}
                            </TableCell>
                            <TableCell align="right">
                              {cartItem.quantity}
                            </TableCell>
                            <TableCell align="right">
                              {cartItem.price.formatted_with_symbol}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Card>
              </Grid>

              <Grid item xs={12} md={3}>
                <Card>
                  <Typography component="h2" variant="h2">
                    Order Summary
                  </Typography>

                  <List>
                    <ListItem>
                      <Grid container>
                        <Grid item xs={6}>
                          <Typography>Subtotal</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography align="right">
                            {order.order.subtotal.formatted_with_symbol}
                          </Typography>
                        </Grid>
                      </Grid>
                    </ListItem>

                    <ListItem>
                      <Grid container>
                        <Grid item xs={6}>
                          <Typography>Tax</Typography>
                        </Grid>
                        <Grid item xs={6} align="right">
                          <Typography>
                            {order.order.tax.formatted_with_symbol}
                          </Typography>
                        </Grid>
                      </Grid>
                    </ListItem>

                    <ListItem>
                      <Grid container>
                        <Grid item xs={6}>
                          <Typography>Shipping</Typography>
                        </Grid>
                        <Grid item xs={6} align="right">
                          <Typography>
                            {order.order.shipping.price.formatted_with_symbol}
                          </Typography>
                        </Grid>
                      </Grid>
                    </ListItem>

                    <ListItem>
                      <Grid container>
                        <Grid item xs={6}>
                          <Typography>Total</Typography>
                        </Grid>
                        <Grid item xs={6} align="right">
                          <Typography>
                            {order.order.total_with_tax.formatted_with_symbol}
                          </Typography>
                        </Grid>
                      </Grid>
                    </ListItem>

                    <ListItem>
                      <Grid container>
                        <Grid item xs={6}>
                          <Typography variant="h3">Total Paid</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="h3" align="right">
                            {order.order.total_with_tax.formatted_with_symbol}
                          </Typography>
                        </Grid>
                      </Grid>
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

// client render
export default dynamic(() => Promise.resolve(Confirmation), { ssr: false });
