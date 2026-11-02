const uploadForm = document.getElementById("uploadForm");
const fileInput = document.getElementById("fileInput");
const titleInput = document.getElementById("title");
const descriptionInput = document.getElementById("description");
const fileList = document.getElementById("fileList");
const searchInput = document.getElementById("searchInput");
const modal = document.getElementById("modal");
const modalViewer = document.getElementById("modalViewer");
const modalClose = document.getElementById("modalClose");

// Fayl yuklash
uploadForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append("file", fileInput.files[0]);
  formData.append("title", titleInput.value);
  formData.append("description", descriptionInput.value);

  await fetch("/upload", {
    method: "POST",
    body: formData,
  });

  uploadForm.reset();
  loadFiles();
});

// Fayllarni yuklash
async function loadFiles() {
  const res = await fetch("/files");
  const files = await res.json();
  displayFiles(files);
}

// Fayllarni chiqarish va boshqarish
function displayFiles(files) {
  fileList.innerHTML = "";
  const query = searchInput.value.toLowerCase();

  files
    .map((file, index) => ({ ...file, index }))
    .filter(file =>
      file.title.toLowerCase().includes(query) ||
      file.description.toLowerCase().includes(query)
    )
    .forEach(file => {
      const card = document.createElement("div");
      card.className = "file-card";

      card.innerHTML = `
        <h3 contenteditable="true" class="editable-title">${file.title}</h3>
        <p contenteditable="true" class="editable-desc">${file.description}</p>
        <button data-url="${file.path}" class="viewBtn">Ko‘rish</button>
        <button id="" class="editBtn" data-index="${file.index}">Tahrirlash</button>
        <button class="deleteBtn" data-index="${file.index}">O‘chirish</button>
      `;

      fileList.appendChild(card);
    });

  // Ko‘rish tugmasi
  document.querySelectorAll(".viewBtn").forEach(btn => {
    btn.addEventListener("click", () => {
      const fileUrl = btn.getAttribute("data-url");
      modalViewer.src = fileUrl;
      modal.style.display = "flex";
    });
  });

  const btns = document.querySelectorAll(".editBtn");
  console.log(btns);
// -------------------------------------------
const modal = document.getElementById("editModal");
const modalTitle = document.getElementById("modalTitle");
const modalDesc = document.getElementById("modalDesc");
const saveBtn = document.getElementById("saveChangesBtn");
const closeBtn = document.getElementById("closeModalBtn");


  let currentCard = null;

  btns.forEach((btn) => {
    btn.addEventListener("click", () => {
      currentCard = btn.parentElement;

      const currentTitle = currentCard.querySelector(".editable-title").innerText.trim();
      const currentDesc = currentCard.querySelector(".editable-desc").innerText.trim();

      modalTitle.value = currentTitle;
      modalDesc.value = currentDesc;

      modal.style.display = "block";
    });
  });

  closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

  saveBtn.addEventListener("click", () => {
    const updatedTitle = modalTitle.value.trim();
    const updatedDesc = modalDesc.value.trim();

    // Ma'lumotlarni sahifada yangilash
    currentCard.querySelector(".editable-title").innerText = updatedTitle;
    currentCard.querySelector(".editable-desc").innerText = updatedDesc;

    modal.style.display = "none";
  });

  // -----------------------------------

  // O‘chirish tugmasi
  document.querySelectorAll(".deleteBtn").forEach(btn => {
    btn.addEventListener("click", async () => {
      const index = btn.getAttribute("data-index");
      const confirmDelete = confirm("Rostdan ham o‘chirmoqchimisiz?");
      if (confirmDelete) {
        await fetch(`/files/${index}`, { method: "DELETE" });
        loadFiles();
      }
    });
  });
}

// Modalni yopish
modalClose.addEventListener("click", () => {
  modal.style.display = "none";
  modalViewer.src = "";
});

// Qidiruv input
searchInput.addEventListener("input", loadFiles);

// Dastlabki yuklash
loadFiles();

