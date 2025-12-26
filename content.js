console.log("LeetCode extension loaded");

function updateData() {
  const path = window.location.pathname;
  const isProblem = path.includes("/problems/");

  if (!isProblem) return;

  const title = document.title.replace(" - LeetCode", "").trim();
  if (!title || title === "LeetCode") return;

  chrome.storage.local.set({
    isProblemPage: true,
    problemTitle: title,
    language: "Python"
  });

  console.log("Saved:", title);
}

updateData();
setInterval(updateData, 2000);
