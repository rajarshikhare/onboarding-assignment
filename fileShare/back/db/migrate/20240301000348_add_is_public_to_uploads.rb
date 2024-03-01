class AddIsPublicToUploads < ActiveRecord::Migration[7.1]
  def change
    add_column :uploads, :is_public, :boolean
  end
end
