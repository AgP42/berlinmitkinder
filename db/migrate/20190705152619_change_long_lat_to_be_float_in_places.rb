class ChangeLongLatToBeFloatInPlaces < ActiveRecord::Migration[5.2]
  def change
    remove_column :places, :longitude
    remove_column :places, :latitude
    add_column :places, :longitude, :float
    add_column :places, :latitude, :float
  end
end
