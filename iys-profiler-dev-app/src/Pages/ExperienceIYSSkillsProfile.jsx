'use client';

import GlobalHero from '@/Componet/GlobalHero';
import Link from 'next/link';
import Newsletter from '../Componet/Newsletter';
import { useEffect } from 'react';

const ExperienceIYSSkillsProfile = () => {
  useEffect(() => {
    localStorage.setItem(
      'iys',
      JSON.stringify({
        tap: 'all',
        profile_view: 'all',
        isEdit: true,
        isDelete: true,
        doughnt:true,
        experience:true
      })
    );
  }, []);

  return (
    <>
      <GlobalHero
        title={
          <div>
            Experience the Rich<br />{' '}
            <span className="text-primary">
              Skills Taxonomy and Skills Profiler
            </span>{' '}
            <br /> From IYS
          </div>
        }
        description={
          <p>
            IYS has meticulously curated and organized skills across various industries, functions, and occupations, facilitating the mapping of skills for individuals (students, employees, applicants) and jobs. The outcome is a precise, comprehensive, and easily digestible Skills Profile that can be utilized across multiple people practices, including recruitment, training, career planning, workforce planning, and more.
          </p>
        }
        // button1Link="#experience-plugin-section"
        // button1Text="Go ahead and experience it for free now"
      />

      <section id="experience-plugin-section" style={{ paddingTop: '0px' }}>
        <div className="container rounded px-0">
          <div className="d-flex flex-column align-items-center justify-content-between">
            <div className="col-12">
              <iframe
                style={{ borderRadius: '10px' }}
                src="/plugin/index.html"
                title="IYS Plugin Rating"
                height="900px"
                width="100%"
                className="shadow border ps-3"
              />
            </div>
          </div>
        </div>
      </section>
      <div className="container">
        <div className="row align-items-center">
          <div className="col-12 col-lg-7 mx-auto d-flex gap-5 flex-column">
            <br />
            <div className="d-flex flex-column">
                <h3 className="text-center fw-bold">
                  Skills Profiler backed by the rich, constantly updated Skills Taxonomy is useful
                </h3>
                <h4 className="text-center fw-bold mt-4">
                  For you 
                </h4>
                <p className="lead lh-lg text-center fw-bold">
                  Create your<a href="https://myskillsplus.com" target="_blank" rel="noopener noreferrer"> “My Skills Profile” </a>for free now
                </p>
                <h4 className="text-center fw-bold mt-4">
                  For People 
                </h4>
                <p className="lead lh-lg text-center fw-bold">
                  Practitioners (Line Managers, Business Leaders, HR)
                </p>
                <p className='lead lh-lg text-center fw-bold gap-0'>
                  <a href="https://iysskillstech.com/use-cases-skills-taxonomy" target="_blank" rel="noopener noreferrer">Read use cases</a>
                </p>
                <h4 className="text-center fw-bold mt-4">
                  For HR Tech 
                </h4>
                <p className="lead lh-lg text-center fw-bold">
                  (Product Managers, Developers)
                </p>
                <p className='lead lh-lg text-center fw-bold'>
                  <a href="https://iysskillstech.com/use-cases-skills-taxonomy" target="_blank" rel="noopener noreferrer">Read use cases</a>
                </p>
            </div>
            <hr />
            <div className="d-flex gap-3 flex-column">
              <h3 className="text-center fw-bold">
                Multiple ways in which the Skills Taxonomy and Profiler can be used
              </h3>
              <p className="lead lh-lg text-center fw-bold">
                <Link
                  href="/skills-api-plugin"
                  className="text-decoration-underline"
                >
                  Skills Taxonomy API
                </Link>
              </p>
              <p className="lead lh-lg text-center fw-bold">
                <Link
                  href="/skills-api-plugin"
                  className="text-decoration-underline"
                >
                  Skills Profiler Plugin
                </Link>
              </p>
              <p className="lead lh-lg text-center fw-bold">
                <Link
                  href="/saas-application/employee-skills-management"
                  className="text-decoration-underline"
                >
                  Employee Skills Management Application
                </Link>
              </p>
              <p className="lead lh-lg text-center fw-bold">
                <Link
                  href="/saas-application/skills-based-hiring-application"
                  className="text-decoration-underline"
                >
                  Skills Based Hiring Application
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
      <Newsletter title="Interested in how IYS can help you implement Skills Taxonomy / Skills Profiler?" />
    </>
  );
};

export default ExperienceIYSSkillsProfile;
