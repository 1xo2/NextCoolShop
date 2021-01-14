import {
  AppBar,
  Toolbar,
  CssBaseline,
  ThemeProvider,
  Link,
  Container,
  Box,
  Typography,
  CircularProgress,
  Badge,
} from "@material-ui/core";
import Head from "next/head";
import NextLink from "next/link";
import React, { useContext, useEffect } from "react";
import { theme, useStyles } from "../utils/Styles";
import { Store } from "./Store";
import { siteName } from "../utils/config";
import {
  CART_RETRIEVE_REQUEST,
  CART_RETRIEVE_SUCCESS,
  ORDER_SET,
} from "../utils/Constants";

import getCommerce from "../utils/commerce";

export default function Layout({
  children,
  commercePublicKey,
  title = "CoolShop",
}) {
  const classes = useStyles();

  const { state, dispatch } = useContext(Store);
  const { cart } = state;

  useEffect(() => {
    const fetchCart = async () => {
      const commerce = getCommerce(commercePublicKey);
      dispatch({ type: CART_RETRIEVE_REQUEST });
      const cartData = await commerce.cart.retrieve();
      dispatch({ type: CART_RETRIEVE_SUCCESS, payload: cartData });
    };
    fetchCart();
    return () => {};
  }, []);

  return (
    <React.Fragment>
      <Head>
        <meta charSet="utf-8" />
        <title>{`${title} - ${siteName}`}</title>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>

      <ThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        {/* <Component {...pageProps} /> */}

        <AppBar
          position="static"
          color="default"
          elevation={0}
          className={classes.AppBar}
        >
          <Toolbar className={classes.toolBar}>
            <NextLink href="/">
              <Link
                variant="h6"
                color="inherent"
                nowrap
                href="/"
                className={classes.toolBarTitle}
              >
                {siteName}
              </Link>
            </NextLink>
            <nav>
              <NextLink href="/cart">
                <Link
                  href="/cart"
                  variant="button"
                  color="textPrimary"
                  className={classes.link}
                >
                  {cart.loading ? (
                    <CircularProgress />
                  ) : cart.data.total_items > 0 ? (
                    <Badge badgeContent={cart.data.total_items} color="primary">
                      Cart
                    </Badge>
                  ) : (
                    "Cart"
                  )}
                </Link>
              </NextLink>
            </nav>
          </Toolbar>
        </AppBar>
       {/* Hero unit */}
        <Container component="main" className={classes.main}>
          {children}
        </Container>
        {/* End hero unit */}
        <Container component="md" className={"footer"}>
          <Box mt={5}>
            <Typography variant="body2" color="textSecondary" align="center">
              {"© "}
              {siteName} 2021
              {"."}
            </Typography>
          </Box>
        </Container>
        {/* End footer */}
      </ThemeProvider>
    </React.Fragment>
  );
}
