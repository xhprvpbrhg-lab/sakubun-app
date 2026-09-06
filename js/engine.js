/*
 * ヒントの段階（ステージ）を組み立てるエンジン。
 * モードごとに「固定のはしご（ラダー）」を生成する。
 * カテゴリは記録用の分類（観察/人物/場所/行動/気持ち/理由/想像/このあと/自分だったら）。
 */
window.Engine = (function () {
  const CATEGORY = {
    OBSERVATION: "観察",
    PERSON: "人物",
    PLACE: "場所",
    ACTION: "行動",
    FEELING: "気持ち",
    REASON: "理由",
    IMAGINATION: "想像",
    AFTER: "このあと",
    SELF: "自分だったら"
  };

  const DEFAULT_FEELINGS = ["うれしい", "びっくり", "こまってる"];
  const DEFAULT_REASONS = ["なくしたから", "はじめてだったから", "わからなかったから"];
  const DEFAULT_AFTER = ["だれかが たすけてくれる", "じぶんで かいけつする", "もっと たのしくなる"];

  const PRAISE_MESSAGES = [
    "自分で思いついたね",
    "ひとつ考えられたね",
    "いいかんがえだね",
    "じぶんの ことばで言えたね",
    "ヒントから自分のお話にできたね"
  ];

  function praise() {
    return PRAISE_MESSAGES[Math.floor(Math.random() * PRAISE_MESSAGES.length)];
  }

  // ---- 絵から発想モード ----
  function buildPictureStages(problem) {
    const feelings = problem.feelingChoices || DEFAULT_FEELINGS;
    const reasons = problem.reasonChoices || DEFAULT_REASONS;
    const afters = problem.afterChoices || DEFAULT_AFTER;

    return [
      { type: "free", category: CATEGORY.OBSERVATION, prompt: "このえを見て、なにか思ったことを言ってみよう" },
      { type: "free", category: CATEGORY.OBSERVATION, prompt: "まず、なにをしているか見てみよう" },
      { type: "free", category: CATEGORY.FEELING, prompt: "このこは、どんなきもちかな？" },
      { type: "choice", category: CATEGORY.FEELING, prompt: "きもちをえらんでみよう", choices: feelings },
      { type: "free", category: CATEGORY.REASON, prompt: "どうしてそう思ったのかな？" },
      { type: "choice", category: CATEGORY.REASON, prompt: "りゆうをえらんでみよう", choices: reasons },
      { type: "free", category: CATEGORY.IMAGINATION, prompt: "もうすこし くわしく言うと？" },
      { type: "free", category: CATEGORY.AFTER, prompt: "このあと、なにが起こると思う？" },
      { type: "choice", category: CATEGORY.AFTER, prompt: "えらんでみよう", choices: afters },
      { type: "free", category: CATEGORY.AFTER, prompt: "そのあと、どうなるかな？" }
    ];
  }

  // ---- ことばから発想モード ----
  const WORD_PERSON_CHOICES = ["おとこのこ", "おんなのこ", "どうぶつ"];
  const WORD_PLACE_CHOICES = ["がっこう", "こうえん", "いえ"];

  function buildWordStages(problem) {
    const words = problem.words;
    const wordsLabel = words.join("・");
    const stages = [
      { type: "free", category: CATEGORY.IMAGINATION, prompt: `「${wordsLabel}」を つかって、おはなしを かんがえてみよう` },
      { type: "free", category: CATEGORY.PERSON, prompt: "だれの おはなしにする？" },
      { type: "choice", category: CATEGORY.PERSON, prompt: "えらんでみよう", choices: problem.personChoices || WORD_PERSON_CHOICES },
      { type: "free", category: CATEGORY.PLACE, prompt: "どこに いる？" },
      { type: "choice", category: CATEGORY.PLACE, prompt: "えらんでみよう", choices: problem.placeChoices || WORD_PLACE_CHOICES },
      { type: "free", category: CATEGORY.ACTION, prompt: `「${words[0]}」の とき、なにを している？` },
      { type: "free", category: CATEGORY.IMAGINATION, prompt: "なにが おきた？" },
      { type: "free", category: CATEGORY.FEELING, prompt: "そのとき、どんな きもち？" },
      { type: "choice", category: CATEGORY.FEELING, prompt: "きもちをえらんでみよう", choices: problem.feelingChoices || DEFAULT_FEELINGS },
      { type: "free", category: CATEGORY.REASON, prompt: "どうして そう思った？" },
      { type: "free", category: CATEGORY.AFTER, prompt: "このあと どうなる？" },
      { type: "choice", category: CATEGORY.AFTER, prompt: "えらんでみよう", choices: problem.afterChoices || DEFAULT_AFTER }
    ];
    return stages;
  }

  function buildStages(mode, problem) {
    return mode === "picture" ? buildPictureStages(problem) : buildWordStages(problem);
  }

  return {
    CATEGORY,
    buildStages,
    praise
  };
})();
