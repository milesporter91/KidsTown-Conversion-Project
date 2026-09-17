/*
 * Museum interactive exhibits.
 *
 * A client-side conversion of kidstown_cgi-main/scripts/museum
 * (museum.pl, Welcolsec.pl, Rainbowstory.pl, page2-6.pl, planet.pl,
 * planetnav.pl, wizard.pl, wizhelp.pl) and kidstown_cgi-main/data/museum
 * (ss1.dat, ss2.dat). Nothing here calls kt.cgi or any server-side script.
 *
 * Two exhibits are reproduced:
 *   - "The Color Exhibition": a linear illustrated story about how the
 *     rainbow was made (Welcolsec.pl -> Rainbowstory.pl -> page2..page6).
 *   - "Our Solar System": a planetarium quiz with a Basic and an Advanced
 *     tour (planet.pl -> wizard.pl, driven by ss1.dat / ss2.dat).
 */
(function () {
  "use strict";

  var ASSET_PATH = "assets/images/museum/";

  var IMAGES = {
    main1: { src: "main1.jpg" },
    myrainbow: { src: "myrainbow.gif" },
    playinrain: { src: "playinrain.jpg" },
    heavyrain: { src: "heavyrain.jpg" },
    myrainbowstory: { src: "myrainbowstory.jpg" },
    moonStar: { src: "moon_star.jpg" },
    door: { src: "door.jpg" },
    monature: { src: "monature.jpg" },
    plants: { src: "plants.jpg" },
    suncloud: { src: "suncloud.jpg" },
    sunset: { src: "sunset.jpg" },
    rainsun: { src: "rainsun.jpg" },
    museum: { src: "museum.gif" },
    overpg: { src: "overpg.gif" },
    helpImage: { src: "c_np1.gif" }
  };

  // -----------------------------------------------------------------------
  // Content helpers. Every block is rendered with textContent/createElement
  // only, never innerHTML, so none of this can ever be parsed as markup.
  // -----------------------------------------------------------------------

  function p(text) {
    return { type: "p", text: text };
  }

  function pic(key, align, alt) {
    return { type: "img", image: key, align: align, alt: alt };
  }

  function picCenter(key, alt) {
    return { type: "imgCenter", image: key, alt: alt };
  }

  function divider() {
    return { type: "divider" };
  }

  // -----------------------------------------------------------------------
  // The Color Exhibition (Welcolsec.pl / Rainbowstory.pl / page2-6.pl)
  // -----------------------------------------------------------------------

  var COLOR_WELCOME = {
    heading: "Welcome to the Color Section",
    content: [
      divider(),
      picCenter("main1", "The color exhibit"),
      p(
        "In this section you can visit the rainbow to read stories about " +
          "the rainbow."
      ),
      p("Click on the link below to enter the rainbow exhibition.")
    ],
    forward: { label: "The Rainbow", target: 1 }
  };

  var COLOR_PAGES = {
    1: {
      heading: "Welcome to Rainbow Stories",
      subheading: "The Sun and the Rain",
      content: [
        pic("playinrain", "left", "Playing in the rain"),
        p(
          "Whenever summer arrives I feel exited. It is the beginning of a " +
            "long break from school that means waking up late and going out " +
            "to play with my friends. However, last summer was different. " +
            "That was a time that made me think about nature and its power. " +
            "I still remember that hot midsummer day when the sun was " +
            "shining with a magnificent splendor. I was outdoors playing in " +
            "the park with my friends when a small raindrop fell on my " +
            "face. I looked up, trying to figure out where the cloud was, " +
            "as if I were able to stop the course of nature."
        ),
        pic("heavyrain", "right", "Heavy rain"),
        p(
          "A heavy Rain followed that small raindrop, and the shower did " +
            "not stop for fifteen minutes. Finally it slowed, and we were " +
            "able to go out and play again. However, something strange was " +
            "in the sky, the most beautiful thing that my little eyes had " +
            "ever seen. It was as if somebody had painted a huge bow in the " +
            "cloudy sky. I ran in to the house and asked my mom what that " +
            "awesome bow was."
        ),
        p("Guess what that huge bow was called?")
      ],
      forward: { label: "Click Here to Find Out!", target: 2 }
    },

    2: {
      heading: "The Sun and the Rain",
      content: [
        pic("myrainbowstory", "left", "Telling the rainbow story"),
        p(
          "She told me it was called a \"Rainbow.\" \"What a strange name " +
            "for something so beautiful, don't you think?\" she asked."
        ),
        p(
          "\"Yes,\" I replied, \"but tell me, who painted that huge " +
            "'waterbow' in the sky?\" She laughed, and answered \"Rainbow, " +
            "its name is Rainbow.\""
        ),
        p(
          "\"OK, OK I replied,\" \"who painted the 'Rainbow' in the sky?\""
        ),
        p(
          "\"Well,\" she said, \"let me tell you a small story about who " +
            "paints the Rainbow\"...."
        ),
        p("Who do you think painted the rainbow?")
      ],
      forward: { label: "Click Here", target: 3 }
    },

    3: {
      heading: "The Sun and the Rain",
      content: [
        p("Here is a small story about the creation of the rainbow."),
        pic("moonStar", "right", "The Moon and the Star"),
        p(
          "One rainy day, the Sun was bored and had nothing to do. He " +
            "could not show his face on the Earth because a cloud would " +
            "not let him. He decided that he needed to create something " +
            "beautiful so that on rainy days, when he got bored, he could " +
            "look at the beautiful object and entertain his mind. He " +
            "decided to get advice on what to make, so he visited the " +
            "Moon. He explained his situation to the Moon, who replied, " +
            "\"Seems like you need more help than what I can give, why " +
            "don't you ask the Star to help you?\""
        ),
        pic("door", "left", "A door"),
        p(
          "So the Sun went and visited the Star. He explained what he " +
            "wanted and asked the Star to help him. The Star responded " +
            "that she could not help him because she was too busy. She " +
            "advised the Sun to come back some other day. The Sun returned " +
            "to his home feeling very sad. He had no idea who else could " +
            "help him."
        ),
        p(
          "Suddenly Mother Nature knocked on his door. She was worried " +
            "about the Sun and asked him what was bothering him. The Sun " +
            "told Mother Nature his plans to create something beautiful, " +
            "something amazingly wonderful that he could watch on boring " +
            "days."
        ),
        p("What do you do on boring days?")
      ],
      forward: { label: "Let's Go See How Mother Nature Helped the Sun", target: 4 }
    },

    4: {
      heading: "The Sun and the Rain",
      content: [
        pic("monature", "right", "Mother Nature and the Sun"),
        p("\"Uhmmm,\" replied Mother Nature, \"this will require the cooperation of the Rain.\""),
        p("\"Oh, no, not the Rain!\" replied the Sun. \"She is the one that caused this problem in the first place.\""),
        p("\"Oh, I think there is a misunderstanding here. Do you think that the Rain is doing this on purpose?\""),
        p("\"Well, yes. She wants to have fun while I have to sit doing nothing but getting bored!\""),
        pic("plants", "left", "Plants"),
        p("\"I think that you need to be informed a little bit more on what the Rain is doing,\" replied Mother Nature. \"Rain gives water to humans, and humans need water. Plants need water too. In fact, almost every living thing on Earth needs water.\""),
        p("\"Well, they need me too!\" replied the Sun."),
        p("\"Of course they do!\" affirmed Mother Nature, \"but wouldn't it be nice if you and the Rain could be watching and serving the Earth at the same time?\""),
        p("\"Well, it seems like a good idea, but would the Rain accept?\" questioned the Sun."),
        p("\"I think so, but let's go ask her...\""),
        p("And so both of them went to look for the Rain. When they finally found the Rain, she was sitting on a cloud. She looked unhappy."),
        p("Why do you think the Rain was unhappy?")
      ],
      forward: { label: "Let's Go Find Out Why!", target: 5 }
    },

    5: {
      heading: "The Sun and the Rain",
      content: [
        pic("suncloud", "right", "The Sun and a cloud"),
        p("\"What is the problem, Rain?\" asked Mother Nature."),
        p("\"The Moon just visited me and told me that the Sun was upset with me because he gets bored whenever I'm giving water to the Earth,\" the Rain replied."),
        p("\"Oh, so you know?\" asked the Sun. \"Well, I'm sorry for having such a wrong opinion of you. In fact, I'm here to propose something to you. I want you to help me create the 'Rain-Sun'.\""),
        p("\"The 'Rain-Sun' - what is that?\" questioned the Rain."),
        p("\"I don't know yet, but Mother Nature keeps telling me that we can create something beautiful if we work together, right Mother?\" replied the Sun."),
        p("\"Yes,\" answered Mother Nature. \"Well, enough talking. Do you want to help the Sun?\" Mother Nature asked the Rain."),
        p("\"Sure, I would gladly help him.\" answered the Rain."),
        p("\"Let's do it!\" cried the Sun."),
        pic("sunset", "left", "Sunset"),
        p("Mother Nature said to the Rain, \"I want you to water the Earth, as much as you can.\" To the Sun she said, \"Sun, I want you to shine when the Rain is falling.\""),
        p("\"How can I do that?\" replied the Sun."),
        p("\"I have given you permission to do it, so just do it.\" ordered Mother Nature."),
        p("Do you want to know what happened next?")
      ],
      forward: { label: "Click Here to Find Out!", target: 6 }
    },

    6: {
      heading: "The Sun and the Rain",
      content: [
        picCenter("rainsun", "The rainbow forms"),
        p(
          "Both of them started to follow their instructions, and suddenly " +
            "the Sun's rays were passing through the Raindrops. This " +
            "created an enormous, beautiful \"Rain-Sun\" in the Sky. It " +
            "looked like a bow, so to this day we call it a Rainbow!"
        ),
        p("...and that is how the rainbow was created. Hope that you liked the story!")
      ],
      ending: true
    }
  };

  // -----------------------------------------------------------------------
  // Our Solar System (planet.pl / wizard.pl, driven by ss1.dat / ss2.dat)
  // -----------------------------------------------------------------------

  function q(question, options) {
    return { question: question, options: options };
  }

  function opt(img, correct, text) {
    return { img: img, correct: correct, text: text };
  }

  var QUIZ_DECKS = {
    basic: {
      label: "Basic Tour",
      questions: [
        q("Which picture shows the only star in our Solar System?", [
          opt("c_ear1.gif", false, "Earth is one of the nine planets that orbit the Sun."),
          opt("c_ven1.gif", false, "Venus is the second planet from the Sun."),
          opt("c_sun1.gif", true, "The Sun is the only star in our Solar System."),
          opt("c_sat3.gif", false, "Saturn is a planet that orbits the only star in our Solar System.")
        ]),
        q("Which planet is the smallest and is furthest from the Sun?", [
          opt("c_jup1.gif", false, "Jupiter is the largest planet in our Solar System."),
          opt("c_ven1.gif", false, "Venus is larger than the smallest planet."),
          opt("c_plu1.gif", true, "Pluto is the smallest planet and is furthest from the Sun."),
          opt("c_sat3.gif", false, "Saturn is second largest planet.")
        ]),
        q("Which picture shows the planet that is closest to the Sun?", [
          opt("c_ear1.gif", false, "Earth is the third planet from the Sun."),
          opt("c_ura1.gif", false, "Uranus is the seventh planet from the Sun."),
          opt("c_sun1.gif", false, "You chose the Sun itself."),
          opt("c_mer1.gif", true, "Mercury is the closest planet to the Sun.")
        ]),
        q("Which planet is known for its \"red spot\"?", [
          opt("c_jup2.gif", true, "Jupiter is known for its red spot."),
          opt("c_mar1.gif", false, "Mars is known as the \"red planet\", but not for having a \"red spot\"."),
          opt("c_hai1.gif", false, "A comet may travel through our solar system but a planet is what you're looking for."),
          opt("c_sat3.gif", false, "Saturn is known for its rings.")
        ]),
        q("Which planet is the largest in the Solar System?", [
          opt("c_mil1.gif", false, "The Milky Way Galaxy is larger than any planet."),
          opt("c_jup3.gif", true, "Jupiter is the largest planet in the Solar System."),
          opt("c_sun1.gif", false, "The Sun is larger than Jupiter but it is not considered a planet."),
          opt("c_sat3.gif", false, "Saturn is not the largest planet.")
        ]),
        q("Which planet is the seventh planet from the Sun?", [
          opt("c_ear1.gif", false, "You chose Earth, which is the third planet from the Sun."),
          opt("c_nep2.gif", false, "Close but not quite. Neptune is the eighth planet from the Sun."),
          opt("c_ura1.gif", true, "Uranus is the seventh planet from the Sun."),
          opt("c_mar1.gif", false, "You chose Mars, which is the fourth planet from the Sun.")
        ]),
        q("Which planet do you live on?", [
          opt("c_ear2.gif", true, "Earth is the only planet that has life, as far as we know."),
          opt("c_hai2.gif", false, "Halley's Comet does not have life upon it."),
          opt("c_jup1.gif", false, "Jupiter is a gaseous planet, unable to sustain life."),
          opt("c_nep2.gif", false, "Neptune is a gaseous planet, unable to sustain life.")
        ]),
        q("Which picture shows the largest object in our Solar System?", [
          opt("c_ear1.gif", false, "Earth is not the largest object."),
          opt("c_ven1.gif", false, "Venus is not the largest object."),
          opt("c_sun1.gif", true, "The Sun is the largest object in our Solar System."),
          opt("c_sat3.gif", false, "Saturn is large but not as large as the Sun.")
        ]),
        q("Which planet is the ninth planet from the Sun?", [
          opt("c_jup1.gif", false, "Jupiter is the fifth planet from the Sun."),
          opt("c_ven1.gif", false, "Venus is the third planet."),
          opt("c_plu1.gif", true, "Pluto is the ninth planet from the Sun. It is also the furthest away."),
          opt("c_sat3.gif", false, "Saturn is the sixth planet.")
        ]),
        q("Pluto is the smallest planet. What is the next smallest planet?", [
          opt("c_ear1.gif", false, "Earth is not quite the second smallest."),
          opt("c_ura1.gif", false, "Uranus is quite large compared to the smaller planets."),
          opt("c_sun1.gif", false, "The Sun is larger than all of the planets."),
          opt("c_mer1.gif", true, "Except for Pluto, Mercury is the smallest planet.")
        ]),
        q("Which planet is known for its \"rings\"?", [
          opt("c_sat3.gif", true, "Saturn is known for its rings. Saturn's rings are mostly ice particles."),
          opt("c_ven1.gif", false, "Venus does not have any \"rings\"."),
          opt("c_hai1.gif", false, "A comet may travel through our solar system but a planet is what you're looking for."),
          opt("c_jup2.gif", false, "Jupiter is known for its red spot, not its rings.")
        ]),
        q("Which planet is the fourth from the Sun?", [
          opt("c_mil1.gif", false, "The Milky Way Galaxy is not a planet in our Solar System."),
          opt("c_mar1.gif", true, "Mars is the fourth planet from the Sun."),
          opt("c_ura1.gif", false, "Uranus is the seventh planet from the Sun."),
          opt("c_ear1.gif", false, "Earth is the third planet from the Sun.")
        ]),
        q("Which planet is the eighth planet from the Sun?", [
          opt("c_ear1.gif", false, "You chose Earth, which is the third planet from the Sun."),
          opt("c_jup2.gif", false, "Close but not quite. Jupiter is the fifth planet from the Sun."),
          opt("c_nep2.gif", true, "Neptune is the eighth planet from the Sun."),
          opt("c_mar1.gif", false, "You chose Mars, which is the fourth planet from the Sun.")
        ]),
        q("Which planet is between Mercury and Earth?", [
          opt("c_ven1.gif", true, "Venus is the planet that resides between Mercury and Earth."),
          opt("c_hai2.gif", false, "Halley's Comet is not a planet."),
          opt("c_jup1.gif", false, "Jupiter is between Mars and Saturn."),
          opt("c_sat3.gif", false, "Saturn is between Jupiter and Uranus.")
        ]),
        q("Which planet is between Jupiter and Uranus?", [
          opt("c_nep1.gif", false, "Neptune resides between Uranus and Pluto."),
          opt("c_hai2.gif", false, "Halley's Comet is not a planet."),
          opt("c_jup1.gif", false, "Jupiter is between Mars and Saturn."),
          opt("c_sat3.gif", true, "Saturn is between Jupiter and Uranus.")
        ])
      ]
    },

    advanced: {
      label: "Advanced Tour",
      questions: [
        q("Which of these contains 99.85% of all the matter in the Solar System?", [
          opt("c_ear1.gif", false, "Earth accounts for a very small portion of total mass of the Solar System."),
          opt("c_ven1.gif", false, "Venus accounts for a tiny portion of the total mass of the Solar System."),
          opt("c_sun1.gif", true, "The Sun accounts for 99.85% of all the matter in the Solar System. The planets only contain 0.135% of the total mass."),
          opt("c_sat3.gif", false, "Although a large planet, Saturn accounts for a very small portion of the total mass of the Solar System.")
        ]),
        q("Our Solar System resides in a spiral galaxy consisting of 200 billion stars called:", [
          opt("c_jup1.gif", false, "Jupiter is a planet in our Solar System."),
          opt("c_ven1.gif", false, "Venus is a planet in our Solar System."),
          opt("c_mil1.gif", true, "The Milky Way Galaxy is the home of our Solar System."),
          opt("c_sat3.gif", false, "Saturn is a planet in our Solar System.")
        ]),
        q("Because of its highly elliptical orbit, this planet is actually closer to the Sun than is Neptune during portions of its orbit.", [
          opt("c_ear1.gif", false, "You chose Earth. Earth is the third planet from the Sun and always closer to the Sun than Neptune."),
          opt("c_ura1.gif", false, "Close, but Uranus is always closer than Neptune to the Sun."),
          opt("c_sun1.gif", false, "You chose the Sun itself."),
          opt("c_plu1.gif", true, "Because of its irregular orbit Pluto is actually closer, at times, to the Sun than is Neptune.")
        ]),
        q("Terrestrial Planets are the four innermost planets in the Solar System. Which planet is a Terrestrial Planet?", [
          opt("c_mer1.gif", true, "Mercury is considered a Terrestrial Planet because it is one of the four innermost planets. They are called Terrestrial because they are compact and rocky like the Earth's surface."),
          opt("c_jup1.gif", false, "Jupiter is a Jovian Planet because of its gaseous nature."),
          opt("c_hai1.gif", false, "A comet is not one of the four innermost planets."),
          opt("c_sat3.gif", false, "Saturn is a Jovian Planet because of its gaseous nature.")
        ]),
        q("The Jovian Planets are the four gaseous planets and consist of the fifth through the eighth planets. Which planet is a Jovian Planet?", [
          opt("c_ven1.gif", false, "Venus is one of the Terrestrial Planets."),
          opt("c_jup3.gif", true, "Jupiter is one of the Jovian Planets. Saturn, Uranus and Neptune are also Jovian Planets."),
          opt("c_plu1.gif", false, "Pluto is not one of the four Jovian Planets because it is not gaseous."),
          opt("c_ear1.gif", false, "Earth is one of the four Terrestrial Planets.")
        ]),
        q("Which planet is one of the four Terrestrial Planets and also has an enormous circular basin on its surface called the Caloris Basin?", [
          opt("c_ear1.gif", false, "Earth is one of the Terrestrial Planets but it does not have the Caloris Basin on its surface."),
          opt("c_nep2.gif", false, "Neptune is one of the Jovian Planets."),
          opt("c_mer1.gif", true, "Mercury has a large circular basin like those found on the moon called the Caloris Basin."),
          opt("c_mar1.gif", false, "Mars is one of the Terrestrial Planets but it is not the one with the Caloris Basin on its surface.")
        ]),
        q("This planet has many volcanoes and a fractured surface. Its atmosphere is 96% carbon dioxide and its surface temperature is more than twice as hot as the Earth's.", [
          opt("c_ven1.gif", true, "Venus has an unstable surface and it is very hot. It also has clouds made up of sulfuric acid."),
          opt("c_hai2.gif", false, "Halley's Comet is not a planet."),
          opt("c_jup1.gif", false, "Jupiter is a gaseous planet without volcanoes."),
          opt("c_nep2.gif", false, "Neptune is a gaseous planet without volcanoes.")
        ]),
        q("This planet has a diameter of 12756 km and the highest point on its surface is the tip of Mount Everest. Its atmosphere is made up of 21% oxygen.", [
          opt("c_sat1.gif", false, "Saturn's atmosphere contains virtually no oxygen. Saturn's atmosphere contains mostly hydrogen (97%)."),
          opt("c_ura1.gif", false, "Uranus has a diameter of 51118 km. Almost 4 times the size of the planet with Mount Everest."),
          opt("c_ear2.gif", true, "Earth's atmosphere has the oxygen that humans require to breathe."),
          opt("c_mar1.gif", false, "Mars is smaller and its atmosphere is 95% carbon dioxide.")
        ]),
        q("Which planet is larger than Mars but smaller than Earth?", [
          opt("c_jup1.gif", false, "Jupiter is many times larger than Earth."),
          opt("c_ven1.gif", true, "Venus is almost twice the size of Mars but it is just barely smaller than Earth. Venus is 12104 km in diameter."),
          opt("c_nep1.gif", false, "Neptune is larger than Earth."),
          opt("c_sat3.gif", false, "Saturn is a planet that is larger than Earth.")
        ]),
        q("Which planet has one natural satellite called the \"Moon\"?", [
          opt("c_ear1.gif", true, "Earth is the third planet from the Sun and only has one natural orbiting body called the \"Moon\"."),
          opt("c_ura1.gif", false, "The Moon does not orbit Uranus."),
          opt("c_sun1.gif", false, "Earth would be considered a natural satellite of the Sun."),
          opt("c_plu1.gif", false, "Pluto does have a natural satellite called Charon. Although this is a moon, it is not the \"Moon\".")
        ]),
        q("This planet ranks as the third smallest planet. It is a little hotter than Earth but not because it is closer to the Sun.", [
          opt("c_mar1.gif", true, "Mars is the third smallest planet and is hotter than Earth due to its lack of protective atmosphere."),
          opt("c_jup1.gif", false, "Jupiter is the largest planet."),
          opt("c_hai1.gif", false, "A comet is not one of the planets."),
          opt("c_sat1.gif", false, "Saturn is a Jovian Planet that ranks second to largest.")
        ]),
        q("This gas giant is 11 times bigger than Earth and 20% larger than Saturn. It has a diameter of 142800km.", [
          opt("c_ven1.gif", false, "Venus is not one of the gas giants."),
          opt("c_jup1.gif", true, "Jupiter is a gas giant and the largest planet in the Solar System. Two of Jupiter's moons, Io and Europa can be seen in the picture."),
          opt("c_plu1.gif", false, "Pluto is the smallest planet."),
          opt("c_ear1.gif", false, "The Earth is not a gas giant.")
        ]),
        q("This planet is the fourth largest planet and has a larger mass than Uranus. It is nicknamed \"The Mystic\".", [
          opt("c_nep1.gif", true, "Neptune is smaller than Uranus but it is larger in mass. It will actually be the furthest planet from the Sun until 1999 when Pluto again becomes furthest."),
          opt("c_hai2.gif", false, "Halley's Comet is not a planet."),
          opt("c_jup1.gif", false, "Jupiter is the largest planet."),
          opt("c_plu1.gif", false, "Pluto is the smallest planet.")
        ])
      ]
    }
  };

  // -----------------------------------------------------------------------
  // Rendering plumbing
  // -----------------------------------------------------------------------

  var state = { screen: "overview", quiz: null };

  function byId(id) {
    return document.getElementById(id);
  }

  function clear(container) {
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
  }

  function setTheme(dark) {
    var container = byId("museum-view");
    container.classList.toggle("museum-theme-dark", dark);
    container.classList.toggle("museum-theme-light", !dark);
  }

  function renderBlock(container, block) {
    if (block.type === "p") {
      var para = document.createElement("p");
      para.textContent = block.text;
      container.appendChild(para);
      return;
    }

    if (block.type === "img") {
      var meta = IMAGES[block.image];
      var img = document.createElement("img");
      img.src = ASSET_PATH + meta.src;
      img.alt = block.alt || "";
      img.className = "museum-img museum-img-" + block.align;
      container.appendChild(img);
      return;
    }

    if (block.type === "imgCenter") {
      var metaC = IMAGES[block.image];
      var wrap = document.createElement("p");
      wrap.className = "museum-img-center-wrap";
      var imgC = document.createElement("img");
      imgC.src = ASSET_PATH + metaC.src;
      imgC.alt = block.alt || "";
      imgC.className = "museum-img-center";
      wrap.appendChild(imgC);
      container.appendChild(wrap);
      return;
    }

    if (block.type === "divider") {
      var divImg = document.createElement("img");
      divImg.src = ASSET_PATH + IMAGES.myrainbow.src;
      divImg.alt = "";
      divImg.className = "museum-divider";
      container.appendChild(divImg);
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
  // Museum overview (museum.pl)
  // -----------------------------------------------------------------------

  function renderOverview() {
    state.screen = "overview";
    setTheme(false);

    var container = byId("museum-content");
    clear(container);

    var heading = document.createElement("h1");
    heading.textContent = "KidsTown Museum";
    container.appendChild(heading);

    var sub = document.createElement("p");
    sub.className = "museum-subheading";
    sub.textContent = "Open to the Public";
    container.appendChild(sub);

    var banner = document.createElement("img");
    banner.src = ASSET_PATH + IMAGES.museum.src;
    banner.alt = "The KidsTown Museum";
    banner.className = "museum-banner";
    container.appendChild(banner);

    var welcome = document.createElement("p");
    welcome.textContent = "Welcome to the museum!";
    container.appendChild(welcome);

    var choices = document.createElement("div");
    choices.className = "museum-choices";
    choices.appendChild(
      makeButton("The Color Exhibition", "museum-choice-btn", renderColorWelcome)
    );
    choices.appendChild(
      makeButton("Our Solar System", "museum-choice-btn", renderSolarSelect)
    );
    container.appendChild(choices);

    var nav = document.createElement("div");
    nav.className = "museum-nav";
    nav.appendChild(
      makeLink("Return to the KidsTown map", "museum-map-link", "#/home")
    );
    container.appendChild(nav);
  }

  // -----------------------------------------------------------------------
  // The Color Exhibition
  // -----------------------------------------------------------------------

  function renderColorWelcome() {
    state.screen = "color-welcome";
    setTheme(false);

    var container = byId("museum-content");
    clear(container);

    var heading = document.createElement("h1");
    heading.textContent = COLOR_WELCOME.heading;
    container.appendChild(heading);

    var story = document.createElement("div");
    story.className = "museum-story";
    COLOR_WELCOME.content.forEach(function (block) {
      renderBlock(story, block);
    });
    container.appendChild(story);

    var choices = document.createElement("div");
    choices.className = "museum-choices";
    choices.appendChild(
      makeButton(COLOR_WELCOME.forward.label, "museum-choice-btn", function () {
        renderColorPage(COLOR_WELCOME.forward.target);
      })
    );
    container.appendChild(choices);

    var nav = document.createElement("div");
    nav.className = "museum-nav";
    nav.appendChild(
      makeButton("Return to the Museum", "museum-back-btn", renderOverview)
    );
    container.appendChild(nav);
  }

  function renderColorPage(pageNumber) {
    state.screen = "color-" + pageNumber;
    setTheme(false);

    var page = COLOR_PAGES[pageNumber];
    var container = byId("museum-content");
    clear(container);

    var heading = document.createElement("h1");
    heading.textContent = page.heading;
    container.appendChild(heading);

    if (page.subheading) {
      var sub = document.createElement("p");
      sub.className = "museum-subheading-bold";
      sub.textContent = page.subheading;
      container.appendChild(sub);
    }

    var story = document.createElement("div");
    story.className = "museum-story";
    page.content.forEach(function (block) {
      renderBlock(story, block);
    });
    container.appendChild(story);

    if (page.forward) {
      var choices = document.createElement("div");
      choices.className = "museum-choices";
      choices.appendChild(
        makeButton(page.forward.label, "museum-choice-btn", function () {
          renderColorPage(page.forward.target);
        })
      );
      container.appendChild(choices);
    }

    var nav = document.createElement("div");
    nav.className = "museum-nav";
    nav.appendChild(
      makeButton("Back to the Color Section", "museum-back-btn", renderColorWelcome)
    );

    if (page.ending) {
      nav.appendChild(
        makeButton("Return to the Museum", "museum-back-btn", renderOverview)
      );
    }

    container.appendChild(nav);
  }

  // -----------------------------------------------------------------------
  // Our Solar System (planet.pl / wizard.pl / wizhelp.pl)
  // -----------------------------------------------------------------------

  function renderSolarSelect() {
    state.screen = "solar-select";
    state.quiz = null;
    setTheme(true);

    var container = byId("museum-content");
    clear(container);

    var heading = document.createElement("h1");
    heading.textContent = "Thank you for deciding to visit the Planetarium.";
    container.appendChild(heading);

    var banner = document.createElement("img");
    banner.src = ASSET_PATH + IMAGES.overpg.src;
    banner.alt = "The Planetarium";
    banner.className = "museum-banner";
    container.appendChild(banner);

    var prompt = document.createElement("p");
    prompt.textContent = "Please select a tour of our Solar System:";
    container.appendChild(prompt);

    var choices = document.createElement("div");
    choices.className = "museum-choices";
    choices.appendChild(
      makeButton("Basic Tour", "museum-choice-btn", function () {
        startQuiz("basic");
      })
    );
    choices.appendChild(
      makeButton("Advanced Tour", "museum-choice-btn", function () {
        startQuiz("advanced");
      })
    );
    container.appendChild(choices);

    var nav = document.createElement("div");
    nav.className = "museum-nav";
    nav.appendChild(makeButton("Help", "museum-back-btn", renderSolarHelp));
    nav.appendChild(
      makeButton("Return to the Museum", "museum-back-btn", renderOverview)
    );
    container.appendChild(nav);
  }

  function renderSolarHelp() {
    state.screen = "solar-help";
    setTheme(true);

    var container = byId("museum-content");
    clear(container);

    var img = document.createElement("img");
    img.src = ASSET_PATH + IMAGES.helpImage.src;
    img.alt = "Solar System";
    img.className = "museum-banner museum-help-img";
    container.appendChild(img);

    var heading = document.createElement("h1");
    heading.textContent = "Planetarium Help Page";
    container.appendChild(heading);

    var help = document.createElement("p");
    help.textContent =
      "You will be shown a question and a set of four different pictures. " +
      "Click on the picture that you think may be the most appropriate " +
      "response to the given question. At any time you may skip to a new " +
      "question by clicking the \"Skip This Question\" button.";
    container.appendChild(help);

    var wish = document.createElement("h3");
    wish.textContent = "We hope you enjoy the tour of our Solar System.";
    container.appendChild(wish);

    var nav = document.createElement("div");
    nav.className = "museum-nav";
    nav.appendChild(
      makeButton("Return to the Planetarium", "museum-back-btn", renderSolarSelect)
    );
    container.appendChild(nav);
  }

  // --- Quiz state machine -------------------------------------------------

  function startQuiz(deckKey) {
    var deck = QUIZ_DECKS[deckKey];
    state.quiz = {
      deckKey: deckKey,
      deckLabel: deck.label,
      questions: deck.questions,
      remaining: deck.questions.map(function (_, index) {
        return index;
      }),
      currentIndex: null,
      wrongTried: []
    };

    pickNextQuestion();
  }

  // Choose a new random unplayed question, or show the "start over" screen
  // if the pool is empty - matching GetNextGame / SendStartOverHTML.
  function pickNextQuestion() {
    var quiz = state.quiz;

    if (quiz.remaining.length === 0) {
      renderQuizStartOver();
      return;
    }

    var randomSlot = Math.floor(Math.random() * quiz.remaining.length);
    quiz.currentIndex = quiz.remaining[randomSlot];
    quiz.remaining.splice(randomSlot, 1);
    quiz.wrongTried = [];

    renderQuizQuestion();
  }

  function renderQuizStartOver() {
    state.screen = "solar-startover";
    setTheme(true);

    var container = byId("museum-content");
    clear(container);

    var heading = document.createElement("h1");
    heading.textContent = "You've answered all the questions in this category.";
    container.appendChild(heading);

    var message = document.createElement("p");
    message.textContent = "Select \"New Question\" to start over.";
    container.appendChild(message);

    var choices = document.createElement("div");
    choices.className = "museum-choices";
    choices.appendChild(
      makeButton("New Question", "museum-choice-btn", function () {
        startQuiz(state.quiz.deckKey);
      })
    );
    container.appendChild(choices);

    var nav = document.createElement("div");
    nav.className = "museum-nav";
    nav.appendChild(
      makeButton("Return to the Planetarium", "museum-back-btn", renderSolarSelect)
    );
    container.appendChild(nav);
  }

  function renderQuizQuestion() {
    state.screen = "solar-question";
    setTheme(true);

    var quiz = state.quiz;
    var question = quiz.questions[quiz.currentIndex];

    var container = byId("museum-content");
    clear(container);

    var heading = document.createElement("h1");
    heading.textContent = quiz.deckLabel;
    container.appendChild(heading);

    var questionText = document.createElement("p");
    questionText.className = "museum-quiz-question";
    questionText.textContent = question.question;
    container.appendChild(questionText);

    var grid = document.createElement("div");
    grid.className = "museum-quiz-options";

    question.options.forEach(function (option, index) {
      var alreadyTried = quiz.wrongTried.indexOf(index) !== -1;
      var cell = document.createElement("div");
      cell.className = "museum-quiz-cell";

      var img = document.createElement("img");
      img.src = ASSET_PATH + option.img;
      img.alt = "Answer choice " + (index + 1);
      img.className = "museum-quiz-thumb";

      if (alreadyTried) {
        cell.classList.add("museum-quiz-cell-tried");
        cell.appendChild(img);
        var triedLabel = document.createElement("span");
        triedLabel.className = "museum-quiz-tried-label";
        triedLabel.textContent = "Already tried";
        cell.appendChild(triedLabel);
      } else {
        var button = document.createElement("button");
        button.type = "button";
        button.className = "museum-quiz-option-btn";
        button.appendChild(img);
        button.addEventListener("click", function () {
          renderQuizAnswer(index);
        });
        cell.appendChild(button);
      }

      grid.appendChild(cell);
    });

    container.appendChild(grid);

    var hint = document.createElement("p");
    hint.className = "museum-quiz-hint";
    hint.textContent = "Click on one of the pictures.";
    container.appendChild(hint);

    var nav = document.createElement("div");
    nav.className = "museum-nav";
    nav.appendChild(
      makeButton("Skip This Question", "museum-back-btn", pickNextQuestion)
    );
    nav.appendChild(makeButton("Help", "museum-back-btn", renderSolarHelp));
    nav.appendChild(
      makeButton("Return to the Planetarium", "museum-back-btn", renderSolarSelect)
    );
    container.appendChild(nav);
  }

  function renderQuizAnswer(selectedIndex) {
    state.screen = "solar-answer";
    setTheme(true);

    var quiz = state.quiz;
    var question = quiz.questions[quiz.currentIndex];
    var option = question.options[selectedIndex];

    var container = byId("museum-content");
    clear(container);

    var heading = document.createElement("h1");
    heading.textContent = option.correct ? "Correct!" : "Not Quite...";
    container.appendChild(heading);

    var img = document.createElement("img");
    img.src = ASSET_PATH + option.img;
    img.alt = "Answer choice " + (selectedIndex + 1);
    img.className = "museum-quiz-answer-img";
    container.appendChild(img);

    var explanation = document.createElement("p");
    explanation.className = "museum-quiz-explanation";
    explanation.textContent = option.text;
    container.appendChild(explanation);

    var choices = document.createElement("div");
    choices.className = "museum-choices";

    if (option.correct) {
      choices.appendChild(
        makeButton("New Question", "museum-choice-btn", pickNextQuestion)
      );
    } else {
      quiz.wrongTried.push(selectedIndex);
      choices.appendChild(
        makeButton("Try Again", "museum-choice-btn", renderQuizQuestion)
      );
    }

    container.appendChild(choices);

    var nav = document.createElement("div");
    nav.className = "museum-nav";

    if (!option.correct) {
      nav.appendChild(
        makeButton("Skip This Question", "museum-back-btn", pickNextQuestion)
      );
    }

    nav.appendChild(
      makeButton("Return to the Planetarium", "museum-back-btn", renderSolarSelect)
    );
    container.appendChild(nav);
  }

  // -----------------------------------------------------------------------

  function start() {
    state = { screen: "overview", quiz: null };
    renderOverview();
  }

  window.Museum = { start: start };
})();
