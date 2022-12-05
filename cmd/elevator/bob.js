const { WebSocket } = require('ws');
const dgram = require('node:dgram');

const prompt = require('prompt');
const ws = new WebSocket('ws://localhost:8001');

ws.on('open', function open() {
    console.log("Connected to Alice. Waiting for them to pick their secret...");
});

let min_range = 1;
let max_range = 20;
let ports;
let hadUdpMessage = false;

function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

ws.on('message', async function message(data, isBinary) {
    const message = isBinary ? data : data.toString();
    let msgParts = message.split("|");
    let action = msgParts[0];
    if (action === "OPEN_PORTS") {
        ports = JSON.parse(msgParts[1]);
    }
    if (action === "SECRET_SELECTED") {
        prompt.start();

        let prompt_desc = {
            properties: {
                secret: {
                    description: `Secret such that ${min_range} <= secret <= ${max_range}`,
                    type: 'integer',
                    required: true,
                }
            }
        }
        let result = await prompt.get(prompt_desc);
        
        const client = dgram.createSocket('udp4');
        client.connect(ports[result.secret.toString()], 'localhost', () => {
            client.on('message', () => {
                hadUdpMessage = true;
            });
            ws.send(`UDP_SEND_INFO|${JSON.stringify(client.address())}`);
        });
    }
    if (action === "DONE_UDP") {
        await delay(100); // Sometimes udp messages take a while to arrive(?)
        console.log(hadUdpMessage ? "My secret is less than or equal to Alice's" : "My secret is greater than Alice's");
        ws.send(`RESULT|${hadUdpMessage ? 1 : 0}`);
        process.exit(0);
    }
});