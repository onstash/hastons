---
title: "Improving Dunzo's search experience for a user"
description: "This is a post about how I think Dunzo's search UX can be improved upon"
publishedAt: "2019-08-18"
slug: "improving-dunzo-search-ux"
previous: "mental-health-perspective"
---

## Disclaimer -

I like Dunzo. I have used the app a few times and love the overall experience. I am not part of the Dunzo team. I’m sure they are working on improving the search experience on their app as I write this tiny post. This post doesn’t intend to put Dunzo or their team in a negative light.

## Introduction

I have a few suggestions for [Dunzo](https://www.dunzo.com)'s search UX. But before that, let me give a context of what [Dunzo](https://www.dunzo.com) is.

## What is Dunzo?

According to their about page -

_Living in the city, we never have enough time to do all the things we want to do._

_Dunzo can change the way you move things, how you shop and lets you access your city like never before. We’re an app that connects you to the nearest delivery partner who can make purchases, pick up items from any store or restaurant in the city and bring them to you._

_It’s never easy to make purchases or drop off packages when you get busy with work, get stuck in traffic, or you might even end up forgetting about it completely._

_All you need to do is,_
_Tell us where to go, what needs to be done and when._
_What happens next? Sit back, and let us worry about your task-at-hand._
_You could say that we are always on the move for you_

For the _fans of [Product Hunt](https://www.producthunt.com/)_, this is a variation of _Uber for X_.

For the _general public_, this is a service to _run errands_ for you.

## How is Dunzo's search UX, currently?

1. This is the home screen when you open the app

![Home screen](https://i.imgur.com/NDjoZse.jpg)

2. I searched for _milk_ - something that's _basic_ (see what I did there?)$

![Milk search](https://i.imgur.com/I411eA5.jpg)

3. Once I tapped on the _search_ button, I came across Dunzo verified stores with _milk_.

![Milk search results](https://i.imgur.com/4Qojj9p.jpg)

4. I tapped on the first result which is _Nilgiris_ and this is what I got -

![Nilgiris search result](https://i.imgur.com/GNOdHkL.jpg)

5. Let's assume that it didn't have what I wanted. So I decide to _hit the back button_ and check the other stores. Once I **hit the back button**, this is what I experience -

![Milk search results 2](https://i.imgur.com/CAchIAH.jpg?1)

The screen is displaying two things _differently_ -

- the search input box is empty (marked **1** in the image)
- my recent search is _Nilgiris_, which _was not the case_ because I had searched for _milk_ (marked **2** in the image)

Now I have to tap on the search box input **(1 tap)**, type _milk_, and hit the search button **(1 tap)** to get to the results screen _again_. It takes _at least_ **2 more taps** for a user to _get back_ to the search results. I believe this is **cumbersome for the user** and it _can be improved upon_ by _reducing the no. of taps_ it takes to get to the search results.

## My suggestions to improve Dunzo's search UX

**Suggestion #1** - **Retain** the **search term** _milk_ in the **search input box**

![Retain search term](https://i.imgur.com/XcOHJr1.jpg?1)

**Suggestion #2** - **Display** the **search results** with the **first entry - _Nilgiris_ - greyed out**

This is to denote that the user has already tapped on the _Nilgiris_ search result.

![Retain search results](https://i.imgur.com/cjbx7gd.png)

I was talking to a product manager about this post. He mentioned an interesting point. In an _e-commerce app_ (like Dunzo), displaying a search result that has been tapped on, using grey text colour, is not a standard UX pattern. That's because it gives an _impression_ to the _user_ that the entity is either _disabled_ or the _item_, that he or she is looking for, is _not available_ (in Dunzo's case). **Both** of those **impressions** are **not true**.

So this is **not a suggestion that'd work**.

**Suggestion #3** - **Display** the **search results** with the **first entry - _Nilgiris_ - removed**

![Retain search results](https://i.imgur.com/as2xeib.jpg?1)

I was talking a UI/UX designer friend about this post as well. He gave a suggestion that's slightly different than suggestion #3 - push _Nilgiris_ search result to the bottom so that -

- it is **not visible** to the user **in** the **immediate view**
- it is **not disabled** and **not filtered out**

So **suggestion \#3** is another one that'd **not** _entirely_ **work**.

**Suggestion #4** - **Display** the **search results** with the **first entry - _Nilgiris_ - pushed to the end of the list**

![Retain search results](https://i.imgur.com/as2xeib.jpg?1)

I believe suggestions **#1** & **#4** will **improve** the **overall search experience** for a Dunzo **user**.

##### $ - _milk_ contains _lactic acid_ which is not _basic_
