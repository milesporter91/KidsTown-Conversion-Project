/*
 * KidsTown Township: the four Wonders of the World and the Country Shape
 * Matching Game.
 *
 * A client-side conversion of kidstown_cgi-main/scripts/township, traced
 * against every Township route in kt.db (KEY 3000-3100):
 *   maintownship.pl - entrance (KEY 3000)
 *   zeus.pl / pyramid.pl / wall.pl / tajmahal.pl - the four Wonders
 *     (KEY 3001, 3003, 3004, 3005)
 *   wonders.pl - the shared quiz-grading page for all four Wonders
 *     (KEY 3007, submitted to by each Wonder's own quiz form)
 *   matchhead.pl / match.pl / matchN.pl / matchNcM.pl / matchbot.pl -
 *     the Country Shape Matching Game's six rounds (KEY 3008-3060)
 *   mat_fran.pl / mat_aus.pl / mat_jap.pl / finland.pl / Egypt.pl /
 *     jamaica.pl / gabon.pl / ukraine.pl / saudi.pl / thai.pl / spain.pl /
 *     venez.pl / antarc.pl / madagas.pl / china.pl / mexico.pl / laos.pl /
 *     turkey.pl - the 18 country pages the game's answers lead to
 *     (KEY 3016-3020, 3062-3090)
 * Nothing here calls kt.cgi or any server-side script.
 *
 * Two notes on original routes that were registered but unreachable:
 *   - mainwonders.pl (KEY 3100) is in kt.db, but nothing in any Township
 *     script links to it - its content is a near-duplicate of the
 *     entrance's own Wonders list. Left unreachable here too, matching
 *     the original.
 *   - graphics/township/ also contains unused art for at least two more
 *     classical wonders that were apparently planned but never wired up
 *     (Hanging Gardens of Babylon: garden*.jpg/gif, iraq*.gif/jpg;
 *     Mausoleum at Halicarnassus: mausol*.jpg/gif). No script or kt.db
 *     route ever used them, so they are out of scope here too.
 *
 * One deliberate change from the original's exact mechanic: the Country
 * Shape Game's three clues were each shown one at a time in the original
 * (revealing a second clue would hide the first, since every clue was
 * its own separately rendered CGI page). Here, clues stay revealed once
 * clicked, so a visitor can see all three at once - the wording of every
 * clue is unchanged, only the display persistence improved.
 */
(function () {
  "use strict";

  var ASSET_PATH = "assets/images/township/";

  // -----------------------------------------------------------------------
  // The four Wonders of the World (zeus.pl / pyramid.pl / wall.pl /
  // tajmahal.pl, graded by the shared wonders.pl)
  // -----------------------------------------------------------------------

  function wonder(config) {
    return config;
  }

  var WONDERS = {
    zeus: wonder({
      key: "zeus",
      name: "Statue of Zeus of Olympia",
      linkLabel: "Statue of Zeus",
      mapImg: "mapgr.jpg",
      mapAlt: "Map of Greece",
      flagImg: "flaggr.gif",
      flagAlt: "Flag of Greece",
      sideImages: [
        { img: "greece4.gif", alt: "Parthenon" },
        { img: "greece7.gif", alt: "Statue of Aphrodite" }
      ],
      description:
        "The statue of Zeus was built in the honor of the god who the " +
        "Ancient Olympic games were held for. It was located in the " +
        "ancient town that gave its name to the Olympics, the ancient " +
        "town of Olympia in Greece. The ancient Greek calender starts in " +
        "776 BCE. The Olympic games are believed to have started that " +
        "year. The temple of Zeus in Olympia was designed by the " +
        "architect Libon and was built around 420 BCE. The statue was " +
        "placed inside the temple about 15 to 20 years later when its " +
        "creator, Pheidias, finished sculpting it. The statue represents " +
        "the god of ancient world, Zeus, sitting and holding a staff " +
        "made from ivory and gold. The whole statue was made from gold, " +
        "and it was as tall as a modern four-story building. During the " +
        "Olympic games, even wars stopped allowing athletes from Syria, " +
        "Egypt, and Sicily to celebrate the Olympics and to worship " +
        "their king of gods: Zeus.",
      quiz: {
        q1: {
          label: "The statue of Zeus was built around the year",
          options: ["500 CE", "300 BCE", "420 BC"],
          correct: "420 BC"
        },
        q2: {
          label: "Does the statue still exist?",
          options: [
            { label: "Yes", value: "on" },
            { label: "No", value: "off" }
          ],
          correct: "off"
        },
        q3: {
          label: "In which town was the statue located? (Construct the word)",
          word: "OLYMPIA",
          letters: [
            ["M", "N", "O", "P", "Q", "R", "S"],
            ["K", "L", "M", "N", "O", "P", "Q"],
            ["U", "V", "W", "X", "Y", "Z"],
            ["K", "L", "M", "N", "O", "P"],
            ["K", "L", "M", "N", "O", "P", "Q"],
            ["F", "G", "H", "I", "J", "K", "L"],
            ["A", "B", "C", "D", "E", "F", "G"]
          ]
        },
        images: ["zeus3.jpg", "zeus2.jpg", "zeus1.jpg", "zeus.jpg"],
        bonusText:
          "Greece is one of the countries with great history and " +
          "mythology. Besides Zeus, other gods such as Poseidon, " +
          "Aphrodite and Apollo, were the center of the attention of the " +
          "ancient world."
      }
    }),

    pyramid: wonder({
      key: "pyramid",
      name: "Great Pyramid of Giza",
      linkLabel: "Pyramids of Giza",
      mapImg: "mapeg.jpg",
      mapAlt: "Map of Egypt",
      flagImg: "flageg.gif",
      flagAlt: "Flag of Egypt",
      sideImages: [
        { img: "egypt6.gif", alt: "Statue of a Pharaoh" },
        { img: "desert.jpg", alt: "River Nile" }
      ],
      description:
        "We have just arrived in Egypt. In this wonderful country on the " +
        "west side of the river Nile, we find the oldest and one of the " +
        "biggest monuments of the world: The Great Pyramid of Giza. This " +
        "Pyramid was designed by the Egyptian Pharaoh (King) Khufu " +
        "around the year 2560 BCE to be his tomb when he died. The Great " +
        "pyramid is believed to have been built over a 20-year period. " +
        "When it was finished, it was 145.75 meters or 481 feet high. " +
        "The structure consists of approximately two million blocks of " +
        "stone each weighing more then two tons. The inside of the " +
        "Great Pyramid has galleries, corridors and escape shafts that " +
        "all lead to the center of the pyramid where the sarcophagus " +
        "(the Pharaoh's tomb) is located. The Pharaoh was placed there " +
        "when he died with a lot of gold, precious stones and other " +
        "valuable things, that he could take with him on his mystic " +
        "journey to the afterlife.",
      quiz: {
        q1: {
          label: "The Great Pyramid of Giza was built around the year",
          options: ["500 CE", "2560 BCE", "5080 BCE"],
          correct: "2560 BCE"
        },
        q2: {
          label:
            "Were there any corridors, galleries, or escape shafts in the pyramid?",
          options: [
            { label: "Yes", value: "on" },
            { label: "No", value: "off" }
          ],
          correct: "on"
        },
        q3: {
          label:
            "An ancient building that Egyptians used as a tomb for their Pharaohs: (Construct the word)",
          word: "PYRAMID",
          letters: [
            ["M", "N", "O", "P", "Q", "R"],
            ["U", "V", "W", "X", "Y", "Z"],
            ["O", "P", "Q", "R", "S", "T"],
            ["A", "B", "C", "D", "E", "F"],
            ["K", "L", "M", "N", "O", "P"],
            ["F", "G", "H", "I", "J", "K"],
            ["A", "B", "C", "D", "E", "F"]
          ]
        },
        images: ["pyramid4.jpg", "pyramid3.jpg", "pyramid2.jpg", "pyramid1.jpg"],
        bonusText:
          "Egypt has many pyramids besides the one of Giza. It also has " +
          "the great Sphinx, a beautiful structure of one of the gods of " +
          "ancient Egypt, which still exists after thousands of years."
      }
    }),

    wall: wonder({
      key: "wall",
      name: "Great Wall of China",
      linkLabel: "Great Wall of China",
      mapImg: "mapch.jpg",
      mapAlt: "Map of China",
      flagImg: "flagch.gif",
      flagAlt: "Flag of China",
      sideImages: [
        { img: "china3.gif", alt: "Chinese Painting" },
        { img: "china8.gif", alt: "Tiananmen Square" }
      ],
      description:
        "The Great Wall of China is the longest structure ever built. It " +
        "is about 4,000 miles long. Remarkably, it was all built by " +
        "hand. Most of the wall was built with bricks and stones. Some " +
        "of the tallest parts of the Great Wall, near the capital city " +
        "of Beijing, rises to 35 feet. These sections are about 25 feet " +
        "wide at the base and 20 feet wide at the top. Watch towers " +
        "stand 100 to 200 feet apart along the wall. Historically, the " +
        "wall was built during the time of the Ming dynasty which ruled " +
        "China from 1368-1644. It's main purpose was to protect China " +
        "from the invaders of the north, who mostly came from Mongolia. " +
        "Even after hundreds of years, the Great Wall still stands.",
      quiz: {
        q1: {
          label: "What dynasty ruled China during the time that the Great Wall was built?",
          options: ["Ming", "Hang", "Khan"],
          correct: "Ming"
        },
        q2: {
          label: "The Great Wall was built to protect China from invaders.",
          options: [
            { label: "TRUE", value: "on" },
            { label: "FALSE", value: "off" }
          ],
          correct: "on"
        },
        q3: {
          label: "Most of the Great Wall is built with stones and ________ (Construct the word)",
          word: "BRICKS",
          letters: [
            ["A", "B", "C", "D", "E", "F"],
            ["M", "N", "O", "P", "Q", "R"],
            ["F", "G", "H", "I", "J", "K"],
            ["A", "B", "C", "D", "E", "F"],
            ["F", "G", "H", "I", "J", "K"],
            ["O", "P", "Q", "R", "S", "T"]
          ]
        },
        images: ["answer0.jpg", "answer1.jpg", "answer2.jpg", "answer3.jpg"],
        bonusText:
          "In addition to the Great Wall, China has many other " +
          "interesting places to visit. Places such as the mountains of " +
          "Tibet, The Forbidden City, as well as the Temple of Heaven. " +
          "The Great Wall awaits your arrival."
      }
    }),

    tajmahal: wonder({
      key: "tajmahal",
      name: "Taj Mahal",
      linkLabel: "Taj Mahal",
      mapImg: "india1.gif",
      mapAlt: "Map of India",
      flagImg: "indflag.jpg",
      flagAlt: "Flag of India",
      sideImages: [
        { img: "india3.gif", alt: "River Ganges" },
        { img: "india4.gif", alt: "Hindu Temple" }
      ],
      description:
        "The Taj Mahal is considered to be one of the wonders of the " +
        "world. The Taj Mahal was built by the Mughal Emperor \"Shah " +
        "Jahan\" in memory of his beloved \"Mumtaz Mahal\". It took " +
        "20,000 craftsmen working around the clock for 22 years to " +
        "complete it. It is truely one man's monumental testimony of " +
        "love. The Taj Mahal has become a landmark not only for the " +
        "city of Agra, but for the entire country of India.",
      quiz: {
        q1: {
          label: "The Taj Mahal is located in:",
          options: ["China", "India", "Tibet"],
          correct: "India"
        },
        q2: {
          label: "The Taj Mahal was built by 20,000 craftsmen.",
          options: [
            { label: "TRUE", value: "on" },
            { label: "FALSE", value: "off" }
          ],
          correct: "on"
        },
        q3: {
          label: "The Taj Mahal was a work of ____! (Construct the word)",
          word: "LOVE",
          letters: [
            ["F", "G", "H", "I", "J", "K", "L"],
            ["M", "N", "O", "P", "Q", "R"],
            ["R", "S", "T", "U", "V", "W"],
            ["A", "B", "C", "D", "E", "F"]
          ]
        },
        images: ["taj14.jpg", "taj12.jpg", "taj34.jpg", "taj1.jpg"],
        bonusText:
          "India is one of the largest countries in the world with a " +
          "population of over 500 million people. The history of India " +
          "is over two thousand years old."
      }
    })
  };

  var WONDER_ORDER = ["zeus", "pyramid", "wall", "tajmahal"];

  // -----------------------------------------------------------------------
  // Country Shape Matching Game
  // -----------------------------------------------------------------------

  function country(config) {
    return config;
  }

  var COUNTRIES = {
    france: country({
      name: "France",
      correct: false,
      image: "francmap.gif",
      round: 0,
      facts: [
        "Among France's kings were Louis II the Stammerer, Charles III the Simple, and Louis VI the Fat.",
        "France is part of Europe. The capital of France is Paris. Other important cities are Marseille, Lyon, Toulouse, and Nice.",
        "France's cuisine is considered to be one of the greatest in the world. Well-known French dishes include coq au vin (chicken in wine), escargot (snails), and vichyssoise (cold potato soup)."
      ]
    }),
    australia: country({
      name: "Australia",
      correct: true,
      shapeImg: "match_co.gif",
      contextImg: "Austcntx.gif",
      round: 0,
      facts: [
        "Australia is about the same size as the United States, but has much less usable land because the interior is mostly desert.",
        "The capital of Australia is Canberra. Other major cities include Sydney, Melbourne, Adelaide, Perth, and Brisbane.",
        "The original inhabitants are called Aborigines. The English settled the continent in 1788 to start a prison colony.",
        "Australia has more sheep than any other country."
      ]
    }),
    japan: country({
      name: "Japan",
      correct: false,
      image: "japanmap.gif",
      round: 0,
      facts: [
        "Japan is an island country off the coast of mainland Asia. Its four main islands are Honshu, Hokkaido, Kyushu, and Shikoku.",
        "Around one-fourth to one-third of all documents published in Japan are manga, or comic books.",
        "The capital of Japan is Tokyo. Other major cities are Yokohama, Osaka, Nagoya, and Sapporo."
      ]
    }),

    finland: country({
      name: "Finland",
      correct: true,
      shapeImg: "match2.gif",
      contextImg: "Fincontx.gif",
      round: 1,
      facts: [
        "The capital of Finland is Helsinki. Other major cities include Espoo, Tampere, Vantaa, and Turku.",
        "One of the most famous Finnish foods is lutefisk, which is made by soaking fish in lye. Finns also drink more coffee than any other people in the world.",
        "There are about 60,000 lakes in Finland. Many were created when glaciers gouged them out.",
        "Sauna baths are a central part of Finnish life."
      ]
    }),
    egypt: country({
      name: "Egypt",
      correct: false,
      image: "Egypt.gif",
      round: 1,
      facts: [
        "Egypt is in North Africa. The capital of Egypt is Cairo. Other important cities are Alexandria, Luxor, and Aswan.",
        "Egypt's national dish is fool, which is made from beans.",
        "The first Arabic-language writer to win the Nobel Prize for Literature was the Egyptian Naguib Mafouz."
      ]
    }),
    jamaica: country({
      name: "Jamaica",
      correct: false,
      image: "Jamaica.gif",
      round: 1,
      facts: [
        "The capital of Jamaica is Kingston.",
        "Reggae music was invented in Jamaica. The best-known reggae musician was Bob Marley.",
        "Jamaica is a popular island resort in the Caribbean Sea. It is part of the West Indies."
      ]
    }),

    gabon: country({
      name: "Gabon",
      correct: false,
      image: "Gabon.gif",
      round: 2,
      facts: [
        "Gabon is in Africa. The capital of Gabon is Libreville. Libreville, which means \"Free Town,\" was founded as a settlement for slaves freed from illegal slaving ships. Other cities include Port-Gentil and Franceville.",
        "Gabon has the world's largest deposits of manganese.",
        "The largest tribe in Gabon is the Fangs. Fang masks, which are heart-shaped, influenced the famous European artist Pablo Picasso."
      ]
    }),
    ukraine: country({
      name: "Ukraine",
      correct: false,
      image: "Ukraine.gif",
      round: 2,
      facts: [
        "Ukraine was part of the former Soviet Union and is now part of the Commonweath of Independent States. The capital of Ukraine is Kiev. Other cities include Kharkiv, Donetske, Odessa, and Lviv.",
        "The worst nuclear accident known to the world occurred in Kiev in 1986 at the Chernobyl nuclear power plant.",
        "Olympic gold-medalist figure skaters Oksana Baiul and Viktor Petrenko are both Ukrainian."
      ]
    }),
    saudi: country({
      name: "Saudi Arabia",
      correct: true,
      shapeImg: "match3.gif",
      contextImg: "Saudicon.gif",
      extraImg: "midecon.gif",
      round: 2,
      facts: [
        "The capital of Saudi Arabia is Riyadh. Other important cities are Jeddah and Mecca.",
        "Saudi Arabia contains the two holiest places of the religion of Islam: Mecca, the birthplace of the prophet Muhammad, and Medina, where Muhammad went in 622.",
        "In the south of Saudi Arabia is the Rub'al Khali, the \"Empty Quarter,\" one of the world's largest deserts.",
        "Saudi Arabia is almost entirely the creation of one man, King Ibn Saud."
      ]
    }),

    thailand: country({
      name: "Thailand",
      correct: false,
      image: "thailand.gif",
      round: 3,
      facts: [
        "Thailand is in Asia. The capital of Thailand is Bangkok. Other important cities are Nonthanburi and Chiang Mai.",
        "Thailand is the only Southeast Asian country that was never ruled by a European power.",
        "Thailand used to be called Siam. The name was changed in 1949."
      ]
    }),
    spain: country({
      name: "Spain",
      correct: false,
      image: "Spain.gif",
      round: 3,
      facts: [
        "Spain is in Europe. The capital of Spain is Madrid. Other important cities are Barcelona, Valencia, and Seville.",
        "Famous Spanish foods include gazpacho, a cold vegetable soup; flan, a baked caramel custard; and arroz con pollo, chicken with rice.",
        "Flamenco music and flamenco dancing were created in Spain by gypsies."
      ]
    }),
    venezuela: country({
      name: "Venezuela",
      correct: true,
      shapeImg: "Match4.gif",
      contextImg: "Venezcon.gif",
      round: 3,
      facts: [
        "The capital of Venezuela is Caracas. Other important cities are Maracaibo, Valencia, and Barquisimento.",
        "Venezuela is the third biggest supplier of oil in the world.",
        "Animals that can be found in Venezuela are jaguars, monkeys, sloths, ocelots, bears, armadillos, flamingos, herons, guacharos (oilbirds), crocodiles, large snakes (anacondas and boas), and tarantulas (big hairy spiders).",
        "Venezuela means \"Little Venice.\" Spanish explorers gave it that name because they saw houses on stilts along the coast."
      ]
    }),

    antarctica: country({
      name: "Antarctica",
      correct: false,
      image: "Antarc.gif",
      round: 4,
      facts: [
        "Antarctica is not really a country. It is an uninhabited continent at the bottom of the world, covered with ice. Different countries have claimed parts of it because it has large mineral deposits.",
        "Because Antarctica is so cold and people cannot raise food, it has no permanent human settlements. However, there are several research bases.",
        "If the Antarctic ice sheet melted, the sea would rise at least 60 meters!",
        "Antarctica is the coldest, windiest, highest, and driest continent on Earth."
      ]
    }),
    madagascar: country({
      name: "Madagascar",
      correct: false,
      image: "Madagas.gif",
      round: 4,
      facts: [
        "Madagascar is the world's fourth largest island. It lies off the coast of Africa. The capital is Antananarivo.",
        "90 percent of the animals and plants on Madagascar--more than 150,000 species--are not found anywhere else on Earth.",
        "Although Madagascar is part of Africa, many of the ancestors of the inhabitants came from Southeast Asia."
      ]
    }),
    china: country({
      name: "China",
      correct: true,
      shapeImg: "match5.gif",
      contextImg: "Chinacon.gif",
      round: 4,
      facts: [
        "The capital of China is Beijing. Other important cities are Chongqing, Shanghai, Tianjin, Canton, Wuhan, Shenyang, Nanjing, and Harbin.",
        "Many basic inventions came out of China, including gunpowder, paper, kites, and silk.",
        "Chinese is the language most spoken in the world.",
        "Chop suey is commonly found in Chinese restaurants, but it wasn't created in China. It was invented by a Chinese cook in America."
      ]
    }),

    mexico: country({
      name: "Mexico",
      correct: true,
      shapeImg: "match6.gif",
      contextImg: "Mexicont.gif",
      round: 5,
      isLast: true,
      facts: [
        "The capital of Mexico is Mexico City. Other important cities are Guadalajara, Ecatepic, Nezahualcoyotl, and Puebla.",
        "Several of the world's most famous resorts, such as Acapulco and Cancun, are in Mexico. In fact, in 1996, Mexico was the seventh most visited country by tourists.",
        "Humans first learned to grow corn in Mexico. They may have learned to do this as early as 4500 BCE.",
        "Mexico was the center of one of the great ancient civilizations, the Olmec. Although the Olmecs did not have draft animals, wheels, or iron tools, they still created huge sculptures, temples, and complex systems for managing water.",
        "An ancient city in Mexico, Teotihuacan, was the largest city in the Americas for many centuries. It influenced the culture of the surrounding lands much as New York City, London, Paris, or Tokyo do today."
      ]
    }),
    laos: country({
      name: "Laos",
      correct: false,
      image: "Laos.gif",
      round: 5,
      facts: [
        "Laos is in Asia. The capital of Laos is Vientiane. Other cities include Sam Neua, Thakhek, and Vang Vieng.",
        "Laos is completely surrounded by other countries; it has no connection to the sea. However, its most valuable export is electricity generated by hydroelectric power stations on the River Mekong.",
        "Once part of Indochina (a group of Southeast Asia countries run by France), Laos has been independent since 1950.",
        "Laos has no railroads and only very basic roads."
      ]
    }),
    turkey: country({
      name: "Turkey",
      correct: false,
      image: "turkey.gif",
      round: 5,
      facts: [
        "Turkey is part of two continents: Europe and Asia (where it is known as Asia Minor or Anatolia). The capital of Turkey is Ankara. Other cities include Istanbul, Izmir, Bursa, and Gaziantep.",
        "Istanbul is a very important historical city. It was first known as Byzantium but later became Constantinople when the Roman Empire moved its capital there in the year 330. The Romans named the city after their Emperor Constantine. The name \"Istanbul\" came from the Ottoman Turks, who conquered the city in 1435.",
        "The highest mountain in Turkey is Mount Ararat, which is supposed to have been where Noah's Ark came to rest after the flood."
      ]
    })
  };

  // The six rounds, transcribed from match1.pl .. match6.pl. Each clue
  // is transcribed from that round's matchNc1/c2/c3.pl (they describe
  // the round's correct country progressively, from vague to specific).
  var ROUNDS = [
    {
      shapeImg: "match_co.gif",
      choices: [
        { label: "France", key: "france" },
        { label: "Australia", key: "australia" },
        { label: "Japan", key: "japan" }
      ],
      clues: [
        "This country is also known as \"The Land Down Under.\"",
        "Koalas and tasmanian devils live here.",
        "This country takes up an entire continent."
      ]
    },
    {
      shapeImg: "match2.gif",
      choices: [
        { label: "Finland", key: "finland" },
        { label: "Egypt", key: "egypt" },
        { label: "Jamaica", key: "jamaica" }
      ],
      clues: [
        "This country is in Europe.",
        "Part of this country is in the Arctic Circle.",
        "This country was invaded by the USSR in 1939."
      ]
    },
    {
      shapeImg: "match3.gif",
      choices: [
        { label: "Gabon", key: "gabon" },
        { label: "Ukraine", key: "ukraine" },
        { label: "Saudi Arabia", key: "saudi" }
      ],
      clues: [
        "This country is part of the Middle East.",
        "Most of the people in this country are Islamic.",
        "About 25% of the world's oil reserves are in this country."
      ]
    },
    {
      shapeImg: "Match4.gif",
      choices: [
        { label: "Thailand", key: "thailand" },
        { label: "Spain", key: "spain" },
        { label: "Venezuela", key: "venezuela" }
      ],
      clues: [
        "This is a South American country.",
        "The world's highest waterfalls, Angel Falls, are in this country.",
        "The official language is Spanish."
      ]
    },
    {
      shapeImg: "match5.gif",
      choices: [
        { label: "Antarctica", key: "antarctica" },
        { label: "Madagascar", key: "madagascar" },
        { label: "China", key: "china" }
      ],
      clues: [
        "This country is in Asia.",
        "More than 1 billion people live here.",
        "One of the oldest civilizations in the world exists here."
      ]
    },
    {
      shapeImg: "match6.gif",
      choices: [
        { label: "Mexico", key: "mexico" },
        { label: "Laos", key: "laos" },
        { label: "Turkey", key: "turkey" }
      ],
      clues: [
        "This country is part of North America.",
        "This is the world's largest Spanish-speaking country.",
        "Mayans, Aztecs, Toltecs, and Olmecs used to live here."
      ]
    }
  ];

  // -----------------------------------------------------------------------
  // Rendering plumbing
  // -----------------------------------------------------------------------

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

  function renderCommonFooter(container, opts) {
    opts = opts || {};

    var nav = document.createElement("div");
    nav.className = "township-nav";

    if (!opts.hideReturnToTownship) {
      nav.appendChild(
        makeButton("Return to Township", "township-back-btn", renderEntrance)
      );
    }

    if (opts.showMapLink) {
      nav.appendChild(
        makeLink("Return to the KidsTown map", "township-map-link", "#/home")
      );
    }

    container.appendChild(nav);
  }

  // -----------------------------------------------------------------------
  // Entrance (maintownship.pl)
  // -----------------------------------------------------------------------

  function renderEntrance() {
    state = { screen: "entrance" };

    var container = byId("township-content");
    clear(container);

    container.appendChild(heading("Welcome Aboard the TownShip"));
    container.appendChild(image("TownShip.gif", "TownShip", "township-banner"));
    container.appendChild(
      paragraph("Sail to One of These Wonders of the World", "township-guess")
    );

    var wonderChoices = document.createElement("div");
    wonderChoices.className = "township-choices";
    WONDER_ORDER.forEach(function (key) {
      wonderChoices.appendChild(
        makeButton(WONDERS[key].linkLabel, "township-choice-btn", function () {
          renderWonder(key);
        })
      );
    });
    container.appendChild(wonderChoices);

    container.appendChild(
      paragraph("Identify Countries By Their Outlines", "township-guess")
    );

    var gameChoices = document.createElement("div");
    gameChoices.className = "township-choices";
    gameChoices.appendChild(
      makeButton("Country Shape Game", "township-choice-btn", function () {
        startCountryGame();
      })
    );
    container.appendChild(gameChoices);

    renderCommonFooter(container, { hideReturnToTownship: true, showMapLink: true });
  }

  // -----------------------------------------------------------------------
  // Wonders of the World (zeus.pl / pyramid.pl / wall.pl / tajmahal.pl)
  // -----------------------------------------------------------------------

  function renderWonder(key) {
    state = { screen: "wonder-" + key, wonderKey: key };

    var data = WONDERS[key];
    var container = byId("township-content");
    clear(container);

    var headerRow = document.createElement("div");
    headerRow.className = "township-wonder-header";
    var mapCol = document.createElement("div");
    mapCol.className = "township-wonder-header-col";
    mapCol.appendChild(image(data.mapImg, data.mapAlt, "township-header-img"));
    mapCol.appendChild(paragraph(data.mapAlt));
    headerRow.appendChild(mapCol);

    var nameCol = document.createElement("div");
    nameCol.className = "township-wonder-header-col township-wonder-name";
    nameCol.appendChild(heading(data.name));
    headerRow.appendChild(nameCol);

    var flagCol = document.createElement("div");
    flagCol.className = "township-wonder-header-col";
    flagCol.appendChild(image(data.flagImg, data.flagAlt, "township-header-img"));
    flagCol.appendChild(paragraph(data.flagAlt));
    headerRow.appendChild(flagCol);
    container.appendChild(headerRow);

    var bodyRow = document.createElement("div");
    bodyRow.className = "township-wonder-body";
    var leftImg = document.createElement("div");
    leftImg.className = "township-wonder-side";
    leftImg.appendChild(image(data.sideImages[0].img, data.sideImages[0].alt, "township-side-img"));
    leftImg.appendChild(paragraph(data.sideImages[0].alt));
    bodyRow.appendChild(leftImg);

    var descCol = document.createElement("div");
    descCol.className = "township-wonder-desc";
    descCol.appendChild(paragraph(data.description));
    bodyRow.appendChild(descCol);

    var rightImg = document.createElement("div");
    rightImg.className = "township-wonder-side";
    rightImg.appendChild(image(data.sideImages[1].img, data.sideImages[1].alt, "township-side-img"));
    rightImg.appendChild(paragraph(data.sideImages[1].alt));
    bodyRow.appendChild(rightImg);
    container.appendChild(bodyRow);

    container.appendChild(heading("Game of Questions", "h2"));

    var form = document.createElement("form");
    form.className = "township-quiz-form";

    // Q1
    var q1Block = document.createElement("div");
    q1Block.className = "township-quiz-block";
    q1Block.appendChild(paragraph(data.quiz.q1.label, "township-quiz-label"));
    var q1Select = document.createElement("select");
    q1Select.id = "township-q1-" + key;
    q1Select.name = "township-q1-" + key;
    var q1Placeholder = document.createElement("option");
    q1Placeholder.value = "";
    q1Placeholder.textContent = "Select One";
    q1Select.appendChild(q1Placeholder);
    data.quiz.q1.options.forEach(function (opt) {
      var option = document.createElement("option");
      option.value = opt;
      option.textContent = opt;
      q1Select.appendChild(option);
    });
    q1Block.appendChild(q1Select);
    form.appendChild(q1Block);

    // Q2
    var q2Block = document.createElement("div");
    q2Block.className = "township-quiz-block";
    q2Block.appendChild(paragraph(data.quiz.q2.label, "township-quiz-label"));
    var q2Radios = [];
    data.quiz.q2.options.forEach(function (opt) {
      var radioLabel = document.createElement("label");
      radioLabel.className = "township-radio-label";
      var radio = document.createElement("input");
      radio.type = "radio";
      radio.name = "township-q2-" + key;
      radio.value = opt.value;
      q2Radios.push(radio);
      radioLabel.appendChild(radio);
      radioLabel.appendChild(document.createTextNode(" " + opt.label));
      q2Block.appendChild(radioLabel);
    });
    form.appendChild(q2Block);

    // Q3
    var q3Block = document.createElement("div");
    q3Block.className = "township-quiz-block";
    q3Block.appendChild(paragraph(data.quiz.q3.label, "township-quiz-label"));
    var q3Row = document.createElement("div");
    q3Row.className = "township-letter-row";
    var q3Selects = [];
    data.quiz.q3.letters.forEach(function (letterOptions, letterIndex) {
      var select = document.createElement("select");
      select.id = "township-q3-" + key + "-" + letterIndex;
      select.name = "township-q3-" + key + "-" + letterIndex;
      var placeholder = document.createElement("option");
      placeholder.value = "";
      placeholder.textContent = "";
      select.appendChild(placeholder);
      letterOptions.forEach(function (letter) {
        var option = document.createElement("option");
        option.value = letter;
        option.textContent = letter;
        select.appendChild(option);
      });
      q3Selects.push(select);
      q3Row.appendChild(select);
    });
    q3Block.appendChild(q3Row);
    form.appendChild(q3Block);

    var submit = document.createElement("button");
    submit.type = "submit";
    submit.className = "township-choice-btn";
    submit.textContent = "Click Here to Solve the Puzzle";
    form.appendChild(submit);

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var q1Value = q1Select.value;
      var q2Value = "";
      q2Radios.forEach(function (radio) {
        if (radio.checked) {
          q2Value = radio.value;
        }
      });
      var q3Value = q3Selects.map(function (select) {
        return select.value;
      }).join("");

      var correctCount = 0;
      if (q1Value === data.quiz.q1.correct) {
        correctCount++;
      }
      if (q2Value === data.quiz.q2.correct) {
        correctCount++;
      }
      if (q3Value === data.quiz.q3.word) {
        correctCount++;
      }

      renderWonderResult(key, correctCount);
    });

    container.appendChild(form);
    renderCommonFooter(container, {});
  }

  function renderWonderResult(key, correctCount) {
    state = { screen: "wonder-result-" + key };

    var data = WONDERS[key];
    var container = byId("township-content");
    clear(container);

    if (correctCount === 3) {
      container.appendChild(heading("Good Job"));
      container.appendChild(
        paragraph(
          "You answered all 3 questions correctly. This view of the " +
            data.name + " is your prize."
        )
      );
      container.appendChild(
        image(data.quiz.images[3], data.name, "township-reward-img")
      );
      container.appendChild(paragraph(data.quiz.bonusText));

      var winChoices = document.createElement("div");
      winChoices.className = "township-choices";
      winChoices.appendChild(
        makeButton("Main Page", "township-choice-btn", renderEntrance)
      );
      container.appendChild(winChoices);
    } else {
      var missed = 3 - correctCount;
      container.appendChild(heading("Almost There..."));
      container.appendChild(
        paragraph(
          "Nice try, but you missed " + missed + " question(s). With " +
            "your effort, you have earned this glimpse of the " +
            data.name + "."
        )
      );
      container.appendChild(
        image(data.quiz.images[correctCount], data.name, "township-reward-img")
      );

      var tryChoices = document.createElement("div");
      tryChoices.className = "township-choices";
      tryChoices.appendChild(
        makeButton("Try Again", "township-choice-btn", function () {
          renderWonder(key);
        })
      );
      tryChoices.appendChild(
        makeButton("Main Page", "township-choice-btn", renderEntrance)
      );
      container.appendChild(tryChoices);
    }

    renderCommonFooter(container, {});
  }

  // -----------------------------------------------------------------------
  // Country Shape Matching Game
  // -----------------------------------------------------------------------

  var gameState = { roundIndex: 0, revealed: [] };

  function startCountryGame() {
    gameState = { roundIndex: 0, revealed: [] };
    renderRound(0);
  }

  function renderRound(index) {
    state = { screen: "game-round-" + index };
    gameState.roundIndex = index;

    var round = ROUNDS[index];
    var container = byId("township-content");
    clear(container);

    if (index === 0) {
      container.appendChild(heading("Country Shape Matching Game"));
      container.appendChild(
        paragraph(
          "Welcome! The object of this game is to identify a country " +
            "just from its shape. You can look in an atlas or on a " +
            "globe to help you. If you're stumped, you can look at " +
            "three clues that will help you narrow down your choices.",
          "township-guess"
        )
      );
      container.appendChild(
        paragraph(
          "Even wrong answers have interesting things to tell you, so " +
            "try all the countries!"
        )
      );
    }

    container.appendChild(heading("What Country Is This?", "h2"));
    container.appendChild(image(round.shapeImg, "Country outline", "township-shape-img"));

    var revealedForRound = gameState.revealed;

    var clueRow = document.createElement("div");
    clueRow.className = "township-clue-row";
    round.clues.forEach(function (clueText, clueIndex) {
      if (revealedForRound.indexOf(clueIndex) !== -1) {
        var clueP = document.createElement("p");
        clueP.className = "township-clue-revealed";
        clueP.textContent = clueText;
        clueRow.appendChild(clueP);
      } else {
        clueRow.appendChild(
          makeButton("Clue " + (clueIndex + 1), "township-clue-btn", function () {
            revealedForRound.push(clueIndex);
            renderRound(index);
          })
        );
      }
    });
    container.appendChild(clueRow);

    var answerRow = document.createElement("div");
    answerRow.className = "township-choices";
    round.choices.forEach(function (choice) {
      answerRow.appendChild(
        makeButton(choice.label, "township-choice-btn", function () {
          renderCountry(choice.key);
        })
      );
    });
    container.appendChild(answerRow);

    if (index < ROUNDS.length - 1) {
      var skipRow = document.createElement("div");
      skipRow.className = "township-choices";
      skipRow.appendChild(
        makeButton(
          "I've Already Done This Set. Skip to the Next One!",
          "township-back-btn",
          function () {
            gameState.revealed = [];
            renderRound(index + 1);
          }
        )
      );
      container.appendChild(skipRow);
    }

    renderCommonFooter(container, {});
  }

  function renderCountry(key) {
    state = { screen: "game-country-" + key };

    var data = COUNTRIES[key];
    var container = byId("township-content");
    clear(container);

    if (data.correct) {
      container.appendChild(heading("The Country Is Indeed " + data.name + "!"));
      container.appendChild(
        paragraph("This is where " + data.name + " is located in the world:")
      );

      var imgRow = document.createElement("div");
      imgRow.className = "township-country-imgs";
      imgRow.appendChild(image(data.shapeImg, data.name + " outline", "township-country-img"));
      imgRow.appendChild(image(data.contextImg, data.name + " on the map", "township-country-img"));
      container.appendChild(imgRow);

      if (data.extraImg) {
        container.appendChild(
          image(data.extraImg, "Regional map", "township-country-img-wide")
        );
      }
    } else {
      container.appendChild(heading("This Is What " + data.name + " Looks Like:"));
      container.appendChild(image(data.image, data.name, "township-country-img"));
    }

    container.appendChild(heading("Did You Know?", "h2"));
    var list = document.createElement("ul");
    list.className = "township-facts-list";
    data.facts.forEach(function (fact) {
      var li = document.createElement("li");
      li.textContent = fact;
      list.appendChild(li);
    });
    container.appendChild(list);

    var choices = document.createElement("div");
    choices.className = "township-choices";

    if (data.correct) {
      if (data.isLast) {
        container.appendChild(heading("That's All for Now! Thanks for Playing!", "h3"));
        container.appendChild(
          paragraph("Now choose another part of KidsTown to visit:")
        );
      } else {
        choices.appendChild(
          makeButton(
            "Go to the Next Matching Game!",
            "township-choice-btn",
            function () {
              gameState.revealed = [];
              renderRound(data.round + 1);
            }
          )
        );
      }
    } else {
      choices.appendChild(
        makeButton("Go Back to the Game!", "township-choice-btn", function () {
          renderRound(data.round);
        })
      );
    }

    container.appendChild(choices);
    renderCommonFooter(container, { showMapLink: !!data.isLast });
  }

  // -----------------------------------------------------------------------

  function start() {
    state = { screen: "entrance" };
    renderEntrance();
  }

  window.Township = { start: start };
})();
