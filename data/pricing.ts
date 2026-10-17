export type PricingCategory = 'all' | 'airport' | 'local' | 'interprovincial'

export interface PricingRow {
  id: string
  route: string
  car4: string
  car7: string
  car16: string
  category: Exclude<PricingCategory, 'all'>
  popular?: boolean
}

export const pricingData: PricingRow[] = [
  // ── Airport ──────────────────────────────────────────────────────────────
  {
    id: 'a1',
    route: 'Phú Bài ⇄ Trung tâm Huế',
    car4: '150.000đ',
    car7: '250.000đ',
    car16: '550.000đ',
    category: 'airport',
    popular: true,
  },
  {
    id: 'a2',
    route: 'Phú Bài ⇄ Lăng Cô',
    car4: '350.000đ',
    car7: '550.000đ',
    car16: '1.100.000đ',
    category: 'airport',
  },

  // ── Local (< 200 km) ─────────────────────────────────────────────────────
  {
    id: 'l1',
    route: 'Huế ⇄ Đà Nẵng',
    car4: '350.000đ',
    car7: '600.000đ',
    car16: '1.200.000đ',
    category: 'local',
    popular: true,
  },
  {
    id: 'l2',
    route: 'Huế ⇄ Hội An',
    car4: '500.000đ',
    car7: '800.000đ',
    car16: '1.500.000đ',
    category: 'local',
  },
  {
    id: 'l3',
    route: 'Huế ⇄ Quảng Trị',
    car4: '250.000đ',
    car7: '420.000đ',
    car16: '850.000đ',
    category: 'local',
  },

  // ── Interprovincial (> 200 km) ───────────────────────────────────────────
  {
    id: 'i1',
    route: 'Huế ⇄ Đồng Hới',
    car4: '450.000đ',
    car7: '750.000đ',
    car16: '1.400.000đ',
    category: 'interprovincial',
  },
  {
    id: 'i2',
    route: 'Huế ⇄ Vinh',
    car4: '900.000đ',
    car7: '1.500.000đ',
    car16: '2.800.000đ',
    category: 'interprovincial',
  },
  {
    id: 'i3',
    route: 'Huế ⇄ Hà Nội',
    car4: '2.200.000đ',
    car7: '3.500.000đ',
    car16: '6.500.000đ',
    category: 'interprovincial',
  },
  {
    id: 'i4',
    route: 'Huế ⇄ Quảng Ngãi',
    car4: '700.000đ',
    car7: '1.100.000đ',
    car16: '2.000.000đ',
    category: 'interprovincial',
  },
  {
    id: 'i5',
    route: 'Huế ⇄ Quy Nhơn',
    car4: '900.000đ',
    car7: '1.500.000đ',
    car16: '2.800.000đ',
    category: 'interprovincial',
  },
  {
    id: 'i6',
    route: 'Huế ⇄ Nha Trang',
    car4: '1.500.000đ',
    car7: '2.500.000đ',
    car16: '4.500.000đ',
    category: 'interprovincial',
  },
  {
    id: 'i7',
    route: 'Huế ⇄ TP. Hồ Chí Minh',
    car4: '3.500.000đ',
    car7: '5.500.000đ',
    car16: '10.000.000đ',
    category: 'interprovincial',
  },
]
