import React from "react";
import { Menu, Button } from "semantic-ui-react";

function Navbar() {
  return (
    <>
      <Menu>
        <Menu.Item>
          <a href="/">
            <h2 style={{ color: "#FF7396" }}>🪣 Bucket</h2>
          </a>
        </Menu.Item>
        <Menu.Menu position="right">
          <Menu.Item>
            <Button style={{ background: "#C499BA" }}>My Campaigns</Button>
          </Menu.Item>
          <Menu.Item>
            <Button icon="add" href="/campaign/new" />
          </Menu.Item>
        </Menu.Menu>
      </Menu>
    </>
  );
}

export default Navbar;
