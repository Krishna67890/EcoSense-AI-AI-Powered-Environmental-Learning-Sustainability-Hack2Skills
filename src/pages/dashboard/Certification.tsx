import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Award,
  Download,
  Share2,
  CheckCircle2,
  Lock,
  FileText,
  Star,
  ExternalLink,
  ShieldCheck,
  Medal,
  Zap,
  Printer,
  ChevronRight,
  Leaf,
  Loader2
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { cn } from '../../lib/utils';
import { useAuth } from '../../contexts/AuthContext';
import { MODULES, LABS } from '../../lib/data';
import { generateCertificate } from '../../lib/utils/certificate';
import { useNotifications } from '../../contexts/NotificationContext';

const Certification = () => {
  const { userProfile } = useAuth();
  const { addNotification } = useNotifications();
  const [selectedCert, setSelectedCert] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const certifications = [
    {
      id: 'eco-specialist',
      name: 'Eco-Specialist Certification',
      issuer: 'EcoSense AI Academy',
      description: 'Foundational certification for individuals who have mastered basic sustainability concepts and carbon tracking.',
      requirements: [
        { label: 'Complete 3 Learning Modules', current: Object.values(userProfile?.moduleProgress || {}).filter(v => v === 100).length, goal: 3 },
        { label: 'Perform 1 Carbon Audit', current: (userProfile?.totalTasksCompleted || 0) > 0 ? 1 : 0, goal: 1 },
        { label: 'Reach Level 3', current: userProfile?.level || 1, goal: 3 }
      ],
      icon: Award,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10'
    },
    {
      id: 'climate-warrior',
      name: 'Climate Warrior Professional',
      issuer: 'EcoSense AI Academy',
      description: 'Advanced certification focused on renewable energy, waste management, and practical carbon reduction strategies.',
      requirements: [
        { label: 'Complete 6 Learning Modules', current: Object.values(userProfile?.moduleProgress || {}).filter(v => v === 100).length, goal: 6 },
        { label: 'Complete 4 Interactive Labs', current: Object.values(userProfile?.labProgress || {}).filter(v => v === 100).length, goal: 4 },
        { label: 'Reach Level 10', current: userProfile?.level || 1, goal: 10 }
      ],
      icon: ShieldCheck,
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      id: 'planet-guardian',
      name: 'Planet Guardian Elite',
      issuer: 'EcoSense AI Academy',
      description: 'The highest honor in the EcoSense ecosystem. awarded to those who have demonstrated exceptional commitment to a net-zero lifestyle.',
      requirements: [
        { label: `Complete All ${MODULES.length} Modules`, current: Object.values(userProfile?.moduleProgress || {}).filter(v => v === 100).length, goal: MODULES.length },
        { label: `Complete All ${LABS.length} Labs`, current: Object.values(userProfile?.labProgress || {}).filter(v => v === 100).length, goal: LABS.length },
        { label: 'Reach Level 20', current: userProfile?.level || 1, goal: 20 }
      ],
      icon: Star,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10'
    }
  ];

  const isUnlocked = (cert: any) => {
    return cert.requirements.every((req: any) => req.current >= req.goal);
  };

  const handleDownload = async (cert: any) => {
    setIsGenerating(true);
    // Ensure the modal is rendered for a moment to capture it,
    // or we can just use the hidden template approach.
    // For now, we'll trigger it from the modal itself for better reliability.
    const date = new Date().toLocaleDateString();
    const id = `EC-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // We set selectedCert to show the modal which contains the template
    setSelectedCert({ ...cert, date, id });

    // Small delay to ensure DOM is ready
    setTimeout(async () => {
      const success = await generateCertificate(
        userProfile?.fullName || 'Eco Warrior',
        date,
        id
      );

      if (success) {
        addNotification({
          message: `Successfully generated ${cert.name}!`,
          type: 'success'
        });
      }
      setIsGenerating(false);
    }, 500);
  };

  return (
    <div className="space-y-8 pb-20">
      <header>
        <h1 className="text-3xl font-bold tracking-tight flex items-center">
          <Medal className="mr-3 text-primary" />
          Certification Center
        </h1>
        <p className="text-muted-foreground text-sm">Validate your sustainability expertise with verifiable digital credentials.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {certifications.map((cert) => {
          const unlocked = isUnlocked(cert);
          return (
            <Card
              key={cert.id}
              variant="glass"
              className={cn(
                "p-8 flex flex-col h-full relative overflow-hidden transition-all",
                unlocked ? "border-primary/50 shadow-[0_0_30px_rgba(34,197,94,0.1)]" : "opacity-70"
              )}
            >
              {!unlocked && (
                <div className="absolute top-4 right-4">
                  <Lock size={16} className="text-muted-foreground" />
                </div>
              )}

              <div className={cn("h-16 w-16 rounded-2xl flex items-center justify-center mb-6", cert.bgColor)}>
                <cert.icon className={cn("h-10 w-10", cert.color)} />
              </div>

              <h3 className="text-xl font-bold mb-2 leading-tight">{cert.name}</h3>
              <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mb-4">Issued by {cert.issuer}</p>
              <p className="text-xs text-muted-foreground mb-8 leading-relaxed flex-1">
                {cert.description}
              </p>

              <div className="space-y-4 mb-8">
                {cert.requirements.map((req, i) => {
                  const progress = Math.min(100, (req.current / req.goal) * 100);
                  return (
                    <div key={i}>
                      <div className="flex justify-between items-center text-[10px] font-black uppercase mb-1.5">
                        <span className="text-muted-foreground">{req.label}</span>
                        <span className={req.current >= req.goal ? 'text-primary' : 'text-white'}>{req.current}/{req.goal}</span>
                      </div>
                      <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          className={cn("h-full", req.current >= req.goal ? 'bg-primary' : 'bg-white/20')}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {unlocked ? (
                <div className="flex gap-2">
                  <Button
                    onClick={() => setSelectedCert(cert)}
                    className="flex-1 text-[10px] font-black uppercase tracking-widest"
                  >
                    View & Print
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleDownload(cert)}
                    disabled={isGenerating}
                    className="h-10 w-10 border-white/10"
                  >
                    {isGenerating ? <Loader2 className="animate-spin" size={18} /> : <Download size={18} />}
                  </Button>
                </div>
              ) : (
                <Button disabled className="w-full text-[10px] font-black uppercase tracking-widest bg-white/5 text-muted-foreground border-white/5">
                  Locked
                </Button>
              )}
            </Card>
          );
        })}
      </div>

      {/* Verification Widget */}
      <Card variant="glass" className="p-8 border-dashed border-primary/30 flex flex-col md:flex-row items-center justify-between gap-8 bg-primary/5">
        <div className="flex items-center gap-6">
           <div className="h-16 w-16 rounded-full bg-black flex items-center justify-center border-4 border-primary shadow-[0_0_20px_rgba(34,197,94,0.3)]">
              <ShieldCheck className="text-primary h-8 w-8" />
           </div>
           <div>
              <h3 className="text-xl font-bold">Verifiable Credentials</h3>
              <p className="text-sm text-muted-foreground">All certificates include a unique QR code and ID that can be verified by employers or institutions on our public registry.</p>
           </div>
        </div>
        <Button variant="outline" className="h-12 px-8 text-[10px] font-black uppercase tracking-widest border-primary/20 text-primary">
           Access Registry
        </Button>
      </Card>

      {/* Certificate Viewer Modal */}
      <AnimatePresence>
        {selectedCert && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
             <motion.div
               initial={{ scale: 0.9, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               exit={{ scale: 0.9, opacity: 0 }}
               className="w-full max-w-4xl bg-white text-black p-12 rounded-sm shadow-2xl relative overflow-hidden"
               style={{ aspectRatio: '1.414/1' }}
             >
                {/* Certificate Content */}
                <div id="certificate-template" className="border-8 border-double border-primary/30 h-full p-8 flex flex-col items-center text-center bg-white">
                   <div className="flex items-center gap-3 mb-12">
                      <Leaf className="text-primary h-12 w-12" />
                      <span className="text-3xl font-serif font-black tracking-tighter">EcoSense AI</span>
                   </div>

                   <p className="text-xl font-serif italic mb-4">This is to certify that</p>
                   <h2 className="text-6xl font-serif font-black mb-8 border-b-2 border-black/10 px-12 pb-2">{userProfile?.fullName || 'Eco Warrior'}</h2>
                   <p className="text-xl font-serif italic mb-12">has successfully completed the requirements for</p>

                   <h3 className="text-4xl font-serif font-black mb-2 text-primary">{selectedCert.name}</h3>
                   <p className="text-sm font-black uppercase tracking-[0.3em] text-muted-foreground mb-16">Accredited by EcoSense Global Committee</p>

                   <div className="mt-auto w-full flex justify-between items-end px-12">
                      <div className="text-left">
                         <div className="w-48 border-b border-black mb-2"></div>
                         <p className="text-xs font-bold uppercase">Krishna Patil</p>
                         <p className="text-[10px] text-muted-foreground">Lead Architect, EcoSense AI</p>
                      </div>
                      <div className="h-24 w-24 bg-white border border-black/5 p-2">
                         <div className="h-full w-full bg-black/5 flex items-center justify-center">
                            <span className="text-[8px] font-black text-center px-1">VERIFIED QR<br/>{selectedCert.id || 'VALID'}</span>
                         </div>
                      </div>
                      <div className="text-right">
                         <p className="text-xs font-bold uppercase">Issue Date</p>
                         <p className="text-[10px] text-muted-foreground">{selectedCert.date || new Date().toLocaleDateString()}</p>
                         <p className="text-[10px] font-bold mt-2">ID: {selectedCert.id || 'EC-GENERIC'}</p>
                      </div>
                   </div>
                </div>

                <div className="absolute bottom-6 right-6 flex gap-2 no-print">
                   <Button
                    variant="primary"
                    onClick={async () => {
                      setIsGenerating(true);
                      await generateCertificate(userProfile?.fullName || 'Eco Warrior', selectedCert.date, selectedCert.id);
                      setIsGenerating(false);
                    }}
                    className="h-10 px-6 gap-2"
                   >
                      {isGenerating ? <Loader2 className="animate-spin" size={16} /> : <Download size={16} />}
                      Download PDF
                   </Button>
                   <Button variant="outline" onClick={() => setSelectedCert(null)} className="h-10 px-6 border-black text-black hover:bg-black hover:text-white">
                      Close
                   </Button>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Certification;
