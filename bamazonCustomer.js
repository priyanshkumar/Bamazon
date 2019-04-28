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
  allProducts();
});

function allProducts() {
  connection.query("select * from products", function(err, res) {
    if (err) throw err;
    console.table(res);
    productToOrder();
  });
}

function productToOrder() {
  inquirer
    .prompt([
      {
        name: "id",
        type: "number",
        message: "For what item_id you would like to place a order?"
      },
      {
        name: "quantity",
        type: "number",
        message: "How many units would you like to purchase?"
      }
    ])
    .then(function(prompt_res) {
      var stocked_quantity;
      connection.query(
        "select stock_quantity, price, product_sales from products where ?",
        {
          item_id: prompt_res.id
        },
        function(err, res) {
          if (err) throw err;
          stocked_quantity = res[0].stock_quantity;

          if (prompt_res.quantity > stocked_quantity) {
            if (stocked_quantity === 0) {
              console.log("Out of stock!");
            } else {
              console.log(`Only ${stocked_quantity} units available!`);
            }
          } else {
            connection.query(
              "update products set ? where ?",
              [
                {
                  stock_quantity: stocked_quantity - prompt_res.quantity,
                  product_sales:
                    res[0].product_sales + prompt_res.quantity * res[0].price
                },
                {
                  item_id: prompt_res.id
                }
              ],
              function(err) {
                if (err) throw err;
              }
            );
            console.log("Your order has been placed!");
          }
          connection.end();
        }
      );
    });
}
