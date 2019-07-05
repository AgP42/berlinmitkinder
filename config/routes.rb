Rails.application.routes.draw do

  devise_for :users

  root to: 'places#index'

  resources :places

  resources :users, except: [:new, :create, :destroy]
end
