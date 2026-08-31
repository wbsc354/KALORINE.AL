/**
 * NutriCal AI - Interactive Charts & Dynamic SVG Visualizations Module
 */

class ChartManager {
  /**
   * Pembaruan Ring Gauge Sisa Kalori Harian (SVG Circle Stroke Animation)
   */
  static updateCalorieGauge(caloriesEaten, targetCalories) {
    const progressEl = document.getElementById("gauge-progress-circle");
    const caloriesLeftEl = document.getElementById("gauge-calories-left");
    const eatenEl = document.getElementById("stat-calories-eaten");
    const targetEl = document.getElementById("stat-calories-target");

    if (!progressEl || !caloriesLeftEl) return;

    const remaining = targetCalories - caloriesEaten;
    const isOver = remaining < 0;

    caloriesLeftEl.innerText = Math.abs(remaining);
    caloriesLeftEl.style.color = isOver ? "var(--accent-red)" : "var(--text-primary)";

    const subtextEl = document.getElementById("gauge-subtext-label");
    if (subtextEl) {
      subtextEl.innerText = isOver ? "Kcal Kelebihan!" : "Kcal Tersisa";
      subtextEl.style.color = isOver ? "var(--accent-red)" : "var(--text-muted)";
    }

    if (eatenEl) eatenEl.innerText = `${caloriesEaten} kcal`;
    if (targetEl) targetEl.innerText = `${targetCalories} kcal`;

    // Calculate SVG Stroke Dash Offset (Total Circumference = 2 * PI * r = 2 * 3.14159 * 90 ≈ 565.48)
    const maxCircumference = 565;
    let percent = caloriesEaten / targetCalories;
    if (percent > 1) percent = 1;
    if (percent < 0) percent = 0;

    const strokeOffset = maxCircumference - (percent * maxCircumference);
    progressEl.style.strokeDashoffset = strokeOffset;
  }

  /**
   * Pembaruan Bar Makronutrisi (Carbs, Protein, Fat, Fiber)
   */
  static updateMacroBars(currentMacros, targetMacros) {
    const macros = [
      { key: 'carbs', current: currentMacros.carbs, target: targetMacros.targetCarbs },
      { key: 'protein', current: currentMacros.protein, target: targetMacros.targetProtein },
      { key: 'fat', current: currentMacros.fat, target: targetMacros.targetFat },
      { key: 'fiber', current: currentMacros.fiber, target: targetMacros.targetFiber }
    ];

    macros.forEach(macro => {
      const valEl = document.getElementById(`macro-val-${macro.key}`);
      const fillEl = document.getElementById(`macro-fill-${macro.key}`);

      if (valEl) {
        valEl.innerHTML = `${macro.current}g <span>/ ${macro.target}g</span>`;
      }

      if (fillEl) {
        let percent = (macro.current / macro.target) * 100;
        if (percent > 100) percent = 100;
        if (percent < 0) percent = 0;
        fillEl.style.width = `${percent}%`;
      }
    });
  }

  /**
   * Render Grafik Batang Histori 7 Hari Terakhir
   */
  static renderHistoryChart(containerId, historyData, targetCalories) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (!historyData || historyData.length === 0) {
      container.innerHTML = `<div class="empty-meal-placeholder">Belum ada data histori harian</div>`;
      return;
    }

    const maxVal = Math.max(targetCalories * 1.2, ...historyData.map(d => d.calories || 0));

    let html = `<div style="display: flex; align-items: flex-end; justify-content: space-between; height: 180px; gap: 12px; padding-top: 20px;">`;

    historyData.forEach(item => {
      const heightPercent = Math.min(100, Math.max(10, (item.calories / maxVal) * 100));
      const isOver = item.calories > targetCalories;
      const barColor = isOver ? 'linear-gradient(180deg, #EF4444, #991B1B)' : 'linear-gradient(180deg, #10B981, #047857)';

      html += `
        <div style="flex: 1; display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <span style="font-size: 0.75rem; font-weight: 700; color: ${isOver ? 'var(--accent-red)' : 'var(--text-secondary)'}">${item.calories}</span>
          <div style="width: 100%; max-width: 32px; background: var(--bg-tertiary); height: 120px; border-radius: 8px; display: flex; align-items: flex-end; overflow: hidden; position: relative;">
            <div style="width: 100%; height: ${heightPercent}%; background: ${barColor}; border-radius: 8px; transition: height 0.6s ease;"></div>
          </div>
          <span style="font-size: 0.75rem; font-weight: 600; color: var(--text-muted);">${item.dayName.substring(0, 3)}</span>
        </div>
      `;
    });

    html += `</div>`;
    container.innerHTML = html;
  }
}

window.ChartManager = ChartManager;
