document.addEventListener('DOMContentLoaded', function() {
    
    // ===================================
    // SHUFFLE DOS CARDS DA EQUIPE
    // ===================================
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

    // ===================================
    // SCROLL SUAVE PARA PRÓXIMA SEÇÃO
    // ===================================
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

    // ===================================
    // FORMULÁRIO DE INSCRIÇÃO
    // ===================================
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

        function validateForm() {
            const errors = [];
            
            document.querySelectorAll('.field-error').forEach(el => {
                el.classList.remove('field-error');
            });
        
            const requiredFields = [
                { element: document.getElementById('nome'), name: 'Nome completo' },
                { element: document.getElementById('email'), name: 'Email' },
                { element: telefoneInput, name: 'Telefone' },
                { element: document.getElementById('idade'), name: 'Idade' },
                { element: document.getElementById('responsavel'), name: 'Nome do responsável' },
                { element: document.getElementById('telefone-responsavel'), name: 'Telefone do responsável' }
            ];
            
            requiredFields.forEach(field => {
                if (field.element && (!field.element.value || field.element.value.trim() === '')) {
                    field.element.classList.add('field-error');
                    errors.push({ element: field.element, message: `${field.name} é obrigatório` });
                }
            });
            
            if (escolaSelect) {
                if (!escolaSelect.value || escolaSelect.value === '') {
                    escolaSelect.classList.add('field-error');
                    errors.push({ element: escolaSelect, message: 'Selecione uma escola' });
                } else if (escolaSelect.value === 'outra') {
                    if (outraEscolaInput && (!outraEscolaInput.value || outraEscolaInput.value.trim() === '')) {
                        outraEscolaInput.classList.add('field-error');
                        errors.push({ element: outraEscolaInput, message: 'Nome da escola é obrigatório' });
                    }
                }
            }
            
            if (!validateObjectives()) {
                const objetivosContainer = document.querySelector('input[name="objetivos"]')?.closest('.form-group, .checkbox-group, fieldset');
                if (objetivosContainer) {
                    objetivosContainer.classList.add('field-error');
                    errors.push({ element: objetivosContainer, message: 'Selecione pelo menos um objetivo' });
                }
            }
            
            const emailField = document.getElementById('email');
            if (emailField && emailField.value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(emailField.value)) {
                    emailField.classList.add('field-error');
                    errors.push({ element: emailField, message: 'Email inválido' });
                }
            }
            
            const idadeField = document.getElementById('idade');
            if (idadeField && idadeField.value) {
                const idade = parseInt(idadeField.value);
                if (isNaN(idade) || idade < 1 || idade > 100) {
                    idadeField.classList.add('field-error');
                    errors.push({ element: idadeField, message: 'Idade deve ser um número válido' });
                }
            }
            
            return errors;
        }

        function handleValidationErrors(errors) {
            if (errors.length === 0) return true;
            
            const firstError = errors[0];
            firstError.element.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
            
            setTimeout(() => {
                if (firstError.element.tagName === 'INPUT' || firstError.element.tagName === 'SELECT') {
                    firstError.element.focus();
                }
            }, 500);
            
            const errorMessages = errors.map(error => `• ${error.message}`).join('<br>');
            showMessage(`❌ Por favor, corrija os seguintes campos:<br><br>${errorMessages}`, 'error');
            
            return false;
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
            
            const validationErrors = validateForm();
            if (!handleValidationErrors(validationErrors)) {
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

        form.addEventListener('input', function(e) {
            if (e.target.classList.contains('field-error')) {
                e.target.classList.remove('field-error');
            }
        });

        form.addEventListener('change', function(e) {
            if (e.target.classList.contains('field-error')) {
                e.target.classList.remove('field-error');
            }
            if (e.target.name === 'objetivos') {
                const objetivosContainer = e.target.closest('.form-group, .checkbox-group, fieldset');
                if (objetivosContainer && objetivosContainer.classList.contains('field-error')) {
                    objetivosContainer.classList.remove('field-error');
                }
            }
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
            console.log('Hamburger clicado'); // Debug
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

// Função para debug (Irei remover um dia rs)
function debugLog(message, data = null) {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.log(`[NextGenius Debug] ${message}`, data || '');
    }
}