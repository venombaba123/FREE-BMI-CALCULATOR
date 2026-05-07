/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo } from 'react';
import { ChevronDown, Play, RotateCcw, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

<div className="header">
  <h1 className="text-5xl font-bold text-center my-6 text-indigo-700">
    BMI Calculator
  </h1>
</div>

type UnitSystem = 'US' | 'Metric' | 'Other';
type Gender = 'Male' | 'Female';

interface BmiCategory {
  label: string;
  color: string;
  min: number;
  max: number;
}

const CATEGORIES: BmiCategory[] = [
  { label: 'Underweight', color: '#3b82f6', min: 0, max: 18.5 },
  { label: 'Normal', color: '#10b981', min: 18.5, max: 25 },
  { label: 'Overweight', color: '#facc15', min: 25, max: 30 },
  { label: 'Obesity', color: '#ef4444', min: 30, max: 100 },
];

export default function App() {
  const [unitSystem, setUnitSystem] = useState<UnitSystem>('Metric');
  const [age, setAge] = useState<string>('');
  const [gender, setGender] = useState<Gender | ''>('');
  const [height, setHeight] = useState<string>('');
  const [weight, setWeight] = useState<string>('');
  const [heightFt, setHeightFt] = useState<string>('');
  const [heightIn, setHeightIn] = useState<string>('');
  
  const [bmi, setBmi] = useState<number | null>(null);
  const [category, setCategory] = useState<BmiCategory | null>(null);
  const [maintenanceCalories, setMaintenanceCalories] = useState<number | null>(null);

  const calculateBmi = () => {
    let h_cm = 0;
    let w_kg = 0;

    if (unitSystem === 'Metric') {
      h_cm = parseFloat(height);
      w_kg = parseFloat(weight);
    } else {
      // US Units: height in inches, weight in lbs
      h_cm = (parseFloat(heightFt) * 12 + parseFloat(heightIn)) * 2.54; // to cm
      w_kg = parseFloat(weight) * 0.453592; // lbs to kg
    }

    if (h_cm > 0 && w_kg > 0) {
      const h_m = h_cm / 100;
      const calculatedBmi = w_kg / (h_m * h_m);
      setBmi(calculatedBmi);
      
      const cat = CATEGORIES.find(c => calculatedBmi >= c.min && calculatedBmi < c.max) || CATEGORIES[CATEGORIES.length - 1];
      setCategory(cat);

      // Calculate BMR (Mifflin-St Jeor Equation)
      const a = parseInt(age) || 25;
      let bmr = (10 * w_kg) + (6.25 * h_cm) - (5 * a);
      if (gender === 'Male') {
        bmr += 5;
      } else {
        bmr -= 161;
      }

      // Maintenance Calories (assuming lightly active - 1.375 factor)
      setMaintenanceCalories(Math.round(bmr * 1.375));
    }
  };

  const advice = useMemo(() => {
    if (!category) return null;
    if (category.label === 'Underweight') {
      return "Eat 500 calories more daily and regular exercise.";
    }
    if (category.label === 'Normal') {
      return "You are lucky! Advice: go to gym for being healthy.";
    }
    if (category.label === 'Overweight' || category.label === 'Obesity') {
      return "Eat 500 less calories daily and regular exercise.";
    }
    return null;
  }, [category]);

  const clear = () => {
    setAge('');
    setGender('');
    setHeight('');
    setWeight('');
    setHeightFt('');
    setHeightIn('');
    setBmi(null);
    setCategory(null);
    setMaintenanceCalories(null);
  };

  // Initial calculation
  useEffect(() => {
    calculateBmi();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-4xl bg-white shadow-2xl overflow-hidden border border-gray-200">
        {/* Header Banner */}
        <div className="bg-[#1e293b] text-white py-3 px-6 flex items-center justify-center gap-4 relative">
          <div className="bg-white rounded-full p-1">
            <ChevronDown className="w-6 h-6 text-[#1e293b]" />
          </div>
          <h1 className="text-lg font-medium tracking-wide">
            Enter the value and click calculate to use
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
          {/* Left Column: Input Form */}
          <div className="space-y-4">
            {/* Tabs */}
            <div className="flex border-b border-gray-200">
              {(['US Units', 'Metric Units'] as const).map((tab) => {
                const system = tab.split(' ')[0] as UnitSystem;
                const isActive = unitSystem === system;
                return (
                  <button
                    key={tab}
                    onClick={() => setUnitSystem(system)}
                    className={`px-4 py-2 text-sm font-bold transition-colors border-t border-x rounded-t-lg -mb-px ${
                      isActive
                        ? 'bg-white border-gray-300 text-black'
                        : 'bg-[#475569] border-transparent text-white hover:bg-[#334155]'
                    }`}
                  >
                    {tab}
                  </button>
                );
              })}
            </div>

            {/* Form Container */}
            <div className="bg-[#e9e9e9] p-6 border border-gray-300 space-y-4">
              {/* Age Row */}
              <div className="flex items-center gap-4">
                <label className="w-20 font-medium text-gray-700">Age</label>
                <div className="flex-1 flex items-center gap-3">
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-32 px-3 py-1.5 border border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                  <span className="text-sm text-gray-600">ages: 2 - 120</span>
                </div>
              </div>

              {/* Gender Row */}
              <div className="flex items-center gap-4">
                <label className="w-20 font-medium text-gray-700">Gender</label>
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      checked={gender === 'Male'}
                      onChange={() => setGender('Male')}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="text-gray-700">Male</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      checked={gender === 'Female'}
                      onChange={() => setGender('Female')}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="text-gray-700">Female</span>
                  </label>
                </div>
              </div>

              {/* Height Row */}
              <div className="flex items-center gap-4">
                <label className="w-20 font-medium text-gray-700">Height</label>
                <div className="flex-1 flex items-center">
                  {unitSystem === 'Metric' ? (
                    <div className="relative flex-1 max-w-[240px]">
                      <input
                        type="number"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                        className="w-full px-3 py-1.5 border border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white pr-10"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">cm</span>
                    </div>
                  ) : (
                    <div className="flex gap-2 flex-1 max-w-[240px]">
                      <div className="relative flex-1">
                        <input
                          type="number"
                          value={heightFt}
                          onChange={(e) => setHeightFt(e.target.value)}
                          className="w-full px-3 py-1.5 border border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white pr-8"
                        />
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-sm">ft</span>
                      </div>
                      <div className="relative flex-1">
                        <input
                          type="number"
                          value={heightIn}
                          onChange={(e) => setHeightIn(e.target.value)}
                          className="w-full px-3 py-1.5 border border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white pr-8"
                        />
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-sm">in</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Weight Row */}
              <div className="flex items-center gap-4">
                <label className="w-20 font-medium text-gray-700">Weight</label>
                <div className="relative flex-1 max-w-[240px]">
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="w-full px-3 py-1.5 border border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white pr-10"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                    {unitSystem === 'Metric' ? 'kg' : 'lb'}
                  </span>
                </div>
              </div>

              {/* Buttons Row */}
              <div className="flex gap-3 pt-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={calculateBmi}
                  className="flex-1 bg-[#6366f1] hover:bg-[#4f46e5] text-white font-bold py-3 px-4 rounded flex items-center justify-center gap-2 transition-all shadow-md active:shadow-inner"
                >
                  Calculate
                  <div className="bg-white/20 rounded-full p-0.5">
                    <Play className="w-4 h-4 fill-white" />
                  </div>
                </motion.button>
                <button
                  onClick={clear}
                  className="bg-[#a5a5a5] hover:bg-[#8e8e8e] text-white font-bold py-3 px-6 rounded transition-colors shadow-sm"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Results & Gauge */}
          <div className="flex flex-col">
            <div className="bg-[#1e293b] text-white py-1.5 px-4 flex justify-between items-center">
              <span className="text-xl font-medium">Result</span>
              <button className="flex flex-col items-center opacity-80 hover:opacity-100 transition-opacity">
                <Save className="w-4 h-4" />
                <span className="text-[10px] uppercase font-bold">save</span>
              </button>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-6">
              {bmi !== null && (
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-800">
                    BMI = {bmi.toFixed(1)} kg/m² 
                    <span className="ml-2" style={{ color: category?.color }}>
                      ({category?.label})
                    </span>
                  </div>
                </div>
              )}

              <div className="relative w-full max-w-[350px]">
                <LinearGauge bmi={bmi || 0} />
              </div>

              {/* Additional Calculators Links */}
              <div className="w-full space-y-3 pt-4 border-t border-gray-100">
                <motion.a
                  href="#"
                  whileHover={{ x: 5 }}
                  className="flex items-center justify-between p-3 bg-slate-50 hover:bg-indigo-50 rounded-lg border border-slate-200 hover:border-indigo-200 transition-colors group"
                >
                  <span className="text-sm font-semibold text-slate-700 group-hover:text-indigo-700">check your maintenance calorie</span>
                  <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 -rotate-90" />
                </motion.a>
                <motion.a
                  href="#"
                  whileHover={{ x: 5 }}
                  className="flex items-center justify-between p-3 bg-slate-50 hover:bg-indigo-50 rounded-lg border border-slate-200 hover:border-indigo-200 transition-colors group"
                >
                  <span className="text-sm font-semibold text-slate-700 group-hover:text-indigo-700">check your body fat percentage(%)</span>
                  <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 -rotate-90" />
                </motion.a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LinearGauge({ bmi }: { bmi: number }) {
  // Range: 15 to 40
  const minBmi = 15;
  const maxBmi = 40;
  const clampedBmi = Math.min(Math.max(bmi, minBmi), maxBmi);
  
  // Map BMI to percentage based on equal-width segments
  // Segments: 15-18.5, 18.5-25, 25-30, 30-40
  const getPercentage = (val: number) => {
    if (val <= 18.5) {
      return ((val - 15) / (18.5 - 15)) * 0.25;
    } else if (val <= 25) {
      return 0.25 + ((val - 18.5) / (25 - 18.5)) * 0.25;
    } else if (val <= 30) {
      return 0.5 + ((val - 25) / (30 - 25)) * 0.25;
    } else {
      return 0.75 + ((val - 30) / (40 - 30)) * 0.25;
    }
  };

  const percentage = getPercentage(clampedBmi);

  const segments = [
    { label: 'Underweight', color: '#ef4444', flex: 0.25 },
    { label: 'Normal', color: '#10b981', flex: 0.25 },
    { label: 'Overweight', color: '#facc15', flex: 0.25 },
    { label: 'Obesity', color: '#991b1b', flex: 0.25 },
  ];

  return (
    <div className="w-full py-12 px-2">
      {/* The Linear Bar */}
      <div className="relative h-4 w-full flex rounded-full overflow-hidden shadow-inner bg-gray-200">
        {segments.map((s, i) => (
          <div 
            key={i} 
            style={{ width: `${s.flex * 100}%`, backgroundColor: s.color }} 
            className="h-full border-r border-white/20 last:border-0"
          />
        ))}
      </div>

      {/* The Jumping Ball */}
      <div className="relative w-full h-0">
        <motion.div
          initial={false}
          animate={{ 
            left: `${percentage * 100}%`,
            y: [0, -20, 0], // Jumping effect
          }}
          transition={{ 
            left: { type: 'spring', stiffness: 100, damping: 20 },
            y: { duration: 0.5, times: [0, 0.5, 1], ease: "easeOut" }
          }}
          className="absolute -top-10 -translate-x-1/2 flex flex-col items-center"
        >
          {/* Little Ball */}
          <div className="w-6 h-6 bg-[#6366f1] rounded-full shadow-lg border-2 border-white flex items-center justify-center">
            <div className="w-1 h-1 bg-white rounded-full animate-pulse" />
          </div>
          {/* Pointer */}
          <div className="w-0.5 h-4 bg-[#6366f1] mt-0.5" />
          {/* Current BMI Label */}
          <div className="bg-white px-2 py-0.5 rounded border border-gray-200 shadow-sm text-[10px] font-bold whitespace-nowrap mt-1">
            {bmi.toFixed(1)}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
