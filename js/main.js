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

        var svg = d3.select("#myDiv")
            .append('svg')
            .attr('height', 600)
            .attr('width', 1000);

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

        var filterData = function() {
            chosenData = allData.filter(function(d) {
                return d.type == choice;
            }).sort(function(a,b){
                    if(a.School_Name < b.School_Name) return -1;
                    if(a.School_Name > b.School_Name) return 1;
                    return 0;
                });
        }

        var draw = function(data) {
            setScales(data);
            setAxes();

            var bars = g.selectAll('rect').data(data)

            bars.enter().append('rect')
                .attr('x', function(d, i){return xScale(d.Name)})
                .attr('y', height)
                .attr('height', 0)
                .attr('width', xScale.rangeBand())
                .attr('class', 'bar')
                .attr('title', function(d) {return d.School_Name});

            bars.exit().remove();

            bars.transition()
                .duration(1500)
                .delay(function(d,i){return i*50})
                .attr('x', function(d){return xScale(d.Name)})
                .attr('y', function(d){return yScale(d.Data)})
                .attr('height', function(d) {return height - yScale(d.Data)})
                .attr('width', xScale.rangeBand())
                .attr('title', function(d) {return d.School_Name});
        };


        $("input").on('change', function() {
            // Get value, determine if it is the sex or type controller
            var val = $(this).val();
            choice = val;
            var isPercent = $(this).hasClass('percent')
            if(isPercent) {
                filterData();
                draw2(chosenData);
            }else {
                filterData();
                draw(chosenData);
            }

        });

        filterData();
        draw(chosenData);

        /* Using jQuery, select all circles and apply a tooltip
         If you want to use bootstrap, here's a hint:
         http://stackoverflow.com/questions/14697232/how-do-i-show-a-bootstrap-tooltip-with-an-svg-object
         */
        $("rect").tooltip({
            'container': 'body',
            'placement': 'top'
        });
    })
})