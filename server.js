import https from "https";
import fs from "fs";
import path from "path";
import constants from "constants";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const sslOptions = {

	key : fs.readFileSync(path.join(__dirname , "KEY.pem")) ,
	cert : fs.readFileSync(path.join(__dirname , "CERT.pem")) ,

	minVersion : "TLSv1.2" ,

	options : constants.SSL_OP_NO_SSLv3 | constants.SSL_OP_NO_TLSv1 | constants.SSL_OP_NO_TLSv1_1

};

const publicDir = path.join(__dirname, 'public');

const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.png' : 'image/png',
    '.ttf' : 'font/ttf'
};

const server = https.createServer(sslOptions , (req , res) => {

	res.setHeader("Strict-Transport-Security" , "max-age=31536000; includeSubDomains");
	res.setHeader("X-Content-Type-Options" , "nosniff");
	res.setHeader("X-Frame-Options" , "SAMEORIGIN");
	res.setHeader("X-XSS-Protection" , "1; mode=block");
	res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");

 	let filePath = path.join(publicDir, req.url === '/' ? 'index.html' : req.url);

    // Get the file extension and corresponding MIME type.
    const extname = path.extname(filePath);
    const contentType = mimeTypes[extname] || 'application/octet-stream';

    // Read and serve the file.
    fs.readFile(filePath, (err, content) => {

        if (err) {
            
            // Handle file not found (404) errors.
            if (err.code === 'ENOENT') {

                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('404 Not Found');

            } else {
                // Handle other server-side errors (500).
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('500 Internal Server Error');

            }

        } else {
            // Serve the file with the correct MIME type.
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content);
        }
    });

});

server.on("error" , error => console.error("Server Error: " , error));

const PORT = process.env.PORT || 3000;
server.listen(PORT , "0.0.0.0" , () => {

	console.log('Server Running at LocalHost:${PORT}.');
	console.log("Press Control + C to stop.");

});

console.log("fin");