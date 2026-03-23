import React, { useState, useEffect } from 'react';
import styles from './LocationSuggest.module.css';

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  variant?: 'light' | 'dark';
}

export const LocationSuggest = ({ value, onChange, placeholder = 'Куда едем?', variant = 'dark' }: Props) => {
  const [inputValue, setInputValue] = useState(value);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    if (inputValue.length < 2) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        // Nominatim API: searching for cities in Russia
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            inputValue
          )}&addressdetails=1&limit=5&featuretype=city&countrycodes=ru`
        );
        const data = await response.json();
        
        // Filter to keep only relevant city-like results
        const filtered = data.map((item: any) => ({
          id: item.place_id,
          name: item.address.city || item.address.town || item.address.village || item.display_name.split(',')[0],
          region: item.address.state || item.address.region || '',
          full: item.display_name
        }));
        
        setSuggestions(filtered);
        setShowDropdown(true);
      } catch (err) {
        console.error('OSM Fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [inputValue]);

  return (
    <div className={styles.wrapper}>
      <input
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value);
          if (!e.target.value) {
            onChange('');
            setSuggestions([]);
          }
        }}
        onFocus={() => inputValue.length >= 2 && setShowDropdown(true)}
        onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
        placeholder={placeholder}
        className={`${styles.input} ${variant === 'light' ? styles.inputLight : ''}`}
      />
      {showDropdown && suggestions.length > 0 && (
        <ul className={`${styles.dropdown} ${variant === 'light' ? styles.dropdownLight : ''}`}>
          {suggestions.map((s) => (
            <li 
              key={s.id} 
              className={styles.item}
              onClick={() => { 
                onChange(s.name); 
                setInputValue(s.name);
                setShowDropdown(false);
              }}
            >
              <strong>{s.name}</strong>
              {s.region && <span style={{ fontSize: '12px', opacity: 0.7, marginLeft: '8px' }}>— {s.region}</span>}
            </li>
          ))}
        </ul>
      )}
      {isLoading && (
        <div style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '12px', color: variant === 'light' ? '#64748b' : '#94a3b8' }}>
          ...
        </div>
      )}
    </div>
  );
};
