import React from 'react';
import { Row, Col } from 'react-bootstrap';

const featuresData = [
  {
    icon: 'flaticon-prototype-1',
    title: 'Streamlining',
    description: 'Signification Reduction in time to Hire.'
  },
  {
    icon: 'flaticon-lightbulb',
    title: 'Elevation',
    description: 'Drastic improvement in quality of hiring.'
  },
  {
    icon: 'flaticon-friendship',
    title: 'Cognizant',
    description: 'Intelligent decisions on hiring.'
  }
];

const Outcomes = () => (
  <section>
    <div className="container">
      <Row className="align-items-center">
        <Col lg="4">
          <div>
            <h2 className="mb-0">
              <span className="font-w-4 d-block">Outcomes </span> with IYS
            </h2>
          </div>
        </Col>
      </Row>
      <Row className="align-items-center mt-6">
        {featuresData.map((feature, index) => (
          <Col key={index} lg="4" md="6" mt-lg="0">
            <div className="p-5" style={{ backgroundColor: '#d0faec' }}>
              <div className="f-icon">
                {' '}
                <i className={feature.icon} />
              </div>
              <h5 className="mt-4 mb-3">{feature.title}</h5>
              <p className="mb-0" style={{ height: '50px' }}>
                {feature.description}
              </p>
            </div>
          </Col>
        ))}
      </Row>
    </div>
  </section>
);

export default Outcomes;
