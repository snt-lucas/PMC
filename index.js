/**
 * ========================================================================
 * Aplicativo Interativo do Project Model Canvas (PMC)
 * Funcionalidades:
 * - Auto-ajuste de altura para áreas de texto
 * - Salvamento automático contínuo em localStorage
 * - Exportação e importação de backups em formato JSON
 * - Renderização e download do Canvas em PDF de alta qualidade (jsPDF + html2canvas)
 * ========================================================================
 */

const STORAGE_KEY = "pmc_canvas_saved_data_v1";

/**
 * Retorna a data atual no formato YYYY-MM-DD para preenchimento de inputs de data.
 * @returns {string}
 */
function obterDataAtual() {
  const hoje = new Date();
  const ano = hoje.getFullYear();
  const mes = String(hoje.getMonth() + 1).padStart(2, "0");
  const dia = String(hoje.getDate()).padStart(2, "0");
  return `${ano}-${mes}-${dia}`;
}

/**
 * Ajusta automaticamente a altura da textarea com base no conteúdo (scrollHeight).
 * @param {HTMLTextAreaElement} [elemento] - Elemento a ser ajustado (ou 'this' se omitido).
 */
function autoAjustarAltura(elemento) {
  const el = elemento || this;
  if (!el) return;
  el.style.height = "auto";
  el.style.height = `${el.scrollHeight}px`;
}

/**
 * Coleta todos os campos preenchíveis da aplicação em um objeto chave-valor.
 * @returns {Record<string, string>}
 */
function coletarDadosFormulario() {
  const container = document.getElementById("canvas-capture-area");
  const campos = container.querySelectorAll("input, textarea");
  const dados = {};

  campos.forEach((campo) => {
    if (campo.id) {
      dados[campo.id] = campo.value;
    }
  });

  return dados;
}

/**
 * Salva os dados no localStorage do navegador e atualiza o indicador visual.
 */
function salvarNoLocalStorage() {
  const dados = coletarDadosFormulario();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(dados));

  const statusEl = document.getElementById("status-autosave");
  if (statusEl) {
    statusEl.innerText = "✓ Salvo automaticamente no navegador";
    statusEl.style.opacity = "1";
  }
}

/**
 * Carrega os dados persistidos no localStorage ou inicializa valores padrão.
 */
function carregarDadosSalvos() {
  const dadosSalvos = localStorage.getItem(STORAGE_KEY);
  let temDados = false;

  if (dadosSalvos) {
    try {
      const dados = JSON.parse(dadosSalvos);
      for (const [id, valor] of Object.entries(dados)) {
        const campo = document.getElementById(id);
        if (campo) {
          campo.value = valor;
          temDados = true;
        }
      }
    } catch (e) {
      console.warn("Não foi possível restaurar os dados salvos:", e);
    }
  }

  // Preenche a data de hoje se o campo estiver vazio
  const campoData = document.getElementById("data-projeto");
  if (campoData && !campoData.value) {
    campoData.value = obterDataAtual();
  }

  // Ajusta a altura de todas as textareas com base no conteúdo carregado
  document.querySelectorAll("textarea").forEach((ta) => {
    autoAjustarAltura(ta);
  });
}

/**
 * Limpa todos os campos preenchidos após confirmação do usuário.
 */
function limparCanvas() {
  const confirmacao = window.confirm(
    "Tem certeza de que deseja limpar todos os campos do Canvas? Esta ação removerá o rascunho salvo."
  );

  if (!confirmacao) return;

  const container = document.getElementById("canvas-capture-area");
  const campos = container.querySelectorAll("input, textarea");

  campos.forEach((campo) => {
    if (campo.id === "data-projeto") {
      campo.value = obterDataAtual();
    } else {
      campo.value = "";
    }
  });

  localStorage.removeItem(STORAGE_KEY);

  document.querySelectorAll("textarea").forEach((ta) => {
    autoAjustarAltura(ta);
  });

  const statusEl = document.getElementById("status-autosave");
  if (statusEl) {
    statusEl.innerText = "Campos limpos com sucesso.";
  }
}

/**
 * Exporta o projeto atual para um arquivo JSON baixável.
 */
function exportarJSON() {
  const dados = coletarDadosFormulario();
  const pitch = dados.pitch ? dados.pitch.trim().replace(/[^a-zA-Z0-9_-]/g, "_") : "projeto";
  const nomeArquivo = `pmc-${pitch || "canvas"}-${obterDataAtual()}.json`;

  const blob = new Blob([JSON.stringify(dados, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = nomeArquivo;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Importa um arquivo JSON de backup previamente exportado.
 * @param {Event} evento
 */
function importarJSON(evento) {
  const arquivo = evento.target.files && evento.target.files[0];
  if (!arquivo) return;

  const leitor = new FileReader();
  leitor.onload = (e) => {
    try {
      const dados = JSON.parse(e.target.result);
      for (const [id, valor] of Object.entries(dados)) {
        const campo = document.getElementById(id);
        if (campo) {
          campo.value = valor;
        }
      }

      salvarNoLocalStorage();

      document.querySelectorAll("textarea").forEach((ta) => {
        autoAjustarAltura(ta);
      });

      alert("Backup importado com sucesso!");
    } catch (erro) {
      console.error("Erro ao ler JSON:", erro);
      alert("Arquivo de backup inválido.");
    } finally {
      evento.target.value = ""; // Permite selecionar o mesmo arquivo novamente
    }
  };

  leitor.readAsText(arquivo);
}

/**
 * Gera e faz o download de um PDF da área de captura do Canvas.
 * Substitui temporariamente inputs e textareas por elementos 'div' estáticos
 * sem exibir o texto do placeholder se o campo estiver vazio.
 * @async
 * @returns {Promise<void>}
 */
async function baixarCanvasPDF() {
  const { jsPDF } = window.jspdf;
  const elemento = document.getElementById("canvas-capture-area");
  const botao = document.getElementById("btn-baixar-pdf");

  const textoOriginalBotao = botao.innerText;
  botao.innerText = "⏳ Gerando PDF... Aguarde.";
  botao.disabled = true;

  // Força as dimensões de modo desktop para captura no html2canvas
  elemento.classList.add("exporting");

  const textareas = elemento.querySelectorAll("textarea");
  const inputsDeTexto = elemento.querySelectorAll('input[type="text"]');
  const elementosTemporarios = [];

  // Substitui os inputs de texto por divs estáticas (sem imprimir placeholder se vazio)
  inputsDeTexto.forEach((input) => {
    const div = document.createElement("div");
    const valor = (input.value || "").trim();
    div.innerText = valor; // Preserva o conteúdo real, sem exibir dicas/placeholders no documento final
    div.style.width = "100%";

    if (input.id === "pitch") {
      div.style.flex = "1";
      div.style.backgroundColor = "#ffffff";
      div.style.color = "#333";
      div.style.fontSize = "1em";
    } else {
      div.style.backgroundColor = "#ffffff";
      div.style.color = "#333";
      div.style.fontSize = "0.95em";
      div.style.border = "1px solid #ced4da";
    }
    div.style.padding = "8px";
    div.style.borderRadius = "4px";
    div.style.boxSizing = "border-box";
    div.style.whiteSpace = "pre-wrap";
    div.style.wordBreak = "break-word";
    div.style.minHeight = "38px";

    input.parentNode.insertBefore(div, input);
    input.style.display = "none";
    elementosTemporarios.push({ temporario: div, original: input });
  });

  // Substitui as textareas por divs estáticas mantendo a altura calculada
  textareas.forEach((ta) => {
    const div = document.createElement("div");
    const valor = (ta.value || "").trim();
    div.innerText = valor; // Preserva o conteúdo real
    div.style.width = "100%";
    div.style.flex = "1";

    div.style.whiteSpace = "pre-wrap";
    div.style.wordBreak = "break-word";
    div.style.padding = ta.id === "integrantes" ? "8px" : "5px";
    div.style.backgroundColor = ta.id === "integrantes" ? "#ffffff" : "#fafafa";
    div.style.fontFamily = "inherit";
    div.style.fontSize = ta.id === "integrantes" ? "0.95em" : "0.9em";
    div.style.color = "#333";
    div.style.border = ta.id === "integrantes" ? "1px solid #ced4da" : "none";
    div.style.borderRadius = "4px";
    div.style.minHeight = ta.id === "integrantes" ? "38px" : "110px";
    div.style.height = ta.style.height; // Herda a altura exata calculada pelo auto-ajuste
    div.style.boxSizing = "border-box";

    ta.parentNode.insertBefore(div, ta);
    ta.style.display = "none";
    elementosTemporarios.push({ temporario: div, original: ta });
  });

  try {
    const canvas = await html2canvas(elemento, {
      scale: 2,
      backgroundColor: "#dee2e6",
      useCORS: true,
      windowWidth: 1400,
    });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF({
      orientation: canvas.width > canvas.height ? "landscape" : "portrait",
      unit: "px",
      format: [canvas.width / 2, canvas.height / 2],
    });

    pdf.addImage(imgData, "PNG", 0, 0, canvas.width / 2, canvas.height / 2);
    
    const campoPitch = document.getElementById("pitch");
    const pitchTexto = campoPitch && campoPitch.value ? campoPitch.value.trim().substring(0, 30).replace(/[^a-zA-Z0-9_-]/g, "_") : "";
    const nomePdf = pitchTexto ? `pmc-${pitchTexto}.pdf` : "project-model-canvas.pdf";

    pdf.save(nomePdf);
  } catch (error) {
    console.error("Erro ao gerar o PDF:", error);
    alert("Não foi possível gerar o arquivo PDF. Tente novamente ou use a opção Imprimir (Ctrl + P).");
  } finally {
    // Restaura o DOM para o estado interativo original
    elemento.classList.remove("exporting");

    elementosTemporarios.forEach((item) => {
      item.temporario.remove();
      item.original.style.display = "";
    });

    botao.innerText = textoOriginalBotao;
    botao.disabled = false;
  }
}

/**
 * Inicialização e associação de eventos após o carregamento do DOM.
 */
document.addEventListener("DOMContentLoaded", () => {
  // Carrega rascunho anterior
  carregarDadosSalvos();

  // Escuta digitação em todos os campos para auto-ajuste e autosave
  const container = document.getElementById("canvas-capture-area");
  container.addEventListener("input", (evento) => {
    if (evento.target.tagName.toLowerCase() === "textarea") {
      autoAjustarAltura(evento.target);
    }
    salvarNoLocalStorage();
  });

  // Associação de botões de ação (JavaScript não-obstrusivo)
  const btnPdf = document.getElementById("btn-baixar-pdf");
  if (btnPdf) {
    btnPdf.addEventListener("click", baixarCanvasPDF);
  }

  const btnExportarJson = document.getElementById("btn-exportar-json");
  if (btnExportarJson) {
    btnExportarJson.addEventListener("click", exportarJSON);
  }

  const inputImportarJson = document.getElementById("input-importar-json");
  if (inputImportarJson) {
    inputImportarJson.addEventListener("change", importarJSON);
  }

  const btnLimpar = document.getElementById("btn-limpar");
  if (btnLimpar) {
    btnLimpar.addEventListener("click", limparCanvas);
  }
});