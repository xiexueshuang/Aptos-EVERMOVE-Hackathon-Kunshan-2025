import React, { useState } from 'react';
import {
  HeadlineIcon,
  Building,
  DollarSign,
  MessageCircle,
  FileBarChart,
  ClipboardList,
  Clock
} from 'lucide-react';

import CompanyManager from './components/CompanyManager';
import InvestmentDashboard from './components/InvestmentDashboard';
import NegotiationPanel from './components/NegotiationPanel';
import AnalyticsPanel from './components/AnalyticsPanel';
import TransactionLog from './components/TransactionLog';
import { useStore } from './store';

import './index.css';

function App() {
  const { activeTab, setActiveTab, transactionLogs } = useStore();

  const tabs = [
    { id: 'companies', name: '公司管理', icon: <Building size={18} /> },
    { id: 'investments', name: '投资管理', icon: <DollarSign size={18} /> },
    { id: 'negotiations', name: '投资谈判', icon: <MessageCircle size={18} /> },
    { id: 'analytics', name: '数据分析', icon: <FileBarChart size={18} /> },
    { id: 'portfolio', name: '投资组合', icon: <ClipboardList size={18} /> },
    { id: 'logs', name: '交易日志', icon: <Clock size={18} /> }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'companies':
        return <CompanyManager />;
      case 'investments':
        return <InvestmentDashboard />;
      case 'negotiations':
        return <NegotiationPanel />;
      case 'analytics':
        return <AnalyticsPanel />;
      case 'portfolio':
        return <InvestmentDashboard />;
      case 'logs':
        return <TransactionLog />;
      default:
        return <CompanyManager />;
    }
  };

  return (
    <div className="app">
      <header className="header">
        <h1>
          <HeadlineIcon size={32} style={{ marginRight: '0.5rem', verticalAlign: 'middle', color: 'var(--accent-blue)' }} />
          AI巨头投资模拟器
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>模拟NVIDIA、OpenAI、Meta等AI公司之间的投资并购生态</p>
      </header>

      <div className="container">
        <div className="tabs">
          {tabs.map(tab => (
            <div
              key={tab.id}
              className={`tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id as any)}
            >
              <span style={{ marginRight: '0.5rem', display: 'flex', alignItems: 'center' }}>
                {tab.icon}
              </span>
              {tab.name}
            </div>
          ))}
        </div>

        {renderContent()}

        <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
            📊 当前系统状态
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', fontSize: '0.8rem' }}>
            <div className="info-item">
              <span className="info-label">活跃公司</span>
              <span className="info-value">3</span>
            </div>
            <div className="info-item">
              <span className="info-label">待处理谈判</span>
              <span className="info-value">{useStore().negotiations.filter(n => n.status === 'pending').length}</span>
            </div>
            <div className="info-item">
              <span className="info-label">交易日志</span>
              <span className="info-value">{transactionLogs.length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
