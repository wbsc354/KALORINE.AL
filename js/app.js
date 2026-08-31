/**
 * NutriCal AI - Main Application Controller
 * Mengintegrasikan Database, Kalkulator, Storage, Visualisasi & AI Scanner
 */

class AppController {
  constructor() {
    this.selectedDate = window.storageManager.getTodayString();
    this.activeTab = "dashboard";
    this.selectedMealForAdd = "sarapan";
    this.selectedFoodForPortion = null;
  }

  init() {
    console.log("NutriCal AI Inisialisasi...");

    // Set theme
    const savedTheme = window.storageManager.getTheme();
    window.storageManager.setTheme(savedTheme);

    // Set date input value
    const dateInput = document.getElementById("log-date-picker");
    if (dateInput) {
      dateInput.value = this.selectedDate;
      dateInput.addEventListener("change", (e) => {
        this.selectedDate = e.target.value;
        this.renderDashboard();
      });
    }

    // Initialize AI Scanner
    window.aiScanner.initSampleGallery("ai-sample-gallery-box");

    // Initialize Event Listeners
    this.setupEventListeners();

    // Render Initial View
    this.renderUserProfileHeader();
    this.renderDashboard();
    this.renderFoodDatabase();
    this.renderProfileForm();
  }

  setupEventListeners() {
    // Navigation Tabs (Desktop & Mobile)
    document.querySelectorAll(".nav-item, .mobile-nav-item").forEach((item) => {
      item.addEventListener("click", (e) => {
        const targetTab = item.getAttribute("data-tab");
        if (targetTab) {
          this.switchTab(targetTab);
        }
      });
    });

    // Theme Switcher Toggle
    const themeBtn = document.getElementById("theme-toggle-btn");
    if (themeBtn) {
      themeBtn.addEventListener("click", () => {
        const currentTheme = window.storageManager.getTheme();
        const nextTheme = currentTheme === "dark" ? "light" : "dark";
        window.storageManager.setTheme(nextTheme);
        this.showToast(`Mode tampilan diubah ke ${nextTheme.toUpperCase()}`);
      });
    }

    // Search & Category Filter for Food Database
    const searchInput = document.getElementById("db-search-input");
    const categorySelect = document.getElementById("db-category-select");

    if (searchInput) {
      searchInput.addEventListener("input", () => this.renderFoodDatabase());
    }
    if (categorySelect) {
      categorySelect.addEventListener("change", () => this.renderFoodDatabase());
    }

    // Profile BMR Form submit
    const profileForm = document.getElementById("user-profile-form");
    if (profileForm) {
      profileForm.addEventListener("submit", (e) => {
        e.preventDefault();
        this.handleSaveProfile();
      });
    }

    // Custom Food Form submit
    const customFoodForm = document.getElementById("custom-food-form");
    if (customFoodForm) {
      customFoodForm.addEventListener("submit", (e) => {
        e.preventDefault();
        this.handleSaveCustomFood();
      });
    }
  }

  switchTab(tabId) {
    this.activeTab = tabId;

    // Update nav item active states
    document.querySelectorAll(".nav-item, .mobile-nav-item").forEach((el) => {
      el.classList.remove("active");
      if (el.getAttribute("data-tab") === tabId) {
        el.classList.add("active");
      }
    });

    // Update section active views
    document.querySelectorAll(".view-section").forEach((sec) => {
      sec.classList.remove("active");
    });

    const targetSec = document.getElementById(`view-${tabId}`);
    if (targetSec) {
      targetSec.classList.add("active");
    }

    // Tab specific renders
    if (tabId === "dashboard" || tabId === "tracker") {
      this.renderDashboard();
    } else if (tabId === "database") {
      this.renderFoodDatabase();
    } else if (tabId === "history") {
      this.renderHistoryAndAnalytics();
    } else if (tabId === "profile") {
      this.renderProfileForm();
    }
  }

  renderUserProfileHeader() {
    const profile = window.storageManager.getProfile();
    const targets = window.CalorieCalculator.calculateTargets(profile);

    const nameEl = document.getElementById("header-user-name");
    const targetEl = document.getElementById("header-user-target");

    if (nameEl) nameEl.innerText = profile.name || "Pengguna NutriCal";
    if (targetEl) targetEl.innerText = `Target: ${targets.targetCalories} kcal / hari`;
  }

  renderDashboard() {
    const profile = window.storageManager.getProfile();
    const targets = window.CalorieCalculator.calculateTargets(profile);
    const dayTotals = window.storageManager.calculateDayTotals(this.selectedDate);

    // Update Gauge and Macro progress bars
    window.ChartManager.updateCalorieGauge(dayTotals.calories, targets.targetCalories);
    window.ChartManager.updateMacroBars(dayTotals, targets);

    // Render Food Logs per meal
    const meals = ['sarapan', 'siang', 'malam', 'camilan'];
    const dayLog = window.storageManager.getLogByDate(this.selectedDate);

    meals.forEach((meal) => {
      const container = document.getElementById(`logged-list-${meal}`);
      const totalCalEl = document.getElementById(`meal-total-${meal}`);

      if (totalCalEl) {
        let mealCal = 0;
        if (dayLog[meal]) {
          mealCal = dayLog[meal].reduce((sum, item) => sum + item.calories, 0);
        }
        totalCalEl.innerHTML = `Total: <strong>${mealCal} kcal</strong>`;
      }

      if (container) {
        if (!dayLog[meal] || dayLog[meal].length === 0) {
          container.innerHTML = `<div class="empty-meal-placeholder"><i class="ri-restaurant-line"></i> Belum ada makanan dicatat</div>`;
        } else {
          let html = "";
          dayLog[meal].forEach((item) => {
            html += `
              <div class="food-item-row">
                <div class="food-item-info">
                  <span class="food-item-name">${item.name}</span>
                  <div class="food-item-details">
                    <span>${item.portionGram}g</span> • 
                    <span>${item.calories} kcal</span> • 
                    <span style="color: var(--text-muted);">${item.timeLogged || ''}</span>
                  </div>
                </div>
                <div class="food-item-actions">
                  <div class="food-item-macros">
                    <span class="macro-badge c">K: ${item.carbs}g</span>
                    <span class="macro-badge p">P: ${item.protein}g</span>
                    <span class="macro-badge f">L: ${item.fat}g</span>
                  </div>
                  <button class="btn-del-food" onclick="window.appController.handleDeleteLoggedFood('${meal}', '${item.logId}')" title="Hapus">
                    <i class="ri-delete-bin-line"></i>
                  </button>
                </div>
              </div>
            `;
          });
          container.innerHTML = html;
        }
      }
    });
  }

  // --- DATABASE & FOOD ADDITION ---
  renderFoodDatabase() {
    const searchInput = document.getElementById("db-search-input");
    const categorySelect = document.getElementById("db-category-select");

    const query = searchInput ? searchInput.value : "";
    const category = categorySelect ? categorySelect.value : "all";

    // Update categories select dropdown if empty
    if (categorySelect && categorySelect.options.length <= 1) {
      const cats = window.foodDb.getCategories();
      let optionsHtml = `<option value="all">Semua Kategori</option>`;
      cats.forEach(c => {
        if (c !== 'all') optionsHtml += `<option value="${c}">${c}</option>`;
      });
      categorySelect.innerHTML = optionsHtml;
    }

    const filtered = window.foodDb.searchFoods(query, category);
    const grid = document.getElementById("food-db-grid-container");

    if (!grid) return;

    if (filtered.length === 0) {
      grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-muted);">Tidak ada makanan ditemukan. Coba cari kata kunci lain atau buat makanan kustom.</div>`;
      return;
    }

    let html = "";
    filtered.forEach((food) => {
      html += `
        <div class="food-card-db">
          <div>
            <div class="food-card-header">
              <span class="food-name-db">${food.name}</span>
              <span class="food-cat-badge">${food.category}</span>
            </div>
            <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 12px;">Takaran Acuan: ${food.servingUnit}</p>
            
            <div class="food-nutrients-preview">
              <div>
                <span class="nut-val" style="color: var(--accent-emerald);">${food.calories}</span>
                <span class="nut-lbl">kcal</span>
              </div>
              <div>
                <span class="nut-val" style="color: var(--macro-carbs);">${food.carbs}g</span>
                <span class="nut-lbl">Karbo</span>
              </div>
              <div>
                <span class="nut-val" style="color: var(--macro-protein);">${food.protein}g</span>
                <span class="nut-lbl">Protein</span>
              </div>
              <div>
                <span class="nut-val" style="color: var(--macro-fat);">${food.fat}g</span>
                <span class="nut-lbl">Lemak</span>
              </div>
            </div>
          </div>

          <div style="display: flex; gap: 8px;">
            <button class="btn-primary" style="flex: 1; padding: 8px 12px; font-size: 0.85rem;" onclick="window.appController.openAddPortionModal('${food.id}')">
              <i class="ri-add-line"></i> Catat Makanan
            </button>
            ${food.isCustom ? `
              <button class="btn-del-food" style="background: rgba(239,68,68,0.1); color: var(--accent-red); padding: 8px 12px;" onclick="window.appController.handleDeleteCustomFood('${food.id}')" title="Hapus Custom Food">
                <i class="ri-delete-bin-line"></i>
              </button>
            ` : ''}
          </div>
        </div>
      `;
    });

    grid.innerHTML = html;
  }

  // Modal Porsi Makanan
  openAddPortionModal(foodId, targetMealCategory = "sarapan") {
    const all = window.foodDb.getAllFoods();
    const food = all.find(f => f.id === foodId);
    if (!food) return;

    this.selectedFoodForPortion = food;
    this.selectedMealForAdd = targetMealCategory;

    const modal = document.getElementById("modal-add-portion");
    const nameEl = document.getElementById("modal-food-title");
    const gramInput = document.getElementById("modal-portion-gram");
    const mealSelect = document.getElementById("modal-meal-category-select");

    if (nameEl) nameEl.innerText = food.name;
    if (gramInput) gramInput.value = food.servingGram || 100;
    if (mealSelect) mealSelect.value = targetMealCategory;

    this.updatePortionPreview();

    if (modal) modal.classList.add("active");
  }

  updatePortionPreview() {
    if (!this.selectedFoodForPortion) return;
    const food = this.selectedFoodForPortion;

    const gramInput = document.getElementById("modal-portion-gram");
    const gram = parseFloat(gramInput.value) || 100;

    const ratio = gram / (food.servingGram || 100);
    const cal = Math.round(food.calories * ratio);
    const carbs = (food.carbs * ratio).toFixed(1);
    const protein = (food.protein * ratio).toFixed(1);
    const fat = (food.fat * ratio).toFixed(1);

    const prevEl = document.getElementById("modal-portion-calc-preview");
    if (prevEl) {
      prevEl.innerHTML = `
        <strong>Estimasi Total: ${cal} kcal</strong><br/>
        <span style="font-size: 0.8rem; color: var(--text-muted);">Karbo: ${carbs}g • Protein: ${protein}g • Lemak: ${fat}g</span>
      `;
    }
  }

  confirmAddFoodLog() {
    if (!this.selectedFoodForPortion) return;

    const gramInput = document.getElementById("modal-portion-gram");
    const mealSelect = document.getElementById("modal-meal-category-select");

    const portionGram = parseFloat(gramInput.value) || 100;
    const mealCategory = mealSelect.value;

    const logged = window.storageManager.addFoodToMeal(this.selectedDate, mealCategory, this.selectedFoodForPortion, portionGram);
    
    if (logged) {
      this.closeModals();
      this.showToast(`Berhasil mencatat ${logged.name} (${logged.calories} kcal)`);
      this.renderDashboard();
    }
  }

  handleDeleteLoggedFood(mealCategory, logId) {
    if (confirm("Hapus makanan ini dari catatan harian?")) {
      const removed = window.storageManager.removeFoodFromMeal(this.selectedDate, mealCategory, logId);
      if (removed) {
        this.showToast("Makanan berhasil dihapus dari catatan.");
        this.renderDashboard();
      }
    }
  }

  handleDeleteCustomFood(foodId) {
    if (confirm("Hapus makanan kustom ini dari database?")) {
      window.foodDb.deleteCustomFood(foodId);
      this.showToast("Makanan kustom berhasil dihapus.");
      this.renderFoodDatabase();
    }
  }

  // --- CUSTOM FOOD ---
  openCustomFoodModal() {
    const modal = document.getElementById("modal-custom-food");
    if (modal) modal.classList.add("active");
  }

  handleSaveCustomFood() {
    const name = document.getElementById("cust-food-name").value;
    const category = document.getElementById("cust-food-cat").value;
    const gram = document.getElementById("cust-food-gram").value;
    const calories = document.getElementById("cust-food-calories").value;
    const carbs = document.getElementById("cust-food-carbs").value;
    const protein = document.getElementById("cust-food-protein").value;
    const fat = document.getElementById("cust-food-fat").value;
    const fiber = document.getElementById("cust-food-fiber").value;

    const newFood = window.foodDb.addCustomFood({
      name, category, servingGram: gram, calories, carbs, protein, fat, fiber
    });

    if (newFood) {
      this.closeModals();
      this.showToast(`Makanan kustom "${name}" berhasil ditambahkan!`);
      this.renderFoodDatabase();
    }
  }

  // --- PROFILE BMR FORM ---
  renderProfileForm() {
    const profile = window.storageManager.getProfile();
    const targets = window.CalorieCalculator.calculateTargets(profile);

    const form = document.getElementById("user-profile-form");
    if (!form) return;

    document.getElementById("prof-name").value = profile.name || "";
    document.getElementById("prof-gender").value = profile.gender || "male";
    document.getElementById("prof-age").value = profile.age || 25;
    document.getElementById("prof-weight").value = profile.weight || 70;
    document.getElementById("prof-height").value = profile.height || 170;
    document.getElementById("prof-activity").value = profile.activityLevel || "moderate";
    document.getElementById("prof-goal").value = profile.goal || "lose-mild";

    // Update Live Calculation Card
    const calcOutput = document.getElementById("bmr-tdee-live-calc");
    if (calcOutput) {
      calcOutput.innerHTML = `
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; background: var(--bg-glass); padding: 16px; border-radius: var(--radius-lg); text-align: center; border: 1px solid var(--border-color);">
          <div>
            <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 600;">BMR (Basal Metabolic)</span>
            <p style="font-size: 1.4rem; font-weight: 800; color: var(--accent-blue);">${targets.bmr} kcal</p>
          </div>
          <div>
            <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 600;">TDEE (Aktivitas Harian)</span>
            <p style="font-size: 1.4rem; font-weight: 800; color: var(--accent-purple);">${targets.tdee} kcal</p>
          </div>
          <div>
            <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 600;">Target Kalori Harian</span>
            <p style="font-size: 1.4rem; font-weight: 800; color: var(--accent-emerald);">${targets.targetCalories} kcal</p>
          </div>
        </div>
      `;
    }
  }

  handleSaveProfile() {
    const updatedData = {
      name: document.getElementById("prof-name").value,
      gender: document.getElementById("prof-gender").value,
      age: parseFloat(document.getElementById("prof-age").value),
      weight: parseFloat(document.getElementById("prof-weight").value),
      height: parseFloat(document.getElementById("prof-height").value),
      activityLevel: document.getElementById("prof-activity").value,
      goal: document.getElementById("prof-goal").value
    };

    window.storageManager.saveProfile(updatedData);
    this.renderUserProfileHeader();
    this.renderProfileForm();
    this.renderDashboard();
    this.showToast("Profil & Target Kalori Harian Berhasil Diperbarui!");
  }

  // --- HISTORY & REPORTS ---
  renderHistoryAndAnalytics() {
    const profile = window.storageManager.getProfile();
    const targets = window.CalorieCalculator.calculateTargets(profile);
    const history = window.storageManager.getLast7DaysSummary();

    window.ChartManager.renderHistoryChart("history-chart-box", history, targets.targetCalories);
  }

  exportCSVReport() {
    window.storageManager.exportCSV(this.selectedDate);
    this.showToast(`Laporan CSV (${this.selectedDate}) berhasil diunduh!`);
  }

  exportBackupJSON() {
    window.storageManager.exportJSON();
    this.showToast("Backup Data JSON berhasil diunduh!");
  }

  importBackupJSON(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const success = window.storageManager.importJSON(e.target.result);
      if (success) {
        this.showToast("Data berhasil dipulihkan dari backup JSON!");
        this.init();
      } else {
        alert("File backup tidak valid.");
      }
    };
    reader.readAsText(file);
  }

  // --- MODALS & TOASTS ---
  closeModals() {
    document.querySelectorAll(".modal-backdrop").forEach(m => m.classList.remove("active"));
  }

  showToast(message) {
    const container = document.getElementById("toast-container");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerHTML = `<i class="ri-checkbox-circle-fill" style="color: var(--accent-emerald); font-size: 1.2rem;"></i> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateX(100%)";
      toast.style.transition = "0.3s ease";
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  window.appController = new AppController();
  window.appController.init();
});
