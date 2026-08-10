// Danh sách tỉnh/thành + huyện/quận rút gọn (đủ dùng cho checkout demo).
// Muốn đầy đủ 63 tỉnh + toàn bộ phường/xã: import từ https://provinces.open-api.vn hoặc dùng npm gói `vietnam-provinces`.
export interface Province {
  code: string;
  name: string;
  region: "inner" | "outer" | "far";
  districts: string[];
}

export const PROVINCES: Province[] = [
  {
    code: "HCM",
    name: "TP. Hồ Chí Minh",
    region: "inner",
    districts: [
      "Quận 1", "Quận 3", "Quận 4", "Quận 5", "Quận 6", "Quận 7", "Quận 8",
      "Quận 10", "Quận 11", "Quận 12", "Bình Thạnh", "Phú Nhuận", "Gò Vấp",
      "Tân Bình", "Tân Phú", "Bình Tân", "Thủ Đức", "Nhà Bè", "Bình Chánh",
      "Hóc Môn", "Củ Chi", "Cần Giờ",
    ],
  },
  {
    code: "HN",
    name: "Hà Nội",
    region: "inner",
    districts: [
      "Ba Đình", "Hoàn Kiếm", "Đống Đa", "Hai Bà Trưng", "Tây Hồ", "Cầu Giấy",
      "Thanh Xuân", "Hoàng Mai", "Long Biên", "Nam Từ Liêm", "Bắc Từ Liêm",
      "Hà Đông", "Sơn Tây", "Ba Vì", "Chương Mỹ", "Đông Anh", "Gia Lâm",
      "Sóc Sơn", "Thanh Trì", "Thường Tín",
    ],
  },
  { code: "DN", name: "Đà Nẵng", region: "outer", districts: ["Hải Châu", "Thanh Khê", "Sơn Trà", "Ngũ Hành Sơn", "Liên Chiểu", "Cẩm Lệ", "Hòa Vang"] },
  { code: "HP", name: "Hải Phòng", region: "outer", districts: ["Hồng Bàng", "Ngô Quyền", "Lê Chân", "Hải An", "Kiến An", "Đồ Sơn", "Dương Kinh", "Thủy Nguyên", "An Dương", "An Lão"] },
  { code: "CT", name: "Cần Thơ", region: "outer", districts: ["Ninh Kiều", "Bình Thủy", "Cái Răng", "Ô Môn", "Thốt Nốt"] },
  { code: "BD", name: "Bình Dương", region: "outer", districts: ["Thủ Dầu Một", "Dĩ An", "Thuận An", "Tân Uyên", "Bến Cát"] },
  { code: "DONGNAI", name: "Đồng Nai", region: "outer", districts: ["Biên Hòa", "Long Khánh", "Nhơn Trạch", "Long Thành", "Trảng Bom"] },
  { code: "BRVT", name: "Bà Rịa - Vũng Tàu", region: "outer", districts: ["Vũng Tàu", "Bà Rịa", "Phú Mỹ", "Long Điền", "Đất Đỏ"] },
  { code: "KHANH_HOA", name: "Khánh Hòa", region: "outer", districts: ["Nha Trang", "Cam Ranh", "Ninh Hòa"] },
  { code: "LDONG", name: "Lâm Đồng", region: "outer", districts: ["Đà Lạt", "Bảo Lộc", "Đức Trọng"] },
  { code: "BINHTHUAN", name: "Bình Thuận", region: "outer", districts: ["Phan Thiết", "La Gi", "Tuy Phong"] },
  { code: "THUATHIENHUE", name: "Thừa Thiên Huế", region: "outer", districts: ["Huế", "Hương Thủy", "Hương Trà"] },
  { code: "QUANG_NAM", name: "Quảng Nam", region: "outer", districts: ["Tam Kỳ", "Hội An", "Điện Bàn"] },
  { code: "QUANG_NGAI", name: "Quảng Ngãi", region: "far", districts: ["TP Quảng Ngãi", "Đức Phổ"] },
  { code: "NGHEAN", name: "Nghệ An", region: "far", districts: ["Vinh", "Cửa Lò", "Thái Hòa"] },
  { code: "THANHHOA", name: "Thanh Hóa", region: "far", districts: ["TP Thanh Hóa", "Sầm Sơn", "Bỉm Sơn"] },
  { code: "HAIDUONG", name: "Hải Dương", region: "outer", districts: ["TP Hải Dương", "Chí Linh"] },
  { code: "QUANGNINH", name: "Quảng Ninh", region: "outer", districts: ["Hạ Long", "Móng Cái", "Uông Bí", "Cẩm Phả"] },
  { code: "AGIANG", name: "An Giang", region: "far", districts: ["Long Xuyên", "Châu Đốc"] },
  { code: "TIENGIANG", name: "Tiền Giang", region: "far", districts: ["Mỹ Tho", "Gò Công"] },
  { code: "KIENGIANG", name: "Kiên Giang", region: "far", districts: ["Rạch Giá", "Phú Quốc", "Hà Tiên"] },
  { code: "BENTRE", name: "Bến Tre", region: "far", districts: ["TP Bến Tre"] },
  { code: "VINHLONG", name: "Vĩnh Long", region: "far", districts: ["TP Vĩnh Long"] },
  { code: "SOCTRANG", name: "Sóc Trăng", region: "far", districts: ["TP Sóc Trăng"] },
];

export function calcShipping(subtotal: number, provinceCode: string | null): number {
  if (subtotal >= 3_000_000) return 0;
  if (!provinceCode) return 40_000;
  const p = PROVINCES.find((x) => x.code === provinceCode);
  if (!p) return 40_000;
  return p.region === "inner" ? 25_000 : p.region === "outer" ? 40_000 : 55_000;
}
