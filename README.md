# Logistics-linear-system


### Simulador Interativo de Distribuição Logística
- Problema real: Otimizar a distribuição de produtos em uma rede logística (fábricas, centros de distribuição e lojas) de forma que as quantidades enviadas e recebidas atendam às demandas e capacidades. Em cenários de negócios, isso aparece em planejamento de transporte e fluxo de materiais entre vários nós da cadeia de suprimentos.
Métodos numéricos aplicados: O balanceamento de fluxos pode ser formulado como um sistema linear onde cada equação representa a conservação de fluxo em um ponto (entrada = saída). A solução desse sistema grande pode ser obtida por métodos iterativos como Gauss-Seidel, ajustando sucessivamente as variáveis de fluxo até satisfazer todas as equações​
EN.WIKIPEDIA.ORG
PUBSONLINE.INFORMS.ORG
. Por exemplo, o algoritmo começa com uma estimativa inicial das quantidades a serem enviadas em cada rota e, iterativamente, corrige esses valores calculando o erro (excesso ou falta) em cada nó e redistribuindo o excesso para onde há falta. Pesquisas mostram que algoritmos de relaxação inspirados em Gauss-Seidel podem ser eficientes nesse tipo de problema, chegando a ser várias vezes mais rápidos que métodos tradicionais de otimização em certas redes​
PUBSONLINE.INFORMS.ORG
.


- Interatividade do usuário: A ferramenta permite que o usuário defina a rede logística (nós e conexões), as capacidades de envio e as demandas de cada destino. Com um clique, o usuário inicia o cálculo iterativo do fluxo. Ele pode passo a passo pausar após cada iteração Gauss-Seidel para ajustar manualmente alguma variável (por exemplo, limitar o envio em uma rota específica) e ver como o sistema responde. Também pode alterar critérios, como ordenar quais nós atualizar primeiro, observando a influência na velocidade de convergência.


- Visualização gráfica: A rede logística é exibida como um grafo interativo. Cada aresta (rota) tem uma barra ou espessura proporcional ao fluxo atual, atualizada em tempo real a cada iteração. Números indicam, em cada nó, o balanço atual (positivo se excesso, negativo se demanda não atendida). Conforme o método iterativo avança, o usuário vê as barras de fluxo se ajustando gradualmente até estabilizarem quando todos os nós atingem balanço zero (fluxo conservado). Gráficos de convergência também são mostrados, ilustrando a diminuição do erro (desbalanceamento total) a cada iteração, o que ajuda a compreender visualmente a melhoria progressiva rumo à solução viável.