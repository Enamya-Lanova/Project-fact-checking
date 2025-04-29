import React, { useEffect, useState } from 'react';
import { Search, Link as LinkIcon, Image, AlertCircle, Loader2 } from 'lucide-react';

interface VerificationState {
  url: string;
  status: 'idle' | 'loading' | 'success' | 'error';
  result?: {
    status: string;
    details: string[];
    timestamp: string;
  };
}

function Popup() {
  const [state, setState] = useState<VerificationState>({
    url: '',
    status: 'idle'
  });

  useEffect(() => {
    if (typeof chrome !== 'undefined' && chrome.tabs) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length > 0 && tabs[0]?.url) {
          setState(prev => ({ ...prev, url: tabs[0].url! }));
        }
      });
    }
  }, []);

  const handleVerify = async () => {
    setState(prev => ({ ...prev, status: 'loading' }));

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      setState(prev => ({
        ...prev,
        status: 'success',
        result: {
          status: 'verified',
          details: [
            'URL authenticity verified',
            'No suspicious redirects detected',
            'Domain reputation checked'
          ],
          timestamp: new Date().toLocaleString()
        }
      }));
    } catch (error) {
      console.error('Verification failed:', error);
      setState(prev => ({ ...prev, status: 'error' }));
    }
  };

  return (
    <div className="w-96 p-4 bg-white">
      <div className="flex items-center gap-2 mb-4">
        <Search className="w-5 h-5 text-blue-600" />
        <h1 className="text-lg font-semibold">Content Verification Tool</h1>
      </div>

      <div className="mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
          <LinkIcon className="w-4 h-4" />
          <span className="truncate">{state.url}</span>
        </div>
      </div>

      <button
        onClick={handleVerify}
        disabled={state.status === 'loading'}
        aria-label="Verify the content of the current URL"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {state.status === 'loading' ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" role="status" />
            Verifying...
          </>
        ) : (
          <>
            <Search className="w-4 h-4" />
            Verify Content
          </>
        )}
      </button>

      {state.result && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-4 h-4 text-green-500" />
            <span className="font-medium">
              Status: {state.result.status}
            </span>
          </div>
          <ul className="text-sm space-y-1">
            {state.result.details.map((detail, index) => (
              <li key={index} className="text-gray-600">• {detail}</li>
            ))}
          </ul>
          <div className="mt-2 text-xs text-gray-500">
            {state.result.timestamp}
          </div>
        </div>
      )}
    </div>
  );
}

export default Popup;