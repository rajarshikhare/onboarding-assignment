class User < ApplicationRecord
    has_secure_password
    has_many :uploads, dependent: :destroy

    validates :username, presence: true, length: { minimum: 2 }
    validates :name, presence: true, length: { minimum: 2 }
    validates :email, presence: true, uniqueness: true, format: { with: URI::MailTo::EMAIL_REGEXP }
end
