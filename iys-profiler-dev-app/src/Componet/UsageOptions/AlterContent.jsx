import Link from 'next/link';
import methodology from '../../assets/images/alterImages/methodology.png';
import profillerPlugin from '../../assets/images/alterImages/profillerPlugin.png';
import databaseImg from '../../assets/images/alterImages/database.png';

const AlterContent = () => (
  <>
    {/* one */}
    <section className="py-5 my-5">
      <div className="container">
        <div className="d-flex flex-column flex-lg-row align-items-center justify-content-between">
          <div className="col-12 col-lg-7 mb-5 mb-lg-0 d-flex align-items-center justify-content-start">
            <img src={methodology.src} alt="Image1" className="img-fluid rounded" />
          </div>
          <div className="col-12 col-lg-5">
            <div className="mb-5">
              <h2 className="lh-base">Skills Taxonomy API</h2>
              <p className="lead mb-4 lh-lg">
                The Skills Taxonomy Restful API provides several endpoints - all
                that you experience in the Skills Profiler. These include Search
                on skills, related skills, rating scale, descriptions and
                others. Developers can choose the endpoints they desire and
                build their own frontend based on their use case
              </p>
              <div className="mt-5">
                <Link
                  target="_blank"
                  href="https://docs.iysskillstech.com/category/iys-api"
                  className="btn btn-primary px-4 py-2 fs-5 shadow"
                >
                  Check API Documentation
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section className="py-5 my-5">
      <div className="container">
        <div className="d-flex flex-column-reverse flex-lg-row align-items-center justify-content-between">
          <div className="col-12 col-lg-5">
            <div className="mb-5">
              <h2 className="lh-base">
                IYS Skills Profiler web component / plugin
              </h2>
              <p className="lead mb-4 lh-lg">
                If you want to add the “Skills Profiler” as a component in your
                application, so that users can interact with it to add skills to
                their profiles or job descriptions, you can use the skills
                profiler web component written in HTML/CSS/JS
              </p>
              <p className="lead mb-4 lh-lg">
                The user data from the web component is rendered as JSON output
                that can be stored at your end (we dont get your user data)
              </p>
              <div className="mt-5">
                <Link
                  target="_blank"
                  href="https://docs.iysskillstech.com/category/plugin"
                  className="btn btn-primary px-4 py-2 fs-5 shadow"
                >
                  Check Plugin Documentation
                </Link>
              </div>
            </div>
          </div>
          <div className="col-12 col-lg-7 mb-5 mb-lg-0 d-flex align-items-center justify-content-end">
            <img
              src={profillerPlugin.src}
              alt="Image1"
              className="img-fluid rounded"
            />
          </div>
        </div>
      </div>
    </section>

    {/* two */}
    <section className="py-5 my-5">
      <div className="container">
        <div className="d-flex flex-column flex-lg-row align-items-center justify-content-between">
          <div className="col-12 col-lg-7 mb-5 mb-lg-0 d-flex align-items-center justify-content-start">
            <img
              src={databaseImg.src}
              alt="Image1"
              className="img-fluid rounded"
            />
          </div>
          <div className="col-12 col-lg-5">
            <div className="col-12">
              <h2 className="lh-base">Skills Database</h2>
              <p className="lead mb-4 lh-lg">
                Based on your use case we can provide extract of the dataset in
                csv format. However, we offer this option on a select basis i.e.
                based on the company profile. Write to us sharing your use case.
                We will carve out the appropriate dataset for you.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </>
);

export default AlterContent;
