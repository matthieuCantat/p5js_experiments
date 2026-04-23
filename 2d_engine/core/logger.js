



export class Logger {

    CURRENT_LEVEL = ["debug","info","warn","error"][1];

    constructor(scope = "MAIN") {
      this.levels = { debug: 0, info: 1, warn: 2, error: 3 };
      this.level = this.levels[this.CURRENT_LEVEL];
      this.scope = scope;
      
    }
  
    log(level, ...args) {
        
      if (this.levels[level] < this.level) return;
      
      console[level]( `[${this.scope}]` , ...args);
    }

    debug(...a) { this.log("debug", ...a); }
    info(...a) { this.log("info", ...a); }
    warn(...a) { this.log("warn", ...a); }
    error(...a) { this.log("error", ...a); }
  }
  
  