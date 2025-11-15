import React, { useState } from 'react';
import { DollarSign, TrendingUp, Wallet } from 'lucide-react';
import { useStore } from '../store';
import { AICompany, Investment } from '../types';

const InvestmentDashboard: React.FC = () => {
  const {
    companies,
    makeDirectInvestment,
    investments,
    logTransaction
  } = useStore();

  const [showForm, setShowForm] = useState(false);
  const [selectedInvestor, setSelectedInvestor] = useState('NVIDIA');
  const [selectedCompany, setSelectedCompany] = useState('openai');
  const [shares, setShares] = useState('');

  const investors = ['NVIDIA', 'OpenAI', 'Meta', '其他投资者'];

  const handleInvest = () => {
    const sharesNum = parseInt(shares);
    if (!sharesNum || sharesNum <= 0) {
      logTransaction({
        type: 'error',
        message: '请输入有效的股份数量'
      });
      return;
    }

    const investor = selectedInvestor === '其他投资者' ? '匿名投资者' : selectedInvestor;

    makeDirectInvestment(investor, selectedCompany, sharesNum);
    setShares('');
    setShowForm(false);
  };

  const getInvestmentsByCompany = (companyId: string) => {
    return investments.filter(inv => inv.companyId === companyId);
  };

  const getTotalInvestedInCompany = (companyId: string) => {
    const companyInvestments = getInvestmentsByCompany(companyId);
    return companyInvestments.reduce((sum, inv) => sum + inv.totalValue, 0);
  };

  return (
    <div className="panel">
      <div className="panel-title">
        <DollarSign size={20} />
        投资面板
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.75rem', color: 'var(--accent-purple)' }}>
          <Wallet size={16} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }}
          /> 全球投资统计
        </h3>
        <div className="company-info">
          <div className="info-item">
            <span className="info-label">总投资价值</span>
            <span className="info-value" style={{ color: 'var(--accent-green)' }}>
              ${(companies.reduce((sum, c) => {
                const invested = c.totalShares - c.availableShares;
                return sum + (invested * c.stockPrice);
              }, 0) / 1000000).toFixed(1)}M
            </span>
          </div>
          <div className="info-item">
            <span className="info-label">已投资公司</span>
            <span className="info-value">
              {companies.filter(c => c.availableShares < c.totalShares).length} / {companies.length}
            </span>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.75rem', color: 'var(--text-secondary)' }}>
          各公司投资情况
        </h3>
        <div className="investment-list">
          {companies.map(company => {
            const companyInvestments = getInvestmentsByCompany(company.id);
            const totalValue = getTotalInvestedInCompany(company.id);
            const totalShares = companyInvestments.reduce((sum, inv) => sum + inv.shares, 0);

            if (companyInvestments.length === 0) return null;

            return (
              <div key={company.id} className="investment-item">
                <div className="investment-header">
                  <span className="company-name-investment">{company.name}</span>
                  <span className="investment-amount">
                    ${totalValue.toLocaleString()} ({totalShares} 股)
                  </span>
                </div>
                <div className="company-info">
                  {companyInvestments.slice(0, 2).map(inv => (
                    <div key={inv.id} className="info-item">
                      <span className="info-label">投资者</span>
                      <span className="info-value">{inv.investor}</span>
                    </div>
                  ))}
                  {companyInvestments.length > 2 && (
                    <div className="info-item">
                      <span className="info-label">更多</span>
                      <span className="info-value">+{companyInvestments.length - 2}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          {investments.length === 0 && (
            <div style={{ textAlign: 'center', padding: '1rem', color: 'var(--text-secondary)' }}>
              暂无投资记录
            </div>
          )}
        </div>
      </div>

      {!showForm ? (
        <button className="btn btn-success" onClick={() => setShowForm(true)}>
          <TrendingUp size={16} />
          创建新投资
        </button>
      ) : (
        <div>
          <div className="form-group">
            <label>投资者</label>
            <select
              value={selectedInvestor}
              onChange={(e) => setSelectedInvestor(e.target.value)}
              style={{ width: '100%' }}
            >
              {investors.map(inv => (
                <option key={inv} value={inv}>{inv}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>投资目标公司</label>
            <select
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
              style={{ width: '100%' }}
            >
              {companies.map(company => (
                <option key={company.id} value={company.id}>
                  {company.name} (股价: ${company.stockPrice})
                </option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>股份数量</label>
              <input
                type="number"
                min="1"
                max={companies.find(c => c.id === selectedCompany)?.availableShares}
                value={shares}
                onChange={(e) => setShares(e.target.value)}
                placeholder="输入股份数量"
              />
            </div>
            {shares && companies.find(c => c.id === selectedCompany) && (
              <div className="form-group">
                <label>预估投资额</label>
                <input
                  type="text"
                  value={`$${(
                    parseInt(shares) *
                    (companies.find(c => c.id === selectedCompany)?.stockPrice || 0)
                  ).toLocaleString()}`}
                  readOnly
                  style={{ color: 'var(--accent-green)', fontWeight: '500' }}
                />
              </div>
            )}
          </div>

          {selectedCompany && companies.find(c => c.id === selectedCompany) && (
            <div className="form-group">
              <label>可用股份</label>
              <input
                type="text"
                value={`${companies.find(c => c.id === selectedCompany)?.availableShares.toLocaleString()} 股`}
                readOnly
                style={{ color: 'var(--accent-blue)' }}
              />
            </div>
          )}

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
            <button className="btn btn-success" onClick={handleInvest}>
              <TrendingUp size={16} />
              确认投资
            </button>
            <button
              className="btn"
              style={{
                background: 'var(--bg-tertiary)',
                color: 'var(--text-secondary)'
              }}
              onClick={() => {
                setShowForm(false);
                setShares('');
              }}
            >
              取消
            </button>
          </div>
        </div>
      )}

      <div style={{ marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
        <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem', color: 'var(--text-secondary)' }}>
          最近的投资记录
        </h3>
        {investments.length > 0 ? (
          <div className="investment-list">
            {investments.slice(-3).reverse().map(inv => (
              <div key={inv.id} className="investment-item">
                <div className="investment-header">
                  <span className="company-name-investment">{inv.investor}</span>
                  <span className="investment-amount" style={{ fontSize: '0.75rem' }}>
                    {inv.timestamp.toLocaleTimeString()}
                  </span>
                </div>
                <div style={{ fontSize: '0.85rem' }}>
                  投资 {inv.companyName}: {inv.shares} 股 (${inv.totalValue.toLocaleString()})
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            暂无投资记录
          </div>
        )}
      </div>
    </div>
  );
};

export default InvestmentDashboard;
