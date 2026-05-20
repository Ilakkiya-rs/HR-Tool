import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const features = [
  {
    icon: 'flaticon-dashboard',
    background: '#d0faec',
    title: 'Skill Matching',
    description:
      'Use the skills profiles for hiring and redeployment within the organization.'
  },
  {
    icon: 'flaticon-relationship',
    background: '#ffeff8',
    title: 'Skill-aligned Training',
    description:
      'Tie training and learning programs that are most suited for employees based on skills gaps.'
  },
  {
    icon: 'flaticon-solution',
    background: '#d3f6fe',
    title: 'Competency-based Hiring',
    description:
      'Hire more accurately and make better decisions by comparing the skills of different candidates.'
  },
  {
    icon: 'flaticon-system',
    background: '#fff5d9',
    title: 'Skill-enhanced customer acquisition',
    description:
      'Enable sales and other teams to gain visibility into skills for better customer acquisition.'
  },
  {
    icon: 'flaticon-friendship',
    background: '#fdf9ee',
    title: 'Skill-resource Strategy',
    description:
      'Make strategic decisions on developing skills internally versus hiring for needed skills.'
  }
];

const UseCases = () => (
  <section>
    <Container>
      <Row className="justify-content-center text-center">
        <Col lg="8">
          <div className="mb-4">
            <h2 className="mb-0 lh-base">
              <span className="font-w-4 d-block">Use cases</span> Here are top
              five use cases of IT Skills Taxonomy from IYS
            </h2>
          </div>
          <p className="mb-0 lh-lg">
            Create an employee skills profile for a detailed understanding of IT
            skills proficiencies. Likewise, create skills profiles for the jobs.
            With this rich skills data, you can do the following:
          </p>
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

export default UseCases;
