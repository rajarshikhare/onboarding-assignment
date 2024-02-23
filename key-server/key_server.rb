require 'sinatra'
require 'securerandom'
require 'time'

set :port, 4567 # or any preferred port

# Structure to hold keys: {key => {blocked: boolean, last_seen: Time}}
# Lock this
KEYS = {}

# Endpoint to generate keys
post '/generate_key' do
  key = SecureRandom.hex(10)
  KEYS[key] = {blocked: false, last_seen: Time.now}
  key
end

# Endpoint to get an available key
get '/get_key' do
  key, _ = KEYS.find { |_, v| !v[:blocked] && (Time.now - v[:last_seen]) <= 300 }
  if key
    KEYS[key][:blocked] = true
    KEYS[key][:last_seen] = Time.now
    return key
  end
  status 404
end

# Endpoint to unblock a key
post '/unblock_key/:key' do
  if KEYS[params[:key]]
    KEYS[params[:key]][:blocked] = false
    KEYS[params[:key]][:last_seen] = Time.now
    "Key #{params[:key]} unblocked."
  else
    status 404
  end
end

# Endpoint to delete a key
delete '/delete_key/:key' do
  if KEYS.delete(params[:key])
    "Key #{params[:key]} deleted."
  else
    status 404
  end
end

# Endpoint to keep-alive a key
get '/keep_alive/:key' do
  if KEYS[params[:key]] && !KEYS[:blocked]
      KEYS[params[:key]][:last_seen] = Time.now
  else
    status 404
  end
end

# Background thread to handle expiration and automatic unblocking
Thread.new do
  loop do
    KEYS.each do |key, info|
      if (Time.now - info[:last_seen]) > 300
        KEYS.delete(key)
      elsif info[:blocked] && (Time.now - info[:last_seen]) > 60
        KEYS[key][:blocked] = false
      end
    end
    sleep(10) # check every 10 seconds
  end
end
