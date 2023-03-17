# Katana Pricing Server
Katana pricing server is a Websocket for get the price of a cryptocurrency in a currency.

## Installation
```bash
yarn install
```

## Usage Client
```javascript
function startSocket() {
  const socket = new WebSocket(ASSSET_SERVER_URL);
  // Connection opened
  socket.addEventListener('open', () => {
    console.log('Websocket connection opened');
    // subscribe to SOL/USDC
    socket.send(JSON.stringify(['SOL', 'USDC']));
  });

  socket.addEventListener('close', () => {
    console.log('Websocket connection closed');
    setTimeout(function () {
      startSocket();
    }, 1000);
  });

  // retry connection
  socket.onerror = function (event) {
    console.error('Socket encountered error closing socket');
    socket.close();
  };

  // response of the server with the price
  socket.addEventListener('message', (event) => {
    console.log('Websocket connection received', event.data);
  });
}
```

## Deployed

- DEV: ws://katana-pricing-server-production.up.railway.app
