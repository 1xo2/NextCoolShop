import {
  AppBar,
  Toolbar,
  CssBaseline,
  ThemeProvider,
  Link,
  Container,
  Box,
  Typography,
} from "@material-ui/core";
import Head from "next/head";
import NextLink from "next/link";
import React from "react";
import { theme, useStyles } from "../utils/Styles";

export default function Layout({
  children,
  commercePublicKey,
  title = "CoolShop",
}) {
  const classes = useStyles();
  return (
    <React.Fragment>
      <Head>
        <meta charset="utf-8" />
        <title>{`${title} - CoolShop`}</title>
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
                CoolShop
              </Link>
            </NextLink>
            <nav>
              <NextLink href="/cart">
                <Link
                  href="/cart"
                  variant="button"
                  color="textPrimary"
                  className={classes.link}
                >Cart</Link>
              </NextLink>
            </nav>
          </Toolbar>
        </AppBar>
        <Container component="main" className={classes.main}>
          {children}
        </Container>
        <Container component="md" className={"footer"}>
          <Box mt={5}>
            <Typography variant="body2" color="textSecondary" align="center">
              &copy; CoolShop 2021.
            </Typography>
          </Box>
        </Container>
      </ThemeProvider>
    </React.Fragment>
  );
}
