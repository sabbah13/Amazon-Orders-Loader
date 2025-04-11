(() => {
  // Base host for building URLs
  const baseHost = location.origin;
  
  // Track indexes we've already seen to avoid duplicates
  const seenIndexes = new Set();
  
  // Create and return the overlay UI
  const createOverlay = () => {
    let overlay = document.getElementById("amazon-order-loader-overlay");
    if (overlay) return overlay;
    
    overlay = document.createElement("div");
    overlay.id = "amazon-order-loader-overlay";
    overlay.style.cssText = "position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:9999;transition:opacity 0.5s ease;";
    
    const box = document.createElement("div");
    box.style.cssText = "background:#fff;padding:20px 30px;border-radius:10px;font-family:sans-serif;font-size:16px;box-shadow:0 0 20px rgba(0,0,0,0.3);text-align:center;min-width:200px;";
    
    box.innerHTML = '<div style="margin-bottom:10px;">📦 <strong id="amazon-progress-text">Loading...</strong></div><div style="background:#eee;border-radius:5px;overflow:hidden;"><div id="amazon-progress-bar" style="height:10px;width:0;background:#4caf50;transition:width 0.3s ease;"></div></div>';
    
    overlay.appendChild(box);
    document.body.appendChild(overlay);
    return overlay;
  };
  
  // Update the progress UI
  const updateProgress = (page, total) => {
    const text = document.getElementById("amazon-progress-text");
    const bar = document.getElementById("amazon-progress-bar");
    
    if (text) {
      text.textContent = `Loading page ${page} of ${total}`;
    }
    
    if (bar) {
      bar.style.width = Math.min(100 * (page / total), 100) + "%";
    }
  };
  
  // Hide the overlay with a nice fade out
  const hideOverlay = () => {
    const overlay = document.getElementById("amazon-order-loader-overlay");
    if (overlay) {
      overlay.style.opacity = "0";
      setTimeout(() => {
        overlay.remove();
      }, 1000);
    }
  };
  
  // Get the current page number
  const getCurrentPageNumber = () => {
    const li = document.querySelector("ul.a-pagination li.a-selected");
    if (!li) return null;
    
    const n = parseInt(li.textContent.trim(), 10);
    return isNaN(n) ? null : n;
  };
  
  // Find the highest startIndex in pagination
  const extractMaxStartIndex = (doc) => {
    let max = 0;
    [...doc.querySelectorAll("ul.a-pagination li")].forEach((li) => {
      const a = li.querySelector("a");
      if (a) {
        const match = a.href.match(/startIndex=(\d+)/);
        if (match && parseInt(match[1]) > max) {
          max = parseInt(match[1]);
        }
      }
    });
    return max;
  };
  
  // Build a URL for a given start index
  const buildPageUrl = (doc, targetStartIndex) => {
    for (const a of doc.querySelectorAll("ul.a-pagination a")) {
      if (a.href.includes("startIndex=")) {
        const u = new URL(a.href, baseHost);
        u.searchParams.set("startIndex", targetStartIndex.toString());
        return u.toString();
      }
    }
    return null;
  };
  
  // Fetch a new page and insert its orders
  const fetchAndInsert = async (startIndex, pageNum, totalPages) => {
    const url = buildPageUrl(document, startIndex);
    if (!url) {
      console.error("[ERROR] Could not build page URL.");
      return null;
    }
    
    console.log(`[INFO] Fetching page ${pageNum}/${totalPages}: ${url}`);
    
    try {
      // Fetch the page
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      
      const text = await res.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(text, "text/html");
      
      // Find order cards on the new page
      const orderCards = doc.querySelectorAll("li.order-card__list");
      console.log(`[INFO] Found ${orderCards.length} order card(s) on page ${pageNum}`);
      
      // Find where to insert cards on current page
      const last = document.querySelector("li.order-card__list:last-of-type");
      if (!last) {
        console.error("[ERROR] Could not find last order card on current page.");
        return doc;
      }
      
      const parent = last.parentNode;
      const next = last.nextSibling;
      
      // Insert new cards
      orderCards.forEach((card) => {
        const clone = card.cloneNode(true);
        parent.insertBefore(clone, next);
      });
      
      console.log(`[SUCCESS] Appended ${orderCards.length} card(s) from page ${pageNum}`);
      updateProgress(pageNum, totalPages);
      
      return doc;
    } catch (e) {
      console.error(`[ERROR] Failed to fetch or process page ${pageNum}:`, e);
      return null;
    }
  };
  
  // ------------------- Main Execution Start -------------------
  
  // Get current page and total pages
  const currentPageNumber = getCurrentPageNumber();
  if (!currentPageNumber) {
    console.error("[ERROR] Could not determine the current page number.");
    return;
  }
  
  // Initialize variables
  const initialDoc = document;
  const maxStartIndexInitial = extractMaxStartIndex(initialDoc);
  const totalPagesEstimateInitial = Math.floor(maxStartIndexInitial / 10) + 1;
  
  let currentStartIndex = 10 * (currentPageNumber - 1) + 10;
  let pageNumber = currentPageNumber;
  let maxStartIndex = maxStartIndexInitial;
  let totalPagesEstimate = totalPagesEstimateInitial;
  
  console.log(`[INFO] Current page: ${currentPageNumber}`);
  
  // Exit if we're already on the last page
  if (currentStartIndex > maxStartIndex) {
    console.log(`[✅ DONE] You're already on the last page (${currentPageNumber}). No additional pages to load.`);
    return null;
  }
  
  console.log(`[INFO] Starting from page: ${pageNumber + 1}`);
  console.log(`[INFO] Initial total page estimate: ${totalPagesEstimate}`);
  
  // Create UI and start loading
  createOverlay();
  updateProgress(pageNumber, totalPagesEstimate);
  
  // Main loading process
  (async function() {
    while (currentStartIndex <= maxStartIndex) {
      // Skip already processed pages
      if (seenIndexes.has(currentStartIndex)) {
        console.warn(`[WARN] Already fetched startIndex=${currentStartIndex}, skipping.`);
        currentStartIndex += 10;
        continue;
      }
      
      // Fetch and process the next page
      pageNumber++;
      seenIndexes.add(currentStartIndex);
      
      const doc = await fetchAndInsert(currentStartIndex, pageNumber, totalPagesEstimate);
      if (!doc) break;
      
      // Update our max index in case there are more pages
      const newMax = extractMaxStartIndex(doc);
      if (newMax > maxStartIndex) {
        console.log(`[INFO] Updated maxStartIndex to ${newMax} (was ${maxStartIndex})`);
        maxStartIndex = newMax;
        totalPagesEstimate = Math.floor(maxStartIndex / 10) + 1;
      }
      
      currentStartIndex += 10;
    }
    
    console.log("[✅ DONE] All future order pages have been loaded.");
    updateProgress(totalPagesEstimate, totalPagesEstimate);
    setTimeout(hideOverlay, 3000);
  })();
})();