import React, { useState, useRef } from 'react';
import {
  Camera,
  Upload,
  Search,
  Zap,
  Leaf,
  AlertTriangle,
  CheckCircle2,
  BarChart3,
  RefreshCw,
  FileText,
  ShoppingBag,
  ArrowRight
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { analyzeProductImage, analyzeElectricityBill } from '../../lib/gemini';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';

type ScannerMode = 'product' | 'bill';

const EcoScanner = () => {
  const [mode, setMode] = useState<ScannerMode>('product');
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setImage(base64);
        setError(null);
        setResult(null);
        // Automatically trigger scan for seamless UX
        triggerAutoScan(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerAutoScan = async (imgData: string) => {
    setIsAnalyzing(true);
    setError(null);
    try {
      if (mode === 'product') {
        const data = await analyzeProductImage(imgData);
        setResult(data);
      } else {
        const data = await analyzeElectricityBill(imgData);
        setResult(data);
      }
    } catch (err) {
      console.error("Auto-scan error:", err);
      setError('Analysis failed. Please ensure the image is clear and contains a barcode, ingredients list, or bill details.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleScan = async () => {
    if (!image) return;
    triggerAutoScan(image);
  };


  const reset = () => {
    setImage(null);
    setResult(null);
    setError(null);
  };

  return (
    <div className="space-y-8 pb-10">
      <header>
        <h1 className="text-3xl font-bold tracking-tight flex items-center">
          <Camera className="mr-3 text-primary" />
          AI Eco Scanner
        </h1>
        <p className="text-muted-foreground mt-1">Analyze products and utility bills using advanced AI vision.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input Side */}
        <div className="lg:col-span-5 space-y-6">
          <Card variant="glass">
            <div className="flex p-1 bg-white/5 rounded-xl mb-6">
              <button
                onClick={() => { setMode('product'); reset(); }}
                className={cn(
                  "flex-1 flex items-center justify-center py-2 rounded-lg text-sm font-medium transition-all",
                  mode === 'product' ? "bg-primary text-black shadow-lg" : "text-muted-foreground hover:text-white"
                )}
              >
                <ShoppingBag size={16} className="mr-2" />
                Product
              </button>
              <button
                onClick={() => { setMode('bill'); reset(); }}
                className={cn(
                  "flex-1 flex items-center justify-center py-2 rounded-lg text-sm font-medium transition-all",
                  mode === 'bill' ? "bg-primary text-black shadow-lg" : "text-muted-foreground hover:text-white"
                )}
              >
                <FileText size={16} className="mr-2" />
                Energy Bill
              </button>
            </div>

            <div
              onClick={() => !image && fileInputRef.current?.click()}
              className={cn(
                "relative aspect-square rounded-2xl border-2 border-dashed flex flex-col items-center justify-center transition-all overflow-hidden",
                image ? "border-primary/50" : "border-white/10 hover:border-primary/30 cursor-pointer"
              )}
            >
              {image ? (
                <>
                  <img src={image} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                      Change Image
                    </Button>
                  </div>
                </>
              ) : (
                <div className="text-center p-6">
                  <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
                    <Upload size={32} />
                  </div>
                  <p className="font-bold">Upload an Image</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Drag and drop or click to browse<br />
                    {mode === 'product' ? 'Product labels or barcodes' : 'Electricity bills (JPEG/PNG)'}
                  </p>
                </div>
              )}
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />

            <div className="mt-6 flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={reset}
                disabled={!image || isAnalyzing}
              >
                <RefreshCw size={18} className="mr-2" />
                Clear
              </Button>
              <Button
                variant="primary"
                className="flex-1"
                onClick={handleScan}
                disabled={!image || isAnalyzing}
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw size={18} className="mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Search size={18} className="mr-2" />
                    Start Scan
                  </>
                )}
              </Button>
            </div>
          </Card>

          <Card variant="outline" className="border-primary/20 bg-primary/5">
             <div className="flex gap-4">
               <Zap className="text-primary h-6 w-6 shrink-0" />
               <div className="text-sm">
                 <p className="font-bold text-primary">Pro Tip</p>
                 <p className="text-muted-foreground leading-relaxed">
                   {mode === 'product'
                    ? "Capture the ingredients list and barcode for the most accurate carbon footprint estimation."
                    : "Ensure your monthly kWh usage and billing period are clearly visible for a precise audit."}
                 </p>
               </div>
             </div>
          </Card>
        </div>

        {/* Results Side */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            {!result ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-white/5 rounded-3xl"
              >
                <div className="h-20 w-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
                   <BarChart3 size={40} className="text-muted-foreground/30" />
                </div>
                <h3 className="text-xl font-bold text-muted-foreground/50">Awaiting Analysis</h3>
                <p className="text-sm text-muted-foreground/40 mt-2 max-w-xs">
                  Upload and scan an item to see its detailed environmental impact report.
                </p>
              </motion.div>
            ) : mode === 'product' ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <Card variant="glass" className="border-l-4 border-l-primary">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="text-2xl font-bold">{result.productName}</h2>
                      <p className="text-muted-foreground">Product Sustainability Audit</p>
                    </div>
                    <div className={cn(
                      "h-16 w-16 rounded-2xl flex flex-col items-center justify-center border-2",
                      result.rating === 'A' ? "bg-green-500/20 border-green-500 text-green-500" :
                      result.rating === 'B' ? "bg-blue-500/20 border-blue-500 text-blue-500" :
                      result.rating === 'C' ? "bg-yellow-500/20 border-yellow-500 text-yellow-500" :
                      "bg-red-500/20 border-red-500 text-red-500"
                    )}>
                      <span className="text-[10px] font-bold uppercase">Grade</span>
                      <span className="text-2xl font-black">{result.rating}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                     <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                        <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">Carbon Footprint</p>
                        <p className="text-2xl font-bold text-primary">{result.footprint} <span className="text-sm font-normal text-muted-foreground">kg CO2e</span></p>
                     </div>
                     <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                        <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">Impact Level</p>
                        <p className="text-2xl font-bold">{result.footprint > 5 ? 'High' : result.footprint > 1 ? 'Medium' : 'Low'}</p>
                     </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-bold flex items-center">
                      <CheckCircle2 className="text-green-500 mr-2 h-4 w-4" />
                      Pros
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                       {result.pros.map((pro: string, i: number) => (
                         <div key={i} className="text-xs p-2 rounded-lg bg-green-500/5 text-green-200/70 border border-green-500/10 italic">
                           • {pro}
                         </div>
                       ))}
                    </div>

                    <h4 className="font-bold flex items-center pt-2">
                      <AlertTriangle className="text-yellow-500 mr-2 h-4 w-4" />
                      Cons
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                       {result.cons.map((con: string, i: number) => (
                         <div key={i} className="text-xs p-2 rounded-lg bg-yellow-500/5 text-yellow-200/70 border border-yellow-500/10 italic">
                           • {con}
                         </div>
                       ))}
                    </div>
                  </div>
                </Card>

                <Card variant="glass">
                  <h3 className="text-lg font-bold mb-4">Sustainable Alternatives</h3>
                  <div className="space-y-3">
                    {result.alternatives.map((alt: string, i: number) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 group hover:border-primary/30 transition-all">
                        <span className="text-sm">{alt}</span>
                        <ArrowRight size={14} className="text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <Card variant="glass" className="border-l-4 border-l-yellow-500">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="text-2xl font-bold">Energy Audit Result</h2>
                      <p className="text-muted-foreground">Period: {result.period}</p>
                    </div>
                    <div className="h-12 w-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                       <Zap className="text-yellow-500" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                     <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                        <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">Usage</p>
                        <p className="text-2xl font-bold text-yellow-500">{result.usageKwh} <span className="text-sm font-normal text-muted-foreground">kWh</span></p>
                     </div>
                     <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                        <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">Cost</p>
                        <p className="text-2xl font-bold">{result.currency}{result.cost}</p>
                     </div>
                     <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                        <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">Emissions</p>
                        <p className="text-2xl font-bold text-red-500">{result.emissions} <span className="text-sm font-normal text-muted-foreground">kg</span></p>
                     </div>
                  </div>

                  <div className="space-y-4">
                     <h4 className="font-bold">Coach Analysis</h4>
                     <p className="text-sm text-muted-foreground leading-relaxed p-4 bg-white/5 rounded-xl italic">
                       "{result.analysis}"
                     </p>
                  </div>
                </Card>

                <Card variant="glass">
                  <h3 className="text-lg font-bold mb-4 flex items-center">
                    <Leaf className="mr-2 h-5 w-5 text-primary" />
                    Recommended Savings
                  </h3>
                  <div className="space-y-3">
                    {result.tips.map((tip: string, i: number) => (
                      <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-primary/5 border border-primary/10">
                        <div className="h-6 w-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                          {i + 1}
                        </div>
                        <p className="text-sm text-muted-foreground">{tip}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default EcoScanner;
