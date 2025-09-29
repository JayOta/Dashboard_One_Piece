// Dados Fictícios de One Piece - Tripulação dos Chapéus de Palha
const tripulacao = [
  {
    nome: "Monkey D. Luffy",
    funcao: "Capitão",
    recompensa: 3000000000,
    akuma: "Hito Hito no Mi, Modelo: Nika",
  },
  {
    nome: "Roronoa Zoro",
    funcao: "Espadachim",
    recompensa: 1111000000,
    akuma: "Nenhuma",
  },
  {
    nome: "Nami",
    funcao: "Navegadora",
    recompensa: 366000000,
    akuma: "Nenhuma",
  },
  {
    nome: "Usopp",
    funcao: "Atirador",
    recompensa: 500000000,
    akuma: "Nenhuma",
  },
  {
    nome: "Sanji",
    funcao: "Cozinheiro",
    recompensa: 1032000000,
    akuma: "Nenhuma",
  },
  {
    nome: "Tony Tony Chopper",
    funcao: "Médico",
    recompensa: 1000,
    akuma: "Hito Hito no Mi",
  },
  {
    nome: "Nico Robin",
    funcao: "Arqueóloga",
    recompensa: 930000000,
    akuma: "Hana Hana no Mi",
  },
  {
    nome: "Franky",
    funcao: "Carpinteiro",
    recompensa: 394000000,
    akuma: "Nenhuma",
  },
  {
    nome: "Brook",
    funcao: "Músico",
    recompensa: 383000000,
    akuma: "Yomi Yomi no Mi",
  },
  {
    nome: "Jinbe",
    funcao: "Timoneiro",
    recompensa: 1100000000,
    akuma: "Nenhuma",
  },
];

// Outras Estatísticas Fictícias
const statsGerais = {
  capitulosVistos: 1078,
  arcosFinalizados: 15,
};

// --- Funções Auxiliares de Formatação e Cálculo ---

// Formata o número como string de recompensa (B$)
function formatarRecompensa(recompensa) {
  // Ex: 3000000000 -> 3.000.000.000 B$
  return (
    recompensa
      .toLocaleString("pt-BR", {
        style: "currency",
        currency: "JPY",
        minimumFractionDigits: 0,
      })
      .replace("¥", "") + " B$"
  );
}

// Calcula as Métricas do Dashboard
function calcularMetricas(data) {
  const totalMembros = data.length;
  const totalRecompensa = data.reduce(
    (soma, membro) => soma + membro.recompensa,
    0
  );
  const akumaUsers = data.filter((membro) => membro.akuma !== "Nenhuma").length;
  return {
    totalMembros,
    totalRecompensa,
    akumaUsers,
  };
}

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
    const value = Math.floor(progress * (end - start) + start);

    obj.textContent = formatter(value);

    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };
  window.requestAnimationFrame(step);
}

// Popula os Cards de Visão Geral com Animação
function popularCards(metricas) {
  const duracao = 1500; // 1.5 segundos para a animação

  // Membros (Contagem simples)
  animateValue(
    "membros-atuais",
    0,
    metricas.totalMembros,
    duracao,
    (val) => val
  );

  // Recompensa Total (Contagem formatada)
  animateValue(
    "recompensa-total",
    0,
    metricas.totalRecompensa,
    duracao,
    formatarRecompensa
  );

  // Usuários Akuma no Mi (Contagem simples)
  animateValue("akuma-users", 0, metricas.akumaUsers, duracao, (val) => val);
}

// Popula a Tabela da Tripulação
function popularTabela(data) {
  const tabelaBody = document.querySelector("#tripulacao-tabela tbody");
  tabelaBody.innerHTML = "";

  data.forEach((membro) => {
    const row = tabelaBody.insertRow();

    let cellNome = row.insertCell();
    cellNome.textContent = membro.nome;

    let cellFuncao = row.insertCell();
    cellFuncao.textContent = membro.funcao;

    let cellRecompensa = row.insertCell();
    cellRecompensa.textContent = formatarRecompensa(membro.recompensa);

    let cellAkuma = row.insertCell();
    cellAkuma.textContent = membro.akuma;
  });
}

// Popula as Estatísticas Rápidas na Sidebar (também com contagem para ser dinâmico)
function popularQuickStats(stats) {
  const duracao = 1000;
  animateValue("capitulos-vistos", 0, stats.capitulosVistos, duracao);
  animateValue("arcos-finalizados", 0, stats.arcosFinalizados, duracao);
}

// --- Função Principal de Inicialização ---
function initDashboard() {
  const metricas = calcularMetricas(tripulacao);

  // Adiciona um pequeno delay na população dos cards para a animação de "contagem"
  setTimeout(() => {
    popularCards(metricas);
  }, 500);

  popularTabela(tripulacao);
  popularQuickStats(statsGerais);
}

// Inicia o dashboard quando o script é carregado
document.addEventListener("DOMContentLoaded", initDashboard);
