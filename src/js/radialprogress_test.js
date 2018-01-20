/*
 Copyright (c) 2016, BrightPoint Consulting, Inc.

 MIT LICENSE:

 Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
 documentation files (the "Software"), to deal in the Software without restriction, including without limitation
 the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software,
 and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED
 TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
 CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 IN THE SOFTWARE.
 */

// @version 1.0.20

//**************************************************************************************************************
//
//  This is a test/example file that shows you one way you could use a vizuly object.
//  We have tried to make these examples easy enough to follow, while still using some more advanced
//  techniques.  Vizuly does not rely on any libraries other than D3.  These examples do use jQuery and
//  materialize.css to simplify the examples and provide a decent UI framework.
//
//**************************************************************************************************************


// html element that holds the chart
var viz_container;

// our radial components and an array to hold them
var viz1;

// our radial themes and an array to hold them
var theme1;

// our div elements we will put radials in
var div1;




//Once the document is ready we set javascript and page settings
$(document).ready(function () {



    //Keeps margins for examples not in iFrames.
    if (self == top) {
        d3.select("body").style("margin", "20px");
    }
    //Some house keeping for the display of test container for smaller screens
    else {
        d3.selectAll("li.logo").style("display","none");
        d3.selectAll("div.container").style("margin-top","-30px");
        d3.selectAll("i.mdi-navigation-menu").style("margin-top","-10px")
    }

    //Set display size based on window size.
    var rect = document.body.getBoundingClientRect();
    screenWidth = (rect.width < 960) ? Math.round(rect.width*.95) : Math.round((rect.width - 210) *.95)

    d3.select("#currentDisplay").attr("value", screenWidth + ",600").attr("selected", true).text(screenWidth + "px - 600px");


    viz_container = d3.selectAll("#viz_container")
        .style("width",screenWidth + "px")
        .style("height","600px");

    initialize();


});


function initialize() {

  var thepercent = 0;

  chrome.storage.sync.get("percent", function(data) {


      console.log(data.percent);




    //Here we use the three div tags from our HTML page to load the three components into.
    div1 = d3.select("#div1");


    //Here we create our three radial progress components by passing in a parent DOM element (our div tags)
    viz1 = vizuly.component.radial_progress(document.getElementById("div1"));



    //Here we create three vizuly themes for each radial progress component.
    //A theme manages the look and feel of the component output.  You can only have
    //one component active per theme, so we bind each theme to the corresponding component.
    theme1 = vizuly.theme.radial_progress(viz1).skin(vizuly.skin.RADIAL_PROGRESS_FIRE);


    //Like D3 and jQuery, vizuly uses a function chaining syntax to set component properties
    //Here we set some bases line properties for all three components.

        viz1.data(data.percent*100)                       // Current value
            .height(600)                    // Height of component - radius is calculated automatically for us
            .min(0)                         // min value
            .max(100)                       // max value
            .capRadius(1)                   // Sets the curvature of the ends of the arc.
            .on("tween",onTween)            // On the arc animation we create a callback to update the label
            .on("mouseover",onMouseOver)    // mouseover callback - all viz components issue these events
            .on("mouseout",onMouseOut)      // mouseout callback - all viz components issue these events
            .on("click",onClick);           // mouseout callback - all viz components issue these events


    //
    // Now we set some unique properties for all three components to demonstrate the different settings.
    //
    viz1
        .startAngle(250)                         // Angle where progress bar starts
        .endAngle(110)                           // Angle where the progress bar stops
        .arcThickness(.12)                        // The thickness of the arc (ratio of radius)
        .label(function (d,i) {                  // The 'label' property allows us to use a dynamic function for labeling.
            return d3.format(".0f")(d) + "%";
        });



    //We use this function to size the components based on the selected value from the RadiaLProgressTest.html page.
    changeSize(560,420);

  });


}

//Here we want to animate the label value by capturin the tween event
//that occurs when the component animates the value arcs.
function onTween(viz,i) {
    viz.selection().selectAll(".vz-radial_progress-label")
        .text(viz.label()(viz.data() * i));
}

function onMouseOver(viz,d,i) {
    //We can capture mouse over events and respond to them
}

function onMouseOut(viz,d,i) {
    //We can capture mouse out events and respond to them
}

function onClick(viz,d,i) {
    //We can capture click events and respond to them
}

//---------------------------------------------------------
//
//  The following functions are triggered by the user making changes in the settings panel which is declared in the
//  RadialProgressTest.html file.
//
//---------------------------------------------------------



//This is applies different end caps to each arc track by adjusting the 'capRadius' property
function changeEndCap(val) {

        vizs1.capRadius(Number(val)).update();

}

//This changes the size of the component by adjusting the radius and width/height;
function changeSize(val) {
    var s = String(val).split(",");
    viz_container.transition().duration(300).style('width', s[0] + 'px').style('height', s[1] + 'px');

    var divWidth = s[0] * 0.80 / 3;



        viz1.width(divWidth).height(divWidth).radius(divWidth/2.2).update();


}

//This sets the same value for each radial progress
function changeData(val) {

        viz1.data(Number(val)).update();

}
