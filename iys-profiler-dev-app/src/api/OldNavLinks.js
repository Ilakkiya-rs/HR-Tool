/**
 *  Main Menu Json
 */
const navLinks = [
  // Home
  {
    menu_title: 'Home',
    path: '/',
    icon: 'home'
  },
  // Skills Profiler
  {
    menu_title: 'Skills Profiler',
    path: '/skills-profiler',
    mega: true,
    icon: 'party_mode'
  },
  // API / Plugin
  {
    menu_title: 'API / Plugin',
    path: '/skills-profiler-plugin',
    mega: true,
    icon: 'party_mode'
  },
  // SaaS Applications
  // {
  //    "menu_title": "SaaS Applications",
  //    "type": "subMenu",
  //    "child_routes": [
  //       {
  //          "path": "/saas-application/employee-skills-management",
  //          "menu_title": "Employee Skills Management",
  //          "icon": "arrow_right_alt",
  //          "child_routes": null
  //       },
  //       // {
  //       //    "path": "#",
  //       //    "menu_title": "Candidate Skills Management",
  //       //    "icon": "arrow_right_alt",
  //       //    "child_routes": null
  //       // },
  //       // {
  //       //    "path": "#",
  //       //    "menu_title": "Organization Skills Management",
  //       //    "icon": "arrow_right_alt",
  //       //    "child_routes": null
  //       // },
  //    ]
  // },
  // Sample Skills Profiles
  {
    menu_title: 'Sample Skills Profiles',
    path: '/sample-skills-profiles/list'
  },
  // Skills Taxonomy
  {
    menu_title: 'Skills Taxonomy',
    type: 'subMenu',
    child_routes: [
      {
        path: '/skills-taxonomy/information-technology-skills',
        menu_title: 'IT Skills',
        icon: 'arrow_right_alt',
        child_routes: null
      }
    ]
  },
  // Use Cases
  {
    menu_title: 'Use Cases',
    type: 'subMenu',
    child_routes: [
      {
        path: '/use-cases/lms-learning-management-system',
        menu_title: 'Learning Management Systems',
        icon: 'arrow_right_alt',
        child_routes: null
      },
      {
        path: '/use-cases/training-providers',
        menu_title: 'Training Providers',
        icon: 'arrow_right_alt',
        child_routes: null
      }
    ]
  }
];

export default navLinks;
