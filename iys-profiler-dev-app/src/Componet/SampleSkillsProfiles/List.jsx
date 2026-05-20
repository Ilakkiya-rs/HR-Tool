'use client';

import React, { Suspense } from 'react';
import List from './ListComponent';

const ListWrapper = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <List />
    </Suspense>
  );
};

export default ListWrapper;
