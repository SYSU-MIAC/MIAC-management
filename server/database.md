# Database design

## User

Field        | Type          | Notes
------------ | ------------- | ------------
_id          | String        | id in datebase (auto generated)
username     | String        | login username [unique] * (id -> username)
password     | String        | password
permission   | Number        | permission
nickname     | String        | nickname
github       | String        | Github link
headimg      | String        | link of head portrait
email        | String        | E-mail
deleted      | Boolean       | is deleted
homeworks    | Array [oneHw] | Homeworks *
oneHw.hwId   | ObjectId      | Homework's id *
oneHw.subId  | ObjectId      | Latest submission's id *

## Comment (分为 Article Comment、Submission Comment 等 collection，但可以复用同一套逻辑)

Field        | Type             | Notes
------------ | ---------------- | ------------
_id          | String           | id in datebase (auto generated)
author       | String           | username of the author
content      | String           | Comment's content
date         | Date             | When the comment is made
isFeedback   | Boolean          | is feedback (only in collection ``Submission Comment``)
deleted      | Boolean          | is deleted

## Homework

Field        | Type             | Notes
------------ | ---------------- | ------------
_id          | String           | id in datebase (auto generated)
title        | String           | Homework's title
description  | String           | Homework's description (+)
begindate    | Date             | When the homework begins (nullable) (+)
enddate      | Date             | When the homework is due (nullable) (+)
comments     | Array [ObjectId] | ids of comments on the homework (+) (需要？)
deleted      | Boolean          | is deleted

## Article

Field          | Type              | Notes
-------------- | ----------------- | ------------
_id            | String            | id in datebase (auto generated)
title          | String            | title
content        | String            | content * (text -> content)
date           | Date              | date
userId         | String            | who posts this article * (userid -> userId)
username       | String            | show in front end (这个是发文章时可以设置的？)
comments       | Array [ObjectId]  | ids of comments on the homework (+)
deleted        | Boolean           | is deleted

## Submission

Field        | Type             | Notes
------------ | ---------------- | ------------
_id          | String           | id in datebase (auto generated)
hwId         | ObjectId         | Homework's id that the submission is belongs to
author       | String           | username of the author
date         | Date             | When the submission is submitted
comments     | Array [ObjectId] | ids of comments on the submission (by all)
feedbacks    | Array [ObjectId] | ids of feedbacks on the submission (by all)
deleted      | Boolean          | is deleted
