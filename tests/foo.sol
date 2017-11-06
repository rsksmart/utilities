pragma solidity ^0.4.8;

contract Foo {
    bool public isWorking;
	int public aValue;

    function Foo() {
        isWorking = true;
		aValue = 42;
	}
    
    function setWorking(bool _isWorking) {
        isWorking = _isWorking;
    }
    
    function setValue(int _value) {
        aValue = _value;
    }
}