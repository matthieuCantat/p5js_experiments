
import { Logger } from './logger.js';

const logger = new Logger("Time");

export class Time {

    constructor() {
      
      logger.info("constructor")
      
      this.last = performance.now();
  
      this.delta = 0;          // scaled delta
      this.rawDelta = 0;       // real delta
  
      this.rawElapsed = 0;
      this.elapsed = 0;
      this.timeScale = 1;
  
      this.frame = 0;

      
      this.one_update_debug_time = 1; // in seconds, time between 2 debug log in update
      this.update_debug_time_last = 0;
      this.one_update_debug_time_passed = false;

    }
  
    update() {
      
      if( this.one_update_debug_time_passed )
      {
        logger.info(" ")
        logger.info("update", this.elapsed.toFixed(2) , 'update delta :', this.delta.toFixed(5));  
        logger.info(" ") 
      }

    
      const now = performance.now();
  
      this.rawDelta = (now - this.last) / 1000;
      this.delta = this.rawDelta * this.timeScale;
  
      this.rawElapsed += this.rawDelta
      this.elapsed += this.delta;
  
      if( this.one_update_debug_time < this.rawElapsed - this.update_debug_time_last ){
        this.update_debug_time_last = this.rawElapsed
        this.one_update_debug_time_passed = true
      }else{
        this.one_update_debug_time_passed = false
      }
      

      this.last = now;
      this.frame++;
    }
  }
  
  