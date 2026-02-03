function openLightbox(src) {
  const lb = document.createElement("div");
  lb.id = "lightbox";
  lb.innerHTML = `<img src="${src}">`;
  lb.onclick = () => lb.remove();
  document.body.appendChild(lb);
}
