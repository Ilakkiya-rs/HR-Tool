'use client';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Rating from '../subcomponents/Rating';
const MyVerticallyCenteredModal = (props) => {
  console.log(props.skilldetail);
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">Expertise</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h1>
          {' '}
          <Rating />
        </h1>
        <Form>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Comment</Form.Label>
            <Form.Control
              as="textarea"
              aria-label="With textarea"
              autoFocus=""
            />
            <Form.Text className="text-muted">Comment On skills</Form.Text>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={props.onHide}>
          Close
        </Button>
        <Button variant="primary" onClick={props.onHide}>
          Save changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
export default MyVerticallyCenteredModal;
