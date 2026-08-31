/**
 * NutriCal AI - Food Database Module
 * Database Makanan Khas Indonesia & Makanan Internasional dengan Rincian Makronutrisi
 */

const DEFAULT_FOOD_DATABASE = [
  // --- MAKANAN INDONESIA ---
  {
    id: "ind-01",
    name: "Nasi Goreng Spesial + Telur",
    category: "Makanan Indonesia",
    servingUnit: "1 porsi (250g)",
    servingGram: 250,
    calories: 450,
    carbs: 58.0,
    protein: 14.5,
    fat: 18.0,
    fiber: 2.5,
    isCustom: false
  },
  {
    id: "ind-02",
    name: "Rendang Daging Sapi",
    category: "Makanan Indonesia",
    servingUnit: "1 potong (100g)",
    servingGram: 100,
    calories: 275,
    carbs: 7.5,
    protein: 22.0,
    fat: 17.5,
    fiber: 1.2,
    isCustom: false
  },
  {
    id: "ind-03",
    name: "Ayam Goreng Dada",
    category: "Makanan Indonesia",
    servingUnit: "1 potong (120g)",
    servingGram: 120,
    calories: 290,
    carbs: 2.0,
    protein: 31.0,
    fat: 17.0,
    fiber: 0.0,
    isCustom: false
  },
  {
    id: "ind-04",
    name: "Sate Ayam (10 Tusuk + Bumbu Kacang)",
    category: "Makanan Indonesia",
    servingUnit: "10 tusuk (200g)",
    servingGram: 200,
    calories: 420,
    carbs: 18.0,
    protein: 28.0,
    fat: 26.0,
    fiber: 2.0,
    isCustom: false
  },
  {
    id: "ind-05",
    name: "Soto Ayam Lamongan",
    category: "Makanan Indonesia",
    servingUnit: "1 mangkuk (300g)",
    servingGram: 300,
    calories: 310,
    carbs: 22.0,
    protein: 20.0,
    fat: 15.0,
    fiber: 1.8,
    isCustom: false
  },
  {
    id: "ind-06",
    name: "Tempe Goreng Tepung",
    category: "Makanan Indonesia",
    servingUnit: "2 potong (80g)",
    servingGram: 80,
    calories: 160,
    carbs: 12.0,
    protein: 8.0,
    fat: 9.5,
    fiber: 3.5,
    isCustom: false
  },
  {
    id: "ind-07",
    name: "Tahu Goreng Crispy",
    category: "Makanan Indonesia",
    servingUnit: "3 potong (90g)",
    servingGram: 90,
    calories: 135,
    carbs: 6.0,
    protein: 9.0,
    fat: 8.5,
    fiber: 1.5,
    isCustom: false
  },
  {
    id: "ind-08",
    name: "Gado-Gado Bumbu Kacang",
    category: "Makanan Indonesia",
    servingUnit: "1 porsi (250g)",
    servingGram: 250,
    calories: 340,
    carbs: 38.0,
    protein: 15.0,
    fat: 16.0,
    fiber: 6.5,
    isCustom: false
  },
  {
    id: "ind-09",
    name: "Telur Dadar Goreng",
    category: "Makanan Indonesia",
    servingUnit: "1 butir (60g)",
    servingGram: 60,
    calories: 110,
    carbs: 0.8,
    protein: 7.0,
    fat: 9.0,
    fiber: 0.0,
    isCustom: false
  },
  {
    id: "ind-10",
    name: "Bakso Sapi Kuah Lengkap",
    category: "Makanan Indonesia",
    servingUnit: "1 porsi (350g)",
    servingGram: 350,
    calories: 380,
    carbs: 42.0,
    protein: 22.0,
    fat: 14.0,
    fiber: 2.0,
    isCustom: false
  },
  {
    id: "ind-11",
    name: "Nasi Putih",
    category: "Makanan Indonesia",
    servingUnit: "1 centong (100g)",
    servingGram: 100,
    calories: 130,
    carbs: 28.0,
    protein: 2.7,
    fat: 0.3,
    fiber: 0.4,
    isCustom: false
  },
  {
    id: "ind-12",
    name: "Martabak Telur Daging",
    category: "Makanan Indonesia",
    servingUnit: "2 potong (150g)",
    servingGram: 150,
    calories: 410,
    carbs: 24.0,
    protein: 16.0,
    fat: 28.0,
    fiber: 1.0,
    isCustom: false
  },
  {
    id: "ind-13",
    name: "Bubur Ayam Komplit",
    category: "Makanan Indonesia",
    servingUnit: "1 mangkuk (300g)",
    servingGram: 300,
    calories: 290,
    carbs: 45.0,
    protein: 12.0,
    fat: 7.0,
    fiber: 1.5,
    isCustom: false
  },
  {
    id: "ind-14",
    name: "Pempek Kapal Selam",
    category: "Makanan Indonesia",
    servingUnit: "1 buah (180g)",
    servingGram: 180,
    calories: 330,
    carbs: 48.0,
    protein: 14.0,
    fat: 9.0,
    fiber: 1.0,
    isCustom: false
  },

  // --- MAKANAN INTERNASIONAL / SEHAT ---
  {
    id: "int-01",
    name: "Dada Ayam Panggang (Grilled Chicken Breast)",
    category: "Unggas & Daging",
    servingUnit: "1 potong (150g)",
    servingGram: 150,
    calories: 248,
    carbs: 0.0,
    protein: 46.5,
    fat: 5.4,
    fiber: 0.0,
    isCustom: false
  },
  {
    id: "int-02",
    name: "Ikan Salmon Panggang",
    category: "Seafood",
    servingUnit: "1 fillet (150g)",
    servingGram: 150,
    calories: 310,
    carbs: 0.0,
    protein: 34.0,
    fat: 18.0,
    fiber: 0.0,
    isCustom: false
  },
  {
    id: "int-03",
    name: "Oatmeal Instan dengan Susu",
    category: "Sarapan Sehat",
    servingUnit: "1 mangkuk (200g)",
    servingGram: 200,
    calories: 220,
    carbs: 38.0,
    protein: 8.5,
    fat: 4.5,
    fiber: 4.0,
    isCustom: false
  },
  {
    id: "int-04",
    name: "Alpukat Segar",
    category: "Buah & Sayur",
    servingUnit: "1/2 buah (100g)",
    servingGram: 100,
    calories: 160,
    carbs: 8.5,
    protein: 2.0,
    fat: 14.7,
    fiber: 6.7,
    isCustom: false
  },
  {
    id: "int-05",
    name: "Telur Rebus",
    category: "Protein",
    servingUnit: "1 butir (50g)",
    servingGram: 50,
    calories: 78,
    carbs: 0.6,
    protein: 6.3,
    fat: 5.3,
    fiber: 0.0,
    isCustom: false
  },
  {
    id: "int-06",
    name: "Roti Gandum Utuh (Whole Wheat)",
    category: "Karbohidrat",
    servingUnit: "2 lembar (70g)",
    servingGram: 70,
    calories: 160,
    carbs: 28.0,
    protein: 8.0,
    fat: 2.0,
    fiber: 4.0,
    isCustom: false
  },
  {
    id: "int-07",
    name: "Greek Yogurt Low Fat",
    category: "Produk Olahan Susu",
    servingUnit: "1 cup (170g)",
    servingGram: 170,
    calories: 130,
    carbs: 6.0,
    protein: 17.0,
    fat: 3.5,
    fiber: 0.0,
    isCustom: false
  },
  {
    id: "int-08",
    name: "Salad Sayur dengan Olive Oil",
    category: "Buah & Sayur",
    servingUnit: "1 porsi (180g)",
    servingGram: 180,
    calories: 140,
    carbs: 10.0,
    protein: 3.0,
    fat: 10.0,
    fiber: 4.5,
    isCustom: false
  },
  {
    id: "int-09",
    name: "Pisang Cavendish",
    category: "Buah & Sayur",
    servingUnit: "1 buah sedang (120g)",
    servingGram: 120,
    calories: 105,
    carbs: 27.0,
    protein: 1.3,
    fat: 0.4,
    fiber: 3.1,
    isCustom: false
  },
  {
    id: "int-10",
    name: "Susu Sapi UHT Low Fat",
    category: "Minuman",
    servingUnit: "1 gelas (250ml)",
    servingGram: 250,
    calories: 125,
    carbs: 12.0,
    protein: 8.5,
    fat: 4.5,
    fiber: 0.0,
    isCustom: false
  }
];

class FoodDatabase {
  constructor() {
    this.customFoods = this.loadCustomFoods();
  }

  loadCustomFoods() {
    try {
      const stored = localStorage.getItem("nutrical_custom_foods");
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error("Gagal membaca custom foods dari localStorage", e);
      return [];
    }
  }

  saveCustomFoods() {
    try {
      localStorage.setItem("nutrical_custom_foods", JSON.stringify(this.customFoods));
    } catch (e) {
      console.error("Gagal menyimpan custom foods ke localStorage", e);
    }
  }

  getAllFoods() {
    return [...DEFAULT_FOOD_DATABASE, ...this.customFoods];
  }

  addCustomFood(food) {
    const newFood = {
      id: "cust-" + Date.now(),
      name: food.name,
      category: food.category || "Makanan Kustom",
      servingUnit: food.servingUnit || "1 porsi",
      servingGram: parseFloat(food.servingGram) || 100,
      calories: parseFloat(food.calories) || 0,
      carbs: parseFloat(food.carbs) || 0,
      protein: parseFloat(food.protein) || 0,
      fat: parseFloat(food.fat) || 0,
      fiber: parseFloat(food.fiber) || 0,
      isCustom: true
    };
    this.customFoods.unshift(newFood);
    this.saveCustomFoods();
    return newFood;
  }

  deleteCustomFood(id) {
    this.customFoods = this.customFoods.filter(item => item.id !== id);
    this.saveCustomFoods();
  }

  searchFoods(query = "", category = "all") {
    const all = this.getAllFoods();
    const q = query.toLowerCase().trim();

    return all.filter(food => {
      const matchQuery = !q || food.name.toLowerCase().includes(q) || food.category.toLowerCase().includes(q);
      const matchCategory = category === "all" || food.category === category;
      return matchQuery && matchCategory;
    });
  }

  getCategories() {
    const all = this.getAllFoods();
    const cats = new Set(all.map(f => f.category));
    return ["all", ...Array.from(cats)];
  }
}

window.foodDb = new FoodDatabase();
