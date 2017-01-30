# Database design

## User

Field        | Type          | Notes
------------ | ------------- | ------------
_id          | String        | id in datebase (auto generated)
id           | String        | login ID
password     | String        | password
permission   | Number        | permission
nickname     | String        | nickname
github       | String        | Github link
headimg      | String        | link of head portrait
email        | String        | E-mail
hw           | Array         | Homeworks
hw.title     | String        | Homework's title
hw.file      | String        | path to the file
hw.comment   | Object        | comments
hw.comment.text | String     | comment's content
hw.comment.author | String   | who comment
deleted      | Boolean       | is deleted

## Homework

Field        | Type          | Notes
------------ | ------------- | ------------
title        | String        | Homework's title [unique]
deleted      | Boolean       | is deleted

## Article

Field          | Type        | Notes
-------------- | ----------- | ------------
_id            | String      | id in datebase (auto generated)
title          | String      | title
text           | String      | content
date           | Date        | date
userid         | String      | who post this article
username       | String      | show in front end
deleted        | Boolean     | is deleted
