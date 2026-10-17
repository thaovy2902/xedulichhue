import { useTranslations } from 'next-intl'
import { Banknote, CreditCard, Building2, CalendarDays } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Container } from '@/components/ui/container'
import { SectionHeading } from '@/components/ui/section-heading'
import { MAP_LINK_URL } from '@/lib/site'

// ─── Payment method data ───────────────────────────────────────────────────

interface PaymentMethod {
  key: 'cash' | 'transfer' | 'office' | 'postpaid'
  Icon: LucideIcon
}

const METHODS: PaymentMethod[] = [
  { key: 'cash',     Icon: Banknote },
  { key: 'transfer', Icon: CreditCard },
  { key: 'office',   Icon: Building2 },
  { key: 'postpaid', Icon: CalendarDays },
]

// ─── PaymentSection ────────────────────────────────────────────────────────

export function PaymentSection() {
  const t = useTranslations('payment')

  return (
    <section id="payment" className="py-16 md:py-24 bg-muted/30">
      <Container>
        <SectionHeading
          label={t('badge')}
          title={t('title')}
          align="left"
        />

        <ul className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 list-none p-0">
          {METHODS.map(({ key, Icon }) => (
            <li key={key} className="flex gap-5">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary text-white shadow-md shadow-primary/30">
                <Icon className="h-7 w-7" strokeWidth={1.75} aria-hidden="true" />
              </span>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-foreground leading-snug">
                  {t(`items.${key}.title`)}
                </h3>
                <p className="mt-2 text-sm sm:text-base text-foreground/75 leading-relaxed">
                  {t.rich(`items.${key}.desc`, {
                    map: (chunks) => (
                      <a
                        href={MAP_LINK_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-primary underline underline-offset-2 hover:text-primary/80"
                      >
                        {chunks}
                      </a>
                    ),
                  })}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
