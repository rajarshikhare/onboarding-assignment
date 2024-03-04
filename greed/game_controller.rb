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
      puts "#{player.name}'s final turn"
      turn = Turn.new(player, @dice)
      turn_score = turn.play
      player.increment_score(turn_score)
    end
  end

  def announce_winner
    winner = @players.max_by(&:score)
    # Tie Breaker
    puts "\nWinner is #{winner.name} with a score of #{winner.score}!"
  end
end
