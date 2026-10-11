// Delay timers during stationary fades to check cleanup and completed-effect replay.
process.env.QUOTE_TIMER_LAG = '1';
require('./verify-quotes.cjs');
