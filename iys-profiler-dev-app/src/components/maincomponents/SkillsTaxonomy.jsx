import { Container } from "react-bootstrap";
import SearchAddedTree from "../subcomponents/SearchAddedTree";
import SearchBar from "../SearchBar";
import ContactUs from "./ContactUs";

const SkillsTaxonomy = () => {
  const skillsCount = "1,23,000";
  const categoryCount = "788";
  const roleCount = "543";
  return (
    <>
      <Container>
        <br></br>
        <br></br>
        <h2>Most exhaustive IT Skills Taxonomy</h2>
        <br></br>
        <h4 className="">IYS Skills Taxonomy</h4>
        <hr></hr>
        <div className=" fs-5">
          <ul>
            <li>
              <span className="fw-bold"> {skillsCount}</span>: Number of skills
              (in IT)
            </li>
            <li>
              <span className="fw-bold"> {categoryCount}</span> : Number of
              categories of skills
            </li>
            <li>
              <span className="fw-bold"> {roleCount}</span> : Number of
              occupations or roles
            </li>
          </ul>
        </div>

        <p className=" fs-5">
          IYS Skills Taxonomy has a wide and rich coverage of “skills” in the
          information technology. By skills we refer to knowledge, concepts,
          tools, activities, domain and others.
        </p>

        <h4 className=""> Experience the richness of the IT Skills Taxonomy</h4>
        <p className=" fs-5">Search for a skill or occupation / role here</p>

        <br></br>
        <SearchBar cansearch={true} />
        <SearchAddedTree norate={true} />
        <br></br>
        <br></br>

        <h5 className="">Contact Us for more information</h5>

        <ContactUs />
        <hr />
        <h4 className="">IT Skills</h4>
        <p className=" fs-5">
          Information Technology is one of the most dynamic fields with fast
          change in technology, occupations and skills thereof. The complexity
          emerges from combination of concepts, tools, activities and domain all
          of which keep evolving.
        </p>
        <p className=" fs-5">
          At the same time for anyone in the talent related function in IT such
          as recruitment, training, career development, HR analytics, HR
          strategy and others need quality data on skills to manage people and
          business processes.
        </p>
        <p className=" fs-5">
          The well organized, and constantly updated IYS Skills Taxonomy
          provides rich IT skills coverage so that these functions can be run in
          a highly efficient manner based on data on skills of people and jobs.
        </p>

        <h4 className="">About IYS</h4>
        <p className=" fs-5">
          IYS specializes in and focuses on skills research, and maintaining a
          rich skills taxonomy. Skills is a complex data set with lot of
          variables. With research over the years, IYS has matured its data
          structure to cater to these variables in the skills space.
        </p>
        <p className=" fs-5">
          IYS provides the Skills Taxonomy for the benefit of other skills based
          applications like HRIS, LMS, Recruitment Systems, ATS (Applicant
          Tracking Systems), Job Portals, Talent Management systems and others.
        </p>

        <h4 className="">Methodology</h4>
        <p className=" fs-5">
          IYS blends AI with Human Intelligence (HI) in the skills domain. Using
          technology tools IYS curates skills from different sources and screens
          the curated skills. The setting of rules for organization, vetting of
          inclusion of terms and governance of skills data is done manually with
          support from SMEs (Subject Matter Experts).
        </p>
      </Container>
    </>
  );
}

export default SkillsTaxonomy;
