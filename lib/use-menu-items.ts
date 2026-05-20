'use client';

import { useEffect, useState } from 'react';
import { menuItems, type FoodItem } from '@/lib/data/menu';

export function useMenuItems() {
  const [items, setItems] = useState<FoodItem[]>(menuItems);

  useEffect(() => {
    let isMounted = true;

    fetch('/api/menu')
      .then((response) => (response.ok ? response.json() : null))
      .then((payload: { items?: FoodItem[] } | null) => {
        if (isMounted && payload?.items?.length) {
          setItems(payload.items);
        }
      })
      .catch(() => {
        // Static menu data keeps the page usable during local DB setup.
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return items;
}
