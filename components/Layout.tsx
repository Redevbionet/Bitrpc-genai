import React from 'react';
import { View } from '../types';
import { Terminal, Activity, Book, MessageSquare, Menu, X, Bitcoin } from 'lucide-react';

interface LayoutProps {
  currentView: View;
  setCurrentView: (view: View) => void;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ currentView, setCurrentView, children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const navItems = [
    { view: View.GENERATOR, label: 'Script Generator', icon: Terminal },
    { view: View.SIMULATOR, label: 'RPC Simulator', icon: Activity },
    { view: View.CHAT, label: 'Assistant', icon: MessageSquare },
    { view: View.DOCS, label: 'Library Docs', icon: Book },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col md:flex-row font-sans">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900 sticky top-0 z-20">
        <div className="flex items-center space-x-2">
          <Bitcoin className="w-8 h-8 text-bitcoin-500" />
          <span className="font-bold text-lg tracking-tight text-white">BitRPC GenAI</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-400 hover:text-white">
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`
        fixed md:sticky top-0 left-0 z-10 h-screen w-64 bg-slate-900 border-r border-slate-800 flex flex-col transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-6 hidden md:flex items-center space-x-3 border-b border-slate-800">
          <Bitcoin className="w-8 h-8 text-bitcoin-500" />
          <div>
            <h1 className="font-bold text-xl text-white tracking-tight">BitRPC GenAI</h1>
            <p className="text-xs text-slate-500">v1.0.0 // React + Gemini</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.view}
              onClick={() => {
                setCurrentView(item.view);
                setIsMobileMenuOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                currentView === item.view
                  ? 'bg-bitcoin-500/10 text-bitcoin-500 border border-bitcoin-500/20 shadow-[0_0_15px_rgba(247,147,26,0.1)]'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
              }`}
            >
              <item.icon className={`w-5 h-5 ${currentView === item.view ? 'text-bitcoin-500' : 'text-slate-500'}`} />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
            <div className="bg-slate-950 p-3 rounded border border-slate-800 text-xs text-slate-500">
                <p className="font-semibold text-slate-400 mb-1">Status</p>
                <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    <span>Gemini API: Connected</span>
                </div>
            </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto h-[calc(100vh-64px)] md:h-screen p-4 md:p-8 relative">
        <div className="max-w-6xl mx-auto h-full">
            {children}
        </div>
      </main>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-0 md:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};

export default Layout;