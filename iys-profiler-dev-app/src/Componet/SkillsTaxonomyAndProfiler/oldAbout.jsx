import humanResourceImg from "../../assets/images/alterImages/humanResource.png";
import locationImg from "../../assets/images/alterImages/location.png";
import no1Img from "../../assets/images/alterImages/no1.png";

const AboutL1 = () => {
  return (
    <>
      {/* one */}
      <section className="py-5 my-5">
        <div className="container">
          <div className="d-flex flex-column flex-lg-row align-items-center justify-content-between">
            <div className="col-12 col-lg-7 mb-5 mb-lg-0 d-flex align-items-center justify-content-start">
              <img
                src={humanResourceImg.src}
                // src="https://placehold.co/600x400"
                alt="Image1"
                className="img-fluid rounded"
              />
            </div>
            <div className="col-12 col-lg-5">
              <div className="mb-5">
                <h2 className="lh-base">
                  <span className="font-w-4 d-block">
                    Geo data is key to Location based apps{" "}
                  </span>{" "}
                  so is Skills for HR Tech
                </h2>
                <p className="lead mb-0 lh-lg">
                  Can we imagine a location based application like a Delivery
                  app or Ride Hailing app without a Map? Maps are essential for
                  getting precise location information of the app users.
                  Likewise skills information is key to all Human Capital
                  activities - Recruitment, Talent Development, Resource
                  Planning and Allocation, Career Planning and others
                </p>
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
                  <span className="font-w-4 d-block">
                    IYS Skills Taxonomy and Profiler is to HR Tech
                  </span>{" "}
                  what Maps like Google Maps are to Location based apps
                </h2>
                <p className="lead mb-0 lh-lg">
                  Maps services like Google Maps maintain rich location
                  information and also constantly update them. And these map
                  apps integrated with the location based application, enable to
                  the applications collect precise location information of the
                  users (raid hailers, cabs, restaurants and others)
                </p>
                <p className="lead mb-0 lh-lg">
                  HR Tech - Job Portals, Professional Networking sites, Learning
                  Management Systems, Recruitment Systems or Applicant Tracking
                  Systems, Workforce Planning Systems, Talent Management systems
                  and others can similarly benefit from IYS Skills Taxonomy and
                  Profiler.
                </p>
              </div>
            </div>
            <div className="col-12 col-lg-7 mb-5 mb-lg-0 d-flex align-items-center justify-content-end">
              <img
                src={locationImg.src}
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
                src={no1Img.src}
                alt="Image1"
                className="img-fluid rounded"
              />
            </div>
            <div className="col-12 col-lg-5">
              <div className="mb-5">
                <h2 className="lh-base">
                  <span className="font-w-4 d-block">IYS is the No 1. </span> In
                  Skills Taxonomy richness
                </h2>
                <p className="lead mb-0 lh-lg">
                  curated, organized and maintained using AI and DI (Domain
                  Intelligence)
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default AboutL1;
