import { render, screen } from '@testing-library/react'
import ErrorBoundary from './ErrorBoundary'

// A component that always crashes while drawing, standing in for a broken
// page.
function Broken(): never {
  throw new Error('Broken on purpose')
}

describe('ErrorBoundary', () => {
  // Undoes any console silencing after each test, even one that fails, so
  // other tests still show real errors.
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('shows its children when nothing goes wrong', () => {
    render(
      <ErrorBoundary>
        <p>Page content</p>
      </ErrorBoundary>,
    )

    expect(screen.getByText('Page content')).toBeInTheDocument()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('shows the friendly message when a child throws', () => {
    // React and the boundary both log the crash with console.error. That is
    // expected here, so it is silenced for this test only.
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {})

    render(
      <ErrorBoundary>
        <Broken />
      </ErrorBoundary>,
    )

    expect(screen.getByRole('alert')).toHaveTextContent('Something went wrong')
    expect(screen.getByRole('button', { name: 'Reload' })).toBeInTheDocument()
    // componentDidCatch logged the error.
    expect(consoleError).toHaveBeenCalledWith(
      'A component crashed.',
      expect.objectContaining({ message: 'Broken on purpose' }),
      expect.any(String),
    )
  })

  it('tries its children again when the reset key changes', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})

    const { rerender } = render(
      <ErrorBoundary resetKey="/broken">
        <Broken />
      </ErrorBoundary>,
    )
    expect(screen.getByText('Something went wrong')).toBeInTheDocument()

    // Like choosing another page in the sidebar.
    rerender(
      <ErrorBoundary resetKey="/working">
        <p>Another page</p>
      </ErrorBoundary>,
    )

    expect(screen.getByText('Another page')).toBeInTheDocument()
    expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument()
  })
})
