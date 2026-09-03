import { Component, type ReactNode, type ErrorInfo } from 'react';
import { ShieldAlert, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('CyberShield Uncaught Error Boundary Catch:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex-1 flex items-center justify-center p-6 bg-cyber-dark min-h-full">
          <div className="max-w-md w-full glass-panel p-8 rounded-3xl border border-red-500/40 text-center space-y-4 shadow-2xl bg-black/80">
            <div className="w-16 h-16 rounded-2xl bg-red-500/15 border border-red-500/30 flex items-center justify-center mx-auto text-red-400">
              <ShieldAlert className="w-8 h-8 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-display font-bold text-red-400 tracking-wide">
                {this.props.fallbackTitle || 'Security Module Fault Isolated'}
              </h2>
              <p className="text-xs text-gray-400 mt-1 font-mono leading-relaxed">
                {this.state.error?.message || 'An unexpected rendering anomaly occurred in this telemetry module.'}
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={this.handleReset}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-indigo-600 hover:from-red-400 text-white font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 mx-auto shadow-lg transition-all cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Recover & Reload Module</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
