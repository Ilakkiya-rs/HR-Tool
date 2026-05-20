import Button from 'react-bootstrap/Button';

import ButtonGroup from 'react-bootstrap/ButtonGroup';

import { AiFillDelete } from 'react-icons/ai';

const SkillsAdded = () => {
  return (
    <>
      <ButtonGroup aria-label="Basic example">
        <Button variant="light">
          Left <span>5/4</span>
        </Button>

        <Button variant="danger">{AiFillDelete}</Button>
      </ButtonGroup>{' '}
    </>
  );
};

export default SkillsAdded;
