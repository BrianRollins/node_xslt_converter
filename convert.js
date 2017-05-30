//Usage: node convert {xmlfilename} {xslfilename} {outputtype}
var defaultPort = 9758; //It's XSLT on your phone dial pad.

var libxslt = require('libxslt'),
    fs = require('fs'),
    path = require('path'),
    http = require('http'),
    open = require('open'),
    libxmljs = libxslt.libxmljs;

//Collect the arguments passed in on the command line.
var xmlFile = process.argv[2],
    xslFile = process.argv[3],
    outputFile = process.argv[4],
    xmlString, xslString;

//Grab the output type from the file extension.
var outputType = outputFile.split(".")[1].toUpperCase();

//Load the XML file.
fs.readFile(__dirname+'/'+xmlFile, function (e,d){
    if (e) {
        throw e;
    }    
    console.log('[XML]: ' + xmlFile + '  loaded...');
    xmlString = d.toString();

    //Load the XSL file.
    fs.readFile(__dirname+'/'+xslFile, function(e,s){
        if (e) {
          throw e;
        }   
        console.log('[XSL]: ' + xslFile + '  loaded...');
        xslString = s.toString();
        convert(xmlString, xslString);
    });
    
});

function convert(xml, xsl){
    libxslt.parse(xsl, function(err, stylesheet){
        if(err){
            throw err;
        }
    var params = {
        //MyParam: 'my value'
    };
    
    // 'params' parameter is optional 
    stylesheet.apply(xml, params, function(err, result){
        // err contains any error from parsing the document or applying the stylesheet 
        // result is a string containing the result of the transformation 
        if(err){
            throw err;
        }
        if(outputType === 'html' || outputType === 'htm' || typeof(outputType==='undefined')) {
            //Fire up a web server so they can see their newly-minted HTML file.
            http.createServer(function(req, res) {
                res.writeHead(200,{"Content-Type": "text/html"});
                res.write(result, encoding='utf8');                
                res.end();                
            }).listen(defaultPort);
            open('http://localhost:'+defaultPort); //Open a browser window so the user can see their converted file.
            
            fs.writeFile(__dirname + "/output/" + outputFile, result, function(err){
                if (err) {
                    return console.log(err);
                }
                console.log('[Output]: ' + outputFile + ' written to output directory.');
                console.log('Node server running on port ' + defaultPort);
                console.log('Ctrl/Cmd+C to end.');
            });
        }
    });  
    });
}