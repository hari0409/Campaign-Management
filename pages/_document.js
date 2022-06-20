import React from "react";
import { Html, Head, Main, NextScript } from "next/document";

function Document() {
  return (
    <Html>
      <Head>
        <link
          async
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/semantic-ui@2/dist/semantic.min.css"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

export default Document;
