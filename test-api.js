const http = require('http');

// Test GET /commands
console.log('Testing GET /commands...');
http.get('http://localhost:3000/commands', (res) => {
    let data = '';
    
    res.on('data', (chunk) => {
        data += chunk;
    });
    
    res.on('end', () => {
        console.log('Status:', res.statusCode);
        const commands = JSON.parse(data);
        console.log('Number of commands:', commands.length);
        console.log('First 3 commands:');
        commands.slice(0, 3).forEach(cmd => {
            console.log('- Command:', cmd.command);
            console.log('  Description:', cmd.description);
            console.log('---');
        });
    });
}).on('error', (err) => {
    console.error('Error:', err.message);
}); 