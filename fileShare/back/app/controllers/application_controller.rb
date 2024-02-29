class ApplicationController < ActionController::API
    before_action :authenticate_request

    private

    def authenticate_request
      header = request.headers['Authorization']
      header = header.split(' ').last if header
      decoded = JwtService.decode(header)
      if decoded
        @current_user = User.find_by(email: decoded[:email])
      else
        render json: { errors: 'Unauthorized' }, status: :unauthorized
      end
    rescue ActiveRecord::RecordNotFound
      render json: { errors: 'Unauthorized'}, status: :unauthorized
    end

end
