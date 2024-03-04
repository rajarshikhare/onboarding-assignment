require_relative 'game_controller'

puts "Enter the number of players"
user_input = gets.chomp.to_i
game = GameController.new(user_input)
game.play
