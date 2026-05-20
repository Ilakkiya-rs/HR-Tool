import Link from 'next/link';

const GlobalHero = ({
  title,
  subtitle,
  description,
  button1Text,
  button1Link,
  button2Text,
  button2Link,
  imageSrc
}) => {
  return (
    <>
      <div className="container">
        <section className="px-3 px-lg-5" style={{ paddingBottom: "0px"}}>
          <h1 className="mb-4 fw-medium text-center" style={{ fontSize: '45px' }}>
            {title}
            <div className="text-primary fw-regular">{subtitle}</div>
          </h1>
          <div className="mb-5">
            <div className="lead mb-0 lh-lg text-center">{description}</div>
          </div>
          <div className="d-flex flex-column flex-lg-row align-items-center justify-content-center gap-3">
            {button1Text && button1Link && (
              <Link href={button1Link}>
                <button
                  type="submit"
                  className="px-3 py-2 fs-5 shadow rounded btn btn-primary bg-primary text-white"
                >
                  {button1Text}
                </button>
              </Link>
            )}
            {button2Text && button2Link && (
              <>
                or
                <Link href={button2Link}>
                  <button
                    type="submit"
                    className="px-3 py-2 fs-5 shadow rounded btn btn-primary"
                  >
                    {button2Text}
                  </button>
                </Link>
              </>
            )}
          </div>
          {imageSrc && (
            <>
              <br />
              <div className="d-flex justify-content-center gap-3">
                <img
                  style={{ width: '631px', height: 'auto' }}
                  src={imageSrc}
                  className="img-fluid"
                  alt={title + ' image'}
                />
              </div>
            </>
          )}
        </section>
      </div>
    </>
  );
};

export default GlobalHero;
