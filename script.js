/**
 * ==========================================================================
 * JAVASCRIPT EKSTERNAL - IT SOLUTION HMP-TI (ITS)
 * Standar: Vanilla JavaScript Modern (ES6+), Zero Framework, Modular & Clean
 * Fitur: Real-time Search, Category Filter, Cost Simulator, Order Modal, FAQ
 * ==========================================================================
 */

// Database Spesifikasi 4 Unit Usaha HMP-TI
const DATA_UNIT_USAHA = {
  fnb: {
    category: "DIVISI KONSUMSI MAHASISWA",
    title: "Unit F&B (Food & Drink)",
    icon: "☕",
    description: "Menyediakan aneka menu makanan lezat, camilan berenergi, serta kopi racikan mahasiswa untuk menemani aktivitas perkuliahan. Melayani pemesanan paket katering dan snack box resmi untuk seminar, rapat kepanitiaan, dan workshop kampus.",
    hours: "08.00 - 18.00 WIB (Senin - Jumat)",
    location: "Kantin Gedung TI Lantai 1",
    pic: "Koordinator Divisi F&B HMP-TI",
    defaultNote: "Halo Admin Unit F&B HMP-TI, saya ingin menanyakan daftar menu dan pemesanan konsumsi untuk kegiatan mahasiswa."
  },
  percetakan: {
    category: "DIVISI AKADEMIK & REPRODUKSI",
    title: "Unit Percetakan & Dokumen",
    icon: "🖨️",
    description: "Layanan reproduksi dokumen akademik cepat dan berkualitas tinggi. Melayani print dokumen kilat (hitam-putih & warna), fotokopi modul perkuliahan, jilid skripsi (hard cover pita emas / spiral / lakban), laminating, dan jasa formatting tugas kuliah rapi.",
    hours: "07.30 - 17.30 WIB (Senin - Sabtu)",
    location: "Media Center HMP-TI Lantai 2",
    pic: "Penanggung Jawab Percetakan HMP-TI",
    defaultNote: "Halo Admin Percetakan HMP-TI, saya ingin mencetak dokumen dan menjilid laporan tugas kuliah saya."
  },
  konsinyasi: {
    category: "DIVISI INKUBASI WIRAUSAHA",
    title: "Unit Konsinyasi (Titip Jual)",
    icon: "🛍️",
    description: "Fasilitas etalase promosi dan penjualan bagi seluruh mahasiswa TI yang memiliki produk wirausaha (makanan, minuman, karya kriya, merchandise, aksesoris, stiker laptop, kaos). Dilengkapi pencatatan sistem pembukuan digital transparan dan bagi hasil berkala.",
    hours: "09.00 - 16.00 WIB (Hari Kerja Kampus)",
    location: "Etalase Sekretariat HMP-TI",
    pic: "Koordinator Program Konsinyasi Mahasiswa",
    defaultNote: "Halo Koordinator Konsinyasi HMP-TI, saya mahasiswa TI yang ingin bermitra dan menitipkan produk wirausaha saya di etalase himpunan."
  },
  kreatif: {
    category: "DIVISI MULTIMEDIA & DIGITAL AGENCY",
    title: "Unit Jasa Kreatif (Media & Design)",
    icon: "🎨",
    description: "Agensi multimedia profesional yang dikelola langsung oleh talenta mahasiswa TI. Menerima jasa pembuatan poster event, feeds media sosial, visual branding & logo, fotografi wisuda/acara formal, video cinematic reels, hingga prototype UI/UX digital.",
    hours: "08.00 - 21.00 WIB (Online & Studio)",
    location: "Studio Lab Multimedia TI (Gedung TI Lt. 3)",
    pic: "Creative Lead HMP-TI Agency",
    defaultNote: "Halo Tim Kreatif HMP-TI, saya ingin berkonsultasi mengenai kebutuhan jasa desain grafis dan dokumentasi multimedia."
  }
};

// Nomor WhatsApp Resmi Pengurus HMP-TI (Scraped Live dari its.hmp-ti.or.id)
const WHATSAPP_HOTLINE = "6285175044971";

let currentActiveUnitKey = "kreatif";

/**
 * 1. FILTER KATALOG BERDASARKAN KATEGORI & PENCARIAN TEKS REAL-TIME
 */
let currentCategory = "all";

function setFilterCategory(category, buttonElement) {
  currentCategory = category;

  // Update styling tombol tab aktif
  const tabs = document.querySelectorAll(".filter-btn");
  tabs.forEach(btn => btn.classList.remove("active"));
  if (buttonElement) {
    buttonElement.classList.add("active");
  }

  filterCatalog();
}

function filterCatalog() {
  const searchInput = document.getElementById("searchInput");
  const query = searchInput ? searchInput.value.toLowerCase().trim() : "";
  const cards = document.querySelectorAll(".unit-card");
  let visibleCount = 0;

  cards.forEach(card => {
    const cardCategory = card.getAttribute("data-category");
    const cardText = card.innerText.toLowerCase();

    const matchesCategory = (currentCategory === "all") || (cardCategory === currentCategory);
    const matchesSearch = query === "" || cardText.includes(query);

    if (matchesCategory && matchesSearch) {
      card.style.display = "flex";
      visibleCount++;
    } else {
      card.style.display = "none";
    }
  });

  // Tampilkan notifikasi jika hasil pencarian kosong
  const noResultsNotice = document.getElementById("noResultsNotice");
  if (noResultsNotice) {
    if (visibleCount === 0) {
      noResultsNotice.classList.remove("hidden");
    } else {
      noResultsNotice.classList.add("hidden");
    }
  }
}

/**
 * 2. MODAL ORDER & KONSULTASI DETAIL
 */
function openOrderModal(unitKey) {
  const data = DATA_UNIT_USAHA[unitKey];
  if (!data) return;

  currentActiveUnitKey = unitKey;

  document.getElementById("modalUnitIcon").textContent = data.icon;
  document.getElementById("modalUnitCategory").textContent = data.category;
  document.getElementById("modalUnitTitle").textContent = data.title;
  document.getElementById("modalUnitDesc").textContent = data.description;
  document.getElementById("modalUnitHours").textContent = data.hours;
  document.getElementById("modalUnitLocation").textContent = data.location;
  document.getElementById("modalUnitPIC").textContent = data.pic;

  const noteInput = document.getElementById("orderNoteInput");
  noteInput.value = data.defaultNote;

  updateWhatsAppLink();

  // Buka Backdrop
  const modal = document.getElementById("orderModalOverlay");
  modal.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeOrderModal() {
  const modal = document.getElementById("orderModalOverlay");
  modal.classList.remove("active");
  document.body.style.overflow = "auto";
}

function closeOrderModalOnBackdrop(event) {
  if (event.target.id === "orderModalOverlay") {
    closeOrderModal();
  }
}

// Update link WhatsApp saat catatan diketik
const noteInput = document.getElementById("orderNoteInput");
if (noteInput) {
  noteInput.addEventListener("input", updateWhatsAppLink);
}

function updateWhatsAppLink() {
  const noteText = document.getElementById("orderNoteInput").value;
  const encodedText = encodeURIComponent(noteText);
  const waUrl = `https://wa.me/${WHATSAPP_HOTLINE}?text=${encodedText}`;
  const btn = document.getElementById("modalWhatsAppLink");
  if (btn) {
    btn.setAttribute("href", waUrl);
  }
}

/**
 * 3. KALKULATOR ESTIMASI BIAYA PERCETAKAN (BONUS INTERAKTIVITAS)
 */
function openCalculatorModal() {
  calculateEstimate();
  const modal = document.getElementById("calcModalOverlay");
  modal.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeCalcModal() {
  const modal = document.getElementById("calcModalOverlay");
  modal.classList.remove("active");
  document.body.style.overflow = "auto";
}

function closeCalcModalOnBackdrop(event) {
  if (event.target.id === "calcModalOverlay") {
    closeCalcModal();
  }
}

function calculateEstimate() {
  const docTypePrice = parseInt(document.getElementById("calcDocType").value) || 500;
  let pages = parseInt(document.getElementById("calcPages").value) || 0;
  if (pages < 1) pages = 1;
  const bindingPrice = parseInt(document.getElementById("calcBinding").value) || 0;

  const total = (docTypePrice * pages) + bindingPrice;

  // Format IDR (Rupiah)
  const formatted = "Rp " + total.toLocaleString("id-ID");
  document.getElementById("calcTotalResult").textContent = formatted;
}

function orderFromCalculator() {
  const docSelect = document.getElementById("calcDocType");
  const docText = docSelect.options[docSelect.selectedIndex].text;
  const pages = document.getElementById("calcPages").value;
  const bindingSelect = document.getElementById("calcBinding");
  const bindingText = bindingSelect.options[bindingSelect.selectedIndex].text;
  const total = document.getElementById("calcTotalResult").textContent;

  const msg = `Halo Admin Unit Percetakan HMP-TI, saya ingin pesan cetak via simulasi website:\n` +
              `- Jenis: ${docText}\n` +
              `- Jumlah: ${pages} lembar\n` +
              `- Jilid: ${bindingText}\n` +
              `- Estimasi Total: ${total}\n\n` +
              `Mohon info pengiriman file dan waktu pengerjaan. Terima kasih!`;

  const waUrl = `https://wa.me/${WHATSAPP_HOTLINE}?text=${encodeURIComponent(msg)}`;
  window.open(waUrl, "_blank");
}

/**
 * 4. FAQ ACCORDION INTERACTION
 */
function toggleFaq(itemElement) {
  const isActive = itemElement.classList.contains("active");

  // Tutup FAQ lain untuk kerapian (akordeon eksklusif)
  document.querySelectorAll(".faq-item").forEach(faq => {
    faq.classList.remove("active");
  });

  if (!isActive) {
    itemElement.classList.add("active");
  }
}

/**
 * 5. MOBILE MENU TOGGLE
 */
function toggleMobileMenu() {
  const menu = document.getElementById("navMenu");
  if (menu) {
    menu.classList.toggle("open");
  }
}

// Tutup menu mobile ketika salah satu tautan diklik
document.querySelectorAll(".nav-link").forEach(link => {
  link.addEventListener("click", () => {
    const menu = document.getElementById("navMenu");
    if (menu && menu.classList.contains("open")) {
      menu.classList.remove("open");
    }
  });
});

/**
 * 6. KEYBOARD ESCAPE LISTENER UNTUK MENUTUP SEMUA MODAL
 */
document.addEventListener("keydown", function(event) {
  if (event.key === "Escape") {
    closeOrderModal();
    closeCalcModal();
  }
});

/**
 * 7. LOG VERIFIKASI SAAT HALAMAN SELESAI DIMUAT
 */
document.addEventListener("DOMContentLoaded", () => {
  console.log("%c IT Solution HMP-TI Digital Agency Engine Active! %c Ver 2.0 Cyber Edition ", 
    "background: #0a0f2c; color: #3ed6e8; font-weight: bold; padding: 4px 8px; border-radius: 4px 0 0 4px;",
    "background: #3ed6e8; color: #060a1f; font-weight: bold; padding: 4px 8px; border-radius: 0 4px 4px 0;"
  );
});
