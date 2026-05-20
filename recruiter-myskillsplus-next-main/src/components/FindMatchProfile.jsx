'use client';
import { useEffect, useState } from 'react';
import Select from 'react-select';
import { useRouter } from 'next/navigation';
import {
    Elements,
    CardElement,
    useStripe,
    useElements,
  } from "@stripe/react-stripe-js";
  import { loadStripe } from "@stripe/stripe-js";
  
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const FindMatchProfile = ({ activeJob, mode, onBack, onShortlistComplete }) => {
  const [viewMode, setViewMode] = useState(false);
  const [tableView, setTableView] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
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

  const userDetails = JSON.parse(localStorage.getItem("logedinUserDetail"));
  const userId = userDetails?.individual_profile_id;
  const firstName = userDetails?.first_name;
  const lastName = userDetails?.last_name;
  const name = `${firstName} ${lastName}`;
  const email = userDetails?.email;

  const [profiles, setProfiles] = useState([]);
  const [shortlistedProfiles, setShortlistedProfiles] = useState([]);
  const [selectedProfiles, setSelectedProfiles] = useState([]);
  const [jobSkills, setJobSkills] = useState([]);
  const router = useRouter("");
  const [pbpMessageText, setPbpMessageText] = useState("");
  const [pcpMessageText, setPcpMessageText] = useState("");
  const [popupTarget, setPopupTarget] = useState({ userId: null, type: null });
  const [tooltipTarget, setTooltipTarget] = useState({ userId: null, type: null });
  const [education, setEducation] = useState([{levelOfEducation:null, discipline:null, college: '', startDate: '', endDate: '' }]);
  const [experience, setExperience] = useState([{}]);
  const [projects, setProjects] = useState([{}]);
  const [tasks, setTasks] = useState([{}]);
  const [achievements, setAchievements] = useState([{}]);
  const [pbpViewMode, setPbpViewMode] = useState(false);
  const [showPbpPaymentModal, setShowPbpPaymentModal] = useState(false);
  const [showPcpPaymentModal, setShowPcpPaymentModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState({ userId: null, amount: 0, msgType:"", jobId: null });
  const [matchingProfile, setMatchingProfile] = useState(false);
  const [selectedSkillProfile, setSelectedSkillProfile] = useState(null);
  const [hasBackgroundProfile, setHasBackgroundProfile] = useState(null);

  const openPaymentModal = (userId, amount, msgType, jobId) => {
    if(msgType == "pbp") {
      setSelectedPayment({ userId, amount, msgType, jobId });
      setShowPbpPaymentModal(true);
    }
    else if(msgType == "pcp") {
      setSelectedPayment({ userId, amount, msgType, jobId });
      setShowPcpPaymentModal(true);
    }
  };
  
  const closePaymentModal = (msgType) => {
    if(msgType === "pcp") {
      setShowPcpPaymentModal(false);
      setSelectedPayment({ userId: null, amount: 0, msgType:"", jobId: null });
    } else if(msgType === "pbp") {
      setShowPbpPaymentModal(false);
      setSelectedPayment({ userId: null, amount: 0, msgType:"", jobId: null });
    }
  };

  const requiredRatings = {};
  jobSkills.forEach(skill => {
    const ratingArray = skill.rating;
    if (ratingArray && ratingArray.length > 0) {
      const selectedRating = ratingArray.length >= 2 ? ratingArray[1] : ratingArray[0];
      requiredRatings[skill.isot_file.name] = selectedRating.rating;
    }
  });

  const handleShortlistToggle = (profile, checked) => {
    setSelectedProfiles((prev) =>
      checked
        ? [...prev, profile]
        : prev.filter((p) => p.user_id !== profile.user_id)
    );
  };  
  console.log("Selected Profiles:", selectedProfiles);
  const handleSendRequest = async () => {
    if (selectedProfiles.length === 0) {
      alert("Please select at least one profile");
      return;
    }
  
    try {

      const cleanedProfiles = selectedProfiles
      .filter((p) => p.user_id && p.vsp_details)
      .map((p) => {
        const pbpFee = Number(p.vsp_details.pbpFee) || 0;
        const pcpFee = Number(p.vsp_details.pcpFee) || 0;
    
        return {
          user_id: p.user_id,
          user_name: p.username,
          vsp_details: p.vsp_details,
          skill_details: p.skill_details,
          pbp_is_paid: pbpFee === 0,
          pbp_msg_status: null,
          pcp_is_paid: pcpFee === 0,
          pcp_msg_status: null,
        };
      });

      const oldProfilesCleaned = shortlistedProfiles.map((p) => ({
        user_id: p.user_id,
        user_name: p.username,
        vsp_details: p.vsp_details,
        skill_details: p.skill_details,
        pbp_is_paid: p.pbp_is_paid ?? false,
        pbp_msg_status: p.pbp_msg_status ?? null,
        pcp_is_paid: p.pcp_is_paid ?? false,
        pcp_msg_status: p.pcp_msg_status ?? null,
      }));
      
      // Merge and deduplicate by user_id
      const allShortlisted = [
        ...oldProfilesCleaned,
        ...cleanedProfiles
      ].filter((p, index, self) =>
        index === self.findIndex((x) => x.user_id === p.user_id)
      );
      
      const payload = {
        user_id: userId,
        job_id: activeJob.id,
        job_title: activeJob.job_title,
        findMatch: {
            ...findMatch,
            countryName: findMatch.countryName,
            stateName: findMatch.stateName,
            cityName: findMatch.cityName,
        },
        matched_profiles: profiles,
        shortlisted_profiles: allShortlisted,
      };
  
      // const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/shortlist-profiles/`, {
      const res = await fetch("https://api.myskillsplus.com/shortlist-profiles/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
  
      if (!res.ok) throw new Error("Shortlist failed");
  
      alert("Profiles shortlisted successfully");
      if (onShortlistComplete) {
        onShortlistComplete();
      }
    } catch (err) {
      console.error(err);
      alert("Failed to shortlist profiles");
    }
  };
  
  const fetchShortlistedProfiles = async () => {
    try {
      // const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/get-shortlisted-profiles/${userId}/${activeJob.id}`);
      const res = await fetch(`https://api.myskillsplus.com/get-shortlisted-profiles/${userId}/${activeJob.id}`);
      if (!res.ok) throw new Error("Failed to fetch shortlisted users");
      const data = await res.json();
      setFindMatch(data.findMatch);
      setSelectedProfiles(data.shortlisted_profiles);
      setShortlistedProfiles(data.shortlisted_profiles);
      const existingUserIds = (data.shortlisted_profiles).map(p => p.user_id);
      const newMatchesOnly = (data.matched_profiles).filter(p => !existingUserIds.includes(p.user_id));
      setProfiles(newMatchesOnly);
      return data.shortlisted_profiles;
    } catch (error) {
      console.error("Error fetching shortlisted profiles:", error);
    }
  };

  useEffect(() => {

    if (mode === "view-matches") {
        fetchShortlistedProfiles();
        setViewMode(true);
    } else if (mode === "edit-matches") {
        fetchShortlistedProfiles();
        setTableView(true);
        setIsEditing(true);
    }

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

    const fetchSkills = async () => {
        try {
            // const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/get-user-rated-skills/${userId}/${activeJob.id}`);
            const res = await fetch(`https://api.myskillsplus.com/get-user-rated-skills/${userId}/${activeJob.id}`);
            if (!res.ok) throw new Error('Failed to fetch skills');
            const data = await res.json();
            setJobSkills(data);
        } catch (error) {
            console.error('Error fetching skills:', error);
        }
    };
    fetchSkills();

    const fetchJobBackgroundStatus = async () => {
      try {
        // const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/job-background-status/${userId}/${activeJob.id}`);
        const response = await fetch(`https://api.myskillsplus.com/job-background-status/${userId}/${activeJob.id}`);
        const data = await response.json();
    
        if (data.status === "success") {
          setHasBackgroundProfile(data.hasBackgroundProfile);
        } else {
          setHasBackgroundProfile(false);
        }
      } catch (error) {
        console.error("Error fetching job background profile status:", error);
        setHasBackgroundProfile(false);
      }
    };
    fetchJobBackgroundStatus();
    
  }, []);
  
  const handlePay = (userId, type) => {
    updateProfileState(userId, `${type}Paid`, true);
  };

  const handleMessage = (userId, type) => {
    updateProfileState(userId, `${type}Status`, "Pending");
  };

  const handleInitialMessage = async (userId, type, content) => {
    try {

      const origin = window.location.origin;
      const profileUrl = `${origin}/jobskillsprofile?jobTitle=${activeJob.job_title}&recruiterId=${userDetails?.individual_profile_id}&jobId=${activeJob.id}`;
      const jobBackgroundProfileUrl = `${origin}/job-background-profile?jobTitle=${activeJob.job_title}&recruiterId=${userDetails?.individual_profile_id}&jobId=${activeJob.id}`;
      // const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/initiate-message/`, {
      const res = await fetch('https://api.myskillsplus.com/initiate-message/', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            recruiter_id: userDetails?.individual_profile_id,
            user_id: userId,
            job_id: activeJob.id,
            job_name: activeJob.job_title,
            message_type: type,
            message: content,
            job_profile_url:profileUrl,
            job_background_url: jobBackgroundProfileUrl,
        }),
      });
  
      if (!res.ok) throw new Error("Failed to send message");
  
      fetchShortlistedProfiles();
      alert("Message sent successfully");
    } catch (error) {
      console.error(error);
      alert("Failed to send message");
    }
  };
  
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

  const handleClear = () => {
    resetProfile();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!jobSkills ) {
      alert('No rated skills found. Profile not submitted.');
      return;
    }

    const payload = {
      userId,
      name,
      email,
      findMatch: {
        ...findMatch,
        countryName: findMatch.countryName,
        stateName: findMatch.stateName,
        cityName: findMatch.cityName,
      },
      jobTitle: activeJob.job_title,
      ratedSkills: jobSkills,
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
        if (mode === "edit-matches") {
          const latestShortlisted = await fetchShortlistedProfiles();
          const existingUserIds = latestShortlisted.map(p => p.user_id);
          const newMatchesOnly = data.filter(p => !existingUserIds.includes(p.user_id));
          setProfiles(newMatchesOnly);
        }
        else{
          setProfiles(data);
        }
        setMatchingProfile(true);
        setTableView(true);
    } catch (error) {
        console.error('Error submitting profile:', error);
        alert('Error saving profile.');
    }
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
    setFindMatch((prev) => ({
    ...prev,
    [field]: selectedOption ? selectedOption.value : '',
    [`${field}Name`]: selectedOption ? selectedOption.label : '',
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

  const encodeUserId = (userId) => {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let encoded = '';
    let num = userId;
  
    while (num > 0) {
      encoded = chars[num % 62] + encoded;
      num = Math.floor(num / 62);
    }
  
    return `${encoded}`;
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
  
  const fetchPbpProfileDetails = async (userId) => {
    try {
      // const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/users/get-details/?userId=${userId}`);
      const res = await fetch(`https://api.myskillsplus.com/users/get-details/?userId=${userId}`);
      if (!res.ok) {
        setLoading(false);
        return;
      }
      const data = await res.json();
      if (data && Object.keys(data).length > 0) {
        setEducation(data.education || []);
        setExperience(data.experience || []);
        setProjects(data.projects || []);
        setTasks(data.tasks || []);
        setAchievements(data.achievements || []);
        setPbpViewMode(true);
      }
    } catch (err) {
      console.error("Profile fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };

  //Display card for the profile
  const DisplayCard = ({ title, children }) => (
    <div className="bg-white p-5 rounded-2xl shadow-sm">
      <h3 className="text-lg font-semibold text-black mb-3">{title}</h3>
      {children}
    </div>
  );

  return loading ? (
    <p>Loading...</p>
  ) : pbpViewMode ? (
    <>
        <div className="grid grid-cols-1 lg:grid-cols-2 md:grid-cols-2 gap-6">
          {/*Education section*/}
          <DisplayCard title="Education">
            {education.map((e, idx) => (
              <div key={idx} className="space-y-4 text-sm mb-3">
                <div className="grid grid-cols-1 lg:grid-cols-2 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-[#8F9AAA] font-medium">Level of Education</p>
                    <p className="text-[#24303F] font-medium">{e.levelOfEducation || '-'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[#8F9AAA] font-medium">Descipline</p>
                    <p className="text-[#24303F] font-medium">{e.discipline || '-'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[#8F9AAA] font-medium">College</p>
                    <p className="text-[#24303F] font-medium">{e.college || '-'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[#8F9AAA] font-medium">Date</p>
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
                  <p className="text-[#8F9AAA] font-medium">Company</p>
                  <p className="text-[#24303F] font-medium">{e.company || '-'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[#8F9AAA] font-medium">Date</p>
                  <p className="text-[#24303F] font-medium">{e.startDate || '-'} – {e.endDate || '-'}</p>
                </div>
            </div>
            ))}
          </DisplayCard>
          {/*Projects section*/}
          <DisplayCard title="Project">
            {projects.map((p, idx) => (
              <div key={idx} className="space-y-4 text-sm mb-3">
                <div className="space-y-1">
                  <p className="text-[#8F9AAA] font-medium">Title of Project</p>
                  <p className="text-[#24303F] font-medium">{p.title || '-'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[#8F9AAA] font-medium">Duration</p>
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
                      <p className="text-[#8F9AAA] font-medium">Description</p>
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
                    <p className="text-[#8F9AAA] font-medium">Notable achievements</p>
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
  ) : viewMode ? (
    <>
        {/* <div className="p-6 rounded-xl bg-white shadow">
            <div className="flex">
                <h2 className="text-xl font-semibold mb-2">{activeJob.job_title || "Job Title"}</h2>
            </div>
            <p className="text-sm text-gray-500 mb-4">{new Date().toDateString()}</p>
            <table className="min-w-full text-sm text-center border">
                <thead className="bg-gray-100">
                <tr>
                    <th className="p-3 border">Shortlisted Profile</th>
                    <th className="p-3 border">PBP View Fee</th>
                    <th className="p-3 border">Pay PBP View Fee</th>
                    <th className="p-3 border">Message for PCP View</th>
                    <th className="p-3 border">Status of PCP Request</th>
                    <th className="p-3 border">PCP View Fee</th>
                    <th className="p-3 border">Pay PCP View Fee</th>
                    <th className="p-3 border">Create Chat</th>
                </tr>
                </thead>
                <tbody>
                {shortlistedProfiles.map((profile, idx) => (
                    <tr key={idx} className="border-t">
                    <td className="p-3 border font-medium">{profile.vsp_details?.name || "-"}</td>
                    <td className="p-3 border">{profile.vsp_details?.pbpFee || "-"} $</td>
                    <td className="p-3 border">
                        {profile.pbpPaid ? (
                        <span className="bg-green-500 text-white text-xs px-3 py-1 rounded-full">Paid</span>
                        ) : (
                        <button className="bg-blue-500 text-white text-xs px-3 py-1 rounded-full">Pay</button>
                        )}
                    </td>
                    <td className="p-3 border">
                        {profile.pbpPaid ? (
                        <button className="bg-blue-500 text-white text-xs px-3 py-1 rounded-full">Message</button>
                        ) : (
                        <span className="text-gray-400 text-xs">Message</span>
                        )}
                    </td>
                    <td className="p-3 border">
                        {profile.pbpPaid ? (
                        <span className="bg-yellow-200 text-yellow-700 text-xs px-3 py-1 rounded-full">Pending</span>
                        ) : (
                        <span className="text-gray-400 text-xs">---</span>
                        )}
                    </td>
                    <td className="p-3 border">{profile.vsp_details?.pcpFee || "-"} $</td>
                    <td className="p-3 border">
                        <button className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full">Pay</button>
                    </td>
                    <td className="p-3 border">
                        <button className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full">Connect</button>
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div> */}
        <div className="p-4 sm:p-6 rounded-xl bg-white shadow">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                <h2 className="text-lg sm:text-xl font-semibold">
                {activeJob?.job_title || "Job Title"}
                </h2>
                <p className="text-sm text-gray-500">{new Date().toDateString()}</p>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-center border border-gray-200">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-3 border">Shortlisted Profile</th>
                            {/* PBP Columns */}
                            <th className="p-3 border">PBP View Fee</th>
                            <th className="p-3 border">Pay PBP View Fee</th>
                            <th className="p-3 border">Message for PBP</th>
                            <th className="p-3 border">Status of PBP</th>

                            {/* PCP Columns */}
                            <th className="p-3 border">PCP View Fee</th>
                            <th className="p-3 border">Pay PCP View Fee</th>
                            <th className="p-3 border">Message for PCP</th>
                            <th className="p-3 border">Status of PCP</th>

                            <th className="p-3 border">View Profile</th>
                        </tr>
                    </thead>
                    <tbody>
                        {shortlistedProfiles.map((profile) => {
                            return (
                                <tr key={profile.user_id} className="border-t">
                                    <td
                                      className="p-3 border font-medium text-blue-600 cursor-pointer hover:underline"
                                      onClick={() =>
                                        window.open(`${process.env.NEXT_PUBLIC_INDIVIDUAL_PROFILE_URL}individual/${profile.user_id}`, '_blank')
                                      }
                                    >
                                      {profile.user_id}
                                    </td>
                                    {/* <td className="p-3 border font-medium">
                                      {profile.user_id}
                                    </td> */}
                                    {/* PBP Fee */}
                                    <td className="p-3 border">
                                        {profile.vsp_details?.pbpFee || "-"} $
                                    </td>
                                    {/* PBP Pay */}
                                    <td className="p-3 border">
                                        {profile.pbp_is_paid ? (
                                        <span className="bg-green-500 text-white text-xs px-3 py-1 rounded-full">Paid</span>
                                        ) : (
                                        <button
                                            onClick={() => openPaymentModal(profile.user_id, profile.vsp_details?.pbpFee || 0,"pbp", activeJob.id)}
                                            className="bg-blue-500 text-white text-xs px-3 py-1 rounded-full"
                                        >
                                            Pay
                                        </button>
                                        )}
                                        {showPbpPaymentModal && (
                                            <>
                                                {/* Overlay */}
                                                <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => closePaymentModal("pbp")} />
                                                {/* Modal Content */}
                                                <div className="fixed top-1/2 left-1/2 z-50 transform -translate-x-1/2 -translate-y-1/2 bg-white w-[90%] sm:w-[400px] p-6 rounded-xl shadow-xl">
                                                <h2 className="text-lg font-semibold mb-4">Complete PBP Payment</h2>
                                                  <Elements stripe={stripePromise}>
                                                      <CheckoutForm
                                                        userId={selectedPayment.userId}
                                                        amount={selectedPayment.amount}
                                                        msgType={selectedPayment.msgType}
                                                        jobId={selectedPayment.jobId}
                                                        onClose={() => closePaymentModal("pbp")}
                                                      />
                                                  </Elements>
                                                </div>
                                            </>
                                        )}
                                    </td>
                                    {/* PBP Message */}
                                    <td className="p-3 border">
                                        {profile.pbp_is_paid ? (
                                            <div className="relative inline-block">
                                                <button 
                                                    onClick={() => {
                                                    if (!hasBackgroundProfile) {
                                                      setTooltipTarget({ userId: profile.user_id, type: "noBackgroundProfile" });
                                                      setTimeout(() => setTooltipTarget({ userId: null, type: null }), 3000);
                                                      return;
                                                    }
                                                    if (profile.pbp_msg_status === "approved") {
                                                        router.push("/messages");
                                                    } else if (profile.pbp_msg_status === "rejected") {
                                                        setTooltipTarget({ userId: profile.user_id, type: "pbp" });
                                                        setTimeout(() => setTooltipTarget({ userId: null, type: null }), 3000);
                                                    } else if (profile.pbp_msg_status === "pending") {
                                                        setTooltipTarget({ userId: profile.user_id, type: "pbp" });
                                                        setTimeout(() => setTooltipTarget({ userId: null, type: null }), 3000);
                                                    } else {
                                                        setPopupTarget({ userId: profile.user_id, type: "pbp" });
                                                    }
                                                    }}
                                                    className="bg-blue-500 text-white text-xs px-3 py-1 rounded-full"
                                                >
                                                    Message
                                                </button>

                                                {/* Tooltip for pending status */}
                                                {tooltipTarget.userId === profile.user_id && tooltipTarget.type === "pbp" && (
                                                    <div className="absolute -top-2/3 left-1/2 transform -translate-x-1/2 w-64 text-center text-xs bg-yellow-100 border border-yellow-300 text-yellow-800 rounded shadow p-2 z-50">
                                                        Waiting for user approval to start conversation...
                                                    </div>
                                                )}

                                                {tooltipTarget.userId === profile.user_id && tooltipTarget.type === "noBackgroundProfile" && (
                                                  <div className="absolute -top-2/3 left-1/2 transform -translate-x-1/2 w-64 text-center text-xs bg-red-100 border border-red-300 text-red-800 rounded shadow p-2 z-50">
                                                    User has not submitted a background profile for this job.
                                                  </div>
                                                )}
                                                {/* Modal popup for first-time message */}
                                                {popupTarget.userId === profile.user_id && popupTarget.type === "pbp" && (
                                                    <>
                                                    {/* Background Blur Overlay */}
                                                    <div
                                                        className="fixed inset-0 bg-black bg-opacity-40 z-40"
                                                        onClick={() => setPopupTarget({ userId: null, type: null })}
                                                    />
                                                    {/* Centered Modal */}
                                                    <div className="fixed top-1/2 left-1/2 z-50 transform -translate-x-1/2 -translate-y-1/2 bg-white w-[90%] sm:w-[400px] p-6 rounded-xl shadow-xl">
                                                        <h3 className="text-lg font-semibold mb-2">Send Message</h3>
                                                        <textarea
                                                            value={pbpMessageText}
                                                            onChange={(e) => setPbpMessageText(e.target.value)}
                                                            placeholder="Enter message..."
                                                            className="w-full border border-gray-300 rounded p-2 text-sm focus:outline-none"
                                                            rows={4}
                                                        />
                                                        <div className="flex justify-end gap-2 mt-4">
                                                            <button
                                                                onClick={() => {
                                                                handleInitialMessage(profile.user_id, "pbp", pbpMessageText);
                                                                setPopupTarget({ userId: null, type: null });
                                                                setPbpMessageText("");
                                                                }}
                                                                className="bg-green-500 text-white px-5 py-1 rounded-full hover:bg-green-700"
                                                            >
                                                                Send
                                                            </button>
                                                            <button
                                                                onClick={() => setPopupTarget({ userId: null, type: null })}
                                                                className="bg-gray text-black px-3 py-1 rounded-full hover:bg-gray-800"
                                                            >
                                                                Cancel
                                                            </button>
                                                        </div>
                                                    </div>
                                                    </>
                                                )}
                                            </div>
                                        ) : (
                                            <button
                                                className="bg-gray-300 text-gray-800 text-xs px-3 py-1 rounded-full cursor-not-allowed"
                                                disabled
                                            >
                                                Message
                                            </button>
                                        )}
                                    </td>
                                    {/* PBP Status */}
                                    <td className="p-3 border">
                                        {profile.pbp_msg_status === "approved" ? (
                                            <span className={"text-xs px-3 py-1 rounded-full bg-green-200 text-green-700"}>
                                                {profile.pbp_msg_status}
                                             </span>
                                        ) : profile.pbp_msg_status === "rejected" ?(
                                            <span className="bg-[#F0494929] text-[#F04949] text-xs px-3 py-1 rounded-full">{profile.pbp_msg_status}</span>
                                        ) : profile.pbp_msg_status === "pending" ? (
                                            <span className="bg-yellow-200 text-yellow-700 text-xs px-3 py-1 rounded-full">{profile.pbp_msg_status}</span>
                                        ) : (
                                            <span className="text-gray-400 text-xs">---</span>
                                        )}
                                    </td>

                                    {/* PCP Fee */}
                                    <td className="p-3 border">
                                        {profile.vsp_details?.pcpFee || "-"} $
                                    </td>
                                    {/* PCP Pay */}
                                    <td className="p-3 border">
                                        {profile.pcp_is_paid ? (
                                        <span className="bg-green-500 text-white text-xs px-3 py-1 rounded-full">Paid</span>
                                        ) : (
                                        <button
                                            onClick={() => openPaymentModal(profile.user_id, profile.vsp_details?.pcpFee || 0, "pcp", activeJob.id)}
                                            className="bg-blue-500 text-white text-xs px-3 py-1 rounded-full"
                                        >
                                            Pay
                                        </button>
                                        )}
                                        {showPcpPaymentModal && (
                                            <>
                                                {/* Overlay */}
                                                <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => closePaymentModal("pcp")} />
                                                {/* Modal Content */}
                                                <div className="fixed top-1/2 left-1/2 z-50 transform -translate-x-1/2 -translate-y-1/2 bg-white w-[90%] sm:w-[400px] p-6 rounded-xl shadow-xl">
                                                <h2 className="text-lg font-semibold mb-4">Complete PCP Payment</h2>
                                                  <Elements stripe={stripePromise}>
                                                      <CheckoutForm
                                                        userId={selectedPayment.userId}
                                                        amount={selectedPayment.amount}
                                                        msgType={selectedPayment.msgType}
                                                        jobId={selectedPayment.jobId}
                                                        onClose={() => closePaymentModal("pcp")}
                                                      />
                                                  </Elements>
                                                </div>
                                            </>
                                        )}
                                    </td>
                                    {/* PCP Message */}
                                    <td className="p-3 border">
                                        {profile.pcp_is_paid ? (
                                            <div className="relative inline-block">
                                                <button 
                                                    onClick={() => {
                                                    if (profile.pcp_msg_status === "approved") {
                                                        router.push("/messages");
                                                    } else if (profile.pcp_msg_status === "rejected") {
                                                        setTooltipTarget({ userId: profile.user_id, type: "pcp" });
                                                        setTimeout(() => setTooltipTarget({ userId: null, type: null }), 3000);
                                                    } else if (profile.pcp_msg_status === "pending") {
                                                        setTooltipTarget({ userId: profile.user_id, type: "pcp" });
                                                        setTimeout(() => setTooltipTarget({ userId: null, type: null }), 3000);
                                                    } else {
                                                        setPopupTarget({ userId: profile.user_id, type: "pcp" });
                                                    }
                                                    }}
                                                    className="bg-blue-500 text-white text-xs px-3 py-1 rounded-full"
                                                >
                                                    Message
                                                </button>

                                                {/* Tooltip for pending status */}
                                                {tooltipTarget.userId === profile.user_id && tooltipTarget.type === "pcp" && (
                                                    <div className="absolute -top-2/3 left-1/2 transform -translate-x-1/2 w-64 text-center text-xs bg-yellow-100 border border-yellow-300 text-yellow-800 rounded shadow p-2 z-50">
                                                        Waiting for user approval to start conversation...
                                                    </div>
                                                )}

                                                {/* Modal popup for first-time message */}
                                                {popupTarget.userId === profile.user_id && popupTarget.type === "pcp" && (
                                                    <>
                                                    {/* Background Blur Overlay */}
                                                    <div
                                                        className="fixed inset-0 bg-black bg-opacity-40 z-40"
                                                        onClick={() => setPopupTarget({ userId: null, type: null })}
                                                    />
                                                    {/* Centered Modal */}
                                                    <div className="fixed top-1/2 left-1/2 z-50 transform -translate-x-1/2 -translate-y-1/2 bg-white w-[90%] sm:w-[400px] p-6 rounded-xl shadow-xl">
                                                        <h3 className="text-lg font-semibold mb-2">Send Message</h3>
                                                        <textarea
                                                            value={pcpMessageText}
                                                            onChange={(e) => setPcpMessageText(e.target.value)}
                                                            placeholder="Enter message..."
                                                            className="w-full border border-gray-300 rounded p-2 text-sm focus:outline-none"
                                                            rows={4}
                                                        />
                                                        <div className="flex justify-end gap-2 mt-4">
                                                            <button
                                                                onClick={() => {
                                                                handleInitialMessage(profile.user_id, "pcp", pcpMessageText);
                                                                setPopupTarget({ userId: null, type: null });
                                                                setPcpMessageText("");
                                                                }}
                                                                className="bg-green-500 text-white px-5 py-1 rounded-full hover:bg-green-700"
                                                            >
                                                                Send
                                                            </button>
                                                            <button
                                                                onClick={() =>   setPopupTarget({ userId: null, type: null })}
                                                                className="bg-gray text-black px-3 py-1 rounded-full hover:bg-gray-800"
                                                            >
                                                                Cancel
                                                            </button>
                                                        </div>
                                                    </div>
                                                    </>
                                                )}
                                            </div>
                                        ) : (
                                            <button
                                                className="bg-gray-300 text-gray-800 text-xs px-3 py-1 rounded-full cursor-not-allowed"
                                                disabled
                                            >
                                                Message
                                            </button>
                                        )}
                                    </td>
                                    {/* PCP Status */}
                                    <td className="p-3 border">
                                        {profile.pcp_msg_status === "approved" ? (
                                            <span className={"text-xs px-3 py-1 rounded-full bg-green-200 text-green-700"}>
                                                {profile.pcp_msg_status}
                                            </span>
                                        ) : profile.pcp_msg_status === "rejected" ?(
                                            <span className="bg-[#F0494929] text-[#F04949] text-xs px-3 py-1 rounded-full">{profile.pcp_msg_status}</span>
                                        ) : profile.pcp_msg_status === "pending" ? (
                                            <span className="bg-yellow-200 text-yellow-700 text-xs px-3 py-1 rounded-full">{profile.pcp_msg_status}</span>
                                        ) : (
                                            <span className="text-gray-400 text-xs">---</span>
                                        )}
                                    </td>
                                    {/* View Profile */}
                                    <td className="p-3 border">
                                        {profile.pbp_msg_status === "approved" ? (
                                            <span
                                            className="text-blue-500 font-medium underline cursor-pointer text-sm"
                                            onClick={() => fetchPbpProfileDetails(profile.user_id)}
                                            >
                                            View PBP
                                            </span>
                                        ) : (
                                            <span className="text-gray-400 text-sm">---</span>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    </>
  ) : (
    <form onSubmit={handleSubmit} className="space-y-6">
        {/* Job Find Matches Form */}
        <div className="job-find-matches mb-4">
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
            {tableView && profiles.length > 0 ? (
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
                {/* <div className="space-y-4">
                    {profiles.map((profile, idx) => {
                        let actual = 0;
                        profile.skill_details.forEach(skill => {
                          if (requiredRatings.hasOwnProperty(skill.skill_name)) {
                            const required = requiredRatings[skill.skill_name];
                            const user = Math.min(skill.user_rating, required);
                            actual += user;
                          }
                        });
                      
                        const expected = Object.values(requiredRatings).reduce((sum, val) => sum + val, 0);                          

                        const matchScore = expected ? Math.round((actual / expected) * 100) : 0;
                        return (
                            <div key={profile.user_id} className="grid grid-cols-1 sm:grid-cols-6 items-center border rounded-lg p-4 gap-4 shadow-sm">
                                <div className="sm:col-span-1 text-sm">
                                    <span
                                      className="font-semibold cursor-pointer text-blue-600 hover:underline"
                                      onClick={() => setSelectedSkillProfile(profile)}
                                    >
                                      {encodeUserName(profile.vsp_details.name)}
                                    </span>
                                </div>
                                <div className="text-sm">
                                    <span className="font-semibold">{matchScore}% match</span>
                                </div>
                                <div className="text-sm">
                                    <span className="font-semibold">${profile.vsp_details?.vspCost}</span> VSP
                                </div>
                                <div className="text-sm">
                                    <span className="font-semibold">${profile.vsp_details?.pbpFee}</span> PBP
                                </div>
                                <div className="text-sm">
                                    <span className="font-semibold">${profile.vsp_details?.pcpFee}</span> PCP
                                </div>
                                <div className="text-sm flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        onChange={(e) => handleShortlistToggle(profile, e.target.checked)}
                                        checked={selectedProfiles.some((p) => p.user_id === profile.user_id)}
                                        className="accent-blue-600"
                                    />
                                    <label className="text-gray-800">Shortlist</label>
                                </div>
                            </div>
                        );
                    })}
                </div> */}
                <div className="overflow-x-auto">
                  <table className="min-w-full table-auto text-sm border border-[#F5F5F5] rounded-lg">
                    <thead className="bg-[#F5F5F5] text-center">
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
                          <tr key={profile.user_id} className="border-t hover:bg-gray-50 text-center">
                            <td
                              className="px-4 py-2 border font-medium text-blue-600 cursor-pointer hover:underline"
                              onClick={() =>
                                window.open(`${process.env.NEXT_PUBLIC_INDIVIDUAL_PROFILE_URL}individual/${profile.user_id}`, '_blank')
                              }
                            >
                              {profile.user_id}
                            </td>
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
            {selectedSkillProfile && (
              <div className="mt-6 p-4 rounded-xl bg-white shadow">
                <h4 className="font-semibold mb-4">
                  Skill Match for {selectedSkillProfile.user_id}
                </h4>

                <div className="overflow-x-auto">
                  <table className="min-w-full border text-sm text-left">
                    <thead className="bg-[#F5F5F5]">
                      <tr>
                        <th className="px-4 py-2 border">Skills Name</th>
                        <th className="px-4 py-2 border text-center">Required Rating</th>
                        <th className="px-4 py-2 border text-center">{selectedSkillProfile.user_id}'s Rating</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.keys(requiredRatings).map((skillName) => {
                        const required = requiredRatings[skillName];
                        const userSkill = selectedSkillProfile.skill_details.find(s => s.skill_name === skillName);
                        const userRating = userSkill ? userSkill.user_rating : 0;
                        return (
                          <tr key={skillName}>
                            <td className="px-4 py-2 border">{skillName}</td>
                            <td className="px-4 py-2 border text-center">{required}</td>
                            <td className="px-4 py-2 border text-center">{userRating}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 text-right">
                  <button
                    onClick={() => setSelectedSkillProfile(null)}
                    className="px-4 py-1.5 bg-[#E0E0E0] rounded hover:bg-[#BDBDBD] text-sm"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
            {/* {tableView && profiles.length > 0 ? (
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

                            profile.skill_details.forEach(skill => {
                              if (requiredRatings.hasOwnProperty(skill.skill_name)) {
                                const required = requiredRatings[skill.skill_name];
                                const user = Math.min(skill.user_rating, required);
                                actual += user;
                              }
                            });
                          
                            const expected = Object.values(requiredRatings).reduce((sum, val) => sum + val, 0);                          

                            const matchScore = expected ? Math.round((actual / expected) * 100) : 0;
                            console.log('formulat', matchScore, actual, expected);
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
                                    {skill ? skill.user_rating : 0}
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

  );
};

const CheckoutForm = ({ userId, amount, msgType, jobId, onClose }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
    const [statusMessage, setStatusMessage] = useState(null);
  
    // const handleSubmit = async (e) => {
    //   e.preventDefault();
    //   setLoading(true);
    //   const tokenData = localStorage.getItem("tokenData");
    //   const accessToken = tokenData ? JSON.parse(tokenData)?.access : null;
    //   try {
    //     const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}users/create-payment-intent/`, {
    //       method: "POST",
    //       headers: {
    //         "Authorization": `Bearer ${accessToken}`,
    //         "Content-Type": "application/json" 
    //       },
    //       body: JSON.stringify({ user_id: userId, amount: amount }),
    //     });
  
    //     // const data = await res.json();
    //     // const clientSecret = data.clientSecret;
    //     const { clientSecret } = await res.json();
  
    //     if (!stripe || !elements) throw new Error("Stripe not ready");
  
    //     const result = await stripe.confirmCardPayment(clientSecret, {
    //       payment_method: {
    //         card: elements.getElement(CardElement),
    //       },
    //     });
  
    //     if (result.error) {
    //       setStatusMessage({ type: "error", text: result.error.message });
    //     } else if (result.paymentIntent.status === "succeeded") {
    //       await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/payment-success`, {
    //         method: "POST",
    //         headers: { "Content-Type": "application/json" },
    //         body: JSON.stringify({
    //           user_id: userId,
    //           payment_intent_id: result.paymentIntent.id,
    //           msg_type: msgType,
    //           job_id: jobId,
    //         }),
    //       });
  
    //       setStatusMessage({ type: "success", text: "🎉 Payment successful!" });
    //       onClose();
    //     }
    //   } catch (err) {
    //     setStatusMessage({ type: "error", text: err.message });
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
    
      const tokenData = localStorage.getItem("tokenData");
      const accessToken = tokenData ? JSON.parse(tokenData)?.access : null;
    
      try {
        if (!stripe || !elements) throw new Error("Stripe is not ready");
    
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}users/create-payment-intent/`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ user_id: userId, amount }),
        });
    
        if (!res.ok) {
          const errorData = await res.text();
          throw new Error(`Backend error: ${res.status} - ${errorData}`);
        }
    
        const data = await res.json();
        const clientSecret = data.clientSecret;
        if (!clientSecret) throw new Error("No clientSecret received");
    
        const result = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: elements.getElement(CardElement),
          },
        });
    
        if (result.error) {
          setStatusMessage({ type: "error", text: result.error.message });
        } else if (result.paymentIntent.status === "succeeded") {
          await fetch(`${process.env.NEXT_PUBLIC_API_URL}users/handle-payment-success/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              user_id: userId,
              payment_intent_id: result.paymentIntent.id,
              message_type: msgType,
              job_id: jobId,
            }),
          });
    
          setStatusMessage({ type: "success", text: "🎉 Payment successful!" });
          onClose();
          // fetchShortlistedProfiles();
        }
      } catch (err) {
        console.error(err);
        setStatusMessage({ type: "error", text: err.message });
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        {statusMessage && (
          <div className={`px-4 py-2 rounded ${statusMessage.type === "success" ? "bg-green-100" : "bg-red-100"}`}>
            {statusMessage.text}
          </div>
        )}
        <CardElement className="border p-2 rounded" />
        <button
          type="submit"
          disabled={!stripe || loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          {loading ? "Processing..." : `Pay $${amount}`}
        </button>
      </form>
    );
};
export default FindMatchProfile;