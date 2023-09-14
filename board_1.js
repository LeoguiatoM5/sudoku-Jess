class Tabuleiro {
    tabuleiro;
    tamanhoTabuleiro;
    tamanhoBloco;
    valoresTabuleiro;
  
    constructor(_tamanhoTabuleiro) {
      this.tamanhoTabuleiro = _tamanhoTabuleiro;
      this.tamanhoBloco = parseInt(Math.sqrt(_tamanhoTabuleiro));
      this.tabuleiro = Array.from(Array(this.tamanhoTabuleiro), () => new Array(this.tamanhoTabuleiro).fill(0));
      this.valoresTabuleiro = Array.from(Array(this.tamanhoTabuleiro), () => new Array(this.tamanhoTabuleiro).fill(0));
      this.criarTabuleiro();
    }
  
    criarTabuleiro() {
      let valores = ["*", "$$", '---'];
      let insercoes = Array(this.tamanhoTabuleiro).fill(0);
  
      for (let i = 1; i <= 3; i++) {
        let contagemInsercoes = 0;
        let blocosDisponiveis;
        let colunasDisponiveis = Array.from({ length: this.tamanhoTabuleiro }, (val, idx) => idx);
        let colunasDisponiveisParaConjunto_1 = colunasDisponiveis;
        let numeroDefinido;
  
        for (let linha = 0; linha < this.tamanhoTabuleiro; linha++) {
          let valorInserido = false;
          let linhaAtual = linha;
          let colunaAtual;
          let blocoAleatorio;
          let colunaAleatoria;
  
          if (linha % this.tamanhoBloco == 0) {
            blocosDisponiveis = Array.from({ length: this.tamanhoBloco }, (val, idx) => idx);
            numeroDefinido = linha / this.tamanhoBloco;
            if (numeroDefinido == 1) colunasDisponiveisParaConjunto_1 = colunasDisponiveis;
          }
  
          while (!valorInserido) {
            if (colunasDisponiveis.length == 1 && blocosDisponiveis.length == 1) {
              blocoAleatorio = blocosDisponiveis[0];
              colunaAtual = colunasDisponiveis[0];
            } else {
              blocoAleatorio = blocosDisponiveis[this.random(blocosDisponiveis.length - 1)];
              colunaAleatoria = this.random(this.tamanhoBloco - 1);
              colunaAtual = blocoAleatorio * this.tamanhoBloco + colunaAleatoria;
  
              while (!colunasDisponiveis.includes(colunaAtual) || this.tabuleiro[linhaAtual][colunaAtual] != 0) {
                blocoAleatorio = blocosDisponiveis[this.random(blocosDisponiveis.length - 1)];
                colunaAleatoria = this.random(this.tamanhoBloco - 1);
                colunaAtual = blocoAleatorio * this.tamanhoBloco + colunaAleatoria;
              }
            }
  
            if (this.tabuleiro[linhaAtual][colunaAtual] == 0) {
              // encontrou uma célula válida
              contagemInsercoes++;
              this.tabuleiro[linhaAtual][colunaAtual] = valores[i - 1];
              valorInserido = true;
              blocosDisponiveis.splice(blocosDisponiveis.indexOf(blocoAleatorio), 1);
              colunasDisponiveis.splice(colunasDisponiveis.indexOf(colunaAtual), 1);
            } else if (numeroDefinido == 1) {
              console.log("dentro do if");
              linha = numeroDefinido * this.tamanhoBloco - 1;
              colunasDisponiveis = colunasDisponiveisParaConjunto_1;
              console.group("");
              console.log('i', i);
              console.log('blocoAleatorio', blocoAleatorio);
              console.log('linha', linha);
              console.log('colunaAtual', colunaAtual);
              console.groupEnd("");
            }
          }
        }
        insercoes[i - 1] = contagemInsercoes;
      }
      console.log(insercoes);
    }
  
    random(max, min = 0) {
      return Math.floor(Math.random() * (max - min + 1) + min);
    }
  }
  
  
  
  
  
  