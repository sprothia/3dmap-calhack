import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}
interface State {
  error: Error | null
}

/** Catches render errors so the app shows a message instead of a blank screen. */
export default class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error) {
    // Surface it in the console for debugging.
    console.error('App crashed:', error)
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-cream px-6 text-center">
          <div className="text-4xl">🧭</div>
          <h1 className="mt-3 font-display text-2xl font-bold text-ink">
            Something went sideways
          </h1>
          <p className="mt-2 max-w-md text-sm text-cocoa">
            {this.state.error.message}
          </p>
          <button
            onClick={() => {
              this.setState({ error: null })
              window.location.reload()
            }}
            className="mt-5 rounded-full bg-sunset px-5 py-2.5 text-sm font-semibold text-cream shadow transition hover:bg-[#d9632d]"
          >
            Reload
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
