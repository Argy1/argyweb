import { getTranslations } from "next-intl/server";
import { StarIcon } from "@/components/ui/icons";

export async function Marquee() {
  const t = await getTranslations("hero");
  const items = t.raw("marquee") as string[];
  // Empat salinan supaya pita selalu penuh; animasi bergeser -50% lalu berulang mulus.
  const loop = [...items, ...items, ...items, ...items];
  return (
    <div className="overflow-x-clip py-4">
      <div className="marquee-band" aria-hidden="true">
        <div className="marquee-track">
          {loop.map((item, i) => (
            <span key={i} className="marquee-item">
              {item}
              <StarIcon className="flex-none text-gold" />
            </span>
          ))}
        </div>
      </div>
      <p className="sr-only">{items.join(" · ")}</p>
    </div>
  );
}
