import { Col, Container, Row } from 'react-bootstrap';

// import img1 from '@/assets/images/client/01.png';
// import img2 from '@/assets/images/client/02.png';
// import img3 from '@/assets/images/client/03.png';
// import img4 from '@/assets/images/client/04.png';
// import img5 from '@/assets/images/client/05.png';
// import img6 from '@/assets/images/client/06.png';
// import img7 from '@/assets/images/client/07.png';
// import img8 from '@/assets/images/client/08.png';
// import img9 from '@/assets/images/client/09.png';
// import img10 from '@/assets/images/client/10.png';
// import img11 from '@/assets/images/client/11.png';
// import img12 from '@/assets/images/client/12.png';
// import img13 from '@/assets/images/client/13.png';
// import img14 from '@/assets/images/client/14.png';
// import img15 from '@/assets/images/client/15.png';
// import img16 from '@/assets/images/client/16.png';

// const images = {
//   1: img1.src,
//   2: img2.src,
//   3: img3.src,
//   4: img4.src,
//   5: img5.src,
//   6: img6.src,
//   7: img7.src,
//   8: img8.src,
//   9: img9.src,
//   10: img10.src,
//   11: img11.src,
//   12: img12.src,
//   13: img13.src,
//   14: img14.src,
//   15: img15.src,
//   16: img16.src
// };

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

const FeatureL3 = () => {
  return (
    <section>
      <Container>
        <Row className="justify-content-center text-center">
          <Col lg="8">
            <div className="mb-5">
              <h2 className="mb-0 lh-base">
                <span className="font-w-4 d-block">Use cases</span> Skills
                Profiles of people and jobs created using IYS Skills Profile has
                immense benefits
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
                    <i className={`${feature.icon}`}></i>
                    {/* <img src={images[index + 9]} alt="" /> */}
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
};

export default FeatureL3;
