'use client';

import { Card } from 'react-bootstrap';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import HerosectionHeader from '../../Componet/HerosectionHeader';
import Newsletter from '../../Componet/Newsletter';
import plugin1 from '../../assets/plugin1.png';
import plugin2 from '../../assets/plugin2.png';

const SkillsPlugin = () => {
  const ImportJsString = `
  const plugin = new IysFunctionalAreasPlugin({
    ApiKey: "<API KEY>",
    divID: "serachid",
    onSearchSkillClick: selectedSkill,
    selectedSkilldiv: "selectSkill",
    skillPlayground: "skillPlayground",
  });
  plugin.init();`;
  const ratedSkillPlugin = `
  const plugin = new IysFunctionalAreasPlugin({
    ...
    ratedSkillEvent: ratedSkillEvent,
  });`;
  const ratedSkillJson = `
  {
    "comment": "sdsd",
    "rating": 2,
    "isot_file_id": "files/988243",
    "isot_file": {
        "_key": "988243",
        "_id": "files/988243",
        "name": "AWS CloudFormation Batch",
        "is_discrete": false,
        "description": null,
        "display_order": 0,
        "child_count": null,
        "rating_type": 1,
        "rating_legend": 56,
        "rating": {
            "_key": "56",
            "_id": "rating_options/56",
            "options": [
                "Aware",
                "Familiar",
                "Proficient",
                "Expert"
            ]
        },
        "tags": [
            "tags/36669670"
        ],
        "tags_data": [
            {
                "_key": "36669670",
                "_id": "tags/36669670",
                "title": "Tools and Technologies"
            }
        ]
    }
};`;
  const ImportJsString1 = `
 
const ENDPOINT_URL = "http://localhost:8000/dev-api/";
  `;
  return (
    <div>
      <HerosectionHeader name={'Skill Plugin Docs'} />
      <div className="container">
        <Card>
          <Card.Body>
            <Card.Title>
              Skills Profiler Plugin without proficiency rating{' '}
            </Card.Title>
            <ul>
              <li>Bootstrap 5.2 installed</li>
              <li>HTML/CSS/JS</li>
            </ul>

            <Card.Link
              target="_blank"
              href="https://getbootstrap.com/docs/5.2/getting-started/introduction/"
            >
              Bootstrap 5.2 Link
            </Card.Link>
          </Card.Body>
        </Card>
        <hr></hr>
        <Card id="plugin1">
          <Card.Body>
            <Card.Title>
              Skills Search Plugin
              <Card.Link
                target="_blank"
                href="https://github.com/Abhishek-Gawade-programmer/iys-plugin"
                className="float-end"
              >
                Checkout Demo
              </Card.Link>
            </Card.Title>
            <ol>
              <li>
                Download and Edit the HTML file from the below link
                <a
                  className="mx-2"
                  href="https://github.com/itsyourskills-repos/iys-plugin-rating"
                >
                  index.html
                </a>
                <br></br>
                <br></br>
              </li>
              <li>
                Create a Js file like{' '}
                <a
                  className="mx-2"
                  href="https://github.com/itsyourskills-repos/iys-plugin-rating"
                >
                  main.js
                </a>{' '}
                and import the Skill Plugin class
                <br></br>
                <br></br>
                <SyntaxHighlighter language="javascript" style={docco}>
                  {ImportJsString}
                </SyntaxHighlighter>
                <Card.Link
                  target="_blank"
                  href="https://rapidapi.com/iys-skills-tech-iys-skills-tech-default/api/iys-skill-api/"
                >
                  Get Rapid API Key
                </Card.Link>
              </li>
              <br></br>
              <li>
                Result will be like this
                <br></br>
                <img
                  src={plugin1.src}
                  className="img-fluid"
                  alt="React Bootstrap logo"
                />
              </li>
            </ol>
          </Card.Body>
        </Card>
        <hr></hr>
        <Card id="plugin2">
          <Card.Body>
            <Card.Title>
              Skills Profiler plugin with proficiency rating
              <Card.Link
                target="_blank"
                href="https://itsyourskills-repos.github.io/iys-plugin-rating"
                className="float-end"
              >
                Checkout Demo
              </Card.Link>
            </Card.Title>
            <ol>
              <li>
                Download and Edit the HTML file from the below link
                <a
                  className="mx-2"
                  href="https://github.com/Abhishek-Gawade-programmer/iys-plugin-rating/blob/master/index.html"
                >
                  index.html
                </a>
                <br></br>
                <br></br>
              </li>
              <li>
                Change the
                <code className="mx-2">ENDPOINT_URL</code>
                in the
                <a
                  className="mx-2"
                  href="https://github.com/itsyourskills-repos/iys-plugin-rating/blob/master/assets/js/classes/plugin.js"
                >
                  plugin.js
                </a>
                <br></br>
                <br></br>
                <SyntaxHighlighter language="javascript" style={docco}>
                  {ImportJsString1}
                </SyntaxHighlighter>
              </li>
              <li>
                Result will be like this
                <br></br>
                <img
                  src={plugin2.src}
                  className="img-fluid"
                  alt="React Bootstrap logo"
                />
              </li>
              <br></br>
              <li>Setting to get The Rated Skills</li>
              <SyntaxHighlighter language="javascript" style={docco}>
                {ratedSkillPlugin}
              </SyntaxHighlighter>

              <br></br>
              <b>This is response</b>
              <SyntaxHighlighter language="javascript" style={docco}>
                {ratedSkillJson}
              </SyntaxHighlighter>
            </ol>
          </Card.Body>
        </Card>
        <Newsletter />
      </div>
    </div>
  );
};

export default SkillsPlugin;
