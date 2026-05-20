"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "@/components/Header/HomeHeader";
import Image from "next/image";
import ExperienceSkillProfilerPlugin from "./ExperienceSkillProfilerPlugin";
import Select from 'react-select';
import { useRouter } from "next/navigation";

export default function CreateSkillsProfile() {
  const [jobTitle, setJobTitle] = useState('');
  const [tableView, setTableView] = useState(false);
  const [countryOptions, setCountryOptions] = useState([]);
  const [stateOptions, setStateOptions] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [findMatch, setFindMatch] = useState({
    vspMinCost: "",
    vspMaxCost: "",
    vspCurrency: "USD",
    pbpMinFee: "",
    pbpMaxFee: "",
    pbpCurrency: "USD",
    pcpMinFee: "",
    pcpMaxFee: "",
    pcpCurrency: "USD",
    employmentType: "",
    state: "",
    city: "",
    country: "",
    fullTime: false,
    partTime: false,
  });
  const [profiles, setProfiles] = useState([]);
  const router = useRouter();
  const [selectedProfiles, setSelectedProfiles] = useState([]);
  const [matchingProfile, setMatchingProfile] = useState(false);

  const requiredRatings = {};

  const handleShortlistToggle = (profile, checked) => {
    setSelectedProfiles((prev) =>
      checked
        ? [...prev, profile]
        : prev.filter((p) => p.user_id !== profile.user_id)
    );
  };  
  
  const handleSendRequest = () => {
    if (selectedProfiles.length === 0) {
      alert("Please select at least one profile");
      return;
    }

    const userRatedSkills = JSON.parse(localStorage.getItem("userRatedSkills"));
  
    if (!jobTitle || !userRatedSkills) {
      alert("Missing job title or rated skills. Please complete the form first.");
      return;
    }
    
    localStorage.setItem("findMatchRequest", JSON.stringify(findMatch));
    localStorage.setItem("matchingProfiles", JSON.stringify(profiles));
    localStorage.setItem("shortlistedProfiles", JSON.stringify(selectedProfiles));
    localStorage.setItem("jobTitle", jobTitle);
    localStorage.setItem("jobSkills", JSON.stringify(userRatedSkills));

    router.push("/auth/signin");
  };

  useEffect(() => {
    const fetchCountries = async () => {
        try {
          // const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/countries/`);
          const res = await fetch('https://api.myskillsplus.com/api/countries/');
          if (!res.ok) throw new Error('Failed to fetch countries');
          const data = await res.json();
          setCountryOptions(data.map(country => ({ value: country.id, label: country.name })));
        } catch (error) {
          console.error('Error fetching countries:', error);
        }
    };
  
    fetchCountries();
  }, []);

  const resetProfile = () => {
    setFindMatch({
        vspMinCost: "",
        vspMaxCost: "",
        vspCurrency: "USD",
        pbpMinFee: "",
        pbpMaxFee: "",
        pbpCurrency: "USD",
        pcpMinFee: "",
        pcpMaxFee: "",
        pcpCurrency: "USD",
        employmentType: "",
        state: "",
        city: "",
        country: "",
        fullTime: false,
        partTime: false,
    });
    setJobTitle('');
    setTableView(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFindMatch(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEmploymentTypeChange = (e) => {
    const { name, checked } = e.target;
    setFindMatch(prev => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const userRatedSkills = localStorage.getItem('userRatedSkills');
  
    if (!userRatedSkills) {
      alert('No rated skills found. Profile not submitted.');
      return;
    }

    let userRatedSkillsJson;
    try {
      userRatedSkillsJson = JSON.parse(userRatedSkills);
    } catch (err) {
      console.error('Invalid userRatedSkills JSON:', err);
      alert('Invalid skill data. Please re-enter skills.');
      return;
    }

    const allRatingsEmpty = userRatedSkillsJson.every((skill) => {
      const ratingsArray = skill.rating;
      if (!Array.isArray(ratingsArray) || ratingsArray.length === 0) {
        return true;
      }
      return ratingsArray.every((r) => !r.rating || r.rating === "");
    });
    
    if (allRatingsEmpty) {
      alert('Please give proficiency ratings to the Skills before "Apply".');
      return;
    }
  
    const payload = {
      findMatch: {
        ...findMatch,
        countryName: findMatch.countryName,
        stateName: findMatch.stateName,
        cityName: findMatch.cityName,
      },
      jobTitle: jobTitle,
      ratedSkills: JSON.parse(userRatedSkills),
    };
  
    try {
      // const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/users/api/find-matching-profiles/`, {
      const res = await fetch('https://api.myskillsplus.com/users/api/find-matching-profiles/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
  
      if (!res.ok) throw new Error('Failed to submit');
  
      const data = await res.json();
      console.log('Successfully submitted:', data);
      alert('Profile filtered successfully!');
      setProfiles(data);
      setMatchingProfile(true);
      setTableView(true);
    } catch (error) {
      console.error('Error submitting profile:', error);
      alert('Error saving profile.');
    }
  };  

  if(profiles.length > 0 ){
    profiles.forEach(profile => {
      profile.skill_details.forEach(skill => {
        if (!requiredRatings[skill.skill_name]) {
          requiredRatings[skill.skill_name] = skill.request_rating;
        }
      });
    }); 
  }

  const handleCountryChange = async (selectedOption) => {
    setSelectedCountry(selectedOption);
    handleSelectChange('country', selectedOption);
    setStateOptions([]);
    setCityOptions([]);
  
    if (selectedOption) {
      try {
        // const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/states/${selectedOption.value}`);
        const res = await fetch(`https://api.myskillsplus.com/api/states/${selectedOption.value}`);
        if (!res.ok) throw new Error('Failed to fetch states');
        const data = await res.json();
        setStateOptions(data.map(state => ({ value: state.id, label: state.name })));
      } catch (error) {
        console.error('Error fetching states:', error);
      }
    }
  };
  
  const handleStateChange = async (selectedOption) => {
    setSelectedState(selectedOption);
    handleSelectChange('state', selectedOption);
    setCityOptions([]);
  
    if (selectedOption && selectedCountry) {
      try {
        // const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/cities/${selectedCountry.value}/${selectedOption.value}`);
        const res = await fetch(`https://api.myskillsplus.com/api/cities/${selectedCountry.value}/${selectedOption.value}`);
        if (!res.ok) throw new Error('Failed to fetch cities');
        const data = await res.json();
        setCityOptions(data.map(city => ({ value: city.id, label: city.name })));
      } catch (error) {
        console.error('Error fetching cities:', error);
      }
    }
  };
  
  const handleSelectChange = (field, selectedOption) => {
    setFindMatch((prev) => ({
    ...prev,
    [field]: selectedOption ? selectedOption.value : '', // store ID for API
    [`${field}Name`]: selectedOption ? selectedOption.label : '', // store name for display
    }));
  };
  
  const customStyles = {
    control: (base, state) => ({
      ...base,
      borderRadius: 8,
      borderColor: '#d1d5db',
      padding: '1px',
      boxShadow: state.isFocused ? 'none' : base.boxShadow,
      outline: 'none',
    }),
    input: (base) => ({
      ...base,
      outline: 'none',
      boxShadow: 'none',
    }),
    menu: (base) => ({
      ...base,
      borderRadius: 8,
      zIndex: 10,
    }),
  };

  const handleClear = () => {
    resetProfile();
  };

  const encodeUserName = (name) => {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let hash = 0;

    for (let i = 0; i < name.length; i++) {
      hash = (hash << 5) - hash + name.charCodeAt(i);
      hash = hash & hash;
    }
  
    let num = Math.abs(hash);
    let encoded = '';
  
    while (num > 0) {
      encoded = chars[num % 62] + encoded;
      num = Math.floor(num / 62);
    }
  
    return encoded || '0';
  };  
  
  return (
    <>
      <Header sidebarOpen={false} />
      <ToastContainer />
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="p-4 text-center">
          <h4 className="mt-2 mb-2 text-2xl font-bold text-black dark:text-white">
            We've just launched
          </h4>
          <p className="text-lg text-black">
            MySkillsPlus is live and individuals have begun creating their skills profiles. As we're just starting out, you may not see any profiles listed here yet.
          </p>
        </div>
        <div className="p-4 text-center">
          <h4 className="mt-2 mb-2 text-2xl font-bold text-black dark:text-white">
            New profiles are being added every day
          </h4>
          <p className="text-lg text-black">
            Leave us your email. We will notify when there are sizeable number of profiles here.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 sm:gap-10 items-center justify-center p-4 border-b-2 border-[#EEEEEE] dark:border-[#616161]">
          <a href="#" className="text-base text-blue-600 underline font-medium">
            View Sample Skills Profiles
          </a>
          <a href="#" className="text-base text-blue-600 underline font-medium">
            Watch video on the recruitment process
          </a>
        </div>
        <div className="p-6 text-center">
          <h3 className="mt-2 mb-4 text-3xl font-bold text-black dark:text-white">Search Skills Profile</h3>
          <p className="text-xl">Find matching Skills Profiles of Individuals</p>
        </div>
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 p-6 text-center">
          {/* Step 1 */}
          <div className="relative flex flex-col items-center bg-white dark:bg-[#343a40] shadow-md rounded-2xl p-6 w-full max-w-xs hover:scale-105 transition">
            <div className="text-blue-600 text-xl font-semibold mb-2">Step 1</div>
            <h3 className="text-2xl font-bold text-black dark:text-white">Fill Job Preference</h3>
          </div>
          {/* Step 2 */}
          <div className="relative flex flex-col items-center bg-white dark:bg-[#343a40] shadow-md rounded-2xl p-6 w-full max-w-xs hover:scale-105 transition">
            <div className="text-blue-600 text-xl font-semibold mb-2">Step 2</div>
            <h3 className="text-2xl font-bold text-black dark:text-white">Create Job Skills Profile</h3>
          </div>
          {/* Step 3 */}
          <div className="flex flex-col items-center bg-white dark:bg-[#343a40] shadow-md rounded-2xl p-6 w-full max-w-xs hover:scale-105 transition">
            <div className="text-blue-600 text-xl font-semibold mb-2">Step 3</div>
            <h3 className="text-2xl font-bold text-black dark:text-white">Click "Apply"</h3>
          </div>
        </div>
        <div className="">
          <section className="mx-auto container experienceSection p-3 lg:p-8 shadow-lg mb-4 lg:border lg:border-[#F5F5F5] rounded-lg">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Job Find Matches Form */}
              <div className="job-find-matches mb-4">
                {/* Job Title */}
                <div className="job-title mb-6">
                  <h2 className="text-black text-lg font-semibold mb-2">Job Title</h2>
                  <div className="flex border border-[#D1D5DB] rounded-lg overflow-hidden">
                    <input
                        type="text"
                        className="p-2 text-md w-full focus:outline-none"
                        placeholder="Enter your job title"
                        value={jobTitle}
                        onChange={(e) => setJobTitle(e.target.value)}
                    />
                  </div>
                </div>
                <div className="rounded-xl bg-white p-4 shadow mb-4">
                    <h3 className="mb-4 text-lg font-bold text-black">Find Matches</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4 text-sm text-[#24303F]">
                        {/* VSP Section */}
                        <div className="vsp-section">
                            <h2 className="font-semibold mb-2">VSP Between</h2>
                            <div className="flex border border-[#D1D5DB] rounded-lg overflow-hidden">
                                <input
                                    type="number"
                                    className="p-2 text-sm w-full focus:outline-none"
                                    placeholder="Min cost"
                                    value={findMatch.vspMinCost}
                                    onChange={(e) => setFindMatch({ ...findMatch, vspMinCost: e.target.value })}
                                />
                                <div className="p-1">
                                    <select
                                        className="text-sm bg-[#F6F6F6] p-1.5 rounded-md text-black focus:outline-none"
                                        style={{ minWidth: '4rem' }}
                                        value={findMatch.vspCurrency}
                                        onChange={(e) => setFindMatch({ ...findMatch, vspCurrency: e.target.value })}
                                    >
                                        <option value="USD">USD</option>
                                        <option value="INR">INR</option>
                                    </select>
                                </div>
                                <input
                                    type="number"
                                    className="p-2 border-l border-[#d1d5db] text-sm w-full focus:outline-none"
                                    placeholder="Max cost"
                                    value={findMatch.vspMaxCost}
                                    onChange={(e) => setFindMatch({ ...findMatch, vspMaxCost: e.target.value })}
                                />
                                <div className="p-1">
                                    <select
                                        className="text-sm bg-[#F6F6F6] p-1.5 rounded-md text-black focus:outline-none"
                                        style={{ minWidth: '4rem' }}
                                        value={findMatch.vspCurrency}
                                        onChange={(e) => setFindMatch({ ...findMatch, vspCurrency: e.target.value })}
                                    >
                                        <option value="USD">USD</option>
                                        <option value="INR">INR</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        {/* PBP View Fee */}
                        <div className="pbp-section">
                            <h2 className="font-semibold mb-2">PBP View Fee Between</h2>
                            <div className="flex border border-[#D1D5DB] rounded-lg overflow-hidden">
                                <input
                                    type="number"
                                    className="p-2 text-sm w-full focus:outline-none"
                                    placeholder="Min fee"
                                    value={findMatch.pbpMinFee}
                                    onChange={(e) => setFindMatch({ ...findMatch, pbpMinFee: e.target.value })}
                                />
                                <div className="p-1">
                                    <select
                                        className="text-sm bg-[#F6F6F6] p-1.5 rounded-md text-black focus:outline-none"
                                        style={{ minWidth: '4rem' }}
                                        value={findMatch.pbpCurrency}
                                        onChange={(e) => setFindMatch({ ...findMatch, pbpCurrency: e.target.value })}
                                    >
                                        <option>USD</option>
                                        <option>INR</option>
                                    </select>
                                </div>
                                <input
                                    type="number"
                                    className="p-2 border-l border-[#d1d5db] text-sm w-full focus:outline-none"
                                    placeholder="Max fee"
                                    value={findMatch.pbpMaxFee}
                                    onChange={(e) => setFindMatch({ ...findMatch, pbpMaxFee: e.target.value })}
                                />
                                <div className="p-1">
                                    <select
                                        className="text-sm bg-[#F6F6F6] p-1.5 rounded-md text-black focus:outline-none"
                                        style={{ minWidth: '4rem' }}
                                        value={findMatch.pbpCurrency}
                                        onChange={(e) => setFindMatch({ ...findMatch, pbpCurrency: e.target.value })}
                                    >
                                        <option>USD</option>
                                        <option>INR</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        {/* PCP View Fee */}
                        <div className="pcp-section">
                            <h2 className="font-semibold mb-2">PCP View Fee Between</h2>
                            <div className="flex border border-[#D1D5DB] rounded-lg overflow-hidden">
                                <input
                                    type="number"
                                    className="p-2 text-sm w-full focus:outline-none"
                                    placeholder="Min fee"
                                    value={findMatch.pcpMinFee}
                                    onChange={(e) => setFindMatch({ ...findMatch, pcpMinFee: e.target.value })}
                                />
                                <div className="p-1">
                                    <select
                                        className="text-sm bg-[#F6F6F6] p-1.5 rounded-md text-black focus:outline-none"
                                        style={{ minWidth: '4rem' }}
                                        value={findMatch.pcpCurrency}
                                        onChange={(e) => setFindMatch({ ...findMatch, pcpCurrency: e.target.value })}
                                    >
                                        <option>USD</option>
                                        <option>INR</option>
                                    </select>
                                </div>
                                <input
                                    type="number"
                                    className="p-2 border-l border-[#d1d5db] text-sm w-full focus:outline-none"
                                    placeholder="Max fee"
                                    value={findMatch.pcpMaxFee}
                                    onChange={(e) => setFindMatch({ ...findMatch, pcpMaxFee: e.target.value })}
                                />
                                <div className="p-1">
                                    <select
                                        className="text-sm bg-[#F6F6F6] p-1.5 rounded-md text-black focus:outline-none"
                                        style={{ minWidth: '4rem' }}
                                        value={findMatch.pcpCurrency}
                                        onChange={(e) => setFindMatch({ ...findMatch, pcpCurrency: e.target.value })}
                                    >
                                        <option>USD</option>
                                        <option>INR</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Workplace Preference */}
                    <h2 className="font-semibold mb-4 text-black text-lg">Work Preference</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-[#24303F]">
                        {/* Full-time employment */}
                        <div className="col-span-1 mb-4">
                            <h3 className="font-semibold mb-4">Full-time Employment</h3>  
                            <div className="flex flex-col md:flex-col lg:flex-row lg:gap-5 md:gap-5 gap-5 lg:mb-4 text-[13px]">
                                {["WFO", "WFH", "Hybrid"].map((type) => (
                                    <label key={type} className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            name="employmentType"
                                            value={type}
                                            onChange={handleInputChange}
                                            checked={findMatch.employmentType === type}
                                        />
                                        {type === "WFO" ? "WFO Only" : type === "WFH" ? "WFH Only" : "Hybrid - WFH/WFO"}
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div className="col-span-2">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Current Location */}
                            <div className="mb-2 col-span-2">
                                <h3 className="text-sm font-semibold lg:mb-2 md:mb-4 mb-4">Location</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4 md:gap-4 lg:gap-1">
                                    {/* Country Select */}
                                    <Select
                                        className="text-sm"
                                        styles={customStyles}
                                        placeholder="Select Country"
                                        isClearable
                                        value={countryOptions.find(c => c.value === findMatch.country) || null}
                                        onChange={handleCountryChange}
                                        options={countryOptions}
                                    />

                                    {/* State Select */}
                                    <Select
                                        className="text-sm"
                                        styles={customStyles}
                                        placeholder="Select State"
                                        isClearable
                                        value={stateOptions.find(s => s.value === findMatch.state) || null}
                                        onChange={handleStateChange}
                                        options={stateOptions}
                                        isDisabled={!selectedCountry}
                                    />

                                    {/* City Select */}
                                    <Select
                                        className="text-sm"
                                        styles={customStyles}
                                        placeholder="Select City"
                                        isClearable
                                        value={cityOptions.find(c => c.value === findMatch.city) || null}
                                        onChange={(selected) => handleSelectChange("city", selected)}
                                        options={cityOptions}
                                        isDisabled={!selectedState} 
                                    />
                                </div>
                            </div>
                            {/* Employment Type */}
                            <div className="mb-4 col-span-1">
                                <h3 className="font-semibold mb-4">Employment Type</h3>
                                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2">
                                <label className="flex items-center gap-2 text-sm">
                                    <input
                                    type="checkbox"
                                    name="fullTime"
                                    checked={findMatch.fullTime}
                                    onChange={handleEmploymentTypeChange}
                                    />
                                    Full-time
                                </label>

                                <label className="flex items-center gap-2 text-sm">
                                    <input
                                    type="checkbox"
                                    name="partTime"
                                    checked={findMatch.partTime}
                                    onChange={handleEmploymentTypeChange}
                                    />
                                    Part-time
                                </label>
                                </div>
                            </div>
                            </div>
                        </div>
                    </div>
                    {/* Buttons */}
                    <div className="flex justify-end gap-4">
                        <button type="button" onClick={handleClear} className="px-4 py-1 rounded-full border border-gray-400 text-gray-600 hover:bg-gray-100 text-sm">
                            Clear
                        </button>
                        <button type="submit" className="px-4 py-1 rounded-full bg-blue-600 text-white hover:bg-blue-700 text-sm">
                            Apply
                        </button>
                    </div>
                </div>
                {/* <div className="rounded-xl bg-white p-4 shadow">
                  {tableView && profiles.length > 0 ? (
                    <div className="overflow-x-auto rounded-xl">
                      {selectedProfiles.length > 0 && (
                        <div className="flex justify-end mb-4">
                          <button type="button" className="px-4 py-1.5 rounded-full bg-blue-600 text-white hover:bg-blue-700 text-sm" onClick={handleSendRequest}>
                            Send Request
                          </button>
                        </div>
                      )}
                      <table className="min-w-full text-sm text-center">
                        <thead className="bg-black text-white">
                          <tr>
                            <th className="p-2 text-left font-semibold">Skills</th>
                            <th className="p-2 text-center font-semibold"></th>
                            {profiles.map((profile, index) => (
                              <th key={index} className="p-2">{profile.vsp_details.name}</th>
                            ))}
                          </tr>
                        </thead>

                        <tbody>
                          <tr>
                            <td className="p-2 text-left">VSP ($)</td>
                            <td className="p-2 text-center"></td>
                            {profiles.map((profile, i) => (
                              <td key={i} className="p-2">{profile.vsp_details.vspCost}</td>
                            ))}
                          </tr>

                          <tr>
                            <td className="p-2 text-left">PBP View Fee Between ($)</td>
                            <td className="p-2 text-center"></td>
                            {profiles.map((profile, i) => (
                              <td key={i} className="p-2">{profile.vsp_details.pbpFee}</td>
                            ))}
                          </tr>

                          <tr>
                            <td className="p-2 text-left">PCP View Fee Between ($)</td>
                            <td className="p-2 text-center"></td>
                            {profiles.map((profile, i) => (
                              <td key={i} className="p-2">{profile.vsp_details.pcpFee}</td>
                            ))}
                          </tr>

                          <tr className="bg-black text-white">
                            <td className="p-2 font-semibold text-left">Required Skills</td>
                            <td className="p-2 font-semibold text-center">Required Proficiency</td>
                            <td colSpan={profiles.length} className="p-2 font-semibold">Individual Skills Proficiency</td>
                          </tr>

                          <tr>
                            <td className="p-2 text-left text-blue-600 font-medium cursor-pointer">Shortlist</td>
                            <td className="p-2 text-center"></td>
                            {profiles.map((profile) => (
                              <td key={profile.user_id} className="p-2">
                                <input
                                  type="checkbox"
                                  onChange={(e) => handleShortlistToggle(profile, e.target.checked)}
                                  checked={selectedProfiles.some((p) => p.user_id === profile.user_id)}
                                  className="accent-blue-600"
                                />
                              </td>
                            ))}
                          </tr>

                          <tr>
                            <td className="p-2 text-left font-medium">Match Score</td>
                            <td className="p-2 text-center"></td>
                            {profiles.map((profile, i) => {
                              let actual = 0;
                              let expected = 0;

                              profile.skill_details.forEach(skill => {
                                const req = requiredRatings[skill.skill_name] || 0;
                                const user = Math.min(skill.user_rating, req); // cap user rating
                                actual += user;
                                expected += req;
                              });

                              const matchScore = expected ? Math.round((actual / expected) * 100) : 0;
                              return <td key={i} className="p-2">{matchScore}%</td>;
                            })}
                          </tr>

                          {(() => {
                            const skillSet = new Set();
                            profiles.forEach(profile =>
                              profile.skill_details.forEach(skill => skillSet.add(skill.skill_name))
                            );
                            const uniqueSkills = Array.from(skillSet);

                            return uniqueSkills.map((skillName, rowIndex) => (
                              <tr key={rowIndex}>
                                <td className="p-2 text-left">{skillName}</td>
                                <td className="p-2 text-center font-medium">
                                  {requiredRatings[skillName] ?? 'N/A'}
                                </td>
                                {profiles.map((profile, colIndex) => {
                                  const skill = profile.skill_details.find(s => s.skill_name === skillName);
                                  return (
                                    <td key={colIndex} className="p-2">
                                      {skill ? skill.user_rating : 'N/A'}
                                    </td>
                                  );
                                })}
                              </tr>
                            ));
                          })()}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center p-8">
                      <img src="/images/logo/no-data.png" alt="No Data" className="w-48 mb-2" />
                      <h3 className="font-semibold text-black text-lg">No fee selected yet</h3>
                      <p className="text-gray-500 text-xs text-center">Kindly choose a fee range from the list above.</p>
                    </div>
                  )}
                </div> */}
                {profiles.length > 0 ? (
                    <div className="rounded-xl bg-white p-4 shadow">
                      {selectedProfiles.length > 0 && (
                          <div className="flex justify-end mb-4">
                          <button
                              type="button"
                              onClick={handleSendRequest}
                              className="px-4 py-1.5 rounded-full bg-blue-600 text-white hover:bg-blue-700 text-sm"
                          >
                              Send Request
                          </button>
                          </div>
                      )}
                      <div className="overflow-x-auto">
                        <table className="min-w-full table-auto text-sm border border-[#F5F5F5] rounded-lg">
                          <thead className="bg-[#F5F5F5] text-left">
                            <tr>
                              <th className="px-4 py-2 border">Profile ID</th>
                              <th className="px-4 py-2 border">Match %</th>
                              <th className="px-4 py-2 border">VSP</th>
                              <th className="px-4 py-2 border">PBP</th>
                              <th className="px-4 py-2 border">PCP</th>
                              <th className="px-4 py-2 border">Shortlist</th>
                            </tr>
                          </thead>
                          <tbody>
                            {profiles.map((profile) => {
                              let actual = 0;
                              let expected = 0;
                              profile.skill_details.forEach(skill => {
                                const req = requiredRatings[skill.skill_name] || 0;
                                const user = Math.min(skill.user_rating, req);
                                actual += user;
                                expected += req;
                              });
                              const matchScore = expected ? Math.round((actual / expected) * 100) : 0;

                              return (
                                <tr key={profile.user_id} className="border-t hover:bg-gray-50 text-left">
                                  <td
                                    className="px-4 py-2 border font-medium text-blue-600 cursor-pointer hover:underline"
                                    onClick={() =>
                                      window.open(`${process.env.NEXT_PUBLIC_INDIVIDUAL_PROFILE_URL}individual/${profile.user_id}`, '_blank')
                                    }
                                  >
                                    {profile.user_id}
                                  </td>
                                  {/* <td className="px-4 py-2 border font-medium">{profile.user_id}</td> */}
                                  <td className="px-4 py-2 border">{matchScore}%</td>
                                  <td className="px-4 py-2 border">${profile.vsp_details?.vspCost}</td>
                                  <td className="px-4 py-2 border">${profile.vsp_details?.pbpFee}</td>
                                  <td className="px-4 py-2 border">${profile.vsp_details?.pcpFee}</td>
                                  <td className="px-4 py-2 border">
                                    <input
                                      type="checkbox"
                                      onChange={(e) => handleShortlistToggle(profile, e.target.checked)}
                                      checked={selectedProfiles.some((p) => p.user_id === profile.user_id)}
                                      className="accent-blue-600"
                                    />
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                ) : matchingProfile ? (
                    <div className="rounded-xl bg-white p-4 shadow">
                      <div className="flex flex-col items-center justify-center p-8">
                        <img src="/images/logo/no-data.png" alt="No Data" className="w-48 mb-2" />
                        <h3 className="font-semibold text-black text-lg">No profiles matched</h3>
                        <p className="text-gray-500 text-xs text-center">Try adjusting your filters to find candidates.</p>
                      </div>
                    </div>
                ): null}
                {/* {profiles.length > 0 ? (
                  <div className="rounded-xl bg-white p-4 shadow">
                    <div className="overflow-x-auto rounded-xl">
                        {selectedProfiles.length > 0 && (
                        <div className="flex justify-end mb-4">
                            <button type="button" className="px-4 py-1.5 rounded-full bg-blue-600 text-white hover:bg-blue-700 text-sm" onClick={handleSendRequest}>
                            Send Request
                            </button>
                        </div>
                        )}
                        <table className="min-w-full text-sm text-center">
                          <thead className="bg-black text-white">
                            <tr>
                              <th className="p-2 text-left font-semibold">Skills</th>
                              <th className="p-2 text-center font-semibold">Required Proficiency</th>
                              {profiles.map((profile, index) => (
                                <th key={index} className="p-2">{encodeUserName(profile.vsp_details.name)}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="p-2 text-left text-blue-600 font-medium cursor-pointer">Shortlist</td>
                              <td className="p-2 text-center"></td>
                              {profiles.map((profile) => (
                                <td key={profile.user_id} className="p-2">
                                  <input
                                    type="checkbox"
                                    onChange={(e) => handleShortlistToggle(profile, e.target.checked)}
                                    checked={selectedProfiles.some((p) => p.user_id === profile.user_id)}
                                    className="accent-blue-600"
                                  />
                                </td>
                              ))}
                            </tr>
                            <tr>
                              <td className="p-2 text-left font-medium">Match Score</td>
                              <td className="p-2 text-center"></td>
                              {profiles.map((profile, i) => {
                                let actual = 0;
                                let expected = 0;

                                profile.skill_details.forEach(skill => {
                                  const req = requiredRatings[skill.skill_name] || 0;
                                  const user = Math.min(skill.user_rating, req); // cap user rating
                                  actual += user;
                                  expected += req;
                                });

                                const matchScore = expected ? Math.round((actual / expected) * 100) : 0;
                                return <td key={i} className="p-2">{matchScore}%</td>;
                              })}
                            </tr>
                            {(() => {
                              const skillSet = new Set();
                              profiles.forEach(profile =>
                                profile.skill_details.forEach(skill => skillSet.add(skill.skill_name))
                              );
                              const uniqueSkills = Array.from(skillSet);

                              return uniqueSkills.map((skillName, rowIndex) => (
                                <tr key={rowIndex}>
                                  <td className="p-2 text-left">{skillName}</td>
                                  <td className="p-2 text-center font-medium">
                                    {requiredRatings[skillName] ?? 'N/A'}
                                  </td>
                                  {profiles.map((profile, colIndex) => {
                                    const skill = profile.skill_details.find(s => s.skill_name === skillName);
                                    return (
                                      <td key={colIndex} className="p-2">
                                        {skill ? skill.user_rating : 'N/A'}
                                      </td>
                                    );
                                  })}
                                </tr>
                              ));
                            })()}
                          </tbody>
                        </table>
                    </div>
                  </div>
                ) : matchingProfile ? (
                  <div className="rounded-xl bg-white p-4 shadow">
                    <div className="flex flex-col items-center justify-center p-8">
                        <img src="/images/logo/no-data.png" alt="No Data" className="w-48 mb-2" />
                        <h3 className="font-semibold text-black text-lg">No profiles matched</h3>
                        <p className="text-gray-500 text-xs text-center">Try adjusting your filters to find candidates.</p>
                    </div>
                  </div>
                ): null} */}
              </div>
            </form>
            <ExperienceSkillProfilerPlugin />
          </section>
        </div>
      </div>
    </>
  );
}