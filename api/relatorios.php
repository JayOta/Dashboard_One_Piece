<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // Necessário para acessar de outro projeto/porta

// O db_config.php deve estar na pasta anterior (../api/db_config.php)
// Se você copiou o db_config.php para o dashboard_mini_loja/api/, mantenha apenas 'db_config.php'
include 'db_config.php';

try {
    // 1. DADOS GERAIS E MÉTRICAS
    $metrics_sql = "
        SELECT 
            COUNT(DISTINCT p.id) AS total_produtos,
            COUNT(DISTINCT v.id) AS total_vendas,
            IFNULL(SUM(v.valor_total), 0) AS valor_total_vendido
        FROM produtos p
        LEFT JOIN vendas v ON 1=1; -- Juntamos para contar tudo
    ";
    $metrics_stmt = $pdo->query($metrics_sql);
    $metrics = $metrics_stmt->fetch();

    // 2. ÚLTIMAS VENDAS
    $vendas_sql = "
        SELECT 
            id, 
            valor_total, 
            data_venda, 
            status 
        FROM vendas 
        ORDER BY data_venda DESC 
        LIMIT 10
    ";
    $vendas_stmt = $pdo->query($vendas_sql);
    $ultimas_vendas = $vendas_stmt->fetchAll();

    // 3. ESTOQUE DOS PRODUTOS
    $produtos_sql = "
        SELECT 
            id, 
            nome, 
            estoque, 
            preco,
            imagem_url 
        FROM produtos 
        ORDER BY estoque ASC, nome ASC
    ";
    $produtos_stmt = $pdo->query($produtos_sql);
    $produtos_estoque = $produtos_stmt->fetchAll();

    // 4. ESTATÍSTICAS RÁPIDAS (Vendas Hoje)
    $vendas_hoje_sql = "
        SELECT 
            COUNT(id) AS vendas_hoje,
            IFNULL(SUM(valor_total), 0) AS receita_hoje
        FROM vendas 
        WHERE DATE(data_venda) = CURDATE()
    ";
    $vendas_hoje_stmt = $pdo->query($vendas_hoje_sql);
    $stats_hoje = $vendas_hoje_stmt->fetch();

    // Consolida todos os dados em um único objeto de resposta
    echo json_encode([
        'success' => true,
        'metrics' => $metrics,
        'ultimas_vendas' => $ultimas_vendas,
        'produtos_estoque' => $produtos_estoque,
        'stats_hoje' => $stats_hoje,
        'message' => 'Relatórios carregados com sucesso.'
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false, 
        'message' => 'Erro ao buscar relatórios: ' . $e->getMessage()
    ]);
}
?>