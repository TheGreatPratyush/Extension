document.addEventListener("DOMContentLoaded", async () => {
  // Load problem data
  setTimeout(async () => {
    const data = await chrome.storage.local.get("leetCodeProblemInfo");
    const problemNameSpan = document.getElementById("problemName");
    const languageSpan = document.getElementById("language");
    if (data.leetCodeProblemInfo) {
      problemNameSpan.textContent = data.leetCodeProblemInfo.problemName;
      languageSpan.textContent = data.leetCodeProblemInfo.language;
    }
  }, 500);

  // Load saved config
  const data = await chrome.storage.sync.get("githubConfig");
  if (data.githubConfig) {
    document.getElementById("tokenInput").value = data.githubConfig.token;
    document.getElementById("usernameInput").value = data.githubConfig.username;
    document.getElementById("repoInput").value = data.githubConfig.repo;
  }

  // Save button
  document.getElementById("saveBtn").addEventListener("click", async () => {
    const token = document.getElementById("tokenInput").value;
    const username = document.getElementById("usernameInput").value;
    const repo = document.getElementById("repoInput").value;
    
    if (!token || !username || !repo) {
      document.getElementById("status").textContent = "Please fill all fields";
      document.getElementById("status").style.color = "red";
      return;
    }
    
    await chrome.storage.sync.set({ githubConfig: { token, username, repo } });
    document.getElementById("status").textContent = "✅ Settings saved!";
    document.getElementById("status").style.color = "green";
  });

  // Sync button
  document.getElementById("syncBtn").addEventListener("click", async () => {
    document.getElementById("syncStatus").textContent = "🔥 Syncing...";
    document.getElementById("syncBtn").disabled = true;
    
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    try {
      const response = await chrome.tabs.sendMessage(tabs[0].id, { action: "syncToGitHub" });
      document.getElementById("syncStatus").textContent = response.syncResult;
      document.getElementById("syncStatus").style.color = response.success ? "green" : "red";
    } catch (error) {
      document.getElementById("syncStatus").textContent = `❌ ${error.message}`;
      document.getElementById("syncStatus").style.color = "red";
    }
    document.getElementById("syncBtn").disabled = false;
  });
});
