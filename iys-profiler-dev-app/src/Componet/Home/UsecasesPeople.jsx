import { Col, Container, Row } from 'react-bootstrap';

const features = [
  {
    icon: 'flaticon-dashboard',
    background: '#d0faec',
    title: 'HR Managers:',
    description:
      'Skills-based practices enhance employee engagement, productivity, and retention.'
  },
  {
    icon: 'flaticon-relationship',
    background: '#ffeff8',
    title: 'Recruiters:',
    description:
      'Structured skill profiling and competency profiling improves recruitment efficiency and candidate quality.'
  },
  {
    icon: 'flaticon-solution',
    background: '#d3f6fe',
    marginright: '20px',
    title: 'Business Managers:',
    description:
      'Skills-based planning yields better Human Capital returns.'
  },
  {
    icon: 'flaticon-system',
    background: '#fff5d9',
    title: 'Learning & Development Personnel:',
    description:
      'Skill Profiling, and subsequent Skill Gap Analysis targets learning programs and improves training ROI.'
  }
];

const Usecases = () => (
  <section id="useCases">
    <Container>
      <Row className="justify-content-center text-center">
        <Col lg="8">
          <div className="mb-5">
              <h3 className="font-w-4 d-block">
                For People Practitioners
              </h3>
          </div>
        </Col>
      </Row>
      <Row>
        {features.map((feature, index) => (
          <Col lg="5" md="5" key={index} className="mt-5 mx-auto">
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
              <div style={{ marginRight: feature.marginright }}>
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
