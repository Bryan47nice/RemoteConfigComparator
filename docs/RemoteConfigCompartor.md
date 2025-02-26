# Remote Config JSON 設定檔比較工具

這是一個基於網頁的 JSON 設定檔比較工具，專門用於比較 Remote Config 的設定檔差異。此工具可以清楚地顯示參數的變更、新增和刪除狀況。

## 功能特點

- 支援比較兩個 JSON 設定檔的差異
- 自動識別並分類變更、新增和刪除的項目
- 清晰的表格式呈現方式
- 支援複雜的 JSON 結構展示
- 自動格式化 JSON 內容
- 即時比較，無需後端服務

## 使用說明

### 基本操作步驟

1. 開啟工具網頁
2. 選擇舊的 JSON 設定檔（比較基準）
3. 選擇新的 JSON 設定檔（要比較的檔案）
4. 點擊「比較檔案」按鈕
5. 查看比較結果

### 支援的檔案格式

- 僅支援 `.json` 檔案
- 檔案必須是有效的 JSON 格式
- 建議檔案大小不超過 10MB

## 比較結果解讀

比較結果分為三個主要區塊：

### 1. 變更項目

顯示已存在但內容有修改的參數：

| 欄位 | 說明 |
|------|------|
| parameterGroups | 參數所屬的群組名稱 |
| parameters | 參數名稱 |
| 類別 | 參數的資料類型 |
| 原本內容 | 舊設定檔中的值 |
| 變更內容 | 新設定檔中的值 |

### 2. 新增項目

顯示在新設定檔中新增的參數：

| 欄位 | 說明 |
|------|------|
| parameterGroups | 參數所屬的群組名稱 |
| parameters | 參數名稱 |
| 資料類別 | 參數的資料類型 |
| 描述 | 參數的說明文字 |
| 新增內容 | 新增的參數值 |

### 3. 刪除項目

顯示在新設定檔中被刪除的參數：

| 欄位 | 說明 |
|------|------|
| parameterGroups | 參數所屬的群組名稱 |
| parameters | 參數名稱 |
| 資料類別 | 參數的資料類型 |
| 描述 | 參數的說明文字 |
| 刪除內容 | 被刪除的參數值 |

## 特殊處理說明

### 內容格式化

- 一般文字：直接顯示
- JSON 物件/陣列：自動格式化並使用程式碼區塊顯示
- 空值：顯示為「空值」
- 特殊格式：自動識別並適當展示

### 群組描述變更

- 當 parameterGroups 的描述發生變更時，會特別標示為「群組描述」類型
- 變更內容會清楚顯示新舊描述的差異

## 注意事項

1. 檔案比較是在瀏覽器端進行，不會上傳到任何伺服器
2. 大型 JSON 檔案可能需要較長處理時間
3. 確保上傳的 JSON 檔案格式正確，否則會顯示錯誤提示
4. 比較結果會包含時間戳記，方便追蹤比較歷史

## 技術細節

- 純前端實現，使用原生 JavaScript
- 支援現代瀏覽器（Chrome、Firefox、Safari、Edge）
- 響應式設計，支援不同螢幕尺寸
- 本地檔案處理，確保資料安全

## 常見問題

**Q: 為什麼某些 JSON 內容會以程式碼區塊形式顯示？**  
A: 當內容包含特定字符（如 {}, [], :, ,）時，工具會自動將其識別為程式碼並使用特殊格式顯示，以提高可讀性。

**Q: 檔案大小有限制嗎？**  
A: 理論上沒有硬性限制，但建議檔案不要過大，以免影響瀏覽器效能。

**Q: 可以比較多個檔案嗎？**  
A: 目前僅支援兩個檔案的比較，如需比較多個檔案，需要多次操作。

## 貢獻指南

歡迎提交 Issue 和 Pull Request 來改善這個工具。請確保：

1. 清楚描述問題或改進建議
2. 提供重現問題的步驟（如適用）
3. 遵循現有的程式碼風格
4. 更新相關文檔

## 授權

[授權方式]

---

*最後更新：2024-02-06*
