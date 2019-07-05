class Service < ApplicationRecord

  has_many :place_services
  has_many :places, through: :place_services

end
