class PlacesController < ApplicationController

  skip_before_action :authenticate_user!, only: [:index, :show]
  skip_after_action :verify_policy_scoped # => no pundit for index here

  def index
    search_radius = 2 # km
    @addr_name = "Address"

    # first we consider the address typed by the user
    if params[:addr].present?
      @places = Place.near(params[:addr], search_radius).where.not(latitude: nil, longitude: nil) # all are sent, the filter is done in JS
      @addr_coordinates = { addr: Geocoder.search(params[:addr]).first.coordinates }
    # then the browser auto location
    elsif params[:lat].present? && params[:long].present?
      @places = Place.near([params[:lat], params[:long]], search_radius).where.not(latitude: nil, longitude: nil) # all are sent, the filter is done in JS
      @addr_name = Geocoder.search([params[:lat], params[:long]]).first.address
      @addr_coordinates = { addr: [params[:lat], params[:long]] }
    # otherwise, no location
    else
      @places = Place.where.not(latitude: nil, longitude: nil) # all are sent, the filter is done in JS
    end

    @services = Service.all # needed to render the checkboxes

    # create the markers for the places on the request address, the filter will be done by js
    @markers = @places.map do |place|
      {
        lat: place.latitude,
        lng: place.longitude,
        services: place.services.map { |e| e.id }, # send the id of the services of this place
        id: place.id,
        # to make that work : create a _infowindow partial into views/places !!!
        infoWindow: render_to_string(partial: "infowindow", locals: { place: place })
      }
    end
  end

  def show
    @place = Place.find(params[:id])
    authorize @place

    @addr_marker = {
      lat: @place.latitude,
      lng: @place.longitude,
      infoWindow: render_to_string(partial: "infowindow", locals: { place: @place })
    }

    # todo : keep url search criterias
    # @search_date = params[:date]
    @search_address = params[:addr]
  end

  def new
    @place = Place.new
    authorize @place
  end

  def create
    @place = Place.new(place_params)
    authorize @place
    @place.user = current_user
    if params[:place][:gphoto1]
      url = params[:place][:gphoto1]
      @place.remote_image1_url = url
    end
    if params[:place][:gphoto2]
      url = params[:place][:gphoto2]
      @place.remote_image2_url = url
    end
    if params[:place][:gphoto3]
      url = params[:place][:gphoto3]
      @place.remote_image3_url = url
    end
    if params[:place][:gphoto4]
      url = params[:place][:gphoto4]
      @place.remote_image4_url = url
    end
    if @place.save
      params[:place][:service_ids].each do |service|
        if service != ""
          place_service = PlaceService.create!(place: @place, service: Service.find(service))
          # if place_service.save

          # else

          # end
        end
      end
      redirect_to @place
    else
      render :new
    end
  end

  def edit
    @place = Place.find(params[:id])
    authorize @place
  end

  def update
    @place = Place.find(params[:id])
    authorize @place
    if @place.update(place_params)
        # loop to existing services of this place and destroy if not checked anymore
        @place.services.each do |service|
          place_service = PlaceService.where(place: @place).where(service: service).first
          place_service.destroy unless params[:place][:service_ids].include?(service.id.to_s)
        end

        # loop to all checked services received and create service that not exists yet
        params[:place][:service_ids].each do |service|
        if service != ""
          place_service = PlaceService.create!(place: @place, service: Service.find(service)) unless @place.services.include?(Service.find(service))
        end
      end
      redirect_to @place
    else
      render :edit
    end
  end

  def destroy
    @place = Place.find(params[:id])
    authorize @place
    @place.place_services.each { |e| e.destroy! } # destroy all associated services
    @place.destroy! # destroy the place itself
    redirect_to users_path
  end

  private

  def place_params
    params.require(:place).permit(:name, :address, :image1, :image2, :image3, :image4, :ext_link, :comment, :googleplaceid, :gtypes, :longitude, :latitude)
    # , :gphoto1, :gphoto2, :gphoto3, :gphoto4
  end
end
