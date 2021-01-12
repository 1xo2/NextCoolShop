import { createMuiTheme, makeStyles } from "@material-ui/core/styles";
import { red } from "@material-ui/core/colors";

// Create a theme instance.
export const theme = createMuiTheme({
  typography: {
    h1: {
      fontSize: "2.2rem",
      fontWeight: "400",
      margin: "2rem 0",
    },
    h2: {
      fontSize: "1.8rem",
      fontWeight: "400",
      margin: "1rem 0",
    },
    h3: {
      fontSize: "1.4rem",
      fontWeight: "400",
      margin: "1rem 0",
    },
  },

  palette: {
    primary: {
      main: "#556cd6", // #f0c000
    },
    secondary: {
      main: "#19857b",
    },
    error: {
      main: red.A400,
    },
    background: {
      default: "#fff",
    },
  },
});

export const useStyles = makeStyles((theme) => ({
  appBar: {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  toolBar: {
    flexWrap: "wrap",
  },
  toolBarTitle: {
    flexGrow: 1,
  },
  link: {
    margin: "1rem",
  },
  main: {
    padding: "1rem",
  },
  largeImage: {
    maxWidth: "50rem",
    width: "100%",
  },
  mt1: {
    marginTop: "1rem !important",
  },
  p1: {
    padding: "1rem !important",
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    width: "100%",
  },
}));
