import employeeSkillsImg from '../../../assets/images/alterImages/esmSolution.png';
import otherHighlights from '../../../assets/images/alterImages/otherHighlights.png';

const AlterContentTwo = () => (
  <>
    {/* one */}
    <section className="py-5 my-5">
      <div className="container">
        <div className="d-flex flex-column flex-lg-row align-items-center justify-content-between">
          <div className="col-12 col-lg-5">
            <div className="mb-5">
              <h2 className="lh-base">
                Other highlights of skills management consulting
              </h2>
              <div className="lead mb-4 lh-lg">
                <ol>
                  <li>
                    Industry freindly - IYS’s expertise covers a range of
                    functions and industries including Information Technology,
                    Banking, Healthcare, Manufacturing and others
                  </li>
                  <li>
                    Size friendly - Whether your organization is a large one or
                    a medium size one, IYS can work with you
                  </li>
                  <li>
                    HR friendly - The goal of IYS’s skills management consulting
                    exercise is to train and equip HR to take on “skills
                    management” on their own after the consulting exercise
                  </li>
                </ol>
              </div>
            </div>
          </div>
          <div className="col-12 col-lg-7 mb-5 mb-lg-0 d-flex align-items-center justify-content-start">
            <img
              src={otherHighlights.src}
              alt="Image1"
              className="img-fluid rounded"
            />
          </div>
        </div>
      </div>
    </section>

    <section className="py-5 my-5">
      <div className="container">
        <div className="d-flex flex-column flex-lg-row align-items-center justify-content-between">
          <div className="col-12 col-lg-7 mb-5 mb-lg-0 d-flex align-items-center justify-content-start">
            <img
              src={employeeSkillsImg.src}
              alt="Image1"
              className="img-fluid rounded"
            />
          </div>
          <div className="col-12 col-lg-5">
            <div className="mb-5">
              <h2 className="lh-base">IYS Skills Taxonomy and Profiler</h2>
              <p className="lead mb-4 lh-lg">
                A rich database of skills, curated and organized using AI and HI
                (Human Intelligence - our skills domain expertise), and one that
                is constantly updated
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </>
);

export default AlterContentTwo;
