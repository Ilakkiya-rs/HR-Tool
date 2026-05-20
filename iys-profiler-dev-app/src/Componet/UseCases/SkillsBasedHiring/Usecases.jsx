import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const features = [
  {
    icon: 'flaticon-dashboard',
    background: '#d0faec',
    title: 'Skills Inventorying',
    description:
      'Inventory or get complete stock of the skills in your company. Make business decisions with rich data on skills.'
  },
  {
    icon: 'flaticon-relationship',
    background: '#ffeff8',
    title: 'Career Development',
    description:
      'Understand possibilities of career paths based on the skills profile of an individual and the skills profiles of the various roles in the company.'
  },
  {
    icon: 'flaticon-solution',
    background: '#d3f6fe',
    title: 'Employee Development',
    description:
      'Personalize development plans (instead of following a one size fits all) based on the skills gap of each individual employee.'
  },
  {
    icon: 'flaticon-system',
    background: '#fff5d9',
    title: 'Resource Planning',
    description:
      'Make resource allocation, employee movement and succession plan a data driven exercise with in depth analysis of skills data.'
  },
  {
    icon: 'flaticon-friendship',
    background: '#fdf9ee',
    title: 'Recruitment',
    description:
      'Improve recruitment productivity and efficiency with precision in “skills” matching and analysis of jobs and prospects.'
  }
];

const Usecases = () => (
  <section>
    <Container>
      <Row className="justify-content-center text-center">
        <Col lg="8">
          <div className="mb-5">
            <h2 className="mb-0 lh-base">
              <span className="font-w-4 d-block">Use cases</span> for
              organizations
            </h2>
          </div>
        </Col>
      </Row>
      <Row>
        {features.map((feature, index) => (
          <Col lg="4" md="6" key={index} className="mt-5">
            <div className="d-flex justify-content-between">
              <div className="me-3">
                <div
                  className="f-icon-s p-3 rounded"
                  style={{ background: feature.background }}
                >
                  <i className={`${feature.icon}`} />
                  <img
                    src={`../../assets/images/client/${index + 9}.png`}
                    alt=""
                  />
                </div>
              </div>
              <div>
                <h5 className="mb-2 lh-lg">{feature.title}</h5>
                <p className="mb-0 lh-lg">{feature.description}</p>
              </div>
            </div>
          </Col>
        ))}
      </Row>
    </Container>
  </section>
);

export default Usecases;
