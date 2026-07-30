import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  failed: boolean;
}

export class AppErrorBoundary extends Component<Props, State> {
  state: State = { failed: false };

  static getDerivedStateFromError(): State {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (import.meta.env.DEV) console.error(error, info);
  }

  render() {
    if (this.state.failed) {
      return (
        <main className="fatal-error">
          <h1>DwellSignal hit a snag</h1>
          <p>Your saved demo data is still in this browser. Reload the page to try again.</p>
          <button className="primary" onClick={() => window.location.reload()}>
            Reload DwellSignal
          </button>
        </main>
      );
    }
    return this.props.children;
  }
}
