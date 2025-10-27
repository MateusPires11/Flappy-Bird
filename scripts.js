const sprites = new Image();
sprites.src = './sprites.png';

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const msgGetReady = {
    spritex: 134,
    spritey: 0,
    largura: 174,
    altura: 152,
    x: (canvas.width / 2) - 174 / 2,
    y: 50,

    desenha() {
        ctx.drawImage(
            sprites,
            msgGetReady.spritex, msgGetReady.spritey,
            msgGetReady.largura, msgGetReady.altura,
            msgGetReady.x, msgGetReady.y,
            msgGetReady.largura, msgGetReady.altura);
    }
}






const chao = {
    spritex: 0,
    spritey: 610,
    largura: 224,
    altura: 112,
    x: 0,
    y: canvas.height - 112,

    desenha() {
        ctx.drawImage(
            sprites,
            chao.spritex, chao.spritey,
            chao.largura, chao.altura,
            chao.x, chao.y,
            chao.largura, chao.altura,);

        ctx.drawImage(
            sprites,
            chao.spritex, chao.spritey,
            chao.largura, chao.altura,
            (chao.x + chao.largura), chao.y,
            chao.largura, chao.altura,);
    }

}

const planodefundo = {

    spritex: 390,
    spritey: 0,
    largura: 275,
    altura: 204,
    x: 0,
    y: canvas.height - 204,

    desenha() {
        ctx.fillStyle = '#57e8f2';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.drawImage(
            sprites,
            planodefundo.spritex, planodefundo.spritey,
            planodefundo.largura, planodefundo.altura,
            planodefundo.x, planodefundo.y,
            planodefundo.largura, planodefundo.altura,
        );

        ctx.drawImage(
            sprites,
            planodefundo.spritex, planodefundo.spritey,
            planodefundo.largura, planodefundo.altura,
            (planodefundo.x + planodefundo.largura), planodefundo.y,
            planodefundo.largura, planodefundo.altura,
        );

    }




}





const flappybird = {
    spritex: 0,
    spritey: 0,
    largura: 33,
    altura: 24,
    x: 10,
    y: 50,
    gravidade: 0.25,
    valeocidade: 0,
    atualiza() {
        flappybird.valeocidade += flappybird.gravidade;
        flappybird.y += flappybird.valeocidade;
    },

    desenha() {
        ctx.drawImage(
            sprites,
            flappybird.spritex, flappybird.spritey,
            flappybird.largura, flappybird.altura,
            flappybird.x, flappybird.y,
            flappybird.largura, flappybird.altura,);

    }
}

let telasAtiva = {};

function mudaparatelas(novatela) {
    telasAtiva = novatela;
}



const telas = {
    INICIO: {
        desenha() {
            planodefundo.desenha();
            chao.desenha();
            msgGetReady.desenha();
        },
        click() {
            mudaparatelas(telas.jogo);
        },
        atualiza() {

        }
    }
};
telas.jogo = {
    desenha() {
        planodefundo.desenha();
        chao.desenha();
        flappybird.desenha();
    },
    atualiza() {
        flappybird.atualiza();
    }
}






function loop() {

    telasAtiva.desenha();
    telasAtiva.atualiza();

    requestAnimationFrame(loop);
}

window.addEventListener('click', function () {
    if (telasAtiva.click) {
        telasAtiva.click()
    }
})



mudaparatelas(telas.INICIO);
loop();