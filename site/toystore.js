/*
 * Toy Store entrance, Riddles, Shape Poems, and Bonus Problem activities.
 *
 * A client-side conversion of kidstown_cgi-main/scripts/toystore
 * (toystore.pl, poem1-7.pl, answer1-7.pl, shapeP1-5.pl, ans1-5.pl,
 * pp.pl, tools.pl, ppans.pl). Nothing here calls kt.cgi or any
 * server-side script.
 */
(function () {
  "use strict";

  var ASSET_PATH = "assets/images/toystore/";

  // Riddles, transcribed from kidstown_cgi-main/scripts/toystore/poem1-7.pl
  // and answer1-7.pl. Each riddle's "next" is the original's own forward
  // link on its answer page (answer1-6.pl each point at the next riddle;
  // answer7.pl points at Shape Poems, which isn't built yet, so it falls
  // back to a "still being converted" screen here).
  var RIDDLES = [
    {
      ordinal: "First",
      lines: [
        "I wear a multicolored coat",
        "of ribbons, green, yellow and blue",
        "I shine after each rain",
        "To bring good luck",
        "To all of you."
      ],
      answerHeading: "Did You Guess It?",
      answerText: "It is a rainbow.",
      image: "rain3.gif",
      alt: "A rainbow"
    },
    {
      ordinal: "Second",
      lines: [
        "Blow it up",
        "and watch the skin",
        "grow bigger.",
        "Twist a string to it.",
        "Tie it.",
        "See it floating there",
        "way above you",
        "in the air."
      ],
      answerHeading: "Did You Guess It?",
      answerText: "It is a balloon.",
      image: "balloon.gif",
      alt: "A balloon"
    },
    {
      ordinal: "Third",
      lines: [
        "Once these creatures roamed",
        "the world alone.",
        "Now they are fossil.",
        "Now they are bone.",
        "You can see them",
        "in the halls of",
        "the natural history museum."
      ],
      answerHeading: "Did You Guess Them?",
      answerText: "They are dinosaurs.",
      image: "dino.gif",
      alt: "Dinosaurs"
    },
    {
      ordinal: "Fourth",
      lines: [
        "Over six feet tall,",
        "with black and white feathers,",
        "and two long feet,",
        "you will find me",
        "at the zoo street."
      ],
      answerHeading: "Did You Guess Me?",
      answerText: "I am an ostrich.",
      image: "ostrich.gif",
      alt: "An ostrich"
    },
    {
      ordinal: "Fifth",
      lines: [
        "I am the color of milky white",
        "falling through the air",
        "landing on things",
        "to light there."
      ],
      answerHeading: "Did You Guess Me?",
      answerText: "I am a snow flake.",
      image: "snow.gif",
      alt: "A snowflake"
    },
    {
      ordinal: "Sixth",
      lines: [
        "They grow by lakes",
        "and streams",
        "when workers see them",
        "they scream",
        "they are four feet tall",
        "in the fall",
        "blooming in white seeds",
        "they are like weeds",
        "hot dog at first",
        "catlike at last."
      ],
      answerHeading: "Did You Guess Me?",
      answerText: "I am a cattail.",
      image: "cattail.gif",
      alt: "A cattail"
    },
    {
      ordinal: "Seventh",
      lines: [
        "They are yellow at first",
        "then fluffy white",
        "hundreds grouped together",
        "they will float away",
        "in autumn days",
        "upon windy weather."
      ],
      answerHeading: "Did You Guess Me?",
      answerText: "I am a dandelion.",
      image: "dande.gif",
      alt: "A dandelion"
    }
  ];

  // Shape Poems, transcribed from
  // kidstown_cgi-main/scripts/toystore/shapeP1-5.pl and ans1-5.pl. Each
  // poem shows a shape picture and asks "What shape do you see?"; the
  // answer page names the shape and gives a short poem about it.
  // ans1-4.pl each forward to the next shape poem; ans5.pl forwards to
  // the Bonus Problem (pp.pl).
  var SHAPE_POEMS = [
    {
      ordinal: "First",
      image: "star.gif",
      alt: "A star",
      answerHeading: "Did You See a Star?",
      answerLines: [
        "Stars are so bright,",
        "shining above us all.",
        "Millions and billions",
        "shining from dusk to dawn",
        "with silver light, so pretty."
      ]
    },
    {
      ordinal: "Second",
      image: "leaf1.gif",
      alt: "A leaf",
      answerHeading: "Did You See a Leaf?",
      answerLines: [
        "Leaves are so neat.",
        "Green, gold, brown and last but not least red.",
        "Falling, dancing & playing,",
        "they're neat."
      ]
    },
    {
      ordinal: "Third",
      image: "moon.gif",
      alt: "A crescent moon",
      answerHeading: "Did You See a Crescent Moon?",
      answerLines: [
        "Have you ever thought about the moon?",
        "Peaceful and sleepy",
        "with all its craters and of course mountains.",
        "It lets you go to sleep."
      ]
    },
    {
      ordinal: "Fourth",
      image: "tree.gif",
      alt: "A tree",
      answerHeading: "Did You See a Tree?",
      answerLines: [
        "Trees are so majestic,",
        "so tall and green,",
        "standing above everyone.",
        "It gives me cool shade in the summer",
        "with all its leaves.",
        "Thank goodness for the trees!"
      ]
    },
    {
      ordinal: "Fifth",
      image: "clover.gif",
      alt: "A four leaf clover",
      answerHeading: "Did You See a Four Leaf Clover?",
      answerLines: [
        "I once found a four leaf clover.",
        "\"Oh wow,\"",
        "I thought, \"it'll bring me good luck.\"",
        "O.k. I wish I never found it.",
        "Never found it!",
        "That day I fell down the stairs",
        "and I got kicked in the shins, O.K.",
        "Pooh on that four leaf clover."
      ]
    }
  ];

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

  // -----------------------------------------------------------------------
  // Toy Store entrance (toystore.pl)
  // -----------------------------------------------------------------------

  function renderEntrance() {
    state.screen = "entrance";

    var container = byId("toystore-content");
    clear(container);

    var heading = document.createElement("h1");
    heading.textContent = "Welcome to the KidsTown Toy Store";
    container.appendChild(heading);

    var prompt = document.createElement("p");
    prompt.className = "toystore-prompt";
    prompt.textContent = "Please click on one of the following:";
    container.appendChild(prompt);

    var choices = document.createElement("div");
    choices.className = "toystore-choices";
    choices.appendChild(
      makeButton("Riddles", "toystore-choice-btn", function () {
        renderRiddle(0);
      })
    );
    choices.appendChild(
      makeButton("Shape Poems", "toystore-choice-btn", function () {
        renderShapePoem(0);
      })
    );
    choices.appendChild(
      makeButton("Bonus Problem", "toystore-choice-btn", function () {
        renderBonusProblem();
      })
    );
    container.appendChild(choices);

    var nav = document.createElement("div");
    nav.className = "toystore-nav";
    nav.appendChild(
      makeLink("Return to the KidsTown map", "toystore-map-link", "#/home")
    );
    container.appendChild(nav);
  }

  // -----------------------------------------------------------------------
  // Riddles (poem1-7.pl)
  // -----------------------------------------------------------------------

  function renderRiddle(index) {
    state.screen = "riddle-" + index;

    var riddle = RIDDLES[index];
    var container = byId("toystore-content");
    clear(container);

    var heading = document.createElement("h1");
    heading.textContent = "Your " + riddle.ordinal + " Riddle:";
    container.appendChild(heading);

    var poem = document.createElement("p");
    poem.className = "toystore-poem";
    riddle.lines.forEach(function (line, lineIndex) {
      if (lineIndex > 0) {
        poem.appendChild(document.createElement("br"));
      }
      poem.appendChild(document.createTextNode(line));
    });
    container.appendChild(poem);

    var guess = document.createElement("p");
    guess.className = "toystore-guess";
    guess.textContent = "Can you guess it?";
    container.appendChild(guess);

    var choices = document.createElement("div");
    choices.className = "toystore-choices";
    choices.appendChild(
      makeButton("Click Here for the Answer", "toystore-choice-btn", function () {
        renderAnswer(index);
      })
    );
    container.appendChild(choices);

    var riddleNav = document.createElement("div");
    riddleNav.className = "toystore-riddle-nav";
    var label = document.createElement("span");
    label.className = "toystore-riddle-nav-label";
    label.textContent = "Riddles:";
    riddleNav.appendChild(label);

    RIDDLES.forEach(function (other, otherIndex) {
      if (otherIndex === index) {
        return;
      }
      riddleNav.appendChild(
        makeButton(
          String(otherIndex + 1),
          "toystore-riddle-num-btn",
          function () {
            renderRiddle(otherIndex);
          }
        )
      );
    });
    container.appendChild(riddleNav);

    var nav = document.createElement("div");
    nav.className = "toystore-nav";
    nav.appendChild(
      makeButton("Shape Poems", "toystore-back-btn", function () {
        renderShapePoem(0);
      })
    );
    nav.appendChild(
      makeButton("Bonus Problem", "toystore-back-btn", function () {
        renderBonusProblem();
      })
    );
    nav.appendChild(
      makeButton("Return to the Toy Store", "toystore-back-btn", renderEntrance)
    );
    container.appendChild(nav);
  }

  function renderAnswer(index) {
    state.screen = "answer-" + index;

    var riddle = RIDDLES[index];
    var container = byId("toystore-content");
    clear(container);

    var heading = document.createElement("h1");
    heading.textContent = riddle.answerHeading;
    container.appendChild(heading);

    var img = document.createElement("img");
    img.src = ASSET_PATH + riddle.image;
    img.alt = riddle.alt;
    img.className = "toystore-answer-img";
    container.appendChild(img);

    var answerText = document.createElement("p");
    answerText.className = "toystore-answer-text";
    answerText.textContent = riddle.answerText;
    container.appendChild(answerText);

    var choices = document.createElement("div");
    choices.className = "toystore-choices";

    var isLast = index === RIDDLES.length - 1;
    choices.appendChild(
      makeButton(
        isLast
          ? "Click Here to See the Shape Poems"
          : "Click Here to Try Another Riddle",
        "toystore-choice-btn",
        function () {
          if (isLast) {
            renderShapePoem(0);
          } else {
            renderRiddle(index + 1);
          }
        }
      )
    );
    container.appendChild(choices);

    var nav = document.createElement("div");
    nav.className = "toystore-nav";
    nav.appendChild(
      makeButton("Back to This Riddle", "toystore-back-btn", function () {
        renderRiddle(index);
      })
    );
    nav.appendChild(
      makeButton("Return to the Toy Store", "toystore-back-btn", renderEntrance)
    );
    container.appendChild(nav);
  }

  // -----------------------------------------------------------------------
  // Shape Poems (shapeP1-5.pl)
  // -----------------------------------------------------------------------

  function renderShapePoem(index) {
    state.screen = "shape-" + index;

    var poem = SHAPE_POEMS[index];
    var container = byId("toystore-content");
    clear(container);

    var heading = document.createElement("h1");
    heading.textContent = "Your " + poem.ordinal + " Shape Poem:";
    container.appendChild(heading);

    var img = document.createElement("img");
    img.src = ASSET_PATH + poem.image;
    img.alt = poem.alt;
    img.className = "toystore-shape-img";
    container.appendChild(img);

    var question = document.createElement("p");
    question.className = "toystore-guess";
    question.textContent = "What shape do you see?";
    container.appendChild(question);

    var choices = document.createElement("div");
    choices.className = "toystore-choices";
    choices.appendChild(
      makeButton("Click Here for the Answer", "toystore-choice-btn", function () {
        renderShapeAnswer(index);
      })
    );
    container.appendChild(choices);

    var shapeNav = document.createElement("div");
    shapeNav.className = "toystore-riddle-nav";
    var label = document.createElement("span");
    label.className = "toystore-riddle-nav-label";
    label.textContent = "Shape Poems:";
    shapeNav.appendChild(label);

    SHAPE_POEMS.forEach(function (other, otherIndex) {
      if (otherIndex === index) {
        return;
      }
      shapeNav.appendChild(
        makeButton(
          String(otherIndex + 1),
          "toystore-riddle-num-btn",
          function () {
            renderShapePoem(otherIndex);
          }
        )
      );
    });
    container.appendChild(shapeNav);

    var nav = document.createElement("div");
    nav.className = "toystore-nav";
    nav.appendChild(
      makeButton("Riddles", "toystore-back-btn", function () {
        renderRiddle(0);
      })
    );
    nav.appendChild(
      makeButton("Bonus Problem", "toystore-back-btn", function () {
        renderBonusProblem();
      })
    );
    nav.appendChild(
      makeButton("Return to the Toy Store", "toystore-back-btn", renderEntrance)
    );
    container.appendChild(nav);
  }

  function renderShapeAnswer(index) {
    state.screen = "shape-answer-" + index;

    var poem = SHAPE_POEMS[index];
    var container = byId("toystore-content");
    clear(container);

    var heading = document.createElement("h1");
    heading.textContent = poem.answerHeading;
    container.appendChild(heading);

    var img = document.createElement("img");
    img.src = ASSET_PATH + poem.image;
    img.alt = poem.alt;
    img.className = "toystore-shape-img";
    container.appendChild(img);

    var answerText = document.createElement("p");
    answerText.className = "toystore-shape-answer-text";
    poem.answerLines.forEach(function (line, lineIndex) {
      if (lineIndex > 0) {
        answerText.appendChild(document.createElement("br"));
      }
      answerText.appendChild(document.createTextNode(line));
    });
    container.appendChild(answerText);

    var choices = document.createElement("div");
    choices.className = "toystore-choices";

    var isLast = index === SHAPE_POEMS.length - 1;
    choices.appendChild(
      makeButton(
        isLast
          ? "Click Here to Read the Problem"
          : "Click Here for Your Next Shape Poem",
        "toystore-choice-btn",
        function () {
          if (isLast) {
            renderBonusProblem();
          } else {
            renderShapePoem(index + 1);
          }
        }
      )
    );
    container.appendChild(choices);

    var nav = document.createElement("div");
    nav.className = "toystore-nav";
    nav.appendChild(
      makeButton("Back to This Shape Poem", "toystore-back-btn", function () {
        renderShapePoem(index);
      })
    );
    nav.appendChild(
      makeButton("Return to the Toy Store", "toystore-back-btn", renderEntrance)
    );
    container.appendChild(nav);
  }

  // -----------------------------------------------------------------------
  // Bonus Problem (pp.pl / tools.pl / ppans.pl)
  // -----------------------------------------------------------------------

  function bonusProblemNav(container) {
    var nav = document.createElement("div");
    nav.className = "toystore-nav";
    nav.appendChild(
      makeButton("Riddles", "toystore-back-btn", function () {
        renderRiddle(0);
      })
    );
    nav.appendChild(
      makeButton("Shape Poems", "toystore-back-btn", function () {
        renderShapePoem(0);
      })
    );
    nav.appendChild(
      makeButton("Return to the Toy Store", "toystore-back-btn", renderEntrance)
    );
    container.appendChild(nav);
  }

  function renderBonusProblem() {
    state.screen = "bonus-problem";

    var container = byId("toystore-content");
    clear(container);

    var heading = document.createElement("h1");
    heading.textContent = "Bonus Problem:";
    container.appendChild(heading);

    var img = document.createElement("img");
    img.src = ASSET_PATH + "pingpong.gif";
    img.alt = "A ping pong ball stuck in a hole";
    img.className = "toystore-bonus-img";
    container.appendChild(img);

    var setup = document.createElement("p");
    setup.className = "toystore-bonus-text";
    setup.textContent =
      "Ping pong (table tennis) is a fun game to play, but sometimes " +
      "the ball gets away and rolls into a hole. That is exactly what " +
      "happened to this man. The problem is, he can not reach the ball.";
    container.appendChild(setup);

    var prompt = document.createElement("p");
    prompt.className = "toystore-guess";
    prompt.textContent = "Can you help him retrieve the ball?";
    container.appendChild(prompt);

    var choices = document.createElement("div");
    choices.className = "toystore-choices";
    choices.appendChild(
      makeButton(
        "Click Here to See the Available Tools",
        "toystore-choice-btn",
        renderBonusTools
      )
    );
    container.appendChild(choices);

    bonusProblemNav(container);
  }

  function renderBonusTools() {
    state.screen = "bonus-tools";

    var container = byId("toystore-content");
    clear(container);

    var heading = document.createElement("h1");
    heading.textContent = "Here Are the Available Tools:";
    container.appendChild(heading);

    var img = document.createElement("img");
    img.src = ASSET_PATH + "tools.gif";
    img.alt = "A bucket of water, a broom, a shovel, a roll of string, and a dust pan";
    img.className = "toystore-bonus-img";
    container.appendChild(img);

    var toolsText = document.createElement("p");
    toolsText.className = "toystore-bonus-text";
    toolsText.textContent =
      "There is a bucket of water, a broom, a shovel, a roll of " +
      "string, and a dust pan.";
    container.appendChild(toolsText);

    var prompt = document.createElement("p");
    prompt.className = "toystore-guess";
    prompt.textContent = "What tools would you use to get the ball out of the hole?";
    container.appendChild(prompt);

    var choices = document.createElement("div");
    choices.className = "toystore-choices";
    choices.appendChild(
      makeButton(
        "Click Here to See One Answer",
        "toystore-choice-btn",
        renderBonusAnswer
      )
    );
    container.appendChild(choices);

    var nav = document.createElement("div");
    nav.className = "toystore-nav";
    nav.appendChild(
      makeButton("Back to the Problem", "toystore-back-btn", renderBonusProblem)
    );
    container.appendChild(nav);
    bonusProblemNav(container);
  }

  function renderBonusAnswer() {
    state.screen = "bonus-answer";

    var container = byId("toystore-content");
    clear(container);

    var heading = document.createElement("h1");
    heading.textContent = "Did You Think of the Water?";
    container.appendChild(heading);

    var img = document.createElement("img");
    img.src = ASSET_PATH + "ansprob.gif";
    img.alt = "Filling the hole with water to float the ball out";
    img.className = "toystore-bonus-img";
    container.appendChild(img);

    var answerText = document.createElement("p");
    answerText.className = "toystore-bonus-text";
    answerText.textContent =
      "There are multiple ways to retrieve the ping pong ball. A " +
      "simple way is to fill the hole with the water from the bucket, " +
      "and let the ball float to the top of the hole. From there, you " +
      "can reach and grab it.";
    container.appendChild(answerText);

    var nav = document.createElement("div");
    nav.className = "toystore-nav";
    nav.appendChild(
      makeButton("Back to the Problem", "toystore-back-btn", renderBonusProblem)
    );
    container.appendChild(nav);
    bonusProblemNav(container);
  }

  // -----------------------------------------------------------------------

  function start() {
    state = { screen: "entrance" };
    renderEntrance();
  }

  window.ToyStore = { start: start };
})();
