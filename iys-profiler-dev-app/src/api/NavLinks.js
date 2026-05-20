/**
 *  Main Menu Json
 */
const navLinks = [
  {
    menu_title: 'Home',
    path: '/',
  },
  // {
  //   menu_title: 'Experience Skills Profiler',
  //   path: '/experience-iys-skills-profiler',
  // },
  {
    menu_title: 'Skills Taxonomy and Profiler',
    type: 'subMenu',
    child_routes: [
      {
        menu_title: 'About Skills Taxonomy and Profiler',
        path: '/skills-taxonomy-and-profiler',
      },
      {
        menu_title: 'Experience Skills Profiler',
        path: '/experience-iys-skills-profiler',
      },
      // {
      //   menu_title: 'Usage Options',
      //   path: '/use-iys-skills-taxonomy-profiler',
      // },
    ]
  },
  {
    menu_title: 'Skills API / Plugin',
    path: '/skills-api-plugin',
  },
  {
    menu_title: 'OSM (Organization Skills Management)',
    path: '/saas-application/organization-skills-management-osm',
  },
  // {
  //   menu_title: 'SAAS Applications',
  //   type: 'subMenu',
  //   child_routes: [
  //     {
  //       menu_title: 'OSM (Organization Skills Management)',
  //       path: '/saas-application/organization-skills-management-osm',
  //     },
  //     {
  //       menu_title: 'Skills Based Hiring Application',
  //       path: '/saas-application/skills-based-hiring-application',
  //     },
  //     {
  //       menu_title: 'Employee Skills Management',
  //       path: '/saas-application/employee-skills-management',
  //     },
  //   ]
  // },
  // {
  //   menu_title: 'Use Cases',
  //   type: 'subMenu',
  //   child_routes: [
  //     {
  //       menu_title: 'Skills Gap Analysis',
  //       path: '/use-cases/skills-gap-analysis',
  //     },
  //     {
  //       menu_title: 'Skills Based Hiring',
  //       path: '/use-cases/skills-based-hiring',
  //     },
  //     {
  //       menu_title: 'Training Providers',
  //       path: '/use-cases/skills-taxonomy-for-training-providers',
  //     },
  //     {
  //       menu_title: 'LMS (Learning Management System)',
  //       path: '/use-cases/lms-learning-management-system',
  //     },
  //     {
  //       menu_title: 'IT and Professional Services Companies',
  //       path: '/use-cases/it-and-professional-services-companies',
  //     },
  //     {
  //       menu_title: 'Job Portals and Recruitment Applications',
  //       path: '/use-cases/job-portals-and-recruitment-applications',
  //     },
  //   ]
  // },
  // {
  //   menu_title: 'Consulting',
  //   type: 'subMenu',
  //   child_routes: [
  //     {
  //       menu_title: 'Skills Management Consulting',
  //       path: '/consulting/skills-management-consulting',
  //     },
  //   ]
  // },
];

export default navLinks;
