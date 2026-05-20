'use client';

import Card from 'react-bootstrap/Card';

import React, { useContext, useEffect } from 'react';

import GlobalContext from '../../app/GlobalState';
import { addTosessionStorage } from '../../utils/PathArray';
import MyVerticallyCenteredModal from '../popovers/GetRateModel';
import SkillSubTree from './SkillSubTree';

const SearchAddedTree = (props) => {
  const [modalShow, setModalShow] = React.useState(false);
  const { globalVariable } = useContext(GlobalContext);

  useEffect(() => {}, [globalVariable]);

  const renderSkillSubTree = () => {
    if (globalVariable) {
      return (
        <SkillSubTree key={globalVariable?._key} skill_files={globalVariable} />
      );
    }
    return null;
  };

  return (
    <>
      {globalVariable?.term ? (
        <div className="mt-3">
          {addTosessionStorage(globalVariable.skills[0])}
          <Card className="mt-3 bg-dange">
            <Card.Body>
              <Card.Title>
                <span className="text-light">Selected Skills </span>&quot;
                {globalVariable.term}&quot;{' '}
                {props?.norate &&
                globalVariable?.skills &&
                globalVariable.skills[0].rating_type > 0 ? (
                  <>
                    {' '}
                    {/* <Button
                      variant="outline-dark"
                      style={iconStyle}
                      onClick={() => setModalShow(true)}
                    >
                      {<RiUserStarFill />} Rate
                    </Button> */}
                    <MyVerticallyCenteredModal
                      show={modalShow}
                      skilldetail={globalVariable}
                      onHide={() => setModalShow(false)}
                    />
                  </>
                ) : (
                  <></>
                )}
              </Card.Title>

              {globalVariable?.skills?.map((skill_files) => (
                <SkillSubTree
                  key={skill_files._key}
                  skill_files={skill_files}
                  skill_type
                  norate={!props?.norate}
                />
              ))}
              <p />
            </Card.Body>
          </Card>
        </div>
      ) : globalVariable?.name ? (
        <>
          {' '}
          <div className="mt-3">
            <Card className="mt-3">
              <Card.Body>
                <Card.Title>
                  <span className="text-light">Selected Skills </span>&quot;
                  {globalVariable.name}&quot;{' '}
                  {props?.norate && globalVariable.rating_type > 0 ? (
                    <>
                      {' '}
                      {/* <Button
                        variant="outline-dark"
                        style={iconStyle}
                        onClick={() => setModalShow(true)}
                      >
                        {<RiUserStarFill />} Rate
                      </Button> */}
                      <MyVerticallyCenteredModal
                        show={modalShow}
                        skilldetail={globalVariable}
                        onHide={() => setModalShow(true)}
                      />
                    </>
                  ) : (
                    <></>
                  )}
                </Card.Title>

                {renderSkillSubTree()}

                <p />
              </Card.Body>
            </Card>
          </div>
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default SearchAddedTree;
