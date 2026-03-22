import { useState, useEffect } from 'react';

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);
  
  useEffect(() => {
    const saved = localStorage.getItem('hatka-favorites');
    if (saved) {
      try { setFavorites(JSON.parse(saved)); } catch (e) {}
    }
    const handleStorage = () => {
      const updated = localStorage.getItem('hatka-favorites');
      if (updated) {
        try { setFavorites(JSON.parse(updated)); } catch (e) {}
      }
    };
    window.addEventListener('favorites-updated', handleStorage);
    return () => window.removeEventListener('favorites-updated', handleStorage);
  }, []);

  const toggleFavorite = (id: string) => {
    const saved = localStorage.getItem('hatka-favorites');
    let current = saved ? JSON.parse(saved) : [];
    if (current.includes(id)) {
      current = current.filter((favId: string) => favId !== id);
    } else {
      current.push(id);
    }
    localStorage.setItem('hatka-favorites', JSON.stringify(current));
    setFavorites(current);
    window.dispatchEvent(new Event('favorites-updated'));
  };

  const isFavorite = (id: string) => favorites.includes(id);

  return { favorites, toggleFavorite, isFavorite };
}
