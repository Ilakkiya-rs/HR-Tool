'use client';

import image from '../../../assets/images/hero/consultancy.svg';

const HerosectionL4 = () => {
  return (
    <>
      <section className="custom-py- position-relative hero-shape overflow-hidden hero-bg">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-12 col-lg-5 col-xl-6 order-lg-2 mb-8 mb-lg-0">
              {/* <!-- Image --> */}
              <img
                src={image.src}
                className="img-fluid lighten-image"
                alt="..."
              />
            </div>
            <div className="col-12 col-lg-7 col-xl-6">
              <h1 className="mb-5 fw-light">
                <span className="text-primary fw-regular">
                  IYS’s helps organizaiton
                </span>{' '}
                put in place Processes and systems on Skills Management.
              </h1>
              <blockquote className="mt-5 mb-0 ps-3 border-start border-primary">
                <p className="lead mb-4 lh-lg">
                  Benefit from our wealth of expertise in skills sapce
                </p>
              </blockquote>
            </div>
          </div>
          {/* <!-- / .row --> */}
        </div>
        {/* <!-- / .container --> */}
      </section>
    </>
  );
};

export default HerosectionL4;
