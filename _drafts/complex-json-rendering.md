---
layout: post
status: draft
title: Complex JSON rendering
author:
  display_name: leogdion
  login: leogdion
  email: me@leogdion.name
  url: http://leogdion.name
author_login: leogdion
author_email: me@leogdion.name
author_url: http://leogdion.name
wordpress_id: 262
wordpress_url: http://leogdion.name/?p=262
date: '2013-01-02 10:05:54 -0500'
categories:
- Code
tags: []
comments: []
---
<p>var comps = [];<br />
if (Object.prototype.toString.call( object ) === '[object Array]' &amp;&amp; object.length) {<br />
comps.push('[');<br />
for (var index = 0; index < object.length; index++) {<br />
comps.push(controller.prototype.stringify(object[index]));<br />
comps.push(", ");<br />
}<br />
comps[comps.length - 1] = ']';<br />
} else if (typeof(object) === 'object') {<br />
comps.push('{');<br />
for (var key in object) {<br />
if (object.hasOwnProperty(key) &amp;&amp; typeof(object[key]) !== 'undefined' &amp;&amp; object[key] !== null &amp;&amp; Object.prototype.toString.call(object[key]) !== '[object Function]') {<br />
comps.push("\"");<br />
comps.push(key);<br />
comps.push("\" : ");<br />
comps.push(controller.prototype.stringify(object[key]));<br />
comps.push(", ");<br />
}<br />
}<br />
comps[comps.length - 1] = '}';<br />
} else {<br />
return JSON.stringify(object);<br />
}<br />
return comps.join('');</p>
