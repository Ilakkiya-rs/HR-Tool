import { Container } from 'react-bootstrap';

const SkillsProfile = (props) => (
  <Container>
    <br />
    <br />
    <p className="fw-bold fs-5">
      <span className="text-danger">Graphic Design</span> Skills Profile created
      using
      <a
        href="https://myskillsplus.com/"
        className="mx-2"
        target="_blank"
        rel="noreferrer"
      >
        IYS Skills Profiler.
      </a>
    </p>
    <p className="fw-bold fs-5">
      <span className="text-danger"> Graphic Design </span> skills profile
      covers &quot;skills&quot; in different areas and proficieies in
    </p>
    <iframe
      src={props?.profileUrl}
      title="description"
      width="100%"
      height="1000px"
    />
  </Container>
);

export default SkillsProfile;
