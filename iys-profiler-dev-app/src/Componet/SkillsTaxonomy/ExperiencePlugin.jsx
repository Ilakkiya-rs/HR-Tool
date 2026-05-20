import React from 'react';
import SearchBar from '../../components/SearchBar';
import SearchAddedTree from '../../components/subcomponents/SearchAddedTree';

const ExperiencePlugin = () => (
  <section className="mb-5 pb-5">
    <div className="container">
      <div className="d-flex flex-column flex-md-row align-items-center justify-content-between">
        <div className="col-12 col-lg-5">
          <div className="mb-5">
            <h2 className="lh-base">
              <span className="font-w-4 d-block">
                Experience the richness of Skills Taxonomy here
              </span>{' '}
              search for a skill or occupation
            </h2>
          </div>
        </div>
        <div className="col-12 col-lg-7 mb-5 mb-lg-0">
          <SearchBar cansearch />
          <SearchAddedTree norate />
        </div>
      </div>
    </div>
  </section>
);

export default ExperiencePlugin;
