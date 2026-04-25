export const IOU_WA_NUMBER_IKHWAN = '6287784411000';
export const IOU_WA_NUMBER_AKHWAT = '6282125351100';
/** @deprecated gunakan IOU_WA_NUMBER_IKHWAN / IOU_WA_NUMBER_AKHWAT */
export const IOU_WA_NUMBER = IOU_WA_NUMBER_IKHWAN;
export const IOU_REGISTRATION_URL = 'https://campus.bahasa.iou.edu.gm/login/signup.php';
export const IOU_WEBSITE_URL = 'https://bahasa.iou.edu.gm/';
export const IOU_INSTAGRAM_URL = 'https://www.instagram.com/iouindonesia/';
export const IOU_WA_TEMPLATES = {
  afterAssessment: 'Halo, saya baru menyelesaikan asesmen Sulu dan ingin konsultasi lebih lanjut 🙏',
};

/** Build a personalized WA message after assessment.
 *  Falls back gracefully when name or program is missing. */
export const buildAfterAssessmentMessage = (opts: {
  studentName?: string | null;
  pathwayName?: string | null;
}): string => {
  const name = opts.studentName?.trim();
  const program = opts.pathwayName?.trim();
  const intro = name
    ? `Halo, saya ${name} baru menyelesaikan asesmen Sulu.`
    : 'Halo, saya baru menyelesaikan asesmen Sulu.';
  const interest = program ? `\nProgram yang saya minati: ${program}.` : '';
  return `${intro}${interest}\nIngin konsultasi lebih lanjut 🙏`;
};

export const buildWaUrl = (number: string, message: string) =>
  `https://wa.me/${number}?text=${encodeURIComponent(message)}`;

export const PROVINCES = [
  'Aceh','Sumatera Utara','Sumatera Barat','Riau','Kepulauan Riau',
  'Jambi','Sumatera Selatan','Bangka Belitung','Bengkulu','Lampung',
  'DKI Jakarta','Banten','Jawa Barat','Jawa Tengah','DI Yogyakarta',
  'Jawa Timur','Bali','Nusa Tenggara Barat','Nusa Tenggara Timur',
  'Kalimantan Barat','Kalimantan Tengah','Kalimantan Selatan',
  'Kalimantan Timur','Kalimantan Utara','Sulawesi Utara','Gorontalo',
  'Sulawesi Tengah','Sulawesi Barat','Sulawesi Selatan','Sulawesi Tenggara',
  'Maluku','Maluku Utara','Papua','Papua Barat','Papua Barat Daya',
  'Papua Tengah','Papua Pegunungan','Papua Selatan',
];
