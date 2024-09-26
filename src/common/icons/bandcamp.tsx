import { h, JSX } from 'preact'

export default function BandcampIcon(props: JSX.SVGAttributes<SVGSVGElement>) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='32'
      height='32'
      viewBox='0 0 8.467 8.467'
      fill='currentColor'
      {...props}
    >
      <path
        d='M1.059 0C.472 0 0 .472 0 1.058v6.35c0 .586.472 1.058 1.058 1.058h6.35c.586 0 1.058-.472 1.058-1.058v-6.35C8.467.472 7.995 0 7.409 0zm2.01 2.511h4.227L5.398 5.955H1.171z'
        fillRule='evenodd'
      />
    </svg>
  )
}
