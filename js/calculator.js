/**
 * NutriCal AI - Calorie & BMR/TDEE Calculator Engine
 * Rumus Medis Medis Mifflin-St Jeor & Rekomendasi Distribusi Makronutrisi
 */

class CalorieCalculator {
  /**
   * Menghitung BMR (Basal Metabolic Rate) menggunakan Mifflin-St Jeor
   * @param {number} weight - dalam kg
   * @param {number} height - dalam cm
   * @param {number} age - dalam tahun
   * @param {string} gender - 'male' atau 'female'
   * @returns {number} BMR dalam kcal
   */
  static calculateBMR(weight, height, age, gender) {
    const w = parseFloat(weight);
    const h = parseFloat(height);
    const a = parseFloat(age);

    if (gender === 'male') {
      return (10 * w) + (6.25 * h) - (5 * a) + 5;
    } else {
      return (10 * w) + (6.25 * h) - (5 * a) - 161;
    }
  }

  /**
   * Menghitung TDEE (Total Daily Energy Expenditure)
   * @param {number} bmr 
   * @param {string} activityLevel - 'sedentary', 'light', 'moderate', 'active', 'extra'
   * @returns {number} TDEE dalam kcal
   */
  static calculateTDEE(bmr, activityLevel) {
    const multipliers = {
      sedentary: 1.2,      // Jarang / Tidak Pernah Olahraga
      light: 1.375,        // Olahraga Ringan (1-3 hari/minggu)
      moderate: 1.55,      // Olahraga Sedang (3-5 hari/minggu)
      active: 1.725,       // Olahraga Berat (6-7 hari/minggu)
      extra: 1.9           // Pekerja Fisik / Atlet Profesional
    };

    const factor = multipliers[activityLevel] || 1.2;
    return bmr * factor;
  }

  /**
   * Menghitung Target Kalori & Makronutrisi berdasarkan Tujuan Berat Badan
   * @param {Object} profile 
   * @returns {Object} Target Kebutuhan Nutrisi
   */
  static calculateTargets(profile) {
    const bmr = this.calculateBMR(profile.weight, profile.height, profile.age, profile.gender);
    const tdee = this.calculateTDEE(bmr, profile.activityLevel);

    let goalAdjustment = 0;
    switch (profile.goal) {
      case 'lose-fast':
        goalAdjustment = -750; // Turun ~0.75 kg/minggu
        break;
      case 'lose':
        goalAdjustment = -500; // Turun ~0.5 kg/minggu
        break;
      case 'lose-mild':
        goalAdjustment = -250; // Turun ~0.25 kg/minggu
        break;
      case 'gain':
        goalAdjustment = 500;  // Naik ~0.5 kg/minggu
        break;
      case 'gain-mild':
        goalAdjustment = 250;  // Naik ~0.25 kg/minggu
        break;
      case 'maintain':
      default:
        goalAdjustment = 0;
        break;
    }

    // Batas minimum kalori aman (1200 kcal wanita, 1500 kcal pria)
    const minSafeCalories = profile.gender === 'male' ? 1500 : 1200;
    let targetCalories = Math.round(tdee + goalAdjustment);
    if (targetCalories < minSafeCalories) {
      targetCalories = minSafeCalories;
    }

    // Makronutrisi standar seimbang (50% Karbo, 25% Protein, 25% Lemak)
    // 1g Karbo = 4 kcal, 1g Protein = 4 kcal, 1g Lemak = 9 kcal
    const targetCarbs = Math.round((targetCalories * 0.50) / 4);
    const targetProtein = Math.round((targetCalories * 0.25) / 4);
    const targetFat = Math.round((targetCalories * 0.25) / 9);
    // Serat disarankan ~14g per 1000 kcal
    const targetFiber = Math.round((targetCalories / 1000) * 14);

    return {
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      targetCalories: targetCalories,
      targetCarbs: targetCarbs,
      targetProtein: targetProtein,
      targetFat: targetFat,
      targetFiber: targetFiber
    };
  }
}

window.CalorieCalculator = CalorieCalculator;
