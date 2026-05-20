'use client';
import { InlineWidget } from 'react-calendly';
const BookADemo = () => {
  return (
    <>
      <br />
      <center>
        <h2>Book a Demo</h2>
      </center>
      <InlineWidget url="https://calendly.com/iys-skills-tech/30min" />
      <br />
    </>
  );
};

export default BookADemo;
