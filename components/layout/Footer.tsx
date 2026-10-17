import { getTranslations } from 'next-intl/server'
import { Mail, Phone, House, Clock, ExternalLink, CarFront } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { siteConfig, MAP_EMBED_URL, MAP_LINK_URL, PHONE_TEL } from '@/lib/site'
import { servicesData } from '@/data/services'
import { Container } from '@/components/ui/container'

export async function Footer() {
  const t = await getTranslations('footer')
  const tServices = await getTranslations('services')

  return (
    <footer className="bg-primary-950 text-white/80">
      {/* Map + contact band */}
      <div id="contact" className="border-b border-white/10! text-white">
        <Container>
          <div className="grid gap-8 py-10 lg:grid-cols-2 lg:items-center">
            <div className="overflow-hidden rounded-xl ring-1 ring-white/10 aspect-[16/10] lg:aspect-[16/8] bg-white/5">
              <iframe
                src={MAP_EMBED_URL}
                title={t('mapTitle')}
                className="h-full w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-wide text-secondary-400">
                {t('contactHeading')}
              </h2>
              <ul className="mt-5 space-y-4 text-sm sm:text-base text-white/90">
                <li className="flex items-start gap-3">
                  <House className="mt-0.5 h-5 w-5 shrink-0 text-secondary-400" aria-hidden="true" />
                  <span>{t('address')}: {siteConfig.contact.address}</span>
                </li>
                <li className="flex items-start gap-3">
                  <Phone className="mt-0.5 h-5 w-5 shrink-0 text-secondary-400" aria-hidden="true" />
                  <span>
                    {t('phone')}:{' '}
                    <a href={PHONE_TEL} className="font-semibold hover:underline">
                      {siteConfig.contact.phone}
                    </a>
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Mail className="mt-0.5 h-5 w-5 shrink-0 text-secondary-400" aria-hidden="true" />
                  <span>
                    {t('email')}:{' '}
                    <a href={`mailto:${siteConfig.contact.email}`} className="hover:underline break-all">
                      {siteConfig.contact.email}
                    </a>
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Clock className="mt-0.5 h-5 w-5 shrink-0 text-secondary-400" aria-hidden="true" />
                  <span>{t('hours')}: {t('hoursValue')}</span>
                </li>
              </ul>
              <a
                href={MAP_LINK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-primary-700 transition-colors hover:bg-white/90"
              >
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
                {t('openMap')}
              </a>
            </div>
          </div>
        </Container>
      </div>

      <Container>
        {/* Main grid */}
        <div className="grid gap-10 py-10 sm:grid-cols-2">
          {/* Column 1 - Brand */}
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 font-bold text-lg text-white"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
                <CarFront className="h-4 w-4" aria-hidden="true" />
              </span>
              <span className="uppercase">{siteConfig.name}</span>
            </Link>

            <p className="mt-4 text-sm leading-relaxed text-white/65 max-w-xs">
              {t('description')}
            </p>

          </div>

          {/* Featured services */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-secondary-400">
              {t('groups.services')}
            </h3>
            <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2.5">
              {servicesData.map((service) => (
                <li key={service.id}>
                  <Link
                    href="/#services"
                    className="text-sm text-white/65 transition-colors hover:text-white"
                  >
                    {tServices(`items.${service.id}.title` as Parameters<typeof tServices>[0])}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10! py-6 text-center">
          <p className="text-xs text-white/65">Copyright &copy; 2025 by XEDULICHHUE</p>
        </div>
      </Container>
    </footer>
  )
}
