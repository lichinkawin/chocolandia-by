import { Award, Leaf, HandHeart, Truck } from "lucide-react";

const items = [
  {
    icon: Leaf,
    title: "100% Бельгийский шоколад",
    text: "Отборное сырьё и проверенные поставщики.",
  },
  {
    icon: HandHeart,
    title: "Ручная работа",
    text: "Каждое изделие внимательно собрано вручную.",
  },
  {
    icon: Truck,
    title: "Доставка по Минску",
    text: "Аккуратно упакуем и доставим в удобное время.",
  },
  {
    icon: Award,
    title: "Премиальная упаковка",
    text: "Подарочная готовность к любому поводу.",
  },
];

export function Benefits() {
  return (
    <section className="border-y border-outline-variant/20 bg-background py-20 sm:py-24">
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">
          {items.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="flex flex-col items-center text-center sm:items-start sm:text-left"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-muted-low text-accent shadow-[0_12px_32px_-16px_rgba(39,19,16,0.15)]">
                <Icon className="h-6 w-6" strokeWidth={1.25} />
              </span>
              <h3 className="mt-5 font-serif text-lg text-primary-cocoa">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-foreground-muted">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
