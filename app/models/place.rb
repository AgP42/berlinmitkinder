class Place < ApplicationRecord
  belongs_to :user

  has_many :place_services
  has_many :services, through: :place_services

  validates :name, uniqueness: { case_sensitive: false }, presence: true
  validates :address, presence: true

  geocoded_by :address
  after_validation :geocode, if: :will_save_change_to_address?

  mount_uploader :image1, PhotoUploader
  mount_uploader :image2, PhotoUploader
  mount_uploader :image3, PhotoUploader
  mount_uploader :image4, PhotoUploader

end
