// Casey's Chicago Death Tour — Stop Data
// Ordered chronologically for the long-scroll narrative experience.
// The walking tour map shows all pins and uses GPS proximity — no enforced order.

const TOUR_STOPS = [

  // ─── 1. INTRO ────────────────────────────────────────────────────────────────
  {
    number: 1,
    title: "Welcome",
    location: "Chicago, IL",
    lat: 41.88295, lng: -87.63215,
    year: "Let's begin",
    theme: "intro",
    deaths: null, deathsLabel: null,
    reform: null, reformLabel: null,
    tagline: "A city built on tragedy — and better for it.",
    image: null,
    sources: [
      { label: "Chicago History Museum", url: "https://www.chicagohistory.org" }
    ],
    sections: [
      {
        type: "narrative",
        heading: "What Is This?",
        body: "Welcome to the Chicago Death Tour. Over the next mile or so, we're going to walk through the Loop and I'm going to tell you about some of the worst things that have ever happened here. Fires. Floods. Crashes. Massacres. A blimp. Sewage. The usual.\n\nThis is not a haunted house. Nobody is going to jump out at you. But some of this is genuinely dark, and a few of these stories involve a lot of people dying in very bad ways. Fair warning."
      },
      {
        type: "narrative",
        heading: "Why, Though?",
        body: "Because Chicago has this habit of turning its worst moments into its best legislation. The deadliest fire leads to the strictest building codes. The worst maritime disaster leads to federal safety reform. The most packed, most unsafe theater in the country burns to the ground and within a year, fire safety codes look completely different — worldwide.\n\nBy the end of this tour, I hope you'll see a pattern. Death built this city. Progress followed."
      },
      {
        type: "narrative",
        heading: "The Chicago Flag",
        body: "Before we start, look up at almost any city building and you'll probably spot a Chicago flag — two horizontal light blue stripes on white, with four red six-pointed stars in the middle. Each star represents a defining moment: Fort Dearborn, the Great Chicago Fire, the World's Columbian Exposition, and the Century of Progress World's Fair.\n\nThree of those four stars represent events on this tour. We'll end with the fourth. Keep an eye on the flag as we walk."
      }
    ]
  },

  // ─── 2. FORT DEARBORN (1812) ─────────────────────────────────────────────────
  {
    number: 2,
    title: "Fort Dearborn Massacre",
    location: "State St & S Wacker Dr",
    lat: 41.88746, lng: -87.62797,
    year: "August 15, 1812",
    theme: "military",
    deaths: 52,
    deathsLabel: "52 U.S. troops and civilians killed",
    reform: null, reformLabel: null,
    tagline: "Chicago's founding was built on a broken treaty and a massacre. Neither gets mentioned on the tour buses.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Battle_of_Fort_Dearborn_tree_Andreas_1884.jpg/1200px-Battle_of_Fort_Dearborn_tree_Andreas_1884.jpg",
    sources: [
      { label: "Wikipedia: Battle of Fort Dearborn", url: "https://en.wikipedia.org/wiki/Battle_of_Fort_Dearborn" },
      { label: "Encyclopedia of Chicago: Fort Dearborn", url: "http://www.encyclopedia.chicagohistory.org/pages/477.html" },
      { label: "Mississippi Valley Historical Review (1915): The Fort Dearborn Massacre", url: "https://penelope.uchicago.edu/Thayer/E/Journals/MVHR/1/4/The_Fort_Dearborn_Massacre*.html" }
    ],
    sections: [
      {
        type: "narrative",
        heading: "Fort Dearborn",
        body: "A marker near this intersection commemorates Fort Dearborn, built in 1803 by the U.S. Army on the south bank of the Chicago River. It was a small outpost — a trading post and military garrison at the mouth of the river, where it meets Lake Michigan.\n\nThe land it sat on had been 'ceded' to the United States by the Treaty of Greenville in 1795, following the Northwest Indian War. But ceded is doing a lot of work in that sentence. The Potawatomi and other tribes who had lived here for generations had not agreed this was over."
      },
      {
        type: "narrative",
        heading: "The War of 1812",
        body: "When the War of 1812 broke out between the U.S. and Britain, the British had been actively supporting Native American resistance to American westward expansion. General William Hull ordered Fort Dearborn evacuated on August 15, 1812.\n\nA column of around 148 soldiers, settlers, and civilians set out south along the lakeshore with a Potawatomi escort that had promised safe passage. Approximately 1.5 miles south of the fort — near what is now 18th Street — a much larger force of Potawatomi warriors attacked."
      },
      {
        type: "stat",
        label: "By the Numbers",
        value: "52 killed · Survivors taken captive · Fort burned to the ground",
        color: "red"
      },
      {
        type: "narrative",
        body: "The fort was rebuilt in 1816. By 1837, the village that had grown up around it was incorporated as the City of Chicago. The land the Potawatomi had fought for was systematically taken from them in the years that followed, through a series of treaties that pushed Indigenous peoples further and further west.\n\nStanding at what is now one of the most expensive pieces of real estate in the Midwest, this is worth sitting with for a moment. The city began with a broken agreement and a massacre. Chicago doesn't put this one on the flag."
      }
    ]
  },

  // ─── 3. GREAT CHICAGO FIRE (1871) ────────────────────────────────────────────
  {
    number: 3,
    title: "The Great Chicago Fire",
    location: "Clark St & W Randolph St",
    lat: 41.88462, lng: -87.63117,
    year: "October 8–10, 1871",
    theme: "fire",
    deaths: 300,
    deathsLabel: "Approximately 300 fatalities",
    reform: 2,
    reformLabel: "Chicago Building Code reformed · Chicago Public Library established",
    tagline: "It burned for two days, destroyed 3.3 square miles, and made Chicago rebuild better.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Great_Chicago_Fire_cph.3b20287.jpg/1200px-Great_Chicago_Fire_cph.3b20287.jpg",
    sources: [
      { label: "Wikipedia: Great Chicago Fire", url: "https://en.wikipedia.org/wiki/Great_Chicago_Fire" },
      { label: "The Great Chicago Fire & Web of Memory (Chicago History Museum)", url: "https://greatchicagofire.org/" },
      { label: "Library of Congress: Chronicling America — Great Chicago Fire", url: "https://guides.loc.gov/chronicling-america-great-chicago-fire" }
    ],
    sections: [
      {
        type: "narrative",
        heading: "How It Started",
        body: "The official story is that a cow kicked over a lantern in a barn owned by the O'Leary family on DeKoven Street, southwest of downtown. The actual cause was never definitively proven — and Catherine O'Leary was almost certainly a scapegoat picked partly because she was Irish and Catholic. But the fire was real.\n\nIt was October. Chicago had been in a drought. The city was built almost entirely of wood — wooden buildings, wooden sidewalks, wooden roads covered in pine tar. The conditions were catastrophic."
      },
      {
        type: "narrative",
        heading: "How It Spread",
        body: "The fire burned through the night of October 8th. By morning it had crossed the Chicago River — which you'd think would stop it, but the wind was so fierce that burning embers sailed across and started new fires on the other side. Then it crossed again.\n\nThe city's fire department was already exhausted from fighting a smaller fire the day before. A watchman sent responders to the wrong location. The alarm system malfunctioned. The wind created 'fire whirls' — spinning columns of flame — that sent sparks hundreds of feet in every direction.\n\nBy October 10th, rain finally stopped it."
      },
      {
        type: "stat",
        label: "By the Numbers",
        value: "300 dead · 17,500+ structures burned · 100,000+ people homeless · $222 million in damage",
        color: "red"
      },
      {
        type: "narrative",
        heading: "The Aftermath",
        body: "Aid poured in from cities around the world — cash, clothing, food, and books. The books became the Chicago Public Library, established in the aftermath of the fire. It's still here.\n\nMore importantly, the city rebuilt — and rebuilt differently. Wooden construction was banned in the fire zone. Building codes became some of the strictest in the country. The disaster gave Chicago architects a blank canvas, and they used it to invent the skyscraper. The first steel-frame high-rise buildings in American history were built in Chicago, in the decade after the fire."
      },
      {
        type: "stat",
        label: "Reform Unlocked",
        value: "Strict building codes + Chicago Public Library (est. 1872)",
        color: "green"
      },
      {
        type: "narrative",
        heading: "The Delaware Building",
        body: "Look for the Delaware Building nearby. Built just one year after the fire, in 1872 — out of sturdy brick and stone, not wood. It was a deliberate statement: this is how we build now.\n\nIt's one of the oldest surviving commercial buildings in the Loop, and it's still standing because of exactly that decision. The Delaware Building is what Chicago decided to be after the fire."
      }
    ]
  },

  // ─── 4. HAYMARKET + BOARD OF TRADE + BLIMP (1865–1919) ──────────────────────
  {
    number: 4,
    title: "Business, Labor & a Blimp",
    location: "LaSalle St & W Randolph St",
    lat: 41.88463, lng: -87.63220,
    year: "1865 – 1919",
    theme: "business",
    deaths: 24,
    deathsLabel: "Haymarket (11) + Wingfoot blimp crash (13)",
    reform: 3,
    reformLabel: "Pure Food & Drug Act · Meat Inspection Act · International Workers' Day",
    tagline: "Chicago fed the world and nearly broke the people who made it possible.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/LCCN96506773.jpg/1200px-LCCN96506773.jpg",
    sources: [
      { label: "Wikipedia: Haymarket Affair", url: "https://en.wikipedia.org/wiki/Haymarket_affair" },
      { label: "Wikipedia: Wingfoot Air Express Crash", url: "https://en.wikipedia.org/wiki/Wingfoot_Air_Express_crash" },
      { label: "Library of Congress: Haymarket Affair — Chronicling America", url: "https://guides.loc.gov/chronicling-america-haymarket-affair" },
      { label: "Gilder Lehrman Institute: The Haymarket Affair, 1886 (primary sources)", url: "https://www.gilderlehrman.org/history-resources/spotlight-primary-source/haymarket-affair-1886" },
      { label: "PBS: The Jungle — Upton Sinclair", url: "https://www.pbs.org/wgbh/americanexperience/features/upton-sinclair-jungle/" }
    ],
    sections: [
      {
        type: "narrative",
        heading: "The Board of Trade",
        body: "That building at the south end of LaSalle is the Chicago Board of Trade — and the figure at the very top is Ceres, the Roman goddess of agriculture. She's there for a reason. Chicago was the commodity capital of the world.\n\nThe city sat at the center of the surrounding farmland. Trains ran through it from every direction. And then refrigerated rail cars came along, and suddenly you could ship meat from Chicago to New York without it rotting. The economics of the whole country shifted."
      },
      {
        type: "narrative",
        heading: "The Stockyards",
        body: "By 1890, the Union Stock Yards were processing 9 million animals per year. That's roughly 59,615 animals per day. Every day. The city smelled like it.\n\nCarl Sandburg called Chicago the 'Hog Butcher of the World' and meant it as a compliment. The city earned the title."
      },
      {
        type: "quote",
        text: "Hog Butcher for the World, Tool Maker, Stacker of Wheat, Player with Railroads and the Nation's Freight Handler; Stormy, husky, brawling, City of the Big Shoulders.",
        attribution: "Carl Sandburg, \"Chicago\" (1914)"
      },
      {
        type: "narrative",
        heading: "Upton Sinclair Ruins Lunch",
        body: "In 1905, a journalist named Upton Sinclair spent seven weeks undercover in the Stockyards. He was trying to write about the workers — the brutal conditions, the wages, the danger. He did write about that. But the book he published, The Jungle, became famous for something else entirely: what was actually going into the meat.\n\nSpoiled meat. Rat droppings. Occasionally a worker who fell in and wasn't found in time. It became an international bestseller within weeks."
      },
      {
        type: "quote",
        text: "I aimed at the public's heart, and by accident I hit it in the stomach.",
        attribution: "Upton Sinclair"
      },
      {
        type: "narrative",
        body: "The public outcry led to a federal investigation. President Theodore Roosevelt personally read the book — reportedly while eating breakfast, which he did not finish. Within a year, Congress passed the Pure Food and Drug Act and the Meat Inspection Act of 1906. The FDA, essentially, begins here."
      },
      {
        type: "stat",
        label: "Reform Unlocked",
        value: "Pure Food & Drug Act (1906) — the origin of the FDA",
        color: "green"
      },
      {
        type: "narrative",
        heading: "The Haymarket Affair (1886)",
        body: "A few blocks from here, on May 4, 1886, everything went sideways at what started as a peaceful rally for the eight-hour workday.\n\nLabor tensions had been building for years. On May 1st, tens of thousands of Chicago workers went on strike. On May 3rd, police clashed with workers at the McCormick Reaper Works and shot several people. The next day, workers gathered at Haymarket Square to protest. The crowd was actually thinning peacefully when police moved in to disperse them.\n\nThen someone threw a bomb.\n\nSeven police officers died. At least four civilians were killed. Eight anarchists were convicted in a trial widely considered a political prosecution — four were executed, one died by suicide in his cell, three were later pardoned when the governor called the trial deeply flawed."
      },
      {
        type: "stat",
        label: "Reform Unlocked",
        value: "International Workers' Day — May 1st — born from the blood of Chicago's labor movement",
        color: "green"
      },
      {
        type: "photo",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Result_of_the_Wingfoot_Air_Express_crash_1919.jpg/1200px-Result_of_the_Wingfoot_Air_Express_crash_1919.jpg",
        caption: "Wreckage of the Wingfoot Air Express inside the Illinois Trust and Savings Bank, July 21, 1919. The blimp crashed through the skylight during the lunch hour."
      },
      {
        type: "narrative",
        heading: "The Blimp Crash (1919)",
        body: "On July 21, 1919, a Goodyear blimp called the Wingfoot Air Express caught fire at 1,200 feet over the Loop. The airship was on a promotional trip from Grant Park to the White City amusement park on the South Side. There were five people on board when it began to burn.\n\nThe burning blimp fell directly onto the Illinois Trust and Savings Building — right here in the Loop — crashing through the skylight into the bank below, which was full of employees eating lunch.\n\nThirteen people died total — three on the airship and ten bank employees killed when the burning wreckage landed on them. Twenty-seven more were injured.\n\nThe disaster immediately ended blimp flights over Chicago. Grant Park's airstrip was shut down. Aviation rules in the city changed overnight. The age of blimps over downtown was, very briefly, over."
      }
    ]
  },

  // ─── 5. H.H. HOLMES + WORLD'S FAIR (1893) ───────────────────────────────────
  {
    number: 5,
    title: "The White City & H.H. Holmes",
    location: "Dearborn St & W Wacker Dr",
    lat: 41.88748, lng: -87.62952,
    year: "1893",
    theme: "exposition",
    deaths: 27,
    deathsLabel: "27+ confirmed victims of H.H. Holmes",
    reform: 1,
    reformLabel: "Forensic investigation techniques formalized",
    tagline: "The most celebrated event in Chicago history ran alongside one of America's most prolific serial killers.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Looking_West_From_Peristyle,_Court_of_Honor_and_Grand_Basin,_1893.jpg/1200px-Looking_West_From_Peristyle,_Court_of_Honor_and_Grand_Basin,_1893.jpg",
    sources: [
      { label: "Wikipedia: World's Columbian Exposition", url: "https://en.wikipedia.org/wiki/World%27s_Columbian_Exposition" },
      { label: "Wikipedia: H.H. Holmes", url: "https://en.wikipedia.org/wiki/H._H._Holmes" },
      { label: "Library of Congress: The 1893 World Columbian Exposition", url: "https://www.loc.gov/collections/songs-of-america/articles-and-essays/historical-topics/1893-World-Columbian-Exposition/" },
      { label: "Smithsonian: The Enduring Mystery of H.H. Holmes", url: "https://www.smithsonianmag.com/smart-news/enduring-mystery-hh-holmes-americas-first-serial-killer-180977646/" },
      { label: "Book: The Devil in the White City (Larson)", url: "https://en.wikipedia.org/wiki/The_Devil_in_the_White_City" }
    ],
    sections: [
      {
        type: "narrative",
        heading: "The World's Columbian Exposition",
        body: "In 1893, Chicago hosted the World's Columbian Exposition — a world's fair celebrating the 400th anniversary of Columbus's arrival in the New World. The fair was held in Jackson Park on the South Side, and it was extraordinary.\n\n690 acres. 27 million visitors in six months. A gleaming collection of white neoclassical buildings so dazzling it earned the nickname 'The White City.' The fair introduced the world to the original Ferris Wheel, Cracker Jack, Juicy Fruit gum, Pabst Blue Ribbon beer, and the first commercial movie theater. Frederick Law Olmsted designed the grounds. It was, by almost any measure, the most ambitious civic event America had ever attempted."
      },
      {
        type: "narrative",
        body: "The fair is the third star on the Chicago flag. It was that significant. The city had proven, thirty years after the Civil War and twenty years after the Great Fire, that it could build something beautiful. The fair inspired the City Beautiful movement in American urban planning — the idea that cities should be deliberately, aesthetically designed. Washington D.C., San Francisco, Cleveland — all were redesigned in the following decades with the White City as a model."
      },
      {
        type: "narrative",
        heading: "H.H. Holmes",
        body: "Herman Webster Mudgett — who went by the name Dr. Henry Howard Holmes — arrived in Chicago in 1886, seven years before the fair. He was a con artist, a bigamist, and a very charming man.\n\nIn 1889, he began building a hotel a few miles south of downtown in the Englewood neighborhood. The hotel would later be called the 'Murder Castle' by the press. It was a three-story building with over 60 rooms — an unusually complex design that Holmes personally supervised, rotating construction workers so that no single person knew the full layout."
      },
      {
        type: "narrative",
        body: "Inside: soundproof rooms with gas lines he could control from his office. Doors that locked from the outside. A chute in one room that led directly to the basement. The basement held acid vats, a crematorium, and surgical equipment.\n\nWhen the World's Fair brought 27 million visitors to Chicago — many of them single women traveling alone for the first time, most of them with no one expecting them home at a specific hour — Holmes had a hotel with vacancies right near the fair."
      },
      {
        type: "photo",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/H._H._Holmes_Castle.jpg/1200px-H._H._Holmes_Castle.jpg",
        caption: "Holmes's hotel at 63rd and Wallace in Englewood — later called the 'Murder Castle' by the press. He rotated construction crews so no single worker knew the full layout."
      },
      {
        type: "stat",
        label: "Confirmed Victims",
        value: "27 — Holmes confessed to over 100 murders. True number never determined.",
        color: "red"
      },
      {
        type: "narrative",
        body: "Holmes was eventually caught through an insurance fraud scheme — he'd gotten sloppy. He was hanged in 1896. The investigation of the Murder Castle was one of the first large-scale forensic investigations in American history, and it formalized practices for searching crime scenes.\n\nErik Larson's book 'The Devil in the White City' tells both stories — the fair and Holmes — side by side. It is the best possible way to experience this piece of Chicago's history from a couch."
      }
    ]
  },

  // ─── 6. IROQUOIS THEATER FIRE (1903) ─────────────────────────────────────────
  {
    number: 6,
    title: "The Iroquois Theater Fire",
    location: "Nederlander Theatre, 24 W Randolph St",
    lat: 41.88473, lng: -87.62900,
    year: "December 30, 1903",
    theme: "fire",
    deaths: 602,
    deathsLabel: "602 confirmed dead — the deadliest single-building fire in U.S. history",
    reform: 1,
    reformLabel: "Fire exit standards reformed worldwide — outward-opening doors, panic hardware, exit signs",
    tagline: "The theater was advertised as 'absolutely fireproof.' It opened five weeks before it killed 602 people.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Panorama_of_the_Iroquois_Theatre,_after_the_fire.jpg/1200px-Panorama_of_the_Iroquois_Theatre,_after_the_fire.jpg",
    sources: [
      { label: "Wikipedia: Iroquois Theater Fire", url: "https://en.wikipedia.org/wiki/Iroquois_Theatre_fire" },
      { label: "Library of Congress: Iroquois Theater Fire — Chronicling America", url: "https://guides.loc.gov/chronicling-america-iroquois-theater-fire" },
      { label: "Library of Congress: Panorama of Iroquois Theater after the fire (1903)", url: "https://www.loc.gov/item/2007662240/" },
      { label: "NFPA: Remembering the Iroquois Theater Fire", url: "https://www.nfpa.org/news-blogs-and-research/news/2003/12/10/remembering-the-iroquois-theater-fire" }
    ],
    sections: [
      {
        type: "narrative",
        heading: "Absolutely Fireproof",
        body: "The Iroquois Theater opened in November 1903 on this spot. It was brand new, beautiful, and aggressively marketed as 'absolutely fireproof.' The management said this constantly. It was printed in advertisements.\n\nIt had no fire sprinklers. No fire alarm system. No telephones. No firefighting equipment. The exits were hidden behind heavy velvet drapes. Several exit doors were locked or designed in ways that meant panicking crowds couldn't figure out how to open them. There was only one main entrance for a theater that held 1,700 people.\n\nFive weeks after opening, it was full."
      },
      {
        type: "narrative",
        heading: "The Fire",
        body: "December 30, 1903. A holiday week matinee of 'Mr. Blue Beard.' The audience was packed — over 2,000 people in a 1,700-seat theater, many of them children out of school for the holidays.\n\nDuring the second act, a spark from a broken arc light caught the muslin scenery curtains above the stage. A stagehand tried to smother it. The curtain system failed to lower. Backstage workers opened a large door to escape — which sent a massive rush of cold outside air into the theater, creating a fireball that rolled out over the audience."
      },
      {
        type: "narrative",
        body: "Eddie Foy, the star of the show, stood on stage and tried to calm the audience. He kept performing. He sent his own son away with a stagehand and stayed. He is remembered as a hero.\n\nThe audience mostly didn't stay calm. People couldn't find the exits hidden behind curtains. The unlocked doors opened inward, and the crush of people made them impossible to open. People piled on top of each other in the stairways. Many died of asphyxiation, not fire — they were suffocated by the smoke and the crush before flames ever reached them."
      },
      {
        type: "stat",
        label: "By the Numbers",
        value: "602 dead · 250+ injured · Fire lasted less than 15 minutes",
        color: "red"
      },
      {
        type: "narrative",
        heading: "What Changed",
        body: "Almost immediately, cities across the country and around the world began reviewing their theater fire codes. Exit signs became mandatory. Doors were required to open outward. Panic hardware — those push bars you now see on every emergency exit — became standard. Sprinkler systems became required.\n\nThe Nederlander Theatre you're standing in front of now is the building that replaced the Iroquois. The address is the same. The theater is beautiful. Every exit is clearly marked.\n\nAll 602 people who died here made every theater in the world a little safer."
      },
      {
        type: "stat",
        label: "Reform Unlocked",
        value: "Modern fire exit standards — outward-opening doors, panic hardware, exit signage — adopted worldwide",
        color: "green"
      }
    ]
  },

  // ─── 7. SS EASTLAND (1915) ───────────────────────────────────────────────────
  {
    number: 7,
    title: "SS Eastland Disaster",
    location: "LaSalle Street Bridge, Chicago River",
    lat: 41.88823, lng: -87.63220,
    year: "July 24, 1915",
    theme: "maritime",
    deaths: 844,
    deathsLabel: "844 dead — more than the Titanic — in the Chicago River",
    reform: 1,
    reformLabel: "Steamship Inspection Service overhauled · maritime safety regulations reformed nationwide",
    tagline: "It happened 20 feet from shore, in 20 feet of water, on a calm summer morning.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Eastland_heeled_over_the_morning_of_the_disaster.jpg/1200px-Eastland_heeled_over_the_morning_of_the_disaster.jpg",
    sources: [
      { label: "Wikipedia: SS Eastland", url: "https://en.wikipedia.org/wiki/SS_Eastland" },
      { label: "Eastland Disaster Historical Society", url: "https://eastlanddisaster.org/" },
      { label: "National Archives: Steamship Eastland Disaster", url: "https://www.archives.gov/chicago/highlights/eastland" }
    ],
    sections: [
      {
        type: "narrative",
        heading: "The Morning",
        body: "July 24, 1915. A Saturday morning on the Chicago River. The Western Electric Company was holding its annual employee picnic — a trip across Lake Michigan to Michigan City, Indiana. Five steamships had been chartered to take employees and their families.\n\nOver 7,000 people gathered at the docks. The SS Eastland was the largest ship, and it began boarding early. Families, couples, children. By 7:00 AM, there were over 2,500 people on board — the ship was at capacity and still tied to the dock."
      },
      {
        type: "narrative",
        heading: "What Happened",
        body: "The Eastland had a history of stability problems that its owners and operators had documented — and ignored. As passengers crowded to the port side of the ship to watch activity on the dock, the boat began to list. Crew members told people to move. Some did. Most didn't — they were watching the dock, talking, laughing.\n\nAt 7:28 AM, the ship rolled completely onto its side. Still tied to the dock. Still in the river. Twenty feet from shore."
      },
      {
        type: "narrative",
        body: "People on the upper decks were thrown into the river. People below decks were trapped. Rescuers from nearby boats, from the dock, and from the city arrived within minutes — but for hundreds of people trapped inside the capsized hull, minutes was too long.\n\nSurface divers cut holes in the ship's hull. They pulled out survivors. They pulled out bodies. The process took hours.\n\nA nearby building — the second regiment armory — was converted into an emergency morgue. Hundreds of bodies were laid out on the floor. Western Electric employees were brought in to identify their coworkers. Families walked the rows."
      },
      {
        type: "stat",
        label: "By the Numbers",
        value: "844 dead · 2,500+ passengers · Ship capsized 20 feet from shore in 20 feet of water",
        color: "red"
      },
      {
        type: "narrative",
        heading: "The Ripple",
        body: "The Eastland disaster killed more people than the Titanic sank in Lake Michigan in a matter of minutes on a calm morning in a city river. It remains the deadliest single disaster in Chicago history and one of the worst maritime disasters in U.S. history.\n\nThe investigation exposed years of documented, ignored safety warnings. The Steamship Inspection Service was overhauled. Maritime safety regulations were tightened nationally. Passenger limits were enforced in ways they hadn't been before.\n\nThe building where the bodies were identified later became the Harpo Studios — where Oprah Winfrey filmed her show for decades. It is, by many accounts, one of the most haunted buildings in Chicago."
      },
      {
        type: "stat",
        label: "Reform Unlocked",
        value: "Steamship Inspection Service reformed · Federal maritime safety regulations overhauled",
        color: "green"
      }
    ]
  },

  // ─── 8. MARLBORO MAN (1954–1999) ─────────────────────────────────────────────
  {
    number: 8,
    title: "The Marlboro Man",
    location: "Leo Burnett Building, 35 W Wacker Dr",
    lat: 41.88660, lng: -87.63434,
    year: "1954 – 1999",
    theme: "business",
    deaths: 5,
    deathsLabel: "5 of the 12 Marlboro Men died of lung disease",
    reform: null, reformLabel: null,
    tagline: "The most successful cigarette campaign in history was created here. It killed its own spokesmen.",
    image: null,
    sources: [
      { label: "Wikipedia: Marlboro Man", url: "https://en.wikipedia.org/wiki/Marlboro_Man" },
      { label: "Wikipedia: Leo Burnett Company", url: "https://en.wikipedia.org/wiki/Leo_Burnett_Worldwide" },
      { label: "Stanford Research into the Impact of Tobacco Advertising", url: "https://tobacco.stanford.edu/tobacco_main/index.php" },
      { label: "New York Times: Wayne McLaren, Marlboro Man, Dies at 51", url: "https://www.nytimes.com/1992/07/22/obituaries/wayne-mclaren-marlboro-man-in-ads-dies-at-51.html" }
    ],
    sections: [
      {
        type: "narrative",
        heading: "Leo Burnett",
        body: "The Leo Burnett advertising agency was founded in Chicago in 1935, and for decades this building was one of the most influential places in American marketing. The agency created Tony the Tiger, the Jolly Green Giant, the Pillsbury Doughboy, and Ronald McDonald.\n\nAnd in 1954, they created the Marlboro Man."
      },
      {
        type: "narrative",
        heading: "The Campaign",
        body: "Before 1954, Marlboro was marketed as a women's cigarette — 'Mild as May,' the ads said. Philip Morris wanted to pivot. They hired Leo Burnett to make Marlboro a man's cigarette.\n\nBurnett's solution was one of the most effective advertising images in history: a rugged, weathered man — usually a cowboy — set against vast open terrain. No text needed. The image did everything. The Marlboro Man ran for 45 years in the United States, from 1954 to 1999, when tobacco advertising was finally banned."
      },
      {
        type: "narrative",
        heading: "The Irony",
        body: "Twelve different real men embodied the Marlboro Man image over the years. Cowboys, models, ranchers. Five of the twelve died of lung disease.\n\nDavid McLean and Wayne McLaren, two of the most prominent Marlboro Men, both died of lung cancer and both spent their final years actively campaigning against tobacco advertising. McLaren testified before Congress about cigarette marketing before his death."
      },
      {
        type: "quote",
        text: "I was the Marlboro Man. I'm now fighting for my life.",
        attribution: "Wayne McLaren, testifying before a Philip Morris shareholder meeting, 1992"
      },
      {
        type: "narrative",
        body: "The campaign is considered one of the most effective — and one of the most lethal — marketing campaigns in American history. Tobacco advertising in the U.S. was banned from television in 1971 and from all remaining media in 1998. It came too late for an estimated 480,000 Americans who die of smoking-related illness every year."
      }
    ]
  },

  // ─── 9. DAVE MATTHEWS BAND (2004) ────────────────────────────────────────────
  {
    number: 9,
    title: "The Dave Matthews Band Incident",
    location: "Kinzie Street Bridge",
    lat: 41.88971, lng: -87.63371,
    year: "August 8, 2004",
    theme: "environment",
    deaths: 0,
    deathsLabel: "Zero deaths. Approximately 800 lbs of raw sewage.",
    reform: null, reformLabel: null,
    tagline: "We needed a breather. This is that story.",
    image: null,
    sources: [
      { label: "Wikipedia: Dave Matthews Band bus sewage incident", url: "https://en.wikipedia.org/wiki/Dave_Matthews_Band_bus_sewage_incident" },
      { label: "Chicago Tribune: The Full Story", url: "https://www.chicagotribune.com/news/ct-dave-matthews-band-bus-chicago-river-htmlstory.html" },
      { label: "Friends of the Chicago River", url: "https://www.chicagoriver.org/" }
    ],
    sections: [
      {
        type: "narrative",
        heading: "A Palate Cleanser",
        body: "We've covered fires, massacres, a blimp crash, a serial killer, and the single deadliest day in Chicago River history. You've been a good sport. This next one has a body count of zero.\n\nOn August 8, 2004, the Dave Matthews Band tour bus was crossing the Kinzie Street Bridge. The driver — Stefan Wohl — opened the waste tank of the tour bus and discharged its contents directly through the open grate of the bridge onto the tour boats passing below."
      },
      {
        type: "narrative",
        heading: "The Incident",
        body: "Approximately 800 pounds of raw human sewage fell from the bridge onto a Chicago Architecture Foundation tour boat called the Chicago's Little Lady. Around 100 passengers were below, listening to a guide explain the Merchandise Mart. Then it rained.\n\nNot rain. You know."
      },
      {
        type: "quote",
        text: "I am genuinely and profoundly sorry for the environmental damage and the harm that was caused to individuals on the boat.",
        attribution: "Dave Matthews, public statement, 2004"
      },
      {
        type: "narrative",
        heading: "The Fallout",
        body: "The driver was identified through DNA analysis of the sewage — a detail that is both impressive and deeply unfortunate for everyone involved.\n\nThe Dave Matthews Band settled with the state of Illinois for $200,000, with the majority going to environmental organizations that protect the Chicago River. Stefan Wohl paid a separate fine and was placed on probation.\n\nThe band issued an apology. Chicago received the money. The Chicago River was cleaned. Dave Matthews continued touring and remains extremely popular. No one talks about this anymore, which is maybe the greatest injustice on this tour."
      }
    ]
  },

  // ─── 10. CENTURY OF PROGRESS (FINALE) ───────────────────────────────────────
  {
    number: 10,
    title: "A Century of Progress",
    location: "Grant Park — The Lakefront",
    lat: 41.88270, lng: -87.62329,
    year: "1933 – 1934",
    theme: "outro",
    deaths: null, deathsLabel: null,
    reform: null, reformLabel: null,
    tagline: "The last star on the flag. The whole point of the tour.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Aerial_View_of_the_Century_of_Progress_International_Exposition,_Chicago_(NBY_2791).jpg/1200px-Aerial_View_of_the_Century_of_Progress_International_Exposition,_Chicago_(NBY_2791).jpg",
    sources: [
      { label: "Wikipedia: Century of Progress", url: "https://en.wikipedia.org/wiki/Century_of_Progress" },
      { label: "Chicago History Museum: Century of Progress, 1933–1934", url: "https://libguides.chicagohistory.org/worldsfairs/centuryprogress" },
      { label: "Newberry Library: Picturing the Century of Progress", url: "https://dcc.newberry.org/?p=14406" }
    ],
    sections: [
      {
        type: "narrative",
        heading: "The World's Fair That Shouldn't Have Happened",
        body: "In 1929, Chicago began planning a second World's Fair to celebrate the centennial of the city's incorporation. Then the stock market crashed. The Great Depression began. Millions of Americans were out of work.\n\nChicago held the fair anyway. The Century of Progress International Exposition opened on May 27, 1933, in Burnham Park along the lakefront. Its theme: a century of scientific and industrial progress since Chicago was founded. Its real purpose: to prove the city wasn't broken."
      },
      {
        type: "narrative",
        body: "It ran for two full seasons. Nearly 50 million visitors came. The fair introduced the first commercial television broadcasts to the public. GM's Futurama exhibit imagined highways and cities of the future. The 'Homes of Tomorrow' showed Americans that modern life could look different — better, cleaner, more efficient.\n\nIn the middle of the worst economic crisis in American history, Chicago built something beautiful and invited the world to look at it."
      },
      {
        type: "narrative",
        heading: "The Fourth Star",
        body: "The Century of Progress is the fourth and final star on the Chicago flag — alongside Fort Dearborn, the Great Chicago Fire, and the World's Columbian Exposition. Three of those four events are on this tour. All four shaped the city permanently.\n\nThe flag is about what Chicago decided to remember. And what it decided to remember is not the disasters themselves, but what came after them."
      },
      {
        type: "quote",
        text: "Chicago is not the most corrupt American city, it's the most theatrically corrupt.",
        attribution: "Studs Terkel"
      },
      {
        type: "narrative",
        heading: "What You Just Walked Through",
        body: "Today you heard about workers killed fighting for an eight-hour workday — their deaths created International Workers' Day. A blimp fell into a bank — it reformed aviation rules over cities. A fire destroyed 3.3 miles of downtown — it built stricter codes and a public library. A theater burned in fifteen minutes — it changed how every theater on earth handles exits. A ship capsized twenty feet from shore — it reformed maritime safety nationwide.\n\nNot one of these tragedies was in vain. Every death on this tour is connected to a law, a regulation, a reform, a code that made someone else safer.\n\nThat's Chicago. It doesn't just rebuild. It builds better.\n\nLong live Chicago."
      },
      {
        type: "stat",
        label: "Tour Complete",
        value: "~1,854 lives lost · 8+ major reforms · 1 city that learned from every single one",
        color: "gold"
      }
    ]
  }
];

// Running totals by narrative stop index (cumulative deaths and reforms)
// Used by both the scroll tally counter and the walking tour progress bar
const RUNNING_TOTALS = [
  { deaths: 0,    reforms: 0 },  // Stop 1: Welcome
  { deaths: 52,   reforms: 0 },  // Stop 2: Fort Dearborn
  { deaths: 352,  reforms: 2 },  // Stop 3: Great Fire (+300 deaths, +2 reforms)
  { deaths: 376,  reforms: 5 },  // Stop 4: Haymarket/Blimp (+24 deaths, +3 reforms)
  { deaths: 403,  reforms: 6 },  // Stop 5: H.H. Holmes (+27 deaths, +1 reform)
  { deaths: 1005, reforms: 7 },  // Stop 6: Iroquois (+602 deaths, +1 reform)
  { deaths: 1849, reforms: 8 },  // Stop 7: Eastland (+844 deaths, +1 reform)
  { deaths: 1854, reforms: 8 },  // Stop 8: Marlboro (+5 deaths)
  { deaths: 1854, reforms: 8 },  // Stop 9: Dave Matthews (0 deaths)
  { deaths: 1854, reforms: 8 },  // Stop 10: Century (finale)
];
