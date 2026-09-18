/*
 * City Hall: Casebook Interactive Stories.
 *
 * A client-side conversion of kidstown_cgi-main/scripts/cityhall, traced
 * against every City Hall route in kt.db (KEY 5000-5300, plus 5900 for
 * Help):
 *   cityhall.pl   - entrance (KEY 5000)
 *   bbb1.pl .. bbbend.pl  - "The Bungled Bank Burglary" (KEY 5010-5240)
 *   cap1.pl .. capend.pl  - "The Case of the Alien Photo" (KEY 5250-5300)
 *   help.pl       - Casebook help page (KEY 5900)
 * Nothing here calls kt.cgi or any server-side script.
 *
 * Note on bbb3-3.pl (KEY 5040): it is registered in kt.db but no other
 * page in the original ever links to it - grep across every cityhall
 * script for "KEY=5040" turns up nothing. It was already unreachable in
 * the source CGI (its content is a near-duplicate of bbb4-3.pl), so it
 * is not wired into this conversion either; wiring it in would invent a
 * path the original never had.
 *
 * Each case is a directed graph of story nodes, one per original script,
 * keyed by that script's own name (bbb1, bbb2a, cap3, ...) so the exact
 * branching structure - including nodes with near-identical text reached
 * from different earlier choices - is preserved rather than collapsed.
 * A visited-node stack (like City Park's) drives the "Back" button, so
 * Back always returns to the node the visitor actually came from.
 */
(function () {
  "use strict";

  var ASSET_PATH = "assets/images/cityhall/";

  function it(text) {
    return { i: text };
  }

  function node(image, alt, paragraphs, choices, opts) {
    opts = opts || {};
    return {
      image: image,
      alt: alt,
      paragraphs: paragraphs,
      choices: choices,
      ending: !!opts.ending
    };
  }

  // The Woodrow Wilson diary page, quoted identically in bbb3-5, bbb3a,
  // bbb3b, and bbb3c.
  var DIARY_ENTRY = { diary: true };

  var DIARY_INTRO = [
    "\"It is a page from former U.S. President Woodrow Wilson's diary,\" Willy continues. \"It is one of the bank's most prized possessions.",
    "It was recently appraised at $500,000. I had never seen it before, but the bank manager talks about it so often that I immediately knew what it was when I approached the thief.\"",
    "You and Detective Anders read the page:"
  ];

  // "Silent alarm" scene text, shared by bbb4-3, bbb4-5, bbb4-6, bbb4a,
  // bbb4c, and bbb4s.
  var SILENT_ALARM_TEXT = [
    "\"Whenever the vault is opened at night a silent alarm notifies the police,\" explains Willy.",
    "\"So I told the robber to put his hands in the air until they arrived, but he dropped the bag and fled out the back of the bank.\"",
    "You and Detective Anders examine the door at the rear of the bank. The lock has been blown apart, probably by a small explosive.",
    "\"I figured that I shouldn't chase him out of the bank. So while I was waiting for the police, I counted the money by hand to make sure none was missing. Within a half an hour the police arrived and the robber had not returned.\""
  ];

  // Historian scene text, shared by bbb5-4, bbb5-6, bbb5a, and bbb5s.
  var HISTORIAN_TEXT = [
    "\"World War I, or the Great War, was the largest and most brutal conflict of its time,\" explains the historian from a nearby library.",
    "\"It spanned the years from 1914 though 1918 but the United States wasn't actively involved until 1917. It was the first war to introduce large-scale use of machine guns, aircraft, and deadly poison gas.\"",
    "\"Could President Wilson have written a note about the Great War in April of 1917?\" You ask the historian.",
    "\"Definitely,\" explains the historian. \"In fact, April 16, 1917 was the day that the United States began fighting. Until then, the U.S. had been considered a neutral country.\""
  ];

  // Bank manager / vault scene text, shared by bbb6-4, bbb6-5, bbb6a,
  // bbb6b, and bbb6s.
  var VAULT_TEXT = [
    "\"We keep $1,000,000 in cash in the vault along with other documents,\" began the bank manager.",
    "\"The bills are all in denominations of $20 or lower so it would have been easy for the robber to spend the money anywhere.\"",
    "\"And what about the other documents?\" you ask.",
    "\"Most of them would have no value to a thief, they are just copies of deeds and loans. However, the Woodrow Wilson diary entry is quite valuable, indeed. Thankfully, Willy was able to recover it with the cash.\""
  ];

  // -----------------------------------------------------------------------
  // The Bungled Bank Burglary (bbb1.pl .. bbbend.pl)
  // -----------------------------------------------------------------------

  var BBB_NODES = {
    bbb1: node(
      "bbb1.gif",
      "The bank manager's office",
      [
        "\"Thank you both for coming,\" the bank manager says as he escorts you toward his office. \"Last night we were nearly robbed.\"",
        "\"Nearly?\" questions Detective Anders.",
        "\"Well, thanks to quick action by our night security guard, Willy Sparks, nothing was stolen. I figured you may be able to find some clues that will lead us to the culprit so he won't strike again. Feel free to examine the vault and interview Willy.\""
      ],
      [
        { label: "Examine the Vault", target: "bbb6a" },
        { label: "Question Willy", target: "bbb2a" }
      ]
    ),

    bbb2a: node(
      "bbb2.gif",
      "Willy Sparks, the security guard",
      [
        "\"I'm not one to brag,\" asserts Willy Sparks, the security guard, \"but without my help, the thief would have gotten away with everything.\"",
        "\"Tell us exactly what happened,\" Detective Anders says as he looks closely at Willy.",
        [
          "\"At about 4:30 in the morning I was doing my rounds near the teller's windows when I heard something back by the vault. I rushed back and surprised a masked man stuffing a bag full of money and ",
          it("this"),
          ",\" explains Willy as he holds up a piece of paper."
        ]
      ],
      [
        { label: "Examine the Paper", target: "bbb3a" },
        { label: "Continue Questioning Willy", target: "bbb4a" }
      ]
    ),

    bbb2b: node(
      "bbb2.gif",
      "Willy Sparks, the security guard",
      [
        "\"I'm not one to brag,\" asserts Willy Sparks, the security guard, \"but without my help, the thief would have gotten away with everything.\"",
        "\"Tell us exactly what happened,\" Detective Anders says as he looks closely at Willy.",
        [
          "\"At about 4:30 in the morning I was doing my rounds near the teller's windows when I heard something back by the vault. I rushed back and surprised a masked man stuffing a bag full of money and ",
          it("this"),
          ",\" explains Willy as he holds up a piece of paper."
        ]
      ],
      [
        { label: "Examine the Paper", target: "bbb3b" },
        { label: "Continue Questioning Willy", target: "bbb4-3" }
      ]
    ),

    "bbb3-5": node(
      "bbb3.gif",
      "The Woodrow Wilson diary page",
      DIARY_INTRO.concat([DIARY_ENTRY]),
      [{ label: "Speak with an Historian", target: "bbb5s" }]
    ),

    bbb3a: node(
      "bbb3.gif",
      "The Woodrow Wilson diary page",
      DIARY_INTRO.concat([DIARY_ENTRY]),
      [
        { label: "Speak with an Historian About the Diary Entry", target: "bbb5a" },
        { label: "Continue Questioning Willy", target: "bbb4c" }
      ]
    ),

    bbb3b: node(
      "bbb3.gif",
      "The Woodrow Wilson diary page",
      DIARY_INTRO.concat([DIARY_ENTRY]),
      [
        { label: "Speak with an Historian About the Diary Entry", target: "bbb5-4" },
        { label: "Continue Questioning Willy", target: "bbb4-5" }
      ]
    ),

    bbb3c: node(
      "bbb3.gif",
      "The Woodrow Wilson diary page",
      DIARY_INTRO.concat([DIARY_ENTRY]),
      [
        { label: "Speak with an Historian About the Diary Entry", target: "bbb5-6" },
        { label: "Examine the Vault", target: "bbb6-5" }
      ]
    ),

    "bbb4-3": node("bbb4.gif", "The rear door of the bank", SILENT_ALARM_TEXT, [
      { label: "Examine the Woodrow Wilson Diary Entry", target: "bbb3-5" }
    ]),

    "bbb4-5": node("bbb4.gif", "The rear door of the bank", SILENT_ALARM_TEXT, [
      { label: "Speak with an Historian", target: "bbb5s" }
    ]),

    "bbb4-6": node("bbb4.gif", "The rear door of the bank", SILENT_ALARM_TEXT, [
      { label: "Examine the Vault", target: "bbb6s" }
    ]),

    bbb4a: node("bbb4.gif", "The rear door of the bank", SILENT_ALARM_TEXT, [
      { label: "Look More Closely at the Scrap of Paper", target: "bbb3c" },
      { label: "Examine the Vault", target: "bbb6b" }
    ]),

    bbb4c: node("bbb4.gif", "The rear door of the bank", SILENT_ALARM_TEXT, [
      { label: "Speak with an Historian About the Diary Entry", target: "bbb5-6" },
      { label: "Examine the Vault", target: "bbb6-5" }
    ]),

    bbb4s: node("bbb4.gif", "The rear door of the bank", SILENT_ALARM_TEXT, [
      { label: "Solve The Bungled Bank Burglary", target: "bbbend" }
    ]),

    "bbb5-4": node("bbb5.gif", "The historian at the library", HISTORIAN_TEXT, [
      { label: "Question Willy Again", target: "bbb4s" }
    ]),

    "bbb5-6": node("bbb5.gif", "The historian at the library", HISTORIAN_TEXT, [
      { label: "Examine the Vault", target: "bbb6s" }
    ]),

    bbb5a: node("bbb5.gif", "The historian at the library", HISTORIAN_TEXT, [
      { label: "Continue Questioning Willy", target: "bbb4-6" },
      { label: "Examine the Vault", target: "bbb6-4" }
    ]),

    bbb5s: node("bbb5.gif", "The historian at the library", HISTORIAN_TEXT, [
      { label: "Solve The Bungled Bank Burglary", target: "bbbend" }
    ]),

    "bbb6-4": node("bbb6.gif", "The bank vault", VAULT_TEXT, [
      { label: "Question Willy Again", target: "bbb4s" }
    ]),

    "bbb6-5": node("bbb6.gif", "The bank vault", VAULT_TEXT, [
      { label: "Speak with an Historian", target: "bbb5s" }
    ]),

    bbb6a: node("bbb6.gif", "The bank vault", VAULT_TEXT, [
      { label: "Willy Needs to Be Questioned Immediately", target: "bbb2b" }
    ]),

    bbb6b: node("bbb6.gif", "The bank vault", VAULT_TEXT, [
      { label: "Examine that Diary Entry", target: "bbb3-5" }
    ]),

    bbb6s: node("bbb6.gif", "The bank vault", VAULT_TEXT, [
      { label: "Solve The Bungled Bank Burglary", target: "bbbend" }
    ]),

    bbbend: node(
      "end.gif",
      "Case solved",
      [
        "\"I think we have enough information to assist your search for the culprit,\" Detective Anders explains to the bank manager.",
        "\"Your security guard, Willy Sparks, is lying about his actions last night. That would suggest he has some involvement in the incident.\"",
        "\"Also, the diary page Willy gave you is a forgery,\" you add.",
        "\"I don't understand. How could Willy be involved? And where is the real diary page?\" cries the bank manager.",
        [
          "\"We knew Willy was lying when he said that he counted all the cash before the police arrived. He said the police arrived within half an hour, but it would have taken more than five hours to count $1,000,000 in small bills by hand. And the diary page is obviously bogus because it refers to '",
          it("World War I"),
          "'. In 1917, the first World War was known as the ",
          it("Great War"),
          ". It wouldn't have made sense to call it World War I when there hadn't been a World War II, yet.\""
        ],
        [
          "Upon hearing this evidence, Willy admits to stealing the diary page and replacing it with a fake. Since he couldn't get into the vault without setting off the silent alarm, he made up the story about the robber. While the police were on their way he forged the diary page, but he was in such a hurry he wrote ",
          it("World War I"),
          " instead of ",
          it("The Great War"),
          "."
        ]
      ],
      [],
      { ending: true }
    )
  };

  // -----------------------------------------------------------------------
  // The Case of the Alien Photo (cap1.pl .. capend.pl)
  // -----------------------------------------------------------------------

  var CAP_NODES = {
    cap1: node(
      "cap1.gif",
      "Maurice Mole's photograph",
      [
        "\"I have proof that there is life on Venus!\" shouts Maurice Mole from across the police station.",
        "\"I'm going to make millions when I sell this to the tabloids,\" he giggles devilishly and waves a photograph in the air.",
        "Maurice Mole is well known in the county as a con artist. He is clever, but you and Detective Anders have managed to foil all his previous attempts to fool the public. You decide to carefully examine the glossy photograph. It shows a barren landscape dotted with tiny figures that look like aliens."
      ],
      [
        { label: "Question Maurice Mole About the Photo", target: "cap2" },
        { label: "Send the Photo to the Crime Lab for Testing", target: "cap3" }
      ]
    ),

    cap2: node(
      "cap2.gif",
      "Maurice Mole",
      [
        "\"Actually, I'm amazed that nobody discovered this before,\" explains Maurice.",
        "\"When I pointed my telescope at Venus last night I saw these little figures jumping around. I thought I should take a picture of them.\"",
        "You and Detective Anders exchange looks of skepticism. Maurice Mole seems like the least likely person to spend his nights looking at the stars."
      ],
      [
        { label: "Continue Questioning Maurice", target: "cap4" },
        { label: "Send the Photo to the Crime Lab", target: "cap3" }
      ]
    ),

    cap3: node(
      "cap3.gif",
      "The crime lab",
      [
        "Rather than spend more time listening to Maurice, you decide that the crime lab may provide you with some answers.",
        "\"I think the photograph is a fake,\" states the scientist at the crime lab, \"but I can't prove it. It looks like 'aliens' were put in the background by a computer. Unfortunately, you will probably need more evidence to prove that Maurice Mole's claims are untrue.\""
      ],
      [{ label: "Question Maurice Face to Face", target: "cap4" }]
    ),

    cap4: node(
      "cap4.jpg",
      "Maurice Mole, the astronomer",
      [
        "\"I'm an astronomer at heart,\" claims Maurice. \"Ever since I saw my first shooting star I fell in love with the night sky.",
        "\"Of course, my favorite planet is Venus.\" Maurice Mole's ears twitch a little bit as he explains his nightly routine. \"When the sky is its darkest, usually around midnight, I turn my telescope toward Venus to admire its rocky surface. In fact, there hasn't been one night in the last six months that I haven't spent at least fifteen minutes looking at the beautiful planet.\"",
        "You see Detective Anders smile slightly. That can only mean one thing: he has found a problem with Maurice Mole's story."
      ],
      [
        { label: "Solve the Mystery", target: "capend" },
        { label: "Look for More Evidence at Maurice Mole's Apartment", target: "cap5" }
      ]
    ),

    cap5: node(
      "cap5.gif",
      "Maurice Mole's telescope",
      [
        "\"I have absolutely nothing to hide,\" exclaims Maurice. \"You may examine my apartment inside and out.\"",
        "Maurice Mole's apartment is dark and messy. His clothes are scattered about the floor and dirty dishes are piled up on the counters. You notice a computer with a scanner in a back room. Maurice guides you to his balcony and points to a shiny white telescope. \"There it is,\" he says. \"If the sky were darker, I would let you look at the aliens for yourselves.\"",
        "You and Detective Anders look at the telescope. It appears to be remarkably clean compared to everything else in the apartment. Something dangling from the eyepiece of the telescope catches your eye; it is a price tag.",
        "\"I, uh,\" stammers Maurice, \"I just forgot to take the price tag off.\"",
        "Detective Anders looks at you with a wink, \"I think you can also forget about getting any money from the tabloids, Maurice. Your photo is a fake.\""
      ],
      [{ label: "The Solution to the Case of the Alien Photo", target: "capend" }]
    ),

    capend: node(
      "end.gif",
      "Case solved",
      [
        "\"Maurice, your story is so full of holes some people might mistake it for swiss cheese!\" you exclaim.",
        "\"First, it would be impossible for you to photograph aliens on the surface of Venus. Venus is covered with a thick blanket of clouds which prevents anyone from seeing the surface. Second, you claim to have looked at Venus every night for the last six months. That, too, is impossible. Due to the motion of the planets, Venus is not visible from Earth for six consecutive months. Finally, you said that you looked at Venus at midnight. As every astronomer knows, Venus is visible only near sunrise or sunset.\"",
        "Confronted with your facts, Maurice decides to confess to the forgery. \"When I heard how much money the tabloids offered for alien photographs, I decided to fake one on my computer. I guess I should have spent more time in the library learning about Venus, first. I just bought the telescope yesterday to fool you two.\""
      ],
      [],
      { ending: true }
    )
  };

  // -----------------------------------------------------------------------
  // Rendering plumbing
  // -----------------------------------------------------------------------

  var state = { screen: "entrance", caseName: null, stack: [] };

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

  // Builds a paragraph from either a plain string or an array of segments
  // (plain strings mixed with {i: "..."} for the original's italicized
  // words), using only textContent/createElement - never innerHTML - so
  // nothing here can ever be parsed as markup.
  function buildParagraph(content) {
    var p = document.createElement("p");

    if (typeof content === "string") {
      p.textContent = content;
      return p;
    }

    content.forEach(function (segment) {
      if (typeof segment === "string") {
        p.appendChild(document.createTextNode(segment));
      } else {
        var em = document.createElement("em");
        em.textContent = segment.i;
        p.appendChild(em);
      }
    });

    return p;
  }

  function buildDiaryBlock() {
    var block = document.createElement("blockquote");
    block.className = "cityhall-diary";

    var date = document.createElement("p");
    date.textContent = "April 16, 1917";
    block.appendChild(date);

    var body = document.createElement("p");
    body.textContent =
      "Today we declared war on Germany and the other Central Powers. " +
      "I have lived through many bloody conflicts in my life, but World " +
      "War I is indeed the most terrible I have ever witnessed.";
    block.appendChild(body);

    var signature = document.createElement("p");
    signature.className = "cityhall-diary-signature";
    signature.textContent = "Thomas Woodrow Wilson";
    block.appendChild(signature);

    return block;
  }

  function renderCommonFooter(container, hide) {
    hide = hide || {};

    var nav = document.createElement("div");
    nav.className = "cityhall-nav";

    if (!hide.help) {
      nav.appendChild(makeButton("City Hall Help", "cityhall-back-btn", renderHelp));
    }

    if (!hide.returnToCityHall) {
      nav.appendChild(
        makeButton("Return to City Hall", "cityhall-back-btn", renderEntrance)
      );
    }

    if (hide.mapLink === false) {
      nav.appendChild(
        makeLink("Return to the KidsTown map", "cityhall-map-link", "#/home")
      );
    }

    container.appendChild(nav);
  }

  // -----------------------------------------------------------------------
  // Entrance (cityhall.pl)
  // -----------------------------------------------------------------------

  function renderEntrance() {
    state.screen = "entrance";
    state.caseName = null;
    state.stack = [];

    var container = byId("cityhall-content");
    clear(container);

    var heading = document.createElement("h1");
    heading.textContent = "KidsTown City Hall";
    container.appendChild(heading);

    var banner = document.createElement("img");
    banner.src = ASSET_PATH + "main.gif";
    banner.alt = "Casebook Interactive Stories";
    banner.className = "cityhall-banner";
    container.appendChild(banner);

    var intro = document.createElement("p");
    intro.className = "cityhall-intro-text";
    intro.textContent =
      "Welcome to City Hall! Today you will be assisting the famous " +
      "crime stopper Detective Anders. You have two new cases to solve. " +
      "In each one, we need you to decide what to do next. Just click " +
      "on the choices at the end of each page and watch how the story " +
      "unfolds!";
    container.appendChild(intro);

    var prompt = document.createElement("p");
    prompt.className = "cityhall-guess";
    prompt.textContent = "Which case would you like to solve:";
    container.appendChild(prompt);

    var choices = document.createElement("div");
    choices.className = "cityhall-choices";
    choices.appendChild(
      makeButton("The Case of the Alien Photo", "cityhall-choice-btn", startCap)
    );
    choices.appendChild(
      makeButton("The Bungled Bank Burglary", "cityhall-choice-btn", startBbb)
    );
    container.appendChild(choices);

    var goodLuck = document.createElement("p");
    goodLuck.className = "cityhall-good-luck";
    goodLuck.textContent = "Good Luck!";
    container.appendChild(goodLuck);

    renderCommonFooter(container, { returnToCityHall: true, mapLink: false });
  }

  // -----------------------------------------------------------------------
  // Help page (help.pl)
  // -----------------------------------------------------------------------

  function renderHelp() {
    state.screen = "help";

    var container = byId("cityhall-content");
    clear(container);

    var heading = document.createElement("h1");
    heading.textContent = "Casebook Interactive Stories Help";
    container.appendChild(heading);

    var banner = document.createElement("img");
    banner.src = ASSET_PATH + "help.gif";
    banner.alt = "Casebook Interactive Stories Help";
    banner.className = "cityhall-banner";
    container.appendChild(banner);

    var p1 = document.createElement("p");
    p1.textContent =
      "To view, and hopefully solve, a Casebook story, select one of " +
      "the cases from the main Casebook page in KidsTown City Hall. " +
      "Then read each page of the story. At the bottom of every page " +
      "you will be presented with one or two choices. Choose which of " +
      "these paths you wish to follow. When the entire case has been " +
      "presented, you will be offered a choice to SOLVE THE CASE. Once " +
      "you select this final choice, the solution to the case will be " +
      "presented.";
    container.appendChild(p1);

    var p2 = document.createElement("p");
    p2.textContent =
      "Within the text of each story, clues will be revealed to assist " +
      "you in solving the case. Don't be discouraged if the solution to " +
      "the case is presented before you have solved it - you will get " +
      "better at finding the solutions as you read more cases.";
    container.appendChild(p2);

    var p3 = document.createElement("p");
    p3.textContent = "Have Fun!";
    container.appendChild(p3);

    var note = document.createElement("p");
    note.className = "cityhall-note";
    note.textContent =
      "NOTE: To return to the page you were last viewing, press the " +
      "'BACK' button on your browser.";
    container.appendChild(note);

    var addedNote = document.createElement("p");
    addedNote.className = "cityhall-note-added";
    addedNote.textContent =
      "In this version, use the Back button on the story page itself " +
      "instead - your browser's own Back button leaves City Hall rather " +
      "than returning to your last page.";
    container.appendChild(addedNote);

    renderCommonFooter(container, { help: true });
  }

  // -----------------------------------------------------------------------
  // Shared story-node rendering for both cases
  // -----------------------------------------------------------------------

  function renderNode(nodes, key, caseTitle, onChoice, onBack, onEnding) {
    var storyNode = nodes[key];
    var container = byId("cityhall-content");
    clear(container);

    var heading = document.createElement("h1");
    heading.textContent = caseTitle;
    container.appendChild(heading);

    var story = document.createElement("div");
    story.className = "cityhall-story";

    var img = document.createElement("img");
    img.src = ASSET_PATH + storyNode.image;
    img.alt = storyNode.alt;
    img.className = "cityhall-story-img";
    story.appendChild(img);

    storyNode.paragraphs.forEach(function (para) {
      if (para && para.diary) {
        story.appendChild(buildDiaryBlock());
      } else {
        story.appendChild(buildParagraph(para));
      }
    });

    container.appendChild(story);

    if (storyNode.ending) {
      var endingChoices = document.createElement("div");
      endingChoices.className = "cityhall-choices";
      onEnding(endingChoices);
      container.appendChild(endingChoices);
    } else if (storyNode.choices.length > 0) {
      var choices = document.createElement("div");
      choices.className = "cityhall-choices";
      storyNode.choices.forEach(function (choice) {
        choices.appendChild(
          makeButton(choice.label, "cityhall-choice-btn", function () {
            onChoice(choice.target);
          })
        );
      });
      container.appendChild(choices);
    }

    var nav = document.createElement("div");
    nav.className = "cityhall-nav";
    nav.appendChild(makeButton("Back", "cityhall-back-btn", onBack));
    nav.appendChild(makeButton("City Hall Help", "cityhall-back-btn", renderHelp));
    nav.appendChild(
      makeButton("Return to City Hall", "cityhall-back-btn", renderEntrance)
    );
    container.appendChild(nav);
  }

  // -----------------------------------------------------------------------
  // The Bungled Bank Burglary navigation
  // -----------------------------------------------------------------------

  function startBbb() {
    state.caseName = "bbb";
    state.stack = ["bbb1"];
    renderBbb("bbb1");
  }

  function renderBbb(key) {
    state.screen = "bbb-" + key;
    renderNode(
      BBB_NODES,
      key,
      "The Bungled Bank Burglary",
      function (target) {
        state.stack.push(target);
        renderBbb(target);
      },
      backBbb,
      function (endingChoices) {
        endingChoices.appendChild(
          makeButton(
            "Try The Case of the Alien Photo",
            "cityhall-choice-btn",
            startCap
          )
        );
        endingChoices.appendChild(
          makeButton(
            "Return to the Main Casebook Page",
            "cityhall-choice-btn",
            renderEntrance
          )
        );
      }
    );
  }

  function backBbb() {
    if (state.stack.length <= 1) {
      renderEntrance();
      return;
    }
    state.stack.pop();
    renderBbb(state.stack[state.stack.length - 1]);
  }

  // -----------------------------------------------------------------------
  // The Case of the Alien Photo navigation
  // -----------------------------------------------------------------------

  function startCap() {
    state.caseName = "cap";
    state.stack = ["cap1"];
    renderCap("cap1");
  }

  function renderCap(key) {
    state.screen = "cap-" + key;
    renderNode(
      CAP_NODES,
      key,
      "The Case of the Alien Photo",
      function (target) {
        state.stack.push(target);
        renderCap(target);
      },
      backCap,
      function (endingChoices) {
        endingChoices.appendChild(
          makeButton(
            "Try The Bungled Bank Burglary",
            "cityhall-choice-btn",
            startBbb
          )
        );
        endingChoices.appendChild(
          makeButton(
            "Return to the Main Casebook Page",
            "cityhall-choice-btn",
            renderEntrance
          )
        );
      }
    );
  }

  function backCap() {
    if (state.stack.length <= 1) {
      renderEntrance();
      return;
    }
    state.stack.pop();
    renderCap(state.stack[state.stack.length - 1]);
  }

  // -----------------------------------------------------------------------

  function start() {
    state = { screen: "entrance", caseName: null, stack: [] };
    renderEntrance();
  }

  window.CityHall = { start: start };
})();
