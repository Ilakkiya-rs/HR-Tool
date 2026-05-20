import benefitsImg from '../../assets/images/alterImages/benefits2.png';

const Benefits = () => (
    <section>
        <div className="container">
          <div className="row justify-content-between align-items-center mb-lg-0">
            <div className="col-lg-6 col-md-5">
              <div>
                <h2>
                  <span className="font-w-4 d-block">How to benefit from </span>
                  IYS&apos;s Skills Taxonomy and Profiler
                </h2>
                <br />
                <p className="mb-0 lh-lg">
                  Similar to how maps like Google Maps are integrated into
                  location-based applications, you can integrate the IYS Skills
                  Taxonomy and Profiler into your HR applications
                </p>
                <p className="mb-0 lh-lg fw-bold">There are two options:</p>
                <br />
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
                <h5 className="mt-4 mb-3">Skills Taxonomy API</h5>
                <p className="mb-0 lh-lg">
                  Use the API to call for skills, related skills, and more.
                  Build your own frontend that users interact with.
                </p>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 mb-lg-0">
              <div className="py-3 py-lg-5 position-relative">
                <h5 className="mt-4 mb-3">Skills Profiler Plugin</h5>
                <p className="mb-0 lh-lg">
                  Utilize the web plugin (HTML/CSS/JS) script to integrate the
                  frontend we have carefully crafted into your application.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
  )

export default Benefits;
