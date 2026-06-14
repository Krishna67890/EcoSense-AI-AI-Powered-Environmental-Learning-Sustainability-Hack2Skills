import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Twitter, MessageSquare, Linkedin, Download, Share2 } from 'lucide-react';
import Button from './ui/Button';
import ImpactCard from './ImpactCard';

interface SocialExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: {
    reduction: number;
    trees: number;
    score: number;
    rank: string;
  };
  userName: string;
  milestoneTitle?: string;
}

const SocialExportModal: React.FC<SocialExportModalProps> = ({
  isOpen,
  onClose,
  stats,
  userName,
  milestoneTitle = "Sustainability Milestone"
}) => {
  const shareText = `🌍 Just reached a new milestone on EcoSense AI: ${milestoneTitle}! Reduced my footprint by ${stats.reduction}kg CO2e. Join me in the green revolution! #EcoSenseAI #Sustainability`;

  const socialLinks = [
    {
      name: 'Twitter',
      icon: Twitter,
      color: 'bg-[#1DA1F2]',
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      color: 'bg-[#0077b5]',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.origin)}`
    },
    {
      name: 'WhatsApp',
      icon: MessageSquare,
      color: 'bg-[#25D366]',
      href: `https://wa.me/?text=${encodeURIComponent(shareText)}`
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/90 backdrop-blur-md"
          />

          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-4xl bg-[#111] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col md:flex-row"
          >
            <button
              onClick={onClose}
              className="absolute top-6 right-6 z-20 p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Left Side: Preview */}
            <div className="md:w-1/2 p-8 bg-black/40 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-white/10">
              <div className="mb-6 text-center">
                <span className="text-[10px] font-mono text-primary uppercase tracking-widest">Preview Card</span>
                <h3 className="text-xl font-bold mt-1">{milestoneTitle}</h3>
              </div>
              <div className="scale-[0.85] md:scale-90 lg:scale-100 origin-center">
                <ImpactCard stats={stats} userName={userName} />
              </div>
            </div>

            {/* Right Side: Options */}
            <div className="md:w-1/2 p-8 flex flex-col justify-center">
              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-2">Share your impact</h3>
                <p className="text-muted-foreground text-sm">
                  Your progress inspires others. Share your digital twin's milestone to the community.
                </p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  {socialLinks.map((social) => (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all group"
                    >
                      <div className={`p-3 rounded-xl ${social.color} text-white group-hover:scale-110 transition-transform`}>
                        <social.icon size={20} />
                      </div>
                      <span className="text-[10px] font-medium text-muted-foreground uppercase">{social.name}</span>
                    </a>
                  ))}
                </div>

                <div className="pt-4 space-y-3">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                    <p className="text-xs text-muted-foreground mb-2 font-mono uppercase">Copy Link</p>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        readOnly
                        value={window.location.origin}
                        className="flex-1 bg-transparent text-sm font-mono focus:outline-none"
                      />
                      <Button variant="glass" size="sm" onClick={() => {
                        navigator.clipboard.writeText(window.location.origin);
                        alert('Link copied!');
                      }}>
                        Copy
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-auto pt-8">
                <p className="text-[10px] text-muted-foreground text-center italic">
                  "The greatest threat to our planet is the belief that someone else will save it."
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SocialExportModal;
