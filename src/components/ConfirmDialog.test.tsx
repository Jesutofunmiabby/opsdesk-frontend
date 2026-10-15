import { useState } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ConfirmDialog from './ConfirmDialog'

interface HarnessProps {
  onConfirm: () => void
  isBusy?: boolean
}

// A stand-in page: a Delete button that opens the dialog, as the ticket page
// does, so focus can be checked going in and coming back.
function Harness({ onConfirm, isBusy = false }: HarnessProps) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        Delete
      </button>
      <ConfirmDialog
        open={open}
        title="Delete ticket #4?"
        message="This cannot be undone."
        confirmLabel="Delete"
        busyLabel="Deleting…"
        isBusy={isBusy}
        onConfirm={onConfirm}
        onCancel={() => setOpen(false)}
      />
    </>
  )
}

// Opens the dialog the way a person would, and hands back the opener.
async function openDialog(user: ReturnType<typeof userEvent.setup>) {
  const opener = screen.getByRole('button', { name: 'Delete' })
  await user.click(opener)
  return opener
}

describe('ConfirmDialog', () => {
  it('does nothing until it is opened, then asks first', async () => {
    const user = userEvent.setup()
    const onConfirm = vi.fn()
    render(<Harness onConfirm={onConfirm} />)

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

    await openDialog(user)

    // One click on the page's Delete only opens the question.
    expect(onConfirm).not.toHaveBeenCalled()
    const dialog = screen.getByRole('dialog', { name: 'Delete ticket #4?' })
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(dialog).toHaveAccessibleDescription('This cannot be undone.')
  })

  it('moves focus to Cancel when it opens', async () => {
    const user = userEvent.setup()
    render(<Harness onConfirm={vi.fn()} />)

    await openDialog(user)

    expect(screen.getByRole('button', { name: 'Cancel' })).toHaveFocus()
  })

  it('closes on Escape and gives focus back to the Delete button', async () => {
    const user = userEvent.setup()
    const onConfirm = vi.fn()
    render(<Harness onConfirm={onConfirm} />)
    const opener = await openDialog(user)

    await user.keyboard('{Escape}')

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(opener).toHaveFocus()
    expect(onConfirm).not.toHaveBeenCalled()
  })

  it('closes on Cancel and gives focus back to the Delete button', async () => {
    const user = userEvent.setup()
    const onConfirm = vi.fn()
    render(<Harness onConfirm={onConfirm} />)
    const opener = await openDialog(user)

    await user.click(screen.getByRole('button', { name: 'Cancel' }))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(opener).toHaveFocus()
    expect(onConfirm).not.toHaveBeenCalled()
  })

  it('keeps Tab and Shift+Tab inside the dialog', async () => {
    const user = userEvent.setup()
    render(<Harness onConfirm={vi.fn()} />)
    await openDialog(user)

    const dialog = screen.getByRole('dialog')
    const cancel = screen.getByRole('button', { name: 'Cancel' })
    // The dialog's own Delete, not the page's one behind it.
    const confirm = dialog.querySelector('.confirm-dialog__confirm')

    await user.tab()
    expect(confirm).toHaveFocus()
    // From the last button, Tab wraps to the first instead of leaving.
    await user.tab()
    expect(cancel).toHaveFocus()
    // And Shift+Tab from the first wraps to the last.
    await user.tab({ shift: true })
    expect(confirm).toHaveFocus()
  })

  it('calls onConfirm once when its Delete is pressed', async () => {
    const user = userEvent.setup()
    const onConfirm = vi.fn()
    render(<Harness onConfirm={onConfirm} />)
    await openDialog(user)

    const dialog = screen.getByRole('dialog')
    const confirm = dialog.querySelector('.confirm-dialog__confirm')
    if (!(confirm instanceof HTMLElement)) {
      throw new Error('The dialog has no confirm button')
    }
    await user.click(confirm)

    expect(onConfirm).toHaveBeenCalledTimes(1)
  })

  it('disables both buttons and ignores Escape while busy', async () => {
    const user = userEvent.setup()
    const { rerender } = render(<Harness onConfirm={vi.fn()} />)
    await openDialog(user)

    rerender(<Harness onConfirm={vi.fn()} isBusy />)

    expect(screen.getByRole('button', { name: 'Cancel' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Deleting…' })).toBeDisabled()
    // Focus stays inside, on the dialog itself.
    expect(screen.getByRole('dialog')).toHaveFocus()

    await user.keyboard('{Escape}')
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })
})
