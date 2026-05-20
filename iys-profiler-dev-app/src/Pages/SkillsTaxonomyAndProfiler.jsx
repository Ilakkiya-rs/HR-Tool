'use client';

import ExperiencePlugin from '../Componet/ExperiencePlugin';
import About from '../Componet/SkillsTaxonomyAndProfiler/About';
import Feature1 from '../Componet/SkillsTaxonomyAndProfiler/FeatureL1';
import Feature2 from '../Componet/SkillsTaxonomyAndProfiler/FeatureL2';
import Feature3 from '../Componet/SkillsTaxonomyAndProfiler/FeatureL3';
import Herosection from '../Componet/SkillsTaxonomyAndProfiler/Herosection';
import Newsletter from '../Componet/Newsletter';

const SkillsTaxonomyAndProfiler = () => (
  <div>
    <Herosection />
    <div className="page-content">
      <About />
      <ExperiencePlugin />
      <Feature1 />
      <Feature2 />
      <Feature3 />
      <Newsletter />
    </div>
  </div>
);

export default SkillsTaxonomyAndProfiler;
