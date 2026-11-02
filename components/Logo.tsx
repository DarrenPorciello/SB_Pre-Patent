import Link from "next/link";

export function ScotiaMark({ size = 40 }: { size?: number }) {
  const height = size;
  const width = Math.round(size * (80.73 / 89.45));
  return (
    <img
      src="/scotiabank-flying-s.svg"
      alt=""
      width={width}
      height={height}
      className="shrink-0"
    />
  );
}

export function ScotiaLogo({ href = "/" }: { href?: string }) {
  const content = (
    <span className="flex items-center gap-2.5">
      <ScotiaMark size={36} />
      <img
        src="/scotiabank-wordmark.svg"
        alt="Scotiabank"
        width={158}
        height={22}
        className="h-[18px] w-auto sm:h-[22px]"
      />
    </span>
  );

  if (!href) return content;
  return (
    <Link href={href} className="inline-flex items-center" aria-label="Scotiabank home">
      {content}
    </Link>
  );
}
