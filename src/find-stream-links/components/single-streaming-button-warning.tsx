import { FunctionComponent, h } from 'preact'
import { useCallback, useEffect, useState } from 'preact/hooks'

import InfoIcon from '../../../res/svg/info.svg'
import { useLocalStorage } from '../../common/hooks/use-local-storage'
import { clsx } from '../../common/utils/clsx'
import { waitForElement } from '../../common/utils/dom'
import iconStyles from '../styles/icon.module.css'

export const SingleStreamingButtonWarning: FunctionComponent = () => {
  const [isUsingSingleStreamingButton, setUsingSingleStreamingButton] =
    useState(false)

  const checkUsingSingleStreamingButton = useCallback(async () => {
    try {
      await waitForElement('#linkfire_button_container_top') // throws when not found
      setUsingSingleStreamingButton(true)
    } catch {
      setUsingSingleStreamingButton(false)
    }
  }, [])

  useEffect(
    () => void checkUsingSingleStreamingButton(),
    [checkUsingSingleStreamingButton]
  )

  const [showPopup, setShowPopup] = useState(false)

  const [popupDisabled, setPopupDisabled] = useLocalStorage(
    'brym.disabledSingleStreamingButtonPopup',
    false
  )

  if (popupDisabled ?? true) return null
  if (!isUsingSingleStreamingButton) return null
  return (
    <div style={{ position: 'relative' }}>
      <button
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          display: 'block',
        }}
        onClick={() => setShowPopup((show) => !show)}
      >
        <InfoIcon
          className={clsx(iconStyles.icon, iconStyles.full)}
          width={20}
          height={20}
          style={{ color: '#fce00f', display: 'block' }}
        />
      </button>
      {showPopup && (
        <div
          style={{
            position: 'absolute',
            background: 'var(--mono-f8)',
            border: '1px var(--mono-d) solid',
            padding: 8,
            zIndex: 100,
            width: 500,
            left: -250,
            top: 'calc(100% + 10px)',
          }}
        >
          <button
            className={clsx(iconStyles.icon, iconStyles.full)}
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              padding: '4px 8px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
            }}
            onClick={() => setShowPopup(false)}
          >
            x
          </button>
          <div style={{ marginBottom: 4 }}>
            <b>Single Streaming Button Detected</b>
          </div>
          <div>
            BetterRYM is unable to detect links from the Single Streaming
            Button.
          </div>
          <div>For best results, turn it off in your RYM settings.</div>
          <div style={{ marginTop: 8 }}>
            <a
              className='btn blue_btn'
              href='https://rateyourmusic.com/account/preferences'
              target='_blank'
              rel='noreferrer'
            >
              Open settings
            </a>
            <input
              type='button'
              value='Keep using Single Streaming Button'
              onClick={() => setPopupDisabled(true)}
            />
          </div>
        </div>
      )}
    </div>
  )
}
