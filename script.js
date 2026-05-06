// ==========================================
// 1. SPLASH SCREEN
// ==========================================
window.addEventListener('load', () => {
    const intro = document.getElementById('intro-screen');

    setTimeout(() => {
        if (intro) {
            intro.style.opacity = '0';
            setTimeout(() => {
                intro.style.display = 'none';
            }, 500);
        }
    }, 2500);
});


// ==========================================
// 2. DATA KERANJANG
// ==========================================
let keranjang = [];

function tambahCart(nama, harga) {
    keranjang.push({
        nama: nama,
        harga: parseInt(harga)
    });

    alert("🎀 " + nama + " masuk ke keranjang!");
    updateTampilan();
}


// ==========================================
// 3. UPDATE TAMPILAN (KERANJANG + CHECKOUT)
// ==========================================
function updateTampilan() {
    const isiKeranjang = document.getElementById('isi-keranjang');
    const isiCheckout = document.getElementById('isi-checkout');
    const totalKeranjang = document.getElementById('total-di-keranjang');
    const totalCheckout = document.getElementById('total-di-checkout');
    const ongkirText = document.getElementById('ongkir-text');

    let html = "";
    let subtotal = 0;

    // Jika kosong
    if (keranjang.length === 0) {
        const kosong = "<p style='text-align:center;'>Keranjang kosong 🌸</p>";
        if (isiKeranjang) isiKeranjang.innerHTML = kosong;
        if (isiCheckout) isiCheckout.innerHTML = kosong;
        if (totalKeranjang) totalKeranjang.innerText = "Rp 0";
        if (totalCheckout) totalCheckout.innerText = "Rp 0";
        if (ongkirText) ongkirText.innerText = "Rp 0";
        return;
    }

    // Render item
    keranjang.forEach(item => {
        html += `
            <div style="display:flex; justify-content:space-between; margin-bottom:6px;">
                <span>${item.nama}</span>
                <span>Rp ${item.harga.toLocaleString('id-ID')}</span>
            </div>
        `;
        subtotal += item.harga;
    });

    // Ongkir
    let ongkir = 0;
    const ekspedisi = document.getElementById('pilihan-ekspedisi');
    if (ekspedisi && ekspedisi.value) {
        ongkir = parseInt(ekspedisi.value) || 0;
    }

    const totalAkhir = subtotal + ongkir;

    // Output
    if (isiKeranjang) isiKeranjang.innerHTML = html;
    if (isiCheckout) isiCheckout.innerHTML = html;

    if (totalKeranjang) {
        totalKeranjang.innerText = "Rp " + subtotal.toLocaleString('id-ID');
    }

    if (totalCheckout) {
        totalCheckout.innerText = "Rp " + totalAkhir.toLocaleString('id-ID');
    }

    if (ongkirText) {
        ongkirText.innerText = "Rp " + ongkir.toLocaleString('id-ID');
    }
}


// ==========================================
// 4. NAVIGASI HALAMAN
// ==========================================
function buka(id) {
    const semua = document.querySelectorAll('.halaman');

    semua.forEach(el => {
        el.style.display = "none";
        el.classList.remove('aktif');
    });

    const tujuan = document.getElementById(id);
    if (tujuan) {
        tujuan.style.display = "block";
        tujuan.classList.add('aktif');
        window.scrollTo(0, 0);
    }
}


// ==========================================
// 5. CETAK STRUK
// ==========================================
function cetakBukti() {
    const nama = document.getElementById('nama-pembeli').value;

    if (!nama || keranjang.length === 0) {
        alert("Isi nama & pilih produk dulu ya!");
        return;
    }

    document.getElementById('stempel-lunas').style.display = 'block';
    document.getElementById('date-now').innerText =
        "Tgl: " + new Date().toLocaleDateString('id-ID');

    const random = Math.floor(Math.random() * 1000);
    document.getElementById('invoice-num').innerText =
        "No: #CB-" + Date.now().toString().slice(-4) + random;

    window.print();

    setTimeout(() => {
        document.getElementById('stempel-lunas').style.display = 'none';
    }, 1000);
}


// ==========================================
// 6. KIRIM KE WHATSAPP
// ==========================================
function kirimPesanan() {
    const nama = document.getElementById('nama-pembeli').value;
    const alamat = document.getElementById('alamat-pembeli').value;

    if (!nama || !alamat) {
        alert("Isi nama & alamat dulu ya!");
        return;
    }

    let detailProduk = "";
    keranjang.forEach(item => {
        detailProduk += `- ${item.nama} (Rp ${item.harga.toLocaleString('id-ID')})%0A`;
    });

    const ekspedisi = document.getElementById('pilihan-ekspedisi');
    const ongkir = ekspedisi && ekspedisi.value ? parseInt(ekspedisi.value) : 0;

    const pesan = `Halo Cherie Box! 🎀%0A%0A` +
        `Nama: ${nama}%0A` +
        `Alamat: ${alamat}%0A%0A` +
        `Pesanan:%0A${detailProduk}%0A` +
        `Ongkir: Rp ${ongkir.toLocaleString('id-ID')}%0A%0A` +
        `Terima kasih ✨`;

    window.location.href = `https://wa.me/6281253113500?text=${pesan}`;
}


// ==========================================
// 7. METODE PEMBAYARAN
// ==========================================
document.getElementById('metode-bayar')?.addEventListener('change', function () {
    const box = document.getElementById('instruksi-pembayaran-teks');
    const val = this.value;

    if (!box) return;

    box.style.display = 'block';

    if (val === "Transfer Bank") {
        box.innerHTML = "Transfer ke BCA: 1234567890 a.n Cherie Box";
    } else if (val === "QRIS") {
        box.innerHTML = "Scan QRIS setelah konfirmasi via WhatsApp";
    } else if (val === "E-Wallet") {
        box.innerHTML = "DANA / OVO / GOPAY: 0812-5311-3500";
    } else {
        box.style.display = 'none';
    }
});


// ==========================================
// 8. SEARCH PRODUK
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');

    if (!searchInput) return;

    searchInput.addEventListener('input', function () {
        const keyword = this.value.toLowerCase().trim();
        const cards = document.querySelectorAll('.card-premium');

        cards.forEach(card => {
            const text = card.innerText.toLowerCase();

            if (text.includes(keyword)) {
                card.style.display = "inline-block";
                card.style.opacity = "1";
            } else {
                card.style.display = "none";
                card.style.opacity = "0";
            }
        });
    });
});


// ==========================================
// 9. AUTO UPDATE ONGKIR
// ==========================================
document.getElementById('pilihan-ekspedisi')?.addEventListener('change', updateTampilan);

// Fungsi utama untuk menghilangkan loading
function hilangkanLoading() {
    const loader = document.querySelector(".loader-wrapper");
    if (loader) {
        loader.classList.add("loader-hidden");
        console.log("Loading berhasil dihilangkan!");
    }
}

// 1. Hilangkan saat halaman sudah siap (Normal)
window.addEventListener("load", hilangkanLoading);

// 2. JAGA-JAGA (Anti-Macet): Jika dalam 2 detik belum hilang, paksa hilang!
setTimeout(hilangkanLoading, 2000);


// Opsional: Memunculkan kembali loading saat klik link agar transisi terasa smooth
document.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', function() {
        const loader = document.querySelector(".loader-wrapper");
        loader.classList.remove("loader-hidden");
    });
});


// ==========================================
// BACKGROUND MUSIC FIX AUTOPLAY
// ==========================================
window.addEventListener('load', () => {
    const music = document.getElementById('bg-music');

    if (!music) return;

    // Mulai dalam keadaan mute (biar lolos autoplay)
    music.muted = true;

    // Coba play
    music.play().then(() => {
        // Setelah berhasil, unmute sedikit delay biar aman
        setTimeout(() => {
            music.muted = false;
            music.volume = 0.5; // biar ga kenceng banget
        }, 500);
    }).catch(() => {
        // Kalau masih diblokir → play saat user klik pertama
        document.addEventListener('click', () => {
            music.muted = false;
            music.play();
        }, { once: true });
    });
});