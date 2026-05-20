import React from 'react'

export const FeatureL1 = () => {
  
  return (
    <>
      <section>
        <div className="container">
          <div
            className="row justify-content-between align-items-center mb-4 mb-lg-0"
          >
            <div className="col-lg-6 col-md-5">
              <div>
                <h2>
                  <span className="font-w-4 d-block"
                  >Highlights of </span> IYS Skills Taxonomy and Profiler
                </h2>
                <br />
              </div>
            </div>
          </div>
          <div className="row mt-lg-n5 align-items-center">
            <div className="col-lg-4 col-md-6 mb-4 mb-lg-0">
              <div className="p-5 feature-hover position-relative">
                <div className="f-icon"><i className="flaticon-knowledge"></i></div>
                <h5 className="mt-4 mb-3">Holistic</h5>
                <p className="mb-0 lh-lg">
                  Covers all aspects of a Skills Profile including knowledge (of concepts, principles, methods and others), tools and technologies, activities, domain or contextual experience, and behavioral skills
                </p>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 mb-4 mb-lg-0">
              <div className="p-5 feature-hover position-relative">
                <div className="f-icon"><i className="flaticon-thumbs-up"></i></div>
                <h5 className="mt-4 mb-3">Comprehensive</h5>
                <p className="mb-0 lh-lg">
                  Covers a range of Functions and Industries. Around 32 high level areas are covered that drill down further to sub areas or specializations.
                </p>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 mb-4 mb-lg-0">
              <div className="p-5 feature-hover position-relative">
                <div className="f-icon"><i className="flaticon-thumbs-up"></i></div>
                <h5 className="mt-4 mb-3">Constantly Updated</h5>
                <p className="mb-0 lh-lg">
                  The Skills Taxonomy is constantly updated curating skills, screening them, and organizing them within the Skills Taxonomy. IYS uses AI tools and Human Intelligence in the process
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default FeatureL1
