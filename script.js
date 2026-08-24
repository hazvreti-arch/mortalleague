const rules = [
{
 id:"yayın", title:"Yayın Geliri Sistemi",
 html:`<p>Takımlar sezon içindeki performansına göre para kazanır. Bu paralar devrede veya sezon sonunda eklenebilir.</p>
 <h3>Mortalia Sıralama Geliri</h3>
 <ul>
 <li>Lig 1: <b>100.000.000€</b></li><li>Lig 2: <b>75.000.000€</b></li>
 <li>Lig 3-5: <b>50.000.000€</b></li><li>Lig 5-10: <b>30.000.000€</b></li>
 <li>Lig 10-15: <b>25.000.000€</b></li><li>Lig 15-20: <b>10.000.000€</b></li></ul>
 <h3>Mortalia Galibiyet Gelirleri</h3><p>A: Galibiyet 4m • Beraberlik 2m</p><p>B: Galibiyet 3m • Beraberlik 1m</p>
 <p>Kupa maçları: Galibiyet 2m • Beraberlik 1m</p>
 <h3>MortaliaLeague Kupa Primleri</h3><p>ZMK: 70m / 35m • FA Cup: 50m / 25m • GOAT Cup: 40m / 20m • Süper Kupa: 20m / 10m</p>`
},
{
 id:"ödül", title:"Ödül Sistemi",
 html:`<ul><li>Ballon D'or: <b>2.500.000€</b></li><li>Golden Boy: <b>1.500.000€</b></li><li>Golden Boot: <b>1.000.000€</b></li><li>Best Teknik Direktör: <b>1.000.000€</b></li><li>Best Mevki: <b>1.000.000€</b></li><li>Best 11: <b>500.000€</b></li></ul>`
},
{
 id:"kupalar", title:"Kupa & Turnuva Değerleri",
 html:`<p><b>ML A:</b> G 30k • B 10k • Kupa 2m • İkincilik 1m</p>
 <p><b>ML B:</b> G 20k • B 10k • Kupa 1m • İkincilik 500k</p>
 <p><b>ZMK:</b> G 20k • B 10k • Kupa 1.5m • İkincilik 750k</p>
 <p><b>FA Cup:</b> G 15k • B 5k • Kupa 1m • İkincilik 500k</p>
 <p><b>GOAT Cup:</b> G 10k • B 5k • Kupa 500k • İkincilik 250k</p>
 <p><b>ML Süper Kupa:</b> G 10k • B 5k • Kupa 250k • İkincilik 100k</p>
 <p><b>UCL:</b> G 50k • B 30k • Kupa 4.5m • İkincilik 2m</p>
 <p><b>UEL:</b> G 40k • B 20k • Kupa 3.5m • İkincilik 1.5m</p>
 <p><b>UECL:</b> G 30k • B 10k • Kupa 2.5m • İkincilik 1m</p>
 <p><b>UEFA Süper Kupa:</b> G 40k • B 20k • Kupa 3m • İkincilik 1.5m</p>
 <p><b>Dünya Kupası:</b> G 50k • B 30k • Kupa 5m • İkincilik 2.5m</p>
 <p><b>Euro:</b> G 40k • B 20k • Kupa 4m • İkincilik 2m</p>
 <p><b>Uluslar Ligi:</b> G 30k • B 10k • Kupa 2.5m • İkincilik 1m</p>`
},
{
 id:"maaş", title:"Maaş Sistemi",
 html:`<ul><li>Futbolcunun maaşı minimum kendi değeri kadardır; maksimum sınır yoktur.</li><li>Takım bütün oyuncularına maaş vermek zorundadır.</li><li>Bonus maaşları sözleşmede tek seferlik olarak belirlenebilir.</li><li>Maaşlar yarım sezonluk ödenir; sezon içinde bonuslar hariç iki ödeme yapılır.</li><li>Oyuncu aldığı maaşı ve toplam parasını biyografisine yazmak zorundadır.</li><li>Uzun sözleşmede oyuncu değeri artarsa maaş da otomatik olarak yeni değere çıkar.</li></ul>`
},
{
 id:"sponsor", title:"Sponsorluk Sistemi",
 html:`<p>Bir takım göğüs, sırt ve stadyum olmak üzere maksimum 3 sponsor alabilir.</p>
 <p>Minimum sözleşme süresi <b>2 yıl</b>; sözleşme süresince fesih edilemez. Sponsorluk kapanırsa yeni sponsorluk için en az 1 sezon beklenir.</p>
 <h3>Göğüs Sponsoru</h3><p>İmza 20m • ML A 25m • ML B 20m • ZMK 20m • FA 15m • GOAT 10m • Süper Kupa 5m</p>
 <h3>Sırt Sponsoru</h3><p>İmza 15m • ML A 15m • ML B 10m • ZMK 10m • FA 7m • GOAT 5m • Süper Kupa 3m</p>
 <h3>Stadyum Sponsoru</h3><p>İmza 30m • ML A 30m • ML B 25m • ZMK 25m • FA 20m • GOAT 15m • Süper Kupa 10m</p>
 <p>Tüm sponsorluk kategorilerinin bütçesi 500m ile başlar ve her sezon sonunda 100m artar. Maksimum: sırt 8, göğüs 6, stadyum 4 takım.</p>`
},
{
 id:"krampon", title:"Krampon & Eldiven Sistemi",
 html:`<p>Oyuncular aldıkları maaş ile krampon ve eldiven satın alabilir. Krampon ve eldiven gol/asist/gym değerine ekstra katkı sağlar. Eldiven yalnızca kaleciler için geçerlidir.</p>
 <p><b>Krampon:</b> 10m → +5k, %2 lüks • 25m → +10k, %4 • 50m → +15k, %6 • 75m → +20k, %8 • 100m → +25k, %10</p>
 <p><b>Eldiven:</b> 10m → Gym +5k, %2 • 25m → +10k, %4 • 50m → +15k, %6 • 75m → +20k, %8 • 100m → +25k, %10</p>
 <p>Not: Krampondaki Gym değerleri sadece defanslar için geçerlidir.</p>`
},
{
 id:"stadyum", title:"Stadyum Sistemi",
 html:`<p>Stadyum sistemi stadyum alan takımların değerine katkı sağlar.</p>
 <ul><li>Seviye 1: <b>100.000.000€</b> → +2 güç</li><li>Seviye 2: <b>250.000.000€</b> → +4 güç</li><li>Seviye 3: <b>500.000.000€</b> → +6 güç</li><li>Seviye 4: <b>750.000.000€</b> → +8 güç</li><li>Seviye 5: <b>1.000.000.000€</b> → +10 güç</li></ul><p>Her takımın stadyumunun olması zorunludur.</p>`
},
{
 id:"yaş", title:"Yaş Sistemi",
 html:`<p>Oyuncular yaşlarına ve yaşlarına göre yaptıkları gol/asist/gym performansına göre değer kazanır.</p>
 <p><b>Genç Yetenek:</b> 17 +500k • 18 +450k • 19 +400k</p>
 <p><b>Gelişen Yetenek:</b> 20 +350k • 21 +300k • 22 +250k • 23 +200k</p>
 <p><b>Zirve Dönemi:</b> 24 +150k • 25 +100k • 26 +50k • 27 nötr</p>
 <p><b>Deneyimli Oyuncu:</b> 29 nötr • 30 nötr • 31 -250k • 32 -500k</p>
 <p><b>Veteran:</b> 33 -2.5m • 34 -3m • 35 -3.5m • 36 -4m • 37 -5m • 38 -6m • 39 -8m • 40 -10m</p>
 <p>Oyuncular bu değerleri sezon sonunda ekler veya düşer.</p>`
},
{
 id:"antrenman", title:"Antrenman Sahası Sistemi",
 html:`<p>Antrenman sahası seviyesi yükseldikçe oyuncuların değerinde artış olur.</p>
 <ul><li>Seviye 1: 100m → +75k</li><li>Seviye 2: 250m → +100k</li><li>Seviye 3: 500m → +125k</li><li>Seviye 4: 750m → +150k</li><li>Seviye 5: 1.000m → +200k</li></ul>
 <p>Günlük antrenmanda maksimum 5 oyuncuya basılabilir. Antrenman sahası olmadan yapılan antrenmanlar değere 50k etki eder.</p>
 <p>Antrenmanları post olarak paylaşmak zorunludur.</p>`
},
{
 id:"avrupa", title:"Avrupa & Dünya Kupası Gelirleri",
 html:`<p><b>UCL:</b> Lig aşaması 50m • Play-off 10m • Son 16 20m • Çeyrek 40m • Yarı final 60m • Final 80m • Şampiyonluk 100m • G 5m • B 3m</p>
 <p><b>UEL:</b> Lig aşaması 30m • Play-off 15m • Son 16 20m • Çeyrek 30m • Yarı final 40m • Final 60m • Şampiyonluk 75m • G 4m • B 2m</p>
 <p><b>UECL:</b> Lig aşaması 20m • Play-off 10m • Son 16 15m • Çeyrek 20m • Yarı final 25m • Final 40m • Şampiyonluk 50m • G 3m • B 1m</p>
 <p><b>UEFA Süper Kupa:</b> G 50k • B 40k • Kupa 3m</p>
 <p><b>Dünya Kupası:</b> G 70k • B 60k • Kupa 5m</p>
 <p><b>Avrupa Şampiyonası:</b> G 60k • B 50k • Kupa 4m</p>
 <p><b>Uluslar Ligi:</b> G 40k • B 30k • Kupa 2.5m</p>`
}
];

const nav = document.getElementById("nav");
const container = document.getElementById("kurallar");
rules.forEach(r=>{
  const a=document.createElement("a"); a.href="#"+r.id; a.textContent=r.title.replace(" Sistemi",""); nav.appendChild(a);
  const card=document.createElement("article"); card.className="card"; card.id=r.id;
  card.innerHTML=`<h2>${r.title}</h2>${r.html}`; container.appendChild(card);
});

const ageAdjust = {17:500000,18:450000,19:400000,20:350000,21:300000,22:250000,23:200000,24:150000,25:100000,26:50000,27:0,28:0,29:0,30:0,31:-250000,32:-500000,33:-2500000,34:-3000000,35:-3500000,36:-4000000,37:-5000000,38:-6000000,39:-8000000,40:-10000000};

function euro(n){
  return new Intl.NumberFormat("tr-TR",{style:"currency",currency:"EUR",maximumFractionDigits:0}).format(n);
}
function calculate(){
  const age=Number(document.getElementById("age").value);
  const value=Number(document.getElementById("value").value);
  const training=Number(document.getElementById("training").value);
  const stadium=document.getElementById("stadium").value;
  const ageEffect=ageAdjust[age] ?? 0;
  const total=value+training+ageEffect;
  document.getElementById("result").innerHTML =
    `<b>Sezon sonu örnek değeri:</b> ${euro(total)}<br>
     Yaş etkisi: ${ageEffect>=0?"+":""}${euro(ageEffect)}<br>
     Antrenman etkisi: +${euro(training)}<br>
     <small>Stadyum seviyesi takım gücüne katkı verir; oyuncu değerine doğrudan eklenmez.</small>`;
}
