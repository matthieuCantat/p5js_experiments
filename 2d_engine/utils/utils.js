

/*

This EventEmitter class allows different parts of a 2D engine to communicate
// with each other without being tightly coupled. It supports subscribing to
// events, unsubscribing from them, and emitting events with optional data.

GAME ENGINE

    body = new Body()
    register_body( body )
        body.on('spawn effect', (body) => { this.effects.push(body) );
        body.on('spawn body', (body) => { this.bodies.push(body) );


BODY
    body = new Body()
    this.emit('spawn effect', newBody);
    this.emit('spawn body', newBody);


*/

class EventEmitter {
    constructor() {
      this.listeners = {}; // Helper object to store 'event name' -> [functions]
    }
  
    // Subscribe: "Let me know when X happens"
    on(event, callback) {
      if (!this.listeners[event]) {
        this.listeners[event] = [];
      }
      this.listeners[event].push(callback);
    }
  
    // Unsubscribe: "I don't care anymore" (Crucial for memory management!)
    off(event, callback) {
      if (!this.listeners[event]) return;
      this.listeners[event] = this.listeners[event].filter(fn => fn !== callback);
    }
  
    // Broadcast: "Hey everyone, X just happened!"
    emit(event, payload) {
      if (!this.listeners[event]) return;
      this.listeners[event].forEach(callback => callback(payload));
    }
}




export function history_fill( data, elem, max_nbr)
{
	data.unshift(elem)
	if ( max_nbr < data.length)
		data.pop(); // Remove the oldest if over size		
}