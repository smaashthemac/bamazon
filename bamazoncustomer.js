// require inquirer
var inquirer = require("inquirer");
// require mysql
var mysql = require("mysql");
// require cli-table2
var Table = require("cli-table2");

// connect to the bamazon database
var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: "root",
	password: "",
	database: "Bamazon"
});

// // make sure we're connected
// connection.connect(function(err) {
// 	if (err) throw err;
// 	console.log("Connected as id " + connection.threadId);
// });

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


	// the ids, names and prices, quantity left
// prettify tables
// ask user if they would like to buy an item
// ask user the id of the product they would like to buy
// ask user how many units of the product they would like to buy
// the application should check to see if the store has enough
	// if not, the app should log "insufficient quantity" 
	// prevent the order from going through
	// ask user if they would like to buy another idem
	// or change the quantity
// if there is enough of the product, fulfill customer's order
	// update the sql to reflect the remaining quantity
	// show the user the total cost of their purchase
// does that complete your order?

// ============== FUNCTIONS ============== //

function displayProducts(table) {
	connection.query("SELECT * FROM products" + table, function(err, res) {
		// instantiate the table
		var table = new Table({
		    head: ['Item ID', 'Product', 'Price', 'Remaining Quantity']
		  , colWidths: [10, 20, 10, 10]
		});
		//if (err) throw err;
		for(i=0;i<res.length;i++){
			console.log(res[i].item_id, res[i].product_name, res[i].price, res[i].stock_quantity);
			// table.push(
			//     [res[i].item_id, res[i].product_name, res[i].price, res[i].stock_quantity]
		}
		console.log(table.toString());
	});
};


 // var displayProducts = function() {
 // 	connection.query("SELECT * FROM products", function(err, res) {
 // 		console.log(res);
 // 		inquirer.prompt({
 // 			name: "choice",
 // 			type: "rawlist",
 // 			choices: function(value) {
 // 				var choiceArray = [];
 // 				for (var i = 0; i < res.length; i++) {
 // 					choiceArray.push(res[i].item_number, res[i].product_name, res[i].price);
 // 				}; // end for loop
 // 				return choiceArray;
 // 			} // end choices function
 // 			message: "What item would you like to purchase?"
 // 			}).then(function(answer) {
 // 				for (var i = 0; i < res.length; i++) {
 // 					if (res[i].item_number === answer.choice) {
 // 						console.log()
 // 						}; // end inquirer
 // 					}; // end if statement
 // 				}; // end for loop
 // 			}); // end then function
 // 		}); //end inquirer prompt
 // 	}; // end connection query
 // }; // end function

// connection (end);