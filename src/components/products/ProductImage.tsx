"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

type ProductImageProps = Omit<ImageProps, "src"> & {
  src?: string;
};

export function ProductImage({
  src,
  alt,
  className,
  priority = false,
  ...props
}: ProductImageProps) {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return (
      <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-muted text-center">
        <span className="absolute -rotate-12 text-4xl font-serif text-border/70">
          C
        </span>
        <span className="font-serif text-lg tracking-wide text-primary-container/80">
          Chocolandia
        </span>
      </div>
    );
  }

  return (
    <Image
      {...props}
      src={src}
      alt={alt}
      className={className}
      priority={priority}
      onError={() => setHasError(true)}
    />
  );
}
