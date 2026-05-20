import { useEffect, useRef } from 'react';
import SearchBar from '../../components/SearchBar';
import SearchAddedTree from '../../components/subcomponents/SearchAddedTree';

const ExperiencePlugin = () => {
  const srkRef = useRef(null);

  useEffect(() => {
    const currentSrkRef = srkRef.current;

    const updateMousePosition = (ev) => {
      if (!currentSrkRef) return;
      const { clientX, clientY } = ev;

      // Get the position of srkRef relative to the viewport
      const { left, top } = currentSrkRef.getBoundingClientRect();

      // Calculate offsets based on the position of srkRef
      const offsetX = clientX - left;
      const offsetY = clientY - top;

      // Set the gradient position based on the mouse position within srkRef
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

  return (
    <section className="my-5">
      <div
        ref={srkRef}
        className="container p-5 border shadow rounded mouse-cursor-gradient-tracking grad"
      >
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
            <SearchBar cansearch />
            <SearchAddedTree norate />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExperiencePlugin;
