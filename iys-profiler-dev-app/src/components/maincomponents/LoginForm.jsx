'use client';

import Cookies from 'js-cookie';
import { useState } from 'react';
import { Button, Container, Form } from 'react-bootstrap';

import { loginUser } from '../api/ApiCalls';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Make API call to login endpoint with username and password
    // If successful, save user credentials to cookies
    console.log(username, password);
    Cookies.set('username', username);
    Cookies.set('password', password);

    loginUser(username, password)
      .then((response) => {
        console.log(response.data);
        window.location.href = '/skills-category-api';
      })
      .catch((error) => console.error(error));
  };

  return (
    <Container>
      <h1>Login</h1>
      <Form>
        <Form.Group>
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <hr />
        <Button variant="primary" onClick={handleLogin}>
          Login
        </Button>
      </Form>
    </Container>
  );
};

export default LoginForm;
