import { Col, Container, Row } from 'react-bootstrap';

const features = [
  {
    icon: 'flaticon-dashboard',
    background: '#d0faec',
    title: 'Pricing',
    description:
      'Pay per use. Buy credits for units. Pay for transactions such as creation of Job Skills Profiles, Number of applicants applying. Contact for pricing details',
  },
  {
    icon: 'flaticon-relationship',
    background: '#ffeff8',
    title: 'Free Credit',
    description:
      'Get 100 free credits on a trial basis without any cost or charge. Experience it now!'
  }
];

const Usecases = () => (
  <section>
    <Container>
      <Row className="justify-content-center text-center">
        <Col lg="8">
          <div className="mb-5">
            <h2 className="mb-0 lh-base">Pricing</h2>
          </div>
        </Col>
      </Row>
      <Row>
        {features.map((feature, index) => (
          <Col lg="6" md="6" key={index} className="mt-5">
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
