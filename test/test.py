import time
import random

import statsd

counter_name = 'lmm.test'
wait_s = 1


for i in range(10):
   c = statsd.StatsClient('127.0.0.1', 8125)

   random_count = random.randrange(1, 100)
   print("Count=(%d)" % (random_count))
   c.gauge(counter_name, random_count)

   t = c.timer(counter_name)
   t.start()
   while random_count > 0:
      c.incr(counter_name, 1)
      random_count -= 1
   t.stop()
   time.sleep(wait_s)
