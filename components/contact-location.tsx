const HQ = {
  label: "Headquarters",
  address: "Sultanpalya, RT Nagar, Bengaluru – 560032",
  mapQuery: "13.0286,77.6006",
  directions:
    "https://www.google.com/maps/dir/?api=1&destination=Sultanpalya%2C%20RT%20Nagar%2C%20Bengaluru%20560032",
};

export default function ContactLocation() {
  return (
    <section className="bg-white pb-12 lg:pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid overflow-hidden rounded-[2rem] border border-ink/10 bg-white shadow-[0_30px_80px_-45px_rgba(23,6,9,0.5)] lg:grid-cols-5">
          {/* Info panel */}
          <div className="relative flex flex-col justify-center gap-4 bg-ink p-7 text-white sm:p-9 lg:col-span-2">
            <div className="absolute inset-0 bg-grid-dark opacity-20" aria-hidden />
            <div className="relative">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-500/15 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-brand-300">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-400" />
                {HQ.label}
              </span>
              <h2 className="mt-4 font-display text-2xl font-extrabold leading-snug tracking-tight sm:text-3xl">
                Visit our <span className="text-brand-300">Bengaluru</span> office
              </h2>
              <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/70">
                Our central team coordinates inspections and treatments across all
                service cities from here.
              </p>
              <p className="mt-5 text-sm font-semibold leading-relaxed text-white">
                {HQ.address}
              </p>
              <a
                href={HQ.directions}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-500/25 transition hover:bg-brand-400"
              >
                Get Directions
                <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>

          {/* Map */}
          <div className="relative min-h-[320px] lg:col-span-3">
            <iframe
              title="BedBug Treatment headquarters location"
              src={`https://maps.google.com/maps?q=${encodeURIComponent(HQ.mapQuery)}&z=15&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 h-full w-full border-0"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
