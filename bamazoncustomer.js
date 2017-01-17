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

// make sure we're connected
connection.connect(function(err) {
	if (err) throw err;
	// console.log("Connected as id " + connection.threadId);
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
		purchase();
	}); // end connection query
}; // end displayProducts function

function purchase() {
	inquirer.prompt( [{
		// this prompt asks the user which item ID number they would like to buy
		name: "item",
		type: "input",
		message: "Which item would you like to buy? Please select by ID number."
	}, {
		// this prompt asks the user how many they would like to buy
		name: "quantity",
		type: "input",
		message: "How many would you like to purchase?"
	}]).then(function(answer) {
		console.log(JSON.stringify(answer, null, 2));
		var item = parseInt(answer.item);
		var quantity = parseInt(answer.quantity);
		checkQuantity(item, quantity);
	})

}; // end purchase function

function checkQuantity(item, quantity) {
	connection.query("SELECT stock_quantity FROM products WHERE ?", {product_name: product} function (err, res) {
		console.log(res);

function checkQuantity(item, quantity) {
	connection.query("SELECT stock_quantity FROM products WHERE ?", { product_name: product } function(err, res) {
		console.log(res);
	});
};


// connection (end);