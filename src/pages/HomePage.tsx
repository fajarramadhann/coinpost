import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, Sparkles, TrendingUp, Users } from 'lucide-react';
import CreatorCard from '../components/creator/CreatorCard';
import { FEATURED_CREATORS } from '../data/mockData';

const HomePage: React.FC = () => {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative">
        <div className="absolute -z-10 top-0 left-0 w-full h-full bg-gradient-to-br from-primary-light via-background to-secondary/20 rounded-3xl"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center py-8 md:py-16 px-4 md:px-8 rounded-3xl border-2 border-text shadow-[8px_8px_0px_0px_rgba(16,48,69,1)]">
          <div className="space-y-6">
            <motion.h1 
              className="text-4xl md:text-6xl font-display font-bold leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Turn Your Content
              <br />
              <span className="text-shadow bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
                Into Capital
              </span>
            </motion.h1>
            <motion.p 
              className="text-lg md:text-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Tokenize your content, build your community, and monetize your creativity. The web3 platform for creators and their fans.
            </motion.p>
            <motion.div 
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Link to="/explore" className="btn btn-primary text-text">Start Exploring</Link>
              <Link to="/create" className="btn btn-secondary text-text">Become a Creator</Link>
            </motion.div>
          </div>
          
          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="relative w-72 h-72 md:w-96 md:h-96">
              <div className="absolute inset-0 bg-primary rounded-full opacity-20 animate-pulse-slow"></div>
              <img 
                src="https://images.pexels.com/photos/7149165/pexels-photo-7149165.jpeg" 
                alt="Creator with digital art" 
                className="w-full h-full object-cover rounded-full border-4 border-text"
              />
              <motion.div 
                className="absolute -top-4 -right-4 bg-accent rounded-full p-3 border-2 border-text shadow-[4px_4px_0px_0px_rgba(16,48,69,1)]"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles size={24} className="text-text" />
              </motion.div>
              <motion.div 
                className="absolute -bottom-4 -left-4 bg-secondary rounded-full p-3 border-2 border-text shadow-[4px_4px_0px_0px_rgba(16,48,69,1)]"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
              >
                <Zap size={24} className="text-text" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section>
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-lg max-w-2xl mx-auto">A new way for creators to connect with fans and monetize content</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard 
            icon={<Zap size={32} className="text-text" />}
            title="Tokenize Your Content"
            description="Turn your creative works into NFTs and tokens that can be bought, sold, and traded by your fans."
          />
          <FeatureCard 
            icon={<TrendingUp size={32} className="text-text" />}
            title="Grow Your Value"
            description="As your popularity grows, so does the value of your tokens. Early supporters benefit from your success."
          />
          <FeatureCard 
            icon={<Users size={32} className="text-text" />}
            title="Build Community"
            description="Create exclusive content for token holders and foster a community that supports your work."
          />
        </div>
      </section>

      {/* Featured Creators */}
      <section>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Featured Creators</h2>
          <Link to="/explore" className="text-text font-bold underline">View All</Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURED_CREATORS.map((creator) => (
            <CreatorCard key={creator.id} creator={creator} />
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center py-12 px-4 bg-secondary rounded-3xl border-2 border-text shadow-[8px_8px_0px_0px_rgba(16,48,69,1)]">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Tokenize Your Content?</h2>
        <p className="text-lg mb-8 max-w-2xl mx-auto">
          Join thousands of creators who are already turning their content into capital
        </p>
        <Link to="/create" className="btn btn-primary text-text">Get Started</Link>
      </section>
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
  return (
    <motion.div 
      className="card hover:translate-y-[-5px] transition-transform duration-300"
      whileHover={{ y: -5 }}
    >
      <div className="bg-primary-light rounded-full w-16 h-16 flex items-center justify-center mb-4 border-2 border-text">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p>{description}</p>
    </motion.div>
  );
};

export default HomePage;