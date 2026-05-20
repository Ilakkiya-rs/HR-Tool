'use client';

import { useContext, useEffect, useState } from 'react';
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import Card from 'react-bootstrap/Card';
import { BsStars } from 'react-icons/bs';
import GlobalContext from '../../app/GlobalState';
import {
  getListFromsessionStorage,
  removeItemsFromSessionStorageAfterIndex
} from '../../utils/PathArray';
import {
  childrenSkills,
  getRecommendations,
  treeSkills
} from '../api/ApiCalls';
import Skills from './Skills';

const SkillSubTree = (props) => {
  const skillFileId = props.skill_files?.path_addr;

  const [skillTree, setSkillTree] = useState([]);
  const [skillPath, setSkillPath] = useState([]);
  const [skillchildrenSkill, setskillchildrenSkill] = useState([]);
  const [skillRecommended, setskillRecommended] = useState([]);
  const { globalVariable, setGlobalVariable } = useContext(GlobalContext);

  const handleBreadcrumbClick = (skillFiles, index) => {
    setGlobalVariable(skillFiles);
    removeItemsFromSessionStorageAfterIndex(index);
    setSkillPath(getListFromsessionStorage());
  };
  useEffect(() => {
    // Call the API here using the searchValue variable
    setSkillPath(getListFromsessionStorage());

    const fetchData = async () => {
      try {
        if (skillFileId) {
          const response = await treeSkills(skillFileId);

          setSkillTree(response.data);

          const response1 = await childrenSkills(skillFileId);

          setskillchildrenSkill(response1.data);

          const response2 = await getRecommendations(skillFileId);
          setskillRecommended(response2.data);
          console.warn(response2.data);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [skillFileId]);

  const renderSkillName = (skillDetail) => {
    if (skillDetail?.file?.name) {
      return skillDetail?.name;
    }
    return skillDetail.name;
  };

  return (
    <Card className="mt-3 bg-dange p-0 border-0">
      <Card.Body className="p-0">
        <Breadcrumb separator=">" className="fw-bold">
          {getListFromsessionStorage().length === 0
            ? skillTree?.ancestors?.map((skill_files, index) => (
                <Breadcrumb.Item
                  key={index}
                  onClick={() => handleBreadcrumbClick(skill_files)}
                >
                  <span>{renderSkillName(skill_files)}</span>
                </Breadcrumb.Item>
              ))
            : skillPath.slice(0, -1).map((skill_files, index) => (
                <Breadcrumb.Item
                  key={index}
                  onClick={() => handleBreadcrumbClick(skill_files, index)}
                >
                  <span>{renderSkillName(skill_files)}</span>
                </Breadcrumb.Item>
              ))}
          {!props?.skill_type ? (
            <Breadcrumb.Item active>
              {renderSkillName(props.skill_files)}
            </Breadcrumb.Item>
          ) : (
            <></>
          )}
        </Breadcrumb>
        {props?.skill_type ? (
          skillTree?.siblings?.length === 0 ? (
            skillchildrenSkill.length === 0 && props.norate ? (
              <span className="text-muted">
                <h4>This skill does not have children or siblings</h4>
              </span>
            ) : (
              skillchildrenSkill?.map((skill_files) => (
                <Skills skillDetail={skill_files} key={skill_files._key} />
              ))
            )
          ) : (
            skillTree?.siblings?.map((skill_files) =>
              skill_files._key === globalVariable._key ? (
                <Skills
                  skillDetail={skill_files}
                  key={skill_files._key}
                  select
                />
              ) : (
                <Skills skillDetail={skill_files} key={skill_files._key} />
              )
            )
          )
        ) : (
          skillchildrenSkill?.map((skill_files) => (
            <Skills skillDetail={skill_files} key={skill_files._key} />
          ))
        )}

        {skillRecommended?.length !== 0 ? (
          <Card.Title>
            <br />
            <span className="text-light text-primary" style={{ color: 'red' }}>
              <BsStars /> Recommended For Skills{' '}
            </span>
            &quot;{globalVariable.term}&quot;{' '}
          </Card.Title>
        ) : (
          <></>
        )}
        {skillRecommended?.map((skill_files) => (
          <Skills skillDetail={skill_files} key={skill_files._key} />
        ))}
      </Card.Body>
    </Card>
  );
};

export default SkillSubTree;
