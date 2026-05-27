/**
 * Inicializa a aplicação assim que o DOM é totalmente carregado.
 * Preenche automaticamente o campo de data do projeto com a data de hoje.
 */
window.addEventListener("DOMContentLoaded", () => {
  const campoData = document.getElementById("data-projeto");
  const hoje = new Date();

  const ano = hoje.getFullYear();
  const mes = String(hoje.getMonth() + 1).padStart(2, "0");
  const dia = String(hoje.getDate()).padStart(2, "0");

  campoData.value = `${ano}-${mes}-${dia}`;
});

/**
 * Seleciona todas as áreas de texto (textareas) da página para aplicar
 * o comportamento de ajuste automático de altura.
 */
const areasTexto = document.querySelectorAll("textarea");

areasTexto.forEach((ta) => {
  ta.addEventListener("input", autoAjustarAltura);
  autoAjustarAltura.call(ta);
});

/**
 * Ajusta automaticamente a altura da área de texto com base no seu conteúdo (scrollHeight).
 * @this {HTMLTextAreaElement} O elemento de texto que acionou a função.
 */
function autoAjustarAltura() {
  this.style.height = "auto";
  this.style.height = this.scrollHeight + "px";
}

/**
 * Gera e faz o download de um PDF da área de captura do Canvas.
 * Substitui temporariamente inputs e textareas por elementos 'div' simulados
 * para garantir a renderização fiel pelo html2canvas antes de exportar com jsPDF.
 * @async
 * @returns {Promise<void>}
 */
async function baixarCanvasPDF() {
  const { jsPDF } = window.jspdf;
  const elemento = document.getElementById("canvas-capture-area");
  const botao = document.querySelector(".btn");

  botao.innerText = "Gerando PDF... Aguarde.";
  botao.disabled = true;

  // Força o modo desktop para captura
  elemento.classList.add("exporting");

  const textareas = elemento.querySelectorAll("textarea");
  const inputsDeTexto = elemento.querySelectorAll('input[type="text"]');
  const elementosTemporarios = [];

  // Substitui os inputs de texto por divs estáticas para o print
  inputsDeTexto.forEach((input) => {
    const div = document.createElement("div");
    div.innerText = input.value || input.placeholder;
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

    input.parentNode.insertBefore(div, input);
    input.style.display = "none";
    elementosTemporarios.push({ temporario: div, original: input });
  });

  // Substitui as textareas por divs estáticas mantendo a altura calculada
  textareas.forEach((ta) => {
    const div = document.createElement("div");
    div.innerText = ta.value || ta.placeholder;
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
    div.style.height = ta.style.height; // Herda a altura exata que o script auto-grow calculou
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
    pdf.save("project-model-canvas.pdf");
  } catch (error) {
    console.error("Erro ao gerar o PDF:", error);
    alert("Não foi possível gerar o arquivo PDF.");
  } finally {
    // Restaura o documento ao estado interativo original
    elemento.classList.remove("exporting");

    elementosTemporarios.forEach((item) => {
      item.temporario.remove();
      item.original.style.display = "";
    });

    botao.innerText = "Baixar Canvas em PDF";
    botao.disabled = false;
  }
}