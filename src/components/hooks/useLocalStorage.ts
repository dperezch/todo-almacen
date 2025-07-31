"use client";

import { useState } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    // Initialize state from localStorage on first render
    if (typeof window === "undefined") {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      if (item === null) {
        return initialValue;
      }

      // Handle different data types
      if (typeof initialValue === "boolean") {
        return (item === "true") as T;
      } else if (typeof initialValue === "string") {
        return item as T;
      } else {
        // For objects and arrays, parse as JSON
        return JSON.parse(item);
      }
    } catch (error) {
      console.error(`Error loading ${key} from localStorage:`, error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);

      if (typeof window !== "undefined") {
        // Handle different data types for storage
        if (
          typeof valueToStore === "boolean" ||
          typeof valueToStore === "string"
        ) {
          window.localStorage.setItem(key, String(valueToStore));
        } else {
          // For objects and arrays, stringify as JSON
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      }
    } catch (error) {
      console.error(`Error saving ${key} to localStorage:`, error);
    }
  };

  return [storedValue, setValue] as const;
}
