"use client";

import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/format";
import type { GetProductDetailsToolInvocation } from "@/lib/agent";

interface AgentProductCardProps {
  invocation: GetProductDetailsToolInvocation;
}

export function AgentProductCard({ invocation }: AgentProductCardProps) {
  if (
    invocation.state === "input-streaming" ||
    invocation.state === "input-available"
  ) {
    return (
      <div className="rounded-lg border border-border bg-card p-4 text-sm text-muted-foreground">
        Looking up product details…
      </div>
    );
  }

  if (invocation.state !== "output-available") return null;

  const output = invocation.output;

  if (!output) return null;

  if ("error" in output && output.error) {
    return (
      <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
        {output.error}
      </div>
    );
  }

  const {
    name,
    slug,
    description,
    price,
    currency,
    category,
    images,
    tags,
    stock,
  } = output;

  const primaryImage = images?.[0] ?? null;

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      <Link href={`/products/${slug}`} className="block">
        <div className="relative aspect-square w-full bg-secondary">
          {primaryImage && (
            <Image
              src={primaryImage}
              alt={name ?? "Product image"}              
              fill
              sizes="(max-width: 640px) 100vw, 400px"
              className="object-cover"
            />
          )}
        </div>
      </Link>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-base font-semibold leading-tight">{name}</h3>
          <span className="shrink-0 text-sm font-medium">
          {formatPrice(price ?? 0, currency)}          
          </span>
        </div>

        {category && (
          <p className="mt-1 text-xs uppercase tracking-wide text-muted-foreground">
            {category}
          </p>
        )}

        {description && (
          <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
            {description}
          </p>
        )}

        {tags && tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {images && images.length > 1 && (
          <div className="mt-3 flex gap-2 overflow-x-auto">
            {images.slice(1).map((img, i) => (
              <div
                key={img + i}
                className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md bg-secondary"
              >
                <Image
                  src={img}
                  alt={`${name} additional view ${i + 2}`}
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        )}

        <div className="mt-3 text-xs">
          {stock ? (
            stock.inStock ? (
              stock.lowStock ? (
                <span className="text-amber-600">
                  Only {stock.stock} left in stock
                </span>
              ) : (
                <span className="text-muted-foreground">
                  {stock.stock} in stock
                </span>
              )
            ) : (
              <span className="text-destructive">Out of stock</span>
            )
          ) : (
            <span className="text-muted-foreground">
              Stock info unavailable
            </span>
          )}
        </div>
      </div>
    </div>
  );
}