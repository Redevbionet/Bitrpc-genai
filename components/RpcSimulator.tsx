import React, { useState } from 'react';
import { simulateRpcResponse, simulateBatchRpcResponse } from '../services/geminiService';
import { COMMON_RPC_METHODS } from '../constants';
import { Play, RotateCcw, Search, Database, Layers, Plus, Trash2 } from 'lucide-react';

export default function RpcSimulator() {
  const [mode, setMode] = useState<'single' | 'batch'>('single');
  
  // Single Mode State
  const [method, setMethod] = useState('getblockchaininfo');
  const [params, setParams] = useState('');
  
  // Batch Mode State
  const [batchCommands, setBatchCommands] = useState<{id: string, method: string, params: string}[]>([
    { id: '1', method: 'getblockhash', params: '0' },
    { id: '2', method: 'getblock', params: '000000000019d6689c085ae165831e934ff763ae46a2a6c172b3f1b60a8ce26f' }
  ]);

  const [response, setResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Helper to find description
  const selectedMethodDescription = COMMON_RPC_METHODS.find(m => m.name === method)?.description;

  const handleSimulate = async () => {
    setIsLoading(true);
    setResponse(null);

    if (mode === 'single') {
        if (!method) {
            setIsLoading(false);
            return;
        }
        const result = await simulateRpcResponse(method, params);
        setResponse(result);
    } else {
        // Filter out empty methods
        const validCommands = batchCommands.filter(c => c.method.trim() !== '');
        if (validCommands.length === 0) {
             setIsLoading(false);
             return;
        }
        const result = await simulateBatchRpcResponse(validCommands);
        setResponse(result);
    }
    
    setIsLoading(false);
  };

  const handleMethodSelect = (m: string) => {
    if (mode === 'single') {
        setMethod(m);
        setResponse(null);
    } else {
        // Add to batch
        setBatchCommands(prev => [
            ...prev,
            { id: Date.now().toString(), method: m, params: '' }
        ]);
    }
  };

  const updateBatchCommand = (id: string, field: 'method' | 'params', value: string) => {
    setBatchCommands(prev => prev.map(cmd => 
        cmd.id === id ? { ...cmd, [field]: value } : cmd
    ));
  };

  const removeBatchCommand = (id: string) => {
    setBatchCommands(prev => prev.filter(cmd => cmd.id !== id));
  };

  const addBatchCommand = () => {
    setBatchCommands(prev => [
        ...prev,
        { id: Date.now().toString(), method: '', params: '' }
    ]);
  };

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
            <h2 className="text-3xl font-bold text-white mb-2">RPC Simulator</h2>
            <p className="text-slate-400">Mock Bitcoin Core JSON-RPC responses.</p>
        </div>
        
        <div className="bg-slate-900 p-1 rounded-lg border border-slate-800 flex items-center">
            <button
                onClick={() => { setMode('single'); setResponse(null); }}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    mode === 'single' ? 'bg-bitcoin-500 text-white' : 'text-slate-400 hover:text-white'
                }`}
            >
                Single Request
            </button>
            <button
                onClick={() => { setMode('batch'); setResponse(null); }}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center space-x-2 ${
                    mode === 'batch' ? 'bg-bitcoin-500 text-white' : 'text-slate-400 hover:text-white'
                }`}
            >
                <Layers className="w-4 h-4" />
                <span>Batch</span>
            </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Control Panel */}
        <div className="lg:col-span-4 space-y-6">
            
          {/* Method Selection (Common) */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
             <div className="p-4 border-b border-slate-800 bg-slate-900/50">
                <h3 className="font-semibold text-slate-200 flex items-center">
                    <Search className="w-4 h-4 mr-2 text-bitcoin-500" />
                    Common Methods {mode === 'batch' && <span className="text-xs text-slate-500 ml-2 font-normal">(Click to add)</span>}
                </h3>
             </div>
             <div className="max-h-64 overflow-y-auto p-2">
                {COMMON_RPC_METHODS.map((m) => (
                    <button
                        key={m.name}
                        onClick={() => handleMethodSelect(m.name)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all mb-1 group ${
                            mode === 'single' && method === m.name 
                            ? 'bg-bitcoin-500 text-white' 
                            : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                        }`}
                    >
                        <div className="font-mono font-medium">{m.name}</div>
                        <div className={`text-xs truncate ${mode === 'single' && method === m.name ? 'text-bitcoin-100' : 'text-slate-600 group-hover:text-slate-500'}`}>
                            {m.description}
                        </div>
                    </button>
                ))}
             </div>
          </div>
          
          {/* Input Panel */}
          <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-sm space-y-4">
             {mode === 'single' ? (
                 <>
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Method</label>
                        <input 
                            type="text" 
                            value={method}
                            onChange={(e) => setMethod(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-200 font-mono text-sm focus:ring-1 focus:ring-bitcoin-500 outline-none"
                            placeholder="e.g. getblock"
                        />
                        {selectedMethodDescription && (
                            <p className="mt-2 text-xs text-slate-400 italic">
                                {selectedMethodDescription}
                            </p>
                        )}
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Params (Optional)</label>
                        <input 
                            type="text" 
                            value={params}
                            onChange={(e) => setParams(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-200 font-mono text-sm focus:ring-1 focus:ring-bitcoin-500 outline-none placeholder:text-slate-700"
                            placeholder='e.g. "000000000019d6689..."'
                        />
                    </div>
                 </>
             ) : (
                 <div className="space-y-3">
                    <div className="flex justify-between items-center mb-2">
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Batch Commands</label>
                        <span className="text-xs text-slate-600">{batchCommands.length} item(s)</span>
                    </div>
                    
                    <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                        {batchCommands.map((cmd, idx) => (
                            <div key={cmd.id} className="bg-slate-900 p-2 rounded border border-slate-700 relative group">
                                <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button 
                                        onClick={() => removeBatchCommand(cmd.id)}
                                        className="text-slate-600 hover:text-red-500"
                                    >
                                        <Trash2 className="w-3 h-3" />
                                    </button>
                                </div>
                                <div className="mb-2 pr-6">
                                    <input 
                                        type="text" 
                                        value={cmd.method}
                                        onChange={(e) => updateBatchCommand(cmd.id, 'method', e.target.value)}
                                        className="w-full bg-transparent text-slate-200 font-mono text-sm outline-none placeholder:text-slate-700"
                                        placeholder="Method"
                                    />
                                </div>
                                <div>
                                    <input 
                                        type="text" 
                                        value={cmd.params}
                                        onChange={(e) => updateBatchCommand(cmd.id, 'params', e.target.value)}
                                        className="w-full bg-slate-900/50 rounded px-2 py-1 text-slate-400 font-mono text-xs outline-none focus:bg-slate-900 placeholder:text-slate-800"
                                        placeholder="Params (optional)"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={addBatchCommand}
                        className="w-full py-2 border border-dashed border-slate-700 rounded-lg text-slate-500 hover:text-slate-300 hover:border-slate-500 transition-all flex items-center justify-center text-sm"
                    >
                        <Plus className="w-4 h-4 mr-1" />
                        Add Command
                    </button>
                 </div>
             )}
             
             <button
                onClick={handleSimulate}
                disabled={isLoading || (mode === 'single' && !method) || (mode === 'batch' && batchCommands.length === 0)}
                className={`w-full py-3 rounded-lg flex items-center justify-center font-bold text-white transition-all
                    ${isLoading ? 'bg-slate-700' : 'bg-bitcoin-600 hover:bg-bitcoin-500'}`}
             >
                {isLoading ? <RotateCcw className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5" />}
                <span className="ml-2">{isLoading ? 'Simulating...' : `Send ${mode === 'batch' ? 'Batch ' : ''}Request`}</span>
             </button>
          </div>
        </div>

        {/* Right Output Panel */}
        <div className="lg:col-span-8">
            <div className="bg-slate-900 rounded-xl border border-slate-800 h-full min-h-[500px] flex flex-col shadow-md">
                <div className="px-4 py-3 border-b border-slate-800 bg-slate-950/30 flex items-center justify-between">
                    <span className="text-xs font-mono text-slate-500">JSON-RPC Output</span>
                    {response && (
                        <div className="flex items-center space-x-2 text-xs">
                             <span className="w-2 h-2 rounded-full bg-green-500"></span>
                             <span className="text-green-500">200 OK</span>
                        </div>
                    )}
                </div>
                <div className="flex-1 bg-slate-950 p-4 overflow-auto font-mono text-sm">
                    {response ? (
                        <pre className="text-blue-300">
                            {response}
                        </pre>
                    ) : (
                         <div className="h-full flex flex-col items-center justify-center text-slate-700">
                            <Database className="w-16 h-16 mb-4 opacity-20" />
                            <p>No response yet</p>
                            {mode === 'batch' && <p className="text-xs mt-2 text-slate-600">Simulating batch requests returns a JSON array.</p>}
                        </div>
                    )}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}