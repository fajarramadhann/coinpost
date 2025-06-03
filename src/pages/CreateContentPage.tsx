import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Image, Video, Music, FileText, AlertCircle } from 'lucide-react';
import { useWallet } from '../context/WalletContext';

const CreateContentPage: React.FC = () => {
  const { isConnected, connect } = useWallet();
  const [contentType, setContentType] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [supply, setSupply] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const contentTypes = [
    { id: 'image', label: 'Image', icon: <Image size={24} /> },
    { id: 'video', label: 'Video', icon: <Video size={24} /> },
    { id: 'audio', label: 'Audio', icon: <Music size={24} /> },
    { id: 'text', label: 'Article', icon: <FileText size={24} /> },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    
    // Create preview URL for images
    if (contentType === 'image' && selectedFile.type.startsWith('image/')) {
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected) {
      connect();
      return;
    }

    setIsUploading(true);
    
    // Simulate upload and minting
    setTimeout(() => {
      setIsUploading(false);
      // Reset form or redirect
      alert('Content created and tokenized successfully!');
    }, 2000);
  };

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-24 h-24 rounded-full bg-primary flex items-center justify-center border-2 border-text shadow-[4px_4px_0px_0px_rgba(16,48,69,1)]"
        >
          <Upload size={32} className="text-text" />
        </motion.div>
        <h1 className="text-3xl font-bold text-center">Connect Wallet to Create</h1>
        <p className="text-center max-w-md">
          Connect your wallet to start creating and tokenizing your content.
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
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Create & Tokenize Content</h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        {!contentType ? (
          <div className="card">
            <h2 className="text-xl font-bold mb-6">Choose Content Type</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {contentTypes.map((type) => (
                <motion.button
                  key={type.id}
                  type="button"
                  onClick={() => setContentType(type.id)}
                  className="flex flex-col items-center justify-center p-6 rounded-xl border-2 border-text bg-white hover:bg-primary-light transition-colors"
                  whileHover={{ y: -5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mb-3 border-2 border-text">
                    {type.icon}
                  </div>
                  <span className="font-bold">{type.label}</span>
                </motion.button>
              ))}
            </div>
          </div>
        ) : (
          <>
            <div className="card">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Upload {contentType.charAt(0).toUpperCase() + contentType.slice(1)}</h2>
                <button
                  type="button"
                  onClick={() => setContentType(null)}
                  className="text-sm underline"
                >
                  Change type
                </button>
              </div>

              <div className="border-2 border-dashed border-text rounded-xl p-8 text-center">
                {previewUrl ? (
                  <div className="relative">
                    <img src={previewUrl} alt="Preview" className="max-h-64 mx-auto rounded-xl" />
                    <button
                      type="button"
                      onClick={() => {
                        setFile(null);
                        setPreviewUrl(null);
                      }}
                      className="absolute top-2 right-2 bg-error text-white p-1 rounded-full"
                    >
                      <AlertCircle size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mx-auto border-2 border-text">
                      <Upload size={24} className="text-text" />
                    </div>
                    <p>Drag and drop your {contentType} file, or click to browse</p>
                    <p className="text-sm opacity-70">Max file size: 50MB</p>
                    <input
                      type="file"
                      id="content-file"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="content-file"
                      className="inline-block btn btn-primary text-text cursor-pointer"
                    >
                      Select File
                    </label>
                  </div>
                )}
              </div>
            </div>

            <div className="card">
              <h2 className="text-xl font-bold mb-6">Content Details</h2>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className="block font-bold mb-2">Title</label>
                  <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="input"
                    placeholder="Give your content a title"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="description" className="block font-bold mb-2">Description</label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="input min-h-[100px]"
                    placeholder="Describe your content"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="card">
              <h2 className="text-xl font-bold mb-6">Tokenization</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="price" className="block font-bold mb-2">Price (ETH)</label>
                  <input
                    type="number"
                    id="price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    min="0"
                    step="0.001"
                    className="input"
                    placeholder="0.05"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="supply" className="block font-bold mb-2">Token Supply</label>
                  <input
                    type="number"
                    id="supply"
                    value={supply}
                    onChange={(e) => setSupply(e.target.value)}
                    min="1"
                    className="input"
                    placeholder="10"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="w-5 h-5 rounded border-2 border-text" />
                    <span>Create subscriber-only content</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isUploading}
                className="btn btn-primary text-text"
              >
                {isUploading ? 'Creating...' : 'Create & Tokenize'}
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
};

export default CreateContentPage;