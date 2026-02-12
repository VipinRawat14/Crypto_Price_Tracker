let mainChart;
let selectedCoin = "bitcoin";


// ---------------- Chart Init ----------------
function initChart() {
    const ctx = document.getElementById('mainChart').getContext('2d');

    mainChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                data: [],
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59,130,246,0.1)',
                fill: true,
                tension: 0.3
            }]
        },
        options: {
            plugins: { legend: { display: false } },
            scales: {
                y: { ticks: { color: "#94a3b8" } },
                x: { ticks: { color: "#94a3b8" } }
            }
        }
    });
}


// ---------------- Load History ----------------
async function loadHistory(coinId) {
    const res = await fetch(`/api/history/${coinId}`);
    const data = await res.json();

    mainChart.data.labels = data.map(d =>
        new Date(d.time).toLocaleTimeString()
    );

    mainChart.data.datasets[0].data =
        data.map(d => d.price);

    mainChart.update();
}


// ---------------- Market Refresh ----------------
async function refreshMarket() {

    const status = document.getElementById("connection-status");
    status.innerHTML = "● UPDATING...";
    status.className = "px-4 py-2 bg-yellow-500/10 text-yellow-400 rounded-full text-xs font-bold";

    try {
        const res = await fetch('/api/market');
        const data = await res.json();
        const tbody = document.getElementById('coin-body');
        tbody.innerHTML = '';

        data.forEach(coin => {
            const isUp = coin.price_change_percentage_24h >= 0;

            tbody.innerHTML += `
                <tr onclick="selectCoin('${coin.id}')" class="cursor-pointer">
                    <td class="p-5 flex items-center gap-4">
                        <img src="${coin.image}" class="w-8 h-8">
                        <div>
                            <p class="font-bold">${coin.name}</p>
                            <p class="text-xs text-slate-500 uppercase">${coin.symbol}</p>
                        </div>
                    </td>
                    <td class="p-5 font-mono">$${coin.current_price.toLocaleString()}</td>
                    <td class="p-5">
                        <span class="px-2 py-1 rounded text-xs font-bold ${isUp ? 'text-green-400 bg-green-400/10' : 'text-red-400 bg-red-400/10'}">
                            ${isUp ? '▲' : '▼'} ${Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
                        </span>
                    </td>
                    <td class="p-5 text-slate-400">
                        <i class="fas fa-chart-line"></i>
                    </td>
                </tr>
            `;
        });

        status.innerHTML = "● LIVE SYSTEM";
        status.className = "px-4 py-2 bg-green-500/10 text-green-400 rounded-full text-xs font-bold";

    } catch (e) {
        status.innerHTML = "● OFFLINE MODE";
        status.className = "px-4 py-2 bg-red-500/10 text-red-400 rounded-full text-xs font-bold";
    }
}


// ---------------- Select Coin ----------------
function selectCoin(id) {
    selectedCoin = id;
    loadHistory(id);
}


// ---------------- Search Filter ----------------
document.addEventListener("input", function (e) {
    if (e.target.id === "searchInput") {
        const filter = e.target.value.toLowerCase();
        document.querySelectorAll("#coin-body tr")
            .forEach(row => {
                row.style.display =
                    row.innerText.toLowerCase().includes(filter)
                        ? ""
                        : "none";
            });
    }
});


// ---------------- Initialize App ----------------
initChart();
refreshMarket();
loadHistory(selectedCoin);

setInterval(refreshMarket, 20000);
