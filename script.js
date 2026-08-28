document.addEventListener('DOMContentLoaded', function() {
        const menuToggle = document.getElementById('menuToggle');
            const nav = document.getElementById('nav');

                if (menuToggle && nav) {
                        menuToggle.addEventListener('click', function() {
                                    nav.classList.toggle('open');
                                            });

                                                    // Fecha o menu ao clicar em qualquer link
                                                            nav.querySelectorAll('a').forEach(function(link) {
                                                                        link.addEventListener('click', function() {
                                                                                        nav.classList.remove('open');
                                                                                                    });
                                                                                                            });
                                                                                                                }

                                                                                                                    // Header com fundo ao rolar
                                                                                                                        const header = document.getElementById('header');
                                                                                                                            window.addEventListener('scroll', function() {
                                                                                                                                    if (window.scrollY > 40) {
                                                                                                                                                header.classList.add('scrolled');
                                                                                                                                                        } else {
                                                                                                                                                                    header.classList.remove('scrolled');
                                                                                                                                                                            }
                                                                                                                                                                                });
                                                                                                                                                                                });
