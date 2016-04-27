/**
 * Created by Christopher on 4/26/2016.
 */
$(function () {
    d3.csv('data/HERC-DATA-2015.csv', function(error, allData) {
        if(error) throw error;
        var xScale;
        var yScale;
        var chosenData;

        var choice = "Jobs_Posted";

        var margin = {
            top: 50,
            bottom: 100,
            left: 70,
            right: 50
        };

        var height = 600 - margin.bottom - margin.top;
        var width = 1000 - margin.left - margin.right;

        //creates svg that parts will be added to.
        var svg = d3.select("#myDiv")
            .append('svg')
            .attr('height', 600)
            .attr('width', 1000);

        //main element where the rects will be placed
        var g = svg.append('g')
            .attr('transform', 'translate(' +  margin.left + ',' + margin.top + ')')
            .attr('height', height)
            .attr('width', width);

        var xAxisLabel = svg.append('g')
            .attr('transform', 'translate(' + margin.left + ',' + (height + margin.top) + ')')
            .attr('class', 'axis');

        var yAxisLabel = svg.append('g')
            .attr('class', 'axis')
            .attr('transform', 'translate(' + margin.left + ',' + (margin.top) + ')');

        var xAxisText = svg.append('text')
            .attr('transform', 'translate(' + (margin.left + width/2) + ',' + (height + margin.top + 40) + ')')
            .attr('class', 'title');

        var yAxisText = svg.append('text')
            .attr('transform', 'translate(' + (margin.left - 40) + ',' + (margin.top + height/2) + ') rotate(-90)')
            .attr('class', 'title');

        //This sets the xscale as an ordinal one and the yScale as a linear one based on the data set
        var setScales = function(data) {
            var schools = data.map(function(d) {return d.Name});

            xScale  = d3.scale.ordinal().rangeBands([0, width], .2).domain(schools);
            var yMin =d3.min(data, function(d){
                return +d.Data});
            var yMax = d3.max(data, function (d) {
                return +d.Data
            });

            yScale = d3.scale.linear().range([height, 0]).domain([0, yMax]);
        }

        //creates the axises and the labels that are associated with them
        var setAxes = function() {

            var xAxis = d3.svg.axis()
                .scale(xScale)
                .orient('bottom');

            var yAxis = d3.svg.axis()
                .scale(yScale)
                .orient('left')
                .tickFormat(d3.format('.2s'));

            xAxisLabel.transition().duration(1500).call(xAxis);

            yAxisLabel.transition().duration(1500).call(yAxis);

            xAxisText.text('School')
            yAxisText.text('Number of ' + choice)
        }

        //this filters the data based on which button is selected
        //it will only return data values that relate to things such as
        //Posted_Jobs, Total_Views and Apply_Clicks
        var filterData = function() {
            chosenData = allData.filter(function(d) {
                return d.type == choice;
            }).sort(function(a,b){
                    if(a.School_Name < b.School_Name) return -1;
                    if(a.School_Name > b.School_Name) return 1;
                    return 0;
                });
        }

        //This function contains all the necessary functions that will create the new graphic in the svg
        var draw = function(data) {
            setScales(data);
            setAxes();

            var bars = g.selectAll('rect').data(data)

            //creates each of the bars based on the data pased and the scales set
            bars.enter().append('rect')
                .attr('x', function(d, i){return xScale(d.Name)})
                .attr('y', height)
                .attr('height', 0)
                .attr('width', xScale.rangeBand())
                .attr('class', 'bar')
                .attr('title', function(d) {return d.School_Name});

            //removes any elements no longer supported by the data
            bars.exit().remove();

            //Adds a cool transition to the bar height changes and the axis changes
            //makes people go "ooh" and "ahh"
            bars.transition()
                .duration(1500)
                .delay(function(d,i){return i*50})
                .attr('x', function(d){return xScale(d.Name)})
                .attr('y', function(d){return yScale(d.Data)})
                .attr('height', function(d) {return height - yScale(d.Data)})
                .attr('width', xScale.rangeBand())
                .attr('title', function(d) {return d.School_Name});
        };

        //Looks for any of the button input changes and determines which data will be used in the
        //new draw functions
        $("input").on('change', function() {
            // Get value, determine if it is the sex or type controller
            var val = $(this).val();
            choice = val;
        });

        filterData();
        draw(chosenData);


    })
})