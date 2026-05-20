import { Container } from "react-bootstrap";
import SearchAddedTree from "../subcomponents/SearchAddedTree";
import SearchBar from "../SearchBar";
import ContactUs from "./ContactUs";
import Table from "react-bootstrap/Table";

const SampleSkillsProfiles = () => {
  return (
    <>
      <Container>
        <br></br>
        <br></br>
        <h3 className="text-center mt-2">
          Page for listing all the sample skills profile
        </h3>
        <hr></hr>
        <p className=" fs-5 text-center">
          Explore the Skills Profiles in different occupations / roles Skills
          Profiles are an easy to understand, comprehensive and structured
          representation on “skills” and proficiencies in the skills. “Skills”
          include Knowledge, Technical / Functional skills, Activities, Tools,
          Domain experience and others.
        </p>
        <br></br>

        <Table striped bordered size="lg">
          <thead>
            <tr>
              <th>Graphic Design Skills Profile</th>
              <th>AI Developer Skills Profile</th>
              <th>Data Analyst Skills Profile</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Thermal Engineer Skills Profile</td>
              <td>LMS Creator Skills Profile</td>
              <td>Recruiter Skills Profile</td>
            </tr>
          </tbody>
        </Table>

        <br></br>
        <h4>Experience the IYS Skills Profiler</h4>
        <br></br>

        <SearchBar cansearch={true} />
        <SearchAddedTree norate={true} />
        <br></br>

        <h3 className="">Interested? What to know more? Write to us</h3>
        <hr></hr>
        <ContactUs />
      </Container>
    </>
  );
}

export default SampleSkillsProfiles;
