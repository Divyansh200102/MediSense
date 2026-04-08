import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import Disclaimer from '../components/Disclaimer';
import { MedicalIllustration } from '../components/MedicalBackground';
import {
  Stethoscope,
  HeartPulse,
  FileText,
  Utensils,
  Pill,
  History,
  User,
  Edit3,
  Save,
  X,
  ArrowRight,
  Sparkles,
  Activity,
} from 'lucide-react';

const modules = [
  { to: '/symptom-triage', label: 'Symptom Triage', desc: 'Get specialist & urgency recommendations', icon: Stethoscope, gradient: 'from-blue-500 to-cyan-400', bg: 'bg-blue-50', text: 'text-blue-600' },
  { to: '/report-simplifier', label: 'Report Simplifier', desc: 'Translate complex medical reports', icon: FileText, gradient: 'from-emerald-500 to-teal-400', bg: 'bg-emerald-50', text: 'text-emerald-600' },
  { to: '/diet-plan', label: 'Diet Plan', desc: 'Personalized recovery meal plans', icon: Utensils, gradient: 'from-orange-500 to-amber-400', bg: 'bg-orange-50', text: 'text-orange-600' },
  { to: '/drug-checker', label: 'Drug Checker', desc: 'Check medication interactions', icon: Pill, gradient: 'from-rose-500 to-pink-400', bg: 'bg-rose-50', text: 'text-rose-600' },
  { to: '/otc-first-aid', label: 'OTC & First Aid', desc: 'OTC meds for minor symptoms', icon: HeartPulse, gradient: 'from-purple-500 to-violet-400', bg: 'bg-purple-50', text: 'text-purple-600' },
  { to: '/history', label: 'History', desc: 'View past AI consultations', icon: History, gradient: 'from-gray-500 to-slate-400', bg: 'bg-gray-50', text: 'text-gray-600' },
];

export default function Dashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ age: '', primary_condition: '', current_treatments: '', allergies: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('/profile/').then((res) => {
      setProfile(res.data);
      setForm({
        age: res.data.age || '',
        primary_condition: res.data.primary_condition || '',
        current_treatments: res.data.current_treatments || '',
        allergies: res.data.allergies || '',
      });
    }).catch(() => {});
  }, []);

  const saveProfile = async () => {
    setSaving(true);
    try {
      const res = await api.put('/profile/', {
        age: form.age ? parseInt(form.age) : null,
        primary_condition: form.primary_condition,
        current_treatments: form.current_treatments,
        allergies: form.allergies,
      });
      setProfile(res.data);
      setEditing(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-600 via-primary-500 to-accent-500 p-8 lg:p-10 text-white animate-hero-float">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 animate-orb-drift" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4 animate-orb-drift" style={{ animationDelay: '5s' }} />
        {/* Heartbeat line across hero */}
        <svg className="absolute bottom-0 left-0 w-full h-16 opacity-10 pointer-events-none" viewBox="0 0 1200 60" preserveAspectRatio="none">
          <path d="M0,30 L300,30 L340,30 L360,8 L380,52 L400,4 L420,56 L440,30 L480,30 L1200,30" fill="none" stroke="white" strokeWidth="2" className="animate-heartbeat-draw" />
        </svg>
        {/* Medical illustrations */}
        <MedicalIllustration type="heart" className="absolute right-4 top-2 w-40 h-40 opacity-[0.2] animate-float hidden md:block" />
        <MedicalIllustration type="shield" className="absolute right-44 bottom-0 w-28 h-28 opacity-[0.15] animate-slow-spin hidden lg:block" />
        <MedicalIllustration type="capsule" className="absolute left-1/3 -bottom-2 w-24 h-24 opacity-[0.12] animate-hero-float hidden lg:block" />
        <div className="relative z-10 flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-white/70 animate-pulse-soft" />
              <span className="text-sm font-medium text-white/70">Your AI Health Companion</span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight">Welcome back, {user?.username}</h2>
            <p className="text-white/70 mt-2 text-lg">How can we help you today?</p>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <Activity className="w-20 h-20 text-white/10 animate-pulse-soft" strokeWidth={1} />
          </div>
        </div>
      </div>

      {/* Medical Profile Card */}
      <div className="card">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-100 to-primary-50 flex items-center justify-center">
              <User className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Medical Profile</h3>
              <p className="text-xs text-gray-400">Personalize your AI recommendations</p>
            </div>
          </div>
          {!editing ? (
            <button onClick={() => setEditing(true)} className="btn-secondary text-sm flex items-center gap-1.5">
              <Edit3 className="w-4 h-4" /> Edit
            </button>
          ) : (
            <div className="flex gap-2">
              <button onClick={saveProfile} disabled={saving} className="btn-primary text-sm flex items-center gap-1.5">
                <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save'}
              </button>
              <button onClick={() => setEditing(false)} className="btn-secondary text-sm flex items-center gap-1.5">
                <X className="w-4 h-4" /> Cancel
              </button>
            </div>
          )}
        </div>

        {!editing ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ProfileField label="Age" value={profile?.age || 'Not set'} />
            <ProfileField label="Primary Condition" value={profile?.primary_condition || 'Not set'} />
            <ProfileField label="Current Treatments" value={profile?.current_treatments || 'Not set'} />
            <ProfileField label="Allergies" value={profile?.allergies || 'Not set'} />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in">
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1.5">Age</label>
              <input type="number" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} className="input-field" placeholder="e.g. 45" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1.5">Primary Condition</label>
              <input type="text" value={form.primary_condition} onChange={(e) => setForm({ ...form, primary_condition: e.target.value })} className="input-field" placeholder="e.g. Breast Cancer Stage 2" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1.5">Current Treatments</label>
              <input type="text" value={form.current_treatments} onChange={(e) => setForm({ ...form, current_treatments: e.target.value })} className="input-field" placeholder="e.g. Chemotherapy (Paclitaxel)" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1.5">Allergies</label>
              <input type="text" value={form.allergies} onChange={(e) => setForm({ ...form, allergies: e.target.value })} className="input-field" placeholder="e.g. Penicillin, Sulfa" />
            </div>
          </div>
        )}
      </div>

      {/* Module Cards */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger-children">
          {modules.map(({ to, label, desc, icon: Icon, gradient, bg, text }) => (
            <Link key={to} to={to} className="card-hover card-shimmer group cursor-pointer">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-sm group-hover:scale-110 group-hover:shadow-md transition-all duration-300`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-primary-500 group-hover:translate-x-1 transition-all duration-300" />
              </div>
              <h4 className="font-bold text-gray-800 group-hover:text-primary-600 transition-colors">{label}</h4>
              <p className="text-sm text-gray-400 mt-1 leading-relaxed">{desc}</p>
            </Link>
          ))}
        </div>
      </div>

      <Disclaimer />
    </div>
  );
}

function ProfileField({ label, value }) {
  const isEmpty = value === 'Not set';
  return (
    <div className="bg-surface-50/60 rounded-xl p-3.5 border border-gray-100/60">
      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{label}</span>
      <p className={`font-semibold mt-0.5 ${isEmpty ? 'text-gray-300 italic' : 'text-gray-800'}`}>{value}</p>
    </div>
  );
}
