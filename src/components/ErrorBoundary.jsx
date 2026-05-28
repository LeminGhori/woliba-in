import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Keep console error for dev; avoid crashing the whole app.
    console.error('Uncaught error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="page-shell" style={{ padding: 24 }}>
          <div className="card">
            <h1 className="card__heading">Something went wrong</h1>
            <p className="card__subtitle">
              Please refresh the page and try again.
            </p>
            <div className="step-actions step-actions--single">
              <button type="button" className="btn btn--outline" onClick={this.handleReset}>
                Try again
              </button>
              <button
                type="button"
                className="btn btn--primary"
                onClick={() => window.location.reload()}
              >
                Refresh
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

