import type { SiteConfig } from '@/types'

export const siteConfig: SiteConfig = {
  name: 'Xe Du Lịch Huế 4,7,16 Chỗ',
  description: 'Xe du lịch Huế chuyên nghiệp - đưa đón sân bay, tour tham quan và cho thuê xe.',
  url: 'https://thuexedulichhue.io.vn',
  ogImage: '/og-image.jpg',
  contact: {
    email: 'taxidulichhue@gmail.com',
    phone: '077.246.7711',
    address: '40 Ngô Quyền, phường Thuận Hóa, thành phố Huế',
  },
  social: {
    facebook:  '#',
    zalo:      'https://zalo.me/0772467711',
  },
  nav: [
    { key: 'pricing',  href: '#pricing'  },
    { key: 'services', href: '#services' },
    { key: 'process',  href: '#process'  },
    { key: 'reviews',  href: '#reviews'  },
    { key: 'contact',  href: '#contact'  },
  ],
}

const MAP_QUERY = encodeURIComponent('Xe Du Lịch Huế 4,7,16 Chỗ, 40 Ngô Quyền, Thuận Hóa, Huế')
export const MAP_EMBED_URL = `https://www.google.com/maps?q=${MAP_QUERY}&output=embed`
export const MAP_LINK_URL = `https://www.google.com/maps/search/?api=1&query=${MAP_QUERY}`

/** Phone number with separators stripped, for tel: links */
export const PHONE_TEL = `tel:${siteConfig.contact.phone.replace(/\D/g, '')}`

/** SMS link to the same phone number */
export const PHONE_SMS = `sms:${siteConfig.contact.phone.replace(/\D/g, '')}`

/** Google Maps place page, opened directly on the Reviews tab */
export const MAP_REVIEWS_URL =
  'https://www.google.com/maps/place/Xe+Du+L%E1%BB%8Bch+Hu%E1%BA%BF+4,7,16+Ch%E1%BB%97/@16.4599502,107.5869156,17z/data=!4m8!3m7!1s0x3141a1a466dca061:0x5ee05f2d33c30c3f!8m2!3d16.4599502!4d107.5869156!9m1!1b1!16s%2Fg%2F11nqqz9yck'
