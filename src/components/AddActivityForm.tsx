import React, { useState } from 'react';
import { DayActivity, TravelMethod } from '../timetable';

interface AddActivityFormProps {
  onAddActivity: (activity: DayActivity) => void;
}

const AddActivityForm: React.FC<AddActivityFormProps> = ({ onAddActivity }) => {
  const [time, setTime] = useState('');
  const [activity, setActivity] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (time && activity) {
      onAddActivity({ time, activity });
      setTime('');
      setActivity('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-2">
      <input
        type="time"
        value={time}
        onChange={(e) => setTime(e.target.value)}
        className="border p-1"
      />
      <input
        type="text"
        placeholder="Activity"
        value={activity}
        onChange={(e) => setActivity(e.target.value)}
        className="border p-1 ml-2"
      />
      <button type="submit" className="bg-primary hover:bg-primary-dark text-white font-bold py-1 px-2 rounded ml-2">Add</button>
    </form>
  );
};

export default AddActivityForm;
