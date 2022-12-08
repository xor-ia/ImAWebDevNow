var http = require('http');
var fs = require('fs');
var path = require('path');
var mime = require('mime-types');

http.createServer(function (request, response) {
    console.log('request started from', request.socket.remoteAddress, "| Requested :", request.url);

    var filePath = './Share' + request.url;
    if (filePath == './Share/') {
        filePath = './index.html';
    } else if (filePath == "./Share/favicon.ico") {
        filePath = './favicon.ico';
    }
    var extname = path.extname(filePath);

    var contentType = mime.lookup(extname);
    console.log("Query :", filePath, "| File Type :", contentType);
    if (filePath == "./index.html") {
        response.writeHead(200);
        var htmlcontent = `<!DOCTYPE html>
        <html>
            <header>
                <p style=\"color:rgb(255, 255, 255)\">THIS IS MY FILE SHARING WEB :D</p>
            </header>
            <style>
                body{background-color: rgb(0, 15, 32);}

                a:link {
                    color: rgb(161, 213, 255);
                    background-color: transparent;
                    text-decoration: none;
                  }
                  @keyframes onhover { 
                    0% { color: #f00 }
                    5% { color: #f00 }
                    15% { color: #f80 }
                    25% { color: #ff0 }
                    35% { color: #8f0 }
                    45% { color: #0f8 }
                    55% { color: #08f }
                    65% { color: #00f }
                    75% { color: #80f }
                    85% { color: #f08 }
                    95% { color: #f00 }
                    100% { color: #f00 }
                }
                  a:visited {
                    color: rgb(131, 198, 252);
                    background-color: transparent;
                    text-decoration: none;
                  }
                  a:hover {
                    color: rgb(189, 242, 217);
                    background-color: transparent;
                    text-decoration: bold;
                    animation-name: onhover;
                    animation-duration: 4s;
                    animation-iteration-count: infinite;
                  }
                  a:active {
                    color: rgb(242, 189, 189);
                    background-color: transparent;
                    text-decoration: bold;
                  }
            </style>
            <body>
                <font color=\"FFFFFF\">
                    List of files :
                </font>
            <br>`;
        fs.readdir("./Share/", function(er, files) {
            if (er) {
                throw er;
            }
            console.log("Indexing files :");
            files.forEach(file => {
                console.log("\t",file);
                htmlcontent = htmlcontent.concat("<font color=\"FFFFFF\">\> <a href=\"","./",file,"\"> [ Download ] </a>",file,"</font><br>")
            })
            htmlcontent = htmlcontent.concat("<br><font color=\"FFFFFF\"> Total files count : [<font color=\"F7EA6F\">",files.length,"</font>]</font></body></html>");
            response.writeHead(200, { 'Content-Type': contentType });
            response.end(htmlcontent, 'utf-8');
        })
    } else {
        fs.readFile(filePath, function(error, content) {
            if (error) {
                if(error.code == 'ENOENT'){
                    fs.readFile('./404.html', function(error, content) {
                        response.writeHead(200, { 'Content-Type': contentType });
                        response.end(content, 'utf-8');
                    });
                }
                else {
                    response.writeHead(500);
                    response.end('Error :'+error.code+' ..\nDid you broke it?');
                    response.end(); 
                }
            }
            else {
                response.writeHead(200, { 'Content-Type': contentType });
                response.end(content, 'utf-8');
            }
        });
    }
    console.log("------------------------------------------------------------");

}).listen(80);
console.log('Server started, Port = 80');