import sqlite3
import requests
from flask import Flask, render_template, jsonify
from datetime import datetime, timedelta

app = Flask(__name__)
DB_NAME = "database.db"


# -----------------------------
# Initialize Database
# -----------------------------
def db_init():
    with sqlite3.connect(DB_NAME) as conn:
        conn.execute('''CREATE TABLE IF NOT EXISTS market (
            id TEXT PRIMARY KEY,
            symbol TEXT,
            name TEXT,
            price REAL,
            change_24h REAL,
            image TEXT,
            last_updated DATETIME
        )''')

        conn.execute('''CREATE TABLE IF NOT EXISTS history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            coin_id TEXT,
            price REAL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )''')


# -----------------------------
# Cleanup old history (24h)
# -----------------------------
def cleanup_history():
    cutoff = datetime.now() - timedelta(hours=24)
    with sqlite3.connect(DB_NAME) as conn:
        conn.execute("DELETE FROM history WHERE timestamp < ?", (cutoff,))


# -----------------------------
# Home
# -----------------------------
@app.route('/')
def index():
    return render_template('index.html')


# -----------------------------
# Market API
# -----------------------------
@app.route('/api/market')
def get_market():
    try:
        url = "https://api.coingecko.com/api/v3/coins/markets"
        params = {
            "vs_currency": "usd",
            "order": "market_cap_desc",
            "per_page": 10
        }

        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()
        data = response.json()

        with sqlite3.connect(DB_NAME) as conn:
            for coin in data:
                conn.execute("""
                    INSERT OR REPLACE INTO market
                    VALUES (?,?,?,?,?,?,?)
                """, (
                    coin["id"],
                    coin["symbol"],
                    coin["name"],
                    coin["current_price"],
                    coin["price_change_percentage_24h"],
                    coin["image"],
                    datetime.now()
                ))

                conn.execute("""
                    INSERT INTO history (coin_id, price)
                    VALUES (?,?)
                """, (coin["id"], coin["current_price"]))

        cleanup_history()
        return jsonify(data)

    except Exception as e:
        print("API error:", e)
        with sqlite3.connect(DB_NAME) as conn:
            conn.row_factory = sqlite3.Row
            rows = conn.execute("SELECT * FROM market").fetchall()
            return jsonify([dict(r) for r in rows])


# -----------------------------
# Historical Data API
# -----------------------------
@app.route('/api/history/<coin_id>')
def get_history(coin_id):
    with sqlite3.connect(DB_NAME) as conn:
        conn.row_factory = sqlite3.Row
        rows = conn.execute("""
            SELECT price, timestamp
            FROM history
            WHERE coin_id = ?
            ORDER BY timestamp ASC
        """, (coin_id,)).fetchall()

        return jsonify([{
            "price": r["price"],
            "time": r["timestamp"]
        } for r in rows])


# -----------------------------
# Run
# -----------------------------
if __name__ == "__main__":
    db_init()
    app.run(debug=True)
