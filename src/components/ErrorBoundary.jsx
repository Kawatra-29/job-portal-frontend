import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center font-['DM_Sans'] text-center px-6 transition-colors duration-200">
          <div className="font-['Syne'] text-7xl font-extrabold text-red-500/20 mb-4">
            ⚠️
          </div>
          <h1 className="font-['Syne'] text-2xl font-extrabold text-slate-900 dark:text-white mb-3">
            Something went wrong
          </h1>
          <p className="text-slate-505 dark:text-slate-400 text-sm max-w-md leading-relaxed mb-6">
            An unexpected error occurred. Please try reloading the page or going back.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-md cursor-pointer border-none"
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
