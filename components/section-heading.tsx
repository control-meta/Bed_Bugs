export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  dark = false,
  size = "default",
}: {
  eyebrow: string;
  title: React.ReactNode;
  description?: string;
  align?: "center" | "left";
  dark?: boolean;
  size?: "default" | "compact";
}) {
  const alignment =
    align === "center" ? "items-center text-center" : "items-start text-left";
  const compact = size === "compact";
  return (
    <div className={`flex flex-col ${alignment}`}>
      <p
        className={`flex items-center font-semibold uppercase ${
          compact
            ? "gap-2.5 text-[11px] tracking-[0.22em]"
            : "gap-3 text-xs tracking-[0.25em]"
        } ${dark ? "text-brand-400" : "text-brand-600"}`}
      >
        <span className={`h-px bg-current ${compact ? "w-6" : "w-8"}`} />
        {eyebrow}
        {align === "center" && (
          <span className={`h-px bg-current ${compact ? "w-6" : "w-8"}`} />
        )}
      </p>
      <h2
        className={`max-w-3xl font-display font-extrabold tracking-tight ${
          compact
            ? "mt-3 text-2xl sm:text-3xl lg:text-4xl"
            : "mt-4 text-3xl sm:text-4xl lg:text-[2.75rem]"
        } ${dark ? "text-white" : "text-ink"}`}
      >
        {title}
      </h2>
      {description && (
        <p
          className={`max-w-2xl leading-relaxed ${
            compact ? "mt-4 text-sm" : "mt-5 text-base"
          } ${dark ? "text-white/70" : "text-ink/65"}`}
        >
          {description}
        </p>
      )}
    </div>
  );
}
