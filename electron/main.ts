import { app, BrowserWindow, ipcMain, dialog, remote } from "electron";
import path from "path";
import { writeFile } from "fs";

// eslint-disable-next-line
// require("electron-reload")(__dirname);

function createWindow() {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
        },
        width: 800,
    });

    // and load the index.html of the app.
    mainWindow.loadFile(path.join(__dirname, "index.html"));

    // Open the DevTools.
    // mainWindow.webContents.openDevTools();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", () => {
    createWindow();

    app.on("activate", function () {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

ipcMain.on("start:screen_shot", async (_event, _arg) => {
    console.log("start screen shot");

    const targetWindow = remote.getCurrentWindow();
    const currentSize = targetWindow.getSize();

    const code =
        "var r = {}; \
        r.pageWidth = document.body.clientWidth; \
        r.pageHeight = document.body.clientHeight; \
        r;";
    const result = await targetWindow.webContents.executeJavaScript(
        code,
        false
    );
    console.log(result);

    targetWindow.setSize(
        parseInt(result.pageWidth),
        parseInt(result.pageHeight)
    );

    const capture = await targetWindow.capturePage();

    targetWindow.setSize(currentSize[0], currentSize[1]);

    if (capture.isEmpty()) {
        return;
    }

    const filename = await dialog.showSaveDialog(targetWindow, {
        title: "capture.jpg",
        filters: [
            { name: "Image File", extensions: ["jpg"] },
            { name: "All Files", extensions: ["*"] },
        ],
    });

    if (filename.canceled || !filename.filePath) {
        return;
    }

    writeFile(filename.filePath, capture.toJPEG(80), (err) => {
        if (err) {
            console.log(err);
        }
    });
});

ipcMain.on("get:locale", (event) => {
    event.returnValue = app.getLocale();
});

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
