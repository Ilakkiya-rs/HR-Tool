'use client';

import AlterContentTwo from '@/Componet/Home/AlterContentTwo';
import Herosection from '@/Componet/Home/Herosection';
import Newsletter from '@/Componet/Newsletter';
import Usecases from '@/Componet/Home/Usecases';
import UsecasesPeople from '@/Componet/Home/UsecasesPeople';

const HomePage = () => (
  <>
    <Herosection />
    <div className="page-content">
      <AlterContentTwo />
      <Usecases />
      <UsecasesPeople />
      <Newsletter />
    </div>
  </>
);

export default HomePage;
