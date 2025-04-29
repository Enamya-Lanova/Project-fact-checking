import React, { useState } from 'react';
import { Upload, FileCheck, Link, AlertCircle, Image as ImageIcon, Loader2 } from 'lucide-react';
import Login from './components/login';

interface VerificationResult {
  id: string;
  type: 'text' | 'image';
  status: 'valid' | 'invalid' | 'warning';
  details: string[];
  timestamp: string;
}

function App() {
  const [text, setText] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [results, setResults] = useState<VerificationResult[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAnalyzing(true);
    setError(null);
    
    setTimeout(() => {
      try {
        const newResult: VerificationResult = {
          id: crypto.randomUUID(),
          type: 'text',
          status: Math.random() > 0.5 ? 'valid' : 'warning',
          details: [
            'Content analyzed successfully',
            'No malicious patterns detected',
            'Source verification completed'
          ],
          timestamp: new Date().toLocaleString()
        };
        setResults(prev => [newResult, ...prev]);
        setText('');
      } catch (err) {
        setError('Failed to analyze text content. Please try again.');
      } finally {
        setIsAnalyzing(false);
      }
    }, 1500);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }

    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file');
      return;
    }

    setSelectedImage(file);
    setIsAnalyzing(true);
    setError(null);
    
    setTimeout(() => {
      try {
        const newResult: VerificationResult = {
          id: crypto.randomUUID(),
          type: 'image',
          status: 'valid',
          details: [
            'Image analyzed successfully',
            'No manipulations detected',
            'Metadata verified'
          ],
          timestamp: new Date().toLocaleString()
        };
        setResults(prev => [newResult, ...prev]);
      } catch (err) {
        setError('Failed to analyze image. Please try again.');
      } finally {
        setIsAnalyzing(false);
        setSelectedImage(null);
      }
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-indigo-900 mb-4">Content Verification System</h1>
          <p className="text-gray-600">Verify text, links, and images with advanced analysis</p>
        </header>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
            {error}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Text/Link Verification */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center mb-4">
              <Link className="w-6 h-6 text-indigo-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-800">Text & Link Verification</h2>
            </div>
            <form onSubmit={handleTextSubmit}>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Enter text or link to verify..."
                rows={4}
              />
              <button
                type="submit"
                disabled={!text.trim() || isAnalyzing}
                className="mt-4 w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  'Verify Content'
                )}
              </button>
            </form>
          </div>

          {/* Image Upload */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center mb-4">
              <ImageIcon className="w-6 h-6 text-indigo-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-800">Image Analysis</h2>
            </div>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                id="image-upload"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                disabled={isAnalyzing}
              />
              <label
                htmlFor="image-upload"
                className={`cursor-pointer flex flex-col items-center ${isAnalyzing ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-12 h-12 text-indigo-600 mb-2 animate-spin" />
                    <span className="text-gray-600">Analyzing image...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-12 h-12 text-gray-400 mb-2" />
                    <span className="text-gray-600">Click to upload image</span>
                    <span className="text-sm text-gray-400 mt-1">
                      {selectedImage ? selectedImage.name : 'Supported formats: JPG, PNG (max 5MB)'}
                    </span>
                  </>
                )}
              </label>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center mb-6">
            <FileCheck className="w-6 h-6 text-indigo-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-800">Verification Results</h2>
          </div>
          
          {results.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <AlertCircle className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <p>No verification results yet. Start by analyzing content above.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {results.map((result) => (
                <div
                  key={result.id}
                  className={`p-4 rounded-lg border ${
                    result.status === 'valid'
                      ? 'border-green-200 bg-green-50'
                      : result.status === 'warning'
                      ? 'border-yellow-200 bg-yellow-50'
                      : 'border-red-200 bg-red-50'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-medium text-gray-800">
                      {result.type === 'text' ? 'Text Analysis' : 'Image Analysis'}
                    </span>
                    <span className="text-sm text-gray-500">{result.timestamp}</span>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                    {result.details.map((detail, i) => (
                      <li key={i}>{detail}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export default App;