import React from 'react';

const Loader = ({ fullScreen = false, message = 'Loading details...' }) => {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
        <div className="h-10 w-10 animate-spin rounded-full border-3 border-primary-200 border-t-primary-800" />
        <p className="mt-3 text-sm font-medium text-slate-600">{message}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="h-8 w-8 animate-spin rounded-full border-3 border-primary-200 border-t-primary-800" />
      {message && <p className="mt-2.5 text-xs font-medium text-slate-500">{message}</p>}
    </div>
  );
};

export default Loader;
