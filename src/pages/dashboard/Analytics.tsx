import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend
} from 'recharts';
import {
  Download,
  Calendar,
  TrendingDown,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  Zap,
  Info,
  Sparkles
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

// Using globals from CDN
const jsPDF = (window as any).jspdf?.jsPDF;
const html2canvas = (window as any).html2canvas;

const monthlyData = [
  { month: 'Jan', transportation: 400, energy: 240, food: 200, waste: 100 },
  { month: 'Feb', transportation: 300, energy: 139, food: 221, waste: 90 },
  { month: 'Mar', transportation: 200, energy: 980, food: 229, waste: 110 },
  { month: 'Apr', transportation: 278, energy: 390, food: 200, waste: 80 },
  { month: 'May', transportation: 189, energy: 480, food: 218, waste: 70 },
  { month: 'Jun', transportation: 239, energy: 380, food: 250, waste: 90 },
];

const categoryData = [
  { name: 'Transportation', value: 45, color: '#3b82f6' },
  { name: 'Energy', value: 30, color: '#eab308' },
  { name: 'Food', value: 15, color: '#f97316' },
  { name: 'Waste', value: 10, color: '#22c55e' },
];

const forecastData = [
  { month: 'Jun', actual: 239, forecast: 239 },
  { month: 'Jul', actual: null, forecast: 220 },
  { month: 'Aug', actual: null, forecast: 210 },
  { month: 'Sep', actual: null, forecast: 195 },
];

const Analytics = () => {
  const [flightHours, setFlightHours] = React.useState(24);
  const [meatlessMeals, setMeatlessMeals] = React.useState(3);
  const [tempOffset, setTempOffset] = React.useState(0);

  const [dynamicForecast, setDynamicForecast] = React.useState(forecastData);

  React.useEffect(() => {
    // Logic to calculate impact
    const flightImpact = (flightHours - 24) * 5; // 5kg per hour
    const dietImpact = (meatlessMeals - 3) * -2; // -2kg per meal
    const tempImpact = tempOffset * 10; // 10kg per degree

    const totalImpact = flightImpact + dietImpact + tempImpact;

    const newForecast = forecastData.map(d => {
      if (d.actual === null) {
        return { ...d, forecast: (d.forecast || 0) + totalImpact };
      }
      return d;
    });
    setDynamicForecast(newForecast);
  }, [flightHours, meatlessMeals, tempOffset]);

  const exportPDF = async () => {
    const element = document.getElementById('analytics-content');
    if (!element || !html2canvas || !jsPDF) {
      console.error('Export dependencies not loaded');
      return;
    }

    try {
      const canvas = await html2canvas(element, {
        backgroundColor: '#09090b',
        scale: 2,
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('EcoSense-Report.pdf');
    } catch (error) {
      console.error('PDF Export Error:', error);
    }
  };

  return (
    <div className="space-y-8 pb-10" id="analytics-content">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Advanced Analytics</h1>
          <p className="text-muted-foreground mt-1">Deep dive into your environmental impact data.</p>
        </div>
        <div className="flex gap-2">
           <Button variant="outline" size="sm">
             <Calendar className="mr-2 h-4 w-4" />
             Last 6 Months
           </Button>
           <Button variant="primary" size="sm" onClick={exportPDF}>
             <Download className="mr-2 h-4 w-4" />
             Export PDF Report
           </Button>
        </div>
      </header>

      {/* Top Level KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <Card variant="glass" className="border-l-4 border-l-primary">
            <div className="flex justify-between items-start">
               <div>
                  <p className="text-sm font-medium text-muted-foreground uppercase">Average Intensity</p>
                  <p className="text-3xl font-bold mt-1">14.2 <span className="text-sm font-normal text-muted-foreground">kg/day</span></p>
               </div>
               <TrendingDown className="text-primary h-5 w-5" />
            </div>
         </Card>
         <Card variant="glass" className="border-l-4 border-l-yellow-500">
            <div className="flex justify-between items-start">
               <div>
                  <p className="text-sm font-medium text-muted-foreground uppercase">Primary Driver</p>
                  <p className="text-3xl font-bold mt-1">Flights</p>
               </div>
               <BarChart3 className="text-yellow-500 h-5 w-5" />
            </div>
         </Card>
         <Card variant="glass" className="border-l-4 border-l-blue-500">
            <div className="flex justify-between items-start">
               <div>
                  <p className="text-sm font-medium text-muted-foreground uppercase">Reduction Target</p>
                  <p className="text-3xl font-bold mt-1">65%</p>
               </div>
               <Activity className="text-blue-500 h-5 w-5" />
            </div>
         </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Cumulative Emissions Bar Chart */}
        <Card variant="glass" role="region" aria-label="Emissions by Category Bar Chart">
          <h3 className="text-lg font-bold mb-6">Emissions by Category</h3>
          <div className="h-[350px] w-full" aria-label="Bar chart showing emissions for transportation, energy, food, and waste over the last 6 months">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} accessibilityLayer>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="month" stroke="#ffffff40" tickLine={false} axisLine={false} />
                <YAxis stroke="#ffffff40" tickLine={false} axisLine={false} />
                <Tooltip
                   contentStyle={{ backgroundColor: '#18181b', border: '1px solid #3f3f46', borderRadius: '12px' }}
                />
                <Legend iconType="circle" />
                <Bar dataKey="transportation" fill="#3b82f6" radius={[4, 4, 0, 0]} stackId="a" />
                <Bar dataKey="energy" fill="#eab308" radius={[4, 4, 0, 0]} stackId="a" />
                <Bar dataKey="food" fill="#f97316" radius={[4, 4, 0, 0]} stackId="a" />
                <Bar dataKey="waste" fill="#22c55e" radius={[4, 4, 0, 0]} stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Breakdown Pie Chart */}
        <Card variant="glass" role="region" aria-label="Total Impact Distribution Pie Chart">
          <h3 className="text-lg font-bold mb-6">Total Impact Distribution</h3>
          <div className="h-[350px] w-full flex items-center justify-center" aria-label="Pie chart showing percentage distribution of impact categories">
             <ResponsiveContainer width="100%" height="100%">
                <PieChart accessibilityLayer>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                     contentStyle={{ backgroundColor: '#18181b', border: '1px solid #3f3f46', borderRadius: '12px' }}
                  />
                  <Legend />
                </PieChart>
             </ResponsiveContainer>
          </div>
        </Card>

        {/* Predictive Forecasting Line Chart */}
        <Card variant="glass" className="lg:col-span-2" role="region" aria-label="Predictive Sustainability Forecast Chart">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold">Predictive Sustainability Forecasting</h3>
            <div className="flex items-center text-xs text-primary font-bold">
               <Sparkles className="h-3 w-3 mr-1" aria-hidden="true" />
               AI POWERED
            </div>
          </div>
          <div className="h-[350px] w-full" aria-label="Line chart showing actual emissions versus AI predicted future emissions">
             <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dynamicForecast} accessibilityLayer>
                   <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                   <XAxis dataKey="month" stroke="#ffffff40" tickLine={false} axisLine={false} />
                   <YAxis stroke="#ffffff40" tickLine={false} axisLine={false} />
                   <Tooltip
                     contentStyle={{ backgroundColor: '#18181b', border: '1px solid #3f3f46', borderRadius: '12px' }}
                   />
                   <Legend />
                   <Line
                     type="monotone"
                     dataKey="actual"
                     stroke="#22c55e"
                     strokeWidth={3}
                     dot={{ r: 4, fill: '#22c55e' }}
                     name="Actual Emissions"
                   />
                   <Line
                     type="monotone"
                     dataKey="forecast"
                     stroke="#22c55e"
                     strokeDasharray="5 5"
                     strokeWidth={2}
                     name="AI Forecast"
                   />
                </LineChart>
             </ResponsiveContainer>
          </div>
          <div className="mt-6 p-4 rounded-2xl bg-primary/5 border border-primary/10 flex items-start gap-3">
             <Info className="text-primary h-5 w-5 mt-0.5" />
             <p className="text-sm text-muted-foreground leading-relaxed">
               Our AI models predict a <span className="text-white font-medium">{(12 - (tempOffset * 2)).toFixed(1)}% reduction</span> in your emissions over the next 3 months based on your current engagement with recommended challenges.
             </p>
          </div>
        </Card>

        {/* What-If Interactive Sandbox */}
        <Card variant="glass" className="lg:col-span-2 border-t-4 border-t-primary">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <Zap className="text-primary h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Eco-Impact Sandbox</h3>
              <p className="text-sm text-muted-foreground">Simulate lifestyle changes to see your future forecast shift.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="flex justify-between">
                <label className="text-sm font-medium">Flight Hours / Year</label>
                <span className="text-primary font-bold">{flightHours}h</span>
              </div>
              <input
                type="range"
                className="w-full accent-primary"
                min="0" max="100"
                value={flightHours}
                onChange={(e) => setFlightHours(parseInt(e.target.value))}
              />
              <p className="text-[10px] text-muted-foreground">Adjust to see impact of travel choices.</p>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between">
                <label className="text-sm font-medium">Meatless Meals / Week</label>
                <span className="text-primary font-bold">{meatlessMeals}</span>
              </div>
              <input
                type="range"
                className="w-full accent-primary"
                min="0" max="21"
                value={meatlessMeals}
                onChange={(e) => setMeatlessMeals(parseInt(e.target.value))}
              />
              <p className="text-[10px] text-muted-foreground">Switching meals reduces agricultural footprint.</p>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between">
                <label className="text-sm font-medium">Home Temp Offset</label>
                <span className="text-primary font-bold">{tempOffset > 0 ? `+${tempOffset}` : tempOffset}°C</span>
              </div>
              <input
                type="range"
                className="w-full accent-primary"
                min="-5" max="5"
                value={tempOffset}
                onChange={(e) => setTempOffset(parseInt(e.target.value))}
              />
              <p className="text-[10px] text-muted-foreground">Lowering thermostat reduces energy usage.</p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="text-center">
                <p className="text-[10px] text-muted-foreground uppercase font-bold">Projected Saving</p>
                <p className="text-2xl font-bold text-primary">
                  {Math.abs((flightHours - 24) * 5 + (meatlessMeals - 3) * -2 + tempOffset * 10).toFixed(0)}kg
                </p>
              </div>
              <div className="h-8 w-px bg-white/10 hidden md:block" />
              <div className="text-center">
                <p className="text-[10px] text-muted-foreground uppercase font-bold">New Score</p>
                <p className="text-2xl font-bold text-white">88/100</p>
              </div>
            </div>
            <Button size="sm" className="w-full md:w-auto">Commit to these changes</Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
