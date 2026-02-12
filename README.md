
# 🚀 CryptoPulse Pro  (Crypto_Price_Tracker)
Real-Time Cryptocurrency Analytics Dashboard

CryptoPulse Pro is a full-stack crypto tracking dashboard built with **Flask, SQLite, Chart.js, and Tailwind CSS**.  
It displays live market data, tracks historical prices, and works even if the external API fails.

---

## ✨ Features

- 📊 Live top 10 crypto prices (CoinGecko API)
- 📈 24h historical price chart
- 🔎 Search & filter coins
- 🟢 Live / Offline status indicator
- 💾 SQLite database caching
- 🔄 Auto-refresh every 20 seconds
- 🎨 Modern glass-style UI

---

## 🛠 Tech Stack

**Backend:** Flask, SQLite, Requests  
**Frontend:** HTML, Tailwind CSS, Chart.js, JavaScript  

---

## 📂 Project Structure

```
CryptoPulse_Pro/
│
├── app.py
├── database.db
├── templates/
│   └── index.html
└── static/
    ├── css/style.css
    └── js/app.js
```

---

## ⚙️ Installation

```bash
git clone https://github.com/your-username/cryptopulse-pro.git
cd cryptopulse-pro
pip install flask requests
python app.py
```

Open in browser:

```
http://127.0.0.1:5000
```

---

## 📡 API Endpoints

- `GET /api/market`
- `GET /api/history/<coin_id>`

Example:
```
/api/history/bitcoin
```

---

## 💼 Resume Description

Built a real-time crypto analytics dashboard with Flask and Chart.js featuring API integration, offline caching, and historical trend visualization.

---

## 📜 License

For educational and portfolio use.

