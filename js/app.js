/*
 * こども用アプリのメインコントローラー
 */
(function () {
  const DATA = window.SAKUBUN_DATA;
  const Engine = window.Engine;
  const Storage = window.Storage;

  const views = {
    home: document.getElementById("view-home"),
    problem: document.getElementById("view-problem"),
    transition: document.getElementById("view-transition"),
    sentence: document.getElementById("view-sentence"),
    done: document.getElementById("view-done"),
    end: document.getElementById("view-end")
  };

  function showView(name) {
    Object.keys(views).forEach((k) => {
      views[k].hidden = k !== name;
    });
    window.scrollTo(0, 0);
  }

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function findProblem(mode, id) {
    return DATA[mode].find((p) => p.id === id);
  }

  function pickTodayQueue(count) {
    const recent = Storage.getRecords().slice(-10);
    const selfRate = recent.length ? recent.filter((r) => r.jiriki).length / recent.length : 0;
    const preferredDifficulty = selfRate >= 0.7 ? 2 : 1;

    const pool = [
      ...DATA.picture.map((p) => ({ mode: "picture", id: p.id, difficulty: p.difficulty })),
      ...DATA.word.map((w) => ({ mode: "word", id: w.id, difficulty: w.difficulty }))
    ];
    const preferred = pool.filter((p) => p.difficulty === preferredDifficulty);
    const fallback = pool.filter((p) => p.difficulty !== preferredDifficulty);
    const weighted = shuffle(preferred.concat(preferred).concat(fallback));

    const picked = [];
    const seen = new Set();
    for (const item of weighted) {
      const key = item.mode + ":" + item.id;
      if (seen.has(key)) continue;
      seen.add(key);
      picked.push({ mode: item.mode, id: item.id });
      if (picked.length >= count) break;
    }
    return picked;
  }

  function getOrCreateTodayState() {
    const today = Storage.todayStr();
    let state = Storage.getTodayState();
    if (!state || state.date !== today) {
      state = {
        date: today,
        queue: pickTodayQueue(3),
        currentIndex: 0,
        extraRoundUsed: false,
        endedEarly: false
      };
      Storage.setTodayState(state);
    }
    return state;
  }

  // ---- セッション（1問ぶんの進行状態） ----
  let session = null;

  function startProblem(mode, id) {
    const problem = findProblem(mode, id);
    const stages = Engine.buildStages(mode, problem);
    session = {
      mode,
      problem,
      problemTitle: mode === "picture" ? problem.title : problem.words.join("・"),
      stages,
      idx: 0,
      firstAnswerIdx: null,
      firstAnswerCategory: null,
      firstAnswerMethod: null,
      capturedAnswers: [], // {idx, category, text, method}
      lastAnswerText: "",
      // 保護者画面でのみ使う所要時間の計測（こどもには一切表示しない）
      problemStartAt: Date.now(),
      firstInputAt: null,
      firstAnswerAt: null
    };
    showView("problem");
    renderStage(false);
  }

  function currentStage() {
    return session.stages[session.idx];
  }

  // preserveInput: true のときは自由回答欄の文字を消さない（ヒントで問いが深まっただけのとき用）
  function renderStage(preserveInput) {
    const stage = currentStage();
    const problem = session.problem;

    // 絵 or ことば表示
    const mediaEl = document.getElementById("problem-media");
    if (session.mode === "picture") {
      mediaEl.innerHTML = problem.svg;
      mediaEl.className = "problem-media picture";
    } else {
      mediaEl.innerHTML = problem.words
        .map((w) => `<span class="word-chip">${w}</span>`)
        .join("");
      mediaEl.className = "problem-media words";
    }

    document.getElementById("stage-prompt").textContent = stage.prompt;
    document.getElementById("stage-category-tag").textContent = "🏷 " + stage.category;

    // 自由回答欄（大きなtextarea）はどの段階でも常に表示したままにする
    const input = document.getElementById("free-answer-input");
    if (!preserveInput) {
      input.value = "";
    }
    setTimeout(() => input.focus(), 50);

    const choiceArea = document.getElementById("choice-answer-area");
    const hintBtn = document.getElementById("hint-btn");
    const hasNext = session.idx < session.stages.length - 1;

    if (stage.type === "choice") {
      choiceArea.hidden = false;
      choiceArea.innerHTML = "";
      stage.choices.forEach((choiceText) => {
        const btn = document.createElement("button");
        btn.className = "choice-btn";
        btn.textContent = choiceText;
        btn.addEventListener("click", () => chooseChoice(choiceText));
        choiceArea.appendChild(btn);
      });
      hintBtn.hidden = true;
    } else {
      choiceArea.hidden = true;
      choiceArea.innerHTML = "";
      hintBtn.hidden = !hasNext;
    }
  }

  function recordFirstAnswerIfNeeded(category, method) {
    if (session.firstAnswerIdx === null) {
      session.firstAnswerIdx = session.idx;
      session.firstAnswerCategory = category;
      session.firstAnswerMethod = method;
      session.firstAnswerAt = Date.now();
    }
  }

  // 自由回答欄に最初の文字が入力された瞬間を記録する（発想時間と入力時間を分けるため）
  function noteFirstInput() {
    if (session && session.firstInputAt === null) {
      session.firstInputAt = Date.now();
    }
  }

  // 「💡 思いついた！」ボタン：文字が書けていればそれを、書いていなければ
  // 「口頭で答えた」ものとして記録して次へ進む
  function submitAnswer() {
    const input = document.getElementById("free-answer-input");
    const text = input.value.trim();
    const stage = currentStage();
    const method = text === "" ? "verbal" : "text";
    recordFirstAnswerIfNeeded(stage.category, method);
    session.capturedAnswers.push({ idx: session.idx, category: stage.category, text, method });
    session.lastAnswerText = text || session.lastAnswerText;
    showTransitionMenu();
  }

  function chooseChoice(text) {
    const stage = currentStage();
    recordFirstAnswerIfNeeded(stage.category, "choice");
    session.capturedAnswers.push({ idx: session.idx, category: stage.category, text, method: "choice" });
    session.lastAnswerText = text;
    // 選択式のあとは、必ず次（自由回答）へ自動で進む
    if (session.idx < session.stages.length - 1) {
      session.idx++;
      renderStage(false);
    } else {
      showTransitionMenu();
    }
  }

  function advanceHint() {
    if (session.idx < session.stages.length - 1) {
      session.idx++;
      renderStage(true);
    } else {
      // これ以上ヒントはない → 発想だけで終わる案内
      showTransitionMenu(true);
    }
  }

  function showTransitionMenu(forceNoContinue) {
    const hasNext = !forceNoContinue && session.idx < session.stages.length - 1;
    document.getElementById("transition-praise").textContent = Engine.praise();
    document.getElementById("transition-continue-btn").hidden = !hasNext;
    showView("transition");
  }

  function transitionContinue() {
    session.idx++;
    showView("problem");
    renderStage(false);
  }

  function transitionToSentence() {
    renderSentenceView();
    showView("sentence");
  }

  function transitionEndIdeas() {
    finalizeRecordAndEndToday(false, null);
  }

  function renderSentenceView() {
    const answers = session.capturedAnswers.filter((a) => a.text && a.text.trim() !== "");
    const subject = answers.length > 0 ? answers[0].text : "";
    const others = answers.slice(1).map((a) => a.text);
    const uniqueOthers = [...new Set(others)].slice(0, 4);

    document.getElementById("sentence-subject").textContent = subject ? `${subject}は、` : "";
    const input = document.getElementById("sentence-input");
    input.value = "";

    const chipArea = document.getElementById("sentence-word-chips");
    chipArea.innerHTML = "";
    uniqueOthers.forEach((w) => {
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = "word-chip clickable";
      chip.textContent = w;
      chip.addEventListener("click", () => {
        input.value = input.value ? input.value + w : w;
        input.focus();
      });
      chipArea.appendChild(chip);
    });
    setTimeout(() => input.focus(), 50);
  }

  function sentenceComplete() {
    const subject = document.getElementById("sentence-subject").textContent;
    const rest = document.getElementById("sentence-input").value.trim();
    const sentenceText = (subject + rest + "。").trim();
    finalizeRecord(true, sentenceText);
  }

  function sentenceSkip() {
    finalizeRecord(false, null);
  }

  // こたえを記録し、今日の進行状況(currentIndex)を1つ進める。
  // 画面遷移はしない（呼び出し側が「次へ」か「今日はここまで」かを決める）。
  function buildAndSaveRecord(madeSentence, sentenceText) {
    const hintLevelUsed = session.firstAnswerIdx === null ? session.stages.length : session.firstAnswerIdx;
    const jiriki = hintLevelUsed === 0;
    const questionType = session.firstAnswerCategory || currentStage().category;
    const inputMethod = session.firstAnswerMethod || "verbal";

    // 発想にかかった時間／入力にかかった時間（保護者画面でのみ使用。こどもには非表示）
    const ideaLatencyMs = session.firstInputAt
      ? session.firstInputAt - session.problemStartAt
      : session.firstAnswerAt
      ? session.firstAnswerAt - session.problemStartAt
      : null;
    const inputDurationMs = session.firstInputAt && session.firstAnswerAt
      ? Math.max(0, session.firstAnswerAt - session.firstInputAt)
      : null;

    Storage.saveRecord({
      mode: session.mode,
      problemId: session.problem.id,
      problemTitle: session.problemTitle,
      jiriki,
      hintLevelUsed,
      questionType,
      inputMethod,
      finalAnswer: session.lastAnswerText || "",
      madeSentence,
      sentenceText: sentenceText || null,
      ideaLatencyMs,
      inputDurationMs
    });

    const state = Storage.getTodayState();
    state.currentIndex += 1;
    Storage.setTodayState(state);

    session = null;
  }

  // 通常の完了（つぎへ進める／ホームへ）
  function finalizeRecord(madeSentence, sentenceText) {
    buildAndSaveRecord(madeSentence, sentenceText);
    goNextOrHome();
  }

  // 「きょうは ここまでにする／これで おわる」専用：
  // 次の問題には絶対に進まず、今日のセッションをその場で終了する。
  function finalizeRecordAndEndToday(madeSentence, sentenceText) {
    buildAndSaveRecord(madeSentence, sentenceText);
    const state = getOrCreateTodayState();
    state.endedEarly = true;
    Storage.setTodayState(state);
    showView("end");
  }

  function goNextOrHome() {
    const state = getOrCreateTodayState();
    if (state.currentIndex < state.queue.length) {
      showView("done");
      document.getElementById("done-message").textContent = "つぎのもんだいへ";
      document.getElementById("done-next-btn").hidden = false;
      document.getElementById("done-finish-note").hidden = true;
    } else {
      renderHome();
    }
  }

  function doneNext() {
    const state = getOrCreateTodayState();
    const item = state.queue[state.currentIndex];
    startProblem(item.mode, item.id);
  }

  // ---- ホーム画面 ----
  function renderHome() {
    const state = getOrCreateTodayState();
    const total = state.queue.length;
    const done = Math.min(state.currentIndex, total);
    const finished = state.endedEarly || done >= total;

    document.getElementById("home-progress-text").textContent = `きょうの${total}もん： ${done} / ${total}`;
    const dots = document.getElementById("home-progress-dots");
    dots.innerHTML = "";
    for (let i = 0; i < total; i++) {
      const dot = document.createElement("span");
      dot.className = "progress-dot" + (i < done ? " filled" : "");
      dots.appendChild(dot);
    }

    const startBtn = document.getElementById("home-start-btn");
    const finishedMsg = document.getElementById("home-finished-msg");
    const extraBtn = document.getElementById("home-extra-btn");

    if (!finished) {
      startBtn.hidden = false;
      startBtn.textContent = done === 0 ? "はじめる" : "つづきから";
      finishedMsg.hidden = true;
      extraBtn.hidden = true;
    } else {
      startBtn.hidden = true;
      finishedMsg.hidden = false;
      extraBtn.hidden = false;
    }
    showView("home");
  }

  function homeStart() {
    const state = getOrCreateTodayState();
    const item = state.queue[state.currentIndex];
    startProblem(item.mode, item.id);
  }

  function homeExtraRound() {
    const state = getOrCreateTodayState();
    const more = pickTodayQueue(3);
    state.queue = state.queue.concat(more);
    state.extraRoundUsed = true;
    state.endedEarly = false;
    Storage.setTodayState(state);
    renderHome();
  }

  // ---- イベント登録 ----
  document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("home-start-btn").addEventListener("click", homeStart);
    document.getElementById("home-extra-btn").addEventListener("click", homeExtraRound);

    document.getElementById("free-answer-submit").addEventListener("click", submitAnswer);
    document.getElementById("free-answer-input").addEventListener("input", noteFirstInput);
    document.getElementById("hint-btn").addEventListener("click", advanceHint);
    document.getElementById("problem-end-ideas-btn").addEventListener("click", () => finalizeRecordAndEndToday(false, null));

    document.getElementById("transition-continue-btn").addEventListener("click", transitionContinue);
    document.getElementById("transition-sentence-btn").addEventListener("click", transitionToSentence);
    document.getElementById("transition-end-btn").addEventListener("click", transitionEndIdeas);

    document.getElementById("sentence-complete-btn").addEventListener("click", sentenceComplete);
    document.getElementById("sentence-skip-btn").addEventListener("click", sentenceSkip);

    document.getElementById("done-next-btn").addEventListener("click", doneNext);
    document.getElementById("end-home-btn").addEventListener("click", renderHome);

    renderHome();
  });
})();
