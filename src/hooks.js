import { useEffect, useState } from 'react';
import { BIRTH_DATE } from './data.js';

// true, если экран подходит под media query (обновляется при ресайзе)
export function useMedia(query) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = () => setMatches(mq.matches);
    onChange();
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [query]);
  return matches;
}

const YEAR_MS = 365.2425 * 24 * 60 * 60 * 1000;
const calcAge = () => ((Date.now() - BIRTH_DATE.getTime()) / YEAR_MS).toFixed(8);

// возраст в годах с 8 знаками после запятой, тикает 10 раз в секунду
export function useAge() {
  const [age, setAge] = useState(calcAge);
  useEffect(() => {
    const id = setInterval(() => setAge(calcAge()), 100);
    return () => clearInterval(id);
  }, []);
  return age;
}
