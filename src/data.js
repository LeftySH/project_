import disk from './assets/covers/disk.webp';
import shelf from './assets/covers/shelf.webp';
import lite from './assets/covers/lite.webp';
import inmypocket from './assets/covers/inmypocket.webp';

// Дата рождения для живого счётчика возраста (Новосибирск, UTC+7)
export const BIRTH_DATE = new Date('2008-04-14T00:00:00+07:00');

export const EMAIL = 'leftyshplay1987@gmail.com';

// Заглушка: пока пусто, ссылка ничего не открывает. Впиши сюда адрес, когда будет.
export const TELEGRAM_URL = '';

// url — куда ведёт кнопка GO TO PROJECT (ссылка на Figma проекта)
export const projects = [
  {
    id: 'disk',
    file: '01_DISK.jpg',
    year: 2026,
    tag: 'UI/UX',
    cover: disk,
    url: '', // TODO: ссылка на Figma-файл DISK
  },
  {
    id: 'shelf',
    file: '02_SHELF.jpg',
    year: 2026,
    tag: 'UI/UX',
    cover: shelf,
    url: 'https://www.figma.com/design/tvGz44oqfGTa7KjY7KDfcl/Shelf',
  },
  {
    id: 'lite',
    file: '03_LITE.jpg',
    year: 2023,
    tag: 'UI/UX',
    cover: lite,
    url: 'https://www.figma.com/design/M7GP4DZE59G1sXCK3TZall/LITE-mini',
  },
  {
    id: 'inmypocket',
    file: '04_INMYPOCKET.jpg',
    year: 2025,
    tag: 'UI/UX',
    cover: inmypocket,
    url: 'https://www.figma.com/design/wZA3B3wxghggm5WXvTV3j2/InMyPocket',
  },
];
