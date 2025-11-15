import React, { useState } from 'react';
import { Plus, Building, TrendingUp, Users } from 'lucide-react';
import { useStore } from '../store';
import clsx from 'clsx';

const CompanyManager: React.FC = () => {
  const { companies, registerCompany, logTransaction } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [newCompany, setNewCompany] = useState({
    name: '',
    symbol: '',
    description: '',
    address: '',
    stockPrice: 1000,
    totalShares: 100000
  });

  const handleRegister = () => {
    if (!newCompany.name || !newCompany.symbol) {
      logTransaction({
        type: 'error',
        message: '请输入完整的公司信息'
      });
      return;
    }

    registerCompany({
      ...newCompany,
      address: newCompany.address || `0x${Math.random().toString(16).substr(2, 16)}`
    });

    setNewCompany({
      name: '',
      symbol: '',
      description: '',
      address: '',
      stockPrice: 1000,
      totalShares: 100000
    });
    setShowForm(false);
  };

  return (
    <div className="panel full-width">
      <div className="panel-title">
        <Building size={20} /> AI 公司管理
      </div>

      <div className="company-list">
        {companies.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
            <Building size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
            <p>暂无注册公司，请先注册AI公司</p>
          </div>
        ) : (
          companies.map((company) => {
            const sharesSold = company.totalShares - company.availableShares;
            const ownership = ((sharesSold / company.totalShares) * 100).toFixed(1);

            return (
              <div key={company.id} className="company-card">
                <div className="company-header">
                  <div>
                    <div className="company-name">{company.name}</div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                      {company.symbol} • {company.address.slice(0, 8)}...
                    </div>
                  </div>
                </div>

                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                  {company.description}
                </p>

                <div className="company-info">
                  <div className="info-item">
                    <span className="info-label">股价</span>
                    <span className="info-value">${company.stockPrice.toLocaleString()}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">市值</span>
                    <span className="info-value">${(company.marketCap / 1000000).toFixed(1)}M</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">流通股份</span>
                    <span className="info-value">
                      {sharesSold.toLocaleString()} / {company.totalShares.toLocaleString()}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">可用股份</span>
                    <span className="info-value">{company.availableShares.toLocaleString()}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">已被投资</span>
                    <span className="info-value">{ownership}%</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
        {!showForm ? (
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>
            <Plus size={16} /> 注册新公司
          </button>
        ) : (
          <div>
            <div className="form-row">
              <div className="form-group">
                <label>公司名称</label>
                <input
                  type="text"
                  placeholder="例如: Anthropic"
                  value={newCompany.name}
                  onChange={(e) => setNewCompany({ ...newCompany, name: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>股票代码</label>
                <input
                  type="text"
                  placeholder="例如: ANTH"
                  value={newCompany.symbol}
                  onChange={(e) => setNewCompany({ ...newCompany, symbol: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label>公司简介</label>
              <input
                type="text"
                placeholder="公司描述"
                value={newCompany.description}
                onChange={(e) => setNewCompany({ ...newCompany, description: e.target.value })}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>股价 ($)</label>
                <input
                  type="number"
                  min="1"
                  value={newCompany.stockPrice}
                  onChange={(e) => setNewCompany({ ...newCompany, stockPrice: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="form-group">
                <label>总股份</label>
                <input
                  type="number"
                  min="1"
                  value={newCompany.totalShares}
                  onChange={(e) => setNewCompany({ ...newCompany, totalShares: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
              <button className="btn btn-success" onClick={handleRegister}>
                <Plus size={16} /> 确认注册
              </button>
              <button
                className="btn"
                style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}
                onClick={() => setShowForm(false)}
              >
                取消
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyManager;
