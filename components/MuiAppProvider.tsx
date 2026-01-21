"use client";
import { ThemeProvider, CssBaseline } from "@mui/material";
import muiTheme from "../lib/muiTheme";

export default function MuiAppProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
