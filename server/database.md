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
email        | String        | E-mail
deleted      | Boolean       | is deleted
homeworks    | Array [oneHw] | homeworks *
oneHw.hwId   | ObjectId      | homework's id *
oneHw.subId  | ObjectId      | latest submission's id *

## Comment

Field              | Type             | Notes
------------------ | ---------------- | ------------
_id                | String           | id in datebase (auto generated)
author             | ObjectId         | the author's id
content            | String           | comment's content
createdTime        | Date             | when the comment is created
updatedTime        | Date             | when the comment is updated
type               | String           | 'article', 'homework', 'submission'
ownerId            | ObjectId         | where the comment is made (hwId/articleId/subId)
details            | Object           | comment type-specific details
details.isFeedback | Boolean          | whether the comment is a feedback made by administrators
deleted            | Boolean          | is deleted

## Homework

Field        | Type             | Notes
------------ | ---------------- | ------------
_id          | String           | id in datebase (auto generated)
title        | String           | homework's title
description  | String           | homework's description (+)
beginTime    | Date             | when the homework begins (nullable) (+)
endTime      | Date             | when the homework is due (nullable) (+)
attachments  | Array [ObjectId] | ids of attachments
comments     | Array [ObjectId] | ids of comments on the homework (+) (需要？)
deleted      | Boolean          | is deleted

## Article

Field          | Type              | Notes
-------------- | ----------------- | ------------
_id            | String            | id in datebase (auto generated)
title          | String            | title
content        | String            | content * (text -> content)
createdTime    | Date              | when the article is created
updatedTime    | Date              | when the article is updated
author         | ObjectId          | who posts this article * (userid -> userId)
?username      | String            | show in front end (这个是发文章时可以设置的？)
comments       | Array [ObjectId]  | ids of comments on the homework (+)
deleted        | Boolean           | is deleted

## Submission

Field        | Type             | Notes
------------ | ---------------- | ------------
_id          | String           | id in datebase (auto generated)
hwId         | ObjectId         | homework's id that the submission is belongs to
author       | ObjectId         | the author's id
createdTime  | Date             | when the submission is created
updatedTime  | Date             | when the submission is updated
fileId       | ObjectId         | submission file id
comments     | Array [ObjectId] | ids of comments on the submission (by all)
feedbacks    | Array [ObjectId] | ids of feedbacks on the submission (by all)
deleted      | Boolean          | is deleted
