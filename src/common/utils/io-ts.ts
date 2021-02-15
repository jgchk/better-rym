import { Either, chain, mapLeft, parseJSON, toError } from 'fp-ts/Either'
import { flow, pipe } from 'fp-ts/function'
import { Decoder } from 'io-ts'
import { failure } from 'io-ts/PathReporter'

export const decode = <T>(decoder: Decoder<unknown, T>) => (
  dataString: string
): Either<Error, T> =>
  pipe(
    parseJSON(dataString, toError),
    chain(
      flow(
        (dataJson) => decoder.decode(dataJson),
        mapLeft((errors) => new Error(failure(errors).join('\n')))
      )
    )
  )
