# 如何把 LinkedIn 獎項完整匯入本站資料庫

## 為什麼無法自動抓 LinkedIn？

`https://www.linkedin.com/in/timcho-giser/` 需登入才能看完整「榮譽與獎項／專案」內容，自動化抓取會被導向登入牆。  
因此目前 `awards.json` 是由下列來源整合：

1. 履歷 PPT、作品集 PPT  
2. 公開新聞稿、市府／企業官網、官方 GitHub  

欄位標了 `"needs_linkedin_confirm": true` 的項目，代表 **名次已有、但敘述或新聞連結可能比 LinkedIn 少**，請你對照 LinkedIn 補上。

---

## 最快補齊方式（建議）

### 方法 A：複製 LinkedIn 文字給 AI 更新

1. 瀏覽器登入 LinkedIn → 打開你的個人檔案  
2. 捲到 **榮譽與獎項（Honors & awards）** 或相關區塊  
3. 逐筆複製：名稱、頒發單位、日期、說明、連結  
4. 貼到對話中，說「請合併進 awards.json」  

### 方法 B：自己改 JSON

編輯：

```text
portfolio-site/data/awards.json
```

每一筆獎項建議欄位：

```json
{
  "id": "唯一英文代號-年份",
  "year": 2024,
  "title": "賽事名稱",
  "rank": "第一名",
  "issuer": "頒發單位",
  "event": "所屬活動",
  "team": "團隊名稱或 null",
  "description": "作品與得獎敘述（可從 LinkedIn 貼上）",
  "work_summary": "一句話作品摘要",
  "links": [
    {
      "label": "新聞稿",
      "url": "https://...",
      "type": "news"
    },
    {
      "label": "作品",
      "url": "https://...",
      "type": "demo"
    }
  ],
  "tags": ["hackathon"],
  "featured": true,
  "sources": ["linkedin", "resume"],
  "needs_linkedin_confirm": false
}
```

`links[].type` 建議：

| type | 用途 |
|------|------|
| `news` | 新聞稿 |
| `official` | 官方活動頁 |
| `demo` | 作品 repo / 線上 demo |
| `article` | 專訪、專欄 |
| `medium` | Medium 專案故事 |

補完後把該筆的 `needs_linkedin_confirm` 改成 `false`，並在 `sources` 加上 `"linkedin"`。

### 方法 C：LinkedIn 匯出檔

1. LinkedIn → 設定 → 資料隱私 → **取得你資料的副本**  
2. 申請匯出後下載 ZIP  
3. 把與 Awards 相關的檔案（或貼上內容）放到本資料夾，再請 AI 合併  

---

## 更新後如何反映到網頁

本站獎項區塊會 **自動讀取** `data/awards.json`。

```bash
# 本機預覽
cd portfolio-site
python3 -m http.server 8080
# 開 http://localhost:8080 看「獎項榮譽」

# 部署後更新
git add data/awards.json
git commit -m "Sync awards from LinkedIn"
git push
```

---

## 目前已有較完整公開連結的項目

| 年份 | 獎項 | 連結狀態 |
|------|------|----------|
| 2024 | 城市通微服務 · 第一名 | 官方 GitHub + 市府新聞 |
| 2024 | 城市儀表板 · 第二名 | Vpon 新聞 + 市府新聞 |
| 2019 | 臺南智慧城市視覺挑戰 · 第一名 | 中央社、中時、成大 |
| 2022 | 內政黑客松 · 金獎 | 內政部官方頁（活動／獲獎彙整） |

其餘項目歡迎用 LinkedIn 原文補 `description` 與 `links`。
