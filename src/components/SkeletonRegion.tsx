import type { ReactNode } from 'react'
import './SkeletonRegion.css'

interface SkeletonRegionProps {
  // What a screen reader says instead of the grey shapes, such as
  // "Loading tickets…".
  label: string
  // The Skeleton blocks, laid out like the real content.
  children: ReactNode
  className?: string
}

// Wraps a skeleton layout. Sighted people see the shapes; screen readers are
// told only the label. role="status" lets them announce it without
// interrupting, and aria-hidden keeps them from reading the empty shapes.
function SkeletonRegion({ label, children, className }: SkeletonRegionProps) {
  return (
    <div role="status" className={`skeleton-region ${className ?? ''}`}>
      <span className="visually-hidden">{label}</span>
      <div aria-hidden="true">{children}</div>
    </div>
  )
}

export default SkeletonRegion
