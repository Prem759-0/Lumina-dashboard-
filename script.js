// DATE
function updateDate() {
  document.getElementById('live-date').textContent = new Date().toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric'});
}
updateDate();
 
// ANIMATE KPIs
function animateValue(el, end, prefix='', suffix='', duration=1200) {
  let start=0, startTime=null;
  function step(ts) {
    if (!startTime) startTime=ts;
    const prog = Math.min((ts-startTime)/duration,1);
    const ease = 1-Math.pow(1-prog,4);
    const val = Math.round(start + (end-start)*ease);
    el.textContent = prefix + val.toLocaleString() + suffix;
    if (prog<1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}
setTimeout(()=>{
  animateValue(document.getElementById('kpi-rev'),248930,'$','');
  animateValue(document.getElementById('kpi-users'),12847,'','');
  animateValue(document.getElementById('kpi-conv'),342,'','%',1200);
  document.getElementById('kpi-conv').textContent='3.42%';
  animateValue(document.getElementById('kpi-bounce'),2180,'','%',1200);
  document.getElementById('kpi-bounce').textContent='21.8%';
},200);
 
// SPARKLINES
function drawSparkline(id, data, color) {
  const svg = document.getElementById(id);
  const w=svg.parentElement.offsetWidth, h=40;
  svg.setAttribute('viewBox',`0 0 ${w} ${h}`);
  const max=Math.max(...data), min=Math.min(...data);
  const pts = data.map((v,i)=>`${i/(data.length-1)*w},${h-(v-min)/(max-min)*h}`).join(' ');
  svg.innerHTML=`<defs><linearGradient id="sg${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="${color}" stop-opacity="0.3"/><stop offset="100%" stop-color="${color}" stop-opacity="0"/></linearGradient></defs><polygon points="${pts} ${w},${h} 0,${h}" fill="url(#sg${id})"/><polyline points="${pts}" fill="none" stroke="${color}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>`;
}
const makeData = (n,min,max)=>Array.from({length:n},()=>Math.random()*(max-min)+min);
drawSparkline('spark-1',makeData(20,100,250),'#6366f1');
drawSparkline('spark-2',makeData(20,80,200),'#a855f7');
drawSparkline('spark-3',makeData(20,60,120),'#10b981');
drawSparkline('spark-4',makeData(20,50,150),'#f43f5e');
 
// LINE CHART
const lc = document.getElementById('line-chart');
const lctx = lc.getContext('2d');
lc.width = lc.parentElement.offsetWidth; lc.height=180;
const labels=['1','4','7','10','13','16','19','22','25','28','30'];
const d1=makeData(11,8000,28000),d2=makeData(11,5000,18000);
function drawLineChart() {
  const W=lc.width,H=lc.height,pad={t:10,r:10,b:30,l:50};
  lctx.clearRect(0,0,W,H);
  const cw=W-pad.l-pad.r,ch=H-pad.t-pad.b;
  const allVals=[...d1,...d2];
  const maxV=Math.max(...allVals)*1.1,minV=0;
  const sx=i=>pad.l+i/(d1.length-1)*cw;
  const sy=v=>pad.t+ch-(v-minV)/(maxV-minV)*ch;
  // Grid
  lctx.strokeStyle='rgba(255,255,255,0.04)';lctx.lineWidth=1;
  for(let i=0;i<=4;i++){const y=pad.t+i/4*ch;lctx.beginPath();lctx.moveTo(pad.l,y);lctx.lineTo(pad.l+cw,y);lctx.stroke();}
  // Y labels
  lctx.fillStyle='rgba(232,234,246,0.3)';lctx.font='10px DM Mono';lctx.textAlign='right';
  for(let i=0;i<=4;i++){const v=maxV-i/4*(maxV-minV);lctx.fillText('$'+Math.round(v/1000)+'k',pad.l-6,pad.t+i/4*ch+4);}
  // X labels
  lctx.textAlign='center';
  labels.forEach((l,i)=>lctx.fillText(l,sx(i),H-8));
  // Area d1
  const g1=lctx.createLinearGradient(0,pad.t,0,pad.t+ch);
  g1.addColorStop(0,'rgba(99,102,241,0.3)');g1.addColorStop(1,'rgba(99,102,241,0)');
  lctx.fillStyle=g1;lctx.beginPath();lctx.moveTo(sx(0),sy(d1[0]));
  d1.forEach((v,i)=>lctx.lineTo(sx(i),sy(v)));
  lctx.lineTo(sx(d1.length-1),pad.t+ch);lctx.lineTo(sx(0),pad.t+ch);lctx.closePath();lctx.fill();
  // Line d1
  lctx.strokeStyle='#6366f1';lctx.lineWidth=2;lctx.lineJoin='round';lctx.lineCap='round';
  lctx.beginPath();d1.forEach((v,i)=>i===0?lctx.moveTo(sx(i),sy(v)):lctx.lineTo(sx(i),sy(v)));lctx.stroke();
  // Line d2
  lctx.strokeStyle='#a855f7';lctx.lineWidth=1.5;lctx.setLineDash([4,4]);
  lctx.beginPath();d2.forEach((v,i)=>i===0?lctx.moveTo(sx(i),sy(v)):lctx.lineTo(sx(i),sy(v)));lctx.stroke();
  lctx.setLineDash([]);
  // Dots on d1
  d1.forEach((v,i)=>{lctx.fillStyle='#6366f1';lctx.beginPath();lctx.arc(sx(i),sy(v),3,0,Math.PI*2);lctx.fill();});
}
drawLineChart();
 
// DONUT
const dc = document.getElementById('donut-chart');
const dctx = dc.getContext('2d');
const donutData=[
  {label:'Organic',value:42,color:'#6366f1'},
  {label:'Social',value:28,color:'#a855f7'},
  {label:'Email',value:18,color:'#10b981'},
  {label:'Paid',value:12,color:'#f59e0b'},
];
function drawDonut() {
  const cx=70,cy=70,r=55,ir=40;
  dctx.clearRect(0,0,140,140);
  let angle=-Math.PI/2;
  const total=donutData.reduce((s,d)=>s+d.value,0);
  donutData.forEach(d=>{
    const sweep=d.value/total*Math.PI*2;
    dctx.beginPath();dctx.moveTo(cx,cy);
    dctx.arc(cx,cy,r,angle,angle+sweep);
    dctx.arc(cx,cy,ir,angle+sweep,angle,true);
    dctx.closePath();dctx.fillStyle=d.color;dctx.fill();
    angle+=sweep;
  });
}
drawDonut();
const legend=document.getElementById('donut-legend');
legend.innerHTML=donutData.map(d=>`<div class="legend-row"><div class="legend-dot" style="background:${d.color};box-shadow:0 0 5px ${d.color}"></div><span class="legend-name">${d.label}</span><span class="legend-val">${d.value}%</span><div class="legend-bar-wrap"><div class="legend-bar-fill" style="width:${d.value}%;background:${d.color}"></div></div></div>`).join('');
 
// CAMPAIGNS TABLE
const campaigns=[
  {name:'Summer Sale 2025',imp:'2.4M',ctr:'3.8%',status:'active'},
  {name:'Brand Awareness Q3',imp:'1.1M',ctr:'2.1%',status:'active'},
  {name:'Retargeting — Tier A',imp:'480K',ctr:'5.2%',status:'pending'},
  {name:'Newsletter Blast',imp:'220K',ctr:'4.7%',status:'paused'},
  {name:'Influencer Collab',imp:'890K',ctr:'6.1%',status:'active'},
];
document.getElementById('campaign-table').innerHTML=campaigns.map(c=>`<tr><td style="font-weight:500">${c.name}</td><td style="color:var(--text2);font-family:var(--mono)">${c.imp}</td><td style="color:var(--text2);font-family:var(--mono)">${c.ctr}</td><td><span class="status-pill ${c.status}">● ${c.status}</span></td></tr>`).join('');
 
// ACTIVITY FEED
const activities=[
  {title:'New signup: priya.m@gmail.com',time:'2s ago',color:'#6366f1'},
  {title:'Campaign "Summer Sale" hit 2M impressions',time:'1m ago',color:'#10b981'},
  {title:'Server response time spike detected',time:'3m ago',color:'#f43f5e'},
  {title:'A/B test "Hero CTA" completed — variant B wins',time:'7m ago',color:'#a855f7'},
  {title:'Weekly report auto-generated',time:'12m ago',color:'#f59e0b'},
];
const feed=document.getElementById('activity-feed');
feed.innerHTML=activities.map(a=>`<div class="feed-item"><div class="feed-dot" style="background:${a.color};color:${a.color}"></div><div class="feed-content"><div class="feed-title">${a.title}</div><div class="feed-time">${a.time}</div></div></div>`).join('');
 
// LIVE UPDATE
setInterval(()=>{
  const rev=document.getElementById('kpi-rev');
  const cur=parseInt(rev.textContent.replace(/[$,]/g,''))||248930;
  rev.textContent='$'+(cur+Math.floor(Math.random()*200)).toLocaleString();
  const u=document.getElementById('kpi-users');
  const cu=parseInt(u.textContent.replace(/,/g,''))||12847;
  u.textContent=(cu+Math.floor(Math.random()*3)-1).toLocaleString();
},2000);
 
// TABS
document.querySelectorAll('.tab').forEach(t=>t.addEventListener('click',function(){
  this.closest('.tab-group').querySelectorAll('.tab').forEach(x=>x.classList.remove('active'));
  this.classList.add('active');
}));
