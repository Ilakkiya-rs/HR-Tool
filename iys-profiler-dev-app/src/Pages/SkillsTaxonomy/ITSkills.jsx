import React from 'react';
import Herosection from '../../Componet/SkillsTaxonomy/Herosection';
import ExperiencePlugin from '../../Componet/ExperiencePlugin';
import AlterContent from '../../Componet/SkillsTaxonomy/AlterContent';
import Newsletter from '../../Componet/Newsletter';
import CounterSection from '../../Componet/SkillsTaxonomy/CounterSection1';
import UseCases from '../../Componet/SkillsTaxonomy/UseCases';
import Benefits from '../../Componet/SkillsTaxonomy/Benefits';

const ITSkills = () => (
  <>
    <Herosection />
    <CounterSection />
    <ExperiencePlugin />
    <UseCases />
    <Benefits />
    <Newsletter title="For more information" />
    <AlterContent />
  </>
);

export default ITSkills;
