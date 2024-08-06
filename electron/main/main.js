const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("path");
const fs = require("fs");

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    icon: path.join(__dirname, "../../assets/win32.ico"),
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, "../preload/preload.js"),
      webSecurity: true,
    },
  });

  // win.loadURL("http://localhost:5174");
  win.loadFile(path.join(__dirname, "../../dist/index.html"));

  win.webContents.openDevTools();
};

app.whenReady().then(() => {
  ipcMain.on("writeFile", (_, path, content) => {
    console.log("handle", path, content);
    fs.writeFileSync(path, content);
  });
  ipcMain.handle("readFile", (_, path) => {
    console.log("handle", path);
    const content = fs.readFileSync(path).toString("utf-8");

    return content;
  });

  ipcMain.handle("dialog:openFiles", async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog({});

    if (!canceled) {
      console.log(filePaths[0], "我来了");
      return filePaths[0];
    }
  });

  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  app.quit();
});
