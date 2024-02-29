class CreateUploads < ActiveRecord::Migration[7.1]
  def change
    create_table :uploads do |t|
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end
  end
end
