'use client';

import { Button, Card } from 'react-bootstrap';

const RateLimitExceed = () => {
  return (
    <div className="container mt-3">
      <Card>
        <Card.Header as="h3">Happy with IYS Skills Taxonomy?</Card.Header>
        <Card.Body>
          <Card.Text>
            Check out the API using which you can access the full IYS Skills
            Taxonomy
          </Card.Text>
          <Button
            variant="primary"
            target="_blank"
            href="https://rapidapi.com/iys-skills-tech-iys-skills-tech-default/api/iys-skill-api"
          >
            Rapid API Link
          </Button>
          <hr></hr>
          <Card.Text>Sorry, the &quot;experiencing&quot; is limited</Card.Text>
        </Card.Body>
      </Card>
    </div>
  );
};

export default RateLimitExceed;
