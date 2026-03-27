import Link from "next/link";

type FaqItem = {
  q: string;
  a: string;
};

const faqTeaserItems: FaqItem[] = [
  {
    q: "Как оформить заказ?",
    a: "Вы выбираете коллекцию или товар, добавляете в корзину и нажимаете «Заказать через Telegram». Мы согласуем состав и сроки доставки.",
  },
  {
    q: "Сколько времени занимает изготовление?",
    a: "Обычно производство занимает 1–3 рабочих дня в зависимости от позиции и загрузки мастерской. Точные сроки подтверждаем в Telegram.",
  },
  {
    q: "Есть ли доставка по Минску?",
    a: "Да, доставка по Минску доступна. Стоимость и дата доставки рассчитываются после подтверждения заказа с менеджером.",
  },
  {
    q: "Можно ли оформить подарок к конкретной дате?",
    a: "Да. Сообщите желаемую дату при оформлении — мы подскажем самый удобный вариант и согласуем время.",
  },
  {
    q: "Вы работаете с праздничными коллекциями?",
    a: "Да. У нас есть сезонные линейки (например, на Пасху) и тематические наборы. Следите за обновлениями в каталоге.",
  },
];

export function FaqTeaser() {
  return (
    <section className="mx-auto w-full max-w-screen-2xl px-4 pb-16 sm:px-6 lg:px-12">
      <div className="rounded-xl bg-card p-6 shadow-[0_20px_50px_-28px_rgba(39,19,16,0.12)] sm:p-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-accent">Частые вопросы</p>
            <h2 className="font-serif text-3xl text-primary-cocoa sm:text-4xl md:text-5xl">
              Подскажем перед заказом
            </h2>
          </div>

          <Link
            href="/faq#faq"
            className="w-fit border-b-2 border-accent pb-1 text-sm font-bold uppercase tracking-tight text-accent transition hover:text-primary-cocoa"
          >
            Все вопросы →
          </Link>
        </div>

        <div className="mt-8 grid gap-3">
          {faqTeaserItems.map((item) => (
            <details
              key={item.q}
              className="group rounded-xl bg-muted-low/90 p-4 [&_summary::-webkit-details-marker]:hidden"
            >
              <summary className="cursor-pointer list-none">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm font-medium text-foreground">{item.q}</span>
                  <span className="text-accent transition group-open:rotate-45">+</span>
                </div>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-foreground-muted">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
