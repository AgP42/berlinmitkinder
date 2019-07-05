require "faker"

puts 'Cleaning all databases ...'

PlaceService.destroy_all
Service.destroy_all
Place.destroy_all
User.destroy_all

puts 'Creating an Admin User...'

User.create!(email: 'admin@example.com', password: 'topsecret', password_confirmation: 'topsecret', name: "Agathe", is_admin: true)

puts 'Creating an normal User...'

User.create!(email: 'user@example.com', password: 'topsecret', password_confirmation: 'topsecret', name: "Loic")

puts 'Creating Services...'

table = Service.create!(name: "Change table")
chair = Service.create!(name: "Baby chair")
play_area = Service.create!(name: "Playing area")
toys = Service.create!(name: "Toys")
public_spielplatz = Service.create!(name: "Public Playing area")

puts 'Creating 12 Places with Services...'

address = ["Goethestraße 56, 10625 Berlin", "Goßlerstraße 22, 12161 Berlin", "Arnulfstraße 98, 12105 Berlin",
"Bundesring 36, 12101 Berlin", "Tempelhofer Damm 64-78, 12101 Berlin", "Großbeerenstraße 63, 10963 Berlin",
"Lindenstraße 116, 10969 Berlin", "Friedrichstraße 71, 10117 Berlin", "Mohrenstraße 30, 10117 Berlin",
"Husemannstraße 35-17, 10435 Berlin", "Bernauer Str. 25, 13355 Berlin", "Palisadenstraße 36, 10243 Berlin"
]

index = 0
12.times do


  place = Place.new(name: Faker::Dessert.variety, address: address[index], comment: Faker::Marketing.buzzwords, user: User.last)
  if place.valid?
    place.save
  else
    puts "validation error for place #{place.name}"
    puts place.errors.full_messages
  end

  sleep(1.2) # for geocode API

  rand(2..5).times do
    place_service = PlaceService.new(place: place, service: Service.find(Service.first.id + rand(5)))
    if place_service.valid?
      place_service.save
    else
      puts "validation error for place_service #{place_service.place.name} - #{place_service.service.name}"
      puts place_service.errors.full_messages
    end

  end

  index += 1
end
