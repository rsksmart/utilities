contract counter {
    uint x;
	
    function counter() {
        x = 1;
    }
    
    function increment() {
        x++;
    }
	
    function getValue() constant returns (uint) {
        return x;
    }
}

