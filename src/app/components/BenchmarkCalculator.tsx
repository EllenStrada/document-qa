import React, { useState } from 'react';
import { X, Calculator, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { marketBenchmarks, industryBenchmarks } from '../../data/benchmarkData';
import { projectId, publicAnonKey } from '../../../utils/supabase/info';

interface BenchmarkCalculatorProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BenchmarkCalculator({ isOpen, onClose }: BenchmarkCalculatorProps) {
  const [selectedMarket, setSelectedMarket] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [userAbsentismoGeneral, setUserAbsentismoGeneral] = useState('');
  const [userAbsentismoSM, setUserAbsentismoSM] = useState('');
  const [userTop3, setUserTop3] = useState('');
  const [userSalarioMedio, setUserSalarioMedio] = useState('');
  const [userCosteBajaSM, setUserCosteBajaSM] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userCompany, setUserCompany] = useState('');
  const [showNameDialog, setShowNameDialog] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'warning';
    message: string;
  } | null>(null);
  const [dialogError, setDialogError] = useState<string>('');

  // Auto-hide notification after 5 seconds
  React.useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Function to normalize numbers (accept dot, comma, integers)
  const normalizeNumber = (value: string): number => {
    if (!value || value.trim() === '') return NaN;
    // Replace commas with dots and remove spaces
    const normalized = value.trim().replace(',', '.');
    return parseFloat(normalized);
  };

  // Function to validate that a numeric value is valid
  const isValidNumber = (value: string): boolean => {
    if (!value || value.trim() === '') return false;
    const num = normalizeNumber(value);
    return !isNaN(num) && num >= 0;
  };

  const handleCalculate = () => {
    // Validate only mandatory fields with valid numbers
    if (selectedMarket && 
        selectedIndustry && 
        isValidNumber(userAbsentismoGeneral) && 
        isValidNumber(userAbsentismoSM)) {
      setShowNameDialog(true);
    } else {
      setNotification({ 
        type: 'warning', 
        message: 'Please complete all required fields (*) with valid numeric values.' 
      });
    }
  };

  const handleReset = () => {
    setSelectedMarket('');
    setSelectedIndustry('');
    setUserAbsentismoGeneral('');
    setUserAbsentismoSM('');
    setUserTop3('');
    setUserSalarioMedio('');
    setUserCosteBajaSM('');
    setShowResults(false);
    setUserName('');
    setUserEmail('');
    setUserCompany('');
    setShowNameDialog(false);
    setAcceptedTerms(false);
    setNotification(null);
    setDialogError('');
  };

  if (!isOpen) return null;

  // Get benchmark for selected market
  const marketBenchmark = marketBenchmarks.find(b => b.mercadoCode === selectedMarket);
  
  // Get benchmark for selected industry
  const industryBenchmark = industryBenchmarks.find(
    b => b.mercadoCode === selectedMarket && b.industria === selectedIndustry
  );

  // Function to compare values
  const compareValue = (userValue: string, benchmarkValue: string) => {
    const userNum = parseFloat(userValue.replace(',', '.'));
    
    // Extract average number from benchmark (could be a range)
    let benchmarkNum = 0;
    if (benchmarkValue.includes('–')) {
      const parts = benchmarkValue.split('–');
      const num1 = parseFloat(parts[0].replace(/[^\d.,]/g, '').replace(',', '.'));
      const num2 = parseFloat(parts[1].replace(/[^\d.,]/g, '').replace(',', '.'));
      benchmarkNum = (num1 + num2) / 2;
    } else {
      benchmarkNum = parseFloat(benchmarkValue.replace(/[^\d.,]/g, '').replace(',', '.'));
    }

    if (isNaN(userNum) || isNaN(benchmarkNum)) return 'similar';

    const difference = ((userNum - benchmarkNum) / benchmarkNum) * 100;

    if (difference > 10) return 'superior';
    if (difference < -10) return 'inferior';
    return 'similar';
  };

  const getComparisonIcon = (comparison: string) => {
    if (comparison === 'superior') return <TrendingUp className="w-5 h-5 text-red-400" />;
    if (comparison === 'inferior') return <TrendingDown className="w-5 h-5 text-green-400" />;
    return <Minus className="w-5 h-5 text-yellow-400" />;
  };

  const getComparisonText = (comparison: string, isAbsenteeism: boolean = true) => {
    if (comparison === 'superior') {
      return isAbsenteeism 
        ? 'Above benchmark (⚠️ area for improvement)'
        : 'Above benchmark';
    }
    if (comparison === 'inferior') {
      return isAbsenteeism
        ? 'Below benchmark (✓ good performance)'
        : 'Below benchmark';
    }
    return 'Similar to benchmark';
  };

  const getComparisonColor = (comparison: string, isAbsenteeism: boolean = true) => {
    if (comparison === 'superior') {
      return isAbsenteeism ? 'text-red-400' : 'text-green-400';
    }
    if (comparison === 'inferior') {
      return isAbsenteeism ? 'text-green-400' : 'text-red-400';
    }
    return 'text-yellow-400';
  };

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

  const handleEmailResults = async () => {
    if (!marketBenchmark || !industryBenchmark) return;

    if (!userName.trim() || !userEmail.trim()) {
      setShowNameDialog(true);
      return;
    }

    try {
      console.log('📧 Starting email send process...');
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

      console.log('📤 Sending request:', requestBody);
      console.log('🔗 URL:', `https://${projectId}.supabase.co/functions/v1/make-server-9633489f/download-logs`);
      
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-9633489f/download-logs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify(requestBody)
      });

      console.log('📥 Response status:', response.status);
      console.log('📥 Response ok:', response.ok);

      const data = await response.json();
      console.log('📥 Response data:', data);

      if (data.success) {
        console.log('✅ Email sent successfully');
        setNotification({ type: 'success', message: 'Perfect! We have sent the analysis to your email: ' + userEmail.trim() });
      } else {
        console.error('❌ Server returned error:', data);
        setNotification({ type: 'error', message: data.error || 'There was an error sending the email. Please try again.' });
      }
    } catch (error) {
      console.error('❌ Exception caught:', error);
      setNotification({ type: 'error', message: `Connection error: ${error.message}` });
    }
  };

  const handleConfirmDownload = async () => {
    if (!userName.trim()) {
      setDialogError('Please enter your name');
      return;
    }
    if (!userEmail.trim()) {
      setDialogError('Please enter your email');
      return;
    }
    if (!acceptedTerms) {
      setDialogError('Please accept the terms and conditions');
      return;
    }
    setShowNameDialog(false);
    await handleEmailResults();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-slate-900 border-b border-slate-700 p-6 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600/20 p-2 rounded-lg">
              <Calculator className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-2xl text-white">Mental Health Data Comparator</h2>
              <p className="text-sm text-slate-400 mt-1">
                Compare your indicators with regional and industrial benchmarks
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Selection of market and industry */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Select your market/region *
              </label>
              <select
                value={selectedMarket}
                onChange={(e) => {
                  setSelectedMarket(e.target.value);
                  setShowResults(false);
                }}
                className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Select your industry *
              </label>
              <select
                value={selectedIndustry}
                onChange={(e) => {
                  setSelectedIndustry(e.target.value);
                  setShowResults(false);
                }}
                className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">-- Select --</option>
                {industries.map(ind => (
                  <option key={ind} value={ind}>{ind}</option>
                ))}
              </select>
            </div>
          </div>

          {/* User data form */}
          {selectedMarket && selectedIndustry && (
            <>
              <div className="border-t border-slate-700 pt-6">
                <h3 className="text-lg text-white mb-4">Enter your data</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      % General Absenteeism *
                    </label>
                    <input
                      type="text"
                      value={userAbsentismoGeneral}
                      onChange={(e) => {
                        setUserAbsentismoGeneral(e.target.value);
                        setShowResults(false);
                      }}
                      placeholder="e.g.: 5.2"
                      className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      % Mental Health Absenteeism *
                    </label>
                    <input
                      type="text"
                      value={userAbsentismoSM}
                      onChange={(e) => {
                        setUserAbsentismoSM(e.target.value);
                        setShowResults(false);
                      }}
                      placeholder="e.g.: 1.8"
                      className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Top 3 Mental Health Concerns (optional)
                    </label>
                    <input
                      type="text"
                      value={userTop3}
                      onChange={(e) => {
                        setUserTop3(e.target.value);
                        setShowResults(false);
                      }}
                      placeholder="e.g.: Anxiety, Depression, Burnout"
                      className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Average Salary per Employee/Year (optional)
                    </label>
                    <input
                      type="text"
                      value={userSalarioMedio}
                      onChange={(e) => {
                        setUserSalarioMedio(e.target.value);
                        setShowResults(false);
                      }}
                      placeholder="e.g.: 30000"
                      className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Mental Health Sick Leave Cost per Employee/Year (optional)
                    </label>
                    <input
                      type="text"
                      value={userCosteBajaSM}
                      onChange={(e) => {
                        setUserCosteBajaSM(e.target.value);
                        setShowResults(false);
                      }}
                      placeholder="e.g.: 5000"
                      className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleCalculate}
                  disabled={!userAbsentismoGeneral || !userAbsentismoSM}
                  className="flex-1 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
                >
                  Receive Analysis by Email
                </button>
                <button
                  onClick={handleReset}
                  className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors"
                >
                  Clear
                </button>
              </div>
            </>
          )}

          {/* Results */}
          {showResults && marketBenchmark && industryBenchmark && (
            <div className="border-t border-slate-700 pt-6 space-y-6">
              <h3 className="text-xl text-white flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-indigo-400" />
                Comparative Analysis
              </h3>

              {/* Comparison with market benchmark */}
              <div className="bg-indigo-900/20 border border-indigo-500/30 rounded-lg p-5">
                <h4 className="text-lg text-indigo-300 mb-4">
                  Comparison with Market Benchmark: {marketBenchmark.mercado}
                </h4>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    {getComparisonIcon(compareValue(userAbsentismoGeneral, marketBenchmark.absentismoGeneral))}
                    <div className="flex-1">
                      <p className="text-sm text-slate-300">
                        <strong>General Absenteeism:</strong> Your value {userAbsentismoGeneral}% vs benchmark {marketBenchmark.absentismoGeneral}
                      </p>
                      <p className={`text-sm mt-1 ${getComparisonColor(compareValue(userAbsentismoGeneral, marketBenchmark.absentismoGeneral), true)}`}>
                        {getComparisonText(compareValue(userAbsentismoGeneral, marketBenchmark.absentismoGeneral), true)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    {getComparisonIcon(compareValue(userAbsentismoSM, marketBenchmark.absentismoSM))}
                    <div className="flex-1">
                      <p className="text-sm text-slate-300">
                        <strong>Mental Health Absenteeism:</strong> Your value {userAbsentismoSM}% vs benchmark {marketBenchmark.absentismoSM}
                      </p>
                      <p className={`text-sm mt-1 ${getComparisonColor(compareValue(userAbsentismoSM, marketBenchmark.absentismoSM), true)}`}>
                        {getComparisonText(compareValue(userAbsentismoSM, marketBenchmark.absentismoSM), true)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Comparison with industry benchmark */}
              <div className="bg-emerald-900/20 border border-emerald-500/30 rounded-lg p-5">
                <h4 className="text-lg text-emerald-300 mb-4">
                  Comparison with Industry Benchmark: {industryBenchmark.industria}
                </h4>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    {getComparisonIcon(compareValue(userAbsentismoGeneral, industryBenchmark.absentismoGeneral))}
                    <div className="flex-1">
                      <p className="text-sm text-slate-300">
                        <strong>General Absenteeism:</strong> Your value {userAbsentismoGeneral}% vs benchmark {industryBenchmark.absentismoGeneral}
                      </p>
                      <p className={`text-sm mt-1 ${getComparisonColor(compareValue(userAbsentismoGeneral, industryBenchmark.absentismoGeneral), true)}`}>
                        {getComparisonText(compareValue(userAbsentismoGeneral, industryBenchmark.absentismoGeneral), true)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    {getComparisonIcon(compareValue(userAbsentismoSM, industryBenchmark.absentismoSM))}
                    <div className="flex-1">
                      <p className="text-sm text-slate-300">
                        <strong>Mental Health Absenteeism:</strong> Your value {userAbsentismoSM}% vs benchmark {industryBenchmark.absentismoSM}
                      </p>
                      <p className={`text-sm mt-1 ${getComparisonColor(compareValue(userAbsentismoSM, industryBenchmark.absentismoSM), true)}`}>
                        {getComparisonText(compareValue(userAbsentismoSM, industryBenchmark.absentismoSM), true)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional information */}
              <div className="bg-slate-800/40 border border-slate-700 rounded-lg p-5">
                <h4 className="text-base text-slate-200 mb-3">Reference Data</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-slate-400 mb-1"><strong>Employer Cost (market):</strong></p>
                    <p className="text-slate-300">{marketBenchmark.costeEmpresa}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 mb-1"><strong>State Cost (market):</strong></p>
                    <p className="text-slate-300">{marketBenchmark.costeEstado}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 mb-1"><strong>Top 3 Disorders (market):</strong></p>
                    <p className="text-slate-300">{marketBenchmark.top3Trastornos}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 mb-1"><strong>Top 3 Disorders (industry):</strong></p>
                    <p className="text-slate-300">{industryBenchmark.top3TrastornosSM}</p>
                  </div>
                  {userSalarioMedio && (
                    <div>
                      <p className="text-slate-400 mb-1"><strong>Your Average Salary/Year:</strong></p>
                      <p className="text-slate-300">{parseFloat(userSalarioMedio).toLocaleString('en-US')} €</p>
                    </div>
                  )}
                  {userCosteBajaSM && (
                    <div>
                      <p className="text-slate-400 mb-1"><strong>Your Mental Health Leave Cost/Year:</strong></p>
                      <p className="text-slate-300">{parseFloat(userCosteBajaSM).toLocaleString('en-US')} €</p>
                    </div>
                  )}
                  {userTop3 && (
                    <div>
                      <p className="text-slate-400 mb-1"><strong>Your Top 3 Mental Health Concerns:</strong></p>
                      <p className="text-slate-300">{userTop3}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Recommendations */}
              <div className="bg-amber-900/20 border border-amber-500/30 rounded-lg p-5">
                <h4 className="text-base text-amber-300 mb-3">💡 Recommendations</h4>
                <ul className="space-y-2 text-sm text-slate-300">
                  {compareValue(userAbsentismoGeneral, industryBenchmark.absentismoGeneral) === 'superior' && (
                    <li>• Your general absenteeism rate is above the benchmark. Consider implementing wellbeing and prevention programs.</li>
                  )}
                  {compareValue(userAbsentismoSM, industryBenchmark.absentismoSM) === 'superior' && (
                    <li>• Your mental health absenteeism rate exceeds the average. Prioritize psychological support and stress management initiatives.</li>
                  )}
                  {compareValue(userAbsentismoGeneral, industryBenchmark.absentismoGeneral) === 'inferior' && 
                   compareValue(userAbsentismoSM, industryBenchmark.absentismoSM) === 'inferior' && (
                    <li>• ✓ Your rates are below the benchmark. Continue with your current practices and share them as best practices.</li>
                  )}
                  <li>• Review the Top 3 disorders in your organization and compare with benchmarks to identify specific areas of intervention.</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Dialog to request name */}
      {showNameDialog && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="bg-slate-800 border border-slate-600 rounded-xl shadow-2xl w-full max-w-md p-6">
            <h3 className="text-xl text-white mb-2">📧 Receive analysis by email</h3>
            <p className="text-sm text-slate-400 mb-4">
              Enter your details to receive the PDF with the full analysis in your email.
            </p>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Name *</label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleConfirmDownload();
                    }
                  }}
                  placeholder="e.g.: John Doe"
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Work Email *</label>
                <input
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleConfirmDownload();
                    }
                  }}
                  placeholder="e.g.: john@company.com"
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Company (optional)</label>
                <input
                  type="text"
                  value={userCompany}
                  onChange={(e) => setUserCompany(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleConfirmDownload();
                    }
                  }}
                  placeholder="e.g.: Acme Corp"
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-start gap-2 pt-2">
                <input
                  type="checkbox"
                  id="terms"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="mt-1 accent-indigo-500"
                />
                <label htmlFor="terms" className="text-xs text-slate-400 leading-tight">
                  I accept the processing of my data to receive this analysis and commercial communications from ifeel according to the privacy policy.
                </label>
              </div>

              {dialogError && (
                <p className="text-xs text-red-400 bg-red-400/10 p-2 rounded border border-red-400/20">
                  {dialogError}
                </p>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setShowNameDialog(false)}
                  className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDownload}
                  className="flex-[2] px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Send Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notifications */}
      {notification && (
        <div className={`fixed bottom-6 right-6 z-[100] p-4 rounded-lg shadow-xl border animate-slide-up max-w-md ${
          notification.type === 'success' ? 'bg-emerald-900/90 border-emerald-500 text-emerald-100' :
          notification.type === 'error' ? 'bg-red-900/90 border-red-500 text-red-100' :
          'bg-amber-900/90 border-amber-500 text-amber-100'
        }`}>
          <div className="flex items-center gap-3">
            {notification.type === 'success' ? <TrendingDown className="w-5 h-5" /> : 
             notification.type === 'error' ? <X className="w-5 h-5" /> : 
             <Minus className="w-5 h-5" />}
            <p className="text-sm font-medium">{notification.message}</p>
          </div>
        </div>
      )}
    </div>
  );
}
