document.addEventListener("DOMContentLoaded", async () => {
  // FORCE RELOAD data every time popup opens (your existing logic - unchanged)
  setTimeout(async () => {
    const data = await chrome.storage.local.get("leetCodeProblemInfo");
    const problemNameSpan = document.getElementById("problemName");
    const languageSpan = document.getElementById("language");
    if (data.leetCodeProblemInfo) {
      problemNameSpan.textContent = data.leetCodeProblemInfo.problemName;
      languageSpan.textContent = data.leetCodeProblemInfo.language;
    }
  }, 500);

  // NEW: Save button functionality
  const saveBtn = document.getElementById("saveBtn");
  const statusP = document.getElementById("status");
  
  saveBtn.addEventListener("click", async () => {
    const token = document.getElementById("tokenInput").value;
    const username = document.getElementById("usernameInput").value;
    const repo = document.getElementById("repoInput").value;
    
    if (!token || !username || !repo) {
      statusP.textContent = "Please fill all fields";
      statusP.style.color = "red";
      return;
    }
    
    const config = { token, username, repo };
    await chrome.storage.sync.set({ githubConfig: config });
    statusP.textContent = "Settings saved!";
    statusP.style.color = "green";
  });

  // NEW: Load saved config on popup open
  const loadConfig = async () => {
    const data = await chrome.storage.sync.get("githubConfig");
    if (data.githubConfig) {
      document.getElementById("tokenInput").value = data.githubConfig.token;
      document.getElementById("usernameInput").value = data.githubConfig.username;
      document.getElementById("repoInput").value = data.githubConfig.repo;
    }
  };
  loadConfig();

  // NEW: Sync button functionality
  const syncBtn = document.getElementById("syncBtn");
  const syncStatusP = document.getElementById("syncStatus");
  
  syncBtn.addEventListener("click", async () => {
    const data = await chrome.storage.local.get("leetCodeProblemInfo");
    if (!data.leetCodeProblemInfo) {
      syncStatusP.textContent = "No problem detected";
      syncStatusP.style.color = "red";
      return;
    }
    
    const config = await chrome.storage.sync.get("githubConfig");
    if (!config.githubConfig) {
      syncStatusP.textContent = "Save GitHub config first";
      syncStatusP.style.color = "red";
      return;
    }
    
    syncStatusP.textContent = "Syncing...";
    syncBtn.disabled = true;
    
    // Trigger sync via content script
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: "syncToGitHub" });
    });
    
    // Listen for sync result
    chrome.runtime.onMessage.addListener((message) => {
      if (message.syncResult) {
        syncStatusP.textContent = message.syncResult;
        syncStatusP.style.color = message.success ? "green" : "red";
        syncBtn.disabled = false;
      }
    });
  });
});
