
$.getScript('https://www.gstatic.com/firebasejs/4.12.0/firebase.js', function()
{
	var config = {
	    apiKey: "AIzaSyDhBTGXvd3ndnj11_5AN4oX1qRZ1B7mF7g",
	    authDomain: "earthwormops.firebaseapp.com",
	    databaseURL: "https://earthwormops.firebaseio.com",
	    projectId: "earthwormops",
	    storageBucket: "",
	    messagingSenderId: "672125901519"
	  };
	firebase.initializeApp(config);
});


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
	firebase.database().ref('/farmersList/' + 1).once('value').then(function(snapshot) {
	var fDetails = snapshot.val();
	$('#fName').text('Farmer Name: ' + fDetails.farmerName);
	$('#lSize').text('Land Size: ' + fDetails.size +' Acres');
	$('#status').text('status: ' + fDetails.status);
	//document.getElementById("fName").innerHTML = ;  
	// document.getElementById("lSize").innerHTML = 'Land Size' + fDetails.size +'Acres';  
	// document.getElementById("status").innerHTML = 'Status' + fDetails.status;  
	});
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
	firebase.database().ref('/farmersList/' + 1).update({status: 'Enrolled'});
	$('#myModal').modal('hide');
}
function inProgressClick() {
	_element.style('fill', 'yellow');
	firebase.database().ref('/farmersList/' + 1).update({status: 'In progress'});
	$('#myModal').modal('hide');
}

function completedClick() {
	_element.style('fill', 'green');
	firebase.database().ref('/farmersList/' + 1).update({status: 'Completed'});
	$('#myModal').modal('hide');
}

// $(document).ready(function() {
//  // $("#aPath").click(function(e){
//  // 	element =  getPathElement(e);
//  //      // document.getElementById("modalContent").innerHTML = "Farmer Name : Nareddy Praveen";  
//  //   }); 
// }); 
function dashboard(id, fData){
    var barColor = 'steelblue';
    function segColor(c){ return {Inprogress:"#807dba", completed:"#e08214"}[c]; }
    
    // compute total for each state.
    var total = 0;
    fData.forEach(function(d){
        var size = d.size;
        total+=d.size;
    });
        
    // function to handle pieChart.
    function pieChart(pD){
        var pC ={},    pieDim ={w:250, h: 250};
        pieDim.r = Math.min(pieDim.w, pieDim.h) / 2;
                
        // create svg for pie chart.
        var piesvg = d3.select(id).append("svg")
            .attr("width", pieDim.w).attr("height", pieDim.h).append("g")
            .attr("transform", "translate("+pieDim.w/2+","+pieDim.h/2+")");
        
        // create function to draw the arcs of the pie slices.
        var arc = d3.arc().outerRadius(pieDim.r - 10).innerRadius(0);

        // create a function to compute the pie slice angles.
        var pie = d3.pie().sort(null).value(function(d) { return d.size; });

        // Draw the pie slices.
        piesvg.selectAll("path").data(pie(pD)).enter().append("path").attr("d", arc)
            .each(function(d) { this._current = d; })
            .style("fill", function(d) { return segColor(d.data.type); });
        // Animating the pie-slice requiring a custom function which specifies
        // how the intermediate paths should be drawn.
        function arcTween(a) {
            var i = d3.interpolate(this._current, a);
            this._current = i(0);
            return function(t) { return arc(i(t));    };
        }    
        return pC;
    }
    
    // function to handle legend.
    function legend(lD){
        var leg = {};
            
        // create table for legend.
        var legend = d3.select(id).append("table").attr('class','legend');
        
        // create one row per segment.
        var tr = legend.append("tbody").selectAll("tr").data(lD).enter().append("tr");
            
        // create the first column for each segment.
        tr.append("td").append("svg").attr("width", '16').attr("height", '16').append("rect")
            .attr("width", '16').attr("height", '16')
			.attr("fill",function(d){ return segColor(d.type); });
            
        // create the second column for each segment.
        tr.append("td").text(function(d){ return d.type;});

        // create the third column for each segment.
        tr.append("td").attr("class",'legendFreq')
            .text(function(d){ return d3.format(",")(d.size);});

        // create the fourth column for each segment.
        tr.append("td").attr("class",'legendPerc')
            .text(function(d){ return getLegend(d,lD);});

        // Utility function to be used to update the legend.
        leg.update = function(nD){
            // update the data attached to the row elements.
            var l = legend.select("tbody").selectAll("tr").data(nD);

            // update the frequencies.
            l.select(".legendFreq").text(function(d){ return d3.format(",")(d.size);});

            // update the percentage column.
            l.select(".legendPerc").text(function(d){ return getLegend(d,nD);});        
        }
        
        function getLegend(d,aD){ // Utility function to compute percentage.
            return d3.format("%")(d.size/(iTotal+cTotal));
        }

        return leg;
    }
    
    // calculate total frequency by segment for all state.
    var eTotal = 0;
    var iTotal = 0;
    var cTotal = 0;

    fData.forEach(function(f) {
        if(f.status == 'Inprogress') {
            iTotal+=f.size;
        }
        else if(f.status == 'completed') {
            cTotal+=f.size;
        }

    });
    
    // calculate total frequency by state for all segment.
    var tF = [
    {type: 'Inprogress', size: iTotal},
    {type: 'completed', size: cTotal }
    ];

    var pC = pieChart(tF), // create the pie-chart.
        leg= legend(tF);  // create the legend.
}
var freqData=[
    {farmer: 'Raj', size:12 ,status:'Inprogress'},
    {farmer: 'Naveen', size:12 ,status:'completed'},
    {farmer: 'Praveen', size:12 ,status:'Inprogress'}
];

function addDetailsRow() {
    $('#myTable tr:last').after('<tr>...</tr><tr>...</tr>');
}