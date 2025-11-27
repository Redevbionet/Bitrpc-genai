import React, { useState } from 'react';
import { generateScript } from '../services/geminiService';
import { Play, Copy, Check, Download, Loader2, Terminal } from 'lucide-react';

const CodeGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsLoading(true);
    const result = await generateScript(prompt);
    setCode(result);
    setIsLoading(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/x-python' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bitcoin_script.py';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <header>
        <h2 className="text-3xl font-bold text-white mb-2">Script Generator</h2>
        <p className="text-slate-400">Describe the Bitcoin task you want to perform, and the AI will generate a ready-to-use Python script using <code className="text-bitcoin-400">python-bitcoinrpc</code>.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        {/* Input Section */}
        <div className="lg:col-span-1 flex flex-col space-y-4">
          <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-sm flex-1 flex flex-col">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Task Description
            </label>
            <textarea
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-slate-200 focus:ring-2 focus:ring-bitcoin-500 focus:border-transparent outline-none resize-none flex-1 transition-all placeholder:text-slate-600"
              placeholder="e.g. Connect to a local node on port 8332, get the last 100 blocks, and calculate the average block time."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            
            <div className="mt-4">
                <p className="text-xs text-slate-500 mb-3">
                    Example Prompts:
                </p>
                <div className="flex flex-wrap gap-2">
                    <button 
                        onClick={() => setPrompt("Batch fetch the last 10 blocks and print their transaction counts.")}
                        className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded border border-slate-700 transition-colors"
                    >
                        Batch Fetch
                    </button>
                    <button 
                         onClick={() => setPrompt("Get network info and print the number of connections with a timestamp log.")}
                        className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded border border-slate-700 transition-colors"
                    >
                        Network Info
                    </button>
                </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={isLoading || !prompt.trim()}
              className={`mt-4 w-full py-3 px-4 rounded-lg flex items-center justify-center font-semibold text-white transition-all shadow-lg
                ${isLoading || !prompt.trim() 
                  ? 'bg-slate-700 cursor-not-allowed opacity-50' 
                  : 'bg-gradient-to-r from-bitcoin-600 to-bitcoin-500 hover:from-bitcoin-500 hover:to-bitcoin-400 shadow-bitcoin-500/20'
                }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 mr-2 fill-current" />
                  Generate Script
                </>
              )}
            </button>
          </div>
        </div>

        {/* Output Section */}
        <div className="lg:col-span-2 flex flex-col h-full min-h-[400px]">
          <div className="bg-slate-900 rounded-xl border border-slate-800 flex flex-col h-full overflow-hidden relative shadow-md">
            <div className="flex items-center justify-between px-4 py-3 bg-slate-950/50 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                <span className="ml-2 text-xs font-mono text-slate-500">script.py</span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={copyToClipboard}
                  className="p-1.5 hover:bg-slate-800 rounded-md text-slate-400 hover:text-white transition-colors"
                  title="Copy Code"
                >
                  {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </button>
                <button
                  onClick={handleDownload}
                  className="p-1.5 hover:bg-slate-800 rounded-md text-slate-400 hover:text-white transition-colors"
                  title="Download File"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="flex-1 bg-slate-950 overflow-auto custom-scrollbar relative">
              {code ? (
                <pre className="p-4 text-sm font-mono leading-relaxed">
                  <code className="text-emerald-400 whitespace-pre">
                    {code}
                  </code>
                </pre>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-600 p-8 text-center">
                    <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mb-4">
                        <Terminal className="w-8 h-8 opacity-50" />
                    </div>
                  <p className="text-lg font-medium">No script generated yet</p>
                  <p className="text-sm">Enter a prompt and click Generate to see the magic happen.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeGenerator;