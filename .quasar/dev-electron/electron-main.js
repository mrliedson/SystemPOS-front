// src-electron/electron-main.js
import { app, BrowserWindow } from "electron";
import path from "node:path";
import os from "node:os";
import { fileURLToPath } from "node:url";
var platform = process.platform || os.platform();
var currentDir = fileURLToPath(new URL(".", import.meta.url));
var mainWindow;
async function createWindow() {
  mainWindow = new BrowserWindow({
    icon: path.resolve(currentDir, "icons/icon.png"),
    // tray icon
    width: 1e3,
    height: 600,
    useContentSize: true,
    webPreferences: {
      contextIsolation: true,
      // More info: https://v2.quasar.dev/quasar-cli-vite/developing-electron-apps/electron-preload-script
      preload: path.resolve(
        currentDir,
        path.join("C:\\Users\\aluno\\Documents\\TCC\\SystemPOS-front\\.quasar\\dev-electron\\preload", "electron-preload.cjs")
      )
    }
  });
  if (true) {
    await mainWindow.loadURL("http://localhost:9300");
  } else {
    await mainWindow.loadFile("index.html");
  }
  if (true) {
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.webContents.on("devtools-opened", () => {
      mainWindow.webContents.closeDevTools();
    });
  }
  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}
app.whenReady().then(createWindow);
app.on("window-all-closed", () => {
  if (platform !== "darwin") {
    app.quit();
  }
});
app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vc3JjLWVsZWN0cm9uL2VsZWN0cm9uLW1haW4uanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImltcG9ydCB7IGFwcCwgQnJvd3NlcldpbmRvdyB9IGZyb20gJ2VsZWN0cm9uJ1xyXG5pbXBvcnQgcGF0aCBmcm9tICdub2RlOnBhdGgnXHJcbmltcG9ydCBvcyBmcm9tICdub2RlOm9zJ1xyXG5pbXBvcnQgeyBmaWxlVVJMVG9QYXRoIH0gZnJvbSAnbm9kZTp1cmwnXHJcblxyXG4vLyBuZWVkZWQgaW4gY2FzZSBwcm9jZXNzIGlzIHVuZGVmaW5lZCB1bmRlciBMaW51eFxyXG5jb25zdCBwbGF0Zm9ybSA9IHByb2Nlc3MucGxhdGZvcm0gfHwgb3MucGxhdGZvcm0oKVxyXG5cclxuY29uc3QgY3VycmVudERpciA9IGZpbGVVUkxUb1BhdGgobmV3IFVSTCgnLicsIGltcG9ydC5tZXRhLnVybCkpXHJcblxyXG5sZXQgbWFpbldpbmRvd1xyXG5cclxuYXN5bmMgZnVuY3Rpb24gY3JlYXRlV2luZG93ICgpIHtcclxuICAvKipcclxuICAgKiBJbml0aWFsIHdpbmRvdyBvcHRpb25zXHJcbiAgICovXHJcbiAgbWFpbldpbmRvdyA9IG5ldyBCcm93c2VyV2luZG93KHtcclxuICAgIGljb246IHBhdGgucmVzb2x2ZShjdXJyZW50RGlyLCAnaWNvbnMvaWNvbi5wbmcnKSwgLy8gdHJheSBpY29uXHJcbiAgICB3aWR0aDogMTAwMCxcclxuICAgIGhlaWdodDogNjAwLFxyXG4gICAgdXNlQ29udGVudFNpemU6IHRydWUsXHJcbiAgICB3ZWJQcmVmZXJlbmNlczoge1xyXG4gICAgICBjb250ZXh0SXNvbGF0aW9uOiB0cnVlLFxyXG4gICAgICAvLyBNb3JlIGluZm86IGh0dHBzOi8vdjIucXVhc2FyLmRldi9xdWFzYXItY2xpLXZpdGUvZGV2ZWxvcGluZy1lbGVjdHJvbi1hcHBzL2VsZWN0cm9uLXByZWxvYWQtc2NyaXB0XHJcbiAgICAgIHByZWxvYWQ6IHBhdGgucmVzb2x2ZShcclxuICAgICAgICBjdXJyZW50RGlyLFxyXG4gICAgICAgIHBhdGguam9pbihwcm9jZXNzLmVudi5RVUFTQVJfRUxFQ1RST05fUFJFTE9BRF9GT0xERVIsICdlbGVjdHJvbi1wcmVsb2FkJyArIHByb2Nlc3MuZW52LlFVQVNBUl9FTEVDVFJPTl9QUkVMT0FEX0VYVEVOU0lPTilcclxuICAgICAgKVxyXG4gICAgfVxyXG4gIH0pXHJcblxyXG4gIGlmIChwcm9jZXNzLmVudi5ERVYpIHtcclxuICAgIGF3YWl0IG1haW5XaW5kb3cubG9hZFVSTChwcm9jZXNzLmVudi5BUFBfVVJMKVxyXG4gIH0gZWxzZSB7XHJcbiAgICBhd2FpdCBtYWluV2luZG93LmxvYWRGaWxlKCdpbmRleC5odG1sJylcclxuICB9XHJcblxyXG4gIGlmIChwcm9jZXNzLmVudi5ERUJVR0dJTkcpIHtcclxuICAgIC8vIGlmIG9uIERFViBvciBQcm9kdWN0aW9uIHdpdGggZGVidWcgZW5hYmxlZFxyXG4gICAgbWFpbldpbmRvdy53ZWJDb250ZW50cy5vcGVuRGV2VG9vbHMoKVxyXG4gIH0gZWxzZSB7XHJcbiAgICAvLyB3ZSdyZSBvbiBwcm9kdWN0aW9uOyBubyBhY2Nlc3MgdG8gZGV2dG9vbHMgcGxzXHJcbiAgICBtYWluV2luZG93LndlYkNvbnRlbnRzLm9uKCdkZXZ0b29scy1vcGVuZWQnLCAoKSA9PiB7XHJcbiAgICAgIG1haW5XaW5kb3cud2ViQ29udGVudHMuY2xvc2VEZXZUb29scygpXHJcbiAgICB9KVxyXG4gIH1cclxuXHJcbiAgbWFpbldpbmRvdy5vbignY2xvc2VkJywgKCkgPT4ge1xyXG4gICAgbWFpbldpbmRvdyA9IG51bGxcclxuICB9KVxyXG59XHJcblxyXG5hcHAud2hlblJlYWR5KCkudGhlbihjcmVhdGVXaW5kb3cpXHJcblxyXG5hcHAub24oJ3dpbmRvdy1hbGwtY2xvc2VkJywgKCkgPT4ge1xyXG4gIGlmIChwbGF0Zm9ybSAhPT0gJ2RhcndpbicpIHtcclxuICAgIGFwcC5xdWl0KClcclxuICB9XHJcbn0pXHJcblxyXG5hcHAub24oJ2FjdGl2YXRlJywgKCkgPT4ge1xyXG4gIGlmIChtYWluV2luZG93ID09PSBudWxsKSB7XHJcbiAgICBjcmVhdGVXaW5kb3coKVxyXG4gIH1cclxufSlcclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFBLFNBQVMsS0FBSyxxQkFBcUI7QUFDbkMsT0FBTyxVQUFVO0FBQ2pCLE9BQU8sUUFBUTtBQUNmLFNBQVMscUJBQXFCO0FBRzlCLElBQU0sV0FBVyxRQUFRLFlBQVksR0FBRyxTQUFTO0FBRWpELElBQU0sYUFBYSxjQUFjLElBQUksSUFBSSxLQUFLLFlBQVksR0FBRyxDQUFDO0FBRTlELElBQUk7QUFFSixlQUFlLGVBQWdCO0FBSTdCLGVBQWEsSUFBSSxjQUFjO0FBQUEsSUFDN0IsTUFBTSxLQUFLLFFBQVEsWUFBWSxnQkFBZ0I7QUFBQTtBQUFBLElBQy9DLE9BQU87QUFBQSxJQUNQLFFBQVE7QUFBQSxJQUNSLGdCQUFnQjtBQUFBLElBQ2hCLGdCQUFnQjtBQUFBLE1BQ2Qsa0JBQWtCO0FBQUE7QUFBQSxNQUVsQixTQUFTLEtBQUs7QUFBQSxRQUNaO0FBQUEsUUFDQSxLQUFLLEtBQUsscUZBQTRDLHNCQUFrRTtBQUFBLE1BQzFIO0FBQUEsSUFDRjtBQUFBLEVBQ0YsQ0FBQztBQUVELE1BQUksTUFBaUI7QUFDbkIsVUFBTSxXQUFXLFFBQVEsdUJBQW1CO0FBQUEsRUFDOUMsT0FBTztBQUNMLFVBQU0sV0FBVyxTQUFTLFlBQVk7QUFBQSxFQUN4QztBQUVBLE1BQUksTUFBdUI7QUFFekIsZUFBVyxZQUFZLGFBQWE7QUFBQSxFQUN0QyxPQUFPO0FBRUwsZUFBVyxZQUFZLEdBQUcsbUJBQW1CLE1BQU07QUFDakQsaUJBQVcsWUFBWSxjQUFjO0FBQUEsSUFDdkMsQ0FBQztBQUFBLEVBQ0g7QUFFQSxhQUFXLEdBQUcsVUFBVSxNQUFNO0FBQzVCLGlCQUFhO0FBQUEsRUFDZixDQUFDO0FBQ0g7QUFFQSxJQUFJLFVBQVUsRUFBRSxLQUFLLFlBQVk7QUFFakMsSUFBSSxHQUFHLHFCQUFxQixNQUFNO0FBQ2hDLE1BQUksYUFBYSxVQUFVO0FBQ3pCLFFBQUksS0FBSztBQUFBLEVBQ1g7QUFDRixDQUFDO0FBRUQsSUFBSSxHQUFHLFlBQVksTUFBTTtBQUN2QixNQUFJLGVBQWUsTUFBTTtBQUN2QixpQkFBYTtBQUFBLEVBQ2Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
