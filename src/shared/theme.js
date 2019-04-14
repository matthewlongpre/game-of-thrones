import { createMuiTheme } from "@material-ui/core";

export const muiTheme = createMuiTheme({
  overrides: {
    MuiButton: {
      containedPrimary: {
        backgroundColor: "#4f75aa",
        color: "#fff"
      }
    },
    MuiDialog: {
      paper: {
        margin: `20px`
      }
    },
    MuiTooltip: {
      tooltip: {
        backgroundColor: "#131312"
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
      main: "#eee",
      contrastText: "#131312"
    }
  }
});