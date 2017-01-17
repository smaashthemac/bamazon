var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table2");

var connection = mysql.createConnection({
	host: 'localhost',
	port: '3306',
	user: 'root',
	password: '',
	database: 'Bamazon'
});

connection.connect(function(err) {
	if (err) throw err;
	//console.log('connected as id ' + connection.threadId);
});
var products = [];

var displayProducts = function() {
	connection.query("SELECT * FROM products", function (err, result) {

		// console.log(result);
		// console.log(result[0].product_name);
		var table = new Table({
			head: ['ID', 'Product Name', 'Department', "Price", "Quantity in stock" ]
			, colWidths: [10, 20, 20, 10, 10]
		});

		for (var i = 0; i < result.length; i++) {
			table.push([result[i].item_id, result[i].product_name, result[i].department_name, result[i].price, result[i].stock_quantity]);
			products.push(result[i].product_name);
		};

		console.log(table.toString());
		//console.log(products);
	}); // end of connection call
}; // end of function


var totalCost = function(product, quantity) {
	connection.query("SELECT * FROM products WHERE ?", {product_name: product}, function(error, result) {
		var price = result[0].price;
		var updatedQuantity = result[0].stock_quantity - quantity;
		console.log("Alright! Your total will be " + (price * quantity) + " dollars! Thank you!");
		updateProducts(product, updatedQuantity);
	});//end of connection

	inquirer.prompt({
		name: "again",
		type: "input",
		message: "Would you like to purchase anything else? (y/n)",
		validate: function(value) {
			if (value === 'y' || value === 'yes' || value === 'n' || value === 'n') {
				return true;
			}
			return false;
		}
	}).then(function(answer) {
		if (answer.again === "y" || answer.again === 'yes') {
			runCustomer();
		} else {
			console.log("Thank you! Please come again!");
			connection.end();
		}
	});
}// end of function

var updateProducts = function(product, updatedQuantity) {
		connection.query("UPDATE products SET ? WHERE ?", [{
		stock_quantity: updatedQuantity
		}, {
		product_name: product
	}], function(err, res) {
		if (err) throw err;
	});

	displayProducts();
};//end of function

var runCheck = function(product, quantity) {
	connection.query("SELECT stock_quantity FROM products WHERE ?", {product_name: product}, function (error, result) {
		var availableQuantity = result[0].stock_quantity;
		if (quantity > availableQuantity ) {
			console.log("Insufficient quantity!");
		} else {
			//console.log("Code, why are you tricking me?");
			totalCost(product, quantity);
		}
	});
};

var runCustomer = function() {
	displayProducts();
	 inquirer.prompt([
	{
		name: "product",
		type: "input",
		message: "Which product would you like to purchase?",
		validate: function(value) {
			if (isNaN(value) === true && products.indexOf(value) !== -1) {
			return true;
			}
			return false;
		}
	}, {
		name: "quantity",
		type: "input",
		message: "How many would you like to purchase?"
	}]).then(function(answers) {
		runCheck(answers.product, answers.quantity);
	}); // end of inquirer prompt
};// end of function

runCustomer();

//module.exports = Customer;