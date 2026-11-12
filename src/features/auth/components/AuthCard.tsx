import type { ReactNode } from 'react'
import './AuthCard.css'

interface AuthCardProps {
  // The page's heading, such as "Log in".
  title: string
  // The form, and any message above it.
  children: ReactNode
  // Under the card, such as a link to the other auth page.
  footer: ReactNode
}

// The frame for the login and register pages: the OpsDesk name, then a
// white card in the middle of the page. These pages are outside the app's
// usual layout, since there is no sidebar until someone is signed in.
function AuthCard({ title, children, footer }: AuthCardProps) {
  return (
    <main className="auth-card">
      <div className="auth-card__inner">
        <p className="auth-card__brand">
          <span className="auth-card__logo" aria-hidden="true">
            O
          </span>
          OpsDesk
        </p>
        <section className="auth-card__panel" aria-labelledby="auth-title">
          <h1 id="auth-title" className="auth-card__title">
            {title}
          </h1>
          {children}
        </section>
        <p className="auth-card__footer">{footer}</p>
      </div>
    </main>
  )
}

export default AuthCard
