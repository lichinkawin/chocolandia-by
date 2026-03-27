import Link from "next/link";

export function AboutPhilosophy() {
  return (
    <section
      id="about"
      className="scroll-mt-28 overflow-hidden bg-muted-low py-24 sm:py-28 lg:py-36"
    >
      <div className="mx-auto grid max-w-screen-2xl items-center gap-16 px-4 sm:px-6 lg:grid-cols-2 lg:gap-20 lg:px-12">
        <div className="relative order-2 lg:order-1">
          <div className="relative z-10 overflow-hidden rounded-lg shadow-[0_28px_80px_-30px_rgba(39,19,16,0.45)]">
            <div className="relative aspect-[4/5] w-full bg-gradient-to-br from-muted via-background to-accent-soft/25">
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                <p className="font-serif text-lg italic text-primary-container/75">
                  Мастерская · процесс · настроение
                </p>
                <p className="mt-4 text-[11px] uppercase tracking-[0.25em] text-foreground-muted">
                  [ фото мастера за работой ]
                </p>
              </div>
            </div>
          </div>
          <div className="absolute -bottom-10 -right-10 -z-0 h-64 w-64 rounded-full bg-accent-highlight/35 blur-3xl" />
          <div className="absolute -left-10 -top-10 -z-0 h-48 w-48 rounded-full bg-primary-container/15 blur-2xl" />
        </div>

        <div className="order-1 flex flex-col gap-8 lg:order-2">
          <span className="text-xs font-bold uppercase tracking-[0.4em] text-accent">
            Наследие вкуса
          </span>
          <h2 className="font-serif text-4xl leading-[1.1] text-primary-cocoa sm:text-5xl md:text-6xl">
            Алхимия
            <br />
            тонкого вкуса
          </h2>
          <div className="space-y-4 text-lg leading-relaxed text-foreground-muted">
            <p>
              Мы верим: шоколад — это не просто сладость, а способ передать настроение и заботу.
              Темперация, выбор бобов и тишина мастерской — всё работает на один результат: чистый,
              честный вкус.
            </p>
            <p>
              В Chocolandia.by каждое изделие собирается вручную в Минске из бельгийского сырья
              премиального уровня.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 border-y border-outline-variant/25 py-10">
            <div>
              <p className="font-serif text-4xl text-primary-cocoa">100%</p>
              <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.2em] text-accent">
                Бельгийское сырьё
              </p>
            </div>
            <div>
              <p className="font-serif text-4xl text-primary-cocoa">48ч</p>
              <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.2em] text-accent">
                Медленная работа
              </p>
            </div>
          </div>

          <p className="font-serif text-lg italic text-foreground-muted">
            «Мы не просто делаем десерты — мы сохраняем короткие моменты чистого удовольствия.»
          </p>

          <Link
            href="/contacts"
            className="w-fit border border-primary-cocoa px-10 py-4 text-[11px] font-bold uppercase tracking-[0.2em] text-primary-cocoa transition duration-500 hover:bg-primary-cocoa hover:text-white"
          >
            Связаться с нами
          </Link>
        </div>
      </div>
    </section>
  );
}
