class UsersController < ApplicationController

  skip_after_action :verify_policy_scoped # => no pundit for index here, access managed by devise

  def index
    @user = current_user
  end

  def edit
    @user = current_user
    authorize @user
  end

  def update
    @user = current_user
    authorize @user
  end

end
