'use client';
import { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import Select from 'react-select';

//This section is used to display the form for the personal background profile
const Section = ({ title, subtitle, children }) => (
  <div className="mb-8 mr-8">
    <div className="flex flex-col lg:flex-row md:flex-row mb-4">
        <h3 className="text-lg font-bold text-black">{title}</h3>
        {subtitle && <h2 className="lg:ml-2 md:ml-2 text-md text-black"> {subtitle}</h2>}
    </div>
    {children}
  </div>
);

//This section is used to display the label
const LabelInput = ({ label, children }) => (
  <div className="flex flex-col text-sm">
    <label className="mb-1 text-black font-semibold">{label}</label>
    {children}
  </div>
);

//This section is used to display the input field
const inputStyle = "border border-[#d1d5db] rounded-lg p-2 text-sm w-full focus:outline-none";

//This section is used to display the add and remove button
const AddRemoveRow = ({ children, onAdd, onRemove, className = '' }) => (
  <div className={`${className} grid grid-cols-1 gap-4 mb-3 relative`}>
    {children}
    <div className="absolute right-[-3.7rem] lg:top-[70%] md:top-[70%] top-[93%] transform -translate-y-1/2 flex gap-2">
      <button onClick={onAdd} className="text-blue-600 hover:text-blue-800 rounded-full p-1 border border-blue-600">
        <Plus size={14} />
      </button>
      <button onClick={onRemove} className="text-red hover:text-red rounded-full p-1 border border-red">
        <Trash2 size={14} />
      </button>
    </div>
  </div>
);

export default function PersonalBackgroundProfile() {
  const [education, setEducation] = useState([{levelOfEducation:null, discipline:null, college: '', startDate: '', endDate: '' }]);
  // const [experience, setExperience] = useState([{}]);
  const [experience, setExperience] = useState([{company: '', startMonth: '', startYear: '', endMonth: '', endYear: '', stillWorking: false }]);  
  const [projects, setProjects] = useState([{}]);
  const [tasks, setTasks] = useState([{}]);
  const [achievements, setAchievements] = useState([{}]);
  const [levels, setLevels] = useState([]);
  const [disciplines, setDisciplines] = useState([]);
  const [viewMode, setViewMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState(null);


  useEffect(() => {

    //Set the prefill form data if the user is editing
    if (isEditing && profileData) {
      setEducation(profileData.education || []);
      setExperience(profileData.experience || []);
      setProjects(profileData.projects || []);
      setTasks(profileData.tasks || []);
      setAchievements(profileData.achievements || []);
    }
    //Fetching the level of education
    const fetchLevelOfEducation = async () => {
      try {
        const res = await fetch('https://api.myskillsplus.com/api/level-of-education/');
        const data = await res.json();
        setLevels(data);
      } catch (error) {
        console.error('Error fetching levels of education:', error);
      }
    }
    fetchLevelOfEducation();
    //Fetching the discipline
    const fetchDiscipline = async () => {
      try {
        const res = await fetch('https://api.myskillsplus.com/api/discipline/');
        const data = await res.json();
        setDisciplines(data);
      } catch (error) {
        console.error('Error fetching disciplines:', error);
      }
    };
    fetchDiscipline();

    //Fetching the personal background profile
    const fetchProfile = async () => {
      try {
        const res = await fetch(`https://api.myskillsplus.com/users/get-details/?userId=${userId}`);
        if (!res.ok) {
          setLoading(false);
          return;
        }
        const data = await res.json();
        if (data && Object.keys(data).length > 0) {
          setProfileData(data);
          setEducation(data.education || []);
          setExperience(data.experience || []);
          setProjects(data.projects || []);
          setTasks(data.tasks || []);
          setAchievements(data.achievements || []);
          setViewMode(true);
        }
      } catch (err) {
        console.error("Profile fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
    
  }, []);

  const addEntry = (setter) => setter(prev => [...prev, {}]);
  const removeEntry = (setter, idx) => setter(prev => prev.filter((_, i) => i !== idx));

  const updateEntry = (setter, idx, field, value) => {
    setter(prev =>
        prev.map((item, i) => (i === idx ? { ...item, [field]: value } : item))
    );
  };

  const userDetails = JSON.parse(localStorage.getItem("loginUserDetail"));
  const userId = userDetails?.individual_profile_id;
  const firstName = userDetails?.first_name;
  const lastName = userDetails?.last_name;
  const name = `${firstName} ${lastName}`;
  const email = userDetails?.email;

  //Clear the personal background profile
  const resetProfile = () => {
    setEducation([{levelOfEducation:null, discipline:null, college: '', startDate: '', endDate: '' }]);
    setExperience([{company: '', startMonth: '', startYear: '', endMonth: '', endYear: '', stillWorking: false}]);
    setProjects([{ title: '', duration: '', unit: 'Month' }]);
    setTasks([{ description: '' }]);
    setAchievements([{ description: '' }]);
  };

  const isAnyEducationFieldFilled = () => {
    return education.some(e =>
      e.levelOfEducation ||
      e.discipline ||
      e.college ||
      e.startDate ||
      e.endDate
    );
  };

  //Save the personal background profile
  const handleSave = async () => {
    if (!isAnyEducationFieldFilled()) {
      alert("Please fill at least one field in the Education section before saving.");
      return;
    }
    const payload = {
      userId,
      name,
      email,
      education,
      experience,
      projects,
      tasks,
      achievements,
    };

    try {
      const res = await fetch('https://api.myskillsplus.com/users/save-details/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Failed to submit');
      const data = await res.json();
      console.log('Successfully submitted:', data);
      setViewMode(true);
      setIsEditing(false);
    } catch (error) {
      console.error('Error submitting profile:', error);
      alert('Error saving profile.');
    }
  };
  
  //Display card for the profile
  const DisplayCard = ({ title, children }) => (
    <div className="bg-white p-5 rounded-2xl shadow-sm">
      <h3 className="text-lg font-semibold text-black mb-3">{title}</h3>
      {children}
    </div>
  );

  const getMonthName = (month) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    if (!month) return '-';
    return months[parseInt(month, 10) - 1] || '-';
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
        <div className="grid grid-cols-1 lg:grid-cols-2 md:grid-cols-2 gap-6">
          {/*Education section*/}
          <DisplayCard title="Education">
            {education.map((e, idx) => (
              <div key={idx} className="space-y-4 text-sm mb-3">
                <div className="grid grid-cols-1 lg:grid-cols-2 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-[#24303F] font-bold">Level of Education</p>
                    <p className="text-[#24303F] font-medium">{e.levelOfEducation || '-'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[#24303F] font-bold">Descipline</p>
                    <p className="text-[#24303F] font-medium">{e.discipline || '-'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[#24303F] font-bold">College</p>
                    <p className="text-[#24303F] font-medium">{e.college || '-'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[#24303F] font-bold">Start & End Year</p>
                    <p className="text-[#24303F] font-medium">{e.startDate || '-'} – {e.endDate || '-'}</p>
                  </div>
                </div>
              </div>
            ))}
          </DisplayCard>
          {/*Work Experience section*/}
          <DisplayCard title="Work Experience">
            {experience.map((e, idx) => (
              <div key={idx} className="space-y-4 text-sm mb-3">
                <div className="space-y-1">
                  <p className="text-[#24303F] font-bold">Company</p>
                  <p className="text-[#24303F] font-medium">{e.company || '-'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[#24303F] font-bold">Duration</p>
                  <p className="text-[#24303F] font-medium">
                    {getMonthName(e.startMonth || '-') + ' ' + (e.startYear || '-')} to {' '}
                    {e.stillWorking
                      ? 'Till Date'
                      : getMonthName(e.endMonth || '-') + ' – ' + (e.endYear || '-')}
                  </p>
                </div>
            </div>
            ))}
          </DisplayCard>
          {/*Projects section*/}
          <DisplayCard title="Project">
            {projects.map((p, idx) => (
              <div key={idx} className="space-y-4 text-sm mb-3">
                <div className="space-y-1">
                  <p className="text-[#24303F] font-bold">Title of Project</p>
                  <p className="text-[#24303F] font-medium">{p.title || '-'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[#24303F] font-bold">Duration</p>
                  <p className="text-[#24303F] font-medium">{p.duration || '-'} {p.unit || 'Month'}</p>
                </div>
              </div>
            ))}
          </DisplayCard>
          {/*Key Tasks / Activities section*/}
          <DisplayCard title="Key Tasks / Activities">
            {tasks.length > 0 ? (
                tasks.map((t, idx) => (
                  <div key={idx} className="space-y-4 text-sm mb-3">
                    <div className="space-y-1">
                      <p className="text-[#24303F] font-bold">Description</p>
                      <p className="text-[#24303F] font-medium">{t.description || '-'}</p>
                    </div>
                  </div>
                ))
            ) : (
              <p className="text-sm text-gray-600">No tasks added.</p>
            )}
          </DisplayCard>
          {/*Notable Achievements section*/}
          <DisplayCard title="Notable Achievements">
            {achievements.length > 0 ? (
                achievements.map((a, idx) => (
                  <div key={idx} className="space-y-4 text-sm mb-3">
                  <div className="space-y-1">
                    <p className="text-[#24303F] font-bold">Notable achievements</p>
                    <p className="text-[#24303F] font-medium">{a.description || '-'}</p>
                  </div>
                </div>
                ))
            ) : (
              <p className="text-sm text-gray-600">No achievements added.</p>
            )}
          </DisplayCard>
        </div>
      </>
    ) : (
      <div className="p-6 bg-white shadow rounded-lg pr-10">
        {/*Education section*/}
        <Section title="Education">
          {education.map((entry, idx) => (
            <AddRemoveRow
              key={idx}
              isFirst={idx === 0}
              onAdd={() => addEntry(setEducation)}
              onRemove={() => removeEntry(setEducation, idx)}
              className="grid lg:grid-cols-4 md:grid-cols-4"
            >
              {/*Level of Education section*/}
              <LabelInput label="Level of Education">
                <Select
                  className="text-sm"
                  styles={{
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
                  }}
                  value={levels
                    .map(level => ({ value: level.name, label: level.name }))
                    .find(option => option.value === entry.levelOfEducation)}
                  onChange={selected => updateEntry(setEducation, idx, 'levelOfEducation', selected ? selected.value : null)}
                  options={levels.map(level => ({ value: level.name, label: level.name }))}
                  placeholder="Select level"
                  isClearable
                />
              </LabelInput>
              {/*Discipline section*/}
              <LabelInput label="Discipline">
                <Select
                  className="text-sm"
                  styles={{
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
                  }}
                  value={disciplines
                    .map(d => ({ value: d.sub_category, label: d.sub_category }))
                    .find(option => option.value === entry.discipline)}
                  onChange={selected => updateEntry(setEducation, idx, 'discipline', selected ? selected.value : null)}
                  options={disciplines.map(d => ({ value: d.sub_category, label: d.sub_category }))}
                  placeholder="Select discipline"
                  isClearable
                />
              </LabelInput>
              {/*college section*/}
              <LabelInput label="College / University">
                <input
                  type="text"
                  className={inputStyle}
                  value={entry.college || ''}
                  onChange={e => updateEntry(setEducation, idx, 'college', e.target.value)}
                  placeholder="Enter College/University"
                />
              </LabelInput>
              {/*Start and End Dates section*/}
              {/* <LabelInput label="Start & End Year">
                <div className="flex border border-[#d1d5db] rounded-lg overflow-hidden">
                  <select
                    className="p-2 text-sm w-full focus:outline-none"
                    value={entry.startDate || ''}
                    onChange={e => updateEntry(setEducation, idx, 'startDate', e.target.value)}
                  >
                    <option value="">Start Year</option>
                    {Array.from({ length: 70 }, (_, i) => {
                      const year = new Date().getFullYear() - i;
                      return <option key={year} value={year}>{year}</option>;
                    })}
                  </select>
                  <select
                    className="p-2 text-sm w-full focus:outline-none"
                    value={entry.endDate || ''}
                    onChange={e => updateEntry(setEducation, idx, 'endDate', e.target.value)}
                  >
                    <option value="">End Year</option>
                    {Array.from({ length: 70 }, (_, i) => {
                      const year = new Date().getFullYear() - i;
                      return <option key={year} value={year}>{year}</option>;
                    })}
                  </select>
                </div>
              </LabelInput> */}
              <LabelInput label="Start & End Year">
                <div className="flex border border-[#d1d5db] rounded-lg overflow-hidden">
                  <select
                    className="p-2 text-sm w-full focus:outline-none"
                    value={entry.startDate || ''}
                    onChange={e => updateEntry(setEducation, idx, 'startDate', e.target.value)}
                  >
                    <option value="">Start Year</option>
                    {Array.from({ length: 100 }, (_, i) => {
                      const year = new Date().getFullYear() - 60 + i; // range from 60 years ago to 40 years ahead
                      return <option key={year} value={year}>{year}</option>;
                    })}
                  </select>

                  <select
                    className="p-2 text-sm w-full focus:outline-none"
                    value={entry.endDate || ''}
                    onChange={e => updateEntry(setEducation, idx, 'endDate', e.target.value)}
                  >
                    <option value="">End Year</option>
                    {Array.from({ length: 100 }, (_, i) => {
                      const year = new Date().getFullYear() - 60 + i;
                      return <option key={year} value={year}>{year}</option>;
                    })}
                  </select>
                </div>
              </LabelInput>
            </AddRemoveRow>
          ))}
        </Section>
        {/*Work Experience section*/}
        <Section title="Work Experience">
          {experience.map((entry, idx) => (
            <AddRemoveRow
              key={idx}
              onAdd={() =>
                addEntry(setExperience, {
                  company: '',
                  startMonth: '',
                  startYear: '',
                  endMonth: '',
                  endYear: '',
                  stillWorking: false,
                })
              }
              onRemove={() => removeEntry(setExperience, idx)}
              className="grid lg:grid-cols-3 md:grid-cols-3 gap-4"
            >
              {/* Company */}
              <div className="col-span-1">
                <LabelInput label="Company">
                  <input
                    type="text"
                    className={inputStyle}
                    value={entry.company || ''}
                    onChange={(e) => updateEntry(setExperience, idx, 'company', e.target.value)}
                    placeholder="Enter company name"
                  />
                </LabelInput>
              </div>
              {/* Start Month & Year */}
              <div className="col-span-1">
                <LabelInput label="Start Month & Year">
                  <div className="flex gap-2">
                    <select
                      className="p-2 text-sm w-full focus:outline-none border border-[#d1d5db] rounded-lg"
                      value={entry.startMonth || ''}
                      onChange={(e) => updateEntry(setExperience, idx, 'startMonth', e.target.value)}
                    >
                      <option value="">Month</option>
                      {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map(
                        (m, i) => (
                          <option key={m} value={i + 1}>
                            {m}
                          </option>
                        )
                      )}
                    </select>
                    <select
                      className="p-2 text-sm w-full focus:outline-none border border-[#d1d5db] rounded-lg"
                      value={entry.startYear || ''}
                      onChange={(e) => updateEntry(setExperience, idx, 'startYear', e.target.value)}
                    >
                      <option value="">Year</option>
                      {Array.from({ length: 70 }, (_, i) => {
                        const year = new Date().getFullYear() - i;
                        return (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </LabelInput>
              </div>

              {/* End Month & Year + Still Now */}
              <div className="col-span-1">
                <div className="flex flex-col text-sm">
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-black font-semibold">End Month & Year</label>
                    <label className="flex items-center text-sm text-black font-medium">
                      <input
                        type="checkbox"
                        className="mr-2"
                        checked={entry.stillWorking || false}
                        onChange={(e) => updateEntry(setExperience, idx, 'stillWorking', e.target.checked)}
                      />
                      Till Date
                    </label>
                  </div>

                  {entry.stillWorking ? (
                    <div className="flex items-center p-2 text-sm w-full text-gray-500 border border-[#d1d5db] rounded-lg">
                      Till Date
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <select
                        className="p-2 text-sm w-full focus:outline-none border border-[#d1d5db] rounded-lg"
                        value={entry.endMonth || ''}
                        onChange={(e) => updateEntry(setExperience, idx, 'endMonth', e.target.value)}
                      >
                        <option value="">Month</option>
                        {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map(
                          (m, i) => (
                            <option key={m} value={i + 1}>
                              {m}
                            </option>
                          )
                        )}
                      </select>
                      <select
                        className="p-2 text-sm w-full focus:outline-none border border-[#d1d5db] rounded-lg"
                        value={entry.endYear || ''}
                        onChange={(e) => updateEntry(setExperience, idx, 'endYear', e.target.value)}
                      >
                        <option value="">Year</option>
                        {Array.from({ length: 70 }, (_, i) => {
                          const year = new Date().getFullYear() - i;
                          return (
                            <option key={year} value={year}>
                              {year}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  )}
                </div>
              </div>
            </AddRemoveRow>
          ))}
        </Section>
        {/*Projects section*/}
        <Section title="Projects">
          {projects.map((entry, idx) => (
            <AddRemoveRow
              key={idx}
              isFirst={idx === 0}
              onAdd={() => addEntry(setProjects)}
              onRemove={() => removeEntry(setProjects, idx)}
              className="grid lg:grid-cols-3 md:grid-cols-3"
            >
              <div className="col-span-2">
                <LabelInput label="Title of Project">
                  <input
                    type="text"
                    className={inputStyle}
                    value={entry.title || ''}
                    onChange={e => updateEntry(setProjects, idx, 'title', e.target.value)}
                    placeholder="Enter the title of project"
                  />
                </LabelInput>
              </div>
              <div className="col-span-1">
                <LabelInput label="Duration">
                  <div className="flex border border-[#d1d5db] rounded-lg overflow-hidden">
                    <input
                      type="text"
                      className="p-2 text-sm w-full focus:outline-none"
                      value={entry.duration || ''}
                      onChange={e => updateEntry(setProjects, idx, 'duration', e.target.value)}
                      placeholder="Enter duration"
                    />
                    <div className="p-1.5">
                      <select
                        className="text-sm bg-[#F6F6F6] p-0.5 rounded-md text-black focus:outline-none"
                        style={{ minWidth: '5rem' }}
                        value={entry.unit || 'Month'}
                        onChange={e => updateEntry(setProjects, idx, 'unit', e.target.value)}
                      >
                        <option>Month</option>
                        <option>Year</option>
                      </select>
                    </div>
                  </div>
                </LabelInput>
              </div>
            </AddRemoveRow>
          ))}
        </Section>
        {/*Key Tasks / Activities section*/}
        <Section title="Key Tasks / Activities">
          {tasks.map((entry, idx) => (
            <AddRemoveRow
              key={idx}
              onAdd={() => addEntry(setTasks, { description: '' })}
              onRemove={() => removeEntry(setTasks, idx)}
            >
              <LabelInput label="Description">
                <input
                  type="text"
                  className={inputStyle}
                  value={entry.description || ''}
                  onChange={e => updateEntry(setTasks, idx, 'description', e.target.value)}
                  placeholder="Enter description"
                />
              </LabelInput>
            </AddRemoveRow>
          ))}
        </Section>
        {/*Notable Achievements section*/}
        <Section title="Notable Achievements" subtitle="( Like awards / recognition / targets / publications / inventions etc... )">
          {achievements.map((entry, idx) => (
            <AddRemoveRow
              key={idx}
              onAdd={() => addEntry(setAchievements, { description: '' })}
              onRemove={() => removeEntry(setAchievements, idx)}
            >
              <LabelInput label="Notable achievements">
                <input
                  type="text"
                  className={inputStyle}
                  value={entry.description || ''}
                  onChange={e => updateEntry(setAchievements, idx, 'description', e.target.value)}
                  placeholder="Enter notable achievements"
                />
              </LabelInput>
            </AddRemoveRow>
          ))}
        </Section>
        {/*Save and Clear buttons*/}
        <div className="flex justify-end gap-4 mt-6">
          <button
            className="px-5 py-1 border rounded-2xl text-sm"
            onClick={resetProfile}
          >
            Clear
          </button>
          <button
            className="px-5 py-1 rounded-2xl text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 shadow-sm hover:shadow-md transition-all duration-200"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
  );
}
