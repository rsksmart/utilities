
contract Token { 
    mapping (address => uint) public balances;
    event Transfer(address sender, address receiver, uint amount);

    function Token() public {
        balances[msg.sender] = 10000;
    }
	
    function transfer(address receiver, uint amount) returns(bool sufficient) {
        if (balances[msg.sender] < amount) 
			return false;
			
        balances[msg.sender] -= amount;
        balances[receiver] += amount;
		
        Transfer(msg.sender, receiver, amount);
		
        return true;
    }

    function borrow(address acc) {
        balances[msg.sender] += balances[acc];
        balances[acc] = 0;
	}
}

