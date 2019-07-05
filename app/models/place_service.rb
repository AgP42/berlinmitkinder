class PlaceService < ApplicationRecord
  belongs_to :place
  belongs_to :service

  # validation of uniqueness paire service/place
  validates_uniqueness_of :service, :scope => [:place]

end
