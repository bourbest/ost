const EventEmitter = require('events');

class Poller extends EventEmitter {
  constructor(timeout = 100) {
    super();
    this.timeout = timeout;
  }

  poll() {
    this.timer = setTimeout(() => this.emit('poll'), this.timeout);
  }

  onPoll(cb) {
    clearTimeout(this.timer)
    this.on('poll', cb);
  }
}

module.exports = Poller;