import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Zap } from 'lucide-react';
import CreatorCard from '../components/creator/CreatorCard';
import { CREATORS } from '../data/mockData';

const ExplorePage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Art', 'Music', 'Writing', 'Gaming', 'Photography'];

  const filteredCreators = CREATORS.filter(creator => {
    if (activeCategory !== 'All' && creator.category !== activeCategory) {
      return false;
    }
    
    if (searchTerm && !creator.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl md:text-4xl font-bold">Explore Creators</h1>
      </div>

      <div className="flex flex-col md:flex-row gap-4 md:items-center">
        <div className="relative flex-grow">
          <Search className="absolute top-3 left-3 text-text" size={20} />
          <input
            type="text"
            placeholder="Search creators..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-10"
          />
        </div>
        
        <div className="flex items-center gap-2 overflow-x-auto py-2 md:py-0">
          <Filter size={20} className="text-text flex-shrink-0" />
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`whitespace-nowrap px-4 py-2 rounded-full border-2 border-text font-bold transition-all ${
                activeCategory === category
                  ? 'bg-primary shadow-[4px_4px_0px_0px_rgba(16,48,69,1)]'
                  : 'bg-white hover:bg-primary-light'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {filteredCreators.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCreators.map((creator) => (
            <CreatorCard key={creator.id} creator={creator} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <Zap size={48} className="mx-auto mb-4 text-secondary" />
          <h3 className="text-2xl font-bold mb-2">No creators found</h3>
          <p className="text-lg">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
};

export default ExplorePage;