class CreatePlaceServices < ActiveRecord::Migration[5.2]
  def change
    create_table :place_services do |t|
      t.references :place, foreign_key: true
      t.references :service, foreign_key: true

      t.timestamps
    end
  end
end
