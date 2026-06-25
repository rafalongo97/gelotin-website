document.addEventListener('DOMContentLoaded', () => {
    // 1. Inicializar Ícones Lucide
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // 2. Menu Mobile Responsivo
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    const menuIcon = document.getElementById('menu-icon');
    const navLinks = document.querySelectorAll('.nav-link');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('open');
            document.body.classList.toggle('nav-mobile-active');
            
            // Alternar ícone entre menu e fechar (x)
            if (navMenu.classList.contains('open')) {
                menuIcon.setAttribute('data-lucide', 'x');
            } else {
                menuIcon.setAttribute('data-lucide', 'menu');
            }
            lucide.createIcons();
        });

        // Fechar menu mobile ao clicar em um link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('open');
                document.body.classList.remove('nav-mobile-active');
                menuIcon.setAttribute('data-lucide', 'menu');
                lucide.createIcons();
            });
        });
    }

    // 3. Efeito Header no Scroll
    const header = document.querySelector('.header');
    
    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Executar no carregamento inicial

    // 4. Highlight do Menu Ativo no Scroll
    const sections = document.querySelectorAll('section[id]');
    
    const highlightNav = () => {
        const scrollY = window.pageYOffset;
        
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 100;
            const sectionId = current.getAttribute('id');
            const navLink = document.querySelector(`.nav-list a[href*=${sectionId}]`);
            
            if (navLink) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    navLinks.forEach(link => link.classList.remove('active'));
                    navLink.classList.add('active');
                }
            }
        });

        // Se estiver no topo absoluto, destacar o link Início
        if (scrollY < 100) {
            navLinks.forEach(link => link.classList.remove('active'));
            const homeLink = document.querySelector('.nav-list a[href="#"]');
            if (homeLink) homeLink.classList.add('active');
        }
    };

    window.addEventListener('scroll', highlightNav);

    // 5. Calculadora de Gelo Interativa
    const eventSelect = document.getElementById('event-type');
    const peopleSlider = document.getElementById('people-count');
    const peopleDisplay = document.getElementById('people-value');
    
    const tuboResultSpan = document.getElementById('tubo-result');
    const tuboPkgsSpan = document.getElementById('tubo-pkgs');
    const escamaResultSpan = document.getElementById('escama-result');
    const escamaPkgsSpan = document.getElementById('escama-pkgs');
    const totalResultSpan = document.getElementById('total-result');
    const btnOrderCalc = document.getElementById('btn-order-calc');

    // Fatores de cálculo por tipo de evento (peso em kg por pessoa)
    const factorTable = {
        churrasco: { tubo: 0.5, escama: 0.3 },   // Bebidas leves + gelar
        casamento: { tubo: 0.7, escama: 0.2 },   // Drinks finos + buffet gelado
        coquetel: { tubo: 1.0, escama: 0.1 },    // Muito drink batido/copo
        conservacao: { tubo: 0.1, escama: 0.8 }  // Resfriamento bruto de bebidas
    };

    const calculateIce = () => {
        if (!eventSelect || !peopleSlider) return;

        const eventType = eventSelect.value;
        const peopleCount = parseInt(peopleSlider.value, 10);
        
        // Atualizar texto do slider
        if (peopleDisplay) {
            peopleDisplay.textContent = peopleCount;
        }

        const factors = factorTable[eventType] || { tubo: 0.5, escama: 0.3 };

        // Cálculo bruto em kg
        let rawTubo = peopleCount * factors.tubo;
        let rawEscama = peopleCount * factors.escama;

        // Regras de embalagem:
        // Gelo em Tubos vendido em sacos de 3kg
        // Gelo em Escamas vendido em sacos de 10kg
        const sacosTubo = Math.ceil(rawTubo / 3);
        const sacosEscama = Math.ceil(rawEscama / 10);

        const finalTuboKg = sacosTubo * 3;
        const finalEscamaKg = sacosEscama * 10;
        const finalTotalKg = finalTuboKg + finalEscamaKg;

        // Atualizar a tela
        if (tuboResultSpan) tuboResultSpan.textContent = finalTuboKg;
        if (tuboPkgsSpan) tuboPkgsSpan.textContent = sacosTubo;
        if (escamaResultSpan) escamaResultSpan.textContent = finalEscamaKg;
        if (escamaPkgsSpan) escamaPkgsSpan.textContent = sacosEscama;
        if (totalResultSpan) totalResultSpan.textContent = `${finalTotalKg} kg`;
    };

    if (peopleSlider && eventSelect) {
        peopleSlider.addEventListener('input', calculateIce);
        eventSelect.addEventListener('change', calculateIce);
        calculateIce(); // Executar cálculo inicial
    }

    // Ação do Botão da Calculadora (Enviar p/ WhatsApp)
    if (btnOrderCalc) {
        btnOrderCalc.addEventListener('click', () => {
            const eventTypeText = eventSelect.options[eventSelect.selectedIndex].text;
            const peopleCount = peopleSlider.value;
            const kgTubo = tuboResultSpan.textContent;
            const sacosTubo = tuboPkgsSpan.textContent;
            const kgEscama = escamaResultSpan.textContent;
            const sacosEscama = escamaPkgsSpan.textContent;
            const totalKg = totalResultSpan.textContent;

            const whatsappNumber = '5511999999999'; // Substituir pelo número real do cliente
            const message = `Olá, Gelotin! Fiz uma simulação na calculadora do site:\n\n` + 
                            `• Tipo de Evento: ${eventTypeText}\n` +
                            `• Convidados: ${peopleCount} pessoas\n` +
                            `• Gelo em Tubos (Ideal p/ Copos): ${kgTubo}kg (${sacosTubo} sacos de 3kg)\n` +
                            `• Gelo em Escamas (Ideal p/ Gelar): ${kgEscama}kg (${sacosEscama} sacos de 10kg)\n\n` +
                            `*Total Estimado: ${totalKg}*\n\n` +
                            `Gostaria de solicitar um orçamento/entrega para esse pedido. Como podemos prosseguir?`;
            
            const encodedMessage = encodeURIComponent(message);
            const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
            
            window.open(whatsappUrl, '_blank');
        });
    }

    // 6. Formulário de Contato Integrado ao WhatsApp
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('form-name').value;
            const phone = document.getElementById('form-phone').value;
            const subjectSelect = document.getElementById('form-subject');
            const subjectText = subjectSelect.options[subjectSelect.selectedIndex].text;
            const message = document.getElementById('form-message').value;

            const whatsappNumber = '5511999999999'; // Substituir pelo número real
            const waMessage = `Olá, Gelotin! Recebi um contato do site:\n\n` +
                              `• Nome: ${name}\n` +
                              `• WhatsApp/Telefone: ${phone}\n` +
                              `• Assunto: ${subjectText}\n` +
                              `• Mensagem: ${message}`;
            
            const encodedWaMessage = encodeURIComponent(waMessage);
            const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedWaMessage}`;
            
            window.open(whatsappUrl, '_blank');
        });
    }

    // 7. Animação de Scroll (Intersection Observer)
    const elementsToAnimate = document.querySelectorAll('.qualidade-item, .product-card, .calculator-card, .map-info, .map-visual, .contact-grid');
    
    // Adicionar a classe inicial de animação
    elementsToAnimate.forEach(el => {
        el.classList.add('animate-on-scroll');
    });

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('appear');
                observer.unobserve(entry.target); // Animar apenas uma vez
            }
        });
    }, observerOptions);

    elementsToAnimate.forEach(el => {
        observer.observe(el);
    });
});
