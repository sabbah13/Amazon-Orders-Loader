# 🛒 Amazon Order Loader Bookmarklet

This bookmarklet **works directly in your browser** and automatically loads **all your Amazon order history pages** into a single view, no matter where you start: the default order page, a specific year, or a filtered view (like "last 30 days").

**Installation is as easy as dragging and dropping a link to your bookmarks bar!**

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

### 💫 Super Simple Installation - Just Drag & Drop!

**Visit our [GitHub Pages site](https://sabbah13.github.io/amazon-orders-loader/) for the easiest installation:**

1. Go to our GitHub Pages site
2. Find the green "🛒 Load Amazon Orders" button
3. Simply drag this button to your browser's bookmarks bar
4. That's it! No copying code, no technical setup required!

### Manual Alternative
- In your browser, open the bookmarks manager
- Add a **new bookmark**
- Set the **name** to: `🛒 Load All Amazon Orders`
- Set the **URL** to the code from [`bookmarklet.js`](./bookmarklet.js)

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