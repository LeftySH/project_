import { EMAIL, TELEGRAM_URL } from '../data.js';
import ScrollArea from './ScrollArea.jsx';

export default function ContactsBody() {
  return (
    <ScrollArea>
    <div className="contacts">
      {/* Telegram пока заглушка: если TELEGRAM_URL пустой, клик ничего не делает */}
      <a
        href={TELEGRAM_URL || '#'}
        onClick={TELEGRAM_URL ? undefined : (e) => e.preventDefault()}
        target={TELEGRAM_URL ? '_blank' : undefined}
        rel={TELEGRAM_URL ? 'noopener noreferrer' : undefined}
      >
        Telegram
      </a>
      <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
    </div>
    </ScrollArea>
  );
}
