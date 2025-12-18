import React from 'react';
import { useSelector } from 'react-redux';
import { selectStats } from '../features/todos/todosSlice';

const Stats = () => {
  const { total, completed, percent } = useSelector(selectStats);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-6">
      <div className="flex justify-between items-end mb-2">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Progress</h2>
          <p className="text-slate-500 text-sm font-medium">{completed} of {total} completed</p>
        </div>
        <div className="text-3xl font-black text-primary-600">{percent}%</div>
      </div>
      
      <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
        <div 
          className="bg-gradient-to-r from-primary-500 to-indigo-600 h-3 rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${percent}%` }}
        ></div>
      </div>
    </div>
  );
};

export default Stats;
