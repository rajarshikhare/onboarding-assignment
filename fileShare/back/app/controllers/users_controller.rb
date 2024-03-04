class UsersController < ApplicationController
    skip_before_action :authenticate_request, only: [:signup, :login]

    def signup
        data = params.permit(:name, :email, :username, :password, :password_confirmation )
        user = User.new(data)
        if user.save
            token = JwtService.encode({email: user[:email]})
            render json: { status: 'SUCCESS', message: 'User created', data: { user: user, token: token } }, status: :ok
        else
            render json: { status: 'ERROR', message: 'User not created', errors: user.errors }, status: :unprocessable_entity
        end
    end

    def login
        data = params.permit(:email, :password)
        user = User.find_by(email: data[:email])
        if user == nil
            render json: { status: 'ERROR', message: 'Invalid email', errors: {email: "invalid email"}}, status: :unauthorized
            return
        end
        if user&.authenticate(data[:password])
            token = JwtService.encode({email: user[:email]})
            render json: { status: 'SUCCESS', message: 'Logged in successfully', data: { user: user, token: token }}, status: :ok
        else
            render json: { status: 'ERROR', message: 'Invalid email or password', errors: {password: "invalid password"}}, status: :unauthorized
        end
    end

    def update
        data = params.permit(:username, :name)
        user = @current_user
        if user.update(data)
            render json: user, status: :ok
        else
            render json: user.errors, status: :unprocessable_entity
        end
    end

end
