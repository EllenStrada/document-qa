import React, { useState, useEffect } from 'react';
import { Calculator, ArrowRight, TrendingUp, ArrowLeft, Check, X } from 'lucide-react';
import { marketBenchmarks, industryBenchmarks } from '../../data/benchmarkData';
import { projectId, publicAnonKey } from '../../../utils/supabase/info';

type WizardStep = 'intro' | 'step1' | 'step2' | 'step3' | 'success';

export function InlineCalculator() {
  const [currentStep, setCurrentStep] = useState<WizardStep>('intro');
  const [selectedMarket, setSelectedMarket] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [userAbsentismoGeneral, setUserAbsentismoGeneral] = useState('');
  const [userAbsentismoSM, setUserAbsentismoSM] = useState('');
  const [userTop3, setUserTop3] = useState('');
  const [userSalarioMedio, setUserSalarioMedio] = useState('');
  const [userCosteBajaSM, setUserCosteBajaSM] = useState('');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userCompany, setUserCompany] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const industries = [
    'Healthcare',
    'Technology / IT',
    'Financial Services',
    'Manufacturing',
    'Professional Services / Consulting',
    'Retail',
    'Energy / Utilities',
    'Education',
    'Government / Public Admin.',
    'Hospitality / Tourism'
  ];

  // Auto-close success state after 5 seconds
  useEffect(() => {
    if (currentStep === 'success') {
      const timer = setTimeout(() => {
        handleReset();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  const normalizeNumber = (value: string): number => {
    if (!value || value.trim() === '') return NaN;
    const normalized = value.trim().replace(',', '.');
    return parseFloat(normalized);
  };

  const isValidNumber = (value: string): boolean => {
    if (!value || value.trim() === '') return false;
    const num = normalizeNumber(value);
    return !isNaN(num) && num >= 0;
  };

  const handleReset = () => {
    setCurrentStep('intro');
    setSelectedMarket('');
    setSelectedIndustry('');
    setUserAbsentismoGeneral('');
    setUserAbsentismoSM('');
    setUserTop3('');
    setUserSalarioMedio('');
    setUserCosteBajaSM('');
    setUserName('');
    setUserEmail('');
    setUserCompany('');
    setAcceptedTerms(false);
    setError('');
    setIsSubmitting(false);
  };

  const handleStep1Continue = () => {
    if (!selectedMarket || !selectedIndustry) {
      setError('Please select both market/region and industry');
      return;
    }
    setError('');
    setCurrentStep('step2');
  };

  const handleStep2Continue = () => {
    if (!isValidNumber(userAbsentismoGeneral) || !isValidNumber(userAbsentismoSM)) {
      setError('Please enter valid values for required fields (*)');
      return;
    }
    setError('');
    setCurrentStep('step3');
  };

  const handleStep2Clear = () => {
    setUserAbsentismoGeneral('');
    setUserAbsentismoSM('');
    setUserTop3('');
    setUserSalarioMedio('');
    setUserCosteBajaSM('');
    setError('');
  };

  const handleSubmit = async () => {
    if (!userName.trim()) {
      setError('Please enter your name');
      return;
    }
    if (!userEmail.trim()) {
      setError('Please enter your email');
      return;
    }
    if (!acceptedTerms) {
      setError('Please accept the terms and conditions');
      return;
    }

    setError('');
    setIsSubmitting(true);

    const marketBenchmark = marketBenchmarks.find(b => b.mercadoCode === selectedMarket);
    const industryBenchmark = industryBenchmarks.find(
      b => b.mercadoCode === selectedMarket && b.industria === selectedIndustry
    );

    if (!marketBenchmark || !industryBenchmark) {
      setError('Unable to find benchmark data');
      setIsSubmitting(false);
      return;
    }

    try {
      const fileName = `Mental_Health_Analysis_${marketBenchmark.mercado}_${selectedIndustry.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;

      const requestBody = {
        userName: userName.trim(),
        userEmail: userEmail.trim(),
        userCompany: userCompany.trim(),
        sendEmail: true,
        fileType: 'PDF',
        fileName: fileName,
        timestamp: new Date().toISOString(),
        details: {
          mercado: marketBenchmark.mercado,
          industria: selectedIndustry,
          absentismoGeneral: normalizeNumber(userAbsentismoGeneral),
          absentismoSM: normalizeNumber(userAbsentismoSM),
          benchmarkMercadoGeneral: marketBenchmark.absentismoGeneral,
          benchmarkMercadoSM: marketBenchmark.absentismoSM,
          benchmarkIndustriaGeneral: industryBenchmark.absentismoGeneral,
          benchmarkIndustriaSM: industryBenchmark.absentismoSM
        }
      };

      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-9633489f/download-logs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();

      if (data.success) {
        setCurrentStep('success');
      } else {
        setError(data.error || 'There was an error sending the email. Please try again.');
      }
    } catch (error: any) {
      setError(`Connection error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mb-12 relative">
      {/* Decorative elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#FF9B9B]/5 via-[#FF9B9B]/10 to-[#FF9B9B]/5 rounded-2xl blur-3xl" />

      <div
        className={`relative bg-gradient-to-br from-[#1B2847] to-slate-900 rounded-2xl border-2 overflow-hidden transition-all duration-300 ${
          currentStep === 'success'
            ? 'border-green-500/60 shadow-[0_0_40px_rgba(34,197,94,0.25)]'
            : 'border-[#FF9B9B]/30 shadow-2xl'
        }`}
      >
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-64 h-64 bg-[#FF9B9B] rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#FF9B9B] rounded-full blur-3xl" />
        </div>

        <div className="relative px-8 py-12 md:px-12 transition-all duration-300">
          <div className="max-w-5xl mx-auto">
            {/* STATE A - INTRO */}
            {currentStep === 'intro' && (
              <div className="flex flex-col md:flex-row items-center gap-8 animate-fade-in">
                {/* Icon and badge */}
                <div className="flex-shrink-0">
                  <div className="relative">
                    <div className="absolute inset-0 bg-[#FF9B9B]/20 rounded-2xl blur-xl" />
                    <div className="relative bg-gradient-to-br from-[#FF9B9B] to-[#ff8a8a] p-6 rounded-2xl shadow-xl">
                      <Calculator className="w-12 h-12 text-[#1B2847]" />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 text-center md:text-left">
                  <div className="inline-flex items-center gap-2 bg-[#FF9B9B]/20 px-4 py-1.5 rounded-full mb-4">
                    <TrendingUp className="w-4 h-4 text-[#FF9B9B]" />
                    <span className="text-sm font-semibold text-[#FF9B9B]" style={{ fontFamily: "'Lato', sans-serif" }}>
                      Interactive Tool
                    </span>
                  </div>

                  <h3 className="text-3xl text-white font-medium mb-3" style={{ fontFamily: "'Lora', serif" }}>
                    Calculate Your Market Position
                  </h3>

                  <p className="text-base text-slate-300 mb-6 max-w-2xl" style={{ fontFamily: "'Lato', sans-serif" }}>
                    Compare your mental health metrics with global benchmarks and discover where you stand against the competition.
                  </p>

                  <button
                    onClick={() => setCurrentStep('step1')}
                    className="group inline-flex items-center gap-3 bg-[#FF9B9B] hover:bg-[#ff8a8a] text-[#1B2847] px-8 py-4 rounded-xl font-bold text-base transition-all transform hover:scale-105 shadow-xl hover:shadow-2xl"
                    style={{ fontFamily: "'Lato', sans-serif" }}
                  >
                    Open Comparator
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                  </button>
                </div>
              </div>
            )}

            {/* STATE B - STEP 1: Market/Industry */}
            {currentStep === 'step1' && (
              <div className="animate-fade-in">
                {/* Header */}
                <div className="mb-6">
                  <div className="inline-block bg-[#FF9B9B]/20 px-4 py-1.5 rounded-full mb-4">
                    <span className="text-sm text-[#FF9B9B] font-semibold" style={{ fontFamily: "'Lato', sans-serif" }}>
                      Step 1 of 3
                    </span>
                  </div>
                  <h3 className="text-2xl md:text-3xl text-white font-medium mb-2" style={{ fontFamily: "'Lora', serif" }}>
                    Mental Health Data Comparator
                  </h3>
                  <p className="text-sm md:text-base text-slate-300" style={{ fontFamily: "'Lato', sans-serif" }}>
                    Compare your indicators with regional and industrial benchmarks
                  </p>
                </div>

                {/* Inputs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2" style={{ fontFamily: "'Lato', sans-serif" }}>
                      Select your market/region *
                    </label>
                    <select
                      value={selectedMarket}
                      onChange={(e) => {
                        setSelectedMarket(e.target.value);
                        setError('');
                      }}
                      className="w-full px-4 py-3 bg-slate-800/80 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#FF9B9B] transition-all"
                      style={{ fontFamily: "'Lato', sans-serif" }}
                    >
                      <option value="">-- Select --</option>
                      <option value="global">Global</option>
                      <option value="europa">Europe</option>
                      <option value="espana">Spain</option>
                      <option value="francia">France</option>
                      <option value="dach">DACH</option>
                      <option value="uki">UKI</option>
                      <option value="usa">USA</option>
                      <option value="brasil">Brazil</option>
                      <option value="mexico">Mexico</option>
                      <option value="colombia">Colombia</option>
                      <option value="chile">Chile</option>
                      <option value="argentina">Argentina</option>
                      <option value="china">China</option>
                      <option value="rusia">Russia</option>
                      <option value="japon">Japan</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2" style={{ fontFamily: "'Lato', sans-serif" }}>
                      Select your industry *
                    </label>
                    <select
                      value={selectedIndustry}
                      onChange={(e) => {
                        setSelectedIndustry(e.target.value);
                        setError('');
                      }}
                      className="w-full px-4 py-3 bg-slate-800/80 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#FF9B9B] transition-all"
                      style={{ fontFamily: "'Lato', sans-serif" }}
                    >
                      <option value="">-- Select --</option>
                      {industries.map(ind => (
                        <option key={ind} value={ind}>{ind}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Error message */}
                {error && (
                  <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                    <p className="text-sm text-red-400" style={{ fontFamily: "'Lato', sans-serif" }}>{error}</p>
                  </div>
                )}

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => setCurrentStep('intro')}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-700/80 hover:bg-slate-600 text-white rounded-lg font-medium transition-all"
                    style={{ fontFamily: "'Lato', sans-serif" }}
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </button>
                  <button
                    onClick={handleStep1Continue}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#FF9B9B] hover:bg-[#ff8a8a] text-[#1B2847] rounded-lg font-bold transition-all transform hover:scale-105"
                    style={{ fontFamily: "'Lato', sans-serif" }}
                  >
                    Continue
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STATE C - STEP 2: Enter your data */}
            {currentStep === 'step2' && (
              <div className="animate-fade-in">
                {/* Header */}
                <div className="mb-6">
                  <div className="inline-block bg-[#FF9B9B]/20 px-4 py-1.5 rounded-full mb-4">
                    <span className="text-sm text-[#FF9B9B] font-semibold" style={{ fontFamily: "'Lato', sans-serif" }}>
                      Step 2 of 3
                    </span>
                  </div>
                  <h3 className="text-2xl md:text-3xl text-white font-medium" style={{ fontFamily: "'Lora', serif" }}>
                    Enter your data
                  </h3>
                </div>

                {/* Inputs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2" style={{ fontFamily: "'Lato', sans-serif" }}>
                      % General Absenteeism *
                    </label>
                    <input
                      type="text"
                      value={userAbsentismoGeneral}
                      onChange={(e) => {
                        setUserAbsentismoGeneral(e.target.value);
                        setError('');
                      }}
                      placeholder="e.g.: 5.2"
                      className="w-full px-4 py-3 bg-slate-800/80 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#FF9B9B] transition-all placeholder:text-slate-500"
                      style={{ fontFamily: "'Lato', sans-serif" }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2" style={{ fontFamily: "'Lato', sans-serif" }}>
                      % Mental Health Absenteeism *
                    </label>
                    <input
                      type="text"
                      value={userAbsentismoSM}
                      onChange={(e) => {
                        setUserAbsentismoSM(e.target.value);
                        setError('');
                      }}
                      placeholder="e.g.: 1.8"
                      className="w-full px-4 py-3 bg-slate-800/80 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#FF9B9B] transition-all placeholder:text-slate-500"
                      style={{ fontFamily: "'Lato', sans-serif" }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2" style={{ fontFamily: "'Lato', sans-serif" }}>
                      Top 3 Mental Health Concerns (optional)
                    </label>
                    <input
                      type="text"
                      value={userTop3}
                      onChange={(e) => setUserTop3(e.target.value)}
                      placeholder="e.g.: Anxiety, Depression, Burnout"
                      className="w-full px-4 py-3 bg-slate-800/80 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#FF9B9B] transition-all placeholder:text-slate-500"
                      style={{ fontFamily: "'Lato', sans-serif" }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2" style={{ fontFamily: "'Lato', sans-serif" }}>
                      Average Salary per Employee/Year (optional)
                    </label>
                    <input
                      type="text"
                      value={userSalarioMedio}
                      onChange={(e) => setUserSalarioMedio(e.target.value)}
                      placeholder="e.g.: 30000"
                      className="w-full px-4 py-3 bg-slate-800/80 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#FF9B9B] transition-all placeholder:text-slate-500"
                      style={{ fontFamily: "'Lato', sans-serif" }}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-300 mb-2" style={{ fontFamily: "'Lato', sans-serif" }}>
                      Mental Health Sick Leave Cost per Employee/Year (optional)
                    </label>
                    <input
                      type="text"
                      value={userCosteBajaSM}
                      onChange={(e) => setUserCosteBajaSM(e.target.value)}
                      placeholder="e.g.: 5000"
                      className="w-full px-4 py-3 bg-slate-800/80 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#FF9B9B] transition-all placeholder:text-slate-500"
                      style={{ fontFamily: "'Lato', sans-serif" }}
                    />
                  </div>
                </div>

                {/* Error message */}
                {error && (
                  <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                    <p className="text-sm text-red-400" style={{ fontFamily: "'Lato', sans-serif" }}>{error}</p>
                  </div>
                )}

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => setCurrentStep('step1')}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-700/80 hover:bg-slate-600 text-white rounded-lg font-medium transition-all"
                    style={{ fontFamily: "'Lato', sans-serif" }}
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </button>
                  <button
                    onClick={handleStep2Clear}
                    className="px-6 py-3 bg-slate-700/80 hover:bg-slate-600 text-white rounded-lg font-medium transition-all"
                    style={{ fontFamily: "'Lato', sans-serif" }}
                  >
                    Clear
                  </button>
                  <button
                    onClick={handleStep2Continue}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#FF9B9B] hover:bg-[#ff8a8a] text-[#1B2847] rounded-lg font-bold transition-all transform hover:scale-105"
                    style={{ fontFamily: "'Lato', sans-serif" }}
                  >
                    Receive analysis by email
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STATE D - STEP 3: Receive analysis by email */}
            {currentStep === 'step3' && (
              <div className="animate-fade-in">
                {/* Header */}
                <div className="mb-6">
                  <div className="inline-block bg-[#FF9B9B]/20 px-4 py-1.5 rounded-full mb-4">
                    <span className="text-sm text-[#FF9B9B] font-semibold" style={{ fontFamily: "'Lato', sans-serif" }}>
                      Step 3 of 3
                    </span>
                  </div>
                  <h3 className="text-2xl md:text-3xl text-white font-medium mb-2" style={{ fontFamily: "'Lora', serif" }}>
                    Receive analysis by email
                  </h3>
                  <p className="text-sm md:text-base text-slate-300" style={{ fontFamily: "'Lato', sans-serif" }}>
                    Enter your details to receive the PDF with the full analysis in your email.
                  </p>
                </div>

                {/* Inputs */}
                <div className="space-y-4 mb-6">
                  {/* Name and Work Email in 2 columns on desktop */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2" style={{ fontFamily: "'Lato', sans-serif" }}>
                        Name *
                      </label>
                      <input
                        type="text"
                        value={userName}
                        onChange={(e) => {
                          setUserName(e.target.value);
                          setError('');
                        }}
                        placeholder="e.g.: John Doe"
                        className="w-full px-4 py-3 bg-slate-800/80 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#FF9B9B] transition-all placeholder:text-slate-500"
                        style={{ fontFamily: "'Lato', sans-serif" }}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2" style={{ fontFamily: "'Lato', sans-serif" }}>
                        Work Email *
                      </label>
                      <input
                        type="email"
                        value={userEmail}
                        onChange={(e) => {
                          setUserEmail(e.target.value);
                          setError('');
                        }}
                        placeholder="e.g.: john@company.com"
                        className="w-full px-4 py-3 bg-slate-800/80 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#FF9B9B] transition-all placeholder:text-slate-500"
                        style={{ fontFamily: "'Lato', sans-serif" }}
                      />
                    </div>
                  </div>

                  {/* Company field - full width */}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2" style={{ fontFamily: "'Lato', sans-serif" }}>
                      Company (optional)
                    </label>
                    <input
                      type="text"
                      value={userCompany}
                      onChange={(e) => setUserCompany(e.target.value)}
                      placeholder="e.g.: Acme Corp"
                      className="w-full px-4 py-3 bg-slate-800/80 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#FF9B9B] transition-all placeholder:text-slate-500"
                      style={{ fontFamily: "'Lato', sans-serif" }}
                    />
                  </div>

                  <div className="flex items-start gap-3 pt-2">
                    <input
                      type="checkbox"
                      id="terms"
                      checked={acceptedTerms}
                      onChange={(e) => {
                        setAcceptedTerms(e.target.checked);
                        setError('');
                      }}
                      className="mt-1 w-4 h-4 accent-[#FF9B9B] cursor-pointer"
                    />
                    <label htmlFor="terms" className="text-xs text-slate-400 leading-tight cursor-pointer" style={{ fontFamily: "'Lato', sans-serif" }}>
                      I accept the processing of my data to receive this analysis and commercial communications from ifeel according to the privacy policy.
                    </label>
                  </div>
                </div>

                {/* Error message */}
                {error && (
                  <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                    <p className="text-sm text-red-400" style={{ fontFamily: "'Lato', sans-serif" }}>{error}</p>
                  </div>
                )}

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => setCurrentStep('step2')}
                    disabled={isSubmitting}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-700/80 hover:bg-slate-600 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ fontFamily: "'Lato', sans-serif" }}
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#FF9B9B] hover:bg-[#ff8a8a] text-[#1B2847] rounded-lg font-bold transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    style={{ fontFamily: "'Lato', sans-serif" }}
                  >
                    {isSubmitting ? 'Sending...' : 'Send Report'}
                    {!isSubmitting && <ArrowRight className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {/* STATE E - SUCCESS */}
            {currentStep === 'success' && (
              <div className="animate-fade-in text-center py-8 px-4">
                <div className="mb-6 flex justify-center">
                  <div className="relative">
                    <div className="absolute inset-0 bg-green-500/20 rounded-full blur-xl" />
                    <div className="relative bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-full shadow-xl">
                      <Check className="w-12 h-12 text-white" />
                    </div>
                  </div>
                </div>

                <h3 className="text-3xl md:text-4xl text-white font-medium mb-4" style={{ fontFamily: "'Lora', serif" }}>
                  All set!
                </h3>

                <p className="text-base md:text-lg text-slate-300 mb-2" style={{ fontFamily: "'Lato', sans-serif" }}>
                  We've sent the full analysis to your email:
                </p>
                <p className="text-lg md:text-xl text-[#FF9B9B] font-semibold mb-6" style={{ fontFamily: "'Lato', sans-serif" }}>
                  {userEmail}
                </p>

                <p className="text-sm text-slate-400 mb-4" style={{ fontFamily: "'Lato', sans-serif" }}>
                  This panel will close automatically in 5 seconds.
                </p>

                <button
                  onClick={handleReset}
                  className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200 transition-colors"
                  style={{ fontFamily: "'Lato', sans-serif" }}
                >
                  <X className="w-4 h-4" />
                  Close now
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
