import redis from 'redis'

export const client = redis.createClient()

export function connectRedis() {
  client.on('error', function (error) {
    console.error(error)
  })

  client.set('key', 'value', redis.print)
  client.get('key', redis.print)
}
