---
layout: post
status: draft
title: 'How do you migrate '
author:
  display_name: leogdion
  login: leogdion
  email: me@leogdion.name
  url: http://leogdion.name
author_login: leogdion
author_email: me@leogdion.name
author_url: http://leogdion.name
wordpress_id: 121
wordpress_url: http://leogdion.name/?p=121
date: '2012-09-08 10:38:29 -0400'
categories:
- Code
tags: []
comments: []
---
<p>setup database<br />
run sql script in database<br />
copy www directory<br />
add nginx entry<br />
update database parameters<br />
grant user to database</p>
<p>UPDATE wp_posts SET guid = replace(guid, 'http:&#47;&#47;dev.askabortionquestions.com','http:&#47;&#47;www.askabortionquestions.com');<br />
UPDATE wp_posts SET post_content = replace(post_content, 'http:&#47;&#47;dev.askabortionquestions.com','http:&#47;&#47;www.askabortionquestions.com');</p>
