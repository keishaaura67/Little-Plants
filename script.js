const products=[
{name:"Monstera Deliciosa",price:85000,img:"assets/monstera.jpg",tags:["Easy Care","Pet-Friendly"],size:"Besar",light:"Sedang",care:"Mudah",pet:"Ya",cat:["Indoor","Easy Care","Pet-Friendly","Low Light"]},
{name:"Snake Plant",price:75000,img:"assets/snake.jpg",tags:["Easy Care","Pet-Friendly"],size:"Sedang",light:"Rendah",care:"Mudah",pet:"Ya",cat:["Indoor","Easy Care","Low Light","Pet-Friendly"]},
{name:"Peace Lily",price:75000,img:"assets/peace.jpg",tags:["Mudah","Pet-Friendly"],size:"Sedang",light:"Rendah",care:"Mudah",pet:"Ya",cat:["Indoor","Easy Care","Low Light","Pet-Friendly"]},
{name:"Lavender",price:60000,img:"assets/lavender.jpg",tags:["Sedang","Pet-Friendly"],size:"Kecil",light:"Tinggi",care:"Sedang",pet:"Ya",cat:["Outdoor","Easy Care","Pet-Friendly"]},
{name:"Philodendron Brasil",price:65000,img:"assets/philodendron.jpg",tags:["Mudah","Pet-Friendly"],size:"Sedang",light:"Sedang",care:"Mudah",pet:"Ya",cat:["Indoor","Easy Care","Low Light","Pet-Friendly"]},
{name:"Aloe Vera",price:90000,img:"assets/aloe.jpg",tags:["Mudah","Pet-Friendly"],size:"Besar",light:"Tinggi",care:"Mudah",pet:"Ya",cat:["Outdoor","Easy Care","Pet-Friendly"]},
{name:"Calathea",price:70000,img:"assets/calathea.jpg",tags:["Mudah","Pet-Friendly"],size:"Sedang",light:"Rendah",care:"Mudah",pet:"Ya",cat:["Indoor","Low Light","Pet-Friendly"]},
{name:"ZZ Plant",price:70000,img:"assets/zz.jpg",tags:["Mudah"],size:"Sedang",light:"Rendah",care:"Mudah",pet:"Tidak",cat:["Indoor","Easy Care","Low Light"]},
{name:"Zinnia",price:45000,img:"assets/cat-outdoor.jpg",tags:["Mudah"],size:"Kecil",light:"Tinggi",care:"Mudah",pet:"Ya",cat:["Outdoor","Easy Care","Pet-Friendly"]},
{name:"Rosemary",price:50000,img:"assets/cat-easy.jpg",tags:["Mudah"],size:"Kecil",light:"Tinggi",care:"Mudah",pet:"Ya",cat:["Outdoor","Easy Care","Pet-Friendly"]},
{name:"Bougainvillea",price:70000,img:"assets/cat-outdoor.jpg",tags:["Sedang"],size:"Besar",light:"Tinggi",care:"Sedang",pet:"Tidak",cat:["Outdoor"]},
{name:"Sunflower",price:50000,img:"assets/cat-outdoor.jpg",tags:["Mudah"],size:"Sedang",light:"Tinggi",care:"Mudah",pet:"Ya",cat:["Outdoor","Easy Care"]},
{name:"Aglaonema Outdoor",price:60000,img:"assets/cat-low.jpg",tags:["Mudah"],size:"Sedang",light:"Sedang",care:"Mudah",pet:"Tidak",cat:["Outdoor","Low Light"]},
{name:"Kaktus Mini",price:65000,img:"assets/cat-easy.jpg",tags:["Mudah"],size:"Kecil",light:"Tinggi",care:"Mudah",pet:"Tidak",cat:["Outdoor","Easy Care"]}
];

let state={page:"home",filter:"Indoor",query:"",pageNo:1,perPage:8,wishlist:JSON.parse(localStorage.getItem("lpWish")||"[]"),cart:JSON.parse(localStorage.getItem("lpCart")||"[]"),qty:1};

const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
function money(n){return "Rp "+n.toLocaleString("id-ID")}
function showToast(msg){const t=$("#toast");t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),1800)}
function save(){localStorage.setItem("lpWish",JSON.stringify(state.wishlist));localStorage.setItem("lpCart",JSON.stringify(state.cart));$("#wishCount").textContent=state.wishlist.length}

function go(page){
 state.page=page;
 $$(".page").forEach(p=>p.classList.remove("active"));
 const el=$("#"+page+"Page"); if(el)el.classList.add("active");
 $$(".nav-link").forEach(a=>a.classList.toggle("active",a.dataset.page===page));
 window.scrollTo({top:0,behavior:"smooth"});
 if(page==="category")renderProducts();
}
document.addEventListener("click",e=>{
 const pageEl=e.target.closest("[data-page]");
 if(pageEl){e.preventDefault();go(pageEl.dataset.page)}
 const f=e.target.closest("[data-filter]");
 if(f){e.preventDefault();state.filter=f.dataset.filter;state.pageNo=1;go("category");$("#categoryCrumb").textContent=state.filter;renderProducts()}
 const close=e.target.closest("[data-close]"); if(close)close.closest(".modal").classList.remove("open");
});
function filtered(){
 let arr=[...products];
 if(state.filter)arr=arr.filter(p=>p.cat.includes(state.filter));
 const q=state.query.trim().toLowerCase();
 if(q)arr=arr.filter(p=>(p.name+" "+p.cat.join(" ")).toLowerCase().includes(q));
 const max=+$("#priceRange")?.value||1000000; arr=arr.filter(p=>p.price<=max);
 const sizes=$$(".filter-size:checked").map(x=>x.value); if(sizes.length)arr=arr.filter(p=>sizes.includes(p.size));
 const lights=$$(".filter-light:checked").map(x=>x.value); if(lights.length)arr=arr.filter(p=>lights.includes(p.light));
 const cares=$$(".filter-care:checked").map(x=>x.value); if(cares.length)arr=arr.filter(p=>cares.includes(p.care));
 const pets=$$(".filter-pet:checked").map(x=>x.value); if(pets.length)arr=arr.filter(p=>pets.includes(p.pet));
 const sort=$("#sortSelect")?.value;
 if(sort==="low")arr.sort((a,b)=>a.price-b.price); if(sort==="high")arr.sort((a,b)=>b.price-a.price); if(sort==="name")arr.sort((a,b)=>a.name.localeCompare(b.name));
 return arr;
}
function renderProducts(){
 const arr=filtered(), start=(state.pageNo-1)*state.perPage, visible=arr.slice(start,start+state.perPage);
 $("#productGrid").innerHTML=visible.map((p,i)=>`<article class="product-card" data-product="${products.indexOf(p)}">
<div class="product-image"><img src="${p.img}" alt="${p.name}"><button class="heart" data-wish="${products.indexOf(p)}">${state.wishlist.includes(p.name)?"♥":"♡"}</button></div>
<div class="product-body"><h3>${p.name}</h3><div class="stars">★ 4.8</div><div class="price">${money(p.price)}</div><div class="tags">${p.tags.map(t=>`<span class="tag">${t}</span>`).join("")}</div><button class="detail-btn">Lihat Detail →</button></div></article>`).join("")||`<div style="grid-column:1/-1;padding:50px;text-align:center;color:#789088">Tanaman tidak ditemukan. Coba ubah filter.</div>`;
 const pages=Math.max(1,Math.ceil(arr.length/state.perPage));$("#pagination").innerHTML=Array.from({length:pages},(_,i)=>`<button class="${i+1===state.pageNo?"active":""}" data-p="${i+1}">${i+1}</button>`).join("")+(pages>1?`<button data-p="${Math.min(pages,state.pageNo+1)}">→</button>`:"");
 $("#activeFilters").innerHTML=(state.filter?`<span>${state.filter} ×</span>`:"")+(state.query?`<span>“${state.query}” ×</span>`:"");
 $$(".chip").forEach(c=>c.classList.toggle("active",c.dataset.filter===state.filter));
}
$("#productGrid").addEventListener("click",e=>{
 const wish=e.target.closest("[data-wish]"); if(wish){e.stopPropagation();const p=products[+wish.dataset.wish];if(state.wishlist.includes(p.name))state.wishlist=state.wishlist.filter(x=>x!==p.name);else state.wishlist.push(p.name);save();renderProducts();showToast("Wishlist diperbarui");return}
 const card=e.target.closest("[data-product]");if(card)openDetail(+card.dataset.product);
});
$("#pagination").addEventListener("click",e=>{const b=e.target.closest("[data-p]");if(b){state.pageNo=+b.dataset.p;renderProducts()}});
function openDetail(i){
 const p=products[i]; state.current=p; state.qty=1; $("#detailName").textContent=p.name;$("#detailPrice").textContent=money(p.price);$("#detailImage").src=p.img;$("#qty").textContent=1;$("#detailWish").textContent=state.wishlist.includes(p.name)?"♥ Tersimpan di Wishlist":"♡ Simpan ke Wishlist";go("detail");
}
$("#plus").onclick=()=>{$("#qty").textContent=++state.qty};$("#minus").onclick=()=>{state.qty=Math.max(1,state.qty-1);$("#qty").textContent=state.qty};
$("#detailWish").onclick=()=>{const n=state.current.name;if(state.wishlist.includes(n))state.wishlist=state.wishlist.filter(x=>x!==n);else state.wishlist.push(n);save();$("#detailWish").textContent=state.wishlist.includes(n)?"♥ Tersimpan di Wishlist":"♡ Simpan ke Wishlist";showToast("Wishlist diperbarui")};
$("#addCart").onclick=()=>{for(let i=0;i<state.qty;i++)state.cart.push(state.current);save();showToast("Tanaman ditambahkan ke keranjang")};
function openModal(id){$("#"+id).classList.add("open")}
$("#wishlistBtn").onclick=()=>showToast(state.wishlist.length?state.wishlist.join(", "):"Wishlist masih kosong");
$("#accountBtn").onclick=()=>openModal("loginModal");$("#loginBtn").onclick=()=>openModal("loginModal");
$("#headerSearchBtn").onclick=()=>{state.query=$("#headerSearch").value;state.pageNo=1;go("category");renderProducts()};
$("#headerSearch").addEventListener("keydown",e=>{if(e.key==="Enter")$("#headerSearchBtn").click()});
$("#homeSearchBtn").onclick=()=>{state.query=$("#homeSearch").value;state.pageNo=1;go("category");renderProducts()};
$("#homeSearch").addEventListener("keydown",e=>{if(e.key==="Enter")$("#homeSearchBtn").click()});
$("#seeAllCategories").onclick=()=>go("category");
$("#resetFilters").onclick=resetAll;$("#modalReset").onclick=resetAll;$("#modalReset2").onclick=resetAll;
function resetAll(){state.filter="Indoor";state.query="";state.pageNo=1;$$(".filters input[type=checkbox]").forEach(x=>x.checked=false);$("#priceRange").value=1000000;renderProducts();showToast("Filter direset")}
$("#applyFilter").onclick=()=>{state.pageNo=1;renderProducts();showToast("Filter diterapkan")};
$("#sortSelect").onchange=renderProducts;$("#priceRange").oninput=renderProducts;
$("#cartModal").addEventListener("click",e=>{if(e.target.id==="checkout"){if(!state.cart.length)return showToast("Keranjang masih kosong");state.cart=[];save();renderCart();showToast("Pesanan berhasil dibuat")}})
$("#doLogin").onclick=()=>{$("#loginModal").classList.remove("open");showToast("Berhasil masuk. Selamat datang!")}
$("#registerBtn").onclick=()=>showToast("Form pendaftaran akan segera tersedia");
function renderCart(){const box=$("#cartItems");if(!state.cart.length){box.innerHTML="<p style='color:#789088;font-size:10px'>Keranjang masih kosong.</p>";$("#cartTotal").textContent="Rp 0";return}const counts={};state.cart.forEach(p=>counts[p.name]=(counts[p.name]||0)+1);let total=0;box.innerHTML=Object.entries(counts).map(([n,q])=>{const p=products.find(x=>x.name===n);total+=p.price*q;return `<div class="cart-item"><span>${n} × ${q}</span><b>${money(p.price*q)}</b></div>`}).join("");$("#cartTotal").textContent=money(total)}
$("#recommendation button").onclick=()=>go("category");
$("#modalApply").onclick=()=>{$("#filterModal").classList.remove("open");showToast("Filter diterapkan")};
$("#categoryPage").addEventListener("dblclick",e=>{if(e.target.closest(".filters"))return;openModal("filterModal")});
$("#categoryPage").addEventListener("click",e=>{const chip=e.target.closest(".chip");if(chip){state.filter=chip.dataset.filter;state.pageNo=1;$("#categoryCrumb").textContent=state.filter;renderProducts()}});
$("#headerSearch").addEventListener("input",()=>{});
$$(".tabs button").forEach(b=>b.onclick=()=>{$$(".tabs button").forEach(x=>x.classList.remove("active"));b.classList.add("active");showToast(b.textContent+" dipilih")});
save();renderCart();
