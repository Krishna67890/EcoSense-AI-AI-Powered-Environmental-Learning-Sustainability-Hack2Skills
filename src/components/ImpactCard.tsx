import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Share2, Download, Leaf, Globe, Award, Zap } from 'lucide-react';
import Button from './ui/Button';

interface ImpactCardProps {
  stats: {
    reduction: number;
    trees: number;
    score: number;
    rank: string;
  };
  userName: string;
}

const ImpactCard: React.FC<ImpactCardProps> = ({ stats, userName }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const exportAsImage = async () => {
    if (!cardRef.current) return;

    try {
      // Access html2canvas from window (loaded via CDN in index.html)
      const html2canvas = (window as any).html2canvas;

      if (!html2canvas) {
        throw new Error('html2canvas library not loaded from CDN');
      }

      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#0a0a0a',
        scale: 2,
        logging: false,
        useCORS: true
      });

      const link = document.createElement('a');
      link.download = `ecosense-impact-${userName.toLowerCase().replace(/\s+/g, '-')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Failed to export image:', err);
      alert('The sharing feature is still loading. Please try again in 5 seconds.');
    }
  };

  const shareOnSocial = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My EcoSense AI Impact',
          text: `I've reduced my carbon footprint by ${stats.reduction}kg CO2e this year! Check out your impact on EcoSense AI.`,
          url: window.location.origin
        });
      } catch (err) {
        // Silent fail for share cancellation
      }
    } else {
      exportAsImage();
    }
  };

  return (
    <div className="space-y-4">
      <div
        ref={cardRef}
        className="w-full max-w-md mx-auto aspect-[4/5] relative overflow-hidden rounded-[2.5rem] bg-[#0a0a0a] border border-white/10 p-8 flex flex-col justify-between shadow-2xl"
      >
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[100px] -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px] -ml-32 -mb-32" />

        <div className="relative z-10">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                <span className="text-[10px] font-mono tracking-widest text-primary uppercase">EcoSense AI Verified</span>
              </div>
              <h2 className="text-2xl font-black text-white leading-tight uppercase tracking-tighter">Impact<br />Report</h2>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
              <Leaf className="text-primary h-6 w-6" />
            </div>
          </div>

          <div className="mt-10 space-y-6">
            <div>
              <p className="text-[10px] font-mono text-muted-foreground uppercase mb-1">Impact Contributor</p>
              <p className="text-xl font-bold text-white">{userName}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-3xl bg-white/5 border border-white/10">
                <p className="text-[10px] font-mono text-muted-foreground uppercase mb-1">CO2 Offset</p>
                <div className="flex items-baseline space-x-1">
                  <span className="text-2xl font-black text-primary">{stats.reduction}</span>
                  <span className="text-[10px] font-bold text-primary/60">KG</span>
                </div>
              </div>
              <div className="p-4 rounded-3xl bg-white/5 border border-white/10">
                <p className="text-[10px] font-mono text-muted-foreground uppercase mb-1">Eco Score</p>
                <div className="flex items-baseline space-x-1">
                  <span className="text-2xl font-black text-blue-400">{stats.score}</span>
                  <span className="text-[10px] font-bold text-blue-400/60">/100</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10">
          <div className="p-6 rounded-[2rem] bg-gradient-to-br from-primary/20 to-transparent border border-primary/20 mb-6">
            <div className="flex items-center space-x-4">
              <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-black">
                <Award size={20} />
              </div>
              <div>
                <p className="text-[10px] font-mono text-primary uppercase font-bold">Current Standing</p>
                <p className="text-sm font-bold text-white">{stats.rank}</p>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-end">
            <div>
              <p className="text-[8px] font-mono text-muted-foreground uppercase">Digital Twin Simulation ID</p>
              <p className="text-[10px] font-mono text-white/40">ES-2024-X92-ALPHA</p>
            </div>
            <div className="flex items-center space-x-2 opacity-50">
              <Zap size={12} className="text-yellow-400" />
              <Globe size={12} className="text-blue-400" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-3 max-w-md mx-auto">
        <Button onClick={shareOnSocial} className="flex-1 rounded-2xl h-12">
          <Share2 className="mr-2 h-4 w-4" />
          Share Impact
        </Button>
        <Button onClick={exportAsImage} variant="outline" className="flex-1 rounded-2xl h-12">
          <Download className="mr-2 h-4 w-4" />
          Save Image
        </Button>
      </div>
    </div>
  );
};

export default ImpactCard;
