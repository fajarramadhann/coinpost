import React, { createContext, useState, useContext, ReactNode } from 'react';

interface WalletContextType {
  isConnected: boolean;
  address: string | null;
  balance: string;
  connect: () => Promise<void>;
  disconnect: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider = ({ children }: WalletProviderProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState('0');

  // Mock wallet connection for demo purposes
  // In a real app, this would connect to MetaMask or another wallet provider
  const connect = async () => {
    try {
      // Simulating wallet connection
      setIsConnected(true);
      setAddress('0x1234...abcd');
      setBalance('1.23 ETH');
    } catch (error) {
      console.error('Error connecting wallet:', error);
    }
  };

  const disconnect = () => {
    setIsConnected(false);
    setAddress(null);
    setBalance('0');
  };

  return (
    <WalletContext.Provider
      value={{
        isConnected,
        address,
        balance,
        connect,
        disconnect
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};