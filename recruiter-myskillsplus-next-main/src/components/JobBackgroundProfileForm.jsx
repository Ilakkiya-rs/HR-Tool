'use client';
import { useEffect, useState } from 'react';
import Select from 'react-select';

const BackgroundProfileForm = ({ activeJob, mode, onBack }) => {
  const [viewMode, setViewMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [jobTitle, setJobTitle] = useState('');
  const [vspCost, setVspCost] = useState('');
  const [vspCurrency, setVspCurrency] = useState('USD');
  const [countryOptions, setCountryOptions] = useState([]);
  const [stateOptions, setStateOptions] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [workPreference, setWorkPreference] = useState({
    employmentType: "",
    state: "",
    city: "",
    country: "",
    freelanceOptions: {
      weekday: { selected: false, hours: "" },
      weekend: { selected: false, hours: "" },
    },
  });
  const [companyName, setCompanyName] = useState('');
  const [companyWebsite, setCompanyWebsite] = useState('');
  const [companyDescription, setCompanyDescription] = useState('');
  const [workDescription, setWorkDescription] = useState('');

  const userDetails = JSON.parse(localStorage.getItem("logedinUserDetail"));
  const userId = userDetails?.individual_profile_id;
  const firstName = userDetails?.first_name;
  const lastName = userDetails?.last_name;
  const name = `${firstName} ${lastName}`;
  const email = userDetails?.email;

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

  useEffect(() => {
    const fetchWorkPreference = async () => {
      if (!activeJob?.id || mode === "add-bg") return;
  
      try {
        setLoading(true);
        // const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/retrieve-job-background-details/${userId}/${activeJob.id}`);
        const res = await fetch(`https://api.myskillsplus.com/retrieve-job-background-details/${userId}/${activeJob.id}`);
        if (!res.ok) return;
        const data = await res.json();
        if (data?.background_details) {
          setJobTitle(data.job_title);
          setWorkPreference(data.background_details.workPreference);
          setVspCost(data.background_details.vsp_cost);
          setVspCurrency(data.background_details.vsp_currency);
          setCompanyName(data.background_details.company_name);
          setCompanyWebsite(data.background_details.company_website);
          setCompanyDescription(data.background_details.company_description);
          setWorkDescription(data.background_details.work_description);
          
          setViewMode(mode === "view-bg");
          setIsEditing(mode === "edit-bg");
        }
      } catch (err) {
        console.error("Profile fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchWorkPreference();
  }, [userId, activeJob, mode]);  

  const resetProfile = () => {
    setVspCost(''),
    setVspCurrency(''),
    setWorkPreference({
      employmentType: '',
      state: '',
      stateName: '',
      city: '',
      cityName: '',
      country: '',
      countryName: '',
      freelanceOptions: {
        weekday: { selected: false, hours: '' },
        weekend: { selected: false, hours: '' },
      },
    });
    setCompanyName(''),
    setCompanyWebsite(''),
    setCompanyDescription(''),
    setWorkDescription('')
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setWorkPreference(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleClear = () => {
    resetProfile();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      user_id: userId,
      user_name: name,
      email: email,
      job_title_id: activeJob?.id,
      job_title: activeJob?.job_title,
      vsp_cost: vspCost,
      vsp_currency: vspCurrency,
      workPreference: {
        ...workPreference,
        countryName: workPreference.countryName,
        stateName: workPreference.stateName,
        cityName: workPreference.cityName,
      },
      company_name: companyName,
      company_website: companyWebsite,
      company_description: companyDescription,
      work_description: workDescription
    };
    try {
      // const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/submit-job-background-profile/`, {
      const res = await fetch('https://api.myskillsplus.com/submit-job-background-profile/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to submit');
      const data = await res.json();
      console.log('Successfully submitted:', data);
      alert('Profile saved successfully!');
    //   setViewMode(true);
      onBack();
      setIsEditing(false);
    } catch (error) {
      console.error('Error submitting profile:', error);
      alert('Error saving profile.');
    }
  };

  const handleFreelanceCheckbox = (key) => {
    setWorkPreference((prevData) => ({
      ...prevData,
      freelanceOptions: {
        ...prevData.freelanceOptions,
        [key]: {
          ...prevData.freelanceOptions?.[key],
          selected: !prevData.freelanceOptions?.[key]?.selected,
          hours: prevData.freelanceOptions?.[key]?.selected ? '' : prevData.freelanceOptions?.[key]?.hours || ''
        }
      }
    }));
  };

  const handleFreelanceHoursChange = (key, value) => {
    setWorkPreference((prevData) => ({
      ...prevData,
      freelanceOptions: {
        ...prevData.freelanceOptions,
        [key]: {
          ...prevData.freelanceOptions?.[key],
          hours: value
        }
      }
    }));
  };

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
    setWorkPreference((prev) => ({
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

  return loading ? (
    <p>Loading...</p>
  ) : viewMode ? (
    <>
        {/*Edit button*/}
        {/* <div className="flex justify-end mt-4 mb-4">
          <button
            className="px-5 py-1 rounded-2xl text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 shadow-sm hover:shadow-md transition-all duration-200"
            onClick={() => {
              setViewMode(false);
              setIsEditing(true);
            }}
          >
            Edit
          </button>
        </div> */}
        <div className="space-y-6">
            {/* Payment Terms */}
            <div className="p-4 rounded-2xl bg-white text-[#24303F]">
              <h2 className="text-lg font-semibold mb-4">Payment Terms</h2>
              <div className="flex lg:flex-row md:flex-row flex-col lg:gap-20 text-sm">
                <div className="job-title lg:mb-0 md:mb-3 mb-3">
                  <h2 className="text-sm font-semibold lg:mb-3 mb-2">Job Title</h2>
                  <span className="font-medium text-sm">{jobTitle || "N/A"}</span>
                </div>
                <div className="vsp-cost">
                  <h2 className="text-sm font-semibold lg:mb-3 mb-2">Value of Skills Profile</h2>
                  <span className="font-medium text-sm">{vspCost} {vspCurrency === 'USD' ? '$' : '₹'}</span>
                </div>
              </div>
            </div>
            {/* Workplace Preference */}
            <div className="p-4 bg-white shadow rounded-2xl text-[#24303F]">
                <h2 className="text-lg font-semibold mb-4">Workplace Preference</h2>
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Full-time employment */}
                    <div className="border border-[#D3D9E2] rounded-xl p-4">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="font-semibold mb-2">Full-time Employment</h3>
                                <div className="flex flex-row gap-10 mb-4 text-sm">
                                    <span>{workPreference?.employmentType || "N/A"}</span>
                                </div>
                            </div>
                            {/* Current Location */}
                            <div className="mb-2">
                                <h3 className="text-sm font-semibold mb-2">Where are you currently located?</h3>
                                <span className="text-sm">
                                    {[workPreference?.cityName, workPreference?.stateName, workPreference?.countryName]
                                        .filter(Boolean)
                                        .join(', ')
                                    }
                                </span>
                            </div>
                        </div>
                    </div>
                    {/* Freelance / Project Basis */}
                    <div className="border border-[#D3D9E2] rounded-xl p-4">
                        <h3 className="font-semibold mb-4">Freelance / Project Basis</h3>
                        <div className="mb-2 space-y-4">
                            <div className="grid md:grid-cols-2">
                                {/* Weekday Freelance Option */}
                                {workPreference?.freelanceOptions?.weekday?.selected && (
                                    <div>
                                        <h4 className="text-sm font-semibold mb-1">Weekday</h4>
                                        <span className="text-sm">{workPreference.freelanceOptions.weekday.hours} hours</span>
                                    </div>
                                )}
                                {/* Weekend Freelance Option */}
                                {workPreference?.freelanceOptions?.weekend?.selected && (
                                    <div>
                                        <h4 className="text-sm font-semibold mb-1">Weekend</h4>
                                        <span className="text-sm">{workPreference.freelanceOptions.weekend.hours} hours</span>
                                    </div>
                                )}
                            </div>
                            {/* If neither selected, show N/A */}
                            {!workPreference?.freelanceOptions?.weekday?.selected && 
                            !workPreference?.freelanceOptions?.weekend?.selected && (
                            <span>N/A</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {/* Company Profile */}
            <div className="p-4 rounded-2xl bg-white text-[#24303F]">
              <h2 className="text-lg font-semibold mb-4">Company Profile</h2>
              <div className="flex lg:flex-row md:flex-row flex-col lg:gap-10 text-sm mb-4">
                <div className="job-title lg:mb-0 md:mb-3 mb-3">
                  <h2 className="text-sm font-semibold lg:mb-3 mb-2">Name of Company</h2>
                  <span className="text-sm">{companyName || "N/A"}</span>
                </div>
                <div className="vsp-cost">
                  <h2 className="text-sm font-semibold lg:mb-3 mb-2">Website of Company</h2>
                  <span className="text-sm">{companyWebsite}</span>
                </div>
              </div>
              <div className="flex flex-row gap-4 text-sm mb-4">
                <div className="job-title">
                  <h2 className="text-sm font-semibold mb-3">Description of Company</h2>
                  <span className="text-sm">{companyDescription || "N/A"}</span>
                </div>
              </div>
              <div className="flex flex-row gap-4 text-sm mb-4">
                <div className="job-title">
                  <h2 className="text-sm font-semibold mb-3">Description of Work</h2>
                  <span className="text-sm">{workDescription || "N/A"}</span>
                </div>
              </div>
            </div>
        </div>
    </>
  ) : (
    <>
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="p-4 bg-white shadow rounded-2xl text-[#24303F]">
                <div className="grid grid-cols-1 lg:grid-cols-2 md:grid-cols-2 gap-4 text-sm">
                    <div className="job-title">
                        <h2 className="text-black font-semibold mb-2">Job Title</h2>
                        <input
                            type="text"
                            className="p-2 text-sm w-full focus:outline-none"
                            value={activeJob.job_title}
                            readOnly
                        />
                        <input type="hidden" value={activeJob.id} />
                    </div>
                    <div className="vsp-cost">
                        <h2 className="font-semibold mb-2">VSP (Value of Skills Profile) <span className="font-md text-xs text-[#bec0c2]">( This is your per hour price you are willing to pay for the work )</span></h2>
                        <div className="flex border border-[#D1D5DB] rounded-lg overflow-hidden">
                            <input
                                type="number"
                                className="p-2 text-sm w-full focus:outline-none"
                                placeholder="Enter your cost"
                                value={vspCost}
                                onChange={(e) =>setVspCost(e.target.value)}
                            />
                            <div className="p-1">
                                <select
                                    className="text-sm bg-[#F6F6F6] p-1.5 rounded-md text-black focus:outline-none"
                                    style={{ minWidth: '4rem' }}
                                    value={vspCurrency}
                                    onChange={(e) => setVspCurrency(e.target.value)}
                                >
                                    <option value="USD">USD</option>
                                    <option value="INR">INR</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Workplace Preference */}
            <div className="p-4 bg-white shadow rounded-2xl text-[#24303F]">
                <h2 className="text-lg font-semibold mb-4">Workplace Preference</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                    {/* Full-time employment */}
                    <div className="border border-[#D3D9E2] rounded-xl p-4">
                        <h3 className="font-semibold mb-4">Full-time Employment</h3>
                        {/* Employment Type */}
                        <div className="flex flex-col md:flex-col lg:flex-row lg:gap-10 md:gap-5 gap-2 mb-4 text-[13px]">
                            {["WFO", "WFH", "Hybrid"].map((type) => (
                                <label key={type} className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        name="employmentType"
                                        value={type}
                                        onChange={handleInputChange}
                                        checked={workPreference.employmentType === type}
                                    />
                                    {type === "WFO" ? "WFO Only" : type === "WFH" ? "WFH Only" : "Hybrid - WFH/WFO"}
                                </label>
                            ))}
                        </div>
                        {/* Current Location */}
                        <div className="mb-4">
                            <h3 className="text-sm font-semibold mb-4">Location Preference</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4 lg:gap-2">
                                {/* Country Select */}
                                <Select
                                    className="text-sm"
                                    styles={customStyles}
                                    placeholder="Select Country"
                                    isClearable
                                    value={countryOptions.find(c => c.value === workPreference.country) || null}
                                    onChange={handleCountryChange}
                                    options={countryOptions}
                                />

                                {/* State Select */}
                                <Select
                                    className="text-sm"
                                    styles={customStyles}
                                    placeholder="Select State"
                                    isClearable
                                    value={stateOptions.find(s => s.value === workPreference.state) || null}
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
                                    value={cityOptions.find(c => c.value === workPreference.city) || null}
                                    onChange={(selected) => handleSelectChange("city", selected)}
                                    options={cityOptions}
                                    isDisabled={!selectedState} 
                                />
                            </div>
                        </div>
                    </div>
                    {/* Freelance / Project Basis */}
                    <div className="border border-[#D3D9E2] rounded-xl p-4">
                        <h3 className="font-semibold mb-4">Freelance / Project Basis</h3>

                        {[
                            { label: "Can work for few hours on weekdays specify no of hours a day", key: "weekday" },
                            { label: "Can work for hours on weekends specify no of hours a day", key: "weekend" }
                        ].map((option) => (
                            <div key={option.key} className="mb-6">
                                <label className="flex items-center gap-2 text-sm">
                                    <input
                                        type="checkbox"
                                        name={`freelanceOptions.${option.key}`}
                                        checked={workPreference.freelanceOptions?.[option.key]?.selected}
                                        onChange={() => handleFreelanceCheckbox(option.key)}
                                    />
                                    {option.label}
                                </label>

                                <div className="mt-2">
                                    <input
                                        type="number"
                                        name={`freelanceOptions.${option.key}.hours`}
                                        value={workPreference.freelanceOptions?.[option.key]?.hours || ''}
                                        onChange={(e) => handleFreelanceHoursChange(option.key, e.target.value)}
                                        placeholder="Enter hours"
                                        className="w-full border border-[#D3D9E2] rounded-lg p-2 text-sm"
                                        disabled={!workPreference.freelanceOptions?.[option.key]?.selected}
                                        required={workPreference.freelanceOptions?.[option.key]?.selected}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {/* Company Profile */}
            <div className="p-4 bg-white shadow rounded-2xl text-[#24303F]">
            <h2 className="text-lg font-semibold mb-4">Company Profile</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 md:grid-cols-1 gap-4 text-sm">
                <div className="company-name">
                <h2 className="text-black font-semibold mb-2">Name of Company</h2>
                <div className="flex border border-[#D1D5DB] rounded-lg overflow-hidden">
                    <input
                        type="text"
                        className="p-2 text-md w-full focus:outline-none"
                        placeholder="Enter your job title"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                    />
                </div>
                </div>
                <div className="company-website">
                <h2 className="text-black font-semibold mb-2">Website of Company</h2>
                <div className="flex border border-[#D1D5DB] rounded-lg overflow-hidden">
                    <input
                        type="text"
                        className="p-2 text-md w-full focus:outline-none"
                        placeholder="Enter your job title"
                        value={companyWebsite}
                        onChange={(e) => setCompanyWebsite(e.target.value)}
                    />
                </div>
                </div>
                <div className="company-description">
                <h2 className="text-black font-semibold mb-2">Description of the Company</h2>
                <div className="flex border border-[#D1D5DB] rounded-lg overflow-hidden">
                    <textarea
                        className="p-2 text-md w-full focus:outline-none"
                        placeholder="Enter your job title"
                        value={companyDescription}
                        onChange={(e) => setCompanyDescription(e.target.value)}
                    />
                </div>
                </div>
                <div className="work-description">
                <h2 className="text-black font-semibold mb-2">Description of Work</h2>
                <div className="flex border border-[#D1D5DB] rounded-lg overflow-hidden">
                    <textarea
                        className="p-2 text-md w-full focus:outline-none"
                        placeholder="Enter your job title"
                        value={workDescription}
                        onChange={(e) => setWorkDescription(e.target.value)}
                    />
                </div>
                </div>
            </div>
            </div>
            {/* Buttons */}
            <div className="flex justify-end gap-4 mt-6">
                <button
                type="button"
                onClick={handleClear}
                className="px-4 py-1 rounded-full border border-gray-400 text-gray-600 hover:bg-gray-100 text-sm"
                >
                Clear
                </button>
                <button
                type="submit"
                className="px-4 py-1 rounded-full bg-blue-600 text-white hover:bg-blue-700 text-sm"
                >
                Save
                </button>
            </div>
        </form>
    </>

  );
};
export default BackgroundProfileForm;