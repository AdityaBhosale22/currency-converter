import React, { useState, useEffect } from "react"; 
import { ArrowRightLeft, Loader2, DollarSign, Moon, Sun } from "lucide-react"; 

const CurrencyConverter = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const [amount, setAmount] = useState("");
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("INR");
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [currencies, setCurrencies] = useState({});
  const [isCurrenciesLoading, setIsCurrenciesLoading] = useState(true);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const response = await fetch(
          "https://api.frankfurter.dev/v1/currencies"
        );
        const data = await response.json();
        setCurrencies(data);
      } catch (err) {
        setError("Failed to load currency list.");
      } finally {
        setIsCurrenciesLoading(false);
      }
    };

    fetchCurrencies();
  }, []);

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setConvertedAmount(null);
  };

  const convert = async () => {
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      if (fromCurrency === toCurrency) {
        setConvertedAmount(Number(amount));
        setIsLoading(false);
        return;
      }

      const response = await fetch(
        `https://api.frankfurter.dev/v1/latest?amount=${amount}&from=${fromCurrency}&to=${toCurrency}`
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      const result = data.rates[toCurrency];
      setConvertedAmount(result);
    } catch (err) {
      setError("Failed to fetch rates. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (val, currency) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(val);
  };

  const themeClasses = {
    container: isDarkMode
      ? "bg-slate-950"
      : "bg-gradient-to-br from-slate-50 to-slate-100",
    card: isDarkMode
      ? "bg-slate-900 ring-slate-800"
      : "bg-white ring-slate-900/5",
    header: isDarkMode ? "bg-slate-800 text-white" : "bg-slate-900 text-white",
    textLabel: isDarkMode ? "text-slate-400" : "text-slate-700",
    input: isDarkMode
      ? "bg-slate-800 text-white ring-slate-700 placeholder:text-slate-500 focus:ring-indigo-500"
      : "bg-slate-50 text-slate-900 ring-slate-300 placeholder:text-slate-400 focus:ring-indigo-600",
    swapBtn: isDarkMode
      ? "hover:bg-slate-800 text-slate-400"
      : "hover:bg-slate-100 text-slate-500",
    resultText: isDarkMode ? "text-white" : "text-slate-900",
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-300 ${themeClasses.container}`}
    >
      <div
        className={`w-full max-w-md rounded-2xl shadow-xl overflow-hidden ring-1 transition-all duration-300 ${themeClasses.card}`}
      >
        {/* Header with Theme Toggle */}
        <div className={`p-6 text-center relative ${themeClasses.header}`}>
          <h1 className="text-2xl font-bold tracking-tight">
            Currency Converter
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Real-time exchange rates
          </p>

          {/* Toggle Button */}
          <button
            onClick={toggleTheme}
            className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/10 transition-colors"
            title="Toggle Theme"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        <div className="p-8 space-y-6">
          {/* Amount Input */}
          <div className="space-y-2">
            <label className={`text-sm font-medium ${themeClasses.textLabel}`}>
              Amount
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <DollarSign className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className={`block w-full pl-10 pr-4 py-3 border-0 rounded-lg ring-1 ring-inset focus:ring-2 focus:ring-inset sm:text-lg transition-all ${themeClasses.input}`}
              />
            </div>
          </div>

          {/* Currency Selectors */}
          <div className="grid grid-cols-[1fr_auto_1fr] gap-4 items-center">
            {/* From */}
            <div className="space-y-2">
              <label
                className={`text-sm font-medium ${themeClasses.textLabel}`}
              >
                From
              </label>
              <select
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value)}
                disabled={isCurrenciesLoading}
                className={`block w-full py-3 px-3 border-0 rounded-lg ring-1 ring-inset focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 cursor-pointer transition-colors ${themeClasses.input}`}
              >
                {Object.entries(currencies).map(([code, name]) => (
                  <option
                    key={code}
                    value={code}
                    className="text-slate-900 bg-white"
                  >
                    {code}
                  </option>
                ))}
              </select>
            </div>

            {/* Swap Button */}
            <div className="pt-6">
              <button
                onClick={handleSwap}
                className={`p-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-600 ${themeClasses.swapBtn}`}
                title="Swap Currencies"
              >
                <ArrowRightLeft size={20} />
              </button>
            </div>

            {/* To */}
            <div className="space-y-2">
              <label
                className={`text-sm font-medium ${themeClasses.textLabel}`}
              >
                To
              </label>
              <select
                value={toCurrency}
                onChange={(e) => setToCurrency(e.target.value)}
                disabled={isCurrenciesLoading}
                className={`block w-full py-3 px-3 border-0 rounded-lg ring-1 ring-inset focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 cursor-pointer transition-colors ${themeClasses.input}`}
              >
                {Object.entries(currencies).map(([code, name]) => (
                  <option
                    key={code}
                    value={code}
                    className="text-slate-900 bg-white"
                  >
                    {code}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Convert Button */}
          <button
            onClick={convert}
            disabled={isLoading || isCurrenciesLoading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3.5 px-4 rounded-lg shadow-sm transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin h-5 w-5" />
                Converting...
              </>
            ) : (
              "Convert Currency"
            )}
          </button>

          {error && (
            <div className="p-3 bg-red-500/10 text-red-600 text-sm rounded-lg border border-red-200 dark:border-red-900/50 text-center animate-pulse">
              {error}
            </div>
          )}

          {/* Result Area */}
          {convertedAmount !== null && !isLoading && !error && (
            <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 text-center animate-in fade-in slide-in-from-bottom-2">
              <p className="text-sm text-slate-500 font-medium mb-1">
                {formatCurrency(amount, fromCurrency)} =
              </p>
              <p
                className={`text-3xl font-bold tracking-tight ${themeClasses.resultText}`}
              >
                {formatCurrency(convertedAmount, toCurrency)}
              </p>
              <p className="text-xs text-slate-400 mt-2">
                Market Rate • 1 {fromCurrency} ={" "}
                {(convertedAmount / amount).toFixed(4)} {toCurrency}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CurrencyConverter;
