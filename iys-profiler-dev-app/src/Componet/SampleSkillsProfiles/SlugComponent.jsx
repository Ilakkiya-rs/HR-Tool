'use client';
import { useEffect, useState } from 'react';
import '@/assets/css/customCss.css';

const SlugComponent = ({ params, skillData }) => {
  const slug = params.slug.replace(/-/g, ' ').replace(/_/g, '/').replace(/-skills-profile$/, '');
  const [isDataReady, setIsDataReady] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && skillData) {
      const userRatedSkills = skillData[slug];
      if (userRatedSkills) {
        localStorage.setItem('sampleUserRatedSkills', JSON.stringify(userRatedSkills));
        setIsDataReady(true);
      } else {
        console.warn('userRatedSkills is undefined');
      }

      // Set additional state in localStorage
      localStorage.setItem(
        'iys',
        JSON.stringify({
          tap: 'profile',
          profile_view: 'all',
          isEdit: false,
          isDelete: false,
          doughnt: true,
          experience: true,
        })
      );

      const handleBeforeUnload = () => {
        localStorage.removeItem('sampleUserRatedSkills');
      };
  
      window.addEventListener('beforeunload', handleBeforeUnload);
  
      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
        localStorage.removeItem('sampleUserRatedSkills');
      };

    }
  }, [slug, skillData]);

  return (
    <section id="experience-plugin-section">
      <div className="container rounded px-0">
        <div className="d-flex flex-column align-items-center justify-content-between">
          <div className="col-12">
            {skillData && isDataReady && (
              <iframe
                style={{ borderRadius: '10px' }}
                src="/plugin/index.html"
                title="IYS Plugin Rating"
                height="900px"
                width="100%"
                className="shadow rounded"
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SlugComponent;
