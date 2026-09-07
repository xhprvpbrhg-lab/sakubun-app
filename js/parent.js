/*
 * 保護者向け画面のコントローラー
 */
(function () {
  const Storage = window.Storage;
  const CATEGORY_ORDER = ["観察", "人物", "場所", "行動", "気持ち", "理由", "想像", "このあと", "自分だったら"];

  // ---- ゲート（かんたんな計算） ----
  let gateAnswer = 0;
  function setupGate() {
    const a = 2 + Math.floor(Math.random() * 5); // 2-6
    const b = 1 + Math.floor(Math.random() * 4); // 1-4
    gateAnswer = a + b;
    document.getElementById("gate-question").textContent = `${a} ＋ ${b} ＝ ？`;
  }

  function checkGate() {
    const val = Number(document.getElementById("gate-input").value);
    if (val === gateAnswer) {
      document.getElementById("gate-view").hidden = true;
      document.getElementById("dashboard-view").hidden = false;
      renderDashboard();
    } else {
      document.getElementById("gate-error").hidden = false;
    }
  }

  // ---- 集計 ----
  function rate(list, pred) {
    if (list.length === 0) return null;
    return list.filter(pred).length / list.length;
  }

  function renderDashboard() {
    const records = Storage.getRecords();

    if (records.length < 3) {
      document.getElementById("insight-list").innerHTML =
        '<p class="empty-note">まだ きろくが すくないよ。つづけてみてね。</p>';
      document.getElementById("category-bars").innerHTML = "";
      document.getElementById("mode-summary").innerHTML = "";
      renderRecordList(records);
      return;
    }

    renderInsights(records);
    renderCategoryBars(records);
    renderModeSummary(records);
    renderRecordList(records);
  }

  function renderCategoryBars(records) {
    const container = document.getElementById("category-bars");
    container.innerHTML = "";
    CATEGORY_ORDER.forEach((cat) => {
      const list = records.filter((r) => r.questionType === cat);
      if (list.length === 0) return;
      const r = rate(list, (x) => x.jiriki);
      const pct = Math.round(r * 100);
      const row = document.createElement("div");
      row.className = "bar-row" + (pct < 40 ? " low" : "");
      row.innerHTML = `
        <div class="bar-row-label"><span>${cat}</span><span>自力回答 ${pct}%（${list.length}回）</span></div>
        <div class="bar-track"><div class="bar-fill" style="width:${pct}%"></div></div>
      `;
      container.appendChild(row);
    });
  }

  function renderModeSummary(records) {
    const container = document.getElementById("mode-summary");
    container.innerHTML = "";
    ["picture", "word"].forEach((mode) => {
      const list = records.filter((r) => r.mode === mode);
      if (list.length === 0) return;
      const jirikiRate = rate(list, (x) => x.jiriki);
      const hintUsageRate = 1 - jirikiRate;
      let label = "ふつう";
      if (hintUsageRate >= 0.6) label = "高め";
      else if (hintUsageRate < 0.3) label = "低め";
      const modeLabel = mode === "picture" ? "絵から発想" : "ことばから発想";
      const item = document.createElement("div");
      item.className = "mode-summary-item";
      item.innerHTML = `<span>${modeLabel}（${list.length}回）</span><span>ヒント使用率 ${label}</span>`;
      container.appendChild(item);
    });
  }

  function renderInsights(records) {
    const container = document.getElementById("insight-list");
    container.innerHTML = "";
    const msgs = [];

    const recent = records.slice(-10);
    const prev = records.slice(-20, -10);

    let bestCat = null;
    let bestDelta = 0.2;
    CATEGORY_ORDER.forEach((cat) => {
      const recentList = recent.filter((r) => r.questionType === cat);
      const prevList = prev.filter((r) => r.questionType === cat);
      if (recentList.length >= 2 && prevList.length >= 2) {
        const rRate = rate(recentList, (x) => x.jiriki);
        const pRate = rate(prevList, (x) => x.jiriki);
        const delta = rRate - pRate;
        if (delta > bestDelta) {
          bestDelta = delta;
          bestCat = cat;
        }
      }
    });
    if (bestCat) {
      msgs.push(`最近は『${bestCat}』は自力で答えられることが増えています`);
    }

    let worstCat = null;
    let worstRate = 0.5;
    CATEGORY_ORDER.forEach((cat) => {
      const list = records.filter((r) => r.questionType === cat);
      if (list.length >= 3) {
        const r = rate(list, (x) => x.jiriki);
        if (r < worstRate) {
          worstRate = r;
          worstCat = cat;
        }
      }
    });
    if (worstCat) {
      msgs.push(`『${worstCat}』ではヒントが必要なことが多いです`);
    }

    const wordList = records.filter((r) => r.mode === "word");
    if (wordList.length >= 3) {
      const hintUsage = 1 - rate(wordList, (x) => x.jiriki);
      if (hintUsage >= 0.6) {
        msgs.push("指定語をつかった作文は、ヒント使用率が高めです");
      }
    }

    const sentenceList = records.slice(-10);
    if (sentenceList.length >= 3) {
      const sentenceRate = rate(sentenceList, (x) => x.madeSentence);
      if (sentenceRate >= 0.7) {
        msgs.push("さいきんは、文づくりまで すすめることが増えています");
      }
    }

    if (msgs.length === 0) {
      msgs.push("いろいろな しつもんに チャレンジしています。");
    }

    msgs.forEach((m) => {
      const div = document.createElement("div");
      div.className = "insight-item";
      div.textContent = m;
      container.appendChild(div);
    });
  }

  function renderRecordList(records) {
    const container = document.getElementById("record-list");
    container.innerHTML = "";
    if (records.length === 0) {
      container.innerHTML = '<p class="empty-note">まだ きろくが ありません。</p>';
      return;
    }
    const recent = records.slice().reverse().slice(0, 30);
    const methodLabels = { text: "文字で回答", verbal: "口頭で回答", choice: "えらんで回答" };
    recent.forEach((r) => {
      const modeLabel = r.mode === "picture" ? "絵" : "ことば";
      const hintLabel = r.jiriki ? "じりきで こたえた" : `ヒント${r.hintLevelUsed}かい`;
      const sentenceLabel = r.madeSentence ? "文づくり ○" : "発想のみ";
      const methodLabel = methodLabels[r.inputMethod] || "";
      const row = document.createElement("div");
      row.className = "record-row";
      row.innerHTML = `
        <div class="rec-title">${r.date} ・ ${modeLabel} ・ ${r.problemTitle}</div>
        <div class="rec-meta">${hintLabel}（${r.questionType}）・ ${sentenceLabel}${methodLabel ? " ・ " + methodLabel : ""}</div>
        <div>${r.finalAnswer ? "「" + escapeHtml(r.finalAnswer) + "」" : ""}</div>
      `;
      container.appendChild(row);
    });
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[c]));
  }

  document.addEventListener("DOMContentLoaded", () => {
    setupGate();
    document.getElementById("gate-submit").addEventListener("click", checkGate);
    document.getElementById("gate-input").addEventListener("keydown", (e) => {
      if (e.key === "Enter") checkGate();
    });
    document.getElementById("reset-btn").addEventListener("click", () => {
      if (confirm("きろくを ぜんぶ けします。よろしいですか？")) {
        Storage.clearAll();
        renderDashboard();
      }
    });
  });
})();
