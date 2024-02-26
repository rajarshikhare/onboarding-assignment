require_relative '../greed'

describe 'GreedGame#play' do
  before do
    allow_any_instance_of(GreedGame).to receive(:puts) # Silence console output
    allow_any_instance_of(GreedGame).to receive(:gets).and_return('no') # Simulate player choosing not to roll again
  end

  it 'progresses through rounds until a winner is declared with mocked dice rolls' do
    allow_any_instance_of(GreedGame).to receive(:roll_dice).and_return([1, 1, 1, 2, 3], [5, 5, 5, 2, 3])
    game = GreedGame.new(2)
    game.play
    expect(game.instance_variable_get(:@scores)).to include(a_value >= 3000)
  end

  it 'accumulates scores properly over rounds for each player' do
    game = GreedGame.new(2)
    allow_any_instance_of(GreedGame).to receive(:roll_dice).and_return([1, 1, 1, 2, 3], [2, 3, 4, 5, 6], [5, 5, 5, 5, 5])
    game.play
    expect(game.instance_variable_get(:@scores).min).to be > 0
  end
end

describe 'GreedGame#play' do
  it 'triggers the final round correctly and announces a winner' do
    allow_any_instance_of(GreedGame).to receive(:puts)
    allow_any_instance_of(GreedGame).to receive(:gets).and_return('no')
    allow_any_instance_of(GreedGame).to receive(:roll_dice).and_return([1, 1, 1, 1, 1], [2, 2, 2, 5, 5])
    game = GreedGame.new(2)
    game.play
    scores = game.instance_variable_get(:@scores)
    winner_score = scores.max
    expect(winner_score).to be >= 3000
    expect(scores.count(winner_score)).to eq(1) # Ensures there is a single winner
  end
end

describe 'GreedGame#take_turn' do
  it 'correctly processes player decisions and dice rolls' do
    game = GreedGame.new(1)
    allow(game).to receive(:puts)
    allow(game).to receive(:gets).and_return('yes', 'no') # Simulates player rolling again once, then stopping
    allow(game).to receive(:roll_dice).and_return([1, 2, 3, 4, 5], [1, 1, 1, 2, 3])
    expect(game.send(:take_turn, 0)).to be > 0
  end
end
