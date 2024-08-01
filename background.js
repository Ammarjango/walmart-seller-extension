let isScriptInjected = false;

chrome.action.onClicked.addListener((tab) => {
  if (tab.id) {
    if (isScriptInjected) {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: toggleSidebar,
      });
    } else {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["content.js"],
      });
      isScriptInjected = true;
    }
  }
});

function toggleSidebar() {
  const sidebar = document.getElementById("sidebarDiv");
  const mainContent = document.getElementById("__next");
  if (sidebar) {
    sidebar.remove();
    if (mainContent) {
      mainContent.classList.remove("col-9");
      mainContent.classList.add("col-12");
    }
  } else {
    adjustLayout();
  }
}
