import { NextResponse } from "next/server";

type CheckoutItem = {
  id: string;
  code: string;
  name: string;
  price: number;
  quantity: number;
};

type CheckoutPayload = {
  customer?: {
    name?: string;
    phone?: string;
    address?: string;
    comment?: string;
  };
  items?: CheckoutItem[];
  total?: number;
};

function formatPrice(value: number): string {
  return `${value.toLocaleString("ru-BY")} BYN.`;
}

function escapeHtml(text: string): string {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as CheckoutPayload;
    const customer = payload.customer;
    const items = payload.items ?? [];
    const total = payload.total ?? 0;

    if (!customer?.name || !customer.phone || !customer.address) {
      return NextResponse.json(
        { ok: false, error: "Заполните имя, телефон и адрес." },
        { status: 400 },
      );
    }

    if (!/^\+375\d{9}$/.test(customer.phone)) {
      return NextResponse.json(
        { ok: false, error: "Телефон должен быть в формате +375XXXXXXXXX." },
        { status: 400 },
      );
    }

    if (!items.length) {
      return NextResponse.json(
        { ok: false, error: "Корзина пуста." },
        { status: 400 },
      );
    }

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      return NextResponse.json(
        { ok: false, error: "TELEGRAM_BOT_TOKEN или TELEGRAM_CHAT_ID не настроены." },
        { status: 500 },
      );
    }

    const lines = items.map((item, index) => {
      const itemTotal = item.price * item.quantity;
      return `${index + 1}. ${escapeHtml(item.name)} x ${item.quantity} = <b>${formatPrice(itemTotal)}</b>`;
    });

    const message = [
      "🍫 <b>Новый заказ Chocolandia.by</b>",
      "",
      "👤 <b>Клиент:</b>",
      `Имя: ${escapeHtml(customer.name)}`,
      `Телефон: ${escapeHtml(customer.phone)}`,
      `Адрес: ${escapeHtml(customer.address)}`,
      `Комментарий: ${escapeHtml(customer.comment || "—")}`,
      "",
      "🧾 <b>Состав заказа:</b>",
      ...lines,
      "",
      `💰 <b>Итого:</b> ${formatPrice(total)}`,
    ].join("\n");

    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: "HTML",
          disable_web_page_preview: true,
        }),
      },
    );

    if (!telegramResponse.ok) {
      const errorText = await telegramResponse.text();
      return NextResponse.json(
        { ok: false, error: `Telegram API error: ${errorText}` },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Не удалось обработать заказ." },
      { status: 500 },
    );
  }
}
