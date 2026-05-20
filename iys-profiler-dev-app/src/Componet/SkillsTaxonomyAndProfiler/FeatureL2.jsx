import CountUp from 'react-countup';

const countersData = [
  {
    value: 335000,
    label: 'Unique “skills” Terms',
    duration: 5
  },
  {
    value: 1650000,
    label: 'Associations',
    duration: 5
  },
  {
    value: 6500,
    label: 'Skills Groups',
    duration: 5
  }
];

const FeatureL2 = () => {
  return (
    <section>
      <div className="container">
        <div className="row justify-content-center text-center">
          <div className="col-lg-8">
            <div className="mb-5">
              <h2 className="mb-5 mb-md-0 lh-base">
                <span className="font-w-4 d-block">Some numbers on </span> IYS
                Skills Taxonomy
              </h2>
            </div>
          </div>
        </div>
        <div className="row align-items-center text-center">
          {countersData.map((counter, index) => (
            <div key={index} className="col-12 col-sm-6 col-lg-4">
              <div className="counter">
                <div className="counter-desc text-dark mb-4 mb-md-0">
                  <CountUp
                    start={0}
                    end={counter.value}
                    duration={counter.duration}
                    suffix="+"
                    className="count-number h2 text-primary"
                  />
                  <h6 className="text-muted mb-0">{counter.label}</h6>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureL2;
