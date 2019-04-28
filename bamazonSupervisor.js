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
  supervisorView();
});

function supervisorView() {
  inquirer
    .prompt([
      {
        name: "option",
        type: "list",
        message: "What would you like to do?",
        choices: [
          "View Product Sales by Department",
          "Create New Department",
          "Exit"
        ]
      }
    ])
    .then(function(prompt_res) {
      switch (prompt_res.option) {
        case "View Product Sales by Department": {
          productSales();
          break;
        }
        case "Create New Department": {
          department();
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

function productSales() {
  connection.query(
    "select d.department_id, d.department_name, d.over_head_costs, sum(p.product_sales),  (sum(p.product_sales)-d.over_head_costs) AS total_profit from departments d inner join products p on d.department_name = p.department_name",
    function(err, res) {
      if (err) throw err;
      console.table(res);
      supervisorView();
    }
  );
}

function department() {
  inquirer
    .prompt([
      {
        name: "name",
        type: "input",
        message: "Name of department?"
      },
      {
        name: "cost",
        type: "input",
        message: "over_head_cost?"
      }
    ])
    .then(function(prompt_res) {
      connection.query(
        "insert into departments set ?",
        {
          department_name: prompt_res.name,
          over_head_costs: prompt_res.cost
        },
        function(err) {
          if (err) throw err;
          console.log("\nEntry Added");
          console.log(
            "---------------------------------------------------------------------"
          );
          supervisorView();
        }
      );
    });
}
