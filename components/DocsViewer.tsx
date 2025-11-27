import React from 'react';
import { BITCOIN_RPC_DOCS } from '../constants';
import { FileText } from 'lucide-react';

const DocsViewer: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto h-full flex flex-col">
       <div className="flex items-center space-x-3 mb-6">
           <div className="p-3 bg-slate-800 rounded-lg border border-slate-700">
               <FileText className="w-6 h-6 text-bitcoin-500" />
           </div>
           <div>
               <h2 className="text-2xl font-bold text-white">Library Documentation</h2>
               <p className="text-slate-400">Official reference for python-bitcoinrpc</p>
           </div>
       </div>
       
       <div className="flex-1 bg-slate-900 rounded-xl border border-slate-800 p-6 overflow-auto shadow-md">
         <pre className="font-mono text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">
           {BITCOIN_RPC_DOCS}
         </pre>
       </div>
    </div>
  );
};

export default DocsViewer;