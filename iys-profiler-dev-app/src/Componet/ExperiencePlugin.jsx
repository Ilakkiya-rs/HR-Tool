'use client';

import { useEffect, useRef } from 'react';

import '@/assets/css/customCss.css';

const ExperiencePlugin = () => {
  const srkRef = useRef(null);

  useEffect(() => {
    const currentSrkRef = srkRef.current;
    currentSrkRef.style.setProperty('--x', `0px`);
    currentSrkRef.style.setProperty('--y', `0px`);
    localStorage.setItem('userRatedSkills', '[]');

    const updateMousePosition = (ev) => {
      if (!currentSrkRef) return;
      const { clientX, clientY } = ev;

      const { left, top } = currentSrkRef.getBoundingClientRect();

      const offsetX = clientX - left;
      const offsetY = clientY - top;

      currentSrkRef.style.setProperty('--x', `${offsetX}px`);
      currentSrkRef.style.setProperty('--y', `${offsetY}px`);
    };

    const handleMouseEnter = () => {
      window.addEventListener('mousemove', updateMousePosition);
    };

    const handleMouseLeave = () => {
      window.removeEventListener('mousemove', updateMousePosition);
    };

    if (currentSrkRef) {
      currentSrkRef.addEventListener('mouseenter', handleMouseEnter);
      currentSrkRef.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      if (currentSrkRef) {
        currentSrkRef.removeEventListener('mouseenter', handleMouseEnter);
        currentSrkRef.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  useEffect(() => {
    localStorage.setItem(
      'iys',
      JSON.stringify({
        page: 'Home',
        tap: 'all',
        profile_view: 'all',
        isEdit: true,
        isDelete: true,
        doughnt:true,
        experience:true
      })
    );
  }, []);

  return (
    <section
      ref={srkRef}
      id="experience-plugin-section"
      className="mouse-cursor-gradient-tracking grad shadow" // my-5
    >
      <div className="container rounded">
        <div className="d-flex flex-column align-items-center justify-content-between">
          <div className="col-12">
            <div className="mb-5">
              <h2 className="lh-base" style={{ color: 'white' }}>
                <span className="font-w-4 d-block">
                  Experience the richness of Skills Taxonomy here
                </span>{' '}
                search for a skill or occupation
              </h2>
            </div>
          </div>
          <div className="col-12 mb-5 mb-lg-0">
            <iframe
              style={{ borderRadius: '10px' }}
              src="/plugin/index.html"
              title="IYS Plugin Rating"
              height="900px"
              width="100%"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExperiencePlugin;
