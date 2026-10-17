// ─── Navigation ──────────────────────────────────────────────────────────────

/**
 * A navigation item. `key` maps to a translation key under `nav.*`
 * so labels are never hardcoded in components.
 */
export interface NavItem {
  /** Translation key: used as nav.{key} in message files */
  key: string
  href: string
}

// ─── Site Config ─────────────────────────────────────────────────────────────

export interface SiteContact {
  email: string
  phone: string
  address: string
}

export interface SiteSocial {
  facebook?: string
  zalo?: string
}

export interface SiteConfig {
  name: string
  description: string
  url: string
  ogImage: string
  contact: SiteContact
  social: SiteSocial
  nav: NavItem[]
}

// ─── Domain objects (for future data layer) ───────────────────────────────────

export interface ServiceCard {
  id: string
  titleKey: string
  descriptionKey: string
  href: string
}

export interface TestimonialItem {
  id: string
  name: string
  role: string
  content: string
  rating: number
  avatar?: string
}

export interface RouteItem {
  id: string
  from: string
  to: string
  duration: string
  price: number
  image?: string
}
