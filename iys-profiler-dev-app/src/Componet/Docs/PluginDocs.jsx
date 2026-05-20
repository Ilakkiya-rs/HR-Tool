'use client';

import Link from 'next/link';
import { Button, Card } from 'react-bootstrap';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import plugin2 from '../../assets/profilerplugin.png';
import Newsletter from '../Newsletter';

const PluginDocs = () => {
  // const cssImportString =
  //   '<link rel="stylesheet" target="_blank" href="https://cdn.jsdelivr.net/gh/Abhishek-Gawade-programmer/iys-plugin@master/assets/css/main.css" />';
  // const jsImportString =
  //   '<script src="https://cdn.jsdelivr.net/gh/Abhishek-Gawade-programmer/iys-plugin@master/assets/js/classes/plugin.js"></script>';

  // const ImportJsString = `
  // const plugin = new IysFunctionalAreasPlugin({
  //   ApiKey: "<API KEY>",
  //   divID: "serachid",
  //   onSearchSkillClick: selectedSkill,
  //   selectedSkilldiv: "selectSkill",
  //   skillPlayground: "skillPlayground",
  // });
  // plugin.init();`;
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

  const PreFilledData = `
  const plugin = new IysFunctionalAreasPlugin({
    divID: "serachid",
    onSearchSkillClick: selectedSkill,
    selectedSkilldiv: "selectSkill",
    skillPlayground: "skillPlayground",
    ratedSkillEvent: ratedSkillEvent,
    skillsData: previousData,
  });
  `;

  const skillsData = `
  let previousData = [
    {
      comment: "comment",
      rating: [
        {
          isot_rating_id: "ratings/1",
          rating: 2,
          comment: "comment",
        },
        {
          isot_rating_id: "ratings/2",
          rating: 2,
          comment: "comment",
        },
      ],
      isot_file_id: "13074779",
      isot_file: {
        path_addr: "13074779",
        name: "AWS Consultant",
        description: null,
        ratings: [
          {
            _id: "ratings/1",
            rating_category: "Experience Recency",
            rating_scale_type: "Two Choice Rating",
            rating_scale_label: ["Current", "Past"],
          },
          {
            _id: "ratings/2",
            rating_category: "Experience Level",
            rating_scale_type: "Four Scale Rating",
            rating_scale_label: [
              "0 - 2 years",
              "2 - 5 years",
              "5 - 10 years",
              "10+ years",
            ],
          },
        ],
        tags: [
          {
            _id: "tags/12",
            title: "Role / Occupation",
          },
        ],
        display_order: null,
        child_count: 4,
      },
    },]
  `;

  const goToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth' // Optional: smooth scrolling animation
    });
  };
  return (
    <>
      {/* <HerosectionHeader name={"Skill Plugin Docs"} /> */}
      <div className="container">
        <br />
        <h2>
          {' '}
          Skills Profiler Plugin with proficiency rating and experience profiler{' '}
        </h2>
        <br />
        <Card>
          <Card.Body>
            <Card.Title>
              Skills Profiler Plugin with proficiency rating and experience
              profiler{' '}
            </Card.Title>
            <ul>
              <li>Bootstrap 5.2 installed</li>
              <li>HTML/CSS/JS</li>
            </ul>
            <Card.Link
              target="_blank"
              href="https://rapidapi.com/iys-skills-tech-iys-skills-tech-default/api/iys-skill-api/"
              className="fw-bold"
            >
              Get Rapid API Key
            </Card.Link>

            <Card.Link
              target="_blank"
              href="https://getbootstrap.com/docs/5.2/getting-started/introduction/"
            >
              Bootstrap 5.2 Link
            </Card.Link>
            <hr />
            <Card id="plugin2" className="border-0">
              <Card.Body>
                <Card.Title>
                  <Card.Link
                    target="_blank"
                    href="https://itsyourskills-repos.github.io/iys-skills-profiler-plugin/"
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
                      href="https://github.com/itsyourskills-repos/iys-skills-profiler-plugin/blob/master/index.html"
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
                      href="https://github.com/itsyourskills-repos/iys-skills-profiler-plugin/blob/master/assets/js/classes/plugin.js"
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

                  <li>How to add pre filled data to profiler </li>
                  <SyntaxHighlighter language="javascript" style={docco}>
                    {PreFilledData}
                  </SyntaxHighlighter>
                  <p>Add <i>skillsData</i> parameter to plugin, the format for data should be like below</p>
                  <SyntaxHighlighter language="javascript" style={docco}>
                    {skillsData}
                  </SyntaxHighlighter>
                </ol>
              </Card.Body>
            </Card>
          </Card.Body>
        </Card>
        <section className="py-5 my-5">
          <div className="container">
            <h2 className="fw-light">Two Versions</h2>
            <div className="row mt-5">
              <div className="col-lg-6 mb-5">
                <div className="card border-primary">
                  <div className="card-body">
                    <div className="mb-5">
                      <h3 className="lh-base fw-light">
                        IYS Skills Profiler Plugin{' '}
                        <span className="fw-bold">Without</span> Proficiency
                        Rating
                      </h3>
                      <Link href="/skills-profiler-plugin-v2-docs">
                        <Button
                          variant="primary"
                          onClick={goToTop}
                          type="submit"
                          className="mt-3"
                        >
                          Documentation
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-6 mb-5">
                <div className="card border-success">
                  <div className="card-body">
                    <div className="mb-5">
                      <h3 className="lh-base fw-light">
                        IYS Skills Profiler Plugin{' '}
                        <span className="fw-bold">With</span> Proficiency Rating
                      </h3>
                      <Link href="/skills-profiler-plugin-v1-docs">
                        <Button
                          variant="success"
                          onClick={goToTop}
                          type="submit"
                          className="mt-3"
                        >
                          Documentation
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="d-flex flex-column-reverse flex-lg-row align-items-center justify-content-between">
              <div className="col-12">
                <div className="mb-5">
                  <p className="lead mb-0 lh-lg">
                    In both these cases, when embedded into your application,
                    the users of your application will be able to search and
                    select skills.
                  </p>
                  <p className="lead mb-0 lh-lg">
                    The skills selected by the user are rendered in JSON format
                    and you can save the skills information of the users at your
                    end.
                  </p>
                  <p className="lead mb-0 lh-lg">
                    In the case of SKills Profiler plugin with proficiency
                    rating, the users can, further to selecting skills, add
                    proficiency levels to the skills and also give comments to
                    the skills. These again are provided as JSON output that can
                    be saved at the application end.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <Newsletter />
      </div>
    </>
  );
};

export default PluginDocs;
