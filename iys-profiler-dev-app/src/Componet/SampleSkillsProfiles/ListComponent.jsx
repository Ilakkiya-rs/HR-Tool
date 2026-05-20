'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Col, Container, Row, Spinner, Pagination, Form } from 'react-bootstrap';

const List = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [skillData, setSkillsData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const [selectedLetter, setSelectedLetter] = useState(searchParams.get('letter') || 'A');
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page')) || 1);
  const skillsPerPage = 12;
  const [totalPages, setTotalPages] = useState('');
  // Timeout ID for debounce
  const debounceTimeoutRef = useRef(null);

  const updateURL = useCallback((params) => {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.set('page', params.page);
    if (params.letter) searchParams.set('letter', params.letter);
    if (params.search) searchParams.set('search', params.search);

    window.history.pushState({}, '', `${pathname}?${searchParams.toString()}`);
  }, [pathname]);

  // Update the URL when the component mounts if no params are provided
  useEffect(() => {
    if (!searchParams.get('page') && !searchParams.get('letter')) {
      updateURL({ page: currentPage, letter: selectedLetter, search: searchTerm });
    }
  }, [currentPage, selectedLetter, searchTerm, updateURL, searchParams,]);

  const fetchSkillsData = useCallback(async () => {
    setLoading(true);
    try {
      let url = `https://api.myskillsplus.com/users/api/sampleskills/?page_no=${currentPage}&page_size=${skillsPerPage}`;
  
      if (searchTerm) {
        url += `&search_term=${searchTerm}`;
      }
  
      if (selectedLetter) {
        url += `&letter=${selectedLetter}`;
      }
  
      const res = await fetch(url);
  
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      const filteredKeys = data.skills;
  
      setSkillsData(data);
      console.log(skillData);
      setTotalPages(Math.ceil(data.total_skills / skillsPerPage));
      setFilteredData(filteredKeys);
      setLoading(false);
    } catch (err) {
      console.error("Fetch error:", err);
      setError('Failed to load skills data. Please try again later.');
      setLoading(false);
    }
  }, [currentPage, searchTerm, selectedLetter, skillsPerPage]);

  useEffect(() => {
    if (searchTerm.length >= 3 || searchTerm === '') {
      debounceTimeoutRef.current = setTimeout(() => {
        fetchSkillsData();
      }, 1000);
    }
    return () => clearTimeout(debounceTimeoutRef.current);
  }, [searchTerm, currentPage, selectedLetter, fetchSkillsData]);
  
  const handleAlphabetClick = (letter) => {
    setSelectedLetter(letter);
    setSearchTerm(''); // Clear search when a letter is selected
    setCurrentPage(1);
    updateURL({ page: 1, letter, search: '' }); // Ensure the search param is empty
  };

  const handleSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    setSearchTerm(searchTerm);
    setSelectedLetter(''); // Reset letter selection when searching
    setCurrentPage(1);
    updateURL({ page: 1, letter: '', search: searchTerm }); // Reset letter param in URL
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    if (searchTerm) {
      updateURL({ page: pageNumber, letter: '', search: searchTerm });
    } else {
      updateURL({ page: pageNumber, letter: selectedLetter, search: '' });
    }
    fetchSkillsData();
  };

  const getPaginationItems = () => {
    const pages = [];
    const delta = 2;

    if (currentPage > delta + 1) {
      pages.push(
        <Pagination.Item key={1} onClick={() => handlePageChange(1)}>
          1
        </Pagination.Item>
      );
      if (currentPage > delta + 2) {
        pages.push(<Pagination.Ellipsis key="start-ellipsis" disabled />);
      }
    }

    for (let i = Math.max(1, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      pages.push(
        <Pagination.Item key={i} active={i === currentPage} onClick={() => handlePageChange(i)}>
          {i}
        </Pagination.Item>
      );
    }

    if (currentPage < totalPages - delta - 1) {
      if (currentPage < totalPages - delta - 2) {
        pages.push(<Pagination.Ellipsis key="end-ellipsis" disabled />);
      }
      pages.push(
        <Pagination.Item key={totalPages} onClick={() => handlePageChange(totalPages)}>
          {totalPages}
        </Pagination.Item>
      );
    }

    return pages;
  };

  return (
    <section>
      <Container fluid="md">
        <Form.Group className="mb-3">
          <Form.Control
            type="text"
            placeholder="Search for a skill..."
            value={searchTerm}
            onChange={handleSearch}
            disabled={loading}
            className="rounded-3"
          />
        </Form.Group>

        {loading ? (
          <div className="text-center my-5">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        ) : error ? (
          <p className="text-danger">{error}</p>
        ) : (
          <>
            <div className="mb-4 mt-5">
              <h5 className="mb-5">Top Skills by {selectedLetter}</h5>
              <span className="mx-1">
                <p className="pagination-text">By Skill: </p>
                {alphabet.map((letter) => (
                  <a
                    key={letter}
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handleAlphabetClick(letter);
                    }}
                    className={`mx-1 ${letter === selectedLetter ? 'selected-letter' : 'letter'}`}
                  >
                    {letter}
                  </a>
                ))}
              </span>
            </div>
            
            {filteredData.length > 0 ? (
              <Row>
                {filteredData.map((skill) => {
                  const { skill_name } = skill;
                  const formatted_skill_name = skill_name.replace(/\s+/g, '-').replace(/\//g, '_')+'-skills-profile'; 
                  const slug = skill_name
                    .split(' ')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ');

                  return (
                    <Col lg="4" md="6" key={skill_name} className="mt-4">
                      <div className="d-flex justify-content-center">
                        <div className="card" style={{ width: '100%' }}>
                          <div className="card-body sampleprofile-heading p-2">
                            <Link href={`/sample-skills-profiles/${formatted_skill_name}`} target="_blank">
                              <div className="fs-5 text-center">
                                {slug} Skills Profile
                              </div>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </Col>
                  );
                })}
              </Row>
            ) : (
              <p className="d-flex">No skills data found</p>
            )}

            <Pagination className="mt-5 pagination">
              {getPaginationItems()}
            </Pagination>
          </>
        )}
      </Container>
    </section>
  );
};

export default List;
