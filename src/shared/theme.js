import { createMuiTheme } from "@material-ui/core";

export const muiTheme = createMuiTheme({
  overrides: {
    MuiButton: {
      text: {
        background: "#131312",
        color: "#fff"
      }
    }
  },
  typography: {
    fontFamily: "Lora",
    useNextVariants: true,
  },
  palette: {
    primary: {
      main: "#131312"
    },
    secondary: {
      main: "#eaf7ff",
      contrastText: "#131312"
    }
  }
});