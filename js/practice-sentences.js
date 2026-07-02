/* ==========================================================================
   Practice Controller — Short & Medium Sentences
   Reads the data-level attribute on its own <script> tag to decide which
   dataset (SHORT_SENTENCES or MEDIUM_SENTENCES) to use.
   ========================================================================== */

(function () {
  const scriptTag = document.currentScript;
  const level = scriptTag.getAttribute('data-level') || 'short';
  const dataset = level === 'medium' ? MEDIUM_SENTENCES : SHORT_SENTENCES;

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
    const pct = Math.round(((idx) / dataset.length) * 100) + Math.round(100 / dataset.length) * 0;
    progressBar.style.width = Math.round(((idx + 1) / dataset.length) * 100) + '%';
  }

  function renderResult(result) {
    resultPanel.classList.remove('d-none');

    const headerClass = result.isCorrect ? 'correct' : 'incorrect';
    const headerIcon = result.isCorrect ? 'bi-check-circle-fill' : 'bi-x-circle-fill';
    const headerText = result.isCorrect ? 'Correct! Well done.' : 'Not quite right — let\'s fix it together.';

    let issuesHtml = '';
    if (result.issues.length) {
      issuesHtml = '<div class="explanation-list">' + result.issues.map((issue, i) => `
        <div class="explanation-item">
          <div class="ex-icon">${i + 1}</div>
          <div class="ex-text">${issue.text}</div>
        </div>
      `).join('') + '</div>';
    }

    resultPanel.innerHTML = `
      <div class="result-header ${headerClass}"><i class="bi ${headerIcon}"></i> ${headerText}</div>
      <div class="result-body">
        <div class="diff-line user-line">
          <span class="diff-label">Your Answer</span>
          ${result.highlightedUser}
        </div>
        <div class="diff-line correct-line">
          <span class="diff-label">Correct Answer</span>
          ${result.correctedSentence}
        </div>
        ${issuesHtml}
        <div class="mt-3 p-3 rounded-3" style="background: var(--primary-light);">
          <strong><i class="bi bi-mortarboard me-1"></i> Grammar Tip:</strong> ${result.tip}
        </div>
        <div class="score-ring-wrap">
          <div class="score-ring" style="--pct:${result.scorePct}" data-pct="${result.scorePct}"></div>
          <div>
            <div class="fw-semibold">Match Score</div>
            <div class="text-secondary small">How closely your answer matches the reference translation.</div>
          </div>
        </div>
      </div>
    `;
  }

  checkBtn.addEventListener('click', function () {
    if (answered) return;
    const item = dataset[currentIndex];
    const userText = userAnswerEl.value;
    const result = GrammarChecker.checkSentence(userText, item);

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
      currentIndex = 0; // loop back for continuous practice
    }
    loadQuestion(currentIndex);
  });

  userAnswerEl.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey) && !answered) {
      checkBtn.click();
    }
  });

  // Init
  loadQuestion(currentIndex);
})();
