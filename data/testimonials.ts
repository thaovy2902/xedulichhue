export interface Testimonial {
  id: string
  /**
   * Customer name, base64-encoded (UTF-8) so it never appears as plain text
   * in the server HTML. Decoded in the browser only - see TestimonialsSection.
   */
  nameEncoded: string
  avatar: string
  rating: number
  /** Original review text, kept in the language the customer wrote it in */
  quote: string
}

export const testimonialsData: Testimonial[] = [
  {
    id: 'r1',
    nameEncoded: 'RHVvbmcgVGhhbyBWeQ==',
    avatar: 'https://lh3.googleusercontent.com/a/ACg8ocJDHRImIP2jzQvYFBFttNiQzSfUf0bYZ2mXdfiVacTPuZfycQ=w288-h288-p-rp-mo-br100',
    rating: 5,
    quote:
      'Tài xế nhiệt tình, vui vẻ, chạy siêu êm. Xe sạch sẽ, không có mùi nên mình ko bị say xe tí nào, chứ bình thường mình dễ say lắm kkk.',
  },
  {
    id: 'r2',
    nameEncoded: 'UGjDumMgSG/DoG5nIE5ndXnDqm4gVHLGsOG7nW5n',
    avatar: 'https://lh3.googleusercontent.com/a-/ALV-UjVtM0DIBSGaIgDWrPQn1hm9hcqOEYJi1yRn11TuLlduT7CSJMbh=w288-h288-p-rp-mo-br100',
    rating: 5,
    quote:
      'Xe được vệ sinh kỹ càng, không có mùi hôi. Lần đầu tiên đi xe dịch vụ mà cảm thấy thoả mái như thế.',
  },
  {
    id: 'r3',
    nameEncoded: 'Tmd1eWVuIERv',
    avatar: 'https://lh3.googleusercontent.com/a/ACg8ocI_n_oV6VtB7SL6sB1uj4IvG77QR5xrXm-c9RANNFcD-QAXDQ=w288-h288-p-rp-mo-br100',
    rating: 5,
    quote:
      'Excellent service. Our driver/guide, Mr Quang, is great. Our drive is smooth and on time. Quang is knowledgeable of both local and tourist attractions, and helped us plan and make the most of our trip (Hue & DaNang). We had a great trip. I would use this service again and recommend to any future visitors.',
  },
  {
    id: 'r4',
    nameEncoded: 'Q2hpbmggTmd1eWVu',
    avatar: 'https://lh3.googleusercontent.com/a/ACg8ocJ_PHKqpdQ9gmTCoiKP6DOlzM8_BBTu6d6ipo9H76K5RsmijQ=w288-h288-p-rp-mo-br100',
    rating: 5,
    quote:
      'Bác tài siêu dễ thương và chăm sóc khách hàng rất chu đáo. Team tụi mình muốn đi chỗ nào chỉ cần nói trước với bác tài là ảnh đến rất đúng giờ. Cuối chuyến đi tụi team tụi mình còn được tặng quà là đặc sản Huế nữa.',
  },
  {
    id: 'r5',
    nameEncoded: 'UGjGsOG7m2MgTmd1eeG7hW4gQsOh',
    avatar: 'https://lh3.googleusercontent.com/a/ACg8ocJqzKEkYoTZDrdZPxJe1nWhjgkdndmiazz7fAE6ko98Nnj_=w288-h288-p-rp-mo-br100',
    rating: 5,
    quote:
      'Đặt xe qua điện thoại rất nhanh, nhân viên tư vấn tận tình, đến giờ hẹn là xe có mặt ngay, không để khách phải chờ lâu.',
  },
  {
    id: 'r6',
    nameEncoded: 'S2hhbmggQW1pdHk=',
    avatar: 'https://lh3.googleusercontent.com/a-/ALV-UjWmhT0CR_QGWCrstgB2Uih-KTSr-Rsyq87SGVbkNL4U2x0dNgd_oA=w288-h288-p-rp-mo-br100',
    rating: 5,
    quote:
      'The driver provided excellent service, was very friendly, and drove smoothly. Five-star rating!',
  },
]
