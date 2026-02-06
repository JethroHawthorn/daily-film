/**
 * Movie category slugs used for filtering and navigation
 */

export const MOVIE_CATEGORY_SLUGS = [
  "phim-moi",
  "phim-bo",
  "phim-le",
  "tv-shows",
  "hoat-hinh",
  "phim-vietsub",
  "phim-thuyet-minh",
  "phim-long-tieng",
  "phim-bo-dang-chieu",
  "phim-bo-hoan-thanh",
  "phim-sap-chieu",
  "subteam",
  "phim-chieu-rap",
] as const;

/**
 * Type for movie category slug
 */
export type MovieCategorySlug = (typeof MOVIE_CATEGORY_SLUGS)[number];

/**
 * Movie category labels (Vietnamese)
 */
export const MOVIE_CATEGORY_LABELS: Record<MovieCategorySlug, string> = {
  "phim-moi": "Phim Mới",
  "phim-bo": "Phim Bộ",
  "phim-le": "Phim Lẻ",
  "tv-shows": "TV Shows",
  "hoat-hinh": "Hoạt Hình",
  "phim-vietsub": "Phim Vietsub",
  "phim-thuyet-minh": "Phim Thuyết Minh",
  "phim-long-tieng": "Phim Lồng Tiếng",
  "phim-bo-dang-chieu": "Phim Bộ Đang Chiếu",
  "phim-bo-hoan-thanh": "Phim Bộ Hoàn Thành",
  "phim-sap-chieu": "Phim Sắp Chiếu",
  subteam: "Subteam",
  "phim-chieu-rap": "Phim Chiếu Rạp",
};

/**
 * Check if a slug is a valid movie category
 */
export function isValidMovieCategorySlug(
  slug: string,
): slug is MovieCategorySlug {
  return MOVIE_CATEGORY_SLUGS.includes(slug as MovieCategorySlug);
}

/**
 * Popular country slugs - subset for navigation menu
 */
export const POPULAR_COUNTRY_SLUGS = [
  "han-quoc",
  "trung-quoc",
  "nhat-ban",
  "thai-lan",
  "au-my",
  "viet-nam",
] as const;

export type PopularCountrySlug = (typeof POPULAR_COUNTRY_SLUGS)[number];

/**
 * All country slugs from API
 */
export const COUNTRY_SLUGS = [
  "trung-quoc",
  "han-quoc",
  "nhat-ban",
  "thai-lan",
  "au-my",
  "dai-loan",
  "hong-kong",
  "an-do",
  "anh",
  "phap",
  "canada",
  "duc",
  "tay-ban-nha",
  "tho-nhi-ky",
  "indonesia",
  "nga",
  "uc",
  "malaysia",
  "philippines",
  "viet-nam",
  "singapore",
  "quoc-gia-khac",
] as const;

export type CountrySlug = (typeof COUNTRY_SLUGS)[number];

/**
 * Country labels (Vietnamese)
 */
export const COUNTRY_LABELS: Record<CountrySlug, string> = {
  "trung-quoc": "Trung Quốc",
  "han-quoc": "Hàn Quốc",
  "nhat-ban": "Nhật Bản",
  "thai-lan": "Thái Lan",
  "au-my": "Âu Mỹ",
  "dai-loan": "Đài Loan",
  "hong-kong": "Hồng Kông",
  "an-do": "Ấn Độ",
  anh: "Anh",
  phap: "Pháp",
  canada: "Canada",
  duc: "Đức",
  "tay-ban-nha": "Tây Ban Nha",
  "tho-nhi-ky": "Thổ Nhĩ Kỳ",
  indonesia: "Indonesia",
  nga: "Nga",
  uc: "Úc",
  malaysia: "Malaysia",
  philippines: "Philippines",
  "viet-nam": "Việt Nam",
  singapore: "Singapore",
  "quoc-gia-khac": "Quốc Gia Khác",
};
