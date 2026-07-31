import { leadSourceLabels } from '@/lib/lead-schema';
import type { LeadNotifier, LeadRecord } from './types';

/**
 * Доставка заявок в Telegram.
 *
 * Токен и chat_id читаются только из переменных окружения —
 * в коде и в репозитории их нет.
 */

const TELEGRAM_API = 'https://api.telegram.org';

/** Экранирование под parse_mode=HTML. */
function escapeHtml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function formatMessage(lead: LeadRecord): string {
  const lines: string[] = [
    `<b>Новая заявка — ${escapeHtml(leadSourceLabels[lead.source])}</b>`,
    '',
    `👤 <b>Имя:</b> ${escapeHtml(lead.name)}`,
    `📞 <b>Телефон:</b> ${escapeHtml(lead.phone)}`,
  ];

  if (lead.city) lines.push(`📍 <b>Город:</b> ${escapeHtml(lead.city)}`);
  if (lead.age) lines.push(`🎂 <b>Возраст:</b> ${escapeHtml(lead.age)}`);
  if (lead.program) lines.push(`📚 <b>Направление:</b> ${escapeHtml(lead.program)}`);
  if (lead.goal) lines.push(`🎯 <b>Цель:</b> ${escapeHtml(lead.goal)}`);
  if (lead.message) lines.push(`💬 <b>Сообщение:</b> ${escapeHtml(lead.message)}`);

  lines.push('');
  lines.push(
    `🕒 ${new Date(lead.receivedAt).toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })} (МСК)`,
  );
  if (lead.pageUrl) lines.push(`🔗 ${escapeHtml(lead.pageUrl)}`);

  if (lead.utm && Object.keys(lead.utm).length > 0) {
    const utm = Object.entries(lead.utm)
      .map(([key, value]) => `${key}=${value}`)
      .join(', ');
    lines.push(`📈 ${escapeHtml(utm)}`);
  }

  return lines.join('\n');
}

export const telegramNotifier: LeadNotifier = {
  channel: 'telegram',

  isConfigured() {
    return Boolean(process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID);
  },

  async send(lead) {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
      return { channel: 'telegram', ok: false, error: 'not_configured' };
    }

    try {
      const response = await fetch(`${TELEGRAM_API}/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: formatMessage(lead),
          parse_mode: 'HTML',
          disable_web_page_preview: true,
        }),
        // Заявка не должна «висеть» при недоступности Telegram
        signal: AbortSignal.timeout(8000),
      });

      if (!response.ok) {
        const body = await response.text().catch(() => '');
        return {
          channel: 'telegram',
          ok: false,
          error: `HTTP ${response.status}: ${body.slice(0, 200)}`,
        };
      }

      return { channel: 'telegram', ok: true };
    } catch (error) {
      return {
        channel: 'telegram',
        ok: false,
        error: error instanceof Error ? error.message : 'unknown_error',
      };
    }
  },
};
