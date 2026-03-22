// Daily puzzle schedule for Do You Know Ball?
// To add a new day: add a new "YYYY-MM-DD" entry and push to GitHub.
// weekBadge: plain text, ~30 chars max. gridLabel: plain text, ~35 chars max.
// ACTIVE_OVERRIDE: set to a "YYYY-MM-DD" string to force that puzzle live for everyone. Set to null to resume normal date-based loading.
const ACTIVE_OVERRIDE = "2026-03-23";
const SITE_NOTICE = null;
const PUZZLES = {
  "2026-03-22": {
    weekBadge: "WEEK 1: THIS IS MARCH",
    gridLabel: "GRID #1: BLUE BLOOD BALLERS",
    cornerPhrase: "First time player, Long time Baller... Welcome.",
    columns: [
      { name: "Duke",      nickname: "Blue Devils", color: "#00539B", border: "#1a7fd4" },
      { name: "UConn",     nickname: "Huskies",     color: "#000E2F", border: "#1a3a88" },
      { name: "Villanova", nickname: "Wildcats",    color: "#003366", border: "#1a5599" },
      { name: "UNC",       nickname: "Tar Heels",   color: "#4B9CD3", border: "#7bbde8" },
    ],
    rows: [
      { name: "Ball Hog",     desc: "Led team in scoring during a Tournament run" },
      { name: "Clutch Balls", desc: "Hit a game-winning shot in March Madness" },
      { name: "Ball Knower",  desc: "Became a broadcaster, analyst, or major media figure" },
      { name: "Ball & Chain", desc: "Won a national championship in their 4th year or more" },
    ],
    answerPool: {
      "0-0": ["Christian Laettner","J.J. Redick","Jay Williams","Shane Battier","Nolan Smith","Tyus Jones","Paolo Banchero","Grayson Allen","Zion Williamson","Johnny Dawkins","Danny Ferry","Jahlil Okafor"],
      "0-1": ["Kemba Walker","Rip Hamilton","Ben Gordon","Shabazz Napier","Ray Allen","Emeka Okafor","Tristen Newton","Jordan Hawkins"],
      "0-2": ["Jalen Brunson","Scottie Reynolds","Allan Ray","Randy Foye","Collin Gillespie","Ryan Arcidiacono","Kris Jenkins","Donte DiVincenzo","Ed Pinckney","Dwayne McClain"],
      "0-3": ["James Worthy","Donald Williams","Sean May","Tyler Hansbrough","Joel Berry II","Wayne Ellington","Marvin Williams","Caleb Love"],
      "1-0": ["Christian Laettner","Tyus Jones"],
      "1-1": ["Kemba Walker","Shabazz Napier","Khalid El-Amin","Rip Hamilton"],
      "1-2": ["Kris Jenkins","Scottie Reynolds","Jalen Brunson"],
      "1-3": ["Charlie Scott","Michael Jordan","Luke Maye","Donald Williams","Caleb Love"],
      "2-0": ["Grant Hill","Jay Bilas","J.J. Redick","Dick Vitale","Seth Davis","Jay Williams","Jim Spanarkel"],
      "2-1": ["Donny Marshall","Rebecca Lobo","Gino Auriemma","Tate George","Donyell Marshall"],
      "2-2": ["Jay Wright","Ed Pinckney"],
      "2-3": ["Antawn Jamison","Brad Daugherty","Eric Montross","Hubert Davis","James Worthy","Joel Berry II","Justin Jackson","Kenny Smith","Marcus Ginyard","Pete Chilcutt","Phil Ford","Rasheed Wallace","Rick Fox","Theo Pinson","Tyler Hansbrough","Tyler Zeller","Vince Carter","Billy Cunningham"],
      "3-0": ["Shane Battier","Clay Buckley","Ron Burt","Ryan Caldbeck","Quinn Cook","Jordan Davidson","Brian Davis","Nate James","Sean Kelly","Greg Koubek","Christian Laettner","J.D. Simpson","Jon Scheyer","Lance Thomas","Brian Zoubek"],
      "3-1": ["Antric Klaiber","Andrew Hurley","Charles Okwandu","Donnell Beverly","E.J. Harrison","Joey Calcaterra","Justin Evanovich","Kyle Bailey","Lasan Kromah","Nahiem Alleyne","Niels Giffey","Rashamel Jones","Ricky Moore","Ryan Swaller","Shabazz Napier","Shamon Tooles","Taliek Brown","Tristen Newton","Tyler Olander"],
      "3-2": ["Ed Pinckney","Dwayne McClain","Gary McLain","Brian Harrington","Ryan Arcidiacono","Daniel Ochefu","Patrick Farrell","Kevin Rafferty","Henry Lowe","Denny Grace","Matt Kennedy","Tom Leibig","Eric Paschall"],
      "3-3": ["Lennie Rosenbluth","Tony Radovich","Bob Young","Jimmy Black","Chris Brust","Jeb Barlow","George Lynch","Henrik Rodl","Matt Wenstrom","Scott Cherry","Travis Stephenson","Jawad Williams","Jackie Manuel","Melvin Scott","C.J. Hooker","Tyler Hansbrough","Danny Green","Bobby Frasor","J.B. Tanner","Patrick Moody","Mike Copeland","Jack Wooten","Marcus Ginyard","Kennedy Meeks","Isaiah Hicks","Nate Britt","Stilman White","Kanler Coker"],
    },
  },
  "2026-03-23": {
    weekBadge: "WEEK 1: THIS IS MARCH",
    gridLabel: "GRID #2: DEUCE BALLERS",
    cornerPhrase: "Ball Two Round.\nTime To Square Up",
    columns: [
      { name: "Kentucky",       nickname: "Wildcats", color: "#0033A0", border: "#4472CA" },
      { name: "Kansas",         nickname: "Jayhawks", color: "#0051A5", border: "#1a6bcc" },
      { name: "Michigan State", nickname: "Spartans", color: "#18453B", border: "#2d7a62" },
      { name: "Indiana",        nickname: "Hoosiers", color: "#990000", border: "#cc3333" },
    ],
    rows: [
      { name: "Ball Screen",        desc: "Set the screen, made the cover — appeared on Sports Illustrated during their college career" },
      { name: "Ball in the Family", desc: "Has a brother who also played D1 college basketball" },
      { name: "High Ball",          desc: "Was a top-5 NBA Draft pick" },
      { name: "Jump Ball",          desc: "Led this team in rebounds during a Tournament run" },
    ],
    answerPool: {
      "0-0": ["Cotton Nash","Pat Riley","Mike Casey","Dan Issel","Mike Flynn","Jack Givens","Sam Bowie","Antoine Walker","John Wall","DeMarcus Cousins","Anthony Davis","Karl-Anthony Towns"],
      "0-1": ["Danny Manning","Andrew Wiggins","Nick Collison","Julian Wright","Mario Chalmers","Thomas Robinson","Sherron Collins","Devonte' Graham","Wayne Selden","Josh Jackson"],
      "0-2": ["Magic Johnson","Mateen Cleaves","Kalin Lucas","Gary Harris"],
      "0-3": ["Kent Benson","Scott May","John Laskowski","Isiah Thomas","Damon Bailey","Steve Alford","Cody Zeller","Victor Oladipo","D.J. White"],
      "1-0": ["Aaron Harrison","Andrew Harrison","Darius Miller","Devin Booker","Rex Chapman"],
      "1-1": ["Marcus Morris","Markieff Morris","Andrew Wiggins","Brandon Rush","Dedric Lawson","K.J. Lawson","Kirk Hinrich","Mario Chalmers"],
      "1-2": ["Foster Loyer","Jeremy Fears Jr.","Shannon Brown","Joey Hauser"],
      "1-3": ["Dick Van Arsdale","Tom Van Arsdale","Cody Zeller","Dane Fife","Andrae Patterson","Steve Alford"],
      "2-0": ["John Wall","Anthony Davis","Michael Kidd-Gilchrist","Sam Bowie","Karl-Anthony Towns","DeMarcus Cousins","De'Aaron Fox","Kenny Walker","Reed Sheppard","Enes Kanter"],
      "2-1": ["Wilt Chamberlain","Danny Manning","Raef LaFrentz","Thomas Robinson","Joel Embiid","Andrew Wiggins","Josh Jackson","Clyde Lovellette"],
      "2-2": ["Magic Johnson","Greg Kelser","Jaren Jackson Jr.","Steve Smith","Jason Richardson"],
      "2-3": ["Walt Bellamy","Kent Benson","Archie Dees","Scott May","Isiah Thomas","Victor Oladipo","Cody Zeller"],
      "3-0": ["Dan Issel","Sam Bowie","Kenny Walker","Nazr Mohammed","Chuck Hayes","Patrick Patterson","DeMarcus Cousins","Anthony Davis","Willie Cauley-Stein","Nick Richards","Oscar Tshiebwe"],
      "3-1": ["Wilt Chamberlain","Clyde Lovellette","Danny Manning","Nick Collison","Raef LaFrentz","Cole Aldrich","Thomas Robinson","Joel Embiid","Udoka Azubuike","David McCormack","Markieff Morris","Dedric Lawson","Hunter Dickinson","Scot Pollard"],
      "3-2": ["Goran Suton","Draymond Green","Branden Dawson","Andre Hutson","Paul Davis","Xavier Tillman","Morris Peterson","Antonio Smith"],
      "3-3": ["Don Schlundt","Archie Dees","Kent Benson","Ray Tolbert","Dean Garrett","Jared Jeffries","Alan Henderson","Cody Zeller"],
    },
  },
};
