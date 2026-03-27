import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { CartView } from "./view";

export default function CartPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="mx-auto flex w-full flex-1 max-w-screen-2xl flex-col gap-12 bg-background px-4 pb-24 pt-[88px] sm:px-6 sm:pb-16 sm:pt-[96px] lg:px-12">
        <section className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-accent">Корзина</p>
          <h1 className="font-serif text-4xl text-primary-cocoa sm:text-5xl">Ваш заказ</h1>
          <p className="text-sm text-foreground-muted">
            Проверьте состав и заполните данные — оформление через Telegram.
          </p>
        </section>
        <CartView />
      </main>
      <Footer />
    </div>
  );
}
