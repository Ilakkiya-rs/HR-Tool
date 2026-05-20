import { Container } from 'react-bootstrap';

import SearchAddedTree from '../subcomponents/SearchAddedTree';
import SearchBar from '../SearchBar';
import ContactUs from './ContactUs';

const SkillsPluginPage = () => {
  return (
    <Container>
      <br></br>
      <br></br>
      <h2 className="text-center mt-2">IYS Skills Profiler Plugin</h2>
      <hr></hr>
      <p className=" fs-5 text-center">
        A tool or utility for applications that enables capturing of skills of
        people or jobs
      </p>
      <br></br>
      <h3 className=""> What is IYS Skills Profiler?</h3>
      <p className=" fs-5">
        IYS Skills Profiler enables mapping of skills of people and of jobs in a
        comprehensive manner covering all aspects of talent including knowledge,
        tools, activities, domain knowledge and more. in a simple and intuitive
        manner
      </p>
      <p className=" fs-5">
        IYS Skills Profiler is backed by a rich and most exhaustive skills
        taxonomy that is constantly updated.
      </p>
      <br></br>
      <h4 className="">Experience the IYS Skills Profiler </h4>
      <br></br>
      <SearchBar cansearch={true} />
      <SearchAddedTree norate={true} />
      <br></br>
      <br></br>
      <h4 className="">IYS Skills Profiler Plugin</h4>
      <br></br>
      <p className=" fs-5">
        The skills profiler plugin is a JS file with CSS. The CSS can be
        modified as per your application needs.
      </p>
      <p className=" fs-5">
        The skills profiler plugin renders the skills based on skills searched
        and selected by the users through API connected to the IYS SKills and
        Occupations Taxonomy (ISOT).
      </p>
      <p className=" fs-5">
        ISOT is a rich large, intelligent organised, database of skills across
        industries and functions.
      </p>
      <br></br>
      <h5 className="">Two versions</h5>
      <p className=" fs-5">
        <ul>
          <li className=" fs-5">
            <a href="/skills-profiler-plugin-docs">
              Skills Profiler Plugin without proficiency rating documentation
            </a>
          </li>
          <li className=" fs-5">
            <a href="/skills-profiler-plugin-docs">
              Skills Profiler plugin with proficiency rating
            </a>
          </li>
        </ul>
      </p>
      <br></br>
      <p className=" fs-5">
        In both these cases, when embedded into your application, the users of
        your application will be able to search and select skills.
      </p>
      <p className=" fs-5">
        The skills selected by the user are rendered in JSON format and you can
        save the skills information of the users at your end.
      </p>
      <p className=" fs-5">
        In the case of SKills Profiler plugin with proficiency rating, the users
        can, further to selecting skills, add proficiency levels to the skills
        and also give comments to the skills. These again are provided as JSON
        output that can be saved at the application end.
      </p>
      <br></br>

      <h3 className="">Interested? What to know more? Write to us</h3>
      <hr></hr>
      <ContactUs />
    </Container>
  );
};

export default SkillsPluginPage;
