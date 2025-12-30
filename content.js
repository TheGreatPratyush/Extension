// BULLETPROOF - Forces detection on ALL LeetCode pages
(function() {
  console.log('🔥 LeetCode Sync STARTED');
  
  function saveProblem(problemName, language) {
    const info = {
      problemName: problemName,
      language: language,
      extension: language === 'cpp' ? 'cpp' : 'py',
      code: `# ${problemName}\n# Language: ${language}\nclass Solution:\n    def solve(self):\n        pass`
    };
    chrome.storage.local.set({ leetCodeProblemInfo: info });
    console.log('✅ SAVED:', problemName, language);
  }
  
  // Method 1: URL path
  const path = window.location.pathname;
  if (path.includes('/problems/')) {
    const slug = path.split('/problems/')[1]?.split('/')[0] || 'unknown';
    const name = slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    saveProblem(name, 'python3');
    return;
  }
  
  // Method 2: Any LeetCode page - generic
  saveProblem('LeetCode_Problem', 'python3');
  
})();

// Keep saving every 2 seconds
setInterval(() => {
  const path = window.location.pathname;
  if (path.includes('/problems/')) {
    const slug = path.split('/problems/')[1]?.split('/')[0] || 'unknown';
    const name = slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    chrome.storage.local.set({ 
      leetCodeProblemInfo: {
        problemName: name,
        language: 'python3',
        extension: 'py',
        code: `# ${name}\nclass Solution:\n    def solve(self):\n        pass`
      }
    });
  }
}, 2000);
