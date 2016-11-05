# Database design

## User

Field        | Type          | Notes
------------ | ------------- | ------------
id           | String        | login ID
password     | String        | password
permission   | Number        | permission
nickname     | String        | nickname
github       | String        | Github link
headimg      | String        | link of head portrait
email        | String        | E-mail

## Homework

Field           | Type          | Notes
--------------- | ------------- | ------------
userid          | String        | who hand in this HW
lecture         | Number        | HW of which lecture
file            | String        | path to the file
comment         | Object        | comment
comment.content | String        | comment's content
comment.author  | String        | who comment
