const { spawn } = require('child_process');
const http = require('http');

console.log('Iniciando servidor index.js...');
const server = spawn('node', ['index.js'], { cwd: __dirname });

server.stdout.on('data', (data) => {
    const text = data.toString();
    console.log('[Server stdout]:', text.trim());
    if (text.includes('Database Connected')) {
        console.log('Servidor conectado ao banco! Enviando requisição POST para /api/post...');
        testPost();
    }
});

server.stderr.on('data', (data) => {
    console.error('[Server stderr]:', data.toString().trim());
});

function testPost() {
    const payload = JSON.stringify({
        descricao: "Jogar Futebol",
        statusRealizada: false
    });

    const req = http.request({
        hostname: 'localhost',
        port: 3000,
        path: '/api/post',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(payload)
        }
    }, (res) => {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => {
            console.log(`\n================================`);
            console.log(`RESPOSTA HTTP STATUS: ${res.statusCode}`);
            console.log(`DADOS RETORNADOS: ${body}`);
            console.log(`================================\n`);
            server.kill();
            process.exit(0);
        });
    });

    req.on('error', (err) => {
        console.error('Erro na requisição:', err);
        server.kill();
        process.exit(1);
    });

    req.write(payload);
    req.end();
}
