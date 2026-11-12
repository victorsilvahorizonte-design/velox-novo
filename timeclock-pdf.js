/** PDF de laboratório: sem assinatura e sem alegação de conformidade REP-P. */
(function(g){'use strict';
async function create(report,labels){if(!g.PDFLib)throw Error('PDF_LIBRARY_UNAVAILABLE');const {PDFDocument,StandardFonts,rgb}=g.PDFLib;const doc=await PDFDocument.create();doc.setTitle('VELOX - '+labels.sheet+' - '+report.month);doc.setSubject(labels.unsigned);doc.setProducer('VELOX Ponto - laboratorio');const regular=await doc.embedFont(StandardFonts.Helvetica),bold=await doc.embedFont(StandardFonts.HelveticaBold);const green=rgb(.10,.31,.20),gray=rgb(.4,.45,.42);const page=doc.addPage([841.89,595.28]);const text=(s,x,y,size=8,font=regular,color=green)=>page.drawText(String(s),{x,y,size,font,color});const duration=s=>{const n=Math.floor(Math.abs(s));return (s<0?'-':'')+String(Math.floor(n/3600)).padStart(2,'0')+':'+String(Math.floor(n%3600/60)).padStart(2,'0')+':'+String(n%60).padStart(2,'0');};const safe=s=>String(s||'').replace(/[\r\n\t]+/g,' ');const fit=(s,width,font=regular,size=8)=>{let v=safe(s);while(v&&font.widthOfTextAtSize(v,size)>width)v=v.slice(0,-1);return v;};
text('VELOX',30,563,22,bold);text(labels.sheet,160,567,17,bold);text(report.month,730,566,13,bold);text(fit(labels.unsigned,780),30,542,8,bold,rgb(.57,.32,.10));text(fit(report.employee.name,780),30,523,11,bold);text(fit(report.employee.unit,780),30,507,9);text(labels.worked+': '+duration(report.worked)+'     '+labels.interval+': '+duration(report.interval)+'     '+labels.expected+': '+duration(report.expected)+'     '+labels.issues+': '+report.pending,30,489,9,bold);
const widths=[38,205,65,65,65,72,272],headers=[labels.date,labels.events,labels.interval,labels.worked,labels.expected,labels.difference,labels.status];let x=30;for(let i=0;i<headers.length;i++){page.drawRectangle({x,y:463,width:widths[i],height:16,color:rgb(.9,.95,.91)});text(fit(headers[i],widths[i]-5,bold,7.5),x+3,468,7.5,bold);x+=widths[i];}
let y=453;for(const day of report.rows){const values=[day.date.slice(8)+'/'+day.date.slice(5,7),day.events.map(e=>g.VXTimeclock.parts(e.at).time+(e.source==='adjustment'?'*':'')).join('  ')||'-',duration(day.interval),duration(day.worked),day.expected===null?'-':duration(day.expected),day.future||day.beforeAdmission||day.expected===null?'-':duration(day.difference),day.beforeAdmission?labels.before:day.future?labels.future:day.issues.map(i=>labels[i]||i).join(' / ')||labels.ok];x=30;for(let i=0;i<values.length;i++){text(fit(values[i],widths[i]-5,regular,7.2),x+3,y,7.2);x+=widths[i];}page.drawLine({start:{x:30,y:y-4},end:{x:812,y:y-4},thickness:.3,color:rgb(.8,.85,.81)});y-=12;}
text(fit(labels.calculation,780,regular,7),30,63,7,regular,gray);text('* '+labels.adjustment,30,49,7,regular,gray);text(labels.employee,130,20,8);text('VELOX',600,20,8);page.drawLine({start:{x:65,y:33},end:{x:320,y:33},thickness:.5,color:gray});page.drawLine({start:{x:480,y:33},end:{x:735,y:33},thickness:.5,color:gray});
const notes=report.rows.flatMap(day=>day.notes.map(n=>day.date+' - '+safe(n.reason)));if(notes.length){let notePage=doc.addPage([841.89,595.28]),ny=545;notePage.drawText(labels.notes,{x:30,y:ny,size:16,font:bold,color:green});ny-=30;for(const value of notes){let remaining=value;while(remaining){if(ny<40){notePage=doc.addPage([841.89,595.28]);ny=545;}let line=remaining;while(regular.widthOfTextAtSize(line,9)>775)line=line.slice(0,-1);notePage.drawText(line,{x:30,y:ny,size:9,font:regular,color:green});remaining=remaining.slice(line.length);ny-=15;}ny-=10;}}
return doc.save();}
async function createReceipt(receipt,labels){
if(!g.PDFLib)throw Error('PDF_LIBRARY_UNAVAILABLE');
if(receipt.environment!=='laboratory'||receipt.signed!==false||!receipt.event?.hash)throw Error('INVALID_RECEIPT');
const {PDFDocument,StandardFonts,rgb}=g.PDFLib,doc=await PDFDocument.create();
const regular=await doc.embedFont(StandardFonts.Helvetica),bold=await doc.embedFont(StandardFonts.HelveticaBold);
const clean=value=>Array.from(String(value??'')).map(c=>{try{regular.encodeText(c);return c;}catch{return '?';}}).join('');
const page=doc.addPage([595.28,841.89]);let y=790;
function line(value,size=11,font=regular){let remaining=clean(value).replace(/[\r\n\t]+/g,' ');while(remaining){let part=remaining;while(font.widthOfTextAtSize(part,size)>495)part=part.slice(0,-1);page.drawText(part,{x:50,y,size,font,color:rgb(.10,.31,.20)});remaining=remaining.slice(part.length);y-=size+7;}y-=7;}
const e=receipt.event,person=receipt.employee,local=g.VXTimeclock.parts(e.at);
doc.setTitle('VELOX - '+labels.receipt+' - '+e.sequence);doc.setSubject(labels.unsigned);
line('VELOX PONTO',24,bold);line(labels.receipt,17,bold);line(labels.unsigned,10,bold);
line(labels.employee+': '+person.name);line(person.unit||'');
line(labels.time+': '+local.date+' '+local.time+' ('+receipt.timeZone+')');
line(labels.type+': '+(labels[e.type]||e.type));line(labels.source+': '+(labels[e.source]||e.source));
line('ID: '+e.id);line('Sequencia: '+e.sequence);line('UTC: '+e.at);line(labels.hash,10,bold);line(e.hash,9);
line('Hash anterior: '+(e.previousHash||'-'),9);return doc.save();}
g.VXTimeclockPDF=Object.freeze({create,createReceipt});
})(typeof window==='undefined'?globalThis:window);
