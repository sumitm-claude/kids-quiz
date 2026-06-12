import { useState, useEffect, useRef } from "react";

const CATS=["2 Words – One Letter Apart","Anagrammed States","World Capitals","State Capitals","Study-ology","Etymology – Countries","Etymology – Capitals","Etymology – States","Etymology – State Capitals","English – Indian Origin","⚽ Soccer","⚔️ World War I","💣 World War II"];
const DIFFS=["easy","medium","hard"];
const RAW=[
[0,"A sweet baked treat  /  A body of still water",["CAKE","LAKE"],0],
[0,"A large furry forest animal  /  A yellow-green fruit",["BEAR","PEAR"],0],
[0,"Something you read  /  Someone who prepares meals",["BOOK","COOK"],0],
[0,"It floats on water  /  You wear it when cold",["BOAT","COAT"],0],
[0,"A place where people live  /  A tiny furry animal",["HOUSE","MOUSE"],0],
[0,"A small rock  /  A place where you shop",["STONE","STORE"],0],
[0,"What a king or queen wears  /  A sad face",["CROWN","FROWN"],1],
[0,"Water flows down it  /  It rides on tracks",["DRAIN","TRAIN"],1],
[0,"A fuzzy summer fruit  /  What a teacher does",["PEACH","TEACH"],1],
[0,"It flies through the sky  /  What you eat dinner on",["PLANE","PLATE"],1],
[0,"It tells the time  /  A group of birds flying",["CLOCK","FLOCK"],1],
[0,"A prank or magic act  /  Used to build walls",["TRICK","BRICK"],1],
[0,"The opposite of darkness  /  One of your five senses",["LIGHT","SIGHT"],2],
[0,"Left when a tree is cut down  /  Stick it on an envelope",["STUMP","STAMP"],2],
[0,"Season between winter and summer  /  A thin piece of cord",["SPRING","STRING"],2],
[0,"A seat in a park  /  A cluster of grapes or bananas",["BENCH","BUNCH"],2],
[1,"🔀 Unscramble:  XSATE",["TEXAS"],0],[1,"🔀 Unscramble:  DIFAROL",["FLORIDA"],0],
[1,"🔀 Unscramble:  NOROGE",["OREGON"],0],[1,"🔀 Unscramble:  AHTU",["UTAH"],0],
[1,"🔀 Unscramble:  WAIO",["IOWA"],0],[1,"🔀 Unscramble:  ANIME",["MAINE"],0],
[1,"🔀 Unscramble:  OAHID",["IDAHO"],0],[1,"🔀 Unscramble:  NAASSK",["KANSAS"],1],
[1,"🔀 Unscramble:  VAANDE",["NEVADA"],1],[1,"🔀 Unscramble:  AAINZRO",["ARIZONA"],1],
[1,"🔀 Unscramble:  DINAAIN",["INDIANA"],1],[1,"🔀 Unscramble:  AGIOGER",["GEORGIA"],1],
[1,"🔀 Unscramble:  NAATNOM",["MONTANA"],2],[1,"🔀 Unscramble:  ODOLOACR",["COLORADO"],2],
[1,"🔀 Unscramble:  NIHAGCIM",["MICHIGAN"],2],
[2,"🌍 Capital of France?",["PARIS"],0],[2,"🌍 Capital of Japan?",["TOKYO"],0],
[2,"🌍 Capital of Italy?",["ROME"],0],[2,"🌍 Capital of the United Kingdom?",["LONDON"],0],
[2,"🌍 Capital of Germany?",["BERLIN"],0],[2,"🌍 Capital of Spain?",["MADRID"],0],
[2,"🌍 Capital of Russia?",["MOSCOW"],0],[2,"🌍 Capital of India?",["NEW DELHI"],0],
[2,"🌍 Capital of Australia?",["CANBERRA"],1],[2,"🌍 Capital of Brazil?",["BRASILIA","BRASÍLIA"],1],
[2,"🌍 Capital of Canada?",["OTTAWA"],1],[2,"🌍 Capital of Mexico?",["MEXICO CITY"],1],
[2,"🌍 Capital of China?",["BEIJING"],1],[2,"🌍 Capital of Egypt?",["CAIRO"],1],
[2,"🌍 Capital of Argentina?",["BUENOS AIRES"],2],[2,"🌍 Capital of Thailand?",["BANGKOK"],2],
[2,"🌍 Capital of South Korea?",["SEOUL"],2],[2,"🌍 Capital of Greece?",["ATHENS"],2],
[3,"🏛️ Capital of Texas?",["AUSTIN"],0],[3,"🏛️ Capital of Georgia?",["ATLANTA"],0],
[3,"🏛️ Capital of Arizona?",["PHOENIX"],0],[3,"🏛️ Capital of Colorado?",["DENVER"],0],
[3,"🏛️ Capital of Oregon?",["SALEM"],0],[3,"🏛️ Capital of Hawaii?",["HONOLULU"],0],
[3,"🏛️ Capital of California?",["SACRAMENTO"],1],[3,"🏛️ Capital of New York?",["ALBANY"],1],
[3,"🏛️ Capital of Illinois?",["SPRINGFIELD"],1],[3,"🏛️ Capital of Ohio?",["COLUMBUS"],1],
[3,"🏛️ Capital of Michigan?",["LANSING"],1],[3,"🏛️ Capital of Virginia?",["RICHMOND"],1],
[3,"🏛️ Capital of Montana?",["HELENA"],1],[3,"🏛️ Capital of Maine?",["AUGUSTA"],1],
[3,"🏛️ Capital of Washington state?",["OLYMPIA"],2],[3,"🏛️ Capital of Nevada?",["CARSON CITY"],2],
[3,"🏛️ Capital of Utah?",["SALT LAKE CITY"],2],[3,"🏛️ Capital of Alaska?",["JUNEAU"],2],
[3,"🏛️ Capital of Florida?",["TALLAHASSEE"],2],[3,"🏛️ Capital of Minnesota?",["ST. PAUL","SAINT PAUL","ST PAUL"],2],
[4,"🔬 What is the study of living things called?",["BIOLOGY"],0],
[4,"🔬 BIOLOGY is the study of what?",["LIFE","LIVING THINGS","LIVING ORGANISMS"],0],
[4,"🔬 What is the study of rocks and Earth's structure called?",["GEOLOGY"],0],
[4,"🔬 GEOLOGY is the study of what?",["ROCKS","EARTH","THE EARTH"],0],
[4,"🔬 What is the study of the human mind and behavior called?",["PSYCHOLOGY"],0],
[4,"🔬 PSYCHOLOGY is the study of what?",["THE MIND","MIND","BEHAVIOR"],0],
[4,"🔬 What is the study of animals called?",["ZOOLOGY"],0],
[4,"🔬 ZOOLOGY is the study of what?",["ANIMALS"],0],
[4,"🔬 What is the study of weather and the atmosphere called?",["METEOROLOGY"],0],
[4,"🔬 METEOROLOGY is the study of what?",["WEATHER","ATMOSPHERE"],0],
[4,"🔬 What is the study of birds called?",["ORNITHOLOGY"],1],
[4,"🔬 ORNITHOLOGY is the study of what?",["BIRDS"],1],
[4,"🔬 What is the study of ancient life through fossils called?",["PALEONTOLOGY"],1],
[4,"🔬 PALEONTOLOGY is the study of what?",["FOSSILS","ANCIENT LIFE"],1],
[4,"🔬 What is the study of crime and criminals called?",["CRIMINOLOGY"],1],
[4,"🔬 CRIMINOLOGY is the study of what?",["CRIME","CRIMINALS"],1],
[4,"🔬 What is the study of earthquakes called?",["SEISMOLOGY"],1],
[4,"🔬 SEISMOLOGY is the study of what?",["EARTHQUAKES"],1],
[4,"🔬 What is the study of insects called?",["ENTOMOLOGY"],1],
[4,"🔬 ENTOMOLOGY is the study of what?",["INSECTS"],1],
[4,"🔬 What is the study of fish called?",["ICHTHYOLOGY"],2],
[4,"🔬 ICHTHYOLOGY is the study of what?",["FISH"],2],
[4,"🔬 What is the study of reptiles and amphibians called?",["HERPETOLOGY"],2],
[4,"🔬 HERPETOLOGY is the study of what?",["REPTILES","AMPHIBIANS"],2],
[4,"🔬 What is the study of fungi and mushrooms called?",["MYCOLOGY"],2],
[4,"🔬 MYCOLOGY is the study of what?",["FUNGI","MUSHROOMS"],2],
[4,"🔬 What is the study of flags called?",["VEXILLOLOGY"],2],
[4,"🔬 VEXILLOLOGY is the study of what?",["FLAGS"],2],
[4,"🔬 What is the study of ants called?",["MYRMECOLOGY"],2],
[4,"🔬 MYRMECOLOGY is the study of what?",["ANTS"],2],
[5,"🗺️ This country's name means 'Land of the Pure' in Arabic",["PAKISTAN"],0],
[5,"🗺️ This country's name comes from the Latin word for 'silver'",["ARGENTINA"],0],
[5,"🗺️ This country's name means 'Land of the Rising Sun'",["JAPAN"],0],
[5,"🗺️ Named after a red-glowing wood, this South American country's name means 'ember-like'",["BRAZIL"],0],
[5,"🗺️ This country was named after the Franks — a Germanic tribe who once ruled much of Europe",["FRANCE"],0],
[5,"🗺️ This country's name means 'Land of Ice' in Old Norse",["ICELAND"],1],
[5,"🗺️ This Southeast Asian country's name means 'Land of the Free' in its own language",["THAILAND"],1],
[5,"🗺️ This country's name means 'Indian Islands' from Greek words",["INDONESIA"],1],
[5,"🗺️ This Himalayan kingdom is known as the 'Land of the Thunder Dragon'",["BHUTAN"],1],
[5,"🗺️ This country's name comes from Sanskrit meaning 'descendants of Kambu'",["CAMBODIA"],1],
[5,"🗺️ This Central Asian country's name means 'Land of the Wanderers' or 'Land of Free People'",["KAZAKHSTAN"],2],
[5,"🗺️ This East African country's name comes from Greek/Latin meaning 'Red Sea'",["ERITREA"],2],
[5,"🗺️ This nation's double name literally means 'East East' — one word from each language",["TIMOR-LESTE","TIMOR LESTE"],2],
[5,"🗺️ This West African country's name may come from a Mandinka word meaning 'hippopotamus'",["MALI"],2],
[5,"🗺️ This tiny Pacific island nation's name means 'I go to the beach' in its native language",["NAURU"],2],
[6,"🏙️ This Norwegian capital's name means 'mouth of the river' in Old Norse",["OSLO"],0],
[6,"🏙️ This Kenyan capital was named after a Maasai watering hole meaning 'cold water'",["NAIROBI"],0],
[6,"🏙️ This Pakistani capital literally means 'city of Islam'",["ISLAMABAD"],0],
[6,"🏙️ This French capital was named after the Parisii — a Gallic tribe who lived on the Seine",["PARIS"],0],
[6,"🏙️ This Italian capital may come from an old word meaning 'strength'",["ROME"],0],
[6,"🏙️ This Australian capital's name comes from an Aboriginal word meaning 'meeting place'",["CANBERRA"],1],
[6,"🏙️ This Uruguayan capital's name is Portuguese for 'I saw a mountain'",["MONTEVIDEO"],1],
[6,"🏙️ This Nepalese capital means 'wooden temple' in Sanskrit",["KATHMANDU"],1],
[6,"🏙️ This Ethiopian capital means 'new flower' in Amharic",["ADDIS ABABA"],1],
[6,"🏙️ This Thai capital's short name means 'city of angels' — its full name is the world's longest",["BANGKOK"],1],
[6,"🏙️ This Burkina Faso capital means 'city of the upright people' in Mooré",["OUAGADOUGOU"],2],
[6,"🏙️ This Mongolian capital means 'red hero' in Mongolian",["ULAANBAATAR"],2],
[6,"🏙️ This Honduran capital's name means 'silver hills' in Nahuatl",["TEGUCIGALPA"],2],
[6,"🏙️ This Irish capital comes from Old Irish 'Dubh Linn' meaning 'black pool'",["DUBLIN"],2],
[6,"🏙️ This Egyptian capital's Arabic name 'Al-Qahira' means 'the victorious'",["CAIRO"],2],
[7,"📍 This state's name comes from a Caddo word meaning 'friends' or 'allies'",["TEXAS"],0],
[7,"📍 This state's name comes from the Spanish word for 'snow-capped'",["NEVADA"],0],
[7,"📍 This state's name comes from Spanish meaning 'mountainous'",["MONTANA"],0],
[7,"📍 This state's name comes from Spanish meaning 'colored red' — referring to its red rivers",["COLORADO"],0],
[7,"📍 This state's name comes from a Sioux phrase meaning 'sky-tinted water'",["MINNESOTA"],0],
[7,"📍 This state's name means 'long tidal river' in Mohegan-Pequot",["CONNECTICUT"],1],
[7,"📍 This state's name means 'great river' in Ojibwe — same name as its famous river",["MISSISSIPPI"],1],
[7,"📍 This state was named after Queen Elizabeth I — known as the 'Virgin Queen'",["VIRGINIA"],1],
[7,"📍 This state's name comes from French meaning 'green mountains'",["VERMONT"],1],
[7,"📍 This state's name comes from Spanish for 'land of flowers' — named during a flower festival",["FLORIDA"],1],
[7,"📍 This state was named after Queen Henrietta Maria, wife of King Charles I of England",["MARYLAND"],2],
[7,"📍 This state's name comes from an Algonquian phrase meaning 'near the great hill'",["MASSACHUSETTS"],2],
[7,"📍 This state's name comes from the Ute people — 'Yuta' means 'those who are higher up'",["UTAH"],2],
[7,"📍 This state's name comes from an Ojibwe word possibly meaning 'it lies red'",["WISCONSIN"],2],
[7,"📍 This state may be named after the Ioway people, whose name may mean 'sleepy ones'",["IOWA"],2],
[8,"🏛️ This Arizona capital was named after the mythical bird that rises from ashes",["PHOENIX"],0],
[8,"🏛️ This Colorado capital was named after Kansas Territory governor James W. Denver",["DENVER"],0],
[8,"🏛️ This Oregon capital's name comes from the Hebrew word for 'peace'",["SALEM"],0],
[8,"🏛️ This Montana capital was named after St. Helena, a city in Minnesota",["HELENA"],0],
[8,"🏛️ This Alaska capital was named after gold prospector Joseph Juneau",["JUNEAU"],0],
[8,"🏛️ This Louisiana capital's name is French for 'red stick'",["BATON ROUGE"],1],
[8,"🏛️ This Idaho capital's name comes from French 'les bois' meaning 'the woods'",["BOISE"],1],
[8,"🏛️ This South Dakota capital was named after a French explorer and fur trader",["PIERRE"],1],
[8,"🏛️ This California capital's name is Spanish meaning 'blessed sacrament'",["SACRAMENTO"],1],
[8,"🏛️ This Georgia capital's name references the Western & Atlantic Railroad terminus",["ATLANTA"],1],
[8,"🏛️ This Florida capital comes from an Apalachee word meaning 'old fields'",["TALLAHASSEE"],2],
[8,"🏛️ This Wyoming capital was named after the Cheyenne people — meaning 'people of alien speech'",["CHEYENNE"],2],
[8,"🏛️ This Vermont capital was named after the city of Montpellier in France",["MONTPELIER"],2],
[8,"🏛️ This Hawaii capital's name means 'sheltered harbor' in Hawaiian",["HONOLULU"],2],
[8,"🏛️ This Nevada capital was named after the Carson River — named after frontiersman Kit Carson",["CARSON CITY"],2],
[9,"🇮🇳 This word for a dense forest came from Hindi/Sanskrit 'jangal'",["JUNGLE"],0],
[9,"🇮🇳 This word for washing your hair came from Hindi 'champo' meaning to press or massage",["SHAMPOO"],0],
[9,"🇮🇳 This word for loose sleeping clothes came from Hindi/Urdu 'payjama' meaning leg garment",["PAJAMAS","PYJAMAS"],0],
[9,"🇮🇳 This word for a single-story home came from Hindi 'bangla' meaning 'belonging to Bengal'",["BUNGALOW"],0],
[9,"🇮🇳 This word for an online character came from Sanskrit 'avatara' meaning descent",["AVATAR"],0],
[9,"🇮🇳 This word meaning to plunder or steal came from Hindi 'lut'",["LOOT"],1],
[9,"🇮🇳 This word for a violent criminal came from Hindi 'thag' meaning swindler",["THUG"],1],
[9,"🇮🇳 This word for cotton work-wear came from Hindi 'dungri' — a cloth from Mumbai",["DUNGAREE","DUNGAREES"],1],
[9,"🇮🇳 This fruity drink's name came from Sanskrit 'pancha' meaning five — for its five ingredients",["PUNCH"],1],
[9,"🇮🇳 This word meaning easy or comfortable came from Hindi/Urdu 'khush' meaning pleasant",["CUSHY"],1],
[9,"🇮🇳 This word for patterned cloth came from Hindi 'bandhana' meaning to tie",["BANDANA"],2],
[9,"🇮🇳 This word for a small flat-bottomed boat came from Bengali 'dingi'",["DINGHY"],2],
[9,"🇮🇳 This word for a massive unstoppable force came from Sanskrit 'Jagannath' — a title of Vishnu",["JUGGERNAUT"],2],
[9,"🇮🇳 This word for a thin cigar came from Tamil 'churuttu' meaning roll",["CHEROOT"],2],
[9,"🇮🇳 This spiced soup's name came from Tamil 'milagu tannir' meaning pepper water",["MULLIGATAWNY"],2],
[10,"⚽ Erling Haaland plays for which Premier League club?",["MANCHESTER CITY","MAN CITY"],0],
[10,"⚽ Which club plays their home games at Old Trafford?",["MANCHESTER UNITED","MAN UNITED","MAN UTD"],0],
[10,"⚽ Kylian Mbappe joined which Spanish club in 2024?",["REAL MADRID"],0],
[10,"⚽ Harry Kane plays for which Bundesliga club?",["BAYERN MUNICH","FC BAYERN MUNICH","FC BAYERN"],0],
[10,"⚽ Which Spanish club is nicknamed 'Barça'?",["BARCELONA","FC BARCELONA"],0],
[10,"⚽ Jude Bellingham plays for which Spanish club?",["REAL MADRID"],1],
[10,"⚽ Which Premier League club plays their home games at Anfield?",["LIVERPOOL","LIVERPOOL FC"],1],
[10,"⚽ Lamine Yamal plays for which La Liga club?",["BARCELONA","FC BARCELONA"],1],
[10,"⚽ Which Bundesliga club plays in Dortmund and wears yellow and black?",["BORUSSIA DORTMUND","BVB"],1],
[10,"⚽ Arsenal play their home games at which stadium?",["EMIRATES STADIUM","THE EMIRATES"],1],
[10,"⚽ Bukayo Saka plays for which Premier League club?",["ARSENAL"],2],
[10,"⚽ Robert Lewandowski plays for which La Liga club?",["BARCELONA","FC BARCELONA"],2],
[10,"⚽ Which La Liga club plays at the Wanda Metropolitano stadium?",["ATLETICO MADRID","ATLETICO DE MADRID"],2],
[10,"⚽ Florian Wirtz plays for which Bundesliga club?",["BAYER LEVERKUSEN","BAYER 04 LEVERKUSEN"],2],
[10,"⚽ Manchester City play their home games at which stadium?",["ETIHAD STADIUM","THE ETIHAD"],2],
[11,"⚔️ WW1: In what year did World War I begin?",["1914"],0],
[11,"⚔️ WW1: In what year did World War I end?",["1918"],0],
[11,"⚔️ WW1: Which archduke's assassination in 1914 triggered World War I?",["FRANZ FERDINAND","ARCHDUKE FRANZ FERDINAND","FRANZ FERDINAND OF AUSTRIA"],0],
[11,"⚔️ WW1: What were Germany, Austria-Hungary, and the Ottoman Empire collectively called?",["CENTRAL POWERS","THE CENTRAL POWERS"],0],
[11,"⚔️ WW1: Name one of the main Allied Powers in WW1",["BRITAIN","FRANCE","RUSSIA","USA","UNITED STATES","UNITED KINGDOM","UK","ITALY"],0],
[11,"⚔️ WW1: In which Bosnian city was Archduke Franz Ferdinand assassinated?",["SARAJEVO"],1],
[11,"⚔️ WW1: What new weapon — used in the trenches — caused horrific casualties on both sides?",["POISON GAS","GAS","MUSTARD GAS","CHEMICAL WEAPONS"],1],
[11,"⚔️ WW1: The famous British ocean liner sunk by Germany in 1915, helping turn US opinion against Germany?",["LUSITANIA","RMS LUSITANIA"],1],
[11,"⚔️ WW1: What type of vehicle — a heavily armoured tracked machine — was first used in battle in WW1?",["TANK","TANKS"],1],
[11,"⚔️ WW1: The peace treaty that formally ended WW1 was signed in which French palace?",["VERSAILLES","PALACE OF VERSAILLES"],1],
[11,"⚔️ WW1: What nickname was given to the German flying ace Manfred von Richthofen?",["RED BARON","THE RED BARON"],2],
[11,"⚔️ WW1: What was the secret German telegram to Mexico, offering US territory if Mexico attacked America?",["ZIMMERMANN TELEGRAM","ZIMMERMANN NOTE","ZIMMERMAN TELEGRAM"],2],
[11,"⚔️ WW1: Which Russian tsar was overthrown during WW1, ending centuries of royal rule?",["NICHOLAS II","TSAR NICHOLAS II","TSAR NICHOLAS"],2],
[11,"⚔️ WW1: The bloodiest battle of WW1 — fought in France in 1916 along a river — was the Battle of the…?",["SOMME","BATTLE OF THE SOMME"],2],
[11,"⚔️ WW1: What four-letter word describes the new style of combat where soldiers dug lines into the ground?",["TRENCH"],2],
[12,"💣 WW2: In what year did World War II begin?",["1939"],0],
[12,"💣 WW2: In what year did World War II end?",["1945"],0],
[12,"💣 WW2: Who was the leader of Nazi Germany during World War II?",["ADOLF HITLER","HITLER"],0],
[12,"💣 WW2: Which country dropped atomic bombs on Japan to end the war in 1945?",["UNITED STATES","USA","AMERICA","THE UNITED STATES"],0],
[12,"💣 WW2: Who was Britain's Prime Minister for most of World War II?",["WINSTON CHURCHILL","CHURCHILL"],0],
[12,"💣 WW2: What was the surprise Japanese attack in December 1941 that brought the USA into WW2?",["PEARL HARBOR","ATTACK ON PEARL HARBOR","BOMBING OF PEARL HARBOR"],1],
[12,"💣 WW2: What was the German word for 'lightning war' — their fast invasion strategy?",["BLITZKRIEG"],1],
[12,"💣 WW2: Which Japanese city was hit by the first atomic bomb ever used in war, in August 1945?",["HIROSHIMA"],1],
[12,"💣 WW2: What date in June 1944 is known as 'D-Day', when Allies landed in Normandy?",["JUNE 6","JUNE 6TH","6 JUNE","D-DAY","6TH JUNE"],1],
[12,"💣 WW2: Which country did Germany invade on September 1, 1939, starting World War II?",["POLAND"],1],
[12,"💣 WW2: What was the code name for Germany's 1941 invasion of the Soviet Union?",["OPERATION BARBAROSSA","BARBAROSSA"],2],
[12,"💣 WW2: What was the name of the German cipher machine whose codes the Allies secretly cracked?",["ENIGMA","ENIGMA MACHINE"],2],
[12,"💣 WW2: Who was the leader of the Soviet Union during World War II?",["JOSEPH STALIN","STALIN"],2],
[12,"💣 WW2: The 1938 agreement that let Hitler take part of Czechoslovakia without a fight was signed in which city?",["MUNICH"],2],
[12,"💣 WW2: Which Japanese admiral planned and led the attack on Pearl Harbor?",["YAMAMOTO","ISOROKU YAMAMOTO"],2],
];

const Q=RAW.map(([c,q,a,d])=>({cat:CATS[c],q,a,d:DIFFS[d]}));
const PAL=[
  {bg:"#FF6B6B",lt:"#fff0f0"},{bg:"#4ECDC4",lt:"#f0fffe"},{bg:"#45B7D1",lt:"#f0faff"},
  {bg:"#7C83FD",lt:"#f2f0ff"},{bg:"#F7B731",lt:"#fffbf0"},{bg:"#FC5C65",lt:"#fff0f1"},
  {bg:"#26de81",lt:"#f0fff6"},{bg:"#fd9644",lt:"#fff4ee"},{bg:"#a55eea",lt:"#f8f0ff"},
  {bg:"#2bcbba",lt:"#f0fffd"},{bg:"#27ae60",lt:"#f0fff4"},{bg:"#e84393",lt:"#fff0f8"},{bg:"#0a9396",lt:"#f0fafa"},{bg:"#e9c46a",lt:"#fffbee"},
];
function getCol(cat,xC){const i=CATS.indexOf(cat);return i>=0?PAL[i]:PAL[11+(Math.max(0,xC.indexOf(cat))%3)];}
function shuf(a){return[...a].sort(()=>Math.random()-.5);}
function norm(s){return s.toUpperCase().replace(/[^A-Z0-9 ]/g,"").replace(/\s+/g," ").trim();}
function chk(inp,q){
  const n=norm(inp);if(!n)return false;
  if(q.cat===CATS[0])return q.a.every(w=>n.includes(norm(w)));
  return q.a.some(a=>norm(a)===n);
}
function mkHint(q){
  if(q.cat===CATS[0])return q.a.map(w=>w.split('').map(()=>'_').join(' ')).join('  /  ');
  return q.a[0].split(' ').map(w=>w.split('').map(()=>'_').join(' ')).join('  ');
}
const LVS=[{id:"easy",lbl:"Easy",em:"🟢",col:"#28a745",at:0},{id:"medium",lbl:"Medium",em:"🟡",col:"#e6a817",at:10},{id:"hard",lbl:"Hard",em:"🔴",col:"#dc3545",at:25}];
const OKM=["Awesome! 🎉","You got it! ⭐","Nailed it! 🌟","Brilliant! 🏆","Yes!! 🎊","Superstar! 🌠","Correct! 🎯","Great job! 🙌"];
const ERM=["Nice try! 💪","So close! 📚","Keep going! 🌱","Almost! 🤔","Not quite! 🤗","You'll get the next one! ✨"];

// Calls the secure Vercel proxy — API key stays on the server
async function aiGen(cat,setSt){
  setSt("🤖 AI is writing questions…");
  const r=await fetch('/api/generate',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({category:cat})});
  if(!r.ok)throw new Error('Failed');
  return await r.json();
}

function ls(k,fb){try{const v=localStorage.getItem(k);return v!=null?JSON.parse(v):fb;}catch{return fb;}}
function lsSet(k,v){try{localStorage.setItem(k,JSON.stringify(v));}catch{}}

function PinPad({title,sub,onOk,cPin=null}){
  const[digs,setDigs]=useState([]);
  const[phase,setPhase]=useState("e");
  const[first,setFirst]=useState(null);
  const[shk,setShk]=useState(false);
  const[err,setErr]=useState("");
  function press(d){
    if(digs.length>=4)return;
    const n=[...digs,d];setDigs(n);setErr("");
    if(n.length===4)setTimeout(()=>go(n),120);
  }
  function go(en){
    const c=en.join("");
    if(cPin!=null){
      if(c===cPin)onOk();
      else{setErr("Wrong PIN.");setShk(true);setTimeout(()=>{setShk(false);setDigs([]);},600);}
    }else{
      if(phase==="e"){setFirst(c);setPhase("c");setDigs([]);}
      else if(c===first)onOk(c);
      else{setErr("Didn't match. Try again.");setShk(true);setTimeout(()=>{setShk(false);setDigs([]);setPhase("e");setFirst(null);},600);}
    }
  }
  const lbl=cPin?title:phase==="e"?title:"Confirm your PIN";
  const sb=cPin?sub:phase==="e"?sub:"Enter the same PIN again";
  return(
    <div style={{minHeight:"100vh",background:"linear-gradient(135deg,#667eea,#764ba2)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Nunito',cursive",padding:20}}>
      <div style={{background:"white",borderRadius:28,padding:"34px 26px",maxWidth:300,width:"100%",textAlign:"center",boxShadow:"0 24px 64px rgba(0,0,0,.3)"}}>
        <div style={{fontSize:42,marginBottom:8}}>🔐</div>
        <h2 style={{color:"#333",margin:"0 0 4px",fontSize:23}}>{lbl}</h2>
        <p style={{color:"#aaa",fontSize:14,margin:"0 0 20px"}}>{sb}</p>
        <div style={{display:"flex",justifyContent:"center",gap:13,marginBottom:20,animation:shk?"shake .5s":"none"}}>
          {[0,1,2,3].map(i=><div key={i} style={{width:15,height:15,borderRadius:"50%",border:"2.5px solid #7C83FD",background:digs[i]!=null?"#7C83FD":"transparent",transition:"background .15s"}}/>)}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:10}}>
          {[1,2,3,4,5,6,7,8,9].map(n=>(
            <button key={n} onClick={()=>press(String(n))} style={{background:"#f4f4f4",border:"none",borderRadius:13,padding:"14px 0",fontSize:24,fontWeight:700,color:"#333",cursor:"pointer",fontFamily:"inherit"}}>{n}</button>
          ))}
          <div/>
          <button onClick={()=>press("0")} style={{background:"#f4f4f4",border:"none",borderRadius:13,padding:"14px 0",fontSize:24,fontWeight:700,color:"#333",cursor:"pointer",fontFamily:"inherit"}}>0</button>
          <button onClick={()=>setDigs(d=>d.slice(0,-1))} style={{background:"#f4f4f4",border:"none",borderRadius:13,padding:"14px 0",fontSize:19,cursor:"pointer",fontFamily:"inherit"}}>⌫</button>
        </div>
        {err&&<p style={{color:"#dc3545",fontSize:14,margin:0,fontWeight:600}}>{err}</p>}
      </div>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap');@keyframes shake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-7px)}40%,80%{transform:translateX(7px)}}`}</style>
    </div>
  );
}

function UnlockModal({lv,onClose}){
  const L=LVS.find(l=>l.id===lv);
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.75)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:200,padding:20}}>
      <div style={{background:"white",borderRadius:28,padding:"34px 22px",maxWidth:320,width:"100%",textAlign:"center",boxShadow:"0 24px 64px rgba(0,0,0,.4)"}}>
        <div style={{fontSize:68,marginBottom:8}}>{lv==="hard"?"🔥":"⭐"}</div>
        <h2 style={{color:"#333",fontSize:28,margin:"0 0 8px"}}>{L.lbl} Mode Unlocked!</h2>
        <p style={{color:"#555",fontSize:18,margin:"0 0 4px"}}>You answered <strong style={{color:L.col}}>{L.at} questions</strong> correctly!</p>
        <p style={{color:"#aaa",fontSize:16,margin:"0 0 22px"}}>{lv==="hard"?"Ready for the toughest challenges!":"Ready for something harder?"}</p>
        <div style={{display:"flex",gap:8,justifyContent:"center"}}>
          <button onClick={()=>onClose(false)} style={{background:"#f0f0f0",color:"#666",border:"none",borderRadius:13,padding:"10px 15px",fontSize:16,cursor:"pointer",fontFamily:"inherit",fontWeight:700}}>Stay here</button>
          <button onClick={()=>onClose(true)} style={{background:`linear-gradient(135deg,${L.col},#764ba2)`,color:"white",border:"none",borderRadius:13,padding:"10px 15px",fontSize:16,cursor:"pointer",fontFamily:"inherit",fontWeight:700}}>Try {L.em} {L.lbl}! →</button>
        </div>
      </div>
    </div>
  );
}

export default function App(){
  // PIN — persisted
  const[pin,setPin]=useState(()=>ls('kq_pin',null));
  const[psc,setPsc]=useState(null);
  // Questions — persisted
  const[xQs,setXQs]=useState(()=>ls('kq_xqs',[]));
  const[xC,setXC]=useState(()=>ls('kq_xc',[]));
  const[actC,setActC]=useState(()=>ls('kq_actc',null));
  // Difficulty unlock — persisted
  const[unlk,setUnlk]=useState(()=>ls('kq_unlk',["easy"]));
  const[lv,setLv]=useState(()=>ls('kq_lv',"easy"));
  // UI
  const[sc,setSc]=useState("who");
  const[gen,setGen]=useState(false);
  const[gSt,setGSt]=useState("");
  const[gErr,setGErr]=useState("");
  const[nCat,setNCat]=useState("");
  const[popup,setPopup]=useState(null);
  // Quiz state
  const[que,setQue]=useState([]);
  const[qi,setQi]=useState(0);
  const[cor,setCor]=useState(()=>ls('kq_cor',0));
  const[tot,setTot]=useState(0);
  const[str,setStr]=useState(0);
  const[bst,setBst]=useState(()=>ls('kq_bst',0));
  const[inp,setInp]=useState("");
  const[profile,setProfile]=useState(null);
  const[recents,setRecents]=useState(()=>ls('kq_recents',[]));
  const[newName,setNewName]=useState('');
  const[newPin,setNewPin]=useState(null);
  const[loginDigs,setLoginDigs]=useState([]);
  const[loginErr,setLoginErr]=useState('');
  const[profileLoading,setProfileLoading]=useState(false);
  const[sub,setSub]=useState(false);
  const[isOk,setIsOk]=useState(false);
  const[shint,setShint]=useState(false);
  const[msg,setMsg]=useState("");
  const[anm,setAnm]=useState("");
  const iRef=useRef(null);
  const fetchingRef=useRef(false);

  // Persist key state
  useEffect(()=>{if(pin)lsSet('kq_pin',pin);},[pin]);
  useEffect(()=>{lsSet('kq_unlk',unlk);},[unlk]);
  useEffect(()=>{lsSet('kq_lv',lv);},[lv]);
  useEffect(()=>{lsSet('kq_xqs',xQs);},[xQs]);
  useEffect(()=>{lsSet('kq_xc',xC);},[xC]);
  useEffect(()=>{lsSet('kq_actc',actC);},[actC]);
  useEffect(()=>{lsSet('kq_cor',cor);},[cor]);
  useEffect(()=>{lsSet('kq_bst',bst);},[bst]);

  const allQ=[...Q,...xQs];
  const allC=[...new Set(allQ.map(q=>q.cat))];
  const act=actC||allC;
  const pool=allQ.filter(q=>act.includes(q.cat)&&q.d===lv);
  const q=pool.length>0&&que.length>0?que[qi%que.length]:null;
  const col=q?getCol(q.cat,xC):PAL[0];
  const pct=tot>0?Math.round((cor/tot)*100):0;

  useEffect(()=>{if(pool.length>0){setQue(shuf(pool));setQi(0);rst();}},[lv,JSON.stringify(actC)]);
  useEffect(()=>{
    if(cor>=25&&!unlk.includes("hard")){const nu=["easy","medium","hard"];setUnlk(nu);setPopup("hard");saveProfile({correct:cor,best_streak:bst,unlocked:nu,level:lv});}
    else if(cor>=10&&!unlk.includes("medium")){const nu=["easy","medium"];setUnlk(nu);setPopup("medium");saveProfile({correct:cor,best_streak:bst,unlocked:nu,level:lv});}
  },[cor]);
  useEffect(()=>{if(sc==="quiz"&&!sub&&iRef.current)iRef.current.focus();},[qi,sub,sc]);

  function rst(){setInp("");setSub(false);setIsOk(false);setShint(false);setMsg("");setAnm("");}
  function openMenu(){if(!pin)setPsc("setup");else setPsc("enter");}
  function toggleCat(c){const cur=actC||allC;if(cur.length===1&&cur[0]===c)return;setActC(cur.includes(c)?cur.filter(x=>x!==c):[...cur,c]);}

  function doSub(){
    if(sub||!inp.trim()||!q)return;
    const ok=chk(inp,q);setIsOk(ok);setTot(t=>t+1);
    if(ok){const nc=cor+1;setCor(nc);const ns=str+1;setStr(ns);const nb=Math.max(bst,ns);setBst(nb);setMsg(OKM[~~(Math.random()*OKM.length)]);setAnm("pop");saveProfile({correct:nc,best_streak:nb,unlocked:unlk,level:lv});}
    else{setStr(0);setMsg(ERM[~~(Math.random()*ERM.length)]);setAnm("wiggle");}
    setSub(true);setTimeout(()=>setAnm(""),600);
  }
  async function fetchMore(){
    if(fetchingRef.current)return;
    fetchingRef.current=true;
    const cats=[...new Set(pool.map(q=>q.cat))];
    await Promise.all(cats.map(async cat=>{
      const existing=allQ.filter(q=>q.cat===cat).map(q=>q.q);
      try{
        const r=await fetch('/api/generate',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({category:cat,existing})});
        if(!r.ok)return;
        const qs=await r.json();
        const deduped=qs.filter(nq=>!allQ.some(eq=>norm(eq.q)===norm(nq.q)));
        if(deduped.length>0)setXQs(p=>[...p,...deduped]);
      }catch{}
    }));
    fetchingRef.current=false;
  }
  function nxt(){const ni=qi+1;if(ni%pool.length===0){setQue(shuf(pool));fetchMore();}setQi(ni);rst();}
  function hk(e){if(e.key==="Enter")sub?nxt():doSub();}

  function saveProfile(updates){if(!profile)return;fetch('/api/profile/save',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:profile.id,...updates})}).catch(()=>{});}
  function applyProfile(p){setUnlk(p.unlocked);setLv(p.level);setCor(p.correct);setBst(p.best_streak);setProfile(p);setTot(0);setStr(0);const u=[{name:p.name,pin:p.pin},...recents.filter(r=>r.pin!==p.pin)].slice(0,4);setRecents(u);lsSet('kq_recents',u);setSc('quiz');}
  async function fetchProfile(pin){setProfileLoading(true);setLoginErr('');try{const r=await fetch('/api/profile/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({pin})});if(!r.ok){setLoginErr('PIN not found. Try again.');setLoginDigs([]);return;}const p=await r.json();applyProfile(p);}catch{setLoginErr('Connection error. Try again.');setLoginDigs([]);}finally{setProfileLoading(false);}}
  async function doCreate(){if(!newName.trim()||profileLoading)return;setProfileLoading(true);try{const r=await fetch('/api/profile/create',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:newName.trim()})});const p=await r.json();setNewPin(p.pin);applyProfile(p);}catch{}finally{setProfileLoading(false);}}
  function pressLoginDig(n){if(loginDigs.length>=4||profileLoading)return;const nd=[...loginDigs,String(n)];setLoginDigs(nd);if(nd.length===4)fetchProfile(nd.join(''));}
  function changeLv(v){setLv(v);saveProfile({correct:cor,best_streak:bst,unlocked:unlk,level:v});}

  async function doGen(){
    const name=nCat.trim();
    if(!name||gen)return;
    if(allC.map(c=>c.toLowerCase()).includes(name.toLowerCase())){setGErr("That category already exists!");return;}
    setGen(true);setGErr("");setGSt("");
    try{
      const qs=await aiGen(name,setGSt);
      setXQs(p=>[...p,...qs]);setXC(p=>[...p,name]);
      setActC(p=>p?[...p,name]:null);
      setNCat("");setGSt(`✅ Added "${name}" — ${qs.length} questions across all levels!`);
    }catch{setGErr("Something went wrong. Try again.");setGSt("");}
    setGen(false);
  }

  if(newPin)return(
    <div style={{minHeight:"100vh",background:"linear-gradient(135deg,#667eea,#764ba2)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Nunito',cursive",padding:20}}>
      <div style={{background:"white",borderRadius:28,padding:"34px 24px",maxWidth:340,width:"100%",textAlign:"center",boxShadow:"0 24px 64px rgba(0,0,0,.3)"}}>
        <div style={{fontSize:52,marginBottom:8}}>🎉</div>
        <h2 style={{color:"#333",margin:"0 0 6px",fontSize:24}}>Hi {profile?.name}!</h2>
        <p style={{color:"#666",fontSize:15,margin:"0 0 16px"}}>Your secret PIN is — write it down!</p>
        <div style={{background:"#f0f2ff",borderRadius:16,padding:"18px 0",fontSize:44,fontWeight:800,letterSpacing:10,color:"#7C83FD",marginBottom:16}}>{newPin}</div>
        <p style={{color:"#aaa",fontSize:13,margin:"0 0 20px"}}>You'll need this to play on a different device.</p>
        <button onClick={()=>setNewPin(null)} style={{background:"linear-gradient(135deg,#7C83FD,#764ba2)",color:"white",border:"none",borderRadius:14,padding:"13px 28px",fontSize:18,cursor:"pointer",fontFamily:"inherit",fontWeight:800,width:"100%"}}>Let's play! →</button>
      </div>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap');`}</style>
    </div>
  );
  if(sc==="who"||sc==="newq"||sc==="pinlogin")return(
    <div style={{minHeight:"100vh",background:"linear-gradient(135deg,#667eea,#764ba2)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Nunito',cursive",padding:20}}>
      <div style={{maxWidth:400,width:"100%",textAlign:"center"}}>
        {sc==="pinlogin"?(
          <>
            <div style={{fontSize:44,marginBottom:8}}>🔑</div>
            <h2 style={{color:"white",fontSize:26,margin:"0 0 4px"}}>Enter your PIN</h2>
            <p style={{color:"rgba(255,255,255,.7)",fontSize:15,margin:"0 0 20px"}}>Your 4-digit PIN</p>
            <div style={{background:"white",borderRadius:24,padding:"24px 20px",boxShadow:"0 24px 64px rgba(0,0,0,.3)"}}>
              <div style={{display:"flex",justifyContent:"center",gap:13,marginBottom:20}}>
                {[0,1,2,3].map(i=><div key={i} style={{width:15,height:15,borderRadius:"50%",border:"2.5px solid #7C83FD",background:loginDigs[i]!=null?"#7C83FD":"transparent",transition:"background .15s"}}/>)}
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:10}}>
                {[1,2,3,4,5,6,7,8,9].map(n=><button key={n} onClick={()=>pressLoginDig(n)} disabled={profileLoading} style={{background:"#f4f4f4",border:"none",borderRadius:13,padding:"14px 0",fontSize:24,fontWeight:700,color:"#333",cursor:"pointer",fontFamily:"inherit"}}>{n}</button>)}
                <div/>
                <button onClick={()=>pressLoginDig(0)} disabled={profileLoading} style={{background:"#f4f4f4",border:"none",borderRadius:13,padding:"14px 0",fontSize:24,fontWeight:700,color:"#333",cursor:"pointer",fontFamily:"inherit"}}>0</button>
                <button onClick={()=>setLoginDigs(d=>d.slice(0,-1))} style={{background:"#f4f4f4",border:"none",borderRadius:13,padding:"14px 0",fontSize:19,cursor:"pointer",fontFamily:"inherit"}}>⌫</button>
              </div>
              {loginErr&&<p style={{color:"#dc3545",fontSize:14,margin:"0 0 6px",fontWeight:600}}>{loginErr}</p>}
              {profileLoading&&<p style={{color:"#7C83FD",fontSize:14,margin:0}}>Loading…</p>}
            </div>
            <button onClick={()=>{setSc("who");setLoginDigs([]);setLoginErr('');}} style={{marginTop:14,background:"rgba(255,255,255,.2)",border:"none",color:"white",borderRadius:12,padding:"10px 20px",fontSize:15,cursor:"pointer",fontFamily:"inherit",fontWeight:700}}>← Back</button>
          </>
        ):sc==="newq"?(
          <>
            <div style={{fontSize:44,marginBottom:8}}>✨</div>
            <h2 style={{color:"white",fontSize:26,margin:"0 0 4px"}}>New Quizzer</h2>
            <p style={{color:"rgba(255,255,255,.7)",fontSize:15,margin:"0 0 20px"}}>What's your name?</p>
            <div style={{background:"white",borderRadius:24,padding:"24px 20px",boxShadow:"0 24px 64px rgba(0,0,0,.3)"}}>
              <input autoFocus value={newName} onChange={e=>setNewName(e.target.value)} onKeyDown={e=>e.key==='Enter'&&doCreate()} placeholder="Your name…" style={{width:"100%",border:"2.5px solid #7C83FD",borderRadius:11,padding:"11px 13px",fontSize:20,fontFamily:"inherit",outline:"none",color:"#333",boxSizing:"border-box",marginBottom:12}}/>
              <button onClick={doCreate} disabled={!newName.trim()||profileLoading} style={{width:"100%",background:newName.trim()&&!profileLoading?"linear-gradient(135deg,#7C83FD,#764ba2)":"#ddd",color:"white",border:"none",borderRadius:13,padding:"13px 0",fontSize:18,cursor:newName.trim()&&!profileLoading?"pointer":"default",fontFamily:"inherit",fontWeight:800}}>{profileLoading?"Creating…":"Start! →"}</button>
            </div>
            <button onClick={()=>{setSc("who");setNewName('');}} style={{marginTop:14,background:"rgba(255,255,255,.2)",border:"none",color:"white",borderRadius:12,padding:"10px 20px",fontSize:15,cursor:"pointer",fontFamily:"inherit",fontWeight:700}}>← Back</button>
          </>
        ):(
          <>
            <div style={{fontSize:52,marginBottom:8}}>👋</div>
            <h2 style={{color:"white",fontSize:28,margin:"0 0 4px"}}>Who's playing?</h2>
            <p style={{color:"rgba(255,255,255,.7)",fontSize:16,margin:"0 0 22px"}}>Tap your name to start</p>
            {recents.length>0&&(
              <div style={{display:"grid",gridTemplateColumns:recents.length===1?"1fr":"1fr 1fr",gap:10,marginBottom:14}}>
                {recents.map((r,i)=>(
                  <button key={r.pin} onClick={()=>fetchProfile(r.pin)} disabled={profileLoading} style={{background:"white",border:"none",borderRadius:20,padding:"20px 12px",cursor:"pointer",fontFamily:"inherit",textAlign:"center",boxShadow:"0 8px 24px rgba(0,0,0,.15)",opacity:profileLoading?.6:1}}>
                    <div style={{width:52,height:52,borderRadius:"50%",background:PAL[i%PAL.length].bg,color:"white",fontSize:26,fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 10px"}}>{r.name[0].toUpperCase()}</div>
                    <div style={{fontWeight:800,color:"#333",fontSize:16}}>{r.name}</div>
                  </button>
                ))}
              </div>
            )}
            {profileLoading&&<p style={{color:"white",marginBottom:10}}>Loading…</p>}
            {loginErr&&<p style={{color:"#ffcccc",fontWeight:700,marginBottom:10}}>{loginErr}</p>}
            <div style={{display:"flex",flexDirection:"column",gap:9}}>
              <button onClick={()=>{setSc("newq");setNewName('');setLoginErr('');}} style={{background:"white",color:"#7C83FD",border:"none",borderRadius:14,padding:"14px 0",fontSize:18,cursor:"pointer",fontFamily:"inherit",fontWeight:800}}>✨ New Quizzer</button>
              <button onClick={()=>{setSc("pinlogin");setLoginDigs([]);setLoginErr('');}} style={{background:"rgba(255,255,255,.15)",color:"white",border:"2px solid rgba(255,255,255,.4)",borderRadius:14,padding:"12px 0",fontSize:15,cursor:"pointer",fontFamily:"inherit",fontWeight:700}}>📱 Enter PIN (new device)</button>
            </div>
          </>
        )}
      </div>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap');`}</style>
    </div>
  );
  if(psc==="setup")return <PinPad title="Create a Parent PIN" sub="Kids won't be able to change settings" onOk={(c)=>{setPin(c);setPsc(null);setSc("menu");}}/>;
  if(psc==="enter")return <PinPad title="Parent Access" sub="Enter your PIN to manage categories" onOk={()=>{setPsc(null);setSc("menu");}} cPin={pin}/>;

  if(sc==="menu")return(
    <div style={{minHeight:"100vh",background:"linear-gradient(135deg,#667eea,#764ba2)",fontFamily:"'Nunito',cursive",padding:16}}>
      <div style={{maxWidth:540,margin:"0 auto"}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
          <button onClick={()=>setSc("quiz")} style={{background:"rgba(255,255,255,.2)",border:"none",borderRadius:12,padding:"7px 14px",color:"white",fontSize:19,cursor:"pointer",fontFamily:"inherit",fontWeight:700}}>← Back</button>
          <h2 style={{color:"white",margin:0,fontSize:23}}>⚙️ Quiz Categories</h2>
        </div>
        <div style={{background:"white",borderRadius:20,padding:15,marginBottom:13,boxShadow:"0 8px 32px rgba(0,0,0,.2)"}}>
          <p style={{color:"#bbb",fontSize:12,margin:"0 0 10px",fontWeight:700,letterSpacing:1}}>TAP TO TOGGLE ON / OFF</p>
          {allC.map(c=>{
            const cc=getCol(c,xC),on=act.includes(c);
            const ec=[["easy","🟢","#d4edda","#155724"],["medium","🟡","#fff3cd","#856404"],["hard","🔴","#f8d7da","#721c24"]].map(([d,em,bg,fg])=>({em,bg,fg,n:allQ.filter(q=>q.cat===c&&q.d===d).length}));
            return(
              <div key={c} onClick={()=>toggleCat(c)} style={{display:"flex",alignItems:"center",gap:8,padding:"9px 10px",borderRadius:13,marginBottom:5,cursor:"pointer",background:on?cc.lt:"#f7f7f7",border:`2px solid ${on?cc.bg:"#eee"}`,transition:"all .2s"}}>
                <div style={{width:10,height:10,borderRadius:"50%",background:on?cc.bg:"#ccc",flexShrink:0}}/>
                <span style={{flex:1,fontWeight:700,color:on?"#333":"#bbb",fontSize:13,lineHeight:1.3}}>{c}</span>
                <div style={{display:"flex",gap:3}}>{ec.map(({em,bg,fg,n})=><span key={em} style={{background:bg,color:fg,borderRadius:5,padding:"2px 4px",fontSize:11,fontWeight:700}}>{em}{n}</span>)}</div>
                <div style={{width:32,height:17,borderRadius:9,background:on?cc.bg:"#ddd",position:"relative",flexShrink:0}}>
                  <div style={{position:"absolute",top:2,left:on?16:2,width:13,height:13,borderRadius:"50%",background:"white",transition:"left .2s",boxShadow:"0 1px 3px rgba(0,0,0,.2)"}}/>
                </div>
              </div>
            );
          })}
        </div>
        <div style={{background:"white",borderRadius:20,padding:15,boxShadow:"0 8px 32px rgba(0,0,0,.2)"}}>
          <h3 style={{margin:"0 0 3px",color:"#333",fontSize:17}}>✨ Add a New Category</h3>
          <p style={{color:"#aaa",fontSize:13,margin:"0 0 10px"}}>AI generates Easy, Medium & Hard questions automatically!</p>
          <div style={{display:"flex",gap:7,marginBottom:7}}>
            <input value={nCat} onChange={e=>{setNCat(e.target.value);setGErr("");}} onKeyDown={e=>e.key==="Enter"&&doGen()} placeholder="e.g. Solar System, US Presidents…" disabled={gen} style={{flex:1,border:"2.5px solid #7C83FD",borderRadius:11,padding:"9px 11px",fontSize:16,fontFamily:"inherit",outline:"none",color:"#333"}}/>
            <button onClick={doGen} disabled={!nCat.trim()||gen} style={{background:nCat.trim()&&!gen?"linear-gradient(135deg,#7C83FD,#764ba2)":"#ddd",color:"white",border:"none",borderRadius:11,padding:"0 13px",fontSize:16,cursor:nCat.trim()&&!gen?"pointer":"default",fontFamily:"inherit",fontWeight:700,whiteSpace:"nowrap"}}>{gen?"⏳":"Add ✨"}</button>
          </div>
          {gSt&&<p style={{color:gSt.startsWith("✅")?"#28a745":"#667eea",fontSize:14,margin:0,fontWeight:600}}>{gSt}</p>}
          {gErr&&<p style={{color:"#dc3545",fontSize:14,margin:0,fontWeight:600}}>{gErr}</p>}
        </div>
      </div>
    </div>
  );

  if(!q)return(
    <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:"linear-gradient(135deg,#667eea,#764ba2)",color:"white",fontFamily:"'Nunito',cursive",textAlign:"center",padding:20}}>
      <div style={{fontSize:42,marginBottom:10}}>😅</div>
      <p style={{fontSize:20,margin:"0 0 5px",fontWeight:700}}>No {lv} questions active!</p>
      <p style={{fontSize:16,opacity:.8,margin:"0 0 16px"}}>Switch level or enable more categories.</p>
      <div style={{display:"flex",gap:8,flexWrap:"wrap",justifyContent:"center"}}>
        {LVS.filter(L=>unlk.includes(L.id)&&L.id!==lv).map(L=>(
          <button key={L.id} onClick={()=>changeLv(L.id)} style={{background:"white",color:L.col,border:"none",borderRadius:12,padding:"9px 16px",fontSize:16,cursor:"pointer",fontWeight:700,fontFamily:"inherit"}}>{L.em} {L.lbl}</button>
        ))}
        <button onClick={openMenu} style={{background:"rgba(255,255,255,.15)",border:"2px solid white",color:"white",borderRadius:12,padding:"9px 16px",fontSize:16,cursor:"pointer",fontWeight:700,fontFamily:"inherit"}}>⚙️ Categories</button>
      </div>
    </div>
  );

  return(
    <div style={{minHeight:"100vh",background:"linear-gradient(135deg,#667eea,#764ba2)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Nunito',cursive",padding:12}}>
      <div style={{background:"white",borderRadius:28,padding:"11px 14px 16px",maxWidth:560,width:"100%",boxShadow:"0 24px 64px rgba(0,0,0,.3)"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:5}}>
          <span style={{background:col.bg,color:"white",borderRadius:20,padding:"3px 9px",fontSize:12,fontWeight:700,maxWidth:140,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{q.cat}</span>
          <div style={{display:"flex",gap:4,alignItems:"center"}}>
            <span style={{background:"#f0f0f0",borderRadius:10,padding:"2px 6px",fontSize:12,fontWeight:700,color:"#555"}}>✅{cor}</span>
            <span style={{background:str>=3?"#fff3cd":"#f0f0f0",borderRadius:10,padding:"2px 6px",fontSize:12,fontWeight:700,color:str>=3?"#856404":"#555"}}>🔥{str}</span>
            {profile&&<button onClick={()=>{setProfile(null);setSc("who");}} title={`Switch from ${profile.name}`} style={{width:28,height:28,borderRadius:"50%",background:"#7C83FD",border:"none",color:"white",fontSize:12,fontWeight:800,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center"}}>{profile.name[0].toUpperCase()}</button>}
            <button onClick={openMenu} style={{background:"#f0f0f0",border:"none",borderRadius:9,padding:"3px 7px",cursor:"pointer",fontSize:16,lineHeight:1}}>☰</button>
          </div>
        </div>
        <div style={{display:"flex",gap:5,justifyContent:"center",marginBottom:5}}>
          {LVS.map(L=>{
            const locked=!unlk.includes(L.id),sel=lv===L.id;
            return(
              <button key={L.id} onClick={()=>!locked&&changeLv(L.id)} style={{background:sel?L.col:locked?"#f5f5f5":"#f0f0f0",color:sel?"white":locked?"#ccc":"#777",border:`2px solid ${sel?L.col:locked?"#eee":"#ddd"}`,borderRadius:17,padding:"4px 11px",fontSize:13,fontWeight:700,cursor:locked?"not-allowed":"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:2}}>
                {locked?"🔒":L.em} {L.lbl}{locked&&<span style={{fontSize:11}}>({L.at}✅)</span>}
              </button>
            );
          })}
        </div>
        <div style={{textAlign:"right",fontSize:12,color:"#ccc",marginBottom:5}}>Question #{tot+1}</div>
        <div style={{background:col.lt,border:`2px solid ${col.bg}33`,borderRadius:17,padding:"12px 12px",marginBottom:8,minHeight:50,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:3}}>
          <p style={{color:"#333",fontSize:19,margin:0,textAlign:"center",lineHeight:1.7,fontWeight:600}}>{q.q}</p>
          {q.cat===CATS[0]&&<p style={{color:col.bg,fontSize:13,margin:0,fontWeight:700}}>Type both words — e.g. CAT BAT</p>}
        </div>
        {!sub&&(
          <div style={{textAlign:"center",marginBottom:6}}>
            {shint?<span style={{color:"#aaa",fontSize:14,letterSpacing:2}}>{mkHint(q)}</span>
            :<button onClick={()=>setShint(true)} style={{background:"none",border:"none",color:col.bg,fontSize:14,cursor:"pointer",fontFamily:"inherit",fontWeight:700,textDecoration:"underline"}}>💡 Show hint</button>}
          </div>
        )}
        {!sub&&(
          <div style={{display:"flex",gap:7,marginBottom:6}}>
            <input ref={iRef} value={inp} onChange={e=>setInp(e.target.value)} onKeyDown={hk} placeholder="Type your answer…" style={{flex:1,border:`2.5px solid ${col.bg}`,borderRadius:13,padding:"11px 13px",fontSize:19,fontFamily:"inherit",outline:"none",color:"#333"}}/>
            <button onClick={doSub} disabled={!inp.trim()} style={{background:inp.trim()?`linear-gradient(135deg,${col.bg},#764ba2)`:"#ddd",color:"white",border:"none",borderRadius:13,padding:"0 15px",fontSize:22,cursor:inp.trim()?"pointer":"default",fontFamily:"inherit",fontWeight:700}}>✓</button>
          </div>
        )}
        {sub&&(
          <div style={{textAlign:"center"}}>
            <div style={{fontSize:24,fontWeight:700,marginBottom:5,color:isOk?"#28a745":"#dc3545",animation:anm==="pop"?"pop .4s ease":anm==="wiggle"?"wiggle .45s ease":"none"}}>{msg}</div>
            {str>=3&&isOk&&<div style={{fontSize:14,color:"#e67e22",fontWeight:700,marginBottom:3}}>🔥 {str} in a row!</div>}
            {!isOk&&<div style={{fontSize:16,color:"#666",marginBottom:7}}>Answer: <strong style={{color:"#28a745"}}>{q.a[0]}</strong></div>}
            <button onClick={nxt} style={{background:`linear-gradient(135deg,${col.bg},#764ba2)`,color:"white",border:"none",borderRadius:16,padding:"11px 24px",fontSize:18,cursor:"pointer",fontFamily:"inherit",fontWeight:700,boxShadow:"0 4px 16px rgba(0,0,0,.18)"}}>Next Question →</button>
          </div>
        )}
      </div>
      {popup&&<UnlockModal lv={popup} onClose={(sw)=>{if(sw)changeLv(popup);setPopup(null);}}/>}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap');
        @keyframes pop{0%{transform:scale(1)}50%{transform:scale(1.18)}100%{transform:scale(1)}}
        @keyframes wiggle{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-8px)}40%,80%{transform:translateX(8px)}}
        @keyframes shake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-7px)}40%,80%{transform:translateX(7px)}}
        input::placeholder{color:#999;}
      `}</style>
    </div>
  );
}
