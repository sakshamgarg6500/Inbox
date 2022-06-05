const assert = require("assert");
//assert is a standard library that is built into node.js runtime
//assertion refers to when we have two values: one is produced by our code and the second is the expected value

const ganache = require("ganache-cli");
const { isTypedArray } = require("util/types");
//our local ethereum test network

const Web3 = require("web3");
//Web3 is a constructor
//it is used to create instances of the web3 library
//constructor function is always capitalised

const web3 = new Web3(ganache.provider());
//provider acts a mode of communication between web3 and our ethereum network
//providers are interchangable
//suppose if we want to connect to rinkeby test network, we will use another provider

const { interface, bytecode } = require("../compile");
//importing the ABI and bytecode from compile file

//MOCHA FUNCTIONS
//1. it : run a test and make an assertion
//2. describe : group together 'it' functions
//3. beforeEach : execute some general setup code

/* class Car {
	park() {
		return "stopped";
	}

	drive() {
		return "vroom";
	}
}

let car;

beforeEach(() => {
	car = new Car();
});
//this beforeEach function runs before every 'it' statement

describe("Car Class", () => {
	it("can park", () => {
		assert.equal(car.park(), "stopped");
	});

	it("can drive", () => {
		assert.equal(car.drive(), "vroom");
	});
}); */

let accounts;
let inbox;
const INITIAL_STRING = "Hi There";

beforeEach(async () => {
	//ganache provides us some unlocked accounts to send and receive ether
	//get a list of all the accounts
	accounts = await web3.eth.getAccounts();

	//use one of the accounts to deploy the contract
	inbox = await new web3.eth.Contract(JSON.parse(interface))
		.deploy({ data: bytecode, arguments: [INITIAL_STRING] })
		.send({ from: accounts[0], gas: "1000000" });
	//1. we first need access to the bytecode produced by our compile file
	//2. 'C' is capitalised as it is a contructor function and we are creating an instance of a contract
	//3. (.deploy) we then pass the bytecode of our contract along with the arguments that are required by the constructor function of our  Inbox contract (string in this case)
	//4. (.send) specify the account from which we want to deploy our contract and also specify the gas that can be used to deploy the contract
});

describe("Inbox", () => {
	it("If contract successfully deployed", () => {
		// console.log(inbox);

		assert.ok(inbox.options.address);
		//to check if the value of address exists
		//this is the address of the deployed contract
	});

	it("If the contract has a default message", async () => {
		const message = await inbox.methods.message().call();
		assert.equal(INITIAL_STRING, message);
	});

	it("If it can change the message", async () => {
		await inbox.methods.setMessage("Bye").send({ from: accounts[0] });
		//send refers to a transaction
		//from refers to the account who will pay for this transaction
		const message = await inbox.methods.message().call();
		assert.equal(message, "Bye");
	});
});
