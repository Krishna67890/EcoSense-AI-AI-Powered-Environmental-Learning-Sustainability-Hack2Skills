import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  MessageSquare,
  Send,
  Sparkles,
  Bot,
  User,
  Loader2,
  Trash2,
  Info,
  Zap,
  Github,
  Linkedin,
  Mic,
  MicOff,
  Volume2,
  VolumeX
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { generateActionPlan, getModel } from '../../lib/gemini';
import { useAuth } from '../../contexts/AuthContext';
import { getFirestore } from '../../lib/firebase';
import { doc, updateDoc, arrayUnion, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../lib/utils';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const PROBLEM_STATEMENT = "[Challenge 3] Carbon Footprint Awareness Platform: Design a solution that helps individuals understand, track, and reduce their carbon footprint through simple actions and personalized insights.";

const EcoCoach = () => {
  const { userProfile, currentUser } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: `Welcome to EcoSense AI, ${userProfile?.fullName?.split(' ')[0] || 'Explorer'}. I am your specialized Sustainability Intelligence Coach. \n\nOur Mission: ${PROBLEM_STATEMENT}\n\nI've analyzed your profile (Eco Progress: ${userProfile?.ecoProgress || 0}%). How can I help you reduce your carbon footprint with personalized insights today?`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Voice Input Setup
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        triggerAIAction(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      speechRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleSpeaking = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      const lastAssistantMessage = [...messages].reverse().find(m => m.role === 'assistant');
      if (lastAssistantMessage) {
        speak(lastAssistantMessage.content);
      }
    }
  };

  const handleQuickAction = (text: string) => {
    setInput(text);
    triggerAIAction(text);
  };

  const triggerAIAction = async (overrideInput?: string) => {
    const queryStr = overrideInput || input;
    if (!queryStr.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: queryStr,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!overrideInput) setInput('');
    setIsLoading(true);

    try {
      // Robust history filtering for Gemini:
      // 1. Must start with 'user'
      // 2. Must alternate 'user'/'model'
      // 3. Must end with 'model' (assistant) for sendMessage to work as the next 'user' turn
      const rawHistory = messages.map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      }));

      const validHistory: any[] = [];
      for (const msg of rawHistory) {
        if (validHistory.length === 0) {
          if (msg.role === 'user') validHistory.push(msg);
        } else {
          const lastRole = validHistory[validHistory.length - 1].role;
          if (msg.role !== lastRole) {
            validHistory.push(msg);
          }
        }
      }

      // If the last message is 'user', remove it so the chat session is ready for the new sendMessage turn
      if (validHistory.length > 0 && validHistory[validHistory.length - 1].role === 'user') {
        validHistory.pop();
      }

      const model = getModel();
      if (!model) {
        throw new Error("AI Model not initialized. Check your API key.");
      }

      const chat = model.startChat({
        history: validHistory,
        generationConfig: {
          maxOutputTokens: 2000,
          temperature: 0.8,
        },
      });

      const prompt = `System Instruction: You are the "EcoSense AI Coach", a world-class sustainability expert.
      You are in EXPERT MODE.

      MISSION: ${PROBLEM_STATEMENT}
      USER PROFILE: ${JSON.stringify(userProfile)}

      KNOWLEDGE DOMAIN:
      - Carbon Footprints, Climate Change, Renewable Energy, Transportation, Recycling, Sustainable Living, Waste Management, Water Conservation, Green Technology, Environmental Science.

      SPECIALIZED TOPIC GUIDELINES (If query matches):
      - Sustainable travel: Focus on rail vs air, carbon intensity, and slow travel.
      - Meat consumption: Focus on methane emissions, water usage, and land degradation.
      - Carbon offsetting: Explain verification standards (Gold Standard/VCS) and "additionality".
      - Digital footprint: Focus on data centers, email storage, and streaming quality impact.
      - Energy efficiency: Focus on thermal bridging, heat pumps, and insulation R-values.
      - Composting: Focus on nitrogen/carbon balance (greens/browns) and anaerobic vs aerobic.
      - Solar ROI: Discuss feed-in tariffs, degradation rates, and payback periods (typically 6-10 years).
      - Plastic-free: Focus on circular economy and microplastics.
      - Fast Fashion: Focus on textile waste, water pollution in dyeing, and lifecycle of synthetics.
      - EV Myths: Discuss battery lifecycle, charging source mix, and energy density.

      CRITICAL RULES:
      - ALWAYS provide unique, data-driven, and highly specialized answers for different topics.
      - NEVER give generic "one-size-fits-all" advice.
      - Minimum response length: 150–400 words.

      RESPONSE FORMAT:
      1. Direct Answer: Provide a comprehensive and expert response.
      2. Why It Matters: Explain the significance of the topic.
      3. Environmental Impact: Detail the specific ecological consequences or benefits.
      4. Action Steps: Provide a bulleted list of 4-5 concrete steps the user can take.
      5. Bonus Tip: Offer a unique, "pro-level" sustainability hack.

      ADVANCED FEATURES TO INTEGRATE:
      - Use the USER PROFILE to personalize advice (e.g., mention their diet: ${userProfile?.dietType}, transport: ${userProfile?.primaryTransport}).
      - If relevant, include carbon footprint calculations or data points.
      - Suggest follow-up questions to keep the conversation going.

      USER QUERY: ${queryStr}`;

      const result = await chat.sendMessage(prompt);
      const response = await result.response;
      const text = response.text().replace(/\* /g, "• ");

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: text,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      speak(text);

      // New Expert Mode Features: Auto-trigger Plan Generation if requested
      const lowerInput = queryStr.toLowerCase();
      const isGeneratingPlan = lowerInput.includes("generate") && lowerInput.includes("plan");

      if (lowerInput.includes("show") && lowerInput.includes("footprint")) {
        navigate('/dashboard/analytics');
      } else if (lowerInput.includes("open") && lowerInput.includes("leaderboard")) {
        navigate('/dashboard/leaderboard');
      } else if (lowerInput.includes("create") && (lowerInput.includes("plan") || lowerInput.includes("roadmap"))) {
        navigate('/dashboard/plan');
      }

      if (isGeneratingPlan) {
        if (currentUser && userProfile) {
          const db = getFirestore();
          if (!db) return;
          try {
            const newPlan = await generateActionPlan(userProfile);
            const planRef = doc(db, 'actionPlans', currentUser.uid);
            await setDoc(planRef, {
              plan: newPlan,
              generatedAt: new Date().toISOString()
            });

            const syncMsg: Message = {
              id: Date.now().toString(),
              role: 'assistant',
              content: "✨ I have successfully synchronized your new Action Plan. You can view it in the Action Plan tab now!",
              timestamp: new Date()
            };
            setMessages(prev => [...prev, syncMsg]);
            speak(syncMsg.content);
          } catch (e) {
            console.error("Coach plan sync error:", e);
          }
        }
      }

      if (queryStr.toLowerCase().includes("reset") && currentUser) {
        const db = getFirestore();
        if (db) {
          const planRef = doc(db, 'actionPlans', currentUser.uid);
          // We can't easily import initialPlan here without moving it to a common file,
          // but for now we'll just delete the custom plan to revert to default if the component handles it.
          // Or we just notify.
          await updateDoc(doc(db, 'users', currentUser.uid), {
            notifications: arrayUnion({
              id: Date.now().toString(),
              message: "Your custom sustainability plan has been cleared.",
              type: 'info',
              timestamp: new Date().toISOString()
            })
          });
        }
      }

    } catch (error) {
      console.error('Gemini Error:', error);
      // Human-like fallback response for specific topics
      let fallbackContent = "I'm having a brief moment of reflection, but here's what I know about that: ";
      const lowerQuery = queryStr.toLowerCase();

      if (lowerQuery.includes("flight") || lowerQuery.includes("travel")) {
        fallbackContent += "Flying creates significant carbon emissions. You can reduce your impact by choosing direct flights, using sustainable aviation options when available, or offsetting emissions through verified programs. A round-trip domestic flight can produce hundreds of kilograms of CO₂, so even small travel changes like train travel for shorter distances make a measurable difference.";
      } else if (lowerQuery.includes("food") || lowerQuery.includes("diet") || lowerQuery.includes("meat")) {
        fallbackContent += "Our dietary choices have a huge impact. Reducing meat consumption, especially beef, can lower your food-related carbon footprint by up to 50%. Opting for local, seasonal produce also reduces 'food miles' and supports sustainable agriculture.";
      } else if (lowerQuery.includes("energy") || lowerQuery.includes("electricity")) {
        fallbackContent += "To reduce home energy emissions, consider switching to LED bulbs, which use 75% less energy, or using smart thermostats. Unplugging 'vampire' electronics and washing clothes in cold water are also simple, effective steps.";
      } else {
        fallbackContent = "That's a great question about sustainability. While I'm currently optimizing my connection to the latest environmental data, I recommend focusing on the 'Big Three': how you move (transport), what you eat (diet), and how you power your home (energy). Every small action adds up to a significant collective impact!";
      }

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: fallbackContent,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      speak(fallbackContent);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col gap-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center">
            <Sparkles className="mr-3 text-primary animate-pulse" />
            AI Eco Coach
          </h1>
          <p className="text-muted-foreground mt-1 truncate max-w-2xl text-xs md:text-sm">{PROBLEM_STATEMENT}</p>
        </div>
        <div className="flex gap-2">
           <a href="https://github.com/Krishna67890" target="_blank" rel="noreferrer" className="hidden md:block">
             <Button variant="outline" size="icon"><Github size={18} /></Button>
           </a>
           <a href="https://www.linkedin.com/in/krishna-patil-rajput-b66b03340" target="_blank" rel="noreferrer" className="hidden md:block">
             <Button variant="outline" size="icon"><Linkedin size={18} /></Button>
           </a>
           <Button variant="outline" size="sm" onClick={() => setMessages([messages[0]])}>
             <Trash2 className="mr-2 h-4 w-4" />
             Reset Chat
           </Button>
        </div>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0">
        <Card variant="glass" className="flex-1 flex flex-col p-0 overflow-hidden relative border-white/10">
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
            {messages.map((message) => (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex max-w-[85%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'} items-end gap-3`}>
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.role === 'user' ? 'bg-primary text-black' : 'bg-white/10'
                  }`}>
                    {message.role === 'user' ? <User size={16} /> : <Bot size={16} className="text-primary" />}
                  </div>
                  <div className={`p-4 rounded-2xl ${
                    message.role === 'user'
                      ? 'bg-primary text-black font-medium rounded-br-none'
                      : 'glass border-white/5 rounded-bl-none shadow-xl'
                  }`}>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                    <p className="text-[10px] mt-2 opacity-50">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-center gap-3 glass p-4 rounded-2xl border-white/5">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  <span className="text-xs text-muted-foreground">Generating sustainable insights...</span>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 bg-white/5 border-t border-white/10">
            <div className="relative flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && triggerAIAction()}
                  placeholder="Ask about carbon reduction or travel..."
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-6 pr-16 focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  <button
                    onClick={toggleListening}
                    className={cn(
                      "h-10 w-10 rounded-lg flex items-center justify-center transition-all",
                      isListening ? "bg-red-500 text-white animate-pulse" : "bg-white/5 text-muted-foreground hover:bg-white/10"
                    )}
                  >
                    {isListening ? <MicOff size={18} /> : <Mic size={18} />}
                  </button>
                  <button
                    onClick={() => triggerAIAction()}
                    disabled={isLoading || !input.trim()}
                    className="h-10 w-10 rounded-lg bg-primary text-black flex items-center justify-center hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100"
                  >
                    <Send size={18} />
                  </button>
                </div>
              </div>
              <button
                onClick={toggleSpeaking}
                className={cn(
                  "h-14 w-14 rounded-xl flex items-center justify-center transition-all border",
                  isSpeaking ? "bg-primary/20 border-primary text-primary" : "bg-white/5 border-white/10 text-muted-foreground hover:bg-white/10"
                )}
                title={isSpeaking ? "Stop Speaking" : "Read Last Response"}
              >
                {isSpeaking ? <VolumeX size={24} /> : <Volume2 size={24} />}
              </button>
            </div>
          </div>
        </Card>

        <div className="w-full lg:w-80 space-y-4">
          <Card variant="glass" className="border-l-4 border-l-primary">
            <h3 className="text-sm font-bold flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" />
              Quick Actions
            </h3>
            <div className="grid gap-2 mt-4">
               <Button size="sm" variant="primary" className="w-full text-[10px]" onClick={() => handleQuickAction("Apply my current AI hints to the action plan")}>
                 APPLY TO ACTION PLAN
               </Button>
               <Button size="sm" variant="outline" className="w-full text-[10px]" onClick={() => handleQuickAction("Generate a new sustainability plan based on my latest data")}>
                 GENERATE NEW PLAN
               </Button>
               <Button size="sm" variant="outline" className="w-full text-[10px] border-red-500/50 text-red-500" onClick={() => handleQuickAction("Reset all my current goals and start fresh")}>
                 RESET PLAN
               </Button>
            </div>
          </Card>

          <Card variant="glass">
            <h3 className="text-sm font-bold mb-4 flex items-center">
              <Info className="mr-2 h-4 w-4 text-primary" />
              Trending Questions
            </h3>
            <div className="space-y-2">
              {[
                "Sustainable travel options",
                "How to track meat consumption?",
                "Carbon offsetting for flights",
                "Reducing digital footprint",
                "Energy efficiency in winter",
                "Composting for beginners",
                "Solar panel ROI calculation",
                "Plastic-free grocery shopping",
                "Fast fashion vs Slow fashion",
                "Electric vehicle range myths"
              ].map((topic) => (
                <button
                  key={topic}
                  onClick={() => handleQuickAction(topic)}
                  className="w-full text-left p-3 rounded-xl bg-white/5 hover:bg-white/10 text-xs transition-colors border border-transparent hover:border-white/10"
                >
                  {topic}
                </button>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EcoCoach;
