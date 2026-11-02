# Problem of token based authentication

* Token authentication is pretty easy to implement, but it contains one problem. Once the API user, eg. a React app gets a token, the API has a blind trust to the token holder.

* What if the access rights of the token holder should be revoked?

