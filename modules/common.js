var http = require('http');
var m = require("mustache");
var fs = require("fs");
var path = require("path");


exports.inArray =function(arrValues, obj) {
    arrValues.sort();

    var returnObj = binarySearch(arrValues, obj);
    if(returnObj!=null){
        return true;
    }else{
        return false;
    }
}
// binary search..
//http://jasonwyatt.tumblr.com/post/33760740791/algorithms-in-javascript-binary-search
function binarySearch( sortedValues, target ){
    // summary:
    //    Performs a binary search on an array of sorted
    //    values for a specified target.
    // sortedValues: Array
    //    Array of values to search within.
    // target: String|Number
    //    Item to search for, within the sortedValues array.
    // returns:
    //    Number or null. The location of the target within
    //    the sortedValues array, if found. Otherwise returns
    //    null.

    // define the recursive function.
    function search( low, high ) {
        // If the low index is greater than the high index,
        //  return null for not-found.
        if ( low > high ) {
            return null;
        }

        // If the value at the low index is our target, return
        //  the low index.
        if ( sortedValues[low] === target ){
            return low;
        }

        // If the value at the high index is our target, return
        //  the high index.
        if ( sortedValues[high] === target ){
            return high;
        }

        // Find the middle index and median element.
        var middle = Math.floor( ( low + high ) / 2 );
        var middleElement = sortedValues[middle];

        // Recursive calls, depending on whether or not the
        //  middleElement is less-than or greater-than the
        //  target.
        // Note: We can use high-1 and low+1 because we've
        //  already checked for equality at the high and low
        //  indexes above.
        if ( middleElement > target ) {
            return search(low+1, middle);
        } else if ( middleElement < target ) {
            return search(middle, high-1);
        }

        // If middleElement === target, we can return that value.
        return middle;
    }

    // Start our search between the first and last elements of
    //  the array.
    return search(0, sortedValues.length-1);
}


var pages = {};
exports.renderPage = function(httpRes, pageName, data) {
    if(! pages[pageName]) {
        // load page from views directory
        var inputFilePath = path.join("views", pageName + ".html");
        pages[pageName] = fs.readFileSync(inputFilePath, "utf8");
    }
    var html = m.render(pages[pageName], data);
    httpRes.writeHead(200, {'Content-Type': 'text/html'});
    httpRes.end(html);
};
