/*
 * Zoo entrance, world map, the four animal regions, each region's Zoo
 * Keeper's Challenge quiz, and the Zoo Help page.
 *
 * A client-side conversion of kidstown_cgi-main/scripts/zoo:
 *   zoo.pl        - entrance
 *   worldmap.pl   - world map
 *   zoonavbar.pl  - the region navigation bar shown on every zoo page
 *   ocean.pl / africa.pl / australia.pl / polar.pl - region content
 *   d6_oc1/11/12/13.pl   - Ocean's Zoo Keeper's Challenge
 *   d6_af1/11/12/13.pl   - Africa's Zoo Keeper's Challenge
 *   d6_au1/11/12/13.pl   - Australia's Zoo Keeper's Challenge
 *   d6_ar1/11/12/13.pl   - Polar Regions' Zoo Keeper's Challenge
 *   help.pl       - Zoo Help page
 * (page titles taken from kt.db's ZooHeader values). Nothing here calls
 * kt.cgi or any server-side script.
 */
(function () {
  "use strict";

  var ASSET_PATH = "assets/images/zoo/";

  function animal(id, name, image, text) {
    return { id: id, name: name, image: image, text: text };
  }

  function option(label, correct, text, image) {
    return { label: label, correct: correct, text: text, image: image };
  }

  // The four regions, in the original zoonavbar.pl's order. "heading"
  // matches each region's ZooHeader value from kt.db (KEY 9100/9200/
  // 9300/9400). Region text and quiz content are transcribed from
  // ocean.pl/africa.pl/australia.pl/polar.pl and the matching d6_*.pl
  // question/answer scripts.
  var REGIONS = [
    {
      key: "ocean",
      label: "Ocean",
      icon: "ocean3a.gif",
      heading: "Animals of the Ocean",
      banner: "ocean.jpg",
      bannerAlt: "Ocean",
      intro:
        "Oceans cover more than two-thirds of the Earth's surface. The " +
        "greatest variety of life is found in the oceans. Most ocean " +
        "animals live in the warm, shallow waters surrounding the " +
        "continents and islands. Yet, life can even be found deep in the " +
        "ocean where light never reaches. Some of the different kinds of " +
        "animals that live in the ocean are crabs, seahorses, sharks, and " +
        "starfish.",
      animals: [
        animal(
          "crab",
          "Crabs",
          "d6crab.gif",
          "A crab walks sideways instead of straight ahead, like most " +
            "animals. A hard shell that covers its body helps protect it. " +
            "However, in order to grow, a crab must shed its shell. After " +
            "shedding, it is soft-bodied and very vulnerable. Once its new " +
            "shell is hard and strong, the crab is ready to face the world " +
            "again."
        ),
        animal(
          "seahorse",
          "Seahorses",
          "d6seahor.gif",
          "A seahorse swims in an upright position. Unlike most animals, " +
            "the male seahorse gives birth. The male has a pouch on its " +
            "stomach in which the female places her eggs. After hatching, " +
            "the young seahorses stay inside the pouch for ten days. A " +
            "male seahorse can give birth to as many as 600 young at one " +
            "time."
        ),
        animal(
          "shark",
          "Sharks",
          "d6shark.gif",
          "Most sharks eat fish, sea lions, sea birds, and dolphins. They " +
            "are very efficient hunters and have been nicknamed \"eating " +
            "machines\" and \"super predators.\" They use a combination " +
            "of sight, smell, and a form of sonar to hunt their prey."
        ),
        animal(
          "starfish",
          "Starfish",
          "d6starfi.gif",
          "There are many types of starfish, also known as \"sea " +
            "stars,\" in the ocean. They can have as few as five arms or " +
            "as many as forty. If a starfish loses an arm, it will grow a " +
            "new one. The starfish's mouth is located on the underside of " +
            "its body."
        )
      ],
      quiz: {
        question: "What covers two-thirds of the surface of the Earth?",
        options: [
          option(
            "Land",
            false,
            "Land covers one-third of the surface of the Earth."
          ),
          option(
            "Trees",
            false,
            "Trees do not cover two-thirds of the surface of the Earth. " +
              "Trees supply most of the oxygen that people breathe. The " +
              "oldest tree is 4,725 years old."
          ),
          option(
            "Water",
            true,
            "Yes, water covers over two-thirds of the surface of the " +
              "Earth.",
            "ocean.jpg"
          )
        ]
      }
    },

    {
      key: "africa",
      label: "Africa",
      icon: "africa3a.gif",
      heading: "Animals of Africa",
      banner: "africa.jpg",
      bannerAlt: "Animals of Africa",
      intro:
        "In central Africa, many kinds of animals live on large, " +
        "grass-covered plains. Animals that eat plants are herbivores. " +
        "Some African herbivores are elephants, giraffes and hippos. " +
        "Animals that eat only meat are carnivores. Lions are carnivores " +
        "that live in Africa.",
      animals: [
        animal(
          "elephant",
          "Elephants",
          "d6elep.gif",
          "The most amazing feature on an elephant is its long nose, " +
            "called a trunk. The elephant uses its trunk to eat and " +
            "drink. An elephant eats grass, leaves, twigs and fruits by " +
            "wrapping its trunk around the food and bringing it up to its " +
            "mouth. It drinks by sucking water up into its trunk, putting " +
            "the trunk into its mouth, and then spraying the water down " +
            "its throat."
        ),
        animal(
          "giraffe",
          "Giraffes",
          "d6giraff.gif",
          "Giraffes are the tallest land animals living in the world " +
            "today. Because giraffes need to eat a lot of food in order " +
            "to live, they spend about half of their lives eating. " +
            "Giraffes eat leaves and twigs by curling their strong " +
            "tongues around the food to pull it free."
        ),
        animal(
          "hippo",
          "Hippopotamus",
          "d6hippo.gif",
          "The word \"hippo\" is short for \"hippopotamus,\" which means " +
            "\"horse of the river.\" Although hippos are very big, they " +
            "do not eat as much food as you might think. They spend a " +
            "few hours each day eating different kinds of grasses on " +
            "land. To protect themselves from predators, hippos spend " +
            "most of their time in water."
        ),
        animal(
          "lion",
          "Lions",
          "d6lion.gif",
          "Lions spend most of their time resting and sleeping. Lions " +
            "sleep during the day when it is very hot. When they hunt, " +
            "lions must sneak up on prey in order to catch it. Female " +
            "lions do the hunting for their prides (family groups)."
        )
      ],
      quiz: {
        question: "What is the tallest land animal living in the world today?",
        options: [
          option(
            "Elephant",
            false,
            "The elephant is not the tallest animal in the world. The " +
              "elephant is the largest land animal in the world. An " +
              "adult male elephant can weigh up to 13,000 pounds!"
          ),
          option(
            "Giraffe",
            true,
            "Giraffes are the tallest animals living in the world " +
              "today. They can grow to be 19 feet tall!",
            "d6giraff.gif"
          ),
          option(
            "Hippopotamus",
            false,
            "A hippopotamus can be big, but it is not the tallest " +
              "animal in the world. Adult hippos are the second largest " +
              "land animals in the world after elephants. They can grow " +
              "to weigh 8,000 pounds!"
          )
        ]
      }
    },

    {
      key: "australia",
      label: "Australia",
      icon: "aussie3a.gif",
      heading: "Animals of Australia",
      banner: "australia.jpg",
      bannerAlt: "Animals of Australia",
      intro:
        "Many unusual types of animals called marsupials are found on " +
        "the island continent of Australia. Marsupials are unusual " +
        "because the mother has a pouch on her stomach in which she " +
        "carries her young. Some Australian marsupials are kangaroos and " +
        "koala bears. Crocodiles are reptiles that live in Australia as " +
        "well as other parts of the world. Off the coast of Australia is " +
        "a coral reef called the Great Barrier Reef.",
      animals: [
        animal(
          "kangaroo",
          "Kangaroos",
          "d6kanga.gif",
          "Kangaroos stand tall by balancing on their big hind feet and " +
            "thick tail. They can move very quickly by jumping in long " +
            "leaps. A young kangaroo is called a \"joey.\""
        ),
        animal(
          "koala",
          "Koala Bears",
          "d6koala.gif",
          "Koala bears look like teddy bears come to life. They only " +
            "eat the leaves of a few trees that live in Australia. " +
            "Because the leaves are not very nutritious, the little " +
            "bears have to move slowly to conserve energy. They spend a " +
            "lot of time sleeping."
        ),
        animal(
          "croc",
          "Crocodiles",
          "d6croc.gif",
          "The crocodile is a fierce animal that will attack any animal " +
            "that comes near it. Although clumsy on land, it is an " +
            "excellent swimmer. It spends much of its time drifting " +
            "quietly under the surface of the water with only its eyes " +
            "and nose showing."
        ),
        animal(
          "reef",
          "Great Barrier Reef",
          "d6coral.gif",
          "The Great Barrier Reef is a coral reef. Coral reefs are made " +
            "of many tiny animals. As these animals grow, they build " +
            "mini-fortresses around themselves. As the animals multiply, " +
            "their fortresses join to form large structures in the " +
            "ocean. Coral reefs provide food and shelter to many " +
            "brightly colored fish that live in the sea."
        )
      ],
      quiz: {
        question: "What do you call animals that have pouches to carry their young?",
        options: [
          option(
            "Marsupials",
            true,
            "Animals that have pouches are called marsupials. Both " +
              "kangaroos and koalas are marsupials.",
            "d6kanga.gif"
          ),
          option(
            "Reptiles",
            false,
            "Reptiles are cold-blooded animals that lay eggs. Reptiles " +
              "do not have pouches to carry their young."
          ),
          option(
            "Herbivores",
            false,
            "Herbivores are animals that eat plants. Although some " +
              "herbivores have pouches to carry their young, not all " +
              "herbivores have pouches."
          )
        ]
      }
    },

    {
      key: "polar",
      label: "Polar Regions",
      icon: "polar3a.gif",
      heading: "Animals of the Polar Regions",
      banner: "polar.jpg",
      bannerAlt: "Arctic Animals",
      intro:
        "The polar regions have extremely cold winters and only a few " +
        "months of warm temperatures in the summer. Parts of Russia, " +
        "Norway, Greenland, the United States, and Canada, and all of " +
        "Antarctica lie within the polar regions. The tundra is a vast, " +
        "treeless land in the Arctic. Much of the ground there stays " +
        "frozen all the time. The extremely cold winters prevent most " +
        "animals from living in the polar regions during those months. " +
        "During the short summer, these animals return to live and " +
        "feed. Some of these animals are arctic hares, caribou, polar " +
        "bears, and wolves.",
      animals: [
        animal(
          "hare",
          "Arctic Hares",
          "d6hare.gif",
          "In order to survive the cold during the winter, an arctic " +
            "hare grows a pure white coat of long, thick fur. This white " +
            "fur makes the hare blend in with the snow. The hare has " +
            "large hind feet which allow it to run on top of the snow " +
            "without sinking. During the summer, its fur turns brown or " +
            "gray."
        ),
        animal(
          "caribou",
          "Caribou",
          "d6caribo.gif",
          "Caribou are actually reindeer that live in the North " +
            "American Arctic lands. As spring approaches, huge herds of " +
            "caribou travel north to spend their summer on the tundra. " +
            "Unlike other types of deer, both the male and the female " +
            "caribou have antlers."
        ),
        animal(
          "polarbear",
          "Polar Bears",
          "d6polarb.gif",
          "A polar bear is one of the largest carnivorous animals in " +
            "the world. It is so powerful that it can kill a seal with " +
            "one blow of a paw. In October, a female polar bear digs a " +
            "large hole in the snow called a den. In her den, she gives " +
            "birth to one or two cubs and does not come out with them " +
            "until spring."
        ),
        animal(
          "wolf",
          "Wolves",
          "d6wolf.gif",
          "Wolves are predators and will eat almost anything, from " +
            "caribou to mice, depending on the time of year and what " +
            "food is available. Wolves live in groups called packs. A " +
            "wolf pack usually contains about six wolves. One male wolf " +
            "(the Alpha Male) leads the entire pack. One female wolf " +
            "leads the females and the young. The Alpha Male shows he is " +
            "the leader by holding his head up and raising his tail. The " +
            "less important wolves crouch or roll over in front of him."
        )
      ],
      quiz: {
        question:
          "Which animal's fur turns white in the winter and brown or gray in the summer?",
        options: [
          option(
            "Polar Bear",
            false,
            "The polar bear's fur does not turn white in the winter and " +
              "does not turn brown or gray in the summer. The polar " +
              "bear's fur varies from pure white to a light yellow. The " +
              "white fur is an important disguise for the polar bear as " +
              "it hunts its prey on the ice pack."
          ),
          option(
            "Arctic Hare",
            true,
            "The arctic hare's fur turns white in the winter and brown " +
              "or gray in the summer. In the winter, the arctic hare is " +
              "white with black ear-tips. The underfur is dense and " +
              "gray.",
            "d6hare.gif"
          ),
          option(
            "Caribou",
            false,
            "The caribou's fur does not turn white in the winter and " +
              "does not turn brown or gray in the summer. The caribou's " +
              "fur is typically brown and shaggy with a white neck and " +
              "mane."
          )
        ]
      }
    }
  ];

  function findRegion(key) {
    return REGIONS.filter(function (candidate) {
      return candidate.key === key;
    })[0];
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

  // The region navigation bar (zoonavbar.pl) appeared on every zoo page
  // in the original - the entrance, the world map, every region page,
  // every challenge page, and the help page.
  function renderRegionNav(container) {
    var nav = document.createElement("div");
    nav.className = "zoo-region-nav";

    REGIONS.forEach(function (region) {
      var item = document.createElement("button");
      item.type = "button";
      item.className = "zoo-region-btn";
      item.addEventListener("click", function () {
        renderRegion(region.key);
      });

      var icon = document.createElement("img");
      icon.src = ASSET_PATH + region.icon;
      icon.alt = "";
      icon.className = "zoo-region-icon";
      item.appendChild(icon);

      var label = document.createElement("span");
      label.textContent = region.label;
      item.appendChild(label);

      nav.appendChild(item);
    });

    container.appendChild(nav);
  }

  // The original relied on a shared, site-wide navbar (not part of the
  // zoo scripts) to get back to the zoo, the world map, or the help
  // page from anywhere. That shared chrome isn't reproduced here, so
  // this common footer provides the same destinations explicitly.
  function renderCommonFooter(container, hide) {
    hide = hide || {};

    var nav = document.createElement("div");
    nav.className = "zoo-nav";

    if (!hide.worldMap) {
      nav.appendChild(makeButton("World Map", "zoo-back-btn", renderWorldMap));
    }

    if (!hide.help) {
      nav.appendChild(makeButton("Zoo Help", "zoo-back-btn", renderHelp));
    }

    if (!hide.returnToZoo) {
      nav.appendChild(
        makeButton("Return to the Zoo", "zoo-back-btn", renderEntrance)
      );
    }

    if (hide.mapLink === false) {
      nav.appendChild(
        makeLink("Return to the KidsTown map", "zoo-map-link", "#/home")
      );
    }

    container.appendChild(nav);
  }

  // -----------------------------------------------------------------------
  // Zoo entrance (zoo.pl)
  // -----------------------------------------------------------------------

  function renderEntrance() {
    state.screen = "entrance";

    var container = byId("zoo-content");
    clear(container);

    var heading = document.createElement("h1");
    heading.textContent = "KidsTown Zoo";
    container.appendChild(heading);

    var banner = document.createElement("img");
    banner.src = ASSET_PATH + "zoo.gif";
    banner.alt = "Zoo";
    banner.className = "zoo-banner";
    container.appendChild(banner);

    var intro = document.createElement("p");
    intro.className = "zoo-intro-text";
    intro.textContent =
      "Animals in this zoo are grouped together by where they live. " +
      "Select one of the locations below to see some of the animals " +
      "that live there.";
    container.appendChild(intro);

    var choices = document.createElement("div");
    choices.className = "zoo-choices";
    choices.appendChild(
      makeButton(
        "See These Regions on the World Map",
        "zoo-choice-btn",
        renderWorldMap
      )
    );
    container.appendChild(choices);

    renderRegionNav(container);
    renderCommonFooter(container, { returnToZoo: true, mapLink: false });
  }

  // -----------------------------------------------------------------------
  // World map (worldmap.pl)
  // -----------------------------------------------------------------------

  function renderWorldMap() {
    state.screen = "world-map";

    var container = byId("zoo-content");
    clear(container);

    var heading = document.createElement("h1");
    heading.textContent = "World Map";
    container.appendChild(heading);

    var map = document.createElement("img");
    map.src = ASSET_PATH + "world3a.gif";
    map.alt = "World Map";
    map.className = "zoo-world-map";
    container.appendChild(map);

    var choices = document.createElement("div");
    choices.className = "zoo-choices";
    choices.appendChild(
      makeButton("Go Back to the Zoo", "zoo-choice-btn", renderEntrance)
    );
    container.appendChild(choices);

    renderRegionNav(container);
    renderCommonFooter(container, { worldMap: true });
  }

  // -----------------------------------------------------------------------
  // Region content (ocean.pl / africa.pl / australia.pl / polar.pl)
  // -----------------------------------------------------------------------

  function renderRegion(key) {
    state.screen = "region-" + key;

    var region = findRegion(key);
    var container = byId("zoo-content");
    clear(container);

    var heading = document.createElement("h1");
    heading.textContent = region.heading;
    container.appendChild(heading);

    var banner = document.createElement("img");
    banner.src = ASSET_PATH + region.banner;
    banner.alt = region.bannerAlt;
    banner.className = "zoo-region-banner";
    container.appendChild(banner);

    var intro = document.createElement("p");
    intro.className = "zoo-intro-text";
    intro.textContent = region.intro;
    container.appendChild(intro);

    // The original linked straight from the intro paragraph to each
    // animal's section with #anchor links. A real #hash would collide
    // with this SPA's hash-based routing, so this is a button row that
    // scrolls to the section instead.
    var jumpRow = document.createElement("div");
    jumpRow.className = "zoo-jump-nav";
    region.animals.forEach(function (creature) {
      var jumpBtn = document.createElement("button");
      jumpBtn.type = "button";
      jumpBtn.className = "zoo-jump-btn";
      jumpBtn.textContent = creature.name;
      jumpBtn.addEventListener("click", function () {
        var target = byId("zoo-animal-" + creature.id);
        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
      jumpRow.appendChild(jumpBtn);
    });
    container.appendChild(jumpRow);

    region.animals.forEach(function (creature) {
      var section = document.createElement("div");
      section.className = "zoo-animal-section";
      section.id = "zoo-animal-" + creature.id;

      var name = document.createElement("h2");
      name.className = "zoo-animal-name";
      name.textContent = creature.name;
      section.appendChild(name);

      var img = document.createElement("img");
      img.src = ASSET_PATH + creature.image;
      img.alt = creature.name;
      img.className = "zoo-animal-img";
      section.appendChild(img);

      var text = document.createElement("p");
      text.className = "zoo-animal-text";
      text.textContent = creature.text;
      section.appendChild(text);

      container.appendChild(section);
    });

    var choices = document.createElement("div");
    choices.className = "zoo-choices";
    choices.appendChild(
      makeButton(
        "Try Taking the Zoo Keeper's Challenge!",
        "zoo-choice-btn",
        function () {
          renderQuizQuestion(key);
        }
      )
    );
    container.appendChild(choices);

    renderRegionNav(container);
    renderCommonFooter(container, { returnToZoo: false });
  }

  // -----------------------------------------------------------------------
  // Zoo Keeper's Challenge (d6_oc*.pl / d6_af*.pl / d6_au*.pl / d6_ar*.pl)
  // -----------------------------------------------------------------------

  function renderQuizQuestion(key) {
    state.screen = "quiz-" + key;

    var region = findRegion(key);
    var container = byId("zoo-content");
    clear(container);

    var heading = document.createElement("h1");
    heading.textContent = "Zoo Keeper's Challenge";
    container.appendChild(heading);

    var question = document.createElement("p");
    question.className = "zoo-quiz-question";
    question.textContent = region.quiz.question;
    container.appendChild(question);

    var choices = document.createElement("div");
    choices.className = "zoo-quiz-options";
    region.quiz.options.forEach(function (opt, index) {
      choices.appendChild(
        makeButton(opt.label, "zoo-quiz-option-btn", function () {
          renderQuizAnswer(key, index);
        })
      );
    });
    container.appendChild(choices);

    var instructions = document.createElement("p");
    instructions.className = "zoo-quiz-instructions";
    instructions.textContent =
      "Instructions: Please choose the answer you think is correct.";
    container.appendChild(instructions);

    renderRegionNav(container);
    renderCommonFooter(container, {});
  }

  function renderQuizAnswer(key, optionIndex) {
    state.screen = "quiz-answer-" + key;

    var region = findRegion(key);
    var opt = region.quiz.options[optionIndex];
    var container = byId("zoo-content");
    clear(container);

    var heading = document.createElement("h1");
    heading.textContent = "Zoo Keeper's Challenge";
    container.appendChild(heading);

    if (opt.correct && opt.image) {
      var img = document.createElement("img");
      img.src = ASSET_PATH + opt.image;
      img.alt = opt.label;
      img.className = "zoo-quiz-answer-img";
      container.appendChild(img);
    }

    var answerText = document.createElement("p");
    answerText.className = "zoo-quiz-answer-text";
    answerText.textContent = opt.text;
    container.appendChild(answerText);

    var choices = document.createElement("div");
    choices.className = "zoo-choices";

    if (opt.correct) {
      choices.appendChild(
        makeButton(
          "Go Back to the " + region.heading,
          "zoo-choice-btn",
          function () {
            renderRegion(key);
          }
        )
      );
    } else {
      choices.appendChild(
        makeButton("Please Try Again", "zoo-choice-btn", function () {
          renderQuizQuestion(key);
        })
      );
    }

    container.appendChild(choices);

    renderRegionNav(container);
    renderCommonFooter(container, {});
  }

  // -----------------------------------------------------------------------
  // Zoo Help page (help.pl)
  // -----------------------------------------------------------------------

  function renderHelp() {
    state.screen = "help";

    var container = byId("zoo-content");
    clear(container);

    var heading = document.createElement("h1");
    heading.textContent = "Zoo Help Page";
    container.appendChild(heading);

    var lines = [
      "Animals in this zoo are grouped together by where they live.",
      "Each area of the world has a unique set animals that live there.",
      "This zoo will introduce you to some of the animals in Africa, " +
        "Australia, the Oceans and the Polar Regions.",
      "Once you have read about the animals in an area, you can play a " +
        "trivia game by taking the ZooKeeper's Challenge.",
      "Now click on one of the areas below to see the animals!"
    ];

    lines.forEach(function (line) {
      var p = document.createElement("p");
      p.className = "zoo-help-text";
      p.textContent = line;
      container.appendChild(p);
    });

    renderRegionNav(container);
    renderCommonFooter(container, { help: true });
  }

  // -----------------------------------------------------------------------

  function start() {
    state = { screen: "entrance" };
    renderEntrance();
  }

  window.Zoo = { start: start };
})();
