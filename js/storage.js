/**
 * NutriCal AI - Storage & Data Persistence Module
 * Mengelola simpanan LocalStorage untuk Profil, Log Makanan Harian, dan Laporan Ekspor
 */

class StorageManager {
  constructor() {
    this.PROFILE_KEY = "nutrical_user_profile";
    this.DAILY_LOGS_KEY = "nutrical_daily_logs";
    this.THEME_KEY = "nutrical_theme_preference";
  }

  // --- USER PROFILE ---
  getDefaultProfile() {
    return {
      name: "Pengguna NutriCal",
      gender: "male",
      age: 26,
      weight: 70,
      height: 170,
      activityLevel: "moderate",
      goal: "lose-mild",
      updatedAt: new Date().toISOString()
    };
  }

  getProfile() {
    try {
      const stored = localStorage.getItem(this.PROFILE_KEY);
      return stored ? JSON.parse(stored) : this.getDefaultProfile();
    } catch (e) {
      console.error("Gagal mengambil profil dari storage", e);
      return this.getDefaultProfile();
    }
  }

  saveProfile(profileData) {
    try {
      const current = this.getProfile();
      const updated = { ...current, ...profileData, updatedAt: new Date().toISOString() };
      localStorage.setItem(this.PROFILE_KEY, JSON.stringify(updated));
      return updated;
    } catch (e) {
      console.error("Gagal menyimpan profil ke storage", e);
      return null;
    }
  }

  // --- DAILY LOGS ---
  getTodayString() {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  getAllLogs() {
    try {
      const stored = localStorage.getItem(this.DAILY_LOGS_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch (e) {
      console.error("Gagal mengambil logs dari storage", e);
      return {};
    }
  }

  getLogByDate(dateStr) {
    const logs = this.getAllLogs();
    if (!logs[dateStr]) {
      return {
        date: dateStr,
        sarapan: [],
        siang: [],
        malam: [],
        camilan: []
      };
    }
    return logs[dateStr];
  }

  addFoodToMeal(dateStr, mealCategory, foodItem, portionGram) {
    const logs = this.getAllLogs();
    if (!logs[dateStr]) {
      logs[dateStr] = {
        date: dateStr,
        sarapan: [],
        siang: [],
        malam: [],
        camilan: []
      };
    }

    const ratio = portionGram / (foodItem.servingGram || 100);
    const loggedEntry = {
      logId: "log-" + Date.now() + "-" + Math.random().toString(36).substr(2, 4),
      foodId: foodItem.id,
      name: foodItem.name,
      category: foodItem.category,
      portionGram: portionGram,
      calories: Math.round(foodItem.calories * ratio),
      carbs: parseFloat((foodItem.carbs * ratio).toFixed(1)),
      protein: parseFloat((foodItem.protein * ratio).toFixed(1)),
      fat: parseFloat((foodItem.fat * ratio).toFixed(1)),
      fiber: parseFloat((foodItem.fiber * ratio).toFixed(1)),
      timeLogged: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    if (!logs[dateStr][mealCategory]) {
      logs[dateStr][mealCategory] = [];
    }
    logs[dateStr][mealCategory].push(loggedEntry);

    try {
      localStorage.setItem(this.DAILY_LOGS_KEY, JSON.stringify(logs));
      return loggedEntry;
    } catch (e) {
      console.error("Gagal menambahkan makanan ke log", e);
      return null;
    }
  }

  removeFoodFromMeal(dateStr, mealCategory, logId) {
    const logs = this.getAllLogs();
    if (logs[dateStr] && logs[dateStr][mealCategory]) {
      logs[dateStr][mealCategory] = logs[dateStr][mealCategory].filter(entry => entry.logId !== logId);
      try {
        localStorage.setItem(this.DAILY_LOGS_KEY, JSON.stringify(logs));
        return true;
      } catch (e) {
        console.error("Gagal menghapus makanan dari log", e);
      }
    }
    return false;
  }

  calculateDayTotals(dateStr) {
    const dayLog = this.getLogByDate(dateStr);
    const totals = {
      calories: 0,
      carbs: 0,
      protein: 0,
      fat: 0,
      fiber: 0,
      sarapanCals: 0,
      siangCals: 0,
      malamCals: 0,
      camilanCals: 0
    };

    ['sarapan', 'siang', 'malam', 'camilan'].forEach(cat => {
      if (dayLog[cat] && Array.isArray(dayLog[cat])) {
        dayLog[cat].forEach(item => {
          totals.calories += item.calories || 0;
          totals.carbs += item.carbs || 0;
          totals.protein += item.protein || 0;
          totals.fat += item.fat || 0;
          totals.fiber += item.fiber || 0;

          if (cat === 'sarapan') totals.sarapanCals += item.calories || 0;
          if (cat === 'siang') totals.siangCals += item.calories || 0;
          if (cat === 'malam') totals.malamCals += item.calories || 0;
          if (cat === 'camilan') totals.camilanCals += item.calories || 0;
        });
      }
    });

    totals.carbs = parseFloat(totals.carbs.toFixed(1));
    totals.protein = parseFloat(totals.protein.toFixed(1));
    totals.fat = parseFloat(totals.fat.toFixed(1));
    totals.fiber = parseFloat(totals.fiber.toFixed(1));

    return totals;
  }

  // Ambil histori 7 hari terakhir
  getLast7DaysSummary() {
    const results = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const totals = this.calculateDayTotals(dateStr);
      
      const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
      results.push({
        date: dateStr,
        dayName: dayNames[d.getDay()],
        shortDate: (d.getMonth() + 1) + '/' + d.getDate(),
        ...totals
      });
    }

    return results;
  }

  // --- THEME PREFERENCE ---
  getTheme() {
    return localStorage.getItem(this.THEME_KEY) || 'dark';
  }

  setTheme(theme) {
    localStorage.setItem(this.THEME_KEY, theme);
    document.documentElement.setAttribute('data-theme', theme);
  }

  // --- DATA EXPORT / IMPORT ---
  exportCSV(dateStr) {
    const dayLog = this.getLogByDate(dateStr);
    let csv = "Waktu Makan,Nama Makanan,Kategori,Porsi (g),Kalori (kcal),Karbo (g),Protein (g),Lemak (g),Serat (g)\n";

    ['sarapan', 'siang', 'malam', 'camilan'].forEach(cat => {
      if (dayLog[cat]) {
        dayLog[cat].forEach(item => {
          csv += `"${cat.toUpperCase()}","${item.name}","${item.category}",${item.portionGram},${item.calories},${item.carbs},${item.protein},${item.fat},${item.fiber}\n`;
        });
      }
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `NutriCal_Laporan_${dateStr}.csv`;
    link.click();
  }

  exportJSON() {
    const data = {
      profile: this.getProfile(),
      logs: this.getAllLogs(),
      customFoods: window.foodDb ? window.foodDb.customFoods : []
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `NutriCal_Backup_${this.getTodayString()}.json`;
    link.click();
  }

  importJSON(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.profile) localStorage.setItem(this.PROFILE_KEY, JSON.stringify(parsed.profile));
      if (parsed.logs) localStorage.setItem(this.DAILY_LOGS_KEY, JSON.stringify(parsed.logs));
      if (parsed.customFoods) {
        localStorage.setItem("nutrical_custom_foods", JSON.stringify(parsed.customFoods));
        if (window.foodDb) window.foodDb.customFoods = parsed.customFoods;
      }
      return true;
    } catch (e) {
      console.error("Gagal mengimpor file JSON", e);
      return false;
    }
  }
}

window.storageManager = new StorageManager();
