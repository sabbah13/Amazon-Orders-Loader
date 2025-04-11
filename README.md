# 🛒 Amazon Order Loader Bookmarklet
This bookmarklet automatically loads **all your Amazon order history pages** into a single view, no matter where you start: the default order page, a specific year, or a filtered view (like "last 30 days").
It:
- ✅ Works on any Amazon Orders URL (`/your-orders/orders?...`)
- 📄 Appends all order cards from all pages onto the same page
- 📊 Shows a **smooth, semi-transparent progress modal**
- 🚀 Fades out cleanly when all pages are loaded
- 🛑 Detects when you're on the last page and exits with no unnecessary requests
---
## ✨ Features
- 🔍 Automatically discovers how many pages exist (even if hidden under `...` in pagination)
- 🧠 Starts only from the current page and fetches forward
- 💡 Adaptive to any date filters or pagination
- 💬 Clean console logs for debugging
- 🎨 Beautiful modal UI in the center of the screen
- ⏳ Animated progress bar and dimmed background
- 🧼 Overlay fades away after loading completes
---
## 📷 Screenshots
### 🔘 Before loading
![Before loading](./screenshots/before-loading.png)
### 📦 While loading
![While loading](./screenshots/while-loading.png)
### ✅ After loading is complete
![After loading](./screenshots/after-loading.png)
> *Add your actual screenshots in a *`screenshots/`* folder for best effect.*
---
## 📥 Installation

### 1. Quick Drag & Drop Method
**Simply drag this button to your bookmarks bar:**

<a href="javascript:(()=>{const baseHost=location.origin,seenIndexes=new Set(),createOverlay=()=>{let overlay=document.getElementById('amazon-order-loader-overlay');if(overlay)return overlay;overlay=document.createElement('div'),overlay.id='amazon-order-loader-overlay',overlay.style.cssText='position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:9999;transition:opacity 0.5s ease;';const box=document.createElement('div');box.style.cssText='background:#fff;padding:20px 30px;border-radius:10px;font-family:sans-serif;font-size:16px;box-shadow:0 0 20px rgba(0,0,0,0.3);text-align:center;min-width:200px;',box.innerHTML='<div style=\"margin-bottom:10px;\">📦 <strong id=\"amazon-progress-text\">Loading...</strong></div><div style=\"background:#eee;border-radius:5px;overflow:hidden;\"><div id=\"amazon-progress-bar\" style=\"height:10px;width:0;background:#4caf50;transition:width 0.3s ease;\"></div></div>',overlay.appendChild(box),document.body.appendChild(overlay)},updateProgress=(page,total)=>{const text=document.getElementById('amazon-progress-text'),bar=document.getElementById('amazon-progress-bar');text&&(text.textContent=`Loading page ${page} of ${total}`),bar&&(bar.style.width=Math.min(100*(page/total),100)+'%')},hideOverlay=()=>{const overlay=document.getElementById('amazon-order-loader-overlay');overlay&&(overlay.style.opacity='0',setTimeout(()=>{overlay.remove()},1e3))},getCurrentPageNumber=()=>{const li=document.querySelector('ul.a-pagination li.a-selected');if(!li)return null;const n=parseInt(li.textContent.trim(),10);return isNaN(n)?null:n},extractMaxStartIndex=doc=>{let max=0;return[...doc.querySelectorAll('ul.a-pagination li')].forEach(li=>{const a=li.querySelector('a');if(a){const match=a.href.match(/startIndex=(\\d+)/);match&&parseInt(match[1])>max&&(max=parseInt(match[1]))}}),max},buildPageUrl=(doc,targetStartIndex)=>{for(const a of doc.querySelectorAll('ul.a-pagination a'))if(a.href.includes('startIndex=')){const u=new URL(a.href,baseHost);return u.searchParams.set('startIndex',targetStartIndex.toString()),u.toString()}return null},fetchAndInsert=async(startIndex,pageNum,totalPages)=>{const url=buildPageUrl(document,startIndex);if(!url)return console.error('[ERROR] Could not build page URL.'),null;console.log(`[INFO] Fetching page ${pageNum}/${totalPages}: ${url}`);try{const res=await fetch(url,{credentials:'include'});if(!res.ok)throw new Error(`HTTP ${res.status}`);const text=await res.text(),parser=new DOMParser,doc=parser.parseFromString(text,'text/html'),orderCards=doc.querySelectorAll('li.order-card__list');console.log(`[INFO] Found ${orderCards.length} order card(s) on page ${pageNum}`);const last=document.querySelector('li.order-card__list:last-of-type');if(!last)return console.error('[ERROR] Could not find last order card on current page.'),doc;const parent=last.parentNode,next=last.nextSibling;orderCards.forEach(card=>{const clone=card.cloneNode(!0);parent.insertBefore(clone,next)}),console.log(`[SUCCESS] Appended ${orderCards.length} card(s) from page ${pageNum}`),updateProgress(pageNum,totalPages);return doc}catch(e){return console.error(`[ERROR] Failed to fetch or process page ${pageNum}:`,e),null}};const currentPageNumber=getCurrentPageNumber();if(!currentPageNumber)return void console.error('[ERROR] Could not determine the current page number.');const initialDoc=document,maxStartIndexInitial=extractMaxStartIndex(initialDoc),totalPagesEstimateInitial=Math.floor(maxStartIndexInitial/10)+1;let currentStartIndex=10*(currentPageNumber-1)+10,pageNumber=currentPageNumber,maxStartIndex=maxStartIndexInitial,totalPagesEstimate=totalPagesEstimateInitial;console.log(`[INFO] Current page: ${currentPageNumber}`),currentStartIndex>maxStartIndex?(console.log(`[✅ DONE] You're already on the last page (${currentPageNumber}). No additional pages to load.`),null):(console.log(`[INFO] Starting from page: ${pageNumber+1}`),console.log(`[INFO] Initial total page estimate: ${totalPagesEstimate}`),createOverlay(),updateProgress(pageNumber,totalPagesEstimate),async function(){while(currentStartIndex<=maxStartIndex){if(seenIndexes.has(currentStartIndex)){console.warn(`[WARN] Already fetched startIndex=${currentStartIndex}, skipping.`),currentStartIndex+=10;continue}pageNumber++,seenIndexes.add(currentStartIndex);const doc=await fetchAndInsert(currentStartIndex,pageNumber,totalPagesEstimate);if(!doc)break;const newMax=extractMaxStartIndex(doc);newMax>maxStartIndex&&(console.log(`[INFO] Updated maxStartIndex to ${newMax} (was ${maxStartIndex})`),maxStartIndex=newMax,totalPagesEstimate=Math.floor(maxStartIndex/10)+1),currentStartIndex+=10}console.log('[✅ DONE] All future order pages have been loaded.'),updateProgress(totalPagesEstimate,totalPagesEstimate),setTimeout(hideOverlay,3e3)}())})();" style="display:inline-block; padding:8px 12px; background:#4caf50; color:white; text-decoration:none; font-weight:bold; border-radius:4px; cursor:move;">🛒 Load Amazon Orders</a>

> **Note:** If you're viewing this on GitHub, the button won't work directly from this page. You'll need to visit the GitHub Pages version of this site to use the drag-and-drop feature, or use one of the methods below.

### 2. Manual Bookmark Creation
- In your browser, open the bookmarks manager
- Add a **new bookmark**
- Set the **name** to: `🛒 Load All Amazon Orders`
- Set the **URL** of the bookmark to the code from [`bookmarklet.js`](./bookmarklet.js)

> *Note: Make sure the code starts with *`javascript:(()=>{...})()`
---
## ▶️ Usage
1. Go to your Amazon Orders page (any of these will work):
   - `https://www.amazon.com/your-orders/orders`
   - `https://www.amazon.com/your-orders/orders?timeFilter=year-2024`
   - `https://www.amazon.com/your-orders/orders?startIndex=10`
   - `https://www.amazon.com/your-orders/orders?timeFilter=last30`
2. **Click your bookmarklet**.
3. Watch the progress bar and let it load all your orders from all pages.
4. Once finished, the UI will disappear smoothly — and your page will show everything in one view.
---
## 🛠 Development
To tweak the behavior (e.g., add export to CSV, auto-scroll, or more styling):
- Work with `src/bookmarklet.source.js`
- Then use a minifier like [Bookmarklet Maker](https://caiorss.github.io/bookmarklet-maker/) or [Terser](https://github.com/terser/terser)
- Paste the final one-liner into your bookmark
---
## 📄 License
MIT — free to use and modify for personal or commercial use.
---
## 🙋‍♀️ Support
If you find a bug or want to suggest an enhancement, feel free to open an issue or PR.
---
Enjoy your full-order history with one click! 🎉