require_relative '../player'

describe Player do
  before do
    @player = Player.new('Player 1')
  end

  it 'initializes with a name and score of 0' do
    expect(@player.name).to eq('Player 1')
    expect(@player.score).to eq(0)
  end

  it 'increments score' do
    @player.increment_score(300)
    expect(@player.score).to eq(300)
  end
end
