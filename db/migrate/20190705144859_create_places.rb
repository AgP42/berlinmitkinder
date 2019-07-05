class CreatePlaces < ActiveRecord::Migration[5.2]
  def change
    create_table :places do |t|
      t.string :name
      t.string :address
      t.string :longitute
      t.string :latitude
      t.string :image1
      t.string :image2
      t.string :image3
      t.string :image4
      t.string :ext_link
      t.text :comment
      t.references :user, foreign_key: true

      t.timestamps
    end
  end
end
