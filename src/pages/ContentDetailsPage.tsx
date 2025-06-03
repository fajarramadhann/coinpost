import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, Share2, ShoppingCart, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { CONTENT, CREATORS } from '../data/mockData';
import PriceChart from '../components/charts/PriceChart';
import { useAlert } from '../context/AlertContext';

const ContentDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { showAlert } = useAlert();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [showSellModal, setShowSellModal] = useState(false);

  const content = CONTENT.find(c => c.id === id);
  const creator = content ? CREATORS.find(c => c.id === content.creatorId) : null;

  if (!content || !creator) {
    return <div>Content not found</div>;
  }

  // Mock price history data
  const priceHistory = Array.from({ length: 30 }, (_, i) => ({
    time: new Date(Date.now() - (30 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    value: content.price * (1 + Math.sin(i / 5) * 0.2),
  }));

  const handlePlay = () => {
    setIsPlaying(!isPlaying);
    showAlert('success', isPlaying ? 'Paused' : 'Playing');
  };

  const handleMute = () => {
    setIsMuted(!isMuted);
    showAlert('success', isMuted ? 'Unmuted' : 'Muted');
  };

  const renderContent = () => {
    if (!content || !content.type) return null;

    switch (content.type) {
      case 'video':
        return (
          <div className="relative aspect-video rounded-xl overflow-hidden border-2 border-text">
            <video
              src={content.image}
              poster={content.image}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-4 left-4 right-4 flex items-center gap-4">
              <button
                onClick={handlePlay}
                className="p-3 rounded-full bg-white/90 border-2 border-text"
              >
                {isPlaying ? <Pause size={20} /> : <Play size={20} />}
              </button>
              <div className="flex-grow h-1 bg-white/30 rounded-full overflow-hidden">
                <div className="w-1/3 h-full bg-white" />
              </div>
              <button
                onClick={handleMute}
                className="p-3 rounded-full bg-white/90 border-2 border-text"
              >
                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>
            </div>
          </div>
        );
      case 'audio':
        return (
          <div className="relative rounded-xl overflow-hidden border-2 border-text bg-primary/20 p-6">
            <div className="flex items-center gap-4">
              <button
                onClick={handlePlay}
                className="p-4 rounded-full bg-white border-2 border-text"
              >
                {isPlaying ? <Pause size={24} /> : <Play size={24} />}
              </button>
              <div className="flex-grow space-y-2">
                <div className="h-1 bg-white/30 rounded-full overflow-hidden">
                  <div className="w-1/3 h-full bg-primary" />
                </div>
                <div className="flex justify-between text-sm">
                  <span>1:23</span>
                  <span>3:45</span>
                </div>
              </div>
              <button
                onClick={handleMute}
                className="p-4 rounded-full bg-white border-2 border-text"
              >
                {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
              </button>
            </div>
          </div>
        );
      default:
        return (
          <img
            src={content.image}
            alt={content.title}
            className="w-full rounded-xl border-2 border-text"
          />
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-1 space-y-6">
          {renderContent()}
          
          <div className="space-y-4">
            <h1 className="text-2xl md:text-3xl font-bold">{content.title}</h1>
            <p className="text-lg">{content.description}</p>
            
            <div className="flex items-center gap-4">
              <Link to={`/creator/${creator.id}`} className="flex items-center gap-2">
                <img
                  src={creator.avatar}
                  alt={creator.name}
                  className="w-10 h-10 rounded-full border-2 border-text"
                />
                <div>
                  <p className="font-bold">{creator.name}</p>
                  <p className="text-sm">@{creator.username}</p>
                </div>
              </Link>
            </div>
          </div>
        </div>

        <div className="md:w-80 space-y-6">
          <div className="card">
            <h2 className="text-xl font-bold mb-4">Price History</h2>
            <PriceChart data={priceHistory} height={200} />
            <div className="mt-4 space-y-4">
              <div className="flex justify-between">
                <span>Current Price</span>
                <span className="font-bold">{content.price} ETH</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowBuyModal(true)}
                  className="flex-1 btn btn-primary text-text"
                >
                  <ShoppingCart className="inline-block mr-2" size={20} />
                  Buy
                </button>
                <button
                  onClick={() => setShowSellModal(true)}
                  className="flex-1 btn btn-secondary text-text"
                >
                  Sell
                </button>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="text-xl font-bold mb-4">Stats</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Likes</span>
                <span className="font-bold">{content.likes}</span>
              </div>
              <div className="flex justify-between">
                <span>Comments</span>
                <span className="font-bold">{content.comments}</span>
              </div>
              <div className="flex justify-between">
                <span>Created</span>
                <span className="font-bold">
                  {new Date(content.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {(showBuyModal || showSellModal) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-text/20 backdrop-blur-sm"
              onClick={() => {
                setShowBuyModal(false);
                setShowSellModal(false);
              }}
            />
            
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-white rounded-3xl border-2 border-text p-6 max-w-md w-full"
            >
              <h3 className="text-2xl font-bold mb-4">
                {showBuyModal ? 'Buy' : 'Sell'} {content.title}
              </h3>
              {/* Modal content would go here */}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ContentDetailsPage;