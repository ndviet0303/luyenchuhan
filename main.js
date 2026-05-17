document.addEventListener('DOMContentLoaded', () => {

    // =========================================================================
    // 1. APP STATE & CACHED DATA
    // =========================================================================
    const state = {
        hskData: {
            1: [], 2: [], 3: [], 4: [], 5: [], 6: []
        },
        hanvietMap: {},
        savedWords: JSON.parse(localStorage.getItem('hanzi_saved_words') || '[]'),
        activeTab: 'character',
        currentLevel: 1,
        currentChar: '赢',
        currentWordData: null,
        
        // Writer instances
        heroWriter: null,
        practiceWriter: null,
        practiceMistakes: 0
    };

    // Fallback/Demo rich character database for WOW effect
    const richCharData = {
        '赢': {
            pinyin: 'yíng',
            hanviet: 'DOANH',
            structure: '⿳亡口贝',
            etymology: 'Hình thanh (Phono-semantic)',
            radical: 'BỐI 貝 (bèi)',
            strokes: 17,
            mnemonic: 'Chữ Doanh (赢) gồm 5 thành phần: MANG 亡 (hy sinh), KHẨU 口 (giao tiếp), NGUYỆT 月 (thời gian), BỐI 贝 (tiền tài), và PHÀM 凡 (bình phàm). Để chiến thắng cần cống hiến, giao tiếp tốt, kiên nhẫn, đầu tư đúng cách và luôn giữ thái độ khiêm tốn!',
            components: [
                { char: '亡', name: 'MANG (wáng)', desc: 'Mất mát, hy sinh, bỏ trốn' },
                { char: '口', name: 'KHẨU (kǒu)', desc: 'Cái miệng, lời nói, nhân khẩu' },
                { char: '月', name: 'NGUYỆT (yuè)', desc: 'Mặt trăng, tháng, thời gian' },
                { char: '貝', name: 'BỐI (bèi)', desc: 'Bảo bối, vỏ sò, tiền tài' },
                { char: '凡', name: 'PHÀM (fán)', desc: 'Bình thường, phàm tục' }
            ],
            variants: { sim: '赢', tra: '贏' },
            definition: [
                '1. Thắng lợi, chiến thắng: Đạt được thành công trong thi đấu hoặc kinh doanh (đối lập với thua 输).',
                '2. Thu được lợi nhuận: Kiếm được tiền lời, sinh lời (ví dụ: 赢利 - doanh lợi).',
                '3. Ví dụ phổ biến: 赢得 (giành được), 双赢 (đôi bên cùng có lợi - win-win).'
            ]
        },
        '爱': {
            pinyin: 'ài',
            hanviet: 'ÁI',
            structure: '⿳爫冖友',
            etymology: 'Hội ý (Ideogram)',
            radical: 'TÂM 心 (xīn)',
            strokes: 10,
            mnemonic: 'Chữ Ái (爱 - tình yêu) trong phồn thể (愛) có bộ Tâm 心 ở giữa, thể hiện tình yêu từ trái tim. Giản thể đổi thành bộ Hữu 友 (bạn bè), ngụ ý tình yêu bắt nguồn từ sự thấu hiểu và tình bạn chân thành!',
            components: [
                { char: '爫', name: 'TRẢO (zhǎo)', desc: 'Móng vuốt, nắm bắt' },
                { char: '冖', name: 'MỊCH (mì)', desc: 'Dải lụa che phủ, bao bọc' },
                { char: '友', name: 'HỮU (yǒu)', desc: 'Bạn bè, tình hữu nghị' }
            ],
            variants: { sim: '爱', tra: '愛' },
            definition: [
                '1. Yêu thương, kính trọng: Cảm xúc yêu mến sâu sắc giữa con người (ví dụ: 爱情 - ái tình).',
                '2. Sở thích, thói quen: Rất thích làm việc gì đó (ví dụ: 爱好 - sở thích).',
                '3. Trân trọng, bảo vệ: Giữ gìn điều quý giá (ví dụ: 爱护 - ái hộ, bảo vệ).'
            ]
        },
        '好': {
            pinyin: 'hǎo / hào',
            hanviet: 'HẢO / HIẾU',
            structure: '⿰女子',
            etymology: 'Hội ý (Ideogram)',
            radical: 'NỮ 女 (nǚ)',
            strokes: 6,
            mnemonic: 'Chữ Hảo (好) ghép bởi bộ NỮ (女 - phụ nữ/người mẹ) và bộ TỬ (子 - con cái). Người mẹ ôm đứa con vào lòng là hình ảnh đẹp đẽ, hạnh phúc và an lành nhất thế gian!',
            components: [
                { char: '女', name: 'NỮ (nǚ)', desc: 'Phụ nữ, người con gái, phái đẹp' },
                { char: '子', name: 'TỬ (zǐ)', desc: 'Đứa trẻ, con cái, bậc tử sư' }
            ],
            variants: { sim: '好', tra: '好' },
            definition: [
                '1. Tốt, hay, đẹp: Chất lượng xuất sắc, vừa ý (ví dụ: 好人 - người tốt).',
                '2. Rất, lắm (Phó từ): Dùng để nhấn mạnh (ví dụ: 好看 - rất đẹp, 好吃 - ngon).',
                '3. Hào hứng, hiếu kỳ (hào): Thích thú điều gì đó (ví dụ: 好奇 - hiếu kỳ).'
            ]
        },
        '我': {
            pinyin: 'wǒ',
            hanviet: 'NGÃ',
            structure: '⿰手戈',
            etymology: 'Tượng hình (Pictogram)',
            radical: 'QUA 戈 (gē)',
            strokes: 7,
            mnemonic: 'Chữ Ngã (我 - bản thân) có nguồn gốc từ hình ảnh bàn tay cầm vũ khí (bộ Qua 戈). Ngụ ý: Mỗi cá nhân phải tự đứng lên bảo vệ quyền lợi và lý tưởng của chính mình!',
            components: [
                { char: '手', name: 'THỦ (shǒu)', desc: 'Bàn tay (biến thể)' },
                { char: '戈', name: 'QUA (gē)', desc: 'Vũ khí cổ, ngọn giáo' }
            ],
            variants: { sim: '我', tra: '我' },
            definition: [
                '1. Tôi, ta, bản thân (Đại từ nhân xưng ngôi thứ nhất): Chỉ chính mình (ví dụ: 我们 - chúng tôi).',
                '2. Cái tôi (Triết học): Ngã, bản ngã (ví dụ: 自我 - tự ngã).'
            ]
        },
        '学': {
            pinyin: 'xué',
            hanviet: 'HỌC',
            structure: '⿳⺍冖子',
            etymology: 'Hội ý (Ideogram)',
            radical: 'TỬ 子 (zǐ)',
            strokes: 8,
            mnemonic: 'Chữ Học (学) miêu tả một đứa trẻ (TỬ 子) đang ngồi trong lớp học dưới mái nhà (MỊCH 冖) và hai tay nâng niu kiến thức (⺍). Học tập là quá trình trau dồi tri thức từ thủa bé!',
            components: [
                { char: '⺍', name: 'TIỂU (xiǎo)', desc: 'Biến thể của hai bàn tay nâng' },
                { char: '冖', name: 'MỊCH (mì)', desc: 'Mái nhà, bao trùm' },
                { char: '子', name: 'TỬ (zǐ)', desc: 'Con cái, học trò, đứa trẻ' }
            ],
            variants: { sim: '学', tra: '學' },
            definition: [
                '1. Học tập, nghiên cứu: Tiếp thu tri thức, rèn luyện kỹ năng (ví dụ: 学习 - học tập).',
                '2. Trường học, môn học: Cơ sở giáo dục hoặc lĩnh vực khoa học (ví dụ: 学校 - trường học, 科学 - khoa học).'
            ]
        }
    };

    // Generic fallback generator for characters not in richCharData
    const getFallbackCharData = (char, pinyinStr = '...') => {
        const hv = state.hanvietMap[char] || 'HÁN TỰ';
        return {
            pinyin: pinyinStr !== '...' ? pinyinStr : 'Pinyin',
            hanviet: hv.toUpperCase(),
            structure: '⿰ / ⿳ / ⿴',
            etymology: 'Hình thanh / Hội ý',
            radical: 'TRA CỨU TRỰC TUYẾN',
            strokes: '8 - 15',
            mnemonic: `Chữ ${char} (âm Hán Việt: ${hv}) là một từ vựng HSK tiêu chuẩn. Hãy luyện viết kỹ thứ tự từng nét trên bảng tương tác để ghi nhớ sâu sắc!`,
            components: [{ char: char, name: `${hv} (${pinyinStr})`, desc: 'Thành phần gốc' }],
            variants: { sim: char, tra: char },
            definition: [`Ý nghĩa cơ bản của từ [${char}] trong hệ thống từ vựng tiếng Trung phổ thông.`]
        };
    };


    // =========================================================================
    // 2. DATA FETCHING ON INITIALIZATION
    // =========================================================================
    async function loadInitialData() {
        // Fetch Hanviet dictionary
        try {
            const hvRes = await fetch('https://raw.githubusercontent.com/vanvuvuong/japanese_anki_generator/master/data/hanviet.json');
            if (hvRes.ok) {
                state.hanvietMap = await hvRes.json();
            }
        } catch (err) {
            console.log('Hanviet load err, using defaults');
        }

        // Fetch HSK 1, 2, 3 asynchronously
        const hskUrls = {
            1: 'https://raw.githubusercontent.com/koynoyno/hsk3.0-json/main/hsk1.json',
            2: 'https://raw.githubusercontent.com/koynoyno/hsk3.0-json/main/hsk2.json',
            3: 'https://raw.githubusercontent.com/koynoyno/hsk3.0-json/main/hsk3.json'
        };

        try {
            for (let level in hskUrls) {
                const res = await fetch(hskUrls[level]);
                if (res.ok) {
                    const data = await res.json();
                    state.hskData[level] = data.words || [];
                }
            }
            document.getElementById('vocab-loader').style.display = 'none';
            renderVocabList(1);
            updateBookmarkBadge();
        } catch (err) {
            console.error('HSK Fetch Error:', err);
            document.getElementById('vocab-loader').innerHTML = '<p class="text-error">Không thể tải dữ liệu HSK từ GitHub. Đang dùng dữ liệu demo.</p>';
        }

        // Initialize Tab 2 character
        loadCharacterView('赢');
        renderGrammar(1);
        renderSentences();
    }


    // =========================================================================
    // 3. TAB NAVIGATION
    // =========================================================================
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.dataset.tab;
            state.activeTab = targetTab;
            
            tabButtons.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));
            
            btn.classList.add('active');
            document.getElementById(`tab-${targetTab}`).classList.add('active');

            if (targetTab === 'dict') {
                renderDictResults();
            }
        });
    });


    // =========================================================================
    // 4. TAB 1: TỪ VỰNG DASHBOARD
    // =========================================================================
    const hskLevelButtons = document.querySelectorAll('.hsk-btn');
    const vocabGrid = document.getElementById('vocab-grid');
    const vocabSearchInput = document.getElementById('vocab-search');

    hskLevelButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            hskLevelButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.currentLevel = parseInt(btn.dataset.level);
            renderVocabList(state.currentLevel, vocabSearchInput.value);
        });
    });

    vocabSearchInput.addEventListener('input', (e) => {
        renderVocabList(state.currentLevel, e.target.value);
    });

    function renderVocabList(level, searchStr = '') {
        const words = state.hskData[level] || [];
        if (words.length === 0) {
            vocabGrid.innerHTML = '<p class="text-muted" style="padding:2rem;">Chưa có dữ liệu hoặc danh sách rỗng.</p>';
            return;
        }

        let filtered = words;
        if (searchStr.trim() !== '') {
            const s = searchStr.toLowerCase().trim();
            filtered = words.filter(w => 
                w.simplified.toLowerCase().includes(s) ||
                w.pinyin.toLowerCase().includes(s) ||
                w.english.toLowerCase().includes(s)
            );
        }

        // Cap at 100 for performance
        const displayWords = filtered.slice(0, 100);

        vocabGrid.innerHTML = displayWords.map(w => {
            const char = w.simplified;
            const py = w.pinyin;
            const eng = w.english;
            
            // Get Han Viet for full word
            const hvArray = Array.from(char).map(c => state.hanvietMap[c] || c);
            const hv = hvArray.join(' ');

            return `
                <div class="vocab-card" data-char="${char}" data-pinyin="${py}">
                    <div class="vocab-top">
                        <span class="vocab-char">${char}</span>
                        <span class="vocab-pinyin">${py}</span>
                    </div>
                    <div class="vocab-hanviet">${hv}</div>
                    <div class="vocab-eng">${eng}</div>
                </div>
            `;
        }).join('');

        // Attach click listeners to switch to character view
        document.querySelectorAll('.vocab-card').forEach(card => {
            card.addEventListener('click', () => {
                const char = card.dataset.char;
                // Switch to first character of the word
                const targetChar = char.charAt(0);
                loadCharacterView(targetChar, card.dataset.pinyin);
                
                // Switch active tab to Character Tab
                document.querySelector('.tab-btn[data-tab="character"]').click();
            });
        });
    }


    // =========================================================================
    // 5. TAB 2: HÁN TỰ DETAIL & INTERACTIVE HERO
    // =========================================================================
    const charSearchInput = document.getElementById('char-search-input');
    const charSearchBtn = document.getElementById('char-search-btn');
    const bookmarkWordBtn = document.getElementById('bookmark-word-btn');
    const audioSpeakBtn = document.getElementById('audio-speak-btn');
    
    charSearchBtn.addEventListener('click', () => {
        const query = charSearchInput.value.trim();
        if (query.length > 0) {
            loadCharacterView(query.charAt(0));
        }
    });

    charSearchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') charSearchBtn.click();
    });

    document.querySelectorAll('.quick-tag').forEach(tag => {
        tag.addEventListener('click', () => {
            loadCharacterView(tag.textContent.trim());
        });
    });

    function loadCharacterView(char, pinyinHint = '...') {
        state.currentChar = char;
        charSearchInput.value = char;

        // Fetch rich data or fallback
        const data = richCharData[char] || getFallbackCharData(char, pinyinHint);
        state.currentWordData = data;

        // Render UI Elements
        document.getElementById('hero-pinyin').textContent = data.pinyin;
        document.getElementById('hero-structure').textContent = data.structure;
        document.getElementById('hero-etymology').textContent = data.etymology;
        document.getElementById('hero-radical').textContent = data.radical;
        document.getElementById('hero-strokes').textContent = data.strokes + ' nét';
        document.getElementById('hero-mnemonic').innerHTML = data.mnemonic;
        document.getElementById('hero-hanviet').textContent = data.hanviet;

        // Components
        const compContainer = document.getElementById('hero-components');
        compContainer.innerHTML = data.components.map(c => `
            <li>
                <span class="comp-char">${c.char}</span>
                <div class="comp-info">
                    <span class="comp-name">${c.name}</span>
                    <span class="comp-desc">${c.desc}</span>
                </div>
            </li>
        `).join('');

        // Variants
        const varContainer = document.getElementById('hero-variants');
        varContainer.innerHTML = `
            <div class="var-item">
                <span>Giản thể:</span>
                <strong class="char-lg">${data.variants.sim}</strong>
            </div>
            <div class="var-item">
                <span>Phồn thể:</span>
                <strong class="char-lg">${data.variants.tra}</strong>
            </div>
        `;

        // Definition
        const defContainer = document.getElementById('hero-definition');
        defContainer.innerHTML = data.definition.map(d => `<p class="dict-entry">${d}</p>`).join('');

        // Check bookmark status
        checkBookmarkState();

        // Initialize Hero HanziWriter
        initHeroWriter(char);
    }

    function initHeroWriter(char) {
        document.getElementById('hero-writer').innerHTML = '';
        state.heroWriter = HanziWriter.create('hero-writer', char, {
            width: 280, height: 280,
            padding: 10,
            strokeColor: '#f1f5f9',
            radicalColor: '#38bdf8',
            outlineColor: '#334155',
            showCharacter: true,
            delayBetweenStrokes: 120,
            delayBetweenLoops: 2000 // 2 seconds pause before restarting loop
        });
        
        // Auto-start looping animation after a short initial delay
        setTimeout(() => {
            if (state.heroWriter) state.heroWriter.loopCharacterAnimation();
        }, 500);
    }

    document.getElementById('hero-demo-btn').addEventListener('click', () => {
        if (state.heroWriter) state.heroWriter.loopCharacterAnimation();
    });

    document.getElementById('hero-reset-btn').addEventListener('click', () => {
        if (state.heroWriter) {
            state.heroWriter.pauseAnimation();
            initHeroWriter(state.currentChar);
        }
    });

    // TTS Web Speech API
    audioSpeakBtn.addEventListener('click', () => {
        speakChinese(state.currentChar);
    });

    function speakChinese(text) {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'zh-CN';
            utterance.rate = 0.85;
            window.speechSynthesis.speak(utterance);
        } else {
            showToast('Trình duyệt không hỗ trợ đọc phát âm!');
        }
    }

    // Accordion Toggles
    document.querySelectorAll('.accordion-header').forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            item.classList.toggle('open');
        });
    });


    // =========================================================================
    // 6. BOOKMARK & SAVED WORDS LOGIC
    // =========================================================================
    bookmarkWordBtn.addEventListener('click', () => {
        const char = state.currentChar;
        const existsIndex = state.savedWords.findIndex(w => w.char === char);
        
        if (existsIndex >= 0) {
            state.savedWords.splice(existsIndex, 1);
            showToast('Đã xóa khỏi sổ tay từ vựng!');
        } else {
            state.savedWords.push({
                char: char,
                pinyin: state.currentWordData.pinyin,
                hanviet: state.currentWordData.hanviet
            });
            showToast('Đã lưu vào sổ tay từ vựng! ✨');
        }
        
        localStorage.setItem('hanzi_saved_words', JSON.stringify(state.savedWords));
        checkBookmarkState();
        updateBookmarkBadge();
        if (state.activeTab === 'dict') renderDictResults();
    });

    function checkBookmarkState() {
        const isSaved = state.savedWords.some(w => w.char === state.currentChar);
        if (isSaved) {
            bookmarkWordBtn.classList.add('saved');
            bookmarkWordBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>';
        } else {
            bookmarkWordBtn.classList.remove('saved');
            bookmarkWordBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>';
        }
    }

    function updateBookmarkBadge() {
        document.getElementById('bookmark-badge').textContent = state.savedWords.length;
    }

    document.getElementById('global-bookmark-btn').addEventListener('click', () => {
        document.querySelector('.tab-btn[data-tab="dict"]').click();
    });


    // =========================================================================
    // 7. PRACTICE MODAL QUIZ MODE
    // =========================================================================
    const startPracticeBtn = document.getElementById('start-practice-btn');
    const practiceModal = document.getElementById('practice-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const quizSuccessOverlay = document.getElementById('quiz-success-overlay');
    const nextPracticeBtn = document.getElementById('next-practice-btn');

    startPracticeBtn.addEventListener('click', () => {
        practiceModal.classList.add('active');
        document.getElementById('modal-char-title').textContent = `${state.currentChar} (${state.currentWordData.pinyin})`;
        document.getElementById('modal-stroke-num').textContent = state.currentWordData.strokes;
        initPracticeQuiz(state.currentChar);
    });

    closeModalBtn.addEventListener('click', () => {
        practiceModal.classList.remove('active');
        if (state.practiceWriter) state.practiceWriter.cancelQuiz();
    });

    nextPracticeBtn.addEventListener('click', () => {
        initPracticeQuiz(state.currentChar);
    });

    document.getElementById('modal-clear-btn').addEventListener('click', () => {
        initPracticeQuiz(state.currentChar);
    });

    document.getElementById('modal-demo-btn').addEventListener('click', () => {
        if (state.practiceWriter) {
            state.practiceWriter.cancelQuiz();
            state.practiceWriter.animateCharacter({
                onComplete: () => startQuizSession()
            });
        }
    });

    document.getElementById('modal-hint-btn').addEventListener('click', () => {
        if (state.practiceWriter) {
            state.practiceWriter.quiz({ showHintAfterMisses: 1 });
            // Simulate mistake to show hint immediately
            showToast('Hãy quan sát nét vẽ nhấp nháy trên bảng');
        }
    });

    function initPracticeQuiz(char) {
        quizSuccessOverlay.classList.remove('active');
        state.practiceMistakes = 0;
        document.getElementById('modal-mistake-num').textContent = 0;

        const container = document.getElementById('practice-canvas');
        container.innerHTML = '';

        const size = Math.min(window.innerWidth * 0.85, 360);

        state.practiceWriter = HanziWriter.create('practice-canvas', char, {
            width: size, height: size,
            padding: 15,
            strokeColor: '#ec4899', // Pink drawing line
            highlightColor: '#38bdf8', // Hint color
            outlineColor: '#334155',
            showOutline: true,
            showCharacter: false
        });

        startQuizSession();
    }

    function startQuizSession() {
        if (!state.practiceWriter) return;
        quizSuccessOverlay.classList.remove('active');

        state.practiceWriter.quiz({
            showHintAfterMisses: 2,
            onMistake: (strokeData) => {
                state.practiceMistakes++;
                document.getElementById('modal-mistake-num').textContent = state.practiceMistakes;
            },
            onComplete: (summaryData) => {
                quizSuccessOverlay.classList.add('active');
                speakChinese(state.currentChar);
            }
        });
    }


    // =========================================================================
    // 8. TAB 3: NGỮ PHÁP DASHBOARD
    // =========================================================================
    window.filterGrammar = (level) => {
        document.querySelectorAll('.level-tabs .btn').forEach((b, idx) => {
            b.classList.toggle('active', idx === level - 1);
        });
        renderGrammar(level);
    };

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

    function renderGrammar(level) {
        const container = document.getElementById('grammar-list');
        const list = grammarData[level] || grammarData[1];
        container.innerHTML = list.map(g => `
            <div class="glass-panel grammar-card">
                <h3>${g.title}</h3>
                <span class="pinyin-sub">Cấu trúc: ${g.py}</span>
                <div class="example-box">${g.ex}</div>
            </div>
        `).join('');
    }


    // =========================================================================
    // 9. TAB 4: MẪU CÂU GIAO TIẾP
    // =========================================================================
    const sampleSentences = [
        { cn: '你好！认识你很高兴。', py: 'Nǐ hǎo! Rènshí nǐ hěn gāoxìng.', vi: 'Xin chào! Rất vui được làm quen với bạn.' },
        { cn: '请问，这个字怎么写？', py: 'Qǐngwèn, zhège zì zěnme xiě?', vi: 'Xin hỏi, chữ này viết như thế nào?' },
        { cn: '祝你学习进步，天天向上。', py: 'Zhù nǐ xuéxí jìnbù, tiāntiān xiàngshàng.', vi: 'Chúc bạn học tập tiến bộ, mỗi ngày một vươn lên.' },
        { cn: '不经一番寒彻骨，怎得梅花扑鼻香。', py: 'Bù jīng yī fān hán chègǔ, zěn dé méihuā pūbí xiāng.', vi: 'Không trải qua sương lạnh buốt xương, sao ngửi được mùi hoa mai thơm nức.' }
    ];

    function renderSentences() {
        const grid = document.getElementById('sentences-grid');
        grid.innerHTML = sampleSentences.map((s, idx) => `
            <div class="glass-panel sentence-card">
                <div class="sen-left">
                    <span class="sen-cn">${s.cn}</span>
                    <span class="sen-py">${s.py}</span>
                    <span class="sen-vi">${s.vi}</span>
                </div>
                <button class="audio-btn" onclick="speakChinese('${s.cn}')">🔊</button>
            </div>
        `).join('');
    }


    // =========================================================================
    // 10. TAB 5: TRUNG VIỆT DICTIONARY & SAVED WORDS
    // =========================================================================
    const masterDictSearch = document.getElementById('master-dict-search');
    
    masterDictSearch.addEventListener('input', (e) => {
        renderDictResults(e.target.value);
    });

    function renderDictResults(searchStr = '') {
        const container = document.getElementById('dict-results');
        
        // Default show saved words if no query
        if (searchStr.trim() === '') {
            if (state.savedWords.length === 0) {
                container.innerHTML = `
                    <div class="glass-panel text-center" style="padding:4rem 2rem;">
                        <p style="font-size:3rem; margin-bottom:1rem;">📓</p>
                        <h3 style="margin-bottom:0.5rem;">Sổ tay từ vựng của bạn đang trống!</h3>
                        <p class="text-muted">Hãy tra cứu và bấm nút Bookmark ở bất kỳ từ nào để lưu vào đây.</p>
                    </div>
                `;
                return;
            }

            container.innerHTML = `
                <h3 style="margin-bottom:1rem; color:#38bdf8;">Sổ Tay Từ Vựng Của Bạn (${state.savedWords.length} từ)</h3>
                ${state.savedWords.map(w => `
                    <div class="dict-row" data-char="${w.char}">
                        <div class="dict-char-col">
                            <span class="cn">${w.char}</span>
                            <span class="py">${w.pinyin}</span>
                            <span class="hv">[Hán Việt: ${w.hanviet}]</span>
                        </div>
                        <button class="btn btn-outline btn-sm">Luyện viết ✍️</button>
                    </div>
                `).join('')}
            `;
            attachDictRowClicks();
            return;
        }

        // Perform search across HSK 1,2,3 data
        const s = searchStr.toLowerCase().trim();
        const results = [];
        for (let level in state.hskData) {
            const list = state.hskData[level] || [];
            list.forEach(w => {
                if (w.simplified.toLowerCase().includes(s) ||
                    w.pinyin.toLowerCase().includes(s) ||
                    w.english.toLowerCase().includes(s)) {
                    results.push(w);
                }
            });
        }

        const capped = results.slice(0, 30);
        if (capped.length === 0) {
            container.innerHTML = '<p class="text-muted padding-2 text-center">Không tìm thấy kết quả phù hợp.</p>';
            return;
        }

        container.innerHTML = `
            <h3 style="margin-bottom:1rem; color:#38bdf8;">Kết Quả Tìm Kiếm (${capped.length} từ)</h3>
            ${capped.map(w => {
                const char = w.simplified;
                const py = w.pinyin;
                const hvArray = Array.from(char).map(c => state.hanvietMap[c] || c);
                const hv = hvArray.join(' ');
                return `
                    <div class="dict-row" data-char="${char}" data-pinyin="${py}">
                        <div class="dict-char-col">
                            <span class="cn">${char}</span>
                            <span class="py">${py}</span>
                            <span class="hv">[${hv}]</span>
                            <span class="eng" style="color:var(--text-dim); margin-left:1rem;">${w.english}</span>
                        </div>
                        <button class="btn btn-outline btn-sm">Luyện viết ✍️</button>
                    </div>
                `;
            }).join('')}
        `;
        attachDictRowClicks();
    }

    function attachDictRowClicks() {
        document.querySelectorAll('.dict-row').forEach(row => {
            row.addEventListener('click', () => {
                const char = row.dataset.char.charAt(0);
                loadCharacterView(char, row.dataset.pinyin);
                document.querySelector('.tab-btn[data-tab="character"]').click();
            });
        });
    }


    // =========================================================================
    // 11. TOAST NOTIFICATION HELPER
    // =========================================================================
    function showToast(text) {
        const toast = document.getElementById('toast-msg');
        document.getElementById('toast-text').textContent = text;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3000);
    }

    // =========================================================================
    // START APP
    // =========================================================================
    loadInitialData();
});
