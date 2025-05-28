        const backToTopButton = document.getElementById('backToTop');
        
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTopButton.classList.add('show');
            } else {
                backToTopButton.classList.remove('show');
            }
        });
        
        backToTopButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        // Newsletter form
        const newsletterForm = document.querySelector('.newsletter-form');
        const newsletterInput = document.querySelector('.newsletter-input');
        const newsletterBtn = document.querySelector('.newsletter-btn');

        newsletterBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const email = newsletterInput.value.trim();
            
            if (email && email.includes('@')) {
                // Simular envio
                newsletterBtn.innerHTML = '<i class="fas fa-check"></i> Inscrito!';
                newsletterBtn.style.background = '#10b981';
                newsletterInput.value = '';
                
                setTimeout(() => {
                    newsletterBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Inscrever-se';
                    newsletterBtn.style.background = 'linear-gradient(45deg, var(--accent-yellow), #f59e0b)';
                }, 3000);
            } else {
                newsletterInput.style.borderColor = '#ef4444';
                setTimeout(() => {
                    newsletterInput.style.borderColor = 'transparent';
                }, 2000);
            }
        });

        // Animação de entrada dos elementos
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animationPlayState = 'running';
                }
            });
        }, observerOptions);

        document.querySelectorAll('.footer-column').forEach(column => {
            observer.observe(column);
        });