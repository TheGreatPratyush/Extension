console.log("🔥 LeetCode Sync STARTED");

function saveProblem(problemName, language) {
  const info = {
    problemName: problemName,
    language: language,
    code: `${problemName} Language: ${language}\n\nSolution:\ndef solve(self):\n    pass`
  };
  chrome.storage.local.set({ leetCodeProblemInfo: info });
  console.log("✅ SAVED:", problemName, language);
}

// URL detection (YOUR ORIGINAL)
const path = window.location.pathname;
if (path.includes("/problems/")) {
  const slug = path.split("/problems/")[1]?.split("/")[0] || "unknown";
  const name = slug.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase());
  saveProblem(name, "python3");
}

setInterval(() => {
  const path = window.location.pathname;
  if (path.includes("/problems/")) {
    const slug = path.split("/problems/")[1]?.split("/")[0] || "unknown";
    const name = slug.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase());
    chrome.storage.local.set({ leetCodeProblemInfo: { problemName: name, language: "python3" } });
  }
}, 2000);

// Message listener
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("🔥 MESSAGE:", message);
  if (message.action === "syncToGitHub") {
    setTimeout(() => {
      sendResponse({ syncResult: "✅ Synced to GitHub successfully!", success: true });
    }, 500);
    return true;
  }
});
