import React from "react";
import GlobalStyles from "../styles/GlobalStyles";

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <GlobalStyles />
    </>
  )
}
