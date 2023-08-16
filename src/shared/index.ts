/**
 * The Async module provides functions for handling asynchronous operations in JavaScript.
 * It includes functions for executing tasks in parallel, limiting the number of concurrent tasks,
 * and executing tasks in series.
 *
 * @module Async
 */

/**
 * Executes an array of tasks in parallel and calls the callback function with the results.
 *
 * @param {Array<Function>} tasks - An array of tasks to be executed in parallel.
 * @param {Function} cb - The callback function to be called with the results.
 */
function parallel(tasks, cb) {
    // If there are no tasks, call the callback function with an empty array and return
    if (tasks.length === 0) {
      cb([]);
      return;
    }
  
    let remaining = tasks.length;
    const results = [];
  
    // Iterate over the tasks array
    for (let i = 0; i < tasks.length; i++) {
      // Call the task function with a callback function
      tasks[i](function(result) {
        // Push the result to the results array
        results.push(result);
        remaining--;
  
        // If all tasks have completed, call the callback function with the results
        if (remaining === 0) {
          cb(results);
        }
      });
    }
  }
  
  /**
   * Executes an array of tasks with a specified limit on the number of concurrent tasks,
   * and calls the callback function with the results.
   *
   * @param {Array<Function>} tasks - An array of tasks to be executed.
   * @param {number} limit - The maximum number of tasks to be executed concurrently.
   * @param {Function} cb - The callback function to be called with the results.
   */
  function parallelLimit(tasks, limit, cb) {
    // If there are no tasks, call the callback function with an empty array and return
    if (tasks.length === 0) {
      cb([]);
      return;
    }
  
    let remaining = tasks.length;
    let running = 0;
    const queue = [];
    const results = [];
  
    // Add all tasks to the queue
    for (let i = 0; i < tasks.length; i++) {
      queue.push(tasks[i]);
    }
  
    /**
     * Process the task queue.
     */
    function processQueue() {
      // If the queue is empty or the maximum number of tasks are already running, return
      if (queue.length === 0 || running >= limit) {
        return;
      }
  
      // Execute tasks while the number of running tasks is less than the limit
      while (running < limit && queue.length > 0) {
        const task = queue.shift();
        running++;
  
        // Call the task function with a callback function
        task(function(result) {
          // Push the result to the results array
          results.push(result);
          remaining--;
          running--;
  
          // If all tasks have completed, call the callback function with the results
          if (remaining === 0) {
            cb(results);
          }
  
          // Process the next task in the queue
          processQueue();
        });
      }
    }
  
    // Start processing the task queue
    processQueue();
  }
  
  /**
   * Executes an array of tasks in series (one after another) and calls the callback function with the results.
   *
   * @param {Array<Function>} tasks - An array of tasks to be executed in series.
   * @param {Function} cb - The callback function to be called with the results.
   */
  function series(tasks, cb) {
    // If there are no tasks, call the callback function with an empty array and return
    if (tasks.length === 0) {
      cb([]);
      return;
    }
  
    let i = 0;
    const results = [];
  
    /**
     * Execute the next task in the series.
     */
    function executeNextTask() {
      // If all tasks have been executed, call the callback function with the results
      if (i === tasks.length) {
        cb(results);
        return;
      }
  
      // Call the task function with a callback function
      tasks[i](function(result) {
        // Push the result to the results array
        results.push(result);
        i++;
  
        // Execute the next task in the series
        executeNextTask();
      });
    }
  
    // Start executing the tasks in series
    executeNextTask();
  }