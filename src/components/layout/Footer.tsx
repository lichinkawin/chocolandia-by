import Link from "next/link";

const supportLinks = [
  { label: "Способы оплаты и доставки", href: "#" },
  { label: "Контакты", href: "#contacts" },
  { label: "Публичный договор (Оферта)", href: "#" },
];

const quickLinks = [
  { label: "Каталог", href: "/catalog" },
  { label: "О нас", href: "/#about" },
  { label: "Отзывы", href: "/faq#reviews" },
];

export function Footer() {
  return (
    <footer id="contacts" className="scroll-mt-24 bg-footer-dim text-foreground">
      <div className="mx-auto grid w-full max-w-screen-2xl gap-14 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-4 lg:gap-12 lg:px-12">
        <section className="space-y-6">
          <h3 className="font-serif text-xl uppercase tracking-[0.15em] text-primary-cocoa">
            Chocolandia.by
          </h3>
          <p className="text-sm leading-relaxed text-primary-container/85">
            Ручной бельгийский шоколад в Минске. Минимум шума — максимум вкуса и заботы о деталях.
          </p>
        </section>

        <section>
          <h4 className="mb-6 text-[11px] font-bold uppercase tracking-[0.2em] text-primary-cocoa">
            Навигация
          </h4>
          <ul className="space-y-3">
            {quickLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm uppercase tracking-wide text-primary-container/75 transition hover:text-accent"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h4 className="mb-6 text-[11px] font-bold uppercase tracking-[0.2em] text-primary-cocoa">
            Поддержка
          </h4>
          <ul className="space-y-3">
            {supportLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="text-sm uppercase tracking-wide text-primary-container/75 transition hover:text-accent"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="#"
            className="mt-4 inline-block text-sm uppercase tracking-wide text-primary-container/75 transition hover:text-accent"
          >
            Образец чека
          </Link>
        </section>

        <section className="space-y-5">
          <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary-cocoa">
            Реквизиты и связь
          </h4>
          <div className="space-y-4 text-sm leading-relaxed text-primary-container/85">
            <p>ИП / ООО [Название], УНП [Номер]</p>
            <p>Юридический адрес: [Адрес]</p>
            <p>Заказы и вопросы — в Telegram и по контактам на странице «Контакты».</p>
          </div>
        </section>
      </div>

      <div className="mx-auto flex max-w-screen-2xl flex-col items-center justify-between gap-4 border-t border-primary-cocoa/10 px-4 py-10 sm:flex-row sm:px-6 lg:px-12">
        <p className="text-center text-[11px] uppercase tracking-[0.15em] text-primary-container/55 sm:text-left">
          © {new Date().getFullYear()} Chocolandia.by · Минск
        </p>
        <div className="flex gap-8 text-[11px] font-bold uppercase tracking-[0.15em] text-primary-container/70">
          <Link href="#" className="transition hover:text-accent">
            Конфиденциальность
          </Link>
          <Link href="#" className="transition hover:text-accent">
            Условия
          </Link>
        </div>
      </div>
    </footer>
  );
}
