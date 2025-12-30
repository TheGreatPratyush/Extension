chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "githubSync") {
    chrome.storage.sync.get("githubConfig", async (config) => {
      chrome.storage.local.get("leetCodeProblemInfo", async (data) => {
        try {
          const { token, username, repo } = config.githubConfig;
          const { problemName, language } = data.leetCodeProblemInfo;
          
          const fileName = `${problemName.replace(/[^a-zA-Z0-9]/g, '_')}.py`;
          const fileContent = `# ${problemName}
# Language: ${language}

class Solution:
    def solve(self):
        pass`;

          const response = await fetch(`https://api.github.com/repos/${username}/${repo}/contents/${fileName}`, {
            method: 'PUT',
            headers: {
              'Authorization': `token ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              message: `Add LeetCode: ${problemName}`,
              content: btoa(fileContent)
            })
          });

          const result = await response.json();
          
          if (response.ok) {
            sendResponse({ syncResult: `✅ Posted: ${fileName}`, success: true });
          } else {
            sendResponse({ syncResult: `❌ ${result.message}`, success: false });
          }
        } catch (error) {
          sendResponse({ syncResult: `❌ ${error.message}`, success: false });
        }
      });
    });
    return true;
  }
});
