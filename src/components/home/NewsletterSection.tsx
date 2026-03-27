"use client";

import { useState } from "react";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSent(true);
    setEmail("");
    window.setTimeout(() => setSent(false), 4000);
  };

  return (
    <section className="bg-primary-cocoa py-20 text-center text-white sm:py-24">
      <div className="mx-auto max-w-2xl px-4 sm:px-6">
        <h2 className="font-serif text-3xl sm:text-4xl">Клуб гурманов Chocolandia</h2>
        <p className="mt-4 text-sm leading-relaxed text-on-primary-container sm:text-base">
          Ранний доступ к сезонным коллекциям и закрытым дегустациям — оставьте почту, мы
          напишем о новинках без спама.
        </p>
        <form
          onSubmit={handleSubmit}
          className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-stretch sm:justify-center"
        >
          <label className="sr-only" htmlFor="newsletter-email">
            Email
          </label>
          <input
            id="newsletter-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Ваш email"
            className="w-full rounded-sm border-0 bg-primary-container px-5 py-4 text-sm text-white placeholder:text-on-primary-container/80 focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <button
            type="submit"
            className="rounded-sm bg-accent px-8 py-4 text-[11px] font-bold uppercase tracking-[0.2em] text-white transition hover:opacity-95 sm:w-auto"
          >
            {sent ? "Готово ✓" : "Подписаться"}
          </button>
        </form>
        <p className="mt-4 text-xs text-on-primary-container/90">
          Демо-форма: данные никуда не отправляются, только локальное подтверждение.
        </p>
      </div>
    </section>
  );
}
