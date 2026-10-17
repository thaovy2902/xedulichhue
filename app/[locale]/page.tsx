import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { HeroSection } from '@/components/sections/HeroSection'
import { PricingSection } from '@/components/sections/PricingSection'
import { ServicesSection } from '@/components/sections/ServicesSection'
import { ProcessSection } from '@/components/sections/ProcessSection'
import { WhyUsSection } from '@/components/sections/WhyUsSection'
import { PaymentSection } from '@/components/sections/PaymentSection'
import { TestimonialsSection } from '@/components/sections/TestimonialsSection'
import { BookingSection } from '@/components/sections/BookingSection'

type Props = {
  params: Promise<{ locale: string }>
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'metadata.home' })

  return {
    title: t('title'),
    description: t('description'),
  }
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params

  if (!(routing.locales as readonly string[]).includes(locale)) {
    notFound()
  }

  setRequestLocale(locale)

  return (
    <div className="flex-1">
      <HeroSection />
      <PricingSection />
      <ServicesSection />
      <WhyUsSection />
      <ProcessSection />
      <BookingSection />
      <PaymentSection />
      <TestimonialsSection />
    </div>
  )
}
