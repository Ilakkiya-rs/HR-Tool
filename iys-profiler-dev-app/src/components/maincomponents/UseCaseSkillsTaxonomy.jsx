import { Container } from 'react-bootstrap';
import SearchAddedTree from '../subcomponents/SearchAddedTree';
import SearchBar from '../SearchBar';
import ContactUs from './ContactUs';

const UseCaseSkillsTaxonomy = () => (
  <Container>
    <br />
    <br />

    <p className=" fs-5">
      IYS Skills Profiler can immensely boost Learning Management Systems value
      delivery
      <br />
      By enabling personal recommendations to users
    </p>

    <h3 className=""> Problem</h3>
    <p className=" fs-5">
      Most Learning Management systems pitch on the number of courses they
      offer. Something like (not in exact words)
      <br />
      <br />
      “Explore over 1,000 training courses”
      <br />
      <br />
      But this is not good enough in today’s world of hyper personalization.
      People would like to see from your Learning Management system
      <br />
      <br />
      “Here are 5 training courses that will boost your career”
      <br />
      <br />
      Recommendations tailored for the user.
    </p>
    <h3 className="">Solution</h3>
    <p className=" fs-5">
      Your LMS can deliver this value if you understand the “skills profile” of
      your users. Every user is different. It will immensely benefit if you
      understand each one’s skills profile and make recommendations picking the
      right few courses from your repository of courses to them.
    </p>
    <h3 className="">Partner with IYS</h3>
    <p className=" fs-5">
      IYS can help your LMS deliver superior value. To get to know the user’s
      skills profile integrate this “IYS Skills Profiler” plugin to your
      application.
      <br />
      Let users create their “skills profile”. (You save the skills of the users
      at your end.)
      <br />
      Based on the skills of the users make recommendations from your course
      repository.
      <br />
    </p>
    <h3 className="">Outcomes for you</h3>
    <p className=" fs-5">
      Higher level of engagement with users
      <br />
      Hyper personalization
      <br />
      Higher conversion rate
      <br />
    </p>
    <h3 className="">IYS Skills Profiler</h3>
    <p className=" fs-5">
      IYS Skills Profiler enables mapping of skills of people and of jobs in a
      comprehensive manner covering all aspects of talent including knowledge,
      tools, activities, domain knowledge and more. in a simple and intuitive
      manner
      <br />
      IYS Skills Profiler is backed by a rich and most exhaustive skills
      taxonomy that is constantly updated.
    </p>

    <h4 className="">Experience the IYS Skills Profiler </h4>
    <p className=" fs-5">Search for a skill or occupation</p>

    <br />
    <SearchBar cansearch />
    <SearchAddedTree norate />
    <br />
    <h4 />

    <h4 className="">Excited to boost your LMS? Let’s connect.</h4>

    <ContactUs />
  </Container>
);

export default UseCaseSkillsTaxonomy;
