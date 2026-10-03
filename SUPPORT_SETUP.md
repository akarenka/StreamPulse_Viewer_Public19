# StreamPulse 浮動 AI 客服：Netlify 版

已加入 index.html、support-widget.js、support-config.js。歡迎詞與常見問題在前端運作；AI 透過 Netlify Functions。

## 1. 更新原 repository
保留原有檔案，加入／更新：
- index.html
- support-widget.js、support-config.js
- netlify.toml
- netlify/functions/chat.mjs
- netlify/lib/chat-core.mjs
- scripts/build-netlify.mjs

原網站有 Firebase 登入，客服開啟時可使用當時已登入會員的顯示名稱。客服不讀取私人資料或執行管理操作。

## 2. Netlify 部署
從 Git 匯入／更新這個 repository，Base directory 留空；Build command 為 node scripts/build-netlify.mjs；Publish directory 為 dist。netlify.toml 已設定函式目錄。使用 Git 連續部署或 Netlify CLI 建置部署，單純將 HTML 拖入部署不會完成後端建置。

建置把原網站檔案複製到 dist，排除函式原始碼、git、環境檔、測試與 google-live-backend。若有其他後端目錄，請加入 scripts/build-netlify.mjs 的排除清單。此建置不會部署原本的 Google Live 後端服務。

## 3. 環境變數
在 Netlify 專案的 Environment variables 設定，確保可供 Functions 使用：
| 名稱 | 值 |
|---|---|
| OPENAI_API_KEY | OpenAI API 密鑰，僅留在後端 |
| OPENAI_MODEL | API 專案可使用、支援 Responses API 的模型 ID |
| ALLOWED_ORIGINS | 實際 Netlify 網站 Origin，如 https://你的站名.netlify.app；多個以逗號分隔，不含路徑或尾端斜線 |
| UPSTASH_REDIS_REST_URL | Upstash Redis REST URL |
| UPSTASH_REDIS_REST_TOKEN | Redis REST Token |
| RATE_LIMIT_SALT | 自行產生的長隨機字串 |
| DAILY_REQUEST_LIMIT | 全站每日請求上限，預設 100 |

若使用自訂網域，也加入 ALLOWED_ORIGINS。不要直接沿用 tomoweb9.online，除非它確實是這個 StreamPulse 網站的網域。
重新部署後，前端會自動呼叫 /.netlify/functions/chat。GitHub Pages 上保留 FAQ 模式；若要從 Pages 呼叫 Netlify，將 support-config.js 改成完整的 Netlify 函式 URL，並把 https://akarenka.github.io 加入允許來源。

## 4. 測試
開啟右下角客服，點「登入問題」可測 FAQ。輸入「你好，請介紹這個網站」測試 AI。若未設定必要變數，會顯示尚未設定完成；若後端有錯，查看 Netlify 的函式紀錄。

每 IP 每分鐘最多 5 次；全站每天預設 100 次嘗試，UTC 日期重置。失败亦計數。上限是請求數上限，不是精確金額上限；另外設定 AI 平台費用控制。Redis 失敗時拒絕 AI 請求。Origin 檢查不是會員驗證，外部工具可偽造，客服因此不提供私人資料或管理功能。

AI 問題與最近 8 則歷史會傳給 OpenAI；store:false 不代表零資料留存。請勿傳送密碼或付款資料。

## 三語客服
客服支援繁體中文、English、日本語。預設依瀏覽器語言，亦可在視窗上方切換，選擇保存在本機。切換會清空 AI 歷史，但保留畫面上的舊訊息。

提供登入、播放、影音庫、播放清單、上傳、分享、訂閱付款、聯絡管理員共 8 類 FAQ，以及問候、感謝與道別回覆。FAQ 不需要 AI 金鑰；自由問答仍需上述環境變數。AI 請求使用白名單 language 欄位，後端要求以所選語言回答。

## 驗證狀態
語法檢查、6 項模擬後端測試及靜態網站建置通過。尚未完成真實 AI、Redis 或 Netlify 線上測試。
