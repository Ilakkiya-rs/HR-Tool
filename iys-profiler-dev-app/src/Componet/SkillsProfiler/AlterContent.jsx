'use client';

const AlterContent = () => {
  const scrollToExperience = () => {
    const experienceSection = document.getElementById(
      'experience-plugin-section'
    );
    if (experienceSection) {
      const offset = 150;
      const scrollToPosition = experienceSection.offsetTop - offset;
      window.scrollTo({
        top: scrollToPosition,
        behavior: 'smooth'
      });
      const textInput = experienceSection.querySelector('input[type="text"]');
      if (textInput) {
        textInput.focus();
      }
    }
  };
  return (
    <section>
      <div className="container">
        <div className="d-flex flex-column flex-lg-row align-items-center justify-content-between">
          <div className="col-12">
            <div className="mb-5">
              <p className="lead mb-0 lh-lg" style={{ fontSize: '25px' }}>
                In order to get a feel of the converage and organization of
                &quot;skills&quot; in{' '}
                <b className="fw-bold">IYS Skills Taxonomy</b> <br />
                please{' '}
                <span
                  style={{ cursor: 'pointer' }}
                  className="text-primary cursor-pointer"
                  onClick={scrollToExperience}
                >
                  search for an Occupation / Role.
                </span>
              </p>
              <br />
              <p className="lead mb-0 lh-lg" style={{ fontSize: '25px' }}>
                In case you want to experience IYS Skills Profiler where you can
                select skills, rate on proficiencies in the skills and save them
                to create a skills profile, please visit this linke -{' '}
                <a
                  target="_blank"
                  href="https://myskillsplus.com"
                  rel="noreferrer"
                >
                  www.myskillsplus.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AlterContent;
