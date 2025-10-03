const API_URL = "./api/relatorios.php";

// --- Funções Auxiliares de Formatação e Cálculo ---

function formatCurrency(value, withPrefix = true) {
  // Converte para float (se vier como string do BD) e formata
  const formatted = parseFloat(value).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
  return withPrefix ? formatted : formatted.replace("R$", "").trim();
}

// O cálculo agora é feito pelo PHP/SQL, o JS apenas formata e popula.

// --- Funções de Animação e População ---

// Função para animar a contagem de um valor
function animateValue(
  elementId,
  start,
  end,
  duration,
  formatter = (val) => val
) {
  const obj = document.getElementById(elementId);
  if (!obj) return;

  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    const value = start + (end - start) * progress; // Usa interpolação linear para floats

    obj.textContent = formatter(value);

    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };
  window.requestAnimationFrame(step);
}

// Popula os Cards de Visão Geral com Animação
function popularCards(metrics) {
  const duracao = 1500; // 1.5 segundos para a animação

  // Total de Produtos
  animateValue("total-produtos", 0, parseInt(metrics.total_produtos), duracao);

  // Total de Vendas
  animateValue("total-vendas", 0, parseInt(metrics.total_vendas), duracao);

  // Valor Total Vendido (Requer formatação de moeda durante a animação)
  animateValue(
    "valor-total-vendido",
    0,
    parseFloat(metrics.valor_total_vendido),
    duracao,
    formatCurrency
  );
}

// Popula as Estatísticas Rápidas na Sidebar
function popularQuickStats(stats) {
  const duracao = 1000;

  // Vendas Hoje (Contagem simples)
  animateValue("vendas-hoje", 0, parseInt(stats.vendas_hoje), duracao);

  // Receita Total (Formatação de moeda)
  animateValue(
    "receita-total",
    0,
    parseFloat(stats.receita_hoje),
    duracao,
    formatCurrency
  );
}

// Popula a Tabela de Vendas
function popularTabelaVendas(data) {
  const tabelaBody = document.querySelector("#vendas-tabela tbody");
  tabelaBody.innerHTML = "";

  data.forEach((venda) => {
    const row = tabelaBody.insertRow();

    // Formata a data e status para exibição
    const dataFormatada = new Date(venda.data_venda).toLocaleDateString(
      "pt-BR",
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    );
    const statusText =
      venda.status.charAt(0).toUpperCase() + venda.status.slice(1);

    let cellId = row.insertCell();
    cellId.textContent = venda.id;

    let cellData = row.insertCell();
    cellData.textContent = dataFormatada;

    let cellValor = row.insertCell();
    cellValor.textContent = formatCurrency(venda.valor_total);

    let cellStatus = row.insertCell();
    cellStatus.textContent = statusText;
    cellStatus.className = `status-${venda.status}`; // Para estilização futura
  });
}

// Popula a Tabela de Estoque
// Popula a Tabela de Estoque
function popularTabelaProdutos(data) {
  const tabelaBody = document.querySelector("#produtos-tabela tbody");
  tabelaBody.innerHTML = "";

  data.forEach((produto) => {
    const row = tabelaBody.insertRow();

    // Destaca produtos com estoque baixo
    if (produto.estoque < 5) {
      row.className = "low-stock";
    }

    let cellId = row.insertCell();
    cellId.textContent = produto.id;

    // NOVO: Célula da Imagem
    let cellImagem = row.insertCell();
    const img = document.createElement("img");
    // Adiciona a classe 'product-thumb' para estilização
    img.className = "product-thumb";
    // Use a barra inicial para apontar para a raiz do localhost:
    img.src = `../mini_loja_virtual/${produto.imagem_url}`;
    img.alt = produto.nome;
    cellImagem.appendChild(img);
    // Centraliza o conteúdo da célula
    cellImagem.style.textAlign = "center";

    let cellNome = row.insertCell();
    cellNome.textContent = produto.nome;

    let cellEstoque = row.insertCell();
    cellEstoque.textContent = produto.estoque;

    let cellPreco = row.insertCell();
    cellPreco.textContent = formatCurrency(produto.preco);
  });
}

// --- Função Principal de BUSCA DE DADOS ---

async function fetchDashboardData() {
  try {
    const response = await fetch(API_URL);
    const result = await response.json();

    if (result.success) {
      const { metrics, ultimas_vendas, produtos_estoque, stats_hoje } = result;

      // População do Dashboard
      popularCards(metrics);
      popularQuickStats(stats_hoje);
      popularTabelaVendas(ultimas_vendas);
      popularTabelaProdutos(produtos_estoque);
    } else {
      console.error("Erro no Dashboard:", result.message);
      alert("Falha ao carregar dados do Dashboard. Verifique a API.");
    }
  } catch (error) {
    console.error("Erro na comunicação com a API de relatórios:", error);
    alert("Falha de conexão com o servidor de relatórios.");
  }
}

// --- Inicialização ---
function initDashboard() {
  // Substituímos a lógica de dados estáticos pela chamada à API
  fetchDashboardData();
}

document.addEventListener("DOMContentLoaded", initDashboard);
