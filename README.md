# 🚀 Project Model Canvas (PMC) - Web Interativo

Olá! Seja muito bem-vindo(a) ao **Project Model Canvas Web**! 🎉

Este projeto é uma ferramenta web leve, prática e simplificada para preenchimento e exportação do famoso **Project Model Canvas (PMC)** diretamente pelo navegador, sem necessidade de instalar nada ou criar cadastros.

---

## 💡 Sobre o Projeto e Inspiração

Esta página web foi projetada como uma versão digital interativa e aprimorada, inspirada diretamente na consagrada metodologia criada pelo **Professor José Finocchio Junior**, disponível originalmente em [pmcanvas.com.br](http://pmcanvas.com.br/).

A proposta do Project Model Canvas original é permitir o planejamento visual colaborativo de projetos em uma única folha/painel dividido em blocos estratégicos que respondem a perguntas fundamentais:
- **Por quê?** (Justificativas, Objetivo SMART, Benefícios)
- **O quê?** (Produto, Requisitos)
- **Quem?** (Stakeholders, Equipe)
- **Como?** (Premissas, Entregas, Restrições, Riscos)
- **Quando?** (Linha do Tempo)
- **Quanto?** (Custos)

Nesta versão web, você pode digitar suas ideias em cada um dos blocos com auto-ajuste de texto e exportar o resultado final diretamente em **PDF de alta resolução**, pronto para imprimir ou compartilhar com sua equipe e professores! 📄✨

---

## ✨ Funcionalidades

- 📌 **Layout Fiel ao Canvas Original:** Organização visual em grid idêntica à metodologia do PMC.
- 🎓 **Cabeçalho Acadêmico / Equipe:** Campos dedicados para listar integrantes, disciplina/curso e data automática.
- 🎯 **Campo de Pitch em Destaque:** Espaço no topo para resumir o valor do projeto em uma frase impactante.
- 📐 **Expansão Automática de Texto:** Conforme você digita, os campos crescem sem quebrar a estética ou cortar informações.
- 💾 **Salvamento Automático (Autosave):** O progresso é salvo no `localStorage` do seu navegador continuamente — nunca perca uma ideia!
- 📦 **Backup e Restauração em JSON:** Exporte seu projeto para um arquivo `.json` leve e importe novamente quando quiser continuar.
- 🖨️ **Exportação em PDF Limpa:** Captura de alta definição (via `html2canvas` + `jsPDF`) que não polui o PDF com textos de placeholder ou caixas vazias.
- 🖨️ **Impressão Nativa (@media print):** Compatível com o comando Imprimir do navegador (`Ctrl + P`), formatado em orientação paisagem.
- ⚡ **100% Client-Side e Seguro:** Nenhum dado sai do seu computador.

---

## 🚀 Como Usar

Você pode utilizar a aplicação de duas formas super fáceis:

### Opção 1: Diretamente pelo Navegador (Online via GitHub Pages)
Se você não deseja baixar nada, basta acessar a versão hospedada no **GitHub Pages**:
👉 **[Acessar o Modelo de Edição Online](https://snt-lucas.github.io/PMC/)** *(ou pelo link na descrição do repositório)*

### Opção 2: Executando Localmente no seu Computador (Offline)
Não precisa de Node.js, banco de dados ou servidor:
1. **Baixe o projeto** (ou descompacte a release zipada).
2. Dê um duplo clique no arquivo `index.html` para abrir no seu navegador preferido.

---

### 📝 Preenchendo e Exportando:
1. Preencha os blocos com o planejamento do seu projeto (o salvamento é automático a cada digitação).
2. Utilize a barra de ações:
   - **📄 Baixar Canvas em PDF:** Cria o PDF de alta resolução pronto para entrega ou impressão.
   - **💾 Exportar Backup (JSON):** Salva uma cópia dos dados no seu computador.
   - **📂 Carregar Backup (JSON):** Restaura um projeto salvo anteriormente.
   - **🗑️ Limpar Campos:** Reinicia o canvas com confirmação de segurança.

---

## 🛠️ Tecnologias Utilizadas

- **HTML5:** Estrutura semântica dos blocos e seções.
- **CSS3 (Grid & Flexbox):** Diagramação em grid de 5 colunas com responsividade.
- **JavaScript (ES6+):** Lógica de dimensionamento automático e exportação.
- **Bibliotecas CDN:**
  - [html2canvas](https://html2canvas.hertzen.com/) para renderização da tela em canvas gráfico.
  - [jsPDF](https://github.com/parallax/jsPDF) para compilação e download do documento PDF.

---

## 🌟 Créditos e Agradecimentos

- Metodologia original criada pelo **Prof. José Finocchio Junior**.
- Conheça mais e acesse os materiais oficiais em: [http://pmcanvas.com.br/](http://pmcanvas.com.br/)

---

Feito com carinho para estudantes, gerentes de projetos, professores e entusiastas da gestão ágil e visual! Se gostar, deixe uma ⭐ no repositório!
