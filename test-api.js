const http = require('http');

// Test GET /items
console.log('Testing GET /items...');
http.get('http://localhost:3000/items', (res) => {
    let data = '';
    
    res.on('data', (chunk) => {
        data += chunk;
    });
    
    res.on('end', () => {
        console.log('Status:', res.statusCode);
        const items = JSON.parse(data);
        console.log('Number of items:', items.length);
        console.log('First 3 items:');
        items.slice(0, 3).forEach(cmd => {
            console.log('- Command:', cmd.command);
            console.log('  Description:', cmd.description);
            console.log('---');
        });
    });
}).on('error', (err) => {
    console.error('Error:', err.message);
}); 