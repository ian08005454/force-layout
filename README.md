# Academia Sinica Center of Digital Culture relationship visualization tool

## 用途

1. 運用ECharts的視覺化套件將鏈結資料以視覺化的方式呈現出來，能以更直觀的方式來了解物件之間的關係和其親密程度。 未來將連結公開鏈結資料庫(wikidata、 dbpedia)
2. 運用在任官途徑查詢系統，視覺化呈現職官關聯資訊

## 主要檔案

1. base.html：網頁主要撰寫架構，code 最下方可以透過不同的檔案來載入資料。
2. chartSetting.js：Force Layout 介面設定、網頁左側 Side Bar 預設值。
3. mainSetting.js：網頁左側 Side Bar 執行功能。

## 載入資料

可使用 JSON、js 載入資料。

* js 載入方式：透過 ` <script src="xxx.js"></script>`
* json 載入方式：透過 `var url = 'xxx.json'`

**!! base.html 中要保留 jdata 變數!!**

## 執行方式

1. 透過 Terminal `> npm run test`
2. 網址修改 port 成 8080，學長預設 run test port 8888，檢視載入的檔案大小。

## 套件

使用 package.json 調整
