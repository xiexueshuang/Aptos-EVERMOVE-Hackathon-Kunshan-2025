import { create } from 'zustand';
import {
  AICompany,
  Investment,
  Negotiation,
  Portfolio,
  TransactionLog,
  MarketData,
  NetworkConfig
} from './types';

interface AISimulationStore {
  // Data
  companies: AICompany[];
  investments: Investment[];
  negotiations: Negotiation[];
  transactionLogs: TransactionLog[];
  marketData: MarketData[];
  networkConfig: NetworkConfig;

  // UI State
  activeTab: 'companies' | 'investments' | 'negotiations' | 'charts';
  loading: boolean;
  modalOpen: boolean;
  modalContent: string;

  // Actions
  setActiveTab: (tab: AISimulationStore['activeTab']) => void;
  setLoading: (loading: boolean) => void;
  openModal: (content: string) => void;
  closeModal: () => void;
  logTransaction: (log: Omit<TransactionLog, 'id' | 'timestamp'>) => void;

  // Company Management
  registerCompany: (company: Omit<AICompany, 'id' | 'marketCap'>) => void;
  updateCompanyStockPrice: (companyId: string, newPrice: number) => void;
  getCompanyById: (companyId: string) => AICompany | undefined;

  // Investment Management
  makeDirectInvestment: (investor: string, targetCompanyId: string, shares: number) => void;
  getPortfolio: (investor: string) => Portfolio;
  getTotalInvestmentValue: () => number;
  getAllInvestmentsByInvestor: (investor: string) => Investment[];

  // Negotiation Management
  initiateNegotiation: (
    investor: string,
    companyName: string,
    targetCompanyId: string,
    shares: number
  ) => void;
  respondToNegotiation: (negotiationId: string, accept: boolean) => void;
  getPendingNegotiations: () => Negotiation[];

  // Analytics
  getMarketCapData: () => { name: string; value: number; color: string }[];
  getInvestmentTimeline: () => { time: string; value: number }[];
  getCompanyHoldings: (investor: string) => { company: string; shares: number; value: number }[];
}

export const useStore = create<AISimulationStore>((set, get) => ({
  // Initial Data
  companies: [
    {
      id: 'nvidia',
      name: 'NVIDIA',
      symbol: 'NVDA',
      description: 'AI芯片与GPU领导者',
      address: '0x1234567890abcdef',
      stockPrice: 1000,
      totalShares: 1000000,
      availableShares: 1000000,
      marketCap: 1000000000,
      color: '#76b900'
    },
    {
      id: 'openai',
      name: 'OpenAI',
      symbol: 'OPENAI',
      description: '通用人工智能研究',
      address: '0xabcdef1234567890',
      stockPrice: 5000,
      totalShares: 500000,
      availableShares: 500000,
      marketCap: 2500000000,
      color: '#10a37f'
    },
    {
      id: 'meta',
      name: 'Meta',
      symbol: 'META',
      description: '元宇宙与AI社交平台',
      address: '0xfedcba0987654321',
      stockPrice: 2000,
      totalShares: 800000,
      availableShares: 800000,
      marketCap: 1600000000,
      color: '#0866ff'
    }
  ],

  investments: [],
  negotiations: [],
  transactionLogs: [],

  marketData: [],
  networkConfig: {
    network: 'testnet',
    nodeUrl: 'https://fullnode.testnet.aptoslabs.com/v1',
    accountKey: ''
  },

  // UI State
  activeTab: 'companies',
  loading: false,
  modalOpen: false,
  modalContent: '',

  // Actions
  setActiveTab: (tab) => set({ activeTab: tab }),
  setLoading: (loading) => set({ loading }),

  openModal: (content) => set({ modalOpen: true, modalContent: content }),
  closeModal: () => set({ modalOpen: false, modalContent: '' }),

  logTransaction: (log) =>
    set((state) => ({
      transactionLogs: [
        {
          id: Math.random().toString(36).substr(2, 9),
          timestamp: new Date(),
          ...log
        },
        ...state.transactionLogs.slice(0, 49) // Keep last 50 logs
      ]
    })),

  // Company Management
  registerCompany: (companyData) => {
    const company: AICompany = {
      id: companyData.name.toLowerCase().replace(/\s+/g, '-'),
      marketCap: companyData.stockPrice * companyData.totalShares,
      ...companyData
    };

    set((state) => ({
      companies: [...state.companies, company]
    }));

    get().logTransaction({
      type: 'success',
      message: `AI公司 "${company.name}" 注册成功`,
      details: { company }
    });
  },

  updateCompanyStockPrice: (companyId, newPrice) => {
    const company = get().getCompanyById(companyId);
    if (!company) {
      get().logTransaction({
        type: 'error',
        message: `找不到公司: ${companyId}`
      });
      return;
    }

    const oldPrice = company.stockPrice;

    set((state) => ({
      companies: state.companies.map((c) =>
        c.id === companyId ? { ...c, stockPrice: newPrice, marketCap: newPrice * c.totalShares } : c
      )
    }));

    get().logTransaction({
      type: 'info',
      message: `${company.name} 股价从 $${oldPrice} 更新为 $${newPrice}`
    });
  },

  getCompanyById: (companyId) => {
    const state = get();
    return state.companies.find((c) => c.id === companyId);
  },

  // Investment Management
  makeDirectInvestment: (investor, targetCompanyId, shares) => {
    const company = get().getCompanyById(targetCompanyId);

    if (!company) {
      get().logTransaction({
        type: 'error',
        message: `投资失败：找不到目标公司`
      });
      return;
    }

    if (company.availableShares < shares) {
      get().logTransaction({
        type: 'error',
        message: `投资失败：${company.name} 可用股份不足`
      });
      return;
    }

    const totalValue = shares * company.stockPrice;

    const investment: Investment = {
      id: Math.random().toString(36).substr(2, 9),
      investor,
      companyName: company.name,
      companyId: targetCompanyId,
      shares,
      totalValue,
      timestamp: new Date(),
      type: 'direct'
    };

    set((state) => ({
      companies: state.companies.map((c) =>
        c.id === targetCompanyId ? { ...c, availableShares: c.availableShares - shares } : c
      ),
      investments: [...state.investments, investment],
      marketData: [
        ...state.marketData,
        {
          companyId: targetCompanyId,
          companyName: company.name,
          price: company.stockPrice,
          shares: company.totalShares - (company.availableShares - shares),
          timestamp: new Date()
        }
      ]
    }));

    get().logTransaction({
      type: 'success',
      message: `${investor} 成功投资 ${company.name} ${shares} 股`,
      details: { investment }
    });
  },

  getPortfolio: (investor) => {
    const state = get();
    const investments = state.investments.filter((i) => i.investor === investor);
    const totalValue = investments.reduce((sum, i) => sum + i.totalValue, 0);

    const companyHoldings: Portfolio['companyHoldings'] = {};
    investments.forEach((investment) => {
      if (!companyHoldings[investment.companyId]) {
        companyHoldings[investment.companyId] = { shares: 0, value: 0 };
      }
      companyHoldings[investment.companyId].shares += investment.shares;
      companyHoldings[investment.companyId].value += investment.totalValue;
    });

    return {
      investments,
      totalValue,
      companyHoldings
    };
  },

  getAllInvestmentsByInvestor: (investor) => {
    return get().investments.filter((i) => i.investor === investor);
  },

  getTotalInvestmentValue: () => {
    return get().investments.reduce((sum, i) => sum + i.totalValue, 0);
  },

  // Negotiation Management
  initiateNegotiation: (investor, companyName, targetCompanyId, shares) => {
    const targetCompany = get().getCompanyById(targetCompanyId);

    if (!targetCompany) {
      get().logTransaction({
        type: 'error',
        message: `谈判失败：找不到目标公司`
      });
      return;
    }

    if (targetCompany.availableShares < shares) {
      get().logTransaction({
        type: 'error',
        message: `谈判失败：${targetCompany.name} 可用股份不足`
      });
      return;
    }

    const pricePerShare = targetCompany.stockPrice;
    const totalValue = shares * pricePerShare;

    const negotiation: Negotiation = {
      id: Math.random().toString(36).substr(2, 9),
      investorId: investor,
      companyName: companyName,
      targetCompanyId: targetCompanyId,
      targetCompanyName: targetCompany.name,
      shares,
      status: 'pending',
      pricePerShare,
      timestamp: new Date(),
      totalValue
    };

    set((state) => ({ negotiations: [...state.negotiations, negotiation] }));

    get().logTransaction({
      type: 'info',
      message: `${investor} 向 ${targetCompany.name} 发起投资谈判`,
      details: { negotiation }
    });
  },

  respondToNegotiation: (negotiationId, accept) => {
    const negotiation = get().negotiations.find((n) => n.id === negotiationId);

    if (!negotiation) {
      get().logTransaction({
        type: 'error',
        message: `找不到谈判: ${negotiationId}`
      });
      return;
    }

    if (negotiation.status !== 'pending') {
      get().logTransaction({
        type: 'error',
        message: `谈判已处理，无法再次操作`
      });
      return;
    }

    const newStatus = accept ? 'accepted' : 'rejected';

    if (accept) {
      const investment: Investment = {
        id: Math.random().toString(36).substr(2, 9),
        investor: negotiation.investorId,
        companyName: negotiation.targetCompanyName,
        companyId: negotiation.targetCompanyId,
        shares: negotiation.shares,
        totalValue: negotiation.totalValue,
        timestamp: new Date(),
        type: 'negotiated'
      };

      set((state) => ({
        companies: state.companies.map((c) =>
          c.id === negotiation.targetCompanyId
            ? { ...c, availableShares: c.availableShares - negotiation.shares }
            : c
        ),
        investments: [...state.investments, investment],
        negotiations: state.negotiations.map((n) =>
          n.id === negotiationId ? { ...n, status: newStatus } : n
        )
      }));

      get().logTransaction({
        type: 'success',
        message: `谈判已接受：${negotiation.investorId} 投资 ${negotiation.targetCompanyName}`
      });
    } else {
      set((state) => ({
        negotiations: state.negotiations.map((n) =>
          n.id === negotiationId ? { ...n, status: newStatus } : n
        )
      }));

      get().logTransaction({
        type: 'info',
        message: `谈判已拒绝：${negotiation.investorId} ❌ ${negotiation.targetCompanyName}`
      });
    }
  },

  getPendingNegotiations: () => {
    return get().negotiations.filter((n) => n.status === 'pending');
  },

  // Analytics
  getMarketCapData: () => {
    return get().companies.map((c) => ({
      name: c.name,
      value: c.marketCap,
      color: c.color
    }));
  },

  getInvestmentTimeline: () => {
    const sorted = [...get().investments].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    let cumulative = 0;

    return sorted.map((in) => {
      cumulative += in.totalValue;
      return {
        time: in.timestamp.toLocaleTimeString(),
        value: cumulative
      };
    });
  },

  getCompanyHoldings: (investor) => {
    const portfolio = get().getPortfolio(investor);
    return Object.entries(portfolio.companyHoldings).map(([companyId, data]) => {
      const company = get().getCompanyById(companyId);
      return {
        company: company?.name || companyId,
        shares: data.shares,
        value: data.value
      };
    });
  }
}));
