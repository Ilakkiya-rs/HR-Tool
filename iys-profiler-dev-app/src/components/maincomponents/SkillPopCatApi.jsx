'use client';

import { Container, Card } from 'react-bootstrap';

import PopularCat from '../PopularCat';
import SearchBar from '../SearchBar';
import SearchAddedTree from '../subcomponents/SearchAddedTree';

const SkillPopCatApi = () => (
  <Container>
    <Card className="mt-3">
      <Card.Body>
        <Card.Title>About &quot;Skills Graph API&quot;</Card.Title>
        <hr />
        <Card.Text>
          IYS Skills Graph API is a rich resource for helping users select
          skills. They have option to browse based on functional areas and make
          selections. The skills are meticulously organized at the backend
          Skills Taxonomy to enable a comprehensive and rich selection of skills
          by users
        </Card.Text>
        <Card.Text>Experience the Skills Graph API below</Card.Text>
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
    <SearchAddedTree />
    <PopularCat />
  </Container>
);

export default SkillPopCatApi;
