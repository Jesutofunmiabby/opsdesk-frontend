import type { CSSProperties } from 'react'
import './Skeleton.css'

interface SkeletonProps {
  // Any CSS length, or a number of pixels. Width defaults to the full width
  // of its container; height to one line of text.
  width?: CSSProperties['width']
  height?: CSSProperties['height']
  // The corners: 'sm' for buttons and lines (the default), 'md' for cards
  // and panels, 'pill' for badges and counts.
  shape?: 'sm' | 'md' | 'pill'
  className?: string
}

// One grey placeholder block with a shimmer, standing in for a piece of
// content that is still loading. It means nothing on its own, so screen
// readers skip it: wrap skeletons in a SkeletonRegion, which says "Loading".
function Skeleton({ width, height, shape = 'sm', className }: SkeletonProps) {
  return (
    <span
      className={`skeleton skeleton--${shape} ${className ?? ''}`}
      style={{ width, height }}
      aria-hidden="true"
    />
  )
}

export default Skeleton
