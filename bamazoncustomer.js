// Initializes the npm packages used
var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table2");

// Initializes the connection variable to sync with a MySQL database
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "",
  database: "Bamazon"
});

// Creates the connection with the server and makes the table upon successful connection
connection.connect(function(err) {
  if (err) {
    console.error("error connecting: " + err.stack);
  }
});

// greet user, ask for username, display products
var welcome = function() {
	inquirer.prompt({
		type: "list",
		message: "Welcome to the bazaar, Link! Would you like to view the products for sale?",
		choices: ["YES", "NO"],
		name: "view"
	}).then(function(answer) {
		if (answer.view === "YES") {
			displayProducts();
		} else {
			console.log("\n---------------------");
			console.log("Come back again soon!");
			console.log("---------------------\n");
		}
	});
};

welcome();

// Function to grab the products table from the database and print results to the console
function displayProducts() {
	connection.query("SELECT * FROM products", function (err, res) {
		// instantiate the table
		var table = new Table({
			head: ["Item ID", "Product", "Department", "Price", "Remaining Quantity"],
			colWidths: [10, 20, 20, 10, 20]
		});
		for (var i = 0; i < res.length; i++) {
			// console.log(res[i].item_id, res[i].product_name, res[i].price, res[i].stock_quantity);
			table.push(
				[res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]);
		}; // end for loop
		console.log(table.toString());
		promptCustomer(res);
	}); // end connection query
}; // end displayProducts function

// Function containing all customer prompts
var promptCustomer = function(res) {

  // Prompts user for what they would like to purchase
  inquirer.prompt([{
    type: "input",
    name: "choice",
    message: "What would you like to purchase? [Enter product name; Quit with Q]"
  }]).then(function(val) {

    // Set the var correct to false so as to make sure the user inputs a valid product name
    var correct = false;

    // Loops through the MySQL table to check that the product they wanted exists
    for (var i = 0; i < res.length; i++) {

      // If the product exists, save the data for said product within the product and id variables
      if (res[i].product_name === val.choice) {
        var correct = true;
        var product = val.choice;
        var id = i;

        // Prompts the user to see how many of the product they would like to buy
        inquirer.prompt([{
          type: "input",
          name: "quant",
          message: "How many would you like to buy?"
        }]).then(function(val) {

          // Checks to see if the amount requested is less than the amount that is available
          if ((res[id].stock_quantity - val.quant) > 0) {

            // Removes the amount requested from the MySQL table
            connection.query(
              "UPDATE products SET stock_quantity='" + (res[id].stock_quantity - val.quant) +
              "' WHERE product_name='" + product + "'",
              function(err, res2) {
                if (err) {
                  throw err;
                }

                // Tells the user that the product has been purchased
                console.log("PRODUCT BOUGHT!");

                // Rewrites the table and starts again
                displayProducts();
              });
          }

          // If the amount requested was greater than the amount available, restarts prompts
          else {
            console.log("NOT A VALID SELECTION!");
            promptCustomer(res);
          }
        });
      }
      // If the user inputed Q, exist program
      if (val.choice === "Q" || val.choice === "q") {
        process.exit();
      }
    }

    // If the product requested does not exist, restarts prompts
    if (i === res.length && correct === false) {
      console.log("NOT A VALID SELECTION");
      promptCustomer(res);
    }
  });
};
