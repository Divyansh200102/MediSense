import { useState } from 'react';
import api from '../api';
import Disclaimer from '../components/Disclaimer';
import Spinner from '../components/Spinner';
import { MedicalIllustration } from '../components/MedicalBackground';
import { Utensils, Sun, Coffee, Moon, Cookie, Sparkles, Lightbulb } from 'lucide-react';

const conditionOptions = [
  'Chemotherapy - Nausea Management',
  'Chemotherapy - General Recovery',
  'Post-Surgery Recovery',
  'Breast Cancer Stage 2',
  'Lung Cancer Treatment',
  'Diabetes Management',
  'Typhoid Recovery',
  'General Wellness',
];

const mealConfig = {
  breakfast: { icon: Sun, color: 'text-amber-500', bg: 'bg-amber-50' },
  lunch: { icon: Coffee, color: 'text-blue-500', bg: 'bg-blue-50' },
  dinner: { icon: Moon, color: 'text-indigo-500', bg: 'bg-indigo-50' },
  snack: { icon: Cookie, color: 'text-orange-500', bg: 'bg-orange-50' },
};

const dayGradients = [
  'from-orange-400 to-amber-300',
  'from-rose-400 to-pink-300',
  'from-violet-400 to-purple-300',
];

export default function DietPlan() {
  const [condition, setCondition] = useState('');
  const [customCondition, setCustomCondition] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const finalCondition = condition === 'custom' ? customCondition : condition;
    if (!finalCondition.trim()) return;
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await api.post('/diet-generator', { condition: finalCondition });
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Service unavailable. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const dayKeys = ['day_1', 'day_2', 'day_3'];
  const dayLabels = ['Day 1', 'Day 2', 'Day 3'];

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 relative">
        <MedicalIllustration type="pulse" className="absolute -right-4 -top-6 w-32 h-32 opacity-[0.1] animate-float hidden md:block" />
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center shadow-sm animate-glow-pulse">
          <Utensils className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="section-title">Diet Plan Generator</h2>
          <p className="section-subtitle text-sm">Get a personalized 3-day meal plan based on your condition.</p>
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="card space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-1.5">Select your condition</label>
          <select
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
            className="input-field"
            required
          >
            <option value="">Choose a condition...</option>
            {conditionOptions.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
            <option value="custom">Other (type below)</option>
          </select>
        </div>

        {condition === 'custom' && (
          <div className="animate-slide-down">
            <label className="block text-sm font-semibold text-gray-600 mb-1.5">Describe your condition</label>
            <input
              type="text"
              value={customCondition}
              onChange={(e) => setCustomCondition(e.target.value)}
              className="input-field"
              placeholder="e.g., Post-radiation therapy for throat cancer"
              required
            />
          </div>
        )}

        <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          {loading ? 'Generating...' : 'Generate Meal Plan'}
        </button>
      </form>

      {loading && <Spinner text="Creating your personalized meal plan..." />}

      {error && (
        <div className="bg-red-50 border border-red-200/60 text-red-600 rounded-xl px-4 py-3 text-sm font-medium animate-slide-down">{error}</div>
      )}

      {result && !result.error && (
        <div className="space-y-5 animate-slide-up">
          <h3 className="text-lg font-bold text-gray-900">Your 3-Day Meal Plan</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 stagger-children">
            {dayKeys.map((dayKey, idx) => {
              const day = result[dayKey];
              if (!day) return null;
              return (
                <div key={dayKey} className="card overflow-hidden p-0 card-shimmer">
                  <div className={`bg-gradient-to-r ${dayGradients[idx]} px-5 py-3`}>
                    <h4 className="font-bold text-white text-lg">{dayLabels[idx]}</h4>
                  </div>
                  <div className="p-5 space-y-3.5">
                    {['breakfast', 'lunch', 'dinner', 'snack'].map((meal) => {
                      const mc = mealConfig[meal];
                      const MealIcon = mc.icon;
                      return (
                        <div key={meal} className="flex items-start gap-3">
                          <div className={`w-7 h-7 rounded-lg ${mc.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                            <MealIcon className={`w-3.5 h-3.5 ${mc.color}`} />
                          </div>
                          <div className="min-w-0">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{meal}</span>
                            <p className="text-sm text-gray-700 leading-relaxed">{day[meal] || 'N/A'}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {result.tips && result.tips.length > 0 && (
            <div className="card bg-gradient-to-r from-emerald-50/80 to-teal-50/40 border-emerald-200/40">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="w-4 h-4 text-emerald-600" />
                <h4 className="font-bold text-emerald-700">Nutrition Tips</h4>
              </div>
              <ul className="space-y-2">
                {result.tips.map((tip, i) => (
                  <li key={i} className="text-sm text-gray-700 flex items-start gap-2.5 leading-relaxed">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">{i + 1}</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <Disclaimer />
        </div>
      )}

      {result?.error && (
        <div className="bg-red-50 border border-red-200/60 text-red-600 rounded-xl px-4 py-3 text-sm font-medium">
          {result.error}
          <Disclaimer />
        </div>
      )}
    </div>
  );
}
