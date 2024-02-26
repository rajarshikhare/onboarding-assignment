require_relative '../greed'

describe 'GreedGame#initialize' do
  it 'correctly initializes the game with the given number of players' do
    game = GreedGame.new(4)
    expect(game.instance_variable_get(:@player_count)).to eq(4)
    expect(game.instance_variable_get(:@scores)).to eq([0, 0, 0, 0])
  end
end
