import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, ScrollText, TrendingUp, MessageCircle, Share2, X, ChevronDown, ChevronUp, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CONTENT, CREATORS } from '../data/mockData';
import { useWallet } from '../context/WalletContext';
import { useAlert } from '../context/AlertContext';

const MarketplacePage: React.FC = () => {
  const navigate = useNavigate();
  const { isConnected, connect } = useWallet();
  const { showAlert } = useAlert();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('trending');
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const observerRef = useRef<IntersectionObserver>();
  const loadingRef = useRef<HTMLDivElement>(null);

  // Create merged content with creator info
  const feedItems = CONTENT.map(content => {
    const creator = CREATORS.find(c => c.id === content.creatorId);
    return {
      ...content,
      creatorName: creator?.name || '',
      creatorAvatar: creator?.avatar || '',
      creatorUsername: creator?.username || ''
    };
  });

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          loadMoreContent();
        }
      },
      { threshold: 1.0 }
    );

    if (loadingRef.current) {
      observerRef.current.observe(loadingRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, isLoading]);

  const loadMoreContent = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setPage(prev => prev + 1);
      if (page >= 3) setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = async (item: any) => {
    try {
      await navigator.share({
        title: item.title,
        text: item.description,
        url: window.location.href,
      });
      showAlert('success', 'Shared successfully');
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        showAlert('error', 'Failed to share');
      }
    }
  };

  const FeedItem = ({ item }: { item: any }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [liked, setLiked] = useState(false);
    const [likes, setLikes] = useState(item.likes);

    const handleContentClick = () => {
      navigate(`/content/${item.id}`);
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl border-2 border-text p-4 space-y-4"
      >
        {/* Creator Info */}
        <div className="flex items-center gap-3">
          <img
            src={item.creatorAvatar}
            alt={item.creatorName}
            className="w-10 h-10 rounded-full border-2 border-text"
          />
          <div>
            <h3 className="font-bold">{item.creatorName}</h3>
            <p className="text-sm opacity-70">@{item.creatorUsername}</p>
          </div>
        </div>

        {/* Content */}
        <div onClick={handleContentClick} className="cursor-pointer">
          <h2 className="text-xl font-bold mb-2">{item.title}</h2>
          <p className={`text-gray-600 ${isExpanded ? '' : 'line-clamp-3'}`}>
            {item.description}
          </p>
          {item.description.length > 150 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
              className="text-primary font-bold mt-2 flex items-center gap-1"
            >
              {isExpanded ? (
                <>
                  Show less
                  <ChevronUp size={16} />
                </>
              ) : (
                <>
                  Read more
                  <ChevronDown size={16} />
                </>
              )}
            </button>
          )}
        </div>

        {/* Image */}
        <div className="relative" onClick={handleContentClick}>
          <img
            src={item.image}
            alt={item.title}
            className={`w-full rounded-xl border-2 border-text ${
              item.isLocked ? 'filter blur-sm' : ''
            }`}
          />
          {item.isLocked && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white/90 p-4 rounded-xl border-2 border-text flex items-center gap-2">
                <Lock size={20} />
                <span className="font-bold">Premium Content</span>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                if (!isConnected) {
                  showAlert('error', 'Please connect your wallet first');
                  return;
                }
                setLiked(!liked);
                setLikes(liked ? likes - 1 : likes + 1);
              }}
              className="flex items-center gap-2 hover:text-primary transition-colors"
            >
              <motion.div
                whileTap={{ scale: 0.9 }}
                className={`p-2 rounded-full ${
                  liked ? 'bg-primary/20' : 'hover:bg-primary/10'
                }`}
              >
                <TrendingUp size={20} className={liked ? 'text-primary' : ''} />
              </motion.div>
              <span>{likes}</span>
            </button>
            <button className="flex items-center gap-2 hover:text-primary transition-colors">
              <motion.div
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-full hover:bg-primary/10"
              >
                <MessageCircle size={20} />
              </motion.div>
              <span>{item.comments}</span>
            </button>
            <button
              onClick={() => handleShare(item)}
              className="hover:text-primary transition-colors"
            >
              <motion.div
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-full hover:bg-primary/10"
              >
                <Share2 size={20} />
              </motion.div>
            </button>
          </div>
          <button 
            onClick={handleContentClick}
            className="px-4 py-2 rounded-full bg-primary border-2 border-text font-bold hover:bg-primary-dark transition-colors"
          >
            {item.price.toFixed(3)} ETH
          </button>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Search */}
      <div className="sticky top-0 z-10 bg-background pt-4 pb-2">
        <div className="relative">
          <Search className="absolute top-3 left-3 text-text" size={20} />
          <input
            type="text"
            placeholder="Search posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-10"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
          {['trending', 'latest', 'following', 'popular'].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-full border-2 border-text font-bold whitespace-nowrap ${
                activeFilter === filter
                  ? 'bg-primary'
                  : 'bg-white hover:bg-primary-light'
              }`}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Feed */}
      <div className="space-y-6">
        {feedItems.map((item) => (
          <FeedItem key={item.id} item={item} />
        ))}
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex justify-center py-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <ScrollText size={24} />
          </motion.div>
        </div>
      )}

      {/* Observer Element */}
      <div ref={loadingRef} className="h-4" />
    </div>
  );
};

export default MarketplacePage;