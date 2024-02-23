require 'rack/test'
require 'rspec'
require_relative '../key_server' # replace with the path to your Sinatra application file

ENV['RACK_ENV'] = 'test'

module RSpecMixin
  include Rack::Test::Methods
  def app() Sinatra::Application end
end

RSpec.configure { |c| c.include RSpecMixin }
