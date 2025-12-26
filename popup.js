console.log("Popup loaded");

// ---------- HELPERS ----------
function $(id) {
  return document.getElementById(id);
}

// ---------- LOAD DATA ----------
function loadData() {
  chrome.storage.local.get(
    ["problemTitle", "language", "isProblemPage", "githubToken"],
    (data) => {
      const statusText = document.querySelector(".status-text");
      const dot = document.querySelector(".dot");

      if (data.isProblemPage && data.problemTitle) {
        statusText.textContent = "On problem page";
        dot.style.background = "green";
        $("problem").textContent = data.problemTitle;
        $("language").textContent = data.language || "Python";
      } else {
        statusText.textContent = "Not on problem page";
        dot.style.background = "red";
      }

      if (data.githubToken) {
        $("github-token").value = data.githubToken;
      }
    }
  );
}

// ---------- SAVE TOKEN ----------
function saveToken() {
  const token = $("github-token").value.trim();

  if (!token) {
    alert("❌ Token is empty");
    return;
  }

  chrome.storage.local.set({ githubToken: token }, () => {
    alert("✅ GitHub token saved");
  });
}

// ---------- SYNC TO GITHUB ----------
async function syncToGitHub() {
  chrome.storage.local.get(
    ["githubToken", "problemTitle", "language"],
    async (data) => {
      if (!data.githubToken) {
        alert("❌ GitHub token not saved");
        return;
      }

      if (!data.problemTitle) {
        alert("❌ No problem detected");
        return;
      }

      const OWNER = "TheGreatPratyush";
      const REPO = "leetcode-sync";
      const BRANCH = "main";

      const fileName =
        data.problemTitle.replace(/[^a-zA-Z0-9]/g, "_") + ".txt";

      const content = `
Problem: ${data.problemTitle}
Language: ${data.language}
Synced via Chrome Extension
`;

      const apiUrl = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${fileName}`;

      try {
        const res = await fetch(apiUrl, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${data.githubToken}`,
            "Content-Type": "application/json",
            Accept: "application/vnd.github+json",
          },
          body: JSON.stringify({
            message: `Add ${data.problemTitle}`,
            content: btoa(unescape(encodeURIComponent(content))),
            branch: BRANCH,
          }),
        });

        if (!res.ok) {
          const err = await res.json();
          console.error(err);
          alert("❌ GitHub error: " + err.message);
          return;
        }

        $("sync-status").textContent = "Synced ✅";
        alert("🚀 Successfully synced to GitHub!");
      } catch (e) {
        console.error(e);
        alert("❌ Network error");
      }
    }
  );
}

// ---------- EVENTS ----------
document.addEventListener("DOMContentLoaded", () => {
  loadData();

  $("save-token-btn").addEventListener("click", saveToken);
  $("sync-btn").addEventListener("click", syncToGitHub);
});
