import { Container } from "react-bootstrap";
import SearchAddedTree from "../subcomponents/SearchAddedTree";
import SearchBar from "../SearchBar";
import ContactUs from "./ContactUs";

const MainPage = () => {
  return (
    <>
      <Container>
        <br></br>
        <br></br>
        <p className="text-center fs-5">
          IYS makes it easy and precise to map skills holistically for
          individuals and jobs
        </p>
        <p className="text-center fs-5">
          And then this skills profile solves lots of problems in
        </p>
        <p className="text-center fs-5">
          Learning & Development, Talent Management, Career Development,
          Resource Deployment and More
        </p>
        <hr />
        <br></br>
        <h4 className="">What’s a Skills Profiler?</h4>

        <p className=" fs-5">
          A simple web tool to map skills of oneself or of jobs. It is backed by
          a large, rich and smart Skills Taxonomy that is curated, organized and
          updated using Al and HI (Human Intelligence).
        </p>

        <h4 className=""> Experience it here</h4>

        <br></br>
        <SearchBar cansearch={true} />
        <SearchAddedTree norate={true} />
        <br></br>
        <br></br>

        <h4 className="">Strengths of IYS Skills Profiler</h4>
        <hr />
        <p className="fs-6">
          Combining the power of AI and HI (Human Intelligence) IYS maintains a
          very large database of “skills”.
          <ul>
            <li>One that is intelligently organized </li>
            <li>Constantly updated using technology and domain knowledge </li>
            <li>Contextualized on functions and occupations</li>
            <li>Holistic - enables mapping different aspects of “skills” </li>
          </ul>
          The frontend enables users map / articulate or capture their skills or
          skills of jobs in a rich data driven manner for making activities
          around skills data driven and precise.
        </p>
        <h4 className="">For whom?</h4>
        <hr />
        <p className="fs-6">
          IYS Skills Profiler provides immense benefits to skills based
          applications, similar to how maps resources like Google Maps benefit
          location based applications (like delivery, supply chain, E-Commerce
          and others applications)
        </p>
        <p className="fs-6">
          So if you are into development of HRIS, Recruitment Systems, ATS, LMS,
          Job Portal, Professional Networking Site, Project Management, Talent
          Management, EdTech or any application where “skills” is important, IYS
          can value add to your application and thus your customers and thus up
          your business performance.
        </p>
        <h4 className="">Use cases</h4>
        <hr />
        <p className="fs-6">
          Skills Profiles of people and jobs created using IYS Skills Profile
          has immense benefits
        </p>
        <p className="fs-6">
          Skills Inventorying
          <br></br>
          Inventory or get complete stock of the skills in your company. Make
          business decisions with rich data on skills.
        </p>
        <p className="fs-6">
          Career Development
          <br></br>
          Understand possibilities of career paths based on the skills profile
          of an individual and the skills profiles of the various roles in the
          company.
        </p>
        <p className="fs-6">
          Employee Development
          <br></br>
          Personalize development plans (instead of following a one size fits
          all) based on the skills gap of each individual employee.
        </p>
        <p className="fs-6">
          Resource Planning
          <br></br>
          Make resource allocation, employee movement and succession plan a data
          driven exercise with in depth analysis of skills data.
        </p>
        <p className="fs-6">
          Recruitment
          <br></br>
          Improve recruitment productivity and efficiency with precision in
          “skills” matching and analysis of jobs and prospects.
          <br></br>
          ….lot more, anything process that involves “skills”
        </p>

        <ContactUs />
      </Container>
    </>
  );
}

export default MainPage;
