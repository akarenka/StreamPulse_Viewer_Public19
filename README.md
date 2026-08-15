# StreamPulse B2 2026

已設定的 Backblaze B2 儲存桶：

- Bucket：`streampulse-videos-2026`
- Bucket ID：`6b0bfe4dcd55004aa6050a17`
- 管理頁：<https://tree-iad1-0003.secure.backblaze.com/b2_browse_files2.htm?bucketId=6b0bfe4dcd55004aa6050a17>
- 預設公開網址：`https://f005.backblazeb2.com/file/streampulse-videos-2026/`

## 開啟方式

- 公開觀眾首頁：`index.html`。
- 管理者頁面：`admin.html`（包含上傳、方案、試算器、分紅後台及共用目錄匯出）。
- 觀眾頁備份：`viewer.html` 與 `viewer - Copy.html`。
- 也可以使用 VS Code Live Server 開啟。

GitHub Pages 最外層至少需要上傳 `index.html` 與 `media.json`。若也上傳 `admin.html`，知道網址的人可以開啟管理介面；切勿上傳設定後產生的 `config.env`。

## 使用既有 B2 影片

1. 在 Backblaze 管理頁將影片上傳至儲存桶。
2. 複製影片的 Friendly URL。
3. 在 StreamPulse 開啟「上傳影音並自動同步至大廳」。
4. 填寫標題與創作者資料，貼上 Friendly URL，再按確認。

新增的影音清單會保存在瀏覽器 `localStorage`，重新整理後仍會保留。

## 觀眾個人影音功能

- 私人收藏：使用書籤按鈕加入稍後觀看。
- 最愛影音：使用愛心按鈕建立最愛清單。
- 播放清單：使用清單按鈕排列個人連播內容。
- 自動回播：可切換「關閉」、「單片循環」與「清單連播」。
- 點擊頁首「我的影音庫」可以集中查看、播放或移除項目。

## 完整影音訂閱

- 月繳方案：NT$190，可完整觀看所有影音 1 個月。
- 年繳方案：NT$2,080，可完整觀看所有影音 1 年。
- 免費會員仍可試看前 15 秒；有效訂閱期間解除所有影片的 15 秒限制。
- 目前下載版提供前端訂閱權限與到期日保存示範，不會真的扣款。正式營運必須串接安全金流後端，並由後端驗證付款結果，不能只依賴瀏覽器 localStorage。

這些資料只保存在該觀眾目前使用的瀏覽器，不會公開給其他人。

## GitHub Pages 共用影音目錄

公開網站會在啟動時讀取同一層的 `media.json`。請將 `index.html` 與 `media.json` 一起上傳到 GitHub Repository 最外層，所有觀眾就會看到相同的 Backblaze 影音清單。

新增影片時，在 `media.json` 陣列加入一個項目並 Commit；GitHub Pages 更新後，觀眾重新整理即可看到。不要把 Backblaze 金鑰放入 `media.json`。

管理頁的每張影音卡提供鉛筆「編輯」與垃圾桶「從網站刪除」按鈕。修改後請按「下載更新後的 media.json」，再替換 GitHub 上的同名檔案；這樣其他瀏覽器才會同步。刪除網站卡片不會刪除 Backblaze 原始檔。

播放器若無法讀取來源，會顯示詳細錯誤與「直接開啟原始影片檢查」按鈕，方便判斷 404、Unauthorized 或不支援的編碼。

## Windows 本機安全端點（已加入）

1. 安裝 [Node.js 18 或更新版本](https://nodejs.org/)。
2. 在 Backblaze 建立只限 `streampulse-videos-2026` 的 Application Key，至少開啟 `writeFiles` 權限。
3. 雙擊 `setup-backblaze.cmd`，依序輸入 `keyID` 與 `applicationKey`。
4. 雙擊 `start-server.cmd`，上傳期間保持黑色視窗開啟。
5. 開啟 `index.html`，選擇本機影音並上傳。

本機端點位址為 `http://127.0.0.1:8787/upload`。可在瀏覽器開啟 `http://127.0.0.1:8787/health` 檢查狀態。

純 HTML 不應保存 Backblaze `keyID` 或 `applicationKey`，否則訪客可以取得金鑰。本專案會將金鑰存入電腦上的 `config.env`，只有本機 Node.js 後端讀取。

請勿上傳或分享產生的 `config.env`。若金鑰曾經外洩，請立即在 Backblaze 刪除該 Application Key 並建立新金鑰。

若儲存桶不是 Public，公開 Friendly URL 無法直接播放；請改用短效下載授權網址，或由後端代理串流。

## 本次修正

- 寫入指定 Bucket 名稱與 Bucket ID。
- 加入 Backblaze 管理頁快捷按鈕。
- 修正本機 Blob 暫存網址被誤稱為 B2 上傳的問題。
- 加入安全上傳 API 接口與錯誤處理。
- 加入零第三方套件的 Windows Node.js 本機上傳後端。
- 加入 `setup-backblaze.cmd` 與 `start-server.cmd` 一鍵設定/啟動工具。
- 驗證 Friendly URL 必須使用 HTTPS。
- 新增影音清單的瀏覽器持久保存。
- 保留原有播放、15 秒試看、訂閱、分紅試算與後台介面。
