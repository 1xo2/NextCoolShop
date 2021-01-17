import React, { useEffect, useState } from "react";
import { Alert } from "@material-ui/lab";
import Layout from "../components/Layout";
//import styles from "../styles/Home.module.css";
import getCommerce from "../utils/commerce";
import dynamic from "next/dynamic";
import {
  Box,
  Button,
  Card,
  CircularProgress,
  FormControl,
  Grid,
  InputLabel,
  List,
  ListItem,
  MenuItem,
  Select,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from "@material-ui/core";
//import Link from "next/link";
import { useContext } from "react";
import { Store } from "../components/Store";
import { useStyles } from "../utils/Styles";
import Router from "next/Router";
import { CART_RETRIEVE_SUCCESS, ORDER_SET } from "../utils/Constants";

const dev = process.env.NODE_ENV === "development";

function Checkout(props) {
  //const { products } = props;
  const classes = useStyles();

  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  const [errors, setErrors] = useState([]);
  const [checkoutToken, setCheckoutToken] = useState({});

  useEffect(() => {
    if (!cart.loading) {
      generateCheckoutToken();
    }
  }, [cart.loading]);

  const generateCheckoutToken = async () => {
    if (cart.data.line_items.length) {
      const commerce = getCommerce(props.commercePublicKey);
      const token = await commerce.checkout.generateToken(cart.data.id, {
        type: "cart",
      });
      setCheckoutToken(token);
      fetchShippingCountries(token.id);
    } else {
      Router.push("/cart");
    }
  };

  // Customer details
  const [firstName, setFirstName] = useState(dev ? "Jane" : "");
  const [lastName, setLastName] = useState(dev ? "Doe" : "");
  const [email, setEmail] = useState(dev ? "janedoe@email.com" : "");
  // Shipping details
  const [shippingName, setShippingName] = useState(dev ? "Jane Doe" : "");
  const [shippingStreet, setShippingStreet] = useState(
    dev ? "123 Fake St" : ""
  );
  const [shippingCity, setShippingCity] = useState(dev ? "Los Angeles" : "");
  const [shippingPostalZipCode, setShippingPostalZipCode] = useState(
    dev ? "90089" : ""
  );

  const [shippingCountry, setShippingCountry] = useState(dev ? "" : "");
  const [shippingStateProvince, setShippingStateProvince] = useState(
    dev ? "" : ""
  );
  // Payment details
  const [cardNum, setCardNum] = useState(dev ? "4242 4242 4242 4242" : "");
  const [expMonth, setExpMonth] = useState(dev ? "11" : "");
  const [expYear, setExpYear] = useState(dev ? "2023" : "");
  const [cvv, setCvv] = useState(dev ? "123" : "");
  const [billingPostalZipcode, setBillingPostalZipcode] = useState(
    dev ? "90089" : ""
  );
  // Shipping and fulfillment data
  const [shippingCountries, setShippingCountries] = useState({});
  const [shippingSubdivisions, setShippingSubdivisions] = useState({});
  const [shippingOptions, setShippingOptions] = useState([]);
  const [shippingOption, setShippingOption] = useState({});

  // stepper
  const [activeStep, setActiveStep] = useState(1);
  const steps = [
    "Customer information",
    "Shipping details",
    "Payment information",
  ];

  const refreshCart = async () => {
    const commerce = getCommerce(props.commercePublicKey);
    const newCart = await commerce.cart.refresh();
    dispatch({ type: CART_RETRIEVE_SUCCESS, payload: newCart });
  };

  const CaptureCheckoutHandler = async () => {
    const orderData = {
      line_items: checkoutToken.live.line_items,
      customer: {
        firstname: firstName,
        lastname: lastName,
        email: email,
      },
      shipping: {
        name: shippingName,
        street: shippingStreet,
        town_city: shippingCity,
        county_state: shippingStateProvince,
        postal_zip_code: shippingPostalZipCode,
        country: shippingCountry,
      },
      fulfillment: {
        shipping_method: shippingOption,
      },
      payment: {
        gateway: 'test_gateway',
        card: {
          number: cardNum,
          expiry_month: expMonth,
          expiry_year: expYear,
          cvc: cvv,
          postal_zip_code: billingPostalZipcode,
        },
      },
    };

    const commerce = getCommerce(props.commercePublicKey);
    try {
      const order = await commerce.checkout.capture(
        checkoutToken.id,
        orderData
      );

      dispatch({ type: ORDER_SET, payload: order });
      localStorage.setItem("order_receipt", JSON.stringify(order));
      await refreshCart();
      Router.push("/confirmation");
    } catch (err) {
      const errList = [err.data.error.message];
      const errs = err.data.error.errors;
      for (const index in errs) {
        errList.push(`${index}: ${errs[index]}`);
      }
      setErrors(errList);
    }
  };

  const nextStepHandler = () => {
    setActiveStep((x) => x + 1);
    if (activeStep === steps.length - 1) {
      CaptureCheckoutHandler();
    }
  };
  const previousStepHandler = () => {
    setErrors([]);
    setActiveStep((x) => x - 1);
    if (activeStep === steps.length - 1) {
      //
    }
  };

  const fetchShippingCountries = async (checkoutTokenId) => {
    const commerce = getCommerce(props.commercePublicKey);
    const countries = await commerce.services.localeListShippingCountries(
      checkoutTokenId
    );
    setShippingCountries(countries.countries);
  };

  const useGetField = (sName, oName, setter) => {
    return (
      <TextField
        variant="outlined"
        required
        margin="normal"
        label={sName}
        fullWidth
        id={sName}
        name={sName}
        value={oName}
        onChange={(e) => setter(e.target.value)}
      ></TextField>
    );
  };

  const fetchSubdivisions = async (countryCode) => {
    const commerce = getCommerce(props.commercePublicKey);
    const subdivisions = await commerce.services.localeListSubdivisions(
      countryCode
    );
    setShippingSubdivisions(subdivisions.subdivisions);
  };

  const fetchShippingOptions = async (
    checkoutTokenId,
    country,
    stateProvince = null
  ) => {
    const commerce = getCommerce(props.commercePublicKey);
    const options = await commerce.checkout.getShippingOptions(
      checkoutTokenId,
      {
        country: country,
        region: stateProvince,
      }
    );

    // console.log('++++++++ checkoutTokenId:', checkoutTokenId)
    // console.log('++++++ country:', country)

    // console.log('+++++++ options:', options)
    setShippingOptions(options);
    const shippingOption2 = options[0] ? options[0].id : null;
    console.log("+++++ shippingOption2:", shippingOption2);
    setShippingOption(shippingOption2);
  };

  const shippingCountry_onChangeHandler = (e) => {
    const currentValue = e.target.value;
    setShippingCountry(currentValue);
    fetchSubdivisions(currentValue);
  };

  const shippingSubdivisions_onChangeHandler = (e) => {
    const currentValue = e.target.value;
    setShippingStateProvince(currentValue);
    fetchShippingOptions(checkoutToken.id, shippingCountry, currentValue);
  };

  const shippingOption_onChangeHandler = (e) => {
    const currentValue = e.target.value;
    setShippingOption(currentValue);
    console.log("++++++ currentValue:", currentValue);
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <>
            {/* <TextField
              variant="outlined"
              required
              margin="normal"
              fullWidth
              id="firstName"
              name="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            ></TextField> */}
            {useGetField("firstName", firstName, setFirstName)}
            {/* <TextField
              variant="outlined"
              required
              margin="normal"
              fullWidth
              id="lastName"
              name="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            ></TextField> */}
            {useGetField("lastName", lastName, setLastName)}
            {useGetField("email", email, setEmail)}
            {/*             
            <TextField
              variant="outlined"
              required
              margin="normal"
              fullWidth
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            ></TextField> */}
          </>
        );
      case 1:
        return (
          <>
            {useGetField("shippingName", shippingName, setShippingName)}
            {useGetField("shippingStreet", shippingStreet, setShippingStreet)}
            {useGetField("shippingCity", shippingCity, setShippingCity)}
            {useGetField(
              "shippingPostalZipCode",
              shippingPostalZipCode,
              setShippingPostalZipCode
            )}

            <FormControl className={classes.formControl}>
              <InputLabel id="shippingCountry-label">Country</InputLabel>
              <Select
                labelId="shippingCountry-label"
                id="shippingCountry"
                label="Country"
                fullWidth
                onChange={shippingCountry_onChangeHandler}
                value={shippingCountry}
              >
                {Object.keys(shippingCountries).map((index) => (
                  <MenuItem value={index} key={index}>
                    {shippingCountries[index]}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl className={classes.formControl}>
              <InputLabel id="shippingStateProvince-label">
                State / Province
              </InputLabel>

              <Select
                labelId="shippingStateProvince-label"
                id="shippingStateProvince"
                label="State/Province"
                fullWidth
                onChange={shippingSubdivisions_onChangeHandler}
                value={shippingStateProvince}
                required
                className={classes.mt1}
              >
                {Object.keys(shippingSubdivisions).map((index) => (
                  <MenuItem value={index} key={index}>
                    {shippingSubdivisions[index]}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl className={classes.formControl}>
              <InputLabel id="shippingOption-label">Shipping Option</InputLabel>

              <Select
                labelId="shippingOption-label"
                id="shippingOption"
                label="Shipping Option"
                fullWidth
                onChange={shippingOption_onChangeHandler}
                value={shippingOption}
                required
                className={classes.mt1}
              >
                {shippingOptions.map((method, index) => (
                  <MenuItem
                    value={method.id}
                    key={index}
                  >{`${method.description} - $${method.price.formatted_with_code}`}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </>
        );

      case 2:
        return (
          <>
            {useGetField("cardNum", cardNum, setCardNum)}
            {useGetField("expMonth", expMonth, setExpMonth)}
            {useGetField("expYear", expYear, setExpYear)}
            {useGetField("cvv", cvv, setCvv)}
            {useGetField(
              "billingPostalZipcode",
              billingPostalZipcode,
              setBillingPostalZipcode
            )}
          </>
        );
      default:
        return "Unknown step";
    }
  };

  return (
    <Layout title="Home" commercePublicKey={props.commercePublicKey}>
      <Typography color="textPrimary" gutterBottom variant="h6" component="h1">
        Checkout
      </Typography>
      {cart.loading ? (
        <CircularProgress />
      ) : (
        <Grid container spacing={2}>
          <Grid item md={8}>
            <Card className={classes.p1}>
              <form>
                <Stepper activeStep={activeStep} alternativeLabel>
                  {steps.map((label) => (
                    <Step key={label}>
                      <StepLabel>{label}</StepLabel>
                    </Step>
                  ))}
                </Stepper>
                <Box>
                  {activeStep === steps.length ? (
                    errors && errors.length > 0 ? (
                      <Box>
                        <List>
                          {errors.map((error) => (
                            <ListItem key={error}>
                              <Alert severity="error">{error}</Alert>
                            </ListItem>
                          ))}
                        </List>
                        <Box className={classes.mt1}>
                          <Button
                            className={classes.button}
                            onClick={previousStepHandler}
                          >
                            Back
                          </Button>
                        </Box>
                      </Box>
                    ) : (
                      <Box>
                        <CircularProgress />
                        <Typography className={classes.instructions}>
                          Confirming Order ...
                        </Typography>
                      </Box>
                    )
                  ) : (
                    <Box>
                      {getStepContent(activeStep)}
                      <Box className={classes.mt1}>
                        <Button
                          disabled={activeStep === 0}
                          className={classes.button}
                          onClick={previousStepHandler}
                        >
                          Back
                        </Button>
                        <Button
                          variant="contained"
                          color="primary"
                          className={classes.button}
                          onClick={nextStepHandler}
                        >
                          {activeStep === steps.length - 1
                            ? "Confirm Order"
                            : "Next"}
                        </Button>
                      </Box>
                    </Box>
                  )}
                </Box>
              </form>
            </Card>
          </Grid>
          {/* order summery start  */}
          <Grid item md={4}>
            <Card>
              <List>
                <ListItem>
                  <Typography variant="h2">Order Summery</Typography>
                </ListItem>
                {cart.data.line_items.map((lineItem) => (
                  <ListItem key={lineItem.id}>
                    <Grid container>
                      <Grid item xs={6}>
                        {lineItem.quantity} x {lineItem.name}
                      </Grid>
                      <Grid item xs={6}>
                        <Typography align="right">
                          {lineItem.line_total.formatted_with_symbol}
                        </Typography>
                      </Grid>
                    </Grid>
                  </ListItem>
                ))}
                <ListItem>
                  <Grid container>
                    <Grid item xs={6}>
                      Subtotal
                    </Grid>
                    <Grid item xs={6}>
                      <Typography align="right">
                        {cart.data.subtotal.formatted_with_symbol}
                      </Typography>
                    </Grid>
                  </Grid>
                </ListItem>
              </List>
            </Card>
          </Grid>
        </Grid>
      )}
    </Layout>
  );
}

// client render
export default dynamic(() => Promise.resolve(Checkout), { ssr: false });
