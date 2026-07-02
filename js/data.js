/* ==========================================================================
   Practice Data — Tamil sentences/paragraphs with reference English answers
   Each item includes:
     tamil          -> Tamil source text
     answer         -> the ideal/reference English translation
     altAnswers     -> other acceptable phrasings (optional)
     keywords       -> important content words the answer should contain
     tip            -> a general grammar tip relevant to this sentence
   ========================================================================== */

const SHORT_SENTENCES = [
  {
    tamil: "நான் பள்ளிக்குச் செல்கிறேன்.",
    answer: "I go to school.",
    altAnswers: ["I am going to school."],
    keywords: ["i", "go", "school"],
    tip: "Simple present tense is used for habitual actions like going to school every day."
  },
  {
    tamil: "அவள் தண்ணீர் குடிக்கிறாள்.",
    answer: "She drinks water.",
    altAnswers: ["She is drinking water."],
    keywords: ["she", "drink", "water"],
    tip: "With third-person singular subjects (he/she/it), add 's' to the verb in simple present tense: drink → drinks."
  },
  {
    tamil: "நாங்கள் புத்தகம் படிக்கிறோம்.",
    answer: "We read a book.",
    altAnswers: ["We are reading a book.", "We read books."],
    keywords: ["we", "read", "book"],
    tip: "Use 'a' before a singular countable noun like 'book' when it is mentioned for the first time."
  },
  {
    tamil: "அவன் வேகமாக ஓடுகிறான்.",
    answer: "He runs fast.",
    altAnswers: ["He is running fast."],
    keywords: ["he", "run", "fast"],
    tip: "Adverbs like 'fast' describe how the action is done and usually come after the verb."
  },
  {
    tamil: "என் அம்மா சமையல் செய்கிறாள்.",
    answer: "My mother is cooking.",
    altAnswers: ["My mother cooks."],
    keywords: ["mother", "cook"],
    tip: "'is/am/are + verb-ing' is used for an action happening right now (present continuous tense)."
  },
  {
    tamil: "இது என் புத்தகம்.",
    answer: "This is my book.",
    altAnswers: [],
    keywords: ["this", "my", "book"],
    tip: "'This' is used for something near you; 'is' is the correct verb for singular subjects like 'this'."
  },
  {
    tamil: "நாய் வீட்டில் தூங்குகிறது.",
    answer: "The dog is sleeping in the house.",
    altAnswers: ["The dog sleeps in the house."],
    keywords: ["dog", "sleep", "house"],
    tip: "Use 'the' before a noun that is specific or already known, such as 'the dog' and 'the house'."
  },
  {
    tamil: "நான் நேற்று சந்தைக்குச் சென்றேன்.",
    answer: "I went to the market yesterday.",
    altAnswers: ["Yesterday I went to the market."],
    keywords: ["went", "market", "yesterday"],
    tip: "'Yesterday' signals past tense — use 'went' (past form of 'go'), not 'go' or 'goed'."
  },
  {
    tamil: "அவர்கள் கால்பந்து விளையாடுகிறார்கள்.",
    answer: "They play football.",
    altAnswers: ["They are playing football."],
    keywords: ["they", "play", "football"],
    tip: "'They' is a plural pronoun, so the base verb form (play) is used without adding 's'."
  },
  {
    tamil: "இந்த வீடு மிகவும் அழகாக இருக்கிறது.",
    answer: "This house is very beautiful.",
    altAnswers: ["This house is so beautiful."],
    keywords: ["house", "beautiful"],
    tip: "Adjectives like 'beautiful' usually come after 'is/are' when describing a subject."
  },
  {
    tamil: "நான் தினமும் காலை நடைபயிற்சி செய்கிறேன்.",
    answer: "I walk every morning.",
    altAnswers: ["I do walking every morning.", "I go for a walk every morning."],
    keywords: ["walk", "every", "morning"],
    tip: "'Every morning' shows a routine, so use simple present tense (I walk), not continuous tense."
  },
  {
    tamil: "அவள் நன்றாக பாடுகிறாள்.",
    answer: "She sings well.",
    altAnswers: ["She sings nicely."],
    keywords: ["she", "sing", "well"],
    tip: "Add 's' to the verb for 'she/he/it' subjects in the present tense: sing → sings."
  }
];

const MEDIUM_SENTENCES = [
  {
    tamil: "நான் ஒவ்வொரு நாளும் காலையில் எழுந்து பள்ளிக்குச் செல்கிறேன்.",
    answer: "I wake up in the morning and go to school every day.",
    altAnswers: ["Every day I wake up in the morning and go to school."],
    keywords: ["wake up", "morning", "go", "school", "every day"],
    tip: "When two actions happen in sequence, join them with 'and': wake up + go to school."
  },
  {
    tamil: "என் தந்தை ஒரு ஆசிரியராக பள்ளியில் பணிபுரிகிறார்.",
    answer: "My father works as a teacher at school.",
    altAnswers: ["My father works as a teacher in a school."],
    keywords: ["father", "work", "teacher", "school"],
    tip: "Use 'as' to describe someone's role or profession: 'works as a teacher'."
  },
  {
    tamil: "நேற்று மழை பெய்ததால் நான் வெளியே செல்லவில்லை.",
    answer: "I did not go outside because it rained yesterday.",
    altAnswers: ["Because it rained yesterday, I did not go outside.", "I didn't go outside because it rained yesterday."],
    keywords: ["did not go", "outside", "because", "rained", "yesterday"],
    tip: "Use 'because' to give a reason, and remember 'did not' + base verb for negative past tense (did not go, not did not went)."
  },
  {
    tamil: "நான் புதிய ஆங்கில வார்த்தைகளை கற்றுக்கொள்ள விரும்புகிறேன்.",
    answer: "I want to learn new English words.",
    altAnswers: ["I would like to learn new English words."],
    keywords: ["want", "learn", "new", "english", "words"],
    tip: "After 'want', use 'to' + base verb: want to learn (not want learning)."
  },
  {
    tamil: "எங்கள் ஆசிரியர் எங்களுக்கு ஒவ்வொரு வாரமும் புதிய பாடம் கற்பிக்கிறார்.",
    answer: "Our teacher teaches us a new lesson every week.",
    altAnswers: ["Our teacher teaches a new lesson to us every week."],
    keywords: ["teacher", "teach", "new", "lesson", "every week"],
    tip: "With 'our teacher' (third person singular), the verb takes 's': teach → teaches."
  },
  {
    tamil: "நான் வீட்டு வேலையை முடித்த பிறகு தொலைக்காட்சி பார்ப்பேன்.",
    answer: "I will watch television after I finish my homework.",
    altAnswers: ["After finishing my homework, I will watch television."],
    keywords: ["will watch", "television", "after", "finish", "homework"],
    tip: "Use 'will' + base verb to talk about a future action: will watch (not will watched)."
  },
  {
    tamil: "அவள் தினமும் காலை ஆறு மணிக்கு எழுந்திருப்பது வழக்கம்.",
    answer: "She usually wakes up at six o'clock every morning.",
    altAnswers: ["She usually wakes up at 6 am every morning."],
    keywords: ["usually", "wake", "six", "morning"],
    tip: "Frequency adverbs like 'usually' come before the main verb but after the subject: She usually wakes up."
  },
  {
    tamil: "எனக்கு ஆங்கிலம் பேசுவதில் இன்னும் தயக்கம் இருக்கிறது.",
    answer: "I still feel shy about speaking English.",
    altAnswers: ["I am still hesitant to speak English.", "I still feel nervous when speaking English."],
    keywords: ["still", "shy", "speaking", "english"],
    tip: "Use 'about' or 'to' correctly with feelings: 'feel shy about speaking' or 'hesitant to speak'."
  },
  {
    tamil: "நாங்கள் கடந்த வாரம் எங்கள் தாத்தா வீட்டிற்குச் சென்றோம்.",
    answer: "We went to our grandfather's house last week.",
    altAnswers: ["Last week we visited our grandfather's house."],
    keywords: ["went", "grandfather", "house", "last week"],
    tip: "Use an apostrophe + s to show possession: grandfather's house."
  },
  {
    tamil: "இந்த பயிற்சி எனது பேச்சு திறனை மேம்படுத்த உதவுகிறது.",
    answer: "This practice helps me improve my speaking skills.",
    altAnswers: ["This exercise helps to improve my speaking skills."],
    keywords: ["practice", "helps", "improve", "speaking", "skills"],
    tip: "'Help' can be followed directly by a base verb: helps me improve (also correct: helps me to improve)."
  }
];

const PARAGRAPHS = [
  {
    tamil: "என் பெயர் கண்ணன். நான் தஞ்சாவூரில் வசிக்கிறேன். நான் தினமும் காலை ஆறு மணிக்கு எழுந்திருப்பேன். பின்னர் நான் பள்ளிக்குச் செல்வதற்கு தயாராகிறேன். எனக்கு ஆங்கிலம் கற்றுக்கொள்வது மிகவும் பிடிக்கும்.",
    answer: "My name is Kannan. I live in Thanjavur. I wake up at six o'clock every morning. Then I get ready to go to school. I like learning English very much.",
    keywords: ["my name is", "live in", "wake up", "every morning", "get ready", "go to school", "like learning english"],
    sentenceHints: [
      "My name is Kannan. (Use 'My name is' + name to introduce yourself.)",
      "I live in Thanjavur. (Use 'live in' + place name for where you reside.)",
      "I wake up at six o'clock every morning. (Simple present tense for daily habits.)",
      "Then I get ready to go to school. (Use 'get ready to' + base verb.)",
      "I like learning English very much. (After 'like', you can use verb+ing: like learning.)"
    ],
    tip: "Use simple present tense throughout when describing daily habits and routines."
  },
  {
    tamil: "நேற்று விடுமுறை நாள். நான் என் நண்பர்களுடன் கடற்கரைக்குச் சென்றேன். நாங்கள் மணலில் விளையாடினோம், நீச்சல் அடித்தோம். பிறகு நாங்கள் ஒரு உணவகத்தில் மதிய உணவு சாப்பிட்டோம். அது ஒரு அருமையான நாள்.",
    answer: "Yesterday was a holiday. I went to the beach with my friends. We played in the sand and swam. Then we ate lunch at a restaurant. It was a wonderful day.",
    keywords: ["yesterday was a holiday", "went to the beach", "with my friends", "played in the sand", "swam", "ate lunch", "restaurant", "wonderful day"],
    sentenceHints: [
      "Yesterday was a holiday. (Use 'was' — past tense of 'is' — with 'yesterday'.)",
      "I went to the beach with my friends. ('went' is the past tense of 'go'.)",
      "We played in the sand and swam. ('swam' is the irregular past tense of 'swim'.)",
      "Then we ate lunch at a restaurant. ('ate' is the irregular past tense of 'eat'.)",
      "It was a wonderful day. (Use 'was' for past tense with singular subject 'it'.)"
    ],
    tip: "This paragraph describes past events, so every verb should be in the simple past tense (went, played, swam, ate, was)."
  },
  {
    tamil: "ஆங்கிலம் கற்றல் மிகவும் முக்கியமானது. இது நமக்கு உலகம் முழுவதும் உள்ளவர்களுடன் தொடர்பு கொள்ள உதவுகிறது. நாம் தினமும் பயிற்சி செய்தால், நமது திறமை மேம்படும். நான் ஒவ்வொரு நாளும் புதிய வார்த்தைகளை கற்றுக்கொள்ள முயற்சிக்கிறேன். விடாமுயற்சி வெற்றிக்கு வழி வகுக்கும்.",
    answer: "Learning English is very important. It helps us communicate with people around the world. If we practice every day, our skills will improve. I try to learn new words every day. Hard work leads to success.",
    keywords: ["learning english", "important", "helps us communicate", "around the world", "practice every day", "skills will improve", "try to learn", "new words", "hard work", "leads to success"],
    sentenceHints: [
      "Learning English is very important. (Gerund 'Learning' as subject takes a singular verb 'is'.)",
      "It helps us communicate with people around the world. (Use 'helps us' + base verb: helps us communicate.)",
      "If we practice every day, our skills will improve. (First conditional: If + present simple, ... will + base verb.)",
      "I try to learn new words every day. (After 'try', use 'to' + base verb.)",
      "Hard work leads to success. (General truths use simple present tense: leads.)"
    ],
    tip: "General truths and habitual actions use the simple present tense; conditional sentences use 'if + present, will + base verb'."
  }
];
