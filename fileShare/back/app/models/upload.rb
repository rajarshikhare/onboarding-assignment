class Upload < ApplicationRecord
  belongs_to :user
  has_one_attached :file
  validates :is_public, inclusion: { in: [true, false] }
  after_initialize :set_defaults, unless: :persisted?

  private

  def set_defaults
    self.is_public ||= false
  end
end
