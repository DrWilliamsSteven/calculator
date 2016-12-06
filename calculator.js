$(document).ready(function() {

	var tempstr = [];
	var tempstrToEval = [];
	var result = [];

	var basicLastType = "";
	var advLastType = "";

	// on button click, join number or operand to string, render to screen top
	var render_input = function() {
		var html = "<p>" + tempstr.join("") + "</p>"; //
		$("#screen-top").html(html);
	};

	// render the result to screen bottom
	var render_result = function() {
		var resulthtml = "<h3>" + result + "</h3>";
		$("#screen-bottom").html(resulthtml);
	};

	// clear all values
	var clear = function() {
		result = [];
		tempstr = [];
		tempstrToEval = [];
		advLastType = "";
		render_input();
		render_result();
	};

	// check if the last operand was an advanced function
	var check_adv_operand = function() { //could realy just be check for 'power'
		if (advLastType !== "") {
			switch (advLastType) {
				case "power":
					tempstr.push('</span>');					
					break;
				default:
					break;
			}
			advLastType = "";
		}
	};

	// raise a number to power x
	var js_power = function() {
		check_adv_operand();
		tempstr.push('<span class="sup">');
		var testStrToEval = tempstrToEval.join("");
		var index2 = testStrToEval.lastIndexOf(basicLastType);
		tempstrToEval.splice(index2 +1, 0, 'Math.pow(');
		tempstrToEval.push(',', ')');
		advLastType = 'power';
	};

	// calculate a percentage // not currently finished
	var js_percent = function() {
		check_adv_operand();
		tempstr.push('&#37;');
		//tempstrToEval.push(''); // need to still add this in
					
		// if operand is multiply or divide, then multiply by fraction eg 50% = x0.5
		switch(basicLastType){
			case '*':
			case '/':
				tempstrToEval.push('/100');
				break;
				
		// if operand is add/subtract, multiply by fraction eg 50% = x0.5, then add/subtract tempresult
			case '+':
			case '-':
				console.log('tempstrToEval: '+ tempstrToEval);
				
				var tempresult = tempstrToEval;
				console.log('tempstrToEval: '+ tempstrToEval);
				var tempstrToSplice = tempstrToEval;
				console.log('tempstrToSplice: '+ tempstrToSplice);
				// do calculation of what the percentage is of current value in equation
				var index = tempresult.lastIndexOf(basicLastType);
				var tempstrToEval2 = tempstrToSplice.splice(0, index+1);
				
				tempresult.splice(index, 1, "*");
				tempresult.push('/100');		
				var tempresult2 = eval(tempresult.join(""));
				console.log('tempresult: ' +tempresult);
				console.log('tempresult2: ' +tempresult2);
				//remove percentage value from tempstrToEval
				console.log('tempstrToSplice: '+ tempstrToSplice);
				
				console.log('tempstrToEval2: '+ tempstrToEval2);
				// push new calculated value to tempstrToEval
				tempstrToEval2.push(tempresult2);
				console.log('tempstrToEval2: '  +tempstrToEval2);
				
				tempstrToEval = tempstrToEval2;
				
							
				
				break;
				    }		
		
		console.log('tempstrToEval: '+ tempstrToEval);
		console.log('tempstr: ' +tempstr);
		advLastType = 'percent';
	};

	// calculate the square root
	var js_sqrt = function() {
		tempstr.push('&#8730;');
		if (Number.isInteger(parseInt(tempstrToEval[tempstrToEval.length - 1]))) {
			tempstrToEval.push('*', 'Math.sqrt(', ')');
		} else {
			tempstrToEval.push('Math.sqrt(', ')');
		}
		advLastType = 'sqrt';
	};

	// add a negative symbol to front of number, not yet able to remove it..
	var js_plusminus = function() {
		var testStr = tempstr.join("");
		var index = testStr.lastIndexOf(basicLastType);
		tempstr.splice(index + 1, 0, "-");
		tempstrToEval.splice(index + 1, 0, "-");
		advLastType = 'plusminus';
	};

	// evaluate the entered equation
	var equals = function() {
		check_adv_operand();
		result = eval(tempstrToEval.join(""));
		render_result();
	};

	// on button click run this:
	$('button').click(function() {

		if (this.id === 'clear') {	//if clear, empty string, clear screen top/bottom
			clear();
		} else if (this.id === 'equals') { // if equals , eval string, add to screen bottom
			equals();
		} else {
			
			if (result.length !== 0) {	clear(); } // if a result is already displayed then clear
			if ($(this).hasClass('number')) {
				tempstr.push(this.innerHTML);
				if (advLastType === "") {
					tempstrToEval.push(this.innerHTML);
				} else {
					tempstrToEval.splice(tempstrToEval.length - 1, 0, this.innerHTML);
				}
			}

			if ($(this).hasClass('basic_operand')) {
				check_adv_operand();
				tempstr.push(this.innerHTML);
				tempstrToEval.push(this.innerHTML);
				basicLastType = this.innerHTML;
			}

			if ($(this).hasClass('adv_operand')) {
				switch (this.id) {
					case "power":
						js_power();
						break;
					case "sqrt":
						js_sqrt();
						break;
					case "percent":
						js_percent();
						break;
					case "plusminus":
						js_plusminus();
						break;
				}
			}
		}
		render_input();

	});

});
