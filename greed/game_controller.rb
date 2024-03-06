require_relative 'player'
require_relative 'dice'
require_relative 'turn'

class GameController
  def initialize(player_count)
    raise "player_count cannot be 0" if player_count < 1
    @players = Array.new(player_count) { |i| Player.new("Player #{i + 1}") }
    @dice = Dice.new
  end

  def play
    round = 1
    while @players.max_by(&:score).score < 3000
      puts "\nRound #{round}"
      @players.each do |player|
        turn = Turn.new(player, @dice)
        turn_score = turn.play
        # Player must score 300 or more to start scoring
        player.increment_score(turn_score) if turn_score >= 300 || player.score > 0
        puts "#{player.name}'s score: #{player.score}"
      end
      round += 1
    end

    final_round
    announce_winner
  end

  def final_round
    puts "\nFinal Round!"
    @players.each do |player|
      # exclude the player who has already scored 3000
      if player.score >= 3000
          next
      end
      puts "#{player.name}'s final turn"
      turn = Turn.new(player, @dice)
      turn_score = turn.play
      player.increment_score(turn_score)
    end
  end

  def announce_winner
    highest_score = @players.map(&:score).max
    winners = @players.select { |player| player.score == highest_score }

    if winners.size > 1
      winner_names = winners.map(&:name).join(', ')
      puts "\nIt's a tie between #{winner_names} with a score of #{highest_score}!"
    else
      winner = winners.first
      puts "\nWinner is #{winner.name} with a score of #{highest_score}!"
    end
  end
end
