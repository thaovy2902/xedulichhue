export interface PricingRow {
  id: string
  route: string
  car4: string
  car7: string
  popular?: boolean
}

/** One-way, all-inclusive prices (airport parking fees included). */
export const pricingData: PricingRow[] = [
  { id: 'ga-hue',            route: 'Ga Huế ⇄ Trung tâm Huế',              car4: '100.000đ',   car7: '120.000đ' },
  { id: 'phu-bai-trung-tam', route: 'Sân bay Phú Bài ⇄ Trung tâm Huế',     car4: '160.000đ',   car7: '210.000đ', popular: true },
  { id: 'phu-bai-vedana',    route: 'Sân bay Phú Bài ⇄ Vedana Resort',     car4: '400.000đ',   car7: '600.000đ' },
  { id: 'phu-bai-alba',      route: 'Sân bay Phú Bài ⇄ Alba Thanh Tân',    car4: '400.000đ',   car7: '600.000đ' },
  { id: 'hue-lang-co',       route: 'Huế ⇄ Lăng Cô',                       car4: '600.000đ',   car7: '700.000đ' },
  { id: 'phu-bai-la-vang',   route: 'Sân bay Phú Bài ⇄ La Vang Quảng Trị', car4: '700.000đ',   car7: '900.000đ' },
  { id: 'phu-bai-a-luoi',    route: 'Sân bay Phú Bài ⇄ A Lưới',            car4: '800.000đ',   car7: '1.000.000đ' },
  { id: 'hue-da-nang',       route: 'Huế ⇄ Đà Nẵng',                       car4: '1.200.000đ', car7: '1.400.000đ', popular: true },
  { id: 'hue-hoi-an',        route: 'Huế ⇄ Hội An',                        car4: '1.300.000đ', car7: '1.500.000đ' },
  { id: 'phu-bai-khe-sanh',  route: 'Sân bay Phú Bài ⇄ Khe Sanh, Lao Bảo', car4: '1.600.000đ', car7: '1.800.000đ' },
  { id: 'hue-phong-nha',     route: 'Huế ⇄ Phong Nha, Kẻ Bàng',            car4: '2.500.000đ', car7: '3.000.000đ' },
]
