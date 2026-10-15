import { Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'
import './ErrorBoundary.css'

interface ErrorBoundaryProps {
  children: ReactNode
  // When this changes, a boundary showing the error message tries its
  // children again. The layout passes the current path, so choosing another
  // page in the sidebar leaves a crashed page behind.
  resetKey?: string
}

interface ErrorBoundaryState {
  hasError: boolean
  // The resetKey the boundary last saw, to notice when it changes.
  resetKey?: string
}

// Catches an error thrown while drawing anything inside it, and shows a
// friendly message with a Reload button instead of a blank screen. It has to
// be a class: React only offers getDerivedStateFromError and
// componentDidCatch to classes, and has no hook that does the same.
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false,
    resetKey: this.props.resetKey,
  }

  // Called before every render. A new resetKey clears the error, so the
  // children get another chance in the same render.
  static getDerivedStateFromProps(
    props: ErrorBoundaryProps,
    state: ErrorBoundaryState,
  ): ErrorBoundaryState | null {
    if (props.resetKey !== state.resetKey) {
      return { hasError: false, resetKey: props.resetKey }
    }
    return null
  }

  // Called while React is drawing, when a child throws. The state it returns
  // swaps the broken children for the message on this same render.
  static getDerivedStateFromError(): Partial<ErrorBoundaryState> {
    return { hasError: true }
  }

  // Called after the message is on screen, with the error and which
  // components it came through. Logged so it can be found in the console.
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('A component crashed.', error, info.componentStack)
  }

  render() {
    if (!this.state.hasError) {
      return this.props.children
    }

    // role="alert" makes screen readers announce it as soon as it appears.
    return (
      <div className="error-boundary" role="alert">
        <h2 className="error-boundary__title">Something went wrong</h2>
        <p className="error-boundary__text">
          This part of OpsDesk ran into a problem and could not be shown.
          Reloading the page usually fixes it.
        </p>
        <button
          type="button"
          className="error-boundary__reload"
          onClick={() => window.location.reload()}
        >
          Reload
        </button>
      </div>
    )
  }
}

export default ErrorBoundary
