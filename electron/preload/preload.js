const { ipcRenderer, contextBridge } = require("electron");

contextBridge.exposeInMainWorld("ver", {
  writeFile: (filePath, content) => {
    ipcRenderer.send("writeFile", filePath, content);
  },
  readFile: (filePath) => ipcRenderer.invoke("readFile", filePath),
  openFiles: () => ipcRenderer.invoke("dialog:openFiles"),
});

window.addEventListener("DOMContentLoaded", () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector);
    if (element) element.innerText = text;
  };

  for (const dependency of ["chrome", "node", "electron"]) {
    replaceText(`${dependency}-version`, process.versions[dependency]);
  }
});
