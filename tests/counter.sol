contract counter {
    uint x;
	
    function counter() {
        x = 1;
    }
    
    function increment() {
        x++;
    }
	
    function add(uint v) {
        x += v;
    }
	
    function getValue() constant returns (uint) {
        return x;
    }
}

