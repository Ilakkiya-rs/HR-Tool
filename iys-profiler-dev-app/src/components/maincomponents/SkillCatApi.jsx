'use client';

import { Container } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import SearchBar from '../SearchBar';
import SearchAddedTree from '../subcomponents/SearchAddedTree';

const SkillCatApi = () => (
  <Container>
    <Card className="mt-3">
      <Card.Body>
        <Card.Title>About &quot;Skills Categories API&quot;</Card.Title>
        <hr />
        <Card.Text>
          IYS Skills Categories API helps applications better engage with users.
          When users select a skill you can present to them skills from the
          related category. For example if one selects Python, you can present
          the user other Programming Languages.
        </Card.Text>
        <Card.Text>Experience the IYS Skills Category API below</Card.Text>
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
    <SearchBar cansearch />
    <SearchAddedTree norate />
  </Container>
);

export default SkillCatApi;
