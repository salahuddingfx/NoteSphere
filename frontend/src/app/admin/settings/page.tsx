"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { motion } from "framer-motion";
import { Settings, Save, ShieldCheck, Zap, Globe, Mail, Loader2, AlertTriangle, RefreshCw } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import CustomSelect from "@/components/ui/CustomSelect";

interface AIModel {
  id: string;
  name: string;
}

interface SystemSettings {
  platformName: string;
  maintenanceMode: boolean;
  allowUploads: boolean;
  aiFeatureEnabled: boolean;
  contactEmail: string;
  activeModel: string;
}

export default function AdminSettingsPage() {
  const { showToast } = useToast();
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [models, setModels] = useState<AIModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchSettings = async () => {
    try {
      const { data } = await api.get("/admin/settings");
      setSettings(data.settings);
    } catch (err) {
      console.error("Failed to fetch settings", err);
    }
  };

  const fetchModels = async () => {
    setSyncing(true);
    try {
      const { data } = await api.get("/admin/ai-models");
      setModels(data.models);
    } catch (err: any) {
      console.error("Failed to fetch AI models", err);
      const errorMessage = err.response?.data?.error || err.response?.data?.message || "Failed to sync with OpenRouter";
      showToast(errorMessage, "error");
    } finally {
      setSyncing(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      await Promise.all([fetchSettings(), fetchModels()]);
      setLoading(false);
    };
    init();
  }, []);

  const handleSave = async () => {

    if (!settings) return;
    setSaving(true);
    try {
      await api.patch("/admin/settings", settings);
      showToast("Settings updated successfully!", "success");
    } catch (err) {
      console.error("Failed to update settings", err);
      showToast("Failed to update settings.", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
    </div>
  );

  if (!settings) return null;

  return (
    <div className="space-y-12 max-w-4xl">
      <header className="flex items-end justify-between">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter">System Configuration</h1>
          <p className="text-zinc-500 mt-1">Control global platform behavior and AI engine settings.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-indigo-600 text-white text-xs font-black uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-500/20 active:scale-95 disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Changes
        </button>
      </header>

      <div className="grid gap-8">
        {/* General Settings */}
        <section className="rounded-[2.5rem] border border-white/5 bg-white/5 p-10 backdrop-blur-xl">
           <h2 className="text-lg font-bold text-white mb-8 flex items-center gap-3">
             <Globe className="w-5 h-5 text-blue-400" />
             General Settings
           </h2>
           
           <div className="grid gap-8 md:grid-cols-2">
              <div className="space-y-3">
                 <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Platform Name</label>
                 <input 
                  type="text" 
                  value={settings.platformName}
                  onChange={(e) => setSettings({...settings, platformName: e.target.value})}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none transition-all"
                 />
              </div>
              <div className="space-y-3">
                 <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Support Email</label>
                 <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                    <input 
                      type="email" 
                      value={settings.contactEmail}
                      onChange={(e) => setSettings({...settings, contactEmail: e.target.value})}
                      className="w-full bg-black/40 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:border-indigo-500 outline-none transition-all"
                    />
                 </div>
              </div>
           </div>
        </section>

        {/* AI Engine Settings */}
        <section className="rounded-[2.5rem] border border-white/5 bg-white/5 p-10 backdrop-blur-xl">
           <h2 className="text-lg font-bold text-white mb-8 flex items-center gap-3">
             <Zap className="w-5 h-5 text-yellow-400" />
             AI Engine Configuration
           </h2>
           
           <div className="space-y-8">
              <div className="flex items-center justify-between p-6 rounded-2xl bg-black/40 border border-white/5">
                 <div>
                    <p className="text-sm font-bold text-white">Enable AI Summarization</p>
                    <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest mt-1">Automatic note bullet points generation</p>
                 </div>
                 <button 
                  onClick={() => setSettings({...settings, aiFeatureEnabled: !settings.aiFeatureEnabled})}
                  className={`w-14 h-8 rounded-full transition-all relative ${settings.aiFeatureEnabled ? 'bg-indigo-600' : 'bg-zinc-800'}`}
                 >
                    <motion.div 
                      animate={{ x: settings.aiFeatureEnabled ? 24 : 4 }}
                      className="w-6 h-6 bg-white rounded-full absolute top-1"
                    />
                 </button>
              </div>

              <div className="space-y-4">
                  <div className="flex items-center justify-between">
                     <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Active Model (OpenRouter)</label>
                     <button 
                      onClick={fetchModels}
                      disabled={syncing}
                      className="flex items-center gap-2 text-[8px] font-black uppercase tracking-widest text-indigo-400 hover:text-indigo-300 transition-colors disabled:opacity-50"
                     >
                        <RefreshCw className={`w-3 h-3 ${syncing ? 'animate-spin' : ''}`} />
                        Sync Free Models
                     </button>
                  </div>

                  <CustomSelect 
                    placeholder="Select a free AI model"
                    value={settings.activeModel}
                    onChange={(val) => setSettings({...settings, activeModel: val})}
                    options={models.map(m => ({ value: m.id, label: m.name }))}
                  />
                  
                  {settings.activeModel && (
                    <p className="text-[10px] text-zinc-600 font-black uppercase tracking-tighter">
                      Current: <span className="text-zinc-400">{settings.activeModel}</span>
                    </p>
                  )}
              </div>
           </div>
        </section>


        {/* Security & Access */}
        <section className="rounded-[2.5rem] border border-white/5 bg-white/5 p-10 backdrop-blur-xl">
           <h2 className="text-lg font-bold text-white mb-8 flex items-center gap-3">
             <ShieldCheck className="w-5 h-5 text-emerald-400" />
             Security & Access
           </h2>
           
           <div className="grid gap-6">
              <div className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-black/20">
                 <div className="flex items-center gap-4">
                    <AlertTriangle className={`w-5 h-5 ${settings.maintenanceMode ? 'text-red-500' : 'text-zinc-600'}`} />
                    <p className="text-sm font-bold text-white">Maintenance Mode</p>
                 </div>
                 <button 
                  onClick={() => setSettings({...settings, maintenanceMode: !settings.maintenanceMode})}
                  className={`w-14 h-8 rounded-full transition-all relative ${settings.maintenanceMode ? 'bg-red-600' : 'bg-zinc-800'}`}
                 >
                    <motion.div 
                      animate={{ x: settings.maintenanceMode ? 24 : 4 }}
                      className="w-6 h-6 bg-white rounded-full absolute top-1"
                    />
                 </button>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-black/20">
                 <p className="text-sm font-bold text-white pl-9">Allow Community Uploads</p>
                 <button 
                  onClick={() => setSettings({...settings, allowUploads: !settings.allowUploads})}
                  className={`w-14 h-8 rounded-full transition-all relative ${settings.allowUploads ? 'bg-emerald-600' : 'bg-zinc-800'}`}
                 >
                    <motion.div 
                      animate={{ x: settings.allowUploads ? 24 : 4 }}
                      className="w-6 h-6 bg-white rounded-full absolute top-1"
                    />
                 </button>
              </div>
           </div>
        </section>
      </div>
    </div>
  );
}
