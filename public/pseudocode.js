/*
authenicate firebase login with google, then for user
    update some elements based on user attributes like name, photo, etc.
    get the watchlist (arr of identity references)
    for each identityreference in watchlist
        pull that identity from idetities
        update some elements based on identity attributes like name, photo, leetcode, linkedin, etc.

if a user is authenticated and the documentReference in /users/ matches auth.user, they can read from and write to it.
if a user is authenticated and the documentReference in /identities/ is contained in auth.user.watchlist, they read from it.

Not required:
if a user is authenticated and the documentReference in /identities/ is contained in auth.user.watchlist, then can call a Function to update it.

*/

