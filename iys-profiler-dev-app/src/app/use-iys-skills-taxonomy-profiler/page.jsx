import UsageOptions from '@/Pages/UsageOptions';
import Link from 'next/link';

const usageOptionsPage = () => {
  return (
    <>
      <UsageOptions />
      <section>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-12">
              <h3 className="lh-base">Useful Links</h3>
              <blockquote className="mb-0">
                <p className="lead mb-4 lh-lg">
                  <Link href="/skills-taxonomy-and-profiler">
                    About Skills Taxonomy and Profile
                  </Link>
                  <br />
                  <Link href="/use-cases">
                    Use Cases of Skils Taxonomy and Profiler
                  </Link>
                </p>
              </blockquote>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default usageOptionsPage;
