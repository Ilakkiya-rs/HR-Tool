'use client'

import Card from "react-bootstrap/Card";
import { getPopularCategories } from "./api/ApiCalls";
import Button from "react-bootstrap/Button";
import React, { useState, useEffect } from "react";
import Skills from "./subcomponents/Skills";
import { FaPlus } from "react-icons/fa";

const PopularCat = () => {
  const [categories, setCategories] = useState([]);
  const [showSkills, setShowSkills] = useState(true);
  useEffect(() => {
    getPopularCategories()
      .then((response) => {
        console.log(response.data);
        setCategories(response.data);
      })
      .catch((error) => console.error(error));
  }, []);
  const buttonStyle = {
    float: "right", // set the color to light grey
  };
  const iconStyle = {
    color: "white", // set the color to light grey
  };

  const toggleSkills = () => {
    setShowSkills(!showSkills);
  };

  return (
    <>
      <Card className="mt-3">
        <Card.Body>
          <Card.Title>
            Functional Areas
            <Button
              variant="dark"
              className="pb-1"
              style={buttonStyle}
              onClick={toggleSkills}
            >
              <FaPlus style={iconStyle} className="pb-1" />
            </Button>{" "}
          </Card.Title>
          <hr></hr>
          <div
            id="popSkillls"
            style={{ display: showSkills ? "block" : "none" }}
          >
            {categories.map((category) => (
              <Skills
                key={category._id}
                skillDetail={category}
                popCatToggle={setShowSkills}
                isPop={true}
              />
            ))}
            <hr />
          </div>
        </Card.Body>
      </Card>
    </>
  );
}

export default PopularCat;
