+++
title = "Using Zola to create my blog"
date = 2023-07-08
description = "An introduction to Zola and my experience so far."
draft = true
[taxonomies]
tags = ["tutorial"]
+++
My original plan for this blog site was to write my own backend in Go. But after stumbling upon a couple of static site generators, I realized there's a much better and more maintainable way to do this. I will be refererring to static site generators as SSGs from now on. 

## Static site generator? What?!
Static site generators are tools that generate static web pages (HTML, CSS, JS, no backend) from text files (Markdown, reStructuredText etc.). Say you have a bunch of markdown files as posts, a SSG will automatically compile that into a webpage. You can modify how the content is shown by writing your own templates and using custom css. See? No need for a backend, no need to manually update the HTML, just update your content, run the build command, and your site is ready, publish it wherever you want. This is how Hugo and Zola works, but some SSGs might take a different approach.

## [Hugo](https://gohugo.io/).. oh god
Now, you might be wondering what is Hugo doing in a blog about Zola, you see, Hugo was the my first choice. Mainly because it was very popular (67.9k stars on GitHub at the time of writing!). But it was extremely complex, at least to me. It has a lot of features, and overall it's a great choice for your static site. But it just wasn't for me, I wanted something simple so that I can get my site running as quickly as possible. In the future, I might give Hugo another try.

## [Zola](https://www.getzola.org) time!
I knew Zola existed, but never gave it a try. This was the perfect opportunity. Zola is written in Rust, and uses the Tera templating language which is very similar to Jinja2 so it was a breeze to work with. It's also very simple, it doesn't have that many built-in features (not as much as Hugo at least), so you can focus on what matters. Zola has an excellent [quickstart guide](https://www.getzola.org/documentation/getting-started/overview/) that walks you through the steps on how to create your own static site with real content. The documentation is easy to understand but I agree, it isn't as popular as Hugo and it's hard to find stuff online related to it. I wish it had a Discord server or something similar, but there's at least a Discourse forum. 

## 🎉 Zola tips for you!
After you've followed the [quickstart guide](https://www.getzola.org/documentation/getting-started/overview/), you should have an idea of how Zola operates. Now, you're probably interested in making your own site. I have some tips and knowledge for you below which will help you get started!

### Custom CSS on Zola
First of all, Zola uses [Sass](https://sass-lang.com/) for styling, which gets compiled to CSS when building. Now, I'll be honest, I feel comfortable writing CSS, so I just used a [CSS to Sass](https://css2sass.herokuapp.com/) converter online. You have to put the Sass file under the {{code(code="sass")}} folder on your project root and refer to it on your templates with: {{code(code="&lt;link rel=&quot;stylesheet&quot; href=&quot;{{ get_url(path='site.css', trailing_slash=false) | safe }}&quot;>")}}. If your file is under a subdirectory inside the {{code(code="sass")}} folder, the structure will be similar on the compiled static site too, so your css file path will for example be: {{code(code="home/site.css")}} (original: {{code(code="PROJECT_ROOT/sass/home/site.sass")}}) and that's the path you'll have to put on your template.

### Tags on Zola (Taxonomies)
I never heard of this term before until I started using SSGs. By using taxonomies you can group your content easily. My site has support for tags, which is actually a taxonomy. You'll have to define your taxonomies in the {{code(code="PROJECT_ROOT/config.toml")}} file.
I have this:
> config.toml
```toml
taxonomies = [
	{ name = "tags", feed = true},
]
```
Then, at your post's [frontmatter](https://www.getzola.org/documentation/content/section/#front-matter) (the TOML configuration enclosed in +++ at the top of your markdown files) you can put something like this:
> content/blog/example.md
```toml
+++
title =
date =
description =
[taxonomies]
tags = ["wow", "nice", "tags"]
+++
```
And then, in your template, you can easily access them like this (code from my template):
> templates/blogs.html
```jinja2
{% if page.taxonomies.tags %}
tags: 
{% for tag in page.taxonomies.tags %}
<a href='{{ get_taxonomy_url(kind="tags", name=tag) | safe }}'>{{ tag }}</a>
{% endfor %}
{% endif %} 
```
Now, you've probably already seen that my site has dedicated pages for the tags. How? Well, it's simple. Zola will look for the following files:
- {{code(code="PROJECT_ROOT/templates/$TAXONOMY_NAME/single.html")}}
- {{code(code="PROJECT_ROOT/templates/$TAXONOMY_NAME/list.html")}}

In my case, I have {{code(code="PROJECT_ROOT/templates/tags/single.html")}} & {{code(code="PROJECT_ROOT/templates/tags/list.html")}}. The **single.html** file contains template for posts that have a specific tag and **list.html** contains template for listing all tags. You can take a look at what variables are available on each page: [Taxonomies documentation](https://www.getzola.org/documentation/templates/taxonomies/). Here's my code:
> templates/tags/list.html
```jinja2
<h1>Tags</h1>

{% if terms %}
<ul>
	{% for term in terms %}
		<li><a href="{{ term.permalink | safe }}">{{ term.name }}</a></li>
	{%endfor%}
</ul>
{%endif%}
```
> templates/tags/single.html
```jinja2
<h1>{{term.name}}</h1>

{% for page in term.pages %}
<h2><a href="{{page.permalink | safe}}">{{page.title}}</a></h2>
<br>
{% endfor %}
```

### Date formatting
Have you seen how the publishing dates are nicely formatted in my site? How did I turn {{code(code="2023-07-08")}} to {{code(code="Jul 08, 2023")}}? Here's the secret formula:
```jinja2
{{ page.date | date(format="%b %d, %Y") }} 
```

## Conclusion
I enjoy using Zola a lot, there's a lot more for me to learn about it, and I'm still a beginner, so if I've made any mistakes or if you have any feedback, send me an email on: [furtidev@tuta.io](mailto:furtidev@tuta.io) or you can just comment below.
