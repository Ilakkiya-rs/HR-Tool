'use client'

import React, { useState } from "react";
import { Container, Form, Button, Col, Row } from "react-bootstrap";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    companyName: "",
    mobileNo: "",
  });
 
  const handleSubmit = (event) => {
    event.preventDefault();
    // You can handle form submission here, for example:
    console.log("Form data submitted:", formData);

    // open this link in new tab mailto:`{email}`?subject={subject}&body={body}"
    window.open(
      `mailto:connect@iysskillstech.com?subject=Contact IYS &body=${formData.fullName} ${formData.email} ${formData.companyName} ${formData.mobileNo}`,
      "_blank"
    );
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col>
            <Form.Group controlId="formBasicFullName">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="text"
                name="fullName"
                required
                placeholder="Enter Full Name"
                value={formData.fullName}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                name="email"
                required
                placeholder="Enter Email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form.Group controlId="formBasicCompanyName">
              <Form.Label>Company Name</Form.Label>
              <Form.Control
                type="text"
                name="companyName"
                required
                placeholder="Enter Company Name"
                value={formData.companyName}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="formBasicMobileNo">
              <Form.Label>Mobile No</Form.Label>
              <Form.Control
                type="text"
                name="mobileNo"
                required
                placeholder="Enter Mobile No"
                value={formData.mobileNo}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col>
        </Row>

        <Button variant="primary" type="submit" className="mt-3 float-end">
          Contact Us
        </Button>
      </Form>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
    </Container>
  );
};

export default ContactUs;
