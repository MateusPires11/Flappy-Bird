

let frames = 0;
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
};

function criarchao() {
    const chao = {
        spritex: 0,
        spritey: 610,
        largura: 224,
        altura: 112,
        x: 0,
        y: canvas.height - 112,
        atualiza() {
            const movimentodochao = 1;
            const repetechao = chao.largura / 2;
            const movimento = chao.x -= movimentodochao;

            chao.x = movimento % repetechao;
        },

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
    return chao
};

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

function colisao(flappybird, chao) {
    const flappybirdy = flappybird.y + flappybird.altura;
    const chaoy = chao.y

    if (flappybirdy >= chaoy) {
        return true;
    }
    return false;
}

function criaCanos() {
    const canos = {
        largura: 52,
        altura: 400,
        chao: {
            spritex: 0,
            spritey: 169,
        },
        ceu: {
            spritex: 52,
            spritey: 169,
        },
        espaco: 90,
        pares: [],

        desenha() {
            canos.pares.forEach((par) => {
                const yRandom = par.y;
                const espacamentoEntreCanos = canos.espaco;

                // CANO DO CÉU
                const canoCeuX = par.x;
                const canoCeuY = yRandom;
                ctx.drawImage(
                    sprites,
                    canos.ceu.spritex, canos.ceu.spritey,
                    canos.largura, canos.altura,
                    canoCeuX, canoCeuY,
                    canos.largura, canos.altura
                );

                // CANO DO CHÃO
                const canoChaoX = par.x;
                const canoChaoY = canos.altura + espacamentoEntreCanos + yRandom;
                ctx.drawImage(
                    sprites,
                    canos.chao.spritex, canos.chao.spritey,
                    canos.largura, canos.altura,
                    canoChaoX, canoChaoY,
                    canos.largura, canos.altura
                );

                par.canoCeu = {
                    x: canoCeuX,
                    y: canos.altura + canoCeuY,
                };
                par.canoChao = {
                    x: canoChaoX,
                    y: canoChaoY,
                };
            });
        },

        temColisaoComOFlappyBird(par) {
            const cabecaDoFlappy = globais.flappybird.y;
            const peDoFlappy = globais.flappybird.y + globais.flappybird.altura;

            if ((globais.flappybird.x + globais.flappybird.largura) >= par.x) {
                if (cabecaDoFlappy <= par.canoCeu.y) return true;
                if (peDoFlappy >= par.canoChao.y) return true;
            }
            return false;
        },

        atualiza() {
            const passou100Frames = frames % 100 === 0;
            if (passou100Frames) {
                canos.pares.push({
                    x: canvas.width,
                    y: -150 * (Math.random() + 1),
                });
            }

            canos.pares.forEach((par) => {
                par.x -= 2;

                if (canos.temColisaoComOFlappyBird(par)) {
                    console.log('Você perdeu!');
                    mudaparatelas(telas.INICIO); // Corrigido
                }

                if (par.x + canos.largura <= 0) {
                    canos.pares.shift();
                }
            });
        },
    };

    return canos;
}



function criarflappybird() {
    const flappybird = {
        spritex: 0,
        spritey: 0,
        largura: 33,
        altura: 24,
        x: 10,
        y: 50,
        pulo: 4.6,
        pula() {
            flappybird.velocidade = -flappybird.pulo;
        },
        gravidade: 0.25,
        velocidade: 0,
        atualiza() {
            if (colisao(flappybird, globais.chao)) {
                mudaparatelas(telas.INICIO)
                return;
            }

            flappybird.velocidade += flappybird.gravidade;
            flappybird.y += flappybird.velocidade;
        },
        movimentos: [
            { spritex: 0, spritey: 0, },
            { spritex: 0, spritey: 26, },
            { spritex: 0, spritey: 52, },
        ],

        frameAtual: 0,
        atualizaFrameAtual() {
            const intervaloDeFrames = 10;
            const passouOIntervalo = frames % intervaloDeFrames === 0;
            if (passouOIntervalo) {
                const baseincremento = 1;
                const incremento = baseincremento + flappybird.frameAtual;
                const baseDeRepeticao = flappybird.movimentos.length
                flappybird.frameAtual = incremento % baseDeRepeticao
            }


        },

        desenha() {
            const { spritex, spritey } = flappybird.movimentos[flappybird.frameAtual];
            flappybird.atualizaFrameAtual()
            ctx.drawImage(
                sprites,
                spritex, spritey,                // posição na sprite
                flappybird.largura, flappybird.altura,  // tamanho do recorte
                flappybird.x, flappybird.y,      // posição no canvas
                flappybird.largura, flappybird.altura   // tamanho no canvas
            );

        }
    }
    return flappybird;
}

const globais = {};
let telasAtiva = {};

function mudaparatelas(novatela) {
    telasAtiva = novatela;
    if (telasAtiva.inicializacao) {
        telasAtiva.inicializacao();
    }
};

const telas = {
    INICIO: {
        inicializacao() {
            globais.flappybird = criarflappybird();
            globais.chao = criarchao();
            globais.canos = criaCanos();
        },
        desenha() {
            planodefundo.desenha();
            globais.canos.desenha();
            globais.chao.desenha();
            globais.flappybird.desenha();

            msgGetReady.desenha();

        },
        click() {
            mudaparatelas(telas.jogo);
        },
        atualiza() {
            globais.chao.atualiza();
            globais.canos.atualiza();
        }
    }
};
telas.jogo = {
    desenha() {
        planodefundo.desenha();
        globais.canos.desenha();
        globais.chao.desenha();

        globais.flappybird.desenha();
    },
    click() {
        globais.flappybird.pula()

    },
    atualiza() {
        globais.chao.atualiza();
        globais.flappybird.atualiza();
        globais.canos.atualiza();
    }
};


function loop() {

    telasAtiva.desenha();
    telasAtiva.atualiza();
    frames += 1;
    requestAnimationFrame(loop);
};

window.addEventListener('click', function () {
    if (telasAtiva.click) {
        telasAtiva.click()
    }
});

mudaparatelas(telas.INICIO);
loop();