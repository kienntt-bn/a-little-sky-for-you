export interface Wish {
  id: number;
  label: string;
  title: string;
  body: string;
  /** position in the wish star-map, in percent */
  pos: { left: string; top: string };
}

export const WISHES: Wish[] = [
  {
    id: 1,
    label: "Mong em có",
    title: "Điều sốp mong em có",
    body: "Mong em có đủ sức khỏe để làm những điều mình thích, đủ kiên nhẫn để theo đuổi những mục tiêu của mình, và cũng đủ thời gian để nghỉ ngơi mà không thấy có lỗi vì đang nghỉ.",
    pos: { left: "16%", top: "26%" },
  },
  {
    id: 2,
    label: "Thế giới riêng",
    title: "Điều sốp trân trọng ở em",
    body: "Anh mong em luôn giữ được thế giới riêng và những điều mình thật sự yêu thích. Không cần phải giống bất kỳ ai cả, cứ từ từ trở thành phiên bản mà em muốn nhé.",
    pos: { left: "42%", top: "60%" },
  },
  {
    id: 3,
    label: "Thông báo",
    title: "Thông báo từ sốp",
    body: "Thông báo gửi khách VIP: hôm nay được quyền vui vẻ, ăn món mình thích, nghỉ ngơi khi mệt và không được tự gây khó dễ cho bản thân. Sốp đã duyệt, miễn khiếu nại.",
    pos: { left: "64%", top: "24%" },
  },
  {
    id: 4,
    label: "Chúc thật lòng",
    title: "Một lời chúc thật lòng",
    body: "Mong em sẽ gặp được thật nhiều điều tử tế, có những ngày bình thường cũng khiến mình vui, và luôn nhớ rằng em xứng đáng được quan tâm bằng những điều chân thành.",
    pos: { left: "85%", top: "58%" },
  },
];

export interface ConstellationPoint {
  id: string;
  name: string;
  wish: string;
  /** svg coordinates in a 600x420 viewBox */
  x: number;
  y: number;
}

export const CONSTELLATION_POINTS: ConstellationPoint[] = [
  {
    id: "binh-yen",
    name: "Bình yên",
    wish: "Mong em luôn có một khoảng lặng dịu dàng, một góc trời bình yên chỉ của riêng mình.",
    x: 110,
    y: 300,
  },
  {
    id: "suc-khoe",
    name: "Sức khỏe",
    wish: "Mong em đủ khỏe để làm điều mình thích, và đủ thảnh thơi để nghỉ ngơi khi cần.",
    x: 245,
    y: 175,
  },
  {
    id: "tu-tin",
    name: "Tự tin",
    wish: "Mong em tin vào lựa chọn của mình — không cần giống bất kỳ ai, cứ là em là đủ.",
    x: 385,
    y: 265,
  },
  {
    id: "niem-vui",
    name: "Niềm vui",
    wish: "Mong những ngày bình thường cũng có điều khiến em bất giác mỉm cười.",
    x: 505,
    y: 130,
  },
];

/** segments drawn between point indexes (into CONSTELLATION_POINTS) */
export const CONSTELLATION_SEGMENTS: Array<[number, number]> = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 0],
];

export const LETTER_TITLE = "Gửi em, ngày 20 tháng 10.";

export const LETTER_PARAGRAPHS: string[] = [
  "Chúc em một ngày 20/10 thật vui vẻ nhé.",
  "Anh mong những điều em đang cố gắng sẽ dần có kết quả, những ngày mệt mỏi sẽ có lúc được nghỉ ngơi thật thoải mái, còn những ngày vui thì sẽ có thêm nhiều điều đáng nhớ.",
  "Anh hy vọng em vẫn luôn có thể sống theo cách mình thích, dành thời gian cho những điều khiến em vui và không cần lúc nào cũng phải mạnh mẽ hay hoàn hảo.",
  "Có thể anh chưa phải là người tinh tế nhất trong mọi chuyện, nhưng anh vẫn đang học cách thể hiện sự quan tâm bằng những điều thiết thực hơn, chứ không chỉ bằng lời nói.",
  "Vậy nên hôm nay, sốp gửi khách VIP một bầu trời nhỏ cùng lời chúc này. Mong em luôn có những khoảng trời bình yên của riêng mình nhé.",
];

export const LETTER_SIGNOFF = "Chúc em luôn gặp nhiều điều tốt đẹp.";
export const LETTER_SIGNATURE = "— Sốp ✦";

export const FINAL_MESSAGE =
  "20/10 chỉ có một ngày, nhưng mong những ngày bình thường của em cũng có thêm vài điều vui vẻ.";

export const FINAL_SIGNOFFS = [
  "Happy Vietnamese Women's Day, khách VIP. 💎",
  "Từ sốp, với một chút chân thành.",
];

export const SECTIONS = [
  { id: "entrance", label: "Bước vào" },
  { id: "wishes", label: "Lời nhắn" },
  { id: "constellation", label: "Chòm sao" },
  { id: "letter", label: "Bức thư" },
  { id: "final", label: "Vì sao cuối" },
] as const;
