class Dice
  def roll(dice_count)
    Array.new(dice_count) { rand(1..6) }
  end
end
