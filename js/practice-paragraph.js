/* ==========================================================================
   Practice Controller — Paragraph Practice
   Provides detailed, sentence-by-sentence corrections for full paragraph
   translation exercises.
   ========================================================================== */

(function () {
  const dataset = PARAGRAPHS;
  let currentIndex = 0;
  let attempted = 0;
  let score = 0;
  let answered = false;

  const tamilTextEl = document.getElementById('tamilText');
  const userAnswerEl = document.getElementById('userAnswer');
  const checkBtn = document.getElementById('checkBtn');
  const hintBtn = document.getElementById('hintBtn');
  const nextBtn = document.getElementById('nextBtn');
  const hintBox = document.getElementById('hintBox');
  const hintText = document.getElementById('hintText');
  const resultPanel = document.getElementById('resultPanel');
  const qNumberEl = document.getElementById('qNumber');
  const qTotalEl = document.getElementById('qTotal');
  const scoreTrackEl = document.getElementById('scoreTrack');
  const attemptedTrackEl = document.getElementById('attemptedTrack');
  const progressBar = document.getElementById('progressBar');

  qTotalEl.textContent = dataset.length;

  function loadQuestion(idx) {
    const item = dataset[idx];
    tamilTextEl.textContent = item.tamil;
    userAnswerEl.value = '';
    userAnswerEl.disabled = false;
    userAnswerEl.focus();
    hintBox.classList.add('d-none');
    resultPanel.classList.add('d-none');
    resultPanel.innerHTML = '';
    nextBtn.disabled = true;
    checkBtn.disabled = false;
    answered = false;
    qNumberEl.textContent = idx + 1;
    progressBar.style.width = Math.round(((idx + 1) / dataset.length) * 100) + '%';
  }

  function renderResult(result) {
    resultPanel.classList.remove('d-none');

    const headerClass = result.isCorrect ? 'correct' : 'incorrect';
    const headerIcon = result.isCorrect ? 'bi-check-circle-fill' : 'bi-x-circle-fill';
    const headerText = result.isCorrect ? 'Great translation! Very close to the ideal answer.' : 'Good attempt — here\'s how to improve it.';

    let issuesHtml = '';
    if (result.issues.length) {
      issuesHtml = '<div class="explanation-list">' + result.issues.map((issue, i) => `
        <div class="explanation-item">
          <div class="ex-icon">${i + 1}</div>
          <div class="ex-text">${issue.text}</div>
        </div>
      `).join('') + '</div>';
    }

    let sentenceHintsHtml = '';
    if (result.sentenceHints && result.sentenceHints.length) {
      sentenceHintsHtml = `
        <h6 class="mt-4 mb-3"><i class="bi bi-list-check me-1"></i> Sentence-by-Sentence Breakdown</h6>
        <div class="explanation-list">
          ${result.sentenceHints.map((hint, i) => `
            <div class="explanation-item">
              <div class="ex-icon">${i + 1}</div>
              <div class="ex-text">${hint}</div>
            </div>
          `).join('')}
        </div>
      `;
    }

    resultPanel.innerHTML = `
      <div class="result-header ${headerClass}"><i class="bi ${headerIcon}"></i> ${headerText}</div>
      <div class="result-body">
        <div class="diff-line user-line">
          <span class="diff-label">Your Translation</span>
          ${result.highlightedUser}
        </div>
        <div class="diff-line correct-line">
          <span class="diff-label">Corrected Paragraph</span>
          ${result.correctedParagraph}
        </div>
        ${issuesHtml}
        ${sentenceHintsHtml}
        <div class="mt-3 p-3 rounded-3" style="background: var(--primary-light);">
          <strong><i class="bi bi-mortarboard me-1"></i> Grammar Tip:</strong> ${result.tip}
        </div>
        <div class="score-ring-wrap">
          <div class="score-ring" style="--pct:${result.scorePct}" data-pct="${result.scorePct}"></div>
          <div>
            <div class="fw-semibold">Match Score</div>
            <div class="text-secondary small">How closely your paragraph matches the reference translation.</div>
          </div>
        </div>
      </div>
    `;
  }

  checkBtn.addEventListener('click', function () {
    if (answered) return;
    const item = dataset[currentIndex];
    const userText = userAnswerEl.value;
    const result = GrammarChecker.checkParagraph(userText, item);

    renderResult(result);

    answered = true;
    attempted++;
    if (result.isCorrect) score++;
    scoreTrackEl.textContent = score;
    attemptedTrackEl.textContent = attempted;

    checkBtn.disabled = true;
    userAnswerEl.disabled = true;
    nextBtn.disabled = false;
    hintBox.classList.add('d-none');
  });

  hintBtn.addEventListener('click', function () {
    const item = dataset[currentIndex];
    hintText.textContent = item.tip;
    hintBox.classList.remove('d-none');
  });

  nextBtn.addEventListener('click', function () {
    currentIndex++;
    if (currentIndex >= dataset.length) {
      currentIndex = 0;
    }
    loadQuestion(currentIndex);
  });

  userAnswerEl.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey) && !answered) {
      checkBtn.click();
    }
  });

  loadQuestion(currentIndex);
})();
