/*
  --------------------------------------------------------------------------------------
  Função para limpar a tabela
  --------------------------------------------------------------------------------------
*/
const clearTable = () => {
  let table = document.getElementById("myTable");
  if (table) {
    while (table.rows.length > 1) {
      table.deleteRow(1);
    }
  }
};

/*
  --------------------------------------------------------------------------------------
  Função para obter a lista existente do servidor via requisição GET
  --------------------------------------------------------------------------------------
*/
const getList = async () => {
  let url = "http://127.0.0.1:5000/produtos";
  fetch(url, {
    method: "get",
  })
    .then((response) => response.json())
    .then((data) => {
      clearTable(); // Limpa a tabela existente antes de adicionar os novos dados
      data.produtos.forEach((item) =>
        insertList(
          item.codigo,
          item.produto,
          item.valor,
          item.ingredientes_do_produto
        )
      );
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};

/*
  --------------------------------------------------------------------------------------
  Chamada da função para carregamento inicial dos dados
  --------------------------------------------------------------------------------------
*/
getList();

/*
  --------------------------------------------------------------------------------------
  Função para colocar um item na lista do servidor via requisição POST
  --------------------------------------------------------------------------------------
*/
const postItem = async (
  inputCode,
  inputProduct,
  inputPrice,
  inputIngredients
) => {
  const formData = new FormData();
  formData.append("codigo", inputCode);
  formData.append("produto", inputProduct);
  formData.append("valor", inputPrice);

  // const ingredientsList = inputIngredients.split(", ").map(item => item.trim());

  formData.append('ingredientes_do_produto', inputIngredients);

  let url = "http://127.0.0.1:5000/produto";
  fetch(url, {
    method: "post",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Response from server:", data);
      getList();
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};

/*
  --------------------------------------------------------------------------------------
  Função para criar um botão close para cada item da lista
  --------------------------------------------------------------------------------------
*/
const insertButton = (parent) => {
  let span = document.createElement("span");
  let txt = document.createTextNode("\u00D7");

  span.className = "close";

  span.appendChild(txt);
  parent.appendChild(span);
  parent.classList.add("delete-column");
};

/*
  --------------------------------------------------------------------------------------
  Função para remover um item da lista de acordo com o click no botão close
  --------------------------------------------------------------------------------------
*/
const removeElement = () => {
  let deleteColumns = document.getElementsByClassName("delete-column");
  let i;
  for (i = 0; i < deleteColumns.length; i++) {
    deleteColumns[i].onclick = function () {
      let div = this.parentElement;

      if (div.classList.contains("product-row")) {
        const nomeItem = div.getElementsByTagName("td")[1].innerHTML;

        if (confirm("Você tem certeza?")) {
          let nextRow = div.nextElementSibling;
          if (nextRow && nextRow.classList.contains("ingredients")) {
            nextRow.remove();
          }

          div.remove();
          deleteItem(nomeItem);
          alert("Removido!");
        }
      }
    };
  }
};

/*
  --------------------------------------------------------------------------------------
  Função para deletar um item da lista do servidor via requisição DELETE
  --------------------------------------------------------------------------------------
*/
const deleteItem = (item) => {
  console.log(item);
  let url = "http://127.0.0.1:5000/produto?produto=" + item;
  fetch(url, {
    method: "delete",
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Response from server:", data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};

/*
  --------------------------------------------------------------------------------------
  Função para adicionar um novo item com nome, quantidade e valor 
  --------------------------------------------------------------------------------------
*/
const newItem = () => {
  let inputCode = document.getElementById("newCode").value;
  let inputProduct = document.getElementById("newProduct").value;
  let inputPrice = document.getElementById("newPrice").value;
  let inputIngredients = document.getElementById("newIngredients").value;

  if (inputProduct === "") {
    alert("Escreva o nome de um produto!");
  } else if (isNaN(inputCode) || isNaN(inputPrice)) {
    alert("Código e valor precisam ser números!");
  } else {
    insertList(inputCode, inputProduct, inputPrice, inputIngredients);
    postItem(inputCode, inputProduct, inputPrice, inputIngredients);
    alert("Item adicionado!");
  }
};

/*
  --------------------------------------------------------------------------------------
  Função para inserir items na lista apresentada
  --------------------------------------------------------------------------------------
*/
const insertList = (code, nameProduct, price, ingredients) => {
  var table = document.getElementById("myTable");
  var row = table.insertRow();

  row.classList.add("product-row");

  var codeCell = row.insertCell(0);
  codeCell.textContent = code;

  var nameCell = row.insertCell(1);
  nameCell.textContent = nameProduct;

  var priceCell = row.insertCell(2);
  priceCell.textContent = price;

  var ingredientsRow = table.insertRow();
  ingredientsRow.classList.add("ingredients");

  var ingredientsCell = ingredientsRow.insertCell(0);
  ingredientsCell.colSpan = 3;

  var ingredientsString = "";
  for (var i = 0; i < ingredients.length; i++) {
    ingredientsString += ingredients[i];
    if (i < ingredients.length - 1) {
      ingredientsString += ", ";
    }
  }

  ingredientsCell.textContent = ingredientsString;

  insertButton(row.insertCell(-1));

  document.getElementById("newCode").value = "";
  document.getElementById("newProduct").value = "";
  document.getElementById("newPrice").value = "";
  document.getElementById("newIngredients").value = "";

  removeElement();
};

