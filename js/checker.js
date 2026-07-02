/* ==========================================================================
   Grammar Checker Engine
   A lightweight, rule-based English checker used to compare a learner's
   translated sentence against a reference answer. It is not a full NLP
   parser — it uses word-comparison, common-error rules, and keyword
   coverage to give useful, encouraging feedback without any external API.
   ========================================================================== */

const GrammarChecker = (function () {

  /* ---------- Helpers ---------- */

  function normalize(text) {
    return text
      .trim()
      .replace(/\s+/g, ' ')
      .replace(/[""]/g, '"')
      .replace(/['']/g, "'");
  }

  function tokenize(text) {
    return normalize(text)
      .toLowerCase()
      .replace(/[.,!?;:]/g, '')
      .split(' ')
      .filter(Boolean);
  }

  function capitalizeFirst(str) {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  // Levenshtein distance for word-level similarity (typo detection)
  function levenshtein(a, b) {
    const m = a.length, n = b.length;
    if (m === 0) return n;
    if (n === 0) return m;
    const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (a[i - 1] === b[j - 1]) dp[i][j] = dp[i - 1][j - 1];
        else dp[i][j] = 1 + Math.min(dp[i - 1][j - 1], dp[i - 1][j], dp[i][j - 1]);
      }
    }
    return dp[m][n];
  }

  function similarity(a, b) {
    if (a === b) return 1;
    const dist = levenshtein(a, b);
    const maxLen = Math.max(a.length, b.length);
    if (maxLen === 0) return 1;
    return 1 - dist / maxLen;
  }

  /* ---------- Common error rule checks ---------- */
  const COMMON_RULES = [
    {
      test: (userTokens) => userTokens.includes('i') && userTokens.some((t, i) => t === 'i' && userTokens[i - 1] && /[a-z]/.test(userTokens[i-1])),
      message: null // placeholder, capitalization handled separately
    }
  ];

  function checkCapitalizationOfI(rawUserText) {
    // detect lowercase standalone "i" as a pronoun
    return /\bi\b/.test(rawUserText) && !/\bI\b/.test(rawUserText);
  }

  function checkSentenceStartsCapital(rawUserText) {
    const trimmed = rawUserText.trim();
    if (!trimmed) return true;
    return /^[A-Z]/.test(trimmed) || /^[0-9]/.test(trimmed);
  }

  function checkEndPunctuation(rawUserText) {
    const trimmed = rawUserText.trim();
    return /[.?!]$/.test(trimmed);
  }

  const IRREGULAR_PAST = {
    'go': 'went', 'goed': 'went',
    'eat': 'ate', 'eated': 'ate',
    'run': 'ran', 'runned': 'ran',
    'swim': 'swam', 'swimmed': 'swam',
    'see': 'saw', 'seed': 'saw',
    'buy': 'bought', 'buyed': 'bought',
    'take': 'took', 'taked': 'took',
    'come': 'came', 'comed': 'came',
    'is': 'was', 'are': 'were'
  };

  /* ---------- Word-by-word diff between user & reference ---------- */
  function computeWordDiff(userTokens, refTokens) {
    // Simple LCS-based alignment to find matched / mismatched words
    const m = userTokens.length, n = refTokens.length;
    const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (userTokens[i - 1] === refTokens[j - 1]) dp[i][j] = dp[i - 1][j - 1] + 1;
        else dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
    // backtrack
    let i = m, j = n;
    const matchedUser = new Array(m).fill(false);
    const matchedRef = new Array(n).fill(false);
    while (i > 0 && j > 0) {
      if (userTokens[i - 1] === refTokens[j - 1]) {
        matchedUser[i - 1] = true;
        matchedRef[j - 1] = true;
        i--; j--;
      } else if (dp[i - 1][j] >= dp[i][j - 1]) {
        i--;
      } else {
        j--;
      }
    }
    return { matchedUser, matchedRef };
  }

  /* ---------- Main checking function for a single sentence ---------- */
  function checkSentence(userInput, item) {
    const rawUser = normalize(userInput);
    const userTokens = tokenize(rawUser);
    const refCandidates = [item.answer].concat(item.altAnswers || []);

    // find best matching reference (highest similarity) among accepted answers
    let bestRef = item.answer;
    let bestScore = -1;
    refCandidates.forEach((cand) => {
      const candTokens = tokenize(cand);
      const overlap = userTokens.filter((t) => candTokens.includes(t)).length;
      const score = overlap / Math.max(candTokens.length, 1);
      if (score > bestScore) {
        bestScore = score;
        bestRef = cand;
      }
    });

    const refTokens = tokenize(bestRef);
    const { matchedUser, matchedRef } = computeWordDiff(userTokens, refTokens);

    // Keyword coverage
    const keywords = item.keywords || [];
    const userLower = userTokens.join(' ');
    const missingKeywords = keywords.filter((kw) => !userLower.includes(kw.toLowerCase()));

    // Fuzzy match count (word-level correctness ratio)
    let closeMatches = 0;
    matchedUser.forEach((v) => { if (v) closeMatches++; });
    const coverage = refTokens.length ? closeMatches / refTokens.length : 0;

    // Build issue list
    const issues = [];

    if (!rawUser) {
      issues.push({ type: 'empty', text: "You haven't typed an answer yet. Give it a try!" });
    }

    if (rawUser && !checkSentenceStartsCapital(rawUser)) {
      issues.push({
        type: 'capitalization',
        text: "Start your sentence with a capital letter."
      });
    }

    if (rawUser && checkCapitalizationOfI(rawUser)) {
      issues.push({
        type: 'capitalization',
        text: "The pronoun 'I' should always be written as a capital letter, even in the middle of a sentence."
      });
    }

    if (rawUser && !checkEndPunctuation(rawUser)) {
      issues.push({
        type: 'punctuation',
        text: "Don't forget to end your sentence with a full stop ( . )."
      });
    }

    // Irregular verb tense check
    userTokens.forEach((tok) => {
      if (IRREGULAR_PAST[tok] && refTokens.includes(IRREGULAR_PAST[tok]) && !userTokens.includes(IRREGULAR_PAST[tok])) {
        issues.push({
          type: 'tense',
          text: `Use the correct past tense form: "${tok}" should be "${IRREGULAR_PAST[tok]}" in this sentence.`
        });
      }
    });

    if (missingKeywords.length > 0 && rawUser) {
      issues.push({
        type: 'missing',
        text: `Your sentence is missing some key meaning: try to include the idea of "${missingKeywords.join('", "')}".`
      });
    }

    // Overall correctness decision
    const isExactMatch = refCandidates.some((c) => tokenize(c).join(' ') === userTokens.join(' '));
    const isHighlyCorrect = coverage >= 0.8 && missingKeywords.length === 0 && issues.filter(x => x.type !== 'punctuation').length === 0;
    const isCorrect = isExactMatch || isHighlyCorrect;

    const scorePct = Math.round(Math.min(coverage, 1) * 100);

    // Build highlighted (marked) version of user's answer
    const highlightedUser = userTokens.map((tok, idx) => {
      const isOk = matchedUser[idx];
      const escaped = tok.replace(/</g, '&lt;');
      return isOk ? `<mark class="ok-word">${escaped}</mark>` : `<mark class="err-word">${escaped}</mark>`;
    }).join(' ');

    return {
      isCorrect,
      scorePct,
      issues,
      correctedSentence: bestRef,
      highlightedUser: highlightedUser || '<em>(no answer typed)</em>',
      tip: item.tip
    };
  }

  /* ---------- Paragraph-level checking ---------- */
  function checkParagraph(userInput, item) {
    const rawUser = normalize(userInput);
    const userTokens = tokenize(rawUser);
    const refTokens = tokenize(item.answer);

    const { matchedUser } = computeWordDiff(userTokens, refTokens);
    let closeMatches = 0;
    matchedUser.forEach((v) => { if (v) closeMatches++; });
    const coverage = refTokens.length ? closeMatches / refTokens.length : 0;
    const scorePct = Math.round(Math.min(coverage, 1) * 100);

    const keywords = item.keywords || [];
    const userLower = userTokens.join(' ');
    const missingKeywords = keywords.filter((kw) => !userLower.includes(kw.toLowerCase().split(' ')[0]));

    const issues = [];
    if (!rawUser) {
      issues.push({ type: 'empty', text: "You haven't typed a translation yet. Give it a try!" });
    }
    if (rawUser && !checkSentenceStartsCapital(rawUser)) {
      issues.push({ type: 'capitalization', text: "Start your paragraph with a capital letter." });
    }
    if (rawUser && checkCapitalizationOfI(rawUser)) {
      issues.push({ type: 'capitalization', text: "Remember to always capitalize the pronoun 'I'." });
    }

    // Sentence count comparison (structure check)
    const userSentenceCount = (rawUser.match(/[.!?]+/g) || []).length;
    const refSentenceCount = (item.answer.match(/[.!?]+/g) || []).length;
    if (rawUser && userSentenceCount < refSentenceCount - 1) {
      issues.push({
        type: 'structure',
        text: `Try breaking your translation into more sentences — the original paragraph has about ${refSentenceCount} sentences, yours has ${userSentenceCount}.`
      });
    }

    if (missingKeywords.length > 0 && rawUser) {
      issues.push({
        type: 'missing',
        text: `Some ideas seem to be missing from your paragraph, such as: "${missingKeywords.slice(0, 4).join('", "')}".`
      });
    }

    const highlightedUser = userTokens.map((tok, idx) => {
      const isOk = matchedUser[idx];
      const escaped = tok.replace(/</g, '&lt;');
      return isOk ? `<mark class="ok-word">${escaped}</mark>` : `<mark class="err-word">${escaped}</mark>`;
    }).join(' ');

    const isCorrect = coverage >= 0.75 && missingKeywords.length === 0 && issues.filter(i => i.type !== 'punctuation').length === 0;

    return {
      isCorrect,
      scorePct,
      issues,
      correctedParagraph: item.answer,
      highlightedUser: highlightedUser || '<em>(no answer typed)</em>',
      sentenceHints: item.sentenceHints || [],
      tip: item.tip
    };
  }

  return {
    checkSentence,
    checkParagraph,
    tokenize,
    normalize
  };
})();
