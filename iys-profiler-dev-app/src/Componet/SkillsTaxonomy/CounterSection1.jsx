'use client';

import React from 'react';
import CountUp from 'react-countup';

const CounterSection = () => {
  const countersData = [
    {
      value: 123000,
      label: 'Number of skills (in IT)',
      duration: 3
    },
    {
      value: 788,
      label: 'Number of categories of skills',
      duration: 3
    },
    {
      value: 543,
      label: 'Number of occupations or roles',
      duration: 3
    }
  ];

  return (
    <section>
      <div className="container">
        <div className="row justify-content-center text-center">
          <div className="col-lg-8">
            <div className="mb-5">
              <h2>IYS Skills Taxonomy</h2>
              <p className="lead mb-0">
                IYS Skills Taxonomy has a wide and rich coverage of “skills” in
                the information technology. By skills we refer to knowledge,
                concepts, tools, activities, domain and others.
              </p>
            </div>
          </div>
        </div>
        <div className="row align-items-center text-center">
          {countersData.map((counter, index) => (
            <div key={index} className="col-12 col-sm-6 col-lg-4">
              <div className="counter">
                <div className="counter-desc text-dark">
                  <CountUp
                    start={0}
                    end={counter.value}
                    duration={counter.duration}
                    suffix="+"
                    className="count-number h2"
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

export default CounterSection;
