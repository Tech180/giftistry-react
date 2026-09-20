import React from 'react';
import { ErrorBoundaryTemplate } from './error-boundary.html';
import type { Props } from './interfaces/props.interface';
import type { State } from './interfaces/state.interface';

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = {
    hasError: false,
  };

  static getDerivedStateFromError(): State {
    return {
      hasError: true,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('App error boundary caught an error:', error, errorInfo);
  }

  private handleRetry = (): void => {
    this.setState({
      hasError: false,
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <ErrorBoundaryTemplate
          onRetry = {
            this.handleRetry
          }
        />
      );
    }

    return this.props.children;
  }
}
