'use client';

import { useEffect, useState } from 'react';

import Link from 'next/link';

const Footer1 = () => {
  const [Visible, setVisible] = useState(false);
  const handleScroll = () => {
    const scrollTop =
      (document.documentElement && document.documentElement.scrollTop) ||
      document.body.scrollTop;
    if (scrollTop > 100) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  };
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const gototop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  return (
    <>
      <footer style={{ userSelect: 'none' }} className="border-top">
        <div className="container">
          <div className="row my-5">
            <div className="col">{/* <hr className="m-0" /> */}</div>
          </div>
          <div className="row">
            <div className="col-12 col-lg-5 col-xl-4 me-auto mb-5 mb-lg-0">
              <Link
                className="footer-logo h2 text-primary mb-0 font-w-7"
                href="/"
              >
                <b>IYS</b>
                <span className="text-light font-w-4"> Skills Tech.</span>
              </Link>
              <p className="my-3">
                IYS Skills Tech seeks to enable &quot;skills-centricity&quot;
                across the talent or HR landscape. Combining AI and IYS&apos;s
                domain expertise it manages and offers rich skills data
                solutions.
              </p>
              <ul className="list-inline">
                <li className="list-inline-item">
                  <Link
                    className="border rounded px-2 py-1 text-dark"
                    target="_blank"
                    href="https://www.facebook.com/iysskillstech/"
                  >
                    <i className="la la-facebook" />
                  </Link>
                </li>
                <li className="list-inline-item">
                  <Link
                    className="border rounded px-2 py-1 text-dark"
                    target="_blank"
                    href="https://www.instagram.com/iysskilltech/"
                  >
                    <i className="la la-instagram" />
                  </Link>
                </li>
                <li className="list-inline-item">
                  <Link
                    className="border rounded px-2 py-1 text-dark"
                    target="_blank"
                    href="https://twitter.com/iysskillstech"
                  >
                    <i className="la la-twitter" />
                  </Link>
                </li>
                <li className="list-inline-item">
                  <Link
                    className="border rounded px-2 py-1 text-dark"
                    target="_blank"
                    href="https://www.linkedin.com/company/iys-skills-tech/"
                  >
                    <i className="la la-linkedin" />
                  </Link>
                </li>
              </ul>
            </div>
            <div className="col-12 col-lg-7 col-xl-8">
              <div className="d-flex flex-column flex-md-row justify-content-end">
                <div className="col-12 col-sm-3 mt-4 mt-sm-0 navbar-light">
                  <h5 className="mb-4">Use Cases</h5>
                  <ul className="list-unstyled mb-0">
                    <li className="mb-3">
                      <Link
                        className="list-group-item-action"
                        href="/use-cases/skills-gap-analysis"
                      >
                        Skills Gap Analysis
                      </Link>
                    </li>
                    <li className="mb-3">
                      <Link
                        className="list-group-item-action"
                        href="/use-cases/skills-based-hiring"
                      >
                        Skills Based Hiring
                      </Link>
                    </li>
                    <li className="mb-3">
                      <Link
                        className="list-group-item-action"
                        href="/use-cases/skills-taxonomy-for-training-providers"
                      >
                        Training Providers
                      </Link>
                    </li>
                    <li className="mb-3">
                      <Link
                        className="list-group-item-action"
                        href="/use-cases/lms-learning-management-system"
                      >
                        LMS
                        <br />
                        (Learning Management System)
                      </Link>
                    </li>
                    <li className="mb-3">
                      <Link
                        className="list-group-item-action"
                        href="/use-cases/it-and-professional-services-companies"
                      >
                        IT and Professional Services Companies
                      </Link>
                    </li>
                    <li className="mb-3">
                      <Link
                        className="list-group-item-action"
                        href="/use-cases/job-portals-and-recruitment-applications"
                      >
                        Job Portals and Recruitment Applications
                      </Link>
                    </li>
                    <li className="mb-3">
                      <Link
                        className="list-group-item-action"
                        href="/saas-application/skills-based-hiring-application"
                      >
                        Skills Based Hiring Application
                      </Link>
                    </li>
                  </ul>
                </div>
                <div className="col-12 col-sm-3 mt-4 mt-sm-0 navbar-light">
                  <h5 className="mb-4">Skills Taxonomy</h5>
                  <ul className="list-unstyled mb-0">
                    <li className="mb-3">
                      <Link
                        className="list-group-item-action"
                        onClick={gototop}
                        href="/skills-taxonomy/information-technology-skills"
                      >
                        IT Skills Taxonomy
                      </Link>
                    </li>
                    <li className="mb-3">
                      <Link
                        className="list-group-item-action"
                        onClick={gototop}
                        href="/sample-skills-profiles"
                      >
                        Sample Skills Profiles
                      </Link>
                    </li>
                    <li className="mb-3">
                      <Link
                        className="list-group-item-action"
                        onClick={gototop}
                        href="/use-cases-skills-taxonomy"
                      >
                        Use Cases of Skills Taxonomy
                      </Link>
                    </li>
                    <li className="mb-3">
                      <Link
                        className="list-group-item-action"
                        onClick={gototop}
                        href="/training-needs-analysis"
                      >
                        Training Needs Analysis
                      </Link>
                    </li>
                  </ul>
                </div>
                <div className="col-12 col-sm-3 mt-4 mt-sm-0 navbar-light">
                  <h5 className="mb-4">Learn More</h5>
                  <ul className="list-unstyled mb-0">
                    <li className="mb-3">
                      <Link
                        className="list-group-item-action"
                        onClick={gototop}
                        href="https://blog.iysskillstech.com"
                      >
                        Blog
                      </Link>
                    </li>
                    <li className="mb-3">
                      <Link
                        className="list-group-item-action"
                        onClick={gototop}
                        href="/terms-of-use"
                      >
                        Terms of Use
                      </Link>
                    </li>
                  </ul>
                </div>
                <div className="col-12 col-sm-3 mt-4 mt-sm-0 navbar-light">
                  <h5 className="mb-4">Contact</h5>
                  <div className="mb-3">
                    <p className="mb-0 text-muted">
                      <a href="mailto:connect@iysskillstech.com">
                        connect@iysskillstech.com
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row my-5">
            <div className="col">{/* <hr className="m-0" /> */}</div>
          </div>
          {/* <div className="row align-items-center mb-5">
            <div className="col-md-6">
              <b>IYS Skills Tech</b>
            </div>
            <div className="col-md-6 text-md-end mt-3 mt-md-0">
              <ul className="list-inline mb-0">
                <li className="me-3 list-inline-item">
                  <Link className="list-group-item-action" onClick={gototop} href="/terms-of-use">
                    Terms Of Use
                  </Link>
                </li>
              </ul>
            </div>
          </div> */}
        </div>
      </footer>
      <div className={`${Visible ? 'scroll-top' : ''}`}>
        <div
          style={{ userSelect: 'none' }}
          className="smoothscroll"
          onClick={gototop}
        >
          Scroll Top
        </div>
      </div>
    </>
  );
};

export default Footer1;
