'use client';

/* eslint-disable no-unused-vars */

import React, { useCallback, useContext, useRef, useState } from 'react';
import { AsyncTypeahead, Menu, MenuItem } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import Highlighter from 'react-highlight-words';
import { FaPlus } from 'react-icons/fa';
import GlobalContext from '../app/GlobalState';
import { clearsessionStorage } from '../utils/PathArray';
import { searchSkills } from './api/ApiCalls';
// import { fontWeight } from "@mui/system";
import '@/assets/css/customCss.css';

const SearchBar = (props) => {
  const { setGlobalVariable } = useContext(GlobalContext);
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState([]);
  const ref = useRef();
  const [searchKey, setSearchKey] = useState(0);

  const getListFrom = () => {
    if (sessionStorage.getItem('serach')) {
      return JSON.parse(sessionStorage.getItem('serach'));
    } else {
      return [];
    }
  };

  const handleSearch1 = () => {};

  const handleSearch = useCallback((query) => {
    if (
      ref.current.getInput().value &&
      ref.current.getInput().value.trim().length > 1
    ) {
      setIsLoading(true);
      searchSkills(encodeURIComponent(ref.current.getInput().value.trim()))
        .then((response) => {
          return response.data;
        })
        .then((data) => {
          if (ref.current.getInput().value === data.query) {
            setOptions(data.matches);

            sessionStorage.setItem('serach', JSON.stringify(data.matches));
          }
          // console.warn(query,response.data)
          setIsLoading(false);
          clearsessionStorage();
        })
        .catch((error) => console.error(error));
    } else {
      sessionStorage.setItem('serach', JSON.stringify([]));
    }
  }, []);

  const iconStyle = {
    color: '#706565' // set the color to light grey
  };
  const menuStyle = {
    width: '100%'
  };
  const searchBarStyle = {
    color: 'blue'
  };

  const filterBy = () => true;

  const have_child = (skillObj) => {
    if (props?.cansearch && skillObj.skills[0].child_count > 0) {
      return <FaPlus style={iconStyle} />;
    }
    return <>{'  '}</>;
  };
  const handleSelect = (option) => {
    setGlobalVariable(option[0]);
  };

  const highlighterWords = (item) => {
    return (
      <Highlighter
        searchWords={ref.current.getInput().value.trim().split(' ')}
        autoEscape={true}
        textToHighlight={item.term}
        highlightTag={({ children }) => <strong>{children}</strong>}
      />
    );
  };

  const renderSerach = () => {
    return (
      <>
        <Menu style={menuStyle} id="menu">
          {getListFrom().map((item, index) => (
            <React.Fragment key={index}>
              <MenuItem key={index} option={item} position={index}>
                {have_child(item)} {highlighterWords(item)}
              </MenuItem>
            </React.Fragment>
          ))}
        </Menu>
      </>
    );
  };
  return (
    <>
      <div
        className="d-flex align-items-center gap-2"
        style={{ fontWeight: 'bolder' }}
      >
        <AsyncTypeahead
          filterBy={filterBy}
          id="skillSearchBar"
          isLoading={isLoading}
          key={searchKey}
          labelKey={(option) =>
            option.skill && typeof option.skills[0].name === 'string'
              ? option.term
              : ''
          }
          autoFocus={false}
          highlightOnlyResult={true}
          minLength={1}
          onSearch={handleSearch1}
          ref={ref}
          onInputChange={(d) => {
            handleSearch();
          }}
          options={options}
          placeholder="Search for an occupation or role"
          size="lg"
          clearButton={false}
          onChange={handleSelect}
          renderMenu={renderSerach}
          className="rounded"
          style={{ width: '100%', fontWeight: 'bolder' }}
        />
      </div>
    </>
  );
};

export default SearchBar;
