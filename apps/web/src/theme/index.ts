import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#4caf50",
      light: "#81c784",
      dark: "#2e7d32",
    },
    secondary: {
      main: "#fdd835",
      light: "#ffeb3b",
      dark: "#f9a825",
    },
    success: {
      main: "#4caf50",
    },
    warning: {
      main: "#f9a825",
    },
    error: {
      main: "#e53935",
    },
    background: {
      default: "#f5f5f5",
      paper: "#ffffff",
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontSize: "2.5rem", fontWeight: 700 },
    h2: { fontSize: "2rem", fontWeight: 700 },
    h3: { fontSize: "1.75rem", fontWeight: 700 },
    h4: { fontSize: "1.5rem", fontWeight: 700 },
    h5: { fontSize: "1.25rem", fontWeight: 600 },
    h6: { fontSize: "1rem", fontWeight: 600 },
  },
  shape: { borderRadius: 8 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { textTransform: "none", fontWeight: 600 },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: { boxShadow: "0 2px 8px rgba(0,0,0,0.1)" },
      },
    },
  },
});

export default theme;
