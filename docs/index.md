---
layout: default
title: Documents New and Old
---

## Overview

+ Experience with [Brightspace Virtual Classroom](BVC/) during Corona Quarantine

## Blog Posts

{% for post in site.posts %}
+ {{ post.date | date_to_string }} &raquo; [ {{ post.title }} ]({{ post.url }})
> {{ post.excerpt }}
{% endfor %}
