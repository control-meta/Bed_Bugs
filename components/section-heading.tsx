export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  dark = false,
}: {
  eyebrow: string;
  title: React.ReactNode;
  description?: string;
  align?: "center" | "left";
  dark?: boolean;
}) {
  const alignment =
    align === "center" ? "items-center text-center" : "items-start text-left";
  return (
    <div className={`flex flex-col ${alignment}`}>
      <p
        className={`flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.25em] ${
          dark ? "text-brand-400" : "text-brand-600"
        }`}
      >
        <span className="h-px w-8 bg-current" />
        {eyebrow}
        {align === "center" && <span className="h-px w-8 bg-current" />}
      </p>
      <h2
        className={`mt-4 max-w-3xl font-display text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-[2.75rem] ${
          dark ? "text-white" : "text-ink"
        }`}
      >
        {title}
      </h2>
      {description && (
        <p
          className={`mt-5 max-w-2xl text-base leading-relaxed ${
            dark ? "text-white/70" : "text-ink/65"
          }`}
        >
          {description}
        </p>
      )}
    </div>
  );
}
