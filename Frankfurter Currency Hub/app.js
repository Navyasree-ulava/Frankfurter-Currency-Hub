// Fetch currencies and populate dropdowns
async function fetchCurrencies() {
    const response = await fetch('https://api.frankfurter.app/currencies');
    const data = await response.json();
    const baseCurrency = document.getElementById('baseCurrency');
    const targetCurrency = document.getElementById('targetCurrency');
  
    for (const currency in data) {
      const option1 = document.createElement('option');
      option1.value = currency;
      option1.textContent = `${currency} - ${data[currency]}`;
      baseCurrency.appendChild(option1);
  
      const option2 = document.createElement('option');
      option2.value = currency;
      option2.textContent = `${currency} - ${data[currency]}`;
      targetCurrency.appendChild(option2);
    }
  }
  
  // Currency Conversion
  document.getElementById('convertBtn').addEventListener('click', async () => {
    const amount = document.getElementById('amount').value;
    const base = document.getElementById('baseCurrency').value;
    const target = document.getElementById('targetCurrency').value;
  
    if (!amount || amount <= 0) {
      alert("Please enter a valid amount!");
      return;
    }
  
    const response = await fetch(`https://api.frankfurter.app/latest?amount=${amount}&from=${base}&to=${target}`);
    const data = await response.json();
    const result = `${amount} ${base} = ${data.rates[target]} ${target}`;
    document.getElementById('conversionResult').textContent = result;
    document.getElementById('conversionResult').classList.add('fade-in');
  });
  
  // Fetch Historical Exchange Rates
  document.getElementById('fetchHistoryBtn').addEventListener('click', async () => {
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const base = document.getElementById('baseCurrency').value;
    const target = document.getElementById('targetCurrency').value;
  
    if (!startDate || !endDate) {
      alert("Please select both start and end dates!");
      return;
    }
  
    const response = await fetch(`https://api.frankfurter.app/${startDate}..${endDate}?from=${base}&to=${target}`);
    const data = await response.json();
    const tableBody = document.querySelector('#historyTable tbody');
    tableBody.innerHTML = '';
  
    for (const date in data.rates) {
      const row = document.createElement('tr');
      row.innerHTML = `<td>${date}</td><td>${data.rates[date][target]}</td>`;
      tableBody.appendChild(row);
    }
  
    // Render Chart
    renderChart(data);
  });
  
  // Render Chart
  function renderChart(data) {
    const ctx = document.getElementById('exchangeRateChart').getContext('2d');
    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: Object.keys(data.rates),
        datasets: [{
          label: 'Exchange Rate',
          data: Object.values(data.rates).map(rate => rate[Object.keys(rate)[0]]),
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
  
  // Dark Mode Toggle
  document.getElementById('darkModeToggle').addEventListener('click', () => {
    const body = document.body;
    body.classList.toggle('dark-mode');
  
    // Update button text
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (body.classList.contains('dark-mode')) {
      darkModeToggle.innerHTML = '<i class="fas fa-sun"></i> Light Mode';
    } else {
      darkModeToggle.innerHTML = '<i class="fas fa-moon"></i> Dark Mode';
    }
  
    // Save preference to localStorage
    const isDarkMode = body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
  });
  
  // Check for saved dark mode preference
  function checkDarkModePreference() {
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
      document.getElementById('darkModeToggle').innerHTML = '<i class="fas fa-sun"></i> Light Mode';
    }
  }
  
  // Initialize
  fetchCurrencies();
  checkDarkModePreference();