import React, { useState } from 'react';
import { MessageCircle, Check, X } from 'lucide-react';
import { useStore } from '../store';

const NegotiationPanel: React.FC = () => {
  const {
    companies,
    negotiations,
    initiateNegotiation,
    respondToNegotiation,
    logTransaction
  } = useStore();

  const [showForm, setShowForm] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState('openai');
  const [selectedTarget, setSelectedTarget] = useState('meta');
  const [shares, setShares] = useState('');
  const [investorName, setInvestorName] = useState('NVIDIA');

  const handleInitiateNegotiation = () => {
    const sharesNum = parseInt(shares);
    if (!sharesNum || sharesNum <= 0) {
      logTransaction({
        type: 'error',
        message: '请输入有效的股份数量'
      });
      return;
    }

    initiateNegotiation(investorName, selectedCompany, selectedTarget, sharesNum);
    setShares('');
    setShowForm(false);
  };

  const handleRespond = (negotiationId: string, accept: boolean) => {
    respondToNegotiation(negotiationId, accept);
  };

  const getStatusBadge = (status: string) => {
    const baseClass = 'status-badge';
    switch (status) {
      case 'pending':
        return <span className={`${baseClass} status-pending`}>待处理</span>;
      case 'accepted':
        return <span className={`${baseClass} status-accepted`}>已接受</span>;
      case 'rejected':
        return <span className={`${baseClass} status-rejected`}>已拒绝</span>;
      default:
        return null;
    }
  };

  return (
    <div className="panel">
      <div className="panel-title">
        <MessageCircle size={20} />
        投资谈判
      </div>

      {!showForm ? (
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          <MessageCircle size={16} />
          发起新谈判
        </button>
      ) : (
        <div>
          <div className="form-group">
            <label>投资者名称</label>
            <input
              type="text"
              value={investorName}
              onChange={(e) => setInvestorName(e.target.value)}
              placeholder="例如: NVIDIA"
              style={{ width: '100%' }}
            />
          </div>

          <div className="form-group">
            <label>目标公司</label>
            <select
              value={selectedTarget}
              onChange={(e) => setSelectedTarget(e.target.value)}
              style={{ width: '100%' }}
            >
              {companies.map(company => (
                <option key={company.id} value={company.id}>
                  {company.name} (股价: ${company.stockPrice})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>拟投资股份数量</label>
            <input
              type="number"
              value={shares}
              onChange={(e) => setShares(e.target.value)}
              placeholder="输入股份数量"
            />
          </div>

          {shares && selectedTarget && (
            <div className="form-group">
              <label>预估投资金额</label>
              <input
                type="text"
                value={`$${(parseInt(shares) * (companies.find(c => c.id === selectedTarget)?.stockPrice || 0)).toLocaleString()}`}
                readOnly
                style={{ color: 'var(--accent-green)', fontWeight: '500' }}
              />
            </div>
          )}

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
            <button className="btn btn-primary" onClick={handleInitiateNegotiation}>
              发起谈判
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

      <div style={{ marginTop: '2rem' }}>
        <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>谈判记录</h3>
        <div className="negotiation-list">
          {negotiations.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '1rem', color: 'var(--text-secondary)' }}>
              暂无谈判记录
            </div>
          ) : (
            [...negotiations].reverse().map(negotiation => (
              <div
                key={negotiation.id}
                className={`negotiation-item negotiation-${negotiation.status}`}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <div>
                    <strong style={{ color: 'var(--accent-blue)' }}>
                      {negotiation.investorId}
                    </strong>
                    <span style={{ margin: '0 0.5rem' }}>→</span>
                    <strong style={{ color: 'var(--accent-green)' }}>
                      {companies.find(c => c.id === negotiation.targetCompanyId)?.name || negotiation.targetCompanyName}
                    </strong>
                  </div>
                  {getStatusBadge(negotiation.status)}
                </div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  股份: {negotiation.shares} | 金额: ${negotiation.totalValue.toLocaleString()}
                </div>
                <div style={{ marginTop: '0.5rem' }}>
                  {negotiation.status === 'pending' && (
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        className="btn btn-success"
                        style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem' }}
                        onClick={() => handleRespond(negotiation.id, true)}
                      >
                        <Check size={14} />
                        接受
                      </button>
                      <button
                        className="btn btn-warning"
                        style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem' }}
                        onClick={() => handleRespond(negotiation.id, false)}
                      >
                        <X size={14} />
                        拒绝
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default NegotiationPanel;
