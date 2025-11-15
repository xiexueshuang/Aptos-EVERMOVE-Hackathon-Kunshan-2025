import React from 'react';
import { FileBarChart, PieChart as PieChartIcon, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { useStore } from '../store';

const AnalyticsPanel: React.FC = () => {
  const { getMarketCapData, getInvestmentTimeline, getCompanyHoldings } = useStore();

  const marketCapData = getMarketCapData();
  const investmentTimeline = getInvestmentTimeline();

  const portfolioHoldings = getCompanyHoldings('NVIDIA');

  const COLORS = ['#60a5fa', '#34d399', '#a78bfa', '#f87171', '#fb923c'];

  return (
    <div className="panel full-width">
      <div className="panel-title">
        <FileBarChart size={20} />
        数据分析与可视化
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--accent-blue)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <PieChartIcon size={18} />
            公司市值分布
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={marketCapData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.name}: ${(entry.value / 10000000).toFixed(1)}M`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {marketCapData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => `$${(value / 1000000).toFixed(0)}M`} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--accent-green)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <TrendingUp size={18} />
            NVIDIA 投资组合
          </h3>
          {portfolioHoldings.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={portfolioHoldings}>
                <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                <XAxis dataKey="company" stroke="#cbd5e1" fontSize={12} />
                <YAxis stroke="#cbd5e1" fontSize={12} />
                <Tooltip formatter={(value: number, name: string) => [`$${(value as number).toLocaleString()}`, name === 'value' ? '投资金额' : '股份数量']} />
                <Bar dataKey="value" fill="#34d399" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ height: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
              暂无投资组合数据
            </div>
          )}
        </div>
      </div>

      <div>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--accent-purple)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <TrendingUp size={18} />
          投资时间线
        </h3>
        {investmentTimeline.length > 1 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={investmentTimeline}>
              <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
              <XAxis dataKey="time" stroke="#cbd5e1" fontSize={12} />
              <YAxis stroke="#cbd5e1" fontSize={12} />
              <Tooltip formatter={(value: number) => `$${(value as number).toLocaleString()}`} />
              <Line type="monotone" dataKey="value" stroke="#a78bfa" strokeWidth={2} dot={{ fill: '#a78bfa' }} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
            完成投资操作后将显示时间线
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsPanel;
