import { Component, type ReactNode } from 'react';
import styles from './ErrorBoundary.module.css';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

// Fallback UI as a function component
const ErrorFallback = ({ error, onReload }: { error: Error | null; onReload: () => void }) => (
  <div className={styles.errorBoundary}>
    <div className={styles.errorContent}>
      <h2 className={styles.errorTitle}>Something went wrong</h2>
      <p className={styles.errorMessage}>{error?.message || 'An unexpected error occurred'}</p>
      <button className={styles.reloadButton} onClick={onReload}>
        Reload Page
      </button>
    </div>
  </div>
);

// Error Boundary requires class component (React limitation)
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  handleReload = (): void => {
    window.location.reload();
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} onReload={this.handleReload} />;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
