import { useState, useRef } from 'react'
import { lsGet, lsSet } from '../utils/storage.js'

export function usePlayerIdentity() {
  const tokenRef = useRef(null)
  if (!tokenRef.current) {
    let t = lsGet('player_token')
    if (!t) {
      t = (typeof crypto !== 'undefined' && crypto.randomUUID)
        ? crypto.randomUUID()
        : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
            const r = Math.random() * 16 | 0
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
          })
      lsSet('player_token', t)
    }
    tokenRef.current = t
  }

  const [nickname, setNickname] = useState(() => lsGet('player_nickname') || '')
  const [showModal, setShowModal] = useState(() => !lsGet('player_nickname'))

  const saveNickname = (val) => {
    lsSet('player_nickname', val)
    setNickname(val)
    setShowModal(false)
  }

  return { token: tokenRef.current, nickname, showModal, saveNickname }
}
