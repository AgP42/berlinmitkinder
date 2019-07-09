class AddGoogleDatasToPlaces < ActiveRecord::Migration[5.2]
  def change
    add_column :places, :gphoto1, :string
    add_column :places, :gphoto2, :string
    add_column :places, :gphoto3, :string
    add_column :places, :gphoto4, :string
    add_column :places, :googleplaceid, :string
    add_column :places, :gtypes, :string
  end
end
