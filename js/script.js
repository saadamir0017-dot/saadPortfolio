// cursor ball
document.addEventListener('mousemove', function (e) {
    document.documentElement.style.setProperty('--cursorX', (e.clientX - 10) + 'px');
    document.documentElement.style.setProperty('--cursorY', (e.clientY - 10) + 'px');
});

// carousel
document.addEventListener('DOMContentLoaded', function () {
    const track = document.getElementById('carouselTrack');
    if (!track) return;

    fetch('data/carousel.json')
        .then(res => res.json())
        .then(data => {
            const items = data.carousel || [];
            track.innerHTML = '';

            items.forEach(item => {
                const card = document.createElement('div');
                card.className = 'card1 flex';

                const img = document.createElement('img');
                img.src = item.src;
                img.alt = item.title;
                card.appendChild(img);

                const heading = document.createElement('h2');
                heading.textContent = item.title;
                card.appendChild(heading);

                const desc = document.createElement('p');
                desc.textContent = item.description;
                card.appendChild(desc);

                track.appendChild(card);
            });

            initCarousel();
        })
        .catch(() => {
            track.innerHTML = '<p class="data-error">This content is currently unavailable. Please try again shortly.</p>';
        });
});

function initCarousel() {
    const cards = document.querySelectorAll('#carouselTrack .card1');
    if (cards.length === 0) return;

    let currentIndex = 0;
    let timer;

    function createPips() {
        const pipsContainer = document.getElementById('pips');
        if (!pipsContainer) return;
        pipsContainer.innerHTML = '';
        cards.forEach((_, index) => {
            const pip = document.createElement('button');
            pip.className = 'pip';
            pip.type = 'button';
            pip.setAttribute('aria-label', 'Go to slide ' + (index + 1));
            if (index === 0) pip.classList.add('active');
            pip.addEventListener('click', () => goToCard(index));
            pipsContainer.appendChild(pip);
        });
    }

    function updatePips() {
        const pips = document.querySelectorAll('.pip');
        pips.forEach((pip, index) => {
            pip.classList.toggle('active', index === currentIndex);
        });
    }

    function showCard(index) {
        cards.forEach(card => card.classList.remove('show'));
        if (cards[index]) cards[index].classList.add('show');
        updatePips();
    }

    function nextCard() {
        currentIndex = (currentIndex + 1) % cards.length;
        showCard(currentIndex);
    }

    function prevCard() {
        currentIndex = (currentIndex - 1 + cards.length) % cards.length;
        showCard(currentIndex);
    }

    function goToCard(index) {
        currentIndex = index;
        stopAutoRotate();
        showCard(currentIndex);
        startAutoRotate();
    }

    function startAutoRotate() {
        timer = setInterval(nextCard, 4000);
    }

    function stopAutoRotate() {
        clearInterval(timer);
    }

    createPips();
    showCard(0);
    startAutoRotate();

    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    if (prevBtn) {
        prevBtn.addEventListener('click', e => {
            e.preventDefault();
            prevCard();
            stopAutoRotate();
            startAutoRotate();
        });
    }
    if (nextBtn) {
        nextBtn.addEventListener('click', e => {
            e.preventDefault();
            nextCard();
            stopAutoRotate();
            startAutoRotate();
        });
    }

    cards.forEach(card => {
        card.addEventListener('mouseenter', stopAutoRotate);
        card.addEventListener('mouseleave', startAutoRotate);
    });
}

// gallery
document.addEventListener('DOMContentLoaded', function () {
    const gallery = document.getElementById('galleryGrid');
    if (!gallery) return;

    fetch('data/gallery.json')
        .then(res => res.json())
        .then(data => {
            const images = data.images || [];
            gallery.innerHTML = '';

            images.forEach(image => {
                const figure = document.createElement('figure');
                figure.className = 'gallery-item';

                const img = document.createElement('img');
                img.className = 'gallery-image';
                img.src = image.src;
                img.alt = image.title;
                img.loading = 'lazy';
                figure.appendChild(img);

                const caption = document.createElement('figcaption');
                caption.className = 'gallery-caption';
                const h3 = document.createElement('h3');
                h3.textContent = image.title;
                const p = document.createElement('p');
                p.textContent = image.description;
                caption.appendChild(h3);
                caption.appendChild(p);
                figure.appendChild(caption);

                figure.addEventListener('click', function () {
                    showImageModal(image.src, image.title, image.description);
                });

                gallery.appendChild(figure);
            });
        })
        .catch(() => {
            gallery.innerHTML = '<p class="data-error">This content is currently unavailable. Please try again shortly.</p>';
        });
});

function showImageModal(imageSrc, title, description) {
    let modal = document.getElementById('imageModal');

    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'imageModal';
        modal.className = 'modal';
        modal.innerHTML = '' +
            '<span class="modal-close" role="button" aria-label="Close">&times;</span>' +
            '<img class="modal-image" src="" alt="">' +
            '<div class="modal-info">' +
                '<h3 class="modal-title"></h3>' +
                '<p class="modal-description"></p>' +
            '</div>';
        document.body.appendChild(modal);

        modal.querySelector('.modal-close').addEventListener('click', function () {
            modal.classList.remove('is-open');
        });
        modal.addEventListener('click', function (e) {
            if (e.target === modal) modal.classList.remove('is-open');
        });
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') modal.classList.remove('is-open');
        });
    }

    modal.querySelector('.modal-image').src = imageSrc;
    modal.querySelector('.modal-image').alt = title;
    modal.querySelector('.modal-title').textContent = title;
    modal.querySelector('.modal-description').textContent = description;
    modal.classList.add('is-open');
}
