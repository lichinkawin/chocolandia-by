import Link from "next/link";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";

export default function ContactsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="mx-auto flex w-full flex-1 max-w-screen-2xl flex-col gap-10 bg-background px-4 pb-16 pt-[88px] sm:px-6 sm:pb-20 sm:pt-[96px] lg:px-12">
        <section className="space-y-3">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-foreground/50">
            Контакты
          </p>
          <h1 className="font-serif text-4xl text-primary-cocoa sm:text-5xl">
            Свяжитесь с нами
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-foreground-muted sm:text-base">
            Ниже базовая информация для связи. Позже можно заменить на актуальные
            данные компании, встроить карту и добавить форму обратной связи.
          </p>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <article className="space-y-3 rounded-2xl border border-border/80 bg-card p-5">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground-muted/80">
              Телефон
            </h2>
            <p className="text-lg font-medium text-primary-cocoa">+375 (29) 000-00-00</p>
            <p className="text-sm text-foreground-muted">Пн-Вс: 10:00 - 20:00</p>
          </article>

          <article className="space-y-3 rounded-2xl border border-border/80 bg-card p-5">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground-muted/80">
              Email
            </h2>
            <p className="text-lg font-medium text-primary-cocoa">hello@chocolandia.by</p>
            <p className="text-sm text-foreground-muted">
              Ответим в течение рабочего дня.
            </p>
          </article>

          <article className="space-y-3 rounded-2xl border border-border/80 bg-card p-5">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground-muted/80">
              Адрес
            </h2>
            <p className="text-lg font-medium text-primary-cocoa">г. Минск, ул. Примерная, 10</p>
            <p className="text-sm text-foreground-muted">
              Самовывоз и доставка по Минску.
            </p>
          </article>
        </section>

        <section className="rounded-2xl border border-border/80 bg-card p-5 sm:p-6">
          <h2 className="font-serif text-2xl text-primary-cocoa">Социальные сети</h2>
          <p className="mt-2 text-sm text-foreground-muted">
            Следите за новинками, сезонными коллекциями и акциями.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="https://www.instagram.com/chocolandia.by/"
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center rounded-full border border-border/80 bg-card px-5 py-2.5 text-sm font-medium text-primary-cocoa transition hover:border-accent/50"
            >
              Instagram @chocolandia.by
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
