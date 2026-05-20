import { APP_URL, METADATA } from '@/constants/seo';

import BookADemo from '@/Pages/BookADemo';

export const metadata = {
  ...METADATA,
  title: 'Book A Demo - IYS Skills Profiler',
  description:
    'Book a demo to experience the skills profiler, mapping skills for people and jobs, covering knowledge, tools, activities, domain expertise, with an updated skills taxonomy',
  alternates: {
    canonical: `${APP_URL}/osm/demo`
  },
  twitter: {
    ...METADATA.twitter,
    title: 'Book A Demo - IYS Skills Profiler',
    description:
      'Book a demo to experience the skills profiler, mapping skills for people and jobs, covering knowledge, tools, activities, domain expertise, with an updated skills taxonomy'
  },
  openGraph: {
    ...METADATA.openGraph,
    title: 'Book A Demo - IYS Skills Profiler',
    description:
      'Book a demo to experience the skills profiler, mapping skills for people and jobs, covering knowledge, tools, activities, domain expertise, with an updated skills taxonomy',
    url: `${APP_URL}/osm/demo`
  }
};

const BookADemoPage = () => {
  return <BookADemo />;
};

export default BookADemoPage;
