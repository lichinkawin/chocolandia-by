import Image from "next/image";
import Link from "next/link";
import type { HomePageSettings } from "@/types/home";

type HeroProps = {
  settings: HomePageSettings;
};

export function Hero({ settings }: HeroProps) {
  const heroImageSrc = settings.hero_image_url ?? "/NEW/hero_bg.jpg";

  return (
    <section className="relative isolate min-h-[100svh] w-full overflow-hidden bg-background">
      <Image
        src={heroImageSrc}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-primary-cocoa/70 via-primary-cocoa/45 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_20%_30%,rgba(255,224,136,0.14),transparent_55%)]" />

      <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-screen-2xl flex-col justify-center px-4 pb-16 pt-[calc(72px+2rem)] sm:px-6 lg:px-12">
        <div className="max-w-2xl">
          <h1 className="font-serif text-[2.35rem] font-normal leading-[1.06] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-[3.5rem]">
            {settings.hero_heading}
          </h1>
          <p className="mt-8 max-w-lg text-base leading-relaxed text-white/92 sm:text-lg md:text-xl">
            {settings.hero_subheading}
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/#cat-Пасха"
              className="inline-flex min-w-[200px] items-center justify-center rounded-md bg-gradient-to-r from-primary-cocoa to-primary-container px-10 py-4 text-sm font-semibold text-white shadow-[0_20px_50px_-20px_rgba(39,19,16,0.55)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_24px_56px_-18px_rgba(39,19,16,0.5)]"
            >
              {settings.hero_cta_primary}
            </Link>
            <Link
              href="/#about"
              className="inline-flex min-w-[180px] items-center justify-center rounded-md border border-white/35 bg-white/5 px-10 py-4 text-sm font-semibold text-white backdrop-blur-md transition duration-300 hover:bg-white/12"
            >
              {settings.hero_cta_secondary?.trim() || "О мастерской"}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
