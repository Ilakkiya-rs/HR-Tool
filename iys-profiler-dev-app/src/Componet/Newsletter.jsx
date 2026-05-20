'use client';

import { Container, Form } from 'react-bootstrap';

import ReCAPTCHA from 'react-google-recaptcha';
import { recaptchaSiteKey } from './config';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const Newsletter = ({ title }) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company_name: '',
    phone_number: '',
    message: ''
  });

  const [recaptchaValue, setRecaptchaValue] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!recaptchaValue) {
      alert('Please complete the reCAPTCHA challenge.');
      return;
    }

    const formData = new FormData();
    formData.append('name', event.target.name.value);
    formData.append('email', event.target.email.value);
    formData.append('company_name', event.target.company_name.value);
    formData.append('phone_number', event.target.phone_number.value);
    formData.append('message', event.target.message.value);

    try {
      const response = await fetch(
        'https://djadmin.iysskillstech.com/contact-us/',
        {
          method: 'POST',
          body: formData
        }
      );

      if (response.ok) {
        console.log('Form data submitted successfully');

        // Reset form inputs and captcha
        event.target.reset();
        setRecaptchaValue(null);

        // Reset form data state
        setFormData({
          name: '',
          email: '',
          company_name: '',
          phone_number: '',
          message: ''
        });

        // on success redirect to thank you page
        router.push('/thankyou?formSubmitted=true');
      } else {
        console.error('Failed to submit form data');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleRecaptchaChange = (value) => {
    setRecaptchaValue(value);
  };

  return (
    <>
      <section>
        <Container className="my-5 py-5 shadow rounded border">
          <center>
            <div className="col-12 col-lg-7">
              <div>
                <div>
                  <h2>
                    <span className="font-w-4 d-block">{title}</span> Let’s connect!
                  </h2>
                </div>
                <br />
                <br />
                <form className="row" onSubmit={handleSubmit}>
                  <div className="messages" />
                  <div className="form-group col-md-6">
                    <Form.Group controlId="formBasicFullName">
                      <Form.Control
                        type="text"
                        name="name"
                        required
                        placeholder="Enter Full Name"
                        // value="Akshay"
                        value={formData.name}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </div>
                  <div className="form-group col-md-6">
                    <Form.Group controlId="formBasicEmail">
                      <Form.Control
                        type="email"
                        name="email"
                        required
                        placeholder="Enter Email"
                        value={formData.email}
                        // value="Kumar@gmail.com"
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </div>
                  <div className="form-group col-md-6">
                    <Form.Group controlId="formBasicCompanyName">
                      <Form.Control
                        type="text"
                        name="company_name"
                        required
                        placeholder="Enter Company Name"
                        // value="IYS Skills Tech"
                        value={formData.company_name}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </div>
                  <div className="form-group col-md-6">
                    <Form.Group controlId="formBasicMobileNo">
                      <Form.Control
                        type="tel"
                        name="phone_number"
                        required
                        placeholder="Enter Mobile No"
                        value={formData.phone_number}
                        // value="9876543210"
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </div>
                  <div className="form-group">
                    <textarea
                      className="form-control"
                      name="message"
                      placeholder="Type your message here..."
                      value={formData.message}
                      // value="hello world!"
                      onChange={handleInputChange}
                      style={{ height: '150px' }}
                    ></textarea>
                  </div>
                  <div className="form-group col-md-12 mt-4">
                    <ReCAPTCHA
                      sitekey={recaptchaSiteKey}
                      onChange={handleRecaptchaChange}
                    />
                  </div>
                  <div className="col">
                    <button
                      type="submit"
                      className="px-4 py-3 fs-5 btn btn-warning"
                    >
                      Contact Us
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </center>
        </Container>
      </section>

      <br />
      <br />
    </>
  );
};

export default Newsletter;
