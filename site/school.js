/*
 * KidsTown School: Word Fun, Scramble, and the Farm Field-Trip.
 *
 * A client-side conversion of kidstown_cgi-main/scripts/school, traced
 * against every School route in kt.db:
 *   mainPage.pl     - entrance (KEY 4000)
 *   wordfun.pl      - Word Fun (KEY 4001)
 *   e_scramble.pl   - Scramble (KEY 4002)
 *   open.pl         - Scramble's Help page (KEY 4003, reached via the
 *                     original navbar's Help button on the Scramble
 *                     screen - HelpState=4003)
 *   wordfunhelp.pl  - Word Fun's Help page (KEY 4004)
 *   FarmTown1.pl .. FarmTown5.pl, FarmTown2-1..2-7.pl,
 *   FarmTown4-1/2/4-8.pl, FarmTownAniNav.pl, FarmTownPltNav.pl,
 *   FarmTownNav.pl  - Farm Field-Trip (KEY 4500-4560)
 * Nothing here calls kt.cgi or any server-side script.
 *
 * Word Fun and Scramble both draw from the same three word files
 * (kidstown_cgi-main/data/school/e_data1-3.txt), transcribed once below
 * and reused by both games with their own original level labels.
 *
 * Note on KEY 4543: kt.db's plant routes run 4541, 4542, 4544-4548 -
 * 4543 was never assigned to a FarmTown4-3.pl script, and
 * FarmTownPltNav.pl's own plant list skips straight from Hay to Wheat.
 * This is an original gap (seven plants, not eight), not an omission
 * here.
 */
(function () {
  "use strict";

  var ASSET_PATH = "assets/images/school/";

  function word(text, sentence, graphic) {
    return { word: text, sentence: sentence, graphic: graphic };
  }

  // Transcribed from e_data1.txt, e_data2.txt, e_data3.txt. Both Word Fun
  // and Scramble pick a random word from the level the visitor selects.
  var WORD_LEVELS = {
    easy: {
      wordFunLabel: "Easy",
      wordFunExample: "fish, ball, and bed",
      scrambleLabel: "short words",
      words: [
        word("sock", "People wear socks on their feet.", "sock1.gif"),
        word("cow", "When a cow is hungry it eats grass.", "cow3.jpg"),
        word("book", "Reading a book is fun.", "book.gif"),
        word("pig", "A pig likes to roll in the mud.", "pig1.jpg"),
        word("lion", "A lion lives in Africa.", "lion1.jpg"),
        word("bed", "Many people sleep in beds.", "bed2.gif"),
        word("bat", "You can look for a bat in a cave.", "bat.jpg"),
        word("rain", "You get wet in the rain.", "rain.jpg"),
        word("fish", "My fish lives in a fishbowl.", "fish1.jpg"),
        word("sled", "You can use your sled in winter.", "sled.jpg"),
        word("cat", "Some cats chase mice.", "cat1.jpg"),
        word(
          "lemon",
          "Most lemons are so sour that they make your mouth pucker.",
          "lemons2.jpg"
        ),
        word("eyes", "Your eyes are part of your face.", "eyes.jpg"),
        word("bee", "We get honey from bees.", "bee2.jpg"),
        word("bread", "Bakers use wheat to make bread.", "bread.jpg")
      ]
    },

    medium: {
      wordFunLabel: "Medium",
      wordFunExample: "basketball, flying, and staple",
      scrambleLabel: "longer words",
      words: [
        word("hammer", "A hammer is used to pound nails.", "hammer.jpg"),
        word("clock", "A clock is used to tell time.", "clock.jpg"),
        word("house", "A house has a roof.", "house.jpg"),
        word("fruit", "Eating fruit is good for you.", "fruit1.jpg"),
        word("snail", "A snail moves slowly.", "snail1.jpg"),
        word("swing", "It is fun to play on a swing.", "swing4.gif"),
        word("horse", "People ride on the back of a horse.", "horse1.jpg"),
        word("zebra", "A zebra has black and white stripes.", "zebra1.jpg"),
        word(
          "dinosaur",
          "Some dinosaurs ate meat and others ate plants.",
          "DINO3.jpg"
        ),
        word("spider", "All spiders have eight legs.", "Spider2.jpg"),
        word("banana", "Monkeys like to eat bananas.", "banana2.jpg"),
        word("computer", "Games can be played on a computer.", "comp3.jpg"),
        word(
          "mouse",
          "A mouse is used to move the cursor on a computer screen.",
          "compmouse1.gif"
        ),
        word("camera", "A picture is taken with a camera.", "camera1.jpg"),
        word(
          "dolphin",
          "The sea is home to dolphins and whales.",
          "dolphin1.jpg"
        ),
        word("volcano", "Lava flows from a volcano.", "volcano1.jpg")
      ]
    },

    difficult: {
      wordFunLabel: "Difficult",
      wordFunExample: "stethoscope and application",
      scrambleLabel: "longest words",
      words: [
        word("present", "Opening a present is exciting.", "present2.gif"),
        word(
          "helicopter",
          "A helicopter can take off vertically.",
          "helicopter1.gif"
        ),
        word("toucan", "A toucan has a large beak.", "toucan1.jpg"),
        word(
          "stethoscope",
          "A doctor uses a stethoscope to listen to your heart.",
          "stethoscope.jpg"
        ),
        word("falling", "Carelessness can cause falling.", "falling3.gif"),
        word("squirrel", "Some squirrels eat nuts.", "squirrel1.jpg"),
        word(
          "woodpecker",
          "A woodpecker pecks insects out of trees.",
          "woodpec1.jpg"
        ),
        word(
          "penguin",
          "Many penguins live at the South Pole.",
          "penguin1.jpg"
        )
      ]
    }
  };

  var LEVEL_ORDER = ["easy", "medium", "difficult"];

  function pickRandomWord(levelKey) {
    var pool = WORD_LEVELS[levelKey].words;
    return pool[Math.floor(Math.random() * pool.length)];
  }

  function scrambleWord(text) {
    var upper = text.toUpperCase();
    var scrambled = upper;

    while (scrambled === upper) {
      var letters = upper.split("");
      for (var i = letters.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var tmp = letters[i];
        letters[i] = letters[j];
        letters[j] = tmp;
      }
      scrambled = letters.join("");
    }

    return scrambled;
  }

  var state = { screen: "entrance" };

  function byId(id) {
    return document.getElementById(id);
  }

  function clear(container) {
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
  }

  function makeButton(label, className, onClick) {
    var button = document.createElement("button");
    button.type = "button";
    button.className = className;
    button.textContent = label;
    button.addEventListener("click", onClick);
    return button;
  }

  function makeLink(label, className, hash) {
    var link = document.createElement("a");
    link.href = hash;
    link.className = className;
    link.textContent = label;
    return link;
  }

  function heading(text, level) {
    var h = document.createElement(level || "h1");
    h.textContent = text;
    return h;
  }

  function paragraph(text, className) {
    var p = document.createElement("p");
    if (className) {
      p.className = className;
    }
    p.textContent = text;
    return p;
  }

  function image(src, alt, className) {
    var img = document.createElement("img");
    img.src = ASSET_PATH + src;
    img.alt = alt || "";
    if (className) {
      img.className = className;
    }
    return img;
  }

  // Builds "<Sentence with the target word highlighted>" using only
  // textContent/createElement - never innerHTML - matching the original's
  // case-insensitive substring highlight (including its original quirk of
  // matching the word wherever it appears, even inside a longer word).
  function buildHighlightedSentence(sentence, targetWord) {
    var p = document.createElement("p");
    p.className = "school-sentence";

    var lowerSentence = sentence.toLowerCase();
    var lowerWord = targetWord.toLowerCase();
    var cursor = 0;
    var index = lowerSentence.indexOf(lowerWord, cursor);

    if (index === -1) {
      p.textContent = sentence;
      return p;
    }

    while (index !== -1) {
      if (index > cursor) {
        p.appendChild(document.createTextNode(sentence.slice(cursor, index)));
      }
      var mark = document.createElement("span");
      mark.className = "school-highlight-word";
      mark.textContent = sentence.slice(index, index + targetWord.length);
      p.appendChild(mark);
      cursor = index + targetWord.length;
      index = lowerSentence.indexOf(lowerWord, cursor);
    }

    if (cursor < sentence.length) {
      p.appendChild(document.createTextNode(sentence.slice(cursor)));
    }

    return p;
  }

  function renderCommonFooter(container, opts) {
    opts = opts || {};

    var nav = document.createElement("div");
    nav.className = "school-nav";

    if (opts.help) {
      nav.appendChild(makeButton("Help", "school-back-btn", opts.help));
    }

    if (!opts.hideReturnToSchool) {
      nav.appendChild(
        makeButton("Return to School", "school-back-btn", renderEntrance)
      );
    }

    if (opts.showMapLink) {
      nav.appendChild(
        makeLink("Return to the KidsTown map", "school-map-link", "#/home")
      );
    }

    container.appendChild(nav);
  }

  // -----------------------------------------------------------------------
  // School entrance (mainPage.pl)
  // -----------------------------------------------------------------------

  function renderEntrance() {
    state = { screen: "entrance" };

    var container = byId("school-content");
    clear(container);

    container.appendChild(heading("KidsTown School"));
    container.appendChild(image("chalkboard.gif", "Chalkboard", "school-banner"));
    container.appendChild(paragraph("Welcome to school!"));
    container.appendChild(paragraph("Current activities are:", "school-guess"));

    var choices = document.createElement("div");
    choices.className = "school-choices";
    choices.appendChild(
      makeButton("Word Fun", "school-choice-btn", renderWordFunIntro)
    );
    choices.appendChild(
      makeButton("Scramble", "school-choice-btn", renderScrambleIntro)
    );
    choices.appendChild(
      makeButton("Farm Field-Trip", "school-choice-btn", renderFarmEntrance)
    );
    container.appendChild(choices);

    renderCommonFooter(container, { hideReturnToSchool: true, showMapLink: true });
  }

  // -----------------------------------------------------------------------
  // Word Fun (wordfun.pl / wordfunhelp.pl)
  // -----------------------------------------------------------------------

  function renderWordFunIntro() {
    state = { screen: "wordfun-intro" };

    var container = byId("school-content");
    clear(container);

    container.appendChild(heading("Welcome to the Word Fun Activity"));
    container.appendChild(
      paragraph(
        "Please choose a level of difficulty by selecting a level below. " +
          "Click on the \"Start Game\" button to begin playing.",
        "school-guess"
      )
    );

    var layout = document.createElement("div");
    layout.className = "school-level-layout";

    var left = image("blocks-left.gif", "");
    left.className = "school-blocks-img";
    layout.appendChild(left);

    var form = document.createElement("form");
    form.className = "school-level-form";

    var table = document.createElement("table");
    table.className = "school-level-table";
    var headRow = document.createElement("tr");
    var th1 = document.createElement("th");
    th1.textContent = "Level";
    var th2 = document.createElement("th");
    th2.textContent = "Example Words";
    headRow.appendChild(th1);
    headRow.appendChild(th2);
    table.appendChild(headRow);

    var selected = "easy";
    LEVEL_ORDER.forEach(function (levelKey) {
      var level = WORD_LEVELS[levelKey];
      var row = document.createElement("tr");
      var labelCell = document.createElement("td");

      var radioLabel = document.createElement("label");
      var radio = document.createElement("input");
      radio.type = "radio";
      radio.name = "wordfun-level";
      radio.value = levelKey;
      radio.checked = levelKey === "easy";
      radio.addEventListener("change", function () {
        selected = levelKey;
      });
      radioLabel.appendChild(radio);
      radioLabel.appendChild(document.createTextNode(" " + level.wordFunLabel));
      labelCell.appendChild(radioLabel);

      var exampleCell = document.createElement("td");
      exampleCell.textContent = "- " + level.wordFunExample;

      row.appendChild(labelCell);
      row.appendChild(exampleCell);
      table.appendChild(row);
    });

    form.appendChild(table);

    var startBtn = document.createElement("button");
    startBtn.type = "button";
    startBtn.className = "school-choice-btn";
    startBtn.textContent = "Start Game";
    startBtn.addEventListener("click", function () {
      startWordFunRound(selected);
    });
    form.appendChild(startBtn);

    layout.appendChild(form);

    var right = image("blocks-right.gif", "");
    right.className = "school-blocks-img";
    layout.appendChild(right);

    container.appendChild(layout);

    renderCommonFooter(container, { help: renderWordFunHelp });
  }

  function startWordFunRound(levelKey) {
    state = {
      screen: "wordfun-play",
      level: levelKey,
      current: pickRandomWord(levelKey),
      guessed: [],
      tries: 0
    };
    renderWordFunGame();
  }

  function renderWordFunGame() {
    var container = byId("school-content");
    clear(container);

    var current = state.current;
    var target = current.word.toUpperCase();
    var display = target
      .split("")
      .map(function (letter) {
        return state.guessed.indexOf(letter) !== -1 ? letter : "_";
      })
      .join(" ");

    if (display.replace(/[^A-Z]/g, "") === target) {
      renderWordFunSolved();
      return;
    }

    container.appendChild(heading("Word Fun"));
    container.appendChild(paragraph("Select a letter from below:", "school-guess"));

    var layout = document.createElement("div");
    layout.className = "school-level-layout";

    layout.appendChild(image("blocks-left.gif", "", "school-blocks-img"));

    var middle = document.createElement("div");
    middle.className = "school-wordfun-middle";

    var displayEl = document.createElement("p");
    displayEl.className = "school-word-display";
    displayEl.textContent = display;
    middle.appendChild(displayEl);

    var alphabetRow = document.createElement("div");
    alphabetRow.className = "school-alphabet-row";

    "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").forEach(function (letter) {
      if (state.guessed.indexOf(letter) !== -1) {
        var used = document.createElement("span");
        used.className = "school-letter-used";
        used.textContent = "-";
        alphabetRow.appendChild(used);
      } else {
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "school-letter-btn";
        btn.textContent = letter;
        btn.addEventListener("click", function () {
          state.guessed.push(letter);
          state.tries++;
          renderWordFunGame();
        });
        alphabetRow.appendChild(btn);
      }
    });

    middle.appendChild(alphabetRow);
    layout.appendChild(middle);
    layout.appendChild(image("blocks-right.gif", "", "school-blocks-img"));
    container.appendChild(layout);

    renderCommonFooter(container, { help: renderWordFunHelp });
  }

  function renderWordFunSolved() {
    state.screen = "wordfun-solved";

    var container = byId("school-content");
    clear(container);
    var current = state.current;

    container.appendChild(heading("Word Fun"));

    var resultText = document.createElement("p");
    resultText.className = "school-guess";
    var tryWord = state.tries === 1 ? "try" : "tries";
    resultText.appendChild(document.createTextNode("That's correct! The word is "));
    var em = document.createElement("em");
    em.textContent = current.word;
    resultText.appendChild(em);
    resultText.appendChild(
      document.createTextNode(
        ". Good job, you got it in " + state.tries + " " + tryWord + "!"
      )
    );
    container.appendChild(resultText);

    container.appendChild(image(current.graphic, current.word, "school-word-img"));
    container.appendChild(buildHighlightedSentence(current.sentence, current.word));

    var choices = document.createElement("div");
    choices.className = "school-choices";
    choices.appendChild(
      makeButton("Play Again", "school-choice-btn", function () {
        startWordFunRound(state.level);
      })
    );
    choices.appendChild(
      makeButton("Change Level", "school-choice-btn", renderWordFunIntro)
    );
    container.appendChild(choices);

    renderCommonFooter(container, { help: renderWordFunHelp });
  }

  function renderWordFunHelp() {
    state = { screen: "wordfun-help" };

    var container = byId("school-content");
    clear(container);

    container.appendChild(heading("Welcome to the Word Fun Activity Help Page"));

    var list = document.createElement("ul");
    list.className = "school-help-list";
    [
      "This is a spelling activity with the word difficulty based on the level you chose.",
      "The object is to try and guess the correct word given the number of letters in it.",
      "Click on a letter button; if the letter you clicked on is in the word, it will appear in one or more of the blanks.",
      "If the letter is not in the word, you are given another chance to guess a correct one."
    ].forEach(function (text) {
      var li = document.createElement("li");
      li.textContent = text;
      list.appendChild(li);
    });
    container.appendChild(list);

    var choices = document.createElement("div");
    choices.className = "school-choices";
    choices.appendChild(
      makeButton("Play the Word Fun Activity", "school-choice-btn", renderWordFunIntro)
    );
    container.appendChild(choices);

    renderCommonFooter(container, {});
  }

  // -----------------------------------------------------------------------
  // Scramble (e_scramble.pl / open.pl)
  // -----------------------------------------------------------------------

  function renderScrambleIntro() {
    state = { screen: "scramble-intro" };

    var container = byId("school-content");
    clear(container);

    container.appendChild(heading("Welcome to the Word Scramble Game"));
    container.appendChild(
      paragraph(
        "Please choose a level of difficulty by selecting a level below. " +
          "Click on the \"Start Game\" button to begin playing.",
        "school-guess"
      )
    );

    var form = document.createElement("form");
    form.className = "school-level-form";
    var selected = "easy";

    LEVEL_ORDER.forEach(function (levelKey) {
      var level = WORD_LEVELS[levelKey];
      var row = document.createElement("div");
      row.className = "school-scramble-option";

      var radioLabel = document.createElement("label");
      var radio = document.createElement("input");
      radio.type = "radio";
      radio.name = "scramble-level";
      radio.value = levelKey;
      radio.checked = levelKey === "easy";
      radio.addEventListener("change", function () {
        selected = levelKey;
      });
      radioLabel.appendChild(radio);
      radioLabel.appendChild(document.createTextNode(" " + level.scrambleLabel));
      row.appendChild(radioLabel);
      form.appendChild(row);
    });

    var startBtn = document.createElement("button");
    startBtn.type = "button";
    startBtn.className = "school-choice-btn";
    startBtn.textContent = "Start Game";
    startBtn.addEventListener("click", function () {
      startScrambleRound(selected);
    });
    form.appendChild(startBtn);

    container.appendChild(form);

    renderCommonFooter(container, { help: renderScrambleHelp });
  }

  function startScrambleRound(levelKey) {
    var current = pickRandomWord(levelKey);
    state = {
      screen: "scramble-play",
      level: levelKey,
      current: current,
      scrambled: scrambleWord(current.word),
      tries: 0,
      lastGuess: "",
      error: ""
    };
    renderScrambleGame();
  }

  function renderScrambleGame() {
    var container = byId("school-content");
    clear(container);

    container.appendChild(heading("Scramble"));
    container.appendChild(paragraph("What is this picture?", "school-guess"));
    container.appendChild(
      image(state.current.graphic, state.current.word, "school-word-img")
    );

    if (state.error) {
      var err = document.createElement("p");
      err.className = "school-error";
      err.textContent = state.error;
      container.appendChild(err);
    }

    var scrambledText = document.createElement("p");
    scrambledText.className = "school-scrambled-word";
    scrambledText.textContent = "Scrambled Word: " + state.scrambled;
    container.appendChild(scrambledText);

    var form = document.createElement("form");
    form.className = "school-guess-form";

    var label = document.createElement("label");
    label.textContent = "Enter Guess: ";
    var input = document.createElement("input");
    input.type = "text";
    input.maxLength = state.current.word.length;
    input.size = state.current.word.length;
    input.autocomplete = "off";
    label.appendChild(input);
    form.appendChild(label);

    var submit = document.createElement("button");
    submit.type = "submit";
    submit.className = "school-choice-btn";
    submit.textContent = "Continue";
    form.appendChild(submit);

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      submitScrambleGuess(input.value);
    });

    container.appendChild(form);

    if (state.lastGuess) {
      container.appendChild(
        paragraph("Your Last Guess: " + state.lastGuess, "school-last-guess")
      );
    }

    renderCommonFooter(container, { help: renderScrambleHelp });
  }

  function submitScrambleGuess(rawGuess) {
    var word = state.current.word.toUpperCase();
    var guess = rawGuess.toUpperCase();

    if (guess.length !== word.length) {
      state.error = "The input should be of length " + word.length + ".";
      state.lastGuess = guess;
      renderScrambleGame();
      return;
    }

    if (!/^[A-Z]+$/.test(guess)) {
      state.error = "Only use letters for input.";
      state.lastGuess = guess;
      renderScrambleGame();
      return;
    }

    state.error = "";
    state.tries++;
    state.lastGuess = guess;

    if (guess === word) {
      renderScrambleSolved();
    } else {
      renderScrambleGame();
    }
  }

  function renderScrambleSolved() {
    state.screen = "scramble-solved";

    var container = byId("school-content");
    clear(container);
    var current = state.current;

    container.appendChild(heading("Scramble"));

    var resultText = document.createElement("p");
    resultText.className = "school-guess";
    var tryWord = state.tries === 1 ? "try" : "tries";
    resultText.appendChild(document.createTextNode("That's correct! The word is "));
    var em = document.createElement("em");
    em.textContent = current.word;
    resultText.appendChild(em);
    resultText.appendChild(
      document.createTextNode(
        ". Good job, you got it in " + state.tries + " " + tryWord + "!"
      )
    );
    container.appendChild(resultText);

    container.appendChild(image(current.graphic, current.word, "school-word-img"));
    container.appendChild(buildHighlightedSentence(current.sentence, current.word));

    var choices = document.createElement("div");
    choices.className = "school-choices";
    choices.appendChild(
      makeButton("Play Again", "school-choice-btn", function () {
        startScrambleRound(state.level);
      })
    );
    choices.appendChild(
      makeButton("Change Level", "school-choice-btn", renderScrambleIntro)
    );
    container.appendChild(choices);

    renderCommonFooter(container, { help: renderScrambleHelp });
  }

  function renderScrambleHelp() {
    state = { screen: "scramble-help" };

    var container = byId("school-content");
    clear(container);

    container.appendChild(heading("Instructions for the Word Scramble Game"));
    container.appendChild(
      paragraph(
        "This is a word and picture matching activity.",
        "school-guess"
      )
    );
    container.appendChild(
      paragraph(
        "Choose a level of difficulty and try to guess the correct word " +
          "by rearranging the letters shown."
      )
    );
    container.appendChild(paragraph("Use the picture as a clue to help you guess!"));

    var choices = document.createElement("div");
    choices.className = "school-choices";
    choices.appendChild(
      makeButton(
        "Click Here to Start the Word Scramble Game",
        "school-choice-btn",
        renderScrambleIntro
      )
    );
    container.appendChild(choices);

    renderCommonFooter(container, {});
  }

  // -----------------------------------------------------------------------
  // Farm Field-Trip (FarmTown1.pl .. FarmTown5.pl)
  // -----------------------------------------------------------------------

  function farmLink(targetKey, label) {
    return { farmLink: targetKey, label: label };
  }

  var ANIMALS = [
    {
      key: "cow",
      label: "Cows",
      title: "Cows",
      image: "ABY50289.jpg",
      content: [
        "Cows produce milk. They are milked two to three times a day by the farmer.",
        "A baby cow is called a calf. Grown-ups are called heifers and bulls.",
        [
          "Milk is used in making cheese, butter and ice cream. Cows eat the ",
          farmLink("hay", "hay"),
          " and ",
          farmLink("corn", "corn"),
          " that grow in the fields."
        ]
      ]
    },
    {
      key: "pig",
      label: "Pigs",
      title: "Pigs",
      image: "ACC50134.jpg",
      content: [
        "Pigs like to play in the mud. That's why they always seem to be dirty. On Zeek's farm, pigs live in this pig pen.",
        "Baby pigs are called piglets. Grown-ups are called sows and boars. Pigs' noses are called snouts. They use their snouts to dig up roots and grubs in the ground to eat.",
        "Pigs like to eat a lot and will eat almost anything. When pigs eat, they really pig out!"
      ]
    },
    {
      key: "horse",
      label: "Horses",
      title: "Horses",
      image: "ACB50144.jpg",
      content: [
        "Horses help with many of the jobs on the farm. Before farmers had tractors to help with planting and harvesting, horses were used to pull plows and other farm equipment. Horses still help farmers by pulling wagons and buggies.",
        "Baby horses are called colts. Grown-ups are called mares and stallions. Zebras and donkeys are cousins of horses.",
        "Farmers sometimes ride horses as they care for other animals by not letting them wander too far away. Horses also like to play and horse around!"
      ]
    },
    {
      key: "sheep",
      label: "Sheep",
      title: "Sheep",
      image: "ACE50059.jpg",
      content: [
        "Sheep have a thick coat of wool that we call fleece. The fleece sheared off, cleaned, spun, and made into clothes and blankets.",
        "Baby sheep are called lambs. Grown-ups are called ewes and rams.",
        [
          "Sheep live together in groups called flocks. They eat grass that grows in the fields. ",
          farmLink("dog", "Dogs"),
          " sometimes help farmers herd the sheep, keeping them together and out of danger."
        ]
      ]
    },
    {
      key: "chicken",
      label: "Chickens",
      title: "Chickens",
      image: "ABX50047.jpg",
      content: [
        "On Zeek's farm, chickens live in a chicken coop. This is where the chickens will lay eggs. Chickens eat insects and grain by pecking at them on the ground.",
        "Baby chickens are called chicks. Grown-ups are called hens and roosters. Roosters wake up farmers in the morning by crowing to announce the beginning of a new day.",
        "Chickens lay eggs that are gathered and used for food. Chicken feathers are used to make pillows."
      ]
    },
    {
      key: "dog",
      label: "Dogs",
      title: "Dogs",
      image: "ACU50036.jpg",
      content: [
        "Dogs help on the farm by rounding up the other animals so that they can find their way home. They can also go get help if someone is in trouble.",
        "Baby dogs are called puppies.",
        "Dogs are known as the farmer's best friend. They protect farmers and their families by barking to warn of danger. Many dogs like to play fetch by chasing after sticks and bringing them back."
      ]
    },
    {
      key: "cat",
      label: "Cats",
      title: "Cats",
      image: "ACT50369.jpg",
      content: [
        "Cats like to chase and play with each other around the farm. They also chase small rodents like mice. On Zeek's farm, cats can usually be found playing in the barn.",
        [
          "Baby cats are called kittens. Zeek's cats like to drink the milk from his ",
          farmLink("cow", "cows"),
          ". They mostly like to nap and cuddle."
        ],
        [
          "Cats like to play with balls of yarn made using the wool from ",
          farmLink("sheep", "sheep"),
          ". Zeek's cats also like to climb trees."
        ]
      ]
    }
  ];

  var PLANTS = [
    {
      key: "corn",
      label: "Corn",
      title: "Corn",
      image: "SSGP1195.jpg",
      content: [
        "Some farmers plant corn in their fields. Corn plants grow tall and have many, long, deep green leaves. The top of the corn plant is called a tassel. Each corn plant may have several ears of corn growing on it. Farmers can use a machine called a combine to pick the corn.",
        "There are many different types of corn plants. Some corn is called Indian Corn and has kernels with several different colors. The corn mostly found in supermarkets is called sweet corn. The corn called popcorn has kernels that pop when heated."
      ]
    },
    {
      key: "hay",
      label: "Hay",
      title: "Hay",
      image: "SSGP1724.jpg",
      content: [
        [
          farmLink("cow", "Cows"),
          " and ",
          farmLink("horse", "horses"),
          " eat hay. Hay is tall grass that is grown and dried in the Summer. Farmers bale the hay to make it easier to store it in their barns. Stored hay will be used to feed the animals during Winter. Bales of hay can be either round or square-shaped."
        ],
        "After Zeek puts the hay into his barn, he likes to lie on it and take a nap!"
      ]
    },
    {
      key: "wheat",
      label: "Wheat",
      title: "Wheat",
      image: "B41327.jpg",
      content: [
        "Some farmers grow wheat in their fields. Wheat that is planted in the Fall is called Winter Wheat because it grows during the Winter. This wheat is harvested in the Spring. Farmers can then use the same fields to plant other crops such as corn or hay.",
        "Wheat is used to make flour. Flour can then be used to make cereal and bread."
      ]
    },
    {
      key: "pumpkin",
      label: "Pumpkins",
      title: "Pumpkins",
      image: "671700.jpg",
      content: [
        [
          "Here are pumpkins in one of Zeek's fields. Pumpkins can be used to feed the animals. You can also make delicious pies out of them. Pumpkin pies can be served with whipped cream made from the milk of ",
          farmLink("cow", "cows"),
          "."
        ],
        "Zeek likes to grow pumpkins because they can be carved into Jack-O-Lanterns for Halloween."
      ]
    },
    {
      key: "apple",
      label: "Apples",
      title: "Apples",
      image: "B41300.jpg",
      content: [
        "Here are apples growing in one of the orchards. Zeek will sometimes just pick an apple right off the tree and eat it. He has to be careful when he does that, because some worms like to eat apples too!",
        "Zeek likes to grow apples because he can make apple pies and caramel apples."
      ]
    },
    {
      key: "orange",
      label: "Oranges",
      title: "Oranges",
      image: "B9451.jpg",
      content: [
        "These oranges grow in one of the orchards. Oranges are squeezed to make orange juice. You can peel off the outer part of the orange, called the rind, and eat the sweet and juicy inner segments.",
        "Zeek likes to grow oranges because he can eat them for snacks. Oranges also contain Vitamin C that helps people to stay healthy."
      ]
    },
    {
      key: "grape",
      label: "Grapes",
      title: "Grapes",
      image: "SSGP1004.jpg",
      content: [
        "Grapes grow on vines in a vineyard. Grapes come in different colors like purple, red and green. They are squeezed to make grape juice or can be eaten as a snack. If the grapes are picked and left in the Sun to dry out, they become raisins. Raisin are used for snacks and to put on breakfast cereal.",
        "Zeek also uses his grapes to make grape jelly."
      ]
    }
  ];

  function findAnimal(key) {
    return ANIMALS.filter(function (a) {
      return a.key === key;
    })[0];
  }

  function findPlant(key) {
    return PLANTS.filter(function (p) {
      return p.key === key;
    })[0];
  }

  function buildFarmParagraph(content) {
    var p = document.createElement("p");

    if (typeof content === "string") {
      p.textContent = content;
      return p;
    }

    content.forEach(function (segment) {
      if (typeof segment === "string") {
        p.appendChild(document.createTextNode(segment));
      } else {
        var link = document.createElement("button");
        link.type = "button";
        link.className = "school-inline-link";
        link.textContent = segment.label;
        link.addEventListener("click", function () {
          var animal = findAnimal(segment.farmLink);
          if (animal) {
            renderFarmAnimal(segment.farmLink);
          } else {
            renderFarmPlant(segment.farmLink);
          }
        });
        p.appendChild(link);
      }
    });

    return p;
  }

  function renderFarmAniNav(container) {
    var nav = document.createElement("div");
    nav.className = "school-farm-subnav";
    var label = document.createElement("span");
    label.className = "school-farm-subnav-label";
    label.textContent = "Which animals should we visit next?";
    nav.appendChild(label);

    var row = document.createElement("div");
    row.className = "school-farm-subnav-row";
    ANIMALS.forEach(function (animal) {
      row.appendChild(
        makeButton(animal.label, "school-farm-nav-btn", function () {
          renderFarmAnimal(animal.key);
        })
      );
    });
    nav.appendChild(row);
    container.appendChild(nav);
  }

  function renderFarmPltNav(container) {
    var nav = document.createElement("div");
    nav.className = "school-farm-subnav";
    var label = document.createElement("span");
    label.className = "school-farm-subnav-label";
    label.textContent = "Which crop should we visit next?";
    nav.appendChild(label);

    var row = document.createElement("div");
    row.className = "school-farm-subnav-row";
    PLANTS.forEach(function (plant) {
      row.appendChild(
        makeButton(plant.label, "school-farm-nav-btn", function () {
          renderFarmPlant(plant.key);
        })
      );
    });
    nav.appendChild(row);
    container.appendChild(nav);
  }

  function renderFarmNav(container) {
    var nav = document.createElement("div");
    nav.className = "school-farm-mainnav";
    nav.appendChild(makeButton("Start", "school-farm-nav-btn", renderFarmEntrance));
    nav.appendChild(
      makeButton("Animals", "school-farm-nav-btn", renderFarmAnimalsIntro)
    );
    nav.appendChild(makeButton("Crops", "school-farm-nav-btn", renderFarmCropsIntro));
    nav.appendChild(makeButton("End", "school-farm-nav-btn", renderFarmEnd));
    container.appendChild(nav);
  }

  function farmFooter(container) {
    var nav = document.createElement("div");
    nav.className = "school-nav";
    nav.appendChild(
      makeButton("Return to School", "school-back-btn", renderEntrance)
    );
    container.appendChild(nav);
  }

  function renderFarmEntrance() {
    state = { screen: "farm-entrance" };

    var container = byId("school-content");
    clear(container);

    container.appendChild(heading("KidsTown School: Field-Trip to a Farm"));
    container.appendChild(
      paragraph("You have just arrived at Zeek's farm.", "school-guess")
    );
    container.appendChild(
      paragraph("Zeek lives on a farm in the country. This is a picture of Zeek's farm.")
    );
    container.appendChild(image("AZP00022.GIF", "Zeek's farm", "school-farm-img"));

    var zeekRow = document.createElement("div");
    zeekRow.className = "school-farm-zeek-row";
    zeekRow.appendChild(image("AZS00001.GIF", "Farmer Zeek", "school-farm-zeek-img"));
    var zeekText = document.createElement("div");
    zeekText.appendChild(paragraph("This is Farmer Zeek."));
    zeekText.appendChild(
      paragraph(
        "\"Hello! Welcome to my farm! You can just call me Zeek. Let's get started on your tour!\""
      )
    );
    zeekRow.appendChild(zeekText);
    container.appendChild(zeekRow);

    var choices = document.createElement("div");
    choices.className = "school-choices";
    choices.appendChild(
      makeButton(
        "See the Animals That Live on Zeek's Farm",
        "school-choice-btn",
        renderFarmAnimalsIntro
      )
    );
    choices.appendChild(
      makeButton(
        "See the Different Kinds of Plants That Zeek Grows",
        "school-choice-btn",
        renderFarmCropsIntro
      )
    );
    container.appendChild(choices);

    farmFooter(container);
  }

  function renderFarmAnimalsIntro() {
    state = { screen: "farm-animals-intro" };

    var container = byId("school-content");
    clear(container);

    container.appendChild(heading("Farm Field-Trip: Animals"));
    container.appendChild(
      paragraph(
        "Zeek has many jobs to do on the farm. He has to feed all of his " +
          "animals. Here is Zeek feeding his animals."
      )
    );
    container.appendChild(image("AZQ00002.GIF", "Zeek feeding his animals", "school-farm-img"));
    container.appendChild(
      paragraph(
        "One of Zeek's jobs is to take care of the animals that live on " +
          "the farm. He takes care of cows, pigs, horses, sheep and chickens."
      )
    );

    renderFarmAniNav(container);
    renderFarmNav(container);
    farmFooter(container);
  }

  function renderFarmAnimal(key) {
    state = { screen: "farm-animal-" + key };

    var animal = findAnimal(key);
    var container = byId("school-content");
    clear(container);

    container.appendChild(heading("Farm Field-Trip: " + animal.title));
    container.appendChild(image(animal.image, animal.title, "school-farm-img"));
    animal.content.forEach(function (block) {
      container.appendChild(buildFarmParagraph(block));
    });

    renderFarmAniNav(container);
    renderFarmNav(container);
    farmFooter(container);
  }

  function renderFarmCropsIntro() {
    state = { screen: "farm-crops-intro" };

    var container = byId("school-content");
    clear(container);

    container.appendChild(heading("Farm Field-Trip: Seasons"));
    container.appendChild(
      paragraph("Zeek grows vegetables in his fields and fruit in his orchards.")
    );
    container.appendChild(
      paragraph(
        "Zeek has different jobs to do in the different seasons of the " +
          "year. There are four seasons: Spring, Summer, Fall and Winter."
      )
    );
    container.appendChild(
      paragraph(
        "Zeek's year begins with the season of Spring. This season is " +
          "also known as the farmer's planting season. Farmers go out " +
          "into their fields and plant seeds in the ground so they will grow."
      )
    );
    container.appendChild(
      paragraph(
        "After Spring comes Summer. During the Summer the plants will " +
          "grow big and tall. Rain and sunshine helps the plants to grow."
      )
    );
    container.appendChild(
      paragraph(
        "After Summer comes Fall. This season is known as harvest " +
          "season. That's when farmers go out into the fields and gather " +
          "the plants that grew during the Spring and Summer."
      )
    );
    container.appendChild(
      paragraph(
        "After Fall comes Winter. During the Winter, some of the fruits " +
          "on the orchard trees will ripen and can be picked."
      )
    );
    container.appendChild(image("AZR00003.GIF", "Zeek getting ready", "school-farm-img"));
    container.appendChild(
      paragraph("Here is Zeek getting ready to go out to his fields. We better get going!")
    );

    var choices = document.createElement("div");
    choices.className = "school-choices";
    choices.appendChild(
      makeButton(
        "See What Grows in Zeek's Fields and Orchards",
        "school-choice-btn",
        renderFarmPlantsIntro
      )
    );
    container.appendChild(choices);

    farmFooter(container);
  }

  function renderFarmPlantsIntro() {
    state = { screen: "farm-plants-intro" };

    var container = byId("school-content");
    clear(container);

    container.appendChild(heading("Farm Field-Trip: Crops"));
    container.appendChild(
      buildFarmParagraph([
        "Zeek grows many different kinds of vegetables and grains in " +
          "his fields. Some of the vegetables are ",
        farmLink("corn", "corn"),
        " and ",
        farmLink("pumpkin", "pumpkins"),
        ". Some of the grains are ",
        farmLink("hay", "hay"),
        " and ",
        farmLink("wheat", "wheat"),
        "."
      ])
    );
    container.appendChild(
      buildFarmParagraph([
        "Zeek grows many different kinds of fruits in his orchards and " +
          "vineyards. Some of the fruits are ",
        farmLink("apple", "apples"),
        ", ",
        farmLink("orange", "oranges"),
        " and ",
        farmLink("grape", "grapes"),
        "."
      ])
    );
    container.appendChild(image("AZO00008.GIF", "Zeek's harvest", "school-farm-img"));
    container.appendChild(
      paragraph(
        "After Zeek has gathered all of the vegetables and fruits, he " +
          "sells them to be sent to grocery stores and supermarkets."
      )
    );

    renderFarmPltNav(container);
    renderFarmNav(container);
    farmFooter(container);
  }

  function renderFarmPlant(key) {
    state = { screen: "farm-plant-" + key };

    var plant = findPlant(key);
    var container = byId("school-content");
    clear(container);

    container.appendChild(heading("Farm Field-Trip: " + plant.title));
    container.appendChild(image(plant.image, plant.title, "school-farm-img"));
    plant.content.forEach(function (block) {
      container.appendChild(buildFarmParagraph(block));
    });

    renderFarmPltNav(container);
    renderFarmNav(container);
    farmFooter(container);
  }

  function renderFarmEnd() {
    state = { screen: "farm-end" };

    var container = byId("school-content");
    clear(container);

    container.appendChild(heading("Farm Field-Trip: End"));
    container.appendChild(
      paragraph("Zeek would like to thank you for coming and joining him on his farm.")
    );

    var row = document.createElement("div");
    row.className = "school-farm-zeek-row";
    row.appendChild(image("CKC01001.GIF", "Zeek waving goodbye", "school-farm-zeek-img"));
    var text = document.createElement("div");
    text.appendChild(paragraph("\"Come back and see us again real soon!\""));
    text.appendChild(paragraph("\"Thanks for visiting!\""));
    text.appendChild(paragraph("\"I hope you had a great time on the farm!\""));
    row.appendChild(text);
    container.appendChild(row);

    var choices = document.createElement("div");
    choices.className = "school-choices";
    choices.appendChild(
      makeButton("Click Here to Return to School", "school-choice-btn", renderEntrance)
    );
    container.appendChild(choices);

    renderFarmNav(container);
    farmFooter(container);
  }

  // -----------------------------------------------------------------------

  function start() {
    renderEntrance();
  }

  window.School = { start: start };
})();
