# Project_ aka LeftySH — портфолио

React + Vite. Шрифт Roboto Mono подключён через npm (@fontsource), интернет для шрифтов не нужен.

## Запуск

```
npm install
npm run dev      # локально, http://localhost:5173
npm run build    # сборка в папку dist
```

## Что править

Всё в `src/data.js`:
- `TELEGRAM_URL` — пока пусто (заглушка), впиши ссылку
- `projects[0].url` — ссылка на Figma проекта DISK (сейчас пусто, кнопка GO TO PROJECT у него ничего не открывает)
- `EMAIL`, `BIRTH_DATE` — почта и дата рождения для счётчика возраста

Начальное состояние окон: `DESKTOP_OPEN` и `MOBILE_OPEN` в `src/App.jsx`.

## Хостинг (бесплатно)

**Vercel:** залей папку на GitHub, на vercel.com выбери Add New → Project → импортируй репозиторий. Настройки определятся сами (Vite).

**GitHub Pages:** `npm run build`, содержимое `dist` выложи в ветку gh-pages (или через GitHub Actions). Сборка уже использует относительные пути.
