import React, { useEffect, useState } from "react";
import { fetchPeriods, addPeriod } from "../api/api";

const Settings = () => {
  const [periods, setPeriods] = useState([]);
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    fetchPeriods().then(setPeriods);
  }, []);

  const handleAddPeriod = async () => {
    if (!name || !startDate || !endDate) return;

    const newPeriod = { name, startDate, endDate };
    const savedPeriod = await addPeriod(newPeriod);

    setPeriods([...periods, savedPeriod]);
    setName("");
    setStartDate("");
    setEndDate("");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-semibold mb-4">Manage Periods</h1>

        {/* Add Period Form */}
        <div className="grid grid-cols-3 gap-4">
          <input 
            type="text" 
            placeholder="Period Name" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            className="border p-2 rounded w-full"
          />
          <input 
            type="date" 
            value={startDate} 
            onChange={(e) => setStartDate(e.target.value)} 
            className="border p-2 rounded w-full"
          />
          <input 
            type="date" 
            value={endDate} 
            onChange={(e) => setEndDate(e.target.value)} 
            className="border p-2 rounded w-full"
          />
        </div>

        <button 
          onClick={handleAddPeriod} 
          className="mt-4 bg-blue-500 text-white py-2 px-4 rounded w-full hover:bg-blue-600 transition"
        >
          Add Period
        </button>

        {/* Display Existing Periods */}
        <div className="mt-6">
          <h2 className="text-lg font-semibold">Existing Periods</h2>
          <ul className="bg-gray-50 p-4 rounded-lg">
            {periods.map((p) => (
              <li key={p.name} className="border-b py-2">{p.name}: {p.startDate} - {p.endDate}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Settings;
