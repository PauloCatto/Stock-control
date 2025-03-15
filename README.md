# Stock Control

Este projeto tem como objetivo gerenciar o controle de estoque de produtos. Ele permite gerenciar o cadastro de usuários, produtos, categorias, vendas e visualizar gráficos sobre o desempenho do estoque.

## **Funcionalidades**

- **Tela de Login:** O usuário pode criar uma conta ou se autenticar para acessar o sistema.
  <br>
  <br>
  ![2025-03-15_14-44-30](https://github.com/user-attachments/assets/5a4356ad-9afc-497b-ae07-3800492c8b79)
  <br>
- **Dashboard:** Exibe um gráfico com os itens adicionados e permite a exportação de dados em PDF.
  <br>
  <br>
  ![2025-03-15_14-45-18](https://github.com/user-attachments/assets/38a0fde8-ec4d-43bb-b473-ac2dca8fe0b1)
  <br>
- **Tela de Produtos:** Permite adicionar, editar e excluir produtos no estoque.
  <br>
  <br>
  ![2025-03-15_14-45-38](https://github.com/user-attachments/assets/2b1f5714-dc83-4ff8-9530-45e95d9093cf)
  <br>
- **Tela de Categorias:** Permite gerenciar as categorias de produtos, permitindo adição, edição e remoção.
  <br>
  <br>
  ![2025-03-15_14-45-51](https://github.com/user-attachments/assets/e80fab66-fe7a-49e3-b2e0-d67bcfb7b8f5)
  <br>
- **Tela de Vendas:** Realiza transações de venda, com reflexo automático no Dashboard.
  <br>
  <br>
  
  ![2025-03-15_14-46-10](https://github.com/user-attachments/assets/51578570-e7b4-4827-8923-bfc1ffe5d2a2)

  <br>

## **Testes Unitários**

A cobertura de testes unitários foi configurada para garantir uma cobertura mínima de 70%. Aqui estão os resultados dos testes:
<br>
<br>
![2025-03-15_14-44-49](https://github.com/user-attachments/assets/b571ac52-a294-4b09-8981-b47e96a4cd39)
<br>

## **Tecnologias Utilizadas**

- **Frontend:** Angular 15, RxJS, PrimeNG, Angular Material
- **Backend:** https://github.com/PauloCatto/API-stock-control
- **Gráficos:** Chart.js
- **Exportação:** jsPDF

Passo a Passo para Executar o Projeto
1. Clonar o repositório: git clone https://github.com/usuario/stock-control.git
2. Navegar até o diretório do projeto: cd stock-control
3. Instalar as dependências: npm install
4. Iniciar o servidor de desenvolvimento
Para rodar o projeto localmente, use o seguinte comando: ng serve -o

Isso ira iniciar o servidor de desenvolvimento e abrir o projeto em http://localhost:4200/, apenas se o backend ja estiver sido iniciado.
