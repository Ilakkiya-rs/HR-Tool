'use client';
import { useEffect, useState } from 'react';

export default function VspAndOthers() {
  const [viewMode, setViewMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [vspCost, setVspCost] = useState('');
  const [vspCurrency, setVspCurrency] = useState('USD');
  const [ctc, setCtc] = useState('');
  const [calculatedVsp, setCalculatedVsp] = useState('');
  const [pbpFee, setPbpFee] = useState('');
  const [pbpCurrency, setPbpCurrency] = useState('USD');
  const [pcpFee, setPcpFee] = useState('');
  const [pcpCurrency, setPcpCurrency] = useState('USD');

  useEffect(() => {
    if (ctc) {
      const vsp = (parseFloat(ctc) / 2000).toFixed(2);
      setVspCost(vsp);
      setCalculatedVsp(vsp);
    }
  }, [ctc]);
  

  const userDetails = JSON.parse(localStorage.getItem("logedinUserDetail"));
  const userId = userDetails?.individual_profile_id;
  const firstName = userDetails?.first_name;
  const lastName = userDetails?.last_name;
  const name = `${firstName} ${lastName}`;
  const email = userDetails?.email;

  useEffect(() => {
    
    const fetchData = async () => {
      setLoading(true);
      try {
        // const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/users/vsp-details/?userId=${userId}`); // Replace with your actual API
        const res = await fetch(`https://api.myskillsplus.com/users/vsp-details/?userId=${userId}`); // Replace with your actual API
        if (res.ok) {
          const data = await res.json();
          if (data && Object.keys(data).length > 0) {
            setVspCost(data.vspCost);
            setVspCurrency(data.vspCurrency);
            setPbpFee(data.pbpFee);
            setPbpCurrency(data.pbpCurrency);
            setPcpFee(data.pcpFee);
            setPcpCurrency(data.pcpCurrency);
            setViewMode(true);
          }
        }
      } catch (err) {
        console.error('Error fetching VSP data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();

  },[]);

  const handleClear = () => {
    setVspCost('');
    setCtc('');
    setCalculatedVsp('');
    setPbpFee('');
    setPcpFee('');
    setVspManuallyEdited(false);
  };

  const handleSave = async () => {
    const payload = {
      userId,
      name,
      email,
      vspCost,
      vspCurrency,
      ctc,
      calculatedVsp,
      pbpFee,
      pbpCurrency,
      pcpFee,
      pcpCurrency,
    };
  
    try {
      // const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/users/submit-vsp-details/`, {
      const res = await fetch('https://api.myskillsplus.com/users/submit-vsp-details/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
  
      if (res.ok) {
        setViewMode(true);
        setIsEditing(false);
      } else {
        console.error('Failed to save VSP data');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };  

  const inputStyle = "border border-[#d1d5db] rounded-lg p-2 text-sm w-full focus:outline-none";

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
            <div className="grid grid-cols-3 gap-4 text-sm">
            {/* VSP */}
            <div className="p-4 rounded-2xl bg-white text-[#24303F]">
                <h2 className="text-lg font-semibold mb-4">VSP (Value of Skills Profile)</h2>
                <h2 className="text-base font-medium mb-3 text-[#8F9AAA]">Per Hour Cost</h2>
                <span className="font-semibold">{vspCost} {vspCurrency === 'USD' ? '$' : '₹'}</span>
            </div>

            {/* PBP */}
            <div className="p-4 rounded-2xl bg-white text-[#24303F]">
                <h2 className="text-lg font-semibold mb-4">PBP View Fee</h2>
                <h2 className="text-base font-medium mb-3 text-[#8F9AAA]">View Fee</h2>
                <span className="font-semibold">{pbpFee} {pbpCurrency === 'USD' ? '$' : '₹'}</span>
            </div>

            {/* PCP */}
            <div className="p-4 rounded-2xl bg-white text-[#24303F]">
                <h2 className="text-lg font-semibold mb-4">PCP View Fee</h2>
                <h2 className="text-base font-medium mb-3 text-[#8F9AAA]">View Fee</h2>
                <span className="font-semibold">{pcpFee} {pcpCurrency === 'USD' ? '$' : '₹'}</span>
            </div>
            </div>
        </div>
    </>
  ) : (
    <div className="space-y-6">
        <div className="grid grid-cols-3 gap-4 text-sm text-[#24303F]">
            {/* VSP Section */}
            <div className="rounded-xl shadow p-4 bg-white">
                <h2 className="font-semibold mb-2">VSP (Value of Skills Profile)</h2>
                <label className="block text-sm mb-1 font-medium">Cost</label>
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

                <li className="text-xs mt-1">This is your hour cost (i.e. what you would like to be per hour of your work)</li>

                <div className="mt-4 p-3 bg-[#F6F6F6] rounded-lg">
                    <h2 className="font-semibold mb-2">To convert CTC to VSP</h2>
                    <label className="block text-sm mb-1 font-medium">Type your CTC</label>
                    <input
                        type="number"
                        className={inputStyle}
                        placeholder="Enter your CTC"
                        value={ctc}
                        onChange={(e) => setCtc(e.target.value)}
                    />
                        <label className="block text-sm mt-2"><span className="font-medium">Your VSP</span> (CTC/2000 working hours)</label>
                    <input type="text" className={inputStyle} readOnly value={calculatedVsp || 'XXX'} />
                </div>
            </div>
            {/* PBP View Fee */}
            <div className="rounded-xl shadow p-4 bg-white">
                <h2 className="font-semibold mb-2">PBP View Fee</h2>
                <label className="block text-sm mb-1"><span className="font-medium">View Fee</span> (Currently taken as 10% of VSP)</label>
                <div className="flex border border-[#D1D5DB] rounded-lg overflow-hidden">
                    <input
                        type="number"
                        className="p-2 text-sm w-full focus:outline-none"
                        placeholder="Enter view fee"
                        value={pbpFee}
                        onChange={(e) => setPbpFee(e.target.value)}
                    />
                    <div className="p-1">
                        <select
                            className="text-sm bg-[#F6F6F6] p-1.5 rounded-md text-black focus:outline-none"
                            style={{ minWidth: '4rem' }}
                            value={pbpCurrency}
                            onChange={(e) => setPbpCurrency(e.target.value)}
                        >
                            <option>USD</option>
                            <option>INR</option>
                        </select>
                    </div>
                </div>
                <ul className="list-disc text-xs ml-4 mt-2 space-y-4">
                    <li>This is the money you would like to be paid for one to view your PSP</li>
                    <li>This is decided by you and can be changed any time</li>
                    <li>Your PSP View Fee will be weighed against that of others</li>
                    <li>If you are actively looking for a job and want to be given preference over others you may wan to give a lower fee over time system will give you inputs on what others are making as the PSP view fee.</li>
                </ul>
            </div>

            {/* PCP View Fee */}
            <div className="rounded-xl shadow p-4 bg-white">
                <h2 className="font-semibold mb-2">PCP View Fee</h2>
                <label className="block text-sm mb-1"><span className="font-medium">View Fee</span> (Currently taken as 10% of VSP)</label>
                <div className="flex border border-[#D1D5DB] rounded-lg overflow-hidden">
                    <input
                        type="number"
                        className="p-2 text-sm w-full focus:outline-none"
                        placeholder="Enter view fee"
                        value={pcpFee}
                        onChange={(e) => setPcpFee(e.target.value)}
                    />
                    <div className="p-1">
                        <select
                            className="text-sm bg-[#F6F6F6] p-1.5 rounded-md text-black focus:outline-none"
                            style={{ minWidth: '4rem' }}
                            value={pcpCurrency}
                            onChange={(e) => setPcpCurrency(e.target.value)}
                        >
                            <option>USD</option>
                            <option>INR</option>
                        </select>
                    </div>
                </div>
                <ul className="list-disc text-xs ml-4 mt-2 space-y-4">
                    <li>This is the money you would like to be paid for one to view your PCP</li>
                    <li>This is decided by you and can be changed any time</li>
                    <li>Your PCP View Fee will be weighed against that of others</li>
                    <li>Over time system will give you inputs on what others are making as the PBP View Fee</li>
                </ul>
            </div>
        </div>
        {/*Save and Clear buttons*/}
        <div className="flex justify-end gap-4 mt-6">
          <button className="px-5 py-1 border rounded-2xl text-sm" onClick={handleClear}>Clear</button>
          <button className="px-5 py-1 rounded-2xl text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 shadow-sm hover:shadow-md transition-all duration-200" onClick={handleSave}>Save</button>
        </div>
    </div>
  );
}
