1DV449_lr222gw- Projektrapport
==============

#Projekt rapport
##av Lowe Raivio WP13

###Inledning:
Jag har byggt applikationen www.konsertkartan.com. En sida för att lätt hitta konserter och festivaler i närheten av dig, eller på ett ställe av ditt intresse. 
Applikationen är byggd för att lätt kunna utforska olika områden dit du kan tänka dig att åka för att gå på festival eller konsert, den underlättar också just DIG (som väljer att logga in med spotify) att hitta relevanta konserter. 
Målgruppen är helt enkelt personen som känner “jag har inget att göra”, personen kan snabbt gå in på sidan och se om det finns några event i närheten av den.

###Serversidan:
På servern så för jag totalt 3 olika saker:
* Jag hämtar data från Sonkick.com’s api och spotify.
* Jag hämtar/sparar data till databasen.
* Spotify inloggning tas hand om härifrån. 

###Klientsidan:
Klientsidan sköter det mesta jobbet, ser till vilken data som ska hämtas, sparas och visas. 
Man kan säga att klientsidan tar hand om datan och bearbetar den medan serversidan bidrar med datan.
Att jobba med javascript har vart roligt och underlättat en hel del på klienten då jag har kunnat ändra mycket saker med javascripten gällande stil och skapning av innehåll.

###Säkerhet och presandaoptimering:
Sidan ska vara säker. 
Användaruppkopplingen sker genom spotifys OAuth och fungerar bra då spotify måste godkänna inloggningen innan man kommer vidare till min php sida där jag tar hand om resultet av en inloggning. 
När jag sparar ner saker i databasen använder jag PDO på det sättet att en SQL-injection ej blir möjlig (skickar med parametrarna i execute()...). 
Utöver det så finns det inte några ställen för säkerhetsrisker, det enda som skjuts in på sidan görs automatiskt med javascript.

###Offline-first:
När jag började tänka på applikationen så utgick jag fårn offline-first, all API-hantering och hämtnign av data skulle få ske på servern medan all hantering av datat skulle ske på klienten, därför har jag gjort det mesta i javascript. 
När data hade hämtats skulle den lagras i localStorage där jag sedan skulle läsa in den på kartan från. Problemet är att google maps inte tillåter cachening av sina kartor, så min idé gick i kras när jag redan kommit en bra bit in på projektet. 
Istället valde jag att göra så att sidan såg trevlig ut när man kom in på den i offline-läge, jag tänkte att det skulle vara ungefär som att komma till en stängd affär (se allt men inte kunna “köpa” något). 
Den funktionalitet som finns på sidan är att man kan se hela sidan och att saker som ej är klickbara längre blir gråmarkerade, det man kan göra är att gå in på  “Om Sidan” och läsa/köra guiden. 
Det finns en bugg gällande offline, IBLAND när jag går in på sidan i offline läge så laddas den om väldigt mycket och slutar inte. 
Jag vet inte vad felet beror på, men då det bara förekommer ibland är det svårt att hitta buggen som orsakar det, jag tror inte ens buggen ligger i min kod kanske snarare hoss binero(?).
Jag vill bara berätta att jag är medveten om att buggen kan (och troligtvis kommer) förekomma nångång. 
Det konstiga är att när buggen inte buggar loss så fungerar offline-läget hur bra som helst, även då det inte är mycket av offline läge.


###Tekniker jag använt:
jag har använt mig till större delen av javascript för att hantera datat (skriva ut, skicka in till databsen, algoritmer etc). 
Utöver bara javascript så har jag använt JQuery för att göra ajax-anrop. 
På servern har jag använt mig av PHP. 

###Reflektion kring projektet:
####-Hur har projektet gått:
När jag väl kom igång så gick det hur bra som helst, men jag kom igång lite sent.
Det hände så mycket under julen och när jag skulle börja ta tag i projekten så tog MVC-projektet lite mer tid än jag tänkt mig, detta resulterade att jag hamnade efter i schemat. 
Men innan jag påbörjade jobbet på konsertkartan så stötte jag på lite andra problem, först kunde jag inte få tag i en API-nyckel så jag höll på att tänka att jag skulle byta projekt men då jag inte kom på något innan jag fick nyckeln så slutade det ändå med projektet KonsertKartan. 
(det tog ungefär 3-4 dagar innan jag fick nyckeln från Songkick.com). 

När jag kom igång så flöt tiden lite väl snabbt, för att hinna till deadline stannade jag uppe sent och drack mycket energidricka. Jag kom en bra bit och trodde jag kunde lämna in projektet innan deadline. 
När deadline väl kom var grunden klar, Css saknades på några ställen och mycket funktionalitet som jag hade velat lägga till saknades. 
Jag beslöt mig för att inte lämna in projektet utan fortsätta lite mer på det och så hann jag få in den extra funktionaliteten och CSSn som saknades.

Så det var lite jobbigt i början, mycket stress. Men när jag kom igång så tyckte jag att det bara var roligt, jag är väldigt nöjd med slutresultatet. :)

####-Vilka problem stötte jag på
Jag har stött på en hel del problem. Mycket har vart om hur jag ska hantera datan; först hämtade jag datan över hela sverige+andra områen jag klickat på, vilket som fungerade rätt bra. Men sen när jag laddade om sidan så tog det lite väl lång tid (40 sekunder till 1.5 minut). 
Jag har bytt och testat lite olika tekniker men tillslut hittade jag en som passade bra och det är att jag hämtar alla cachad data inom ett viss område runt om mig (mig = min position från geolocation). 



####-Funktioner som jag skulle viljat implementera men ej hunnit. 
Jag tror jag fick med all funktionalitet som jag tänkt ha med mig från början. 
Jag hade iof tankar om att kunna lyssna på musik genom spotify, men spotifys api hade inte stöd för det än. En annan tanke jag hade var att man skulle ha sidor om artisterna när man trycker på dem (nu blir man länkade till songkick istället), jag blev begränsad av den begränsade datan från songkick (inget riktigt intressant om artisten utöver kalender och  deras namn).

####-Hur kan jag jobba vidare på applikationen
Jag känner mig rätt nöjd, men jag hade tanken om att installera en modul så att personer som använder applikationen skulle kunna komma med tips och förslag om saker man kan implementera. Jag tror det är något som skulle uppskattas på en sådan sida.

###Risker med applikationen:
####-Etiska risker:
Det finns nog inga etiska risker med applikationen, tror inte att någon skulle kunna ta illa upp av den eller så. 
Jag ser heller inget fel i att hämta data och visa upp den på det sättet jag gör, jag tvivlar på att någon annan skulle göra det (möjligtvis någon som blir sur när de ser att alla andra komuner har artister men inte hans… hehe).
####-Tekniska risker
Jag vet inte hur sidan skulle reagera om man hämtade allt för mycket data på en gång, jag har testat att häma data från london och det fungerar bra. Men det har inte alltid gjort det, innan hade jag ett problem där jag hämtade för mycket data, men jag lyckades begränsa hämtningen av data på ett smart sätt, jag ser till att all data hämtas, men kanske inte för alla månader som är planerade frammåt. 
Jag får 50 event per sida som jag hämtar ner, jag satte en begränsning på att hämta ner 10 sidor, så totalt hämtas det ner som max 500 event på en plats (och från vad jag har sett så får jag alltid med event från rätt långt in i framtiden).


###Hur jag hanterat Långa laddningstider:
Då min sida hämtar data och skriver ut data i rätt stora mängder så hade jag behov av laddning. 
En smart lösning på att få en sida att kännas snabb är att visa laddningen tydligt och snyggt.
I början hade jag bara så att muspekaren roterade, men snart kom jag på att det både kändes fult/buggit och kunde göras bättre. 
Det var så min laddningsbild föddes, jag tycker den är fin och att den rör sig är inte heller dåligt.
Jag tror att om man visar hur något laddar på ett snyggt sätt så känns det mer riktigt och mer ok.
(exempel är: att vissa nintendoprodukter har långa laddningstider, men de döljer laddningstiderna med roliga animationer som pågår under laddningstiden.)
