import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProductImage } from "@/components/products/ProductImage";
import { formatBynPrice } from "@/lib/price";
import { fetchProducts } from "@/lib/google-sheets";
import { AddToCartPanel } from "./product-client";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

async function getProductBySlug(slug: string) {
  const products = await fetchProducts();
  return products.find((product) => product.slug === slug);
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return { title: "Товар не найден | Chocolandia.by" };
  }

  return {
    title: `${product.name} | Chocolandia.by`,
    description: product.description || "Авторский шоколад ручной работы",
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="mx-auto flex w-full max-w-screen-2xl flex-1 flex-col gap-10 px-4 pb-32 pt-[88px] sm:px-6 sm:pb-16 lg:gap-14 lg:px-12 lg:pb-20 lg:pt-[96px]">
        <nav className="text-[10px] font-semibold uppercase tracking-[0.25em] text-foreground-muted">
          <Link href="/" className="transition hover:text-foreground">
            Каталог
          </Link>
          <span className="mx-2 text-foreground-muted/60">/</span>
          <span className="text-foreground/80">{product.category}</span>
          <span className="mx-2 text-foreground-muted/60">/</span>
          <span className="text-foreground">{product.name}</span>
        </nav>

        <section className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-muted shadow-[0_24px_60px_-30px_rgba(39,19,16,0.25)]">
            <ProductImage
              src={product.imageUrl}
              alt={product.name}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
              className="object-cover"
            />
          </div>

          <div className="flex flex-col gap-8">
            <div>
              <span className="inline-block rounded-sm bg-secondary-container px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-on-secondary-container">
                Авторская коллекция
              </span>
              <h1 className="mt-4 font-serif text-4xl leading-tight text-primary-cocoa sm:text-5xl">
                {product.name}
              </h1>
              <p className="mt-4 font-serif text-2xl text-primary-container">{formatBynPrice(product.price)}</p>
            </div>

            {product.description ? (
              <div className="space-y-2">
                <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-foreground">
                  Вкусовой профиль
                </h2>
                <p className="text-sm leading-relaxed text-foreground-muted">{product.description}</p>
              </div>
            ) : null}

            {product.composition ? (
              <div className="space-y-2">
                <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-foreground">
                  Состав
                </h2>
                <p className="text-sm italic leading-relaxed text-foreground-muted">{product.composition}</p>
              </div>
            ) : null}

            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-accent">
              В наличии · готовы к отправке
            </p>

            <AddToCartPanel product={product} />

            <div className="hidden flex-wrap gap-8 border-t border-outline-variant/30 pt-8 sm:flex">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground-muted">
                  Доставка
                </p>
                <p className="mt-1 text-sm text-foreground">По Минску — по согласованию</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground-muted">
                  Качество
                </p>
                <p className="mt-1 text-sm text-foreground">Ручная работа, бельгийское сырьё</p>
              </div>
            </div>
          </div>
        </section>

        <div className="border-t border-outline-variant/25 pt-8 lg:pt-10">
          <Link
            href="/#catalog"
            className="inline-flex items-center gap-2 text-sm font-semibold text-accent transition hover:text-primary-cocoa"
          >
            ← Вернуться в каталог
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
