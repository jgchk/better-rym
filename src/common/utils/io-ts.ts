import { Decoder } from 'io-ts'
import { failure } from 'io-ts/PathReporter'

export const decode = <B>(decoder: Decoder<unknown, B>) => (
  data: string
): B => {
  const decoded = decoder.decode(JSON.parse(data))
  if (decoded._tag === 'Left')
    throw new Error(`Decoding error: ${failure(decoded.left).join('\n')}`)
  else return decoded.right
}
