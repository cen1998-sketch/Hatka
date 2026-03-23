import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LocationSuggest } from '../../../features/location-suggest'
import styles from './SearchPanel.module.css'

export const SearchPanel = () => {
  const navigate = useNavigate()
  const [city, setCity] = useState('')
  const [checkIn, setCheckIn] = useState<string | null>(null)
  const [checkOut, setCheckOut] = useState<string | null>(null)
  const [adults, setAdults] = useState(1)

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (city) params.set('city', city)
    if (checkIn) params.set('checkIn', checkIn)
    if (checkOut) params.set('checkOut', checkOut)
    params.set('adults', String(adults))

    navigate(`/search?${params.toString()}`)
  }

  return (
    <div className={styles.panel}>
      <div style={{ flex: 1.5 }}>
         <LocationSuggest value={city} onChange={setCity} />
      </div>
      
      <div className={styles.divider} />

      <div style={{ flex: 1, color: 'white', opacity: 0.8, fontSize: '14px', padding: '0 12px' }}>
        Заезд — Выезд
      </div>

      <div className={styles.divider} />

      <div style={{ flex: 0.8, color: 'white', opacity: 0.8, fontSize: '14px', padding: '0 12px' }}>
        {adults} гость
      </div>
      
      <button className={styles.searchBtn} onClick={handleSearch}>
        Найти
      </button>
    </div>
  )
}
