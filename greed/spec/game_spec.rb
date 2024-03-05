require_relative '../game_controller'

describe GameController do
  before do
    @game = GameController.new(2)
  end

  it 'initializes with a specified number of players' do
    expect(@game.instance_variable_get(:@players).size).to eq(2)
  end

  it 'plays a game' do
    allow_any_instance_of(Turn).to receive(:play).and_return(300)
    allow_any_instance_of(GameController).to receive(:puts)
    @game.play
    winner = @game.instance_variable_get(:@players).max_by(&:score)
    expect(winner.score).to be >= 3000
  end
end
