/* =========================================================
   LINKA GIFT
   Gerador de Termo de Consignação
   script.js
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* =======================================================
     ELEMENTOS PRINCIPAIS
  ======================================================= */

  const form = document.getElementById("formConsignacao");
  const numeroConsignacao = document.getElementById("numeroConsignacao");
  const dataConsignacao = document.getElementById("dataConsignacao");
  const listaProdutos = document.getElementById("listaProdutos");
  const btnAdicionarProduto = document.getElementById("btnAdicionarProduto");
  const btnLimpar = document.getElementById("btnLimpar");
  const btnEditar = document.getElementById("btnEditar");
  const btnImprimir = document.getElementById("btnImprimir");
  const btnPDF = document.getElementById("btnPDF");
  const btnCompartilhar = document.getElementById("btnCompartilhar");
  const btnWhatsApp = document.getElementById("btnWhatsApp");

  const totalUnidades = document.getElementById("totalUnidades");
  const valorTotal = document.getElementById("valorTotal");
  const observacoes = document.getElementById("observacoes");
  const contadorObservacoes = document.getElementById("contadorObservacoes");
  const areaPreview = document.getElementById("areaPreview");
  const confirmacao = document.getElementById("confirmacao");

  /* =======================================================
     ASSINATURAS
  ======================================================= */

  const canvasAssinaturaLinka =
    document.getElementById("canvasAssinaturaLinka");

  const canvasAssinaturaLoja =
    document.getElementById("canvasAssinaturaLoja");

  const btnLimparAssinaturaLinka =
    document.getElementById("btnLimparAssinaturaLinka");

  const btnLimparAssinaturaLoja =
    document.getElementById("btnLimparAssinaturaLoja");

  const statusAssinaturaLinka =
    document.getElementById("statusAssinaturaLinka");

  const statusAssinaturaLoja =
    document.getElementById("statusAssinaturaLoja");

  const docImagemAssinaturaLinka =
    document.getElementById("docImagemAssinaturaLinka");

  const docImagemAssinaturaLoja =
    document.getElementById("docImagemAssinaturaLoja");


  /* =======================================================
     MODAL
  ======================================================= */

  const modal = document.getElementById("modal");
  const modalTitulo = document.getElementById("modalTitulo");
  const modalMensagem = document.getElementById("modalMensagem");
  const modalIcone = document.getElementById("modalIcone");
  const btnFecharModal = document.getElementById("btnFecharModal");

  const modalOverlay =
    modal.querySelector(".modal-overlay");


  function mostrarModal(titulo, mensagem, icone = "!") {

    modalTitulo.textContent = titulo;
    modalMensagem.textContent = mensagem;
    modalIcone.textContent = icone;

    modal.classList.remove("oculto");

    modal.setAttribute(
      "aria-hidden",
      "false"
    );

  }


  function fecharModal() {

    modal.classList.add("oculto");

    modal.setAttribute(
      "aria-hidden",
      "true"
    );

  }


  btnFecharModal.addEventListener(
    "click",
    fecharModal
  );


  modalOverlay.addEventListener(
    "click",
    fecharModal
  );


  /* =======================================================
     ASSINATURA DIGITAL
  ======================================================= */

  function criarAssinaturaDigital(
    canvas,
    botaoLimpar,
    status,
    imagemDocumento
  ) {

    const contexto =
      canvas.getContext("2d");

    let assinando = false;
    let assinaturaFeita = false;


    function prepararContexto() {

      contexto.lineWidth = 2.4;
      contexto.lineCap = "round";
      contexto.lineJoin = "round";
      contexto.strokeStyle = "#10233f";

    }


    function ajustarCanvas(preservar = true) {

      const rect =
        canvas.getBoundingClientRect();

      if (!rect.width || !rect.height) {
        return;
      }


      const imagemAnterior =
        preservar && assinaturaFeita
          ? canvas.toDataURL("image/png")
          : null;


      const proporcao =
        window.devicePixelRatio || 1;


      canvas.width =
        Math.round(
          rect.width * proporcao
        );

      canvas.height =
        Math.round(
          rect.height * proporcao
        );


      contexto.setTransform(
        proporcao,
        0,
        0,
        proporcao,
        0,
        0
      );


      prepararContexto();


      if (imagemAnterior) {

        const imagem =
          new Image();


        imagem.onload = () => {

          contexto.drawImage(
            imagem,
            0,
            0,
            rect.width,
            rect.height
          );

          prepararContexto();

        };


        imagem.src =
          imagemAnterior;

      }

    }


    function pegarPosicao(evento) {

      const rect =
        canvas.getBoundingClientRect();


      return {

        x:
          evento.clientX -
          rect.left,

        y:
          evento.clientY -
          rect.top

      };

    }


    function iniciar(evento) {

      evento.preventDefault();

      assinando = true;
      assinaturaFeita = true;

      const posicao =
        pegarPosicao(evento);


      contexto.beginPath();

      contexto.moveTo(
        posicao.x,
        posicao.y
      );


      status.textContent =
        "Assinado";

      status.classList.add(
        "assinado"
      );


      try {

        canvas.setPointerCapture(
          evento.pointerId
        );

      } catch (_) {}

    }


    function desenhar(evento) {

      if (!assinando) {
        return;
      }


      evento.preventDefault();


      const posicao =
        pegarPosicao(evento);


      contexto.lineTo(
        posicao.x,
        posicao.y
      );

      contexto.stroke();

    }


    function finalizar(evento) {

      if (!assinando) {
        return;
      }


      assinando = false;

      contexto.closePath();


      if (
        evento &&
        evento.pointerId !== undefined
      ) {

        try {

          canvas.releasePointerCapture(
            evento.pointerId
          );

        } catch (_) {}

      }

    }


    function limpar() {

      contexto.save();

      contexto.setTransform(
        1,
        0,
        0,
        1,
        0,
        0
      );


      contexto.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
      );


      contexto.restore();

      prepararContexto();


      assinaturaFeita = false;
      assinando = false;


      imagemDocumento.removeAttribute(
        "src"
      );

      imagemDocumento.classList.remove(
        "ativa"
      );


      status.textContent =
        "Aguardando";

      status.classList.remove(
        "assinado"
      );

    }


    function atualizarDocumento() {

      if (!assinaturaFeita) {

        imagemDocumento.removeAttribute(
          "src"
        );

        imagemDocumento.classList.remove(
          "ativa"
        );

        return;

      }


      imagemDocumento.src =
        canvas.toDataURL("image/png");


      imagemDocumento.classList.add(
        "ativa"
      );

    }


    canvas.addEventListener(
      "pointerdown",
      iniciar
    );

    canvas.addEventListener(
      "pointermove",
      desenhar
    );

    canvas.addEventListener(
      "pointerup",
      finalizar
    );

    canvas.addEventListener(
      "pointercancel",
      finalizar
    );

    canvas.addEventListener(
      "pointerleave",
      finalizar
    );


    botaoLimpar.addEventListener(
      "click",
      limpar
    );


    return {

      ajustarCanvas,

      limpar,

      atualizarDocumento,

      foiAssinada: () =>
        assinaturaFeita

    };

  }


  const assinaturaLinka =
    criarAssinaturaDigital(
      canvasAssinaturaLinka,
      btnLimparAssinaturaLinka,
      statusAssinaturaLinka,
      docImagemAssinaturaLinka
    );


  const assinaturaLoja =
    criarAssinaturaDigital(
      canvasAssinaturaLoja,
      btnLimparAssinaturaLoja,
      statusAssinaturaLoja,
      docImagemAssinaturaLoja
    );


  /* =======================================================
     DATA ATUAL
  ======================================================= */

  function definirDataAtual() {

    const agora =
      new Date();

    const ano =
      agora.getFullYear();

    const mes =
      String(
        agora.getMonth() + 1
      ).padStart(2, "0");

    const dia =
      String(
        agora.getDate()
      ).padStart(2, "0");


    dataConsignacao.value =
      `${ano}-${mes}-${dia}`;

  }


  /* =======================================================
     NÚMERO DA CONSIGNAÇÃO
  ======================================================= */

  function gerarNumeroConsignacao() {

    const agora =
      new Date();


    const ano =
      agora.getFullYear();

    const mes =
      String(
        agora.getMonth() + 1
      ).padStart(2, "0");

    const dia =
      String(
        agora.getDate()
      ).padStart(2, "0");

    const hora =
      String(
        agora.getHours()
      ).padStart(2, "0");

    const minuto =
      String(
        agora.getMinutes()
      ).padStart(2, "0");

    const segundo =
      String(
        agora.getSeconds()
      ).padStart(2, "0");


    numeroConsignacao.value =
      `CON-${ano}${mes}${dia}-${hora}${minuto}${segundo}`;

  }


  /* =======================================================
     MOEDA
  ======================================================= */

  function valorParaNumero(valor) {

    if (!valor) {
      return 0;
    }


    const texto =
      String(valor)
        .replace(/\s/g, "")
        .replace("R$", "")
        .replace(/\./g, "")
        .replace(",", ".")
        .trim();


    const numero =
      parseFloat(texto);


    return Number.isFinite(numero)
      ? numero
      : 0;

  }


  function numeroParaMoeda(valor) {

    return Number(
      valor || 0
    ).toLocaleString(
      "pt-BR",
      {
        style: "currency",
        currency: "BRL"
      }
    );

  }


  function formatarCampoMoeda(input) {

    let valor =
      input.value.replace(
        /\D/g,
        ""
      );


    if (!valor) {

      input.value = "";

      calcularTotais();

      return;

    }


    valor =
      Number(valor) / 100;


    input.value =
      valor.toLocaleString(
        "pt-BR",
        {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }
      );


    calcularTotais();

  }


  /* =======================================================
     TELEFONE
  ======================================================= */

  const telefone =
    document.getElementById(
      "telefone"
    );


  telefone.addEventListener(
    "input",
    () => {

      let valor =
        telefone.value
          .replace(/\D/g, "")
          .slice(0, 11);


      if (valor.length <= 10) {

        valor =
          valor.replace(
            /^(\d{2})(\d)/,
            "($1) $2"
          );

        valor =
          valor.replace(
            /(\d{4})(\d)/,
            "$1-$2"
          );

      } else {

        valor =
          valor.replace(
            /^(\d{2})(\d)/,
            "($1) $2"
          );

        valor =
          valor.replace(
            /(\d{5})(\d)/,
            "$1-$2"
          );

      }


      telefone.value =
        valor;

    }
  );


  /* =======================================================
     CPF / CNPJ
  ======================================================= */

  const cnpj =
    document.getElementById(
      "cnpj"
    );


  cnpj.addEventListener(
    "input",
    () => {

      let valor =
        cnpj.value
          .replace(/\D/g, "")
          .slice(0, 14);


      if (valor.length <= 11) {

        valor =
          valor.replace(
            /(\d{3})(\d)/,
            "$1.$2"
          );

        valor =
          valor.replace(
            /(\d{3})(\d)/,
            "$1.$2"
          );

        valor =
          valor.replace(
            /(\d{3})(\d{1,2})$/,
            "$1-$2"
          );

      } else {

        valor =
          valor.replace(
            /^(\d{2})(\d)/,
            "$1.$2"
          );

        valor =
          valor.replace(
            /^(\d{2})\.(\d{3})(\d)/,
            "$1.$2.$3"
          );

        valor =
          valor.replace(
            /\.(\d{3})(\d)/,
            ".$1/$2"
          );

        valor =
          valor.replace(
            /(\d{4})(\d)/,
            "$1-$2"
          );

      }


      cnpj.value =
        valor;

    }
  );


  /* =======================================================
     UF
  ======================================================= */

  const uf =
    document.getElementById(
      "uf"
    );


  uf.addEventListener(
    "input",
    () => {

      uf.value =
        uf.value
          .replace(
            /[^a-zA-Z]/g,
            ""
          )
          .toUpperCase()
          .slice(0, 2);

    }
  );


  /* =======================================================
     OBSERVAÇÕES
  ======================================================= */

  observacoes.addEventListener(
    "input",
    () => {

      contadorObservacoes.textContent =
        observacoes.value.length;

    }
  );


  /* =======================================================
     PRODUTOS
  ======================================================= */

  let contadorProdutos = 1;


  function configurarProduto(produtoItem) {

    const quantidade =
      produtoItem.querySelector(
        ".produto-quantidade"
      );

    const valorLoja =
      produtoItem.querySelector(
        ".produto-valor-loja"
      );

    const precoSugerido =
      produtoItem.querySelector(
        ".produto-preco-sugerido"
      );


    quantidade.addEventListener(
      "input",
      calcularTotais
    );


    valorLoja.addEventListener(
      "input",
      () => {

        formatarCampoMoeda(
          valorLoja
        );

      }
    );


    precoSugerido.addEventListener(
      "input",
      () => {

        formatarCampoMoeda(
          precoSugerido
        );

      }
    );

  }


  function criarProduto() {

    contadorProdutos++;


    const numero =
      String(
        contadorProdutos
      ).padStart(2, "0");


    const div =
      document.createElement("div");


    div.className =
      "produto-item";


    div.dataset.produto =
      contadorProdutos;


    div.innerHTML = `

      <div class="produto-topo">

        <strong>
          Produto ${numero}
        </strong>

        <button
          type="button"
          class="btn-remover-produto"
          aria-label="Remover produto"
        >
          ✕
        </button>

      </div>

      <div class="campo">

        <label>
          Produto / Modelo *
        </label>

        <input
          type="text"
          class="produto-nome"
          placeholder="Nome do produto"
          required
        >

      </div>

      <div class="grid grid-3">

        <div class="campo">

          <label>
            Quantidade *
          </label>

          <input
            type="number"
            class="produto-quantidade"
            min="1"
            step="1"
            value="1"
            inputmode="numeric"
            required
          >

        </div>

        <div class="campo">

          <label>
            Valor para loja *
          </label>

          <div class="input-moeda">

            <span>R$</span>

            <input
              type="text"
              class="produto-valor-loja moeda"
              inputmode="decimal"
              placeholder="0,00"
              required
            >

          </div>

        </div>

        <div class="campo">

          <label>
            Preço sugerido
          </label>

          <div class="input-moeda">

            <span>R$</span>

            <input
              type="text"
              class="produto-preco-sugerido moeda"
              inputmode="decimal"
              placeholder="0,00"
            >

          </div>

        </div>

      </div>

      <div class="produto-subtotal">

        <span>
          Subtotal consignado
        </span>

        <strong class="subtotal">
          R$ 0,00
        </strong>

      </div>

    `;


    listaProdutos.appendChild(
      div
    );


    configurarProduto(
      div
    );


    const btnRemover =
      div.querySelector(
        ".btn-remover-produto"
      );


    btnRemover.addEventListener(
      "click",
      () => {

        div.remove();

        renumerarProdutos();

        calcularTotais();

      }
    );


    calcularTotais();

  }


  function renumerarProdutos() {

    const produtos =
      listaProdutos.querySelectorAll(
        ".produto-item"
      );


    produtos.forEach(
      (produto, index) => {

        const titulo =
          produto.querySelector(
            ".produto-topo strong"
          );


        if (titulo) {

          titulo.textContent =
            `Produto ${String(
              index + 1
            ).padStart(2, "0")}`;

        }

      }
    );

  }


  btnAdicionarProduto.addEventListener(
    "click",
    criarProduto
  );


  /* =======================================================
     TOTAIS
  ======================================================= */

  function calcularTotais() {

    const produtos =
      listaProdutos.querySelectorAll(
        ".produto-item"
      );


    let unidades = 0;
    let total = 0;


    produtos.forEach(
      produto => {

        const quantidade =
          Number(
            produto.querySelector(
              ".produto-quantidade"
            ).value
          ) || 0;


        const valor =
          valorParaNumero(
            produto.querySelector(
              ".produto-valor-loja"
            ).value
          );


        const subtotal =
          quantidade * valor;


        unidades += quantidade;
        total += subtotal;


        produto.querySelector(
          ".subtotal"
        ).textContent =
          numeroParaMoeda(
            subtotal
          );

      }
    );


    totalUnidades.textContent =
      unidades;


    valorTotal.textContent =
      numeroParaMoeda(
        total
      );

  }


  /* =======================================================
     DATA BR
  ======================================================= */

  function formatarDataBR(dataISO) {

    if (!dataISO) {
      return "—";
    }


    const partes =
      dataISO.split("-");


    if (partes.length !== 3) {
      return dataISO;
    }


    return (
      `${partes[2]}/` +
      `${partes[1]}/` +
      `${partes[0]}`
    );

  }


  /* =======================================================
     SEGURANÇA HTML
  ======================================================= */

  function escaparHTML(texto) {

    return String(texto)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");

  }


  /* =======================================================
     PRODUTOS NO DOCUMENTO
  ======================================================= */

  function preencherProdutosDocumento() {

    const tbody =
      document.getElementById(
        "docProdutos"
      );


    tbody.innerHTML = "";


    const produtos =
      listaProdutos.querySelectorAll(
        ".produto-item"
      );


    let unidades = 0;
    let total = 0;


    produtos.forEach(
      produto => {

        const nome =
          produto.querySelector(
            ".produto-nome"
          ).value.trim();


        const quantidade =
          Number(
            produto.querySelector(
              ".produto-quantidade"
            ).value
          ) || 0;


        const valorLoja =
          valorParaNumero(
            produto.querySelector(
              ".produto-valor-loja"
            ).value
          );


        const precoSugerido =
          valorParaNumero(
            produto.querySelector(
              ".produto-preco-sugerido"
            ).value
          );


        if (!nome) {
          return;
        }


        unidades += quantidade;

        total +=
          quantidade *
          valorLoja;


        const linha =
          document.createElement("tr");


        linha.innerHTML = `

          <td>
            ${escaparHTML(nome)}
          </td>

          <td>
            ${quantidade}
          </td>

          <td>
            ${numeroParaMoeda(valorLoja)}
          </td>

          <td>
            ${
              precoSugerido > 0
                ? numeroParaMoeda(
                    precoSugerido
                  )
                : "—"
            }
          </td>

        `;


        tbody.appendChild(
          linha
        );

      }
    );


    document.getElementById(
      "docTotalUnidades"
    ).textContent =
      unidades;


    document.getElementById(
      "docValorTotal"
    ).textContent =
      numeroParaMoeda(
        total
      );

  }


  /* =======================================================
     PREENCHER DOCUMENTO
  ======================================================= */

  function preencherDocumento() {

    const loja =
      document
        .getElementById("loja")
        .value
        .trim();


    const responsavel =
      document
        .getElementById("responsavel")
        .value
        .trim();


    const email =
      document
        .getElementById("email")
        .value
        .trim();


    const cidade =
      document
        .getElementById("cidade")
        .value
        .trim();


    const periodicidade =
      document
        .getElementById("periodicidade")
        .value;


    const pagamento =
      document
        .getElementById("formaPagamento")
        .value;


    document.getElementById(
      "docNumero"
    ).textContent =
      numeroConsignacao.value ||
      "—";


    document.getElementById(
      "docData"
    ).textContent =
      formatarDataBR(
        dataConsignacao.value
      );


    document.getElementById(
      "docLoja"
    ).textContent =
      loja || "—";


    document.getElementById(
      "docCnpj"
    ).textContent =
      cnpj.value.trim() ||
      "—";


    document.getElementById(
      "docResponsavel"
    ).textContent =
      responsavel || "—";


    document.getElementById(
      "docTelefone"
    ).textContent =
      telefone.value.trim() ||
      "—";


    document.getElementById(
      "docEmail"
    ).textContent =
      email || "—";


    const cidadeUf = [
      cidade,
      uf.value.trim()
    ]
      .filter(Boolean)
      .join(" / ");


    document.getElementById(
      "docCidade"
    ).textContent =
      cidadeUf || "—";


    document.getElementById(
      "docPeriodicidade"
    ).textContent =
      periodicidade ||
      "A combinar";


    document.getElementById(
      "docPagamento"
    ).textContent =
      pagamento ||
      "A combinar";


    const docAssinaturaLoja =
      document.getElementById(
        "docAssinaturaLoja"
      );


    if (docAssinaturaLoja) {

      docAssinaturaLoja.textContent =
        responsavel ||
        "ESTABELECIMENTO";

    }


    const docLocal =
      document.getElementById(
        "docLocalAssinatura"
      );


    if (docLocal) {

      docLocal.textContent =
        cidadeUf || "—";

    }


    const docDataAssinatura =
      document.getElementById(
        "docDataAssinatura"
      );


    if (docDataAssinatura) {

      docDataAssinatura.textContent =
        formatarDataBR(
          dataConsignacao.value
        );

    }


    preencherProdutosDocumento();


    const obsBox =
      document.getElementById(
        "docObservacoesBox"
      );


    const docObservacoes =
      document.getElementById(
        "docObservacoes"
      );


    if (
      observacoes.value.trim()
    ) {

      docObservacoes.textContent =
        observacoes.value.trim();

      obsBox.classList.remove(
        "oculto"
      );

    } else {

      docObservacoes.textContent =
        "";

      obsBox.classList.add(
        "oculto"
      );

    }


    assinaturaLinka
      .atualizarDocumento();


    assinaturaLoja
      .atualizarDocumento();

  }


  /* =======================================================
     VALIDAÇÃO
  ======================================================= */

  function validarFormulario() {

    if (!form.checkValidity()) {

      form.reportValidity();

      return false;

    }


    if (!confirmacao.checked) {

      mostrarModal(
        "Confirmação necessária",
        "Marque a opção de conferência dos dados antes de gerar o termo.",
        "!"
      );

      return false;

    }


    const produtos =
      listaProdutos.querySelectorAll(
        ".produto-item"
      );


    let produtoValido = false;


    produtos.forEach(
      produto => {

        const nome =
          produto.querySelector(
            ".produto-nome"
          ).value.trim();


        const quantidade =
          Number(
            produto.querySelector(
              ".produto-quantidade"
            ).value
          );


        const valor =
          valorParaNumero(
            produto.querySelector(
              ".produto-valor-loja"
            ).value
          );


        if (
          nome &&
          quantidade > 0 &&
          valor > 0
        ) {

          produtoValido = true;

        }

      }
    );


    if (!produtoValido) {

      mostrarModal(
        "Produto inválido",
        "Informe pelo menos um produto com quantidade e valor para a loja.",
        "!"
      );

      return false;

    }


    if (
      !assinaturaLinka.foiAssinada()
    ) {

      mostrarModal(
        "Assinatura necessária",
        "Faça a assinatura da LINKA Gift antes de gerar o termo.",
        "✍"
      );


      canvasAssinaturaLinka
        .scrollIntoView({
          behavior: "smooth",
          block: "center"
        });


      return false;

    }


    if (
      !assinaturaLoja.foiAssinada()
    ) {

      mostrarModal(
        "Assinatura necessária",
        "Peça ao responsável pelo estabelecimento para assinar o termo.",
        "✍"
      );


      canvasAssinaturaLoja
        .scrollIntoView({
          behavior: "smooth",
          block: "center"
        });


      return false;

    }


    return true;

  }


  /* =======================================================
     GERAR PREVIEW
  ======================================================= */

  form.addEventListener(
    "submit",
    event => {

      event.preventDefault();


      if (!validarFormulario()) {
        return;
      }


      calcularTotais();

      preencherDocumento();


      areaPreview.classList.remove(
        "oculto"
      );


      setTimeout(
        () => {

          areaPreview.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });

        },
        100
      );

    }
  );


  /* =======================================================
     EDITAR
  ======================================================= */

  btnEditar.addEventListener(
    "click",
    () => {

      areaPreview.classList.add(
        "oculto"
      );


      form.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

    }
  );


  /* =======================================================
     LIMPAR
  ======================================================= */

  btnLimpar.addEventListener(
    "click",
    () => {

      const confirmar =
        window.confirm(
          "Deseja realmente limpar todos os dados preenchidos?"
        );


      if (!confirmar) {
        return;
      }


      form.reset();


      const produtos =
        listaProdutos.querySelectorAll(
          ".produto-item"
        );


      produtos.forEach(
        (produto, index) => {

          if (index > 0) {
            produto.remove();
          }

        }
      );


      contadorProdutos = 1;


      const primeiroProduto =
        listaProdutos.querySelector(
          ".produto-item"
        );


      primeiroProduto.querySelector(
        ".produto-nome"
      ).value =
        "Medalhão de Identificação Pet NFC";


      primeiroProduto.querySelector(
        ".produto-quantidade"
      ).value =
        "1";


      primeiroProduto.querySelector(
        ".produto-valor-loja"
      ).value =
        "";


      primeiroProduto.querySelector(
        ".produto-preco-sugerido"
      ).value =
        "";


      contadorObservacoes.textContent =
        "0";


      assinaturaLinka.limpar();
      assinaturaLoja.limpar();


      areaPreview.classList.add(
        "oculto"
      );


      definirDataAtual();

      gerarNumeroConsignacao();

      calcularTotais();


      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });

    }
  );


  /* =======================================================
     IMPRIMIR
  ======================================================= */

  btnImprimir.addEventListener(
    "click",
    () => {

      window.print();

    }
  );


  /* =======================================================
     PDF REAL
  ======================================================= */

  function nomeArquivoPDF() {

    const numero =
      (
        numeroConsignacao.value ||
        "consignacao"
      )
        .replace(
          /[^a-zA-Z0-9_-]/g,
          "-"
        );


    return (
      `LINKA-Gift-${numero}.pdf`
    );

  }


  async function gerarPDFBlob() {

    if (
      typeof html2pdf ===
      "undefined"
    ) {

      throw new Error(
        "Biblioteca de PDF não carregada."
      );

    }


    preencherDocumento();


    const documento =
      document.getElementById(
        "documentoA4"
      );


    const opcoes = {

      margin: 0,

      filename:
        nomeArquivoPDF(),

      image: {
        type: "jpeg",
        quality: 0.98
      },

      html2canvas: {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        scrollX: 0,
        scrollY: 0
      },

      jsPDF: {
        unit: "mm",
        format: "a4",
        orientation: "portrait"
      },

      pagebreak: {
        mode: [
          "avoid-all",
          "css",
          "legacy"
        ]
      }

    };


    return await html2pdf()
      .set(opcoes)
      .from(documento)
      .outputPdf("blob");

  }


  /* =======================================================
     BAIXAR BLOB
  ======================================================= */

  function baixarBlob(
    blob,
    nomeArquivo
  ) {

    const url =
      URL.createObjectURL(
        blob
      );


    const link =
      document.createElement(
        "a"
      );


    link.href =
      url;

    link.download =
      nomeArquivo;


    document.body.appendChild(
      link
    );


    link.click();

    link.remove();


    setTimeout(
      () => {

        URL.revokeObjectURL(
          url
        );

      },
      1500
    );

  }


  /* =======================================================
     CRIAR ARQUIVO PDF
  ======================================================= */

  async function criarArquivoPDF() {

    const blob =
      await gerarPDFBlob();


    return new File(
      [blob],
      nomeArquivoPDF(),
      {
        type: "application/pdf"
      }
    );

  }


  /* =======================================================
     ESTADO DO BOTÃO
  ======================================================= */

  function definirBotaoCarregando(
    botao,
    carregando,
    textoNormal
  ) {

    if (!botao) {
      return;
    }


    if (carregando) {

      botao.dataset.textoOriginal =
        botao.innerHTML;


      botao.disabled =
        true;


      botao.innerHTML =
        "⏳ Gerando PDF...";

    } else {

      botao.disabled =
        false;


      botao.innerHTML =
        botao.dataset.textoOriginal ||
        textoNormal;

    }

  }


  /* =======================================================
     SALVAR PDF
  ======================================================= */

  btnPDF.addEventListener(
    "click",
    async () => {

      definirBotaoCarregando(
        btnPDF,
        true,
        "📄 Salvar em PDF"
      );


      try {

        const blob =
          await gerarPDFBlob();


        baixarBlob(
          blob,
          nomeArquivoPDF()
        );


        mostrarModal(
          "PDF criado",
          "O termo assinado foi gerado e salvo no seu aparelho.",
          "✓"
        );

      } catch (erro) {

        console.error(
          erro
        );


        mostrarModal(
          "Não foi possível gerar o PDF",
          "Verifique sua conexão e tente novamente. Se necessário, use o botão Imprimir.",
          "!"
        );

      } finally {

        definirBotaoCarregando(
          btnPDF,
          false,
          "📄 Salvar em PDF"
        );

      }

    }
  );


  /* =======================================================
     TEXTO DO COMPARTILHAMENTO
  ======================================================= */

  function montarTextoCompartilhamento() {

    const loja =
      document
        .getElementById("loja")
        .value
        .trim();


    let texto =
      "LINKA Gift - Termo de Consignação";


    if (loja) {

      texto +=
        ` - ${loja}`;

    }


    texto +=
      `\nNº ${numeroConsignacao.value}`;


    return texto;

  }


  /* =======================================================
     COMPARTILHAR PDF / WHATSAPP
  ======================================================= */

  async function compartilharArquivoPDF(
    botao,
    origemWhatsApp = false
  ) {

    definirBotaoCarregando(
      botao,
      true,
      origemWhatsApp
        ? "WhatsApp"
        : "Compartilhar PDF"
    );


    try {

      const arquivo =
        await criarArquivoPDF();


      const dadosCompartilhamento = {

        files: [
          arquivo
        ],

        title:
          `Consignação ${numeroConsignacao.value}`,

        text:
          montarTextoCompartilhamento()

      };


      const podeCompartilharArquivo =
        navigator.share &&
        navigator.canShare &&
        navigator.canShare({
          files: [
            arquivo
          ]
        });


      /*
       * Em celulares compatíveis,
       * abre o compartilhamento nativo.
       *
       * WhatsApp aparecerá entre
       * os aplicativos disponíveis.
       */

      if (
        podeCompartilharArquivo
      ) {

        await navigator.share(
          dadosCompartilhamento
        );

        return;

      }


      /*
       * FALLBACK
       *
       * Se o navegador não suporta
       * compartilhamento de arquivos,
       * salva o PDF primeiro.
       */

      baixarBlob(
        arquivo,
        arquivo.name
      );


      if (origemWhatsApp) {

        const mensagem =
          encodeURIComponent(

            montarTextoCompartilhamento() +

            "\n\nO PDF foi baixado no aparelho. Anexe o arquivo nesta conversa do WhatsApp."

          );


        setTimeout(
          () => {

            window.open(
              `https://wa.me/?text=${mensagem}`,
              "_blank"
            );

          },
          300
        );


        mostrarModal(
          "PDF baixado",
          "Seu navegador não permite anexar automaticamente o PDF ao WhatsApp. O arquivo foi baixado; basta anexá-lo na conversa que será aberta.",
          "✓"
        );

      } else {

        mostrarModal(
          "PDF baixado",
          "Seu navegador não permite compartilhar arquivos diretamente. O PDF foi baixado para você compartilhar manualmente.",
          "✓"
        );

      }

    } catch (erro) {

      if (
        erro &&
        erro.name ===
        "AbortError"
      ) {

        return;

      }


      console.error(
        erro
      );


      mostrarModal(
        "Não foi possível compartilhar",
        "Não conseguimos gerar ou compartilhar o PDF neste dispositivo. Tente novamente ou use Salvar em PDF.",
        "!"
      );

    } finally {

      definirBotaoCarregando(
        botao,
        false,
        origemWhatsApp
          ? "WhatsApp"
          : "Compartilhar PDF"
      );

    }

  }


  /* =======================================================
     BOTÃO COMPARTILHAR PDF
  ======================================================= */

  btnCompartilhar.addEventListener(
    "click",
    async () => {

      await compartilharArquivoPDF(
        btnCompartilhar,
        false
      );

    }
  );


  /* =======================================================
     BOTÃO WHATSAPP
  ======================================================= */

  btnWhatsApp.addEventListener(
    "click",
    async () => {

      await compartilharArquivoPDF(
        btnWhatsApp,
        true
      );

    }
  );


  /* =======================================================
     PRODUTO INICIAL
  ======================================================= */

  document
    .querySelectorAll(
      ".produto-item"
    )
    .forEach(
      configurarProduto
    );


  listaProdutos.addEventListener(
    "change",
    calcularTotais
  );


  /* =======================================================
     INICIALIZAÇÃO
  ======================================================= */

  definirDataAtual();

  gerarNumeroConsignacao();

  calcularTotais();


  assinaturaLinka
    .ajustarCanvas(
      false
    );


  assinaturaLoja
    .ajustarCanvas(
      false
    );


  /* =======================================================
     REDIMENSIONAMENTO
  ======================================================= */

  let resizeTimer;


  window.addEventListener(
    "resize",
    () => {

      clearTimeout(
        resizeTimer
      );


      resizeTimer =
        setTimeout(
          () => {

            assinaturaLinka
              .ajustarCanvas(
                true
              );


            assinaturaLoja
              .ajustarCanvas(
                true
              );

          },
          150
        );

    }
  );

});
