<template>
  <div class="ambient-bg">
    <div class="gradient-sphere sphere-1"></div>
    <div class="gradient-sphere sphere-2"></div>
    <div class="gradient-sphere sphere-3"></div>
  </div>

  <div class="app-container">
    <!-- Header -->
    <header class="app-header">
      <div class="header-logo">
        <div class="logo-icon">漢</div>
        <div class="logo-text">
          <h1>HanziMaster</h1>
          <span>HSK 1 - 6 Premium (Vue 3)</span>
        </div>
      </div>

      <!-- Tab Navigation -->
      <nav class="tab-nav">
        <button 
          class="tab-btn" 
          :class="{ active: activeTab === 'vocab' }" 
          @click="switchTab('vocab')"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
          Từ vựng
        </button>
        <button 
          class="tab-btn" 
          :class="{ active: activeTab === 'character' }" 
          @click="switchTab('character')"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
          Hán tự
        </button>
        <button 
          class="tab-btn" 
          :class="{ active: activeTab === 'grammar' }" 
          @click="switchTab('grammar')"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"></path><path d="M2 17l10 5 10-5"></path><path d="M2 12l10 5 10-5"></path></svg>
          Ngữ pháp
        </button>
        <button 
          class="tab-btn" 
          :class="{ active: activeTab === 'sentences' }" 
          @click="switchTab('sentences')"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
          Mẫu câu
        </button>
        <button 
          class="tab-btn" 
          :class="{ active: activeTab === 'dict' }" 
          @click="switchTab('dict')"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          Trung-Việt
        </button>
      </nav>

      <div class="header-actions">
        <button @click="switchTab('dict')" class="icon-btn tooltip" data-tooltip="Sổ tay từ vựng">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
          <span class="bookmark-count">{{ savedWords.length }}</span>
        </button>
      </div>
    </header>

    <!-- Main Content -->
    <main class="app-main">
      
      <!-- 1. TAB: TỪ VỰNG -->
      <section v-show="activeTab === 'vocab'" class="tab-pane active">
        <div class="hsk-filter-bar glass-panel">
          <div class="hsk-levels">
            <button 
              v-for="level in 6" :key="level" 
              class="hsk-btn" 
              :class="{ active: currentLevel === level }" 
              @click="currentLevel = level"
            >
              HSK {{ level }} 
              <span class="badge">{{ hskData[level]?.length || 0 }}</span>
            </button>
          </div>
          <div class="search-box">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input v-model="vocabSearch" type="text" placeholder="Tìm từ vựng, pinyin, ý nghĩa...">
          </div>
        </div>

        <div v-if="loadingVocab" class="loader-container">
          <div class="spinner"></div>
          <p>Đang tải dữ liệu HSK từ GitHub...</p>
        </div>

        <div v-else class="vocab-grid">
          <div 
            v-for="word in filteredVocab" :key="word.simplified" 
            class="vocab-card"
            @click="selectWord(word)"
          >
            <div class="vocab-top">
              <span class="vocab-char">{{ word.simplified }}</span>
              <span class="vocab-pinyin">{{ word.pinyin }}</span>
            </div>
            <div class="vocab-hanviet">{{ getHanVietWord(word.simplified) }}</div>
            <div class="vocab-eng">{{ word.english }}</div>
          </div>
        </div>
      </section>

      <!-- 2. TAB: HÁN TỰ -->
      <section v-show="activeTab === 'character'" class="tab-pane active">
        <div class="character-header-search glass-panel">
          <div class="search-input-wrapper">
            <input v-model="charSearchQuery" @keypress.enter="searchChar" maxlength="10" placeholder="Nhập chữ Hán cần tra (vd: 赢, 爱, 好)...">
            <button @click="searchChar" class="btn btn-primary">Tra cứu</button>
          </div>
          <div class="quick-nav">
            <span>Gợi ý:</span>
            <button v-for="tag in ['赢','爱','好','我','学','德','福']" :key="tag" @click="loadCharacter(tag)" class="quick-tag">{{ tag }}</button>
          </div>
        </div>

        <!-- Main Hero Card -->
        <div v-if="currentWordData" class="hero-character-card glass-panel">
          <div class="hero-card-inner">
            <!-- Left: HanziWriter Box -->
            <div class="hero-left">
              <div class="writer-box-container">
                <div ref="heroWriterRef" class="hanzi-box"></div>
                <div class="box-grid-lines">
                  <div class="line-h"></div>
                  <div class="line-v"></div>
                  <div class="line-d1"></div>
                  <div class="line-d2"></div>
                </div>
              </div>
            </div>

            <!-- Right: Meta info -->
            <div class="hero-right">
              <div class="info-top-row">
                <div class="pinyin-audio">
                  <h2 class="pinyin-display">{{ currentWordData.pinyin }}</h2>
                  <button @click="speak(currentChar)" class="audio-btn tooltip" data-tooltip="Nghe phát âm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
                  </button>
                </div>
                <button @click="toggleBookmark(currentChar)" class="bookmark-action tooltip" :class="{ saved: isSaved(currentChar) }" data-tooltip="Lưu vào sổ tay">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" :fill="isSaved(currentChar) ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
                </button>
              </div>

              <div class="info-meta-list">
                <div class="meta-item">
                  <span class="meta-label">Hình thái:</span>
                  <span class="meta-val structure-glyphs">{{ currentWordData.structure }}</span>
                </div>
                <div class="meta-item">
                  <span class="meta-label">Lục thư:</span>
                  <span class="meta-val">{{ currentWordData.etymology }}</span>
                </div>
                <div class="meta-item">
                  <span class="meta-label">Bộ:</span>
                  <span class="meta-val highlight-radical">{{ currentWordData.radical }}</span>
                </div>
                <div class="meta-item">
                  <span class="meta-label">Số nét:</span>
                  <span class="meta-val">{{ currentWordData.strokes }} nét</span>
                </div>
              </div>

              <div class="main-action-area">
                <button @click="openPractice" class="btn btn-giant btn-glow">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 19l7-7 3 3-7 7-3-3z"></path><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path><path d="M2 2l7.586 7.586"></path></svg>
                  Tập viết trực tiếp
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Accordions -->
        <div v-if="currentWordData" class="character-accordions">
          
          <div class="accordion-item glass-panel" :class="{ open: accOpen.mnemonic }">
            <div @click="accOpen.mnemonic = !accOpen.mnemonic" class="accordion-header">
              <div class="acc-title"><span class="acc-icon">💡</span><h3>Mẹo hán tự</h3></div>
              <button class="acc-toggle"><svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none"><polyline points="6 9 12 15 18 9"></polyline></svg></button>
            </div>
            <div class="accordion-body">
              <div class="mnemonic-box" v-html="currentWordData.mnemonic"></div>
            </div>
          </div>

          <div class="accordion-item glass-panel" :class="{ open: accOpen.components }">
            <div @click="accOpen.components = !accOpen.components" class="accordion-header">
              <div class="acc-title"><span class="acc-icon">🧩</span><h3>Bộ thành phần</h3></div>
              <button class="acc-toggle"><svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none"><polyline points="6 9 12 15 18 9"></polyline></svg></button>
            </div>
            <div class="accordion-body">
              <ol class="component-list">
                <li v-for="comp in currentWordData.components" :key="comp.char">
                  <span class="comp-char">{{ comp.char }}</span>
                  <div class="comp-info">
                    <span class="comp-name">{{ comp.name }}</span>
                    <span class="comp-desc">{{ comp.desc }}</span>
                  </div>
                </li>
              </ol>
            </div>
          </div>

          <div class="accordion-item glass-panel" :class="{ open: accOpen.variants }">
            <div @click="accOpen.variants = !accOpen.variants" class="accordion-header">
              <div class="acc-title"><span class="acc-icon">🔄</span><h3>Biến thể & Phồn thể</h3></div>
              <button class="acc-toggle"><svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none"><polyline points="6 9 12 15 18 9"></polyline></svg></button>
            </div>
            <div class="accordion-body">
              <div class="variants-box">
                <div class="var-item"><span>Giản thể:</span><strong class="char-lg">{{ currentWordData.variants.sim }}</strong></div>
                <div class="var-item"><span>Phồn thể:</span><strong class="char-lg">{{ currentWordData.variants.tra }}</strong></div>
              </div>
            </div>
          </div>

          <div class="accordion-item glass-panel" :class="{ open: accOpen.definition }">
            <div @click="accOpen.definition = !accOpen.definition" class="accordion-header">
              <div class="acc-title"><span class="acc-icon">🇻🇳</span><h3>Hán Việt & Từ điển phổ thông</h3></div>
              <button class="acc-toggle"><svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none"><polyline points="6 9 12 15 18 9"></polyline></svg></button>
            </div>
            <div class="accordion-body">
              <div class="dict-definition">
                <div class="sino-viet-title"><span>Hán Việt: </span><h3>{{ currentWordData.hanviet }}</h3></div>
                <div class="dict-content">
                  <p v-for="(def, i) in currentWordData.definition" :key="i" class="dict-entry">{{ def }}</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      <!-- 3. TAB: NGỮ PHÁP -->
      <section v-show="activeTab === 'grammar'" class="tab-pane active">
        <div class="grammar-header glass-panel">
          <h2>Cẩm nang Ngữ Pháp HSK</h2>
          <p>Các cấu trúc ngữ pháp trọng tâm được giải thích trực quan và dễ hiểu</p>
          <div class="level-tabs">
            <button v-for="level in 3" :key="level" class="btn btn-outline" :class="{ active: grammarLevel === level }" @click="grammarLevel = level">HSK {{ level }}</button>
          </div>
        </div>
        <div class="grammar-list">
          <div v-for="g in currentGrammarList" :key="g.title" class="glass-panel grammar-card">
            <h3>{{ g.title }}</h3>
            <span class="pinyin-sub">Cấu trúc: {{ g.py }}</span>
            <div class="example-box">{{ g.ex }}</div>
          </div>
        </div>
      </section>

      <!-- 4. TAB: MẪU CÂU -->
      <section v-show="activeTab === 'sentences'" class="tab-pane active">
        <div class="sentences-header glass-panel">
          <h2>Mẫu Câu Giao Tiếp Thực Tế</h2>
          <p>Học từ vựng thông qua các câu đối thoại và mẫu câu ứng dụng hàng ngày</p>
        </div>
        <div class="sentences-grid">
          <div v-for="s in sampleSentences" :key="s.cn" class="glass-panel sentence-card">
            <div class="sen-left">
              <span class="sen-cn">{{ s.cn }}</span>
              <span class="sen-py">{{ s.py }}</span>
              <span class="sen-vi">{{ s.vi }}</span>
            </div>
            <button class="audio-btn" @click="speak(s.cn)">🔊</button>
          </div>
        </div>
      </section>

      <!-- 5. TAB: DICT & SAVED -->
      <section v-show="activeTab === 'dict'" class="tab-pane active">
        <div class="dict-search-hero glass-panel">
          <h2>Từ Điển Trung - Việt HSK & Sổ Tay</h2>
          <div class="search-box giant-search">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input v-model="masterSearch" type="text" placeholder="Gõ chữ Hán, Pinyin hoặc tiếng Việt...">
          </div>
        </div>

        <div class="dict-results">
          <!-- Saved words view when search is empty -->
          <template v-if="!masterSearch.trim()">
            <div v-if="savedWords.length === 0" class="glass-panel text-center" style="padding:4rem 2rem;">
              <p style="font-size:3rem; margin-bottom:1rem;">📓</p>
              <h3 style="margin-bottom:0.5rem;">Sổ tay từ vựng của bạn đang trống!</h3>
              <p class="text-muted">Hãy tra cứu và bấm nút Bookmark ở bất kỳ từ nào để lưu vào đây.</p>
            </div>
            <template v-else>
              <h3 style="margin-bottom:1rem; color:#38bdf8;">Sổ Tay Từ Vựng Của Bạn (${{ savedWords.length }} từ)</h3>
              <div v-for="w in savedWords" :key="w.char" class="dict-row" @click="loadCharFromDict(w.char)">
                <div class="dict-char-col">
                  <span class="cn">{{ w.char }}</span>
                  <span class="py">{{ w.pinyin }}</span>
                  <span class="hv">[Hán Việt: {{ w.hanviet }}]</span>
                </div>
                <button class="btn btn-outline btn-sm">Luyện viết ✍️</button>
              </div>
            </template>
          </template>

          <!-- Search results -->
          <template v-else>
            <h3 style="margin-bottom:1rem; color:#38bdf8;">Kết Quả Tìm Kiếm (${{ masterResults.length }} từ)</h3>
            <div v-for="w in masterResults" :key="w.simplified" class="dict-row" @click="loadCharFromDict(w.simplified)">
              <div class="dict-char-col">
                <span class="cn">{{ w.simplified }}</span>
                <span class="py">{{ w.pinyin }}</span>
                <span class="hv">[{{ getHanVietWord(w.simplified) }}]</span>
                <span style="color:var(--text-dim); margin-left:1rem;">{{ w.english }}</span>
              </div>
              <button class="btn btn-outline btn-sm">Luyện viết ✍️</button>
            </div>
          </template>
        </div>
      </section>

    </main>
  </div>

  <!-- Practice Modal -->
  <div class="practice-modal" :class="{ active: showPracticeModal }">
    <div class="modal-backdrop" @click="closePractice"></div>
    <div class="modal-container glass-panel">
      <div class="modal-header">
        <div class="modal-title-area">
          <span class="modal-badge">Bảng Tập Viết</span>
          <h3>{{ currentChar }} ({{ currentWordData?.pinyin }})</h3>
        </div>
        <button @click="closePractice" class="btn-close-modal">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>

      <div class="modal-body">
        <div class="practice-board-wrapper">
          <div ref="practiceWriterRef" class="hanzi-practice-box"></div>
          <div class="box-grid-lines big-grid">
            <div class="line-h"></div>
            <div class="line-v"></div>
            <div class="line-d1"></div>
            <div class="line-d2"></div>
          </div>
          <!-- Success overlay -->
          <div class="quiz-success-overlay" :class="{ active: quizCompleted }">
            <div class="trophy-icon">🏆</div>
            <div class="celebrate-text">Tuyệt Vời!</div>
            <p>Bạn đã hoàn thành chính xác thứ tự nét</p>
            <button @click="restartPractice" class="btn btn-primary mt-1">Vẽ lại</button>
          </div>
        </div>

        <div class="practice-hints">
          <div class="hint-item"><span>Số nét:</span> <strong>{{ currentWordData?.strokes }}</strong></div>
          <div class="hint-item"><span>Lỗi sai:</span> <strong class="text-error">{{ practiceMistakes }}</strong></div>
          <button @click="showNextHint" class="btn btn-outline btn-sm">Gợi ý nét tiếp theo</button>
        </div>
      </div>

      <div class="modal-footer">
        <button @click="demoPractice" class="btn btn-secondary">Xem Hướng Dẫn Nét</button>
        <button @click="restartPractice" class="btn btn-primary">Xóa bảng & Vẽ lại</button>
      </div>
    </div>
  </div>

  <!-- Toast Message -->
  <div class="toast-container" :class="{ show: toast.visible }">
    <div class="toast-content">
      <span class="toast-icon">✨</span>
      <span>{{ toast.text }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, nextTick } from 'vue';
import HanziWriter from 'hanzi-writer';

// State
const activeTab = ref('character');
const currentLevel = ref(1);
const vocabSearch = ref('');
const loadingVocab = ref(true);

const hskData = reactive({ 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] });
const hanvietMap = reactive({});
const savedWords = ref(JSON.parse(localStorage.getItem('hanzi_saved_words') || '[]'));

const currentChar = ref('赢');
const charSearchQuery = ref('赢');
const currentWordData = ref(null);

const accOpen = reactive({
  mnemonic: true, components: true, variants: false, definition: true
});

const grammarLevel = ref(1);
const masterSearch = ref('');

// Practice Modal State
const showPracticeModal = ref(false);
const practiceMistakes = ref(0);
const quizCompleted = ref(false);

const toast = reactive({ visible: false, text: '' });

// Element refs
const heroWriterRef = ref(null);
const practiceWriterRef = ref(null);
let heroWriterInstance = null;
let practiceWriterInstance = null;

// Rich database demo
const richCharData = {
  '赢': {
    pinyin: 'yíng', hanviet: 'DOANH', structure: '⿳亡口贝', etymology: 'Hình thanh (Phono-semantic)',
    radical: 'BỐI 貝 (bèi)', strokes: 17,
    mnemonic: 'Chữ Doanh (赢) gồm 5 thành phần: MANG 亡 (hy sinh), KHẨU 口 (giao tiếp), NGUYỆT 月 (thời gian), BỐI 贝 (tiền tài), và PHÀM 凡 (bình phàm). Để chiến thắng cần cống hiến, giao tiếp tốt, kiên nhẫn, đầu tư đúng cách và luôn giữ thái độ khiêm tốn!',
    components: [
      { char: '亡', name: 'MANG (wáng)', desc: 'Mất mát, hy sinh, bỏ trốn' },
      { char: '口', name: 'KHẨU (kǒu)', desc: 'Cái miệng, lời nói, nhân khẩu' },
      { char: '月', name: 'NGUYỆT (yuè)', desc: 'Mặt trăng, tháng, thời gian' },
      { char: '貝', name: 'BỐI (bèi)', desc: 'Bảo bối, vỏ sò, tiền tài' },
      { char: '凡', name: 'PHÀM (fán)', desc: 'Bình thường, phàm tục' }
    ],
    variants: { sim: '赢', tra: '贏' },
    definition: ['1. Thắng lợi, chiến thắng: Đạt được thành công trong thi đấu hoặc kinh doanh (đối lập với thua 输).', '2. Thu được lợi nhuận: Kiếm được tiền lời, sinh lời (ví dụ: 赢利 - doanh lợi).', '3. Ví dụ phổ biến: 赢得 (giành được), 双赢 (đôi bên cùng có lợi - win-win).']
  },
  '爱': {
    pinyin: 'ài', hanviet: 'ÁI', structure: '⿳爫冖友', etymology: 'Hội ý (Ideogram)',
    radical: 'TÂM 心 (xīn)', strokes: 10,
    mnemonic: 'Chữ Ái (爱 - tình yêu) trong phồn thể (愛) có bộ Tâm 心 ở giữa, thể hiện tình yêu từ trái tim. Giản thể đổi thành bộ Hữu 友 (bạn bè), ngụ ý tình yêu bắt nguồn từ sự thấu hiểu và tình bạn chân thành!',
    components: [
      { char: '爫', name: 'TRẢO (zhǎo)', desc: 'Móng vuốt, nắm bắt' },
      { char: '冖', name: 'MỊCH (mì)', desc: 'Dải lụa che phủ, bao bọc' },
      { char: '友', name: 'HỮU (yǒu)', desc: 'Bạn bè, tình hữu nghị' }
    ],
    variants: { sim: '爱', tra: '愛' },
    definition: ['1. Yêu thương, kính trọng: Cảm xúc yêu mến sâu sắc giữa con người (ví dụ: 爱情 - ái tình).', '2. Sở thích, thói quen: Rất thích làm việc gì đó (ví dụ: 爱好 - sở thích).', '3. Trân trọng, bảo vệ: Giữ gìn điều quý giá (ví dụ: 爱护 - ái hộ, bảo vệ).']
  },
  '好': {
    pinyin: 'hǎo / hào', hanviet: 'HẢO / HIẾU', structure: '⿰女子', etymology: 'Hội ý (Ideogram)',
    radical: 'NỮ 女 (nǚ)', strokes: 6,
    mnemonic: 'Chữ Hảo (好) ghép bởi bộ NỮ (女 - phụ nữ/người mẹ) và bộ TỬ (子 - con cái). Người mẹ ôm đứa con vào lòng là hình ảnh đẹp đẽ, hạnh phúc và an lành nhất thế gian!',
    components: [
      { char: '女', name: 'NỮ (nǚ)', desc: 'Phụ nữ, người con gái, phái đẹp' },
      { char: '子', name: 'TỬ (zǐ)', desc: 'Đứa trẻ, con cái, bậc tử sư' }
    ],
    variants: { sim: '好', tra: '好' },
    definition: ['1. Tốt, hay, đẹp: Chất lượng xuất sắc, vừa ý (ví dụ: 好人 - người tốt).', '2. Rất, lắm (Phó từ): Dùng để nhấn mạnh (ví dụ: 好看 - rất đẹp, 好吃 - ngon).', '3. Hào hứng, hiếu kỳ (hào): Thích thú điều gì đó (ví dụ: 好奇 - hiếu kỳ).']
  },
  '我': {
    pinyin: 'wǒ', hanviet: 'NGÃ', structure: '⿰手戈', etymology: 'Tượng hình (Pictogram)',
    radical: 'QUA 戈 (gē)', strokes: 7,
    mnemonic: 'Chữ Ngã (我 - bản thân) có nguồn gốc từ hình ảnh bàn tay cầm vũ khí (bộ Qua 戈). Ngụ ý: Mỗi cá nhân phải tự đứng lên bảo vệ quyền lợi và lý tưởng của chính mình!',
    components: [
      { char: '手', name: 'THỦ (shǒu)', desc: 'Bàn tay (biến thể)' },
      { char: '戈', name: 'QUA (gē)', desc: 'Vũ khí cổ, ngọn giáo' }
    ],
    variants: { sim: '我', tra: '我' },
    definition: ['1. Tôi, ta, bản thân (Đại từ nhân xưng ngôi thứ nhất): Chỉ chính mình (ví dụ: 我们 - chúng tôi).', '2. Cái tôi (Triết học): Ngã, bản ngã (ví dụ: 自我 - tự ngã).']
  },
  '学': {
    pinyin: 'xué', hanviet: 'HỌC', structure: '⿳⺍冖子', etymology: 'Hội ý (Ideogram)',
    radical: 'TỬ 子 (zǐ)', strokes: 8,
    mnemonic: 'Chữ Học (学) miêu tả một đứa trẻ (TỬ 子) đang ngồi trong lớp học dưới mái nhà (MỊCH 冖) và hai tay nâng niu kiến thức (⺍). Học tập là quá trình trau dồi tri thức từ thủa bé!',
    components: [
      { char: '⺍', name: 'TIỂU (xiǎo)', desc: 'Biến thể của hai bàn tay nâng' },
      { char: '冖', name: 'MỊCH (mì)', desc: 'Mái nhà, bao trùm' },
      { char: '子', name: 'TỬ (zǐ)', desc: 'Con cái, học trò, đứa trẻ' }
    ],
    variants: { sim: '学', tra: '學' },
    definition: ['1. Học tập, nghiên cứu: Tiếp thu tri thức, rèn luyện kỹ năng (ví dụ: 学习 - học tập).', '2. Trường học, môn học: Cơ sở giáo dục hoặc lĩnh vực khoa học (ví dụ: 学校 - trường học, 科学 - khoa học).']
  }
};

const getFallbackCharData = (char, py = '...') => {
  const hv = hanvietMap[char] || 'HÁN TỰ';
  return {
    pinyin: py !== '...' ? py : 'Pinyin',
    hanviet: hv.toUpperCase(), structure: '⿰ / ⿳', etymology: 'Hình thanh / Hội ý', radical: 'TRA CỨU TRỰC TUYẾN',
    strokes: 10, mnemonic: `Chữ ${char} (âm Hán Việt: ${hv}) là từ vựng HSK chuẩn. Hãy luyện viết kỹ từng nét trên bảng tương tác để ghi nhớ!`,
    components: [{ char: char, name: `${hv} (${py})`, desc: 'Thành phần gốc' }],
    variants: { sim: char, tra: char },
    definition: [`Ý nghĩa cơ bản của từ [${char}] trong hệ thống tiếng Trung phổ thông.`]
  };
};

// Computed
const filteredVocab = computed(() => {
  const words = hskData[currentLevel.value] || [];
  if (!vocabSearch.value.trim()) return words.slice(0, 100);
  const s = vocabSearch.value.toLowerCase().trim();
  return words.filter(w => w.simplified.toLowerCase().includes(s) || w.pinyin.toLowerCase().includes(s) || w.english.toLowerCase().includes(s)).slice(0, 100);
});

const masterResults = computed(() => {
  const s = masterSearch.value.toLowerCase().trim();
  if (!s) return [];
  const res = [];
  for (let level in hskData) {
    const list = hskData[level] || [];
    list.forEach(w => {
      if (w.simplified.toLowerCase().includes(s) || w.pinyin.toLowerCase().includes(s) || w.english.toLowerCase().includes(s)) res.push(w);
    });
  }
  return res.slice(0, 30);
});

const grammarData = {
  1: [
    { title: 'Câu hỏi nghi vấn với [吗] (ma)', py: 'N + V + Obj + 吗?', ex: '你是老师吗？ (Bạn là giáo viên phải không?)' },
    { title: 'Câu chữ [很] (hěn) chỉ mức độ', py: 'S + 很 + Adj', ex: '今天很好。 (Hôm nay rất tốt.)' },
    { title: 'Sở hữu với trợ từ [的] (de)', py: 'N1 + 的 + N2', ex: '我的书。 (Sách của tôi.)' }
  ],
  2: [
    { title: 'Câu chữ [把] (bǎ) căn bản', py: 'S + 把 + Obj + V + Khác', ex: '请把书打开。 (Xin hãy mở sách ra.)' },
    { title: 'Câu chữ [被] (bèi) bị động', py: 'S + 被 + (Người làm) + V', ex: '咖啡被他喝了。 (Cà phê bị anh ấy uống rồi.)' },
    { title: 'Bổ ngữ kết quả', py: 'V + Kết quả', ex: '我看完了。 (Tôi xem xong rồi.)' }
  ],
  3: [
    { title: 'Câu so sánh hơn với [比] (bǐ)', py: 'A + 比 + B + Adj', ex: '他比我高。 (Anh ấy cao hơn tôi.)' },
    { title: 'Câu hỏi phản vấn 难道...吗', py: '难道 + S + V + Obj + 吗', ex: '难道你不知道吗？ (Lẽ nào bạn không biết?)' }
  ]
};
const currentGrammarList = computed(() => grammarData[grammarLevel.value] || grammarData[1]);

const sampleSentences = [
  { cn: '你好！认识你很高兴。', py: 'Nǐ hǎo! Rènshí nǐ hěn gāoxìng.', vi: 'Xin chào! Rất vui được làm quen với bạn.' },
  { cn: '请问，这个字怎么写？', py: 'Qǐngwèn, zhège zì zěnme xiě?', vi: 'Xin hỏi, chữ này viết như thế nào?' },
  { cn: '祝你学习进步，天天向上。', py: 'Zhù nǐ xuéxí jìnbù, tiāntiān xiàngshàng.', vi: 'Chúc bạn học tập tiến bộ, mỗi ngày một vươn lên.' },
  { cn: '不经一番寒彻骨，怎得梅花扑鼻香。', py: 'Bù jīng yī fān hán chègǔ, zěn dé méihuā pūbí xiāng.', vi: 'Không trải qua sương lạnh buốt xương, sao ngửi được mùi hoa mai thơm nức.' }
];

// Methods
const switchTab = (tab) => { activeTab.value = tab; };

const getHanVietWord = (word) => {
  return Array.from(word).map(c => hanvietMap[c] || c).join(' ');
};

const selectWord = (word) => {
  loadCharacter(word.simplified.charAt(0), word.pinyin);
  switchTab('character');
};

const loadCharFromDict = (char) => {
  loadCharacter(char.charAt(0));
  switchTab('character');
};

const searchChar = () => {
  if (charSearchQuery.value.trim()) loadCharacter(charSearchQuery.value.trim().charAt(0));
};

const loadCharacter = (char, py = '...') => {
  currentChar.value = char;
  charSearchQuery.value = char;
  currentWordData.value = richCharData[char] || getFallbackCharData(char, py);

  nextTick(() => {
    initHeroWriter();
  });
};

const initHeroWriter = () => {
  if (!heroWriterRef.value) return;
  heroWriterRef.value.innerHTML = '';
  heroWriterInstance = HanziWriter.create(heroWriterRef.value, currentChar.value, {
    width: 280, height: 280, padding: 10, strokeColor: '#f1f5f9', radicalColor: '#38bdf8',
    outlineColor: '#334155', showCharacter: true, delayBetweenStrokes: 120, delayBetweenLoops: 2000
  });

  setTimeout(() => {
    if (heroWriterInstance) heroWriterInstance.loopCharacterAnimation();
  }, 500);
};


const speak = (text) => {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'zh-CN';
    utterance.rate = 0.85;
    window.speechSynthesis.speak(utterance);
  } else showToast('Trình duyệt không hỗ trợ đọc phát âm!');
};

const isSaved = (char) => savedWords.value.some(w => w.char === char);

const toggleBookmark = (char) => {
  const idx = savedWords.value.findIndex(w => w.char === char);
  if (idx >= 0) {
    savedWords.value.splice(idx, 1);
    showToast('Đã xóa khỏi sổ tay từ vựng!');
  } else {
    savedWords.value.push({ char: char, pinyin: currentWordData.value.pinyin, hanviet: currentWordData.value.hanviet });
    showToast('Đã lưu vào sổ tay từ vựng! ✨');
  }
  localStorage.setItem('hanzi_saved_words', JSON.stringify(savedWords.value));
};

const showToast = (text) => {
  toast.text = text;
  toast.visible = true;
  setTimeout(() => { toast.visible = false; }, 3000);
};

// Practice Modal
const openPractice = () => {
  showPracticeModal.value = true;
  nextTick(() => { initPractice(); });
};

const closePractice = () => {
  showPracticeModal.value = false;
  if (practiceWriterInstance) practiceWriterInstance.cancelQuiz();
};

const initPractice = () => {
  quizCompleted.value = false;
  practiceMistakes.value = 0;
  if (!practiceWriterRef.value) return;
  practiceWriterRef.value.innerHTML = '';
  const size = Math.min(window.innerWidth * 0.85, 360);

  practiceWriterInstance = HanziWriter.create(practiceWriterRef.value, currentChar.value, {
    width: size, height: size, padding: 15, strokeColor: '#ec4899', highlightColor: '#38bdf8',
    outlineColor: '#334155', showOutline: true, showCharacter: false
  });

  startQuiz();
};

const startQuiz = () => {
  if (!practiceWriterInstance) return;
  quizCompleted.value = false;
  practiceWriterInstance.quiz({
    showHintAfterMisses: 2,
    onMistake: () => { practiceMistakes.value++; },
    onComplete: () => {
      quizCompleted.value = true;
      speak(currentChar.value);
    }
  });
};

const restartPractice = () => { initPractice(); };
const demoPractice = () => {
  if (practiceWriterInstance) {
    practiceWriterInstance.cancelQuiz();
    practiceWriterInstance.animateCharacter({ onComplete: () => startQuiz() });
  }
};
const showNextHint = () => {
  if (practiceWriterInstance) {
    practiceWriterInstance.quiz({ showHintAfterMisses: 1 });
    showToast('Hãy quan sát nét vẽ nhấp nháy trên bảng');
  }
};

// Lifecycle
onMounted(async () => {
  // Load Han Viet map
  try {
    const hvRes = await fetch('https://raw.githubusercontent.com/vanvuvuong/japanese_anki_generator/master/data/hanviet.json');
    if (hvRes.ok) Object.assign(hanvietMap, await hvRes.json());
  } catch (err) { console.log('Hanviet load error'); }

  // Load HSK
  const hskUrls = {
    1: 'https://raw.githubusercontent.com/koynoyno/hsk3.0-json/main/hsk1.json',
    2: 'https://raw.githubusercontent.com/koynoyno/hsk3.0-json/main/hsk2.json',
    3: 'https://raw.githubusercontent.com/koynoyno/hsk3.0-json/main/hsk3.json'
  };

  try {
    for (let level in hskUrls) {
      const res = await fetch(hskUrls[level]);
      if (res.ok) {
        const d = await res.json();
        hskData[level] = d.words || [];
      }
    }
    loadingVocab.value = false;
  } catch (err) {
    console.error('HSK Fetch Error:', err);
    loadingVocab.value = false;
  }

  loadCharacter('赢');
});
</script>
