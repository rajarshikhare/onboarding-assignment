require_relative '../greed'

describe 'GreedGame' do
  it 'handles invalid player counts gracefully' do
    expect { GreedGame.new(0) }.to raise_error(StandardError)
  end
end
