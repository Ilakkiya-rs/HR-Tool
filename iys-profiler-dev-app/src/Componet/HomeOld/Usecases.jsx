import { Col, Container, Row } from 'react-bootstrap';

const features = [
  {
    icon: 'flaticon-dashboard',
    background: '#d0faec',
    title: 'Learning Management Systems (LMS)',
    description:
      'Profile the skills of users / visitors and make personalized recommendations of learning programs.'
  },
  {
    icon: 'flaticon-relationship',
    background: '#ffeff8',
    title: 'Recruitment Systems / Job Portals',
    description:
      'Enable structured skills profiling of jobs and candidates. Significantly improve the quality of matching of the two.'
  },
  {
    icon: 'flaticon-solution',
    background: '#d3f6fe',
    title: 'Workforce Planning / Resource Planning',
    description:
      'Identify skills-matching resources within organization, plan resource movement, customer project deployment and more.'
  },
  {
    icon: 'flaticon-system',
    background: '#fff5d9',
    title: 'HRIS / HRMS',
    description:
      'Enable link of skills profiles of employees and roles to compensation, performance, career planning and others.'
  }
];

const Usecases = () => (
  <section>
    <Container>
      <Row className="justify-content-center text-center">
        <Col lg="8">
          <div className="mb-5">
            <h2 className="mb-0 lh-base">
              <span className="font-w-4 d-block">
                Different HR Tech - Different Use Cases
              </span>{' '}
              One Solution
            </h2>
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
