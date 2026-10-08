import type { MouseEvent } from 'react'
import './SkipLink.css'

interface SkipLinkProps {
  // The id of the element to jump to, such as the page's main area.
  targetId: string
}

// The first thing Tab reaches on every page. It stays hidden until focused,
// then lets a keyboard user jump past the header and sidebar straight to the
// page content instead of tabbing through every navigation link first.
function SkipLink({ targetId }: SkipLinkProps) {
  // Moves focus by hand rather than following the #link, which would add the
  // id to the URL. The target needs tabIndex={-1} to be able to take focus.
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault()
    document.getElementById(targetId)?.focus()
  }

  return (
    <a href={`#${targetId}`} className="skip-link" onClick={handleClick}>
      Skip to main content
    </a>
  )
}

export default SkipLink
