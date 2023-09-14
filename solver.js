class Solucionador {
    observar = true;
    velocidade = 200;
    solicitarParada = false;
  
    tabuleiro;
    tabuleiroOriginal;
  
    tamanhoTabuleiro;
    tamanhoBloco;
  
    linhasTabuleiro;
    colunasTabuleiro;
    blocosTabuleiro;
  
    quantidadePerguntas;
    quantidadeResolvida = 0;
    tabuleiroResolvido = false;
  
    objetosVazios = {};
    objetosSimples = {};
    objetosRetrocesso = {};
  
    constructor(_tabuleiro) {
      this.tabuleiro = _tabuleiro;
      this.tabuleiroOriginal = copiarTabuleiro(_tabuleiro);
  
      this.tamanhoTabuleiro = _tabuleiro.length;
      this.tamanhoBloco = parseInt(Math.sqrt(this.tamanhoTabuleiro));
  
      this.iniciar3Arrays();
      this.quantidadePerguntas = this.encontrarQuantidadePerguntas();
      this.quantidadeResolvida = 0;
    }
  
    iniciarSolucao() {
      this.iniciarObjetosVazios();
      this.encontrarSimples();
      if (!this.tabuleiroResolvido) this.retroativar();
    }
  
    iniciarObjetosVazios() {
      let contadorObjetosVazios = 0;
      for (let linha = 0; linha < this.tamanhoTabuleiro; linha++) {
        for (let coluna = 0; coluna < this.tamanhoTabuleiro; coluna++) {
  
          if (this.tabuleiro[linha][coluna] == 0) {
  
            let numeroBloco = obterNumeroBloco(linha, coluna, this.tamanhoBloco);
            this.objetosVazios[`${contadorObjetosVazios}`] = {
              linha: linha,
              coluna: coluna,
              bloco: numeroBloco,
              valorAtual: 0,
              valoresPossiveis: [],
              indicePossivel: null,
              éSimples: false,
              resolvido: false
            }
  
            contadorObjetosVazios++;
          }
        }
      }
  
      if (contadorObjetosVazios != this.quantidadePerguntas) {
        console.log("Erro ao iniciarObjetosVazios: quantidadePerguntas e quantidade de objetos vazios não correspondem");
      }
    }
  
  
    encontrarSimples() {
      let contadorValoresPreenchidos;
  
      do {
        contadorValoresPreenchidos = 0;
  
        for (let indice in this.objetosVazios) {
          let objeto = this.objetosVazios[indice];
          if (!objeto.resolvido) {
            let valorPreenchido = this.encontrarSimplesDoObjeto(objeto);
            if (valorPreenchido > 0) {
              this.objetosSimples[contadorValoresPreenchidos] = objeto;
              contadorValoresPreenchidos++;
            }
          }
        }
  
        // escrever valores no tabuleiro
        if (contadorValoresPreenchidos > 0) {
          this.quantidadeResolvida += contadorValoresPreenchidos;
          this.escreverNoTabuleiro(this.objetosSimples);
          view.imprimirTabuleiro(this.tabuleiro);
        }
      } while (contadorValoresPreenchidos > 0);
  
      // o tabuleiro foi resolvido?
      if (this.quantidadeResolvida == this.quantidadePerguntas) {
        this.tabuleiroResolvido = true;
        console.log("Tabuleiro Resolvido: tentativa 1 de encontrarSimples");
      } else {
        this.encontrarSimples();
      }
  
    }
  
    encontrarSimplesDoObjeto(objeto) {
      let valorPreenchido = 0;
      let { linha, coluna, bloco } = objeto;
      let éSimples = this.verificarSeÉSimples(linha, coluna, bloco);
      if (éSimples.length == 1) {
        valorPreenchido = éSimples[0];
  
        objeto.éSimples = true;
        objeto.resolvido = true;
        objeto.valorAtual = éSimples[0];
      }
      objeto.valoresPossiveis = [...éSimples];
      objeto.indicePossivel = 0;
  
      return valorPreenchido;
    }
  
    verificarSeÉSimples(linha, coluna, bloco) {
      let possiveis = Array.from({ length: this.tamanhoTabuleiro }, (val, idx) => idx + 1)
      let valoresLinha = [...new Set(this.linhasTabuleiro[linha])]
      let valoresColuna = [...new Set(this.colunasTabuleiro[coluna])]
      let valoresBloco = [...new Set(this.blocosTabuleiro[bloco])]
      let valoresExistentes = [...new Set(valoresLinha.concat(valoresColuna).concat(valoresBloco))]
      removerValorNoArray(valoresExistentes, 0);
  
      for (let item of valoresExistentes) removerValorNoArray(possiveis, item);
  
      return possiveis;
    }
  
    async retroativo() {
  
      let perguntasRetroativas = this.criarObjetoRetrocesso()
      console.log(`Retroativo: itens vazios restantes são: ${perguntasRetroativas}`);
      let tabuleiroAntesDoRetrocesso = copiarTabuleiro(this.tabuleiro);
  
      let i = 0;
      let iterações = 0;
      while (i < perguntasRetroativas) {
        let objeto = this.objetosRetrocesso[i];
        let { linha, coluna, bloco, valoresPossiveis, indicePossivel } = objeto;
  
        let preenchido = false;
        while (indicePossivel < valoresPossiveis.length) {
          let valor = valoresPossiveis[indicePossivel]
          let valorÉVálido = this.verificarSeValorÉVálido(linha, coluna, bloco, valor)
          indicePossivel++;
          this.objetosRetrocesso[i].indicePossivel = indicePossivel;
          if (valorÉVálido) {
            this.objetosRetrocesso[i].valorAtual = valor
            preenchido = true
            break;
          }
        }
  
        // se nenhum valor foi preenchido para este 'i'
        if (!preenchido) {
          if (i == 0) {
            console.log('Retroativo: a solução não pode ser encontrada');
            return;
          } else {
            this.objetosRetrocesso[i].indicePossivel = 0;
            this.objetosRetrocesso[i].valorAtual = 0;
            i -= 2;
          }
        }
  
        this.escreverNoTabuleiro(this.objetosRetrocesso)
        view.imprimirTabuleiro(this.tabuleiro);
        // se o usuário solicitar parada, aborte
        if (this.solicitarParada) return;
  
        // todas as coisas relacionadas à velocidade e observação
        if (this.observar) {
          let redução = parseInt(iterações / 100) * 10
          redução = redução >= this.velocidade ? 0 : redução;
          await sleep(this.velocidade - redução)
        }
  
        i++;
        iterações++;
      }
  
      // passos finais
      console.log('iteração concluída: ', iterações);
      if (this.validaçãoDoTabuleiro()) {
        console.log('Retroativo Completo: Parábens Tabuleiro Resolvido');
        alert('Ei!!! Tabuleiro Resolvido, Meu Amor ')
      } else {
        console.log('Retroativo Completo: Nenhuma solução encontrada');
      }
  
    }
  
    verificarSeValorÉVálido(linha, coluna, bloco, valor) {
      let éVálido = true;
      let valoresLinha = [...new Set(this.linhasTabuleiro[linha])]
      let valoresColuna = [...new Set(this.colunasTabuleiro[coluna])]
      let valoresBloco = [...new Set(this.blocosTabuleiro[bloco])]
      if (valoresLinha.includes(valor) || valoresColuna.includes(valor) || valoresBloco.includes(valor)) éVálido = false;
  
      return éVálido;
    }
  
    criarObjetoRetrocesso() {
      let contador = 0;
      for (let índice in this.objetosVazios) {
        let objeto = this.objetosVazios[índice];
        if (!objeto.resolvido) {
          this.objetosRetrocesso[contador] = objeto;
          contador++;
        }
      }
  
      return contador;
    }
  
    escreverNoTabuleiro(_obj) {
      let tamanhoObj = Object.keys(_obj).length;
      for (let i = 0; i < tamanhoObj; i++) {
        let objeto = _obj[i];
        this.tabuleiro[objeto.linha][objeto.coluna] = objeto.valorAtual;
      }
      this.iniciar3Arrays();
    }
  
    iniciar3Arrays() {
      this.linhasTabuleiro = this.tabuleiro;
      this.colunasTabuleiro = gerarArrayColuna(this.tabuleiro)
      this.blocosTabuleiro = gerarArrayBloco(this.tabuleiro, this.tamanhoTabuleiro)
    }
  
    encontrarQuantidadePerguntas() {
      return parseInt(Math.pow(this.tamanhoTabuleiro, 2)) - this.tabuleiro.reduce((a, b) => a + (b.filter(x => x > 0).length), 0)
    }
  
    validaçãoDoTabuleiro() {
      let validadorDeResultado = new Validar(this.tabuleiro, this.tamanhoTabuleiro);
      return validadorDeResultado.executarTestes()
    }
  
  }