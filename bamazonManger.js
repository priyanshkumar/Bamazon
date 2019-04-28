var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "Priyansh0518",
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
  managerView();
});

function managerView() {
  inquirer
    .prompt([
      {
        name: "option",
        type: "list",
        message: "What would you like to do?",
        choices: [
          "View Products for Sale",
          "View Low Inventory",
          "Add to Inventory",
          "Add New Product",
          "Exit"
        ]
      }
    ])
    .then(function(prompt_res) {
      switch (prompt_res.option) {
        case "View Products for Sale": {
          productForSale();
          break;
        }
        case "View Low Inventory": {
          lowInventory();
          break;
        }
        case "Add to Inventory": {
          addInventory();
          break;
        }
        case "Add New Product": {
          addNewProduct();
          break;
        }
        case "Exit": {
          connection.end();
          break;
        }
        default: {
          connection.end();
          break;
        }
      }
    });
}

function productForSale() {
  connection.query("select * from products", function(err, res) {
    if (err) throw err;
    console.table(res);
    console.log(
      "---------------------------------------------------------------------"
    );
    managerView();
  });
}

function lowInventory() {
  connection.query("select * from products where stock_quantity < 5", function(
    err,
    res
  ) {
    if (err) throw err;
    console.table(res);
    console.log(
      "---------------------------------------------------------------------"
    );
    managerView();
  });
}

function addInventory() {
  inquirer
    .prompt([
      {
        name: "id",
        type: "number",
        message: "Please enter item_id?"
      },
      {
        name: "quantity",
        type: "number",
        message: "Quantity to add in stock?"
      }
    ])
    .then(function(prompt_res) {
      connection.query(
        "update products set stock_quantity = stock_quantity + ? where ?",
        [
          prompt_res.quantity,
          {
            item_id: prompt_res.id
          }
        ],
        function(err) {
          if (err) {
            console.log("Id not Found.");
            console.log(err);
          }

          console.log("\nQuantity Added");
          console.log(
            "---------------------------------------------------------------------"
          );
          managerView();
        }
      );
    });
}

function addNewProduct() {
  inquirer
    .prompt([
      {
        name: "name",
        type: "input",
        message: "Name of product?"
      },
      {
        name: "department",
        type: "input",
        message: "Name of department?"
      },
      {
        name: "price",
        type: "input",
        message: "Price of product?"
      },
      {
        name: "quantity",
        type: "number",
        message: "Intial quantity of product?"
      }
    ])
    .then(function(prompt_res) {
      connection.query(
        "insert into products set ?",
        {
          product_name: prompt_res.name,
          department_name: prompt_res.department,
          price: prompt_res.price,
          stock_quantity: prompt_res.quantity
        },
        function(err) {
          if (err) throw err;
          console.log("\nEntry Added");
          console.log(
            "---------------------------------------------------------------------"
          );
          managerView();
        }
      );
    });
}
