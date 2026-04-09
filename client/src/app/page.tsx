"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Activity, Zap, AlertTriangle, TrendingUp, Copy, Check, 
  Flame, Skull, Lightbulb, RefreshCw 
} from "lucide-react";
import axios from "axios";

const API_URL = "https://reality-check-mcp-8eqi.onrender.com/api";

export default function Home() {
  const [idea, setIdea] = useState("");
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [resultData, setResultData] = useState<any>(null);
  const [activeMode, setActiveMode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleAction = async (action: string) => {
    if (!idea.trim()) return;
    
    setLoadingAction(action);
    setResultData(null);
    setActiveMode(action);
    
    try {
      const response = await axios.post(`${API_URL}/${action}`, { idea });
      setResultData(response.data);
    } catch (error) {
      console.error("Error fetching analysis:", error);
      setResultData({ error: "Failed to connect to the brutal reality engine." });
    } finally {
      setLoadingAction(null);
    }
  };

  const copyToClipboard = () => {
    if (!resultData) return;
    navigator.clipboard.writeText(JSON.stringify(resultData, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderContent = () => {
    if (resultData?.error) {
      return (
        <div className="text-red-400 p-4 border border-red-500/30 rounded-lg bg-red-900/20 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5" />
          {resultData.error}
        </div>
      );
    }

    if (!resultData) return null;

    switch (activeMode) {
      case 'analyze':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Activity className="w-6 h-6 text-blue-400" /> Analysis Results
              </h2>
              <div className="flex items-center gap-4">
                <div className="text-sm text-gray-400">Viability Score</div>
                <div className={`text-3xl font-black \${resultData.viability_score > 70 ? 'text-green-400' : resultData.viability_score > 40 ? 'text-yellow-400' : 'text-red-400'}`}>
                  {resultData.viability_score}/100
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                <h3 className="font-semibold text-blue-300 mb-2 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" /> Summary
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">{resultData.summary}</p>
              </div>
              <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                <h3 className="font-semibold text-purple-300 mb-2 flex items-center gap-2">
                  <Activity className="w-4 h-4" /> Market
                </h3>
                <div className="space-y-2 text-sm text-gray-300">
                  <p><strong className="text-gray-400">Competition:</strong> {resultData.competition}</p>
                  <p><strong className="text-gray-400">Uniqueness:</strong> {resultData.uniqueness}</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-red-900/10 rounded-xl border border-red-500/20">
              <h3 className="font-semibold text-red-400 mb-3 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" /> Critical Risks
              </h3>
              <ul className="list-disc pl-5 space-y-1 text-sm text-gray-300">
                {resultData.risks?.map((risk: string, i: number) => (
                  <li key={i}>{risk}</li>
                ))}
              </ul>
            </div>
          </div>
        );

      case 'break':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-rose-400 flex items-center gap-2">
              <Skull className="w-6 h-6" /> Breaking Points
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-rose-900/20 rounded-xl border border-rose-500/20">
                <h3 className="font-semibold text-rose-300 mb-3">Failure Reasons</h3>
                <ul className="list-disc pl-5 space-y-2 text-sm text-gray-300">
                  {resultData.failure_reasons?.map((item: string, i: number) => <li key={i}>{item}</li>)}
                </ul>
              </div>
              <div className="p-4 bg-orange-900/20 rounded-xl border border-orange-500/20">
                <h3 className="font-semibold text-orange-300 mb-3">Wrong Assumptions</h3>
                <ul className="list-disc pl-5 space-y-2 text-sm text-gray-300">
                  {resultData.wrong_assumptions?.map((item: string, i: number) => <li key={i}>{item}</li>)}
                </ul>
              </div>
              <div className="p-4 bg-yellow-900/20 rounded-xl border border-yellow-500/20">
                <h3 className="font-semibold text-yellow-300 mb-3">Edge Cases</h3>
                <ul className="list-disc pl-5 space-y-2 text-sm text-gray-300">
                  {resultData.edge_cases?.map((item: string, i: number) => <li key={i}>{item}</li>)}
                </ul>
              </div>
            </div>
          </div>
        );

      case 'improve':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-emerald-400 flex items-center gap-2">
              <Lightbulb className="w-6 h-6" /> Improved Version
            </h2>
            
            <div className="p-5 bg-emerald-900/20 rounded-xl border border-emerald-500/30">
              <p className="text-gray-200 leading-relaxed">{resultData.improved_version}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-teal-300 text-sm uppercase tracking-wider">Niche</h3>
                    <p className="text-sm text-gray-300 mt-1">{resultData.niche}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-teal-300 text-sm uppercase tracking-wider">Monetization</h3>
                    <p className="text-sm text-gray-300 mt-1">{resultData.monetization}</p>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                <h3 className="font-semibold text-emerald-300 mb-2">Roadmap</h3>
                <ol className="list-decimal pl-5 space-y-1 text-sm text-gray-300">
                  {resultData.roadmap?.map((step: string, i: number) => (
                    <li key={i} className="pl-1">{step}</li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        );

      case 'roast':
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-orange-500 flex items-center gap-2">
                <Flame className="w-7 h-7 animate-pulse text-red-500" /> The Roast
              </h2>
            </div>
            <div className="p-8 bg-gradient-to-br from-red-900/20 to-orange-900/20 rounded-xl border border-orange-500/30 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Flame className="w-32 h-32 text-orange-500" />
              </div>
              <p className="text-xl text-gray-200 leading-relaxed relative z-10 italic">
                &quot;{resultData.roast}&quot;
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <main className="min-h-screen p-6 md:p-12 lg:p-24 relative z-10 max-w-6xl mx-auto flex flex-col gap-12">
      
      {/* Header Info */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4 text-center max-w-2xl mx-auto"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-4">
          <Zap className="w-4 h-4" /> AI-Powered Vibe Check
        </div>
        <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 tracking-tight pb-2">
          RealityCheck
        </h1>
        <p className="text-lg text-gray-400">
          We don&apos;t sugarcoat. Enter your startup idea below and let our contrarian AI agent tear it apart, find the flaws, or roast it to ashes.
        </p>
      </motion.div>

      {/* Input Section */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-6 md:p-8"
      >
        <textarea
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          placeholder="I have an idea for an AI app that tells you when your plants need water..."
          className="w-full h-32 md:h-40 glass-input resize-none text-lg"
        />
        
        <div className="mt-6 flex flex-wrap gap-4 justify-center">
          <button 
            onClick={() => handleAction('analyze')}
            disabled={!idea.trim() || !!loadingAction}
            className="glass-button primary-btn flex-1 min-w-[140px]"
          >
            <Activity className="w-4 h-4" /> Analyze
          </button>
          
          <button 
            onClick={() => handleAction('break')}
            disabled={!idea.trim() || !!loadingAction}
            className="glass-button break-btn flex-1 min-w-[140px]"
          >
            <Skull className="w-4 h-4" /> Break It
          </button>
          
          <button 
            onClick={() => handleAction('improve')}
            disabled={!idea.trim() || !!loadingAction}
            className="glass-button improve-btn flex-1 min-w-[140px]"
          >
            <Lightbulb className="w-4 h-4" /> Improve
          </button>
          
          <button 
            onClick={() => handleAction('roast')}
            disabled={!idea.trim() || !!loadingAction}
            className="glass-button roast-btn flex-1 min-w-[140px]"
          >
            <Flame className="w-4 h-4" /> Roast Me 🔥
          </button>
        </div>
      </motion.div>

      {/* Results Section */}
      <AnimatePresence mode="wait">
        {loadingAction ? (
          <motion.div 
            key="loader"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col items-center justify-center p-12 gap-6 glass-card"
          >
            <RefreshCw className="w-12 h-12 text-blue-400 animate-spin-slow" />
            <div className="text-xl font-medium text-gray-300">
              {loadingAction === 'roast' ? 'Sharpening knives...' : 
               loadingAction === 'break' ? 'Finding every edge case...' :
               'Analyzing brutally...'}
            </div>
          </motion.div>
        ) : resultData ? (
          <motion.div 
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6 md:p-8 relative"
          >
            <button 
              onClick={copyToClipboard}
              className="absolute top-6 right-6 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-gray-400 border border-white/10"
              title="Copy JSON Result"
            >
              {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
            </button>
            <div className="pt-2 pr-10">
              {renderContent()}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

    </main>
  );
}
