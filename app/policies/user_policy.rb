class UserPolicy < ApplicationPolicy
  class Scope < Scope
    def resolve
      scope.all
    end
  end

  def edit?
    record.user == user || user.is_admin
  end

  def update?
    edit?
  end

end
