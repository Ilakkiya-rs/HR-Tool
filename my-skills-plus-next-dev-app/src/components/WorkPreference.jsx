'use client';
import { useEffect, useState } from 'react';
import Select from 'react-select';

export default function WorkPreferencePage() {
  const [viewMode, setViewMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [countryOptions, setCountryOptions] = useState([]);
  const [stateOptions, setStateOptions] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [workPreference, setWorkPreference] = useState({
    workInterest: "",
    otherCareer: [],
    employmentType: "",
    state: "",
    city: "",
    country: "",
    willingToRelocate: "",
    relocationPreference: [],
    freelanceInterest: "",
    freelanceOptions: {
      weekday: { selected: false, hours: "" },
      weekend: { selected: false, hours: "" },
    },
  });

  const userDetails = JSON.parse(localStorage.getItem("loginUserDetail"));
  const userId = userDetails?.individual_profile_id;
  const firstName = userDetails?.first_name;
  const lastName = userDetails?.last_name;
  const name = `${firstName} ${lastName}`;
  const email = userDetails?.email;
  const showFullTimeSection = workPreference.workInterest.includes("Actively looking for alternate employer") ||
                             workPreference.workInterest.includes("Not actively looking for change in employer but open to see opportunities");
  const showFreelanceSection = workPreference.workInterest.includes("Looking for Freelance / Project based work");  

  useEffect(() => {
    const fetchWorkPreference = async () => {
      try {
        const res = await fetch(` https://api.myskillsplus.com/users/get-work-preference/?userId=${userId}`);
        if (!res.ok) {
          setLoading(false);
          return;
        }
        const data = await res.json();
        if (data && Object.keys(data).length > 0) {
            setWorkPreference(data);
            setViewMode(true);
        }
      } catch (err) {
        console.error("Profile fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchWorkPreference();

    const fetchCountries = async () => {
        try {
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
    setWorkPreference({
        workInterest: '',
        otherCareer: [],
        employmentType: '',
        state: '',
        stateName: '',
        city: '',
        cityName: '',
        country: '',
        countryName: '',
        willingToRelocate: '',
        relocationPreference: [],
        freelanceInterest: "",
        freelanceOptions: {
          weekday: { selected: false, hours: '' },
          weekend: { selected: false, hours: '' },
        },
    });
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
    if (!workPreference.workInterest || workPreference.workInterest.length === 0) {
      alert("Please select at least one Work Interest option before saving.");
      return;
    }
    const payload = {
      userId,
      name,
      email,
      workPreference: {
        ...workPreference,
        countryName: workPreference.countryName,
        stateName: workPreference.stateName,
        cityName: workPreference.cityName,
      },
    };
    try {
      const res = await fetch('https://api.myskillsplus.com/users/submit-work-preference/', {
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
      setViewMode(true);
      setIsEditing(false);
    } catch (error) {
      console.error('Error submitting profile:', error);
      alert('Error saving profile.');
    }
  };

  const handleMultiCheckboxChange = (field, value) => {
    setWorkPreference(prev => {
        const current = prev[field] || [];
        const updated = current.includes(value)
            ? current.filter(v => v !== value)
            : [...current, value];
        return { ...prev, [field]: updated };
    });
  };

  const handleSingleCheckboxChange = (field, value) => {
    setWorkPreference(prev => ({
        ...prev,
        [field]: prev[field] === value ? '' : value
    }));
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
    if (parseInt(value, 10) < 0) return;
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
        <div className="flex justify-end mt-4 mb-4">
          <button
            className="px-5 py-1 rounded-2xl text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 shadow-sm hover:shadow-md transition-all duration-200"
            onClick={() => {
              setViewMode(false);
              setIsEditing(true);
            }}
          >
            Edit
          </button>
        </div>
        <div className="space-y-6">
            {/* Workplace Preference */}
            <div className="p-4 bg-white shadow rounded-2xl text-[#24303F]">
                <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-4">
                    {/* Work Interest */}
                    <div className="p-4 border border-[#D3D9E2] rounded-xl">
                      <h2 className="text-lg font-semibold mb-4">Work Interest</h2>
                      <span className="text-sm">{workPreference?.workInterest || "N/A"}</span>
                    </div>
                    {/* Workplace Preference */}
                    <div className="border border-[#D3D9E2] rounded-xl p-4">
                        <div className="grid grid-cols-1">
                            <div>
                                <h3 className="font-semibold mb-2">Workplace Preference</h3>
                                <div className="flex flex-row gap-10 mb-4 text-sm">
                                  <span>
                                    {workPreference?.employmentType === "Any"
                                      ? "Any (WFH or WFO)"
                                      : workPreference?.employmentType || "N/A"}
                                  </span>
                                </div>
                            </div>
                            {/* Current Location */}
                            <div className="mb-4">
                                <h3 className="text-sm font-semibold mb-2">Current location</h3>
                                <span className="text-sm">
                                    {[workPreference?.cityName, workPreference?.stateName, workPreference?.countryName]
                                        .filter(Boolean)
                                        .join(', ')
                                    }
                                </span>
                            </div>
                        </div>
                        {/* Willing to Relocate */}
                        <div className="mb-2">
                            <div className="grid grid-cols-1">
                                <div className="mb-2">
                                    <h3 className="text-sm font-semibold mb-2">Willing to relocate?</h3>
                                    <span>{workPreference?.willingToRelocate || "N/A"}</span>
                                </div>
                                {/* If willing to relocate is "Yes", show relocation places */}
                                {workPreference?.willingToRelocate === "Yes" && (
                                  <div>
                                      <h3 className="text-sm font-semibold mb-2">Where are you open to moving?</h3>
                                      {Array.isArray(workPreference?.relocationPreference) ? (
                                      <ul className="list-decimal list-inside text-sm space-y-1">
                                          {workPreference.relocationPreference.map((place, index) => (
                                          <li key={index}>{place}</li>
                                          ))}
                                      </ul>
                                      ) : (
                                      <span className="text-sm">{workPreference?.relocationPreference || "N/A"}</span>
                                      )}
                                  </div>
                                )}
                            </div>
                        </div>
                    </div>
                    {/* Freelance / Project Basis */}
                    <div className="border border-[#D3D9E2] rounded-xl p-4">
                        <h3 className="font-semibold mb-4">Freelance / Project Opportunities</h3>
                        {workPreference?.freelanceInterest === "Not Interested" ? (
                          <span className="text-sm">Not Interested</span>
                        ) : (
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
                              <span>Not interested now</span>
                              )}
                          </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    </>
  ) : (
    <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4 text-sm">
            {/* Work Interest (Multi-select) */}
            <div className="col-span-3 p-4 rounded-2xl bg-white text-[#24303F]">
                <h2 className="text-lg font-semibold mb-4">Work Interest</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 text-sm">
                    {[
                    [<b key="ni">Not Interested</b>, " in Job Opportunities"],
                    ["Looking for ", <b key="fp">Freelance / Project</b>, " based work"],
                    [<b key="act">Actively</b>, " looking for alternate employer"],
                    ["Not actively looking for change in employer but ", <b key="open">open to see opportunities</b>],
                    ].map((interestParts, index) => {
                    const fullText = interestParts.map((part) => (typeof part === "string" ? part : part.props.children)).join('');
                    return (
                        <label key={index} className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            name="workInterest"
                            value={fullText}
                            checked={workPreference.workInterest.includes(fullText)}
                            onChange={() => handleSingleCheckboxChange('workInterest', fullText)}
                        />
                        <span>
                            {interestParts.map((part, idx) =>
                            typeof part === "string" ? part : <b key={idx}>{part.props.children}</b>
                            )}
                        </span>
                        </label>
                    );
                    })}
                </div>
            </div>
        </div>
        {/* Work-place preference and Freelance project Basis*/}
        <div className="grid grid-cols-1 lg:grid-cols-1 md:grid-cols-1">
            {/* Work-place preference */}
            {showFullTimeSection && (
              <div className="p-4 bg-white shadow rounded-2xl text-[#24303F]">
                <div className="border border-[#D3D9E2] rounded-xl p-4">
                    <h3 className="font-semibold mb-4">Workplace Preference</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 md:grid-cols-2 gap-3 mb-4 text-[13px]">
                      {["WFO", "WFH", "Hybrid", "Any"].map((type) => (
                        <label key={type} className="flex items-center gap-2 text-sm">
                          <input
                            type="radio"
                            name="employmentType"
                            value={type}
                            onChange={handleInputChange}
                            checked={workPreference.employmentType === type}
                          />
                          {type === "WFO"
                            ? "WFO only (Work From Office)"
                            : type === "WFH"
                            ? "WFH only (Work From Home)"
                            : type === "Hybrid"
                            ? "Hybrid - WFH/WFO"
                            : "Any (WFH or WFO)"}
                        </label>
                      ))}
                    </div>
                    <div className="mb-4">
                        <h3 className="text-sm font-semibold mb-4">Current location</h3>
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
                    <div className="mb-4">
                        <h3 className="text-sm font-semibold mb-2">Willing to relocate?</h3>
                        <div className="flex flex-row gap-4">
                            <label className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="willingToRelocate"
                                    value="Yes"
                                    onChange={handleInputChange}
                                    checked={workPreference.willingToRelocate === "Yes"}
                                /> Yes
                            </label>
                            <label className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="willingToRelocate"
                                    value="No"
                                    onChange={handleInputChange}
                                    checked={workPreference.willingToRelocate === "No"}
                                /> No
                            </label>
                        </div>
                        {workPreference.willingToRelocate === "Yes" && (
                            <div className="mt-4">
                                <h3 className="text-sm font-semibold mb-2">Where are you open to moving?</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 md:grid-cols-3 gap-3 mb-4 text-[13px]">
                                  {["Within my State/Province", "Anywhere within my Country", "Other Countries (International relocation)"].map((relocation) => (
                                      <label key={relocation} className="flex items-center gap-2 mb-2 text-sm">
                                          <input
                                          type="checkbox"
                                          name="relocationPreference"
                                          value={relocation}
                                          checked={workPreference.relocationPreference?.includes(relocation)}
                                          onChange={() => handleMultiCheckboxChange('relocationPreference', relocation)}
                                          />
                                          {relocation}
                                      </label>
                                  ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
              </div>
            )}
            {/* Freelance / Project Basis */}
            {showFreelanceSection && (
              <div className="p-4 bg-white shadow rounded-2xl text-[#24303F]">
                <div className="border border-[#D3D9E2] rounded-xl p-4">
                    <h3 className="font-semibold mb-4">Freelance / Project Opportunities</h3>
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold mb-2">Freelance Interest</h4>
                      <div className="flex flex-col md:flex-row lg:gap-6 md:gap-6 gap-2 mb-4 text-sm">
                        <label className="flex items-center gap-2 text-sm">
                          <input
                            type="radio"
                            name="freelanceInterest"
                            value="Interested"
                            checked={workPreference.freelanceInterest === "Interested"}
                            onChange={(e) =>
                              setWorkPreference((prev) => ({
                                ...prev,
                                freelanceInterest: e.target.value,
                              }))
                            }
                          />
                          Interested
                        </label>
                        <label className="flex items-center gap-2 text-sm">
                          <input
                            type="radio"
                            name="freelanceInterest"
                            value="Not Interested"
                            checked={workPreference.freelanceInterest === "Not Interested"}
                            onChange={(e) =>
                              setWorkPreference((prev) => ({
                                ...prev,
                                freelanceInterest: e.target.value,
                                freelanceOptions: {
                                  weekday: { selected: false, hours: "" },
                                  weekend: { selected: false, hours: "" },
                                },
                              }))
                            }
                          />
                          Not Interested
                        </label>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 md:grid-cols-1 gap-3 text-[13px]">
                      {[
                          { label: "Can work for few hours on weekdays specify no of hours a day", key: "weekday" },
                          { label: "Can work for hours on weekends specify no of hours a day", key: "weekend" }
                      ].map((option) => (
                          <div key={option.key} className="mb-2">
                              <label className="flex items-center gap-2 text-sm">
                                  <input
                                      type="checkbox"
                                      name={`freelanceOptions.${option.key}`}
                                      checked={workPreference.freelanceOptions?.[option.key]?.selected}
                                      onChange={() => handleFreelanceCheckbox(option.key)}
                                      disabled={workPreference.freelanceInterest !== "Interested"}
                                  />
                                  {option.label}
                              </label>

                              <div className="mt-2">
                                  <input
                                      type="number"
                                      min={0}
                                      name={`freelanceOptions.${option.key}.hours`}
                                      value={workPreference.freelanceOptions?.[option.key]?.hours || ''}
                                      onChange={(e) => handleFreelanceHoursChange(option.key, e.target.value)}
                                      placeholder="Enter hours"
                                      className="w-full border border-[#D3D9E2] rounded-lg p-2 text-sm"
                                      disabled={!workPreference.freelanceOptions?.[option.key]?.selected} // 🔥 disabled when checkbox not selected
                                      required={workPreference.freelanceOptions?.[option.key]?.selected} // 🔥 required only if checkbox is selected
                                  />
                              </div>
                          </div>
                      ))}
                    </div>
                </div>
              </div>
            )}
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

  );
}
