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

  def non_scoring_dice_count(dice)
    # Count occurrences of each die face
    counts = dice.each_with_object(Hash.new(0)) { |num, hash| hash[num] += 1 }
    non_scoring_count = 0

    counts.each do |num, count|
      if num == 1
        # Subtract scoring 1's
        non_scoring_count += [0, count - 3].max
      elsif num == 5
        # Subtract scoring 5's
        non_scoring_count += [0, count - 3].max
      else
        # For 2, 3, 4, 6 - Only subtract if there's a triplet
        non_scoring_count += count >= 3 ? count - 3 : count
      end
    end

    # Total dice - scoring dice = non-scoring dice
    total_dice = dice.length
    scoring_dice = total_dice - non_scoring_count
    non_scoring_dice = total_dice - scoring_dice

    non_scoring_dice
  end

  def play
    turn_score = 0
    dice_count = 5
    loop do
      puts "*************************************************"
      puts "Player #{@player.name} rolled #{dice_count} dice!"
      dice = @dice.roll(dice_count)
      roll_score = score_roll(dice)
      puts "Got Configuration #{dice}"
      if roll_score == 0
          turn_score = 0
          break
      end

      turn_score += roll_score
      non_scoring_dice = non_scoring_dice_count(dice)
      puts "Dice used left : #{non_scoring_dice}"
      dice_count = non_scoring_dice
      dice_count = 5 if dice_count == 0
      puts "Turn Score: #{turn_score}, Roll Score: #{roll_score}, do you want to scroll again with #{dice_count} dice?"
      break unless gets.strip.downcase == 'yes'
    end
    turn_score
  end
end
