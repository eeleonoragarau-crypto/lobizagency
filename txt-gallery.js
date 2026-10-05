const txtPhotos = [{"src": "assets/txt-gallery/01.jpg", "thumb": "assets/txt-gallery/thumb-01.jpg", "alt": "TXT Lenovo \u2014 foto 1"}, {"src": "assets/txt-gallery/02.jpg", "thumb": "assets/txt-gallery/thumb-02.jpg", "alt": "TXT Lenovo \u2014 foto 2"}, {"src": "assets/txt-gallery/03.jpg", "thumb": "assets/txt-gallery/thumb-03.jpg", "alt": "TXT Lenovo \u2014 foto 3"}, {"src": "assets/txt-gallery/04.jpg", "thumb": "assets/txt-gallery/thumb-04.jpg", "alt": "TXT Lenovo \u2014 foto 4"}, {"src": "assets/txt-gallery/05.jpg", "thumb": "assets/txt-gallery/thumb-05.jpg", "alt": "TXT Lenovo \u2014 foto 5"}];
(() => {
const dialog=document.getElementById('txt-gallery'),open=document.querySelector('.txt-gallery-open'),main=dialog.querySelector('.gallery-main'),count=dialog.querySelector('.gallery-count'),thumbs=dialog.querySelector('.gallery-thumbs');
let index=0,previous,overflow='',startX=null;
txtPhotos.forEach((photo,i)=>{const b=document.createElement('button');b.type='button';b.setAttribute('aria-label',`Mostra foto ${i+1}`);const img=document.createElement('img');img.src=photo.thumb;img.alt='';img.loading='lazy';b.append(img);b.addEventListener('click',()=>show(i));thumbs.append(b)});
function show(i){index=(i+txtPhotos.length)%txtPhotos.length;const photo=txtPhotos[index];main.src=photo.src;main.alt=photo.alt;count.textContent=`${String(index+1).padStart(2,'0')} / ${txtPhotos.length}`;[...thumbs.children].forEach((b,j)=>b.setAttribute('aria-pressed',String(j===index)));const active=thumbs.children[index];thumbs.scrollLeft=active.offsetLeft-thumbs.offsetLeft-thumbs.clientWidth/2+active.clientWidth/2;}
open.addEventListener('click',()=>{previous=document.activeElement;overflow=document.body.style.overflow;dialog.showModal();document.body.style.overflow='hidden';show(0)});
dialog.querySelector('.gallery-close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('close',()=>{document.body.style.overflow=overflow;previous?.focus()});
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()}});
dialog.querySelector('.gallery-prev').addEventListener('click',()=>show(index-1));dialog.querySelector('.gallery-next').addEventListener('click',()=>show(index+1));
dialog.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){e.preventDefault();show(index+1)}if(e.key==='ArrowLeft'){e.preventDefault();show(index-1)}});
main.addEventListener('touchstart',e=>{startX=e.touches[0].clientX},{passive:true});main.addEventListener('touchend',e=>{if(startX!==null){const dx=e.changedTouches[0].clientX-startX;if(Math.abs(dx)>50)show(index+(dx<0?1:-1));startX=null}},{passive:true});
})();
