/*
 * localStorage 読み書きラッパー
 */
window.Storage = (function () {
  const RECORDS_KEY = "sakubun_records_v1";
  const TODAY_KEY = "sakubun_today_v1";

  function todayStr() {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }

  function getRecords() {
    try {
      const raw = localStorage.getItem(RECORDS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function saveRecord(record) {
    const records = getRecords();
    record.id = "r_" + Date.now() + "_" + Math.random().toString(36).slice(2, 8);
    record.date = record.date || todayStr();
    records.push(record);
    localStorage.setItem(RECORDS_KEY, JSON.stringify(records));
    return record;
  }

  function getTodayState() {
    try {
      const raw = localStorage.getItem(TODAY_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function setTodayState(state) {
    localStorage.setItem(TODAY_KEY, JSON.stringify(state));
  }

  function clearAll() {
    localStorage.removeItem(RECORDS_KEY);
    localStorage.removeItem(TODAY_KEY);
  }

  return {
    todayStr,
    getRecords,
    saveRecord,
    getTodayState,
    setTodayState,
    clearAll
  };
})();
