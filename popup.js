async function refreshPopup() {
  const statusText = document.querySelector(".status-text");
  const dot = document.querySelector(".dot");
  const problemEl = document.getElementById("problem");
  const languageEl = document.getElementById("language");

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  // 🚨 CRITICAL CHECK
  if (!tab.url || !tab.url.includes("leetcode.com/problems/")) {
    statusText.textContent = "Not on problem page";
    dot.style.background = "red";

    problemEl.textContent = "—";
    languageEl.textContent = "—";
    return;
  }

  // Only now read storage
  chrome.storage.local.get(
    ["problemTitle", "language"],
    (data) => {
      statusText.textContent = "On problem page";
      dot.style.background = "green";

      problemEl.textContent = data.problemTitle || "—";
      languageEl.textContent = data.language || "—";
    }
  );
}

document.addEventListener("DOMContentLoaded", refreshPopup);
