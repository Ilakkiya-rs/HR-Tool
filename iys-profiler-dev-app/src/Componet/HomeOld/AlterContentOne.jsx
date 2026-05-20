import Numbers from '@/Componet/Home/Numbers';
import employeeSkillsImg from '../../assets/images/alterImages/employeeSkills.png';
import esmSolution from '../../assets/images/alterImages/esmSolution.png';

const AlterContentOne = () => (
  <>
    {/* one */}
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

    <Numbers />

    <section className="py-5 my-5">
      <div className="container">
        <div className="d-flex flex-column-reverse flex-lg-row align-items-center justify-content-between">
          <div className="col-12 col-lg-5">
            <div className="mb-5">
              <h2 className="lh-base">API and Web plugin</h2>
              <p className="lead mb-4 lh-lg">
                IYS provides API on the Skills Taxonomy and a webplugin on the
                Skills Profiler that you can integrate with your HR Tech
                application with data of your users residing at your end.
              </p>
            </div>
          </div>
          <div className="col-12 col-lg-7 mb-5 mb-lg-0 d-flex align-items-center justify-content-end">
            <img
              src={esmSolution.src}
              alt="Image1"
              className="img-fluid rounded"
            />
          </div>
        </div>
      </div>
    </section>
  </>
);

export default AlterContentOne;
