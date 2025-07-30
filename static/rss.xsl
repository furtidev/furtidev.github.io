<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="3.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:dc="http://purl.org/dc/elements/1.1/">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html xmlns="http://www.w3.org/1999/xhtml" lang="en">
      <head>
        <title>
          <xsl:value-of select="/rss/channel/title"/>'s Web Feed</title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"/>
        <style type="text/css">
          @font-face {
            font-family: 'Gidole'; src: local("Gidole Regular"), url('Gidole-Regular.woff2') format("woff2");
          }
          body { font-family: Gidole; background: #2d1e2f; color: #fcecd1; font-size: 23px; margin: 0px}
          a, a:visited {
            color: #a0ddd3;
          }
          nav {
            display: flex;
            flex-direction: row;
            align-items: center;
            gap: 1em;
            background: #392945; 
            padding: 10px; 
            color: #fbf1c7; 
            border-bottom: 2px solid #000;
          }

          .main {
            max-width: 75%;
            margin: auto;
          }
        </style>
      </head>
      <body>
        <nav>
          <img src="/rss-icon.png" width="64" height="64" />
          <p>
            Looking at my RSS feed? This is just a styled preview. You can subscribe to my feed for free by copy-pasting the current URL into your favorite RSS feed reader. Check <a href="https://aboutfeeds.com/" target="_blank">About Feeds</a> for more information.
          </p>
          <p>            <a>
              <xsl:attribute name="href">
                <xsl:value-of select="/rss/channel/link"/>
              </xsl:attribute>
              Back to site
            </a></p>
        </nav>
        <br/>
        <div class="main">
          <code>Feed URL: <xsl:value-of select="/rss/channel/link"/>/rss.xml</code>
        
          <h2>Recent Posts</h2>
          <xsl:for-each select="/rss/channel/item[position() &lt; 10]">
            <div>
              <h3>
                <a target="_blank">
                  <xsl:attribute name="href">
                    <xsl:value-of select="link"/>
                  </xsl:attribute>
                  <xsl:value-of select="title"/>
                </a>
              </h3>
              <small>
                Published: <xsl:value-of select="pubDate" />
              </small>
            </div>
          </xsl:for-each>
        </div>
        <br/>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
