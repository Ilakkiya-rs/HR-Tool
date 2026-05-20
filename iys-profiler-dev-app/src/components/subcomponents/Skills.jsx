'use client';

import { useContext } from 'react';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import { FaPlus } from 'react-icons/fa';
import GlobalContext from '../../app/GlobalState';
import {
  addTosessionStorage,
  clearsessionStorage
} from '../../utils/PathArray';
import DetailSkillPopup from '../popovers/DetailSkillPopup';

const Skills = (props) => {
  const { setGlobalVariable } = useContext(GlobalContext);
  const handleButtonClick = () => {
    if (props.isPop) {
      clearsessionStorage();
      addTosessionStorage(props.skillDetail);
      // when skils are clicke with pop

      props.popCatToggle(false);
    }
    addTosessionStorage(props.skillDetail);

    if (have_child(props)) {
      // do nothing
    } else {
      return null;
    }
    setGlobalVariable(props.skillDetail);
  };
  const iconStyle = {
    color: '#706565' // set the color to light grey
  };

  const renderSkillName = (skillDetail) => skillDetail.name;
  const haveChildColor = {
    marginRight: '3px',
    marginLeft: '3px',
    marginTop: '3px',
    backgroundColor: '#c8dbf729'
  };
  const haveChildColor1 = {
    marginRight: '3px',
    marginLeft: '3px',
    marginTop: '3px',
    backgroundColor: '#0d6efd54'
  };

  const have_child = (props) => {
    // console.log("props.skillDetail", props?.skillDetail, handleButtonClick());
    if (props.skillDetail?.files) {
      const files_list = props.skillDetail?.files;
      if (files_list.length) {
        if (files_list[0].child_count === 0) {
          console.log('child_count1', files_list[0].child_count);
          return false;
        }
        return true;
      }
    }
    if (props.skillDetail?.child_count === 0) {
      // console.log("child_count", props.skillDetail?.child_count);
      return false;
    }
    return true;
  };

  const renderDisplayPlusButton = (props) => {
    if (have_child(props)) {
      return <FaPlus style={iconStyle} />;
    }
    return null;
  };
  const renderSkillDescription = (skillDetail) => {
    // return "dsjknvj"
    if (skillDetail?.files?.length) {
      return skillDetail?.files[0]?.description;
    }
    if (skillDetail?.file) {
      return skillDetail?.file?.description;
    }
    return skillDetail?.skill?.description;
  };

  const trigger = renderSkillDescription(props.skillDetail)
    ? ['hover', 'focus']
    : null;

  return (
    <OverlayTrigger
      trigger={trigger}
      placement="auto"
      overlay={DetailSkillPopup(props.skillDetail)}
      rootClose
    >
      <Button
        variant="dark"
        className="mt-1 text-dark"
        style={props?.select ? haveChildColor1 : haveChildColor}
        onClick={() => handleButtonClick()}
      >
        {renderSkillName(props.skillDetail)} {renderDisplayPlusButton(props)}
      </Button>
    </OverlayTrigger>
  );
};

export default Skills;
