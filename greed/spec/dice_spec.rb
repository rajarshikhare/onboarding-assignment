require_relative '../dice'

describe Dice do
  before do
    @dice = Dice.new
  end

  it 'rolls the dice' do
    result = @dice.roll(5)
    expect(result.size).to eq(5)
    result.each do |num|
      expect(num).to be_between(1, 6).inclusive
    end
  end
end
