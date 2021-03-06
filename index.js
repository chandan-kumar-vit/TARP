Web3=require('web3');
web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

abi=JSON.parse('[{"constant":false,"inputs":[{"name":"_candidateId","type":"uint256"}],"name":"vote","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"candidatesCount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"candidates","outputs":[{"name":"id","type":"uint256"},{"name":"name","type":"string"},{"name":"voteCount","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"voters","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"}]')

var votedOrNot=[]

VotingContract =web3.eth.contract(abi);
// In the nodejs console, execute contractInstance.address to get the address at which the contract is deployed and change the line below to use your deployed address
var contractInstance = VotingContract.at('0xd97e89ffd0a00aecff5bc87fda314b1143926013');
var candidates = {"BJP": 1, "Congress": 2, "AAP": 3}

var dateV = '30/05/2021'

function voteForCandidate() {
	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth()+1; //January is 0!
	var yyyy = today.getFullYear();
	if(dd<10) {
		dd = '0'+dd
	} 
	if(mm<10) {
		mm = '0'+mm
	} 
	today = dd + '/' + mm + '/' + yyyy;


	if(today.toString()==dateV){		
		document.getElementById('vote').disabled = true;
		alert("Voting has been disabled");		
	}else{
	
	
		var account = prompt("Please enter your registered number");
		$("#ID").html("Your Account ID: "+web3.eth.accounts[account]);
		$("#bal").html("Balance: "+web3.eth.getBalance(web3.eth.accounts[account])/Math.pow(10,18));
		var e = document.getElementById("candidate").value;
		var candidateName = e;	

		try{
			contractInstance.vote(candidates[candidateName], {from: web3.eth.accounts[account]}); 
		}catch(err){
			if(err.toString()=='Error: VM Exception while processing transaction: revert'){
				alert("You have already voted.\n" + err);
			}
		}finally{
			$("#bal").html("Balance: "+web3.eth.getBalance(web3.eth.accounts[account])/Math.pow(10,18));
		}
	}
}

function countForCandidate() {
	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth()+1; //January is 0!
	var yyyy = today.getFullYear();
	if(dd<10) {
		dd = '0'+dd
	} 
	if(mm<10) {
		mm = '0'+mm
	} 
	today = dd + '/' + mm + '/' + yyyy;


	if(today.toString()==dateV){
		document.getElementById('win1').disabled = false;
		document.getElementById('vote').disabled = true;
		for(var i=1;i<4;i++){
			$("#candidate-"+i).html(contractInstance.candidates(i)[2].toString());		
		}
	}else{
		alert("The results will be declared on 30/05/2021");
	}		
}

function winner(){
	var max = 0;
	var candidateW = '';
	for(var i=1;i<4;i++){
		var votes = contractInstance.candidates(i)[2].toString();		
		if(max<votes){
			candidateW = contractInstance.candidates(i)[1].toString();
			max = votes
		}
	}
	//alert(max + " "+ candidateW);
	$("#win").html("Winner is: " + candidateW);
}
