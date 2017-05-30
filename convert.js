//Usage: node convert {xmlfilename} {xslfilename} {outputtype}
var defaultPort = 9758;

var libxslt = require('libxslt'),
    fs = require('fs'),
    path = require('path'),
    http = require('http'),
    open = require('open'),
    libxmljs = libxslt.libxmljs;

var xmlFile = process.argv[2],
    xslFile = process.argv[3],
    outputFile = process.argv[4],
    xmlString, xslString;

var outputType = outputFile.split(".")[1].toUpperCase();

fs.readFile(__dirname+'/'+xmlFile, function (e,d){
    if (e) {
        throw e;
    }
    xmlString = d.toString();
    fs.readFile(__dirname+'/'+xslFile, function(e,s){
        xslString = s.toString();
        convert(xmlString, xslString);
    });
    
});

//console.log(xmlFile);
//console.log(xslFile);
//console.log(outputFile);

function convert(xml, xsl){
    //console.log(xsl);
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
            http.createServer(function(req, res) {
                res.writeHead(200,{"Content-Type": "text/html"});
                res.write(result, encoding='utf8');                
                res.end();                
            }).listen(defaultPort);
            open('http://localhost:'+defaultPort);
            console.log('Node server running on port ' + defaultPort);
            fs.writeFile(__dirname + "/output/" + outputFile, result, function(err){
                if (err) {
                    return console.log(err);
                }
            });
        }
        //console.log(result);
    });  
    });
}