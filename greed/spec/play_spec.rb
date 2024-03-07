require_relative '../turn'
require_relative '../player'
require_relative '../dice'

describe Turn do
  let(:player) { Player.new('Player 1') }
  let(:dice) { Dice.new }
  let(:turn) { Turn.new(player, dice) }

  it 'calculates score for a roll' do
    score = turn.score_roll([1, 1, 1, 5, 5])
    expect(score).to eq(1100)
  end

  it 'plays a turn' do
    allow(turn).to receive(:gets).and_return("no\n")
    allow(dice).to receive(:roll).and_return([1, 1, 1, 5, 5])
    expect(turn.play).to eq(1100)
  end
end
