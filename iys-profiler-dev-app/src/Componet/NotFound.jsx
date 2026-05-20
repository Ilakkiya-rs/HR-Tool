import Link from 'next/link';
import notFoundImage from '../assets/images/alterImages/404.png';

const NotFound = () => (
    <section className="custom-py-1 position-relative hero-shape overflow-hidden hero-bg">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-12 col-lg-5 col-xl-6 order-lg-2 mb-8 mb-lg-0">
            {/* <!-- Image --> */}
            <img
              src={notFoundImage.src}
              className="img-fluid lighten-image"
              alt="..."
            />
          </div>
          <div className="col-12 col-lg-7 col-xl-6 text-center">
            <h1 className="mb-5 fw-light">Oops! Page Not Found</h1>
            <p className="lead mb-0">
              <Link href="/">
                <button className="btn btn-primary">Get back to Home</button>
              </Link>
            </p>
          </div>
          {/* <div className="col-12 col-lg-7 col-xl-6 order-lg-1">
                            <h1 className="display-4 mb-3">
                                Winck Your App <span className="font-w-7">Batter & Faster</span>
                            </h1>
                            <p className="lead text-muted mb-4">We use the latest technologies it voluptatem accusantium doloremque laudantium. Build a Beautiful, Clean & Modern Design website with flexible Bootstrap components.</p>
                            <div className="btn btn-sm btn-primary text-start me-1"> <i className="la la-apple me-2 ic-2x d-inline-block"></i>
                                <div className="d-inline-block"> <small className="d-block">Available On The</small>
                                    App Store</div>
                            </div>
                            <div className="btn btn-sm btn-dark text-start"> <i className="la la-android me-2 ic-2x d-inline-block"></i>
                                <div className="d-inline-block"> <small className="d-block">Android App On</small>
                                    Google Play</div>
                            </div>
                        </div> */}
        </div>
        {/* <!-- / .row --> */}
      </div>
      {/* <!-- / .container --> */}
    </section>
  )

export default NotFound;
