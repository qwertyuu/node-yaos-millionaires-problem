# Node Yao's Millionaires Problem solutions

## Elevator-based solution

Run somewhere: `node .\cmd\elevator\alice.js`

And somewhere else: `node .\cmd\elevator\bob.js`

### Principle

Alice and Bob agree on a reasonable "range" of numbers in which their secrets exist. (here it is set to [1, 20] but can be changed, as long as both agree and use the same range)

Alice and Bob connect using TCP in order to communicate bi-directionally.

Alice opens an UDP port for each value in the range. (Here: 1 through 20)

Alice tells Bob which UDP ports are available to him using the TCP connection.

Alice chooses the UDP port that best represents her secret, then tells Bob that she is done picking.

Bob chooses the UDP port that represents the most his secret, connects to it, then tells Alice that he is done picking. (Alice must trust Bob to listen on only one port)

Alice sends data to each UDP port corresponding to the port with less than or equal her secret value, then notifies Bob that she is done.

If Bob got a message from the UDP port before being notified of completion, Alice's secret is greater than or equal to Bob's secret. Otherwise, Bob's secret is greater than Alice's.

Bob communicates the result to Alice.

### TODO

- Add parameter for range and communicate range to bob