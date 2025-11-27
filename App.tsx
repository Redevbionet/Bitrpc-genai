import React, { useState } from 'react';
import Layout from './components/Layout';
import CodeGenerator from './components/CodeGenerator';
import RpcSimulator from './components/RpcSimulator';
import ChatAssistant from './components/ChatAssistant';
import DocsViewer from './components/DocsViewer';
import { View } from './types';

function App() {
  const [currentView, setCurrentView] = useState<View>(View.GENERATOR);

  const renderView = () => {
    switch (currentView) {
      case View.GENERATOR:
        return <CodeGenerator />;
      case View.SIMULATOR:
        return <RpcSimulator />;
      case View.CHAT:
        return <ChatAssistant />;
      case View.DOCS:
        return <DocsViewer />;
      default:
        return <CodeGenerator />;
    }
  };

  return (
    <Layout currentView={currentView} setCurrentView={setCurrentView}>
      {renderView()}
    </Layout>
  );
}

export default App;