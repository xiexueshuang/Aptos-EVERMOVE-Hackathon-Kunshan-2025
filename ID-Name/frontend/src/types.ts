export interface AICompany {
  id: string;
  name: string;
  symbol: string;
  description: string;
  address: string;
  stockPrice: number;
  totalShares: number;
  availableShares: number;
  marketCap: number;
  color: string;
}

export interface Investment {
  id: string;
  investor: string;
  companyName: string;
  companyId: string;
  shares: number;
  totalValue: number;
  timestamp: Date;
  type: 'direct' | 'negotiated';
}

export interface Negotiation {
  id: string;
  investorId: string;
  companyName: string;
  targetCompanyId: string;
  targetCompanyName: string;
  shares: number;
  status: 'pending' | 'accepted' | 'rejected';
  pricePerShare: number;
  timestamp: Date;
  totalValue: number;
}

export interface Portfolio {
  investments: Investment[];
  totalValue: number;
  companyHoldings: {
    [companyId: string]: {
      shares: number;
      value: number;
    };
  };
}

export interface TransactionLog {
  id: string;
  type: 'info' | 'success' | 'error';
  message: string;
  details?: any;
  timestamp: Date;
}

export interface MarketData {
  companyId: string;
  companyName: string;
  price: number;
  shares: number;
  timestamp: Date;
}

export interface NetworkConfig {
  network: 'devnet' | 'testnet' | 'mainnet';
  nodeUrl: string;
  accountKey: string;
}
