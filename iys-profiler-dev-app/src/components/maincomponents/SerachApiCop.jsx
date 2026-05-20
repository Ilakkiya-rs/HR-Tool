'use client';

import { Container } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import SearchBar from '../SearchBar';

const SerachApiCop = () => (
  <Container>
    <Card className="mt-3">
      <Card.Body>
        <Card.Title>About &quot;Skills Search API&quot;</Card.Title>
        <hr />
        <Card.Text>
          IYS Skills Search API enables users to search and select skills. The
          skills are pulled from the rich backend Skills Taxonomy.
        </Card.Text>
        <Card.Text>Experience the IYS Skills Search API below</Card.Text>
        <Card.Text>
          <Card.Link
            href="https://rapidapi.com/iys-skills-tech-iys-skills-tech-default/api/iys-skill-api/tutorials/the-search-api"
            target="_blank"
          >
            Visit API Documentation
          </Card.Link>
          &nbsp; to learn more and trying the API for free
        </Card.Text>
      </Card.Body>
    </Card>

    <hr />
    <SearchBar cansearch={false} />
  </Container>
);

export default SerachApiCop;
