class Turn
  attr_reader :player, :dice

  def initialize(player, dice)
    @player = player
    @dice = dice
  end

  def score_roll(dice)
    score = 0
    (1..6).each do |num|
      count = dice.count(num)
      if num == 1
        score += (count >= 3 ? 1000 + (count - 3) * 100 : count * 100)
      elsif num == 5
        score += (count >= 3 ? 500 + (count - 3) * 50 : count * 50)
      else
        score += (count >= 3 ? num * 100 : 0)
      end
    end
    score
  end

  def play
    turn_score = 0
    dice_count = 5
    loop do
      dice = @dice.roll(dice_count)
      roll_score = score_roll(dice)
      break if roll_score == 0

      turn_score += roll_score
      scoring_dice = dice.select { |d| [1, 5].include?(d) || dice.count(d) >= 3 }
      dice_count = 5 - scoring_dice.size
      dice_count = 5 if dice_count == 0
      puts "Player #{@player.name} Dice Rolled! Score: #{turn_score}, do you want to scroll again?"
      break unless gets.strip.downcase == 'yes'
    end
    turn_score
  end
end
