import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, Image, Video, Music, FileText, AlertCircle, X } from 'lucide-react';
import { useWallet } from '../context/WalletContext';
import { useAlert } from '../context/AlertContext';
import { useFormValidation } from '../hooks/useFormValidation';
import { validationRules, validateFileType, validateFileSize } from '../utils/validation';
import { CONTENT_TYPES, MAX_FILE_SIZE, ERROR_MESSAGES } from '../utils/constants';

const CreateContentPage: React.FC = () => {
  const { isConnected, connect } = useWallet();
  const { showAlert } = useAlert();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [contentType, setContentType] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubscriberOnly, setIsSubscriberOnly] = useState(false);

  const { values, errors, handleChange, handleSubmit, isSubmitting } = useFormValidation(
    {
      title: '',
      description: '',
      price: '',
      supply: ''
    },
    validationRules
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    const selectedContentType = CONTENT_TYPES.find(type => type.id === contentType);
    if (!selectedContentType) return;

    // Validate file type
    if (selectedContentType.allowedTypes && 
        !validateFileType(selectedFile, selectedContentType.allowedTypes)) {
      showAlert('error', ERROR_MESSAGES.invalidFileType);
      return;
    }

    // Validate file size
    if (!validateFileSize(selectedFile, MAX_FILE_SIZE)) {
      showAlert('error', ERROR_MESSAGES.fileTooLarge);
      return;
    }

    setFile(selectedFile);
    
    // Create preview URL for supported types
    if (selectedFile.type.startsWith('image/') || 
        selectedFile.type.startsWith('video/') || 
        selectedFile.type.startsWith('audio/')) {
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      const input = fileInputRef.current;
      if (input) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(droppedFile);
        input.files = dataTransfer.files;
        input.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }
  };

  const handleSubmitContent = async (values: any) => {
    if (!isConnected) {
      showAlert('error', ERROR_MESSAGES.walletNotConnected);
      connect();
      return;
    }

    if (!file && contentType !== 'text') {
      showAlert('error', 'Please upload a file');
      return;
    }

    setIsUploading(true);
    try {
      // Simulate content creation and tokenization
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      showAlert('success', 'Content created and tokenized successfully!');
      // Reset form
      setContentType(null);
      setFile(null);
      setPreviewUrl(null);
      setIsSubscriberOnly(false);
    } catch (error) {
      showAlert('error', ERROR_MESSAGES.transactionFailed);
    } finally {
      setIsUploading(false);
    }
  };

  const renderPreview = () => {
    if (!previewUrl) return null;

    switch (contentType) {
      case 'image':
        return (
          <img 
            src={previewUrl} 
            alt="Preview" 
            className="max-h-64 mx-auto rounded-xl"
          />
        );
      case 'video':
        return (
          <video 
            src={previewUrl} 
            controls 
            className="max-h-64 w-full rounded-xl"
          />
        );
      case 'audio':
        return (
          <audio 
            src={previewUrl} 
            controls 
            className="w-full mt-4"
          />
        );
      default:
        return null;
    }
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

      <form onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(handleSubmitContent);
      }} className="space-y-8">
        {!contentType ? (
          <div className="card">
            <h2 className="text-xl font-bold mb-6">Choose Content Type</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {CONTENT_TYPES.map((type) => {
                const Icon = type.id === 'image' ? Image :
                           type.id === 'video' ? Video :
                           type.id === 'audio' ? Music :
                           FileText;
                           
                return (
                  <motion.button
                    key={type.id}
                    type="button"
                    onClick={() => setContentType(type.id)}
                    className="flex flex-col items-center justify-center p-6 rounded-xl border-2 border-text bg-white hover:bg-primary-light transition-colors"
                    whileHover={{ y: -5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mb-3 border-2 border-text">
                      <Icon size={24} />
                    </div>
                    <span className="font-bold">{type.label}</span>
                  </motion.button>
                );
              })}
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

              <div 
                className="border-2 border-dashed border-text rounded-xl p-8 text-center"
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
              >
                {previewUrl ? (
                  <div className="relative">
                    {renderPreview()}
                    <button
                      type="button"
                      onClick={() => {
                        setFile(null);
                        setPreviewUrl(null);
                      }}
                      className="absolute top-2 right-2 bg-error text-white p-1 rounded-full"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mx-auto border-2 border-text">
                      <Upload size={24} className="text-text" />
                    </div>
                    <p>Drag and drop your {contentType} file, or click to browse</p>
                    <p className="text-sm opacity-70">Max file size: {MAX_FILE_SIZE}MB</p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      id="content-file"
                      onChange={handleFileChange}
                      accept={CONTENT_TYPES.find(t => t.id === contentType)?.allowedTypes?.join(',')}
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
                    name="title"
                    value={values.title}
                    onChange={handleChange}
                    className={`input ${errors.title ? 'border-error' : ''}`}
                    placeholder="Give your content a title"
                  />
                  {errors.title && (
                    <p className="text-sm text-error mt-1">{errors.title}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="description" className="block font-bold mb-2">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    value={values.description}
                    onChange={handleChange}
                    className={`input min-h-[100px] ${errors.description ? 'border-error' : ''}`}
                    placeholder="Describe your content"
                  />
                  {errors.description && (
                    <p className="text-sm text-error mt-1">{errors.description}</p>
                  )}
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
                    name="price"
                    value={values.price}
                    onChange={handleChange}
                    min="0"
                    step="0.001"
                    className={`input ${errors.price ? 'border-error' : ''}`}
                    placeholder="0.05"
                  />
                  {errors.price && (
                    <p className="text-sm text-error mt-1">{errors.price}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="supply" className="block font-bold mb-2">Token Supply</label>
                  <input
                    type="number"
                    id="supply"
                    name="supply"
                    value={values.supply}
                    onChange={handleChange}
                    min="1"
                    className={`input ${errors.supply ? 'border-error' : ''}`}
                    placeholder="10"
                  />
                  {errors.supply && (
                    <p className="text-sm text-error mt-1">{errors.supply}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={isSubscriberOnly}
                      onChange={(e) => setIsSubscriberOnly(e.target.checked)}
                      className="w-5 h-5 rounded border-2 border-text"
                    />
                    <span>Create subscriber-only content</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isUploading || isSubmitting}
                className="btn btn-primary text-text"
              >
                {isUploading ? (
                  <span className="flex items-center">
                    <motion.div
                      className="w-5 h-5 border-2 border-text border-t-transparent rounded-full mr-2"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    Creating...
                  </span>
                ) : (
                  'Create & Tokenize'
                )}
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
};

export default CreateContentPage;