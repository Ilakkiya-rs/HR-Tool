import challenge from '../../../assets/images/alterImages/challengesSKILLS.png';
import consult from '../../../assets/images/alterImages/consult.png';

const AlterContentOne = () => (
  <>
    {/* one */}
    <section className="py-5 my-5">
      <div className="container">
        <div className="d-flex flex-column flex-lg-row align-items-center justify-content-between">
          <div className="col-12 col-lg-7 mb-5 mb-lg-0 d-flex align-items-center justify-content-start">
            <img
              src={challenge.src}
              alt="Image1"
              className="img-fluid rounded"
            />
          </div>
          <div className="col-12 col-lg-5">
            <div className="mb-5">
              <h2 className="lh-base">
                Challenges with impelementing Skills Management systems and
                processes
              </h2>
              <p className="lead mb-4 lh-lg">
                HR is not well equipped to handle the hard skills as much as it
                is able to on the soft skills.
                <br />
                The consulting companies with expertise on “skills” (or
                competencies) are very expensive.
                <br />
                Very few systems focused on skills management.
              </p>
              <h3>IYS Helps HR and organization with these challenges</h3>
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
                Why IYS for skills management consulting?
              </h2>
              <div className="lead mb-4 lh-lg">
                <ol>
                  <li>
                    Probably the most knowledgable on skills area, with over a
                    decade focused research on skills across domains and
                    industries
                  </li>
                  <li>
                    Very low cost compare to any other consulting service
                    providers
                  </li>
                  <li>
                    <b className='fw-bold'>&ldquo;Productised&ldquo;</b> solution that can be easily with little
                    time be customized for your organization and the roles in
                    your organization
                  </li>
                </ol>
              </div>
            </div>
          </div>
          <div className="col-12 col-lg-7 mb-5 mb-lg-0 d-flex align-items-center justify-content-end">
            <img
              src={consult.src}
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
