import React from "react";
import { Container } from "semantic-ui-react";
import Navbar from "./Navbar";

function Layout(props) {
  return (
    <>
      <Navbar />
      <Container>{props.children}</Container>
    </>
  );
}

export default Layout;
