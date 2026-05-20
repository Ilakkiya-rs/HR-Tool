import { Col, Container, Row } from 'react-bootstrap';

const features = [
  {
    icon: 'flaticon-dashboard',
    background: '#d0faec',
    title: 'Learning Management Systems (LMS):',
    description:
      'Profile users skills and recommend personalized learning programs.'
  },
  {
    icon: 'flaticon-relationship',
    background: '#ffeff8',
    title: 'Recruitment Systems / Job Portals:',
    description:
      'Enable structured skill profiling of jobs and candidates to improve match quality.'
  },
  {
    icon: 'flaticon-solution',
    background: '#d3f6fe',
    marginright:'30px',
    title: 'Workforce Planning / Resource Planning:',
    description:
      'Identify and match skills for optimal resource allocation.'
  },
  {
    icon: 'flaticon-system',
    background: '#fff5d9',
    title: 'HRIS / HRMS:',
    description:
      'Link skills profiles to compensation, performance, and career planning.'
  }
];

const Usecases = () => (
  <section id="useCases">
    <Container>
      <Row className="justify-content-center text-center">
        <Col lg="8">
          <div className="mb-5">
            <h2 className="mb-0 lh-base">
              Use Cases of IYS Skills-Centric Solution
            </h2>
            <h3 className="font-w-4 d-block mt-5">
              For HR Tech              
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
              <div style={{marginRight: feature.marginright}}>
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
