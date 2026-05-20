'use client';

import React, { useMemo, useState } from 'react';

const GlobalContext = React.createContext();

export const GlobalStateProvider = ({ children }) => {
  const [globalVariable, setGlobalVariable] = useState('');

  const values = useMemo(
    () => ({
      globalVariable,
      setGlobalVariable
    }),
    [globalVariable, setGlobalVariable]
  );

  return (
    <GlobalContext.Provider value={values}>{children}</GlobalContext.Provider>
  );
};

export default GlobalContext;
