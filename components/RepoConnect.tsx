import React, { useState } from 'react';
import { GitBranch, Github, Lock, Globe, Server, Loader2 } from 'lucide-react';
import { RepositoryConfig } from '../types';

interface RepoConnectProps {
  onConnect: (config: RepositoryConfig, name: string) => void;
  isLoading: boolean;
}

export const RepoConnect: React.FC<RepoConnectProps> = ({ onConnect, isLoading }) => {
  const [url, setUrl] = useState('');
  const [branch, setBranch] = useState('main');
  const [isPrivate, setIsPrivate] = useState(false);
  const [token, setToken] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Extract a name from URL or default
    const name = url.split('/').pop()?.replace('.git', '') || 'Untitled Project';
    
    onConnect({
      url,
      branch,
      type: url.includes('gitlab') ? 'gitlab' : url.includes('bitbucket') ? 'bitbucket' : 'github',
      isPrivate
    }, name);
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 max-w-2xl mx-auto mt-10">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Connect Repository</h2>
        <p className="text-slate-500 mt-2">Link your Git repository to start the automated documentation flow.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Repository URL</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Github size={18} />
            </span>
            <input
              type="text"
              required
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="https://github.com/username/project"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Branch</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <GitBranch size={18} />
              </span>
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                placeholder="main"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Visibility</label>
            <div className="flex space-x-2 bg-slate-100 p-1 rounded-lg">
              <button
                type="button"
                onClick={() => setIsPrivate(false)}
                className={`flex-1 flex items-center justify-center py-1.5 text-sm rounded-md transition-all ${!isPrivate ? 'bg-white shadow-sm text-slate-900 font-medium' : 'text-slate-500'}`}
              >
                <Globe size={14} className="mr-1.5" /> Public
              </button>
              <button
                type="button"
                onClick={() => setIsPrivate(true)}
                className={`flex-1 flex items-center justify-center py-1.5 text-sm rounded-md transition-all ${isPrivate ? 'bg-white shadow-sm text-slate-900 font-medium' : 'text-slate-500'}`}
              >
                <Lock size={14} className="mr-1.5" /> Private
              </button>
            </div>
          </div>
        </div>

        {isPrivate && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Access Token</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Server size={18} />
              </span>
              <input
                type="password"
                required={isPrivate}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                placeholder="ghp_xxxxxxxxxxxx"
                value={token}
                onChange={(e) => setToken(e.target.value)}
              />
            </div>
            <p className="text-xs text-slate-500 mt-1">Tokens are encrypted and stored securely.</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin mr-2" size={18} /> Analyzing Repository...
            </>
          ) : (
            'Connect & Analyze'
          )}
        </button>
      </form>
    </div>
  );
};