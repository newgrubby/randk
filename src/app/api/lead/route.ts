import { NextResponse } from 'next/server';
import { leadSchema } from '@/lib/lead-schema';
import { deliverLead, hasConfiguredNotifier, type LeadRecord } from '@/server/notifiers';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Единый маршрут приёма заявок со всех форм сайта.
 *
 * Порядок:
 *  1. проверка honeypot;
 *  2. серверная валидация той же схемой, что и на клиенте;
 *  3. доставка в настроенные каналы (Telegram; далее — e-mail/CRM);
 *  4. в dev без настроенных каналов заявка печатается в консоль,
 *     в production — возвращается понятная ошибка без деталей.
 */

/** Примитивный лимит частоты в памяти процесса — защита от простого флуда. */
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 5;
const requestLog = new Map<string, number[]>();

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const previous = requestLog.get(key) ?? [];
  const recent = previous.filter((timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS);

  recent.push(now);
  requestLog.set(key, recent);

  // Не даём мапе расти бесконечно
  if (requestLog.size > 5000) requestLog.clear();

  return recent.length > RATE_LIMIT_MAX;
}

export async function POST(request: Request): Promise<Response> {
  const clientKey =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    request.headers.get('x-real-ip') ??
    'unknown';

  if (isRateLimited(clientKey)) {
    return NextResponse.json(
      { ok: false, message: 'Слишком много заявок подряд. Попробуйте через минуту.' },
      { status: 429 },
    );
  }

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: 'Некорректный запрос.' }, { status: 400 });
  }

  const parsed = leadSchema.safeParse(raw);

  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    return NextResponse.json(
      {
        ok: false,
        message: firstIssue?.message ?? 'Проверьте правильность заполнения формы.',
        field: firstIssue?.path[0],
      },
      { status: 422 },
    );
  }

  // Honeypot заполнен — это бот. Отвечаем как при успехе, чтобы не подсказывать.
  if (parsed.data.company) {
    return NextResponse.json({ ok: true });
  }

  const lead: LeadRecord = { ...parsed.data, receivedAt: new Date().toISOString() };

  if (!hasConfiguredNotifier()) {
    if (process.env.NODE_ENV !== 'production') {
      console.info('[lead] Каналы доставки не настроены. Заявка:', {
        ...lead,
        company: undefined,
      });
      return NextResponse.json({ ok: true, delivered: false, mode: 'dev-console' });
    }

    console.error('[lead] Заявка не доставлена: не заданы TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID');
    return NextResponse.json(
      {
        ok: false,
        message:
          'Сейчас не получается отправить заявку. Пожалуйста, попробуйте позже или свяжитесь с нами в сообществе.',
      },
      { status: 503 },
    );
  }

  const results = await deliverLead(lead);
  const delivered = results.some((result) => result.ok);

  if (!delivered) {
    console.error('[lead] Ни один канал не принял заявку:', results);
    return NextResponse.json(
      {
        ok: false,
        message:
          'Сейчас не получается отправить заявку. Пожалуйста, попробуйте позже или свяжитесь с нами в сообществе.',
      },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true, delivered: true });
}
