import { Container } from "react-bootstrap";
import SearchAddedTree from "../subcomponents/SearchAddedTree";
import SearchBar from "../SearchBar";
import ContactUs from "./ContactUs";

const EmployeeSkillsManagement = () => {
  return (
    <>
      <Container>
        <br></br>
        <br></br>
        <h3 className="text-center mt-2">
          Manage your skills in your organization
        </h3>
        <h4 className="text-center mt-2">in a data-driven manner</h4>
        <h4 className="text-center mt-2">Using IYS Skills Profiler</h4>
        <hr></hr>
        <h3 className=""> Problem</h3>
        <p className=" fs-5">
          Every organization and person in the organization appreciates the
          value of skills, skills being the currency of today’s economy.
        </p>
        <p className=" fs-5">
          Decisions in HR and business revolve around skills
        </p>
        <p className=" fs-5">
          <u>
            Yet unlike people managing skills is tough, given the nature of the
            skills.
          </u>
        </p>
        <br></br>
        <h3 className=""> Solution</h3>
        <p className=" fs-5">
          IYS offers organizations a simple yet powerful smart SAAS application
          for managing skills of employees.
        </p>
        <p className=" fs-5">
          It is one of its kind. The smartness of IYS SAAS application comes
          from the “IYS Skills Profiler” embedded in the application.
        </p>
        <br></br>
        <h3 className=""> IYS Skills Profiler</h3>
        <p className=" fs-5">
          IYS Skills Profiler enables mapping of skills of people and of jobs in
          a comprehensive manner covering all aspects of talent including
          knowledge, tools, activities, domain knowledge and more. in a simple
          and intuitive manner
        </p>
        <p className=" fs-5">
          IYS Skills Profiler is backed by a rich and most exhaustive skills
          taxonomy that is constantly updated.
        </p>
        <br></br>
        <h4 className="">Experience the IYS Skills Profiler </h4>
        <p className=" fs-5">Search for a skill or occupation</p>
        <br></br>
        <SearchBar cansearch={true} />
        <SearchAddedTree norate={true} />
        <br></br>
        <br></br>
        <h4 className="">Use cases for organizations</h4>
        <br></br>
        <h5 className="">Skills Inventory</h5>
        <p className=" fs-5">
          Quality data on skills that is detailed and precise, one that can be
          sliced and diced for data-driven decision making
        </p>
        <br></br>
        <h5 className="">Learning and Development</h5>
        <p className=" fs-5">
          Personalization of learning by recommending or choosing the right
          training courses for an employee based on his or her skills profile
        </p>
        <br></br>
        <h5 className="">Resource Planning</h5>
        <p className=" fs-5">
          Plan resource or workforce allocation based on skills required for
          roles and skills of people in the organization
        </p>
        <br></br>
        <h5 className="">Career Planning</h5>
        <p className=" fs-5">
          Guide employees on career possibilities within organization on career
          possibilities based on their skills profile and aspirations
        </p>
        <br></br>
        <h5 className="">Recruitment</h5>
        <p className=" fs-5">
          Superior quality of analyzing skills of applicants for positions in
          the organization helping up improved efficiency in and quality of
          hiring
        </p>
        <br></br>
        <h5 className="">Outcomes</h5>
        <ul>
          <li className=" fs-5">
            Better return on investment in employee / HR processes
          </li>
          <li className=" fs-5">
            Better employee engagement and personalization
          </li>
          <li className=" fs-5">Superior business decisions on people </li>
        </ul>
        <br></br>
        <br></br>

        <h3 className="">Excited to boost your organization? Let’s connect.</h3>
        <hr></hr>
        <ContactUs />
      </Container>
    </>
  );
}

export default EmployeeSkillsManagement;
