import type { JSX } from 'preact'
import { h } from 'preact'

export default function MelonIcon(props: JSX.SVGAttributes<SVGSVGElement>) {
  return (
    <svg
      viewBox='0 0 32 32'
      xmlns='http://www.w3.org/2000/svg'
      fill='currentColor'
      {...props}
    >
      <path d='M 4 0 A 4 4 0 0 0 0 4 L 0 28 A 4 4 0 0 0 4 32 L 28 32 A 4 4 0 0 0 32 28 L 32 4 A 4 4 0 0 0 28 0 L 4 0 z M 22.810547 4.5800781 A 3.16 3.16 0 0 1 26 7.7792969 A 3.2 3.2 0 1 1 19.599609 7.7792969 A 3.22 3.22 0 0 1 22.810547 4.5800781 z M 14.589844 10.460938 A 8.5003772 8.5003772 0 0 1 14.429688 27.460938 L 14.410156 27.419922 A 8.42 8.42 0 0 1 6 18.929688 A 8.53 8.53 0 0 1 14.589844 10.460938 z M 14.519531 15.349609 A 3.73 3.73 0 0 0 10.830078 19 A 3.6 3.6 0 0 0 14.419922 22.609375 A 3.55 3.55 0 0 0 18.080078 19 A 3.61 3.61 0 0 0 14.519531 15.349609 z ' />
    </svg>
  )
}
