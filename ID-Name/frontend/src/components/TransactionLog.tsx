import React, { useState } from 'react';
import { CheckCircle, XCircle, Info, Clock, AlertCircle } from 'lucide-react';
import { useStore } from '../store';

const TransactionLog: React.FC = () => {
  const { transactionLogs } = useStore();
  const [filter, setFilter] = useState<'all' | 'success' | 'error' | 'info'>('all');

  const getLogIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle size={16} color="#34d399" />;
      case 'error':
        return <XCircle size={16} color="#f87171" />;
      case 'info':
        return <Info size={16} color="#60a5fa" />;
      default:
        return <AlertCircle size={16} color="#a78bfa" />;
    }
  };

  const filteredLogs = transactionLogs.filter(log => filter === 'all' || log.type === filter);

  return (
    <div className="panel full-width">
      <div className="panel-title">
        <Clock size={20} />
        交易日志
      </div>

      <div style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem' }}>
        <button
          className={`btn ${filter === 'all' ? 'btn-primary' : ''}`}
          style={filter !== 'all' ? { background: 'var(--bg-tertiary)', color: 'var(--text-secondary)' } : {}}
          onClick={() => setFilter('all')}
        >
          全部
        </button>
        <button
          className={`btn ${filter === 'success' ? 'btn-success' : ''}`}
          style={filter !== 'success' ? { background: 'var(--bg-tertiary)', color: 'var(--text-secondary)' } : {}}
          onClick={() => setFilter('success')}
        >
          成功
        </button>
        <button
          className={`btn ${filter === 'info' ? 'btn-primary' : ''}`}
          style={filter !== 'info' ? { background: 'var(--bg-tertiary)', color: 'var(--text-secondary)' } : {}}
          onClick={() => setFilter('info')}
        >
          信息
        </button>
        <button
          className={`btn ${filter === 'error' ? 'btn-warning' : ''}`}
          style={filter !== 'error' ? { background: 'var(--bg-tertiary)', color: 'var(--text-secondary)' } : {}}
          onClick={() => setFilter('error')}
        >
          错误
        </button>
      </div>

      <div className="transaction-log">
        {filteredLogs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
            暂无交易记录
          </div>
        ) : (
          filteredLogs.map(log => (
            <div key={log.id} className={`log-item log-${log.type}`} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
              <div style={{ marginTop: '2px' }}>{getLogIcon(log.type)}</div>
              <div style={{ flex: 1 }}>
                <div>{log.message}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  {log.timestamp.toLocaleString()}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TransactionLog;
