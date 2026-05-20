'use client';

import Link from 'next/link';
import image from '../../assets/images/hero/02.png';

const HerosectionL4 = () => {
  return (
    <>
      <section className="custom-py- position-relative hero-shape overflow-hidden hero-bg">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-12 col-lg-4 col-xl-6 order-lg-2 mb-8 mb-lg-0">
              {/* <!-- Image --> */}
              <img
                style={{ width: '631px', height: 'auto' }}
                src={image.src}
                className="img-fluid lighten-image"
                alt="..."
              />
            </div>

            <div className="col-12 col-lg-8 col-xl-6">
              <h1 className="mb-4 font-w-4">
                Enabling <br />
                <span
                  // style={{ color: '#4a459b' }}
                  className="text-primary fw-regular"
                >
                  Skills-Based People Practices
                </span>
                <br />
                with Skills-Centric Solutions
              </h1>
              <div className="mb-0" style={{ marginTop: '20px' }}>
                <p className="lead mb-4 lh-lg">
                  At IYS, we empower organizations to adopt skills-based people practices through our skills-centric solutions, including IYS Skills Taxonomy, IYS Skills Profiler, and IYS Skills Management. These tools facilitate skill profiling and competency profiling, enriching HR functions and ensuring a more efficient and equitable workforce.
                </p>
                <ul className="lead mb-0 lh-lg" style={{ fontSize: '21px' }}>
                  <li className="fw-bold mb-3">
                    <Link
                      href="#skillsTaxonomy"
                      style={{
                        textDecoration: 'underline',
                        textUnderlineOffset: '5px'
                      }}
                    >
                      IYS Skills Taxonomy
                    </Link>
                  </li>
                  <li className="fw-bold mb-3">
                    <Link
                      href="#skillsProfiler"
                      style={{
                        textDecoration: 'underline',
                        textUnderlineOffset: '5px'
                      }}
                    >
                      IYS Skills Profiler
                    </Link>
                  </li>
                  <li className="fw-bold mb-3">
                    <Link
                      href="#skillsManagement"
                      style={{
                        textDecoration: 'underline',
                        textUnderlineOffset: '5px'
                      }}
                    >
                      IYS Skills Management
                    </Link>
                  </li>
                </ul>
              </div>
              {/* <blockquote className="mt-3 mb-0">
                <div className="mb-5">
                  <p
                    className="lead mb-0 ps-1 mb-3"
                    style={{ fontSize: '25px' }}
                  >
                    Enrich your Organization’s people/HR functions with a data
                    driven and skills-centric approach - with richest
                  </p>
                  <p
                    className="lead mb-0 ps-1 mb-3 fw-bold"
                    style={{ fontSize: '25px' }}
                  >
                    Skills Solutions from IYS Skills Tech
                  </p>
                  <ul
                    className="lead mb-0 lh-lg ps-5"
                    style={{ fontSize: '21px' }}
                  >
                    <li>
                      <Link
                        href="#skillsTaxonomy"
                        style={{
                          textDecoration: 'underline',
                          textUnderlineOffset: '5px'
                        }}
                      >
                        IYS Skills Taxonomy
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="#skillsProfiler"
                        style={{
                          textDecoration: 'underline',
                          textUnderlineOffset: '5px'
                        }}
                      >
                        IYS Skills Profiler
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="#skillsManagement"
                        style={{
                          textDecoration: 'underline',
                          textUnderlineOffset: '5px'
                        }}
                      >
                        IYS Skills Management
                      </Link>
                    </li>
                  </ul>
                </div>
              </blockquote> */}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HerosectionL4;
