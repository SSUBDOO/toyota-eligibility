
const salesPhone="60173939788";
const LULUS_LIMIT=30;
const TRY_LIMIT=50;

const models=[
{model:"Yaris",tag:"Hatchback",art:"YARIS",color:"yaris",image:"images/yaris.jpg",image:"images/yaris.jpg",variants:[["1.5E",88000],["1.5G",91600]]},
{model:"Yaris Cross",tag:"Compact SUV",art:"CROSS",color:"cross",image:"images/yaris-cross.jpg",image:"images/yaris-cross.jpg",variants:[["1.5S",99900],["1.5 HEV",109900]]},
{model:"Vios",tag:"Sedan",art:"VIOS",color:"vios",image:"images/vios.jpg",image:"images/vios.jpg",variants:[["1.5E",90600],["1.5G",96600],["1.5 HEV",103900],["1.5 GRS HEV",109900]]},
{model:"Veloz",tag:"7-Seater",art:"VELOZ",color:"suv",image:"images/veloz.jpg",image:"images/veloz.jpg",variants:[["1.5",95000]]},
{model:"Corolla Cross",tag:"SUV",art:"CROSS",color:"cross",image:"images/corolla-cross.jpg",image:"images/corolla-cross.jpg",variants:[["1.8V",133800],["1.8 HEV",140800],["1.8 GRS HEV",148800]]},
{model:"Corolla",tag:"Sedan",art:"ALTIS",color:"vios",image:"images/corolla.jpg",image:"images/corolla.jpg",variants:[["1.8G",144800],["1.8GRS",149800]]},
{model:"Hilux",tag:"Pickup",art:"HILUX",color:"hilux",image:"images/hilux.jpg",image:"images/hilux.jpg",variants:[["2.4 S/C MT",104880],["2.4E MT",117880],["2.4E AT",119880],["2.4V AT",149580],["2.8 Rogue",163000],["2.8 GRS",173280],["BEV 144kW",226300]]},
{model:"Innova Zenix",tag:"MPV",art:"ZENIX",color:"suv",image:"images/innova-zenix.jpg",image:"images/innova-zenix.jpg",variants:[["2.0V",165000],["2.0 HEV",202000]]},
{model:"Fortuner",tag:"SUV",art:"FORT",color:"suv",image:"images/fortuner.jpg",image:"images/fortuner.jpg",variants:[["2.4D AT",195800],["2.8D VRZ",241800],["2.7P SRZ",202880]]},
{model:"Camry",tag:"Premium Sedan",art:"CAMRY",color:"premium",image:"images/camry.jpg",image:"images/camry.jpg",variants:[["2.5V",221800],["2.5 HEV",248800]]},
{model:"Harrier",tag:"Premium SUV",art:"HARRIER",color:"premium",image:"images/harrier.jpg",image:"images/harrier.jpg",variants:[["2.5 HEV",289000]]},
{model:"Hiace",tag:"Commercial Van",art:"HIACE",color:"van",image:"images/hiace.jpg",image:"images/hiace.jpg",variants:[["Window 2.8 AT",172000],["Panel 3.0 MT",127800]]},
{model:"Vellfire",tag:"Luxury MPV",art:"VELL",color:"premium",image:"images/vellfire.jpg",image:"images/vellfire.jpg",variants:[["2.5",448000],["2.5 HEV",549900]]},
{model:"Alphard",tag:"Luxury MPV",art:"ALPH",color:"premium",image:"images/alphard.jpg",image:"images/alphard.jpg",variants:[["2.4 Turbo EL",548000]]},
{model:"EV",tag:"Electric",art:"BEV",color:"ev",image:"images/ev.jpg",image:"images/ev.jpg",variants:[["Urban Cruiser BEV",198000],["bZ4X BEV",220000]]}
].map(m=>({...m,variants:m.variants.map(v=>({spec:v[0],price:v[1]}))}));

const els={salary:document.getElementById("salary"),depositAmount:document.getElementById("depositAmount"),rate:document.getElementById("rate"),rateLabel:document.getElementById("rateLabel"),methodFlat:document.getElementById("methodFlat"),methodEir:document.getElementById("methodEir"),cards:document.getElementById("cards"),summary:document.getElementById("summary"),modal:document.getElementById("modal"),closeBtn:document.getElementById("closeBtn"),modalArt:document.getElementById("modalArt"),modalTitle:document.getElementById("modalTitle"),modalSub:document.getElementById("modalSub"),startDeposit:document.getElementById("startDeposit"),startMonthly:document.getElementById("startMonthly"),modalStatus:document.getElementById("modalStatus"),variantRows:document.getElementById("variantRows"),modalTiny:document.getElementById("modalTiny"),waBtn:document.getElementById("waBtn"),hint:document.getElementById("hint")};

let selectedTenure=7,lastResults=[];
function rm(v,c=false){return"RM"+Number(v).toLocaleString("en-MY",{minimumFractionDigits:c?2:0,maximumFractionDigits:c?2:0})}
function num(el){const v=Number(el.value);return isNaN(v)?0:v}
function getMethod(){return document.querySelector('input[name="method"]:checked').value}
function methodName(){return getMethod()==="eir"?"EIR":"Flat Rate"}
function monthlyFlat(loan,rate,years){const months=years*12;if(loan<=0||months<=0)return 0;const interest=loan*(rate/100)*years;return(loan+interest)/months}
function monthlyEir(loan,rate,years){const months=years*12,r=(rate/100)/12;if(loan<=0||months<=0)return 0;if(r<=0)return loan/months;return loan*r/(1-Math.pow(1+r,-months))}
function monthlyCalc(loan,rate,years){return getMethod()==="eir"?monthlyEir(loan,rate,years):monthlyFlat(loan,rate,years)}
function updateMethodUI(){if(getMethod()==="eir"){els.rateLabel.textContent="EIR %";els.hint.textContent="EIR mode: LULUS ≤30%, BOLEH TRY 30%-50%, GAGAL >50% daripada gaji bersih.";if(num(els.rate)<3)els.rate.value="4.40"}else{els.rateLabel.textContent="Flat Rate %";els.hint.textContent="Flat mode: LULUS ≤30%, BOLEH TRY 30%-50%, GAGAL >50% daripada gaji bersih.";if(num(els.rate)>3.5)els.rate.value="2.30"}}
function calcVariant(v){const salary=num(els.salary),lulusLimit=salary*(LULUS_LIMIT/100),tryLimit=salary*(TRY_LIMIT/100),deposit=Math.max(num(els.depositAmount),0),rate=num(els.rate);const actualDeposit=Math.min(deposit,v.price),loan=Math.max(v.price-actualDeposit,0),monthly=monthlyCalc(loan,rate,selectedTenure);let result="fail";if(salary>0&&monthly<=lulusLimit)result="pass";else if(salary>0&&monthly<=tryLimit)result="try";return{...v,deposit:actualDeposit,loan,monthly,result,pass:result==="pass",try:result==="try"}}
function priceRange(vars){const p=vars.map(v=>v.price);return `${rm(Math.min(...p))} - ${rm(Math.max(...p))}`}
function render(){
  updateMethodUI();
  const computed=models.map(model=>{
    const variants=model.variants.map(calcVariant);
    const passCount=variants.filter(v=>v.result==="pass").length;
    const tryCount=variants.filter(v=>v.result==="try").length;
    let modelResult="fail";
    if(passCount>0) modelResult="pass";
    else if(tryCount>0) modelResult="try";
    return {...model,variants,passCount,tryCount,modelResult};
  });
  lastResults=computed;
  const totalPass=computed.filter(m=>m.modelResult==="pass").length;
  const totalTry=computed.filter(m=>m.modelResult==="try").length;
  const totalFail=computed.filter(m=>m.modelResult==="fail").length;
  els.summary.textContent=`${totalPass} LULUS · ${totalTry} BOLEH TRY · ${totalFail} GAGAL`;
  els.cards.innerHTML=computed.map((m,i)=>{
    const cls=m.modelResult;
    let badgeText="❌ GAGAL";
    if(cls==="pass") badgeText=`✅ LULUS ${m.passCount}/${m.variants.length} spec`;
    if(cls==="try") badgeText=`⚠️ BOLEH TRY ${m.tryCount}/${m.variants.length} spec`;
    const imageStyle=m.image?`background-image:url('${m.image}')`:"";
    const imageClass=m.image?"hasImage":"";
    return `<div class="card ${cls}" onclick="openModel(${i})"><div class="carArt ${m.color} ${imageClass}" style="${imageStyle}"><span>${m.art}</span></div><div class="cardBody"><div class="modelName">${m.model}</div><div class="priceRange">${priceRange(m.variants)}</div><span class="badge ${cls}">${badgeText}</span></div></div>`;
  }).join("");
  const msg=`Saya nak semak Toyota eligibility.%0AGaji: ${rm(num(els.salary))}%0ATahun: ${selectedTenure}%0ADeposit: ${rm(num(els.depositAmount))}%0A${methodName()}: ${num(els.rate)}%25%0A${totalPass} lulus, ${totalTry} boleh try.`;
  els.waBtn.href=`https://wa.me/${salesPhone}?text=${msg}`;
}
function openModel(i){const m=lastResults[i],cheapest=[...m.variants].sort((a,b)=>a.price-b.price)[0],firstPass=m.variants.find(v=>v.result==="pass"),firstTry=m.variants.find(v=>v.result==="try"),display=firstPass||firstTry||cheapest;els.modalArt.className=`modalArt ${m.color}${m.image?" hasImage":""}`;
if(m.image){els.modalArt.style.backgroundImage=`url('${m.image}')`;els.modalArt.textContent="";}else{els.modalArt.style.backgroundImage="";els.modalArt.textContent=m.art;}els.modalTitle.textContent=`Toyota ${m.model}`;els.modalSub.textContent=`${m.tag} · ${selectedTenure} Tahun · ${methodName()} ${num(els.rate).toFixed(2)}%`;els.startDeposit.textContent=rm(display.deposit);els.startMonthly.textContent=rm(display.monthly,true);els.modalStatus.textContent=m.modelResult==="pass"?"✅ LULUS":m.modelResult==="try"?"⚠️ TRY":"❌ GAGAL";els.variantRows.innerHTML=m.variants.map(v=>{const label=v.result==="pass"?"✅":v.result==="try"?"⚠️":"❌";return`<tr><td>${v.spec}</td><td>${rm(v.deposit)}</td><td class="monthly">${rm(v.monthly,true)}/bln</td><td><span class="dot ${v.result}"></span> ${label}</td></tr>`}).join("");els.modalTiny.textContent=`LULUS ≤30% gaji · BOLEH TRY 30%-50% gaji · Deposit ${rm(num(els.depositAmount))} · ${methodName()} ${num(els.rate).toFixed(2)}% · ${selectedTenure} tahun. Anggaran sahaja, subject to bank approval.`;els.modal.classList.add("show")}
function closeModal(){els.modal.classList.remove("show")}
document.querySelectorAll(".tenureBtn").forEach(btn=>btn.addEventListener("click",()=>{document.querySelectorAll(".tenureBtn").forEach(b=>b.classList.remove("active"));btn.classList.add("active");selectedTenure=Number(btn.dataset.tenure);render()}));
[els.salary,els.depositAmount,els.rate,els.methodFlat,els.methodEir].forEach(el=>{el.addEventListener("input",render);el.addEventListener("change",render)});
els.closeBtn.addEventListener("click",closeModal);els.modal.addEventListener("click",e=>{if(e.target===els.modal)closeModal()});window.openModel=openModel;render();
