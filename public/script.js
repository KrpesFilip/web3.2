document.addEventListener("DOMContentLoaded", function () {
    fetch("weather_Small.csv")
      .then(response => response.text())
      .then(csv => {
        const rezultat = Papa.parse(csv, {
          header: true,
          skipEmptyLines: true,
          transformHeader: h => h.trim()
        });
        console.log("Parsed result:", rezultat.data);
  
        const weatherData = rezultat.data.slice(0, 10).map(entry => ({
          ID: entry["ID"],
          Temperature: parseFloat(entry["Temperature"]),
          Humidity: parseFloat(entry["Humidity"]),
          Wind_Speed: parseFloat(entry["Wind Speed"]),
          Precipitation: parseFloat(entry["Precipitation (%)"]),
          Cloud_Cover: entry["Cloud Cover"],
          Atmospheric_Pressure: parseFloat(entry["Atmospheric Pressure"]),
          UV_Index: parseInt(entry["UV Index"]),
          Season: entry["Season"],
          Visibility: parseFloat(entry["Visibility (km)"]),
          Location: entry["Location"],
          Weather_Type: entry["Weather Type"]
        }));
  
        renderTable(weatherData);
        setupFilters(weatherData);
      })
      .catch(error => {
        document.getElementById("table-container").textContent = "Error loading CSV.";
        console.error("Fetch error:", error);
      });
  });
  
  let cart = [];
  
  function setupFilters(weatherData) {
    const seasonSelect = document.getElementById("season");
    const minTempSlider = document.getElementById("min-temp");
    const maxTempSlider = document.getElementById("max-temp");
    const minTempValue = document.getElementById("min-temp-value");
    const maxTempValue = document.getElementById("max-temp-value");
  
    // Initialize temperature values
    minTempValue.textContent = `${minTempSlider.value}°C`;
    maxTempValue.textContent = `${maxTempSlider.value}°C`;
  
    // Temperature Sliders (Min and Max)
    minTempSlider.addEventListener("input", () => {
      minTempValue.textContent = `${minTempSlider.value}°C`;
      const filteredData = applyFilters(weatherData);
      renderTable(filteredData);
    });
  
    maxTempSlider.addEventListener("input", () => {
      maxTempValue.textContent = `${maxTempSlider.value}°C`;
      const filteredData = applyFilters(weatherData);
      renderTable(filteredData);
    });
  
    // Season Dropdown Filter Logic
    seasonSelect.addEventListener("change", () => {
      const filteredData = applyFilters(weatherData);
      renderTable(filteredData);
    });
  }
  
  function applyFilters(data) {
    const seasonSelect = document.getElementById("season");
    const selectedSeason = seasonSelect.value;
    const minTemp = parseFloat(document.getElementById("min-temp").value);
    const maxTemp = parseFloat(document.getElementById("max-temp").value);
  
    let filteredData = data;
  
    // Filter by season if selected
    if (selectedSeason) {
      filteredData = filteredData.filter(entry => entry["Season"] === selectedSeason);
    }
  
    // Filter by temperature range
    filteredData = filteredData.filter(entry => {
      const temp = parseFloat(entry["Temperature"]);
      return temp >= minTemp && temp <= maxTemp;
    });
  
    return filteredData;
  }
  
  function renderTable(data) {
    const container = document.getElementById("table-container");
  
    if (data.length === 0) {
      container.textContent = "No data found.";
      return;
    }
  
    const table = document.createElement("table");
    table.classList.add("weatherTable");
  
    // Create header
    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");
    Object.keys(data[0]).forEach(header => {
      const th = document.createElement("th");
      th.textContent = header.replaceAll("_", " ");
      headerRow.appendChild(th);
    });
    headerRow.appendChild(document.createElement("th")).textContent = "Actions";  // Add Action column
    thead.appendChild(headerRow);
    table.appendChild(thead);
  
    // Create body
    const tbody = document.createElement("tbody");
    data.forEach(row => {
      const tr = document.createElement("tr");
      Object.values(row).forEach(cell => {
        const td = document.createElement("td");
        td.textContent = Array.isArray(cell) ? cell.join(", ") : cell;
        tr.appendChild(td);
      });
  
      // Add "Add to Cart" button
      const addButton = document.createElement("button");
      addButton.textContent = "Add to Cart";
      addButton.onclick = () => addToCart(row);
  
      const actionTd = document.createElement("td");
      actionTd.appendChild(addButton);
      tr.appendChild(actionTd);
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
  
    container.innerHTML = "";
    container.appendChild(table);
  }
  
  function addToCart(item) {
    cart.push(item);
    updateCart();
  }
  
  function updateCart() {
    const cartItemsContainer = document.getElementById("cart-items");
    cartItemsContainer.innerHTML = ""; // Clear previous items
  
    cart.forEach((item, index) => {
      const cartItemDiv = document.createElement("div");
      cartItemDiv.textContent = `${item.ID} - ${item.Weather_Type} - ${item.Temperature}°C`;
  
      const removeButton = document.createElement("button");
      removeButton.textContent = "Remove";
      removeButton.classList.add("remove-from-cart");
      removeButton.onclick = () => removeFromCart(index);
  
      cartItemDiv.appendChild(removeButton);
      cartItemsContainer.appendChild(cartItemDiv);
    });
  
    const confirmButton = document.getElementById("confirm-cart");
    confirmButton.disabled = cart.length === 0;
  }
  
  function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
  }
  
  document.getElementById("confirm-cart").onclick = function () {
    alert("Cart confirmed! Thank you for your selection.");
  };
  
  // Toggle cart visibility
  document.getElementById("cart-toggle-button").onclick = function () {
    document.getElementById("cart").classList.toggle("show");
  };
  