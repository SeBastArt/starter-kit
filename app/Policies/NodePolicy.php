<?php

namespace App\Policies;

use App\Helpers\RoleChecker;
use App\Node;
use App\User;
use Illuminate\Auth\Access\HandlesAuthorization;
use Illuminate\Auth\Access\Response;

class NodePolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any models.
     *
     * @param  \App\User  $user
     * @return mixed
     */
    public function viewAny(User $user)
    {
        return RoleChecker::check($user, 'ROLE_SUPPORT');
    }

    /**
     * Determine whether the user can view the model.
     *
     * @param  \App\User  $user
     * @param  \App\Node  $node
     * @return mixed
     */
    public function view(User $user, Node $node)
    {
        return RoleChecker::check($user, 'ROLE_SUPPORT') && $node->user_id = $user->id;
    }

    /**
     * Determine whether the user can create models.
     *
     * @param  \App\User  $user
     * @return mixed
     */
    public function create(User $user)
    {
        return (RoleChecker::check($user, 'ROLE_ADMIN'))
        ? Response::allow()
        : Response::deny('You are not allowed to create nodes.');
    }

    /**
     * Determine whether the user can update the model.
     *
     * @param  \App\User  $user
     * @param  \App\Node  $node
     * @return mixed
     */
    public function update(User $user, Node $node)
    {
        return RoleChecker::check($user, 'ROLE_SUPPORT') && $node->user_id = $user->id;
    }

    /**
     * Determine whether the user can delete the model.
     *
     * @param  \App\User  $user
     * @param  \App\Node  $node
     * @return \Illuminate\Auth\Access\Response
     */
    public function delete(User $user, Node $node)
    {
        return (RoleChecker::check($user, 'ROLE_ADMIN') && $node->user_id = $user->id)
            ? Response::allow()
            : Response::deny('You don\'t have permission for delte this node.');
    }

    /**
     * Determine whether the user can restore the model.
     *
     * @param  \App\User  $user
     * @param  \App\Node  $node
     * @return mixed
     */
    public function restore(User $user, Node $node)
    {
        return RoleChecker::check($user, 'ROLE_SUPPORT') && $node->user_id = $user->id ;
    }

    /**
     * Determine whether the user can permanently delete the model.
     *
     * @param  \App\User  $user
     * @param  \App\Node  $node
     * @return mixed
     */
    public function forceDelete(User $user, Node $node)
    {
        return $user->hasRole('ROLE_ADMIN');
    }
}
