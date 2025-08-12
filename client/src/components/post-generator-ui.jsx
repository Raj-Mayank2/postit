import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';

const PostGeneratorUI = () => {
  const { user, logout } = useAuth();

  const [keywords, setKeywords] = useState('');
  const [instructions, setInstructions] = useState('');
  const [generatedPost, setGeneratedPost] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState(null);

  const fetchHistory = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/posts', {
        headers: { 'x-auth-token': user.token }
      });
      setHistory(res.data);
    } catch (err) {
      console.error('Error fetching post history:', err);
      setError('Failed to fetch post history.');
    }
  };

  useEffect(() => {
    if (user) {
      fetchHistory();
    }
  }, [user]);

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    setGeneratedPost(null);

    try {
      const res = await axios.post(
        'http://localhost:5000/api/posts/generate',
        { keywords, instructions },
        { headers: { 'x-auth-token': user.token } }
      );

      setGeneratedPost(res.data);
      setHistory(prevHistory => [res.data, ...prevHistory]);
      setKeywords('');
      setInstructions('');
    } catch (err) {
      console.error('Error generating post:', err);
      setError(err.response?.data?.msg || 'Failed to generate post.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
      {/* Top bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 sm:gap-0">
        <h1 className="text-3xl sm:text-4xl font-extrabold flex flex-wrap items-center gap-2 text-center sm:text-left">
          <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent select-none">
            Post
          </span>
          <span className="bg-gradient-to-r from-pink-500 to-red-500 bg-clip-text text-transparent select-none">
            It
          </span>
          <span className="text-gray-700 whitespace-nowrap">, {user ? user.name : 'User'}!</span>
        </h1>
        
      </div>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded shadow-sm mb-6 max-w-3xl mx-auto" role="alert">
          <p className="font-semibold">Error!</p>
          <p>{error}</p>
        </div>
      )}

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {/* Left: Form */}
        <div className="lg:col-span-2 p-6 bg-white rounded-2xl shadow-lg border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Generate a New Post</h2>
          <div className="space-y-5">
            <div>
              <label htmlFor="keywords" className="block text-sm font-semibold text-gray-700 mb-1">Keywords</label>
              <input
                type="text"
                id="keywords"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm px-4 py-3 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition"
                placeholder="e.g., AI, machine learning, future of tech"
              />
            </div>
            <div>
              <label htmlFor="instructions" className="block text-sm font-semibold text-gray-700 mb-1">Instructions</label>
              <textarea
                id="instructions"
                rows="4"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm px-4 py-3 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition resize-none"
                placeholder="e.g., Write a LinkedIn post with a professional tone, max 3 sentences."
              />
            </div>
            <button
              onClick={handleGenerate}
              disabled={isLoading}
              className="w-full py-3 rounded-lg text-white font-semibold bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 shadow-lg transition disabled:opacity-50 flex justify-center items-center"
            >
              {isLoading ? (
                <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : (
                'Generate Post'
              )}
            </button>
          </div>

          {generatedPost && (
            <div className="mt-8 p-6 bg-gray-50 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-800">Generated Post</h3>
              <p className="mt-3 text-gray-700 whitespace-pre-line">{generatedPost.post}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {generatedPost.hashtags.map((tag, index) => (
                  <span key={index} className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium select-text">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: History */}
        <div className="p-6 bg-white rounded-2xl shadow-lg border border-gray-200 max-h-[600px] overflow-y-auto custom-scrollbar">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Generation History</h2>
          <div className="space-y-4">
            {history.length > 0 ? (
              history.map((post) => (
                <div
                  key={post._id}
                  className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition cursor-pointer select-text"
                  title={post.post}
                >
                  <p className="text-gray-700 text-sm truncate">{post.post}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 italic">Your generated posts will appear here.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostGeneratorUI;
