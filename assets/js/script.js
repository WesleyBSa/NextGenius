document.addEventListener('DOMContentLoaded', function() {
    
    function initTeamShuffle() {
        const containers = Array.from(document.querySelectorAll('#team .team-members'));
        const fixedCards = [];
        const shuffleCards = [];

        if (containers.length === 0) return;

        containers.forEach(container => {
            const teamMembers = container.querySelectorAll('.team-member');
            teamMembers.forEach(card => {
                if (card.classList.contains('fixed')) {
                    fixedCards.push(card);
                } else {
                    shuffleCards.push(card);
                }
            });
        });

        for (let i = shuffleCards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffleCards[i], shuffleCards[j]] = [shuffleCards[j], shuffleCards[i]];
        }

        containers.forEach(container => {
            container.innerHTML = '';
        });

        shuffleCards.forEach((card, index) => {
            const targetContainer = index < 4 ? containers[0] : containers[1];
            if (targetContainer) {
                targetContainer.appendChild(card);
            }
        });

        if (fixedCards.length > 0 && containers[1]) {
            containers[1].appendChild(fixedCards[0]);
        }
    }

    function initScrollTrigger() {
        const scrollTrigger = document.querySelector('#hero .scroll-down');
        if (scrollTrigger) {
            scrollTrigger.addEventListener('click', function() {
                const heroSection = document.querySelector('#hero');
                const nextSection = heroSection ? heroSection.nextElementSibling : null;
                if (nextSection) {
                    nextSection.scrollIntoView({ behavior: 'smooth' });
                }
            });
        }
    }

    function initRegistrationForm() {
        const form = document.getElementById('inscricao-form');
        if (!form) return; 

        const submitBtn = document.getElementById('submit-btn');
        const btnText = submitBtn?.querySelector('.btn-text');
        const btnLoading = submitBtn?.querySelector('.btn-loading');
        const messagesDiv = document.getElementById('form-messages');
        const escolaSelect = document.getElementById('escola-select');
        const outraEscolaGroup = document.getElementById('outra-escola-group');
        const outraEscolaInput = document.getElementById('outra-escola');
        const telefoneInput = document.getElementById('telefone');

        if (telefoneInput) {
            telefoneInput.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\D/g, '');
                
                if (value.length >= 11) {
                    value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
                } else if (value.length >= 6) {
                    value = value.replace(/(\d{2})(\d{4})(\d+)/, '($1) $2-$3');
                } else if (value.length >= 2) {
                    value = value.replace(/(\d{2})(\d+)/, '($1) $2');
                }
                
                e.target.value = value;
            });
        }

        if (escolaSelect && outraEscolaGroup && outraEscolaInput) {
            escolaSelect.addEventListener('change', function() {
                if (this.value === 'outra') {
                    outraEscolaGroup.style.display = 'block';
                    outraEscolaInput.required = true;
                } else {
                    outraEscolaGroup.style.display = 'none';
                    outraEscolaInput.required = false;
                    outraEscolaInput.value = '';
                }
            });
        }

        function validateObjectives() {
            const objetivos = document.querySelectorAll('input[name="objetivos"]:checked');
            return objetivos.length > 0;
        }

        function showMessage(message, type) {
            if (!messagesDiv) return;

            messagesDiv.innerHTML = message;
            messagesDiv.style.display = 'block';
            
            if (type === 'success') {
                messagesDiv.style.backgroundColor = '#d4edda';
                messagesDiv.style.color = '#155724';
                messagesDiv.style.border = '1px solid #c3e6cb';
            } else {
                messagesDiv.style.backgroundColor = '#f8d7da';
                messagesDiv.style.color = '#721c24';
                messagesDiv.style.border = '1px solid #f5c6cb';
            }
            
            messagesDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            setTimeout(() => {
                messagesDiv.style.display = 'none';
            }, 10000);
        }

        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (!validateObjectives()) {
                showMessage('❌ Por favor, selecione pelo menos um objetivo principal.', 'error');
                return;
            }
            
            if (submitBtn && btnText && btnLoading) {
                submitBtn.disabled = true;
                btnText.style.display = 'none';
                btnLoading.style.display = 'inline';
            }
            
            const formData = new FormData(form);
            
            if (escolaSelect) {
                const escolaSelecionada = escolaSelect.value;
                if (escolaSelecionada === 'outra' && outraEscolaInput) {
                    formData.set('escola', outraEscolaInput.value);
                } else if (escolaSelecionada) {
                    formData.set('escola', escolaSelect.options[escolaSelect.selectedIndex].text);
                }
            }
            
            fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    showMessage('🎉 Inscrição enviada com sucesso! Nossa equipe analisará suas informações e entrará em contato em breve. Fique de olho no seu email e WhatsApp!', 'success');
                    form.reset();
                    if (outraEscolaGroup && outraEscolaInput) {
                        outraEscolaGroup.style.display = 'none';
                        outraEscolaInput.required = false;
                    }
                } else {
                    throw new Error('Erro no envio');
                }
            })
            .catch(error => {
                console.error('Erro:', error);
                showMessage('❌ Erro ao enviar inscrição. Verifique sua conexão e tente novamente, ou entre em contato conosco diretamente.', 'error');
            })
            .finally(() => {
                if (submitBtn && btnText && btnLoading) {
                    submitBtn.disabled = false;
                    btnText.style.display = 'inline';
                    btnLoading.style.display = 'none';
                }
            });
        });
    }

    function initNavbar() {
        const hamburger = document.getElementById('hamburger');
        const navLinks = document.querySelector('.nav-links'); 

        if (!hamburger || !navLinks) {
            console.log('Elementos não encontrados:', { hamburger: !!hamburger, navLinks: !!navLinks });
            return;
        }

        hamburger.addEventListener('click', function() {
            console.log('Hamburger clicado'); 
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        const navLinksItems = document.querySelectorAll('.nav-links a');
        navLinksItems.forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });

        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            }
        });

        navLinksItems.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 70;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    initTeamShuffle();
    initScrollTrigger();
    initRegistrationForm();
    initNavbar();
});

function debugLog(message, data = null) {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.log(`[NextGenius Debug] ${message}`, data || '');
    }
}