require 'timecop'

describe "POST /generate_key" do
  it "generates a new key and returns it" do
    post '/generate_key'
    expect(last_response.status).to eq(200)
    expect(last_response.body).not_to be_empty
    key = last_response.body
    expect(KEYS).to have_key(key)
    expect(KEYS[key][:blocked]).to eq(false)
    delete "/delete_key/#{key}"
    expect(last_response.status).to eq(200)
  end
end


describe "GET /get_key" do
  context "when there is an available key" do
    before do
      post '/generate_key'
      @key = last_response.body
    end

    after do
      delete "/delete_key/#{@key}"
    end

    it "returns an available key and blocks it" do
      get '/get_key'
      expect(last_response.status).to eq(200)
      expect(last_response.body).to eq(@key)
      expect(KEYS[@key][:blocked]).to eq(true)
    end
  end

  context "when there is no available key" do
    it "returns a 404 status" do
      get '/get_key'
      expect(last_response.status).to eq(404)
    end
  end
end

describe "POST /unblock_key/:key" do
  context "when the key exists" do
    before do
      post '/generate_key'
      @key = last_response.body
      get '/get_key' # Block the key
    end

    after do
      delete "/delete_key/#{@key}"
    end

    it "unblocks the given key" do
      post "/unblock_key/#{@key}"
      expect(last_response.status).to eq(200)
      expect(KEYS[@key][:blocked]).to eq(false)
    end
  end

  context "when the key does not exist" do
    it "returns a 404 status" do
      post "/unblock_key/nonexistentkey"
      expect(last_response.status).to eq(404)
    end
  end
end

describe "DELETE /delete_key/:key" do
  context "when the key exists" do
    before do
      post '/generate_key'
      @key = last_response.body
    end

    it "deletes the key" do
      delete "/delete_key/#{@key}"
      expect(last_response.status).to eq(200)
      expect(KEYS).not_to have_key(@key)
    end
  end

  context "when the key does not exist" do
    it "returns a 404 status" do
      delete "/delete_key/nonexistentkey"
      expect(last_response.status).to eq(404)
    end
  end
end

describe "GET /keep_alive/:key" do
  before do
    post '/generate_key'
    @key = last_response.body
  end

  context "when keep-alive is not called" do
    it "retuns 404" do
      # Simulate time passing
      Timecop.travel(Time.now + 301)
      get '/get_key'
      expect(last_response.status).to eq(404)
    end
  end

  context "when keep-alive is called" do
    it "retuns 200" do
      get "/keep_alive/#{@key}"
      expect(last_response.status).to eq(200)
      get '/get_key'
      expect(last_response.status).to eq(200)
      expect(last_response.body).to eq(@key)
    end
  end

end
