import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement>

const defaults = {
  'aria-hidden': true,
  fill: 'none',
  stroke: 'currentColor',
  strokeLinecap: 'square' as const,
  strokeWidth: 1.6,
  viewBox: '0 0 24 24',
}

export function ArrowIcon(props: IconProps) {
  return (
    <svg {...defaults} {...props}>
      <path d="M5 12h14M14 7l5 5-5 5" />
    </svg>
  )
}

export function BlobIcon(props: IconProps) {
  return (
    <svg {...defaults} {...props}>
      <ellipse cx="12" cy="6" rx="7.5" ry="3" />
      <path d="M4.5 6v6c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3V6M4.5 12v6c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3v-6" />
    </svg>
  )
}

export function BracketsIcon(props: IconProps) {
  return (
    <svg {...defaults} {...props}>
      <path d="M8 3H4v18h4M16 3h4v18h-4M14.5 8.5l-5 7M9 9l-2 3 2 3M15 9l2 3-2 3" />
    </svg>
  )
}

export function IngestIcon(props: IconProps) {
  return (
    <svg {...defaults} {...props}>
      <path d="M4 5h7v5H4zM13 14h7v5h-7zM11 7.5h3.5a2 2 0 012 2V14M8 10v2.5a2 2 0 002 2h3" />
    </svg>
  )
}
