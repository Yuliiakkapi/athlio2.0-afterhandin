// Static list of major football clubs
// Logos: Wikipedia/Wikimedia SVG URLs (public domain / freely licensed)
// logo: null → ClubPicker shows a coloured-initials placeholder

const CLUBS = [
  // ── Premier League ──────────────────────────────────────────────
  { id: "arsenal",          name: "Arsenal",            league: "Premier League",    country: "England", logo: "https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg" },
  { id: "chelsea",          name: "Chelsea",            league: "Premier League",    country: "England", logo: "https://upload.wikimedia.org/wikipedia/en/c/cc/Chelsea_FC.svg" },
  { id: "liverpool",        name: "Liverpool",          league: "Premier League",    country: "England", logo: "https://upload.wikimedia.org/wikipedia/en/0/0c/Liverpool_FC.svg" },
  { id: "man-city",         name: "Manchester City",    league: "Premier League",    country: "England", logo: "https://upload.wikimedia.org/wikipedia/en/e/eb/Manchester_City_FC_badge.svg" },
  { id: "man-utd",          name: "Manchester United",  league: "Premier League",    country: "England", logo: "https://upload.wikimedia.org/wikipedia/en/7/7a/Manchester_United_FC_crest.svg" },
  { id: "tottenham",        name: "Tottenham Hotspur",  league: "Premier League",    country: "England", logo: "https://upload.wikimedia.org/wikipedia/en/b/b4/Tottenham_Hotspur.svg" },
  { id: "newcastle",        name: "Newcastle United",   league: "Premier League",    country: "England", logo: null },
  { id: "aston-villa",      name: "Aston Villa",        league: "Premier League",    country: "England", logo: null },
  { id: "west-ham",         name: "West Ham United",    league: "Premier League",    country: "England", logo: null },
  { id: "brighton",         name: "Brighton & Hove Albion", league: "Premier League", country: "England", logo: null },
  { id: "brentford",        name: "Brentford",          league: "Premier League",    country: "England", logo: null },
  { id: "fulham",           name: "Fulham",             league: "Premier League",    country: "England", logo: null },
  { id: "crystal-palace",   name: "Crystal Palace",     league: "Premier League",    country: "England", logo: null },
  { id: "everton",          name: "Everton",            league: "Premier League",    country: "England", logo: null },
  { id: "wolves",           name: "Wolverhampton Wanderers", league: "Premier League", country: "England", logo: null },
  { id: "nottm-forest",     name: "Nottingham Forest",  league: "Premier League",    country: "England", logo: null },
  { id: "leicester",        name: "Leicester City",     league: "Championship",      country: "England", logo: null },
  { id: "leeds",            name: "Leeds United",       league: "Championship",      country: "England", logo: null },

  // ── La Liga ─────────────────────────────────────────────────────
  { id: "real-madrid",      name: "Real Madrid",        league: "La Liga",           country: "Spain",   logo: "https://upload.wikimedia.org/wikipedia/en/5/56/Real_Madrid_CF.svg" },
  { id: "barcelona",        name: "FC Barcelona",       league: "La Liga",           country: "Spain",   logo: "https://upload.wikimedia.org/wikipedia/en/4/47/FC_Barcelona_%28crest%29.svg" },
  { id: "atletico",         name: "Atlético de Madrid", league: "La Liga",           country: "Spain",   logo: "https://upload.wikimedia.org/wikipedia/en/f/f4/Atletico_de_madrid_crest_old.png" },
  { id: "sevilla",          name: "Sevilla FC",         league: "La Liga",           country: "Spain",   logo: null },
  { id: "real-betis",       name: "Real Betis",         league: "La Liga",           country: "Spain",   logo: null },
  { id: "villarreal",       name: "Villarreal CF",      league: "La Liga",           country: "Spain",   logo: null },
  { id: "real-sociedad",    name: "Real Sociedad",      league: "La Liga",           country: "Spain",   logo: null },
  { id: "athletic-bilbao",  name: "Athletic Bilbao",    league: "La Liga",           country: "Spain",   logo: null },
  { id: "valencia",         name: "Valencia CF",        league: "La Liga",           country: "Spain",   logo: null },
  { id: "osasuna",          name: "CA Osasuna",         league: "La Liga",           country: "Spain",   logo: null },
  { id: "celta",            name: "Celta Vigo",         league: "La Liga",           country: "Spain",   logo: null },
  { id: "getafe",           name: "Getafe CF",          league: "La Liga",           country: "Spain",   logo: null },

  // ── Bundesliga ──────────────────────────────────────────────────
  { id: "bayern",           name: "Bayern Munich",      league: "Bundesliga",        country: "Germany", logo: "https://upload.wikimedia.org/wikipedia/commons/1/1b/FC_Bayern_M%C3%BCnchen_logo_%282002%E2%80%932017%29.svg" },
  { id: "dortmund",         name: "Borussia Dortmund",  league: "Bundesliga",        country: "Germany", logo: "https://upload.wikimedia.org/wikipedia/commons/6/67/Borussia_Dortmund_logo.svg" },
  { id: "leverkusen",       name: "Bayer Leverkusen",   league: "Bundesliga",        country: "Germany", logo: null },
  { id: "rb-leipzig",       name: "RB Leipzig",         league: "Bundesliga",        country: "Germany", logo: null },
  { id: "frankfurt",        name: "Eintracht Frankfurt", league: "Bundesliga",       country: "Germany", logo: null },
  { id: "wolfsburg",        name: "VfL Wolfsburg",      league: "Bundesliga",        country: "Germany", logo: null },
  { id: "gladbach",         name: "Borussia Mönchengladbach", league: "Bundesliga",  country: "Germany", logo: null },
  { id: "freiburg",         name: "SC Freiburg",        league: "Bundesliga",        country: "Germany", logo: null },
  { id: "hoffenheim",       name: "TSG Hoffenheim",     league: "Bundesliga",        country: "Germany", logo: null },
  { id: "stuttgart",        name: "VfB Stuttgart",      league: "Bundesliga",        country: "Germany", logo: null },
  { id: "union-berlin",     name: "Union Berlin",       league: "Bundesliga",        country: "Germany", logo: null },
  { id: "schalke",          name: "Schalke 04",         league: "2. Bundesliga",     country: "Germany", logo: null },
  { id: "hamburg",          name: "Hamburger SV",       league: "2. Bundesliga",     country: "Germany", logo: null },

  // ── Serie A ─────────────────────────────────────────────────────
  { id: "juventus",         name: "Juventus",           league: "Serie A",           country: "Italy",   logo: "https://upload.wikimedia.org/wikipedia/commons/1/15/Juventus_FC_2017_logo.svg" },
  { id: "ac-milan",         name: "AC Milan",           league: "Serie A",           country: "Italy",   logo: "https://upload.wikimedia.org/wikipedia/commons/d/d0/Logo_of_AC_Milan.svg" },
  { id: "inter",            name: "Inter Milan",        league: "Serie A",           country: "Italy",   logo: "https://upload.wikimedia.org/wikipedia/commons/0/05/FC_Internazionale_Milano_2021.svg" },
  { id: "napoli",           name: "SSC Napoli",         league: "Serie A",           country: "Italy",   logo: null },
  { id: "roma",             name: "AS Roma",            league: "Serie A",           country: "Italy",   logo: null },
  { id: "lazio",            name: "SS Lazio",           league: "Serie A",           country: "Italy",   logo: null },
  { id: "atalanta",         name: "Atalanta BC",        league: "Serie A",           country: "Italy",   logo: null },
  { id: "fiorentina",       name: "ACF Fiorentina",     league: "Serie A",           country: "Italy",   logo: null },
  { id: "torino",           name: "Torino FC",          league: "Serie A",           country: "Italy",   logo: null },
  { id: "udinese",          name: "Udinese Calcio",     league: "Serie A",           country: "Italy",   logo: null },
  { id: "bologna",          name: "Bologna FC",         league: "Serie A",           country: "Italy",   logo: null },
  { id: "sampdoria",        name: "UC Sampdoria",       league: "Serie B",           country: "Italy",   logo: null },

  // ── Ligue 1 ─────────────────────────────────────────────────────
  { id: "psg",              name: "Paris Saint-Germain", league: "Ligue 1",          country: "France",  logo: "https://upload.wikimedia.org/wikipedia/en/a/a7/Paris_Saint-Germain_F.C..svg" },
  { id: "marseille",        name: "Olympique de Marseille", league: "Ligue 1",       country: "France",  logo: null },
  { id: "lyon",             name: "Olympique Lyonnais",  league: "Ligue 1",          country: "France",  logo: null },
  { id: "monaco",           name: "AS Monaco",          league: "Ligue 1",           country: "France",  logo: null },
  { id: "lille",            name: "Lille OSC",          league: "Ligue 1",           country: "France",  logo: null },
  { id: "nice",             name: "OGC Nice",           league: "Ligue 1",           country: "France",  logo: null },
  { id: "rennes",           name: "Stade Rennais",      league: "Ligue 1",           country: "France",  logo: null },
  { id: "lens",             name: "RC Lens",            league: "Ligue 1",           country: "France",  logo: null },

  // ── Eredivisie ──────────────────────────────────────────────────
  { id: "ajax",             name: "AFC Ajax",           league: "Eredivisie",        country: "Netherlands", logo: "https://upload.wikimedia.org/wikipedia/en/7/79/Ajax_Amsterdam.svg" },
  { id: "psv",              name: "PSV Eindhoven",      league: "Eredivisie",        country: "Netherlands", logo: null },
  { id: "feyenoord",        name: "Feyenoord",          league: "Eredivisie",        country: "Netherlands", logo: null },
  { id: "az",               name: "AZ Alkmaar",         league: "Eredivisie",        country: "Netherlands", logo: null },
  { id: "utrecht",          name: "FC Utrecht",         league: "Eredivisie",        country: "Netherlands", logo: null },
  { id: "twente",           name: "FC Twente",          league: "Eredivisie",        country: "Netherlands", logo: null },

  // ── Primeira Liga ───────────────────────────────────────────────
  { id: "porto",            name: "FC Porto",           league: "Primeira Liga",     country: "Portugal", logo: "https://upload.wikimedia.org/wikipedia/en/3/36/FC_Porto.svg" },
  { id: "benfica",          name: "SL Benfica",         league: "Primeira Liga",     country: "Portugal", logo: null },
  { id: "sporting-cp",      name: "Sporting CP",        league: "Primeira Liga",     country: "Portugal", logo: null },
  { id: "braga",            name: "SC Braga",           league: "Primeira Liga",     country: "Portugal", logo: null },

  // ── Scottish Premiership ────────────────────────────────────────
  { id: "celtic",           name: "Celtic FC",          league: "Scottish Premiership", country: "Scotland", logo: "https://upload.wikimedia.org/wikipedia/en/3/35/Celtic_FC.svg" },
  { id: "rangers",          name: "Rangers FC",         league: "Scottish Premiership", country: "Scotland", logo: null },

  // ── Belgian Pro League ──────────────────────────────────────────
  { id: "anderlecht",       name: "RSC Anderlecht",     league: "Belgian Pro League", country: "Belgium", logo: null },
  { id: "club-brugge",      name: "Club Brugge",        league: "Belgian Pro League", country: "Belgium", logo: null },
  { id: "genk",             name: "KRC Genk",           league: "Belgian Pro League", country: "Belgium", logo: null },

  // ── Turkey ──────────────────────────────────────────────────────
  { id: "galatasaray",      name: "Galatasaray",        league: "Süper Lig",         country: "Turkey",  logo: null },
  { id: "fenerbahce",       name: "Fenerbahçe",         league: "Süper Lig",         country: "Turkey",  logo: null },
  { id: "besiktas",         name: "Beşiktaş JK",        league: "Süper Lig",         country: "Turkey",  logo: null },
  { id: "trabzonspor",      name: "Trabzonspor",        league: "Süper Lig",         country: "Turkey",  logo: null },

  // ── Russia ──────────────────────────────────────────────────────
  { id: "cska",             name: "CSKA Moscow",        league: "Russian Premier League", country: "Russia", logo: null },
  { id: "spartak",          name: "Spartak Moscow",     league: "Russian Premier League", country: "Russia", logo: null },
  { id: "zenit",            name: "Zenit Saint Petersburg", league: "Russian Premier League", country: "Russia", logo: null },

  // ── Greece ──────────────────────────────────────────────────────
  { id: "olympiacos",       name: "Olympiacos",         league: "Super League Greece", country: "Greece", logo: null },
  { id: "panathinaikos",    name: "Panathinaikos",      league: "Super League Greece", country: "Greece", logo: null },
  { id: "aek-athens",       name: "AEK Athens",         league: "Super League Greece", country: "Greece", logo: null },

  // ── Czech / Slovakia / Poland ───────────────────────────────────
  { id: "slavia-prague",    name: "SK Slavia Prague",   league: "Czech First League", country: "Czech Republic", logo: null },
  { id: "sparta-prague",    name: "AC Sparta Prague",   league: "Czech First League", country: "Czech Republic", logo: null },
  { id: "legia",            name: "Legia Warsaw",       league: "Ekstraklasa",        country: "Poland", logo: null },
  { id: "lech",             name: "Lech Poznań",        league: "Ekstraklasa",        country: "Poland", logo: null },

  // ── Croatia / Serbia / Ukraine ──────────────────────────────────
  { id: "dinamo-zagreb",    name: "GNK Dinamo Zagreb",  league: "HNL",               country: "Croatia",  logo: null },
  { id: "hajduk",           name: "HNK Hajduk Split",   league: "HNL",               country: "Croatia",  logo: null },
  { id: "red-star",         name: "Red Star Belgrade",  league: "SuperLiga",         country: "Serbia",   logo: null },
  { id: "shakhtar",         name: "Shakhtar Donetsk",   league: "Ukrainian Premier", country: "Ukraine",  logo: null },
  { id: "dynamo-kyiv",      name: "Dynamo Kyiv",        league: "Ukrainian Premier", country: "Ukraine",  logo: null },

  // ── Rest of Europe ──────────────────────────────────────────────
  { id: "young-boys",       name: "BSC Young Boys",     league: "Swiss Super League", country: "Switzerland", logo: null },
  { id: "basel",            name: "FC Basel",           league: "Swiss Super League", country: "Switzerland", logo: null },
  { id: "red-bull-salzburg",name: "FC Red Bull Salzburg", league: "Austrian Bundesliga", country: "Austria", logo: null },
  { id: "rapid-wien",       name: "SK Rapid Wien",      league: "Austrian Bundesliga", country: "Austria", logo: null },

  // ── South America ───────────────────────────────────────────────
  { id: "boca-juniors",     name: "Boca Juniors",       league: "Liga Profesional",  country: "Argentina", logo: null },
  { id: "river-plate",      name: "River Plate",        league: "Liga Profesional",  country: "Argentina", logo: null },
  { id: "flamengo",         name: "CR Flamengo",        league: "Brasileirão",       country: "Brazil",  logo: null },
  { id: "palmeiras",        name: "SE Palmeiras",       league: "Brasileirão",       country: "Brazil",  logo: null },
  { id: "santos",           name: "Santos FC",          league: "Brasileirão",       country: "Brazil",  logo: null },
  { id: "fluminense",       name: "Fluminense FC",      league: "Brasileirão",       country: "Brazil",  logo: null },
  { id: "corinthians",      name: "Corinthians",        league: "Brasileirão",       country: "Brazil",  logo: null },

  // ── MLS ─────────────────────────────────────────────────────────
  { id: "la-galaxy",        name: "LA Galaxy",          league: "MLS",               country: "USA",     logo: null },
  { id: "inter-miami",      name: "Inter Miami CF",     league: "MLS",               country: "USA",     logo: null },
  { id: "nycfc",            name: "New York City FC",   league: "MLS",               country: "USA",     logo: null },
  { id: "atlanta-utd",      name: "Atlanta United",     league: "MLS",               country: "USA",     logo: null },
  { id: "seattle",          name: "Seattle Sounders",   league: "MLS",               country: "USA",     logo: null },
  { id: "portland",         name: "Portland Timbers",   league: "MLS",               country: "USA",     logo: null },

  // ── Asia / Africa ───────────────────────────────────────────────
  { id: "al-hilal",         name: "Al-Hilal",           league: "Saudi Pro League",  country: "Saudi Arabia", logo: null },
  { id: "al-nassr",         name: "Al-Nassr",           league: "Saudi Pro League",  country: "Saudi Arabia", logo: null },
  { id: "al-ahly",          name: "Al Ahly SC",         league: "Egyptian Premier",  country: "Egypt",   logo: null },
  { id: "kaizer-chiefs",    name: "Kaizer Chiefs",      league: "Premier Soccer League", country: "South Africa", logo: null },
  { id: "mamelodi",         name: "Mamelodi Sundowns",  league: "Premier Soccer League", country: "South Africa", logo: null },
];

export const FEATURED_IDS = ["real-madrid", "barcelona", "man-city", "bayern"];

export default CLUBS;
