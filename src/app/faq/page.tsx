import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { ReviewsCarousel } from "@/components/faq/ReviewsCarousel";

type FaqItem = {
  q: string;
  a: string;
};

type ReviewItem = {
  rating: 1 | 2 | 3 | 4 | 5;
  text: string;
  author: string;
  date: string;
};

const faqItems: FaqItem[] = [
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
  {
    q: "Можно ли уточнить состав или внешний вид набора?",
    a: "Конечно. Напишите в Telegram — менеджер уточнит детали, предложит альтернативы и согласует финальную комплектацию.",
  },
];

const reviews: ReviewItem[] = [
  {
    rating: 5,
    text: "Потрясающе вкусно и очень красиво. Всё выглядело как на фото, а упаковка просто восторг!",
    author: "Мария",
    date: "2026-02-14",
  },
  {
    rating: 5,
    text: "Сделали заказ к празднику — пришло вовремя, шоколад свежий, а оформление аккуратное до деталей.",
    author: "Александр",
    date: "2026-01-29",
  },
  {
    rating: 5,
    text: "Шикарный набор! Вкус насыщенный, а подача вызывает улыбку. Хочется заказывать снова.",
    author: "Екатерина",
    date: "2025-12-20",
  },
  {
    rating: 5,
    text: "Всё на высшем уровне: вкус, упаковка, внимательность к пожеланиям. Огромное спасибо за сервис!",
    author: "Ирина",
    date: "2025-11-08",
  },
  {
    rating: 5,
    text: "Рекомендую с уверенностью. Видно, что делаете с любовью: от оформления до качества шоколада.",
    author: "Дмитрий",
    date: "2025-10-03",
  },
  {
    rating: 5,
    text: "Очень удачный заказ: быстро согласовали детали, доставили оперативно, всё было упаковано премиально.",
    author: "Ольга",
    date: "2025-09-15",
  },
];

export default function FaqPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="mx-auto w-full flex-1 max-w-screen-2xl flex-col gap-12 bg-background px-4 pb-16 pt-[88px] sm:px-6 sm:pb-20 sm:pt-[96px] lg:px-12">
        <section
          id="faq"
          className="border-t border-border/60 bg-muted-low/80"
        >
          <div className="mx-auto max-w-7xl space-y-4 px-4 py-10 sm:px-6">
            <div className="space-y-2 text-center lg:text-left">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-foreground/50">
                FAQ
              </p>
              <h2 className="font-serif text-3xl text-primary-cocoa sm:text-4xl">
                Частые вопросы
              </h2>
            </div>

            <div className="grid gap-3">
              {faqItems.map((item) => (
                <details
                  key={item.q}
                  className="group rounded-xl border border-border/70 bg-card p-4 [&_summary::-webkit-details-marker]:hidden"
                >
                  <summary className="cursor-pointer list-none">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-sm font-medium text-foreground">
                        {item.q}
                      </span>
                      <span className="text-accent transition group-open:rotate-45">
                        +
                      </span>
                    </div>
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-foreground-muted">
                    {item.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section id="reviews" className="space-y-6 py-10">
          <div className="space-y-2 text-center lg:text-left">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-foreground/50">
              Отзывы
            </p>
            <h2 className="font-serif text-4xl text-primary-cocoa sm:text-5xl">
              Отзывы наших любимых клиентов
            </h2>
          </div>

          <ReviewsCarousel reviews={reviews} />
        </section>
      </main>
      <Footer />
    </div>
  );
}

