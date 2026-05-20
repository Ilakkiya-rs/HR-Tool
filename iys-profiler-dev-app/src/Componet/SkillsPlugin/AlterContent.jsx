'use client';

import Link from 'next/link';
import { Button } from 'react-bootstrap';

const AlterContent = () => {
  const goToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth' // Optional: smooth scrolling animation
    });
  };
  return (
    <>
      {/* one */}
      <section className="py-5 my-5">
        <div className="container">
          <h2 className="fw-light">Two Versions</h2>
          <div className="row mt-5">
            <div className="col-lg-6 mb-5">
              <div className="card border-primary">
                <div className="card-body">
                  <div className="mb-5">
                    <h3 className="lh-base fw-light">
                      IYS Skills Profiler Plugin{' '}
                      <span className="fw-bold">With</span> Proficiency
                      Rating
                    </h3>
                    <Link href="https://docs.iysskillstech.com/plugin/with-proficiency-rating">
                      <Button
                        variant="primary"
                        onClick={goToTop}
                        type="submit"
                        className="mt-3"
                      >
                        Documentation
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6 mb-5">
              <div className="card border-success">
                <div className="card-body">
                  <div className="mb-5">
                    <h3 className="lh-base fw-light">
                      IYS Skills Profiler Plugin{' '}
                      <span className="fw-bold">With</span> Experience Profiler
                    </h3>
                    <Link href="https://docs.iysskillstech.com/plugin/skills-profiler">
                      <Button
                        variant="success"
                        onClick={goToTop}
                        type="submit"
                        className="mt-3"
                      >
                        Documentation
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="d-flex flex-column-reverse flex-lg-row align-items-center justify-content-between">
            <div className="col-12">
              <div className="mb-5">
                <p className="lead mb-0 lh-lg">
                  In both these cases, when embedded into your application, the
                  users of your application will be able to search and select
                  skills.
                </p>
                <p className="lead mb-0 lh-lg">
                  The skills selected by the user are rendered in JSON format
                  and you can save the skills information of the users at your
                  end.
                </p>
                <p className="lead mb-0 lh-lg">
                  In the case of SKills Profiler plugin with proficiency rating,
                  the users can, further to selecting skills, add proficiency
                  levels to the skills and also give comments to the skills.
                  These again are provided as JSON output that can be saved at
                  the application end.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AlterContent;
