/**
 * NutriCal AI - AI Food Scanner Simulator Engine
 * Visual Scanning Effect, Image Analysis Simulation & Auto-Detection Breakdown
 */

const AI_SAMPLE_FOODS = [
  {
    id: "ai-sample-1",
    name: "Nasi Goreng Spesial + Telur Ceplok",
    confidence: "98.4%",
    imgUrl: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600&auto=format&fit=crop&q=80",
    portionGram: 250,
    calories: 450,
    carbs: 58.0,
    protein: 14.5,
    fat: 18.0,
    fiber: 2.5,
    suggestedMeal: "siang"
  },
  {
    id: "ai-sample-2",
    name: "Dada Ayam Panggang & Sayur Brokoli",
    confidence: "99.1%",
    imgUrl: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=600&auto=format&fit=crop&q=80",
    portionGram: 200,
    calories: 280,
    carbs: 6.0,
    protein: 48.0,
    fat: 6.5,
    fiber: 3.2,
    suggestedMeal: "siang"
  },
  {
    id: "ai-sample-3",
    name: "Oatmeal Bowl dengan Pisang & Beri",
    confidence: "96.8%",
    imgUrl: "https://images.unsplash.com/photo-1517673400267-0251440c45dc?w=600&auto=format&fit=crop&q=80",
    portionGram: 220,
    calories: 250,
    carbs: 45.0,
    protein: 9.0,
    fat: 4.0,
    fiber: 5.5,
    suggestedMeal: "sarapan"
  },
  {
    id: "ai-sample-4",
    name: "Salad Segar Alpukat & Olive Oil",
    confidence: "97.5%",
    imgUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&auto=format&fit=crop&q=80",
    portionGram: 180,
    calories: 190,
    carbs: 12.0,
    protein: 4.5,
    fat: 14.0,
    fiber: 6.0,
    suggestedMeal: "malam"
  }
];

class AIScannerEngine {
  constructor() {
    this.currentDetectedFood = null;
    this.isScanning = false;
  }

  initSampleGallery(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    let html = '';
    AI_SAMPLE_FOODS.forEach((sample, idx) => {
      html += `
        <img src="${sample.imgUrl}" alt="${sample.name}" class="sample-thumb ${idx === 0 ? 'active' : ''}" 
             onclick="window.aiScanner.selectSample('${sample.id}')" title="${sample.name}" />
      `;
    });
    container.innerHTML = html;
    
    // Select first sample by default
    this.selectSample(AI_SAMPLE_FOODS[0].id);
  }

  selectSample(sampleId) {
    const sample = AI_SAMPLE_FOODS.find(s => s.id === sampleId);
    if (!sample) return;

    // Highlight active thumbnail
    document.querySelectorAll('.sample-thumb').forEach(el => el.classList.remove('active'));
    const thumbs = document.querySelectorAll('.sample-thumb');
    const index = AI_SAMPLE_FOODS.findIndex(s => s.id === sampleId);
    if (thumbs[index]) thumbs[index].classList.add('active');

    this.runScanAnimation(sample.imgUrl, sample);
  }

  handleCustomImageUpload(file) {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const imgDataUrl = e.target.result;
      
      // Simulate detection based on filename or random smart match
      const randomSample = AI_SAMPLE_FOODS[Math.floor(Math.random() * AI_SAMPLE_FOODS.length)];
      const detectedItem = {
        ...randomSample,
        name: file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ") + " (AI Detected)",
        confidence: "95.2%",
        imgUrl: imgDataUrl
      };

      this.runScanAnimation(imgDataUrl, detectedItem);
    };
    reader.readAsDataURL(file);
  }

  runScanAnimation(imgSrc, resultData) {
    if (this.isScanning) return;
    this.isScanning = true;

    const previewImg = document.getElementById("scanner-preview-img");
    const overlay = document.getElementById("scanner-overlay");
    const promptText = document.getElementById("scanner-prompt-text");
    const resultBox = document.getElementById("ai-scan-results");

    if (previewImg) {
      previewImg.src = imgSrc;
      previewImg.style.display = "block";
    }

    if (promptText) promptText.style.display = "none";
    if (overlay) overlay.style.display = "block";

    if (resultBox) {
      resultBox.innerHTML = `
        <div style="text-align: center; padding: 40px 20px;">
          <div style="display: inline-block; width: 40px; height: 40px; border: 3px solid var(--accent-emerald); border-top-color: transparent; border-radius: 50%; animation: spin 0.8s linear infinite;"></div>
          <p style="margin-top: 16px; font-weight: 700; color: var(--accent-emerald);">Mengoperasikan AI Computer Vision...</p>
          <p style="font-size: 0.8rem; color: var(--text-muted); margin-top: 4px;">Menganalisis jenis makanan & estimasi porsi gram</p>
        </div>
      `;
    }

    // After 1.8s simulation delay, show breakdown
    setTimeout(() => {
      this.isScanning = false;
      if (overlay) overlay.style.display = "none";
      this.currentDetectedFood = resultData;
      this.renderResults(resultData);
    }, 1800);
  }

  renderResults(food) {
    const resultBox = document.getElementById("ai-scan-results");
    if (!resultBox) return;

    resultBox.innerHTML = `
      <div style="background: var(--bg-card); border: 1px solid var(--border-highlight); border-radius: var(--radius-xl); padding: 24px; box-shadow: var(--shadow-glow); animation: fadeIn 0.4s ease;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
          <div>
            <span style="background: rgba(16,185,129,0.15); color: var(--accent-emerald); font-size: 0.75rem; font-weight: 800; padding: 4px 10px; border-radius: 20px;">
              <i class="ri-cpu-line"></i> AI Confidence: ${food.confidence}
            </span>
            <h3 style="font-size: 1.3rem; font-weight: 800; margin-top: 8px;">${food.name}</h3>
          </div>
          <div style="text-align: right;">
            <span style="font-size: 1.8rem; font-weight: 800; color: var(--accent-emerald);">${food.calories}</span>
            <span style="font-size: 0.8rem; color: var(--text-muted); display: block;">kcal / porsi</span>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; background: var(--bg-glass); padding: 14px; border-radius: var(--radius-md); text-align: center; margin-bottom: 20px;">
          <div>
            <span style="font-size: 0.75rem; color: var(--macro-carbs); font-weight: 700;">Karbo</span>
            <p style="font-size: 1.1rem; font-weight: 800;">${food.carbs}g</p>
          </div>
          <div>
            <span style="font-size: 0.75rem; color: var(--macro-protein); font-weight: 700;">Protein</span>
            <p style="font-size: 1.1rem; font-weight: 800;">${food.protein}g</p>
          </div>
          <div>
            <span style="font-size: 0.75rem; color: var(--macro-fat); font-weight: 700;">Lemak</span>
            <p style="font-size: 1.1rem; font-weight: 800;">${food.fat}g</p>
          </div>
          <div>
            <span style="font-size: 0.75rem; color: var(--macro-fiber); font-weight: 700;">Serat</span>
            <p style="font-size: 1.1rem; font-weight: 800;">${food.fiber}g</p>
          </div>
        </div>

        <div style="display: flex; gap: 12px; align-items: center;">
          <div style="flex: 1;">
            <label style="font-size: 0.8rem; font-weight: 600; color: var(--text-muted); display: block; margin-bottom: 4px;">Waktu Makan</label>
            <select id="ai-meal-target-select" class="form-control">
              <option value="sarapan" ${food.suggestedMeal === 'sarapan' ? 'selected' : ''}>Sarapan Pagi</option>
              <option value="siang" ${food.suggestedMeal === 'siang' ? 'selected' : ''}>Makan Siang</option>
              <option value="malam" ${food.suggestedMeal === 'malam' ? 'selected' : ''}>Makan Malam</option>
              <option value="camilan" ${food.suggestedMeal === 'camilan' ? 'selected' : ''}>Camilan</option>
            </select>
          </div>
          <button class="btn-primary" style="margin-top: 20px;" onclick="window.aiScanner.confirmLogAIDetected()">
            <i class="ri-add-circle-line"></i> Masukkan ke Log
          </button>
        </div>
      </div>
    `;
  }

  confirmLogAIDetected() {
    if (!this.currentDetectedFood) return;

    const mealSelect = document.getElementById("ai-meal-target-select");
    const mealCat = mealSelect ? mealSelect.value : "siang";
    const dateStr = window.appController ? window.appController.selectedDate : window.storageManager.getTodayString();

    const logged = window.storageManager.addFoodToMeal(dateStr, mealCat, this.currentDetectedFood, this.currentDetectedFood.portionGram);
    if (logged) {
      if (window.appController) {
        window.appController.showToast(`Berhasil menambahkan ${this.currentDetectedFood.name} ke ${mealCat.toUpperCase()}!`);
        window.appController.renderDashboard();
        window.appController.switchTab("dashboard");
      }
    }
  }
}

window.aiScanner = new AIScannerEngine();
