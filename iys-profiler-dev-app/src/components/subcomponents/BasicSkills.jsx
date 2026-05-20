'use client';

import Button from 'react-bootstrap/Button';

const BasicSkills = (props) => {
  const handleButtonClick = () => {
    console.log('added skiil', props.skill);
  };

  return (
    <Button variant="light" onClick={handleButtonClick}>
      {props.skill.name}
    </Button>
  );
};

export default BasicSkills;
