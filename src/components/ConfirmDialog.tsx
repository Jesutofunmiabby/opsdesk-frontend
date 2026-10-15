import { useEffect, useId, useRef } from 'react'
import type { KeyboardEvent, MouseEvent } from 'react'
import { createPortal } from 'react-dom'
import './ConfirmDialog.css'

// Everything inside the dialog that Tab can reach.
const FOCUSABLE =
  'a[href], button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'

interface ConfirmDialogProps {
  // Shown while true; the page decides when to open and close it.
  open: boolean
  // A question, such as "Delete ticket #4?"
  title: string
  // What will happen, such as "This cannot be undone."
  message: string
  // The button that goes ahead, such as "Delete".
  confirmLabel: string
  // That button's text while the action runs, such as "Deleting…".
  busyLabel?: string
  // True while the action runs: both buttons are disabled and Escape does
  // nothing, so it cannot be sent twice or seem cancelled halfway.
  isBusy?: boolean
  onConfirm: () => void
  onCancel: () => void
}

// A modal that asks before something that cannot be undone. Nothing happens
// until its confirm button is pressed. While it is open, focus stays inside
// it; Escape, Cancel or a click on the dimmed page closes it, and focus goes
// back to whatever opened it.
function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel,
  busyLabel,
  isBusy = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const titleId = useId()
  const messageId = useId()
  const dialogRef = useRef<HTMLDivElement>(null)
  const cancelRef = useRef<HTMLButtonElement>(null)

  // On opening, remember what had focus (the button that opened it) and move
  // focus to Cancel, the safe choice, so pressing Enter straight away does
  // not delete anything. On closing, give focus back, unless that button
  // has gone, as it has after a ticket is deleted and the page changes.
  useEffect(() => {
    if (!open) {
      return
    }
    const opener =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null
    cancelRef.current?.focus()
    return () => {
      if (opener?.isConnected) {
        opener.focus()
      }
    }
  }, [open])

  // A disabled button loses focus, which would drop it out of the dialog
  // onto the page. While busy, the dialog itself holds focus instead.
  useEffect(() => {
    if (open && isBusy) {
      dialogRef.current?.focus()
    }
  }, [open, isBusy])

  if (!open) {
    return null
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Escape') {
      event.stopPropagation()
      if (!isBusy) {
        onCancel()
      }
      return
    }
    if (event.key !== 'Tab' || !dialogRef.current) {
      return
    }

    // Keeps Tab inside: from the last control it wraps to the first, and
    // Shift+Tab from the first wraps to the last.
    const focusable = Array.from(
      dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE),
    )
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    const active = document.activeElement
    if (!first || !last) {
      event.preventDefault()
      return
    }
    if (event.shiftKey && (active === first || active === dialogRef.current)) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && active === last) {
      event.preventDefault()
      first.focus()
    }
  }

  // Only a click on the dimmed area itself, not one inside the box.
  function handleBackdropMouseDown(event: MouseEvent<HTMLDivElement>) {
    if (event.target === event.currentTarget && !isBusy) {
      onCancel()
    }
  }

  // Drawn at the end of <body>, outside the page, so it sits above
  // everything and is not clipped by any container.
  return createPortal(
    <div
      className="confirm-dialog__backdrop"
      onMouseDown={handleBackdropMouseDown}
    >
      {/* aria-modal tells screen readers the page behind cannot be used.
          tabIndex={-1} lets the box hold focus while the buttons are
          disabled, without adding it to the Tab order. */}
      <div
        ref={dialogRef}
        className="confirm-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={messageId}
        tabIndex={-1}
        onKeyDown={handleKeyDown}
      >
        <h2 id={titleId} className="confirm-dialog__title">
          {title}
        </h2>
        <p id={messageId} className="confirm-dialog__message">
          {message}
        </p>
        <div className="confirm-dialog__actions">
          <button
            ref={cancelRef}
            type="button"
            className="confirm-dialog__cancel"
            onClick={onCancel}
            disabled={isBusy}
          >
            Cancel
          </button>
          <button
            type="button"
            className="confirm-dialog__confirm"
            onClick={onConfirm}
            disabled={isBusy}
          >
            {isBusy && busyLabel ? busyLabel : confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
}

export default ConfirmDialog
