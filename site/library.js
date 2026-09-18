/*
 * KidsTown Library: the clickable U.S. map, seven regional maps, Alaska
 * and Hawaii, all 50 state pages plus Washington, D.C., and every
 * activity actually linked from a state page.
 *
 * A client-side conversion of kidstown_cgi-main/scripts/library, traced
 * against every Library route in kt.db (KEY 6000-6920):
 *   library.pl (KEY 6000) - entrance: clickable US map + Alaska/Hawaii
 *     links + the seven region links.
 *   NorthWest.pl / SouthWest.pl / NorthCentral.pl / SouthCentral.pl /
 *     SouthEast.pl / MidAtlantic.pl / NewEngland.pl (KEY 6010-6070) -
 *     the seven regional maps, each a clickable map + a redundant text
 *     link list of that region's states.
 *   statepage.pl (KEY 6100, state=N) - a single templated script that
 *     renders any of the 51 state/D.C. records from
 *     data/library/b_state_datafile.txt (fields read: MAP, NAME, FLAG,
 *     CAPITAL, FLOWER, ADMITTED, BIRD, ORDER, TREE, NICKNAME, SONG,
 *     ACTIVITY, LOCATION, RETURN). FLAG_IMG, BACKGROUND, TEXTCOLOR and
 *     LINE are also present in the data file but are never read by
 *     statepage.pl - they are dead fields in the original, left
 *     unconverted here too since nothing ever displayed them.
 *   srchpass.pl (KEY 6200, page_passed=<file>) - a generic "template
 *     passer" used only by the three word-search activities; it reads
 *     one of b_ak_wrdsrch(.pl|_ans.pl), b_az_wrdsrch(.pl|_ans.pl), or
 *     b_ne_wdsrch(.pl)/b_ne_wdsrchans.pl as a static HTML template.
 *   b_wi_tale.pl/witale.pl (KEY 6300/6400), b_or_tale.pl/ortale.pl
 *     (KEY 6500/6600), b_ct_tale.pl/ctale.pl (KEY 6700/6800) - three
 *     "Wacky Web Tale" mad-libs activities: a form collects a few
 *     words, then a second script substitutes them into a fixed story.
 *   b_ny_fillin_db.pl (KEY 6900) / b_dc_fillin_db.pl (KEY 6920) -
 *     two multiple-choice quiz forms, both graded by the same shared
 *     b_fillin_db.pl (KEY 6910) using data/library/b_fillin_datafile.txt
 *     (game=1 is New York, game=2 is Washington, D.C.).
 * Nothing here calls kt.cgi or any server-side script.
 *
 * Exactly eight of the 51 state records have an ACTIVITY value in the
 * original data file: Alaska, Arizona and Nebraska (word searches),
 * Connecticut, Oregon and Wisconsin (web tales), and New York and
 * Washington D.C. (fill-in quizzes). All other 43 states plus Hawaii
 * have no activity in the original, so their state page has no
 * "Click here to play a game!" link here either - inventing one for
 * them was explicitly out of scope.
 *
 * One fixed original bug: Washington D.C.'s fill-in quiz question 4
 * data file had SOL4 = "Capital - many of these", which never exactly
 * matched any of that question's three selectable options ("Capital",
 * "Capitol", "Capitalize"), so question 4 could never be marked correct
 * no matter what the visitor chose. The question, its three choices,
 * and its explanation paragraphs are all unchanged - only the solution
 * value was corrected to "Capital" so it matches the intended option.
 */
(function () {
  "use strict";

  var ASSET_PATH = "assets/images/library/";

  // -----------------------------------------------------------------------
  // State data (data/library/b_state_datafile.txt, all 51 records)
  // -----------------------------------------------------------------------

  function st(config) {
    return config;
  }

  var STATES = {
    1: st({ name: "Alabama", map: "b_al_map.gif", flag: "b_al_flag.gif", capital: "Montgomery", admitted: "Dec 14, 1819", order: "22nd", nickname: "Camellia State", flower: "Camellia", bird: "Yellow Hammer", tree: "Southern Pine", song: "Alabama", location: "Southeastern", region: "southeast" }),
    2: st({ name: "Alaska", map: "b_ak_map.gif", flag: "b_ak_flag.gif", capital: "Juneau", admitted: "Jan 3, 1959", order: "49th", nickname: "Land of the Midnight Sun", flower: "Forget-me-not", bird: "Willow Ptarmigan", tree: "Sitka Spruce", song: "Alaska's Flag", activity: { type: "wordsearch", slug: "ak" } }),
    3: st({ name: "Arizona", map: "b_az_map.gif", flag: "b_az_flag.gif", capital: "Phoenix", admitted: "Feb 14, 1912", order: "48th", nickname: "Grand Canyon State", flower: "Saguaro Cactus Blossom", bird: "Cactus Wren", tree: "Paloverde", song: "Arizona", location: "Southwestern", region: "southwest", activity: { type: "wordsearch", slug: "az" } }),
    4: st({ name: "Arkansas", map: "b_ar_map.gif", flag: "b_ar_flag.gif", capital: "Little Rock", admitted: "Jun 15, 1836", order: "25th", nickname: "Land of Opportunity", flower: "Apple Blossom", bird: "Mockingbird", tree: "Pine", song: "Arkansas", location: "South Central", region: "southcentral" }),
    5: st({ name: "California", map: "b_ca_map.gif", flag: "b_ca_flag.gif", capital: "Sacramento", admitted: "Sep 9, 1850", order: "31st", nickname: "Golden State", flower: "California Poppy", bird: "California Valley Quail", tree: "California Redwood", song: "I Love You, California", location: "Southwestern", region: "southwest" }),
    6: st({ name: "Colorado", map: "b_co_map.gif", flag: "b_co_flag.gif", capital: "Denver", admitted: "Aug 1, 1876", order: "38th", nickname: "Centennial State", flower: "Rocky Mountain Columbine", bird: "Lark Bunting", tree: "Colorado Blue Spruce", song: "Where the Columbines Grow", location: "Southwestern", region: "southwest" }),
    7: st({ name: "Connecticut", map: "b_ct_map.gif", flag: "b_ct_flag.gif", capital: "Hartford", admitted: "Jan 9, 1788", order: "5th", nickname: "Nutmeg State", flower: "Mountain Laurel", bird: "American Robin", tree: "White Oak", song: "Yankee Doodle", location: "New England", region: "newengland", activity: { type: "tale", slug: "ct" } }),
    8: st({ name: "Delaware", map: "b_de_map.gif", flag: "b_de_flag.gif", capital: "Dover", admitted: "Dec 7, 1787", order: "1st", nickname: "First State", flower: "Peach Blossom", bird: "Blue Hen Chicken", tree: "American Holly", song: "Our Delaware", location: "Middle Atlantic", region: "midatlantic" }),
    9: st({ name: "Florida", map: "b_fl_map.gif", flag: "b_fl_flag.gif", capital: "Tallahassee", admitted: "Mar 3, 1845", order: "27th", nickname: "Sunshine State", flower: "Orange Blossom", bird: "Mockingbird", tree: "Sabal Palmetto Palm", song: "Old Folks at Home", location: "Southeastern", region: "southeast" }),
    10: st({ name: "Georgia", map: "b_ga_map.gif", flag: "b_ga_flag.gif", capital: "Atlanta", admitted: "Jan 2, 1788", order: "4th", nickname: "Peach State", flower: "Cherokee Rose", bird: "Brown Thrasher", tree: "Live Oak", song: "Georgia on My Mind", location: "Southeastern", region: "southeast" }),
    11: st({ name: "Hawaii", map: "b_hi_map.gif", flag: "b_hi_flag.gif", capital: "Honolulu", admitted: "Aug 21, 1959", order: "50th", nickname: "The Aloha State", flower: "Yellow Hibiscus", bird: "Hawaiian Goose(Nene)", tree: "Kukui", song: "Hawai'i Pono'i" }),
    12: st({ name: "Idaho", map: "b_id_map.gif", flag: "b_id_flag.gif", capital: "Boise", admitted: "Jul 3, 1890", order: "43rd", nickname: "Gem State", flower: "Syringa", bird: "Mountain Bluebird", tree: "White Pine", song: "Here We Have Idaho", location: "Northwestern", region: "northwest" }),
    13: st({ name: "Illinois", map: "b_il_map.gif", flag: "b_il_flag.gif", capital: "Springfield", admitted: "Dec 3, 1818", order: "21st", nickname: "Prairie State", flower: "Native Violet", bird: "Cardinal", tree: "White Oak", song: "Illinois", location: "North Central", region: "northcentral" }),
    14: st({ name: "Indiana", map: "b_in_map.gif", flag: "b_in_flag.gif", capital: "Indianapolis", admitted: "Dec 11, 1816", order: "19th", nickname: "Hoosier State", flower: "Peony", bird: "Cardinal", tree: "Tulip Poplar", song: "On the Banks of the Wabash", location: "North Central", region: "northcentral" }),
    15: st({ name: "Iowa", map: "b_ia_map.gif", flag: "b_ia_flag.gif", capital: "Des Moines", admitted: "Dec 28, 1846", order: "29th", nickname: "Hawkeye State", flower: "Wild Rose", bird: "Eastern Goldfinch", tree: "Oak", song: "None", location: "North Central", region: "northcentral" }),
    16: st({ name: "Kansas", map: "b_ks_map.gif", flag: "b_ks_flag.gif", capital: "Topeka", admitted: "Jan 29, 1861", order: "34th", nickname: "Sunflower State", flower: "Native Sunflower", bird: "Western Meadowlark", tree: "Cottonwood", song: "Home on the Range", location: "North Central", region: "northcentral" }),
    17: st({ name: "Kentucky", map: "b_ky_map.gif", flag: "b_ky_flag.gif", capital: "Frankfort", admitted: "Jun 1, 1792", order: "15th", nickname: "Bluegrass State", flower: "Goldenrod", bird: "Cardinal", tree: "Kentucky Coffee Tree", song: "My Old Kentucky Home", location: "Southeastern", region: "southeast" }),
    18: st({ name: "Louisiana", map: "b_la_map.gif", flag: "b_la_flag.gif", capital: "Baton Rouge", admitted: "Apr 30, 1812", order: "18th", nickname: "Pelican State", flower: "Magnolia", bird: "Eastern Brown Pelican", tree: "Bald Cypress", song: "Give Me Louisiana", location: "South Central", region: "southcentral" }),
    19: st({ name: "Maine", map: "b_me_map.gif", flag: "b_me_flag.gif", capital: "Augusta", admitted: "Mar 15, 1820", order: "23rd", nickname: "Pine Tree State", flower: "White Pine Cone and Tassel", bird: "Chickadee", tree: "Eastern White Pine", song: "State of Maine Song", location: "New England", region: "newengland" }),
    20: st({ name: "Maryland", map: "b_md_map.gif", flag: "b_md_flag.gif", capital: "Annapolis", admitted: "Apr 28, 1788", order: "7th", nickname: "Old Line State", flower: "Black-eyed Susan", bird: "Baltimore Oriole", tree: "White Oak", song: "Maryland, My Maryland", location: "Middle Atlantic", region: "midatlantic" }),
    21: st({ name: "Massachusetts", map: "b_ma_map.gif", flag: "b_ma_flag.gif", capital: "Boston", admitted: "Feb 6, 1788", order: "6th", nickname: "Bay State", flower: "Mayflower", bird: "Chickadee", tree: "American Elm", song: "All Hail to Massachusetts", location: "New England", region: "newengland" }),
    22: st({ name: "Michigan", map: "b_mi_map.gif", flag: "b_mi_flag.gif", capital: "Lansing", admitted: "Jan 26, 1837", order: "26th", nickname: "Great Lakes State", flower: "Apple Blossom", bird: "Robin", tree: "White Pine", song: "Michigan, My Michigan", location: "North Central", region: "northcentral" }),
    23: st({ name: "Minnesota", map: "b_mn_map.gif", flag: "b_mn_flag.gif", capital: "St. Paul", admitted: "May 11, 1858", order: "32nd", nickname: "North Star State", flower: "Showy Lady's Slipper", bird: "Common Loon", tree: "Red Pine", song: "Hail! Minnesota", location: "North Central", region: "northcentral" }),
    24: st({ name: "Mississippi", map: "b_ms_map.gif", flag: "b_ms_flag.gif", capital: "Jackson", admitted: "Dec 10, 1817", order: "20th", nickname: "Magnolia State", flower: "Magnolia", bird: "Mockingbird", tree: "Magnolia", song: "Go, Mississippi!", location: "Southeastern", region: "southeast" }),
    25: st({ name: "Missouri", map: "b_mo_map.gif", flag: "b_mo_flag.gif", capital: "Jefferson City", admitted: "Aug 10, 1821", order: "24th", nickname: "Show Me State", flower: "Hawthorn", bird: "Bluebird", tree: "Dogwood", song: "Missouri Waltz", location: "North Central", region: "northcentral" }),
    26: st({ name: "Montana", map: "b_mt_map.gif", flag: "b_mt_flag.gif", capital: "Helena", admitted: "Nov 8, 1889", order: "41st", nickname: "Treasure State", flower: "Bitterroot", bird: "Western Meadowlark", tree: "Ponderosa Pine", song: "Montana", location: "Northwestern", region: "northwest" }),
    27: st({ name: "Nebraska", map: "b_ne_map.gif", flag: "b_ne_flag.gif", capital: "Lincoln", admitted: "Mar 1, 1867", order: "37th", nickname: "Cornhusker State", flower: "Goldenrod", bird: "Western Meadowlark", tree: "Cottonwood", song: "Beautiful Nebraska", location: "North Central", region: "northcentral", activity: { type: "wordsearch", slug: "ne" } }),
    28: st({ name: "Nevada", map: "b_nv_map.gif", flag: "b_nv_flag.gif", capital: "Carson City", admitted: "Oct 31, 1864", order: "36th", nickname: "Silver State", flower: "Sagebrush", bird: "Mountain Bluebird", tree: "Single-leaf Pinon", song: "Home Means Nevada", location: "Southwestern", region: "southwest" }),
    29: st({ name: "New Hampshire", map: "b_nh_map.gif", flag: "b_nh_flag.gif", capital: "Concord", admitted: "Jun 21, 1788", order: "9th", nickname: "Granite State", flower: "Purple Lilac", bird: "Purple Finch", tree: "Paper White Birch", song: "Old New Hampshire", location: "New England", region: "newengland" }),
    30: st({ name: "New Jersey", map: "b_nj_map.gif", flag: "b_nj_flag.gif", capital: "Trenton", admitted: "Dec 18, 1787", order: "3rd", nickname: "Garden State", flower: "Purple Violet", bird: "Eastern Goldfinch", tree: "Red Oak", song: "None", location: "Middle Atlantic", region: "midatlantic" }),
    31: st({ name: "New Mexico", map: "b_nm_map.gif", flag: "b_nm_flag.gif", capital: "Santa Fe", admitted: "Jan 6, 1912", order: "47th", nickname: "Land of Enchantment", flower: "Yucca Flower", bird: "Roadrunner", tree: "Pinon (nut pine)", song: "O, Fair New Mexico", location: "Southwestern", region: "southwest" }),
    32: st({ name: "New York", map: "b_ny_map.gif", flag: "b_ny_flag.gif", capital: "Albany", admitted: "Jul 26, 1788", order: "11th", nickname: "Empire State", flower: "Rose", bird: "Bluebird", tree: "Sugar Maple", song: "I Love New York", location: "Middle Atlantic", region: "midatlantic", activity: { type: "fillin", slug: "ny", game: 1 } }),
    33: st({ name: "North Carolina", map: "b_nc_map.gif", flag: "b_nc_flag.gif", capital: "Raleigh", admitted: "Nov 21, 1789", order: "12th", nickname: "Old North State", flower: "Dogwood", bird: "Cardinal", tree: "Long-leaf Pine", song: "The Old North State", location: "Southeastern", region: "southeast" }),
    34: st({ name: "North Dakota", map: "b_nd_map.gif", flag: "b_nd_flag.gif", capital: "Bismarck", admitted: "Nov 2, 1889", order: "39th", nickname: "Peace Garden State", flower: "Wild Prairie Rose", bird: "Western Meadowlark", tree: "American Elm", song: "North Dakota Hymn", location: "North Central", region: "northcentral" }),
    35: st({ name: "Ohio", map: "b_oh_map.gif", flag: "b_oh_flag.gif", capital: "Columbus", admitted: "Mar 1, 1803", order: "17th", nickname: "Buckeye State", flower: "Scarlet Carnation", bird: "Cardinal", tree: "Buckeye", song: "Beautiful Ohio", location: "North Central", region: "northcentral" }),
    36: st({ name: "Oklahoma", map: "b_ok_map.gif", flag: "b_ok_flag.gif", capital: "Oklahoma City", admitted: "Nov 16, 1907", order: "46th", nickname: "Sooner State", flower: "Mistletoe", bird: "Scissor-tailed Flycatcher", tree: "Redbud", song: "Oklahoma!", location: "South Central", region: "southcentral" }),
    37: st({ name: "Oregon", map: "b_or_map.gif", flag: "b_or_flag.gif", capital: "Salem", admitted: "Feb 14, 1859", order: "33rd", nickname: "Beaver State", flower: "Oregon Grape", bird: "Western Meadowlark", tree: "Douglas Fir", song: "Oregon, My Oregon", location: "Northwestern", region: "northwest", activity: { type: "tale", slug: "or" } }),
    38: st({ name: "Pennsylvania", map: "b_pa_map.gif", flag: "b_pa_flag.gif", capital: "Harrisburg", admitted: "Dec 12, 1787", order: "2nd", nickname: "Keystone State", flower: "Mountain Laurel", bird: "Ruffed Grouse", tree: "Hemlock", song: "Pennsylvania", location: "Middle Atlantic", region: "midatlantic" }),
    39: st({ name: "Rhode Island", map: "b_ri_map.gif", flag: "b_ri_flag.gif", capital: "Providence", admitted: "May 29, 1790", order: "13th", nickname: "Ocean State", flower: "Violet", bird: "Rhode Island Red", tree: "Red Maple", song: "Rhode Island", location: "New England", region: "newengland" }),
    40: st({ name: "South Carolina", map: "b_sc_map.gif", flag: "b_sc_flag.gif", capital: "Columbia", admitted: "May 23, 1788", order: "8th", nickname: "Palmetto State", flower: "Yellow Jessamine", bird: "Carolina Wren", tree: "Cabbage Palmetto", song: "South Carolina On My Mind", location: "Southeastern", region: "southeast" }),
    41: st({ name: "South Dakota", map: "b_sd_map.gif", flag: "b_sd_flag.gif", capital: "Pierre", admitted: "Nov 2, 1889", order: "40th", nickname: "Mount Rushmore State", flower: "Pasqueflower", bird: "Ring-necked Pheasant", tree: "Black Hills Spruce", song: "Hail, South Dakota", location: "North Central", region: "northcentral" }),
    42: st({ name: "Tennessee", map: "b_tn_map.gif", flag: "b_tn_flag.gif", capital: "Nashville", admitted: "Jun 1, 1796", order: "16th", nickname: "Volunteer State", flower: "Iris", bird: "Mockingbird", tree: "Tulip Poplar", song: "The Tennessee Waltz", location: "Southeastern", region: "southeast" }),
    43: st({ name: "Texas", map: "b_tx_map.gif", flag: "b_tx_flag.gif", capital: "Austin", admitted: "Dec 29, 1845", order: "28th", nickname: "Lone Star State", flower: "Bluebonnet", bird: "Mockingbird", tree: "Pecan", song: "Texas, Our Texas", location: "South Central", region: "southcentral" }),
    44: st({ name: "Utah", map: "b_ut_map.gif", flag: "b_ut_flag.gif", capital: "Salt Lake City", admitted: "Jan 4, 1896", order: "45th", nickname: "Beehive State", flower: "Sego Lily", bird: "Seagull", tree: "Blue Spruce", song: "Utah, We Love Thee", location: "Southwestern", region: "southwest" }),
    45: st({ name: "Vermont", map: "b_vt_map.gif", flag: "b_vt_flag.gif", capital: "Montpelier", admitted: "Mar 4, 1791", order: "14th", nickname: "Green Mountain State", flower: "Red Clover", bird: "Hermit Thrush", tree: "Sugar Maple", song: "Hail, Vermont", location: "New England", region: "newengland" }),
    46: st({ name: "Virginia", map: "b_va_map.gif", flag: "b_va_flag.gif", capital: "Richmond", admitted: "Jun 25, 1788", order: "10th", nickname: "Old Dominion", flower: "Dogwood", bird: "Cardinal", tree: "Dogwood", song: "Carry Me Back To Old Virginia", location: "Southeastern", region: "southeast" }),
    47: st({ name: "Washington", map: "b_wa_map.gif", flag: "b_wa_flag.gif", capital: "Olympia", admitted: "Nov 11, 1889", order: "42nd", nickname: "Evergreen State", flower: "Western Rhododendron", bird: "Willow Goldfinch", tree: "Western Hemlock", song: "Washington, My Home", location: "Northwestern", region: "northwest" }),
    48: st({ name: "West Virginia", map: "b_wv_map.gif", flag: "b_wv_flag.gif", capital: "Charleston", admitted: "Jun 20, 1863", order: "35th", nickname: "Mountain State", flower: "Big Rhododendron", bird: "Cardinal", tree: "Sugar Maple", song: "This Is My West Virginia", location: "Southeastern", region: "southeast" }),
    49: st({ name: "Wisconsin", map: "b_wi_map.gif", flag: "b_wi_flag.gif", capital: "Madison", admitted: "May 29, 1848", order: "30th", nickname: "Badger State", flower: "Wood Violet", bird: "Robin", tree: "Sugar Maple", song: "On, Wisconsin!", location: "North Central", region: "northcentral", activity: { type: "tale", slug: "wi" } }),
    50: st({ name: "Wyoming", map: "b_wy_map.gif", flag: "b_wy_flag.gif", capital: "Cheyenne", admitted: "Jul 10, 1890", order: "44th", nickname: "Equality State", flower: "Indian Paintbrush", bird: "Meadowlark", tree: "Cottonwood", song: "Wyoming", location: "Northwestern", region: "northwest" }),
    51: st({ name: "Washington, D.C.", map: "b_dc_map.gif", flag: "b_usa_flag.gif", capital: "None", admitted: "None", order: "None", nickname: "None", flower: "None", bird: "Bald Eagle", tree: "None", song: "Star Spangled Banner", location: "Middle Atlantic", region: "midatlantic", isCapital: true, activity: { type: "fillin", slug: "dc", game: 2 } })
  };

  // -----------------------------------------------------------------------
  // Region data (scripts/library/<Region>.pl) - image map coords copied
  // verbatim from the originals, with HREFs converted to state numbers.
  // -----------------------------------------------------------------------

  var REGIONS = {
    northwest: {
      title: "Northwestern states",
      mapImg: "NorthWest.GIF",
      width: 369,
      height: 250,
      areas: [
        { shape: "poly", coords: "75,3,159,26,160,38,150,71,150,94,135,88,90,87,73,83,68,79,62,83,55,77,54,63,49,64,48,57,39,56,39,14,44,7,75,26,76,26", state: 47 },
        { shape: "poly", coords: "37,62,55,66,55,78,66,84,70,79,81,86,137,88,151,95,150,108,144,121,136,121,137,144,126,183,6,151,6,129,32,85,31,77,37,73,34,67,34,67", state: 37 },
        { shape: "poly", coords: "162,24,175,29,172,52,177,60,173,64,178,66,191,92,185,98,189,103,187,105,186,114,196,112,200,132,204,134,204,142,235,141,235,163,224,201,142,185,127,183,126,171,140,136,137,131,137,121,144,120,150,108,150,104,152,103,152,98,150,96,150,69,160,39,160,39,160,39", state: 12 },
        { shape: "poly", coords: "239,132,286,142,320,143,350,148,343,237,315,237,226,225,225,195,235,162,235,139,237,139,237,139", state: 50 },
        { shape: "poly", coords: "178,30,235,42,358,56,351,147,319,142,282,142,238,130,237,139,230,141,204,141,204,134,199,130,199,122,197,120,196,110,190,110,186,113,186,104,189,103,188,95,191,93,191,89,182,77,181,68,177,63,173,63,177,60,176,58,171,51,173,46,172,35", state: 26 }
      ],
      links: [12, 26, 37, 47, 50]
    },
    southwest: {
      title: "Southwestern states",
      mapImg: "SouthWest.GIF",
      width: 350,
      height: 250,
      areas: [
        { shape: "poly", coords: "48,4,56,4,77,12,86,12,103,20,103,29,99,46,94,59,93,78,153,167,157,176,157,176,150,179,149,184,144,190,145,202,135,202,109,200,101,197,101,187,97,176,90,174,90,167,82,167,77,158,73,157,58,147,63,143,62,138,58,137,61,133,56,129,56,123,50,115,51,106,56,103,49,99,49,82,44,77,44,70,40,61,40,34,38,33,38,28,49,12,48,7,46,6", state: 5 },
        { shape: "poly", coords: "104,21,117,21,142,30,156,30,184,38,181,40,181,48,179,52,179,68,171,97,171,112,170,122,168,123,168,131,165,131,166,137,163,138,164,143,162,143,159,141,153,141,154,158,151,160,95,78,94,59,101,39,101,39", state: 28 },
        { shape: "poly", coords: "184,38,189,38,211,42,223,44,222,62,244,64,250,66,248,72,245,95,240,123,240,140,233,138,202,131,183,131,173,128,168,127,171,113,172,96,180,68,180,50", state: 44 },
        { shape: "poly", coords: "168,128,185,131,202,132,240,140,240,144,237,154,231,182,231,200,222,241,212,240,198,238,183,233,141,208,140,203,145,202,144,190,149,184,184,149,180,156,175,153,172,153,167,152,164,152,160,154,158,154,140,160,141,164,144,165,137,165,132,168,131", state: 3 },
        { shape: "poly", coords: "250,66,258,66,277,70,296,72,324,72,343,76,343,106,341,133,339,147,294,147,277,144,265,141,255,139,239,139,239,123,243,107,247,84,249,70", state: 6 },
        { shape: "poly", coords: "240,139,256,140,295,147,325,148,325,180,318,239,311,238,292,238,275,235,264,233,264,239,259,239,247,238,244,235,239,235,237,243,230,243,229,241,222,240,231,200,232,180,233,178", state: 31 }
      ],
      links: [3, 5, 6, 28, 31, 44]
    },
    northcentral: {
      title: "North Central states",
      mapImg: "NorthCentral.GIF",
      width: 366,
      height: 280,
      areas: [
        { shape: "poly", coords: "20,12,59,12,107,17,111,21,111,35,116,41,117,75,43,73,14,70,15,41,18,20", state: 34 },
        { shape: "poly", coords: "15,71,117,75,117,86,120,86,120,122,117,121,117,140,110,140,101,135,97,137,90,133,8,130,9,120,9,120,10,119", state: 41 },
        { shape: "poly", coords: "8,130,91,134,97,139,102,136,112,141,118,141,127,165,127,180,136,194,35,190,35,171,5,166", state: 27 },
        { shape: "poly", coords: "36,191,136,194,142,197,138,202,146,206,148,253,86,253,30,248,33,227", state: 16 },
        { shape: "poly", coords: "109,17,136,17,137,12,140,9,143,13,143,20,157,25,165,19,170,26,180,27,186,33,191,33,195,29,205,34,177,60,177,71,171,78,171,82,172,84,173,98,175,103,186,106,196,119,194,121,119,122,120,86,117,83,117,65,115,40,111,33", state: 23 },
        { shape: "poly", coords: "118,123,194,121,200,138,208,144,210,149,210,157,207,160,203,160,200,165,202,171,200,173,199,177,198,179,167,181,127,181,127,162,117,141,118,135,121,132,117,129", state: 15 },
        { shape: "poly", coords: "131,182,191,180,193,189,200,200,207,205,211,213,217,213,218,217,212,221,213,228,222,233,228,234,231,241,231,246,236,249,236,254,227,269,220,269,222,264,219,259,148,265,147,231,146,207,140,202,142,197,129,185", state: 25 },
        { shape: "poly", coords: "178,60,183,55,200,54,211,67,222,67,237,72,245,85,241,95,246,91,251,78,254,81,250,88,246,106,245,141,204,141,200,137,194,117,186,105,176,104,172,97,172,83,171,81,170,77,178,71", state: 49 },
        { shape: "poly", coords: "206,141,244,141,249,153,252,189,254,191,254,205,257,206,257,216,251,223,250,227,247,230,249,233,250,239,245,239,244,242,246,245,246,249,239,244,235,247,231,246,230,239,226,234,221,233,213,227,212,221,218,215,218,212,210,212,202,200,197,197,192,189,194,180,198,180,201,172,202,161,209,161,210,157,211,150", state: 13 },
        { shape: "poly", coords: "203,58,207,57,211,54,218,54,228,44,228,39,230,38,237,38,240,40,231,50,231,53,235,52,238,48,240,53,245,56,257,56,262,51,273,51,277,49,279,51,278,56,284,56,286,55,293,58,292,64,292,73,301,73,304,78,306,92,302,95,302,100,298,100,296,103,299,109,304,108,303,104,313,100,323,115,324,124,322,127,318,127,313,145,307,146,304,149,266,149,267,139,269,127,260,113,259,103,266,85,253,77,245,83,242,81,241,77,233,71,222,67,210,66,210,66,210,66", state: 22 },
        { shape: "poly", coords: "250,154,259,154,261,151,293,150,294,158,296,207,292,211,289,208,282,226,276,225,272,232,267,226,265,230,260,230,257,228,254,231,247,230,257,215,256,206,255,190,252,189,251,167,250,165", state: 14 },
        { shape: "poly", coords: "293,150,306,150,310,146,314,150,332,149,349,139,355,143,355,156,358,159,358,175,356,178,355,185,344,192,343,196,339,200,339,205,337,208,331,209,327,206,323,208,315,209,312,206,306,206,304,201,297,202,295,194,295,157,292,155", state: 35 }
      ],
      links: [13, 14, 15, 16, 22, 23, 25, 27, 34, 35, 41, 49]
    },
    southcentral: {
      title: "South Central states",
      mapImg: "SouthCentral.GIF",
      width: 322,
      height: 250,
      areas: [
        { shape: "poly", coords: "77,12,216,17,216,31,220,45,220,70,218,70,218,86,203,81,200,79,197,81,190,81,190,83,183,83,182,79,176,79,174,81,159,81,155,76,141,77,140,75,136,74,137,69,128,69,126,66,126,25,76,21", state: 36 },
        { shape: "poly", coords: "216,28,290,23,293,25,292,28,289,33,297,32,300,36,292,45,292,54,282,69,281,81,278,81,278,97,227,97,227,88,218,88,218,71,220,70,221,45,219,41,219,41", state: 4 },
        { shape: "poly", coords: "228,98,276,98,281,107,281,117,275,123,274,138,287,139,290,137,304,137,304,141,301,145,306,151,306,153,297,150,292,155,306,160,311,156,311,161,306,164,316,171,314,174,308,173,302,165,299,164,296,167,299,169,299,175,276,174,276,166,261,164,260,169,234,167,234,147,237,145,237,136,232,136,232,125,228,120", state: 18 },
        { shape: "poly", coords: "78,22,126,26,126,68,144,77,174,82,209,82,218,88,228,89,228,120,231,127,234,137,237,136,237,146,233,146,234,159,229,162,230,167,225,167,221,174,213,167,207,170,211,171,212,177,205,185,202,187,194,187,195,191,192,193,188,187,187,183,187,183,190,186,193,184,197,178,192,176,193,174,195,179,200,176,201,173,201,174,206,171,209,168,201,164,202,162,204,164,206,164,211,160,215,165,223,168,220,170,223,169,228,164,232,167,236,167,244,148,243,141,237,136,236,133,230,132,224,129,221,127,209,121,208,121,201,107,181,105,173,102,173,97,170,97,164,85,164,79,157,76,159,76,165,71,164,62,178,60,178,45,164,40,164,37,147,8,115,7,109,61,116,68,116", state: 43 }
      ],
      links: [4, 18, 36, 43]
    },
    southeast: {
      title: "Southeastern states",
      mapImg: "SouthEast.GIF",
      width: 248,
      height: 300,
      areas: [
        { shape: "poly", coords: "31,92,35,77,39,78,42,82,45,81,44,77,41,73,49,74,49,62,63,62,67,60,70,64,73,58,79,61,86,43,94,42,94,36,100,36,102,41,124,41,128,45,128,52,132,56,135,56,137,64,120,81,73,85,62,86,57,88,49,89,40,92", state: 17 },
        { shape: "poly", coords: "128,46,134,40,136,34,142,26,148,21,149,12,151,11,154,15,169,11,172,17,179,18,180,14,188,14,188,23,184,25,179,32,176,36,171,39,166,50,165,57,153,63,138,63,134,56,131,55,128,50", state: 48 },
        { shape: "poly", coords: "125,76,138,63,153,64,164,56,166,49,173,37,177,36,179,29,185,24,188,22,188,12,193,14,195,20,197,14,202,17,200,21,212,25,211,28,217,28,225,36,224,38,220,38,218,36,218,42,225,44,224,55,224,60,228,58,234,58,234,62,228,63,197,71,183,73,162,74,147,78,131,80,122,81", state: 46 },
        { shape: "poly", coords: "21,122,22,111,27,106,27,103,27,99,31,93,95,83,125,81,149,78,145,87,137,89,130,94,126,99,117,103,115,108,109,113,96,115,64,115,59,117,41,120,26,122", state: 42 },
        { shape: "poly", coords: "110,114,120,101,127,98,130,92,143,87,150,78,166,74,195,72,220,65,233,64,236,71,239,79,237,84,223,84,225,88,228,87,230,92,236,94,235,97,231,101,220,105,208,120,202,120,190,112,188,107,164,108,160,103,143,105,130,111,118,113", state: 33 },
        { shape: "poly", coords: "5,199,4,184,8,183,9,143,20,123,53,119,52,150,50,186,54,187,53,200,57,202,55,210,39,210,36,215,29,202,32,201,32,196,17,199", state: 24 },
        { shape: "poly", coords: "55,202,53,199,54,187,51,186,52,153,55,118,64,116,91,116,99,141,100,150,110,168,105,173,105,176,109,180,109,190,98,192,77,194,66,194,66,197,70,201,70,205,68,208,65,208,64,205,61,205,61,201,58,201", state: 1 },
        { shape: "poly", coords: "92,116,128,112,129,119,136,121,137,126,146,134,152,135,155,143,162,145,166,154,169,162,164,165,171,168,185,164,189,162,186,158,187,158,192,138,194,119,196,111,196,109,192,109,180,105,176,106,172,109,168,100,151,99,141,92,121", state: 10 },
        { shape: "poly", coords: "128,112,143,105,162,103,167,108,189,109,193,114,203,121,197,130,195,141,189,141,187,148,180,149,173,157,176,159,173,161,168,161,165,151,160,144,154,142,153,137,137,126,136,121,131,120,128,117", state: 40 },
        { shape: "poly", coords: "66,198,67,195,109,191,111,197,122,196,127,195,158,192,159,187,166,189,172,196,173,205,181,214,182,218,190,232,189,238,196,242,203,255,205,277,202,286,197,291,189,293,188,286,179,278,173,275,172,271,167,267,167,262,161,262,153,250,158,246,158,241,154,239,153,231,150,223,145,218,137,216,132,207,118,207,117,216,106,216,98,207,92,207,89,203,85,204,78,207,69,207,70,201", state: 9 }
      ],
      links: [1, 9, 10, 17, 24, 33, 40, 42, 46, 48]
    },
    midatlantic: {
      title: "Middle Atlantic states",
      mapImg: "MidAtlantic.GIF",
      width: 250,
      height: 250,
      areas: [
        { shape: "poly", coords: "25,116,38,103,37,92,34,90,36,80,81,79,86,71,86,48,108,21,123,15,142,15,148,30,148,41,152,44,151,50,159,54,158,101,164,113,163,132,179,124,189,123,191,129,180,138,174,139,165,144,159,139,157,133,150,127,133,125,130,115,121,108,116,110,61,123,32,123,31,127,24,126", state: 32 },
        { shape: "poly", coords: "9,134,14,124,25,121,25,128,32,128,31,124,59,123,121,109,132,117,131,124,138,123,137,129,132,137,134,141,131,144,131,151,138,151,137,173,57,190,38,191,33,194,27,194,25,197,18,197,15,192,14,163,11,159,11,140,7,138", state: 38 },
        { shape: "poly", coords: "131,151,132,145,134,140,132,137,140,124,145,128,151,128,157,132,155,138,154,143,161,150,162,174,158,178,161,182,159,184,155,185,152,198,141,188,141,182,137,180,138,150", state: 30 },
        { shape: "poly", coords: "150,210,141,214,134,213,130,211,130,193,124,176,136,176,136,195,149,206", state: 8 },
        { shape: "circle", coords: "106,206,5", state: 51 },
        { shape: "poly", coords: "46,192,105,180,126,180,131,197,131,212,141,215,144,211,149,212,152,214,152,219,143,223,145,238,142,241,136,241,134,238,134,232,131,230,131,220,123,220,119,216,111,216,112,204,107,199,102,201,96,208,92,205,89,197,85,197,83,204,71,200,69,194,64,195,58,196,57,202,45,200", state: 20 }
      ],
      links: [8, 20, 30, 32, 38, 51]
    },
    newengland: {
      title: "New England states",
      mapImg: "NewEngland.GIF",
      width: 300,
      height: 333,
      areas: [
        { shape: "poly", coords: "80,119,96,85,96,37,106,17,116,21,132,14,143,13,156,25,165,49,165,71,177,74,183,89,191,93,195,89,199,93,203,104,180,131,173,133,167,141,159,136,156,142,150,142,151,155,136,166,131,160,125,174,120,176,119,206,110,208,98,194,97,173,88,160,81,134", state: 19 },
        { shape: "poly", coords: "35,243,34,207,25,202,15,150,41,143,69,130,70,147,76,154,60,169,59,235", state: 45 },
        { shape: "poly", coords: "59,169,75,154,69,145,69,126,78,120,84,149,92,169,98,175,99,195,116,211,116,218,98,227,82,228,73,233,58,232", state: 29 },
        { shape: "poly", coords: "34,270,36,243,82,229,100,228,117,216,117,224,122,228,114,237,113,244,128,247,136,256,143,256,153,246,155,252,153,256,160,266,156,272,150,267,146,272,143,267,135,266,132,271,128,266,123,270,116,270,102,257,95,259,79,267,50,268,45,271", state: 21 },
        { shape: "poly", coords: "45,309,37,273,51,267,84,267,80,276,79,297,61,308", state: 7 },
        { shape: "poly", coords: "80,294,80,274,85,262,92,262,98,271,99,293,93,295", state: 39 }
      ],
      links: [7, 19, 21, 29, 39, 45]
    }
  };

  var REGION_LABELS = { northwest: "Northwest", southwest: "Southwest", northcentral: "North Central", southcentral: "South Central", southeast: "Southeast", midatlantic: "Middle Atlantic", newengland: "New England" };

  var STATE_ABBREVS = { 1: "AL", 3: "AZ", 4: "AR", 5: "CA", 6: "CO", 7: "CT", 8: "DE", 9: "FL", 10: "GA", 12: "ID", 13: "IL", 14: "IN", 15: "IA", 16: "KS", 17: "KY", 18: "LA", 19: "ME", 20: "MD", 21: "MA", 22: "MI", 23: "MN", 24: "MS", 25: "MO", 26: "MT", 27: "NE", 28: "NV", 29: "NH", 30: "NJ", 31: "NM", 32: "NY", 33: "NC", 34: "ND", 35: "OH", 36: "OK", 37: "OR", 38: "PA", 39: "RI", 40: "SC", 41: "SD", 42: "TN", 43: "TX", 44: "UT", 45: "VT", 46: "VA", 47: "WA", 48: "WV", 49: "WI", 50: "WY", 51: "DC" };

  function stateLinkLabel(num) {
    return STATES[num].name + " (" + STATE_ABBREVS[num] + ")";
  }

  // The entrance's own map areas: Alaska/Hawaii go straight to a state
  // page, the rest go to a region page (library.pl's AREA list).
  var USA_MAP_AREAS = [
    { shape: "rect", coords: "4,2,98,87", target: { kind: "state", value: 2 } },
    { shape: "rect", coords: "3,124,92,196", target: { kind: "state", value: 11 } },
    { shape: "poly", coords: "139,14,171,23,202,30,235,34,247,35,241,105,229,104,195,100,195,91,192,90,179,88,162,84,154,83,143,80,137,79,110,71,111,61,114,59,123,37,123,18,125,16,130,20,133,21,133,22,136,22,136,14,136,14", target: { kind: "region", value: "northwest" } },
    { shape: "poly", coords: "111,72,138,80,176,88,195,91,195,100,221,104,244,105,254,108,252,141,244,141,244,158,241,186,214,183,214,186,203,185,202,189,182,187,155,171,154,168,136,167,136,158,116,143,106,98,106,84,106,84", target: { kind: "region", value: "southwest" } },
    { shape: "poly", coords: "245,142,260,143,305,144,305,149,337,147,338,149,337,151,340,151,341,153,338,156,337,161,334,166,332,172,332,183,333,185,330,190,330,197,343,196,343,198,342,200,346,205,348,211,332,212,330,208,325,207,325,210,310,208,299,217,287,224,284,242,275,241,271,238,258,215,258,212,254,210,255,207,243,207,239,213,237,213,228,205,228,200,215,186,215,184,241,187,245,158,245,158", target: { kind: "region", value: "southcentral" } },
    { shape: "poly", coords: "247,35,300,38,300,34,303,36,303,39,309,41,312,39,318,43,321,44,332,45,364,52,370,58,384,82,384,86,382,87,379,93,379,96,380,97,388,97,397,91,399,109,398,114,393,117,391,120,391,122,388,125,386,123,376,123,375,121,372,121,372,123,370,125,368,124,368,127,365,132,363,131,361,133,359,132,358,134,351,134,351,138,349,138,348,139,349,140,349,142,348,142,345,140,344,144,340,151,337,151,338,149,338,147,305,149,305,144,252,142,255,107,241,106", target: { kind: "region", value: "northcentral" } },
    { shape: "poly", coords: "345,203,343,199,343,196,330,196,330,190,333,186,333,183,333,172,336,163,338,161,339,156,341,153,341,152,341,151,344,144,345,140,349,142,349,140,348,138,351,138,351,134,362,134,363,131,365,132,369,124,370,125,372,123,373,121,375,121,376,123,385,124,386,123,388,125,391,123,393,119,394,115,398,113,398,109,400,109,400,111,408,109,408,112,412,112,413,110,419,112,421,111,427,117,430,117,433,120,434,131,437,130,440,141,435,145,434,148,437,148,437,150,432,151,425,159,421,162,417,173,413,174,407,181,408,185,405,186,406,192,424,227,424,234,421,239,417,239,405,226,404,226,400,221,402,218,400,215,399,209,392,204,390,201,384,200,383,204,377,204,375,200,375,200", target: { kind: "region", value: "southeast" } },
    { shape: "poly", coords: "397,91,406,85,405,76,419,75,421,72,420,66,424,63,426,59,431,56,438,56,440,67,442,68,442,82,444,89,443,90,452,90,450,92,442,95,443,107,438,124,435,124,434,118,428,117,421,111,420,113,415,110,413,110,412,112,409,112,408,109,400,110,400,110", target: { kind: "region", value: "midatlantic" } },
    { shape: "poly", coords: "438,56,450,52,452,48,455,44,455,32,457,29,464,27,468,35,469,40,472,41,474,44,476,43,477,47,462,61,460,60,459,71,460,72,458,75,464,78,466,76,467,80,459,81,457,78,454,80,455,85,445,89,444,85,443,82,442,67,440,66,440,66", target: { kind: "region", value: "newengland" } }
  ];

  // -----------------------------------------------------------------------
  // Rendering plumbing
  // -----------------------------------------------------------------------

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

  function renderFooter(container, opts) {
    opts = opts || {};
    var nav = document.createElement("div");
    nav.className = "library-nav";

    if (opts.regionSlug) {
      nav.appendChild(
        makeButton("Return to " + REGION_LABELS[opts.regionSlug] + " states map", "library-back-btn", function () {
          renderRegion(opts.regionSlug);
        })
      );
    }
    if (!opts.hideEntranceBtn) {
      nav.appendChild(
        makeButton("Return to USA map", "library-back-btn", renderEntrance)
      );
    }
    nav.appendChild(
      makeLink("Return to the KidsTown map", "library-map-link", "#/home")
    );
    container.appendChild(nav);
  }

  // areas: array of {shape, coords, state} OR {shape, coords, target:{kind,value}}
  // onState(stateNum) / onRegion(slug) are called depending on which kind matched.
  function buildImageMap(mapName, areas, onState, onRegion) {
    var map = document.createElement("map");
    map.name = mapName;
    areas.forEach(function (area) {
      var el = document.createElement("area");
      el.shape = area.shape;
      el.coords = area.coords;
      el.href = "#";

      if (area.target) {
        if (area.target.kind === "state") {
          el.alt = STATES[area.target.value].name;
          el.addEventListener("click", function (event) {
            event.preventDefault();
            onState(area.target.value);
          });
        } else {
          el.alt = REGION_LABELS[area.target.value];
          el.addEventListener("click", function (event) {
            event.preventDefault();
            onRegion(area.target.value);
          });
        }
      } else {
        el.alt = STATES[area.state] ? STATES[area.state].name : "";
        el.addEventListener("click", function (event) {
          event.preventDefault();
          onState(area.state);
        });
      }
      map.appendChild(el);
    });
    return map;
  }

  // -----------------------------------------------------------------------
  // Entrance (library.pl, KEY 6000)
  // -----------------------------------------------------------------------

  function renderEntrance() {
    var container = byId("library-content");
    clear(container);

    container.appendChild(heading("Welcome to the"));
    container.appendChild(heading("KidsTown Library!", "h1"));
    container.appendChild(
      paragraph("Where do you want to visit? Click on that section of the United States map, Alaska or Hawaii.", "library-guess")
    );

    var mapWrap = document.createElement("div");
    mapWrap.className = "library-map-wrap";
    var img = image("NewUSA.GIF", "Map of the United States", "library-map-img");
    img.width = 500;
    img.height = 248;
    img.useMap = "#NewUSA";
    mapWrap.appendChild(img);
    mapWrap.appendChild(
      buildImageMap("NewUSA", USA_MAP_AREAS, renderStatePage, renderRegion)
    );
    container.appendChild(mapWrap);

    var linkTable = document.createElement("div");
    linkTable.className = "library-link-columns";

    var col1 = document.createElement("div");
    col1.appendChild(makeButton("Alaska", "library-text-link", function () { renderStatePage(2); }));
    col1.appendChild(makeButton("Hawaii", "library-text-link", function () { renderStatePage(11); }));
    col1.appendChild(makeButton("Northwest", "library-text-link", function () { renderRegion("northwest"); }));

    var col2 = document.createElement("div");
    col2.appendChild(makeButton("Southwest", "library-text-link", function () { renderRegion("southwest"); }));
    col2.appendChild(makeButton("North Central", "library-text-link", function () { renderRegion("northcentral"); }));
    col2.appendChild(makeButton("South Central", "library-text-link", function () { renderRegion("southcentral"); }));

    var col3 = document.createElement("div");
    col3.appendChild(makeButton("Southeast", "library-text-link", function () { renderRegion("southeast"); }));
    col3.appendChild(makeButton("Middle Atlantic", "library-text-link", function () { renderRegion("midatlantic"); }));
    col3.appendChild(makeButton("New England", "library-text-link", function () { renderRegion("newengland"); }));

    linkTable.appendChild(col1);
    linkTable.appendChild(col2);
    linkTable.appendChild(col3);
    container.appendChild(linkTable);

    var nav = document.createElement("div");
    nav.className = "library-nav";
    nav.appendChild(makeLink("Return to the KidsTown map", "library-map-link", "#/home"));
    container.appendChild(nav);
  }

  // -----------------------------------------------------------------------
  // Regional maps (NorthWest.pl etc, KEY 6010-6070)
  // -----------------------------------------------------------------------

  function renderRegion(slug) {
    var region = REGIONS[slug];
    var container = byId("library-content");
    clear(container);

    container.appendChild(heading("Welcome to the " + region.title + "!"));
    container.appendChild(
      paragraph("To learn more about our states, click on each one and see what happens!")
    );

    var layout = document.createElement("div");
    layout.className = "library-region-layout";

    var mapWrap = document.createElement("div");
    mapWrap.className = "library-map-wrap";
    var img = image(region.mapImg, region.title, "library-map-img");
    img.width = region.width;
    img.height = region.height;
    img.useMap = "#" + slug;
    mapWrap.appendChild(img);
    mapWrap.appendChild(
      buildImageMap(slug, region.areas, renderStatePage, renderRegion)
    );
    layout.appendChild(mapWrap);

    var linkList = document.createElement("div");
    linkList.className = "library-region-links";
    region.links.forEach(function (num) {
      linkList.appendChild(
        makeButton(stateLinkLabel(num), "library-text-link", function () {
          renderStatePage(num);
        })
      );
    });
    layout.appendChild(linkList);

    container.appendChild(layout);
    renderFooter(container, {});
  }

  // -----------------------------------------------------------------------
  // State information page (statepage.pl, KEY 6100)
  // -----------------------------------------------------------------------

  function fact(iconImg, iconAlt, label, value) {
    var row = document.createElement("div");
    row.className = "library-fact";
    row.appendChild(image(iconImg, iconAlt, "library-fact-icon"));
    var text = document.createElement("span");
    var b = document.createElement("b");
    b.textContent = label + ": ";
    text.appendChild(b);
    text.appendChild(document.createTextNode(value));
    row.appendChild(text);
    return row;
  }

  function renderStatePage(num) {
    var data = STATES[num];
    var container = byId("library-content");
    clear(container);

    var header = document.createElement("div");
    header.className = "library-state-header";
    header.appendChild(image(data.map, "US Map", "library-state-map"));
    var nameEl = document.createElement("div");
    nameEl.className = "library-state-name";
    nameEl.textContent = data.name.toUpperCase();
    header.appendChild(nameEl);
    header.appendChild(image(data.flag, "US Flag", "library-state-flag"));
    container.appendChild(header);

    if (data.isCapital) {
      container.appendChild(heading("Here are some interesting facts about", "h2"));
      container.appendChild(heading("the Capital of the United States:", "h2"));
    } else {
      container.appendChild(heading("Here are some interesting facts about " + data.name, "h2"));
    }

    var facts = document.createElement("div");
    facts.className = "library-facts-grid";
    facts.appendChild(fact("building-i.gif", "Building", "Capital", data.capital));
    facts.appendChild(fact("flower-i.gif", "Flower", "Flower", data.flower));
    facts.appendChild(fact("date-i.gif", "Paper", "Induction Date", data.admitted));
    facts.appendChild(fact("bird-i.gif", "Bird", "Bird", data.bird));
    facts.appendChild(fact("order-i.gif", "Numbers", "Order of Induction", data.order));
    facts.appendChild(fact("tree-i.gif", "Tree", "Tree", data.tree));
    facts.appendChild(fact("redball-i.gif", "Red Ball", "Nickname", data.nickname));
    var songRow = document.createElement("div");
    songRow.className = "library-fact";
    songRow.appendChild(image("music-i.gif", "Music Notes", "library-fact-icon"));
    var songText = document.createElement("span");
    var songB = document.createElement("b");
    songB.textContent = "Song: ";
    songText.appendChild(songB);
    var songI = document.createElement("i");
    songI.textContent = data.song;
    songText.appendChild(songI);
    songRow.appendChild(songText);
    facts.appendChild(songRow);
    container.appendChild(facts);

    if (data.activity) {
      var activityWrap = document.createElement("div");
      activityWrap.className = "library-activity-link-wrap";
      var activityBtn = makeButton("", "library-activity-btn", function () {
        renderActivity(data.activity, num);
      });
      activityBtn.appendChild(image("school-i.gif", "Children", "library-activity-icon"));
      activityBtn.appendChild(document.createTextNode("Click here to play a game!"));
      activityWrap.appendChild(activityBtn);
      container.appendChild(activityWrap);
    }

    renderFooter(container, { regionSlug: data.region, hideEntranceBtn: false });
  }

  // -----------------------------------------------------------------------
  // Activities
  // -----------------------------------------------------------------------

  function renderActivity(activity, stateNum) {
    if (activity.type === "wordsearch") {
      renderWordSearch(activity.slug, stateNum);
    } else if (activity.type === "tale") {
      renderTaleForm(activity.slug, stateNum);
    } else if (activity.type === "fillin") {
      renderFillinForm(activity.slug, stateNum);
    }
  }

  function activityBackNav(container, stateNum) {
    var nav = document.createElement("div");
    nav.className = "library-nav";
    nav.appendChild(
      makeButton("Back to " + STATES[stateNum].name, "library-back-btn", function () {
        renderStatePage(stateNum);
      })
    );
    nav.appendChild(makeLink("Return to the KidsTown map", "library-map-link", "#/home"));
    container.appendChild(nav);
  }

  // --- Word searches (b_ak_wrdsrch.pl, b_az_wrdsrch.pl, b_ne_wdsrch.pl) ---

  var WORDSEARCH = {
    ak: {
      title: "North to Alaska, to prospect for a few words.",
      intro: "The boldface words from the sentences at the bottom of the page can be found in the puzzle. The words can appear horizontally, vertically or diagonally in the puzzle. It may be easier to play this if you print a copy of the puzzle. Use the Print option provided by your web browser.",
      puzzleImg: "ws_ak.gif",
      answerImg: "ws_ak_ans.gif",
      sentences: [
        "The capital city of JUNEAU was founded on the Gastineau Channel by gold miners in 1880.",
        "The three major rivers of Alaska are the YUKON, the TANANA, and the KUSKOKWIM.",
        "The name Alaska is derived from two native words: the ALEUT word alaxsxaq, meaning \"the object toward which the action of the sea is directed,\" and the ESKIMO word which has the same meaning, ALASKA.",
        "MT. MCKINLEY, also known as DENALI, is the highest summit in North America. It reaches 20,230 ft above sea level.",
        "Alaska is geologically active, with both VOLCANIC activity and earthquakes commonplace.",
        "A full third of the state lies above the ARCTIC circle and is known as the NORTH SLOPE.",
        "On 8 August 1728, ST. LAWRENCE ISLAND, which lies off the northwestern coast, was discovered by a Dane, VITUS BERING, in the employ of the Russian Navy.",
        "During WWII, the U.S. government stationed 152,000 troops in Alaska, and Alaska had the dubious honor of actually being invaded. The JAPANESE Imperial Navy made amphibious landings and occupied the islands of ATTU and KISKA in the ALEUTIAN chain.",
        "ANCHORAGE was originally founded as a rail construction camp, but today it is the largest Alaskan city. For comparison, it has roughly the same population as Colorado Springs, Colorado or the capital of Minnesota, St. Paul.",
        "With the exceptions of POTATOES, CABBAGEs, and CARROTs, Alaska imports most of its agricultural needs. Its main wealth is in mineral resources, including rich deposits of GOLD, COPPER, COAL, OIL, and natural gas. Alaska also has a profitable timber trade and FISHING industry, exporting vast quantities of lumber, SALMON, CRAB, and HERRING."
      ]
    },
    az: {
      title: "Westward, your quest leads you. Wrangle what words you can!",
      intro: "The boldface words from the sentences at the bottom of the page can be found in the puzzle. The words can appear horizontally, vertically or diagonally in the puzzle. It may be easier to play this if you print a copy of the puzzle. Use the Print option provided by your web browser.",
      puzzleImg: "ws_az.gif",
      answerImg: "ws_az_ans.gif",
      sentences: [
        "In search of the legendary CITIES OF CIBOLA, in 1540 Francisco Vasquez de CORONADO ventures northward from MEXICO into the territory we today call Arizona. One of his scouting parties discovers one of the seven natural wonders, the GRAND CANYON.",
        "In 1821 Arizona passes from SPANISH to Mexican rule. There is beaver trapping along the SANTA FE TRAIL, and among the trappers are KIT CARSON and JEDEDIAH SMITH.",
        "Through the Treaty of GUADALUPE HIDALGO and the GADSDEN PURCHASE, Arizona becomes a U.S. territory.",
        "In 1881 on October 26th, Wyatt Earp, his 2 brothers, and Doc Holliday gun down 3 of the Clanton gang in the GUNFIGHT at the O.K. CORRAL.",
        "A little over a hundred years ago, the fighting between the Native American Indians and the U.S. government ceases with the surrender of the APACHE Indians lead by GERONIMO. Today the NAVAJO are the predominant Native Americans in the state, with a population around a hundred thousand and land totaling almost nine million acres. The HOPI and 12 other tribes reside in Arizona, making it the state with the highest total population and percentage of Native Americans.",
        "The last of the FORTY-EIGHT contiguous states admitted into the UNION, on February 14th, 1912, ARIZONA has its statehood. Today, in area it is the 6th largest state and holds the record for second HOTtest with a temp of 127 degrees registered in Parker, AZ., in 1905.",
        "Arizona's major cities include MESA, PHOENIX, TEMPE, and TUCSON.",
        "Along with its warm climate, the beautiful and varied landscape has made Arizona a popular vacation state. Arizona boasts a range of terrain from lush pine FORESTs to CACTUS-punctuated DESERTs and from gradually changing plateaus and PLAINS to the mesas, cliffs, and arches of the GRAND CANYON.",
        "Like many other mountain states, Arizona is rich in mineral deposits. Arizona mines GOLD, ZINC, URANIUM, and copper. In fact, Arizona mines so much COPPPER that it accounts for more than the 49 other states combined.",
        "Arizona has several professional sports teams, including the Suns and Coyotes. It is also the winter home of many of the Major League Baseball teams from colder cities."
      ]
    },
    ne: {
      title: "Nebraska Word Search",
      intro: "It may be easier to play this if you print a copy of the puzzle. Use the Print option provided by your web browser. Search for the words that are CAPITALIZED and BOLD in the sentences below.",
      puzzleImg: "b_ne_wdsrch.gif",
      answerImg: "b_ne_wdsrchans.gif",
      sentences: [
        "In 1854 the Kansas-Nebraska ACT organized the TERRITORY of Nebraska.",
        "Nebraska is a state that experiences the migration of SANDHILL CRANES each year.",
        "The LEWIS and CLARK expedition traded fur on the MISSOURI River in 1804 between Nebraska and IOWA.",
        "John G. NEIHARDT is a famous POET from Nebraska. He wrote Black Elk Speaks.",
        "The state capital of Nebraska is LINCOLN. This is where the state legislature meets. It was created in 1937. This legislature is called the UNICAMERAL and is the only nonpartisan single-body legislature in the nation.",
        "The state bird is the Western MEADOWLARK.",
        "Several Indian TRIBES resided in the Nebraskan Territory, such as: COMANCHE, SIOUX, OMAHA, Ponca, Otoe (also called Ute), Oglala, Cheyenne, and Pawnee.",
        "CORN is a major crop in Nebraska. Another name for corn is MAIZE.",
        "The Platte Valley was a westward trail in the 1840s for travelers heading for the OREGON, Mormon, and California trails.",
        "WILLA CATHER, a famous AUTHOR, wrote many stories about Nebraskan lifestyles, such as O Pioneers! and My Antonia.",
        "The Nebraska Territory was part of the Louisiana Purchase from FRANCE in 1803.",
        "Wyoming borders Nebraska to the WEST; South DAKOTA is to the north; and COLORADO and Kansas are to the south.",
        "Nebraska was derived from an Indian word meaning \"flat water.\" This was in reference to the Platte RIVER, which runs through Nebraska.",
        "Nebraska is known as the Cornhusker state. This nickname is often shortened to just HUSKERs.",
        "In 1869, the Union Pacific Railroad made it easy to settle the territory. Abbreviations for \"railroad\" are TRAIN and RR."
      ]
    }
  };

  function renderWordSearch(slug, stateNum, showAnswer) {
    var data = WORDSEARCH[slug];
    var container = byId("library-content");
    clear(container);

    container.appendChild(heading(showAnswer ? "Let's see how well you did." : data.title));
    if (!showAnswer) {
      container.appendChild(paragraph(data.intro));
    } else {
      container.appendChild(paragraph("The words to be found are circled in the solution below."));
    }

    container.appendChild(
      image(showAnswer ? data.answerImg : data.puzzleImg, showAnswer ? "Puzzle Solution" : "Puzzle", "library-wordsearch-img")
    );

    if (!showAnswer) {
      var list = document.createElement("ol");
      list.className = "library-wordsearch-list";
      data.sentences.forEach(function (sentence) {
        var li = document.createElement("li");
        li.textContent = sentence;
        list.appendChild(li);
      });
      container.appendChild(list);
    }

    var toggleWrap = document.createElement("div");
    toggleWrap.className = "library-choices";
    toggleWrap.appendChild(
      makeButton(showAnswer ? "Return to Puzzle" : "Puzzle Solution", "library-choice-btn", function () {
        renderWordSearch(slug, stateNum, !showAnswer);
      })
    );
    container.appendChild(toggleWrap);

    activityBackNav(container, stateNum);
  }

  // --- Wacky Web Tales (b_wi_tale.pl/witale.pl, b_or_tale.pl/ortale.pl, b_ct_tale.pl/ctale.pl) ---

  var TALE_FORMS = {
    wi: {
      mapImg: "b_wi_map.gif",
      title: "Wisconsin's Web Tale",
      fields: [
        { name: "favorite", label: "What is one of your least favorite foods", options: ["peas", "beets", "cucumbers"] },
        { name: "native", label: "Which Native Wisconsin tribe would you like to include in your Tale?", options: ["Winnebago", "Dakota", "Menominee"] }
      ],
      hasNameField: true
    },
    or: {
      mapImg: "b_or_map.gif",
      title: "Oregon's Wacky Web Tale",
      fields: [
        { name: "recycle", label: "Many ____ participate in Oregon's recycling program.", options: ["adults", "children", "dogs"] },
        { name: "forest", label: "Oregon has many ____ forests.", options: ["new", "aged", "rainbow"] },
        { name: "trees", label: "Oregon has many ____ natural geographical features.", options: ["cute", "large", "speedy"] }
      ]
    },
    ct: {
      mapImg: "b_ct_map.gif",
      title: "Connecticut's Wacky Web Tale",
      fields: [
        { name: "tribes", label: "____ Indian Tribes are native to Connecticut.", options: ["Many", "Several", "No"] },
        { name: "animals", label: "Many ____ animals live in Connecticut.", options: ["small", "giant", "brown"] },
        { name: "pollution", label: "Connecticut like many other states has a ____ with pollution.", options: ["problem", "celebration", "solution"] }
      ]
    }
  };

  function renderTaleForm(slug, stateNum) {
    var data = TALE_FORMS[slug];
    var container = byId("library-content");
    clear(container);

    var header = document.createElement("div");
    header.className = "library-tale-header";
    header.appendChild(image(data.mapImg, STATES[stateNum].name, "library-tale-map"));
    header.appendChild(heading(STATES[stateNum].name, "h1"));
    container.appendChild(header);

    container.appendChild(
      paragraph(
        "Welcome to " + data.title + ". Web Tales allow you to enter words or select from among options. Once you have made your selections, click the \"Present Tale!\" button at the bottom of the page to see the Web Tale. Regardless of the choices you make, the sentences in the Tale are sure to be enjoyable."
      )
    );

    var form = document.createElement("form");
    form.className = "library-tale-form";

    var nameInput = null;
    if (data.hasNameField) {
      var nameBlock = document.createElement("div");
      nameBlock.className = "library-tale-field";
      nameBlock.appendChild(paragraph("Please type in your first name:", "library-tale-label"));
      nameInput = document.createElement("input");
      nameInput.type = "text";
      nameInput.id = "library-tale-" + slug + "-name";
      nameInput.name = "library-tale-" + slug + "-name";
      nameInput.maxLength = 30;
      nameBlock.appendChild(nameInput);
      form.appendChild(nameBlock);
    }

    var selects = {};
    data.fields.forEach(function (field) {
      var block = document.createElement("div");
      block.className = "library-tale-field";
      block.appendChild(paragraph(field.label, "library-tale-label"));
      var select = document.createElement("select");
      select.id = "library-tale-" + slug + "-" + field.name;
      select.name = "library-tale-" + slug + "-" + field.name;
      field.options.forEach(function (opt) {
        var option = document.createElement("option");
        option.value = opt;
        option.textContent = opt;
        select.appendChild(option);
      });
      selects[field.name] = select;
      block.appendChild(select);
      form.appendChild(block);
    });

    var submit = document.createElement("button");
    submit.type = "submit";
    submit.className = "library-choice-btn";
    submit.textContent = "Present Tale!";
    form.appendChild(submit);

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var values = {};
      if (nameInput) {
        values.name = nameInput.value.trim() || "you";
      }
      Object.keys(selects).forEach(function (key) {
        values[key] = selects[key].value;
      });
      renderTaleResult(slug, stateNum, values);
    });

    container.appendChild(form);
    activityBackNav(container, stateNum);
  }

  function taleParagraphs(slug, values) {
    if (slug === "wi") {
      return [
        "When " + values.name + " and other children visit Wisconsin, they can learn all about the glaciers that once covered most of the state. Because of the glaciers, most of Wisconsin is flat and has very fertile soil. Many crops like " + values.favorite + ", corn, and cranberries are grown on these lands today. But Wisconsin is most famous for its dairy farming. Wisconsin produces more milk and dairy products than any other state.",
        "The very first people to live in Wisconsin were the Native Indians. Tribes like the " + values.native + ", Fox, Sauk, and Kickapoo settled in Wisconsin after the Ice Age. Some Native Americans built large burial mounds shaped like animals. When Europeans first came to Wisconsin, they were friends with the Native people. They traded furs and other goods with them. Through wars and diseases many Native people have died. Today, most Native Americans live on reservations.",
        "Many famous individuals were born in Wisconsin. One name that " + values.name + " might be familiar with is Oshkosh. Oshkosh was a famous Menominee Indian leader who successfully kept his tribal lands. There is a city named after him, Oshkosh. Are you still unfamiliar with his name? Well, have you heard of Oshkosh clothes for kids? " + values.name + " might have read some books, or seen a television show about another famous Wisconsinite, Laura Ingalls Wilder, who was born in Pepin, Wisconsin. She wrote the Little House on the Prairie books, which later became a television series."
      ];
    }
    if (slug === "or") {
      return [
        "Oregon is bordered on three sides by Washington, Idaho, Nevada and California. The very " + values.trees + " Pacific Ocean borders Oregon on the west side of the state. The Columbia River is 7 miles wide where it empties into the Pacific Ocean. It is so " + values.trees + ", in fact, that " + values.trees + " oceangoing ships can travel up the river for 200 miles. The " + values.trees + " Crater Lake is the deepest lake in the United States. It's located in an extinct volcano, Mount Mazama.",
        "In 1971 Oregon became the first state to require that beverage cans and bottles be returnable. Now all of Oregon's " + values.recycle + " participate in the recycling program.",
        "In a process called clear-cutting, many of Oregon's " + values.forest + " forests have disappeared. Many " + values.forest + " trees were between 200 and 1,200 years old. Many animals and birds are endangered by the removal of these trees. Oregon is now requiring smarter ways to remove trees. In the future Oregon hopes to have many " + values.forest + " forests again."
      ];
    }
    // ct
    return [
      values.tribes + " Native Indian tribes such as the Niantic, Podunk, Qunnipiac, and Pequot are native to the area of Connecticut. As in most regions of our country, Native Americans were killed to provide land and resources for the European settlers. " + values.tribes + " Indians were killed by the diseases they caught from the Europeans. Today, the remaining tribes live on reservations established by the European settlers and American government.",
      "Connecticut is so " + values.animals + " that it could fit within Alaska more than 117 times. Even though Connecticut is a " + values.animals + " state compared to other states, it has a large population. With so many people living in such a " + values.animals + " area most large animals such as bears and panthers have been pushed out of the state. Many " + values.animals + " animals still live in Connecticut, like rabbits, minks, and squirrels.",
      "In the 1800s Connecticut had a " + values.pollution + ". There was a shortage of fertile land and an abundance of water. So, Connecticut became a very industrialized state with lots of textile mills and factories. All of these industries dumped many pollutants into the waters of Connecticut. This caused a new " + values.pollution + " of water pollution. Pollution from chemicals, sewage and spills has caused many fish and other creatures to die. To fix the " + values.pollution + ", Connecticut has written many laws concerning what can be put into its rivers. There are many things that you can do to help solve the " + values.pollution + " of water pollution. Turning the water off while brushing your teeth saves precious water. You can also save water by taking quick showers instead of bathing. With everyone working together, we can save one of our most precious resources, water!"
    ];
  }

  function renderTaleResult(slug, stateNum, values) {
    var data = TALE_FORMS[slug];
    var container = byId("library-content");
    clear(container);

    var header = document.createElement("div");
    header.className = "library-tale-header";
    header.appendChild(image(data.mapImg, STATES[stateNum].name, "library-tale-map"));
    header.appendChild(heading(STATES[stateNum].name, "h1"));
    container.appendChild(header);

    container.appendChild(
      paragraph("The following are brief paragraphs that will tell you a little more about the choices you made.")
    );

    taleParagraphs(slug, values).forEach(function (text) {
      container.appendChild(paragraph(text));
      container.appendChild(document.createElement("hr"));
    });

    var again = document.createElement("div");
    again.className = "library-choices";
    again.appendChild(
      makeButton("Back To Web Tale", "library-choice-btn", function () {
        renderTaleForm(slug, stateNum);
      })
    );
    container.appendChild(again);

    activityBackNav(container, stateNum);
  }

  // --- Fill-in quizzes (b_ny_fillin_db.pl, b_dc_fillin_db.pl, graded by b_fillin_db.pl) ---

  var FILLIN_FORMS = {
    ny: {
      title: "New York City",
      mapImg: "b_ny_map.gif",
      questions: [
        { label: "What is the tallest skyscraper in New York?", options: ["Sears Tower", "Leaning Tower of Pisa", "Empire State Building", "World Trade Center Buildings"] },
        { label: "What is the name of the famous sports center in New York?", options: ["Madison Square Garden", "Sun Devil Stadium", "Coors Field", "Riverside Stadium"] },
        { label: "In 1524 New York was discovered by?", options: ["Alonso Alvarez de Pineda", "Giovanni da Verrazano", "Maros de Niza", "Juan de Gaeten"] },
        { label: "The Dutch bought New Amsterdam (Manhattan) from what Native American tribe?", options: ["Pequot", "Apache", "Sioux", "Manhattan"] },
        { label: "How many Americans can trace their roots to someone who passed through Ellis Island?", options: ["One out of every 2", "75", "About 20 million", "Billions!!!"] }
      ]
    },
    dc: {
      title: "Washington D.C. Section",
      mapImg: "b_usa_flag.gif",
      questions: [
        { label: "What do the initials D.C. stand for?", options: ["Donkeys and Cows", "District of Columbia", "Donuts and Coffee"] },
        { label: "What famous woman founded The Red Cross?", options: ["Clara Barton", "Susan B. Anthony", "Julia Ward Howe"] },
        { label: "What famous U.S. President never lived in the White House?", options: ["George Washington", "Theodore Roosevelt", "Pierre L' Enfant"] },
        { label: "Which term below is used for Washington D.C.?", options: ["Capital", "Capitol", "Capitalize"] },
        { label: "How long on average does a $1 bill last?", options: ["23 years", "5 years", "18 months"] }
      ]
    }
  };

  // Solution data transcribed from data/library/b_fillin_datafile.txt.
  // DC's original SOL4 value, "Capital - many of these", never exactly
  // matched any of question 4's three options; corrected to "Capital"
  // below (see file header) - the question, choices, and explanation
  // paragraphs are untouched.
  var FILLIN_SOLUTIONS = {
    ny: {
      sols: ["World Trade Center Buildings", "Madison Square Garden", "Giovanni da Verrazano", "Manhattan", "One out of every 2"],
      paragraphs: [
        "The World Trade Center Buildings are the tallest at 110 stories. The Empire State Building is only 102 stories. So what is the tallest skyscraper in the world? When completed, the Petronas Towers in Kuala Lumpur, Malaysia, will be the tallest at 1,483 feet.",
        "Madison Square Garden is the most famous of New York City's sports centers. The New York Rangers ice hockey team plays there along with the New York Knicks basketball team.",
        "Giovanni da Verrazano was looking for a route to the Orient when he stumbled upon the Atlantic Coast and New York.",
        "Manhattan was the name given to the Native Americans who lived in the area called Manhattan today. The Dutch bought New Amsterdam (Manhattan) for only $24. Actually, the Native Americans who sold Manhattan weren't from that area; they were imposters.",
        "One out of every 2 Americans can trace their roots through Ellis Island. Many people see the Statue of Liberty as the welcoming place for immigrants. But immigrants actually were taken to Ellis Island to be processed into America."
      ],
      items: [
        ["The Sears Tower is in Chicago.", "The Leaning Tower of Pisa is in Italy.", "Empire State Building is in New York, but it's too short"],
        ["Coors Field is in Denver, Colorado.", "Sun Devil Stadium is in Arizona.", "Dodgers Stadium is in California."],
        ["Alonso Alvarez de Pineda discovered the Texas coastline.", "Marcos de Niza discovered Arizona.", "Juan de Gaeten discovered Hawaii."],
        ["Pequot were from the Connecticut area.", "Apache were from the Southwestern United States.", "Sioux were native to the Oregon region."],
        ["Billions of people live on the planet Earth. And the population is still growing!!!", "About 75 different languages are spoken in New York.", "About 20 million people visit New York each year."]
      ]
    },
    dc: {
      sols: ["District of Columbia", "Clara Barton", "George Washington", "Capital", "18 months"],
      paragraphs: [
        "D.C. stands for the District of Columbia. Washington D.C. is actually not a state, and it has only a delegate who can speak at committee meetings of Congress. The people who live in the District of Columbia were only allowed to vote in presidential elections since 1964.",
        "Clara Barton was a nurse during the Civil War. She tended to the wounded soldiers in the capital. After the war she founded the Red Cross.",
        "George Washington never lived in the \"President's House\". But he laid the cornerstone for the Capitol Building in 1793.",
        "Capital is the term used for Washington D.C. because it is a \"seat of government\" for a state or a nation. Washington D.C. is the capital of the United States of America.",
        "18 months is the average lifespan of a $1 bill. Did you know that American money is not made from trees? The paper is actually made from cloth containing a mixture of 75% cotton and 25% linen."
      ],
      items: [
        ["Every day people in Washington D.C. eat Donuts and drink Coffee.", "In the 1800s, Donkeys and Cows may have been seen in the streets of our capital."],
        ["Julia Ward Howe wrote \"The Battle Hymn of the Republic\" during the Civil War while she stayed at the Willard Hotel.", "Susan Brownell Anthony was a suffragist, which means that she spoke out for a woman's right to vote."],
        ["Pierre L'Enfant was the original designer of the Federal City (later to be called Washington D.C.).", "Theodore Roosevelt actually did live in the \"President's House\" but he later renamed it the \"White House\"."],
        ["Capitol refers to the building in which lawmakers meet. The capitol building in Washington D.C. is where both houses of Congress meet to make laws. There is a capitol in your home state too.", "Capitalize means to write a word with an initial capital letter. We always capitalize the name Washington."],
        ["5 years is the average time before a $10 bill has to be recycled. Did you know that coins are not made in Washington D.C.? They are only made by the Bureaus of Mint in Denver and Philadelphia.", "23 years is the life expectancy for a $100 bill. There are also $500, $1000, $5,000, and $10,000 bills."]
      ]
    }
  };

  function renderFillinForm(slug, stateNum) {
    var data = FILLIN_FORMS[slug];
    var container = byId("library-content");
    clear(container);

    var header = document.createElement("div");
    header.className = "library-tale-header";
    header.appendChild(image(data.mapImg, data.title, "library-tale-map"));
    header.appendChild(heading(data.title, "h1"));
    container.appendChild(header);

    container.appendChild(
      paragraph("The following questions relate to " + (slug === "ny" ? "both the city and state of New York" : "our nation's capital, Washington D.C.") + ". When you are done selecting your answers, click on the \"Learn More!\" button at the bottom of the page.")
    );

    var form = document.createElement("form");
    form.className = "library-tale-form";
    var selects = [];
    data.questions.forEach(function (q, i) {
      var block = document.createElement("div");
      block.className = "library-tale-field";
      block.appendChild(paragraph(q.label, "library-tale-label"));
      var select = document.createElement("select");
      select.id = "library-fillin-" + slug + "-topic" + (i + 1);
      select.name = "library-fillin-" + slug + "-topic" + (i + 1);
      select.size = Math.min(q.options.length, 4);
      q.options.forEach(function (opt) {
        var option = document.createElement("option");
        option.value = opt;
        option.textContent = opt;
        select.appendChild(option);
      });
      selects.push(select);
      block.appendChild(select);
      form.appendChild(block);
    });

    var submit = document.createElement("button");
    submit.type = "submit";
    submit.className = "library-choice-btn";
    submit.textContent = "Learn More!";
    form.appendChild(submit);

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var answers = selects.map(function (select) {
        return select.value;
      });
      renderFillinResult(slug, stateNum, answers);
    });

    container.appendChild(form);
    activityBackNav(container, stateNum);
  }

  function renderFillinResult(slug, stateNum, answers) {
    var solutionData = FILLIN_SOLUTIONS[slug];
    var container = byId("library-content");
    clear(container);

    container.appendChild(heading("Here are the answers to the selections you made."));
    container.appendChild(
      paragraph("The answers are in bold type. Included with the answers are more information about the topic and information about the other choices.")
    );

    answers.forEach(function (answer, i) {
      var correct = answer === solutionData.sols[i];
      if (correct) {
        container.appendChild(paragraph("You're right!", "library-fillin-correct"));
      } else {
        container.appendChild(paragraph("Your answer was: " + answer, "library-fillin-wrong"));
        container.appendChild(paragraph("The correct answer is:", "library-fillin-wrong"));
      }
      container.appendChild(paragraph(solutionData.paragraphs[i]));
      var ul = document.createElement("ul");
      solutionData.items[i].forEach(function (item) {
        var li = document.createElement("li");
        li.textContent = item;
        ul.appendChild(li);
      });
      container.appendChild(ul);
      container.appendChild(document.createElement("hr"));
    });

    var again = document.createElement("div");
    again.className = "library-choices";
    again.appendChild(
      makeButton("Take the Quiz Again", "library-choice-btn", function () {
        renderFillinForm(slug, stateNum);
      })
    );
    container.appendChild(again);

    activityBackNav(container, stateNum);
  }

  // -----------------------------------------------------------------------

  function start() {
    renderEntrance();
  }

  window.Library = { start: start };
})();
