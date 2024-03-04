require 'sinatra'
require 'securerandom'
require 'logger'
KEYS_LOCK = Mutex.new
logger = Logger.new(STDOUT)

set :port, 4567 # or any preferred port

# Structure to hold keys: {key => {blocked: boolean, last_seen: Time}}
# Lock this
KEYS = {}

# Endpoint to generate keys
post '/generate_key' do
  key = SecureRandom.hex(10)
  KEYS_LOCK.synchronize {
    KEYS[key] = {blocked: false, last_seen: Time.now}
  }
  logger.info("Key generated: #{key}")
  key
end

# Endpoint to get an available key
get '/get_key' do
  key = nil
  KEYS_LOCK.synchronize {
    key, _ = KEYS.find { |_, v| !v[:blocked] && (Time.now - v[:last_seen]) <= 300 }
    if key
      KEYS[key][:blocked] = true
      KEYS[key][:last_seen] = Time.now
    end
  }
  if key
    return key
    logger.info("Returned key: #{key}")
  else
    status 404
    logger.info("Key not found")
  end
end

# Endpoint to unblock a key
post '/unblock_key/:key' do
  if KEYS[params[:key]]
    KEYS[params[:key]][:blocked] = false
    KEYS[params[:key]][:last_seen] = Time.now
    logger.info("Unblocked key: #{params[:key]}")
    "Key #{params[:key]} unblocked."
  else
    status 404
    logger.info("Key not found")
  end
end

# Endpoint to delete a key
delete '/delete_key/:key' do
  if KEYS.delete(params[:key])
    logger.info("Deleted key: #{params[:key]}")
    "Key #{params[:key]} deleted."
  else
    logger.info("Key not found")
    status 404
  end
end

# Endpoint to keep-alive a key
get '/keep_alive/:key' do
  if KEYS[params[:key]] && !KEYS[params[:key]][:blocked]
      KEYS[params[:key]][:last_seen] = Time.now
      logger.info("Key refreshed: #{params[:key]}")
  else
    logger.info("Key not found")
    status 404
  end
end

# Background thread to handle expiration and automatic unblocking
background_thread = Thread.new do
  loop do
    KEYS_LOCK.synchronize {
      KEYS.each do |key, info|
        if (Time.now - info[:last_seen]) > 300
          KEYS.delete(key)
        elsif info[:blocked] && (Time.now - info[:last_seen]) > 60
          KEYS[key][:blocked] = false
        end
      end
    }
    sleep(10) # check every 10 seconds
  end
end

# Implement the at_exit hook
at_exit do
  # Signal the background thread to stop
  background_thread.kill
  # Wait for the thread to finish
  background_thread.join
end
