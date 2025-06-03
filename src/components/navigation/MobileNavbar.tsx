import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useWallet } from '../../context/WalletContext';
import { Zap, Compass, ShoppingBag, User, Home, Plus } from 'lucide-react';

const MobileNavbar: React.FC = () => {
  const location = useLocation();
  const { isConnected, connect } = useWallet();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Top Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-text">
        <div className="container mx-auto px-3 py-3">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <Zap size={20} className="text-text" />
              <span className="text-lg font-display font-bold">TokenizeMe</span>
            </Link>

            {isConnected ? (
              <div className="px-3 py-1 rounded-full bg-primary border border-text text-sm">
                Connected
              </div>
            ) : (
              <motion.button
                onClick={connect}
                className="text-sm btn btn-primary text-text px-3 py-1"
                whileTap={{ scale: 0.95 }}
              >
                Connect
              </motion.button>
            )}
          </div>
        </div>
      </header>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-sm border-t border-text pb-safe">
        <div className="container mx-auto">
          <div className="flex items-center justify-around">
            <NavLink to="/" active={isActive('/')} icon={<Home size={20} />} label="Home" />
            <NavLink to="/explore" active={isActive('/explore')} icon={<Compass size={20} />} label="Explore" />
            <NavLink 
              to="/create" 
              active={isActive('/create')} 
              icon={
                <div className="bg-secondary p-3 rounded-xl border border-text -mt-6 shadow-[2px_2px_0px_0px_rgba(16,48,69,1)]">
                  <Plus size={24} />
                </div>
              } 
              label="Create" 
            />
            <NavLink to="/marketplace" active={isActive('/marketplace')} icon={<ShoppingBag size={20} />} label="Market" />
            <NavLink to="/profile" active={isActive('/profile')} icon={<User size={20} />} label="Profile" />
          </div>
        </div>
      </nav>

      {/* Content Padding */}
      <div className="h-[48px]" /> {/* Top spacing */}
      <div className="h-[64px]" /> {/* Bottom spacing */}
    </>
  );
};

interface NavLinkProps {
  to: string;
  active: boolean;
  icon: React.ReactNode;
  label: string;
}

const NavLink: React.FC<NavLinkProps> = ({ to, active, icon, label }) => {
  return (
    <Link
      to={to}
      className={`flex flex-col items-center py-2 px-3 relative ${
        active ? 'text-text' : 'text-text/70'
      }`}
    >
      <motion.div
        whileTap={{ scale: 0.95 }}
        className="relative"
      >
        {icon}
        {active && to !== '/create' && (
          <motion.div
            layoutId="activeTab"
            className="absolute inset-0 bg-primary rounded-xl border border-text -z-10"
            transition={{ type: "spring", duration: 0.5 }}
          />
        )}
      </motion.div>
      <span className="text-[10px] font-medium mt-1">{label}</span>
    </Link>
  );
};

export default MobileNavbar;