Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Defines the root path route ("/")
  # root "posts#index"

  # User Routes
  post "signup", to: "users#signup"
  post "login", to: "users#login"
  patch "user", to: "users#update"

  # Upload Routes
  post "upload", to: "uploads#create"
  get "upload", to: "uploads#get"
  delete "uploads/:id", to: "uploads#destroy"
  get "uploads/:id/download", to: "uploads#download"
  get "uploads/:id/publicdownload", to: "uploads#download_public"
  get "uploads/:id/make_public", to: "uploads#make_public"
  get "uploads/:id/make_private", to: "uploads#make_private"

end
