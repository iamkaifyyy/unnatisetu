'use client';

import { useState, useEffect } from 'react';
import { api } from '../../../lib/api';
import { Scheme } from '../../../types';
import {
  Sliders,
  Plus,
  Trash2,
  Save,
  Copy,
  Code,
  CheckCircle2,
  BookOpen,
  Sparkles,
  RefreshCw,
} from 'lucide-react';

export default function SchemeConfigBuilderPage() {
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [selectedScheme, setSelectedScheme] = useState<Scheme | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Builder State
  const [rules, setRules] = useState<any[]>([]);
  const [docs, setDocs] = useState<any[]>([]);
  const [weightage, setWeightage] = useState<any>({
    academicMarksWeight: 50,
    incomeWeight: 30,
    pvtgBonus: 15,
    femaleBonus: 5,
    maxIncomeCap: 600000,
  });

  const [activeTab, setActiveTab] = useState<'rules' | 'docs' | 'weightage' | 'json'>('rules');

  useEffect(() => {
    fetchSchemes();
  }, []);

  const fetchSchemes = async () => {
    try {
      setLoading(true);
      const data = await api.getSchemes();
      if (data?.schemes && data.schemes.length > 0) {
        setSchemes(data.schemes);
        selectScheme(data.schemes[0]);
      }
    } catch (err) {
      console.error('Error fetching schemes:', err);
    } finally {
      setLoading(false);
    }
  };

  const selectScheme = (scheme: Scheme) => {
    setSelectedScheme(scheme);
    const activeConfig = scheme.activeConfig;
    if (activeConfig) {
      setRules(activeConfig.eligibilityRules || []);
      setDocs(activeConfig.requiredDocuments || []);
      setWeightage(activeConfig.scoringWeightage || {
        academicMarksWeight: 50,
        incomeWeight: 30,
        pvtgBonus: 15,
        femaleBonus: 5,
        maxIncomeCap: 600000,
      });
    }
  };

  const addRule = () => {
    const newRule = {
      id: `rule_${Date.now()}`,
      field: 'annualIncome',
      label: 'New Eligibility Rule',
      operator: '<=',
      value: 600000,
      description: 'Enter rule description...',
    };
    setRules([...rules, newRule]);
  };

  const removeRule = (idx: number) => {
    setRules(rules.filter((_, i) => i !== idx));
  };

  const updateRule = (idx: number, key: string, val: any) => {
    const updated = [...rules];
    updated[idx][key] = val;
    setRules(updated);
  };

  const addDoc = () => {
    setDocs([...docs, { type: 'NEW_DOC', name: 'New Certificate', required: true }]);
  };

  const removeDoc = (idx: number) => {
    setDocs(docs.filter((_, i) => i !== idx));
  };

  const handleSaveConfig = async () => {
    if (!selectedScheme) return;
    try {
      setSaving(true);
      const res = await api.saveSchemeConfig(selectedScheme.id, {
        eligibilityRules: rules,
        requiredDocuments: docs,
        scoringWeightage: weightage,
        tieBreakerRules: ['lower_income', 'older_age'],
      });

      alert(res.message || 'Config published successfully!');
      fetchSchemes();
    } catch (err: any) {
      alert(err.message || 'Failed to publish config');
    } finally {
      setSaving(false);
    }
  };

  const handleCloneScheme = async () => {
    if (!selectedScheme) return;
    const newCode = prompt('Enter new Scheme Code (e.g. NOS_2026):', `${selectedScheme.code}_CLONE`);
    if (!newCode) return;

    try {
      const res = await api.cloneScheme(selectedScheme.id, {
        newCode,
        newName: `${selectedScheme.name} (Cloned)`,
      });
      alert(res.message || 'Scheme cloned successfully');
      fetchSchemes();
    } catch (err: any) {
      alert(err.message || 'Failed to clone scheme');
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-500 font-bold">Loading Rule Configurator...</div>;
  }

  return (
    <div className="space-y-6 py-2">
      {/* Header Banner */}
      <div className="govt-card overflow-hidden">
        <div className="govt-card-header flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
            <Sliders className="w-4 h-4 text-amber-400" />
            <span>No-Code Scheme Configuration Engine</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCloneScheme}
              className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-1 shadow"
            >
              <Copy className="w-3.5 h-3.5 text-amber-400" />
              Clone Scheme
            </button>
            <button
              onClick={handleSaveConfig}
              disabled={saving}
              className="px-4 py-1.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow flex items-center gap-1"
            >
              <Save className="w-3.5 h-3.5" />
              {saving ? 'Publishing...' : 'Publish Config Version'}
            </button>
          </div>
        </div>
        <div className="tricolor-ribbon"></div>

        <div className="p-4 bg-white">
          <h1 className="text-xl font-extrabold text-[#0a2540]">Rule Builder & Schema Configurator</h1>
          <p className="text-xs text-slate-600 font-medium">
            Define eligibility rules, document checklists, and merit weightages. Changes create a new SchemeConfig version without breaking past records.
          </p>
        </div>
      </div>

      {/* Scheme Selector Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {schemes.map((s) => (
          <button
            key={s.id}
            onClick={() => selectScheme(s)}
            className={`px-3 py-1.5 rounded font-bold shrink-0 border ${
              selectedScheme?.id === s.id ? 'bg-[#0f2e5a] text-white border-[#0f2e5a]' : 'bg-white text-slate-700 border-slate-300'
            }`}
          >
            {s.code}: {s.name.slice(0, 35)}... (v{s.activeConfig?.version || 1})
          </button>
        ))}
      </div>

      {/* Builder Main Box */}
      <div className="govt-card p-6 space-y-6">
        {/* Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs font-bold">
          <button
            onClick={() => setActiveTab('rules')}
            className={`px-3 py-1 rounded transition-all ${
              activeTab === 'rules' ? 'bg-[#0f2e5a] text-white font-extrabold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Eligibility Rules ({rules.length})
          </button>
          <button
            onClick={() => setActiveTab('docs')}
            className={`px-3 py-1 rounded transition-all ${
              activeTab === 'docs' ? 'bg-[#0f2e5a] text-white font-extrabold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Required Documents ({docs.length})
          </button>
          <button
            onClick={() => setActiveTab('weightage')}
            className={`px-3 py-1 rounded transition-all ${
              activeTab === 'weightage' ? 'bg-[#0f2e5a] text-white font-extrabold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Merit Scoring Weightage
          </button>
          <button
            onClick={() => setActiveTab('json')}
            className={`px-3 py-1 rounded transition-all ${
              activeTab === 'json' ? 'bg-[#0f2e5a] text-white font-extrabold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            JSON Preview
          </button>
        </div>

        {/* RULES */}
        {activeTab === 'rules' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-[#0f2e5a] uppercase">Configured Rules Array</span>
              <button onClick={addRule} className="px-3 py-1 rounded bg-[#0f2e5a] text-white font-bold text-xs flex items-center gap-1">
                <Plus className="w-3.5 h-3.5" /> Add Rule
              </button>
            </div>

            <div className="space-y-3">
              {rules.map((rule, idx) => (
                <div key={idx} className="p-4 rounded border border-slate-300 bg-slate-50 space-y-2 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-slate-700 font-bold mb-0.5">Label</label>
                      <input
                        type="text"
                        value={rule.label}
                        onChange={(e) => updateRule(idx, 'label', e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded bg-white border border-slate-300 text-slate-800 font-medium outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-bold mb-0.5">Field Key</label>
                      <input
                        type="text"
                        value={rule.field}
                        onChange={(e) => updateRule(idx, 'field', e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded bg-white border border-slate-300 text-slate-800 font-medium outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-bold mb-0.5">Operator & Value</label>
                      <div className="flex items-center gap-2">
                        <select
                          value={rule.operator}
                          onChange={(e) => updateRule(idx, 'operator', e.target.value)}
                          className="px-2 py-1.5 rounded bg-white border border-slate-300 text-slate-800 font-bold"
                        >
                          <option value="<=">&lt;=</option>
                          <option value=">=">&gt;=</option>
                          <option value="==">==</option>
                        </select>
                        <input
                          type="text"
                          value={rule.value}
                          onChange={(e) => updateRule(idx, 'value', e.target.value)}
                          className="flex-1 px-2.5 py-1.5 rounded bg-white border border-slate-300 text-slate-800 font-medium outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <input
                      type="text"
                      placeholder="Rule description..."
                      value={rule.description || ''}
                      onChange={(e) => updateRule(idx, 'description', e.target.value)}
                      className="flex-1 mr-3 px-2.5 py-1 rounded bg-white border border-slate-300 text-slate-700 text-xs"
                    />
                    <button onClick={() => removeRule(idx)} className="text-rose-700 font-bold">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* DOCS */}
        {activeTab === 'docs' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-[#0f2e5a] uppercase">Required Document List</span>
              <button onClick={addDoc} className="px-3 py-1 rounded bg-[#0f2e5a] text-white font-bold text-xs flex items-center gap-1">
                <Plus className="w-3.5 h-3.5" /> Add Document Type
              </button>
            </div>

            <div className="space-y-2 text-xs">
              {docs.map((doc, idx) => (
                <div key={idx} className="p-3 rounded border border-slate-300 bg-slate-50 flex items-center justify-between gap-3">
                  <input
                    type="text"
                    value={doc.name}
                    onChange={(e) => {
                      const u = [...docs];
                      u[idx].name = e.target.value;
                      setDocs(u);
                    }}
                    className="flex-1 px-2.5 py-1.5 rounded bg-white border border-slate-300 text-slate-800 font-bold"
                  />
                  <input
                    type="text"
                    value={doc.type}
                    onChange={(e) => {
                      const u = [...docs];
                      u[idx].type = e.target.value;
                      setDocs(u);
                    }}
                    className="w-40 px-2.5 py-1.5 rounded bg-white border border-slate-300 text-slate-800 font-semibold"
                  />
                  <button onClick={() => removeDoc(idx)} className="text-rose-700 font-bold">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* WEIGHTAGE */}
        {activeTab === 'weightage' && (
          <div className="space-y-4 text-xs font-medium bg-slate-50 p-4 rounded border border-slate-300">
            <h3 className="font-extrabold text-[#0f2e5a]">Merit Composite Score Sliders</h3>
            <div>
              <div className="flex justify-between font-bold mb-1">
                <span>Academic Marks Weightage:</span>
                <span className="text-blue-900">{weightage.academicMarksWeight}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={weightage.academicMarksWeight}
                onChange={(e) => setWeightage({ ...weightage, academicMarksWeight: Number(e.target.value) })}
                className="w-full accent-[#0f2e5a]"
              />
            </div>
            <div>
              <div className="flex justify-between font-bold mb-1">
                <span>Income Inverse Weightage:</span>
                <span className="text-blue-900">{weightage.incomeWeight}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={weightage.incomeWeight}
                onChange={(e) => setWeightage({ ...weightage, incomeWeight: Number(e.target.value) })}
                className="w-full accent-[#0f2e5a]"
              />
            </div>
            <div>
              <div className="flex justify-between font-bold mb-1">
                <span>PVTG Bonus Weightage:</span>
                <span className="text-amber-800">+{weightage.pvtgBonus}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={30}
                value={weightage.pvtgBonus}
                onChange={(e) => setWeightage({ ...weightage, pvtgBonus: Number(e.target.value) })}
                className="w-full accent-amber-600"
              />
            </div>
          </div>
        )}

        {/* JSON */}
        {activeTab === 'json' && (
          <div className="bg-slate-900 p-4 rounded text-xs font-mono text-emerald-400 overflow-x-auto max-h-96">
            <pre>{JSON.stringify({ schemeId: selectedScheme?.id, eligibilityRules: rules, requiredDocuments: docs, scoringWeightage: weightage }, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
