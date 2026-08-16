/* ==========================================
   MAIN SCRIPT (Softred 001)
   ========================================== */

document.addEventListener('DOMContentLoaded', function () {
  
  // ------------------------------------------
  // 1. URL PARAMETER CHECKER (?to=NamaTamu)
  // ------------------------------------------
  const urlParams = new URLSearchParams(window.location.search);
  const guestNameParam = urlParams.get('to');
  const guestBox = document.getElementById('guest-container');
  const guestNameEl = document.getElementById('guest-name');

  if (guestNameParam) {
    if (guestNameEl) {
      guestNameEl.innerText = guestNameParam;
    }
    if (guestBox) {
      guestBox.classList.remove('hidden');
    }
  }

  // Kunci scroll halaman saat Cover Screen aktif
  document.body.classList.add('no-scroll');

  // ------------------------------------------
  // 2. OPEN INVITATION BUTTON
  // ------------------------------------------
  const btnOpen = document.getElementById('btn-open-invitation');
  const coverScreen = document.getElementById('cover-screen');
  const sideNav = document.getElementById('side-nav');
  const mainContent = document.getElementById('main-content');

  if (btnOpen) {
    btnOpen.addEventListener('click', function () {
      // 1. Animasi keluar untuk Cover Screen
      if (coverScreen) {
        coverScreen.classList.add('slide-up-fade');
      }

      // 2. Buka kunci scroll body
      document.body.classList.remove('no-scroll');
      if (mainContent) {
        mainContent.classList.remove('locked');
      }

      // 3. Tampilkan Navigasi Samping & Play Audio
      if (sideNav) {
        sideNav.classList.remove('hidden');
      }

      // Memutar musik (fungsi dari music.js)
      if (typeof playAudio === 'function') {
        playAudio();
      }
    });
  }

  // ------------------------------------------
  // 3. FLOATING SIDE NAVIGATION & SCROLLSPY
  // ------------------------------------------
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section.section');

  // Smooth scroll saat ikon navigasi diklik
  navLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetSection = document.querySelector(targetId);

      if (targetSection) {
        targetSection.scrollIntoView({
          behavior: 'smooth'
        });
      }
    });
  });

  // Highlight ikon navigasi sesuai seksi yang aktif (Scrollspy)
  window.addEventListener('scroll', function () {
    let currentSection = '';

    sections.forEach(section => {
      const sectionTop = section.offsetTop - 150;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentSection = '#' + section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === currentSection) {
        link.classList.add('active');
      }
    });
  });

  // ------------------------------------------
  // 4. COPY REKENING TO CLIPBOARD
  // ------------------------------------------
  const copyButtons = document.querySelectorAll('.btn-copy');

  function fallbackCopyText(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();

    let success = false;
    try {
      success = document.execCommand('copy');
    } catch (err) {
      success = false;
    }

    document.body.removeChild(textarea);
    return success;
  }

  copyButtons.forEach(button => {
    const originalHTML = button.innerHTML;

    button.addEventListener('click', function () {
      const accountNumber = this.getAttribute('data-account');
      if (!accountNumber) return;

      const showCopiedState = () => {
        this.classList.add('copied');
        this.innerHTML = '<i class="fa-solid fa-check"></i> Tersalin!';

        setTimeout(() => {
          this.classList.remove('copied');
          this.innerHTML = originalHTML;
        }, 1800);
      };

      const notify = (ok) => {
        if (ok) {
          showCopiedState();
        }
        const msg = ok
          ? `Nomor rekening ${accountNumber} berhasil disalin!`
          : 'Gagal menyalin nomor rekening.';

        if (typeof showToast === 'function') {
          showToast(msg);
        } else if (!ok) {
          alert(msg);
        }
      };

      // Gunakan Clipboard API jika tersedia & konteksnya aman (HTTPS/localhost)
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(accountNumber)
          .then(() => notify(true))
          .catch(() => notify(fallbackCopyText(accountNumber)));
      } else {
        // Fallback untuk hosting tanpa HTTPS / browser lama
        notify(fallbackCopyText(accountNumber));
      }
    });
  });

});