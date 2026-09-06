/*
 * もんだいデータ (JSON互換の構造。将来的にfetchでの外部JSON読み込みに切り替え可能)
 * 絵から発想モード: picture / ことばから発想モード: word
 */

window.SAKUBUN_DATA = {
  picture: [
    {
      id: "pic-01",
      difficulty: 1,
      title: "こうえんで",
      svg: `<svg viewBox="0 0 300 200" xmlns="http://www.w3.org/2000/svg">
        <rect width="300" height="130" fill="#BEE3F8"/>
        <rect y="130" width="300" height="70" fill="#C6E8B0"/>
        <circle cx="250" cy="40" r="22" fill="#FFD966"/>
        <ellipse cx="70" cy="55" rx="30" ry="14" fill="#fff"/>
        <ellipse cx="100" cy="50" rx="24" ry="12" fill="#fff"/>
        <g>
          <circle cx="150" cy="120" r="16" fill="#FFDAB3"/>
          <rect x="138" y="134" width="24" height="34" rx="8" fill="#64B5F6"/>
          <rect x="132" y="160" width="14" height="30" rx="6" fill="#5B4636"/>
          <rect x="154" y="160" width="14" height="30" rx="6" fill="#5B4636"/>
        </g>
      </svg>`
    },
    {
      id: "pic-02",
      difficulty: 1,
      title: "いぬとおさんぽ",
      svg: `<svg viewBox="0 0 300 200" xmlns="http://www.w3.org/2000/svg">
        <rect width="300" height="130" fill="#BEE3F8"/>
        <rect y="130" width="300" height="70" fill="#D9C79E"/>
        <circle cx="60" cy="40" r="20" fill="#FFD966"/>
        <g>
          <circle cx="120" cy="115" r="15" fill="#FFDAB3"/>
          <rect x="109" y="128" width="22" height="32" rx="8" fill="#FF8A65"/>
          <rect x="104" y="155" width="12" height="28" rx="5" fill="#8D6E63"/>
          <rect x="124" y="155" width="12" height="28" rx="5" fill="#8D6E63"/>
        </g>
        <g>
          <ellipse cx="175" cy="165" rx="26" ry="14" fill="#D2A679"/>
          <circle cx="200" cy="155" r="12" fill="#D2A679"/>
          <rect x="150" y="160" width="6" height="20" rx="3" fill="#D2A679"/>
          <rect x="195" y="167" width="6" height="18" rx="3" fill="#D2A679"/>
        </g>
        <line x1="136" y1="150" x2="188" y2="158" stroke="#7A5230" stroke-width="2"/>
      </svg>`
    },
    {
      id: "pic-03",
      difficulty: 2,
      title: "あめのひ",
      svg: `<svg viewBox="0 0 300 200" xmlns="http://www.w3.org/2000/svg">
        <rect width="300" height="200" fill="#DDE6ED"/>
        <rect x="30" y="20" width="180" height="140" fill="#fff" stroke="#B0BEC5" stroke-width="4"/>
        <line x1="230" y1="10" x2="215" y2="45" stroke="#90A4AE" stroke-width="3"/>
        <line x1="250" y1="20" x2="235" y2="55" stroke="#90A4AE" stroke-width="3"/>
        <line x1="270" y1="15" x2="255" y2="50" stroke="#90A4AE" stroke-width="3"/>
        <line x1="260" y1="80" x2="245" y2="115" stroke="#90A4AE" stroke-width="3"/>
        <line x1="280" y1="90" x2="265" y2="125" stroke="#90A4AE" stroke-width="3"/>
        <circle cx="110" cy="115" r="14" fill="#FFDAB3"/>
        <rect x="98" y="128" width="24" height="34" rx="8" fill="#81C784"/>
      </svg>`
    },
    {
      id: "pic-04",
      difficulty: 2,
      title: "きょうしつでさがしもの",
      svg: `<svg viewBox="0 0 300 200" xmlns="http://www.w3.org/2000/svg">
        <rect width="300" height="200" fill="#FFF8E1"/>
        <rect x="20" y="20" width="90" height="60" fill="#D7CCC8" stroke="#8D6E63" stroke-width="3"/>
        <rect x="190" y="20" width="90" height="60" fill="#D7CCC8" stroke="#8D6E63" stroke-width="3"/>
        <circle cx="150" cy="130" r="15" fill="#FFDAB3"/>
        <rect x="138" y="144" width="24" height="30" rx="8" fill="#FFB74D"/>
        <rect x="120" y="170" width="60" height="10" fill="#8D6E63"/>
      </svg>`
    },
    {
      id: "pic-05",
      difficulty: 1,
      title: "みちにおとしもの",
      svg: `<svg viewBox="0 0 300 200" xmlns="http://www.w3.org/2000/svg">
        <rect width="300" height="130" fill="#BEE3F8"/>
        <rect y="130" width="300" height="70" fill="#CFD8DC"/>
        <ellipse cx="150" cy="150" rx="18" ry="10" fill="#EF5350"/>
        <circle cx="60" cy="45" r="20" fill="#FFD966"/>
        <circle cx="230" cy="110" r="14" fill="#FFDAB3"/>
        <rect x="218" y="123" width="24" height="32" rx="8" fill="#4FC3F7"/>
        <rect x="212" y="150" width="12" height="28" rx="5" fill="#5B4636"/>
        <rect x="232" y="150" width="12" height="28" rx="5" fill="#5B4636"/>
      </svg>`
    },
    {
      id: "pic-06",
      difficulty: 1,
      title: "ねこがはこをのぞく",
      svg: `<svg viewBox="0 0 300 200" xmlns="http://www.w3.org/2000/svg">
        <rect width="300" height="200" fill="#FFF3E0"/>
        <rect x="120" y="120" width="70" height="55" fill="#D2A679" stroke="#8D6E63" stroke-width="3"/>
        <ellipse cx="100" cy="115" rx="24" ry="16" fill="#B0BEC5"/>
        <polygon points="82,105 88,90 96,108" fill="#B0BEC5"/>
        <polygon points="118,105 112,90 104,108" fill="#B0BEC5"/>
        <circle cx="92" cy="115" r="2.5" fill="#333"/>
        <circle cx="106" cy="115" r="2.5" fill="#333"/>
      </svg>`
    },
    {
      id: "pic-07",
      difficulty: 1,
      title: "あめあがりのにじ",
      svg: `<svg viewBox="0 0 300 200" xmlns="http://www.w3.org/2000/svg">
        <rect width="300" height="130" fill="#E1F5FE"/>
        <rect y="130" width="300" height="70" fill="#C6E8B0"/>
        <path d="M40,140 A110,110 0 0,1 260,140" fill="none" stroke="#EF9A9A" stroke-width="6"/>
        <path d="M55,140 A95,95 0 0,1 245,140" fill="none" stroke="#FFF59D" stroke-width="6"/>
        <path d="M70,140 A80,80 0 0,1 230,140" fill="none" stroke="#A5D6A7" stroke-width="6"/>
        <circle cx="150" cy="150" r="15" fill="#FFDAB3"/>
        <rect x="138" y="164" width="24" height="30" rx="8" fill="#F06292"/>
      </svg>`
    },
    {
      id: "pic-08",
      difficulty: 1,
      title: "ふうせんがとんでいく",
      svg: `<svg viewBox="0 0 300 200" xmlns="http://www.w3.org/2000/svg">
        <rect width="300" height="130" fill="#BEE3F8"/>
        <rect y="130" width="300" height="70" fill="#C6E8B0"/>
        <ellipse cx="230" cy="40" rx="18" ry="22" fill="#EF5350"/>
        <line x1="230" y1="62" x2="220" y2="150" stroke="#999" stroke-width="1.5"/>
        <circle cx="150" cy="140" r="15" fill="#FFDAB3"/>
        <rect x="138" y="154" width="24" height="30" rx="8" fill="#4FC3F7"/>
        <line x1="150" y1="140" x2="205" y2="60" stroke="#333" stroke-width="1.5"/>
      </svg>`
    },
    {
      id: "pic-09",
      difficulty: 2,
      title: "みずたまりをとぶ",
      svg: `<svg viewBox="0 0 300 200" xmlns="http://www.w3.org/2000/svg">
        <rect width="300" height="130" fill="#CFD8DC"/>
        <rect y="130" width="300" height="70" fill="#B0BEC5"/>
        <ellipse cx="170" cy="175" rx="35" ry="10" fill="#4FC3F7" opacity="0.7"/>
        <circle cx="120" cy="110" r="14" fill="#FFDAB3"/>
        <rect x="108" y="123" width="24" height="30" rx="8" fill="#FFB74D"/>
        <line x1="112" y1="153" x2="100" y2="145" stroke="#333" stroke-width="3"/>
        <line x1="128" y1="153" x2="140" y2="145" stroke="#333" stroke-width="3"/>
      </svg>`
    },
    {
      id: "pic-10",
      difficulty: 2,
      title: "たんじょうびのケーキ",
      svg: `<svg viewBox="0 0 300 200" xmlns="http://www.w3.org/2000/svg">
        <rect width="300" height="200" fill="#FCE4EC"/>
        <rect x="120" y="130" width="70" height="40" fill="#F8BBD0" stroke="#E91E63" stroke-width="2"/>
        <rect x="120" y="115" width="70" height="18" fill="#FFF"/>
        <line x1="150" y1="100" x2="150" y2="115" stroke="#FFB300" stroke-width="3"/>
        <circle cx="150" cy="96" r="4" fill="#FF7043"/>
        <circle cx="90" cy="150" r="14" fill="#FFDAB3"/>
        <rect x="78" y="163" width="24" height="30" rx="8" fill="#7E57C2"/>
      </svg>`
    },
    {
      id: "pic-11",
      difficulty: 2,
      title: "かみなりにびっくり",
      svg: `<svg viewBox="0 0 300 200" xmlns="http://www.w3.org/2000/svg">
        <rect width="300" height="200" fill="#78909C"/>
        <polygon points="220,10 200,60 220,60 195,110" fill="#FFEE58"/>
        <circle cx="120" cy="130" r="15" fill="#FFDAB3"/>
        <rect x="108" y="144" width="24" height="32" rx="8" fill="#EF5350"/>
        <circle cx="112" cy="126" r="2.5" fill="#333"/>
        <circle cx="128" cy="126" r="2.5" fill="#333"/>
      </svg>`
    },
    {
      id: "pic-12",
      difficulty: 1,
      title: "みちでみつけたコイン",
      svg: `<svg viewBox="0 0 300 200" xmlns="http://www.w3.org/2000/svg">
        <rect width="300" height="130" fill="#BEE3F8"/>
        <rect y="130" width="300" height="70" fill="#CFD8DC"/>
        <circle cx="150" cy="155" r="12" fill="#FFD966" stroke="#FBC02D" stroke-width="2"/>
        <circle cx="110" cy="110" r="14" fill="#FFDAB3"/>
        <rect x="98" y="123" width="24" height="30" rx="8" fill="#66BB6A"/>
      </svg>`
    }
  ],

  word: [
    { id: "wd-01", difficulty: 1, words: ["あめ", "いっしょに"] },
    { id: "wd-02", difficulty: 1, words: ["がっこう", "びっくり"] },
    { id: "wd-03", difficulty: 2, words: ["ねこ", "あさ", "みつける"] },
    { id: "wd-04", difficulty: 1, words: ["こうえん", "ボール"] },
    { id: "wd-05", difficulty: 2, words: ["いぬ", "おおきい", "こわい"] },
    { id: "wd-06", difficulty: 1, words: ["ゆき", "たのしい"] },
    { id: "wd-07", difficulty: 2, words: ["たんじょうび", "ケーキ", "わすれる"] },
    { id: "wd-08", difficulty: 2, words: ["よる", "おと", "びっくり"] },
    { id: "wd-09", difficulty: 1, words: ["うみ", "なつ"] },
    { id: "wd-10", difficulty: 2, words: ["ともだち", "けんか", "なかなおり"] },
    { id: "wd-11", difficulty: 2, words: ["でんしゃ", "まちがえる"] },
    { id: "wd-12", difficulty: 1, words: ["おかし", "わける"] }
  ]
};
