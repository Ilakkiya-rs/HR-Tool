import benefitsImg from '../../../assets/images/alterImages/Logo512.png';

const Benefits = () => (
  <section>
    <div className="container">
      <div className="row justify-content-between align-items-center mb-lg-0">
        <div className="col-lg-6 col-md-5">
          <div>
            <h2 className="font-w-4">
              <span className="font-w-4 d-block">
                IYS offers a suite of skills solutions.{' '}
              </span>
              You can opt for the one that is right for you.
            </h2>
          </div>
        </div>
        <div className="col-lg-4 col-md-7">
          <div className="p-5 active position-relative">
            <img
              src={benefitsImg.src}
              alt="Image1"
              className="img-fluid rounded"
            />
          </div>
        </div>
      </div>
      <div className="row mt-lg-n5 align-items-center">
        <div className="col-lg-6 col-md-6 mb-lg-0">
          <div className="py-3 py-lg-5 position-relative">
            <h5 className="mt-4 mb-3">Skills Taxonomy/ Skills Profiler</h5>
            <p className="mb-0 lh-lg">
              If you are already having systems to track people or projects or HR or hiring, but feel they are inadequate on skills, you can integrate the Skills Taxonomy or the Skills Profiler with the systems to ensure skills becomes an additional variable on which data is collected, processed and reported
              <br />
              IYS provides APIs and support to integrate the Skills Taxonomy or the Skills Profiler.
            </p>
          </div>
        </div>
        <div className="col-lg-6 col-md-6 mb-lg-0">
          <div className="py-3 py-lg-5 position-relative">
            <h5 className="mt-4 mb-3">Skills Management SaaS Application</h5>
            <p className="mb-0 lh-lg">
              This is a simple, no-frills application on top of the Skills Taxonomy/ Skills Profiler. With this skills management application, an IT and Professional Services company can perform Skills Profiling of jobs, Skills Profiling of employees or resources, Skills Inventory, Skills Gap Analysis, Identification of people with the best fit for required skills, skills matching in recruitment, and more.
              <br />
              We will support you in case integrations to other applications are required
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default Benefits;
