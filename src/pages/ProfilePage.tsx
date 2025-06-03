import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Wallet, CreditCard, Clock, Settings, User, ShoppingBag, Heart } from 'lucide-react';
import { useWallet } from '../context/WalletContext';
import MarketCard from '../components/marketplace/MarketCard';
import { CONTENT } from '../data/mockData';

const ProfilePage: React.FC = () => {
  const { isConnected, address, balance, connect } = useWallet();
  const [activeTab, setActiveTab] = useState('collected');

  const tabs = [
    { id: 'collected', label: 'Collected', icon: <ShoppingBag size={18} /> },
    { id: 'created', label: 'Created', icon: <User size={18} /> },
    { id: 'favorite', label: 'Favorite', icon: <Heart size={18} /> },
    { id: 'activity', label: 'Activity', icon: <Clock size={18} /> },
  ];

  const collectibles = CONTENT.slice(0, 4);
  const created = CONTENT.slice(4, 6);
  const favorites = CONTENT.slice(6, 10);

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-24 h-24 rounded-full bg-primary flex items-center justify-center border-2 border-text shadow-[4px_4px_0px_0px_rgba(16,48,69,1)]"
        >
          <Wallet size={32} className="text-text" />
        </motion.div>
        <h1 className="text-3xl font-bold text-center">Connect Your Wallet</h1>
        <p className="text-center max-w-md">
          Connect your wallet to view your profile, collections, and activities.
        </p>
        <motion.button
          onClick={connect}
          className="btn btn-primary text-text"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Connect Wallet
        </motion.button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="card p-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center border-2 border-text">
              <User size={24} className="text-text" />
            </div>
            <div>
              <p className="text-sm opacity-70">Wallet Address</p>
              <h1 className="text-xl font-bold">{address}</h1>
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="bg-primary-light p-4 rounded-xl border-2 border-text">
              <p className="text-sm opacity-70">Balance</p>
              <p className="font-bold">{balance}</p>
            </div>
            
            <button className="btn btn-primary text-text h-[fit-content] flex items-center gap-2">
              <CreditCard size={18} />
              Add Funds
            </button>
            
            <button className="p-2 rounded-full bg-white border-2 border-text h-[fit-content]">
              <Settings size={20} />
            </button>
          </div>
        </div>
      </div>
      
      <div className="border-b-2 border-text">
        <div className="flex overflow-x-auto space-x-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 font-bold border-b-4 transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-primary text-text'
                  : 'border-transparent text-text/70 hover:text-text'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="min-h-[50vh]">
        {activeTab === 'collected' && (
          <>
            {collectibles.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {collectibles.map((item) => (
                  <MarketCard key={item.id} item={item} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <ShoppingBag size={48} className="mx-auto mb-4 text-secondary" />
                <h3 className="text-2xl font-bold mb-2">No collectibles yet</h3>
                <p className="text-lg mb-6">Start collecting from your favorite creators</p>
                <button className="btn btn-primary text-text">Explore Marketplace</button>
              </div>
            )}
          </>
        )}

        {activeTab === 'created' && (
          <>
            {created.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {created.map((item) => (
                  <MarketCard key={item.id} item={item} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <User size={48} className="mx-auto mb-4 text-secondary" />
                <h3 className="text-2xl font-bold mb-2">No creations yet</h3>
                <p className="text-lg mb-6">Start creating and tokenizing your content</p>
                <button className="btn btn-primary text-text">Create Content</button>
              </div>
            )}
          </>
        )}

        {activeTab === 'favorite' && (
          <>
            {favorites.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {favorites.map((item) => (
                  <MarketCard key={item.id} item={item} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <Heart size={48} className="mx-auto mb-4 text-secondary" />
                <h3 className="text-2xl font-bold mb-2">No favorites yet</h3>
                <p className="text-lg">Like content to add it to your favorites</p>
              </div>
            )}
          </>
        )}

        {activeTab === 'activity' && (
          <div className="card">
            <h2 className="text-2xl font-bold mb-6">Recent Activity</h2>
            <div className="space-y-4">
              <ActivityItem
                title="Purchased NFT"
                description="You purchased 'Digital Dreamscape' for 0.5 ETH"
                time="2 hours ago"
              />
              <ActivityItem
                title="Token Trade"
                description="You bought 100 $ARTIST tokens"
                time="1 day ago"
              />
              <ActivityItem
                title="Subscription Started"
                description="You subscribed to Creator Name"
                time="3 days ago"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

interface ActivityItemProps {
  title: string;
  description: string;
  time: string;
}

const ActivityItem: React.FC<ActivityItemProps> = ({ title, description, time }) => {
  return (
    <div className="flex justify-between p-4 border-2 border-text rounded-xl hover:bg-primary-light transition-colors">
      <div>
        <h3 className="font-bold">{title}</h3>
        <p className="text-sm">{description}</p>
      </div>
      <div className="text-sm opacity-70">{time}</div>
    </div>
  );
};

export default ProfilePage;