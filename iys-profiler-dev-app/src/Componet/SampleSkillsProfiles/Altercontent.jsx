const AlterContent = ({ slug }) => (
    <section className="py-5 my-5">
    <div className="container">
      <div className="text-center">
        <div className="col-lg-8 mx-auto">
          <div className="mb-5">
            <p className="lead mb-4 lh-lg">
                The {slug} Skills Profile is useful in several ways. It helps one understand in which skills one is strong and those in which one is not strong enough. And thus take stock of the skills one may want to develop.
            </p>
            <p className="lead mb-4 lh-lg">
                For Hiring Manager creating a {slug} Skills Profile is the best way to communicate the skills and proficiencies required for hiring for a respective position or job. Similarly, Managers can help employee development. They can create {slug} Skills Profile defining the skills and the proficiency level in these skills for a said role in the organization. Against the {slug} employees can map their skills and understand their skills gap.
            </p>
            <p className="lead mb-4 lh-lg">
                IYS offers a simple application called Organization Skills Management (OSM) that enables skills profiling of employees and of roles in the organization and thereon perform skills gap analysis, skills inventory, skills based hiring, career planning, workforce planning and more.
            </p>
            <p className="lead mb-4 lh-lg">
                To know more about the Organization Skills Management (OSM) application please <a target="_blank" href="/saas-application/organization-skills-management-osm" style={{ color: '#4285f4', textDecoration: 'underline',}}>click here</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default AlterContent;
