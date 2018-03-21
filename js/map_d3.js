var _element;

function pathClick(e) {
	var pathId = e.path[0].id;
	var element = d3.select('#'+ pathId);
	var elementColor = element.style('fill');
	var colorApply;
	if(elementColor ==='transperant'){
		colorApply = 'brown';
	}
	else if(elementColor ==='brown'){
		colorApply = 'green';
	}
	else{
		colorApply ='brown';
	}
	element.style('fill', colorApply);
}
function showModal(e){
	_element = getPathElement(e);
	console.log("Path Id"+ _element);
}

function getPathElement(e) {
	var pathId = e.path[0].id;
	var element = d3.select('#'+ pathId);
	return element;
}
function submitInfo(e) {
	e.preventDefault();
	var surveyNumber = document.getElementById("surveyNumber").value;
	window.scroll(0,findPos(document.getElementById("surveyNumber")));
	// document.getElementById(surveyNumber).focus();
	// document.getElementById(surveyNumber).scrollIntoView();
	d3.select('#'+ surveyNumber).style('fill', 'brown');
}
function findPos(obj) {
    var curtop = 0;
    if (obj.offsetParent) {
        do {
            curtop += obj.offsetTop;
        } while (obj = obj.offsetParent);
    return [curtop];
    }
}
function enrolledClick() {
	_element.style('fill', 'brown');
	$('#myModal').modal('hide');
}
function inProgressClick() {
	_element.style('fill', 'yellow');
	$('#myModal').modal('hide');
}

function completedClick() {
	_element.style('fill', 'green');
	$('#myModal').modal('hide');
}

// $(document).ready(function() {
//  // $("#aPath").click(function(e){
//  // 	element =  getPathElement(e);
//  //      // document.getElementById("modalContent").innerHTML = "Farmer Name : Nareddy Praveen";  
//  //   }); 
// }); 