class GreedGame
    def initialize(player_count)
        raise "player_count cannot be 0" if player_count == 0
        @player_count = player_count
        @scores = Array.new(player_count, 0)
    end

    def play
        round = 1
        while @scores.max < 3000
            puts "\nRound #{round}"
            @player_count.times do |player|
                turn_score = take_turn(player)
                @scores[player] += turn_score if turn_score >= 300 || @scores[player] > 0
                puts "Player #{player + 1}'s score: #{@scores[player]}"
            end
            round += 1
        end

        final_round
        announce_winner
    end

    private

    def roll_dice(dice_count)
        Array.new(dice_count) { rand(1..6) }
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

    def take_turn(player)
        turn_score = 0
        dice_count = 5
        loop do
            dice = roll_dice(dice_count)
            puts "Player #{player + 1} rolled: #{dice.inspect}"
            roll_score = score_roll(dice)
            puts "Score for this roll: #{roll_score}"
            break if roll_score == 0

            turn_score += roll_score
            scoring_dice = dice.select { |d| [1, 5].include?(d) || dice.count(d) >= 3 }
            dice_count = 5 - scoring_dice.size
            dice_count = 5 if dice_count == 0
            puts "Player #{player + 1} decides to roll again? (yes/no)"
            break unless gets.strip.downcase == 'yes'
        end
        turn_score
    end

    def final_round
        puts "\nFinal Round!"
        @player_count.times do |player|
            puts "Player #{player + 1}'s final turn"
            turn_score = take_turn(player)
            @scores[player] += turn_score if turn_score >= 300 || @scores[player] > 0
        end
    end

    def announce_winner
        winner = @scores.each_with_index.max[1]
        puts "\nWinner is Player #{winner + 1} with a score of #{@scores[winner]}!"
    end
end
