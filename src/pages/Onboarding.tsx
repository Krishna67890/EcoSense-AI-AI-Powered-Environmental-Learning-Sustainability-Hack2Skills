import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Car, Zap, Utensils, Plane, Trash2, Droplets, Users,
  ArrowRight, ArrowLeft, CheckCircle2, Loader2
} from 'lucide-react';
import Button from '../components/ui/Button';
import { getFirestore } from '../lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { HabitData } from '../types';

const steps = [
  {
    id: 'transport',
    title: 'Transportation',
    description: 'How do you get around on a daily basis?',
    icon: Car,
  },
  {
    id: 'energy',
    title: 'Energy Usage',
    description: 'Tell us about your home energy consumption.',
    icon: Zap,
  },
  {
    id: 'diet',
    title: 'Dietary Habits',
    description: 'What does your typical diet look like?',
    icon: Utensils,
  },
  {
    id: 'travel',
    title: 'Air Travel',
    description: 'How often do you take flights per year?',
    icon: Plane,
  },
  {
    id: 'waste',
    title: 'Waste & Water',
    description: 'Let\'s look at your consumption patterns.',
    icon: Trash2,
  }
];

const Onboarding = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<HabitData>({
    transportation: { dailyDistance: 20, type: 'car' },
    energy: { monthlyUsage: 250, renewableSource: false },
    diet: 'balanced',
    flights: 2,
    waste: 'average',
    water: 150,
    householdSize: 2,
  });

  const next = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const prev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    const db = getFirestore();
    if (!currentUser || !db) return;
    setLoading(true);
    try {
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, {
        habits: data,
        onboardingCompleted: true,
        sustainabilityScore: calculateInitialScore(data)
      });
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const calculateInitialScore = (habits: HabitData) => {
    // Simplified scoring logic for demo
    let score = 70;
    if (habits.transportation.type === 'car') score -= 10;
    if (habits.diet === 'meat-heavy') score -= 10;
    if (habits.energy.renewableSource) score += 15;
    return Math.min(Math.max(score, 0), 100);
  };

  const renderStep = () => {
    const step = steps[currentStep];
    switch (step.id) {
      case 'transport':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {['car', 'ev', 'bus', 'train', 'bike', 'walk'].map((type) => (
                <button
                  key={type}
                  onClick={() => setData({ ...data, transportation: { ...data.transportation, type: type as any } })}
                  className={`p-4 rounded-2xl border-2 transition-all ${
                    data.transportation.type === type
                    ? 'border-primary bg-primary/10'
                    : 'border-white/5 bg-white/5 hover:border-white/20'
                  }`}
                >
                  <p className="capitalize font-medium">{type}</p>
                </button>
              ))}
            </div>
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Daily Distance (km)</label>
              <input
                type="range" min="0" max="200" step="5"
                value={data.transportation.dailyDistance}
                onChange={(e) => setData({...data, transportation: {...data.transportation, dailyDistance: parseInt(e.target.value)}})}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <p className="text-right text-xl font-bold">{data.transportation.dailyDistance} km</p>
            </div>
          </div>
        );
      case 'energy':
        return (
          <div className="space-y-8">
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Monthly Electricity Usage (kWh)</label>
              <input
                type="range" min="50" max="1000" step="50"
                value={data.energy.monthlyUsage}
                onChange={(e) => setData({...data, energy: {...data.energy, monthlyUsage: parseInt(e.target.value)}})}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <p className="text-right text-xl font-bold">{data.energy.monthlyUsage} kWh</p>
            </div>
            <div
              onClick={() => setData({...data, energy: {...data.energy, renewableSource: !data.energy.renewableSource}})}
              className={`p-6 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                data.energy.renewableSource ? 'border-primary bg-primary/10' : 'border-white/5 bg-white/5'
              }`}
            >
              <div>
                <p className="font-bold">Renewable Energy</p>
                <p className="text-sm text-muted-foreground">My home is powered by solar or wind</p>
              </div>
              {data.energy.renewableSource && <CheckCircle2 className="text-primary h-6 w-6" />}
            </div>
          </div>
        );
      case 'diet':
        return (
          <div className="grid gap-4">
            {['meat-heavy', 'balanced', 'vegetarian', 'vegan'].map((diet) => (
              <button
                key={diet}
                onClick={() => setData({ ...data, diet: diet as any })}
                className={`p-6 rounded-2xl border-2 text-left transition-all ${
                  data.diet === diet ? 'border-primary bg-primary/10' : 'border-white/5 bg-white/5'
                }`}
              >
                <p className="capitalize font-bold">{diet.replace('-', ' ')}</p>
              </button>
            ))}
          </div>
        );
      case 'travel':
        return (
          <div className="space-y-6">
             <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Annual Flights</label>
              <input
                type="range" min="0" max="20" step="1"
                value={data.flights}
                onChange={(e) => setData({...data, flights: parseInt(e.target.value)})}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <p className="text-right text-xl font-bold">{data.flights} flights/year</p>
            </div>
          </div>
        );
      case 'waste':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
               {['low', 'average', 'high'].map((lvl) => (
                 <button
                   key={lvl}
                   onClick={() => setData({...data, waste: lvl as any})}
                   className={`p-4 rounded-xl border-2 capitalize font-medium ${
                     data.waste === lvl ? 'border-primary bg-primary/10' : 'border-white/5 bg-white/5'
                   }`}
                 >
                   {lvl} Waste
                 </button>
               ))}
            </div>
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Daily Water Usage (Liters)</label>
              <input
                type="range" min="50" max="500" step="10"
                value={data.water}
                onChange={(e) => setData({...data, water: parseInt(e.target.value)})}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <p className="text-right text-xl font-bold">{data.water} L/day</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#09090b]">
      <main className="w-full max-w-2xl">
        {/* Progress Bar */}
        <div className="mb-12" role="progressbar" aria-valuenow={((currentStep + 1) / steps.length) * 100} aria-valuemin={0} aria-valuemax={100}>
          <div className="flex justify-between mb-4">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-full mx-1 transition-all duration-500 ${
                  i <= currentStep ? 'bg-primary' : 'bg-white/10'
                }`}
              />
            ))}
          </div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold">
            Step {currentStep + 1} of {steps.length}
          </p>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="glass-dark p-8 md:p-12 rounded-[2.5rem] border border-white/10 shadow-2xl"
          >
            <div className="mb-8">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-primary/10 mb-6">
                {React.createElement(steps[currentStep].icon, { className: 'h-6 w-6 text-primary', 'aria-hidden': 'true' })}
              </div>
              <h1 className="text-3xl font-bold mb-2">{steps[currentStep].title}</h1>
              <p className="text-muted-foreground">{steps[currentStep].description}</p>
            </div>

            <div className="min-h-[300px]">
              {renderStep()}
            </div>

            <div className="mt-12 flex justify-between">
              <Button
                variant="ghost"
                onClick={prev}
                disabled={currentStep === 0}
                className={currentStep === 0 ? 'invisible' : ''}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button
                onClick={next}
                disabled={loading}
                className="min-w-[140px]"
              >
                {loading ? <Loader2 className="animate-spin" /> : (
                  <>
                    {currentStep === steps.length - 1 ? 'Finish Setup' : 'Continue'}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Onboarding;
