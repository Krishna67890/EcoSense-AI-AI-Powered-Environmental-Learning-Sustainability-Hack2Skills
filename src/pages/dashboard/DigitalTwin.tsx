import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Binary,
  Leaf,
  Car,
  Zap,
  Utensils,
  Plane,
  TrendingDown,
  ArrowRight,
  Info,
  History,
  Map as MapIcon,
  Activity,
  Cpu,
  Globe,
  Share2
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import ImpactCard from '../../components/ImpactCard';
import SocialExportModal from '../../components/SocialExportModal';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';

const DigitalTwin = () => {
  const { userProfile, currentUser } = useAuth();
  const { addNotification } = useNotifications();
  const [showExportModal, setShowExportModal] = useState(false);
  const [simulation, setSimulation] = useState({
    ev: false,
    solar: false,
    vegan: false,
    noFlights: false,
    publicTransit: false
  });

  const [impact, setImpact] = useState({
    reduction: 0,
    trees: 0,
    newScore: 0
  });

  const [telemetry, setTelemetry] = useState<any[]>([]);

  useEffect(() => {
    // Generate initial telemetry
    const initialData = Array.from({ length: 20 }, (_, i) => ({
      time: i,
      value: 70 + Math.random() * 10
    }));
    setTelemetry(initialData);

    const interval = setInterval(() => {
      setTelemetry(prev => {
        const last = prev[prev.length - 1];
        const next = {
          time: last.time + 1,
          value: Math.max(0, Math.min(100, last.value + (Math.random() - 0.5) * 5))
        };
        return [...prev.slice(1), next];
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Simulate calculation
    let reduction = 0;
    if (simulation.ev) reduction += 1200;
    if (simulation.solar) reduction += 800;
    if (simulation.vegan) reduction += 600;
    if (simulation.noFlights) reduction += 1500;
    if (simulation.publicTransit) reduction += 400;

    const currentScore = userProfile?.ecoProgress || 78;
    const scoreBoost = Math.floor(reduction / 200);

    setImpact({
      reduction,
      trees: Math.floor(reduction / 20),
      newScore: Math.min(currentScore + scoreBoost, 100)
    });
  }, [simulation, userProfile]);

  const toggleSim = (key: keyof typeof simulation) => {
    setSimulation(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const chartData = [
    { name: 'Current', co2: 5200, fill: '#64748b' },
    { name: 'Simulated', co2: Math.max(500, 5200 - impact.reduction), fill: '#22c55e' }
  ];

  const applyToPlan = () => {
    // Collect active simulations
    const activeSims = Object.entries(simulation)
      .filter(([_, active]) => active)
      .map(([id, _]) => {
        const labels: Record<string, string> = {
          ev: "Transition to Electric Vehicle",
          solar: "Install Home Solar Array",
          vegan: "Adopt Plant-Based Diet",
          noFlights: "Zero Air Travel Commitment",
          publicTransit: "Switch to Public Transit"
        };
        return labels[id] || id;
      });

    if (activeSims.length === 0) {
      alert("Please select at least one simulation parameter first.");
      return;
    }

    activeSims.forEach(title => {
      const event = new CustomEvent('ai-task-push', {
        detail: { title, impact: "High" }
      });
      window.dispatchEvent(event);
    });

    addNotification({
      message: `${activeSims.length} simulated goals have been added to your Action Plan!`,
      type: 'success'
    });
  };

  return (
    <div className="space-y-8 pb-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center">
            <Binary className="mr-3 text-primary" />
            Carbon Digital Twin
          </h1>
          <p className="text-muted-foreground mt-1">Simulate lifestyle changes and visualize your future impact in real-time.</p>
        </div>
        <div className="flex gap-2">
           <div className="flex items-center px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-[10px] text-primary font-mono animate-pulse">
             <Activity className="h-3 w-3 mr-1" />
             LIVE TELEMETRY ACTIVE
           </div>
           <Button
             variant="glass"
             size="sm"
             onClick={() => setShowExportModal(true)}
           >
             <Share2 className="mr-2 h-4 w-4" />
             Share Impact
           </Button>
           <Button variant="outline" size="sm">
             <History className="mr-2 h-4 w-4" />
             History
           </Button>
        </div>
      </header>

      <SocialExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        userName={userProfile?.displayName || currentUser?.email?.split('@')[0] || 'Eco User'}
        stats={{
          reduction: impact.reduction,
          score: impact.newScore,
          trees: impact.trees,
          rank: impact.newScore > 90 ? 'Global Elite Sustainabilist' : 'Regional Climate Leader'
        }}
        milestoneTitle={impact.reduction > 2000 ? "Carbon Negative Visionary" : "Sustainability Architect"}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Simulation & Telemetry */}
        <div className="lg:col-span-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card variant="glass" className="p-4 border-l-4 border-l-blue-500">
               <div className="flex items-center justify-between mb-2">
                 <Cpu className="h-4 w-4 text-blue-400" />
                 <span className="text-[10px] font-mono text-blue-400/50">CPU_ID: 0x82F</span>
               </div>
               <p className="text-xs text-muted-foreground uppercase font-bold">Sync Status</p>
               <p className="text-xl font-mono">99.2%</p>
            </Card>
            <Card variant="glass" className="p-4 border-l-4 border-l-primary">
               <div className="flex items-center justify-between mb-2">
                 <Globe className="h-4 w-4 text-primary" />
                 <span className="text-[10px] font-mono text-primary/50">NODE: GLOBAL_S1</span>
               </div>
               <p className="text-xs text-muted-foreground uppercase font-bold">Grid Carbon Intensity</p>
               <p className="text-xl font-mono">342 g/kWh</p>
            </Card>
            <Card variant="glass" className="p-4 border-l-4 border-l-purple-500">
               <div className="flex items-center justify-between mb-2">
                 <Activity className="h-4 w-4 text-purple-400" />
                 <span className="text-[10px] font-mono text-purple-400/50">LATENCY: 12ms</span>
               </div>
               <p className="text-xs text-muted-foreground uppercase font-bold">Neural Engine</p>
               <p className="text-xl font-mono">ACTIVE</p>
            </Card>
          </div>

          <Card variant="glass" role="region" aria-label="Lifestyle Modification Parameters">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold">Lifestyle Modification Parameters</h3>
              <div className="text-[10px] font-mono text-muted-foreground" aria-hidden="true">ADJUST_PARAMETERS_V1.4</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { id: 'ev', label: 'Electric Vehicle', icon: Car, color: 'text-blue-400', desc: 'Replace ICE with EV' },
                  { id: 'solar', label: 'Solar Panels', icon: Zap, color: 'text-yellow-400', desc: '100% Renewable energy' },
                  { id: 'vegan', label: 'Plant-Based', icon: Utensils, color: 'text-green-400', desc: 'Eliminate animal products' },
                  { id: 'noFlights', label: 'Zero Flights', icon: Plane, color: 'text-purple-400', desc: 'Sustainable travel only' },
                  { id: 'publicTransit', label: 'Public Transit', icon: MapIcon, color: 'text-orange-400', desc: 'Daily commute by rail/bus' }
                ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => toggleSim(item.id as any)}
                  aria-pressed={simulation[item.id as keyof typeof simulation]}
                  aria-label={`${item.label}: ${item.desc}`}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between text-left ${
                    simulation[item.id as keyof typeof simulation]
                    ? 'border-primary bg-primary/10'
                    : 'border-white/5 bg-white/5 hover:border-white/10'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg bg-black/40 ${item.color}`} aria-hidden="true">
                       <item.icon size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-bold">{item.label}</p>
                      <p className="text-[10px] text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                  <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                    simulation[item.id as keyof typeof simulation] ? 'border-primary bg-primary' : 'border-white/20'
                  }`} aria-hidden="true">
                    {simulation[item.id as keyof typeof simulation] && <div className="h-1.5 w-1.5 bg-black rounded-full" />}
                  </div>
                </button>
              ))}
            </div>
          </Card>

          <Card variant="glass" className="h-[250px] relative overflow-hidden" role="region" aria-label="Carbon Twin Telemetry Stream">
             <div className="absolute top-4 left-4 z-10">
                <h4 className="text-sm font-bold flex items-center">
                   <Activity className="mr-2 h-4 w-4 text-primary" aria-hidden="true" />
                   Twin Telemetry Stream
                </h4>
             </div>
             <div className="absolute inset-0 pt-12" aria-label="Real-time telemetry chart showing fluctuating carbon twin data">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={telemetry} accessibilityLayer>
                    <defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#000', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                      itemStyle={{ color: '#22c55e' }}
                      labelStyle={{ display: 'none' }}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#22c55e"
                      fillOpacity={1}
                      fill="url(#colorValue)"
                      isAnimationActive={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
             </div>
          </Card>
        </div>

        {/* Right Column: Comparison & Final Impact */}
        <div className="lg:col-span-4 space-y-6">
          <Card variant="glass" className="relative overflow-hidden flex flex-col justify-center" role="region" aria-label="Simulated Emissions Comparison">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,197,94,0.1),transparent_50%)]" aria-hidden="true" />

            <div className="relative z-10 p-2 text-center">
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-4">Emissions Comparison (kg CO₂e)</p>

              <div className="h-64 w-full" aria-label="Bar chart comparing current emissions vs simulated emissions based on selected parameters">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} accessibilityLayer>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                    <YAxis hide />
                    <Tooltip
                      cursor={{fill: 'rgba(255,255,255,0.05)'}}
                      contentStyle={{ backgroundColor: '#000', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                    />
                    <Bar dataKey="co2" radius={[10, 10, 0, 0]}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between px-4 py-2 bg-white/5 rounded-xl border border-white/10" role="status" aria-label={`Potential Reduction: ${impact.reduction} kg`}>
                  <span className="text-xs text-muted-foreground">Potential Reduction</span>
                  <span className="text-primary font-bold">-{impact.reduction} kg</span>
                </div>
                <div className="flex items-center justify-between px-4 py-2 bg-white/5 rounded-xl border border-white/10" role="status" aria-label={`Future Eco Score: ${impact.newScore} out of 100`}>
                  <span className="text-xs text-muted-foreground">Future Score</span>
                  <span className="text-primary font-bold">{impact.newScore} / 100</span>
                </div>
              </div>

              <div className="pt-8">
                <Button
                  onClick={applyToPlan}
                  className="w-full h-14 text-lg rounded-2xl shadow-lg shadow-primary/20 group"
                >
                  Apply Changes
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          </Card>

          <Card variant="outline" className="border-dashed border-white/20 bg-primary/5">
            <h4 className="text-sm font-bold mb-3 flex items-center">
               <Leaf className="mr-2 h-4 w-4 text-primary" />
               Nature-Based Offset
            </h4>
            <div className="flex items-end space-x-2">
               <span className="text-4xl font-black text-white">{impact.trees}</span>
               <span className="text-sm text-muted-foreground pb-1">mature trees per year</span>
            </div>
            <p className="text-[10px] text-muted-foreground mt-3 leading-relaxed">
              *Calculated based on average sequestration rate of 21kg CO2/year per tree.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DigitalTwin;
