/*
 * City Park interactive story.
 *
 * A client-side conversion of kidstown_cgi-main/scripts/citypark (main.pl +
 * page.pl) and kidstown_cgi-main/data/citypark/page1-page18. All navigation
 * happens in memory - nothing here calls kt.cgi or any server-side script.
 *
 * The visitor's name is only ever written using textContent, never
 * innerHTML, so it can never be interpreted as markup.
 */
(function () {
  "use strict";

  var ASSET_PATH = "assets/images/citypark/";
  var DEFAULT_NAME = "My friend";
  var NAME_TOKEN = "{{name}}";

  // Image metadata, keyed the same way the original graphics were named in
  // kidstown_cgi-main/graphics/citypark.
  var IMAGES = {
    park: { src: "park.gif", width: 90, height: 100 },
    girl: { src: "girl.gif", width: 90, height: 100 },
    book: { src: "book.gif", width: 55, height: 72 },
    compass: { src: "compass.gif", width: 60, height: 60 },
    bird: { src: "bird.gif", width: 84, height: 97 },
    directions: { src: "directions.gif", width: 100, height: 111 },
    directionLeft: { src: "directionl.gif", width: 100, height: 111 },
    directionRight: { src: "directionr.gif", width: 100, height: 111 },
    mountains: { src: "mountains.gif", width: 100, height: 90 },
    dome: { src: "dome.gif", width: 100, height: 90 }
  };

  // Helper to place an image at a specific spot in a page's content flow.
  function pic(key, align, alt) {
    return { image: key, align: align, alt: alt };
  }

  // Story pages, transcribed from kidstown_cgi-main/data/citypark/page1-18.
  // "content" is rendered top to bottom; strings become paragraphs (with
  // {{name}} replaced by the visitor's name) and picture entries become
  // floated images. "choices" are the original in-page links/branches.
  // "backToMap" marks the page that also offers the original
  // "Back to Kids Town" link (page17).
  var PAGES = {
    1: {
      content: [
        "Your big adventure starts out just like any other lazy summer day. The birds are chirping outside, and you can just tell from the smell of the air that this day is going to be really hot.",
        "Your friend calls out from the street, \"" + NAME_TOKEN + ", why don't you come outside and play? It looks like its going to be a great day!\" You decide that yes, you will go out and play today. You pull on your favorite blue shirt and head outside.",
        "As you step out onto the porch, you feel that something is not quite right. The birds are no longer chirping. The light seems too bright. All of a sudden, you can't see anything at all. You fall into a deep sleep. You wake up in a strange place."
      ],
      choices: [{ label: "You Wake Up", target: 2 }]
    },

    2: {
      content: [
        pic("park", "left", "The Park"),
        "Bright sunlight streams into your eyes, making it hard to see. Your eyes finally adjust and you see that you are no longer on your front porch. You look around and see that you seem to be in a very large park. There are big trees around the edge of the park, and lots of grass. There are other people in the park, but for some reason, they don't look right. The air feels much cooler than it did on your porch.",
        "You see a girl and her dog. Do you want to walk up to them?"
      ],
      choices: [
        { label: "Yes", target: 3 },
        { label: "No", target: 4 }
      ]
    },

    3: {
      content: [
        pic("girl", "right", "Girl and Dog"),
        "As you begin to get closer to the girl, you notice what is wrong with her. You can see right through her! She looks like any other girl, but she also kind of looks like ghosts do in the movies. You can even see through her dog! You finally say \"Hello, my name is " + NAME_TOKEN + ". What is your name?\"",
        "She doesn't even notice you. You reach out to touch her, and your hand goes right through her!",
        "You think to yourself, \"Well, these people aren't going to be much help.\"",
        pic("book", "right", "Old Book"),
        "You walk back to the place where you first woke up and you see a book. \"That wasn't there before,\" you think to yourself. You reach down and grab it.",
        "The book has a leather cover and looks very old. The writing on the cover is in a language you have never seen before. You open the book and see that the first page says, \"" + NAME_TOKEN + ", FIND THE COMPASS.\" The rest of the pages are strangely blank.",
        "So, you are supposed to find the compass. A compass is a thing that helps you find your way, and since you are very lost, finding your way sounds like a great idea. You look around and see a stand about 50 feet away that looks like it has something on it. You walk towards the stand."
      ],
      choices: [{ label: "Walk", target: 5 }]
    },

    4: {
      content: [
        pic("book", "right", "Old Book"),
        "You walk back to the place where you first woke up and you see a book. \"That wasn't there before,\" you think to yourself. You reach down and grab it.",
        "The book has a leather cover and looks very old. The writing on the cover is in a language you have never seen before. You open the book and see that the first page says, \"" + NAME_TOKEN + ", FIND THE COMPASS.\"",
        "So, you are supposed to find the compass. A compass is a thing that helps you find your way, and since you are very lost, finding your way sounds like a great idea. You look around and see a stand about 50 feet away that looks like it has something on it. You walk towards the stand."
      ],
      choices: [{ label: "Walk", target: 5 }]
    },

    5: {
      content: [
        pic("compass", "right", "Compass"),
        "As you approach the stand, you notice two things. First, you see that there is a compass on the stand. That is interesting. Second, you see a small reddish bird next to the compass. Unlike the people still with you here in the park, you can't see through the bird. It looks kind of like a parakeet.",
        "You get to the stand. As you reach for the compass, you feel the leather book in your hand getting warm. At that same moment the bird says, \"Hey " + NAME_TOKEN + ", you should probably look in the book.\"",
        pic("bird", "left", "bird"),
        "The bird startles you. As far as you know, only parrots talk, and this certainly doesn't look like a parrot.",
        pic("directions", "right", "Directions"),
        "You decide to do what it says. You look in the book. The first page still says, \"" + NAME_TOKEN + ", FIND THE COMPASS,\" but now, there is writing on the second page. It says, \"" + NAME_TOKEN + ", GO WEST AND FIND THE DOME.\"",
        "You take the compass and find that you are facing North. Using the directions of North, South, East and West from the picture, which way do you have to turn in order to be facing West?"
      ],
      choices: [
        { label: "Left", target: 6 },
        { label: "Right", target: 7 }
      ]
    },

    6: {
      content: [
        pic("directionLeft", "right", "Directions"),
        "You did it " + NAME_TOKEN + "! If you are facing North, and you take a little turn to your left, you will then be facing West.",
        "Let's continue. Way to go!"
      ],
      choices: [{ label: "Continue", target: 8 }]
    },

    7: {
      content: [
        pic("directionRight", "right", "Compass"),
        NAME_TOKEN + ", this is kind of a tricky question. Looking again at the picture that has N, S, E and W on it, you will see that if you turn to your right when you are facing North, you will then be facing East."
      ],
      choices: []
    },

    8: {
      content: [
        pic("mountains", "right", "Compass"),
        "You leave the park and start walking West on a paved street. After you have gone a little way you notice that way off in the distance, you can see snow capped mountains.",
        pic("bird", "left", "bird"),
        "You look over your shoulder and see that the bird is following you. It says, \"Hey, " + NAME_TOKEN + ", don't mind me. I'm just here to help you out if you get in any trouble.\""
      ],
      choices: [{ label: "Continue", target: 9 }]
    },

    9: {
      content: [
        pic("mountains", "right", "Mountains"),
        "The first street you pass is called Apple Street. The next street you pass is called Birch Street.",
        "Which street do you think would come next, Willow Street or Cherry Street?"
      ],
      choices: [
        { label: "Willow Street", target: 10 },
        { label: "Cherry Street", target: 11 }
      ]
    },

    10: {
      content: [
        pic("mountains", "right", "Mountains"),
        "If you were thinking that all of these streets had the names of trees, then Willow Street might come next. But Cherry is also the name of a tree. There must be another way to choose."
      ],
      choices: []
    },

    11: {
      content: [
        pic("mountains", "right", "Mountains"),
        NAME_TOKEN + ", you sure are good at figuring things out! You noticed that Apple Street started with the letter A, and Birch Street started with the letter B. So it would make sense to think that the next street would start with a C, and it does! Cherry Street is the next street.",
        "Now that you have that figured out, you continue down the street, looking for the dome."
      ],
      choices: [{ label: "Continue", target: 12 }]
    },

    12: {
      content: [
        pic("dome", "right", "Dome"),
        "After walking several blocks you finally see the glint of the dome up ahead of you.",
        pic("bird", "left", "bird"),
        "Out of nowhere, the bird says, \"Hey, " + NAME_TOKEN + ". I've got a little riddle for you.",
        "I happen to know that the address of the dome is 1369 Kids Town Lane. It is also on the right side of the street. I'll give you a clue as to how to get home if you can tell me what side of the street my house is on.",
        "All I'll tell you is that the address of my house is even, meaning that the last number of the address ends with an even number.",
        "What side of the street do you suppose my house is on?\""
      ],
      choices: [
        { label: "Left", target: 14 },
        { label: "Right", target: 13 }
      ]
    },

    13: {
      content: [
        pic("dome", "right", "Mountains"),
        "Wow " + NAME_TOKEN + ", that was a hard riddle. The dome has an odd address. Odd addresses end with 1, 3, 5, 7, or 9. The dome is on the right side of the street.",
        pic("bird", "left", "bird"),
        "That makes you think odd addresses are on one side of the street and even addresses are on the other side of the street. The bird's house has an even address (it ends with 2, 4, 6, or 8) so it is on the opposite side of the house as the dome. Therefore it is on the left side of the street."
      ],
      choices: []
    },

    14: {
      content: [
        pic("dome", "right", "Mountains"),
        "Nice work " + NAME_TOKEN + ". That riddle was especially hard. This is how you solved the puzzle:",
        "The dome has an odd address and is on the right side of the street. Odd addresses end with 1, 3, 5, 7, or 9.",
        pic("bird", "left", "bird"),
        "That makes you think odd addresses are on one side of the street and even addresses are on the other side of the street. And that is exactly the way it is. The bird's house has an even address (it ends with 2, 4, 6, 8 or 0) so it is on the opposite side of the house as the dome. Therefore it is on the left side of the street.",
        "Here is your clue."
      ],
      choices: [{ label: "Clue", target: 15 }]
    },

    15: {
      content: [
        pic("dome", "right", "Dome"),
        "The bird says to you, \"" + NAME_TOKEN + ", the answer has been in your hands the whole time.\" You realize that the book in your hands is getting warm again. You open it up. You see that the first two pages say the same thing, but now there is a third page.",
        pic("bird", "left", "Bird"),
        "The page says, \"" + NAME_TOKEN + ", this journey is over. There will be more to come, but now it is time to go home. Close your eyes, count backwards from 10 to 1 and you will be back to where you began.\"",
        "Which way do you decide to count?"
      ],
      choices: [
        { label: "1, 2, 3, 4, 5, 6, 7, 8, 9, 10", target: 16 },
        { label: "10, 9, 8, 7, 6, 5, 4, 3, 2, 1", target: 17 },
        { label: "2, 4, 6, 8, 10", target: 18 }
      ]
    },

    16: {
      content: [
        pic("dome", "right", "Mountains"),
        "You close your eyes and count from 1 to 10.",
        "1, 2, 3, 4, 5, 6, 7, 8, 9, 10",
        "You open your eyes and see that nothing has changed. You are still in the same spot by the dome!",
        "Then you realize that you were supposed to count backwards, starting at 10 and ending at 1.",
        "You decide to try again."
      ],
      choices: [{ label: "Try Again", target: 15 }]
    },

    17: {
      content: [
        "You close your eyes and count from 10 down to 1.",
        "10, 9, 8, 7, 6, 5, 4, 3, 2, 1",
        "You try to open your eyes, but you can't. Suddenly, the air is hot again, and you hear the birds chirping.",
        "You are finally able to open your eyes. When you do, you realize that you are once again on your front porch. You see your friend standing in the street.",
        "She says, \"" + NAME_TOKEN + ", come on! Let's go play!\"",
        "Well, she doesn't seem to have noticed that you were gone for a little while. You decide not to bring it up.",
        "It's time for another journey... let's go explore the rest of KidsTown!"
      ],
      choices: [],
      backToMap: true
    },

    18: {
      content: [
        pic("dome", "right", "Dome"),
        "You close your eyes and count from 2 to 10 by even numbers.",
        "You open your eyes and see that nothing has changed. You are still in the same spot by the dome!",
        "Then you realize that you were supposed to count backwards, starting at 10 and ending at 1. Instead, you counted by evens, from 2 to 10.",
        "You decide to try again."
      ],
      choices: [{ label: "Try Again", target: 15 }]
    }
  };

  // Navigation state for the current visit. "stack" holds the sequence of
  // story pages actually visited (last entry is the current page), so the
  // Back button can always return to the page the visitor really came from
  // - unlike the original CGI, which hardcoded some Back links (page5 and
  // page8) to the wrong branch and left page15 without a Back link at all.
  var state = {
    name: DEFAULT_NAME,
    stack: []
  };

  function byId(id) {
    return document.getElementById(id);
  }

  function clearContainer(container) {
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
  }

  function applyName(text, name) {
    return text.split(NAME_TOKEN).join(name);
  }

  function renderContent(container, content, name) {
    content.forEach(function (item) {
      if (typeof item === "string") {
        var p = document.createElement("p");
        p.textContent = applyName(item, name);
        container.appendChild(p);
        return;
      }

      var meta = IMAGES[item.image];
      var image = document.createElement("img");
      image.src = ASSET_PATH + meta.src;
      image.width = meta.width;
      image.height = meta.height;
      image.alt = item.alt || "";
      image.className = "citypark-img citypark-img-" + item.align;
      container.appendChild(image);
    });
  }

  function renderIntro() {
    state.stack = [];

    var container = byId("citypark-content");
    clearContainer(container);

    var heading = document.createElement("h1");
    heading.textContent = "KidsTown City Park - Your Big Journey";
    container.appendChild(heading);

    var intro = document.createElement("p");
    intro.className = "citypark-intro-text";
    intro.textContent =
      "Hello, and welcome to the KidsTown City Park. You are about to go " +
      "on a big journey through the park. To get started, click in the " +
      "box below and type in your first name. Then click the " +
      "\"Let's Go !!\" button.";
    container.appendChild(intro);

    var form = document.createElement("form");
    form.className = "citypark-name-form";

    var label = document.createElement("label");
    label.setAttribute("for", "citypark-name-input");
    label.textContent = "Your first name:";

    var input = document.createElement("input");
    input.type = "text";
    input.id = "citypark-name-input";
    input.name = "name";
    input.size = 10;
    input.maxLength = 40;
    input.autocomplete = "off";

    var submit = document.createElement("button");
    submit.type = "submit";
    submit.className = "citypark-choice-btn";
    submit.textContent = "Let's Go !!";

    form.appendChild(label);
    form.appendChild(input);
    form.appendChild(submit);

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var typed = input.value.trim();
      state.name = typed === "" ? DEFAULT_NAME : typed;
      state.stack = [1];
      renderPage(1);
    });

    container.appendChild(form);
    input.focus();
  }

  function renderPage(pageNumber) {
    var page = PAGES[pageNumber];
    var container = byId("citypark-content");
    clearContainer(container);

    var heading = document.createElement("h1");
    heading.textContent = state.name + "'s Big Journey";
    container.appendChild(heading);

    var story = document.createElement("div");
    story.className = "citypark-story";
    renderContent(story, page.content, state.name);
    container.appendChild(story);

    if (page.choices.length > 0) {
      var choiceRow = document.createElement("div");
      choiceRow.className = "citypark-choices";

      page.choices.forEach(function (choice) {
        var button = document.createElement("button");
        button.type = "button";
        button.className = "citypark-choice-btn";
        button.textContent = choice.label;
        button.addEventListener("click", function () {
          state.stack.push(choice.target);
          renderPage(choice.target);
        });
        choiceRow.appendChild(button);
      });

      container.appendChild(choiceRow);
    }

    var navRow = document.createElement("div");
    navRow.className = "citypark-nav";

    if (page.backToMap) {
      var mapLink = document.createElement("a");
      mapLink.href = "#/home";
      mapLink.className = "citypark-map-link";
      mapLink.textContent = "Back to Kids Town";
      navRow.appendChild(mapLink);
    }

    var backButton = document.createElement("button");
    backButton.type = "button";
    backButton.className = "citypark-back-btn";
    backButton.textContent = "Back";
    backButton.addEventListener("click", goBack);
    navRow.appendChild(backButton);

    container.appendChild(navRow);
  }

  function goBack() {
    if (state.stack.length <= 1) {
      renderIntro();
      return;
    }

    state.stack.pop();
    var previous = state.stack[state.stack.length - 1];
    renderPage(previous);
  }

  function start() {
    state = { name: DEFAULT_NAME, stack: [] };
    renderIntro();
  }

  window.CityPark = { start: start };
})();
