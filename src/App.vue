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

      <div class="header-actions" style="display:flex; align-items:center; gap:0.8rem;">
        <button @click="openAddWordModal" class="btn btn-primary btn-sm btn-glow tooltip" data-tooltip="Thêm từ mới vào HSK (Pass: 111)" style="display:flex; align-items:center; gap:0.4rem; padding:0.4rem 0.8rem;">
          <span>➕ Thêm từ</span>
        </button>
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
            <input v-model="vocabSearch" type="text" placeholder="Tìm từ vựng... (Tra nhiều từ cách nhau bằng dấu |)">
          </div>
        </div>

        <div v-if="loadingVocab" class="loader-container">
          <div class="spinner"></div>
          <p>Đang tải dữ liệu HSK...</p>
        </div>

        <div v-else class="vocab-grid">
          <div 
            v-for="word in filteredVocab" :key="word.simplified" 
            class="vocab-card glass-panel"
            @click="selectWord(word)"
          >
            <div>
              <div class="vocab-top">
                <span class="vocab-char">{{ word.simplified }}</span>
                <span class="vocab-pinyin">{{ word.pinyin }}</span>
              </div>
              <div class="vocab-hanviet">{{ getHanVietWord(word.simplified) }}</div>
              <div class="vocab-eng">
                <strong style="color:white; font-size:1.05em;">{{ getVietnameseMeaning(word) }}</strong>
                <span style="color:var(--text-dim); font-size:0.85em; margin-left:0.4rem;">({{ word.english }})</span>
              </div>
            </div>
            <div class="vocab-actions-bar" @click.stop>
              <button class="btn btn-primary btn-sm btn-practice-vocab" @click.stop="selectWord(word)">📖 Chi tiết</button>
              <button class="btn btn-icon btn-sm tooltip" data-tooltip="Nghe phát âm" @click.stop="speak(word.simplified)">🔊</button>
              <button class="btn btn-icon btn-sm tooltip" data-tooltip="Chỉnh sửa từ (Pass: 111)" @click.stop="openEditWordModal(word, currentLevel)">✏️</button>
              <button class="btn btn-icon btn-sm bookmark-action tooltip" :class="{ saved: isSaved(word.simplified) }" data-tooltip="Lưu sổ tay" @click.stop="toggleBookmark(word.simplified)">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" :fill="isSaved(word.simplified) ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
              </button>
            </div>
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

          <div class="accordion-item glass-panel" :class="{ open: accOpen.examples }">
            <div @click="accOpen.examples = !accOpen.examples" class="accordion-header">
              <div class="acc-title"><span class="acc-icon">📖</span><h3>Mẫu câu & Ví dụ thực tế</h3></div>
              <button class="acc-toggle"><svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none"><polyline points="6 9 12 15 18 9"></polyline></svg></button>
            </div>
            <div class="accordion-body">
              <div class="char-examples-box">
                <div v-for="(sen, idx) in getExamplesFor(currentChar)" :key="idx" class="sen-item-box">
                  <div class="sen-top">
                    <span class="cn-text">{{ sen.cn }}</span>
                    <button class="btn-audio-circle-sm" @click="speak(sen.cn)" title="Nghe câu này">🔊</button>
                  </div>
                  <div class="py-text">{{ sen.py }}</div>
                  <div class="vi-text">{{ sen.vi }}</div>
                </div>
                
                <div class="compounds-grid-list mt-1" v-if="getRelatedCompounds(currentChar).length > 0">
                  <h4 style="color:#38bdf8; margin-bottom:0.75rem; font-size:1.05rem;">Từ ghép HSK chứa chữ "{{ currentChar }}"</h4>
                  <div class="comp-pills-wrap">
                    <div 
                      v-for="cmp in getRelatedCompounds(currentChar)" 
                      :key="cmp.simplified" 
                      class="comp-pill-item"
                      @click="openPracticeForWord(cmp.simplified, cmp)"
                    >
                      <span class="cn">{{ cmp.simplified }}</span>
                      <span class="py" style="margin-left:0.4rem;">{{ cmp.pinyin }}</span>
                      <span class="hv" style="margin-left:0.4rem;">[{{ getHanVietWord(cmp.simplified) }}]</span>
                    </div>
                  </div>
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
            <input v-model="masterSearch" type="text" placeholder="Gõ chữ Hán, Pinyin hoặc tiếng Việt... (Tra nhiều từ cách nhau bằng dấu |)">
          </div>
        </div>

        <div class="dict-results">
          <!-- Saved words view when search is empty -->
          <template v-if="!masterSearch.trim()">
            <div v-if="savedWords.length === 0" class="glass-panel text-center" style="padding:4rem 2rem;">
              <p style="font-size:3rem; margin-bottom:1rem;">📓</p>
              <h3 style="margin-bottom:0.5rem;">Sổ tay từ vựng của bạn đang trống!</h3>
              <p class="text-muted">Hãy tra cứu và bấm nút Lưu sổ tay ở bất kỳ từ nào để lưu vào đây.</p>
            </div>
            <template v-else>
              <h3 style="margin-bottom:1rem; color:#38bdf8;">Sổ Tay Từ Vựng Của Bạn (${{ savedWords.length }} từ)</h3>
              <div v-for="w in savedWords" :key="w.simplified || w.char" class="dict-card glass-panel">
                <div class="dict-card-main">
                  <div class="dict-card-info" @click="loadCharFromDict(w.simplified || w.char)">
                    <div class="dict-char-grp">
                      <span class="cn">{{ w.simplified || w.char }}</span>
                      <span class="py">{{ w.pinyin }}</span>
                      <button class="audio-btn-micro tooltip" data-tooltip="Nghe phát âm" @click.stop="speak(w.simplified || w.char)">🔊</button>
                    </div>
                    <div class="dict-trans-grp">
                      <span class="hv">[{{ w.hanviet || getHanVietWord(w.simplified || w.char) }}]</span>
                      <span class="en">
                        <strong style="color:white; font-size:1.05em;">{{ getVietnameseMeaning(w) }}</strong>
                        <span style="color:var(--text-dim); font-size:0.85em; margin-left:0.4rem;" v-if="w.english">({{ w.english }})</span>
                      </span>
                    </div>
                  </div>
                  <div class="dict-card-actions">
                    <button class="btn btn-primary btn-sm" @click.stop="loadCharFromDict(w.simplified || w.char)">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
                      Chi tiết 📖
                    </button>
                    <button class="btn btn-outline btn-sm tooltip" data-tooltip="Chỉnh sửa từ (Pass: 111)" @click.stop="openEditWordModal(w, w.level || 1)">
                      ✏️ Sửa từ
                    </button>
                    <button class="btn btn-outline btn-sm bookmark-action tooltip" :class="{ saved: isSaved(w.simplified || w.char) }" data-tooltip="Lưu sổ tay" @click.stop="toggleBookmark(w.simplified || w.char)">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" :fill="isSaved(w.simplified || w.char) ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
                      {{ isSaved(w.simplified || w.char) ? 'Đã lưu' : 'Lưu sổ tay' }}
                    </button>
                  </div>
                </div>
                
                <div class="dict-card-examples">
                  <div class="examples-header" @click.stop="toggleDictExample(w.simplified || w.char)">
                    <div class="ex-title">
                      <span>💡</span> <strong>Ví dụ & Mẫu câu ứng dụng</strong>
                    </div>
                    <span class="ex-toggle-btn">{{ expandedDict[w.simplified || w.char] ? '▲ Ẩn bớt' : '▼ Xem ví dụ' }}</span>
                  </div>
                  <div class="examples-body" v-show="expandedDict[w.simplified || w.char]">
                    <div class="sentence-list">
                      <div v-for="(sen, sIdx) in getExamplesFor(w.simplified || w.char, w)" :key="sIdx" class="sen-item">
                        <div class="sen-content">
                          <div class="sen-cn">{{ sen.cn }}</div>
                          <div class="sen-py">{{ sen.py }}</div>
                          <div class="sen-vi">{{ sen.vi }}</div>
                        </div>
                        <button class="btn-audio-circle tooltip" data-tooltip="Nghe câu này" @click.stop="speak(sen.cn)">🔊</button>
                      </div>
                    </div>
                    <div class="related-compounds" v-if="getRelatedCompounds(w.simplified || w.char).length > 0">
                      <span class="comp-label">Từ ghép liên quan:</span>
                      <div class="comp-pills">
                        <span 
                          v-for="cmp in getRelatedCompounds(w.simplified || w.char)" 
                          :key="cmp.simplified" 
                          class="comp-pill"
                          @click.stop="loadCharFromDict(cmp.simplified)"
                        >
                          <strong>{{ cmp.simplified }}</strong> ({{ cmp.pinyin }})
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </template>

          <!-- Search results -->
          <template v-else>
            <h3 style="margin-bottom:1rem; color:#38bdf8;">Kết Quả Tìm Kiếm (${{ masterResults.length }} từ)</h3>
            <div v-for="w in masterResults" :key="w.simplified" class="dict-card glass-panel">
              <div class="dict-card-main">
                <div class="dict-card-info" @click="loadCharFromDict(w.simplified)">
                  <div class="dict-char-grp">
                    <span class="cn">{{ w.simplified }}</span>
                    <span class="py">{{ w.pinyin }}</span>
                    <button class="audio-btn-micro tooltip" data-tooltip="Nghe phát âm" @click.stop="speak(w.simplified)">🔊</button>
                  </div>
                  <div class="dict-trans-grp">
                    <span class="hv">[{{ getHanVietWord(w.simplified) }}]</span>
                    <span class="en">
                      <strong style="color:white; font-size:1.05em;">{{ getVietnameseMeaning(w) }}</strong>
                      <span style="color:var(--text-dim); font-size:0.85em; margin-left:0.4rem;" v-if="w.english">({{ w.english }})</span>
                    </span>
                  </div>
                </div>
                <div class="dict-card-actions">
                  <button class="btn btn-primary btn-sm" @click.stop="loadCharFromDict(w.simplified)">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
                    Chi tiết 📖
                  </button>
                  <button class="btn btn-outline btn-sm tooltip" data-tooltip="Chỉnh sửa từ (Pass: 111)" @click.stop="openEditWordModal(w, w.level || 1)">
                    ✏️ Sửa từ
                  </button>
                  <button class="btn btn-outline btn-sm bookmark-action tooltip" :class="{ saved: isSaved(w.simplified) }" data-tooltip="Lưu sổ tay" @click.stop="toggleBookmark(w.simplified)">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" :fill="isSaved(w.simplified) ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
                    {{ isSaved(w.simplified) ? 'Đã lưu' : 'Lưu sổ tay' }}
                  </button>
                </div>
              </div>
              
              <div class="dict-card-examples">
                <div class="examples-header" @click.stop="toggleDictExample(w.simplified)">
                  <div class="ex-title">
                    <span>💡</span> <strong>Ví dụ & Mẫu câu ứng dụng</strong>
                  </div>
                  <span class="ex-toggle-btn">{{ expandedDict[w.simplified] ? '▲ Ẩn bớt' : '▼ Xem ví dụ' }}</span>
                </div>
                <div class="examples-body" v-show="expandedDict[w.simplified]">
                  <div class="sentence-list">
                    <div v-for="(sen, sIdx) in getExamplesFor(w.simplified, w)" :key="sIdx" class="sen-item">
                      <div class="sen-content">
                        <div class="sen-cn">{{ sen.cn }}</div>
                        <div class="sen-py">{{ sen.py }}</div>
                        <div class="sen-vi">{{ sen.vi }}</div>
                      </div>
                      <button class="btn-audio-circle tooltip" data-tooltip="Nghe câu này" @click.stop="speak(sen.cn)">🔊</button>
                    </div>
                  </div>
                  <div class="related-compounds" v-if="getRelatedCompounds(w.simplified).length > 0">
                    <span class="comp-label">Từ ghép liên quan:</span>
                    <div class="comp-pills">
                      <span 
                        v-for="cmp in getRelatedCompounds(w.simplified)" 
                        :key="cmp.simplified" 
                        class="comp-pill"
                        @click.stop="loadCharFromDict(cmp.simplified)"
                      >
                        <strong>{{ cmp.simplified }}</strong> ({{ cmp.pinyin }})
                      </span>
                    </div>
                  </div>
                </div>
              </div>
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
          <span class="modal-badge">Bảng Tập Viết HSK</span>
          <h3 style="margin-left:0.5rem; display:flex; align-items:center; gap:0.5rem;">
            {{ practiceWord }} 
            <span style="font-size:1.1rem; color:#93c5fd; font-weight:normal;" v-if="practiceWordObj?.pinyin || currentWordData?.pinyin">
              ({{ practiceWordObj?.pinyin || currentWordData?.pinyin }})
            </span>
          </h3>
        </div>
        
        <div class="word-char-tabs" v-if="practiceWord && practiceWord.length > 1">
          <button 
            v-for="(c, idx) in practiceWord" 
            :key="idx" 
            class="char-tab-btn" 
            :class="{ active: practiceCharIndex === idx }"
            @click="switchPracticeChar(idx)"
          >
            {{ c }}
            <span class="status-dot" v-if="charCompletedStatus[idx]">✓</span>
          </button>
        </div>

        <button @click="closePractice" class="btn-close-modal tooltip" data-tooltip="Đóng (ESC)">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>

      <div class="modal-body practice-modal-grid">
        <div class="practice-left-col">
          <div v-if="practiceWord && practiceWord.length > 1" style="color:#38bdf8; font-size:1.15rem; text-align:center; margin-bottom:-0.5rem;">
            Đang tập viết nét chữ: <strong style="font-size:1.4rem; color:white;">"{{ currentChar }}"</strong>
          </div>
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
              <p>Bạn đã viết chính xác thứ tự nét chữ <strong style="color:var(--accent); font-size:1.3rem;">{{ currentChar }}</strong></p>
              
              <div class="success-actions mt-1" style="display:flex; gap:1rem; justify-content:center; flex-wrap:wrap;">
                <button @click="restartPractice" class="btn btn-secondary">Vẽ lại chữ này</button>
                <button 
                  v-if="practiceWord && practiceWord.length > 1 && practiceCharIndex < practiceWord.length - 1" 
                  @click="switchPracticeChar(practiceCharIndex + 1)" 
                  class="btn btn-primary btn-glow"
                >
                  👉 Chữ tiếp theo: "{{ practiceWord.charAt(practiceCharIndex + 1) }}"
                </button>
                <button v-else @click="closePractice" class="btn btn-primary btn-glow">Hoàn tất 🎉</button>
              </div>
            </div>
          </div>

          <div class="practice-hints">
            <div class="hint-item"><span>Số nét:</span> <strong>{{ currentWordData?.strokes }}</strong></div>
            <div class="hint-item"><span>Lỗi sai:</span> <strong class="text-error">{{ practiceMistakes }}</strong></div>
            <button @click="showNextHint" class="btn btn-outline btn-sm">Gợi ý nét tiếp theo</button>
          </div>
          
          <div class="practice-board-actions" style="display:flex; gap:1rem; width:100%; justify-content:center; margin-top:0.5rem;">
            <button @click="demoPractice" class="btn btn-secondary btn-sm">Xem Hướng Dẫn Nét</button>
            <button @click="restartPractice" class="btn btn-primary btn-sm">Xóa bảng & Vẽ lại</button>
          </div>
        </div>
        
        <div class="practice-right-col">
          <div class="practice-examples-box glass-panel">
            <div class="ex-header">
              <span class="ex-icon" style="font-size:1.5rem;">💡</span>
              <h4>Ví dụ & Mẫu câu ứng dụng với <span class="text-accent">{{ practiceWord }}</span></h4>
            </div>
            <div class="ex-sentences-list">
              <div v-for="(sen, idx) in getExamplesFor(practiceWord, practiceWordObj)" :key="idx" class="ex-sen-card">
                <div class="sen-top">
                  <span class="cn">{{ sen.cn }}</span>
                  <button class="btn-audio-mini tooltip" data-tooltip="Nghe câu này" @click="speak(sen.cn)">🔊</button>
                </div>
                <div class="py">{{ sen.py }}</div>
                <div class="vi">{{ sen.vi }}</div>
              </div>
            </div>
            
            <div class="related-compounds-section" v-if="getRelatedCompounds(practiceWord).length > 0 || getRelatedCompounds(currentChar).length > 0">
              <h5 class="comp-header">🌟 Từ ghép HSK liên quan</h5>
              <div class="comp-list-pills">
                <div 
                  v-for="cmp in (getRelatedCompounds(practiceWord).length > 0 ? getRelatedCompounds(practiceWord) : getRelatedCompounds(currentChar))" 
                  :key="cmp.simplified" 
                  class="comp-pill-card"
                  @click="openPracticeForWord(cmp.simplified, cmp)"
                >
                  <div class="comp-cn">{{ cmp.simplified }}</div>
                  <div class="comp-py">{{ cmp.pinyin }}</div>
                  <div class="comp-vi">{{ cmp.english || getHanVietWord(cmp.simplified) }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Add / Edit Word Modal -->
  <div class="practice-modal" :class="{ active: showAddModal }">
    <div class="modal-backdrop" @click="closeAddModal"></div>
    <div class="modal-container glass-panel" style="max-width: 600px; padding: 2rem; max-height: 90vh; overflow-y: auto;">
      <div class="modal-header" style="margin-bottom: 1.5rem;">
        <h3 style="color:#38bdf8; display:flex; align-items:center; gap:0.5rem;">
          <span>{{ newWordForm.isEdit ? '✏️ Chỉnh Sửa Từ Vựng' : '➕ Thêm Từ Vựng Mới' }}</span>
        </h3>
        <button @click="closeAddModal" class="btn-close-modal tooltip" data-tooltip="Đóng (ESC)">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>

      <div class="form-grid" style="display:flex; flex-direction:column; gap:1.2rem; text-align:left;">
        <div class="form-group">
          <label style="display:block; margin-bottom:0.4rem; color:#93c5fd; font-weight:bold;">🔑 Mã xác nhận (Mật khẩu)*</label>
          <input v-model="adminPass" type="password" placeholder="Nhập mã bảo mật (Pass là 111)..." class="custom-input" style="width:100%; padding:0.8rem; border-radius:8px; border:1px solid rgba(255,255,255,0.2); background:rgba(0,0,0,0.5); color:white;">
        </div>

        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:1rem;">
          <div class="form-group">
            <label style="display:block; margin-bottom:0.4rem; color:#93c5fd; font-weight:bold;">Chữ Hán (Simplified)*</label>
            <input v-model="newWordForm.simplified" type="text" placeholder="Ví dụ: 喜欢, 学习..." :disabled="newWordForm.isEdit" class="custom-input" style="width:100%; padding:0.8rem; border-radius:8px; border:1px solid rgba(255,255,255,0.2); background:rgba(0,0,0,0.5); color:white;">
          </div>
          <div class="form-group">
            <label style="display:block; margin-bottom:0.4rem; color:#93c5fd; font-weight:bold;">Pinyin*</label>
            <input v-model="newWordForm.pinyin" type="text" placeholder="Ví dụ: xǐ huān..." class="custom-input" style="width:100%; padding:0.8rem; border-radius:8px; border:1px solid rgba(255,255,255,0.2); background:rgba(0,0,0,0.5); color:white;">
          </div>
        </div>

        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:1rem;">
          <div class="form-group">
            <label style="display:block; margin-bottom:0.4rem; color:#93c5fd; font-weight:bold;">Nghĩa tiếng Việt*</label>
            <input v-model="newWordForm.vi" type="text" placeholder="Ví dụ: thích, yêu thích..." class="custom-input" style="width:100%; padding:0.8rem; border-radius:8px; border:1px solid rgba(255,255,255,0.2); background:rgba(0,0,0,0.5); color:white;">
          </div>
          <div class="form-group">
            <label style="display:block; margin-bottom:0.4rem; color:#93c5fd; font-weight:bold;">Nghĩa tiếng Anh (Tùy chọn)</label>
            <input v-model="newWordForm.english" type="text" placeholder="Ví dụ: to like, be fond of..." class="custom-input" style="width:100%; padding:0.8rem; border-radius:8px; border:1px solid rgba(255,255,255,0.2); background:rgba(0,0,0,0.5); color:white;">
          </div>
        </div>

        <div class="form-group">
          <label style="display:block; margin-bottom:0.4rem; color:#93c5fd; font-weight:bold;">Cấp độ HSK*</label>
          <select v-model="newWordForm.level" class="custom-input" style="width:100%; padding:0.8rem; border-radius:8px; border:1px solid rgba(255,255,255,0.2); background:rgba(15,23,42,0.95); color:white;">
            <option :value="1">HSK 1</option>
            <option :value="2">HSK 2</option>
            <option :value="3">HSK 3</option>
          </select>
        </div>

        <div class="form-group">
          <label style="display:block; margin-bottom:0.4rem; color:#93c5fd; font-weight:bold;">Ví dụ minh họa (Tùy chọn)</label>
          <input v-model="newWordForm.exampleCn" type="text" placeholder="Câu tiếng Trung (Vd: 我喜欢看书。)" class="custom-input mb-1" style="width:100%; padding:0.8rem; margin-bottom:0.5rem; border-radius:8px; border:1px solid rgba(255,255,255,0.2); background:rgba(0,0,0,0.5); color:white;">
          <input v-model="newWordForm.examplePy" type="text" placeholder="Pinyin (Vd: Wǒ xǐhuān kàn shū.)" class="custom-input mb-1" style="width:100%; padding:0.8rem; margin-bottom:0.5rem; border-radius:8px; border:1px solid rgba(255,255,255,0.2); background:rgba(0,0,0,0.5); color:white;">
          <input v-model="newWordForm.exampleVi" type="text" placeholder="Nghĩa tiếng Việt (Vd: Tôi thích đọc sách.)" class="custom-input" style="width:100%; padding:0.8rem; border-radius:8px; border:1px solid rgba(255,255,255,0.2); background:rgba(0,0,0,0.5); color:white;">
        </div>

        <div style="display:flex; justify-content:flex-end; gap:1rem; margin-top:1rem;">
          <button @click="closeAddModal" class="btn btn-outline" style="padding: 0.8rem 1.5rem;">Hủy bỏ</button>
          <button @click="saveCustomWord" class="btn btn-primary btn-glow" style="padding: 0.8rem 2rem;">Lưu Từ Vựng 💾</button>
        </div>
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
import { ref, reactive, computed, onMounted, nextTick, watch } from 'vue';
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
  mnemonic: true, components: true, variants: false, definition: true, examples: true
});

const grammarLevel = ref(1);
const masterSearch = ref('');

// Practice Modal State & Multi-character word practice
const showPracticeModal = ref(false);
const practiceWord = ref('赢');
const practiceWordObj = ref(null);
const practiceCharIndex = ref(0);
const charCompletedStatus = reactive({});
const expandedDict = reactive({});

// Add/Edit Word Modal State
const showAddModal = ref(false);
const adminPass = ref('');
const newWordForm = ref({
  simplified: '', pinyin: '', vi: '', english: '', level: 1, exampleCn: '', examplePy: '', exampleVi: '', isEdit: false
});
const customWords = ref(JSON.parse(localStorage.getItem('hsk_custom_words') || '[]'));

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

// Vietnamese Translation Mapping & Helpers
const engToViDict = {
  'hello': 'xin chào',
  'i; me': 'tôi, mình',
  'i, me': 'tôi, mình',
  'you': 'bạn, cậu, mày',
  'you (respectful)': 'ngài, ông, bà (trang trọng)',
  'he; him': 'anh ấy, hắn',
  'he, him': 'anh ấy, hắn',
  'she; her': 'cô ấy, bà ấy',
  'she, her': 'cô ấy, bà ấy',
  'it': 'nó, cái đó',
  'we; us': 'chúng tôi, chúng ta',
  'we, us': 'chúng tôi, chúng ta',
  'they; them': 'họ, chúng',
  'they, them': 'họ, chúng',
  'good; well': 'tốt, hay, khỏe, ngon',
  'good': 'tốt, hay',
  'bad': 'xấu, tồi',
  'love': 'yêu, tình yêu',
  'like; be fond of': 'thích, yêu thích',
  'like': 'thích, giống như',
  'thank you; thanks': 'cảm ơn',
  'thank you': 'cảm ơn',
  'goodbye; see you': 'tạm biệt, hẹn gặp lại',
  'goodbye': 'tạm biệt',
  'yes; correct': 'đúng, vâng, phải',
  'no; not': 'không',
  'no': 'không',
  'not': 'không (phủ định)',
  'have; possess': 'có, sở hữu',
  'have': 'có',
  'do not have; without': 'không có, chưa có',
  'friend': 'bạn bè, bằng hữu',
  'teacher': 'giáo viên, thầy cô giáo',
  'student': 'học sinh, sinh viên',
  'school': 'trường học',
  'university; college': 'đại học, trường đại học',
  'study; learn': 'học, học tập, nghiên cứu',
  'study': 'học tập',
  'work; job': 'công việc, làm việc',
  'work': 'làm việc, công việc',
  'doctor': 'bác sĩ',
  'hospital': 'bệnh viện',
  'police': 'cảnh sát, công an',
  'company': 'công ty, doanh nghiệp',
  'home; family': 'nhà, gia đình',
  'family; home': 'gia đình, nhà',
  'home': 'nhà',
  'house': 'ngôi nhà',
  'room': 'căn phòng',
  'door; gate': 'cửa, cổng',
  'eat': 'ăn',
  'drink': 'uống',
  'water': 'nước, nước lọc',
  'tea': 'trà, nước chè',
  'coffee': 'cà phê',
  'milk': 'sữa',
  'bread': 'bánh mì',
  'rice': 'gạo, cơm',
  'cooked rice; meal': 'cơm, bữa ăn',
  'noodle': 'mì, bún',
  'apple': 'quả táo',
  'banana': 'quả chuối',
  'fruit': 'trái cây, hoa quả',
  'meat; flesh': 'thịt',
  'fish': 'cá',
  'cat': 'mèo, con mèo',
  'dog': 'chó, con chó',
  'bird': 'chim, con chim',
  'book': 'sách, quyển sách',
  'pen': 'bút, cây bút',
  'newspaper': 'báo, tờ báo',
  'table; desk': 'bàn, cái bàn',
  'chair': 'ghế, cái ghế',
  'computer': 'máy tính',
  'phone; telephone': 'điện thoại',
  'mobile phone': 'điện thoại di động',
  'car': 'ô tô, xe hơi',
  'bus': 'xe buýt',
  'taxi': 'xe taxi',
  'train': 'xe lửa, tàu hỏa',
  'airplane; plane': 'máy bay',
  'money': 'tiền, tiền bạc',
  'buy': 'mua',
  'sell': 'bán',
  'shop; store': 'cửa hàng, tiệm',
  'clothes': 'quần áo, trang phục',
  'shoe': 'giày',
  'weather': 'thời tiết',
  'sun': 'mặt trời',
  'moon': 'mặt trăng',
  'rain': 'mưa',
  'snow': 'tuyết',
  'wind': 'gió',
  'hot': 'nóng, bức',
  'cold': 'lạnh, rét',
  'warm': 'ấm áp',
  'today': 'hôm nay',
  'tomorrow': 'ngày mai',
  'yesterday': 'hôm qua',
  'now': 'bây giờ, hiện tại',
  'morning': 'buổi sáng',
  'noon': 'buổi trưa',
  'afternoon': 'buổi chiều',
  'evening; night': 'buổi tối, ban đêm',
  'day': 'ngày, ban ngày',
  'month': 'tháng',
  'year': 'năm',
  'time': 'thời gian, giờ',
  'hour': 'giờ, tiếng đồng hồ',
  'minute': 'phút',
  'big; large': 'to, lớn, vĩ đại',
  'big': 'to, lớn',
  'small; little': 'nhỏ, bé, ít',
  'small': 'nhỏ, bé',
  'many; much': 'nhiều, đông',
  'few; little': 'ít, một ít',
  'beautiful; pretty': 'xinh đẹp, đẹp đẽ',
  'beautiful': 'đẹp',
  'happy; glad': 'vui vẻ, hạnh phúc, vui mừng',
  'happy': 'hạnh phúc, vui vẻ',
  'sad': 'buồn, buồn bã',
  'tired': 'mệt mỏi',
  'busy': 'bận rộn',
  'fast; quick': 'nhanh, mau',
  'slow': 'chậm, chậm chạp',
  'high; tall': 'cao',
  'low': 'thấp',
  'long': 'dài',
  'short': 'ngắn',
  'new': 'mới',
  'old': 'cũ, già',
  'who': 'ai, người nào',
  'what': 'cái gì, gì',
  'where': 'ở đâu, đâu',
  'when': 'khi nào, lúc nào',
  'why': 'tại sao, vì sao',
  'how': 'như thế nào, làm sao',
  'how much; how many': 'bao nhiêu, mấy',
  'this': 'này, cái này',
  'that': 'kia, cái kia, đó',
  'here': 'ở đây, nơi này',
  'there': 'ở kia, nơi đó',
  'and': 'và, với',
  'but': 'nhưng, nhưng mà',
  'or': 'hoặc, hay là',
  'because': 'bởi vì, vì',
  'so; therefore': 'cho nên, vì vậy',
  'in; inside': 'ở trong, trong',
  'out; outside': 'ở ngoài, ngoài',
  'on; above': 'ở trên, trên',
  'under; below': 'ở dưới, dưới',
  'front; in front of': 'phía trước, đằng trước',
  'back; behind': 'phía sau, đằng sau',
  'left': 'bên trái',
  'right': 'bên phải',
  'win': 'chiến thắng, thắng lợi',
  'delicious; tasty': 'ngon miệng, ngon',
  'listen; hear': 'nghe, lắng nghe',
  'see; look at; watch': 'xem, nhìn, quan sát',
  'say; speak; talk': 'nói, chuyện trò',
  'write': 'viết, ghi chép',
  'read': 'đọc, xem sách',
  'sit': 'ngồi',
  'stand': 'đứng',
  'walk': 'đi bộ',
  'run': 'chạy',
  'sleep': 'ngủ',
  'wake up': 'thức dậy',
  'open': 'mở',
  'close': 'đóng, tắt',
  'give': 'cho, đưa, tặng',
  'take': 'lấy, cầm',
  'come': 'đến, tới',
  'go': 'đi',
  'return; go back': 'trở về, quay lại',
  'can; be able to': 'có thể, biết làm',
  'want; wish': 'muốn, mong muốn',
  'need': 'cần, cần thiết',
  'know': 'biết, nhận biết',
  'think': 'nghĩ, suy nghĩ',
  'feel': 'cảm thấy',
  'understand': 'hiểu, thấu hiểu',
  'ask': 'hỏi, xin hỏi',
  'answer': 'trả lời, đáp án',
  'help': 'giúp đỡ, trợ giúp',
  'please': 'xin vui lòng, mời',
  'sorry; excuse me': 'xin lỗi',
  'sorry': 'xin lỗi',
  'excuse me': 'xin hỏi, xin thứ lỗi',
  'zero': 'số không',
  'one': 'một',
  'two': 'hai',
  'three': 'ba',
  'four': 'bốn',
  'five': 'năm',
  'six': 'sáu',
  'seven': 'bảy',
  'eight': 'tám',
  'nine': 'chín',
  'ten': 'mười',
  'hundred': 'trăm',
  'thousand': 'nghìn, ngàn',
  'father; dad': 'bố, cha',
  'mother; mom': 'mẹ, má',
  'elder brother': 'anh trai',
  'younger brother': 'em trai',
  'elder sister': 'chị gái',
  'younger sister': 'em gái',
  'son': 'con trai',
  'daughter': 'con gái',
  'child; kid': 'đứa trẻ, con cái',
  'man': 'đàn ông, nam giới',
  'woman': 'phụ nữ, nữ giới',
  'body': 'cơ thể, thân thể',
  'head': 'đầu',
  'eye': 'mắt',
  'ear': 'tai',
  'nose': 'mũi',
  'mouth': 'miệng',
  'hand': 'tay, bàn tay',
  'foot; leg': 'chân, bàn chân',
  'heart': 'trái tim, tâm trí',
  'color': 'màu sắc',
  'red': 'màu đỏ',
  'blue': 'màu xanh lam',
  'green': 'màu xanh lục',
  'yellow': 'màu vàng',
  'white': 'màu trắng',
  'black': 'màu đen',
  'movie; film': 'phim, điện ảnh',
  'music': 'âm nhạc',
  'song': 'bài hát',
  'picture; photo': 'bức ảnh, hình ảnh',
  'country; nation': 'quốc gia, đất nước',
  'city': 'thành phố',
  'road; street': 'con đường, phố xá',
  'tree': 'cây cối',
  'flower': 'bông hoa',
  'mountain': 'ngọn núi',
  'river': 'con sông',
  'sea; ocean': 'biển, đại dương',
  'sky': 'bầu trời'
};

const getVietnameseMeaning = (w) => {
  if (!w) return '';
  if (w.vi) return w.vi;
  if (!w.english) return '';
  const eng = w.english.toLowerCase().trim();
  if (engToViDict[eng]) return engToViDict[eng];
  
  const parts = eng.split(/;|,\s*/).map(p => p.trim()).filter(Boolean);
  const viList = [];
  parts.forEach(p => {
    if (engToViDict[p]) viList.push(engToViDict[p]);
  });
  
  if (viList.length > 0) return Array.from(new Set(viList.join(', ').split(', '))).join(', ');
  
  const result = [];
  for (let key in engToViDict) {
    if (eng.includes(key)) {
      result.push(engToViDict[key]);
    }
  }
  if (result.length > 0) return Array.from(new Set(result.join(', ').split(', '))).join(', ');
  
  return w.english;
};

// Computed
const matchWordQuery = (w, s) => {
  return w.simplified.toLowerCase().includes(s) || 
    w.pinyin.toLowerCase().includes(s) || 
    w.english.toLowerCase().includes(s) || 
    getVietnameseMeaning(w).toLowerCase().includes(s) ||
    getHanVietWord(w.simplified).toLowerCase().includes(s);
};

const filteredVocab = computed(() => {
  const words = hskData[currentLevel.value] || [];
  if (!vocabSearch.value.trim()) return words.slice(0, 100);
  const queries = vocabSearch.value.split('|').map(q => q.toLowerCase().trim()).filter(Boolean);
  if (queries.length === 0) return words.slice(0, 100);
  
  return words.filter(w => queries.some(q => matchWordQuery(w, q))).slice(0, 100);
});

const masterResults = computed(() => {
  if (!masterSearch.value.trim()) return [];
  const queries = masterSearch.value.split('|').map(q => q.toLowerCase().trim()).filter(Boolean);
  if (queries.length === 0) return [];
  
  const res = [];
  for (let level in hskData) {
    const list = hskData[level] || [];
    list.forEach(w => {
      if (queries.some(q => matchWordQuery(w, q))) {
        res.push(w);
      }
    });
  }
  return res.slice(0, 50);
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

watch(masterSearch, () => {
  if (masterSearch.value.trim()) {
    const res = masterResults.value;
    res.slice(0, 3).forEach(w => {
      expandedDict[w.simplified || w.char] = true;
    });
  }
});

const richSentenceDictionary = {
  '你好': [
    { cn: '你好！很高兴认识你。', py: 'Nǐ hǎo! Hěn gāoxìng rènshí nǐ.', vi: 'Xin chào! Rất vui được làm quen với bạn.' },
    { cn: '老师你好，请问这个字怎么写？', py: 'Lǎoshī nǐ hǎo, qǐngwèn zhège zì zěnme xiě?', vi: 'Chào cô/thầy, xin hỏi chữ này viết như thế nào?' }
  ],
  '喜欢': [
    { cn: '我很喜欢学习汉语。', py: 'Wǒ hěn xǐhuān xuéxí hànyǔ.', vi: 'Tôi rất thích học tiếng Trung.' },
    { cn: '你喜欢吃什么水果？', py: 'Nǐ xǐhuān chī shénme shuǐguǒ?', vi: 'Bạn thích ăn loại trái cây nào?' }
  ],
  '朋友': [
    { cn: '他是我的好朋友。', py: 'Tā shì wǒ de hǎo péngyǒu.', vi: 'Anh ấy là bạn tốt của tôi.' },
    { cn: '我们在大学认识了很多新朋友。', py: 'Wǒmen zài dàxué rènshí le hěn duō xīn péngyǒu.', vi: 'Chúng tôi đã quen rất nhiều bạn mới ở trường đại học.' }
  ],
  '我们': [
    { cn: '我们一起去图书馆看书吧。', py: 'Wǒmen yīqǐ qù túshūguǎn kàn shū ba.', vi: 'Chúng ta cùng đến thư viện đọc sách nhé.' },
    { cn: '我们都是留学生。', py: 'Wǒmen dōu shì liúxuéshēng.', vi: 'Chúng tôi đều là du học sinh.' }
  ],
  '学习': [
    { cn: '每天坚持学习汉语。', py: 'Měitiān jiānchí xuéxí hànyǔ.', vi: 'Kiên trì học tiếng Trung mỗi ngày.' },
    { cn: '学习一门外语非常有好处。', py: 'Xuéxí yī mén wàiyǔ fēicháng yǒu hǎochù.', vi: 'Học một ngoại ngữ mang lại rất nhiều lợi ích.' }
  ],
  '中国': [
    { cn: '中国有很多美丽的风景。', py: 'Zhōngguó yǒu hěn duō měilì de fēngjǐng.', vi: 'Trung Quốc có rất nhiều phong cảnh đẹp.' },
    { cn: '我想去中国吃地道的美食。', py: 'Wǒ xiǎng qù Zhōngguó chī dìdào de měishí.', vi: 'Tôi muốn đến Trung Quốc thưởng thức ẩm thực chuẩn vị.' }
  ],
  '老师': [
    { cn: '我们的汉语老师教得非常棒。', py: 'Wǒmen de hànyǔ lǎoshī jiāo de fēicháng bàng.', vi: 'Cô giáo tiếng Trung của chúng tôi dạy cực kỳ tuyệt vời.' },
    { cn: '王老师，谢谢您的悉心指导。', py: 'Wáng lǎoshī, xièxiè nín de xīxīn zhǐdǎo.', vi: 'Thầy Vương, cảm ơn sự hướng dẫn tận tình của thầy.' }
  ],
  '学生': [
    { cn: '教室里坐着三十名优秀的学生。', py: 'Jiàoshì lǐ zuòzhe sānshí míng yōuxiù de xuéshēng.', vi: 'Trong lớp học có ba mươi học sinh xuất sắc.' },
    { cn: '好学生总是按时完成作业。', py: 'Hǎo xuéshēng zǒngshì ànshí wánchéng zuòyè.', vi: 'Học sinh giỏi luôn hoàn thành bài tập đúng giờ.' }
  ],
  '今天': [
    { cn: '今天天气真好，阳光明媚。', py: 'Jīntiān tiānqì zhēn hǎo, yángguāng míngmèi.', vi: 'Thời tiết hôm nay thật đẹp, nắng rực rỡ.' },
    { cn: '今天晚上你有时间跟我去散步吗？', py: 'Jīntiān wǎnshàng nǐ yǒu shíjiān gēn wǒ qù sànbù ma?', vi: 'Tối nay bạn có thời gian đi dạo với tôi không?' }
  ],
  '明天': [
    { cn: '明天早上八点我们在校门口集合。', py: 'Míngtiān zǎoshang bā diǎn wǒmen zài xiào ménkǒu jíhé.', vi: 'Tám giờ sáng mai chúng ta tập trung ở cổng trường.' },
    { cn: '明天是一周新的开始。', py: 'Míngtiān shì yī zhōu xīn de kāishǐ.', vi: 'Ngày mai là khởi đầu cho một tuần mới.' }
  ],
  '学校': [
    { cn: '我的学校校园十分宽敞漂亮。', py: 'Wǒ de xuéxiào xiàoyúan shífēn kuānchǎng piàoliang.', vi: 'Khuôn viên trường học của tôi vô cùng rộng rãi và xinh đẹp.' },
    { cn: '学校图书馆里藏书上百万册。', py: 'Xuéxiào túshūguǎn lǐ cángshū shàng bǎiwān cè.', vi: 'Thư viện trường học lưu trữ hàng triệu đầu sách.' }
  ],
  '看': [
    { cn: '周末我们在家里看了一部好电影。', py: 'Zhōumò wǒmen zài jiālǐ kàn le yī bù hǎo diànyǐng.', vi: 'Cuối tuần chúng tôi ở nhà xem một bộ phim hay.' },
    { cn: '看书能丰富我们的内心世界。', py: 'Kàn shū néng fēngfù wǒmen de nèixīn shìjiè.', vi: 'Đọc sách giúp làm phong phú thế giới nội tâm của chúng ta.' }
  ],
  '听': [
    { cn: '我每天早起听十多分钟的中文新闻。', py: 'Wǒ měitiān zǎoqǐ tīng shí duō fēnzhōng de zhōngwén xīnwen.', vi: 'Mỗi sáng tôi dậy sớm nghe hơn mười phút tin tức tiếng Trung.' },
    { cn: '你喜欢听古典音乐还是流行歌？', py: 'Nǐ xǐhuān tīng gǔdiǎn yīnyuè háishì liúxíng gē?', vi: 'Bạn thích nghe nhạc cổ điển hay ca khúc thịnh hành?' }
  ],
  '说': [
    { cn: '他说一口流利的普通话。', py: 'Tā shuō yī kǒu liúlì de pǔtōnghuà.', vi: 'Anh ấy nói tiếng Trung phổ thông cực kỳ lưu loát.' },
    { cn: '请慢一点说，我正在认真记笔记。', py: 'Qǐng màn yīdiǎn shuō, wǒ zhèngzài rènzhēn jì bǐjì.', vi: 'Xin hãy nói chậm một chút, tôi đang chăm chú ghi chép.' }
  ],
  '写': [
    { cn: '写好汉字需要仔细记住笔画顺序。', py: 'Xiě hǎo hànzì xūyào zǐxì jìzhù bǐhuà shùnxù.', vi: 'Viết tốt chữ Hán cần ghi nhớ kỹ càng thứ tự nét.' },
    { cn: '他在本子上写下了一首诗。', py: 'Tā zài běnzi shàng xiě xià le yī shǒu shī.', vi: 'Anh ấy đã viết một bài thơ lên cuốn sổ tay.' }
  ],
  '高兴': [
    { cn: '能见到大家，我十分高兴。', py: 'Néng jiàndào dàjiā, wǒ shífēn gāoxìng.', vi: 'Được gặp mọi người, tôi vô cùng vui mừng.' },
    { cn: '高高兴兴出门去，平平安安回家来。', py: 'Gāogāoxìngxìng chūmén qù, píngpíng\'ān\'ān huíjiā lái.', vi: 'Vui vẻ bước ra ngoài, bình an trở về nhà.' }
  ],
  '工作': [
    { cn: '他对目前这份工作非常满意。', py: 'Tā duì mùqián zhè fèn gōngzuò fēicháng mǎnyì.', vi: 'Anh ấy rất hài lòng với công việc hiện tại.' },
    { cn: '他在一家科技公司担任软件工程师。', py: 'Tā zài yī jiā kējì gōngsī dānrèn ruǎnjiàn gōngchéngshī.', vi: 'Anh ấy làm kỹ sư phần mềm tại một công ty công nghệ.' }
  ],
  '家': [
    { cn: '家永远是我们温暖的避风港。', py: 'Jiā yǒngyuǎn shì wǒmen wēnnuǎn de bìfēnggǎng.', vi: 'Nhà luôn là bến đỗ bình yên ấm áp của chúng ta.' },
    { cn: '我家共有五口人。', py: 'Wǒ jiā gòng yǒu wǔ kǒu rén.', vi: 'Gia đình tôi có tổng cộng năm người.' }
  ],
  '好吃': [
    { cn: '这道四川火锅既麻辣又好吃。', py: 'Zhè dào Sìchuān huǒguō jì málà yòu hǎochī.', vi: 'Món lẩu Tứ Xuyên này vừa cay nồng vừa vô cùng ngon miệng.' },
    { cn: '妈妈做的家常菜永远是最好吃的。', py: 'Māma zuò de jiāchángcài yǒngyuǎn shì zuì hǎochī de.', vi: 'Món ăn gia đình mẹ nấu luôn là món ngon nhất.' }
  ],
  '爱': [
    { cn: '父母把全部的爱都给了孩子。', py: 'Fùmǔ bǎ quánbù de ài dōu gěi le háizi.', vi: 'Cha mẹ dành trọn vẹn tình yêu cho con cái.' },
    { cn: '爱是一种互相包容的力量。', py: 'Ài shì yī zhǒng hùxiāng bāoróng de lìliàng.', vi: 'Tình yêu là sức mạnh của sự bao dung lẫn nhau.' }
  ],
  '赢': [
    { cn: '只要坚持到底，我们就一定会赢。', py: 'Zhǐyào jiānchí dàodǐ, wǒmen jiù yīdìng huì yíng.', vi: 'Chỉ cần kiên trì đến cùng, chúng ta nhất định sẽ chiến thắng.' },
    { cn: '中国队赢得了这场重要的比赛。', py: 'Zhōngguó duì yíngdé le zhè chǎng zhòngyào de bǐsài.', vi: 'Đội tuyển Trung Quốc đã chiến thắng trận đấu quan trọng này.' }
  ],
  '好': [
    { cn: '多锻炼身体，保持好心情。', py: 'Duō duànliàn shēntǐ, bǎochí hǎo xīnqíng.', vi: 'Chăm chỉ rèn luyện thân thể, giữ gìn tâm trạng tốt.' },
    { cn: '好书就像良师益友。', py: 'Hǎo shū jiù xiàng liángshīyìyǒu.', vi: 'Sách hay giống như người thầy hiền bạn tốt.' }
  ],
  '我': [
    { cn: '我每天早起锻炼身体。', py: 'Wǒ měitiān zǎoqǐ duànliàn shēntǐ.', vi: 'Tôi mỗi sáng dậy sớm tập thể dục.' },
    { cn: '我相信只要付出汗水，梦想终将成真。', py: 'Wǒ xiāngxìn zhǐyào fūchū hànshuǐ, mèngxiǎng zhōng jiāng chéngzhēn.', vi: 'Tôi tin rằng chỉ cần đổ mồ hôi công sức, ước mơ chung quy sẽ thành hiện thực.' }
  ],
  '水': [
    { cn: '多喝温水对身体好。', py: 'Duō hē wēnshuǐ duì shēntǐ hǎo.', vi: 'Uống nhiều nước ấm tốt cho sức khỏe.' },
    { cn: '这里的山水风景如画。', py: 'Zhèlǐ de shānshuǐ fēngjǐng rú huà.', vi: 'Phong cảnh non nước nơi đây đẹp như tranh vẽ.' }
  ],
  '吃': [
    { cn: '中国传统的饺子非常好吃。', py: 'Zhōngguó chuántóng de jiǎozi fēicháng hǎochī.', vi: 'Bánh chẻo truyền thống của Trung Quốc vô cùng ngon.' },
    { cn: '多吃新鲜水果能保持健康。', py: 'Duō chī xīnxiān shuǐguǒ néng bǎochí jiànkāng.', vi: 'Ăn nhiều hoa quả tươi giúp duy trì sức khỏe.' }
  ],
  '茶': [
    { cn: '品茶令人心旷神怡。', py: 'Pǐn chá lìng rén xīnkuàngshényí.', vi: 'Thưởng trà khiến tâm hồn thư thái dễ chịu.' },
    { cn: '请喝一杯热茶暖暖身子吧。', py: 'Qǐng hē yī bēi rè chá nuǎnnuǎn shēnzi ba.', vi: 'Mời uống một ly trà nóng ấm người nhé.' }
  ],
  '猫': [
    { cn: '我家养了一只可爱的小白猫。', py: 'Wǒ jiā yǎng le yī zhī kě\'ài de xiǎo bái māo.', vi: 'Nhà tôi nuôi một chú mèo trắng nhỏ dễ thương.' },
    { cn: '小猫正在温暖的阳光下睡觉。', py: 'Xiǎo māo zhèngzài wēnnuǎn de yángguāng xià shuìjiào.', vi: 'Chú mèo nhỏ đang ngủ dưới ánh nắng ấm áp.' }
  ],
  '狗': [
    { cn: '小狗开心地摇着尾巴向主人跑来。', py: 'Xiǎo gǒu kāixīn de yáozhe wěibā xiàng zhǔrén pǎo lái.', vi: 'Chú chó nhỏ vui mừng vẫy đuôi chạy về phía chủ.' },
    { cn: '狗是人类最忠诚的朋友。', py: 'Gǒu shì rénlèi zuì zhōngchéng de péngyǒu.', vi: 'Chó là người bạn trung thành nhất của loài người.' }
  ]
};

const getDynamicExamples = (w) => {
  const word = w?.simplified || w?.char || currentChar.value || '';
  const pinyin = w?.pinyin || currentWordData.value?.pinyin || '';
  const meaning = w?.english || w?.hanviet || currentWordData.value?.hanviet || 'từ vựng';
  
  if (word.length === 1) {
    return [
      { cn: `学习这个新字 [ ${word} ] 很有意思。`, py: `Xuéxí zhège xīn zì [ ${pinyin || word} ] hěn yǒu yìsi.`, vi: `Học chữ mới [ ${word} ] này rất thú vị và ý nghĩa.` },
      { cn: `请问，汉字 [ ${word} ] 有几笔？`, py: `Qǐngwèn, hànzì [ ${word} ] yǒu jǐ bǐ?`, vi: `Xin hỏi, chữ Hán [ ${word} ] có mấy nét?` }
    ];
  } else {
    return [
      { cn: `我们在日常生活中经常会用到 [ ${word} ]。`, py: `Wǒmen zài rìcháng shēnghuó zhōng jīngcháng huì yòng dào [ ${pinyin || word} ].`, vi: `Chúng tôi thường xuyên sử dụng từ [ ${word} - ${meaning} ] trong đời sống hàng ngày.` },
      { cn: `老师在课堂上讲解了 [ ${word} ] 的正确用法。`, py: `Lǎoshī zài kètáng shàng jiǎngjiě le [ ${pinyin || word} ] de zhèngquè yòngfǎ.`, vi: `Thầy cô đã giải thích cách dùng chính xác của từ [ ${word} ] trên lớp.` }
    ];
  }
};

const getExamplesFor = (wordText, wordObj) => {
  if (!wordText) return [];
  if (wordObj && wordObj.exampleCn) {
    return [{ cn: wordObj.exampleCn, py: wordObj.examplePy || '', vi: wordObj.exampleVi || '' }];
  }
  const w = wordText.trim();
  if (richSentenceDictionary[w]) return richSentenceDictionary[w];
  
  const matched = sampleSentences.filter(s => s.cn.includes(w));
  if (matched.length > 0) return matched;
  
  return getDynamicExamples(wordObj || { simplified: w });
};

const getRelatedCompounds = (wordText) => {
  if (!wordText) return [];
  const target = wordText.trim();
  const res = [];
  for (let level in hskData) {
    const list = hskData[level] || [];
    list.forEach(item => {
      if (item.simplified && item.simplified !== target && item.simplified.includes(target)) {
        res.push(item);
      }
    });
  }
  const unique = [];
  const seen = new Set();
  res.forEach(item => {
    if (!seen.has(item.simplified)) {
      seen.add(item.simplified);
      unique.push(item);
    }
  });
  return unique.slice(0, 6);
};

const toggleDictExample = (wordText) => {
  if (!wordText) return;
  expandedDict[wordText] = !expandedDict[wordText];
};

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

const isSaved = (wordOrChar) => savedWords.value.some(w => (w.simplified || w.char) === wordOrChar || w.char === wordOrChar);

const toggleBookmarkWord = (wordObj) => {
  const word = wordObj?.simplified || wordObj?.char || currentChar.value;
  const idx = savedWords.value.findIndex(w => (w.simplified || w.char) === word || w.char === word);
  if (idx >= 0) {
    savedWords.value.splice(idx, 1);
    showToast('Đã xóa khỏi sổ tay từ vựng!');
  } else {
    savedWords.value.push({ 
      char: word, 
      simplified: word, 
      pinyin: wordObj?.pinyin || currentWordData.value?.pinyin || '', 
      hanviet: wordObj?.hanviet || getHanVietWord(word),
      english: wordObj?.english || currentWordData.value?.definition?.[0] || 'Từ vựng HSK'
    });
    showToast('Đã lưu vào sổ tay từ vựng! ✨');
  }
  localStorage.setItem('hanzi_saved_words', JSON.stringify(savedWords.value));
};

const toggleBookmark = (wordOrObj) => {
  let wordObj = typeof wordOrObj === 'string' ? { simplified: wordOrObj } : wordOrObj;
  toggleBookmarkWord(wordObj);
};

const showToast = (text) => {
  toast.text = text;
  toast.visible = true;
  setTimeout(() => { toast.visible = false; }, 3000);
};

// Add/Edit Modal Helpers
const openAddWordModal = () => {
  newWordForm.value = {
    simplified: '', pinyin: '', vi: '', english: '', level: Number(currentLevel.value) || 1, exampleCn: '', examplePy: '', exampleVi: '', isEdit: false
  };
  adminPass.value = '';
  showAddModal.value = true;
};

const openEditWordModal = (w, level = 1) => {
  newWordForm.value = {
    simplified: w.simplified || w.char,
    pinyin: w.pinyin || '',
    vi: w.vi || getVietnameseMeaning(w) || '',
    english: w.english || '',
    level: Number(level) || Number(currentLevel.value) || 1,
    exampleCn: w.exampleCn || '',
    examplePy: w.examplePy || '',
    exampleVi: w.exampleVi || '',
    isEdit: true
  };
  
  if (!w.exampleCn) {
    const exList = getExamplesFor(w.simplified || w.char, w);
    if (exList && exList.length > 0) {
      newWordForm.value.exampleCn = exList[0].cn;
      newWordForm.value.examplePy = exList[0].py;
      newWordForm.value.exampleVi = exList[0].vi;
    }
  }
  adminPass.value = '';
  showAddModal.value = true;
};

const closeAddModal = () => { showAddModal.value = false; };

const saveCustomWord = () => {
  if (adminPass.value !== '111') {
    showToast('❌ Mật khẩu không chính xác! (Pass là 111)');
    return;
  }
  const form = newWordForm.value;
  if (!form.simplified.trim() || !form.pinyin.trim() || !form.vi.trim()) {
    showToast('⚠️ Vui lòng điền đủ Chữ Hán, Pinyin và Nghĩa tiếng Việt!');
    return;
  }
  
  const lvl = Number(form.level);
  if (!hskData[lvl]) hskData[lvl] = [];
  
  const wordObj = {
    simplified: form.simplified.trim(),
    pinyin: form.pinyin.trim(),
    vi: form.vi.trim(),
    english: form.english.trim() || form.vi.trim(),
    level: lvl,
    exampleCn: form.exampleCn.trim(),
    examplePy: form.examplePy.trim(),
    exampleVi: form.exampleVi.trim()
  };
  
  if (wordObj.english) {
    engToViDict[wordObj.english.toLowerCase()] = wordObj.vi;
  }
  
  const existIdx = hskData[lvl].findIndex(w => w.simplified === wordObj.simplified);
  if (existIdx !== -1) {
    hskData[lvl][existIdx] = { ...hskData[lvl][existIdx], ...wordObj };
  } else {
    hskData[lvl].unshift(wordObj);
  }
  
  const cwList = customWords.value;
  const cwIdx = cwList.findIndex(w => w.simplified === wordObj.simplified);
  if (cwIdx !== -1) {
    cwList[cwIdx] = { ...cwList[cwIdx], ...wordObj };
  } else {
    cwList.unshift(wordObj);
  }
  localStorage.setItem('hsk_custom_words', JSON.stringify(cwList));
  customWords.value = cwList;
  
  showToast(`🎉 ${form.isEdit ? 'Cập nhật' : 'Thêm mới'} từ [${wordObj.simplified}] thành công!`);
  showAddModal.value = false;
};

// Practice Modal Helper
const openPracticeForWord = (word, wordObj = null) => {
  if (!word) return;
  practiceWord.value = word;
  practiceWordObj.value = wordObj;
  practiceCharIndex.value = 0;
  currentChar.value = word.charAt(0);
  
  Object.keys(charCompletedStatus).forEach(k => delete charCompletedStatus[k]);
  for (let i = 0; i < word.length; i++) charCompletedStatus[i] = false;
  
  currentWordData.value = richCharData[currentChar.value] || getFallbackCharData(currentChar.value);

  showPracticeModal.value = true;
  nextTick(() => { initPractice(); });
};

const switchPracticeChar = (idx) => {
  if (idx < 0 || idx >= practiceWord.value.length) return;
  practiceCharIndex.value = idx;
  currentChar.value = practiceWord.value.charAt(idx);
  currentWordData.value = richCharData[currentChar.value] || getFallbackCharData(currentChar.value);
  if (practiceWriterInstance) practiceWriterInstance.cancelQuiz();
  initPractice();
};

const openPractice = () => {
  openPracticeForWord(currentChar.value);
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
      charCompletedStatus[practiceCharIndex.value] = true;
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
  const baseUrl = import.meta.env.BASE_URL || '/';

  // Load Han Viet map from local
  try {
    const hvRes = await fetch(`${baseUrl}data/hanviet.json`);
    if (hvRes.ok) Object.assign(hanvietMap, await hvRes.json());
  } catch (err) { console.log('Hanviet load error:', err); }

  // Load HSK from local
  const hskUrls = {
    1: `${baseUrl}data/hsk1.json`,
    2: `${baseUrl}data/hsk2.json`,
    3: `${baseUrl}data/hsk3.json`
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
    console.error('HSK Local Fetch Error:', err);
    loadingVocab.value = false;
  }

  // Load custom words from localStorage into reactive hskData
  customWords.value.forEach(cw => {
    const lvl = Number(cw.level) || 1;
    if (!hskData[lvl]) hskData[lvl] = [];
    const existIdx = hskData[lvl].findIndex(w => w.simplified === cw.simplified);
    if (existIdx !== -1) {
      hskData[lvl][existIdx] = { ...hskData[lvl][existIdx], ...cw };
    } else {
      hskData[lvl].unshift(cw);
    }
  });

  loadCharacter('赢');
});
</script>
