contract counter {
    uint x;
	uint adds;
	string message;
	
    function counter() {
        x = 1;
		message = "counter";
    }
    
    function increment() {
        x++;
    }
	
    function add(uint v) {
        x += v;
		adds++;
    }
	
    function getValue() constant returns (uint) {
        return x;
    }
}

