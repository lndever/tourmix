document.addEventListener('DOMContentLoaded', function () {
    const header = document.getElementById('header');
    if (header) {
        window.addEventListener('scroll', function () {
            if (window.scrollY > 40) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    const form = document.getElementById('contatoForm');
    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            const nome = document.getElementById('nome')?.value || '';
            const destino = document.getElementById('destino')?.value || '';
            const mensagem = document.getElementById('mensagem')?.value || '';
            const texto = encodeURIComponent(
                'Olá! Meu nome é ' + nome +
                (destino ? '. Tenho interesse em: ' + destino : '') +
                (mensagem ? '. ' + mensagem : '')
            );
            window.open('https://wa.me/5511914841404?text=' + texto, '_blank');
        });
    }
});
