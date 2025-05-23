
document.addEventListener('DOMContentLoaded', () => {
  const containers   = Array.from(document.querySelectorAll('#team .team-members'));
  const fixedCards   = [];
  const shuffleCards = [];

  containers.forEach(c => {
    c.querySelectorAll('.team-member').forEach(card => {
      (card.classList.contains('fixed') ? fixedCards : shuffleCards).push(card);
    });
  });

  for (let i = shuffleCards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffleCards[i], shuffleCards[j]] = [shuffleCards[j], shuffleCards[i]];
  }

  containers.forEach(c => c.innerHTML = '');


  shuffleCards.forEach((card, idx) => {
    const target = idx < 4 ? containers[0] : containers[1];
    target.appendChild(card);
  });
  containers[1].appendChild(fixedCards[0]); 
});

  const scrollTrigger = document.querySelector('#hero .scroll-down');
  if (scrollTrigger) {
    scrollTrigger.addEventListener('click', () => {
      const nextSection = document.querySelector('#hero').nextElementSibling;
      if (nextSection) {
        nextSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('inscricao-form');
    const submitBtn = document.getElementById('submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    const messagesDiv = document.getElementById('form-messages');
    const escolaSelect = document.getElementById('escola-select');
    const outraEscolaGroup = document.getElementById('outra-escola-group');
    const outraEscolaInput = document.getElementById('outra-escola');
    const telefoneInput = document.getElementById('telefone');

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

    function validateObjectives() {
        const objetivos = document.querySelectorAll('input[name="objetivos"]:checked');
        return objetivos.length > 0;
    }

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!validateObjectives()) {
            showMessage('❌ Por favor, selecione pelo menos um objetivo principal.', 'error');
            return;
        }
        
        submitBtn.disabled = true;
        btnText.style.display = 'none';
        btnLoading.style.display = 'inline';
        
        const formData = new FormData(form);
        
        const escolaSelecionada = escolaSelect.value;
        if (escolaSelecionada === 'outra') {
            formData.set('escola', outraEscolaInput.value);
        } else if (escolaSelecionada) {
            formData.set('escola', escolaSelect.options[escolaSelect.selectedIndex].text);
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
                outraEscolaGroup.style.display = 'none';
                outraEscolaInput.required = false;
            } else {
                throw new Error('Erro no envio');
            }
        })
        .catch(error => {
            showMessage('❌ Erro ao enviar inscrição. Verifique sua conexão e tente novamente, ou entre em contato conosco diretamente.', 'error');
        })
        .finally(() => {
            submitBtn.disabled = false;
            btnText.style.display = 'inline';
            btnLoading.style.display = 'none';
        });
    });

    function showMessage(message, type) {
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
});