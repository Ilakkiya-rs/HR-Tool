import React from "react";

import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Logo from "../assets/logo.png";

const Header = () => {
  const blackColorFont = {
    color: "black",
  };
  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand href="/">
          <img
            src={Logo.src}
            width="30"
            height="30"
            className="d-inline-block align-top"
            alt="React Bootstrap logo"
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto fw-bold">
            <Nav.Link href="/" className="pl-7" style={blackColorFont}>
              Home
            </Nav.Link>
            <Nav.Link
              href="/skills-profiler-plugin"
              className="pl-7"
              style={blackColorFont}
            >
              Skills Plugin
            </Nav.Link>
            <Nav.Link
              href="/saas-application/employee-skills-management"
              className="pl-7"
              style={blackColorFont}
            >
              SaaS Applications
            </Nav.Link>
            <Nav.Link
              href="/sample-skills-profiles/list"
              className="pl-7"
              style={blackColorFont}
            >
              Sample Skills Profiles
            </Nav.Link>
            <Nav.Link
              href="/sample-skills-profiles/list"
              className="pl-7"
              style={blackColorFont}
            >
              Skills Coverage
            </Nav.Link>
            <Nav.Link
              href="/sample-skills-profiles/list"
              className="pl-7"
              style={blackColorFont}
            >
              Use Cases
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
