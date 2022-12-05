const { Server } = require('ws');
const dgram = require('node:dgram');

const prompt = require('prompt');

let min_range = 1;
let max_range = 20;

function initUDPServer(port) {
    return new Promise((resolve) => {
        const server = dgram.createSocket('udp4');
        server.on('listening', () => {
            resolve(server);
        });
        server.bind(port);
    });
}


const sockserver = new Server({ port: 8001 });

sockserver.on("listening", () => {
    console.log("Waiting for Bob to connect...");
});

sockserver.on('connection', async (ws) => {
    console.log('Bob has connected.');
    let udp_send_info;
    ws.on('close', () => {
        console.log('Bob has disconnected!');
        process.exit(0);
    });

    let openUDPPorts = {};
    let openUDPServers = {};
    for (let index = min_range; index <= max_range; index++) {
        let port = 40000 + index;
        openUDPPorts[index] = port;
        openUDPServers[index] = await initUDPServer(port);
    }

    ws.send("OPEN_PORTS|" + JSON.stringify(openUDPPorts));

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

    ws.on('message', async function message(data, isBinary) {
        const message = isBinary ? data : data.toString();
        let msgParts = message.split("|");
        let action = msgParts[0];
        // When client is connected one of our UDP server, sends their port so we can send them data.
        // Usually this is communicated through sending data from the UDP client but we can't do this here without revealing sensitive data.
        if (action === "UDP_SEND_INFO") {
            udp_send_info = JSON.parse(msgParts[1]);
            for (let index = result.secret; index >= min_range; index--) {
                openUDPServers[index.toString()].send(Buffer.from('SPAM'), udp_send_info.port);
            }
            ws.send("DONE_UDP|");
        }

        if (action === "RESULT") {
            console.log(msgParts[1] === '1' ? "My secret is greater than or equal to Bob's" : "My secret is less than Bob's");
            process.exit(0);
        }
    });

    ws.send("SECRET_SELECTED|");
    console.log("Waiting for Bob to pick their secret...");
});
